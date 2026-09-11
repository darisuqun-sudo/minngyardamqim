import React from 'react';
import { Sparkles, Shield, Cpu, RefreshCw } from 'lucide-react';
import { AppLanguage, NavTab } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FooterProps {
  lang: AppLanguage;
  setActiveTab: (tab: NavTab) => void;
  onResetAllData: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  setActiveTab,
  onResetAllData,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleReset = () => {
    if (window.confirm(t.resetConfirmMessage)) {
      onResetAllData();
    }
  };

  return (
    <footer
      id="main-app-footer"
      className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200 mt-auto"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
        {/* Left: Brand info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">
              {t.appName}
            </p>
            <p className="text-[11px] text-slate-400">
              {t.footerBrandDesc}
            </p>
          </div>
        </div>

        {/* Center: System badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
            <Shield className="w-3 h-3 text-emerald-500" />
            <span>{t.localDataPrivacy}</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
            <Cpu className="w-3 h-3 text-indigo-500" />
            <span>{t.serverAiProxy}</span>
          </span>
        </div>

        {/* Right: Reset & Quick link */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
            title="Reset data"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{t.resetSampleData}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
