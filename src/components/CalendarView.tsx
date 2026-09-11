import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Sparkles,
  CheckCircle2,
  Trash2,
  Download,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  Tag,
} from 'lucide-react';
import { AppLanguage, CalendarEvent, TaskItem } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface CalendarViewProps {
  lang: AppLanguage;
  events: CalendarEvent[];
  tasks: TaskItem[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onToggleEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
  onBulkSetEvents: (events: CalendarEvent[]) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  lang,
  events,
  tasks,
  onAddEvent,
  onToggleEvent,
  onDeleteEvent,
  onBulkSetEvents,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRTL = lang === 'ug' || lang === 'ar';

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().slice(0, 10);
  });
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [category, setCategory] = useState<CalendarEvent['category']>('work');
  const [color, setColor] = useState('#6366f1');
  const [description, setDescription] = useState('');

  const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 08:00 to 22:00

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddEvent({
      title,
      startTime,
      endTime,
      date: selectedDate,
      category,
      color,
      description,
      completed: false,
    });

    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  const handleAiOptimize = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/optimize-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: tasks.filter((t) => !t.completed),
          date: selectedDate,
          language: lang,
        }),
      });
      const data = await res.json();
      if (data.schedule && Array.isArray(data.schedule) && data.schedule.length > 0) {
        onBulkSetEvents([...events, ...data.schedule]);
      }
    } catch (e) {
      console.error('Failed to optimize schedule:', e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleExportIcs = () => {
    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Smart Assistant & Planner//EN\nCALSCALE:GREGORIAN\n`;
    events.forEach((evt) => {
      const d = evt.date.replace(/-/g, '');
      const s = evt.startTime.replace(/:/g, '') + '00';
      const e = evt.endTime.replace(/:/g, '') + '00';
      icsContent += `BEGIN:VEVENT\nSUMMARY:${evt.title}\nDTSTART:${d}T${s}\nDTEND:${d}T${e}\nDESCRIPTION:${evt.description || ''}\nSTATUS:${evt.completed ? 'COMPLETED' : 'CONFIRMED'}\nEND:VEVENT\n`;
    });
    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `schedule-${selectedDate}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredEvents = events.filter((evt) => {
    const matchesDate = evt.date === selectedDate;
    const matchesCat = filterCategory === 'all' || evt.category === filterCategory;
    return matchesDate && matchesCat;
  });

  return (
    <div id="calendar-view-container" className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t.calendarTitle}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.calendarDesc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* AI Schedule Optimizer */}
          <button
            id="ai-optimize-schedule-btn"
            onClick={handleAiOptimize}
            disabled={isOptimizing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : 'text-amber-300'}`} />
            <span>{isOptimizing ? t.optimizingSchedule : t.aiOptimizeSchedule}</span>
          </button>

          {/* Add Event Button */}
          <button
            id="add-calendar-event-btn"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addEvent}</span>
          </button>

          {/* Export ICS */}
          <button
            onClick={handleExportIcs}
            title="Export .ics"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date Navigator & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
          >
            {t.today}
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'work', 'code', 'meeting', 'study', 'personal'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Time-Blocking Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Timeline */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{t.timeBlocksHeading} ({selectedDate})</span>
          </h2>

          <div className="space-y-3 pt-2">
            {hours.map((hour) => {
              const hourStr = `${hour.toString().padStart(2, '0')}:00`;
              const hourEvents = filteredEvents.filter((evt) => {
                const startHour = parseInt(evt.startTime.split(':')[0], 10);
                return startHour === hour;
              });

              return (
                <div key={hour} className="flex gap-4 group">
                  {/* Time Label */}
                  <div className="w-14 text-xs font-mono text-slate-400 dark:text-slate-500 pt-2 text-right">
                    {hourStr}
                  </div>

                  {/* Slot Line & Events */}
                  <div className="flex-1 min-h-[56px] border-t border-slate-100 dark:border-slate-800/80 pt-1 space-y-2">
                    {hourEvents.map((evt) => (
                      <div
                        key={evt.id}
                        style={{ borderLeftColor: evt.color }}
                        className={`p-3 rounded-xl border-l-4 bg-slate-50 dark:bg-slate-800/60 border-y border-r border-slate-200/70 dark:border-slate-700/60 shadow-xs flex items-center justify-between transition-all ${
                          evt.completed ? 'opacity-60 bg-slate-100/50' : 'hover:shadow-md'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold ${
                                evt.completed
                                  ? 'line-through text-slate-400'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {evt.title}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 font-mono text-slate-500 border border-slate-200 dark:border-slate-700">
                              {evt.startTime} - {evt.endTime}
                            </span>
                          </div>
                          {evt.description && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {evt.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onToggleEvent(evt.id)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              evt.completed
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-slate-300 dark:border-slate-600 text-slate-400 hover:text-emerald-500'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteEvent(evt.id)}
                            className="p-1.5 rounded-lg border border-transparent text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Unscheduled Priority Tasks to Drag or Schedule */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{t.tasksLabel} & Quick Schedulers</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
              {tasks.filter((t) => !t.completed).length} {t.pending}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Quickly convert pending tasks into time blocks for today.
          </p>

          <div className="space-y-2.5">
            {tasks
              .filter((tk) => !tk.completed)
              .slice(0, 5)
              .map((tk) => (
                <div
                  key={tk.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {tk.title}
                    </p>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      {tk.priority} • {tk.category}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      // Find next open hour
                      const occupiedStartTimes = new Set(filteredEvents.map(e => e.startTime.slice(0, 2)));
                      let nextHour = 9;
                      for (let h = 9; h <= 18; h++) {
                        const hStr = h.toString().padStart(2, '0');
                        if (!occupiedStartTimes.has(hStr)) {
                          nextHour = h;
                          break;
                        }
                      }
                      const startStr = `${nextHour.toString().padStart(2, '0')}:00`;
                      const durationMin = tk.estimatedMinutes || 60;
                      const endTotalMin = nextHour * 60 + durationMin;
                      const endH = Math.min(23, Math.floor(endTotalMin / 60));
                      const endM = endTotalMin % 60;
                      const endStr = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

                      onAddEvent({
                        title: tk.title,
                        startTime: startStr,
                        endTime: endStr,
                        date: selectedDate,
                        category: tk.category === 'dev' ? 'code' : 'work',
                        color: tk.priority === 'high' ? '#ef4444' : tk.priority === 'medium' ? '#f59e0b' : '#6366f1',
                        description: `Scheduled from task (${tk.estimatedMinutes || 30}m): ${tk.title}`,
                        completed: false,
                      });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white text-[11px] font-semibold transition-all cursor-pointer"
                  >
                    + ۋاقىتقا تىزىش
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.addEvent}
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t.eventTitle}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Code review session..."
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.eventStartTime}
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.eventEndTime}
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.eventCategory}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="work">Work</option>
                    <option value="code">Code</option>
                    <option value="meeting">Meeting</option>
                    <option value="study">Study</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Color Accent
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    {['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full transition-transform ${
                          color === c ? 'scale-125 ring-2 ring-slate-900 dark:ring-white' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Description / Note
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional details..."
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  {t.addEvent}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
