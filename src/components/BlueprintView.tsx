import React, { useState } from 'react';
import {
  Layout,
  CheckCircle2,
  Circle,
  Sparkles,
  Download,
  Send,
  Layers,
  FileCode,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Bot,
  Copy,
  Check,
  Cpu,
  Database,
  Globe,
  Smartphone,
  Server,
  Zap,
  Bookmark
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AppLanguage, BlueprintPillar, RoadmapPhase } from '../types';
import { LOCALIZED_PILLARS, LOCALIZED_ROADMAP, LocalizedBlueprintPillar } from '../data/localizedData';
import { TRANSLATIONS } from '../data/translations';

interface BlueprintViewProps {
  lang: AppLanguage;
  roadmap: RoadmapPhase[];
  onToggleRoadmapTask: (phaseId: string, taskId: string) => void;
}

interface ArchTemplate {
  id: string;
  titleUg: string;
  titleEn: string;
  category: string;
  descUg: string;
  descEn: string;
  techStack: string[];
  keyFeaturesUg: string[];
  keyFeaturesEn: string[];
  diagramAscii: string;
}

const ARCHITECTURE_TEMPLATES: ArchTemplate[] = [
  {
    id: 'ai-rag-workspace',
    titleUg: 'سۈنئىي ئىدراك RAG ۋە بىلىم باشقۇرۇش سىستېمىسى',
    titleEn: 'AI-Powered RAG Knowledge & Agent Workspace',
    category: 'AI & Enterprise',
    descUg: 'كۆپ تىللىق سۈنئىي ئىدراك ياردەمچىسى، ھۆججەتلەرنى تەھلىل قىلىش، پاراڭلىشىش ۋە ئۆزلۈكىدىن يەكۈنلەش سىستېمىسى.',
    descEn: 'Full-stack AI workspace with document embedding, semantic search, multi-persona agents, and offline caching.',
    techStack: ['React 18', 'TypeScript', 'Gemini 3.7 Flash', 'Express / Node.js', 'Vector Store / LocalDB', 'Tailwind CSS'],
    keyFeaturesUg: ['ھۆججەت كۆرۈپ تەھلىل قىلىش', 'ئاۋازلىق كىرگۈزۈش ۋە يېزىق چىقىرىش', 'كۆپ خىل ئەقلىي ياردەمچى سالاھىيىتى', 'بىخەتەر يەرلىك مەخپىيەتلىك'],
    keyFeaturesEn: ['Document Q&A with semantic grounding', 'Voice memo transcription & insights', 'Specialized AI personas', 'Local-first offline security'],
    diagramAscii: `+------------------------------------------------------------------+
|                    CLIENT LAYER (React + Vite)                   |
|  [Voice / Text] -> [Knowledge UI] -> [Chat & Workflow Canvas]    |
+------------------------------------------------------------------+
                                  |
                                  v REST / SSE Stream
+------------------------------------------------------------------+
|                   BACKEND LAYER (Node + Express)                 |
|  [Auth & Middleware] -> [Gemini 3.7 SDK Engine] -> [Prompt Lab]  |
+------------------------------------------------------------------+
                                  |
                                  v
+------------------------------------------------------------------+
|                    PERSISTENCE & INTELLIGENCE                    |
|  [Local-First State] <-> [Vector Knowledge Store] <-> [Gemini AI]|
+------------------------------------------------------------------+`,
  },
  {
    id: 'fullstack-saas-platform',
    titleUg: 'زامانىۋى SaaS ئەپ قۇرۇلمىسى (React + Node + SQL)',
    titleEn: 'Modern Multi-Tenant SaaS & Cloud Platform',
    category: 'Full-Stack Web',
    descUg: 'ئىشلەتكۈچى ھېساباتى، رول ۋە ھوقۇق تەقسىماتى، بايلىق ئانالىزى ۋە سۈنئىي ئىدراك ئاپتوماتلاشتۇرۇش سىستېمىسى.',
    descEn: 'Production-ready SaaS architecture featuring role-based access control, subscription tiers, and analytical reporting.',
    techStack: ['React', 'TypeScript', 'PostgreSQL / Firestore', 'Tailwind CSS', 'Recharts', 'Stripe'],
    keyFeaturesUg: ['ھوقۇق ۋە رول باشقۇرۇش (RBAC)', 'كۆرۈنۈشلۈك ئانالىز تاختىسى', 'ئاپتوماتىك PDF دوكلات چىقىرىش', 'خامچوت ۋە ئىقتىساد كۆرسەتكۈچلىرى'],
    keyFeaturesEn: ['Role-based access control', 'Interactive visual dashboards', 'Automated PDF/Markdown exports', 'Financial telemetry & alerts'],
    diagramAscii: `+------------------------------------------------------------------+
|                   RESPONSIVE WEB & MOBILE (PWA)                  |
|  [Dashboard] <-> [Kanban & Time-blocking] <-> [Finance & Habits] |
+------------------------------------------------------------------+
                                  |
                                  v Secure API Proxy
+------------------------------------------------------------------+
|                   SECURE API GATEWAY (Express)                   |
|  [RBAC Middleware] -> [Business Logic Controllers] -> [AI Core] |
+------------------------------------------------------------------+
                                  |
                                  v
+------------------------------------------------------------------+
|                   DATA STORAGE & CLOUD PERSISTENCE               |
|  [Relational / Document DB] <-> [Audit Logs] <-> [Export Service]|
+------------------------------------------------------------------+`,
  },
  {
    id: 'offline-mobile-pwa',
    titleUg: 'تورسىزمۇ ئىشلەيدىغان PWA شەخسىي ئۈنۈم مەركىزى',
    titleEn: 'Offline-First Productivity PWA & Habit Engine',
    category: 'Mobile & Offline',
    descUg: 'توردىن ئۈزۈلگەن ھالەتتىمۇ پۈتۈنلەي ئىشلەيدىغان، يەرلىك سۈنئىي ئىدراك ماتورى ۋە ئاۋاز ھاسىللىغۇچنى ئۆز ئىچىگە ئالغان ئەپ.',
    descEn: 'Zero-latency, offline-first personal workspace with built-in Web Audio synth, indexed state storage, and auto-sync.',
    techStack: ['React', 'Service Worker (PWA)', 'Web Audio API', 'IndexedDB / LocalStorage', 'Lucide Icons'],
    keyFeaturesUg: ['100% تورسىز ئىشلەش ئىقتىدارى', 'تەبىئىي ئاۋاز بىلەن مەركەزلىشىش', 'ئادەت ئىز قوغلاش ۋە خاتىرە', 'ھۆججەت چىقىرىش ۋە زاپاسلاش'],
    keyFeaturesEn: ['100% Offline operation capability', 'Procedural Web Audio soundscapes', 'Habit streak heatmaps', 'Complete JSON/Markdown backup'],
    diagramAscii: `+------------------------------------------------------------------+
|                    OFFLINE PWA CONTAINER                         |
|  [Service Worker Cache] <-> [Client State Engine] <-> [IndexedDB]|
+------------------------------------------------------------------+
         |                                           |
         v                                           v
+----------------------+                   +-----------------------+
|  Web Audio Focus     |                   |  Local Data Backup    |
|  Procedural Synth    |                   |  JSON / Markdown Docs |
+----------------------+                   +-----------------------+`,
  }
];

export const BlueprintView: React.FC<BlueprintViewProps> = ({
  lang,
  roadmap,
  onToggleRoadmapTask,
}) => {
  const isRTL = lang === 'ug' || lang === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [activeTab, setActiveTab] = useState<'pillars' | 'roadmap' | 'templates' | 'ai-plan'>('pillars');
  const [selectedPillarId, setSelectedPillarId] = useState<string>(LOCALIZED_PILLARS[0].id);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(ARCHITECTURE_TEMPLATES[0].id);
  const [copiedAscii, setCopiedAscii] = useState(false);

  // Custom AI Plan Generator State
  const [projectIdea, setProjectIdea] = useState('');
  const [targetPlatform, setTargetPlatform] = useState('Web & Mobile PWA');
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const selectedPillar =
    LOCALIZED_PILLARS.find((p) => p.id === selectedPillarId) || LOCALIZED_PILLARS[0];
  const selectedTemplate =
    ARCHITECTURE_TEMPLATES.find((t) => t.id === selectedTemplateId) || ARCHITECTURE_TEMPLATES[0];

  const handleCopyAscii = () => {
    navigator.clipboard.writeText(selectedTemplate.diagramAscii);
    setCopiedAscii(true);
    setTimeout(() => setCopiedAscii(false), 2000);
  };

  const handleApplyTemplateToCustomPlan = (tpl: ArchTemplate) => {
    setProjectIdea(lang === 'ug' ? tpl.titleUg + ' - ' + tpl.descUg : tpl.titleEn + ' - ' + tpl.descEn);
    setActiveTab('ai-plan');
  };

  const handleGenerateCustomPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectIdea.trim() || isGeneratingPlan) return;

    setIsGeneratingPlan(true);
    setGeneratedPlan(null);

    const langName =
      lang === 'ug'
        ? 'Uyghur (ئۇيغۇرچە)'
        : lang === 'tr'
        ? 'Turkish (Türkçe)'
        : lang === 'ar'
        ? 'Arabic (العربية)'
        : 'English';

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectIdea,
          targetPlatform,
          language: langName,
        }),
      });
      const data = await res.json();
      if (data.planMarkdown) {
        setGeneratedPlan(data.planMarkdown);
      } else if (data.plan) {
        setGeneratedPlan(data.plan);
      } else if (data.error) {
        setGeneratedPlan(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setGeneratedPlan(
        lang === 'ug'
          ? 'پىلان ھاسىل قىلىشتا خاتالىق كۆرۈلدى. قايتا سىناڭ.'
          : lang === 'tr'
          ? 'Plan oluşturulurken hata oluştu. Lütfen tekrar deneyin.'
          : lang === 'ar'
          ? 'حدث خطأ أثناء توليد المخطط. يرجى المحاولة مرة أخرى.'
          : 'Failed to generate blueprint. Please try again.'
      );
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleExportBlueprint = () => {
    const content = `# ${t.blueprintMainTitle}\n\n${LOCALIZED_PILLARS.map(
      (p) => `## Pillar ${p.num}: ${p.title[lang] || p.title.en}\n- **Summary**: ${p.summary[lang] || p.summary.en}\n\n### Core Features:\n${(p.coreFeatures[lang] || p.coreFeatures.en).map((f) => `* ${f}`).join('\n')}\n\n### Tech Choices:\n${p.techChoices.map((tc) => `* **${tc.category}** (${tc.tech}): ${tc.purpose[lang] || tc.purpose.en}`).join('\n')}\n`
    ).join('\n---\n\n')}`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `App-Master-Blueprint-${lang}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="blueprint-view-container" className="space-y-8 pb-16">
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
              <Layout className="w-3.5 h-3.5" />
              <span>{t.masterPlanBadge}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {t.blueprintMainTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              {t.blueprintMainDesc}
            </p>
          </div>

          <button
            onClick={handleExportBlueprint}
            className="self-start md:self-center px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportMarkdown}</span>
          </button>
        </div>

        {/* View Segment Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('pillars')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'pillars'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.sixCorePillarsTab}
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'templates'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{lang === 'ug' ? 'تەييار قېلىپلار (Templates)' : 'Architecture Templates'}</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'roadmap'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.phaseRoadmapTab}
          </button>

          <button
            onClick={() => setActiveTab('ai-plan')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ai-plan'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.aiCustomPlanTab}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: 6 Core Pillars */}
      {activeTab === 'pillars' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Pillar List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
              {t.selectPillarTitle}
            </h3>
            {LOCALIZED_PILLARS.map((pillar) => {
              const isSelected = selectedPillarId === pillar.id;
              return (
                <div
                  key={pillar.id}
                  onClick={() => setSelectedPillarId(pillar.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 dark:border-indigo-500 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900">
                      {pillar.num}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                      {pillar.badge[lang] || pillar.badge.en}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                    {pillar.title[lang] || pillar.title.en}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {pillar.summary[lang] || pillar.summary.en}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Pillar Deep-Dive Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              {/* Pillar Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {t.pillarNumber} {selectedPillar.num}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {selectedPillar.title[lang] || selectedPillar.title.en}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                    {selectedPillar.summary[lang] || selectedPillar.summary.en}
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-xl border border-indigo-200 dark:border-indigo-800 whitespace-nowrap">
                  {selectedPillar.badge[lang] || selectedPillar.badge.en}
                </span>
              </div>

              {/* Core Features & Goals */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{t.coreFeaturesHeading}</span>
                </h4>
                <div className="grid grid-cols-1 gap-2.5">
                  {(selectedPillar.coreFeatures[lang] || selectedPillar.coreFeatures.en).map(
                    (feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{feature}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Tech Stack Table & Rationale */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-600" />
                  <span>{t.techStackHeading}</span>
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3">{t.techCategory}</th>
                        <th className="p-3">{t.techName}</th>
                        <th className="p-3">{t.techPurpose}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedPillar.techChoices.map((choice, i) => (
                        <tr
                          key={i}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                        >
                          <td className="p-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                            {choice.category}
                          </td>
                          <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                            {choice.tech}
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-300">
                            {choice.purpose[lang] || choice.purpose.en}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Architecture Best Practice Points */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>{t.architecturalNotesHeading}</span>
                </h4>
                <div className="space-y-2">
                  {(selectedPillar.architecturePoints[lang] || selectedPillar.architecturePoints.en).map(
                    (point, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                      >
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{point}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Architecture Template Library */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
              {lang === 'ug' ? 'تەۋسىيەلىك تۈر قېلىپلىرى' : 'Production Blueprints'}
            </h3>
            {ARCHITECTURE_TEMPLATES.map((tpl) => {
              const isSelected = tpl.id === selectedTemplateId;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 dark:border-indigo-500 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 px-2 py-0.5 rounded-md">
                      {tpl.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                    {lang === 'ug' ? tpl.titleUg : tpl.titleEn}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {lang === 'ug' ? tpl.descUg : tpl.descEn}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
                    {selectedTemplate.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {lang === 'ug' ? selectedTemplate.titleUg : selectedTemplate.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {lang === 'ug' ? selectedTemplate.descUg : selectedTemplate.descEn}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApplyTemplateToCustomPlan(selectedTemplate)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{lang === 'ug' ? 'پىلان ھاسىللاشقا ئىشلىتىش' : 'Generate with AI'}</span>
                  </button>
                </div>
              </div>

              {/* Tech Stack Chips */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {lang === 'ug' ? 'تېخنىكا توپلىمى (Tech Stack):' : 'Tech Stack Components:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono font-semibold border border-slate-200 dark:border-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Architecture ASCII Diagram */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{lang === 'ug' ? 'سىستېما ئېقىم دىئاگراممىسى' : 'Architecture Flow Diagram'}</span>
                  </span>
                  <button
                    onClick={handleCopyAscii}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                  >
                    {copiedAscii ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedAscii ? (lang === 'ug' ? 'كۆچۈرۈلدى' : 'Copied') : (lang === 'ug' ? 'كۆچۈرۈش' : 'Copy Diagram')}</span>
                  </button>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-[11px] sm:text-xs overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
                  <pre>{selectedTemplate.diagramAscii}</pre>
                </div>
              </div>

              {/* Key Features */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {lang === 'ug' ? 'يادرولۇق ئىقتىدارلار:' : 'Core Architectural Features:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(lang === 'ug' ? selectedTemplate.keyFeaturesUg : selectedTemplate.keyFeaturesEn).map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Phased Execution Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.roadmapProgressHeading}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.roadmapProgressDesc}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">{t.overallProgress}</span>
              <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                {LOCALIZED_ROADMAP.reduce(
                  (acc, p) => acc + p.tasks.filter((t) => t.done).length,
                  0
                )}{' '}
                /{' '}
                {LOCALIZED_ROADMAP.reduce((acc, p) => acc + p.tasks.length, 0)}{' '}
                Done
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LOCALIZED_ROADMAP.map((phase) => {
              const doneCount = phase.tasks.filter((t) => t.done).length;
              const totalCount = phase.tasks.length;
              const isAllDone = doneCount === totalCount;

              return (
                <div
                  key={phase.id}
                  className={`p-6 rounded-3xl border transition-all space-y-4 ${
                    isAllDone
                      ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-xl">
                      Phase 0{phase.phaseNumber}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      ⏱️ {phase.duration[lang] || phase.duration.en}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {phase.title[lang] || phase.title.en}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {phase.description[lang] || phase.description.en}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {phase.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => onToggleRoadmapTask(phase.id, task.id)}
                        className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {task.done ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={task.done ? 'line-through text-slate-400' : ''}>
                          {task.title[lang] || task.title.en}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Dynamic AI Custom Plan Generator */}
      {activeTab === 'ai-plan' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>{t.customPlanTitle}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {t.customPlanDesc}
              </p>
            </div>

            <form onSubmit={handleGenerateCustomPlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.projectIdeaLabel}
                </label>
                <textarea
                  rows={3}
                  value={projectIdea}
                  onChange={(e) => setProjectIdea(e.target.value)}
                  placeholder={t.projectIdeaPlaceholder}
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.targetPlatformLabel}
                  </label>
                  <select
                    value={targetPlatform}
                    onChange={(e) => setTargetPlatform(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Web & Mobile PWA">Web & Mobile PWA (React + Tailwind)</option>
                    <option value="Full-Stack Web App">Full-Stack Web App (React + Express + PostgreSQL)</option>
                    <option value="Cross-Platform Mobile">Cross-Platform Mobile (React Native / Expo)</option>
                    <option value="Desktop Application">Desktop Application (Electron / Tauri)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={!projectIdea.trim() || isGeneratingPlan}
                    className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isGeneratingPlan ? t.generatingBlueprint : t.generateBlueprintBtn}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Generated Plan Output */}
            {generatedPlan && (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in-50">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {t.generatedPlanBadge}
                  </span>
                  <button
                    onClick={() => {
                      const blob = new Blob([generatedPlan], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `Custom-Plan-${Date.now()}.md`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Markdown</span>
                  </button>
                </div>

                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{generatedPlan}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
