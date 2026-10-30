import React, { useRef, useState } from 'react';
import {
  Settings,
  Moon,
  Sun,
  ShieldCheck,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Database,
  Cloud,
  CheckCircle2,
  Volume2,
  Globe,
  Sliders,
} from 'lucide-react';
import { AppLanguage, ThemeMode } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface SettingsSyncViewProps {
  lang: AppLanguage;
  onSelectLang: (lang: AppLanguage) => void;
  themeMode: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
  onExportAllData: () => void;
  onImportAllData: (jsonData: any) => void;
  onResetDefaults: () => void;
}

export const SettingsSyncView: React.FC<SettingsSyncViewProps> = ({
  lang,
  onSelectLang,
  themeMode,
  onSelectTheme,
  onExportAllData,
  onImportAllData,
  onResetDefaults,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid JSON structure');
        }
        onImportAllData(parsed);
        setImportError(null);
        setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 3000);
      } catch (err) {
        console.error('Invalid JSON backup file:', err);
        setImportError(
          lang === 'ug'
            ? 'ئىناۋەتسىز JSON زاپاس ھۆججىتى. توغرا فورماتتىكى ھۆججەتنى تاللاڭ.'
            : 'Invalid JSON backup file. Please select a valid backup export.'
        );
        setTimeout(() => setImportError(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  const themes: { id: ThemeMode; label: string; desc: string; bg: string }[] = [
    {
      id: 'light',
      label: t.themeLight,
      desc: 'Clean, high-contrast daytime interface',
      bg: 'bg-white border-slate-200 text-slate-900',
    },
    {
      id: 'dark',
      label: t.themeDark,
      desc: 'Balanced slate dark mode for evening work',
      bg: 'bg-slate-900 border-slate-700 text-slate-100',
    },
    {
      id: 'midnight',
      label: t.themeMidnight,
      desc: 'Deep indigo & slate palette with high contrast',
      bg: 'bg-[#0b0f19] border-indigo-900 text-indigo-100',
    },
    {
      id: 'oled',
      label: t.themeOled,
      desc: 'Pitch black #000000 saving battery on OLED screens',
      bg: 'bg-black border-neutral-800 text-white',
    },
    {
      id: 'sepia',
      label: t.themeSepia,
      desc: 'Warm paper amber mode to prevent eye fatigue',
      bg: 'bg-[#f7f1e5] border-[#d8cbb8] text-[#382c20]',
    },
  ];

  return (
    <div id="settings-sync-container" className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t.dataSettingsTitle}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.dataSettingsDesc}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-4 h-4" />
          <span>{t.activeAndSecure}</span>
        </div>
      </div>

      {/* Theme Modes Selector */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="space-y-1">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-500" />
            <span>{t.themeToggle} & Visual Atmospheres</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select your preferred night mode or daytime contrast setting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {themes.map((th) => {
            const isSelected = themeMode === th.id;
            return (
              <button
                key={th.id}
                onClick={() => onSelectTheme(th.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${th.bg} ${
                  isSelected
                    ? 'ring-2 ring-indigo-500 scale-[1.02] shadow-md'
                    : 'opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{th.label}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </div>
                <p className="text-[11px] opacity-75 mt-1 leading-snug">{th.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Language Selection */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="space-y-1">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            <span>{t.switchLang}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Native multilingual UI with automatic RTL (Right-to-Left) typography alignment.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            { id: 'ug' as AppLanguage, name: 'ئۇيغۇرچە (Uyghur)', dir: 'RTL' },
            { id: 'tr' as AppLanguage, name: 'Türkçe (Turkish)', dir: 'LTR' },
            { id: 'ar' as AppLanguage, name: 'العربية (Arabic)', dir: 'RTL' },
            { id: 'en' as AppLanguage, name: 'English', dir: 'LTR' },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => onSelectLang(l.id)}
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                lang === l.id
                  ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <span className="text-xs block">{l.name}</span>
              <span className="text-[9px] opacity-70 uppercase font-mono">{l.dir}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Data Backup, Export & Restore */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="space-y-1">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-500" />
            <span>Full Data Sovereign Backup & Restore</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export every single task, note, calendar event, document, habit, and project as a standalone JSON file.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onExportAllData}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportFullBackup}</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all border border-slate-200 dark:border-slate-700"
          >
            <Upload className="w-4 h-4" />
            <span>{t.importBackup}</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          {confirmReset ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setConfirmReset(false);
                  onResetDefaults();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>{lang === 'ug' ? 'جەزملەشتۈرۈش (Reset)' : 'Confirm Reset'}</span>
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>{lang === 'ug' ? 'بىكار قىلىش' : 'Cancel'}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.resetSampleData}</span>
            </button>
          )}
        </div>

        {importSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{lang === 'ug' ? 'بارلىق سانلىق مەلۇماتلار مۇۋەپپەقىيەتلىك ئەسلىگە كەلتۈرۈلدى!' : 'All data successfully imported and synced!'}</span>
          </div>
        )}

        {importError && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-semibold flex items-center gap-2 animate-in fade-in">
            <span>{importError}</span>
          </div>
        )}
      </div>
    </div>
  );
};
