import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  CheckSquare,
  FolderGit2,
  Menu,
  X,
  Mic,
  Calendar,
  Code2,
  BookOpen,
  BrainCircuit,
  Network,
  ClipboardList,
  Target,
  TrendingUp,
  FileDown,
  Globe,
  Terminal,
  Flame,
  Timer,
  Settings,
  Download,
  Moon,
  Sun,
  Laptop,
  Shield
} from 'lucide-react';
import { AppLanguage, NavTab, ThemeMode } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface MobileBottomNavProps {
  lang: AppLanguage;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenVoiceModal: () => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  setLang: (lang: AppLanguage) => void;
  deferredInstallPrompt: any;
  onInstallPWA: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  lang,
  activeTab,
  setActiveTab,
  onOpenVoiceModal,
  themeMode,
  setThemeMode,
  setLang,
  deferredInstallPrompt,
  onInstallPWA,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ug || TRANSLATIONS.en;

  const coreTabs: { id: NavTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: lang === 'ug' ? 'باشبەت' : t.hub, icon: Sparkles },
    { id: 'assistant', label: lang === 'ug' ? 'سۈنئىي ئىدراك' : t.assistant, icon: Bot },
    { id: 'productivity', label: lang === 'ug' ? 'ۋەزىپىلەر' : t.tasksAndNotes, icon: CheckSquare },
    { id: 'projects', label: lang === 'ug' ? 'تۈرلەر' : t.projects, icon: FolderGit2 },
  ];

  const allOtherTools: { id: NavTab; label: string; icon: any }[] = [
    { id: 'codingStudio', label: lang === 'ug' ? 'كود ئىشخانىسى' : 'Coding Studio', icon: Code2 },
    { id: 'calendar', label: lang === 'ug' ? 'كالېندار' : t.calendar, icon: Calendar },
    { id: 'knowledge', label: lang === 'ug' ? 'بىلىم ئامبىرى' : t.knowledge, icon: BookOpen },
    { id: 'flashcards', label: lang === 'ug' ? 'ئەستە تۇتۇش كارتىسى' : t.flashcards, icon: BrainCircuit },
    { id: 'mindmap', label: lang === 'ug' ? 'پىكىر خەرىتىسى' : t.mindmap, icon: Network },
    { id: 'standup', label: lang === 'ug' ? 'كۈندىلىك دوكلات' : t.standup, icon: ClipboardList },
    { id: 'okrGoals', label: lang === 'ug' ? 'OKR نىشانلىرى' : 'OKR Goals', icon: Target },
    { id: 'analytics', label: lang === 'ug' ? 'سانلىق ئانالىز' : 'Analytics', icon: TrendingUp },
    { id: 'docExporter', label: lang === 'ug' ? 'ھۆججەت چىقىرىش' : 'Exporter', icon: FileDown },
    { id: 'webReader', label: lang === 'ug' ? 'تور ئوقۇغۇچ' : 'Web Reader', icon: Globe },
    { id: 'promptlab', label: lang === 'ug' ? 'ئەقلىي بۇيرۇق تەجرىبىخانىسى' : t.promptlab, icon: Terminal },
    { id: 'financeAndHabits', label: lang === 'ug' ? 'ئادەت & خامچوت' : t.financeAndHabits, icon: Flame },
    { id: 'focus', label: lang === 'ug' ? 'زېھىن مەركەزلەشتۈرۈش' : t.focusAndTools, icon: Timer },
    { id: 'blueprint', label: lang === 'ug' ? 'قۇرۇلما پىلانى' : t.blueprint, icon: Sparkles },
    { id: 'settings', label: lang === 'ug' ? 'تەڭشەكلەر' : t.settings, icon: Settings },
  ];

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Mobile Floating Drawer Sheet */}
      {isDrawerOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="flex-1"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 shadow-2xl p-4 max-h-[80vh] overflow-y-auto pb-[max(env(safe-area-inset-bottom),1.5rem)]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  م
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                    {lang === 'ug' ? 'مىڭ ياردەمچىم - بارلىق قوراللار' : 'All Features & Tools'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {lang === 'ug' ? 'ئېھتىياجلىق قورالنى تاللاڭ' : 'Select a tool'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PWA Install Button inside Drawer */}
            <div className="my-3">
              <button
                onClick={() => {
                  onInstallPWA();
                  setIsDrawerOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs shadow-md active:scale-98 transition-transform"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'ug' ? '📲 تېلېفونغا ئەپ قىلىپ قاچىلاش (PWA App)' : '📲 Install App on Phone'}</span>
              </button>
            </div>

            {/* Grid of Tools */}
            <div className="grid grid-cols-3 gap-2 py-2">
              {allOtherTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTab === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleSelectTab(tool.id)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl text-center transition-all ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold ring-2 ring-indigo-500/30'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-indigo-500" />
                    <span className="text-[11px] leading-tight line-clamp-1">{tool.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Actions (Voice, Theme, Lang) */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onOpenVoiceModal();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold"
              >
                <Mic className="w-4 h-4" />
                <span>{lang === 'ug' ? 'ئاۋازلىق سۆزلىشىش' : 'Voice Assistant'}</span>
              </button>

              <button
                onClick={() => {
                  const nextTheme = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'midnight' : 'light';
                  setThemeMode(nextTheme);
                }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                title="تېما ئالماشتۇرۇش"
              >
                {themeMode === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Docked Mobile Bottom Navigation Bar */}
      <nav
        className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[max(env(safe-area-inset-bottom),0.35rem)] pt-1.5 px-2"
        role="navigation"
        aria-label="تېلېفون يولباشچىسى"
      >
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {coreTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold scale-105'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
              </button>
            );
          })}

          {/* Center Voice Floating Action Button */}
          <button
            onClick={onOpenVoiceModal}
            className="flex flex-col items-center justify-center -mt-4"
            title="ئاۋازلىق ياردەمچى"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 active:scale-95 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <span className="text-[9px] mt-0.5 text-slate-500 font-medium">ئاۋاز</span>
          </button>

          {/* More Menu Button */}
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isDrawerOpen
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Menu className="w-5 h-5 stroke-2" />
            <span className="text-[10px] mt-0.5 tracking-tight">{lang === 'ug' ? 'قوراللار' : 'More'}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
