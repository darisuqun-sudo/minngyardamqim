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
} from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';
import {
  speakTextAi,
  stopSpeakingAi,
  startVoiceRecorder,
  transcribeVoiceAudio,
} from '../utils/aiVoiceService';

interface VoiceAssistantModalProps {
  lang: AppLanguage;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (text: string) => Promise<string | void>;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  lang,
  isOpen,
  onClose,
  onSendMessage,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRTL = lang === 'ug' || lang === 'ar';

  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const recorderRef = useRef<{ stop: () => Promise<{ blob: Blob; base64: string; mimeType: string }> } | null>(null);
  const timerRef = useRef<any>(null);
  const stopSpeakFnRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopListening();
      stopSpeaking();
      setTranscript('');
      setResponse('');
      setErrorMessage('');
      return;
    }

    return () => {
      stopListening();
      stopSpeaking();
    };
  }, [isOpen]);

  const startListening = async () => {
    setErrorMessage('');
    stopSpeaking();
    try {
      const recorder = await startVoiceRecorder();
      recorderRef.current = recorder;
      setIsListening(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Error starting audio recording:', err);
      setIsListening(false);
      setErrorMessage(
        lang === 'ug'
          ? 'مىكروفوننى ئىشلىتىشكە رۇخسەت بېرىلمىدى ياكى ئۈسكۈنە تېپىلمىدى.'
          : 'Microphone permission denied or device not found.'
      );
    }
  };

  const stopListening = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsListening(false);

    if (recorderRef.current) {
      try {
        setIsTranscribing(true);
        const { base64, mimeType } = await recorderRef.current.stop();
        recorderRef.current = null;

        // Transcribe voice with Gemini Multimodal Model (High-accuracy Uyghur)
        const text = await transcribeVoiceAudio(base64, mimeType, lang);
        if (text) {
          setTranscript(text);
        } else {
          setErrorMessage(
            lang === 'ug'
              ? 'ئاۋاز ئېنىق ئاڭلانمىدى، قايتا سۆزلەپ بېقىڭ.'
              : 'Could not hear clearly, please try speaking again.'
          );
        }
      } catch (err: any) {
        console.error('Transcription error:', err);
        setErrorMessage(
          lang === 'ug'
            ? 'ئاۋازنى تېكىستكە ئايلاندۇرۇشتا خاتالىق كۆرۈلدى.'
            : 'Error transcribing audio.'
        );
      } finally {
        setIsTranscribing(false);
        setRecordingSeconds(0);
      }
    }
  };

  const speakResponseText = async (text: string) => {
    stopSpeaking();
    if (!text) return;

    try {
      const stopFn = await speakTextAi(text, lang, {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
      stopSpeakFnRef.current = stopFn;
    } catch (e) {
      setIsSpeaking(false);
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

  const handleSendVoice = async () => {
    if (!transcript.trim()) return;
    setIsProcessing(true);
    stopSpeaking();

    try {
      const res = await onSendMessage(transcript);
      if (res && typeof res === 'string') {
        setResponse(res);
        // Automatically speak the response in Uyghur using Gemini TTS!
        await speakResponseText(res);
      }
    } catch (e) {
      console.error('Voice send error:', e);
      setErrorMessage(lang === 'ug' ? 'جاۋاب قايتۇرۇشتا خاتالىق كۆرۈلدى' : 'Error getting AI response');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div
        className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-center relative overflow-hidden"
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            stopSpeaking();
            stopListening();
            onClose();
          }}
          className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors cursor-pointer`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
            <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-500" />
            <span>{lang === 'ug' ? 'سۈنئىي ئەقىل ئاۋازلىق ياردەمچى' : 'Voice AI Realtime Assistant'}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.voiceInputTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isListening
              ? lang === 'ug'
                ? `ئاڭلاۋاتىدۇ... (${recordingSeconds}s) تاماملاش ئۈچۈن قايتا بېسىڭ`
                : `Listening... (${recordingSeconds}s) Click to stop`
              : isTranscribing
              ? lang === 'ug'
                ? 'ئاۋازىڭىز تېكىستكە ئايلاندۇرۇلماقتا...'
                : 'Transcribing voice audio...'
              : lang === 'ug'
              ? 'سۆزلەش ئۈچۈن مىكروفوننى بېسىڭ'
              : 'Click microphone to start speaking'}
          </p>
        </div>

        {/* Big Animated Mic Button with Waveform */}
        <div className="py-3 flex flex-col items-center justify-center gap-3">
          <div className="relative flex items-center justify-center">
            {isListening && (
              <>
                <span className="absolute w-32 h-32 rounded-full bg-rose-500/20 animate-ping" />
                <span className="absolute w-28 h-28 rounded-full bg-rose-500/30 animate-pulse" />
              </>
            )}
            {isSpeaking && (
              <span className="absolute w-32 h-32 rounded-full bg-indigo-500/25 animate-ping" />
            )}

            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isTranscribing || isProcessing}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 cursor-pointer shadow-xl ${
                isListening
                  ? 'bg-rose-600 text-white shadow-rose-600/40 scale-110 ring-8 ring-rose-500/20 animate-pulse'
                  : isSpeaking
                  ? 'bg-indigo-600 text-white shadow-indigo-600/40 ring-4 ring-indigo-400/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-105 active:scale-95'
              }`}
              title={isListening ? t.voiceInputStop : t.voiceInputStart}
            >
              {isListening ? (
                <Mic className="w-10 h-10 animate-bounce" />
              ) : isTranscribing ? (
                <Loader2 className="w-9 h-9 animate-spin" />
              ) : (
                <MicOff className="w-9 h-9" />
              )}
            </button>
          </div>

          {/* Sound wave visualizer bars when listening */}
          {isListening && (
            <div className="flex items-center gap-1.5 h-6">
              {[40, 75, 55, 90, 60, 85, 45, 95, 65, 50].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-rose-500 rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.6s',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Live Transcript / Prompt Box */}
        <div className="space-y-2 text-start">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 min-h-[70px] text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            {transcript ? (
              <p className="leading-relaxed whitespace-pre-wrap">{transcript}</p>
            ) : (
              <p className="text-slate-400 italic">
                {isListening
                  ? lang === 'ug'
                    ? 'سۆزلەۋېرىڭ، ئاۋازىڭىز تامام بولغاندا ئاپتوماتىك تېكىستكە چۈشىدۇ...'
                    : 'Speak now, speech will be transcribed when stopped...'
                  : isTranscribing
                  ? lang === 'ug'
                    ? 'سۈنئىي ئەقىل ئاۋازنى تېكىستكە ئايلاندۇرۇۋاتىدۇ...'
                    : 'Transcribing speech with Gemini...'
                  : lang === 'ug'
                  ? 'سۆزلىگەن مەزمۇنىڭىز بۇ يەردە كۆرۈنىدۇ...'
                  : 'Speech will appear here...'}
              </p>
            )}
          </div>

          {errorMessage && (
            <p className="text-xs text-red-500 font-medium text-center bg-red-50 dark:bg-red-950/40 p-2 rounded-xl">
              {errorMessage}
            </p>
          )}
        </div>

        {/* AI Voice Response Output with Uyghur TTS */}
        {response && (
          <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-start space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{lang === 'ug' ? 'سۈنئىي ئەقىل جاۋابى (ئۇيغۇرچە ئوقۇش):' : 'AI Voice Response:'}</span>
              </div>
              <button
                onClick={isSpeaking ? stopSpeaking : () => speakResponseText(response)}
                className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-[11px] cursor-pointer ${
                  isSpeaking
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                    : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 hover:bg-indigo-200'
                }`}
                title={isSpeaking ? 'Stop speech' : 'Read aloud'}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                    <span>{lang === 'ug' ? 'توختىتىش' : 'Stop'}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{lang === 'ug' ? 'قايتا ئوقۇش' : 'Play'}</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap">
              {response}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={() => {
              stopSpeaking();
              setTranscript('');
              setResponse('');
              setErrorMessage('');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {lang === 'ug' ? 'تازىلاش' : 'Clear'}
          </button>

          <button
            onClick={handleSendVoice}
            disabled={!transcript.trim() || isProcessing || isTranscribing}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{lang === 'ug' ? 'جاۋاب ئېلىش' : 'Process with AI'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
