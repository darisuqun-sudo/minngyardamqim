import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Layout,
  Bot,
  Calendar,
  BookOpen,
  FolderGit2,
  Flame,
  CheckSquare,
  Timer,
  Settings,
  Moon,
  Sun,
  Globe,
  Menu,
  X,
  Mic,
  ChevronDown,
  Check,
  Search,
  BrainCircuit,
  Network,
  ClipboardList,
  Terminal,
  TrendingUp,
  FileDown,
  Target,
  FileAudio,
  Code2,
  Languages,
  ScrollText,
  Heart,
  Cloud,
  Palette,
} from 'lucide-react';
import { AppLanguage, NavTab, ThemeMode } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface NavbarProps {
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenVoiceModal: () => void;
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  themeMode,
  setThemeMode,
  activeTab,
  setActiveTab,
  onOpenVoiceModal,
  onOpenCommandPalette,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRTL = lang === 'ug' || lang === 'ar';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: NavTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: t.hub, icon: Sparkles },
    { id: 'codingStudio', label: t.codingStudio || 'Coding Studio', icon: Code2 },
    { id: 'imageStudio', label: t.imageStudio || 'AI Image Studio', icon: Palette },
    { id: 'languageTutor', label: t.languageTutor || 'Language Tutor', icon: Languages },
    { id: 'contractBuilder', label: t.contractBuilder || 'Contracts & Docs', icon: ScrollText },
    { id: 'mindfulness', label: t.mindfulness || 'Mindfulness', icon: Heart },
    { id: 'cloudSync', label: t.cloudSync || 'Cloud Sync', icon: Cloud },
    { id: 'projects', label: t.projects, icon: FolderGit2 },
    { id: 'voicememos', label: t.voiceMemos || 'Voice Memos', icon: Mic },
    { id: 'analytics', label: t.analytics || 'Analytics', icon: TrendingUp },
    { id: 'docExporter', label: t.docExporter || 'Exporter', icon: FileDown },
    { id: 'webReader', label: t.webReader || 'Web Reader', icon: Globe },
    { id: 'okrGoals', label: t.okrGoals || 'OKRs', icon: Target },
    { id: 'blueprint', label: t.blueprint, icon: Layout },
    { id: 'assistant', label: t.assistant, icon: Bot },
    { id: 'calendar', label: t.calendar, icon: Calendar },
    { id: 'knowledge', label: t.knowledge, icon: BookOpen },
    { id: 'flashcards', label: t.flashcards, icon: BrainCircuit },
    { id: 'mindmap', label: t.mindmap, icon: Network },
    { id: 'standup', label: t.standup, icon: ClipboardList },
    { id: 'promptlab', label: t.promptlab, icon: Terminal },
    { id: 'financeAndHabits', label: t.financeAndHabits, icon: Flame },
    { id: 'productivity', label: t.tasksAndNotes, icon: CheckSquare },
    { id: 'focus', label: t.focusAndTools, icon: Timer },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  const languages: { code: AppLanguage; label: string; nativeName: string; flag: string }[] = [
    { code: 'ug', label: 'ئۇيغۇرچە', nativeName: 'Uyghur', flag: '🌙' },
    { code: 'tr', label: 'Türkçe', nativeName: 'Turkish', flag: '🇹🇷' },
    { code: 'ar', label: 'العربية', nativeName: 'Arabic', flag: '🇸🇦' },
    { code: 'en', label: 'English', nativeName: 'English', flag: '🌐' },
  ];

  const themeOptions: { id: ThemeMode; label: string; icon: any }[] = [
    { id: 'light', label: t.themeLight, icon: Sun },
    { id: 'dark', label: t.themeDark, icon: Moon },
    { id: 'midnight', label: t.themeMidnight, icon: Moon },
    { id: 'oled', label: t.themeOled, icon: Moon },
    { id: 'sepia', label: t.themeSepia, icon: Sun },
  ];

  const currentLangObj = languages.find((l) => l.code === lang) || languages[0];

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-50 w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  {t.appName}
                </h1>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links (Scrollable if many tabs) */}
          <nav className="hidden xl:flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/60 overflow-x-auto max-w-[620px]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons: Search/Command Palette + Voice AI + Language + Theme + Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Command Palette Trigger Button */}
            {onOpenCommandPalette && (
              <button
                id="command-palette-trigger-btn"
                onClick={onOpenCommandPalette}
                title="Command Center (Ctrl+K)"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden md:inline text-[11px]">
                  {lang === 'ug' ? 'ئىزدەش' : 'Search'}
                </span>
                <kbd className="hidden lg:inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-500 border border-slate-300 dark:border-slate-700">
                  Ctrl K
                </kbd>
              </button>
            )}

            {/* Language Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                id="lang-selector-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
                title={t.switchLang}
              >
                <span>{currentLangObj.flag}</span>
                <span className="hidden sm:inline">{currentLangObj.label}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div
                  className={`absolute mt-2 w-44 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1.5 z-50 animate-in fade-in-50 zoom-in-95 ${
                    isRTL ? 'left-0' : 'right-0'
                  }`}
                >
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${
                        lang === l.code
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <div>
                          <p>{l.label}</p>
                          <p className="text-[10px] text-slate-400">{l.nativeName}</p>
                        </div>
                      </div>
                      {lang === l.code && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Mode Selector Dropdown */}
            <div className="relative" ref={themeRef}>
              <button
                id="theme-toggle-btn"
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
                title={t.themeToggle}
              >
                {themeMode === 'light' || themeMode === 'sepia' ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-400" />
                )}
              </button>

              {themeDropdownOpen && (
                <div
                  className={`absolute mt-2 w-48 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1.5 z-50 animate-in fade-in-50 zoom-in-95 ${
                    isRTL ? 'left-0' : 'right-0'
                  }`}
                >
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setThemeMode(opt.id);
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                        themeMode === opt.id
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {themeMode === opt.id && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile / Tablet Menu Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
