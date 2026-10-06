import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  Sparkles,
  Search,
  Tag,
  Trash2,
  BookOpen,
  Send,
  CheckCircle2,
  FileCode,
  FileJson,
  Layers,
  ArrowRight,
  ArrowLeft,
  Copy,
  Pin,
  Download,
  FileSignature,
} from 'lucide-react';
import { AppLanguage, KnowledgeDoc } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface KnowledgeBaseViewProps {
  lang: AppLanguage;
  docs: KnowledgeDoc[];
  onAddDoc: (doc: KnowledgeDoc) => void;
  onTogglePinDoc?: (id: string) => void;
  onDeleteDoc: (id: string) => void;
}

const DOC_TEMPLATES = [
  {
    title: 'Product Requirement Document (PRD)',
    fileType: 'markdown' as const,
    content: `# Product Requirement Document (PRD)

## 1. Problem Statement
Describe the core user problem this feature or product solves.

## 2. Goals & Success Metrics
- Target Metric 1: 99.9% uptime
- User Adoption: 10,000 MAU within 3 months

## 3. User Stories & Acceptance Criteria
- As a user, I want to authenticate securely using OAuth so that my credentials stay safe.
- As an admin, I want real-time analytics to track team performance.

## 4. Technical Constraints & Non-Functional Requirements
- Response time under 200ms
- End-to-end data encryption`,
  },
  {
    title: 'Architecture & System Design',
    fileType: 'markdown' as const,
    content: `# Architecture & System Design Document

## 1. Architecture Overview
Distributed micro-services with an event-driven message queue.

\`\`\`
[Client SPA] ---> [API Gateway / Cloudflare]
                       |
        +--------------+--------------+
        |                             |
[Auth Service]                 [Core Backend]
        |                             |
 [Redis Cache]                 [PostgreSQL DB]
\`\`\`

## 2. Database Schema
- Users (id, email, password_hash, created_at)
- Workspaces (id, owner_id, name, tier)
- Events (id, workspace_id, event_type, payload)

## 3. Scalability & Resilience Strategy
- Multi-region database read-replicas
- Automatic horizontal pod autoscaling`,
  },
  {
    title: 'Engineering Postmortem / Incident Report',
    fileType: 'markdown' as const,
    content: `# Incident Postmortem: [Incident Name]

## Date & Severity
- **Date**: ${new Date().toISOString().slice(0, 10)}
- **Severity**: SEV-2
- **Downtime**: 18 minutes

## Incident Summary
High memory usage on the background job worker caused container restarts.

## Root Cause Analysis (5 Whys)
1. Job queue backed up with 50,000 unbatched tasks.
2. Database query lacked an indexed timestamp filter.

## Action Items & Preventative Measures
- [ ] Add compound index on \`tasks(status, created_at)\`
- [ ] Implement rate limiting on job dispatchers`,
  },
];

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  lang,
  docs,
  onAddDoc,
  onTogglePinDoc,
  onDeleteDoc,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRTL = lang === 'ug' || lang === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [selectedDocId, setSelectedDocId] = useState<string>(docs[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // New Doc Form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newFileType, setNewFileType] = useState<KnowledgeDoc['fileType']>('markdown');

  // Grounded Q&A State
  const [docQuestion, setDocQuestion] = useState('');
  const [qaAnswer, setQaAnswer] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);

  const selectedDoc = docs.find((d) => d.id === selectedDocId) || docs[0];

  // All unique tags
  const allTags = Array.from(new Set(docs.flatMap((d) => d.tags || [])));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = (event.target?.result as string) || '';
      const title = file.name.replace(/\.[^/.]+$/, '');
      let fileType: KnowledgeDoc['fileType'] = 'text';
      if (file.name.endsWith('.md')) fileType = 'markdown';
      else if (file.name.endsWith('.json')) fileType = 'json';
      else if (file.name.endsWith('.ts') || file.name.endsWith('.js')) fileType = 'code';

      await processAndAddDoc(title, content, fileType);
    };
    reader.readAsText(file);
  };

  const processAndAddDoc = async (title: string, content: string, fileType: KnowledgeDoc['fileType']) => {
    setIsUploading(true);
    try {
      const res = await fetch('/api/analyze-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          language: lang,
        }),
      });

      const data = await res.json();
      const newDoc: KnowledgeDoc = {
        id: `doc-${Date.now()}`,
        title,
        content,
        fileType,
        summary: data.summary || 'Summary generated',
        keyInsights: data.insights || ['Grounded in knowledge base'],
        tags: data.suggestedTags || ['knowledge', 'doc'],
        uploadedAt: new Date().toISOString().slice(0, 10),
        sizeKb: parseFloat((content.length / 1024).toFixed(1)),
        pinned: false,
      };

      onAddDoc(newDoc);
      setSelectedDocId(newDoc.id);
      setShowUploadModal(false);
      setNewTitle('');
      setNewContent('');
    } catch (e) {
      console.error('Failed to analyze document:', e);
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    await processAndAddDoc(newTitle, newContent, newFileType);
  };

  const handleApplyTemplate = (tpl: typeof DOC_TEMPLATES[0]) => {
    setNewTitle(tpl.title);
    setNewContent(tpl.content);
    setNewFileType(tpl.fileType);
  };

  const handleAskDocQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docQuestion.trim() || !selectedDoc) return;

    setIsAnswering(true);
    setQaAnswer('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Based strictly on this document titled "${selectedDoc.title}":\n\nDocument Content:\n${selectedDoc.content}\n\nQuestion: ${docQuestion}\n\nPlease reply in ${lang === 'ug' ? 'Uyghur' : lang === 'tr' ? 'Turkish' : lang === 'ar' ? 'Arabic' : 'English'}.` }],
          persona: 'planner',
        }),
      });
      let reply = '';
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        reply = data.reply || data.fallback || '';
      } else {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          reply = data.reply || data.fallback || '';
        } catch {
          reply = text;
        }
      }
      setQaAnswer(reply || 'جاۋاب قوبۇل قىلىندى.');
    } catch (e) {
      console.error('Q&A failed:', e);
    } finally {
      setIsAnswering(false);
    }
  };

  const filteredDocs = docs
    .filter((d) => {
      const matchesSearch =
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.tags.some((tItem) => tItem.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = selectedTag === 'all' || d.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });

  return (
    <div id="knowledge-base-container" className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t.knowledgeTitle}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.knowledgeDesc}
          </p>
        </div>

        <button
          id="upload-doc-modal-btn"
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <UploadCloud className="w-4 h-4" />
          <span>{t.uploadDocument}</span>
        </button>
      </div>

      {/* Main Grid: Left Doc List & Right Document Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Docs List & Search */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchKnowledge}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Tag Filter Chips */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pb-1">
              <button
                onClick={() => setSelectedTag('all')}
                className={`text-[10px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedTag === 'all'
                    ? 'bg-violet-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                All ({docs.length})
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`text-[10px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                    selectedTag === tag
                      ? 'bg-violet-600 text-white font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Docs List */}
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredDocs.map((doc) => {
              const isSelected = doc.id === selectedDocId;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer group relative ${
                    isSelected
                      ? 'bg-violet-50 dark:bg-violet-950/40 border-violet-300 dark:border-violet-700 shadow-xs'
                      : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 font-semibold border border-slate-200 dark:border-slate-800">
                        {doc.fileType} • {doc.sizeKb} KB
                      </span>
                      {doc.pinned && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5">
                          <Pin className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                          <span>Pinned</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {doc.uploadedAt}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-2 line-clamp-1 group-hover:text-violet-600 transition-colors">
                    {doc.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {doc.summary || doc.content}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {doc.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Document Intelligence & RAG Chat */}
        <div className="lg:col-span-2 space-y-6">
          {selectedDoc ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
              {/* Document Title & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedDoc.title}
                    </h2>
                    {selectedDoc.pinned && (
                      <Pin className="w-4 h-4 text-amber-500 fill-amber-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span>Uploaded: {selectedDoc.uploadedAt}</span>
                    <span>•</span>
                    <span>Size: {selectedDoc.sizeKb} KB</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onTogglePinDoc && (
                    <button
                      onClick={() => onTogglePinDoc(selectedDoc.id)}
                      title={selectedDoc.pinned ? 'Unpin Document' : 'Pin Document to Top'}
                      className={`p-2 rounded-xl border transition-colors ${
                        selectedDoc.pinned
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Pin className={`w-4 h-4 ${selectedDoc.pinned ? 'fill-amber-500' : ''}`} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const blob = new Blob([selectedDoc.content], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${selectedDoc.title.replace(/\s+/g, '-')}.md`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    title="Export as Markdown"
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(selectedDoc.content)}
                    title="Copy Content"
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteDoc(selectedDoc.id)}
                    title="Delete Document"
                    className="p-2 rounded-xl border border-transparent text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* AI Key Insights Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/20 border border-violet-200/80 dark:border-violet-800/60 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-violet-700 dark:text-violet-300">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{t.keyInsightsHeading}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {(selectedDoc.keyInsights || []).map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Document Summary */}
              {selectedDoc.summary && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {t.docSummaryHeading}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    {selectedDoc.summary}
                  </p>
                </div>
              )}

              {/* Full Document Content Box */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Raw Content ({selectedDoc.fileType})
                </h3>
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-60 leading-relaxed">
                  <pre>{selectedDoc.content}</pre>
                </div>
              </div>

              {/* Grounded Document Q&A */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <span>{t.askDocQuestion}</span>
                </h3>

                <form onSubmit={handleAskDocQuestion} className="flex gap-2">
                  <input
                    type="text"
                    value={docQuestion}
                    onChange={(e) => setDocQuestion(e.target.value)}
                    placeholder="e.g. What are the key architecture points mentioned?"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <button
                    type="submit"
                    disabled={isAnswering || !docQuestion.trim()}
                    className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <span>Ask</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                {qaAnswer && (
                  <div className="p-4 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/60 text-xs text-slate-800 dark:text-slate-200 leading-relaxed animate-in fade-in">
                    <p className="font-semibold text-violet-600 dark:text-violet-400 mb-1">
                      AI Answer:
                    </p>
                    <p>{qaAnswer}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.noDocsYet}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload / Add Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.uploadDocument}
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Quick Templates */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Quick Document Templates:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {DOC_TEMPLATES.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 hover:bg-violet-100 transition-colors flex items-center gap-1"
                  >
                    <FileSignature className="w-3 h-3" />
                    <span>{tpl.title.split(' ')[0]} {tpl.title.split(' ')[1] || ''}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Drag & Drop File Input */}
            <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-violet-500 dark:hover:border-violet-500 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
              <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-violet-500 transition-colors" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2">
                Click to select a file (.txt, .md, .json, .ts)
              </span>
              <span className="text-[10px] text-slate-400 mt-1">
                {t.supportedFileTypes}
              </span>
              <input
                type="file"
                accept=".txt,.md,.json,.ts,.js,.py,.html,.css"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              <span className="flex-shrink mx-4 text-[11px] text-slate-400 uppercase">OR Paste / Edit Manually</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            </div>

            {/* Manual Form */}
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Architecture Principles & DB Schema"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  File Type
                </label>
                <select
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="markdown">Markdown (.md)</option>
                  <option value="text">Plain Text (.txt)</option>
                  <option value="code">Code Snippet (.ts / .js)</option>
                  <option value="json">JSON (.json)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Content
                </label>
                <textarea
                  rows={5}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste or write your document content here..."
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isUploading ? 'animate-spin' : ''}`} />
                  <span>{isUploading ? t.analyzingDocument : 'Add & Analyze with AI'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
