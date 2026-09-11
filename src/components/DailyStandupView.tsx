import React, { useState } from 'react';
import {
  ClipboardList,
  Sparkles,
  CheckCircle2,
  Clock,
  Flame,
  Calendar,
  Smile,
  Zap,
  RotateCw,
  Copy,
  Check,
  Share2,
  FileText,
  CalendarDays,
  HeartHandshake,
} from 'lucide-react';
import {
  AppLanguage,
  TaskItem,
  CalendarEvent,
  HabitItem,
  DailyStandupRecord,
} from '../types';

interface DailyStandupViewProps {
  lang: AppLanguage;
  tasks: TaskItem[];
  events: CalendarEvent[];
  habits: HabitItem[];
  standupHistory: DailyStandupRecord[];
  onSaveStandup: (record: DailyStandupRecord) => void;
}

export const DailyStandupView: React.FC<DailyStandupViewProps> = ({
  lang,
  tasks,
  events,
  habits,
  standupHistory,
  onSaveStandup,
}) => {
  const [mood, setMood] = useState<'great' | 'good' | 'neutral' | 'tired' | 'stressed'>('great');
  const [energyLevel, setEnergyLevel] = useState<number>(5);
  const [userNotes, setUserNotes] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentReport, setCurrentReport] = useState<string | null>(
    standupHistory[0]?.reportMarkdown || null
  );
  const [currentQuote, setCurrentQuote] = useState<string | null>(
    standupHistory[0]?.motivationalQuote || null
  );
  const [copied, setCopied] = useState<boolean>(false);

  const todayStr = new Date().toISOString().slice(0, 10);
  const completedTasks = tasks.filter((t) => t.completed);
  const pendingTasks = tasks.filter((t) => !t.completed);
  const habitsDone = habits.filter((h) => h.completedDates.includes(todayStr));
  const eventsDone = events.filter((e) => e.date === todayStr && e.completed);

  const handleGenerateStandup = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-standup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedTasks: completedTasks.map((t) => t.title),
          pendingTasks: pendingTasks.map((t) => t.title),
          habitsDone: habitsDone.map((h) => h.title),
          eventsDone: eventsDone.map((e) => e.title),
          mood,
          energyLevel,
          language: lang,
          userNotes,
        }),
      });

      const data = await res.json();
      const reportMarkdown = data.reportMarkdown || '';
      const quote = data.motivationalQuote || '';

      setCurrentReport(reportMarkdown);
      setCurrentQuote(quote);

      const newRecord: DailyStandupRecord = {
        id: `standup-${Date.now()}`,
        date: todayStr,
        mood,
        energyLevel,
        accomplished: completedTasks.map((t) => t.title),
        blockers: [],
        tomorrowGoals: pendingTasks.map((t) => t.title).slice(0, 3),
        reportMarkdown,
        motivationalQuote: quote,
        userNotes,
        createdAt: new Date().toISOString(),
      };

      onSaveStandup(newRecord);
    } catch (e) {
      console.error('Failed to generate standup report:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!currentReport) return;
    navigator.clipboard.writeText(currentReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="standup-main-container" className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {lang === 'ug'
                  ? '📋 كۈندىلىك خىزمەت خۇلاسىسى & كەچلىك تەپەككۇر'
                  : lang === 'tr'
                  ? '📋 Günlük Standup & Akşam Değerlendirmesi'
                  : lang === 'ar'
                  ? '📋 التقرير اليومي والتأمل المسائي'
                  : '📋 AI Daily Standup & Evening Reflection'}
              </h2>
              <p className="text-xs text-white/80">
                {lang === 'ug'
                  ? 'بۈگۈنكى ۋەزىپىلەر، ئادەتلەر ۋە پىلانلارنى بىر چېكىش بىلەن ئاپتوماتىك خۇلاسىلەش'
                  : 'Automated executive progress review & wellness reflection'}
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateStandup}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-orange-950 font-bold text-xs shadow-md hover:bg-white/90 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isGenerating ? (
              <RotateCw className="w-4 h-4 animate-spin text-orange-600" />
            ) : (
              <Sparkles className="w-4 h-4 text-orange-600" />
            )}
            <span>
              {isGenerating
                ? lang === 'ug'
                  ? 'تەھلىل قىلىۋاتىدۇ...'
                  : 'Analyzing...'
                : lang === 'ug'
                ? 'AI دوكلاتى ھاسىللاش'
                : 'Generate AI Standup'}
            </span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Daily Stats & Reflection Controls + Generated Standup Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input and Today Metrics */}
        <div className="space-y-4">
          {/* Today Activity Metrics Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'ug' ? 'بۈگۈنكى پائالىيەتلەر' : "Today's Activity"}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                  {lang === 'ug' ? 'تاماملانغان ۋەزىپە' : 'Done Tasks'}
                </span>
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                  {completedTasks.length}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block">
                  {lang === 'ug' ? 'ئورۇنلانغان ئادەت' : 'Habits Done'}
                </span>
                <span className="text-lg font-black text-amber-700 dark:text-amber-300">
                  {habitsDone.length}
                </span>
              </div>
            </div>

            {/* Mood Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {lang === 'ug' ? 'بۈگۈنكى روھىي كەيپىياتىڭىز:' : "Today's Mood:"}
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { key: 'great', emoji: '🌟', label: 'Great' },
                  { key: 'good', emoji: '😊', label: 'Good' },
                  { key: 'neutral', emoji: '😐', label: 'Neutral' },
                  { key: 'tired', emoji: '🥱', label: 'Tired' },
                  { key: 'stressed', emoji: '⚡', label: 'Stressed' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setMood(item.key as any)}
                    className={`py-2 rounded-2xl border text-center transition-all ${
                      mood === item.key
                        ? 'bg-orange-50 dark:bg-orange-950/60 border-orange-500 text-orange-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-base block">{item.emoji}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Energy Level Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {lang === 'ug' ? 'ئېنېرگىيە دەرىجىسى:' : 'Energy Level:'}
                </span>
                <span className="font-bold text-orange-600">{energyLevel} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            {/* Custom Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {lang === 'ug' ? 'قوشۇمچە تەسىرات / ئەسكەرتىش:' : 'Personal Notes / Takeaways:'}
              </label>
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder={
                  lang === 'ug'
                    ? 'مەسىلەن: بۈگۈن ئاساسىي كودنى تۈگەتتىم، ئەتە سىناقنى باشلايمەن...'
                    : 'Any extra reflections, obstacles or thoughts...'
                }
                rows={3}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Standup Report Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-orange-500" />
                  {todayStr}
                </span>
              </div>

              {currentReport && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 font-bold">
                        {lang === 'ug' ? 'كۆچۈرۈلدى' : 'Copied'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{lang === 'ug' ? 'نۇسخىلاش' : 'Copy'}</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Quote of the Day */}
            {currentQuote && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center gap-3">
                <HeartHandshake className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 italic">
                  "{currentQuote}"
                </p>
              </div>
            )}

            {/* Markdown Report Render */}
            {currentReport ? (
              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {currentReport}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <ClipboardList className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                <p className="text-xs font-semibold">
                  {lang === 'ug'
                    ? 'تېخى دوكلات ھاسىللانمىدى. ئوڭ تەرەپ ئۈستىدىكى «AI دوكلاتى ھاسىللاش» نى بېسىڭ.'
                    : 'No report generated yet. Click "Generate AI Standup" above.'}
                </p>
              </div>
            )}
          </div>

          {/* Past Standup History */}
          {standupHistory.length > 0 && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {lang === 'ug' ? 'ئىلگىرىكى خۇلاسىلەر خاتىرىسى' : 'Past Standup History'}
              </h4>
              <div className="space-y-2">
                {standupHistory.slice(0, 3).map((hist) => (
                  <button
                    key={hist.id}
                    onClick={() => {
                      setCurrentReport(hist.reportMarkdown);
                      setCurrentQuote(hist.motivationalQuote || null);
                    }}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-left flex items-center justify-between hover:border-orange-400 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {hist.date}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {hist.mood}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {hist.accomplished.length} tasks done
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
