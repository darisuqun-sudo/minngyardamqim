import React, { useState, useEffect } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Sparkles,
  Languages,
  ListTree,
  FileText,
  Terminal,
  Copy,
  Check,
  CloudRain,
  Radio,
  Zap,
  Save
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AppLanguage, QuickTool, NoteItem } from '../types';
import { LOCALIZED_QUICK_TOOLS, LocalizedQuickTool } from '../data/localizedData';
import { soundSynth } from '../utils/audioSynth';
import { TRANSLATIONS } from '../data/translations';

interface FocusToolsViewProps {
  lang: AppLanguage;
  onSaveToNotes: (note: NoteItem) => void;
}

export const FocusToolsView: React.FC<FocusToolsViewProps> = ({
  lang,
  onSaveToNotes,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Pomodoro State
  const [timerMode, setTimerMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  // Soundscape State
  const [activeSound, setActiveSound] = useState<'none' | 'rain' | 'whitenoise' | 'zen'>('none');
  const [soundVolume, setSoundVolume] = useState(0.4);

  // AI Tool State
  const [selectedTool, setSelectedTool] = useState<LocalizedQuickTool>(LOCALIZED_QUICK_TOOLS[0]);
  const [toolInput, setToolInput] = useState('');
  const [targetLang, setTargetLang] = useState('Uyghur (ئۇيغۇرچە)');
  const [toolOutput, setToolOutput] = useState<string | null>(null);
  const [isToolLoading, setIsToolLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedToNotes, setSavedToNotes] = useState(false);

  // Pomodoro countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (timerMode === 'focus') {
        setCompletedSessions((prev) => prev + 1);
        setTimeLeft(5 * 60);
        setTimerMode('shortBreak');
      } else {
        setTimeLeft(25 * 60);
        setTimerMode('focus');
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, timerMode]);

  const handleModeChange = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setTimerMode(mode);
    if (mode === 'focus') setTimeLeft(25 * 60);
    if (mode === 'shortBreak') setTimeLeft(5 * 60);
    if (mode === 'longBreak') setTimeLeft(15 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Soundscape handlers
  const handleToggleSound = (type: 'rain' | 'whitenoise' | 'zen') => {
    if (activeSound === type) {
      soundSynth.stop();
      setActiveSound('none');
    } else {
      soundSynth.play(type, soundVolume);
      setActiveSound(type);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setSoundVolume(vol);
    soundSynth.setVolume(vol);
  };

  useEffect(() => {
    return () => {
      soundSynth.stop();
    };
  }, []);

  // AI Tool Execution
  const handleExecuteTool = async () => {
    if (!toolInput.trim() || isToolLoading) return;
    setIsToolLoading(true);
    setToolOutput(null);
    setSavedToNotes(false);
    try {
      const res = await fetch('/api/ai-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: selectedTool.actionType,
          input: toolInput,
          targetLang: selectedTool.actionType === 'translate' ? targetLang : undefined,
        }),
      });
      const data = await res.json();
      if (data.result) {
        setToolOutput(data.result);
      } else if (data.error) {
        setToolOutput(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setToolOutput(
        lang === 'ug'
          ? 'مەشغۇلاتتا خاتالىق كۆرۈلدى.'
          : lang === 'tr'
          ? 'İşlem sırasında hata oluştu.'
          : lang === 'ar'
          ? 'حدث خطأ أثناء تنفيذ العملية.'
          : 'Operation failed.'
      );
    } finally {
      setIsToolLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveResultToNotes = () => {
    if (!toolOutput) return;
    const toolTitle = selectedTool.name[lang] || selectedTool.name.en;
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: `${toolTitle}: ${toolInput.slice(0, 30)}...`,
      content: `### 🎯 تەلەپ / Input:\n${toolInput}\n\n### 🤖 نەتىجە / Result:\n${toolOutput}`,
      tags: [selectedTool.actionType, 'AI-Tool'],
      updatedAt: new Date().toISOString().slice(0, 10),
      pinned: false,
    };
    onSaveToNotes(newNote);
    setSavedToNotes(true);
    setTimeout(() => setSavedToNotes(false), 2500);
  };

  return (
    <div id="focus-tools-container" className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Timer className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>{t.focusToolsTitle}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {t.focusToolsDesc}
        </p>
      </div>

      {/* Two Columns: Pomodoro + Soundscape (Left) and Quick AI Tools (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pomodoro & Audio Synth (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pomodoro Timer Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
            {/* Mode Switcher */}
            <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                onClick={() => handleModeChange('focus')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  timerMode === 'focus'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {t.twentyFiveMinFocus}
              </button>
              <button
                onClick={() => handleModeChange('shortBreak')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  timerMode === 'shortBreak'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {t.fiveMinBreak}
              </button>
              <button
                onClick={() => handleModeChange('longBreak')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  timerMode === 'longBreak'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {t.fifteenMinLongBreak}
              </button>
            </div>

            {/* Big Countdown Clock */}
            <div className="py-2">
              <div className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white">
                {formatTime(timeLeft)}
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {timerMode === 'focus' ? t.deepFocusSession : t.restAndRecharge}
              </p>
            </div>

            {/* Play/Pause/Reset Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-6 py-3 rounded-2xl font-bold text-sm text-white flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>{t.pauseFocus}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>{t.startFocus}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleModeChange(timerMode)}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{t.completedSessions}</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                {completedSessions} 🎯
              </span>
            </div>
          </div>

          {/* Ambient Soundscapes Card (Synthesized) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.ambientSoundscapes}
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                Synthesized
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.ambientSoundscapesDesc}
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleToggleSound('rain')}
                className={`p-3 rounded-2xl text-xs font-semibold border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  activeSound === 'rain'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <CloudRain className="w-4 h-4 text-blue-500" />
                <span>{t.rainSound}</span>
              </button>

              <button
                onClick={() => handleToggleSound('whitenoise')}
                className={`p-3 rounded-2xl text-xs font-semibold border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  activeSound === 'whitenoise'
                    ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <Radio className="w-4 h-4 text-purple-500" />
                <span>{t.whiteNoiseSound}</span>
              </button>

              <button
                onClick={() => handleToggleSound('zen')}
                className={`p-3 rounded-2xl text-xs font-semibold border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  activeSound === 'zen'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>{t.zenDroneSound}</span>
              </button>
            </div>

            {/* Volume Slider */}
            {activeSound !== 'none' && (
              <div className="pt-2 flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={soundVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {Math.round(soundVolume * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Productivity Accelerators (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{t.aiAcceleratorsTitle}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.aiAcceleratorsDesc}
              </p>
            </div>

            {/* Tool Selection Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LOCALIZED_QUICK_TOOLS.map((tool) => {
                const isSelected = selectedTool.id === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setSelectedTool(tool);
                      setToolOutput(null);
                    }}
                    className={`p-3 rounded-2xl text-xs font-semibold border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-base">
                      {tool.actionType === 'breakdown-task' ? '🎯' : tool.actionType === 'translate' ? '🌐' : tool.actionType === 'summarize' ? '📄' : '💻'}
                    </span>
                    <span className="line-clamp-1">{tool.name[lang] || tool.name.en}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Tool Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {selectedTool.desc[lang] || selectedTool.desc.en}
                </label>

                {/* Optional Language select for translation */}
                {selectedTool.actionType === 'translate' && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">{t.toLang}</span>
                    <select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                      className="p-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      <option value="Uyghur (ئۇيغۇرچە)">ئۇيغۇرچە (Uyghur)</option>
                      <option value="Turkish (Türkçe)">Türkçe (Turkish)</option>
                      <option value="Arabic (العربية)">العربية (Arabic)</option>
                      <option value="English">English</option>
                      <option value="Chinese (中文)">Chinese (中文)</option>
                    </select>
                  </div>
                )}
              </div>

              <textarea
                rows={4}
                value={toolInput}
                onChange={(e) => setToolInput(e.target.value)}
                placeholder={selectedTool.placeholder[lang] || selectedTool.placeholder.en}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />

              <button
                onClick={handleExecuteTool}
                disabled={!toolInput.trim() || isToolLoading}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-md shadow-indigo-500/20 disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>{isToolLoading ? t.executingAi : t.processWithAi}</span>
              </button>
            </div>

            {/* Output Result Card */}
            {toolOutput && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {t.aiResultBadge}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveResultToNotes}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                      title="Save as Note"
                    >
                      {savedToNotes ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{t.saved}</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>{t.saveToNotes}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCopy(toolOutput)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
                      title="Copy"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{toolOutput}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
