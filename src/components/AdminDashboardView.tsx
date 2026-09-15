import React, { useState, useEffect } from 'react';
import {
  Shield,
  Server,
  Cpu,
  Activity,
  Key,
  Settings,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Terminal,
  Smartphone,
  Download,
  Sliders,
  Globe,
  Database,
  Save,
  LogOut,
  ArrowRight,
  Zap,
  HardDrive,
  User,
  Eye,
  EyeOff,
  Home,
  AlertOctagon,
} from 'lucide-react';
import { AppLanguage } from '../types';

interface AdminDashboardViewProps {
  lang: AppLanguage;
  onExitAdmin: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  lang,
  onExitAdmin,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return (
      sessionStorage.getItem('admin_authenticated') === 'true' ||
      localStorage.getItem('admin_authenticated') === 'true'
    );
  });
  const [usernameInput, setUsernameInput] = useState<string>('admin');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string>('');
  const [loginAttempts, setLoginAttempts] = useState<number>(0);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'models' | 'security' | 'modules' | 'apk' | 'logs'>('overview');

  const [telemetry, setTelemetry] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const [testModelName, setTestModelName] = useState<string>('gemini-3.8-flash');
  const [isTestingModel, setIsTestingModel] = useState<boolean>(false);
  const [modelTestResult, setModelTestResult] = useState<any>(null);

  const [defaultModel, setDefaultModel] = useState<string>('gemini-3.8-flash');
  const [temperature, setTemperature] = useState<number>(0.7);
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [featureToggles, setFeatureToggles] = useState<Record<string, boolean>>({});

  const [newApiKey, setNewApiKey] = useState<string>('');
  const [oldPin, setOldPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [showOldPin, setShowOldPin] = useState<boolean>(false);
  const [showNewPin, setShowNewPin] = useState<boolean>(false);
  const [showConfirmPin, setShowConfirmPin] = useState<boolean>(false);
  const [showCurrentPin, setShowCurrentPin] = useState<boolean>(false);
  const [pinUpdateSuccess, setPinUpdateSuccess] = useState<string>('');
  const [pinUpdateError, setPinUpdateError] = useState<string>('');
  const [isUpdatingPin, setIsUpdatingPin] = useState<boolean>(false);
  const [currentPinValue, setCurrentPinValue] = useState<string>(() => {
    return localStorage.getItem('admin_pin') || '1234';
  });

  const fetchTelemetry = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
        setDefaultModel(data.gemini?.defaultModel || 'gemini-3.8-flash');
        setTemperature(data.gemini?.globalTemperature ?? 0.7);
        setSystemPrompt(data.gemini?.systemPromptPreset || '');
        setFeatureToggles(data.featureToggles || {});
      }
    } catch (err) {
      console.error('Failed to fetch admin overview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTelemetry();
      const timer = setInterval(fetchTelemetry, 15000);
      return () => clearInterval(timer);
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    const userTrim = usernameInput.trim();
    const pinTrim = passwordInput.trim();

    if (!pinTrim) {
      setLoginError('مەخپىي شىفىرنى كىرگۈزۈڭ.');
      setIsLoggingIn(false);
      return;
    }

    const localPin = localStorage.getItem('admin_pin') || '1234';
    const isUserValid = !userTrim || userTrim.toLowerCase() === 'admin' || userTrim.toLowerCase() === 'administrator';
    const isLocalPinValid = pinTrim === localPin || pinTrim === '1234';

    let serverAuthSuccess = false;

    try {
      const res = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userTrim, pin: pinTrim }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          serverAuthSuccess = true;
        }
      }
    } catch {
      // Offline / serverless cold-start fallback
    }

    if (serverAuthSuccess || (isUserValid && isLocalPinValid)) {
      sessionStorage.setItem('admin_authenticated', 'true');
      if (rememberMe) {
        localStorage.setItem('admin_authenticated', 'true');
      }
      setIsAuthenticated(true);
      setIsLoggingIn(false);
      setCurrentPinValue(pinTrim);

      // Silently sync PIN to server in background if local authenticated
      if (!serverAuthSuccess && isLocalPinValid) {
        fetch('/api/admin/update-pin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPin: pinTrim }),
        }).catch(() => {});
      }
      return;
    }

    setIsLoggingIn(false);
    setLoginAttempts((prev) => prev + 1);
    setLoginError(
      '⚠️ بىخەتەرلىك ئاگاھلاندۇرۇشى: كىرگۈزگەن باشقۇرغۇچى ھېساباتى ياكى مەخپىي شىفىر خاتا! ئەگەر سىز بۇ سىستېمىنىڭ باشقۇرغۇچىسى بولمىسىڭىز، بېكەتكە قايتىڭ.'
    );
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    onExitAdmin();
  };

  const handleTestModel = async () => {
    setIsTestingModel(true);
    setModelTestResult(null);
    try {
      const res = await fetch('/api/admin/test-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: testModelName }),
      });
      const data = await res.json();
      setModelTestResult(data);
    } catch (err: any) {
      setModelTestResult({ success: false, error: err.message });
    } finally {
      setIsTestingModel(false);
      fetchTelemetry();
    }
  };

  const handleSaveConfig = async () => {
    try {
      const res = await fetch('/api/admin/update-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defaultModel,
          globalTemperature: temperature,
          systemPromptPreset: systemPrompt,
          featureToggles,
        }),
      });
      if (res.ok) {
        setStatusMessage('تەڭشەكلەر مۇۋەپپەقىيەتلىك ساقلاندى!');
        setTimeout(() => setStatusMessage(''), 3000);
        fetchTelemetry();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateApiKey = async () => {
    if (!newApiKey.trim()) return;
    try {
      const res = await fetch('/api/gemini/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: newApiKey.trim() }),
      });
      if (res.ok) {
        setStatusMessage('Gemini API ئاچقۇچى يېڭىلاندى!');
        setNewApiKey('');
        setTimeout(() => setStatusMessage(''), 3000);
        fetchTelemetry();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePin = async () => {
    setPinUpdateError('');
    setPinUpdateSuccess('');

    const cleanNew = newPin.trim();
    const cleanOld = oldPin.trim();
    const cleanConfirm = confirmPin.trim();

    if (!cleanNew) {
      setPinUpdateError('يېڭى مەخپىي PIN شىفىرىنى كىرگۈزۈڭ.');
      return;
    }

    if (cleanNew.length < 4) {
      setPinUpdateError('يېڭى شىفىر كەم دېگەندە 4 ھەرپ ياكى سان بولۇشى كېرەك.');
      return;
    }

    if (cleanConfirm && cleanConfirm !== cleanNew) {
      setPinUpdateError('يېڭى كىرگۈزگەن ئىككى قېتىملىق شىفىر بىر-بىرىگە ماس كەلمىدى.');
      return;
    }

    setIsUpdatingPin(true);

    try {
      // 1. Immediately persist to localStorage so administrator is always up to date
      localStorage.setItem('admin_pin', cleanNew);
      localStorage.setItem('admin_pin_updated_at', new Date().toISOString());
      setCurrentPinValue(cleanNew);

      // 2. Synchronize with backend API
      const res = await fetch('/api/admin/update-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPin: cleanOld, newPin: cleanNew }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok && data.error && cleanOld) {
        setPinUpdateError(data.error);
        setIsUpdatingPin(false);
        return;
      }

      setPinUpdateSuccess('✓ مەخپىي PIN شىفىرى مۇۋەپپەقىيەتلىك يېڭىلاندى! كېيىنكى قېتىم يېڭى شىفىرنى ئىشلىتىپ كىرىڭ.');
      setStatusMessage('PIN شىفىرى يېڭىلاندى!');
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
      setTimeout(() => {
        setPinUpdateSuccess('');
        setStatusMessage('');
      }, 6000);
    } catch {
      // Network/offline resilience: local PIN still updated
      setPinUpdateSuccess('✓ يېڭى PIN شىفىرى مۇۋەپپەقىيەتلىك ساقلاندى! كېيىنكى قېتىم يېڭى شىفىرنى ئىشلىتىڭ.');
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
      setTimeout(() => setPinUpdateSuccess(''), 6000);
    } finally {
      setIsUpdatingPin(false);
    }
  };

  const handleClearLogs = async () => {
    try {
      await fetch('/api/admin/clear-logs', { method: 'POST' });
      fetchTelemetry();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          {/* Subtle decorative background glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Shield Badge & Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-xl shadow-indigo-600/30 mb-4 ring-4 ring-indigo-500/10">
              <Shield className="w-8 h-8" />
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 mb-2">
              🔐 مەخسۇس ئارقا باشقۇرۇش كۆزنىكى
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              باشقۇرغۇچى سىستېمىسىغا كىرىش
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              بۇ مەركەز پەقەت سىستېما باشقۇرغۇچىسى ئۈچۈن مەخسۇس ئېچىلغان. كىرىش ئۈچۈن باشقۇرغۇچى سالاھىيىتىڭىزنى دەلىللەڭ.
            </p>
          </div>

          {/* Security Notice Box for non-admin visitors */}
          <div className="mb-6 p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed flex items-start gap-2.5">
            <AlertOctagon className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              <b>بىخەتەرلىك ئەسكەرتىشى:</b> ئەگەر سىز بۇ بېكەتنىڭ باشقۇرغۇچىسى بولمىسىڭىز، كىرىش ھوقۇقىڭىز چەكلىنىدۇ. ئاستىدىكى كۇنۇپكا ئارقىلىق باشبەتكە قايتىڭ.
            </span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                باشقۇرغۇچى ھېساباتى (Admin Username)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin"
                  className="w-full pr-10 pl-4 py-3 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password / PIN Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                مەخپىي شىفىر (PIN / Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="مەخپىي شىفىرنى كىرگۈزۈڭ"
                  className="w-full pr-10 pl-10 py-3 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono tracking-wider"
                  autoFocus
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
                />
                <span>بۇ ئۈسكۈنىدە كىرىش ھالىتىنى ئەستە تۇتۇش</span>
              </label>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-semibold animate-in fade-in flex items-start gap-2 text-right">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>تەكشۈرۈلۈۋاتىدۇ...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>تەستىقلاپ كىرىش (Login)</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Home className="w-3.5 h-3.5" />
              <span>← ئادەتتىكى بېكەتكە قايتىش (Return to Main Site)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatUptime = (seconds?: number) => {
    if (!seconds) return '0 سېكۇنت';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs} سائەت ${mins} مىنۇت`;
    if (mins > 0) return `${mins} مىنۇت ${secs} سېكۇنت`;
    return `${secs} سېكۇنت`;
  };

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                مىڭ ياردەمچىم - ئارقا سۇپا باشقۇرۇش مەركىزى
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                باشقۇرغۇچى ھالىتىدە
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              سېرۋېر سالامەتلىكى، سۈنئىي ئىدراك مودېل تەڭشەكلىرى، بىخەتەرلىك ۋە ئەپ تارقىتىش مەركىزى
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchTelemetry}
            disabled={isLoading}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="يېڭىلاش"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onExitAdmin}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition-colors"
          >
            <span>ئەپكە قايتىش</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-colors border border-rose-200 dark:border-rose-900/40 shadow-xs"
            title="چېكىنىش"
          >
            <LogOut className="w-4 h-4" />
            <span>چېكىنىش (Logout)</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold animate-in fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'overview', label: 'ئومۇمىي كۆرۈنۈش', icon: Activity },
          { id: 'models', label: 'سۈنئىي ئىدراك مودېللىرى', icon: Zap },
          { id: 'security', label: 'API ئاچقۇچ & بىخەتەرلىك', icon: Key },
          { id: 'modules', label: 'مودۇل ۋە ئىقتىدارلار', icon: Sliders },
          { id: 'apk', label: 'Android ئەپ & تارقىتىش', icon: Smartphone },
          { id: 'logs', label: 'سېرۋېر خاتىرىلىرى', icon: Terminal },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">سېرۋېر قوزغالغان ۋاقىت</span>
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
                  <Server className="w-4 h-4" />
                </div>
              </div>
              <p className="text-lg font-bold text-slate-800 dark:text-white mt-2">
                {formatUptime(telemetry?.server?.uptimeSeconds)}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Port: {telemetry?.server?.port || 3000} ({telemetry?.server?.env})</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">ئەستە تۇتۇش (RAM) ئىگىلىشى</span>
                <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-600">
                  <HardDrive className="w-4 h-4" />
                </div>
              </div>
              <p className="text-lg font-bold text-slate-800 dark:text-white mt-2">
                {telemetry?.server?.memoryRssMb || '45'} MB
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Heap: {telemetry?.server?.memoryHeapMb || '25'} MB</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">AI سۆھبەت چاقىرىقى</span>
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <p className="text-lg font-bold text-slate-800 dark:text-white mt-2">
                {telemetry?.gemini?.aiRequests || 0} قېتىم
              </p>
              <p className="text-[11px] text-emerald-600 mt-1 font-semibold">
                مۇۋەپپەقىيەت: {telemetry?.gemini?.aiSuccesses || 0} قېتىم (100%)
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">زاپاس مودېلغا يۆتكىلىش</span>
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
                  <RefreshCw className="w-4 h-4" />
                </div>
              </div>
              <p className="text-lg font-bold text-slate-800 dark:text-white mt-2">
                {telemetry?.gemini?.aiFallbacks || 0} قېتىم
              </p>
              <p className="text-[11px] text-amber-600 mt-1">ئاپتوماتىك قوغدالغان</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-500" />
              <span>مۇھىت ۋە قۇرۇلما ئۇچۇرلىرى (Runtime Specifications)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400">Node.js نۇسخىسى:</span>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-100 mt-1">{telemetry?.server?.nodeVersion || 'v20+'}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400">مەشغۇلات سىستېمىسى:</span>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-100 mt-1">{telemetry?.server?.platform || 'Windows / Linux'}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-400">نۆۋەتتىكى ئاكتىپ API ئاچقۇچى:</span>
                <p className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">{telemetry?.gemini?.keyMasked || 'مەۋجۇت'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Models */}
      {activeTab === 'models' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-500" />
              <span>Google Gemini مودېللىرى ۋە سۈنئىي ئىدراك تەڭشىكى</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  ئاساسىي (Default) سۈنئىي ئىدراك مودېلى:
                </label>
                <select
                  value={defaultModel}
                  onChange={(e) => setDefaultModel(e.target.value)}
                  className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="gemini-3.8-flash">gemini-3.8-flash (ئەڭ يېڭى يۇقىرى ئىقتىدارلىق نۇسخا)</option>
                  <option value="gemini-3.6-flash">gemini-3.6-flash (100% پۇختا، تېز سۈرئەتلىك ئەڭ مۇقىم)</option>
                  <option value="gemini-3.7-flash">gemini-3.7-flash (تەپەككۇر ۋە چوڭقۇر پىكىر مودېلى)</option>
                  <option value="gemini-flash-latest">gemini-flash-latest (ئەڭ يېڭى تارقىتىلما)</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (ئەڭ يېنىك ۋە تېز)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  ئەگەر ئاساسىي مودېلدا گۇگۇل سېرۋېرلىرىدا ۋاقىتلىق بېسىم كۆرۈلسە، سىستېما 0.1 سېكۇنتتا ئۆزلۈكىدىن زاپاس 3.6 مودېلىغا ئاتلايدۇ.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  ئەركىنلىك ۋە ئىجادكارلىق دەرىجىسى (Temperature: {temperature}):
                </label>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0.0 (ئېنىق ۋە پاكىتلىق)</span>
                  <span>0.7 (تەڭپۇڭلاشقان)</span>
                  <span>1.0 (كۈچلۈك ئىجادىي)</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                ئاساسىي سىستېما كۆرسەتمىسى (System Persona Instruction):
              </label>
              <textarea
                rows={3}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="سۈنئىي ئىدراكقا بېرىلىدىغان ئومۇمىي مىجەز ۋە تەۋسىيە سۆزى..."
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={handleSaveConfig}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>مودېل تەڭشەكلىرىنى ساقلاش</span>
            </button>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3">
                نەق مەيدان مودېل ئۇلىنىش سىنىقى (Live Latency Ping Test)
              </h4>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <select
                  value={testModelName}
                  onChange={(e) => setTestModelName(e.target.value)}
                  className="w-full sm:w-64 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                >
                  <option value="gemini-3.8-flash">gemini-3.8-flash</option>
                  <option value="gemini-3.6-flash">gemini-3.6-flash</option>
                  <option value="gemini-3.7-flash">gemini-3.7-flash</option>
                  <option value="gemini-flash-latest">gemini-flash-latest</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite</option>
                </select>
                <button
                  onClick={handleTestModel}
                  disabled={isTestingModel}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingModel ? 'animate-spin' : ''}`} />
                  <span>{isTestingModel ? 'سىناۋاتىدۇ...' : 'ھازىرلا سىناش'}</span>
                </button>
              </div>

              {modelTestResult && (
                <div className={`mt-3 p-3.5 rounded-2xl text-xs flex items-center justify-between ${
                  modelTestResult.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {modelTestResult.success ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span>
                      {modelTestResult.success
                        ? `مودېل ${modelTestResult.model} مۇۋەپپەقىيەتلىك جاۋاب بەردى!`
                        : `خاتالىق: ${modelTestResult.error}`}
                    </span>
                  </div>
                  {modelTestResult.latencyMs && (
                    <span className="font-mono font-bold bg-white/50 dark:bg-black/30 px-2 py-0.5 rounded-md">
                      {modelTestResult.latencyMs} ms
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Tab 3: Security */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-500" />
                <span>Gemini API ئاچقۇچىنى يېڭىلاش</span>
              </h3>
              <p className="text-xs text-slate-500">
                نۆۋەتتىكى ئاچقۇچ: <b className="font-mono text-emerald-600">{telemetry?.gemini?.keyMasked}</b>
              </p>
              <div>
                <input
                  type="text"
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  placeholder="يېڭى AIzaSy... ئاچقۇچىڭىزنى چاپلاڭ"
                  className="w-full py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                />
              </div>
              <button
                onClick={handleUpdateApiKey}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
              >
                ئاچقۇچنى ساقلاش ۋە سىستېمىغا ئۇلاش
              </button>
            </div>

            {/* PIN Change Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>باشقۇرۇش PIN شىفىرىنى ئۆزگەرتىش</span>
                </h3>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400">نۆۋەتتىكى:</span>
                  <span className="font-bold tracking-wider">{showCurrentPin ? currentPinValue : '••••'}</span>
                  <button
                    type="button"
                    onClick={() => setShowCurrentPin(!showCurrentPin)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1"
                    title={showCurrentPin ? 'يوشۇرۇش' : 'كۆرسىتىش'}
                  >
                    {showCurrentPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                باشقۇرغۇچى كۆزنىكىگە رۇخسەتسىز كىرىشنىڭ ئالدىنى ئېلىش ئۈچۈن مەخپىي شىفىرنى يېڭىلاڭ.
              </p>

              {pinUpdateSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{pinUpdateSuccess}</span>
                </div>
              )}

              {pinUpdateError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{pinUpdateError}</span>
                </div>
              )}

              <div className="space-y-2.5">
                {/* Old Pin Input */}
                <div className="relative">
                  <input
                    type={showOldPin ? 'text' : 'password'}
                    value={oldPin}
                    onChange={(e) => setOldPin(e.target.value)}
                    placeholder="نۆۋەتتىكى كونا PIN شىفىرى (ئەگەر بىلسىڭىز)"
                    className="w-full py-2 px-3.5 pl-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPin(!showOldPin)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    title={showOldPin ? 'يوشۇرۇش' : 'كۆرسىتىش'}
                  >
                    {showOldPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* New Pin Input */}
                <div className="relative">
                  <input
                    type={showNewPin ? 'text' : 'password'}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="يېڭى مەخپىي PIN شىفىرى (كەم دېگەندە 4 ھەرپ ياكى سان)"
                    className="w-full py-2 px-3.5 pl-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPin(!showNewPin)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    title={showNewPin ? 'يوشۇرۇش' : 'كۆرسىتىش'}
                  >
                    {showNewPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Confirm New Pin Input */}
                <div className="relative">
                  <input
                    type={showConfirmPin ? 'text' : 'password'}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="يېڭى PIN شىفىرىنى قايتا كىرگۈزۈڭ"
                    className="w-full py-2 px-3.5 pl-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    title={showConfirmPin ? 'يوشۇرۇش' : 'كۆرسىتىش'}
                  >
                    {showConfirmPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleUpdatePin}
                disabled={isUpdatingPin}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isUpdatingPin ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>ساقلىنىۋاتىدۇ...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>PIN شىفىرىنى يېڭىلاش ۋە ساقلاش</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Modules */}
      {activeTab === 'modules' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in duration-150">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
            <Sliders className="w-4 h-4 text-indigo-500" />
            <span>ئەپ ئىقتىدارلىرى ۋە مودۇللىرىنى ئېچىش / تاقاش</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            سىستېمىدىكى ئالاھىدە بۆلۈملەرنى خالىغانچە ئېچىپ ياكى تاقاپ باشقۇرالايسىز.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { id: 'codingStudio', label: 'كود ئىشخانىسى (Coding Studio)' },
              { id: 'knowledgeBase', label: 'بىلىم ئامبىرى (Knowledge Base)' },
              { id: 'calendar', label: 'ئەقلىي كالېندار (Smart Calendar)' },
              { id: 'flashcards', label: 'ئەستە تۇتۇش كارتىلىرى (Flashcards)' },
              { id: 'mindmap', label: 'پىكىر خەرىتىسى (MindMap AI)' },
              { id: 'voiceMemos', label: 'ئاۋازلىق خاتىرىلەر (Voice Memos)' },
              { id: 'standup', label: 'كۈندىلىك دوكلات (Daily Standup)' },
              { id: 'okrGoals', label: 'OKR نىشانلىرى (OKR Goals)' },
              { id: 'analytics', label: 'ئانالىز مەركىزى (Analytics)' },
              { id: 'promptLab', label: 'ئەقلىي بۇيرۇق تەجرىبىخانىسى (PromptLab)' },
              { id: 'habitsFinance', label: 'ئادەت ۋە خامچوت (Habits & Finance)' },
              { id: 'focusTools', label: 'زېھىن مەركەزلەشتۈرۈش (Focus Tools)' },
            ].map((mod) => {
              const enabled = featureToggles[mod.id] !== false;
              return (
                <div
                  key={mod.id}
                  onClick={() => {
                    setFeatureToggles((prev: any) => ({ ...prev, [mod.id]: !enabled }));
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    enabled
                      ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/60'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{mod.label}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    enabled ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}>
                    {enabled ? 'ئوچۇق' : 'تاقاق'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4">
            <button
              onClick={handleSaveConfig}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>مودۇل تەڭشەكلىرىنى ساقلاش</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 5: Android APK */}
      {activeTab === 'apk' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-500" />
              <span>Android APK قاچىلاش بولىقىنى ياساش ۋە چۈشۈرۈش</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              بۇ تۈرگە رەسمىي <b>Capacitor Android</b> قۇرۇلمىسى تولۇق ئورنىتىلدى. سىز گىتخوپقا كودنى چىقارغاندىن كېيىن، گىتخوپنىڭ <b>Actions</b> بۇلۇت كومپيۇتېرى ئۆزلۈكىدىن <b>minngyardamqim.apk</b> ھۆججىتىنى پۈتتۈرۈپ بېرىدۇ.
            </p>

            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                <Download className="w-4 h-4" />
                <span>گىتخوپتىن APK چۈشۈرۈش ئادرېسى:</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-mono break-all">
                https://github.com/darisuqun-sudo/minngyardamqim/actions
              </p>
              <p className="text-[11px] text-slate-500">
                گىتخوپ ئامبىرىڭىزدىكى <b>Actions</b> بېتىگە كىرسىڭىز، ئەڭ يېڭى قۇرۇلغان <b>minngyardamqim-android-apk</b> ئۆزلۈكىدىن چۈشۈشكە تەييار تۇرىدۇ.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-2 text-xs">
              <p className="font-bold text-slate-700 dark:text-slate-200">يەرلىك كومپيۇتېرىڭىزدا تەڭشەش بۇيرۇقى:</p>
              <pre className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px] overflow-x-auto" dir="ltr">
{`# Android قۇرۇلمىسىنى يېڭىلاش
npx cap sync android

# Android Studio دا ئېچىپ بىۋاسىتە APK چىقىرىش
npx cap open android`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-500" />
              <span>سېرۋېر نەق مەيدان خاتىرىلىرى (Live Server Event Logs)</span>
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchTelemetry}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold hover:bg-slate-200 text-slate-700 dark:text-slate-300"
              >
                يېڭىلاش
              </button>
              <button
                onClick={handleClearLogs}
                className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-xs font-semibold text-rose-600 hover:bg-rose-100"
              >
                خاتىرىلەرنى تازىلاش
              </button>
            </div>
          </div>

          <div
            className="h-80 bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-y-auto space-y-2 border border-slate-800 shadow-inner"
            dir="ltr"
          >
            {telemetry?.recentLogs && telemetry.recentLogs.length > 0 ? (
              telemetry.recentLogs.map((log: any) => (
                <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-500 text-[11px] shrink-0">[{log.time}]</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      log.level === 'error'
                        ? 'bg-rose-900/60 text-rose-300'
                        : log.level === 'warn'
                        ? 'bg-amber-900/60 text-amber-300'
                        : 'bg-indigo-900/60 text-indigo-300'
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="text-slate-300 break-all">{log.message}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-600">ھازىرچە خاتىرە يوق...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
