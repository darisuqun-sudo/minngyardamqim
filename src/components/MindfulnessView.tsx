import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Wind,
  Headphones,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Smile,
  Frown,
  Meh,
  Sun,
  CloudRain,
  Waves,
  TreePine,
  Bell,
  Volume2,
  VolumeX,
  BookOpen,
  Calendar,
  Send,
  Check,
  RefreshCw,
  Plus,
  Trash2,
} from 'lucide-react';
import { AppLanguage, MoodJournalEntry, BreathingPreset } from '../types';

interface MindfulnessViewProps {
  lang: AppLanguage;
}

export const MindfulnessView: React.FC<MindfulnessViewProps> = ({ lang }) => {
  const isRTL = lang === 'ug' || lang === 'ar';

  const [activeTab, setActiveTab] = useState<'breathing' | 'ambient' | 'journal'>('breathing');

  // --- Breathing State ---
  const breathingPresets: BreathingPreset[] = [
    {
      id: '4-7-8',
      name: lang === 'ug' ? '4-7-8 چوڭقۇر خاتىرجەملىك' : '4-7-8 Relaxing Breath',
      desc: lang === 'ug' ? 'بېسىمنى يوقىتىش ۋە تىنچ ئۇخلاشقا ياردەم بېرىدۇ' : 'Reduces anxiety and calms the nervous system',
      inhaleSec: 4,
      holdSec: 7,
      exhaleSec: 8,
    },
    {
      id: 'box',
      name: lang === 'ug' ? 'قۇتا شەكىللىك نەپەس (Box Breathing)' : 'Box Breathing (4-4-4-4)',
      desc: lang === 'ug' ? 'زېھىننى كۈچەيتىش ۋە جىددىيلىكنى پەسەيتىش' : 'Improves focus and resets cognitive clarity',
      inhaleSec: 4,
      holdSec: 4,
      exhaleSec: 4,
      holdPostSec: 4,
    },
    {
      id: 'balance',
      name: lang === 'ug' ? '5-5 تەڭپۇڭلۇق نەپىسى' : '5-5 Coherence Breathing',
      desc: lang === 'ug' ? 'يۈرەك سوقۇشى ۋە روھىي ھالەتنى تەڭپۇڭلاشتۇرۇش' : 'Heart rate coherence and stress balancing',
      inhaleSec: 5,
      holdSec: 0,
      exhaleSec: 5,
    },
  ];

  const [selectedPreset, setSelectedPreset] = useState<BreathingPreset>(breathingPresets[0]);
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdPost'>('inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(4);
  const [totalCyclesDone, setTotalCyclesDone] = useState<number>(0);

  // Web Audio Context for Procedural Sounds & Chime
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playSoftChime = (freq = 440) => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {}
  };

  // Breathing Loop Timer
  useEffect(() => {
    if (!isBreathingActive) return;

    const interval = setInterval(() => {
      setPhaseSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Transition to next phase
        if (breathPhase === 'inhale') {
          if (selectedPreset.holdSec > 0) {
            setBreathPhase('hold');
            playSoftChime(520);
            return selectedPreset.holdSec;
          } else {
            setBreathPhase('exhale');
            playSoftChime(380);
            return selectedPreset.exhaleSec;
          }
        } else if (breathPhase === 'hold') {
          setBreathPhase('exhale');
          playSoftChime(380);
          return selectedPreset.exhaleSec;
        } else if (breathPhase === 'exhale') {
          if (selectedPreset.holdPostSec && selectedPreset.holdPostSec > 0) {
            setBreathPhase('holdPost');
            playSoftChime(440);
            return selectedPreset.holdPostSec;
          } else {
            setBreathPhase('inhale');
            setTotalCyclesDone((c) => c + 1);
            playSoftChime(440);
            return selectedPreset.inhaleSec;
          }
        } else {
          setBreathPhase('inhale');
          setTotalCyclesDone((c) => c + 1);
          playSoftChime(440);
          return selectedPreset.inhaleSec;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingActive, breathPhase, selectedPreset]);

  const startBreathing = () => {
    getAudioContext();
    setIsBreathingActive(true);
    setBreathPhase('inhale');
    setPhaseSecondsLeft(selectedPreset.inhaleSec);
    playSoftChime(440);
  };

  const stopBreathing = () => {
    setIsBreathingActive(false);
    setBreathPhase('inhale');
    setPhaseSecondsLeft(selectedPreset.inhaleSec);
  };

  // --- Ambient Sounds State (Synthesized procedural generator) ---
  const [activeSound, setActiveSound] = useState<'none' | 'rain' | 'waves' | 'forest'>('none');
  const [ambientVolume, setAmbientVolume] = useState<number>(0.5);

  const stopAmbientSound = () => {
    if (noiseSourceRef.current) {
      try {
        (noiseSourceRef.current as any).stop?.();
        noiseSourceRef.current.disconnect();
      } catch {}
      noiseSourceRef.current = null;
    }
    setActiveSound('none');
  };

  const playAmbientSound = (soundType: 'rain' | 'waves' | 'forest') => {
    stopAmbientSound();
    const ctx = getAudioContext();

    // Create pink/brown noise buffer for natural soothing texture
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter node to shape rain vs waves vs forest
    const filter = ctx.createBiquadFilter();
    if (soundType === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, ctx.currentTime);
    } else if (soundType === 'waves') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);
    } else {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
    }

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(ambientVolume * 0.4, ctx.currentTime);
    ambientGainRef.current = gainNode;

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start();
    noiseSourceRef.current = whiteNoise;
    setActiveSound(soundType);
  };

  const handleVolumeChange = (vol: number) => {
    setAmbientVolume(vol);
    if (ambientGainRef.current && audioCtxRef.current) {
      ambientGainRef.current.gain.setValueAtTime(vol * 0.4, audioCtxRef.current.currentTime);
    }
  };

  // --- Mood & Gratitude Journal State ---
  const [journalEntries, setJournalEntries] = useState<MoodJournalEntry[]>(() => {
    const saved = localStorage.getItem('app_mindfulness_journal');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'entry-1',
        timestamp: new Date().toISOString(),
        dateStr: new Date().toISOString().slice(0, 10),
        moodLevel: 4,
        moodTag: 'calm',
        gratitudeNotes: ['يېڭى بىر كۈننىڭ باشلانغانلىقى', 'تېخنىكىلىق ئىشلارنىڭ ئوڭۇشلۇق مېڭىشى'],
        reflectionText: 'بۈگۈن زېھنىمنى سۈزۈك تۇتۇشقا تىرىشتىم.',
        aiEmpathyMessage: 'ئېسىل كۈن! ئۆزىڭىزگە بولغان ئىزچىل مۇئامىلە روھىي تىنچلىقىڭىزنى زور دەرىجىدە ساقلاپ قالىدۇ.',
      },
    ];
  });

  const [currentMoodLevel, setCurrentMoodLevel] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [currentMoodTag, setCurrentMoodTag] = useState<MoodJournalEntry['moodTag']>('calm');
  const [gratitudeInputs, setGratitudeInputs] = useState<string[]>(['', '']);
  const [reflectionInput, setReflectionInput] = useState<string>('');
  const [isSubmittingJournal, setIsSubmittingJournal] = useState<boolean>(false);
  const [latestEmpathyReply, setLatestEmpathyReply] = useState<string | null>(null);

  const saveJournalEntries = (entries: MoodJournalEntry[]) => {
    setJournalEntries(entries);
    try {
      localStorage.setItem('app_mindfulness_journal', JSON.stringify(entries));
    } catch {}
  };

  const handleAddJournalEntry = async () => {
    const cleanGratitudes = gratitudeInputs.filter((g) => g.trim().length > 0);
    setIsSubmittingJournal(true);

    let empathyMsg = '';
    try {
      const res = await fetch('/api/mindfulness/reflect-mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: currentMoodTag,
          moodLevel: currentMoodLevel,
          reflectionText: reflectionInput,
          gratitudeNotes: cleanGratitudes,
          language: lang,
        }),
      });
      const data = await res.json();
      empathyMsg = data.empathyMessage || '';
      setLatestEmpathyReply(empathyMsg);
    } catch {
      empathyMsg = 'خاتىرىڭىز ساقلاندى. خاتىرجەم بولۇڭ.';
    } finally {
      setIsSubmittingJournal(false);
    }

    const newEntry: MoodJournalEntry = {
      id: `mood-${Date.now()}`,
      timestamp: new Date().toISOString(),
      dateStr: new Date().toISOString().slice(0, 10),
      moodLevel: currentMoodLevel,
      moodTag: currentMoodTag,
      gratitudeNotes: cleanGratitudes,
      reflectionText: reflectionInput,
      aiEmpathyMessage: empathyMsg,
    };

    saveJournalEntries([newEntry, ...journalEntries]);
    setReflectionInput('');
    setGratitudeInputs(['', '']);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-teal-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
              <Heart className="w-3.5 h-3.5 text-rose-300" />
              <span>{lang === 'ug' ? 'روھىي خاتىرجەملىك & زېھىن مەشىقى' : 'Mindfulness & Somatic Health'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {lang === 'ug' ? '🧘 پىسخىكىلىق خاتىرجەملىك & نەپەس مەشىقى' : 'Mindfulness, Breathwork & Inner Calm'}
            </h2>
            <p className="mt-2 text-sm text-teal-100 max-w-2xl leading-relaxed">
              {lang === 'ug'
                ? 'پەننىي نەپەس مەشىقى (4-7-8 & Box Breathing)، تەبىئەتنىڭ ئاق شاۋقۇن ئاۋازلىرى ۋە سۈنئىي ئىدراك ھېسداشلىق كەيپىيات خاتىرىسى ئارقىلىق زېھنىڭىزنى تىنىچلاندۇرۇڭ.'
                : 'Somatic breathwork pacing, procedural nature soundscapes, and empathetic emotion journaling designed to reset cognitive fatigue.'}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('breathing')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'breathing' ? 'bg-white text-slate-900 shadow-md' : 'text-white/80 hover:bg-white/20'
              }`}
            >
              {lang === 'ug' ? '🌬️ نەپەس مەشىقى' : 'Breathwork'}
            </button>
            <button
              onClick={() => setActiveTab('ambient')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ambient' ? 'bg-white text-slate-900 shadow-md' : 'text-white/80 hover:bg-white/20'
              }`}
            >
              {lang === 'ug' ? '🌧️ تەبىئەت ئاۋازى' : 'Nature Sounds'}
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'journal' ? 'bg-white text-slate-900 shadow-md' : 'text-white/80 hover:bg-white/20'
              }`}
            >
              {lang === 'ug' ? '📖 كەيپىيات خاتىرىسى' : 'Mood Journal'}
            </button>
          </div>
        </div>
      </div>

      {/* 1. Breathing Coach View */}
      {activeTab === 'breathing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Preset Selector */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Wind className="w-4 h-4 text-teal-600" />
              <span>{lang === 'ug' ? 'نەپەس قېلىپلىرى' : 'Breathing Presets'}</span>
            </h3>

            <div className="space-y-3">
              {breathingPresets.map((preset) => {
                const isSelected = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    disabled={isBreathingActive}
                    onClick={() => {
                      setSelectedPreset(preset);
                      setPhaseSecondsLeft(preset.inhaleSec);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{preset.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-teal-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{preset.desc}</p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-teal-700 dark:text-teal-300">
                      <span>Inhale: {preset.inhaleSec}s</span>
                      {preset.holdSec > 0 && <span>• Hold: {preset.holdSec}s</span>}
                      <span>• Exhale: {preset.exhaleSec}s</span>
                      {preset.holdPostSec ? <span>• Hold: {preset.holdPostSec}s</span> : null}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>{lang === 'ug' ? 'تاماملانغان دەۋرىيلىك:' : 'Completed Cycles:'}</span>
              <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">{totalCyclesDone}</span>
            </div>
          </div>

          {/* Interactive Breathing Visual Orb */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xs flex flex-col items-center justify-center min-h-[440px] relative overflow-hidden">
            {/* Pulsing Visual Orb */}
            <div className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80">
              {/* Outer Glow Ring */}
              <div
                className={`absolute rounded-full transition-all duration-1000 ease-in-out ${
                  breathPhase === 'inhale'
                    ? 'w-64 h-64 sm:w-80 sm:h-80 bg-teal-400/20 scale-110 blur-xl'
                    : breathPhase === 'hold' || breathPhase === 'holdPost'
                    ? 'w-64 h-64 sm:w-80 sm:h-80 bg-amber-400/20 scale-105 blur-lg'
                    : 'w-40 h-40 sm:w-48 sm:h-48 bg-cyan-400/20 scale-90 blur-md'
                }`}
              />

              {/* Main Sphere */}
              <div
                className={`rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-1000 ease-in-out text-white select-none ${
                  breathPhase === 'inhale'
                    ? 'w-48 h-48 sm:w-60 sm:h-60 bg-gradient-to-tr from-teal-500 to-emerald-400 scale-110 shadow-teal-500/30'
                    : breathPhase === 'hold' || breathPhase === 'holdPost'
                    ? 'w-48 h-48 sm:w-60 sm:h-60 bg-gradient-to-tr from-amber-500 to-yellow-400 scale-105 shadow-amber-500/30'
                    : 'w-36 h-36 sm:w-44 sm:h-44 bg-gradient-to-tr from-cyan-600 to-blue-500 scale-95 shadow-cyan-500/30'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/90">
                  {breathPhase === 'inhale'
                    ? (lang === 'ug' ? 'نەپەس ئېلىڭ' : 'Inhale')
                    : breathPhase === 'hold' || breathPhase === 'holdPost'
                    ? (lang === 'ug' ? 'تۇتۇپ تۇرۇڭ' : 'Hold')
                    : (lang === 'ug' ? 'نەپەس چىقىرىڭ' : 'Exhale')}
                </span>
                <span className="text-4xl sm:text-5xl font-black mt-1 font-mono tracking-tight">
                  {phaseSecondsLeft}
                </span>
                <span className="text-[10px] text-white/80 mt-1">
                  {selectedPreset.name}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex items-center gap-3">
              {!isBreathingActive ? (
                <button
                  onClick={startBreathing}
                  className="px-8 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-teal-500/25 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{lang === 'ug' ? 'مەشىقنى باشلاش' : 'Start Session'}</span>
                </button>
              ) : (
                <button
                  onClick={stopBreathing}
                  className="px-8 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-500/25 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>{lang === 'ug' ? 'توختىتىش' : 'Pause'}</span>
                </button>
              )}

              <button
                onClick={() => {
                  stopBreathing();
                  setTotalCyclesDone(0);
                }}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
                title="Reset Cycles"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Nature Ambient Sounds View */}
      {activeTab === 'ambient' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 max-w-4xl mx-auto">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Headphones className="w-5 h-5 text-teal-600" />
              <span>{lang === 'ug' ? 'تەبىئەتنىڭ ئاق شاۋقۇن ۋە تىنچلىق ئاۋازلىرى' : 'Procedural Nature Soundscapes'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'ug'
                ? 'Web Audio پەننىي شاۋقۇن مودېلى ئارقىلىق ياسالغان، تورسىزمۇ ئىشلەيدىغان راھەتلىنىش ئاۋازلىرى.'
                : '100% synthesized procedural Web Audio ambient generators (no external file dependencies).'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Rain */}
            <div
              className={`p-6 rounded-2xl border transition-all text-center flex flex-col items-center justify-between gap-4 ${
                activeSound === 'rain'
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900 text-blue-600 flex items-center justify-center">
                <CloudRain className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{lang === 'ug' ? 'مۇلايىم يامغۇر' : 'Gentle Rain'}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{lang === 'ug' ? 'سوۋۇتۇش ۋە دىققەت يىغىش' : 'White Noise Filter'}</p>
              </div>
              <button
                onClick={() => (activeSound === 'rain' ? stopAmbientSound() : playAmbientSound('rain'))}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeSound === 'rain' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {activeSound === 'rain' ? (lang === 'ug' ? 'توختىتىش' : 'Stop') : (lang === 'ug' ? 'ئاڭلاش' : 'Play Rain')}
              </button>
            </div>

            {/* Ocean Waves */}
            <div
              className={`p-6 rounded-2xl border transition-all text-center flex flex-col items-center justify-between gap-4 ${
                activeSound === 'waves'
                  ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-400 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-900 text-teal-600 flex items-center justify-center">
                <Waves className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{lang === 'ug' ? 'تىنچ ئوكيان دولقۇنى' : 'Ocean Waves'}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{lang === 'ug' ? 'چوڭقۇر راھەتلىنىش' : 'Bandpass Filter'}</p>
              </div>
              <button
                onClick={() => (activeSound === 'waves' ? stopAmbientSound() : playAmbientSound('waves'))}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeSound === 'waves' ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {activeSound === 'waves' ? (lang === 'ug' ? 'توختىتىش' : 'Stop') : (lang === 'ug' ? 'ئاڭلاش' : 'Play Waves')}
              </button>
            </div>

            {/* Forest */}
            <div
              className={`p-6 rounded-2xl border transition-all text-center flex flex-col items-center justify-between gap-4 ${
                activeSound === 'forest'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900 text-emerald-600 flex items-center justify-center">
                <TreePine className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{lang === 'ug' ? 'ئورمانلىق شامىلى' : 'Forest Breeze'}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{lang === 'ug' ? 'تەبىئەت نەپىسى' : 'Lowpass Wind'}</p>
              </div>
              <button
                onClick={() => (activeSound === 'forest' ? stopAmbientSound() : playAmbientSound('forest'))}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  activeSound === 'forest' ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {activeSound === 'forest' ? (lang === 'ug' ? 'توختىتىش' : 'Stop') : (lang === 'ug' ? 'ئاڭلاش' : 'Play Forest')}
              </button>
            </div>
          </div>

          {/* Volume Control */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <Volume2 className="w-4 h-4 text-slate-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ambientVolume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <span className="text-xs font-mono text-slate-500 w-12 text-right">
              {Math.round(ambientVolume * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* 3. Mood & Gratitude Journal View */}
      {activeTab === 'journal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* New Journal Entry Form */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{lang === 'ug' ? 'بۈگۈنكى كەيپىيات ۋە مىننەتدارلىق' : 'Mindful Emotion Check-in'}</span>
            </h3>

            {/* Mood Level Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {lang === 'ug' ? 'ھازىرقى روھىي ھالىتىڭىز:' : 'How are you feeling right now?'}
              </label>
              <div className="grid grid-cols-5 gap-2">
                {([1, 2, 3, 4, 5] as const).map((lvl) => {
                  const isPicked = currentMoodLevel === lvl;
                  const icons = {
                    1: '😫',
                    2: '😔',
                    3: '😐',
                    4: '😊',
                    5: '🌟',
                  };
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setCurrentMoodLevel(lvl)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isPicked
                          ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 scale-105 shadow-xs font-bold'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl">{icons[lvl]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gratitude Prompts */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {lang === 'ug' ? 'بۈگۈن شۈكۈر قىلىدىغان 2 مۇھىم ئىش:' : 'Two things you feel grateful for today:'}
              </label>
              {gratitudeInputs.map((val, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={val}
                  onChange={(e) => {
                    const next = [...gratitudeInputs];
                    next[idx] = e.target.value;
                    setGratitudeInputs(next);
                  }}
                  placeholder={`${idx + 1}. ...`}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              ))}
            </div>

            {/* Reflection Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {lang === 'ug' ? 'شەخسىي ئويلار ياكى قەلب بايانى:' : 'Personal Reflection:'}
              </label>
              <textarea
                rows={3}
                value={reflectionInput}
                onChange={(e) => setReflectionInput(e.target.value)}
                placeholder={lang === 'ug' ? 'كۆڭلىڭىزدىكىنى ئەركىن يېزىڭ...' : 'Write freely...'}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            <button
              onClick={handleAddJournalEntry}
              disabled={isSubmittingJournal}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmittingJournal ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{lang === 'ug' ? 'ئانالىز قىلىنىۋاتىدۇ...' : 'Reflecting...'}</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{lang === 'ug' ? 'كەيپىياتنى ساقلاش (AI Empathy Coach)' : 'Record & Reflect'}</span>
                </>
              )}
            </button>
          </div>

          {/* Journal Entries List */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4 max-h-[600px] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>{lang === 'ug' ? 'ئىلگىرىكى خاتىرىلەر' : 'Journal Timeline'}</span>
            </h3>

            <div className="space-y-4">
              {journalEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {entry.dateStr}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                      Level {entry.moodLevel}/5
                    </span>
                  </div>

                  {entry.gratitudeNotes?.length > 0 && (
                    <div className="pt-1">
                      <p className="text-[10px] font-bold text-slate-500">{lang === 'ug' ? 'شۈكۈر قىلغانلىرىم:' : 'Grateful for:'}</p>
                      <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mt-0.5 space-y-0.5">
                        {entry.gratitudeNotes.map((g, idx) => (
                          <li key={idx}>{g}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {entry.reflectionText && (
                    <p className="text-slate-600 dark:text-slate-400 italic">
                      "{entry.reflectionText}"
                    </p>
                  )}

                  {entry.aiEmpathyMessage && (
                    <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 text-teal-900 dark:text-teal-200">
                      <span className="font-bold text-teal-700 dark:text-teal-300">🌿 AI مەسلىھەتچى: </span>
                      {entry.aiEmpathyMessage}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
