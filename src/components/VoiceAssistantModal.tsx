import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  Send,
  Loader2,
  Radio,
  Check,
  RotateCcw,
  Phone,
  PhoneOff,
  PhoneCall,
  Headphones,
  AlertCircle,
} from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';
import {
  speakTextAi,
  stopSpeakingAi,
  startVoiceRecorder,
  transcribeVoiceAudio,
} from '../utils/aiVoiceService';
import { latinOrPinyinToUyghurArabic } from '../utils/UyghurScriptConverter';

interface VoiceAssistantModalProps {
  lang: AppLanguage;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (text: string) => Promise<string | void>;
}

type CallMode = 'liveCall' | 'pushToTalk';
type LiveCallStatus = 'idle' | 'listening' | 'transcribing' | 'thinking' | 'speaking' | 'muted';

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  lang,
  isOpen,
  onClose,
  onSendMessage,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRTL = lang === 'ug' || lang === 'ar';

  // Mode: Hands-free Live Call vs Manual Push-to-Talk
  const [callMode, setCallMode] = useState<CallMode>('liveCall');
  const [liveStatus, setLiveStatus] = useState<LiveCallStatus>('idle');
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);

  // States
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Refs for audio & VAD
  const recorderRef = useRef<{ stop: () => Promise<{ blob: Blob; base64: string; mimeType: string }> } | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const vadAnimationRef = useRef<number | null>(null);
  const timerRef = useRef<any>(null);
  const callDurationTimerRef = useRef<any>(null);
  const stopSpeakFnRef = useRef<(() => void) | null>(null);
  const isCallActiveRef = useRef<boolean>(false);
  const isSpeakingRef = useRef<boolean>(false);
  const isProcessingRef = useRef<boolean>(false);
  const isTranscribingRef = useRef<boolean>(false);

  // Keep refs in sync with state
  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);
  useEffect(() => {
    isProcessingRef.current = isProcessing;
  }, [isProcessing]);
  useEffect(() => {
    isTranscribingRef.current = isTranscribing;
  }, [isTranscribing]);

  // Clean up when modal closes
  useEffect(() => {
    if (!isOpen) {
      endEntireCall();
      return;
    }

    // Auto-start live call if opened in liveCall mode
    if (callMode === 'liveCall') {
      startLiveCall();
    }

    return () => {
      endEntireCall();
    };
  }, [isOpen]);

  const endEntireCall = () => {
    isCallActiveRef.current = false;
    stopListening();
    stopSpeaking();
    stopVad();
    if (callDurationTimerRef.current) {
      clearInterval(callDurationTimerRef.current);
      callDurationTimerRef.current = null;
    }
    setLiveStatus('idle');
    setCallDurationSeconds(0);
    setAudioLevel(0);
  };

  const startLiveCall = async () => {
    endEntireCall();
    isCallActiveRef.current = true;
    setLiveStatus('listening');
    setErrorMessage('');

    callDurationTimerRef.current = setInterval(() => {
      setCallDurationSeconds((prev) => prev + 1);
    }, 1000);

    await startListeningContinuous();
  };

  // VAD (Voice Activity Detection) loop
  const startVad = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let silenceStart: number | null = null;
      let hasDetectedSpeech = false;

      const checkAudio = () => {
        if (!isCallActiveRef.current || isMuted) {
          vadAnimationRef.current = requestAnimationFrame(checkAudio);
          return;
        }

        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(100, Math.round(avg * 1.5)));

        // Speech detection threshold
        const SPEECH_THRESHOLD = 20;
        if (avg > SPEECH_THRESHOLD) {
          hasDetectedSpeech = true;
          silenceStart = null;
        } else if (hasDetectedSpeech) {
          if (!silenceStart) {
            silenceStart = Date.now();
          } else {
            const silenceDuration = Date.now() - silenceStart;
            // 1.8 seconds of silence after user has spoken triggers auto-submit
            if (silenceDuration > 1800 && !isProcessingRef.current && !isTranscribingRef.current) {
              hasDetectedSpeech = false;
              silenceStart = null;
              handleAutoSubmitSpeech();
              return;
            }
          }
        }

        vadAnimationRef.current = requestAnimationFrame(checkAudio);
      };

      vadAnimationRef.current = requestAnimationFrame(checkAudio);
    } catch (e) {
      console.warn('VAD AudioContext init failed:', e);
    }
  };

  const stopVad = () => {
    if (vadAnimationRef.current) {
      cancelAnimationFrame(vadAnimationRef.current);
      vadAnimationRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  };

  const startListeningContinuous = async () => {
    if (!isCallActiveRef.current) return;
    setErrorMessage('');
    stopSpeaking();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      startVad(stream);

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.start(250);

      recorderRef.current = {
        stop: () => {
          return new Promise((resolve, reject) => {
            mediaRecorder.onstop = () => {
              stream.getTracks().forEach((track) => track.stop());
              const blob = new Blob(chunks, { type: mimeType });
              const reader = new FileReader();
              reader.onloadend = () => {
                const res = (reader.result as string).replace(/^data:[^;]+;base64,/, '');
                resolve({ blob, base64: res, mimeType });
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            };
            if (mediaRecorder.state !== 'inactive') {
              mediaRecorder.stop();
            }
          });
        },
      };

      setIsListening(true);
      setLiveStatus('listening');
      setRecordingSeconds(0);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Error starting live voice recorder:', err);
      setIsListening(false);
      setLiveStatus('idle');
      setErrorMessage(
        lang === 'ug'
          ? 'مىكروفوننى ئىشلىتىشكە رۇخسەت بېرىلمىدى.'
          : 'Microphone permission denied.'
      );
    }
  };

  const handleAutoSubmitSpeech = async () => {
    if (!recorderRef.current || !isCallActiveRef.current) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsListening(false);
    stopVad();

    setLiveStatus('transcribing');
    setIsTranscribing(true);

    try {
      const { base64, mimeType } = await recorderRef.current.stop();
      recorderRef.current = null;

      const userText = await transcribeVoiceAudio(base64, mimeType, lang);
      const cleanedText = (userText || '').trim();

      if (cleanedText && cleanedText.length > 1) {
        const authenticScript = lang === 'ug' ? latinOrPinyinToUyghurArabic(cleanedText) : cleanedText;
        setTranscript(authenticScript);
        setConversationHistory((prev) => [...prev, { role: 'user', text: authenticScript }]);

        setLiveStatus('thinking');
        setIsProcessing(true);

        const aiResponse = await onSendMessage(authenticScript);
        setIsProcessing(false);

        if (aiResponse && typeof aiResponse === 'string') {
          setResponse(aiResponse);
          setConversationHistory((prev) => [...prev, { role: 'ai', text: aiResponse }]);

          setLiveStatus('speaking');
          await speakResponseTextContinuous(aiResponse);
        } else {
          // If no response, restart listening
          if (isCallActiveRef.current) {
            await startListeningContinuous();
          }
        }
      } else {
        // Nothing heard, resume listening
        if (isCallActiveRef.current) {
          await startListeningContinuous();
        }
      }
    } catch (e: any) {
      console.error('Auto submit speech error:', e);
      if (isCallActiveRef.current) {
        setTimeout(() => startListeningContinuous(), 1500);
      }
    } finally {
      setIsTranscribing(false);
      setIsProcessing(false);
    }
  };

  const speakResponseTextContinuous = async (text: string) => {
    stopSpeaking();
    if (!text || !isCallActiveRef.current) return;

    try {
      setIsSpeaking(true);
      const stopFn = await speakTextAi(text, lang, {
        onStart: () => {
          setIsSpeaking(true);
          setLiveStatus('speaking');
        },
        onEnd: () => {
          setIsSpeaking(false);
          // AI finished speaking, auto-resume listening for user reply!
          if (isCallActiveRef.current) {
            setLiveStatus('listening');
            startListeningContinuous();
          }
        },
        onError: () => {
          setIsSpeaking(false);
          if (isCallActiveRef.current) {
            setLiveStatus('listening');
            startListeningContinuous();
          }
        },
      });
      stopSpeakFnRef.current = stopFn;
    } catch (e) {
      setIsSpeaking(false);
      if (isCallActiveRef.current) {
        startListeningContinuous();
      }
    }
  };

  const stopSpeaking = () => {
    if (stopSpeakFnRef.current) {
      stopSpeakFnRef.current();
      stopSpeakFnRef.current = null;
    }
    stopSpeakingAi();
    setIsSpeaking(false);
  };

  const stopListening = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsListening(false);
    stopVad();

    if (recorderRef.current) {
      try {
        const { base64, mimeType } = await recorderRef.current.stop();
        recorderRef.current = null;
        if (callMode === 'pushToTalk') {
          setIsTranscribing(true);
          const text = await transcribeVoiceAudio(base64, mimeType, lang);
          if (text) {
            const authenticScript = lang === 'ug' ? latinOrPinyinToUyghurArabic(text) : text;
            setTranscript(authenticScript);
          }
          setIsTranscribing(false);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div
        className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-center relative overflow-hidden flex flex-col max-h-[90vh]"
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        {/* Glow ambient background */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            liveStatus === 'speaking'
              ? 'bg-purple-500/30'
              : liveStatus === 'thinking'
              ? 'bg-amber-500/20'
              : isListening
              ? 'bg-emerald-500/25'
              : 'bg-indigo-500/20'
          }`}
        />

        {/* Close Button */}
        <button
          onClick={() => {
            endEntireCall();
            onClose();
          }}
          className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors cursor-pointer z-20`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mode Switcher Banner */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 pt-1">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              onClick={() => {
                setCallMode('liveCall');
                startLiveCall();
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                callMode === 'liveCall'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{lang === 'ug' ? '📱 داۋاملىق سۆزلىشىش (Call)' : 'Live Voice Call'}</span>
            </button>
            <button
              onClick={() => {
                setCallMode('pushToTalk');
                endEntireCall();
              }}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                callMode === 'pushToTalk'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{lang === 'ug' ? 'قولدا بېسىپ سۆزلەش' : 'Push-to-Talk'}</span>
            </button>
          </div>

          {callMode === 'liveCall' && (
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block mr-1" />
              {formatSeconds(callDurationSeconds)}
            </span>
          )}
        </div>

        {/* Status Call Header */}
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {callMode === 'liveCall'
              ? lang === 'ug'
                ? '🎙️ قول تەگمەيدىغان داۋاملىق ئاۋازلىق پاراڭ'
                : '🎙️ Hands-Free Live AI Voice Call'
              : t.voiceInputTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {liveStatus === 'speaking'
              ? lang === 'ug'
                ? 'سۈنئىي ئىدراك جاۋابنى ئوقۇپ بېرىۋاتىدۇ...'
                : 'AI is speaking the response...'
              : liveStatus === 'thinking'
              ? lang === 'ug'
                ? 'سۈنئىي ئىدراك ئويلاۋاتىدۇ ۋە جاۋاب تەييارلاۋاتىدۇ...'
                : 'AI is thinking and reasoning...'
              : liveStatus === 'transcribing'
              ? lang === 'ug'
                ? 'ئاۋازىڭىز چۈشىنىشلىك قىلىپ تېكىستكە ئايلىنىۋاتىدۇ...'
                : 'Transcribing speech with Gemini...'
              : isListening
              ? lang === 'ug'
                ? 'خۇددى تېلېفوندا پاراڭلاشقاندەك ئەركىن سۆزلەڭ (پۈتكەندە ئاپتوماتىك قوبۇل قىلىدۇ)...'
                : 'Speak naturally like a phone call (auto-detects pause)...'
              : lang === 'ug'
              ? 'سۆزلىشىشنى باشلاش ئۈچۈن مىكروفوننى بېسىڭ'
              : 'Press mic to talk'}
          </p>
        </div>

        {/* Pulsating Voice Visualizer & Avatar Circle */}
        <div className="py-4 flex flex-col items-center justify-center gap-4">
          <div className="relative flex items-center justify-center">
            {/* Animated Pulses */}
            {isListening && (
              <>
                <span
                  className="absolute rounded-full bg-emerald-500/20 transition-all duration-150 animate-ping"
                  style={{ width: `${100 + audioLevel * 0.8}px`, height: `${100 + audioLevel * 0.8}px` }}
                />
                <span
                  className="absolute rounded-full bg-emerald-500/30 transition-all duration-150"
                  style={{ width: `${90 + audioLevel * 0.5}px`, height: `${90 + audioLevel * 0.5}px` }}
                />
              </>
            )}

            {isSpeaking && (
              <>
                <span className="absolute w-36 h-36 rounded-full bg-purple-500/25 animate-ping" />
                <span className="absolute w-32 h-32 rounded-full bg-purple-500/35 animate-pulse" />
              </>
            )}

            {liveStatus === 'thinking' && (
              <span className="absolute w-32 h-32 rounded-full bg-amber-500/25 animate-spin" />
            )}

            {/* Central Master Circle Button */}
            <button
              onClick={() => {
                if (callMode === 'liveCall') {
                  if (liveStatus === 'listening') {
                    handleAutoSubmitSpeech();
                  } else if (liveStatus === 'speaking') {
                    stopSpeaking();
                    startListeningContinuous();
                  }
                } else {
                  if (isListening) stopListening();
                  else startListeningContinuous();
                }
              }}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 shadow-2xl cursor-pointer ${
                liveStatus === 'speaking'
                  ? 'bg-purple-600 text-white shadow-purple-600/40 ring-4 ring-purple-400/30'
                  : liveStatus === 'thinking' || liveStatus === 'transcribing'
                  ? 'bg-amber-600 text-white shadow-amber-600/40 animate-pulse'
                  : isListening
                  ? 'bg-emerald-600 text-white shadow-emerald-600/40 scale-105 ring-8 ring-emerald-500/20'
                  : 'bg-indigo-600 text-white hover:scale-105'
              }`}
            >
              {liveStatus === 'transcribing' || liveStatus === 'thinking' ? (
                <Loader2 className="w-10 h-10 animate-spin" />
              ) : liveStatus === 'speaking' ? (
                <Volume2 className="w-10 h-10 animate-bounce" />
              ) : isListening ? (
                <Mic className="w-10 h-10" />
              ) : (
                <MicOff className="w-10 h-10" />
              )}
            </button>
          </div>

          {/* Sound Wave Frequency Bars */}
          <div className="flex items-center gap-1.5 h-7">
            {[20, 50, 80, 45, 95, 60, 85, 40, 75, 30].map((h, i) => {
              const activeHeight = isListening
                ? Math.min(100, Math.max(15, (h * audioLevel) / 40))
                : isSpeaking
                ? h
                : 10;
              return (
                <span
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-100 ${
                    liveStatus === 'speaking'
                      ? 'bg-purple-500'
                      : isListening
                      ? 'bg-emerald-500'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  style={{
                    height: `${activeHeight}%`,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Live Conversation Transcript Box */}
        <div className="space-y-2 text-start flex-1 overflow-y-auto max-h-56 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
          {conversationHistory.length > 0 ? (
            conversationHistory.slice(-4).map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 ms-6'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 me-6 border border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-1 opacity-70">
                  {msg.role === 'user' ? (
                    <span>👤 سىز:</span>
                  ) : (
                    <span>🤖 ئەقلىي ياردەمچى:</span>
                  )}
                </div>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            ))
          ) : (
            <div className="h-28 flex flex-col items-center justify-center text-center text-slate-400 space-y-1">
              <Headphones className="w-8 h-8 opacity-40 stroke-[1.5]" />
              <p className="text-xs">
                {lang === 'ug'
                  ? 'سۆزلەشنى باشلاڭ، ئىككى تەرەپلىك پاراڭ مۇشۇ يەردە كۆرۈنىدۇ.'
                  : 'Start speaking, continuous conversation will appear here.'}
              </p>
            </div>
          )}
        </div>

        {errorMessage && (
          <p className="text-xs text-red-500 font-medium text-center bg-red-50 dark:bg-red-950/40 p-2 rounded-xl">
            {errorMessage}
          </p>
        )}

        {/* Controls Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          {/* Mute button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-2xl transition-all flex items-center gap-2 text-xs font-bold ${
              isMuted
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
            title="Mute mic"
          >
            {isMuted ? <MicOff className="w-4 h-4 text-amber-600" /> : <Mic className="w-4 h-4" />}
            <span className="hidden sm:inline">{isMuted ? (lang === 'ug' ? 'ئۈنسىز' : 'Muted') : (lang === 'ug' ? 'مىكروفون ئوچۇق' : 'Mute')}</span>
          </button>

          {/* End Call / Complete button */}
          <button
            onClick={() => {
              endEntireCall();
              onClose();
            }}
            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <PhoneOff className="w-4 h-4" />
            <span>{lang === 'ug' ? 'سۆزلىشىشنى قويۇش (End Call)' : 'End Call'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
