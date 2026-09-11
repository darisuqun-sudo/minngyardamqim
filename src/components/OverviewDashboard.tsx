import React, { useState } from 'react';
import {
  Compass,
  Bot,
  CheckSquare,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Timer,
  Layers,
  Terminal,
  Zap,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  Cpu,
  FileCode2,
  ShieldCheck,
  Languages,
  Mic,
  FileDown,
  Globe,
  Target,
  SunMedium,
  BarChart3,
} from 'lucide-react';
import { AppLanguage, NavTab, RoadmapPhase, TaskItem, NoteItem } from '../types';
import { LOCALIZED_PILLARS, LOCALIZED_ROADMAP } from '../data/localizedData';
import { TRANSLATIONS } from '../data/translations';

interface OverviewDashboardProps {
  lang: AppLanguage;
  setActiveTab: (tab: NavTab) => void;
  roadmapPhases: RoadmapPhase[];
  tasks: TaskItem[];
  notes: NoteItem[];
  onQuickAsk: (prompt: string, persona?: string) => void;
  onSelectPillar: (pillarId: string) => void;
  onOpenMorningBriefing?: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  lang,
  setActiveTab,
  roadmapPhases,
  tasks,
  notes,
  onQuickAsk,
  onSelectPillar,
  onOpenMorningBriefing,
}) => {
  const isRTL = lang === 'ug' || lang === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [quickInput, setQuickInput] = useState('');

  // Calculate roadmap progress
  const allTasks = roadmapPhases.flatMap((p) => p.tasks);
  const completedTasks = allTasks.filter((t) => t.done).length;
  const progressPercent = Math.round((completedTasks / (allTasks.length || 1)) * 100);

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onQuickAsk(quickInput);
    setQuickInput('');
  };

  return (
    <div id="overview-dashboard-container" className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <section
        id="dashboard-hero-banner"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-10 shadow-xl"
      >
        {/* Background glow & subtle patterns */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.welcomeBadge}</span>
            </div>
            {onOpenMorningBriefing && (
              <button
                type="button"
                onClick={onOpenMorningBriefing}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 text-xs font-semibold border border-amber-400/40 transition-colors"
              >
                <SunMedium className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.morningBriefing || 'Morning AI Briefing'}</span>
              </button>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-snug">
            {t.heroTitle}
          </h1>

          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed max-w-2xl">
            {t.heroDesc}
          </p>

          {/* Quick AI Search & Ask Input */}
          <form onSubmit={handleQuickSubmit} className="pt-2">
            <div className="relative flex items-center max-w-xl">
              <input
                id="hero-quick-ai-input"
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder={t.askAiPlaceholder}
                className="w-full pl-4 pr-28 sm:pr-32 py-3 rounded-2xl bg-white/15 backdrop-blur-md text-white placeholder-indigo-200/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm shadow-inner transition-all"
              />
              <button
                type="submit"
                id="hero-quick-ai-submit-btn"
                className="absolute right-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>{t.askAiBtn}</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 6 Advanced Power Modules Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>{lang === 'ug' ? '6 چوڭ ئىقتىدار بۆلەكلىرى' : '6 Advanced Power Hubs'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {lang === 'ug' ? 'تەلىپىڭىز بويىچە يېڭىدىن قوشۇلغان ئەقلىي ئىقتىدارلار' : 'Integrated AI modules designed for productivity'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div
            onClick={() => setActiveTab('voicememos')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-400 dark:hover:border-red-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {t.voiceMemos || 'Voice Memos'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                {lang === 'ug' ? 'ئاۋازنى تېكىستكە & ۋەزىپىگە ئايلاندۇرۇش' : 'Speech-to-Text & Action Items'}
              </p>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('analytics')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {t.analytics || 'Analytics'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                {lang === 'ug' ? 'ھەپتىلىك & ئايلىق ھالىتى تەھلىلى' : 'Weekly & Monthly Insights'}
              </p>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('docExporter')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {t.docExporter || 'Exporter'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                {lang === 'ug' ? 'PDF, Word, MD ۋە تېكىست چىقىرىش' : 'PDF, Markdown & JSON Exporter'}
              </p>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('webReader')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {t.webReader || 'Web Reader'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                {lang === 'ug' ? 'تور ماقالە ۋە ئۇلانمىلارنى يىغىنچاقلاش' : 'TL;DR & Multi-language summary'}
              </p>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('okrGoals')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {t.okrGoals || 'OKR Goals'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                {lang === 'ug' ? 'نىشانلار ۋە ئاچقۇچلۇق نەتىجىلەر' : 'Strategic Objectives & Milestones'}
              </p>
            </div>
          </div>

          <div
            onClick={onOpenMorningBriefing || (() => setActiveTab('focus'))}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-600 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <SunMedium className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {t.morningBriefing || 'Morning AI'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                {lang === 'ug' ? 'كۈنلۈك تەييارلىق ۋە ئاۋازلىق كۆرسەتمە' : 'Daily Briefing & Voice TTS'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics & Quick Overview Cards */}
      <section id="metrics-overview-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Blueprint Pillars */}
        <div
          id="metric-card-pillars"
          onClick={() => setActiveTab('blueprint')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
              6 {t.pillarsMetricLabel}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {LOCALIZED_PILLARS.length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.pillarsSectionTitle}
            </p>
          </div>
        </div>

        {/* Metric 2: Implementation Roadmap */}
        <div
          id="metric-card-roadmap"
          onClick={() => setActiveTab('blueprint')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              {progressPercent}%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {completedTasks} / {allTasks.length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.roadmapMilestonesDone}
            </p>
          </div>
        </div>

        {/* Metric 3: Active Tasks */}
        <div
          id="metric-card-tasks"
          onClick={() => setActiveTab('productivity')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-300 dark:hover:border-amber-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ListTodo className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
              {pendingTasksCount} {t.pending}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {tasks.length}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.trackedTasks}
            </p>
          </div>
        </div>

        {/* Metric 4: AI Model Engine */}
        <div
          id="metric-card-model"
          onClick={() => setActiveTab('assistant')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-violet-300 dark:hover:border-violet-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
              Active
            </span>
          </div>
          <div className="mt-4">
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Gemini 3.7 Flash
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.aiEngineLabel}
            </p>
          </div>
        </div>
      </section>

      {/* Blueprint Architecture 6 Pillars Highlights */}
      <section id="blueprint-pillars-preview-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              🏛️ {t.pillarsSectionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.pillarsSectionDesc}
            </p>
          </div>
          <button
            id="view-all-blueprint-btn"
            onClick={() => setActiveTab('blueprint')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <span>{t.exploreFullBlueprint}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LOCALIZED_PILLARS.map((pillar) => {
            return (
              <div
                key={pillar.id}
                id={`dashboard-pillar-card-${pillar.id}`}
                onClick={() => {
                  onSelectPillar(pillar.id);
                  setActiveTab('blueprint');
                }}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200/60 dark:border-indigo-800/60">
                      {pillar.num}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {pillar.badge[lang] || pillar.badge.en}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {pillar.title[lang] || pillar.title.en}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {pillar.summary[lang] || pillar.summary.en}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>{pillar.techChoices.length} {t.techStackChoices}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    {t.details}
                    <ArrowIcon className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Interactive Tool Launchers */}
      <section id="quick-tool-launchers-section" className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          ⚡ {t.quickActionsTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Custom Plan Generator */}
          <div
            id="quick-card-plan"
            onClick={() => {
              onQuickAsk(lang === 'tr' ? 'Bana çok işlevli modern bir asistan uygulamasının detaylı mimari planını oluştur' : lang === 'ar' ? 'قم بإنشاء مخطط معماري تفصيلي لتطبيق مساعد حديث ومتكامل' : lang === 'ug' ? 'ماڭا بىر كۆپ ئىقتىدارلىق ياردەمچى ئەپ ۋە توربىكەتنىڭ تەپسىلىي لايىھە قۇرۇلمىسىنى يېزىپ بەر' : 'Draft a comprehensive blueprint for my multi-functional assistant web app', 'planner');
            }}
            className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800/60 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.customPlanCardTitle}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {t.customPlanCardDesc}
            </p>
          </div>

          {/* Card 2: Coding & Dev Studio */}
          <div
            id="quick-card-code"
            onClick={() => setActiveTab('codingStudio')}
            className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/60 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform">
              <FileCode2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.codingStudio || t.codeGuruCardTitle}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {lang === 'ug'
                ? 'Python, React, TypeScript, C++, AI & SQL كود سېخى ۋە سىناش'
                : (t.codingStudio ? 'Python, React, TypeScript, C++, AI & SQL Playground' : t.codeGuruCardDesc)}
            </p>
          </div>

          {/* Card 3: Multilingual Translator */}
          <div
            id="quick-card-translate"
            onClick={() => setActiveTab('focus')}
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800/60 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform">
              <Languages className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.translateCardTitle}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {t.translateCardDesc}
            </p>
          </div>

          {/* Card 4: Focus & Pomodoro */}
          <div
            id="quick-card-focus"
            onClick={() => setActiveTab('focus')}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800/60 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm mb-3 group-hover:scale-105 transition-transform">
              <Timer className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.pomodoroCardTitle}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {t.pomodoroCardDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Two Column: Recent Tasks & Knowledge Notes Preview */}
      <section id="dashboard-bottom-preview-grid" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Tasks Preview */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                {t.todayTasksTitle}
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('productivity')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {t.manageAll}
            </button>
          </div>

          <div className="space-y-2.5">
            {tasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                      task.completed
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                  <span
                    className={`text-xs sm:text-sm ${
                      task.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    task.priority === 'high'
                      ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                      : task.priority === 'medium'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Smart Notes Preview */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                {t.smartNotesTitle}
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('productivity')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {t.openNotepad}
            </button>
          </div>

          <div className="space-y-3">
            {notes.slice(0, 2).map((note) => (
              <div
                key={note.id}
                onClick={() => setActiveTab('productivity')}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer"
              >
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  {note.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {note.content}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  {note.tags.map((tItem) => (
                    <span
                      key={tItem}
                      className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60"
                    >
                      #{tItem}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
