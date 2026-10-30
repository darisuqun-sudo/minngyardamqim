import React, { useState } from 'react';
import {
  Target,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Award,
  ChevronRight,
  Filter,
  Check,
  Zap,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { OKRGoal, OKRKeyResult, OKRMilestone, AppLanguage, TaskItem } from '../types';

interface OKRGoalsViewProps {
  okrGoals: OKRGoal[];
  onAddGoal: (goal: OKRGoal) => void;
  onUpdateGoal: (goal: OKRGoal) => void;
  onDeleteGoal: (id: string) => void;
  onAddTask: (task: TaskItem) => void;
  language: AppLanguage;
  isRTL: boolean;
}

export const OKRGoalsView: React.FC<OKRGoalsViewProps> = ({
  okrGoals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  onAddTask,
  language,
  isRTL,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAiModal, setShowAiModal] = useState(false);
  const [objectiveInput, setObjectiveInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<OKRGoal['category']>('project');
  const [quarterInput, setQuarterInput] = useState('2026 Q3-Q4');
  const [isGenerating, setIsGenerating] = useState(false);
  const [addedMilestoneId, setAddedMilestoneId] = useState<string | null>(null);

  const handleGenerateOkr = async () => {
    if (!objectiveInput.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-okr-breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objective: objectiveInput.trim(),
          category: categoryInput,
          quarter: quarterInput,
          language,
        }),
      });

      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();

      const newGoal: OKRGoal = {
        id: `okr-${Date.now()}`,
        title: data.title || objectiveInput.slice(0, 40),
        objective: data.objective || objectiveInput,
        quarter: data.quarter || quarterInput,
        category: data.category || categoryInput,
        status: 'on-track',
        dueDate: data.dueDate || '2026-11-30',
        aiStrategicAdvice: data.aiStrategicAdvice || '',
        createdAt: new Date().toISOString().split('T')[0],
        keyResults: data.keyResults || [
          {
            id: `kr-${Date.now()}-1`,
            title: language === 'ug' ? 'ئاساسىي قۇرۇلمىنى تاماملاش' : 'Complete core architecture',
            currentValue: 0,
            targetValue: 100,
            unit: '%',
            progressPercentage: 0,
            milestones: [
              { id: `m-${Date.now()}-1`, title: language === 'ug' ? 'دەسلەپكى نۇسخا سىنىقى' : 'Alpha testing', completed: false }
            ]
          }
        ]
      };

      onAddGoal(newGoal);
      setShowAiModal(false);
      setObjectiveInput('');
    } catch (err) {
      console.error('OKR Generation error:', err);
      // Fallback goal
      const fallbackGoal: OKRGoal = {
        id: `okr-${Date.now()}`,
        title: objectiveInput.slice(0, 40),
        objective: objectiveInput,
        quarter: quarterInput,
        category: categoryInput,
        status: 'on-track',
        dueDate: '2026-10-31',
        aiStrategicAdvice: language === 'ug' ? 'كۈندىلىك باسقۇچلارنى ئىزچىل تەكرارلاپ تۇرۇڭ.' : 'Maintain weekly execution rhythm.',
        createdAt: new Date().toISOString().split('T')[0],
        keyResults: [
          {
            id: `kr-${Date.now()}-1`,
            title: language === 'ug' ? 'ئاساسىي نىشاننى ئەمەلگە ئاشۇرۇش' : 'Achieve core milestone',
            currentValue: 20,
            targetValue: 100,
            unit: '%',
            progressPercentage: 20,
            milestones: [
              { id: `m-${Date.now()}-1`, title: language === 'ug' ? '1-باسقۇچ سىنىقى' : 'Phase 1 verification', completed: true }
            ]
          }
        ]
      };
      onAddGoal(fallbackGoal);
      setShowAiModal(false);
      setObjectiveInput('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleMilestone = (goal: OKRGoal, krId: string, milestoneId: string) => {
    const updatedKeyResults = goal.keyResults.map((kr) => {
      if (kr.id !== krId) return kr;
      const updatedMilestones = kr.milestones.map((m) =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );
      const completedCount = updatedMilestones.filter((m) => m.completed).length;
      const totalCount = updatedMilestones.length;
      const calcProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : kr.progressPercentage;

      return {
        ...kr,
        milestones: updatedMilestones,
        progressPercentage: calcProgress,
      };
    });

    onUpdateGoal({
      ...goal,
      keyResults: updatedKeyResults,
    });
  };

  const handlePushMilestoneToTasks = (milestone: OKRMilestone) => {
    const newTask: TaskItem = {
      id: `task-okr-${Date.now()}`,
      title: `🎯 [OKR] ${milestone.title}`,
      completed: false,
      priority: 'high',
      category: 'planning',
      createdAt: new Date().toISOString(),
      dueDate: milestone.dueDate || new Date().toISOString().split('T')[0],
    };
    onAddTask(newTask);
    setAddedMilestoneId(milestone.id);
    setTimeout(() => setAddedMilestoneId(null), 2500);
  };

  const filteredGoals = okrGoals.filter((g) => {
    const matchCat = selectedCategory === 'all' || g.category === selectedCategory;
    const matchStatus = selectedStatus === 'all' || g.status === selectedStatus;
    return matchCat && matchStatus;
  });

  const getStatusBadge = (status: OKRGoal['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {language === 'ug' ? 'تاماملاندى' : 'Completed'}
          </span>
        );
      case 'at-risk':
        return (
          <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {language === 'ug' ? 'خەتەر بار' : 'At Risk'}
          </span>
        );
      case 'behind':
        return (
          <span className="px-2.5 py-0.5 rounded-md bg-red-500/15 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {language === 'ug' ? 'كەينىدە قالدى' : 'Behind'}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            {language === 'ug' ? 'تەرتىپلىك ئالغا بېسىلماقتا' : 'On Track'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600/15 via-orange-600/10 to-indigo-600/15 border border-amber-500/25 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-500/20">
              <Target className="w-3.5 h-3.5" />
              {language === 'ug' ? 'ئەقلىي نىشان باشقۇرۇش' : 'Strategic Goal Management'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {language === 'ug'
                ? '🎯 ئەقلىي نىشان & قەدەم باسقۇچلار (Smart OKRs)'
                : language === 'tr'
                ? '🎯 Akıllı Hedefler & Yol Haritası (OKRs)'
                : language === 'ar'
                ? '🎯 الأهداف والنتائج الرئيسية الذكية (OKRs)'
                : '🎯 Smart OKRs & Goal Tracker'}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1 max-w-2xl">
              {language === 'ug'
                ? 'چوڭ ئارزۇلىرىڭىزنى سۈنئىي ئىدراك ئارقىلىق ئۆلچەملىك Key Results (KRs) ۋە كۈندىلىك باسقۇچلارغا پارچىلاڭ، ئىلگىرىلەشنى دەل ۋاقتىدا باھالىڭ.'
                : 'Turn ambitious objectives into quantifiable key results and track quarterly milestone progress.'}
            </p>
          </div>

          <button
            id="open-ai-okr-modal-btn"
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition-all transform hover:scale-[1.02] shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'ug' ? 'AI بىلەن يېڭى OKR تۈزۈش' : 'Craft OKR with AI'}</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/80 rounded-xl p-3 shadow-xs">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', labelUg: 'ھەممىسى', labelEn: 'All' },
            { id: 'project', labelUg: '🚀 تۈر', labelEn: '🚀 Project' },
            { id: 'career', labelUg: '💼 كەسىپ', labelEn: '💼 Career' },
            { id: 'learning', labelUg: '📚 ئۆگىنىش', labelEn: '📚 Learning' },
            { id: 'health', labelUg: '💪 سالامەتلىك', labelEn: '💪 Health' },
            { id: 'finance', labelUg: '💰 مالىيە', labelEn: '💰 Finance' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-700/50 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
              }`}
            >
              {language === 'ug' ? cat.labelUg : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-neutral-400 text-[11px]">{language === 'ug' ? 'ھالىتى:' : 'Status:'}</span>
          {(['all', 'on-track', 'at-risk', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                selectedStatus === st
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {st.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Goals Cards List */}
      <div className="space-y-6">
        {filteredGoals.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-neutral-800/50 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl">
            <Target className="w-12 h-12 mx-auto text-amber-500/40 mb-3" />
            <h3 className="text-base font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              {language === 'ug' ? 'بۇ سەھىپىدە نىشان يوق' : 'No Goals in this Category'}
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
              {language === 'ug'
                ? 'يۇقىرىدىكى AI كۇنۇپكىسىنى چېكىپ يېڭى نىشان ۋە باسقۇچلارنى تۈزۈڭ.'
                : 'Click above to formulate a new OKR with AI guidance.'}
            </p>
          </div>
        ) : (
          filteredGoals.map((goal) => {
            // Overall goal progress
            const avgProgress =
              goal.keyResults.length > 0
                ? Math.round(
                    goal.keyResults.reduce((acc, kr) => acc + kr.progressPercentage, 0) /
                      goal.keyResults.length
                  )
                : 0;

            return (
              <div
                key={goal.id}
                id={`okr-card-${goal.id}`}
                className="bg-white dark:bg-neutral-800/90 border border-neutral-200/80 dark:border-neutral-700/80 rounded-2xl p-6 shadow-sm space-y-6"
              >
                {/* Top Goal Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-700/60">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      {getStatusBadge(goal.status)}
                      <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-700/60 text-neutral-600 dark:text-neutral-300 text-xs font-mono">
                        {goal.quarter}
                      </span>
                      <span className="text-xs text-neutral-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {goal.dueDate}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                      {goal.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">
                      <strong>Objective:</strong> {goal.objective}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                        {avgProgress}%
                      </div>
                      <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
                        {language === 'ug' ? 'ئومۇمىي نەتىجە' : 'Overall'}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-2 text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg cursor-pointer transition-colors"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Key Results Grid */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    {language === 'ug' ? 'ئۆلچەملىك يادرولۇق نەتىجىلەر (Key Results)' : 'Key Results (KRs)'}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {goal.keyResults.map((kr) => (
                      <div
                        key={kr.id}
                        className="p-4 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-700/80 rounded-xl space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 leading-snug">
                            {kr.title}
                          </h5>
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono shrink-0">
                            {kr.progressPercentage}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${kr.progressPercentage}%` }}
                          ></div>
                        </div>

                        {/* Milestones Checkboxes */}
                        {kr.milestones.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                              {language === 'ug' ? 'باسقۇچلۇق نىشانلار:' : 'Milestones:'}
                            </span>
                            {kr.milestones.map((m) => (
                              <div
                                key={m.id}
                                className="flex items-center justify-between p-1.5 bg-white dark:bg-neutral-800 rounded-lg text-xs border border-neutral-200/60 dark:border-neutral-700/60"
                              >
                                <label className="flex items-center gap-2 cursor-pointer select-none flex-1">
                                  <input
                                    type="checkbox"
                                    checked={m.completed}
                                    onChange={() => handleToggleMilestone(goal, kr.id, m.id)}
                                    className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500"
                                  />
                                  <span
                                    className={`${
                                      m.completed
                                        ? 'line-through text-neutral-400 dark:text-neutral-500'
                                        : 'text-neutral-800 dark:text-neutral-200'
                                    }`}
                                  >
                                    {m.title}
                                  </span>
                                </label>

                                <button
                                  onClick={() => handlePushMilestoneToTasks(m)}
                                  className="px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white dark:text-amber-400 dark:hover:text-white rounded text-[10px] font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                                  title="Add to Tasks list"
                                >
                                  {addedMilestoneId === m.id ? (
                                    <>
                                      <Check className="w-3 h-3" />
                                      <span>{language === 'ug' ? 'قوشۇلدى!' : 'Added!'}</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3 h-3" />
                                      <span>{language === 'ug' ? 'ۋەزىپىگە' : 'Task'}</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Strategic Advice */}
                {goal.aiStrategicAdvice && (
                  <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-500/25 text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-800 dark:text-amber-300 block mb-0.5">
                        {language === 'ug' ? '💡 سۈنئىي ئىدراك ئىستراتېگىيىلىك مەسلىھىتى:' : '💡 AI Strategic Coaching:'}
                      </span>
                      <p className="leading-relaxed">{goal.aiStrategicAdvice}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* AI OKR Formulation Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  {language === 'ug' ? 'سۈنئىي ئىدراك بىلەن OKR تۈزۈش' : 'Craft OKR with AI Strategist'}
                </h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {language === 'ug' ? 'ئاساسىي ئارزۇ ياكى نىشانىڭىز (Objective):' : 'Your Big Dream or Objective:'}
                </label>
                <textarea
                  id="okr-objective-input"
                  value={objectiveInput}
                  onChange={(e) => setObjectiveInput(e.target.value)}
                  rows={3}
                  placeholder={
                    language === 'ug'
                      ? 'مەسىلەن: "3 ئاي ئىچىدە كۆپ ئىقتىدارلىق ئەپنى پۈتتۈرۈپ 1,000 كىشىگە يەتكۈزۈش ۋە تۇنجى كىرىم يارىتىش"'
                      : 'e.g., Launch multi-tool app and acquire first 1,000 active users...'
                  }
                  className="w-full text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {language === 'ug' ? 'سەھىپە:' : 'Category:'}
                  </label>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value as any)}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="project">{language === 'ug' ? '🚀 تۈر (Project)' : 'Project'}</option>
                    <option value="career">{language === 'ug' ? '💼 كەسىپ (Career)' : 'Career'}</option>
                    <option value="learning">{language === 'ug' ? '📚 ئۆگىنىش (Learning)' : 'Learning'}</option>
                    <option value="health">{language === 'ug' ? '💪 سالامەتلىك (Health)' : 'Health'}</option>
                    <option value="finance">{language === 'ug' ? '💰 مالىيە (Finance)' : 'Finance'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {language === 'ug' ? 'دەۋرىيلىك:' : 'Timeframe:'}
                  </label>
                  <input
                    type="text"
                    value={quarterInput}
                    onChange={(e) => setQuarterInput(e.target.value)}
                    placeholder="2026 Q3-Q4"
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-2.5 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-700">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
              >
                {language === 'ug' ? 'بىكار قىلىش' : 'Cancel'}
              </button>
              <button
                id="submit-generate-okr-btn"
                onClick={handleGenerateOkr}
                disabled={isGenerating || !objectiveInput.trim()}
                className="px-5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs rounded-xl shadow-md cursor-pointer transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? (language === 'ug' ? 'تۈزۈلۈۋاتىدۇ...' : 'Generating...') : (language === 'ug' ? 'OKR نى گېنېراتسىيە قىلىش' : 'Generate OKR')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
