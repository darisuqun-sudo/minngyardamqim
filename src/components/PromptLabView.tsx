import React, { useState } from 'react';
import {
  Terminal,
  Sparkles,
  Play,
  Copy,
  Check,
  Plus,
  Trash2,
  Code,
  Mail,
  BookOpen,
  Globe,
  FileText,
  RotateCw,
  Sliders,
  BookmarkPlus,
} from 'lucide-react';
import { AppLanguage, PromptTemplate, PromptVariable } from '../types';

interface PromptLabViewProps {
  lang: AppLanguage;
  templates: PromptTemplate[];
  onAddTemplate: (tpl: PromptTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onSaveResultAsNote: (title: string, content: string) => void;
}

export const PromptLabView: React.FC<PromptLabViewProps> = ({
  lang,
  templates,
  onAddTemplate,
  onDeleteTemplate,
  onSaveResultAsNote,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [outputResult, setOutputResult] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [savedNote, setSavedNote] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New template form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<PromptTemplate['category']>('custom');
  const [newDesc, setNewDesc] = useState('');
  const [newSystemPrompt, setNewSystemPrompt] = useState('');
  const [newUserPrompt, setNewUserPrompt] = useState('');
  const [newVarName, setNewVarName] = useState('');
  const [newVarLabel, setNewVarLabel] = useState('');
  const [newVarList, setNewVarList] = useState<PromptVariable[]>([]);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];

  const filteredTemplates =
    categoryFilter === 'all'
      ? templates
      : templates.filter((t) => t.category === categoryFilter);

  const getVariableValue = (varName: string, defaultValue = '') => {
    return variableValues[varName] !== undefined ? variableValues[varName] : defaultValue;
  };

  const handleVariableChange = (varName: string, val: string) => {
    setVariableValues((prev) => ({ ...prev, [varName]: val }));
  };

  const handleRunPrompt = async () => {
    if (!selectedTemplate || isRunning) return;
    setIsRunning(true);
    setOutputResult('');
    setSavedNote(false);

    let filledPrompt = selectedTemplate.userPromptTemplate;
    selectedTemplate.variables.forEach((v) => {
      const val = getVariableValue(v.name, v.defaultValue);
      filledPrompt = filledPrompt.replace(new RegExp(`{{${v.name}}}`, 'g'), val);
    });

    try {
      const res = await fetch('/api/run-prompt-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: selectedTemplate.systemPrompt,
          filledPrompt,
          language: lang,
        }),
      });

      const data = await res.json();
      setOutputResult(data.result || data.error || 'No output generated');
    } catch (e: any) {
      setOutputResult(`Execution Error: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    if (!outputResult) return;
    navigator.clipboard.writeText(outputResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNote = () => {
    if (!outputResult || !selectedTemplate) return;
    onSaveResultAsNote(
      `${selectedTemplate.title} - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      outputResult
    );
    setSavedNote(true);
    setTimeout(() => setSavedNote(false), 2500);
  };

  const handleAddVarToNew = () => {
    if (!newVarName.trim() || !newVarLabel.trim()) return;
    setNewVarList((prev) => [
      ...prev,
      {
        name: newVarName.trim(),
        label: newVarLabel.trim(),
        placeholder: `${newVarLabel}...`,
        type: 'textarea',
      },
    ]);
    setNewVarName('');
    setNewVarLabel('');
  };

  const handleCreateTemplate = () => {
    if (!newTitle.trim() || !newUserPrompt.trim()) return;

    const newTpl: PromptTemplate = {
      id: `pt-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      description: newDesc.trim() || 'ئىختىيارى لايىھەلەنگەن بۇيرۇق ئەندىزىسى',
      icon: 'Terminal',
      systemPrompt: newSystemPrompt.trim(),
      userPromptTemplate: newUserPrompt.trim(),
      variables: newVarList,
      isCustom: true,
    };

    onAddTemplate(newTpl);
    setSelectedTemplateId(newTpl.id);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewSystemPrompt('');
    setNewUserPrompt('');
    setNewVarList([]);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'coding':
        return Code;
      case 'writing':
        return Mail;
      case 'learning':
        return BookOpen;
      case 'translation':
        return Globe;
      default:
        return Terminal;
    }
  };

  return (
    <div id="prompt-lab-container" className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg space-y-3 border border-indigo-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 backdrop-blur-md flex items-center justify-center border border-indigo-500/30">
              <Terminal className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {lang === 'ug'
                  ? '⚡ ئەقلىي بۇيرۇق سېخى & قېلىپلار (Prompt Lab)'
                  : lang === 'tr'
                  ? '⚡ AI İstem Atölyesi & Özel Şablonlar'
                  : lang === 'ar'
                  ? '⚡ مختبر الأوامر وقوالب الذكاء الاصطناعي'
                  : '⚡ AI Prompt Lab & Custom Templates'}
              </h2>
              <p className="text-xs text-indigo-200/80">
                {lang === 'ug'
                  ? 'يۇقىرى ئۈنۈملۈك قايتا ئىشلىتىلىدىغان سىستېما بۇيرۇقلىرى ۋە تەييار ئەندىزىلەر'
                  : 'High-precision generative prompt templates with variable injection'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'ug' ? 'يېڭى قېلىپ قۇرۇش' : 'Create Template'}</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', labelUg: 'ھەممىسى', labelEn: 'All' },
          { key: 'coding', labelUg: '💻 كود & تېخنىكا', labelEn: 'Coding' },
          { key: 'writing', labelUg: '✍️ يېزىقچىلىق & ئېلخەت', labelEn: 'Writing' },
          { key: 'learning', labelUg: '📚 بىلىم & ئۆگىنىش', labelEn: 'Learning' },
          { key: 'translation', labelUg: '🌐 كۆپ تىللىق تەرجىمە', labelEn: 'Translation' },
          { key: 'custom', labelUg: '⭐ ئۆزۈمنىڭ قېلىپلىرى', labelEn: 'My Custom' },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategoryFilter(cat.key)}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              categoryFilter === cat.key
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            {lang === 'ug' ? cat.labelUg : cat.labelEn}
          </button>
        ))}
      </div>

      {/* 2-Column Interface: Left Templates List, Right Prompt Runner & Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Templates (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
          {filteredTemplates.map((tpl) => {
            const Icon = getCategoryIcon(tpl.category);
            const isSelected = tpl.id === selectedTemplate?.id;
            return (
              <button
                key={tpl.id}
                onClick={() => {
                  setSelectedTemplateId(tpl.id);
                  setOutputResult('');
                }}
                className={`w-full p-4 rounded-3xl text-left border transition-all relative group ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 shadow-xs text-indigo-950 dark:text-indigo-100 ring-1 ring-indigo-500/50'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold leading-tight">{tpl.title}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {tpl.description}
                    </p>
                  </div>
                </div>

                {tpl.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTemplate(tpl.id);
                    }}
                    className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete template"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Execution & Variables Area (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedTemplate ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedTemplate.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedTemplate.description}
                  </p>
                </div>

                <button
                  onClick={handleRunPrompt}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isRunning ? (
                    <RotateCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 fill-white" />
                  )}
                  <span>{isRunning ? 'ئىجرا قىلىنىۋاتىدۇ...' : 'ئىجرا قىلىش (Run)'}</span>
                </button>
              </div>

              {/* Dynamic Variable Inputs */}
              {selectedTemplate.variables.length > 0 && (
                <div className="space-y-3 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{lang === 'ug' ? 'ئۆزگەرگۈچى پارامېتىرلار:' : 'Template Variables:'}</span>
                  </div>

                  <div className="space-y-3">
                    {selectedTemplate.variables.map((v) => (
                      <div key={v.name} className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          {v.label} <code className="text-indigo-500 text-[10px]">({`{{${v.name}}}`})</code>
                        </label>
                        {v.type === 'textarea' ? (
                          <textarea
                            rows={3}
                            value={getVariableValue(v.name, v.defaultValue)}
                            onChange={(e) => handleVariableChange(v.name, e.target.value)}
                            placeholder={v.placeholder}
                            className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                          />
                        ) : (
                          <input
                            type="text"
                            value={getVariableValue(v.name, v.defaultValue)}
                            onChange={(e) => handleVariableChange(v.name, e.target.value)}
                            placeholder={v.placeholder}
                            className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Output Result Console */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {lang === 'ug' ? '⚡ AI چىقىرىش نەتىجىسى (Output):' : 'AI Output Console:'}
                  </span>

                  {outputResult && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs hover:bg-slate-200 transition-colors"
                      >
                        {copied ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copied ? 'كۆچۈرۈلدى' : 'كۆچۈرۈش'}</span>
                      </button>

                      <button
                        onClick={handleSaveNote}
                        className="flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 text-xs hover:bg-indigo-100 transition-colors"
                      >
                        {savedNote ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <BookmarkPlus className="w-3 h-3" />
                        )}
                        <span>{savedNote ? 'خاتىرىلەندى' : 'خاتىرىگە ساقلاش'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="min-h-[160px] p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap border border-slate-800">
                  {outputResult || (
                    <span className="text-slate-500 italic">
                      {lang === 'ug'
                        ? 'نەتىجە تېخى يوق. «ئىجرا قىلىش» نى بېسىڭ...'
                        : 'No output generated yet. Click "Run" to test this prompt template.'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              {lang === 'ug' ? 'قېلىپ تاللاڭ' : 'Select a template'}
            </div>
          )}
        </div>
      </div>

      {/* Create Custom Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in-50">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600" />
                {lang === 'ug' ? 'يېڭى خاس ئەندىزە قۇرۇش' : 'Create Custom Prompt Template'}
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">ئەندىزە ئىسمى (Title):</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Code Refactor Guru..."
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">چۈشەندۈرۈش:</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Short description..."
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">سىستېما بۇيرۇقى (System Instruction):</label>
                <input
                  type="text"
                  value={newSystemPrompt}
                  onChange={(e) => setNewSystemPrompt(e.target.value)}
                  placeholder="You are an expert software engineer..."
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">بۇيرۇق تېكىستى (Use {'{{var}}'} for variables):</label>
                <textarea
                  rows={4}
                  value={newUserPrompt}
                  onChange={(e) => setNewUserPrompt(e.target.value)}
                  placeholder="Please review {{code}} for bugs..."
                  className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                />
              </div>

              {/* Add Variable Section */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold block text-slate-700 dark:text-slate-300">ئۆزگەرگۈچى قوشۇش:</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newVarName}
                    onChange={(e) => setNewVarName(e.target.value)}
                    placeholder="Var Name (e.g. code)"
                    className="w-1/2 p-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                  />
                  <input
                    type="text"
                    value={newVarLabel}
                    onChange={(e) => setNewVarLabel(e.target.value)}
                    placeholder="Label (e.g. كود پارچىسى)"
                    className="w-1/2 p-2 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddVarToNew}
                    className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                  >
                    قوشۇش
                  </button>
                </div>

                {newVarList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {newVarList.map((v, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {`{{${v.name}}}`}: {v.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
              >
                بىكار قىلىش
              </button>
              <button
                onClick={handleCreateTemplate}
                disabled={!newTitle.trim() || !newUserPrompt.trim()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold disabled:opacity-50 shadow-md"
              >
                ساقلاش
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
