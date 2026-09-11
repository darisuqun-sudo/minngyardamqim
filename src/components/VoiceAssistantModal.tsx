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
} from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';

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
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      stopListening();
      stopSpeaking();
      setTranscript('');
      setResponse('');
      return;
    }

    // Initialize Web Speech API
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      // Set recognition language
      if (lang === 'ug') recognition.lang = 'ug-CN';
      else if (lang === 'tr') recognition.lang = 'tr-TR';
      else if (lang === 'ar') recognition.lang = 'ar-SA';
      else recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone permission denied. Please allow microphone access.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setErrorMessage(t.voiceNotSupported);
    }

    return () => {
      stopListening();
      stopSpeaking();
    };
  }, [isOpen, lang]);

  const startListening = () => {
    setErrorMessage('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting recognition:', err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
      setIsListening(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (lang === 'tr') utterance.lang = 'tr-TR';
      else if (lang === 'ar') utterance.lang = 'ar-SA';
      else if (lang === 'en') utterance.lang = 'en-US';
      else utterance.lang = 'ug';

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSendVoice = async () => {
    if (!transcript.trim()) return;
    setIsProcessing(true);
    stopListening();

    try {
      const res = await onSendMessage(transcript);
      if (res && typeof res === 'string') {
        setResponse(res);
        speakText(res);
      }
    } catch (e) {
      console.error('Voice send error:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-center relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
            <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-500" />
            <span>Voice AI Realtime Interface</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">
            {t.voiceInputTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isListening ? t.voiceInputListening : 'Click microphone to start speaking'}
          </p>
        </div>

        {/* Big Animated Mic Button */}
        <div className="py-4 flex justify-center items-center">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 relative ${
              isListening
                ? 'bg-red-500 text-white shadow-xl shadow-red-500/40 scale-110 animate-pulse ring-8 ring-red-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30'
            }`}
          >
            {isListening ? (
              <Mic className="w-10 h-10 animate-bounce" />
            ) : (
              <MicOff className="w-10 h-10" />
            )}
          </button>
        </div>

        {/* Live Transcript / Prompt Box */}
        <div className="space-y-2 text-left">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 min-h-[70px] text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            {transcript ? (
              <p>{transcript}</p>
            ) : (
              <p className="text-slate-400 italic">
                {isListening ? '...' : 'Speech will appear here in real-time...'}
              </p>
            )}
          </div>

          {errorMessage && (
            <p className="text-xs text-red-500 font-medium text-center">
              {errorMessage}
            </p>
          )}
        </div>

        {/* AI Voice Response Output */}
        {response && (
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-left space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Voice Response:</span>
              </div>
              <button
                onClick={isSpeaking ? stopSpeaking : () => speakText(response)}
                className="p-1 rounded-md text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100"
              >
                {isSpeaking ? (
                  <VolumeX className="w-4 h-4 text-red-500" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed max-h-36 overflow-y-auto">
              {response}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={() => {
              setTranscript('');
              setResponse('');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Clear
          </button>

          <button
            onClick={handleSendVoice}
            disabled={!transcript.trim() || isProcessing}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Process with AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
