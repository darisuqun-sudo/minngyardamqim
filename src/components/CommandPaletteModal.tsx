import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Sparkles,
  Layout,
  Bot,
  Calendar,
  BookOpen,
  FolderGit2,
  Flame,
  CheckSquare,
  Timer,
  Settings,
  Sun,
  Moon,
  Mic,
  BrainCircuit,
  Network,
  ClipboardList,
  Terminal,
  ArrowRight,
  ArrowLeft,
  X,
  FileText,
  Code2,
  Languages,
  ScrollText,
  Heart,
  Cloud,
  Palette,
} from 'lucide-react';
import {
  AppLanguage,
  NavTab,
  ThemeMode,
  TaskItem,
  NoteItem,
  CalendarEvent,
  KnowledgeDoc,
  ProjectBlueprint,
} from '../types';
import { TRANSLATIONS } from '../data/translations';

interface PaletteItem {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  icon: any;
  action: () => void;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenVoiceModal: () => void;
  tasks: TaskItem[];
  notes: NoteItem[];
  events: CalendarEvent[];
  docs: KnowledgeDoc[];
  blueprints: ProjectBlueprint[];
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  lang,
  setLang,
  themeMode,
  setThemeMode,
  setActiveTab,
  onOpenVoiceModal,
  tasks,
  notes,
  events,
  docs,
  blueprints,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const isRTL = lang === 'ug' || lang === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Build navigation and action options
  const navigationItems: PaletteItem[] = [
    { id: 'nav-dashboard', title: t.hub, category: 'Navigation', icon: Sparkles, action: () => { setActiveTab('dashboard'); onClose(); } },
    { id: 'nav-codingStudio', title: t.codingStudio || 'Coding & Developer Studio', category: 'Navigation', icon: Code2, action: () => { setActiveTab('codingStudio'); onClose(); } },
    { id: 'nav-imageStudio', title: t.imageStudio || 'AI Image & Logo Studio', category: 'Navigation', icon: Palette, action: () => { setActiveTab('imageStudio'); onClose(); } },
    { id: 'nav-languageTutor', title: t.languageTutor || 'AI Language Tutor', category: 'Navigation', icon: Languages, action: () => { setActiveTab('languageTutor'); onClose(); } },
    { id: 'nav-contractBuilder', title: t.contractBuilder || 'Smart Contracts & Docs', category: 'Navigation', icon: ScrollText, action: () => { setActiveTab('contractBuilder'); onClose(); } },
    { id: 'nav-mindfulness', title: t.mindfulness || 'Mindfulness & Breathing', category: 'Navigation', icon: Heart, action: () => { setActiveTab('mindfulness'); onClose(); } },
    { id: 'nav-cloudSync', title: t.cloudSync || 'Cloud Sync & Backup', category: 'Navigation', icon: Cloud, action: () => { setActiveTab('cloudSync'); onClose(); } },
    { id: 'nav-voicememos', title: t.voiceMemos || 'AI Voice Memos', category: 'Navigation', icon: Mic, action: () => { setActiveTab('voicememos'); onClose(); } },
    { id: 'nav-analytics', title: t.analytics || 'Analytics & Insights', category: 'Navigation', icon: Sparkles, action: () => { setActiveTab('analytics'); onClose(); } },
    { id: 'nav-docExporter', title: t.docExporter || 'Document Studio & PDF Export', category: 'Navigation', icon: FileText, action: () => { setActiveTab('docExporter'); onClose(); } },
    { id: 'nav-webReader', title: t.webReader || 'Web Reader & Article Synthesizer', category: 'Navigation', icon: Sparkles, action: () => { setActiveTab('webReader'); onClose(); } },
    { id: 'nav-okrGoals', title: t.okrGoals || 'Strategic OKRs & Goal Tracker', category: 'Navigation', icon: Sparkles, action: () => { setActiveTab('okrGoals'); onClose(); } },
    { id: 'nav-blueprint', title: t.blueprint, category: 'Navigation', icon: Layout, action: () => { setActiveTab('blueprint'); onClose(); } },
    { id: 'nav-assistant', title: t.assistant, category: 'Navigation', icon: Bot, action: () => { setActiveTab('assistant'); onClose(); } },
    { id: 'nav-calendar', title: t.calendar, category: 'Navigation', icon: Calendar, action: () => { setActiveTab('calendar'); onClose(); } },
    { id: 'nav-knowledge', title: t.knowledge, category: 'Navigation', icon: BookOpen, action: () => { setActiveTab('knowledge'); onClose(); } },
    { id: 'nav-projects', title: t.projects, category: 'Navigation', icon: FolderGit2, action: () => { setActiveTab('projects'); onClose(); } },
    { id: 'nav-flashcards', title: t.flashcards, category: 'Navigation', icon: BrainCircuit, action: () => { setActiveTab('flashcards'); onClose(); } },
    { id: 'nav-mindmap', title: t.mindmap, category: 'Navigation', icon: Network, action: () => { setActiveTab('mindmap'); onClose(); } },
    { id: 'nav-standup', title: t.standup, category: 'Navigation', icon: ClipboardList, action: () => { setActiveTab('standup'); onClose(); } },
    { id: 'nav-promptlab', title: t.promptlab, category: 'Navigation', icon: Terminal, action: () => { setActiveTab('promptlab'); onClose(); } },
    { id: 'nav-finance', title: t.financeAndHabits, category: 'Navigation', icon: Flame, action: () => { setActiveTab('financeAndHabits'); onClose(); } },
    { id: 'nav-productivity', title: t.tasksAndNotes, category: 'Navigation', icon: CheckSquare, action: () => { setActiveTab('productivity'); onClose(); } },
    { id: 'nav-focus', title: t.focusAndTools, category: 'Navigation', icon: Timer, action: () => { setActiveTab('focus'); onClose(); } },
    { id: 'nav-settings', title: t.settings, category: 'Navigation', icon: Settings, action: () => { setActiveTab('settings'); onClose(); } },
  ];

  const quickActions: PaletteItem[] = [
    { id: 'act-voice', title: lang === 'ug' ? 'ئاۋازلىق ياردەمچىنى ئېچىش' : 'Open Real-time Voice AI', category: 'Action', icon: Mic, action: () => { onClose(); onOpenVoiceModal(); } },
    { id: 'act-theme-light', title: t.themeLight, category: 'Theme', icon: Sun, action: () => { setThemeMode('light'); onClose(); } },
    { id: 'act-theme-dark', title: t.themeDark, category: 'Theme', icon: Moon, action: () => { setThemeMode('dark'); onClose(); } },
    { id: 'act-theme-midnight', title: t.themeMidnight, category: 'Theme', icon: Moon, action: () => { setThemeMode('midnight'); onClose(); } },
    { id: 'act-theme-oled', title: t.themeOled, category: 'Theme', icon: Moon, action: () => { setThemeMode('oled'); onClose(); } },
    { id: 'act-theme-sepia', title: t.themeSepia, category: 'Theme', icon: Sun, action: () => { setThemeMode('sepia'); onClose(); } },
    { id: 'act-lang-ug', title: 'ئۇيغۇرچە (Uyghur)', category: 'Language', icon: Sparkles, action: () => { setLang('ug'); onClose(); } },
    { id: 'act-lang-tr', title: 'Türkçe (Turkish)', category: 'Language', icon: Sparkles, action: () => { setLang('tr'); onClose(); } },
    { id: 'act-lang-en', title: 'English', category: 'Language', icon: Sparkles, action: () => { setLang('en'); onClose(); } },
    { id: 'act-lang-ar', title: 'العربية (Arabic)', category: 'Language', icon: Sparkles, action: () => { setLang('ar'); onClose(); } },
  ];

  // Search across dynamic items
  const dynamicItems: PaletteItem[] = [];

  tasks.forEach((tk) => {
    dynamicItems.push({
      id: `task-${tk.id}`,
      title: tk.title,
      subtitle: `Task • Priority: ${tk.priority}`,
      category: 'Tasks',
      icon: CheckSquare,
      action: () => { setActiveTab('productivity'); onClose(); },
    });
  });

  notes.forEach((nt) => {
    dynamicItems.push({
      id: `note-${nt.id}`,
      title: nt.title,
      subtitle: `Note • ${nt.tags.join(', ')}`,
      category: 'Notes',
      icon: FileText,
      action: () => { setActiveTab('productivity'); onClose(); },
    });
  });

  docs.forEach((dc) => {
    dynamicItems.push({
      id: `doc-${dc.id}`,
      title: dc.title,
      subtitle: `Knowledge Doc • ${dc.fileType}`,
      category: 'Knowledge',
      icon: BookOpen,
      action: () => { setActiveTab('knowledge'); onClose(); },
    });
  });

  events.forEach((ev) => {
    dynamicItems.push({
      id: `event-${ev.id}`,
      title: ev.title,
      subtitle: `Calendar • ${ev.date} ${ev.startTime}`,
      category: 'Calendar',
      icon: Calendar,
      action: () => { setActiveTab('calendar'); onClose(); },
    });
  });

  blueprints.forEach((bp) => {
    dynamicItems.push({
      id: `bp-${bp.id}`,
      title: bp.title,
      subtitle: `Project Blueprint • ${bp.category}`,
      category: 'Projects',
      icon: FolderGit2,
      action: () => { setActiveTab('projects'); onClose(); },
    });
  });

  const allItems = [...navigationItems, ...quickActions, ...dynamicItems];

  const filteredItems = query.trim()
    ? allItems.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase())) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 14);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  return (
    <div
      id="command-palette-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              lang === 'ug'
                ? 'بارلىق ئىقتىدار، ۋەزىپە، خاتىرە ۋە ھۆججەتلەردىن ئىزدەڭ...'
                : lang === 'tr'
                ? 'Tüm özellik, görev, not ve belgelerde arayın...'
                : lang === 'ar'
                ? 'ابحث في كافة الميزات والمهام والملاحظات والوثائق...'
                : 'Search commands, tabs, tasks, notes, and documents...'
            }
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hidden sm:inline-block">
            ESC
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              {lang === 'ug' ? 'ماس كېلىدىغان مەزمۇن تېپىلمىدى' : 'No matching results found'}
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-200'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{item.title}</p>
                      {item.subtitle && (
                        <p className="text-[10px] text-slate-400 truncate">{item.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                      {item.category}
                    </span>
                    <ArrowIcon className={`w-3 h-3 ${isSelected ? 'text-indigo-500' : 'text-transparent'}`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>↑↓ {lang === 'ug' ? 'تاللاش' : 'Navigate'}</span>
            <span>↵ {lang === 'ug' ? 'ئىجرا قىلىش' : 'Select'}</span>
            <span>ESC {lang === 'ug' ? 'تاقاش' : 'Close'}</span>
          </div>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            Ctrl + K / ⌘ + K
          </span>
        </div>
      </div>
    </div>
  );
};
