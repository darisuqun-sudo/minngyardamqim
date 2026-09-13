import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Target,
  Flame,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  X,
  ArrowRight,
  ShieldCheck,
  Zap,
  Coffee,
  Check
} from 'lucide-react';
import {
  MorningBriefing,
  TaskItem,
  CalendarEvent,
  HabitItem,
  FinanceTransaction,
  AppLanguage,
} from '../types';
import { speakTextAi, stopSpeakingAi } from '../utils/aiVoiceService';

interface MorningBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefing: MorningBriefing;
  tasks: TaskItem[];
  events: CalendarEvent[];
  habits: HabitItem[];
  transactions: FinanceTransaction[];
  onStartFocus: () => void;
  onAddTask: (task: TaskItem) => void;
  language: AppLanguage;
  isRTL: boolean;
}

export const MorningBriefingModal: React.FC<MorningBriefingModalProps> = ({
  isOpen,
  onClose,
  briefing,
  tasks,
  events,
  habits,
  transactions,
  onStartFocus,
  onAddTask,
  language,
  isRTL,
}) => {
  const [currentBriefing, setCurrentBriefing] = useState<MorningBriefing>(briefing);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [addedTaskId, setAddedTaskId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentBriefing(briefing);
  }, [briefing]);

  if (!isOpen) return null;

  const handleRefreshBriefing = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/generate-morning-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          tasks,
          events,
          habits,
          transactions,
        }),
      });

      if (!res.ok) throw new Error('Briefing failed');
      const data = await res.json();
      setCurrentBriefing(data);
    } catch (err) {
      console.error('Failed to regenerate morning briefing:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    return () => {
      stopSpeakingAi();
    };
  }, []);

  const handleReadAloud = async () => {
    if (isSpeaking) {
      stopSpeakingAi();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${currentBriefing.greeting}. ${currentBriefing.dailyWisdomQuote}. ${currentBriefing.calendarSummary}`;
    try {
      await speakTextAi(textToSpeak, language, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch {
      setIsSpeaking(false);
    }
  };

  const handlePushPriorityToTask = (priorityTitle: string, idx: number) => {
    const newTask: TaskItem = {
      id: `task-priority-${Date.now()}-${idx}`,
      title: priorityTitle,
      completed: false,
      priority: 'high',
      category: 'planning',
      createdAt: new Date().toISOString(),
      dueDate: new Date().toISOString().split('T')[0],
    };
    onAddTask(newTask);
    setAddedTaskId(`p-${idx}`);
    setTimeout(() => setAddedTaskId(null), 2500);
  };

  const todayEvents = events.slice(0, 3);
  const activeHabits = habits.slice(0, 4);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8 relative">
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Greeting & Weather */}
        <div className="flex items-start justify-between gap-4 pr-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <Sun className="w-5 h-5 animate-spin-slow" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {language === 'ug' ? 'كۈندىلىك ئەقلىي يېتەكچى' : 'AI Daily Executive Briefing'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
              {currentBriefing.greeting || (language === 'ug' ? 'خەيرلىك ئەتىگەن!' : 'Good Morning!')}
            </h2>
            <p className="text-xs text-neutral-500 font-mono mt-1">
              {new Date().toLocaleDateString(language === 'ug' ? 'ug-CN' : 'en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              • {currentBriefing.weatherOrVibe || '🌤️ Clear Mind'}
            </p>
          </div>
        </div>

        {/* Daily Motivational Quote */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 border border-amber-500/25">
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 italic leading-relaxed">
            "{currentBriefing.dailyWisdomQuote}"
          </p>
          {currentBriefing.quoteAuthor && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 text-right">
              — {currentBriefing.quoteAuthor}
            </p>
          )}
        </div>

        {/* The Big 3 Daily Priorities */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-amber-500" />
              {language === 'ug' ? 'بۈگۈنكى 3 چوڭ ئەڭ مۇھىم نىشان (The Big 3)' : "Today's Core Big 3 Priorities"}
            </h3>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              {language === 'ug' ? 'يۇقىرى ئۈنۈم' : 'High Leverage'}
            </span>
          </div>

          <div className="space-y-2">
            {(currentBriefing.top3Priorities || []).map((priority, idx) => {
              const priorityTitle = typeof priority === 'string' ? priority : priority.title;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/80 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-neutral-800 dark:text-neutral-200 font-medium">{priorityTitle}</span>
                  </div>

                  <button
                    onClick={() => handlePushPriorityToTask(priorityTitle, idx)}
                    className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white dark:text-amber-400 dark:hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    {addedTaskId === `p-${idx}` ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{language === 'ug' ? 'قوشۇلدى!' : 'Added!'}</span>
                      </>
                    ) : (
                      <>
                        <span>{language === 'ug' ? 'ۋەزىپىگە ئېلىش' : 'Push to Tasks'}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Schedule & Habits Quick Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Events Today */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              {language === 'ug' ? 'بۈگۈنكى كالېندار' : 'Schedule Today'}
            </h4>
            {todayEvents.length === 0 ? (
              <p className="text-xs text-neutral-400">{language === 'ug' ? 'يىغىن ياكى ۋاقىت پىلانى يوق.' : 'No events scheduled.'}</p>
            ) : (
              <div className="space-y-1.5 text-xs">
                {todayEvents.map((evt) => (
                  <div key={evt.id} className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
                    <span className="line-clamp-1">{evt.title}</span>
                    <span className="font-mono text-neutral-400 shrink-0">{evt.startTime}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Habits Focus */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              {language === 'ug' ? 'ئادەت مۇقىملىقى' : 'Habit Commitments'}
            </h4>
            {activeHabits.length === 0 ? (
              <p className="text-xs text-neutral-400">{language === 'ug' ? 'ئادەت بەلگىلەنمىگەن.' : 'No active habits.'}</p>
            ) : (
              <div className="space-y-1.5 text-xs">
                {activeHabits.map((h) => (
                  <div key={h.id} className="flex items-center justify-between text-neutral-700 dark:text-neutral-300">
                    <span className="line-clamp-1">{h.title}</span>
                    <span className="font-mono text-orange-500 font-bold">{h.streak}🔥</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls: Focus Starter & TTS & AI Refresh */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReadAloud}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer text-xs font-medium flex items-center gap-1.5 ${
                isSpeaking
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
              }`}
              title="Read aloud"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {isSpeaking ? (language === 'ug' ? 'توختىتىش' : 'Stop') : (language === 'ug' ? 'ئاۋازدا ئوقۇش' : 'Listen')}
              </span>
            </button>

            <button
              onClick={handleRefreshBriefing}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Refresh Briefing"
            >
              <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{language === 'ug' ? 'يېڭىلاش' : 'Refresh'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onStartFocus();
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/25 transition-all cursor-pointer transform hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4" />
              <span>{language === 'ug' ? '🚀 25 مىنۇتلۇق زېھىن مەشىقىنى باشلاش' : '🚀 Launch Focus Mode'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
