import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Check,
  CheckSquare,
  Tag,
  Volume2,
  Search,
  FileText,
  Lightbulb,
  Briefcase,
  User,
  BookOpen,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { VoiceMemo, AppLanguage, TaskItem, NoteItem } from '../types';
import { transcribeVoiceAudio } from '../utils/aiVoiceService';

interface VoiceMemosViewProps {
  voiceMemos: VoiceMemo[];
  onAddVoiceMemo: (memo: VoiceMemo) => void;
  onDeleteVoiceMemo: (id: string) => void;
  onAddTask: (task: TaskItem) => void;
  onAddNote: (note: NoteItem) => void;
  language: AppLanguage;
  isRTL: boolean;
}

export const VoiceMemosView: React.FC<VoiceMemosViewProps> = ({
  voiceMemos,
  onAddVoiceMemo,
  onDeleteVoiceMemo,
  onAddTask,
  onAddNote,
  language,
  isRTL,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMemo, setSelectedMemo] = useState<VoiceMemo | null>(
    voiceMemos.length > 0 ? voiceMemos[0] : null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedNoteMemoId, setSavedNoteMemoId] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [addedTaskId, setAddedTaskId] = useState<string | null>(null);
  const [manualNoteInput, setManualNoteInput] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Setup Web Speech API for real-time dictation
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang =
        language === 'ug' ? 'ug-CN' : language === 'tr' ? 'tr-TR' : language === 'ar' ? 'ar-SA' : 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setLiveTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition warning:', event.error);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const startRecording = async () => {
    try {
      setLiveTranscript('');
      audioChunksRef.current = [];
      setRecordingSeconds(0);

      // Start MediaRecorder if microphone is available
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
      }

      // Start speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          // ignore if already active
        }
      }

      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to access microphone:', err);
      setIsRecording(true); // Still allow speech dictation or fallback
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopAndProcessRecording = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    setIsProcessing(true);

    let transcriptToProcess = liveTranscript.trim() || manualNoteInput.trim();

    // Fallback: If browser speech recognition failed or was empty, transcribe recorded audio via Gemini
    if (!transcriptToProcess && audioChunksRef.current.length > 0) {
      try {
        const audioBlob = new Blob(audioChunksRef.current, { type: audioChunksRef.current[0]?.type || 'audio/webm' });
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => {
            const res = reader.result as string;
            resolve(res.split(',')[1] || '');
          };
          reader.readAsDataURL(audioBlob);
        });
        const base64 = await base64Promise;
        if (base64) {
          const geminiTranscribed = await transcribeVoiceAudio(base64, audioBlob.type || 'audio/webm', language);
          if (geminiTranscribed && geminiTranscribed.trim()) {
            transcriptToProcess = geminiTranscribed.trim();
          }
        }
      } catch (e) {
        console.warn('Fallback audio transcription failed:', e);
      }
    }

    if (!transcriptToProcess) {
      transcriptToProcess = language === 'ug' ? 'تېز ئاۋازلىق كىرگۈزۈش خاتىرىسى' : 'Quick voice note';
    }

    try {
      const res = await fetch('/api/process-voice-memo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawTranscript: transcriptToProcess,
          language,
        }),
      });

      if (!res.ok) throw new Error('Processing failed');
      const data = await res.json();

      const newMemo: VoiceMemo = {
        id: `memo-${Date.now()}`,
        title: data.title || (language === 'ug' ? 'يېڭى ئاۋازلىق خاتىرە' : 'New Voice Memo'),
        transcript: data.transcript || transcriptToProcess,
        durationSec: recordingSeconds || 15,
        createdAt: new Date().toISOString(),
        summary: data.summary || (language === 'ug' ? 'مەزمۇن خۇلاسىسى ئېلىندى.' : 'Summary generated.'),
        actionItems: data.actionItems || [],
        tags: data.tags || ['VoiceAI', 'Productivity'],
        category: data.category || 'idea',
      };

      onAddVoiceMemo(newMemo);
      setSelectedMemo(newMemo);
      setLiveTranscript('');
      setManualNoteInput('');
    } catch (err) {
      console.error('Error processing memo with AI:', err);
      // Fallback local memo
      const fallbackMemo: VoiceMemo = {
        id: `memo-${Date.now()}`,
        title: transcriptToProcess.slice(0, 30) || (language === 'ug' ? 'ئاۋازلىق خاتىرە' : 'Voice Memo'),
        transcript: transcriptToProcess,
        durationSec: recordingSeconds || 10,
        createdAt: new Date().toISOString(),
        summary: language === 'ug' ? 'ئاۋازلىق خاتىرە ساقلاندى.' : 'Voice memo saved.',
        actionItems: [language === 'ug' ? 'خاتىرىنى قايتا رەتلەش' : 'Review transcript'],
        tags: ['Voice', 'QuickNote'],
        category: 'idea',
      };
      onAddVoiceMemo(fallbackMemo);
      setSelectedMemo(fallbackMemo);
      setLiveTranscript('');
    } finally {
      setIsProcessing(false);
      setRecordingSeconds(0);
    }
  };

  const cancelRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setLiveTranscript('');
    setRecordingSeconds(0);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConvertToTask = (actionItem: string, index: number) => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}-${index}`,
      title: actionItem,
      completed: false,
      priority: 'high',
      category: selectedMemo?.category === 'meeting' ? 'planning' : 'personal',
      createdAt: new Date().toISOString(),
      dueDate: new Date().toISOString().split('T')[0],
    };
    onAddTask(newTask);
    setAddedTaskId(`${selectedMemo?.id}-${index}`);
    setTimeout(() => setAddedTaskId(null), 2500);
  };

  const handleSaveAsNote = () => {
    if (!selectedMemo) return;
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: `🎙️ ${selectedMemo.title}`,
      content: `# ${selectedMemo.title}\n\n**خۇلاسە (Summary):**\n${selectedMemo.summary}\n\n**تەپسىلىي يازما (Transcript):**\n${selectedMemo.transcript}\n\n**ھەرىكەت تەۋسىيەلىرى (Action Items):**\n${selectedMemo.actionItems.map((item) => `- [ ] ${item}`).join('\n')}`,
      tags: selectedMemo.tags,
      pinned: false,
      updatedAt: new Date().toISOString(),
    };
    onAddNote(newNote);
    setSavedNoteMemoId(selectedMemo.id);
    setTimeout(() => setSavedNoteMemoId(null), 2500);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredMemos = voiceMemos.filter((memo) => {
    const matchesCategory = selectedCategory === 'all' || memo.category === selectedCategory;
    const matchesSearch =
      memo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memo.transcript.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memo.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'meeting':
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-emerald-500" />;
      case 'learning':
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      case 'personal':
        return <User className="w-4 h-4 text-amber-500" />;
      default:
        return <Lightbulb className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600/15 via-teal-600/10 to-indigo-600/15 border border-emerald-500/25 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              {language === 'ug' ? 'Gemini 3.5 Transcribe & 3.7 Flash' : 'AI Voice Secretary'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {language === 'ug'
                ? '🎙️ ئاۋازلىق خاتىرە ۋە ئەقلىي ئايلاندۇرغۇچ'
                : language === 'tr'
                ? '🎙️ Sesli Notlar & Akıllı Transkripsiyon'
                : language === 'ar'
                ? '🎙️ المذكرات الصوتية والتحويل الذكي'
                : '🎙️ AI Voice Memos & Transcriber'}
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1 max-w-2xl">
              {language === 'ug'
                ? 'مىكروفون ئارقىلىق پىكىر ۋە كۈندىلىك ۋەزىپىلىرىڭىزنى ئەركىن سۆزلەڭ. سۈنئىي ئىدراك ئاپتوماتىك ھالدا يازمىغا ئايلاندۇرىدۇ، خۇلاسە چىقىرىدۇ ۋە تەۋسىيەلىك ۋەزىپىلەرگە ئايرىپ بېرىدۇ.'
                : 'Dictate thoughts freely. Gemini transcribes in real-time, extracts core takeaways, and formats actionable tasks.'}
            </p>
          </div>

          {/* Quick Record Action Box */}
          <div className="flex items-center gap-3">
            {!isRecording ? (
              <button
                id="start-voice-recording-btn"
                onClick={startRecording}
                disabled={isProcessing}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium rounded-xl shadow-lg shadow-emerald-600/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                <Mic className="w-5 h-5 animate-pulse" />
                <span>
                  {language === 'ug' ? 'ئاۋاز كىرگۈزۈشنى باشلاش' : 'Start Voice Recording'}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 p-2 rounded-xl">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-mono font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  {formatTime(recordingSeconds)}
                </div>
                <button
                  id="finish-voice-recording-btn"
                  onClick={stopAndProcessRecording}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg shadow cursor-pointer transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'ug' ? 'تاماملاش & AI تەھلىل' : 'Finish & Transcribe'}</span>
                </button>
                <button
                  id="cancel-voice-recording-btn"
                  onClick={cancelRecording}
                  className="p-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50 rounded-lg cursor-pointer transition-colors"
                  title="Cancel"
                >
                  <Square className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Audio Waves / Recording Status */}
        {isRecording && (
          <div className="mt-4 pt-4 border-t border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {language === 'ug' ? 'ئاۋاز قوبۇللىنىۋاتىدۇ... سۆزلەڭ:' : 'Listening and capturing audio live:'}
            </div>
            <div className="p-3 bg-white/70 dark:bg-neutral-900/70 backdrop-blur rounded-xl border border-emerald-500/30 min-h-[50px] text-sm text-neutral-800 dark:text-neutral-200 font-mono">
              {liveTranscript || (language === 'ug' ? 'ئاۋازىڭىز تىڭشالماقتا...' : 'Dictating...')}
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-indigo-500 animate-spin" />
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              {language === 'ug'
                ? 'Gemini سۈنئىي ئىدراك ئاۋازنى تېكىستكە ئايلاندۇرۇپ، ۋەزىپە ۋە خۇلاسىلەرنى ئايرىۋاتىدۇ...'
                : 'Gemini is structuring your voice memo into takeaways and action tasks...'}
            </span>
          </div>
        )}
      </div>

      {/* Main Grid: Memo List (Left) & Detailed View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Memo Sidebar List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filter Bar & Search */}
          <div className="bg-white dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/80 rounded-xl p-3 shadow-xs space-y-3">
            <div className="relative">
              <Search className={`w-4 h-4 absolute top-3 text-neutral-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                id="search-voice-memos-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ug' ? 'ئاۋازلىق خاتىرىلەردىن ئىزدەش...' : 'Search voice memos...'}
                className={`w-full text-sm bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700 rounded-lg py-2 ${
                  isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'
                } text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
              />
            </div>

            {/* Category Badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', labelUg: 'ھەممىسى', labelEn: 'All' },
                { id: 'idea', labelUg: '💡 پىكىر', labelEn: '💡 Idea' },
                { id: 'meeting', labelUg: '💼 يىغىن', labelEn: '💼 Meeting' },
                { id: 'task', labelUg: '✅ ۋەزىپە', labelEn: '✅ Task' },
                { id: 'personal', labelUg: '👤 شەخسىي', labelEn: '👤 Personal' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-700/50 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  {language === 'ug' ? cat.labelUg : cat.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Manual Dictation fallback */}
          <div className="bg-white dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/80 rounded-xl p-3 shadow-xs">
            <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1.5 flex items-center justify-between">
              <span>{language === 'ug' ? '✍️ تېز تېكىست كىرگۈزۈپ AI دىن خۇلاسە ئېلىش' : '✍️ Quick Text Dictation to AI'}</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualNoteInput}
                onChange={(e) => setManualNoteInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && manualNoteInput.trim()) {
                    stopAndProcessRecording();
                  }
                }}
                placeholder={language === 'ug' ? 'پىكىر ياكى ئاۋاز تېكىستىنى كىرگۈزۈڭ...' : 'Type quick note...'}
                className="flex-1 text-xs bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={stopAndProcessRecording}
                disabled={!manualNoteInput.trim() || isProcessing}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg cursor-pointer"
              >
                {language === 'ug' ? 'ئايلاندۇرۇش' : 'Process'}
              </button>
            </div>
          </div>

          {/* List of Memos */}
          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {filteredMemos.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-neutral-800/50 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl">
                <Mic className="w-8 h-8 mx-auto text-neutral-400 mb-2 opacity-50" />
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {language === 'ug' ? 'خاتىرە تېپىلمىدى.' : 'No voice memos found.'}
                </p>
              </div>
            ) : (
              filteredMemos.map((memo) => {
                const isSelected = selectedMemo?.id === memo.id;
                return (
                  <div
                    key={memo.id}
                    id={`memo-item-${memo.id}`}
                    onClick={() => setSelectedMemo(memo)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500/60 shadow-xs'
                        : 'bg-white dark:bg-neutral-800/80 border-neutral-200/80 dark:border-neutral-700/80 hover:border-neutral-300 dark:hover:border-neutral-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-md bg-neutral-100 dark:bg-neutral-700">
                          {getCategoryIcon(memo.category)}
                        </span>
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                          {memo.title}
                        </h3>
                      </div>
                      <span className="text-[11px] text-neutral-400 flex items-center gap-1 shrink-0 font-mono">
                        <Clock className="w-3 h-3" />
                        {memo.durationSec}s
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-2 leading-relaxed">
                      {memo.summary || memo.transcript}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-100 dark:border-neutral-700/50">
                      <span>{new Date(memo.createdAt).toLocaleDateString()}</span>
                      {memo.actionItems.length > 0 && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          {memo.actionItems.length} {language === 'ug' ? 'ۋەزىپە' : 'tasks'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Memo Detail Card (Right) */}
        <div className="lg:col-span-7">
          {selectedMemo ? (
            <div className="bg-white dark:bg-neutral-800/90 border border-neutral-200/80 dark:border-neutral-700/80 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      {getCategoryIcon(selectedMemo.category)}
                      {selectedMemo.category.toUpperCase()}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      {new Date(selectedMemo.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    {selectedMemo.title}
                  </h2>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    id="save-memo-as-note-btn"
                    onClick={handleSaveAsNote}
                    className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Save to Knowledge Notes"
                  >
                    {savedNoteMemoId === selectedMemo.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <FileText className="w-4 h-4 text-indigo-500" />
                    )}
                    <span className="hidden sm:inline">
                      {savedNoteMemoId === selectedMemo.id
                        ? (language === 'ug' ? 'ساقلاندى!' : 'Saved!')
                        : (language === 'ug' ? 'خاتىرىگە قوشۇش' : 'Save Note')}
                    </span>
                  </button>
                  <button
                    id="delete-memo-btn"
                    onClick={() => {
                      onDeleteVoiceMemo(selectedMemo.id);
                      setSelectedMemo(null);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg cursor-pointer transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* AI Executive Summary */}
              <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    {language === 'ug' ? 'سۈنئىي ئىدراك خۇلاسىسى & مەزمۇن يادروسى' : 'AI Executive Summary & Core Takeaway'}
                  </span>
                  <button
                    onClick={() => handleCopy(selectedMemo.summary, `summary-${selectedMemo.id}`)}
                    className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === `summary-${selectedMemo.id}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
                  {selectedMemo.summary}
                </p>
              </div>

              {/* Action Items extracted by AI */}
              {selectedMemo.actionItems.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                    {language === 'ug' ? 'ھەرىكەت ۋەزىپىلىرى (Actionable Tasks)' : 'Extracted Action Items'}
                  </h4>
                  <div className="space-y-2">
                    {selectedMemo.actionItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-700/80 rounded-xl text-sm"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-neutral-800 dark:text-neutral-200">{item}</span>
                        </div>
                        <button
                          onClick={() => handleConvertToTask(item, idx)}
                          className="px-2.5 py-1 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-600 hover:text-white dark:text-emerald-400 dark:hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          {addedTaskId === `${selectedMemo.id}-${idx}` ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>{language === 'ug' ? 'قوشۇلدى!' : 'Added!'}</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>{language === 'ug' ? 'ۋەزىپىگە كىرگۈزۈش' : 'Push to Tasks'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Transcript */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-neutral-400" />
                    {language === 'ug' ? 'تولۇق يازما تېكىستى (Full Transcript)' : 'Polished Transcript'}
                  </h4>
                  <button
                    onClick={() => handleCopy(selectedMemo.transcript, `trans-${selectedMemo.id}`)}
                    className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === `trans-${selectedMemo.id}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{language === 'ug' ? 'نۇسخىلاش' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-700/80 rounded-xl text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans whitespace-pre-wrap">
                  {selectedMemo.transcript}
                </div>
              </div>

              {/* Tags */}
              {selectedMemo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {selectedMemo.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-700/60 text-neutral-600 dark:text-neutral-300 text-xs flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3 text-neutral-400" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-white dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/80 rounded-2xl text-center">
              <Mic className="w-12 h-12 text-emerald-500/40 mb-3" />
              <h3 className="text-base font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'ug' ? 'خاتىرە تاللانمىدى' : 'No Memo Selected'}
              </h3>
              <p className="text-sm text-neutral-500 max-w-sm">
                {language === 'ug'
                  ? 'سول تەرەپتىن خاتىرە تاللاڭ ياكى يۇقىرىدىكى كۇنۇپكا بىلەن يېڭى ئاۋاز خاتىرىلەڭ.'
                  : 'Select a memo from the sidebar or record a new one above.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
