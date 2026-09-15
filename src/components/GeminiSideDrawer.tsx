import React, { useState, useEffect } from 'react';
import {
  X,
  SquarePen,
  Search,
  Image as ImageIcon,
  Video,
  LayoutGrid,
  Plus,
  Trash2,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Download,
  ExternalLink,
  Film,
  Send,
  Check,
  Folder,
  MessageSquare,
  Copy,
} from 'lucide-react';
import { AppLanguage, ChatSession, ChatMessage, NoteItem } from '../types';

interface GeminiSideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: AppLanguage;
  chatSessions?: ChatSession[];
  currentMessages: ChatMessage[];
  notes?: NoteItem[];
  onSaveNote?: (note: NoteItem) => void;
  onNewChat: () => void;
  onSelectSession?: (sessionId: string) => void;
  onInsertTextIntoChat?: (text: string) => void;
}

type DrawerSubView = 'menu' | 'search' | 'images' | 'videos' | 'library' | 'notebook-editor';

export const GeminiSideDrawer: React.FC<GeminiSideDrawerProps> = ({
  isOpen,
  onClose,
  lang,
  chatSessions = [],
  currentMessages = [],
  notes,
  onSaveNote,
  onNewChat,
  onSelectSession,
  onInsertTextIntoChat,
}) => {
  const isRTL = lang === 'ug' || lang === 'ar';
  const [currentView, setCurrentView] = useState<DrawerSubView>('menu');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Notebooks state initialized from localStorage
  const [notebooks, setNotebooks] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('app_notes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      {
        id: 'nb-1',
        title: lang === 'ug' ? 'پروگرامما لايىھە خاتىرىسى' : 'Programming Architecture Notes',
        content: lang === 'ug' ? 'React + TypeScript + Tailwind CSS بىلەن يۇقىرى ئىقتىدارلىق ئەپ لايىھەلىرى.' : 'High performance app designs with React and TypeScript.',
        tags: ['Code', 'Architecture'],
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'nb-2',
        title: lang === 'ug' ? 'سۈنئىي ئەقىل مودېل تەتقىقاتى' : 'AI Models Research',
        content: lang === 'ug' ? 'Gemini 3.8 Flash ۋە Gemini 3.7 Reasoning مودېللىرىنىڭ سۈرئىتى ۋە ئالاھىدىلىكى.' : 'Gemini 3.8 Flash and Reasoning model capabilities.',
        tags: ['AI', 'Gemini'],
        updatedAt: new Date().toISOString(),
      },
    ];
  });

  // Automatically sync chat conversations into notebooks (ھەر قېتىم پاراڭلاشقان پاراڭلار يېڭى خاتىرىلەرگە ئاپتوماتىك ساقلىنىدۇ)
  useEffect(() => {
    let sourceNotes: NoteItem[] = [];
    if (notes && notes.length > 0) {
      sourceNotes = [...notes];
    } else {
      try {
        const saved = localStorage.getItem('app_notes');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) sourceNotes = parsed;
        }
      } catch (e) {}
    }

    // Sessions that have actual messages from user
    const chattedSessions = chatSessions.filter(
      (s) => s.messages && s.messages.some((m) => m.role === 'user')
    );

    let changed = false;
    const mergedNotes = [...sourceNotes];

    for (const session of chattedSessions) {
      const noteId = `nb-chat-${session.id}`;
      const existingIdx = mergedNotes.findIndex((n) => n.id === noteId);

      const dialogue = session.messages
        .filter((m) => m.content && m.content.trim().length > 0)
        .map((m) => {
          const role = m.role === 'user' ? '👤 سىز' : '🤖 Gemini AI';
          const time = m.timestamp ? ` [${m.timestamp}]` : '';
          return `${role}${time}:\n${m.content}`;
        })
        .join('\n\n---\n\n');

      const title = session.title?.trim() || (lang === 'ug' ? 'سۆھبەت خاتىرىسى' : 'Chat Note');
      const content = `# 💬 ${title}\n\n${dialogue}`;

      if (existingIdx >= 0) {
        if (mergedNotes[existingIdx].content !== content || mergedNotes[existingIdx].title !== title) {
          mergedNotes[existingIdx] = {
            ...mergedNotes[existingIdx],
            title,
            content,
            updatedAt: session.updatedAt || new Date().toISOString(),
            isChatSync: true,
            chatSessionId: session.id,
          };
          changed = true;
        }
      } else {
        mergedNotes.unshift({
          id: noteId,
          title,
          content,
          tags: ['سۆھبەت', 'Gemini'],
          updatedAt: session.updatedAt || new Date().toISOString(),
          isChatSync: true,
          chatSessionId: session.id,
        });
        changed = true;
      }
    }

    if (changed || mergedNotes.length !== notebooks.length) {
      setNotebooks(mergedNotes);
      try {
        localStorage.setItem('app_notes', JSON.stringify(mergedNotes));
      } catch (e) {}
    }
  }, [chatSessions, notes, lang, isOpen]);

  // New notebook form state
  const [isCreatingNotebook, setIsCreatingNotebook] = useState(false);
  const [newNotebookTitle, setNewNotebookTitle] = useState('');
  const [newNotebookContent, setNewNotebookContent] = useState('');
  const [selectedNotebook, setSelectedNotebook] = useState<NoteItem | null>(null);
  const [isCopiedNote, setIsCopiedNote] = useState(false);

  // AI Image generator state
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Array<{ id: string; url: string; prompt: string; date: string }>>(() => {
    try {
      const saved = localStorage.getItem('gemini_saved_images');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'img-1',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        prompt: lang === 'ug' ? 'كەلگۈسى سۈنئىي ئەقىل ۋە تور گرافىكىسى' : 'Futuristic AI abstract geometry',
        date: '2026-09-12',
      },
      {
        id: 'img-2',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        prompt: lang === 'ug' ? 'قۇياش نۇرى چۈشكەن كۆك دېڭىز بويى' : 'Sunny blue ocean shore',
        date: '2026-09-11',
      },
    ];
  });

  // Video tools state
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoScriptResult, setVideoScriptResult] = useState<string | null>(null);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);

  // Reset view when opened & handle Escape key
  useEffect(() => {
    if (isOpen) {
      setCurrentView('menu');
      setIsCreatingNotebook(false);
      setSelectedNotebook(null);
    }
  }, [isOpen]);

  // Close drawer on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Persist notebooks
  const saveNotebooks = (updated: NoteItem[]) => {
    setNotebooks(updated);
    try {
      localStorage.setItem('app_notes', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleCreateNotebook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotebookTitle.trim()) return;
    const newNb: NoteItem = {
      id: `nb-${Date.now()}`,
      title: newNotebookTitle.trim(),
      content: newNotebookContent.trim(),
      tags: ['Notebook'],
      updatedAt: new Date().toISOString(),
    };
    saveNotebooks([newNb, ...notebooks]);
    setNewNotebookTitle('');
    setNewNotebookContent('');
    setIsCreatingNotebook(false);
  };

  const handleDeleteNotebook = (id: string) => {
    saveNotebooks(notebooks.filter((n) => n.id !== id));
    if (selectedNotebook?.id === id) {
      setSelectedNotebook(null);
    }
  };

  // Quick image generator simulation with high quality Unsplash tech visuals
  const handleGenerateImage = () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    setTimeout(() => {
      const visualSeeds = [
        'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
      ];
      const randomUrl = visualSeeds[Math.floor(Math.random() * visualSeeds.length)];
      const newImg = {
        id: `img-${Date.now()}`,
        url: randomUrl,
        prompt: imagePrompt.trim(),
        date: new Date().toISOString().slice(0, 10),
      };
      const updated = [newImg, ...generatedImages];
      setGeneratedImages(updated);
      try {
        localStorage.setItem('gemini_saved_images', JSON.stringify(updated));
      } catch (e) {}
      setIsGeneratingImage(false);
      setImagePrompt('');
    }, 1000);
  };

  // Video script generator
  const handleGenerateVideoScript = () => {
    if (!videoPrompt.trim()) return;
    setIsVideoGenerating(true);
    setTimeout(() => {
      const script = lang === 'ug'
        ? `🎬 سىن سىنارىيەسى: "${videoPrompt}"\n\n📌 1-كۆرۈنۈش (كىرىش سۆز - 0:00-0:05): كۈچلۈك كۆرۈنۈش بىلەن تېما تونۇشتۇرۇلىدۇ.\n📌 2-كۆرۈنۈش (ئاساسى مەزمۇن - 0:05-0:30): نۇقتىلىق بىلىم ۋە پىكىرلەر جانلىق مىساللار بىلەن تەپسىلىي چۈشەندۈرۈلىدۇ.\n📌 3-كۆرۈنۈش (خۇلاسە - 0:30-0:45): تاماشىبىنلارغا ئەسكەرتىش ۋە باھا قالدۇرۇشقا چاقىرىق.`
        : `🎬 Video Script: "${videoPrompt}"\n\n📌 Scene 1 (Hook - 0:00-0:05): Eye-catching opening presenting the core premise.\n📌 Scene 2 (Body - 0:05-0:30): In-depth breakdown with visual animations and concise voiceover.\n📌 Scene 3 (Outro - 0:30-0:45): Call to action and key takeaways.`;
      setVideoScriptResult(script);
      setIsVideoGenerating(false);
    }, 900);
  };

  if (!isOpen) return null;

  // Search matches across sessions and current messages
  const searchResults: Array<{ id: string; title: string; preview: string; date: string }> = [];
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    chatSessions.forEach((s) => {
      const matchMsg = s.messages.find((m) => m.content.toLowerCase().includes(q));
      if (s.title.toLowerCase().includes(q) || matchMsg) {
        searchResults.push({
          id: s.id,
          title: s.title,
          preview: matchMsg ? matchMsg.content.slice(0, 80) + '...' : s.title,
          date: s.updatedAt ? new Date(s.updatedAt).toLocaleDateString() : '',
        });
      }
    });
  }

  return (
    <div
      id="gemini-side-drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        id="gemini-side-drawer-panel"
        className={`fixed top-0 bottom-0 ${
          isRTL ? 'right-0 border-l' : 'left-0 border-r'
        } w-[300px] sm:w-[330px] max-w-[88vw] h-full bg-[#fbfdfc] dark:bg-[#131314] border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col text-slate-800 dark:text-slate-100 ${
          isRTL ? 'animate-in slide-in-from-right' : 'animate-in slide-in-from-left'
        } duration-300 ease-out z-50`}
        onClick={(e) => e.stopPropagation()}
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        {/* Top Header Bar matching Image 2 */}
        <div className="px-5 py-4 flex items-center justify-between shrink-0 select-none border-b border-slate-100/80 dark:border-slate-800/60">
          {isRTL ? (
            <>
              {/* In RTL: Title is on the right, X is on the left */}
              <div className="flex items-center gap-2">
                <span className="text-[22px] font-semibold tracking-tight text-slate-900 dark:text-white font-sans">
                  Gemini
                </span>
              </div>
              <button
                id="gemini-drawer-close-btn"
                type="button"
                onClick={onClose}
                className="p-2 -ml-1 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={lang === 'ug' ? 'تاقاش' : 'Close'}
              >
                <X className="w-5 h-5" strokeWidth={1.8} />
              </button>
            </>
          ) : (
            <>
              <button
                id="gemini-drawer-close-btn"
                type="button"
                onClick={onClose}
                className="p-2 -mr-1 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" strokeWidth={1.8} />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[22px] font-semibold tracking-tight text-slate-900 dark:text-white font-sans">
                  Gemini
                </span>
              </div>
            </>
          )}
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-1">
          {/* Main Menu View matching Image 2 */}
          {currentView === 'menu' && (
            <div className="space-y-1">
              {/* 1. محادثة جديدة / يېڭى سۆھبەت matching Image 2 */}
              <button
                id="gemini-menu-new-chat-btn"
                type="button"
                onClick={() => {
                  onNewChat();
                  onClose();
                }}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-full bg-[#f0f4f9] dark:bg-[#1e1f20] text-slate-900 dark:text-white hover:bg-[#dfe4ec] dark:hover:bg-[#282a2c] transition-all cursor-pointer font-medium text-[15px] group mb-1.5"
              >
                <div className="w-5 h-5 text-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0">
                  <SquarePen className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <span className="flex-1 text-start">
                  {lang === 'ug' ? 'يېڭى سۆھبەت' : lang === 'ar' ? 'محادثة جديدة' : 'New chat'}
                </span>
              </button>

              {/* 2. البحث في المحادثات / سۆھبەتلەرنى ئىزدەش matching Image 2 */}
              <button
                id="gemini-menu-search-chats-btn"
                type="button"
                onClick={() => setCurrentView('search')}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-full text-slate-800 dark:text-slate-200 hover:bg-[#f0f4f9] dark:hover:bg-[#1e1f20] transition-all cursor-pointer font-normal text-[15px] group"
              >
                <div className="w-5 h-5 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <Search className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <span className="flex-1 text-start">
                  {lang === 'ug' ? 'سۆھبەتلەرنى ئىزدەش' : lang === 'ar' ? 'البحث في المحادثات' : 'Search in chats'}
                </span>
              </button>

              {/* 3. الصور / رەسىملەر matching Image 2 */}
              <button
                id="gemini-menu-images-btn"
                type="button"
                onClick={() => setCurrentView('images')}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-full text-slate-800 dark:text-slate-200 hover:bg-[#f0f4f9] dark:hover:bg-[#1e1f20] transition-all cursor-pointer font-normal text-[15px] group"
              >
                <div className="w-5 h-5 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <span className="flex-1 text-start">
                  {lang === 'ug' ? 'رەسىملەر' : lang === 'ar' ? 'الصور' : 'Images'}
                </span>
              </button>

              {/* 4. فيديوهات / سىنلار matching Image 2 */}
              <button
                id="gemini-menu-videos-btn"
                type="button"
                onClick={() => setCurrentView('videos')}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-full text-slate-800 dark:text-slate-200 hover:bg-[#f0f4f9] dark:hover:bg-[#1e1f20] transition-all cursor-pointer font-normal text-[15px] group"
              >
                <div className="w-5 h-5 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <Film className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <span className="flex-1 text-start">
                  {lang === 'ug' ? 'سىنلار' : lang === 'ar' ? 'فيديوهات' : 'Videos'}
                </span>
              </button>

              {/* 5. المكتبة / ئامبار matching Image 2 */}
              <button
                id="gemini-menu-library-btn"
                type="button"
                onClick={() => setCurrentView('library')}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-full text-slate-800 dark:text-slate-200 hover:bg-[#f0f4f9] dark:hover:bg-[#1e1f20] transition-all cursor-pointer font-normal text-[15px] group"
              >
                <div className="w-5 h-5 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <LayoutGrid className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <span className="flex-1 text-start">
                  {lang === 'ug' ? 'ئامبار' : lang === 'ar' ? 'المكتبة' : 'Library'}
                </span>
              </button>

              {/* Section Header: دفاتر الملاحظات / خاتىرە دەپتەرلەر matching Image 2 */}
              <div className="pt-6 pb-1 px-4 text-[13px] font-normal text-slate-500 dark:text-slate-400 select-none">
                <span>{lang === 'ug' ? 'خاتىرە دەپتەرلەر' : lang === 'ar' ? 'دفاتر الملاحظات' : 'Notebooks'}</span>
              </div>

              {/* 7. + دفتر ملاحظات جديد / + يېڭى خاتىرە دەپتەر matching Image 2 */}
              <button
                id="gemini-menu-new-notebook-btn"
                type="button"
                onClick={() => setIsCreatingNotebook(true)}
                className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full hover:bg-[#f0f4f9] dark:hover:bg-[#1e1f20] text-slate-800 dark:text-slate-200 transition-all cursor-pointer font-normal text-[15px] group"
              >
                <div className="w-5 h-5 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <Plus className="w-5 h-5" strokeWidth={2} />
                </div>
                <span className="flex-1 text-start">
                  {lang === 'ug' ? '+ يېڭى خاتىرە دەپتەر' : lang === 'ar' ? '+ دفتر ملاحظات جديد' : '+ New notebook'}
                </span>
              </button>

              {/* Inline Notebook Creation Form */}
              {isCreatingNotebook && (
                <form
                  onSubmit={handleCreateNotebook}
                  className="p-3 my-2 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-2.5 animate-in fade-in"
                >
                  <input
                    type="text"
                    value={newNotebookTitle}
                    onChange={(e) => setNewNotebookTitle(e.target.value)}
                    placeholder={lang === 'ug' ? 'خاتىرە ماۋزۇسى...' : 'Notebook title...'}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    autoFocus
                  />
                  <textarea
                    value={newNotebookContent}
                    onChange={(e) => setNewNotebookContent(e.target.value)}
                    placeholder={lang === 'ug' ? 'مەزمۇنىنى كىرگۈزۈڭ...' : 'Write your notes...'}
                    rows={2}
                    className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingNotebook(false)}
                      className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      {lang === 'ug' ? 'بىكار قىلىش' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={!newNotebookTitle.trim()}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 cursor-pointer"
                    >
                      {lang === 'ug' ? 'ساقلاش' : 'Save'}
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Notebooks & Conversations List matching Image 2 */}
              <div className="space-y-0.5 pt-1">
                {notebooks.length === 0 ? (
                  <p className="px-4 py-3 text-xs text-slate-400 text-center">
                    {lang === 'ug' ? 'تېخى خاتىرە يوق' : 'No notebooks yet'}
                  </p>
                ) : (
                  notebooks.map((nb) => {
                    const isChat = nb.isChatSync || nb.tags?.includes('سۆھبەت') || nb.id.startsWith('nb-chat-');
                    return (
                      <div
                        key={nb.id}
                        className="group flex items-center justify-between px-4 py-2.5 rounded-full hover:bg-[#f0f4f9] dark:hover:bg-[#1e1f20] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                        onClick={() => {
                          if (isChat && nb.chatSessionId && onSelectSession) {
                            onSelectSession(nb.chatSessionId);
                            onClose();
                          } else {
                            setSelectedNotebook(nb);
                            setCurrentView('notebook-editor');
                          }
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {isChat ? (
                            <MessageSquare className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" strokeWidth={1.8} />
                          ) : (
                            <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors shrink-0" strokeWidth={1.8} />
                          )}
                          <span className="text-[14px] font-normal truncate flex-1 text-slate-800 dark:text-slate-200" title={nb.title}>
                            {nb.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotebook(nb.id);
                            }}
                            className="p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
                            title={lang === 'ug' ? 'ئۆچۈرۈش' : 'Delete'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Subview: 2. Search in Conversations */}
          {currentView === 'search' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentView('menu')}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                </button>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {lang === 'ug' ? 'سۆھبەتلەرنى ئىزدەش' : 'Search in conversations'}
                </span>
              </div>

              <div className="relative">
                <Search className={`w-4 h-4 text-slate-400 absolute top-2.5 ${isRTL ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'ug' ? 'سۆھبەت ياكى ئۇچۇر ئىزدەش...' : 'Search message content...'}
                  className={`w-full py-2 ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500`}
                  autoFocus
                />
              </div>

              <div className="space-y-1.5 pt-1">
                {searchResults.length > 0 ? (
                  searchResults.map((res) => (
                    <div
                      key={res.id}
                      onClick={() => {
                        if (onSelectSession) onSelectSession(res.id);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 border border-slate-100 dark:border-slate-800 transition-colors cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                          {res.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{res.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {res.preview}
                      </p>
                    </div>
                  ))
                ) : searchQuery.trim() ? (
                  <p className="text-xs text-center text-slate-400 py-6">
                    {lang === 'ug' ? 'ماس كېلىدىغان نەتىجە تېپىلمىدى' : 'No matching conversations'}
                  </p>
                ) : (
                  <div className="space-y-1">
                    <p className="text-[11px] text-slate-400 px-1 font-semibold">
                      {lang === 'ug' ? 'يېقىنقى سۆھبەتلەر:' : 'Recent chats:'}
                    </p>
                    {chatSessions.slice(0, 6).map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          if (onSelectSession) onSelectSession(s.id);
                          onClose();
                        }}
                        className="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span className="truncate max-w-[180px] font-medium">{s.title}</span>
                        <span className="text-[10px] text-slate-400">{s.messages.length} msgs</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subview: 3. Images (الصور / رەسىملەر) */}
          {currentView === 'images' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentView('menu')}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                </button>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {lang === 'ug' ? 'AI رەسىم ئىشخانىسى' : 'Images & AI Studio'}
                </span>
              </div>

              {/* Generate new image prompt input */}
              <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
                <label className="text-[11px] font-semibold text-indigo-900 dark:text-indigo-300 block">
                  {lang === 'ug' ? '✨ تېكىست ئارقىلىق رەسىم ھاسىللاش:' : 'Generate image from prompt:'}
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder={lang === 'ug' ? 'مەسىلەن: چۆلدىكى كەلگۈسى شەھەر...' : 'e.g. futuristic oasis...'}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage || !imagePrompt.trim()}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1"
                  >
                    {isGeneratingImage ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {generatedImages.map((img) => (
                  <div
                    key={img.id}
                    className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs"
                  >
                    <img
                      src={img.url}
                      alt={img.prompt}
                      className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="p-1.5 bg-white dark:bg-slate-900">
                      <p className="text-[10px] text-slate-700 dark:text-slate-300 line-clamp-1 font-medium">
                        {img.prompt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subview: 4. Videos (فيديوهات / سىنلار) */}
          {currentView === 'videos' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentView('menu')}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                </button>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {lang === 'ug' ? 'AI سىن ۋە سىنارىيە مەركىزى' : 'Videos & Script Studio'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-2">
                <label className="text-[11px] font-semibold text-rose-900 dark:text-rose-300 block">
                  {lang === 'ug' ? '🎬 سىن سىنارىيەسى ياكى تەھلىل تەلەپ قىلىش:' : 'Video script or analysis prompt:'}
                </label>
                <textarea
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder={lang === 'ug' ? 'مەسىلەن: سۈنئىي ئەقىلنىڭ كەلگۈسى توغرىسىدا قىسقا سىن سىنارىيەسى...' : 'e.g. 60-second video script about quantum computing...'}
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-hidden resize-none"
                />
                <button
                  type="button"
                  onClick={handleGenerateVideoScript}
                  disabled={isVideoGenerating || !videoPrompt.trim()}
                  className="w-full py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>{lang === 'ug' ? 'سىنارىيە تەييارلاش' : 'Generate Video Script'}</span>
                </button>
              </div>

              {videoScriptResult && (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <pre className="whitespace-pre-wrap font-sans text-slate-800 dark:text-slate-200 leading-relaxed text-[11px]">
                    {videoScriptResult}
                  </pre>
                  {onInsertTextIntoChat && (
                    <button
                      type="button"
                      onClick={() => {
                        onInsertTextIntoChat(videoScriptResult);
                        onClose();
                      }}
                      className="w-full py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium cursor-pointer"
                    >
                      {lang === 'ug' ? 'سۆھبەتكە كىرگۈزۈش' : 'Send to Chat'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Subview: 5. Library (المكتبة / ئامبار) */}
          {currentView === 'library' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentView('menu')}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                </button>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {lang === 'ug' ? 'ھۆججەت ۋە ئامبار مەركىزى' : 'Documents & Asset Library'}
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                  <Folder className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                      {lang === 'ug' ? 'تۈر قۇرۇلمىلىرى ۋە ھۆججەتلەر' : 'Project files & specs'}
                    </span>
                    <span className="text-[10px] text-slate-400">JSON, Markdown, TSX</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                      {lang === 'ug' ? 'رەسىم ۋە تاراتقۇلار' : 'Saved AI Media'}
                    </span>
                    <span className="text-[10px] text-slate-400">{generatedImages.length} {lang === 'ug' ? 'ھۆججەت' : 'items'}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-amber-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                      {lang === 'ug' ? 'خاتىرە دەپتەر توپلىمى' : 'Notebook Collection'}
                    </span>
                    <span className="text-[10px] text-slate-400">{notebooks.length} {lang === 'ug' ? 'خاتىرە' : 'notebooks'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subview: 6. Notebook Detail / Editor */}
          {currentView === 'notebook-editor' && selectedNotebook && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    type="button"
                    onClick={() => setCurrentView('menu')}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer shrink-0"
                  >
                    {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                  </button>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {selectedNotebook.title}
                  </span>
                </div>
                {selectedNotebook.isChatSync && selectedNotebook.chatSessionId && onSelectSession && (
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedNotebook.chatSessionId) {
                        onSelectSession(selectedNotebook.chatSessionId);
                        onClose();
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>{lang === 'ug' ? 'سۆھبەتكە كىرىش' : 'Open Chat'}</span>
                  </button>
                )}
              </div>

              {selectedNotebook.isChatSync && (
                <div className="px-3 py-2 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-2 text-[11px] text-indigo-700 dark:text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>
                    {lang === 'ug'
                      ? 'بۇ پاراڭ ئاپتوماتىك ھالدا يېڭى خاتىرىگە ساقلاندى.'
                      : 'This conversation was automatically saved to notebooks.'}
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <textarea
                  value={selectedNotebook.content}
                  onChange={(e) => {
                    const updated = { ...selectedNotebook, content: e.target.value };
                    setSelectedNotebook(updated);
                    saveNotebooks(notebooks.map((n) => (n.id === updated.id ? updated : n)));
                  }}
                  rows={9}
                  className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-hidden leading-relaxed resize-none text-slate-800 dark:text-slate-200 font-sans"
                />

                <div className="flex items-center gap-2">
                  {onInsertTextIntoChat && (
                    <button
                      type="button"
                      onClick={() => {
                        onInsertTextIntoChat(selectedNotebook.content);
                        onClose();
                      }}
                      className="flex-1 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{lang === 'ug' ? 'مەزمۇننى سۆھبەتكە يوللاش' : 'Send to Chat'}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedNotebook.content);
                      setIsCopiedNote(true);
                      setTimeout(() => setIsCopiedNote(false), 2000);
                    }}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium cursor-pointer flex items-center gap-1"
                    title={lang === 'ug' ? 'نۇسخىلاش' : 'Copy'}
                  >
                    {isCopiedNote ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
