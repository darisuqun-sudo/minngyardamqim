import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Download,
  Copy,
  Check,
  Mic,
  MicOff,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  Paperclip,
  Image as ImageIcon,
  FileText,
  X,
  Eye,
  Radio,
  FileCode,
  FileSpreadsheet,
  File,
  Maximize2,
  StopCircle,
  Play,
  Columns,
  SquareCode,
  LayoutTemplate,
  History,
  Plus,
  Search,
  Pin,
  PinOff,
  Edit3,
  MessageSquare,
  Clock,
  FileDown,
  FolderArchive,
  CheckCircle2,
  Menu,
  Folder,
  FolderGit2,
  SquarePen,
  MoreVertical,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  AudioLines,
  SlidersHorizontal,
  Settings,
  Upload,
  Camera,
  HardDrive,
  FolderPlus,
  Zap,
  Ban,
  Loader2,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AppLanguage, ChatMessage, ChatAttachment, AssistantPersona, ChatSession, NoteItem } from '../types';
import { LOCALIZED_PERSONAS } from '../data/localizedData';
import { TRANSLATIONS } from '../data/translations';
import { LiveCanvasSandbox, CanvasDocument } from './LiveCanvasSandbox';
import { ModelSelectorModal } from './ModelSelectorModal';
import { GoogleDriveModal } from './GoogleDriveModal';
import { getGeminiModelById, DEFAULT_GEMINI_MODEL_ID, GEMINI_MODELS } from '../data/geminiModels';
import { GeminiSideDrawer } from './GeminiSideDrawer';
import {
  speakTextAi,
  stopSpeakingAi,
  startVoiceRecorder,
  transcribeVoiceAudio,
} from '../utils/aiVoiceService';

interface AssistantChatViewProps {
  lang: AppLanguage;
  messages: ChatMessage[];
  chatSessions?: ChatSession[];
  activeSessionId?: string;
  selectedModelId?: string;
  onSelectModel?: (modelId: string) => void;
  onSendMessage: (text: string, personaId: string, attachments?: ChatAttachment[], modelId?: string) => void;
  onClearChat: () => void;
  onCreateNewSession?: () => void;
  onSelectSession?: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
  onRenameSession?: (sessionId: string, newTitle: string) => void;
  onTogglePinSession?: (sessionId: string) => void;
  onClearAllSessions?: () => void;
  isLoading: boolean;
  onOpenVoiceModal?: () => void;
  notes?: NoteItem[];
  onSaveNote?: (note: NoteItem) => void;
}

export const AssistantChatView: React.FC<AssistantChatViewProps> = ({
  lang,
  messages,
  chatSessions = [],
  activeSessionId,
  selectedModelId,
  onSelectModel,
  onSendMessage,
  onClearChat,
  onCreateNewSession,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  onTogglePinSession,
  onClearAllSessions,
  isLoading,
  onOpenVoiceModal,
  notes,
  onSaveNote,
}) => {
  const isRTL = lang === 'ug' || lang === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [input, setInput] = useState('');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(LOCALIZED_PERSONAS[0].id);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [speakingMsgIdx, setSpeakingMsgIdx] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);

  // Gemini Model Selector State
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  const activeModelId = selectedModelId || DEFAULT_GEMINI_MODEL_ID;
  const currentModelInfo = getGeminiModelById(activeModelId);

  // Live Server Status Heartbeat
  const [serverOnline, setServerOnline] = useState<boolean | null>(true);

  useEffect(() => {
    let isMounted = true;
    const checkServer = () => {
      fetch('/api/health')
        .then((res) => {
          if (isMounted) setServerOnline(res.ok);
        })
        .catch(() => {
          if (isMounted) setServerOnline(false);
        });
    };
    checkServer();
    const timer = setInterval(checkServer, 10000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  // Attachment Menu (+) & Google Drive State
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Model Selection Popover Menu State & Ref (matching user's photo)
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const modelMenuRef = useRef<HTMLDivElement>(null);

  // Gemini Side Drawer State (matching user's photo: 3-line menu button -> Gemini menu)
  const [isGeminiDrawerOpen, setIsGeminiDrawerOpen] = useState(false);

  // Workspace / Project Selector State
  // The 6 initial dummy items (tor, ئەقلىي ياردەمچى, qutluq-bazaar-server, qutluq-bazaar 8-19, brave-goodall, يېڭى) are removed per user request.
  const REMOVED_PROJECT_NAMES = new Set([
    'tor',
    'ئەقلىي ياردەمچى',
    'qutluq-bazaar-server',
    'qutluq-bazaar 8-19',
    'brave-goodall',
    'يېڭى',
    'yengi',
  ]);

  const [userProjects, setUserProjects] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gemini_user_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter((p) => typeof p === 'string' && !REMOVED_PROJECT_NAMES.has(p));
          return cleaned;
        }
      }
    } catch (e) {
      // ignore
    }
    return [];
  });

  const [selectedProject, setSelectedProject] = useState<string>(() => {
    const saved = localStorage.getItem('gemini_selected_project');
    if (saved && !REMOVED_PROJECT_NAMES.has(saved) && saved !== 'No Project') {
      return saved;
    }
    return 'No Project';
  });

  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [isCreatingNewFolder, setIsCreatingNewFolder] = useState(false);
  const [newFolderNameInput, setNewFolderNameInput] = useState('');
  const projectMenuRef = useRef<HTMLDivElement>(null);
  const projectSearchInputRef = useRef<HTMLInputElement>(null);
  const projectFolderInputRef = useRef<HTMLInputElement>(null);

  const handleSelectProject = (projectName: string) => {
    setSelectedProject(projectName);
    localStorage.setItem('gemini_selected_project', projectName);
    setIsProjectMenuOpen(false);
    setProjectSearchQuery('');
    setIsCreatingNewFolder(false);
  };

  const handleDeleteProject = (projectName: string) => {
    const updated = userProjects.filter((p) => p !== projectName);
    setUserProjects(updated);
    localStorage.setItem('gemini_user_projects', JSON.stringify(updated));
    if (selectedProject === projectName) {
      handleSelectProject('No Project');
    }
  };

  const handleAddNewFolder = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (!userProjects.includes(trimmed)) {
      const updated = [trimmed, ...userProjects];
      setUserProjects(updated);
      localStorage.setItem('gemini_user_projects', JSON.stringify(updated));
    }
    handleSelectProject(trimmed);
    setNewFolderNameInput('');
    setIsCreatingNewFolder(false);
  };

  const handleProjectFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    const first = fileList[0];
    const relPath = (first as any).webkitRelativePath || first.name;
    const folderOrFileName = relPath.includes('/') ? relPath.split('/')[0] : first.name.replace(/\.[^/.]+$/, '');
    const finalName = folderOrFileName || first.name;

    if (!userProjects.includes(finalName)) {
      const updated = [finalName, ...userProjects];
      setUserProjects(updated);
      localStorage.setItem('gemini_user_projects', JSON.stringify(updated));
    }
    handleSelectProject(finalName);

    // Also attach the chosen file(s) into chat attachment
    fileList.slice(0, 5).forEach((f) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setAttachments((prev) => [
          ...prev,
          {
            id: `proj-file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: f.name,
            type: f.type.startsWith('image/') ? 'image' : 'file',
            mimeType: f.type || 'application/octet-stream',
            size: f.size,
            dataUrl: content,
          },
        ]);
      };
      reader.readAsDataURL(f);
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        attachMenuRef.current &&
        !attachMenuRef.current.contains(e.target as Node)
      ) {
        setIsAttachMenuOpen(false);
      }
      if (
        modelMenuRef.current &&
        !modelMenuRef.current.contains(e.target as Node)
      ) {
        setIsModelMenuOpen(false);
      }
      if (
        projectMenuRef.current &&
        !projectMenuRef.current.contains(e.target as Node)
      ) {
        setIsProjectMenuOpen(false);
        setIsCreatingNewFolder(false);
      }
    };
    if (isAttachMenuOpen || isModelMenuOpen || isProjectMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAttachMenuOpen, isModelMenuOpen, isProjectMenuOpen]);

  // Chat History & Session Management State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState('');
  const [isDrawerSearchActive, setIsDrawerSearchActive] = useState(false);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [activeItemMenuId, setActiveItemMenuId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [autoTTS, setAutoTTS] = useState<boolean>(() => {
    return localStorage.getItem('assistant_auto_tts') === 'true';
  });
  const [isCanvasOpen, setIsCanvasOpen] = useState<boolean>(false);
  const [canvasDoc, setCanvasDoc] = useState<CanvasDocument | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  const [isTranscribingVoice, setIsTranscribingVoice] = useState(false);
  const voiceRecorderRef = useRef<{ stop: () => Promise<{ blob: Blob; base64: string; mimeType: string }> } | null>(null);
  const activeTtsStopRef = useRef<(() => void) | null>(null);

  const activePersona =
    LOCALIZED_PERSONAS.find((p) => p.id === selectedPersonaId) || LOCALIZED_PERSONAS[0];

  const currentSession = chatSessions.find((s) => s.id === activeSessionId) || {
    id: activeSessionId || 'default',
    title: lang === 'ug' ? 'نۆۋەتتىكى پاراڭ' : lang === 'tr' ? 'Mevcut Sohbet' : lang === 'ar' ? 'المحادثة الحالية' : 'Current Chat',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: messages,
    personaId: selectedPersonaId,
  };

  const filteredSessions = chatSessions.filter((s) => {
    if (!searchHistory.trim()) return true;
    const q = searchHistory.toLowerCase();
    const matchTitle = s.title.toLowerCase().includes(q);
    const matchContent = s.messages.some((m) => m.content.toLowerCase().includes(q));
    return matchTitle || matchContent;
  });

  const pinnedSessions = filteredSessions.filter((s) => s.pinned);
  const unpinnedSessions = filteredSessions.filter((s) => !s.pinned);

  // Helper to open any code block in the Live Canvas
  const handleOpenInCanvas = (code: string, language: string, title?: string) => {
    const cleanLang = (language || 'html').replace(/^language-/, '').toLowerCase();
    let docType: 'web' | 'markdown' | 'code' | 'json' = 'code';
    if (['html', 'htm', 'react', 'jsx', 'tsx', 'svg', 'vue'].includes(cleanLang)) {
      docType = 'web';
    } else if (['md', 'markdown'].includes(cleanLang)) {
      docType = 'markdown';
    } else if (['json'].includes(cleanLang)) {
      docType = 'json';
    }

    setCanvasDoc({
      id: `doc-${Date.now()}`,
      title: title || `${cleanLang.toUpperCase()} ${lang === 'ug' ? 'پروگراممىسى' : 'Snippet'}`,
      language: cleanLang,
      code: code.trim(),
      type: docType,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    setIsCanvasOpen(true);
  };

  const handleStartRename = (session: ChatSession, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingSessionId(session.id);
    setEditingTitle(session.title);
  };

  const handleSaveRename = (sessionId: string, e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (editingTitle.trim() && onRenameSession) {
      onRenameSession(sessionId, editingTitle.trim());
    }
    setEditingSessionId(null);
    setEditingTitle('');
  };

  const handleCancelRename = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingSessionId(null);
    setEditingTitle('');
  };

  const handleExportAllSessionsJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      totalSessions: chatSessions.length,
      sessions: chatSessions,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `All-AI-Chat-History-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatSessionTime = (iso: string) => {
    try {
      const d = new Date(iso);
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();
      if (isToday) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const renderSessionCard = (session: ChatSession) => {
    const isActive = session.id === activeSessionId;
    const isEditing = editingSessionId === session.id;
    const isConfirmingDelete = confirmDeleteId === session.id;
    const lastMsg = session.messages[session.messages.length - 1];
    const previewText = lastMsg ? lastMsg.content.slice(0, 75) : '';

    return (
      <div
        key={session.id}
        onClick={() => {
          if (!isEditing && onSelectSession) {
            onSelectSession(session.id);
            setIsHistoryOpen(false);
          }
        }}
        className={`group p-3 rounded-2xl border transition-all cursor-pointer relative ${
          isActive
            ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-500/80 shadow-xs ring-1 ring-indigo-500/50'
            : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
        }`}
      >
        {/* Editing Inline Form */}
        {isEditing ? (
          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              autoFocus
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveRename(session.id, e);
                if (e.key === 'Escape') handleCancelRename();
              }}
              className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-900 border border-indigo-500 focus:outline-none text-slate-900 dark:text-slate-100 font-semibold"
            />
            <div className="flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={(e) => handleCancelRename(e)}
                className="px-2 py-1 rounded-md text-[11px] text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                {lang === 'ug' ? 'بىكار قىلىش' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={(e) => handleSaveRename(session.id, e)}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-600 text-white hover:bg-indigo-500 flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>{lang === 'ug' ? 'ساقلاش' : 'Save'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            {/* Title & Active / Pin Status */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                )}
                <h4
                  className={`text-xs sm:text-sm font-semibold truncate ${
                    isActive
                      ? 'text-indigo-950 dark:text-indigo-200'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                  title={session.title}
                >
                  {session.title}
                </h4>
              </div>

              {/* Action Buttons */}
              <div
                className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Pin/Unpin */}
                {onTogglePinSession && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePinSession(session.id);
                    }}
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      session.pinned
                        ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                    title={
                      session.pinned
                        ? lang === 'ug'
                          ? 'سانجىشنى بىكار قىلىش'
                          : 'Unpin'
                        : lang === 'ug'
                        ? 'مۇھىم دەپ سانجىش'
                        : 'Pin'
                    }
                  >
                    {session.pinned ? (
                      <PinOff className="w-3.5 h-3.5" />
                    ) : (
                      <Pin className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}

                {/* Rename */}
                {onRenameSession && (
                  <button
                    onClick={(e) => handleStartRename(session, e)}
                    className="p-1 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                    title={lang === 'ug' ? 'تېمىسىنى ئۆزگەرتىش' : 'Rename'}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Delete */}
                {onDeleteSession && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDeleteId(session.id);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    title={lang === 'ug' ? 'سۆھبەتنى ئۆچۈرۈش' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Message Preview Snippet */}
            {previewText && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 break-words">
                {previewText}
              </p>
            )}

            {/* Footer Row: Timestamp & Message Count */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatSessionTime(session.updatedAt || session.createdAt)}
              </span>

              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 font-medium">
                {session.messages.length}{' '}
                {lang === 'ug'
                  ? 'ئالماشتۇرۇش'
                  : lang === 'tr'
                  ? 'mesaj'
                  : lang === 'ar'
                  ? 'رسالة'
                  : 'msgs'}
              </span>
            </div>

            {/* Inline Confirm Delete Confirmation */}
            {isConfirmingDelete && (
              <div
                className="mt-2 p-2 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-900/60 flex items-center justify-between gap-2 animate-in fade-in duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-[11px] font-medium text-red-700 dark:text-red-300">
                  {lang === 'ug' ? 'ئۆچۈرەمسىز؟' : 'Delete chat?'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDeleteId(null);
                    }}
                    className="px-2 py-0.5 rounded text-[10px] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    {lang === 'ug' ? 'ياق' : 'No'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeleteSession) onDeleteSession(session.id);
                      setConfirmDeleteId(null);
                    }}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white hover:bg-red-500 cursor-pointer"
                  >
                    {lang === 'ug' ? 'ھەئە' : 'Yes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, attachments]);

  // Adjust textarea height dynamically (grow down, never sideways)
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollH = textareaRef.current.scrollHeight;
      const targetH = Math.min(Math.max(scrollH, 44), 220);
      textareaRef.current.style.height = `${targetH}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  // Auto-speak new assistant message if autoTTS is enabled
  useEffect(() => {
    if (autoTTS && !isLoading && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'model' && lastMsg.content) {
        handleSpeakMessage(lastMsg.content, messages.length - 1);
      }
    }
  }, [messages, isLoading, autoTTS]);

  // Cleanup audio playback and recorder on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (activeTtsStopRef.current) activeTtsStopRef.current();
      stopSpeakingAi();
      if (voiceRecorderRef.current) {
        try {
          voiceRecorderRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const startRecordingSession = async () => {
    try {
      if (activeTtsStopRef.current) {
        activeTtsStopRef.current();
        activeTtsStopRef.current = null;
      }
      stopSpeakingAi();

      const recorder = await startVoiceRecorder();
      voiceRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (e) {
      console.warn('Microphone recording start failed:', e);
      setIsRecording(false);
      // Fallback: open voice assistant modal
      if (onOpenVoiceModal) onOpenVoiceModal();
    }
  };

  const stopRecordingSession = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);

    if (voiceRecorderRef.current) {
      try {
        setIsTranscribingVoice(true);
        const { base64, mimeType } = await voiceRecorderRef.current.stop();
        voiceRecorderRef.current = null;

        // Multimodal Gemini speech recognition with specialized Uyghur support
        const transcribedText = await transcribeVoiceAudio(base64, mimeType, lang);
        if (transcribedText) {
          setInput((prev) => (prev.trim() ? `${prev.trim()} ${transcribedText}` : transcribedText));
        }
      } catch (err) {
        console.error('Voice transcription error:', err);
      } finally {
        setIsTranscribingVoice(false);
        setRecordingSeconds(0);
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecordingSession();
    } else {
      startRecordingSession();
    }
  };

  // Text-To-Speech with natural Gemini AI voice and Uyghur pronunciation
  const handleSpeakMessage = async (text: string, idx: number) => {
    if (speakingMsgIdx === idx) {
      if (activeTtsStopRef.current) {
        activeTtsStopRef.current();
        activeTtsStopRef.current = null;
      }
      stopSpeakingAi();
      setSpeakingMsgIdx(null);
      return;
    }

    if (activeTtsStopRef.current) {
      activeTtsStopRef.current();
      activeTtsStopRef.current = null;
    }
    stopSpeakingAi();

    try {
      const stopFn = await speakTextAi(text, lang, {
        onStart: () => setSpeakingMsgIdx(idx),
        onEnd: () => setSpeakingMsgIdx(null),
        onError: () => setSpeakingMsgIdx(null),
      });
      activeTtsStopRef.current = stopFn;
    } catch (err) {
      console.error('Speech error:', err);
      setSpeakingMsgIdx(null);
    }
  };

  // File Upload Handlers
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newAttachments: ChatAttachment[] = [];

    for (const file of fileArray) {
      const isImg = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      const isText =
        file.type.startsWith('text/') ||
        file.name.endsWith('.ts') ||
        file.name.endsWith('.tsx') ||
        file.name.endsWith('.js') ||
        file.name.endsWith('.jsx') ||
        file.name.endsWith('.py') ||
        file.name.endsWith('.json') ||
        file.name.endsWith('.md') ||
        file.name.endsWith('.csv') ||
        file.name.endsWith('.sql') ||
        file.name.endsWith('.html') ||
        file.name.endsWith('.css');

      if (isImg) {
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        const base64Data = dataUrl.split(',')[1] || '';
        newAttachments.push({
          id: `att-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: 'image',
          mimeType: file.type || 'image/png',
          size: file.size,
          dataUrl,
          base64Data,
        });
      } else if (isPdf) {
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        const base64Data = dataUrl.split(',')[1] || '';
        newAttachments.push({
          id: `att-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: 'file',
          mimeType: 'application/pdf',
          size: file.size,
          dataUrl,
          base64Data,
        });
      } else if (isText) {
        const textContent = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsText(file);
        });
        newAttachments.push({
          id: `att-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: 'file',
          mimeType: file.type || 'text/plain',
          size: file.size,
          textContent,
        });
      } else {
        // Generic file fallback
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        const base64Data = dataUrl.split(',')[1] || '';
        newAttachments.push({
          id: `att-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: 'file',
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          dataUrl,
          base64Data,
        });
      }
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Submit Handler
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    if (isRecording) {
      stopRecordingSession();
    }

    onSendMessage(
      input.trim() || (attachments.length > 0 ? (lang === 'ug' ? 'قوشۇلغان ھۆججەت / رەسىمنى تەھلىل قىلىپ بەر' : 'Please analyze the attached file/image.') : ''),
      selectedPersonaId,
      attachments.length > 0 ? attachments : undefined,
      activeModelId
    );

    setInput('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePromptClick = (prompt: string) => {
    onSendMessage(prompt, selectedPersonaId, undefined, activeModelId);
  };

  // Robust clipboard copy with fallback
  const copyTextToClipboard = async (text: string): Promise<boolean> => {
    let success = false;
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch (err) {
        console.warn('Clipboard writeText failed, using fallback:', err);
      }
    }

    if (!success) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.width = '2em';
        textarea.style.height = '2em';
        textarea.style.padding = '0';
        textarea.style.border = 'none';
        textarea.style.outline = 'none';
        textarea.style.boxShadow = 'none';
        textarea.style.background = 'transparent';
        textarea.setAttribute('readonly', '');
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        success = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch (err) {
        console.error('Fallback execCommand copy failed:', err);
      }
    }
    return success;
  };

  const handleCopy = async (text: string, idx: number) => {
    await copyTextToClipboard(text);
    setCopiedIndex(idx);
    setTimeout(() => {
      setCopiedIndex((current) => (current === idx ? null : current));
    }, 2000);
  };

  const handleExportChat = () => {
    const formatted = messages
      .map(
        (m) =>
          `### ${m.role === 'user' ? 'User' : 'AI Assistant'} (${m.timestamp}):\n\n${m.content}\n`
      )
      .join('\n---\n\n');
    const blob = new Blob([formatted], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Assistant-Chat-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (att: ChatAttachment) => {
    if (att.mimeType === 'application/google-drive' || att.driveUrl) {
      return <HardDrive className="w-4 h-4 text-emerald-500" />;
    }
    if (att.type === 'image') return <ImageIcon className="w-4 h-4 text-emerald-500" />;
    if (att.name.endsWith('.pdf')) return <FileText className="w-4 h-4 text-rose-500" />;
    if (
      att.name.endsWith('.ts') ||
      att.name.endsWith('.tsx') ||
      att.name.endsWith('.js') ||
      att.name.endsWith('.py') ||
      att.name.endsWith('.json') ||
      att.name.endsWith('.sql')
    ) {
      return <FileCode className="w-4 h-4 text-indigo-500" />;
    }
    if (att.name.endsWith('.csv') || att.name.endsWith('.xlsx')) {
      return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
    }
    return <File className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div id="assistant-chat-container" className="space-y-4 pb-16 relative">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="*/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = '';
        }}
      />



      {/* Personas Carousel / Selector Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {lang === 'ug'
                ? 'مەخسۇس ياردەمچى خاراكتېرىنى تاللاڭ:'
                : lang === 'tr'
                ? 'Uzman Asistan Kimliğini Seçin:'
                : lang === 'ar'
                ? 'اختر شخصية الذكاء الاصطناعي المتخصصة:'
                : 'Select Assistant Persona:'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {LOCALIZED_PERSONAS.map((persona) => {
            const isSelected = selectedPersonaId === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => setSelectedPersonaId(persona.id)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs">
                    {persona.name[lang] || persona.name.en}
                  </span>
                  <span className="text-xs">
                    {persona.id === 'universal'
                      ? '✨'
                      : persona.id === 'planner'
                      ? '📐'
                      : persona.id === 'coder'
                      ? '💻'
                      : '✍️'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {persona.tagline[lang] || persona.tagline.en}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Layout (Single Chat vs Split Workspace Canvas) */}
      <div className={isCanvasOpen ? 'grid grid-cols-1 lg:grid-cols-2 gap-4 items-start' : 'w-full'}>
        {/* Main Chat Stream Container with Drag & Drop */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDraggingOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              handleFiles(e.dataTransfer.files);
            }
          }}
          className={`relative rounded-3xl bg-white dark:bg-slate-900 border transition-all shadow-sm flex flex-col h-[620px] ${
            isDraggingOver
              ? 'border-indigo-500 ring-2 ring-indigo-500/30'
              : 'border-slate-200 dark:border-slate-800'
          }`}
        >
        {/* Chat Window Top Bar: Gemini Drawer, Active Session, Model Selector & Action Controls */}
        <div className="px-3 sm:px-4 py-2 sm:py-2.5 border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs rounded-t-3xl select-none z-20">
          {/* Leading Side: Gemini ☰ Drawer & Current Chat Title */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              id="gemini-hamburger-menu-btn"
              type="button"
              onClick={() => setIsGeminiDrawerOpen((prev) => !prev)}
              className="p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-2 group shadow-2xs border border-slate-200/70 dark:border-slate-800 shrink-0"
              title={lang === 'ug' ? 'Gemini مېنۇسى (ئۈچ سىزىق)' : 'Gemini Menu'}
            >
              <Menu className="w-5 h-5 text-slate-700 dark:text-slate-200 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-100 font-sans">
                Gemini
              </span>
            </button>

            {/* Current Active Chat Title with Inline Edit */}
            {currentSession && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 max-w-[130px] sm:max-w-[200px] md:max-w-xs truncate">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                <span className="truncate font-medium" title={currentSession.title}>
                  {currentSession.title}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleStartRename(currentSession, e)}
                  className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5 rounded cursor-pointer shrink-0"
                  title={lang === 'ug' ? 'تېمىنى ئۆزگەرتىش' : 'Rename title'}
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Trailing Side: Middle Section (Model Selector, Canvas, Voice, Mute, Export, Clear, Shortcuts) */}
          <div className="flex items-center flex-wrap gap-1.5">
            {/* Live Server Heartbeat Indicator */}
            <div
              className={`px-2 py-1 rounded-xl text-[11px] font-medium flex items-center gap-1.5 border transition-all ${
                serverOnline === false
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900 animate-pulse'
                  : 'bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/60'
              }`}
              title={
                serverOnline === false
                  ? (lang === 'ug' ? 'مۇلازىمېتىر ئۇلانمىدى - ئۈستەل يۈزىدىكى بېكەتنى قوزغىتىش كۇنۇپكىسىنى بېسىڭ' : 'Server Offline - Start server')
                  : (lang === 'ug' ? 'مۇلازىمېتىر نۇرمال ئۇلاندى' : 'Server Connected')
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  serverOnline === false ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'
                }`}
              />
              <span className="hidden sm:inline-block">
                {serverOnline === false
                  ? (lang === 'ug' ? 'ئۈزۈك' : 'Offline')
                  : (lang === 'ug' ? 'نورمال' : 'Online')}
              </span>
            </div>

            {/* Gemini Model Selector Pill */}
            <button
              id="open-gemini-model-selector-btn"
              type="button"
              onClick={() => setIsModelSelectorOpen(true)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200/90 dark:border-indigo-800/90 flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95 shrink-0"
              title={lang === 'ug' ? 'Gemini مودېلىنى تاللاش' : 'Select Gemini Model'}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{currentModelInfo.name}</span>
              <span className="hidden lg:inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-200/60 dark:bg-indigo-900/80 text-indigo-800 dark:text-indigo-200">
                {lang === 'ug' ? currentModelInfo.badgeUg : currentModelInfo.badgeEn}
              </span>
              <ChevronDown className="w-3 h-3 text-indigo-400" />
            </button>

            {/* Live Split Canvas Workspace Toggle */}
            <button
              type="button"
              onClick={() => setIsCanvasOpen(!isCanvasOpen)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                isCanvasOpen
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60'
              }`}
              title={lang === 'ug' ? 'خىزمەت بوشلۇقى تاختىسى' : 'Split Workspace Canvas'}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {lang === 'ug'
                  ? 'خىزمەت تاختىسى'
                  : lang === 'tr'
                  ? 'Çalışma Tuvali'
                  : lang === 'ar'
                  ? 'لوحة العمل'
                  : 'Split Canvas'}
              </span>
            </button>

            {/* Voice Mode */}
            {onOpenVoiceModal && (
              <button
                type="button"
                onClick={onOpenVoiceModal}
                className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-indigo-100 dark:border-indigo-900/50"
                title={lang === 'ug' ? 'ئاۋازلىق پاراڭلىشىش ھالىتى' : 'Live Voice Mode'}
              >
                <Radio className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                <span className="hidden md:inline">
                  {lang === 'ug' ? 'ئاۋازلىق پاراڭ' : lang === 'tr' ? 'Sesli Sohbet' : lang === 'ar' ? 'محادثة صوتية' : 'Voice Mode'}
                </span>
              </button>
            )}

            {/* Auto-TTS Mode Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = !autoTTS;
                setAutoTTS(next);
                localStorage.setItem('assistant_auto_tts', String(next));
                if (!next) {
                  stopSpeakingAi();
                  setSpeakingMsgIdx(null);
                }
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                autoTTS
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60'
              }`}
              title={
                lang === 'ug'
                  ? 'ئاپتوماتىك ئاۋاز چىقىرىپ ئوقۇش (Auto-Speech)'
                  : 'Auto Speech Response'
              }
            >
              {autoTTS ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
              <span className="hidden md:inline">
                {autoTTS
                  ? lang === 'ug'
                    ? 'ئاپتوماتىك ئاۋاز'
                    : 'Auto-Voice'
                  : lang === 'ug'
                  ? 'ئاۋازسىز'
                  : 'Voice Off'}
              </span>
            </button>

            {/* Export Chat */}
            <button
              type="button"
              onClick={handleExportChat}
              disabled={messages.length === 0}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 disabled:opacity-40 transition-colors cursor-pointer"
              title={t.exportChat}
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Clear Chat */}
            <button
              type="button"
              onClick={onClearChat}
              disabled={messages.length === 0}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1 disabled:opacity-40 transition-colors cursor-pointer"
              title={t.clearChat}
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="h-4 w-px bg-slate-200 dark:border-slate-800 mx-0.5" />

            {/* Quick New Chat Button */}
            <button
              id="header-new-chat-btn"
              type="button"
              onClick={() => {
                if (onCreateNewSession) {
                  onCreateNewSession();
                }
                setInput('');
              }}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={lang === 'ug' ? 'يېڭى سۆھبەت' : 'New Chat'}
            >
              <SquarePen className="w-4 h-4" />
            </button>

            {/* Quick Search Button */}
            <button
              id="header-search-chat-btn"
              type="button"
              onClick={() => setIsGeminiDrawerOpen(true)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={lang === 'ug' ? 'سۆھبەتلەرنى ئىزدەش' : 'Search Chats'}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* History Drawer Button */}
            <button
              id="header-history-drawer-btn"
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={lang === 'ug' ? 'سۆھبەت تارىخى' : 'History'}
            >
              <Clock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drag & Drop Visual Overlay */}
        {isDraggingOver && (
          <div className="absolute inset-0 z-30 bg-indigo-600/10 dark:bg-indigo-900/30 backdrop-blur-xs flex flex-col items-center justify-center border-2 border-dashed border-indigo-500 rounded-3xl pointer-events-none p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg mb-3 animate-bounce">
              <Paperclip className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-indigo-950 dark:text-indigo-200">
              {lang === 'ug'
                ? 'رەسىم ياكى ھۆججەتنى بۇ يەرگە تاشلاڭ'
                : lang === 'tr'
                ? 'Resim veya Belgeleri Buraya Bırakın'
                : lang === 'ar'
                ? 'أفلت الصور أو الملفات هنا'
                : 'Drop Images or Files Here'}
            </h4>
            <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
              PNG, JPG, PDF, Code, Markdown, JSON & TXT
            </p>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 p-4">
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Bot className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {activePersona.name[lang] || activePersona.name.en}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {activePersona.description[lang] || activePersona.description.en}
                </p>
              </div>

              {/* Multimodal Feature Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1">
                  <Mic className="w-3 h-3" />
                  {lang === 'ug' ? 'ئاۋازلىق سۆزلەش' : 'Voice Input'}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-medium border border-indigo-200 dark:border-indigo-800/50 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  {lang === 'ug' ? 'رەسىم تەھلىلى' : 'Vision AI'}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-medium border border-amber-200 dark:border-amber-800/50 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {lang === 'ug' ? 'ھۆججەت ۋە كود' : 'Docs & Code'}
                </span>
              </div>

              {/* Persona Quick Prompt Chips */}
              <div className="w-full space-y-2 pt-3 text-left">
                <span className="text-[11px] font-bold text-slate-400 block text-center">
                  {t.quickSuggestions}
                </span>
                <div className="space-y-1.5">
                  {(
                    activePersona.promptSuggestions[lang] || activePersona.promptSuggestions.en
                  ).map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePromptClick(sug)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-xs text-left transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <span className="line-clamp-1">{sug}</span>
                      <ArrowIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Past Chats Quick-Launch on Welcome View */}
              {chatSessions.length > 0 && (
                <div className="w-full space-y-2 pt-2 text-left border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <History className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{lang === 'ug' ? 'ساقلانغان سۆھبەتلەرنى داۋاملاشتۇرۇش' : 'Resume Saved Chats'}</span>
                    </span>
                    <button
                      onClick={() => setIsHistoryOpen(true)}
                      className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      {lang === 'ug' ? 'ھەممىسىنى كۆرۈش' : 'View all'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {chatSessions.slice(0, 4).map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          if (onSelectSession) onSelectSession(s.id);
                        }}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-slate-700 text-left flex flex-col gap-1 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 truncate max-w-[150px]">
                            {s.title}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {s.messages.length} msgs
                          </span>
                        </div>
                        {s.messages[s.messages.length - 1] && (
                          <p className="text-[10px] text-slate-400 line-clamp-1">
                            {s.messages[s.messages.length - 1].content.slice(0, 50)}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id || idx}
                  className={`flex items-start gap-3 ${
                    isUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2.5 overflow-hidden ${
                      isUser
                        ? 'bg-indigo-600 text-white shadow-sm rounded-tr-none'
                        : 'bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-xs rounded-tl-none'
                    }`}
                  >
                    {/* Render message attachments if present */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-0.5 pb-1">
                        {msg.attachments.map((att) => {
                          if (att.type === 'image' && att.dataUrl) {
                            return (
                              <div
                                key={att.id}
                                onClick={() => setPreviewImageModal(att.dataUrl!)}
                                className="relative rounded-xl overflow-hidden border border-white/20 dark:border-slate-700 group cursor-pointer"
                              >
                                <img
                                  src={att.dataUrl}
                                  alt={att.name}
                                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <Maximize2 className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={att.id}
                              onClick={() => {
                                if (att.driveUrl) {
                                  window.open(att.driveUrl, '_blank', 'noopener,noreferrer');
                                }
                              }}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all ${
                                att.driveUrl ? 'cursor-pointer hover:scale-[1.02]' : ''
                              } ${
                                isUser
                                  ? 'bg-indigo-700/80 text-white border border-indigo-400/40'
                                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {getFileIcon(att)}
                              <span className="font-medium truncate max-w-[140px]">
                                {att.name}
                              </span>
                              {att.driveUrl ? (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                                  Drive
                                </span>
                              ) : (
                                <span className="text-[10px] opacity-70">
                                  {formatFileSize(att.size)}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {!isUser ? (
                      <div className="prose dark:prose-invert prose-xs sm:prose-sm max-w-none break-words overflow-x-auto">
                        <ReactMarkdown
                          components={{
                            code({ node, inline, className, children, ...props }: any) {
                              const match = /language-(\w+)/.exec(className || '');
                              const codeContent = String(children).replace(/\n$/, '');
                              const langType = match ? match[1] : '';

                              if (!inline && (match || codeContent.includes('\n'))) {
                                return (
                                  <div className="my-3 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 bg-slate-950 text-slate-100 shadow-sm not-prose">
                                    {/* Header Bar */}
                                    <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 text-xs">
                                      <span className="font-mono font-bold uppercase text-indigo-400 text-[11px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60">
                                        {langType || 'CODE'}
                                      </span>
                                      <div className="flex items-center gap-1.5">
                                        <button
                                          onClick={() =>
                                            handleOpenInCanvas(
                                              codeContent,
                                              langType || 'html',
                                              `${(langType || 'Code').toUpperCase()} Snippet`
                                            )
                                          }
                                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1 text-[11px] shadow-xs cursor-pointer transition-colors"
                                          title={
                                            lang === 'ug'
                                              ? 'خىزمەت تاختىسىدا ئېچىپ كۆرۈش'
                                              : 'Open & Run in Live Canvas'
                                          }
                                        >
                                          <Play className="w-3 h-3 fill-current" />
                                          <span>
                                            {lang === 'ug'
                                              ? 'ئىجرا قىلىش'
                                              : lang === 'tr'
                                              ? 'Tuvalde Çalıştır'
                                              : lang === 'ar'
                                              ? 'تشغيل في اللوحة'
                                              : 'Run in Canvas'}
                                          </span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={async () => {
                                            await copyTextToClipboard(codeContent);
                                            handleCopy(codeContent, -99);
                                          }}
                                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                                          title={lang === 'ug' ? 'كودنى نۇسخىلاش' : 'Copy Code'}
                                        >
                                          <Copy className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                    {/* Code Body */}
                                    <pre className="p-3.5 overflow-x-auto text-xs font-mono leading-relaxed bg-slate-950 text-slate-200">
                                      <code>{codeContent}</code>
                                    </pre>
                                  </div>
                                );
                              }

                              return (
                                <code
                                  className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap break-words break-all">{msg.content}</p>
                    )}

                    <div
                      className={`flex items-center justify-between pt-1 text-[10px] ${
                        isUser
                          ? 'text-indigo-200 border-t border-indigo-500/40'
                          : 'text-slate-400 border-t border-slate-200 dark:border-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{msg.timestamp}</span>
                        {!isUser && (
                          <button
                            type="button"
                            onClick={() => setIsModelSelectorOpen(true)}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 cursor-pointer hover:bg-indigo-100 transition-colors"
                            title={lang === 'ug' ? 'مودېلنى ئالماشتۇرۇش' : 'Switch model'}
                          >
                            <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                            <span>{msg.modelUsed || currentModelInfo.name}</span>
                          </button>
                        )}
                      </div>
                      {!isUser && (
                        <div className="flex items-center gap-1">
                          {/* Read Aloud Button (Icon-Only) */}
                          <button
                            type="button"
                            onClick={() => handleSpeakMessage(msg.content, idx)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
                              speakingMsgIdx === idx
                                ? 'bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 ring-1 ring-red-400'
                                : 'hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                            }`}
                            title={
                              speakingMsgIdx === idx
                                ? lang === 'ug'
                                  ? 'ئاۋازنى توختىتىش'
                                  : t.stopSpeaking
                                : lang === 'ug'
                                ? 'ئاۋاز چىقىرىپ ئوقۇش'
                                : t.speakResponse
                            }
                            aria-label={
                              speakingMsgIdx === idx
                                ? lang === 'ug'
                                  ? 'ئاۋازنى توختىتىش'
                                  : 'Stop speaking'
                                : lang === 'ug'
                                ? 'ئاۋاز چىقىرىپ ئوقۇش'
                                : 'Read message aloud'
                            }
                          >
                            {speakingMsgIdx === idx ? (
                              <VolumeX className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Copy Button (Icon-Only) */}
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.content, idx)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
                              copiedIndex === idx
                                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-400'
                                : 'hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                            }`}
                            title={
                              copiedIndex === idx
                                ? lang === 'ug'
                                  ? 'كۆچۈرۈلدى'
                                  : t.saved
                                : lang === 'ug'
                                ? 'تېكىستنى نۇسخىلاش'
                                : lang === 'tr'
                                ? 'Metni Kopyala'
                                : lang === 'ar'
                                ? 'نسخ النص'
                                : 'Copy Text'
                            }
                            aria-label={
                              copiedIndex === idx
                                ? lang === 'ug'
                                  ? 'كۆچۈرۈلدى'
                                  : 'Copied'
                                : lang === 'ug'
                                ? 'تېكىستنى نۇسخىلاش'
                                : 'Copy text'
                            }
                          >
                            {copiedIndex === idx ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-slate-200 dark:border-slate-700 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                <span>{t.generatingResponse}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Attachment Previews Bar (Above Input) */}
        {attachments.length > 0 && (
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/70 border-t border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-x-auto max-w-full py-0.5">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="relative group flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs flex-shrink-0"
                >
                  {att.type === 'image' && att.dataUrl ? (
                    <img
                      src={att.dataUrl}
                      alt={att.name}
                      className="w-8 h-8 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {getFileIcon(att)}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                      {att.name}
                    </p>
                    <p className="text-[9px] text-slate-400">{formatFileSize(att.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(att.id)}
                    className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-red-500 hover:text-white text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Actions for OCR & Multimodal Analysis */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setInput(
                    lang === 'ug'
                      ? 'بۇ رەسىم/ھۆججەتتىكى بارلىق يېزىقلارنى ئېنىق قۇر بويىچە ئوقۇپ، تېكىستىنى (OCR) ئاجرىتىپ بەر.'
                      : lang === 'tr'
                      ? 'Bu görseldeki tüm metinleri satır satır OCR ile çıkart ve aktar.'
                      : lang === 'ar'
                      ? 'استخرج جميع النصوص المكتوبة في هذه الصورة سطرًا بسطر بدقة (OCR).'
                      : 'Please extract all text and handwriting from this image/document verbatim (OCR).'
                  );
                  textareaRef.current?.focus();
                }}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold flex items-center gap-1 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
              >
                <span>📝</span>
                <span>{lang === 'ug' ? 'تېكىستنى ئوقۇش (OCR)' : 'OCR Extract'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInput(
                    lang === 'ug'
                      ? 'بۇ رەسىمدىكى ياكى ھۆججەتتىكى مەزمۇننى ئۇيغۇرچىغا راۋان تەرجىمە قىلىپ، تەپسىلىي چۈشەندۈرۈپ بەر.'
                      : lang === 'tr'
                      ? 'Bu görseldeki içeriği tercüme et ve detaylı açıkla.'
                      : lang === 'ar'
                      ? 'ترجم محتوى هذه الصورة واشرحها بالتفصيل.'
                      : 'Translate and explain the content of this image/document.'
                  );
                  textareaRef.current?.focus();
                }}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold flex items-center gap-1 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
              >
                <span>🌐</span>
                <span>{lang === 'ug' ? 'تەرجىمە قىلىش' : 'Translate'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInput(
                    lang === 'ug'
                      ? 'بۇ كود ياكى سۈرەتنى چوڭقۇر تەھلىل قىلىپ، كەمچىلىكلىرىنى تۈزىتىپ لايىھەلەپ بەر.'
                      : lang === 'tr'
                      ? 'Bu içeriği veya kodu derinlemesine analiz et ve optimize et.'
                      : lang === 'ar'
                      ? 'حلل هذا المحتوى أو الكود البرمجي بعمق وقدم مقترحات لتحسينه.'
                      : 'Deeply analyze this content/code and provide architectural feedback.'
                  );
                  textareaRef.current?.focus();
                }}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold flex items-center gap-1 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
              >
                <span>🔍</span>
                <span>{lang === 'ug' ? 'چوڭقۇر تەھلىل' : 'Analyze'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Audio Recording Status Indicator */}
        {isRecording && (
          <div className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 border-t border-rose-200 dark:border-rose-900/50 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <span className="font-semibold">
                {lang === 'ug'
                  ? 'ئاۋازىڭىز قوبۇل قىلىنىۋاتىدۇ...'
                  : lang === 'tr'
                  ? 'Ses kaydediliyor ve dinleniyor...'
                  : lang === 'ar'
                  ? 'جاري الاستماع وتسجيل الصوت...'
                  : 'Listening to your voice...'}
              </span>
              <span className="font-mono text-[11px] bg-rose-200/60 dark:bg-rose-900/60 px-2 py-0.5 rounded-md">
                {Math.floor(recordingSeconds / 60)
                  .toString()
                  .padStart(2, '0')}
                :{(recordingSeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <button
              type="button"
              onClick={stopRecordingSession}
              className="flex items-center gap-1 text-rose-700 dark:text-rose-300 hover:text-rose-900 font-bold cursor-pointer"
            >
              <StopCircle className="w-4 h-4" />
              <span>{lang === 'ug' ? 'تاماملاش' : 'Done'}</span>
            </button>
          </div>
        )}

        {/* Live Audio Transcribing Indicator */}
        {isTranscribingVoice && (
          <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 border-t border-indigo-200 dark:border-indigo-900/50 flex items-center gap-2 text-xs text-indigo-700 dark:text-indigo-300 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium">
              {lang === 'ug'
                ? 'سۈنئىي ئەقىل ئاۋازىڭىزنى ئۇيغۇرچە تېكىستكە ئايلاندۇرۇۋاتىدۇ...'
                : 'Transcribing speech with Gemini...'
              }
            </span>
          </div>
        )}

        {/* Bottom Input Area Styled Exactly Matching User Photo */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 focus-within:border-slate-400 dark:focus-within:border-slate-600 transition-all p-3 shadow-xs space-y-2.5"
          >
            {/* Top Workspace / Session Context Pill (Matching User Photo: [ 📁 tor v ] with Select Project dropdown) */}
            <div className="flex items-center justify-between px-0.5">
              <div className="relative" ref={projectMenuRef}>
                <button
                  id="chat-select-project-btn"
                  type="button"
                  onClick={() => {
                    setIsProjectMenuOpen(!isProjectMenuOpen);
                    setTimeout(() => projectSearchInputRef.current?.focus(), 50);
                  }}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
                  title="Select Project"
                >
                  <Folder className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span className="font-medium max-w-[150px] truncate">
                    {selectedProject && selectedProject !== 'No Project'
                      ? selectedProject
                      : lang === 'ug'
                      ? 'تۈر تاللاش'
                      : 'Select Project'}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isProjectMenuOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                </button>

                {/* Dropdown Popover matching photo_2026-09-12_10-59-50 (2).jpg */}
                {isProjectMenuOpen && (
                  <div
                    id="chat-select-project-popover"
                    className={`absolute top-full mt-1 ${isRTL ? 'right-0' : 'left-0'} z-50 w-64 sm:w-72 max-w-[calc(100vw-2rem)] p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-md space-y-1 animate-in fade-in zoom-in-95 duration-150`}
                    style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                  >
                    {/* Top Label: Select Project Ctrl+: */}
                    <div className="px-2 py-1 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium select-none">
                      <span>{lang === 'ug' ? 'تۈر تاللاش' : 'Select Project'}</span>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        Ctrl+:
                      </span>
                    </div>

                    {/* Search Input Box */}
                    <div className="p-0.5">
                      <div className="relative flex items-center">
                        <Search className={`w-3.5 h-3.5 absolute ${isRTL ? 'right-2.5' : 'left-2.5'} text-slate-400 pointer-events-none`} />
                        <input
                          ref={projectSearchInputRef}
                          type="text"
                          value={projectSearchQuery}
                          onChange={(e) => setProjectSearchQuery(e.target.value)}
                          placeholder={lang === 'ug' ? 'ئىزدەش...' : 'Search...'}
                          className={`w-full ${isRTL ? 'pr-8 pl-7 text-right' : 'pl-8 pr-7 text-left'} py-1.5 text-xs rounded-lg bg-slate-100/90 dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600 border border-transparent`}
                        />
                        {projectSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setProjectSearchQuery('')}
                            className={`absolute ${isRTL ? 'left-2' : 'right-2'} text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Filtered Project & Folder Items List (6 dummy projects removed) */}
                    {userProjects.length > 0 && (
                      <div className="max-h-52 overflow-y-auto space-y-0.5 py-0.5 border-b border-slate-100 dark:border-slate-800/80">
                        {userProjects
                          .filter((p) =>
                            p.toLowerCase().includes(projectSearchQuery.toLowerCase())
                          )
                          .map((proj) => {
                            const isSelected = selectedProject === proj;
                            return (
                              <div
                                key={proj}
                                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-slate-100 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleSelectProject(proj)}
                                  className="flex items-center gap-2 min-w-0 flex-1 text-inherit"
                                >
                                  <Folder className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span className="truncate">{proj}</span>
                                </button>
                                <div className="flex items-center gap-1 shrink-0">
                                  {isSelected && (
                                    <Check className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 shrink-0" />
                                  )}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteProject(proj);
                                    }}
                                    className="p-0.5 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                                    title={lang === 'ug' ? 'ئۆچۈرۈش' : 'Delete'}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}

                    {/* Bottom Actions List Matching Screenshot (Retained items below 'يېڭى') */}
                    <div className="pt-0.5 space-y-0.5">
                      {/* New folder */}
                      {isCreatingNewFolder ? (
                        <div className="p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1.5">
                          <input
                            type="text"
                            value={newFolderNameInput}
                            onChange={(e) => setNewFolderNameInput(e.target.value)}
                            placeholder={lang === 'ug' ? 'قىسقۇچ نامى...' : 'Folder name...'}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddNewFolder(newFolderNameInput);
                              } else if (e.key === 'Escape') {
                                setIsCreatingNewFolder(false);
                              }
                            }}
                            className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white"
                          />
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setIsCreatingNewFolder(false)}
                              className="px-2 py-0.5 text-[11px] rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                            >
                              {lang === 'ug' ? 'بىكار قىلىش' : 'Cancel'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddNewFolder(newFolderNameInput)}
                              className="px-2 py-0.5 text-[11px] font-medium rounded bg-indigo-600 text-white hover:bg-indigo-500 cursor-pointer"
                            >
                              {lang === 'ug' ? 'قۇرۇش' : 'Create'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsCreatingNewFolder(true)}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
                        >
                          <Folder className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>New folder</span>
                        </button>
                      )}

                      {/* New Project */}
                      <button
                        type="button"
                        onClick={() => {
                          if (onCreateNewSession) {
                            onCreateNewSession();
                          }
                          const newProj = `project-${Math.floor(1000 + Math.random() * 9000)}`;
                          handleAddNewFolder(newProj);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
                      >
                        <FolderPlus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>New Project</span>
                      </button>

                      {/* Quick Start */}
                      <button
                        type="button"
                        onClick={() => {
                          if (onCreateNewSession) {
                            onCreateNewSession();
                          }
                          handleSelectProject('Quick Start');
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
                      >
                        <Zap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Quick Start</span>
                      </button>

                      {/* Open Local Files / Folder (ھۆججەت تاللاش) */}
                      <button
                        type="button"
                        onClick={() => projectFolderInputRef.current?.click()}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 cursor-pointer transition-colors font-medium"
                      >
                        <Upload className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{lang === 'ug' ? 'ھۆججەت / قىسقۇچ ئېچىش...' : 'Open Folder / Files...'}</span>
                      </button>

                      {/* No Project */}
                      <button
                        type="button"
                        onClick={() => handleSelectProject('No Project')}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition-colors"
                      >
                        <Ban className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>No Project</span>
                      </button>
                    </div>

                    {/* Hidden Native File & Folder Input */}
                    <input
                      ref={projectFolderInputRef}
                      type="file"
                      multiple
                      onChange={handleProjectFilesSelected}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Right side info (e.g. Chat History button + Context window) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsHistoryOpen(true)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                  title={lang === 'ug' ? 'پاراڭ تارىخى' : 'Chat History'}
                >
                  <History className="w-3.5 h-3.5" />
                </button>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                  {currentModelInfo.contextWindow}
                </div>
              </div>
            </div>

            {/* Main Textarea with User's Photo Placeholder */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  adjustTextareaHeight();
                }}
                onKeyDown={handleKeyDown}
                placeholder={
                  isRecording
                    ? t.voiceInputListening
                    : "Ask anything, @ to mention, / for actions"
                }
                className="w-full resize-none bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none whitespace-pre-wrap break-words break-all overflow-y-auto overflow-x-hidden leading-relaxed block transition-all px-0.5 py-1"
                style={{ minHeight: '44px', maxHeight: '180px' }}
              />
            </div>

            {/* Bottom Controls Row Matching User Photo */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
              {/* Left Group: (+) and [Gemini 3.7 Flash Medium v] and [📁 Local v] */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* 1. Circular (+) Button with Floating Upward Popover */}
                <div className="relative" ref={attachMenuRef}>
                  <button
                    id="chat-attach-plus-btn"
                    type="button"
                    onClick={() => setIsAttachMenuOpen(!isAttachMenuOpen)}
                    className={`w-7 h-7 rounded-lg transition-all cursor-pointer flex items-center justify-center border shadow-xs ${
                      isAttachMenuOpen
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 rotate-45 border-slate-900 dark:border-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                    }`}
                    title={lang === 'ug' ? 'Drive، ھۆججەت ياكى كامېرا قوشۇش (+)' : 'Attach Drive, Files or Camera (+)'}
                  >
                    <Plus className="w-4 h-4 transition-transform" />
                  </button>

                  {/* Popover Menu Opening Upwards Above (+) Button (Positioned safely inside container) */}
                  {isAttachMenuOpen && (
                    <div
                      id="chat-attach-popover-menu"
                      className={`absolute bottom-full mb-2 ${isRTL ? 'right-0' : 'left-0'} z-50 w-60 sm:w-64 max-w-[calc(100vw-2rem)] p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-md space-y-1 animate-in fade-in zoom-in-95 duration-150`}
                      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                    >
                      {/* Drive */}
                      <button
                        id="attach-menu-drive-btn"
                        type="button"
                        onClick={() => {
                          setIsAttachMenuOpen(false);
                          setIsDriveModalOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer text-inherit group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <HardDrive className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">
                              Drive
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold px-1.5 py-0.5 rounded bg-emerald-100/70 dark:bg-emerald-950/80">
                              Google
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block whitespace-nowrap">
                            {lang === 'ug' ? 'گۇگېل دىرايۋ ھۆججىتى' : 'Cloud Docs & Sheets'}
                          </span>
                        </div>
                      </button>

                      {/* Upload Files */}
                      <button
                        id="attach-menu-upload-btn"
                        type="button"
                        onClick={() => {
                          setIsAttachMenuOpen(false);
                          fileInputRef.current?.click();
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer text-inherit group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">
                              Upload Files
                            </span>
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold px-1.5 py-0.5 rounded bg-indigo-100/70 dark:bg-indigo-950/80">
                              File
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block whitespace-nowrap">
                            {lang === 'ug' ? 'ھۆججەت ياكى كود يوللاش' : 'Upload Docs & Code'}
                          </span>
                        </div>
                      </button>

                      {/* Camera */}
                      <button
                        id="attach-menu-camera-btn"
                        type="button"
                        onClick={() => {
                          setIsAttachMenuOpen(false);
                          if (cameraInputRef.current) {
                            cameraInputRef.current.click();
                          } else {
                            imageInputRef.current?.click();
                          }
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-blue-50/80 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer text-inherit group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Camera className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">
                              Camera
                            </span>
                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold px-1.5 py-0.5 rounded bg-blue-100/70 dark:bg-blue-950/80">
                              Photo
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block whitespace-nowrap">
                            {lang === 'ug' ? 'كامېرا ياكى رەسىم تاللاش' : 'Take Photo / Image'}
                          </span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Gemini Model Selector (Matching User Photo: [ Gemini 3.7 Flash Medium v ]) */}
                <div className="relative" ref={modelMenuRef}>
                  <button
                    id="chat-inline-model-selector-btn"
                    type="button"
                    onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs group"
                    title={lang === 'ug' ? 'Gemini مودېلىنى تاللاش' : 'Select Gemini Model'}
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {currentModelInfo.name}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isModelMenuOpen ? 'rotate-180 text-indigo-500' : ''}`} />
                  </button>

                  {/* Upward Floating Popover for Gemini Models */}
                  {isModelMenuOpen && (
                    <div
                      id="chat-inline-model-popover"
                      className={`absolute bottom-full mb-2 ${isRTL ? 'right-0' : 'left-0'} z-50 w-64 sm:w-72 max-w-[calc(100vw-2rem)] p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-md space-y-1 animate-in fade-in zoom-in-95 duration-150`}
                      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                    >
                      <div className="px-2.5 py-1 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>{lang === 'ug' ? 'Gemini ھەقسىز مودېللىرى' : 'Gemini Free Models'}</span>
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-semibold px-1.5 py-0.5 rounded">
                          {GEMINI_MODELS.length} {lang === 'ug' ? 'نۇسخا' : 'Free'}
                        </span>
                      </div>
                      <div className="max-h-72 overflow-y-auto space-y-1 p-0.5">
                        {GEMINI_MODELS.map((model) => {
                          const isSelected = model.id === activeModelId;
                          return (
                            <button
                              key={model.id}
                              type="button"
                              onClick={() => {
                                if (onSelectModel) {
                                  onSelectModel(model.id);
                                }
                                setIsModelMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left ${
                                isSelected
                                  ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200/80 dark:border-indigo-800/80 shadow-2xs'
                                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                              }`}
                            >
                              <div className="flex flex-col text-left min-w-0 pr-1.5">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-semibold truncate">{model.name}</span>
                                  {model.isFreeTier && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                                      {lang === 'ug' ? 'ھەقسىز' : 'Free'}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                                  {lang === 'ug' ? model.badgeUg : model.badgeEn}
                                </span>
                              </div>
                              {isSelected && (
                                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 ml-1" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            setIsModelMenuOpen(false);
                            setIsModelSelectorOpen(true);
                          }}
                          className="w-full text-center py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                          {lang === 'ug' ? 'بارلىق مودېللارنى تەپسىلىي كۆرۈش...' : 'View all models & details...'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. [ 📁 Local v ] (Matching User Photo) */}
                <button
                  type="button"
                  onClick={() => setIsCanvasOpen(!isCanvasOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
                  title={lang === 'ug' ? 'خىزمەت مۇھىتى: Local' : 'Execution Environment: Local'}
                >
                  <Folder className="w-3.5 h-3.5 text-slate-400" />
                  <span>Local</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
              </div>

              {/* Right Side: Voice Dictation & Send Button */}
              <div className="flex items-center gap-1.5">
                {/* Voice Recording Button */}
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={isTranscribingVoice}
                  className={`w-7 h-7 rounded-lg transition-all cursor-pointer flex items-center justify-center border shadow-xs ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-600/30 ring-2 ring-rose-400 border-rose-600'
                      : isTranscribingVoice
                      ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 border-indigo-200 dark:border-indigo-800'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950 hover:text-rose-600 border-slate-200 dark:border-slate-700'
                  }`}
                  title={
                    isRecording
                      ? t.voiceInputStop
                      : isTranscribingVoice
                      ? lang === 'ug'
                        ? 'ئاۋازنى تېكىستكە ئايلاندۇرۇۋاتىدۇ...'
                        : 'Transcribing voice...'
                      : t.voiceInputStart
                  }
                >
                  {isTranscribingVoice ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : isRecording ? (
                    <Mic className="w-3.5 h-3.5" />
                  ) : (
                    <MicOff className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={(!input.trim() && attachments.length === 0) || isLoading}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs font-medium text-xs disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1"
                  title={t.sendBtn}
                >
                  <span>{lang === 'ug' ? 'يوللاش' : 'Send'}</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Live Canvas Workspace in Split Mode */}
      {isCanvasOpen && (
        <div className="w-full">
          <LiveCanvasSandbox
            lang={lang}
            activeDoc={canvasDoc}
            onUpdateDoc={(updated) => setCanvasDoc(updated)}
            onClose={() => setIsCanvasOpen(false)}
          />
        </div>
      )}
    </div>

      {/* Image Lightbox Modal */}
      {previewImageModal && (
        <div
          onClick={() => setPreviewImageModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            <img
              src={previewImageModal}
              alt="Enlarged preview"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setPreviewImageModal(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ChatGPT-Style Side Navigation Drawer Modal (Matching Screenshot) */}
      {isHistoryOpen && (
        <div
          id="chatgpt-drawer-overlay"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end transition-opacity duration-300"
          onClick={() => {
            setIsHistoryOpen(false);
            setConfirmDeleteId(null);
            setEditingSessionId(null);
            setActiveItemMenuId(null);
          }}
        >
          <div
            id="chatgpt-drawer-panel"
            className="w-full max-w-[320px] sm:max-w-[360px] h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col text-slate-900 dark:text-slate-100 animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          >
            {/* 1. Header Bar (Matching ChatGPT Screenshot Top) */}
            <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 bg-white dark:bg-slate-900 shrink-0">
              {/* Search Toggle Icon */}
              <button
                id="drawer-search-toggle-btn"
                onClick={() => setIsDrawerSearchActive(!isDrawerSearchActive)}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isDrawerSearchActive
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={lang === 'ug' ? 'ئىزدەش' : 'Search'}
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Title: ChatGPT with Subtitle */}
              <div className="text-center flex-1">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                    ChatGPT
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  {lang === 'ug'
                    ? 'قوشۇمچە ئىقتىدارلار'
                    : lang === 'tr'
                    ? 'Eklentiler'
                    : lang === 'ar'
                    ? 'المكونات الإضافية'
                    : 'Plugins & Addons'}
                </p>
              </div>

              {/* Projects Folder & Close Button */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const pinned = chatSessions.find((s) => s.pinned);
                    if (pinned && onSelectSession) {
                      onSelectSession(pinned.id);
                      setIsHistoryOpen(false);
                    }
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title={lang === 'ug' ? 'تۈرلەر' : 'Projects'}
                >
                  <Folder className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden xs:inline">
                    {lang === 'ug'
                      ? 'تۈرلەر'
                      : lang === 'ar'
                      ? 'المشاريع'
                      : 'Projects'}
                  </span>
                </button>

                <button
                  id="close-chatgpt-drawer-btn"
                  onClick={() => {
                    setIsHistoryOpen(false);
                    setConfirmDeleteId(null);
                    setEditingSessionId(null);
                    setActiveItemMenuId(null);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Expandable Search Bar (When Search Icon Clicked) */}
            {(isDrawerSearchActive || searchHistory) && (
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 animate-in fade-in slide-in-from-top-2 duration-150 shrink-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
                  <input
                    type="text"
                    autoFocus
                    value={searchHistory}
                    onChange={(e) => setSearchHistory(e.target.value)}
                    placeholder={
                      lang === 'ug'
                        ? 'سۆھبەتلەرنى ئىزدەش...'
                        : lang === 'tr'
                        ? 'Sohbetlerde ara...'
                        : lang === 'ar'
                        ? 'البحث في المحادثات...'
                        : 'Search chats...'
                    }
                    className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  {searchHistory && (
                    <button
                      onClick={() => setSearchHistory('')}
                      className="absolute top-1/2 -translate-y-1/2 right-2 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 3. Active Gemini Model Switcher Card in Drawer */}
            <div className="px-3 pt-2 shrink-0">
              <div
                onClick={() => setIsModelSelectorOpen(true)}
                className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer flex items-center justify-between gap-2 shadow-xs group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {currentModelInfo.name}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 shrink-0">
                        {lang === 'ug' ? currentModelInfo.badgeUg : currentModelInfo.badgeEn}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {lang === 'ug' ? 'مودېلنى ئالماشتۇرۇش ئۈچۈن چېكىڭ' : 'Click to select model'}
                    </p>
                  </div>
                </div>

                <ChevronDown className="w-4 h-4 text-indigo-500 shrink-0 group-hover:translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* 4. Conversation Stream List (Matching Screenshot Sections) */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
              {/* Section A: Pinned Conversations ("مۇقىملاشتۇرۇلغان / مثبت") */}
              {pinnedSessions.length > 0 && (
                <div className="space-y-1">
                  <div className="px-2 py-1 text-[12px] font-normal text-slate-400 dark:text-slate-500">
                    {lang === 'ug'
                      ? 'مۇقىملاشتۇرۇلغان'
                      : lang === 'ar'
                      ? 'مثبت'
                      : lang === 'tr'
                      ? 'Sabitlenenler'
                      : 'Pinned'}
                  </div>
                  <div className="space-y-0.5">
                    {pinnedSessions.map((session) => {
                      const isActive = session.id === activeSessionId;
                      const isEditing = editingSessionId === session.id;
                      const isMenuOpen = activeItemMenuId === session.id;

                      if (isEditing) {
                        return (
                          <div
                            key={session.id}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              autoFocus
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(session.id, e);
                                if (e.key === 'Escape') handleCancelRename();
                              }}
                              className="w-full px-2 py-1 rounded-lg text-xs bg-white dark:bg-slate-900 border border-indigo-500 focus:outline-none"
                            />
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={handleCancelRename}
                                className="px-2 py-0.5 text-[10px] text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                              >
                                {lang === 'ug' ? 'بىكار قىلىش' : 'Cancel'}
                              </button>
                              <button
                                onClick={(e) => handleSaveRename(session.id, e)}
                                className="px-2 py-0.5 text-[10px] font-bold bg-indigo-600 text-white rounded"
                              >
                                {lang === 'ug' ? 'ساقلاش' : 'Save'}
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={session.id}
                          onClick={() => {
                            if (onSelectSession) {
                              onSelectSession(session.id);
                              setIsHistoryOpen(false);
                            }
                          }}
                          className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer relative ${
                            isActive
                              ? 'bg-slate-100 dark:bg-slate-800 font-semibold text-slate-900 dark:text-slate-100'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <Folder className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                            <span className="truncate text-[13px]">{session.title}</span>
                          </div>

                          {/* 3-Dots Quick Menu */}
                          <div
                            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveItemMenuId(isMenuOpen ? null : session.id);
                              }}
                              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                              title="Options"
                            >
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Quick Options Popup */}
                          {isMenuOpen && (
                            <div
                              className="absolute right-2 top-8 z-30 w-36 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {onTogglePinSession && (
                                <button
                                  onClick={() => {
                                    onTogglePinSession(session.id);
                                    setActiveItemMenuId(null);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                                >
                                  <PinOff className="w-3 h-3 text-amber-500" />
                                  <span>{lang === 'ug' ? 'سانجىشنى بىكار قىلىش' : 'Unpin'}</span>
                                </button>
                              )}
                              {onRenameSession && (
                                <button
                                  onClick={(e) => {
                                    handleStartRename(session, e);
                                    setActiveItemMenuId(null);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                                >
                                  <Edit3 className="w-3 h-3 text-indigo-500" />
                                  <span>{lang === 'ug' ? 'تېمىنى ئۆزگەرتىش' : 'Rename'}</span>
                                </button>
                              )}
                              {onDeleteSession && (
                                <button
                                  onClick={() => {
                                    if (onDeleteSession) onDeleteSession(session.id);
                                    setActiveItemMenuId(null);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 flex items-center gap-2"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>{lang === 'ug' ? 'ئۆچۈرۈش' : 'Delete'}</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section B: Recent Conversations ("ئەڭ يېڭى سۆھبەتلەر / المحادثات الأخيرة") */}
              <div className="space-y-1">
                <div className="px-2 py-1 text-[12px] font-normal text-slate-400 dark:text-slate-500">
                  {lang === 'ug'
                    ? 'ئەڭ يېڭى سۆھبەتلەر'
                    : lang === 'ar'
                    ? 'المحادثات الأخيرة'
                    : lang === 'tr'
                    ? 'Son Sohbetler'
                    : 'Recent Conversations'}
                </div>

                {unpinnedSessions.length === 0 && pinnedSessions.length === 0 ? (
                  <div className="text-center py-8 px-2 space-y-1">
                    <p className="text-xs text-slate-400 font-medium">
                      {lang === 'ug' ? 'پاراڭ يوق' : 'No chats found'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {(showAllRecent ? unpinnedSessions : unpinnedSessions.slice(0, 8)).map(
                      (session) => {
                        const isActive = session.id === activeSessionId;
                        const isEditing = editingSessionId === session.id;
                        const isMenuOpen = activeItemMenuId === session.id;

                        if (isEditing) {
                          return (
                            <div
                              key={session.id}
                              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="text"
                                autoFocus
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveRename(session.id, e);
                                  if (e.key === 'Escape') handleCancelRename();
                                }}
                                className="w-full px-2 py-1 rounded-lg text-xs bg-white dark:bg-slate-900 border border-indigo-500 focus:outline-none"
                              />
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={handleCancelRename}
                                  className="px-2 py-0.5 text-[10px] text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                                >
                                  {lang === 'ug' ? 'بىكار قىلىش' : 'Cancel'}
                                </button>
                                <button
                                  onClick={(e) => handleSaveRename(session.id, e)}
                                  className="px-2 py-0.5 text-[10px] font-bold bg-indigo-600 text-white rounded"
                                >
                                  {lang === 'ug' ? 'ساقلاش' : 'Save'}
                                </button>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={session.id}
                            onClick={() => {
                              if (onSelectSession) {
                                onSelectSession(session.id);
                                setIsHistoryOpen(false);
                              }
                            }}
                            className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer relative ${
                              isActive
                                ? 'bg-slate-100 dark:bg-slate-800 font-semibold text-slate-900 dark:text-slate-100'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                            }`}
                          >
                            <span className="truncate text-[13px]">{session.title}</span>

                            {/* 3-Dots Quick Menu */}
                            <div
                              className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveItemMenuId(isMenuOpen ? null : session.id);
                                }}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                title="Options"
                              >
                                <MoreHorizontal className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Quick Options Popup */}
                            {isMenuOpen && (
                              <div
                                className="absolute right-2 top-8 z-30 w-36 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl text-xs"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {onTogglePinSession && (
                                  <button
                                    onClick={() => {
                                      onTogglePinSession(session.id);
                                      setActiveItemMenuId(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                                  >
                                    <Pin className="w-3 h-3 text-amber-500" />
                                    <span>
                                      {lang === 'ug' ? 'مۇھىم دەپ سانجىش' : 'Pin to top'}
                                    </span>
                                  </button>
                                )}
                                {onRenameSession && (
                                  <button
                                    onClick={(e) => {
                                      handleStartRename(session, e);
                                      setActiveItemMenuId(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                                  >
                                    <Edit3 className="w-3 h-3 text-indigo-500" />
                                    <span>{lang === 'ug' ? 'تېمىنى ئۆزگەرتىش' : 'Rename'}</span>
                                  </button>
                                )}
                                {onDeleteSession && (
                                  <button
                                    onClick={() => {
                                      if (onDeleteSession) onDeleteSession(session.id);
                                      setActiveItemMenuId(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 flex items-center gap-2"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>{lang === 'ug' ? 'ئۆچۈرۈش' : 'Delete'}</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}

                    {/* View All / Expand Toggle */}
                    {unpinnedSessions.length > 8 && (
                      <button
                        onClick={() => setShowAllRecent(!showAllRecent)}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-between cursor-pointer"
                      >
                        <span>
                          {showAllRecent
                            ? lang === 'ug'
                              ? 'ئاز كۆرسىتىش...'
                              : 'Show Less...'
                            : lang === 'ug'
                            ? 'ھەممىسىنى كۆرسىتىش...'
                            : lang === 'ar'
                            ? 'عرض الكل...'
                            : 'View All...'}
                        </span>
                        {showAllRecent ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 4. Bottom Floating Action Bar (Matching Screenshot Bottom Pill & Voice Circle) */}
            <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 shrink-0">
              {/* Blue Pill: "الدردشة / يېڭى پاراڭ" */}
              {onCreateNewSession && (
                <button
                  id="chatgpt-drawer-new-chat-pill"
                  onClick={() => {
                    onCreateNewSession();
                    setIsHistoryOpen(false);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
                >
                  <SquarePen className="w-4 h-4" />
                  <span>
                    {lang === 'ug'
                      ? 'يېڭى پاراڭ'
                      : lang === 'ar'
                      ? 'الدردشة'
                      : lang === 'tr'
                      ? 'Yeni Sohbet'
                      : 'New Chat'}
                  </span>
                </button>
              )}

              {/* Circular Voice AI Button */}
              {onOpenVoiceModal && (
                <button
                  id="chatgpt-drawer-voice-btn"
                  onClick={() => {
                    setIsHistoryOpen(false);
                    onOpenVoiceModal();
                  }}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 flex items-center justify-center transition-all cursor-pointer shrink-0"
                  title="Voice AI"
                >
                  <AudioLines className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                </button>
              )}

              {/* Quick Clear All or Export Menu */}
              <button
                onClick={handleExportAllSessionsJSON}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                title={lang === 'ug' ? 'ئېكسپورت (JSON)' : 'Export JSON'}
              >
                <FileDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gemini Model Selector Modal */}
      <ModelSelectorModal
        isOpen={isModelSelectorOpen}
        onClose={() => setIsModelSelectorOpen(false)}
        selectedModelId={activeModelId}
        onSelectModel={(modelId) => {
          if (onSelectModel) {
            onSelectModel(modelId);
          }
        }}
        lang={lang}
      />

      {/* Google Drive Modal */}
      <GoogleDriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        onAttachDriveFile={(att) => setAttachments((prev) => [...prev, att])}
        lang={lang}
      />

      {/* Gemini Side Drawer matching photo_2026-09-12_12-00-20.jpg */}
      <GeminiSideDrawer
        isOpen={isGeminiDrawerOpen}
        onClose={() => setIsGeminiDrawerOpen(false)}
        lang={lang}
        chatSessions={chatSessions}
        currentMessages={messages}
        notes={notes}
        onSaveNote={onSaveNote}
        onNewChat={() => {
          if (onCreateNewSession) {
            onCreateNewSession();
          }
          setInput('');
        }}
        onSelectSession={onSelectSession}
        onInsertTextIntoChat={(text) => setInput((prev) => (prev ? `${prev}\n${text}` : text))}
      />
    </div>
  );
};

