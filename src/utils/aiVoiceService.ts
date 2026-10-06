import { AppLanguage } from '../types';
import { latinOrPinyinToUyghurArabic } from './UyghurScriptConverter';

let currentAudio: HTMLAudioElement | null = null;
let currentAbortController: AbortController | null = null;

/**
 * Clean markdown symbols, emojis, and code formatting to ensure clean speech reading
 */
export function cleanTextForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .replace(/`([^`]+)`/g, '$1') // remove backticks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // link labels
    .replace(/[*#_~>•]/g, ' ') // markdown symbols
    .replace(/https?:\/\/\S+/g, '') // URLs
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Stop any ongoing audio playback and speech synthesis
 */
export function stopSpeakingAi(): void {
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
  }
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.src = '';
    } catch {}
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

/**
 * Speaks text using high-fidelity Gemini AI TTS (with natural Uyghur, Turkish, Arabic, and English pronunciation)
 * and falls back to Web Speech API when appropriate.
 */
export async function speakTextAi(
  text: string,
  lang: AppLanguage,
  options?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): Promise<() => void> {
  // Stop existing playback
  stopSpeakingAi();

  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) {
    options?.onEnd?.();
    return () => {};
  }

  const abortController = new AbortController();
  currentAbortController = abortController;

  try {
    options?.onStart?.();

    // Call server TTS endpoint powered by Gemini 3.1 Flash TTS
    const response = await fetch('/api/text-to-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: cleaned,
        language: lang,
        voice: 'Kore',
      }),
      signal: abortController.signal,
    });

    if (abortController.signal.aborted) return () => {};

    if (!response.ok) {
      throw new Error(`TTS server error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.audioBase64) {
      throw new Error('No audio base64 in TTS response');
    }

    const audioUrl = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    audio.onended = () => {
      if (currentAudio === audio) currentAudio = null;
      options?.onEnd?.();
    };

    audio.onerror = (e) => {
      console.warn('Audio element error, falling back to Web Speech:', e);
      if (currentAudio === audio) currentAudio = null;
      fallbackToBrowserTTS(cleaned, lang, options);
    };

    await audio.play();
  } catch (err: any) {
    if (abortController.signal.aborted) return () => {};
    console.warn('Gemini TTS failed, attempting browser Web Speech fallback:', err);
    fallbackToBrowserTTS(cleaned, lang, options);
  }

  return () => {
    stopSpeakingAi();
    options?.onEnd?.();
  };
}

/**
 * Fallback to browser SpeechSynthesis if network fails or for basic reading
 */
function fallbackToBrowserTTS(
  text: string,
  lang: AppLanguage,
  options?: { onStart?: () => void; onEnd?: () => void; onError?: (err: any) => void }
) {
  if (!('speechSynthesis' in window)) {
    options?.onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (lang === 'tr') utterance.lang = 'tr-TR';
    else if (lang === 'ar') utterance.lang = 'ar-SA';
    else if (lang === 'en') utterance.lang = 'en-US';
    else utterance.lang = 'ug';

    utterance.onstart = () => options?.onStart?.();
    utterance.onend = () => options?.onEnd?.();
    utterance.onerror = (e) => {
      options?.onError?.(e);
      options?.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    options?.onError?.(e);
    options?.onEnd?.();
  }
}

/**
 * Records user's voice directly from microphone via MediaRecorder.
 * Works seamlessly in all modern browsers and handles iframe permissions.
 */
export async function startVoiceRecorder(): Promise<{
  stop: () => Promise<{ blob: Blob; base64: string; mimeType: string }>;
}> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Microphone recording is not supported in this browser');
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });

  const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
    ? 'audio/webm;codecs=opus'
    : MediaRecorder.isTypeSupported('audio/webm')
    ? 'audio/webm'
    : MediaRecorder.isTypeSupported('audio/mp4')
    ? 'audio/mp4'
    : 'audio/ogg';

  const mediaRecorder = new MediaRecorder(stream, { mimeType });
  const chunks: BlobPart[] = [];

  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  mediaRecorder.start(250); // Slice every 250ms

  return {
    stop: () => {
      return new Promise<{ blob: Blob; base64: string; mimeType: string }>((resolve, reject) => {
        mediaRecorder.onstop = () => {
          // Stop all audio tracks to turn off the microphone indicator
          stream.getTracks().forEach((track) => track.stop());

          const blob = new Blob(chunks, { type: mimeType });
          const reader = new FileReader();
          reader.onloadend = () => {
            const resultStr = reader.result as string;
            const base64 = resultStr.replace(/^data:[^;]+;base64,/, '');
            resolve({ blob, base64, mimeType });
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        };

        try {
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
          }
        } catch (err) {
          reject(err);
        }
      });
    },
  };
}

/**
 * Transcribes voice audio data using Gemini Multimodal Audio Model (with specialized Uyghur script transcription)
 */
export async function transcribeVoiceAudio(
  audioBase64: string,
  mimeType: string,
  language: AppLanguage
): Promise<string> {
  const response = await fetch('/api/transcribe-voice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      audioBase64,
      mimeType,
      language,
    }),
  });

  if (!response.ok) {
    throw new Error(`Transcription failed: ${response.status}`);
  }

  const data = await response.json();
  const rawTranscript = (data.transcript || '').trim();
  if (language === 'ug' && rawTranscript) {
    return latinOrPinyinToUyghurArabic(rawTranscript);
  }
  return rawTranscript;
}
