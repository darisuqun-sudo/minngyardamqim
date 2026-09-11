import React, { useState } from 'react';
import {
  FileDown,
  Printer,
  Copy,
  Check,
  FileText,
  Layers,
  Sparkles,
  Download,
  Share2,
  Eye,
  CheckSquare,
  BookOpen,
  Target,
  Mic,
  Calendar,
  Code
} from 'lucide-react';
import {
  TaskItem,
  CalendarEvent,
  KnowledgeDoc,
  ProjectBlueprint,
  HabitItem,
  DailyStandupRecord,
  VoiceMemo,
  OKRGoal,
  FlashcardDeck,
  AppLanguage,
} from '../types';

interface DocExporterViewProps {
  tasks: TaskItem[];
  events: CalendarEvent[];
  knowledgeDocs: KnowledgeDoc[];
  blueprints: ProjectBlueprint[];
  standupRecords: DailyStandupRecord[];
  voiceMemos: VoiceMemo[];
  okrGoals: OKRGoal[];
  flashcardDecks: FlashcardDeck[];
  habits?: HabitItem[];
  language: AppLanguage;
  isRTL: boolean;
}

type ExportTemplateType =
  | 'standup'
  | 'blueprint'
  | 'knowledge'
  | 'okr'
  | 'flashcards'
  | 'voicememos'
  | 'full-summary';

export const DocExporterView: React.FC<DocExporterViewProps> = ({
  tasks,
  events,
  knowledgeDocs,
  blueprints,
  standupRecords,
  voiceMemos,
  okrGoals,
  flashcardDecks,
  habits = [],
  language,
  isRTL,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ExportTemplateType>('full-summary');
  const [format, setFormat] = useState<'markdown' | 'text' | 'json' | 'pdf'>('markdown');
  const [copied, setCopied] = useState(false);
  const [docTheme, setDocTheme] = useState<'clean' | 'modern' | 'minimal'>('modern');

  // Generate document text based on selected template
  const generateDocContent = (): string => {
    const todayStr = new Date().toISOString().split('T')[0];

    switch (selectedTemplate) {
      case 'standup': {
        const latestStandup = standupRecords[0];
        return `# 📋 كۈندىلىك خىزمەت نەتىجە دوكلاتى (Daily Standup Report)
**تارقىتىلغان ۋاقىت (Date):** ${latestStandup?.date || todayStr}  
**كەيپىيات ۋە زېھىن (Mood/Energy):** ${latestStandup?.mood || 'great'} (ئېنېرگىيە: ${latestStandup?.energyLevel || 5}/5)

---

## 🎯 تاماملىغان ئاساسلىق ئىشلار (Accomplished)
${(latestStandup?.accomplished || ['سىستېما ئاساسىي كودى پۈتتۈرۈلدى']).map((item) => `- [x] ${item}`).join('\n')}

## 🚧 كېيىنكى نىشان ۋە پىلانلار (Next Goals)
${(latestStandup?.tomorrowGoals || ['يېڭى بۆلەكلەرنى سىناش']).map((item) => `- [ ] ${item}`).join('\n')}

## 💡 خۇلاسە ۋە تەپەككۇر (Reflection)
${latestStandup?.reportMarkdown || 'بۈگۈنكى بارلىق نىشانلار مۇۋەپپەقىيەتلىك ئورۇندالدى.'}

> **كۈندىلىك ھېكمەت:** "${latestStandup?.motivationalQuote || 'ئەڭ ياخشى كەلگۈسى — بۈگۈن تىرىشىپ ياراتقان كەلگۈسىدۇر.'}"
`;
      }

      case 'blueprint': {
        const mainBlueprint = blueprints[0];
        return `# 🏛️ سىستېما لايىھە قۇرۇلما پىلانى (System Architecture Blueprint)
**تۈر نامى:** ${mainBlueprint?.title || 'Smart Assistant Hub'}  
**سۇپا:** Web (React 19 + Express + Gemini 3.7 Flash)  
**ھالىتى:** ئاكتىپ پىلانلاندى

---

## 🌟 يادرولۇق ئىقتىدارلار ۋە 6 تۈۋرۈك
1. **AI تەپەككۇر & ياردەمچى:** Gemini 3.7 Flash بىلەن مۇلازىمېتىر تەرەپ قورۇقى.
2. **شەخسىي ۋاقىت & كالېندار:** ۋاقىت بۆلىكى (Time-Blocking) ئارقىلىق ئورۇنلاشتۇرۇش.
3. **بىلىم ئامبىرى & تېز تەھلىل:** Markdown, Code ۋە كۆپ تىللىق ھۆججەتلەر.
4. **ئادەت & مالىيە خامچوتى:** كۈندىلىك رېكورت ۋە خىراجەت تەڭپۇڭلۇقى.
5. **زېھىن & پومودورو:** 25 مىنۇتلۇق دىققەت بۆلىكى ۋە تەبىئەت ئاۋازلىرى.
6. **لايىھە پىلانى & تېخنىكا كارتىسى:** پۈتۈن سىستېمىنى تېز گېنېراتسىيە قىلىش.
`;
      }

      case 'okr': {
        return `# 🎯 ئىستراتېگىيىلىك OKR نىشان ۋە قەدەم باسقۇچلار (Strategic OKRs)
**تەييارلانغان ۋاقىت:** ${todayStr}

${okrGoals
  .map(
    (g, idx) => `## ${idx + 1}. ${g.title}
**Objective (ئوبيېكتىپ نىشان):** ${g.objective}  
**ۋاقىت دائىرىسى:** ${g.quarter} | **ھالىتى:** ${g.status.toUpperCase()}

### 📊 Key Results (ئۆلچەملىك نەتىجىلەر):
${g.keyResults
  .map(
    (kr) => `- **${kr.title}**: ${kr.currentValue}/${kr.targetValue} ${kr.unit} (${kr.progressPercentage}%)
  ${kr.milestones.map((m) => `  * [${m.completed ? 'x' : ' '}] ${m.title}`).join('\n')}`
  )
  .join('\n\n')}

> **AI ئىستراتېگىيىلىك يېتەكچىلىكى:** ${g.aiStrategicAdvice || 'قەدەم باسقۇچلارنى كۈندىلىك ۋەزىپىگە ئايلاندۇرۇپ ئىجرا قىلىڭ.'}
`
  )
  .join('\n---\n\n')}
`;
      }

      case 'flashcards': {
        return `# 🗂️ بىلىم كارتىلىرى ۋە تەتقىقات كۆرسەتمىسى (Flashcard Study Guide)
**تۈر سانى:** ${flashcardDecks.length} قاپ | **سېلىنغان كۈن:** ${todayStr}

${flashcardDecks
  .map(
    (deck) => `## 📚 ${deck.title} (${deck.category})
${deck.description}

### سوئال ۋە جاۋابلار (Cards):
${deck.cards
  .map(
    (c, i) => `#### Q${i + 1}: ${c.front}
- **جاۋاب (Answer):** ${c.back}
- **ئەسكەرتىش (Hint):** ${c.hint || 'يوق'} (قىيىنلىقى: ${c.difficulty})`
  )
  .join('\n\n')}
`
  )
  .join('\n---\n\n')}
`;
      }

      case 'voicememos': {
        return `# 🎙️ ئاۋازلىق خاتىرىلەر ۋە يىغىن خۇلاسىسى (Voice Memos Dossier)
**خاتىرە سانى:** ${voiceMemos.length} دانە | **كۈن:** ${todayStr}

${voiceMemos
  .map(
    (m, i) => `## ${i + 1}. 🎙️ ${m.title}
- **سۆزلەنگەن ۋاقىت:** ${new Date(m.createdAt).toLocaleDateString()} (${m.durationSec}s)
- **كاتېگورىيە:** ${m.category.toUpperCase()} | **خەتكۈشلەر:** ${m.tags.join(', ')}

### 🌟 خۇلاسە (Summary):
${m.summary}

### ✍️ تولۇق يازما (Transcript):
${m.transcript}

### ✅ ھەرىكەت تەۋسىيەلىرى (Action Items):
${m.actionItems.map((item) => `- [ ] ${item}`).join('\n')}
`
  )
  .join('\n---\n\n')}
`;
      }

      case 'knowledge': {
        return `# 🧠 بىلىم ئامبىرى ماقالىلەر جەۋھىرى (Knowledge Base Master Dossier)
**ساقلانغان ھۆججەتلەر:** ${knowledgeDocs.length} پارچە

${knowledgeDocs
  .map(
    (doc, i) => `## ${i + 1}. 📄 ${doc.title}
- **تىپى:** ${doc.fileType.toUpperCase()} | **تەۋەلىكى:** ${doc.tags.join(', ')}

### مەزمۇن يادروسى (Summary):
${doc.summary}

### مۇھىم نۇقتىلار (Key Insights):
${doc.keyInsights.map((k) => `- 💡 ${k}`).join('\n')}

---
`
  )
  .join('\n')}
`;
      }

      default: {
        // Full System Master Executive Dossier
        return `# 🌐 پۈتۈن سىستېما خىزمەت ۋە لايىھە دوكلاتى (Executive Workspace Dossier)
**تارقىتىلغان ۋاقىت:** ${todayStr}  
**سۇپا:** ئەقلىي ياردەمچى & لايىھە مەركىزى (Smart Assistant & Blueprint Hub)

---

## 1. 📊 خىزمەت ئۈنۈمى ۋە ۋەزىپە ئەھۋالى
- **جەمئىي پىلانلانغان ۋەزىپە:** ${tasks.length} دانە
- **تاماملانغان نىسبىتى:** ${tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 100}%
- **ئاكتىپ ئادەت تۈرلىرى:** ${habits.length} دانە
- **خاتىرىلەنگەن يىغىن/ئاۋاز:** ${voiceMemos.length} دانە

## 2. 🎯 ئاساسلىق نىشانلار (Top OKRs)
${okrGoals.slice(0, 2).map((g) => `- **${g.title}**: ${g.objective} (${g.status})`).join('\n')}

## 3. 🧠 بىلىم ئامبىرى ۋە لايىھە كۆرسەتكۈچى
- **بىلىم ھۆججەتلىرى:** ${knowledgeDocs.length} دانە
- **ئۆگىنىش قاپلىرى:** ${flashcardDecks.length} قاپ
- **سىستېما لايىھە لايىھىسى:** تولۇق 6 تۈۋرۈك بىلەن قۇرۇلمىلاشقان

> **ئەسكەرتىش:** بۇ ھۆججەت سۈنئىي ئىدراك ياردەمچىسى تەرىپىدىن بىر چېكىش بىلەن ئاپتوماتىك تەييارلاندى.
`;
      }
    }
  };

  const docContent = generateDocContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(docContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let filename = `export-${selectedTemplate}-${Date.now()}`;
    let blob: Blob;

    if (format === 'json') {
      filename += '.json';
      const jsonData = {
        template: selectedTemplate,
        exportDate: new Date().toISOString(),
        tasks,
        events,
        knowledgeDocs,
        okrGoals,
        voiceMemos,
        flashcardDecks,
      };
      blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    } else if (format === 'text') {
      filename += '.txt';
      blob = new Blob([docContent], { type: 'text/plain;charset=utf-8' });
    } else {
      filename += '.md';
      blob = new Blob([docContent], { type: 'text/markdown;charset=utf-8' });
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600/15 via-indigo-600/10 to-pink-600/15 border border-purple-500/25 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2 border border-purple-500/20">
              <FileDown className="w-3.5 h-3.5" />
              {language === 'ug' ? 'ھۆججەت ستۇدىيىسى & ئېكسپورت' : 'Document Studio'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {language === 'ug'
                ? '📑 ئەقلىي ھۆججەت چىقىرىش & مەتبەئە مەركىزى'
                : language === 'tr'
                ? '📑 Akıllı Belge ve PDF Dışa Aktarma Merkezi'
                : language === 'ar'
                ? '📑 استوديو المستندات وتصدير PDF المتقدم'
                : '📑 Smart Doc Studio & Multi-Format Exporter'}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1 max-w-2xl">
              {language === 'ug'
                ? 'بارلىق پىلان، كۈندىلىك دوكلات، بىلىم ئامبىرى ۋە OKR نىشانلىرىنى يۇقىرى سۈپەتلىك PDF، Markdown، Word ياكى JSON ھالىتىدە چىقىرىڭ ۋە باسمىغا بېرىڭ.'
                : 'Export blueprints, standup summaries, OKRs, and flashcards to high-definition PDF, Markdown, or JSON.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="print-pdf-doc-btn"
              onClick={handlePrintPDF}
              className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-xs rounded-xl shadow cursor-pointer hover:bg-neutral-800 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'ug' ? 'PDF قىلىپ بېسىش (Print)' : 'Print / Save as PDF'}</span>
            </button>
            <button
              id="download-doc-btn"
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'ug' ? 'ھۆججەت چۈشۈرۈش' : 'Download File'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Config Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Template Selection */}
          <div className="bg-white dark:bg-neutral-800/90 border border-neutral-200/80 dark:border-neutral-700/80 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              {language === 'ug' ? '1. ھۆججەت قېلىپىنى تاللاڭ' : '1. Select Document Template'}
            </h3>

            <div className="space-y-1.5">
              {[
                { id: 'full-summary', icon: Layers, labelUg: '🌐 ئومۇمىي سىستېما دوكلاتى', labelEn: '🌐 Master System Dossier' },
                { id: 'standup', icon: CheckSquare, labelUg: '📋 كۈندىلىك Standup خۇلاسىسى', labelEn: '📋 Daily Standup Summary' },
                { id: 'blueprint', icon: FileText, labelUg: '🏛️ سىستېما لايىھە قۇرۇلمىسى', labelEn: '🏛️ Architecture Blueprint' },
                { id: 'okr', icon: Target, labelUg: '🎯 OKR نىشان ۋە قەدەم باسقۇچلار', labelEn: '🎯 Strategic OKRs' },
                { id: 'voicememos', icon: Mic, labelUg: '🎙️ ئاۋازلىق خاتىرىلەر & يىغىن', labelEn: '🎙️ Voice Memos Dossier' },
                { id: 'flashcards', icon: BookOpen, labelUg: '🗂️ بىلىم كارتىلىرى & تەتقىقات', labelEn: '🗂️ Flashcards Study Guide' },
                { id: 'knowledge', icon: Sparkles, labelUg: '🧠 بىلىم ئامبىرى ئارخىپى', labelEn: '🧠 Knowledge Vault Archive' },
              ].map((tpl) => {
                const IconComponent = tpl.icon;
                const isSelected = selectedTemplate === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl.id as ExportTemplateType)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/40 border border-purple-500/50 text-purple-700 dark:text-purple-300 font-bold'
                        : 'bg-neutral-50 dark:bg-neutral-900/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-transparent'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 text-purple-500 shrink-0" />
                    <span>{language === 'ug' ? tpl.labelUg : tpl.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format Selection */}
          <div className="bg-white dark:bg-neutral-800/90 border border-neutral-200/80 dark:border-neutral-700/80 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              {language === 'ug' ? '2. ھۆججەت فورماتى' : '2. Output Format'}
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'markdown', label: 'Markdown (.md)' },
                { id: 'text', label: 'Plain Text (.txt)' },
                { id: 'json', label: 'Raw JSON (.json)' },
                { id: 'pdf', label: 'Printable PDF' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setFormat(fmt.id as any)}
                  className={`p-2.5 rounded-xl text-center font-medium transition-colors cursor-pointer border ${
                    format === fmt.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Live Document Preview (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-neutral-800/90 border border-neutral-200/80 dark:border-neutral-700/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* Action Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/40">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  {language === 'ug' ? 'ھۆججەت كۆرۈنۈشى (Live Preview)' : 'Live Document Preview'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="copy-doc-content-btn"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{language === 'ug' ? 'نۇسخىلاندى!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{language === 'ug' ? 'نۇسخىلاش' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Document Content View */}
            <div className="p-8 max-h-[620px] overflow-y-auto font-sans leading-relaxed text-sm bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap selection:bg-purple-500/20">
              {docContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
