import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  Circle,
  Tag,
  Pin,
  Search,
  BookOpen,
  Download,
  ListTodo,
  FileEdit,
  ArrowRight,
  ArrowLeft,
  Clock,
  Repeat,
  Flame,
  Filter,
} from 'lucide-react';
import { AppLanguage, TaskItem, NoteItem } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ProductivityViewProps {
  lang: AppLanguage;
  tasks: TaskItem[];
  notes: NoteItem[];
  onAddTask: (task: Omit<TaskItem, 'id' | 'createdAt'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddSubtasks: (taskId: string, subtasks: { id: string; title: string; done: boolean }[]) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onSaveNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
}

export const ProductivityView: React.FC<ProductivityViewProps> = ({
  lang,
  tasks,
  notes,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onAddSubtasks,
  onToggleSubtask,
  onSaveNote,
  onDeleteNote,
}) => {
  const isRTL = lang === 'ug' || lang === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [activeTab, setActiveTab] = useState<'tasks' | 'notes'>('tasks');

  // Task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'planning' | 'dev' | 'design' | 'personal'>('planning');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTaskRecurring, setNewTaskRecurring] = useState<TaskItem['recurring']>('none');
  const [newTaskMinutes, setNewTaskMinutes] = useState<number>(30);
  const [taskFilterCategory, setTaskFilterCategory] = useState<string>('all');
  const [taskFilterPriority, setTaskFilterPriority] = useState<string>('all');
  const [breakingDownTaskId, setBreakingDownTaskId] = useState<string | null>(null);

  // Note form state
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(notes[0] || null);
  const [noteTitle, setNoteTitle] = useState(notes[0]?.title || '');
  const [noteContent, setNoteContent] = useState(notes[0]?.content || '');
  const [noteTags, setNoteTags] = useState(notes[0]?.tags?.join(', ') || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiProcessingNote, setIsAiProcessingNote] = useState(false);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask({
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      priority: newTaskPriority,
      recurring: newTaskRecurring,
      estimatedMinutes: newTaskMinutes,
      completed: false,
      subtasks: [],
    });
    setNewTaskTitle('');
    setNewTaskRecurring('none');
  };

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed);
  const totalPendingMinutes = pendingTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 25), 0);

  const filteredTasks = tasks.filter((t) => {
    const matchCat = taskFilterCategory === 'all' || t.category === taskFilterCategory;
    const matchPri = taskFilterPriority === 'all' || t.priority === taskFilterPriority;
    return matchCat && matchPri;
  });

  const handleAiBreakdownTask = async (task: TaskItem) => {
    setBreakingDownTaskId(task.id);
    try {
      const res = await fetch('/api/ai-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: 'breakdown-task',
          input: task.title,
        }),
      });
      const data = await res.json();
      if (data.result) {
        // Parse lines
        const lines = data.result
          .split('\n')
          .filter((l: string) => l.trim().length > 0 && /^[0-9\-\*\•]/.test(l.trim()))
          .slice(0, 5)
          .map((l: string, idx: number) => ({
            id: `st-${Date.now()}-${idx}`,
            title: l.replace(/^[0-9\.\-\*\•\s]+/, '').trim(),
            done: false,
          }));

        if (lines.length > 0) {
          onAddSubtasks(task.id, lines);
        } else {
          onAddSubtasks(task.id, [
            { id: `st-${Date.now()}-1`, title: data.result.slice(0, 80), done: false },
          ]);
        }
      }
    } catch (err) {
      console.error('Failed to breakdown task:', err);
    } finally {
      setBreakingDownTaskId(null);
    }
  };

  const handleCreateNewNote = () => {
    const defaultTitle =
      lang === 'ug' ? 'يېڭى خاتىرە' : lang === 'tr' ? 'Yeni Not' : lang === 'ar' ? 'ملاحظة جديدة' : 'Untitled Note';
    const defaultContent =
      lang === 'ug'
        ? 'بۇ يەرگە تەپسىلىي مەزمۇننى يېزىڭ...'
        : lang === 'tr'
        ? 'Notlarınızı Markdown formatında buraya yazın...'
        : lang === 'ar'
        ? 'اكتب ملاحظاتك بنظام Markdown هنا...'
        : 'Write your notes in Markdown here...';
    const defaultTag =
      lang === 'ug' ? 'خاتىرە' : lang === 'tr' ? 'Not' : lang === 'ar' ? 'ملاحظة' : 'Note';

    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: defaultTitle,
      content: defaultContent,
      tags: [defaultTag],
      updatedAt: new Date().toISOString().slice(0, 10),
      pinned: false,
    };
    onSaveNote(newNote);
    setSelectedNote(newNote);
    setNoteTitle(newNote.title);
    setNoteContent(newNote.content);
    setNoteTags(newNote.tags.join(', '));
  };

  const handleSaveCurrentNote = () => {
    if (!selectedNote) return;
    const fallbackTitle =
      lang === 'ug' ? 'نامسىز خاتىرە' : lang === 'tr' ? 'İsimsiz Not' : lang === 'ar' ? 'ملاحظة بدون عنوان' : 'Untitled Note';
    const updated: NoteItem = {
      ...selectedNote,
      title: noteTitle.trim() || fallbackTitle,
      content: noteContent,
      tags: noteTags.split(',').map((t) => t.trim()).filter(Boolean),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    onSaveNote(updated);
    setSelectedNote(updated);
  };

  const handleAiPolishNote = async (action: 'summarize' | 'expand') => {
    if (!noteContent.trim() || isAiProcessingNote) return;
    setIsAiProcessingNote(true);
    try {
      const toolType = 'summarize';
      const promptLang =
        lang === 'ug' ? 'Uyghur' : lang === 'tr' ? 'Turkish' : lang === 'ar' ? 'Arabic' : 'English';
      const prompt =
        action === 'summarize'
          ? `Summarize this text in 3 crisp bullet points in ${promptLang}:\n\n${noteContent}`
          : `Expand this note with key actionable strategies and structured markdown in ${promptLang}:\n\n${noteContent}`;

      const res = await fetch('/api/ai-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType,
          input: prompt,
        }),
      });
      const data = await res.json();
      if (data.result) {
        const headerLabel =
          action === 'summarize' ? t.aiSummarizeNote : t.aiExpandNote;
        setNoteContent((prev) => prev + `\n\n---\n### 🤖 AI ${headerLabel}:\n` + data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiProcessingNote(false);
    }
  };

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div id="productivity-workspace-container" className="space-y-6 pb-16">
      {/* Top Header & Tab Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>{t.productivityHubTitle}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.productivityHubDesc}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'tasks'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>{t.tasksLabel} ({tasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'notes'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.notesLabel} ({notes.length})</span>
          </button>
        </div>
      </div>

      {/* View 1: Tasks Management */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Task Input Form */}
          <div className="lg:col-span-4 space-y-4">
            <form
              onSubmit={handleCreateTask}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{t.createNewTask}</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {t.taskTitleLabel}
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder={t.taskTitlePlaceholder}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t.categoryLabel}
                  </label>
                  <select
                    value={newTaskCategory}
                    onChange={(e: any) => setNewTaskCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="planning">{t.planningCat}</option>
                    <option value="dev">{t.devCat}</option>
                    <option value="design">{t.designCat}</option>
                    <option value="personal">{t.personalCat}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {t.priorityLabel}
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e: any) => setNewTaskPriority(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="high">{t.highPriority}</option>
                    <option value="medium">{t.medPriority}</option>
                    <option value="low">{t.lowPriority}</option>
                  </select>
                </div>
              </div>

              {/* Recurring & Estimated Minutes */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Repeat className="w-3 h-3 text-indigo-500" />
                    <span>تەكرارلىنىش (Recurring)</span>
                  </label>
                  <select
                    value={newTaskRecurring}
                    onChange={(e: any) => setNewTaskRecurring(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="none">يوق (None)</option>
                    <option value="daily">ھەر كۈنى (Daily)</option>
                    <option value="weekdays">خىزمەت كۈنلىرى (Weekdays)</option>
                    <option value="weekly">ھەر ھەپتە (Weekly)</option>
                    <option value="monthly">ھەر ئاي (Monthly)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>مۆلچەردىكى مىنۇت</span>
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={480}
                    step={5}
                    value={newTaskMinutes}
                    onChange={(e) => setNewTaskMinutes(parseInt(e.target.value) || 25)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
              >
                {t.addTaskBtn}
              </button>
            </form>

            {/* Task Stats Overview */}
            <div className="p-5 rounded-3xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-400">تاماملانغانلىق:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                  {completedTasksCount} / {tasks.length} ({tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${tasks.length > 0 ? (completedTasksCount / tasks.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span>قالغان مۆلچەر ۋاقىت:</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                  ~{totalPendingMinutes} مىنۇت ({Math.round(totalPendingMinutes / 60 * 10) / 10} سائەت)
                </span>
              </div>
            </div>
          </div>

          {/* Right: Tasks List with Subtasks & AI Decomposition */}
          <div className="lg:col-span-8 space-y-3">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {['all', 'planning', 'dev', 'design', 'personal'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTaskFilterCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] capitalize font-medium transition-colors ${
                      taskFilterCategory === cat
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 text-[11px]">
                <span className="text-slate-400">مۇھىملىقى:</span>
                <select
                  value={taskFilterPriority}
                  onChange={(e) => setTaskFilterPriority(e.target.value)}
                  className="px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs"
                >
                  <option value="all">ھەممىسى</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            {filteredTasks.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
                {t.noTasksYet}
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                    task.completed
                      ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors flex-shrink-0 cursor-pointer"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <p
                          className={`text-sm font-semibold leading-relaxed ${
                            task.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {task.title}
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                            {task.category}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                              task.priority === 'high'
                                ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                                : task.priority === 'medium'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {task.priority}
                          </span>
                          {task.recurring && task.recurring !== 'none' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                              <Repeat className="w-2.5 h-2.5" />
                              <span>{task.recurring}</span>
                            </span>
                          )}
                          {task.estimatedMinutes && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 font-mono flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{task.estimatedMinutes}m</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* AI Breakdown Button */}
                      <button
                        onClick={() => handleAiBreakdownTask(task)}
                        disabled={breakingDownTaskId === task.id}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                        title="Breakdown with AI"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {breakingDownTaskId === task.id ? t.breakingDown : t.aiBreakdown}
                        </span>
                      </button>

                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subtasks checklist */}
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="pt-2 pl-8 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                      <p className="text-[11px] font-bold text-slate-400">
                        {t.actionableSteps}
                      </p>
                      {task.subtasks.map((st) => (
                        <div
                          key={st.id}
                          onClick={() => onToggleSubtask(task.id, st.id)}
                          className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-indigo-600 transition-colors"
                        >
                          {st.done ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span className={st.done ? 'line-through text-slate-400' : ''}>
                            {st.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* View 2: Smart Notes & Knowledge Base */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Notes Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchNotesPlaceholder}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                onClick={handleCreateNewNote}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs cursor-pointer"
                title={t.newNoteBtn}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredNotes.map((note) => {
                const isSelected = selectedNote?.id === note.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      setSelectedNote(note);
                      setNoteTitle(note.title);
                      setNoteContent(note.content);
                      setNoteTags(note.tags.join(', '));
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {note.title}
                      </h4>
                      {note.pinned && <Pin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {note.content}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      {note.tags.map((tagItem) => (
                        <span
                          key={tagItem}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
                        >
                          #{tagItem}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes Editor & AI Actions */}
          <div className="lg:col-span-8">
            {selectedNote ? (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                {/* Editor Header & AI Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder={t.noteTitlePlaceholder}
                    className="text-base font-bold bg-transparent text-slate-900 dark:text-white focus:outline-none flex-1 min-w-[200px]"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAiPolishNote('summarize')}
                      disabled={isAiProcessingNote}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t.aiSummarizeNote}</span>
                    </button>

                    <button
                      onClick={() => handleAiPolishNote('expand')}
                      disabled={isAiProcessingNote}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t.aiExpandNote}</span>
                    </button>

                    <button
                      onClick={handleSaveCurrentNote}
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs cursor-pointer"
                    >
                      {t.saveNote}
                    </button>

                    <button
                      onClick={() => onDeleteNote(selectedNote.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tags input */}
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={noteTags}
                    onChange={(e) => setNoteTags(e.target.value)}
                    placeholder={t.tagsPlaceholder}
                    className="w-full text-xs text-slate-600 dark:text-slate-300 bg-transparent focus:outline-none"
                  />
                </div>

                {/* Content text area */}
                <textarea
                  rows={14}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder={t.noteContentPlaceholder}
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
                {t.noNoteSelected}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
