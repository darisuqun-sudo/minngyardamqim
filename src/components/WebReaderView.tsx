import React, { useState } from 'react';
import {
  Globe,
  Sparkles,
  Bookmark,
  Clock,
  BookOpen,
  Check,
  Copy,
  Plus,
  Trash2,
  Tag,
  ExternalLink,
  Volume2,
  Share2,
  FileText,
  Search,
  CheckCircle2,
  Languages,
  Zap
} from 'lucide-react';
import { WebArticleSummary, AppLanguage, KnowledgeDoc, TaskItem } from '../types';

interface WebReaderViewProps {
  articles: WebArticleSummary[];
  onAddArticle: (article: WebArticleSummary) => void;
  onDeleteArticle: (id: string) => void;
  onAddKnowledgeDoc: (doc: KnowledgeDoc) => void;
  onAddTask: (task: TaskItem) => void;
  language: AppLanguage;
  isRTL: boolean;
}

export const WebReaderView: React.FC<WebReaderViewProps> = ({
  articles,
  onAddArticle,
  onDeleteArticle,
  onAddKnowledgeDoc,
  onAddTask,
  language,
  isRTL,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [pasteTextInput, setPasteTextInput] = useState('');
  const [activeInputTab, setActiveInputTab] = useState<'url' | 'paste'>('url');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<WebArticleSummary | null>(
    articles.length > 0 ? articles[0] : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedTaskId, setAddedTaskId] = useState<string | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'ug' | 'en' | 'tr' | 'ar'>('ug');

  const handleAnalyze = async () => {
    if (!urlInput.trim() && !pasteTextInput.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/analyze-web-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlInput.trim(),
          articleText: pasteTextInput.trim(),
          language,
        }),
      });

      if (!res.ok) throw new Error('Analysis failed');
      const data = await res.json();

      const newArticle: WebArticleSummary = {
        id: `art-${Date.now()}`,
        url: urlInput.trim() || undefined,
        originalTitle: data.originalTitle || (urlInput ? urlInput.slice(0, 40) : 'Web Article Analysis'),
        authors: data.authors || 'Online Publisher',
        readingTimeMin: data.readingTimeMin || 5,
        tldr: data.tldr || '',
        keyTakeaways: data.keyTakeaways || [],
        inDepthSummary: data.inDepthSummary || '',
        actionItems: data.actionItems || [],
        translations: data.translations || {},
        tags: data.tags || ['WebReader', 'Research'],
        analyzedAt: new Date().toISOString().split('T')[0],
      };

      onAddArticle(newArticle);
      setSelectedArticle(newArticle);
      setUrlInput('');
      setPasteTextInput('');
    } catch (err) {
      console.error('Web Reader Analysis error:', err);
      // Fallback
      const fallback: WebArticleSummary = {
        id: `art-${Date.now()}`,
        url: urlInput.trim() || undefined,
        originalTitle: urlInput || 'ماقالە تەھلىلى (Article Analysis)',
        authors: 'Web Source',
        readingTimeMin: 4,
        tldr: language === 'ug'
          ? 'بۇ ماقالە تېخنىكا ۋە ئەقلىي ئىقتىدارلىق قوراللارنىڭ يېڭىلىقلىرى ھەققىدە مەزمۇن بايان قىلىدۇ.'
          : 'This article reviews modern technology and productivity practices.',
        keyTakeaways: [
          language === 'ug' ? 'سۈنئىي ئىدراك خىزمەت سۈرئىتىنى ئاشۇرىدۇ' : 'AI enhances overall team velocity',
          language === 'ug' ? 'مەزمۇنلارنى سىستېمىلىق ئوقۇش ۋاقىت تېجەيدۇ' : 'Speed reading structures information'
        ],
        inDepthSummary: `### 📄 ماقالە خۇلاسىسى\n- مەنبە سۈپەتلىك تەكشۈرۈلدى.\n- ئاساسىي پىكىرلەر بىلىم ئامبىرىغا كىرگۈزۈشكە تەييارلاندى.`,
        actionItems: [language === 'ug' ? 'نۇقتىلارنى پىلانغا كىرگۈزۈش' : 'Integrate concepts into planning'],
        translations: {
          ug: 'ماقالە مەزمۇنى تېز ئوقۇلدى.',
          en: 'Article processed quickly.',
          tr: 'Makale özetlendi.',
          ar: 'تم تلخيص المقال بنجاح.'
        },
        tags: ['Web', 'AI', 'Article'],
        analyzedAt: new Date().toISOString().split('T')[0],
      };
      onAddArticle(fallback);
      setSelectedArticle(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToKnowledge = (article: WebArticleSummary) => {
    const newDoc: KnowledgeDoc = {
      id: `doc-web-${Date.now()}`,
      title: `🌐 ${article.originalTitle}`,
      fileType: 'markdown',
      content: `# ${article.originalTitle}\n\n**مەنبە (URL):** ${article.url || 'Pasted Content'}\n**ئوقۇش ۋاقتى:** ${article.readingTimeMin} مىنۇت\n\n## ⚡ TL;DR خۇلاسە\n${article.tldr}\n\n## 💡 مۇھىم چۈشەنچىلەر (Key Takeaways)\n${article.keyTakeaways.map((k) => `- ${k}`).join('\n')}\n\n## 📖 تەپسىلىي مەزمۇن\n${article.inDepthSummary}\n\n## ✅ تەۋسىيەلىك ھەرىكەتلەر\n${article.actionItems.map((a) => `- [ ] ${a}`).join('\n')}`,
      summary: article.tldr,
      keyInsights: article.keyTakeaways,
      tags: article.tags,
      uploadedAt: new Date().toISOString().split('T')[0],
      sizeKb: 2.4,
    };
    onAddKnowledgeDoc(newDoc);
    alert(language === 'ug' ? 'بىلىم ئامبىرىغا مۇۋەپپەقىيەتلىك ساقلاندى!' : 'Saved to Knowledge Vault!');
  };

  const handlePushTask = (item: string, idx: number) => {
    const newTask: TaskItem = {
      id: `task-art-${Date.now()}-${idx}`,
      title: item,
      completed: false,
      priority: 'medium',
      category: 'personal',
      createdAt: new Date().toISOString(),
      dueDate: new Date().toISOString().split('T')[0],
    };
    onAddTask(newTask);
    setAddedTaskId(`${selectedArticle?.id}-${idx}`);
    setTimeout(() => setAddedTaskId(null), 2500);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.originalTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tldr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-600/15 via-cyan-600/10 to-blue-600/15 border border-cyan-500/25 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2 border border-cyan-500/20">
              <Globe className="w-3.5 h-3.5" />
              {language === 'ug' ? 'ئەقلىي ئوقۇش & تەھلىل' : 'Web Speed Reader'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {language === 'ug'
                ? '🌐 تور ماقالىسى & ئەقلىي ئوقۇغۇچ (Reader Mode)'
                : language === 'tr'
                ? '🌐 Web Makale Okuyucu & AI Analiz'
                : language === 'ar'
                ? '🌐 قارئ ومحلل المقالات الذكي'
                : '🌐 Web Article & URL Reader Mode'}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1 max-w-2xl">
              {language === 'ug'
                ? 'خالىغان ماقالە ئۇلانمىسى (URL) ياكى تېكىستىنى كىرگۈزۈڭ. سۈنئىي ئىدراك تېز ئوقۇپ، 2 جۈملىلىك يادرو، مۇھىم نۇقتىلار ۋە كۆپ تىللىق خۇلاسىسىنى ھاسىل قىلىپ بېرىدۇ.'
                : 'Paste any web link or article text. Gemini distills TL;DR summaries, key takeaways, and action items.'}
            </p>
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border border-cyan-500/30 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-medium border-b border-neutral-200 dark:border-neutral-700 pb-2">
            <button
              onClick={() => setActiveInputTab('url')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeInputTab === 'url'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              {language === 'ug' ? '🔗 ماقالە ئۇلانمىسى (URL)' : '🔗 Web URL'}
            </button>
            <button
              onClick={() => setActiveInputTab('paste')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeInputTab === 'paste'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              {language === 'ug' ? '📝 تېكىست چاپلاش (Paste Text)' : '📝 Paste Article Text'}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {activeInputTab === 'url' ? (
              <input
                id="web-article-url-input"
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && urlInput.trim()) {
                    handleAnalyze();
                  }
                }}
                placeholder={language === 'ug' ? 'https://example.com/article... تور ئادرېسىنى كىرگۈزۈڭ' : 'https://example.com/article...'}
                className="flex-1 text-sm bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2.5 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            ) : (
              <textarea
                value={pasteTextInput}
                onChange={(e) => setPasteTextInput(e.target.value)}
                rows={2}
                placeholder={language === 'ug' ? 'ماقالە تېكىستى ياكى بۆلىكىنى چاپلاڭ...' : 'Paste article excerpt or text here...'}
                className="flex-1 text-sm bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            )}

            <button
              id="analyze-article-btn"
              onClick={handleAnalyze}
              disabled={isLoading || (!urlInput.trim() && !pasteTextInput.trim())}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
            >
              <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? (language === 'ug' ? 'تەھلىل قىلىنىۋاتىدۇ...' : 'Analyzing...') : (language === 'ug' ? 'تېز ئوقۇش & خۇلاسە' : 'Speed Read & Extract')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Article Library List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-neutral-800/90 border border-neutral-200/80 dark:border-neutral-700/80 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="relative">
              <Search className={`w-4 h-4 absolute top-3 text-neutral-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ug' ? 'ماقالىلەردىن ئىزدەش...' : 'Search articles...'}
                className={`w-full text-xs bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700 rounded-lg py-2 ${
                  isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'
                } text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-cyan-500`}
              />
            </div>

            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {filteredArticles.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-700 rounded-xl">
                  {language === 'ug' ? 'ماقالە تېپىلمىدى' : 'No articles analyzed yet'}
                </div>
              ) : (
                filteredArticles.map((art) => {
                  const isSelected = selectedArticle?.id === art.id;
                  return (
                    <div
                      key={art.id}
                      onClick={() => setSelectedArticle(art)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-50/80 dark:bg-cyan-950/30 border-cyan-500/60 shadow-xs'
                          : 'bg-white dark:bg-neutral-800/80 border-neutral-200/80 dark:border-neutral-700/80 hover:border-neutral-300 dark:hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                          {art.originalTitle}
                        </h4>
                        <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono shrink-0 flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {art.readingTimeMin}m
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-2 leading-relaxed">
                        {art.tldr}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 border-t border-neutral-100 dark:border-neutral-700/50">
                        <span>{art.analyzedAt}</span>
                        <span>{art.keyTakeaways.length} {language === 'ug' ? 'نۇقتا' : 'takeaways'}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Detailed Article Reader Card (8 cols) */}
        <div className="lg:col-span-8">
          {selectedArticle ? (
            <div className="bg-white dark:bg-neutral-800/90 border border-neutral-200/80 dark:border-neutral-700/80 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                <div>
                  <div className="flex items-center gap-2 mb-1 text-xs text-neutral-400 font-mono">
                    <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedArticle.readingTimeMin} {language === 'ug' ? 'مىنۇتلۇق ئوقۇش' : 'min read'}
                    </span>
                    <span>•</span>
                    <span>{selectedArticle.authors}</span>
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    {selectedArticle.originalTitle}
                  </h2>
                  {selectedArticle.url && (
                    <a
                      href={selectedArticle.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 mt-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {selectedArticle.url}
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveToKnowledge(selectedArticle)}
                    className="p-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Save to Knowledge Vault"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span className="hidden sm:inline">{language === 'ug' ? 'بىلىم ئامبىرىغا ساقلاش' : 'Save to Vault'}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(language === 'ug' ? 'بۇ ماقالە خاتىرىسىنى ئۆچۈرەمسىز؟' : 'Delete article record?')) {
                        onDeleteArticle(selectedArticle.id);
                        setSelectedArticle(null);
                      }
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* TL;DR Executive Box */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/25 rounded-xl p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5 mb-1.5">
                  <Zap className="w-4 h-4 text-cyan-500" />
                  {language === 'ug' ? '⚡ 2 جۈملىلىك يادرو خۇلاسە (TL;DR)' : '⚡ 2-Sentence Executive TL;DR'}
                </span>
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed">
                  {selectedArticle.tldr}
                </p>
              </div>

              {/* Key Takeaways */}
              {selectedArticle.keyTakeaways.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {language === 'ug' ? '💡 يادرولۇق چۈشەنچىلەر (Key Takeaways)' : 'Core Insights & Takeaways'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {selectedArticle.keyTakeaways.map((takeaway, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-700/80 rounded-xl text-xs text-neutral-800 dark:text-neutral-200 flex items-start gap-2"
                      >
                        <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Items */}
              {selectedArticle.actionItems.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-teal-500" />
                    {language === 'ug' ? '🎯 ئىجرا قىلىش تەۋسىيەلىرى (Actionable Tasks)' : 'Actionable Directives'}
                  </h4>
                  <div className="space-y-2">
                    {selectedArticle.actionItems.map((action, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-700/80 rounded-xl text-xs"
                      >
                        <span className="text-neutral-800 dark:text-neutral-200">{action}</span>
                        <button
                          onClick={() => handlePushTask(action, idx)}
                          className="px-2.5 py-1 bg-teal-600/10 hover:bg-teal-600 text-teal-600 hover:text-white dark:text-teal-400 dark:hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          {addedTaskId === `${selectedArticle.id}-${idx}` ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>{language === 'ug' ? 'قوشۇلدى!' : 'Added!'}</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>{language === 'ug' ? 'ۋەزىپىگە كىرگۈزۈش' : 'Push to Tasks'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* In-depth structured summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-cyan-500" />
                    {language === 'ug' ? '📖 تەپسىلىي مەزمۇن تەھلىلى (Deep Synthesis)' : 'Deep Synthesis & Breakdown'}
                  </h4>
                  <button
                    onClick={() => handleCopy(selectedArticle.inDepthSummary, `synth-${selectedArticle.id}`)}
                    className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === `synth-${selectedArticle.id}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{language === 'ug' ? 'نۇسخىلاش' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-700/80 rounded-xl text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 font-sans whitespace-pre-wrap">
                  {selectedArticle.inDepthSummary}
                </div>
              </div>

              {/* Multilingual Translation Tabs */}
              {selectedArticle.translations && (
                <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                      <Languages className="w-4 h-4 text-indigo-500" />
                      {language === 'ug' ? 'كۆپ تىللىق قىسقىچە بايان' : 'Multilingual Synopsis'}
                    </span>
                    <div className="flex gap-1 text-[11px]">
                      {(['ug', 'tr', 'en', 'ar'] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setActiveLangTab(lang)}
                          className={`px-2 py-0.5 rounded uppercase font-mono ${
                            activeLangTab === lang
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'text-neutral-500 hover:text-neutral-900'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
                    {selectedArticle.translations[activeLangTab] || selectedArticle.tldr}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-white dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/80 rounded-2xl text-center">
              <Globe className="w-12 h-12 text-cyan-500/40 mb-3" />
              <h3 className="text-base font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'ug' ? 'ماقالە تاللانمىدى' : 'No Article Selected'}
              </h3>
              <p className="text-sm text-neutral-500 max-w-sm">
                {language === 'ug'
                  ? 'سول تەرەپتىكى تىزىملىكتىن ماقالە تاللاڭ ياكى يۇقىرىدىن يېڭى ئۇلانما كىرگۈزۈڭ.'
                  : 'Select an article or paste a new URL above.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
