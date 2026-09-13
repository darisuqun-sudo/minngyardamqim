import React, { useState, useEffect } from 'react';
import {
  AppLanguage,
  NavTab,
  ChatMessage,
  ChatSession,
  ChatAttachment,
  RoadmapPhase,
  TaskItem,
  NoteItem,
  ThemeMode,
  CalendarEvent,
  KnowledgeDoc,
  ProjectBlueprint,
  HabitItem,
  FinanceTransaction,
  BudgetGoal,
  FlashcardDeck,
  MindMapItem,
  PromptTemplate,
  DailyStandupRecord,
  VoiceMemo,
  OKRGoal,
  WebArticleSummary,
  MorningBriefing,
} from './types';
import {
  ROADMAP_PHASES,
  INITIAL_TASKS,
  INITIAL_NOTES,
} from './data/blueprintData';
import {
  INITIAL_CALENDAR_EVENTS,
  INITIAL_KNOWLEDGE_DOCS,
  INITIAL_PROJECT_BLUEPRINTS,
  INITIAL_HABITS,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGET_GOALS,
} from './data/advancedData';
import {
  INITIAL_FLASHCARD_DECKS,
  INITIAL_MIND_MAPS,
  INITIAL_PROMPT_TEMPLATES,
  INITIAL_STANDUP_RECORDS,
  INITIAL_VOICE_MEMOS,
  INITIAL_OKR_GOALS,
  INITIAL_WEB_ARTICLES,
  INITIAL_MORNING_BRIEFING,
} from './data/extendedData';
import { Navbar } from './components/Navbar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { BlueprintView } from './components/BlueprintView';
import { AssistantChatView } from './components/AssistantChatView';
import { CalendarView } from './components/CalendarView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { ProjectsHubView } from './components/ProjectsHubView';
import { CodingStudioView } from './components/CodingStudioView';
import { HabitsAndFinanceView } from './components/HabitsAndFinanceView';
import { ProductivityView } from './components/ProductivityView';
import { FocusToolsView } from './components/FocusToolsView';
import { SettingsSyncView } from './components/SettingsSyncView';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { FlashcardsView } from './components/FlashcardsView';
import { MindMapView } from './components/MindMapView';
import { DailyStandupView } from './components/DailyStandupView';
import { PromptLabView } from './components/PromptLabView';
import { VoiceMemosView } from './components/VoiceMemosView';
import { AnalyticsView } from './components/AnalyticsView';
import { DocExporterView } from './components/DocExporterView';
import { WebReaderView } from './components/WebReaderView';
import { OKRGoalsView } from './components/OKRGoalsView';
import { MorningBriefingModal } from './components/MorningBriefingModal';
import { Footer } from './components/Footer';

export default function App() {
  // App Language State
  const [lang, setLang] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved as AppLanguage) || 'ug';
  });

  // App Theme Mode State (light, dark, midnight, oled, sepia)
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('app_theme_mode');
    return (saved as ThemeMode) || 'light';
  });

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedPillarId, setSelectedPillarId] = useState<string>('frontend-ui');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Chat Sessions and active session state
  const DEFAULT_INITIAL_WELCOME: ChatMessage = {
    id: 'msg-welcome',
    role: 'model',
    content: `ئەسسالامۇ ئەلەيكۇم! مەن سىزنىڭ كۆپ ئىقتىدارلىق زامانىۋى ئەقلىي ياردەمچىڭىز ۋە سىستېما لايىھە مەسلىھەتچىڭىز.

سىزنىڭ تەلىپىڭىزگە ئاساسەن بارلىق 6 يادرولۇق ئىقتىدار تولۇق ئىشقا ئاشۇرۇلدى:
1. 🎙️ **ئاۋازلىق كىرگۈزۈش ۋە ئاۋاز چىقىرىش (Voice AI)**
2. 📅 **ئەقلىي كالېندار & ۋاقىت بۆلەكلىرى (Smart Calendar & Time-Blocking)**
3. 📚 **شەخسىي بىلىم ئامبىرى & ھۆججەت تەھلىلى (Knowledge Base & RAG)**
4. 🏗️ **تۈر قۇرۇلمىسى & كود قېلىپلىرى مەركىزى (Project Architect & Code Sandbox)**
5. ☁️ **سانلىق مەلۇمات زاپاسلاش & يەرلىك ماسلىشىش (Full Data Sovereignty & JSON Backup)**
6. 💰 **ئادەت يېتىلدۈرۈش & شەخسىي خامچوت باشقۇرۇش (Habits & Personal Finance)**

بۇنىڭدىن باشقا **كېچىلىك ھالەتلەر (Midnight, OLED Black, Sepia)** ۋە كۆپ تىللىق (ئۇيغۇرچە، تۈركچە، ئەرەبچە، ئىنگلىزچە) تولۇق قوللىنىدۇ!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const savedSessions = localStorage.getItem('app_chat_sessions');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    // Backward compatibility with previous single chat messages
    const oldSavedMsgs = localStorage.getItem('app_chat_messages');
    if (oldSavedMsgs) {
      try {
        const parsedMsgs = JSON.parse(oldSavedMsgs);
        if (Array.isArray(parsedMsgs) && parsedMsgs.length > 0) {
          return [
            {
              id: 'session-legacy-1',
              title: 'ئىلگىرىكى سۆھبەت',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              messages: parsedMsgs,
              personaId: 'universal',
            },
          ];
        }
      } catch (e) {}
    }
    return [
      {
        id: 'session-pinned-app',
        title: 'ئەپ ياساش',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        pinned: true,
        messages: [
          {
            id: 'msg-app-1',
            role: 'user',
            content: 'مۇكەممەل بىر React + TypeScript ئەپ قۇرۇلمىسىنى لايىھەلەپ بەرسىڭىز.',
            timestamp: '10:00',
          },
          {
            id: 'msg-app-2',
            role: 'model',
            content: 'ئەلۋەتتە! زامانىۋى كۆچمە ۋە تور ئەپلىرى ئۈچۈن پۈتۈن قۇرۇلما، مودۇللار ۋە ئېلېمېنتلار تەييارلاندى.',
            timestamp: '10:01',
          },
        ],
        personaId: 'architect',
      },
      {
        id: 'session-1',
        title: 'ساقلانمىلارنى ئۆچۈرۈش',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        messages: [
          {
            id: 'msg-del-1',
            role: 'user',
            content: 'تېلېفون ياكى ئەپتىكى ساقلانمىلارنى بىخەتەر ئۆچۈرۈش ئۇسۇلىنى چۈشەندۈرۈپ بەر.',
            timestamp: '09:30',
          },
          {
            id: 'msg-del-2',
            role: 'model',
            content: 'ساقلانمىلارنى ئۆچۈرۈش ئۈچۈن تەڭشەكلەردىن مەخسۇس ئورۇننى تاللاپ ياكى كېشنى تازىلاش كۇنۇپكىسىنى باسسىڭىز بولىدۇ.',
            timestamp: '09:31',
          },
        ],
        personaId: 'universal',
      },
      {
        id: 'session-2',
        title: 'ئايپاد قۇلۇپىنى ئېچىش',
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        messages: [
          {
            id: 'msg-ipad-1',
            role: 'user',
            content: 'ئايپادنىڭ پارولى ئۇنتۇلۇپ قالغاندا قۇلۇپىنى ئېچىش باسقۇچلىرى قانداق؟',
            timestamp: '08:15',
          },
          {
            id: 'msg-ipad-2',
            role: 'model',
            content: 'ئايپاد قۇلۇپىنى ئېچىش ئۈچۈن Apple ID نى ئىشلىتىش، Finder/iTunes ئارقىلىق ئەسلىگە كەلتۈرۈش ئۇسۇللىرىنى قوللانسىڭىز بولىدۇ.',
            timestamp: '08:16',
          },
        ],
        personaId: 'universal',
      },
      {
        id: 'session-3',
        title: 'دردشة جديدة',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        messages: [
          {
            id: 'msg-ar-1',
            role: 'user',
            content: 'مرحبا، كيف يمكنك مساعدتي اليوم؟',
            timestamp: '07:00',
          },
          {
            id: 'msg-ar-2',
            role: 'model',
            content: 'أهلاً بك! أنا مساعدك الذكي، جاهز للمساعدة في البرمجة والترجمة والتنظيم.',
            timestamp: '07:01',
          },
        ],
        personaId: 'universal',
      },
      {
        id: 'session-4',
        title: 'سالاملىشىش جاۋابى',
        createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
        messages: [
          {
            id: 'msg-sal-1',
            role: 'user',
            content: 'ياخشىمۇسىز!',
            timestamp: '06:30',
          },
          {
            id: 'msg-sal-2',
            role: 'model',
            content: 'ياخشىمۇسىز! قارشى ئالىمەن، بۈگۈن سىزگە قانداق ياردەم بېرەلەيمەن؟',
            timestamp: '06:31',
          },
        ],
        personaId: 'universal',
      },
      {
        id: 'session-5',
        title: 'سالاملىشىش ۋە ئەھۋال سوراش',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        messages: [
          {
            id: 'msg-sal2-1',
            role: 'user',
            content: 'ئەھۋاللىرىڭىز ياخشىمۇ؟',
            timestamp: '05:20',
          },
          {
            id: 'msg-sal2-2',
            role: 'model',
            content: 'رەھمەت، مەن سۈنئىي ئەقىل ياردەمچىسى سۈپىتىدە سىزگە ياردەم بېرىشكە تولۇق تەييار!',
            timestamp: '05:21',
          },
        ],
        personaId: 'universal',
      },
      {
        id: 'session-6',
        title: 'جاۋاب سالاملىشىش',
        createdAt: new Date(Date.now() - 3600000 * 60).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 60).toISOString(),
        messages: [
          {
            id: 'msg-sal3-1',
            role: 'user',
            content: 'سالام، خىزمەتلەر كۆڭۈللۈك بولسۇن!',
            timestamp: '04:10',
          },
          {
            id: 'msg-sal3-2',
            role: 'model',
            content: 'سىزگىمۇ تىلەكداشمەن! خىزمىتىڭىزگە ئوڭۇشلۇق ۋە ئۇتۇق تىلەيمەن.',
            timestamp: '04:11',
          },
        ],
        personaId: 'universal',
      },
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    const savedActiveId = localStorage.getItem('app_active_session_id');
    return savedActiveId || 'session-main';
  });

  const activeChatSession =
    chatSessions.find((s) => s.id === activeSessionId) ||
    chatSessions[0] || {
      id: 'session-fallback',
      title: 'سۆھبەت',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [DEFAULT_INITIAL_WELCOME],
      personaId: 'universal',
    };

  const messages = activeChatSession.messages;
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);

  // Selected Gemini Model (Persisted)
  const [selectedGeminiModel, setSelectedGeminiModel] = useState<string>(() => {
    try {
      return localStorage.getItem('gemini_selected_model') || 'gemini-3.7-flash';
    } catch (e) {
      return 'gemini-3.7-flash';
    }
  });

  const handleSelectGeminiModel = (modelId: string) => {
    setSelectedGeminiModel(modelId);
    try {
      localStorage.setItem('gemini_selected_model', modelId);
    } catch (e) {}
  };

  // Roadmap phases
  const [roadmapPhases, setRoadmapPhases] = useState<RoadmapPhase[]>(() => {
    const saved = localStorage.getItem('app_roadmap_phases');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return ROADMAP_PHASES;
  });

  // Tasks state
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('app_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_TASKS;
  });

  // Notes state
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('app_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_NOTES;
  });

  // Calendar Events
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('app_calendar_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_CALENDAR_EVENTS;
  });

  // Knowledge Documents
  const [docs, setDocs] = useState<KnowledgeDoc[]>(() => {
    const saved = localStorage.getItem('app_knowledge_docs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_KNOWLEDGE_DOCS;
  });

  // Project Blueprints
  const [blueprints, setBlueprints] = useState<ProjectBlueprint[]>(() => {
    const saved = localStorage.getItem('app_project_blueprints');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_PROJECT_BLUEPRINTS;
  });

  // Habits
  const [habits, setHabits] = useState<HabitItem[]>(() => {
    const saved = localStorage.getItem('app_habits');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_HABITS;
  });

  // Finance Transactions
  const [transactions, setTransactions] = useState<FinanceTransaction[]>(() => {
    const saved = localStorage.getItem('app_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_TRANSACTIONS;
  });

  // Budget Goals
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>(() => {
    const saved = localStorage.getItem('app_budget_goals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_BUDGET_GOALS;
  });

  // Flashcards & Quiz Decks
  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>(() => {
    const saved = localStorage.getItem('app_flashcard_decks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_FLASHCARD_DECKS;
  });

  // Mind Maps
  const [mindMaps, setMindMaps] = useState<MindMapItem[]>(() => {
    const saved = localStorage.getItem('app_mind_maps');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_MIND_MAPS;
  });

  // Prompt Lab Templates
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>(() => {
    const saved = localStorage.getItem('app_prompt_templates');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_PROMPT_TEMPLATES;
  });

  // Standup Records
  const [standupHistory, setStandupHistory] = useState<DailyStandupRecord[]>(() => {
    const saved = localStorage.getItem('app_standup_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_STANDUP_RECORDS;
  });

  // Voice Memos
  const [voiceMemos, setVoiceMemos] = useState<VoiceMemo[]>(() => {
    const saved = localStorage.getItem('app_voice_memos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_VOICE_MEMOS;
  });

  // OKR Goals
  const [okrGoals, setOkrGoals] = useState<OKRGoal[]>(() => {
    const saved = localStorage.getItem('app_okr_goals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_OKR_GOALS;
  });

  // Web Reader Articles
  const [webArticles, setWebArticles] = useState<WebArticleSummary[]>(() => {
    const saved = localStorage.getItem('app_web_articles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_WEB_ARTICLES;
  });

  // Morning Briefing
  const [morningBriefing, setMorningBriefing] = useState<MorningBriefing>(() => {
    const saved = localStorage.getItem('app_morning_briefing');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_MORNING_BRIEFING;
  });
  const [isMorningBriefingOpen, setIsMorningBriefingOpen] = useState<boolean>(false);

  // Global Keyboard Shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Synchronize document direction and theme classes
  useEffect(() => {
    localStorage.setItem('app_lang', lang);
    document.documentElement.dir = (lang === 'ug' || lang === 'ar') ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('app_theme_mode', themeMode);
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-midnight', 'theme-oled', 'theme-sepia');

    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else if (themeMode === 'midnight') {
      root.classList.add('dark', 'theme-midnight');
    } else if (themeMode === 'oled') {
      root.classList.add('dark', 'theme-oled');
    } else if (themeMode === 'sepia') {
      root.classList.add('theme-sepia');
    }
  }, [themeMode]);

  // Persist items
  useEffect(() => {
    localStorage.setItem('app_chat_sessions', JSON.stringify(chatSessions));
    localStorage.setItem('app_chat_messages', JSON.stringify(messages));
  }, [chatSessions, messages]);

  useEffect(() => {
    localStorage.setItem('app_active_session_id', activeSessionId);
  }, [activeSessionId]);

  useEffect(() => {
    localStorage.setItem('app_roadmap_phases', JSON.stringify(roadmapPhases));
  }, [roadmapPhases]);

  useEffect(() => {
    localStorage.setItem('app_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('app_notes', JSON.stringify(notes));
  }, [notes]);

  // Automatically sync chat conversations to Notebooks / Notes (ھەر قېتىم پاراڭلاشقان پاراڭلارنى يېڭى خاتىرىلەرگە ئاپتوماتىك ساقلاش)
  useEffect(() => {
    if (!chatSessions || chatSessions.length === 0) return;

    // Find sessions that have at least 1 user message
    const sessionsWithChat = chatSessions.filter(
      (s) => s.messages && s.messages.some((m) => m.role === 'user')
    );

    if (sessionsWithChat.length === 0) return;

    setNotes((prevNotes) => {
      let changed = false;
      const updatedNotes = [...prevNotes];

      for (const session of sessionsWithChat) {
        const noteId = `nb-chat-${session.id}`;
        const existingIdx = updatedNotes.findIndex((n) => n.id === noteId);

        // Format conversation transcript clearly
        const dialogueLines = session.messages
          .filter((m) => m.content && m.content.trim().length > 0)
          .map((m) => {
            const roleBadge = m.role === 'user' ? '👤 سىز' : '🤖 Gemini AI';
            const timeStr = m.timestamp ? ` (${m.timestamp})` : '';
            return `${roleBadge}${timeStr}:\n${m.content}`;
          })
          .join('\n\n---\n\n');

        const sessionTitle = session.title?.trim() || (lang === 'ug' ? 'سۆھبەت خاتىرىسى' : 'Chat Notes');
        const formattedContent = `# 💬 ${sessionTitle}\n\n${dialogueLines}`;

        if (existingIdx >= 0) {
          const current = updatedNotes[existingIdx];
          if (current.content !== formattedContent || current.title !== sessionTitle) {
            updatedNotes[existingIdx] = {
              ...current,
              title: sessionTitle,
              content: formattedContent,
              updatedAt: session.updatedAt || new Date().toISOString(),
              isChatSync: true,
              chatSessionId: session.id,
              tags: ['سۆھبەت', 'Gemini'],
            };
            changed = true;
          }
        } else {
          // Prepend at the top of notes so it immediately appears in Notebooks
          updatedNotes.unshift({
            id: noteId,
            title: sessionTitle,
            content: formattedContent,
            tags: ['سۆھبەت', 'Gemini'],
            updatedAt: session.updatedAt || new Date().toISOString(),
            isChatSync: true,
            chatSessionId: session.id,
          });
          changed = true;
        }
      }

      return changed ? updatedNotes : prevNotes;
    });
  }, [chatSessions, lang]);

  useEffect(() => {
    localStorage.setItem('app_calendar_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('app_knowledge_docs', JSON.stringify(docs));
  }, [docs]);

  useEffect(() => {
    localStorage.setItem('app_project_blueprints', JSON.stringify(blueprints));
  }, [blueprints]);

  useEffect(() => {
    localStorage.setItem('app_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('app_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('app_budget_goals', JSON.stringify(budgetGoals));
  }, [budgetGoals]);

  useEffect(() => {
    localStorage.setItem('app_flashcard_decks', JSON.stringify(flashcardDecks));
  }, [flashcardDecks]);

  useEffect(() => {
    localStorage.setItem('app_mind_maps', JSON.stringify(mindMaps));
  }, [mindMaps]);

  useEffect(() => {
    localStorage.setItem('app_prompt_templates', JSON.stringify(promptTemplates));
  }, [promptTemplates]);

  useEffect(() => {
    localStorage.setItem('app_standup_history', JSON.stringify(standupHistory));
  }, [standupHistory]);

  useEffect(() => {
    localStorage.setItem('app_voice_memos', JSON.stringify(voiceMemos));
  }, [voiceMemos]);

  useEffect(() => {
    localStorage.setItem('app_okr_goals', JSON.stringify(okrGoals));
  }, [okrGoals]);

  useEffect(() => {
    localStorage.setItem('app_web_articles', JSON.stringify(webArticles));
  }, [webArticles]);

  useEffect(() => {
    localStorage.setItem('app_morning_briefing', JSON.stringify(morningBriefing));
  }, [morningBriefing]);

  // AI Chat Handlers & Session Management
  const handleCreateNewSession = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title:
        lang === 'ug'
          ? 'يېڭى سۆھبەت'
          : lang === 'tr'
          ? 'Yeni Sohbet'
          : lang === 'ar'
          ? 'محادثة جديدة'
          : 'New Chat',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          role: 'model',
          content:
            lang === 'ug'
              ? 'ئەسسالامۇ ئەلەيكۇم! يېڭى پاراڭ بوشلۇقى قۇرۇلدى. سىزگە قانداق ياردەم قىلالايمەن؟'
              : lang === 'tr'
              ? 'Merhaba! Yeni sohbet oturumunuz oluşturuldu. Size nasıl yardımcı olabilirim?'
              : lang === 'ar'
              ? 'مرحباً بك! تم إنشاء جلسة محادثة جديدة. كيف يمكنني مساعدتك؟'
              : 'Hello! A new chat session has been started. How can I help you today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      personaId: 'universal',
    };
    setChatSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
  };

  const handleDeleteSession = (sessionId: string) => {
    setChatSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionId);
      if (filtered.length === 0) {
        const fresh: ChatSession = {
          id: `session-${Date.now()}`,
          title: lang === 'ug' ? 'يېڭى سۆھبەت' : 'New Chat',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [DEFAULT_INITIAL_WELCOME],
          personaId: 'universal',
        };
        setActiveSessionId(fresh.id);
        return [fresh];
      }
      if (activeSessionId === sessionId) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleRenameSession = (sessionId: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setChatSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, title: newTitle.trim() } : s))
    );
  };

  const handleTogglePinSession = (sessionId: string) => {
    setChatSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, pinned: !s.pinned } : s))
    );
  };

  const handleClearChat = () => {
    setChatSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              messages: [],
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );
  };

  const handleClearAllSessions = () => {
    const fresh: ChatSession = {
      id: `session-${Date.now()}`,
      title: lang === 'ug' ? 'يېڭى سۆھبەت' : 'New Chat',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [DEFAULT_INITIAL_WELCOME],
      personaId: 'universal',
    };
    setChatSessions([fresh]);
    setActiveSessionId(fresh.id);
  };

  const handleSendMessage = async (
    text: string,
    personaId: string = 'universal',
    attachments?: ChatAttachment[],
    modelId?: string
  ) => {
    const chosenModel = modelId || selectedGeminiModel;
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: attachments && attachments.length > 0 ? attachments : undefined,
    };

    // Calculate updated messages for active session and auto-generate title if default
    let updatedSessionMessages: ChatMessage[] = [];
    setChatSessions((prev) =>
      prev.map((s) => {
        if (s.id !== activeSessionId) return s;
        const isGenericTitle =
          s.title === 'يېڭى سۆھبەت' ||
          s.title === 'دەسلەپكى سۆھبەت' ||
          s.title === 'Yeni Sohbet' ||
          s.title === 'محادثة جديدة' ||
          s.title === 'New Chat' ||
          s.title === 'سۆھبەت';
        const newTitle = isGenericTitle
          ? text.trim().slice(0, 36) || s.title
          : s.title;

        updatedSessionMessages = [...s.messages, userMsg];
        return {
          ...s,
          title: newTitle,
          updatedAt: new Date().toISOString(),
          messages: updatedSessionMessages,
          personaId: personaId || s.personaId,
        };
      })
    );

    setIsLoadingChat(true);

    try {
      const historyContext = (updatedSessionMessages.length > 0
        ? updatedSessionMessages
        : [...messages, userMsg]
      ).slice(-8);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyContext,
          persona: personaId,
          model: chosenModel,
        }),
      });

      const data = await res.json();
      const replyContent = data.reply || data.fallback || 'جاۋاب ئېلىشتا خاتالىق كۆرۈلدى.';
      const modelUsed = data.modelUsed || chosenModel;

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'model',
        content: replyContent,
        modelUsed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                updatedAt: new Date().toISOString(),
                messages: [...s.messages, aiMsg],
              }
            : s
        )
      );

      return replyContent;
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'model',
        content:
          lang === 'ug'
            ? 'كەچۈرۈڭ، مۇلازىمېتىردىن جاۋاب ئېلىشتا خاتالىق يۈز بەردى. قايتا سىناپ بېقىڭ.'
            : lang === 'tr'
            ? 'Üzgünüz, sunucudan yanıt alınırken hata oluştu. Lütfen tekrar deneyin.'
            : lang === 'ar'
            ? 'عذراً، حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.'
            : 'Sorry, failed to fetch AI response. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                updatedAt: new Date().toISOString(),
                messages: [...s.messages, errorMsg],
              }
            : s
        )
      );

      return errorMsg.content;
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleQuickAsk = (prompt: string, persona?: string) => {
    setActiveTab('assistant');
    handleSendMessage(prompt, persona || 'universal');
  };

  // Calendar Handlers
  const handleAddCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `evt-${Date.now()}`,
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleToggleCalendarEvent = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
    );
  };

  const handleDeleteCalendarEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Knowledge Docs Handlers
  const handleAddKnowledgeDoc = (doc: KnowledgeDoc) => {
    setDocs((prev) => [doc, ...prev]);
  };

  const handleTogglePinDoc = (id: string) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, pinned: !d.pinned } : d))
    );
  };

  const handleDeleteKnowledgeDoc = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  // Project Blueprint Handlers
  const handleAddProjectBlueprint = (bp: ProjectBlueprint) => {
    setBlueprints((prev) => [bp, ...prev]);
  };

  // Habits Handlers
  const handleToggleHabitToday = (id: string) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const alreadyDone = h.completedDates.includes(todayStr);
        const newCompletedDates = alreadyDone
          ? h.completedDates.filter((d) => d !== todayStr)
          : [...h.completedDates, todayStr];
        const newStreak = alreadyDone ? Math.max(0, h.streak - 1) : h.streak + 1;
        const newBestStreak = Math.max(h.bestStreak, newStreak);
        return {
          ...h,
          completedDates: newCompletedDates,
          streak: newStreak,
          bestStreak: newBestStreak,
        };
      })
    );
  };

  const handleAddHabit = (
    habit: Omit<HabitItem, 'id' | 'streak' | 'bestStreak' | 'completedDates'>
  ) => {
    const newH: HabitItem = {
      ...habit,
      id: `habit-${Date.now()}`,
      streak: 1,
      bestStreak: 1,
      completedDates: [new Date().toISOString().slice(0, 10)],
    };
    setHabits((prev) => [newH, ...prev]);
  };

  const handleDeleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  // Finance Transactions Handlers
  const handleAddTransaction = (tx: Omit<FinanceTransaction, 'id'>) => {
    const newTx: FinanceTransaction = {
      ...tx,
      id: `tx-${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Task Handlers
  const handleAddTask = (newTask: Omit<TaskItem, 'id' | 'createdAt'>) => {
    const task: TaskItem = {
      ...newTask,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setTasks((prev) => [task, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddSubtasks = (
    taskId: string,
    subtasks: { id: string; title: string; done: boolean }[]
  ) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, subtasks: [...(t.subtasks || []), ...subtasks] } : t))
    );
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: (t.subtasks || []).map((st) =>
            st.id === subtaskId ? { ...st, done: !st.done } : st
          ),
        };
      })
    );
  };

  // Note Handlers
  const handleSaveNote = (note: NoteItem) => {
    setNotes((prev) => {
      const idx = prev.findIndex((n) => n.id === note.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = note;
        return copy;
      }
      return [note, ...prev];
    });
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Roadmap task toggler
  const handleToggleRoadmapTask = (phaseId: string, taskId: string) => {
    setRoadmapPhases((prev) =>
      prev.map((phase) => {
        if (phase.id !== phaseId) return phase;
        return {
          ...phase,
          tasks: phase.tasks.map((task) =>
            task.id === taskId ? { ...task, done: !task.done } : task
          ),
        };
      })
    );
  };

  // Flashcards CRUD
  const handleAddDeck = (deck: FlashcardDeck) => {
    setFlashcardDecks((prev) => [deck, ...prev]);
  };

  const handleUpdateDeck = (deck: FlashcardDeck) => {
    setFlashcardDecks((prev) => prev.map((d) => (d.id === deck.id ? deck : d)));
  };

  const handleDeleteDeck = (deckId: string) => {
    setFlashcardDecks((prev) => prev.filter((d) => d.id !== deckId));
  };

  // Mind Maps CRUD
  const handleAddMindMap = (map: MindMapItem) => {
    setMindMaps((prev) => [map, ...prev]);
  };

  const handleUpdateMindMap = (map: MindMapItem) => {
    setMindMaps((prev) => prev.map((m) => (m.id === map.id ? map : m)));
  };

  const handleDeleteMindMap = (mapId: string) => {
    setMindMaps((prev) => prev.filter((m) => m.id !== mapId));
  };

  // Prompt Lab CRUD
  const handleAddPromptTemplate = (tpl: PromptTemplate) => {
    setPromptTemplates((prev) => [tpl, ...prev]);
  };

  const handleDeletePromptTemplate = (id: string) => {
    setPromptTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  // Daily Standup CRUD
  const handleSaveStandupRecord = (rec: DailyStandupRecord) => {
    setStandupHistory((prev) => [rec, ...prev.filter((r) => r.date !== rec.date)]);
  };

  // Voice Memos CRUD
  const handleAddVoiceMemo = (memo: VoiceMemo) => {
    setVoiceMemos((prev) => [memo, ...prev]);
  };

  const handleDeleteVoiceMemo = (id: string) => {
    setVoiceMemos((prev) => prev.filter((m) => m.id !== id));
  };

  // OKR Goals CRUD
  const handleAddOkrGoal = (goal: OKRGoal) => {
    setOkrGoals((prev) => [goal, ...prev]);
  };

  const handleUpdateOkrGoal = (goal: OKRGoal) => {
    setOkrGoals((prev) => prev.map((g) => (g.id === goal.id ? goal : g)));
  };

  const handleDeleteOkrGoal = (id: string) => {
    setOkrGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Web Articles CRUD
  const handleAddWebArticle = (article: WebArticleSummary) => {
    setWebArticles((prev) => [article, ...prev]);
  };

  const handleDeleteWebArticle = (id: string) => {
    setWebArticles((prev) => prev.filter((a) => a.id !== id));
  };

  // Full Export & Import Handlers
  const handleExportAllData = () => {
    const fullBackup = {
      version: '3.5.0',
      exportedAt: new Date().toISOString(),
      tasks,
      notes,
      events,
      docs,
      blueprints,
      habits,
      transactions,
      budgetGoals,
      roadmapPhases,
      flashcardDecks,
      mindMaps,
      promptTemplates,
      standupHistory,
      voiceMemos,
      okrGoals,
      webArticles,
      chatSessions,
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Smart-Assistant-Backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportAllData = (backup: any) => {
    if (backup.tasks) setTasks(backup.tasks);
    if (backup.notes) setNotes(backup.notes);
    if (backup.events) setEvents(backup.events);
    if (backup.docs) setDocs(backup.docs);
    if (backup.blueprints) setBlueprints(backup.blueprints);
    if (backup.habits) setHabits(backup.habits);
    if (backup.transactions) setTransactions(backup.transactions);
    if (backup.budgetGoals) setBudgetGoals(backup.budgetGoals);
    if (backup.roadmapPhases) setRoadmapPhases(backup.roadmapPhases);
    if (backup.flashcardDecks) setFlashcardDecks(backup.flashcardDecks);
    if (backup.mindMaps) setMindMaps(backup.mindMaps);
    if (backup.promptTemplates) setPromptTemplates(backup.promptTemplates);
    if (backup.standupHistory) setStandupHistory(backup.standupHistory);
    if (backup.voiceMemos) setVoiceMemos(backup.voiceMemos);
    if (backup.okrGoals) setOkrGoals(backup.okrGoals);
    if (backup.webArticles) setWebArticles(backup.webArticles);
    if (backup.chatSessions && Array.isArray(backup.chatSessions) && backup.chatSessions.length > 0) {
      setChatSessions(backup.chatSessions);
      setActiveSessionId(backup.chatSessions[0].id);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all data back to original defaults?')) {
      setTasks(INITIAL_TASKS);
      setNotes(INITIAL_NOTES);
      setEvents(INITIAL_CALENDAR_EVENTS);
      setDocs(INITIAL_KNOWLEDGE_DOCS);
      setBlueprints(INITIAL_PROJECT_BLUEPRINTS);
      setHabits(INITIAL_HABITS);
      setTransactions(INITIAL_TRANSACTIONS);
      setBudgetGoals(INITIAL_BUDGET_GOALS);
      setRoadmapPhases(ROADMAP_PHASES);
      setFlashcardDecks(INITIAL_FLASHCARD_DECKS);
      setMindMaps(INITIAL_MIND_MAPS);
      setPromptTemplates(INITIAL_PROMPT_TEMPLATES);
      setStandupHistory(INITIAL_STANDUP_RECORDS);
      setVoiceMemos(INITIAL_VOICE_MEMOS);
      setOkrGoals(INITIAL_OKR_GOALS);
      setWebArticles(INITIAL_WEB_ARTICLES);
      setMorningBriefing(INITIAL_MORNING_BRIEFING);

      localStorage.clear();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <OverviewDashboard
            lang={lang}
            setActiveTab={setActiveTab}
            roadmapPhases={roadmapPhases}
            tasks={tasks}
            notes={notes}
            onQuickAsk={handleQuickAsk}
            onSelectPillar={(pillarId) => {
              setSelectedPillarId(pillarId);
              setActiveTab('blueprint');
            }}
            onOpenMorningBriefing={() => setIsMorningBriefingOpen(true)}
          />
        )}

        {activeTab === 'voicememos' && (
          <VoiceMemosView
            voiceMemos={voiceMemos}
            onAddVoiceMemo={handleAddVoiceMemo}
            onDeleteVoiceMemo={handleDeleteVoiceMemo}
            onAddTask={handleAddTask}
            onAddNote={handleSaveNote}
            language={lang}
            isRTL={lang === 'ug' || lang === 'ar'}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            tasks={tasks}
            events={events}
            habits={habits}
            transactions={transactions}
            standupRecords={standupHistory}
            language={lang}
            isRTL={lang === 'ug' || lang === 'ar'}
          />
        )}

        {activeTab === 'docExporter' && (
          <DocExporterView
            tasks={tasks}
            events={events}
            knowledgeDocs={docs}
            blueprints={blueprints}
            standupRecords={standupHistory}
            voiceMemos={voiceMemos}
            okrGoals={okrGoals}
            flashcardDecks={flashcardDecks}
            habits={habits}
            language={lang}
            isRTL={lang === 'ug' || lang === 'ar'}
          />
        )}

        {activeTab === 'webReader' && (
          <WebReaderView
            articles={webArticles}
            onAddArticle={handleAddWebArticle}
            onDeleteArticle={handleDeleteWebArticle}
            onAddKnowledgeDoc={handleAddKnowledgeDoc}
            onAddTask={handleAddTask}
            language={lang}
            isRTL={lang === 'ug' || lang === 'ar'}
          />
        )}

        {activeTab === 'okrGoals' && (
          <OKRGoalsView
            okrGoals={okrGoals}
            onAddGoal={handleAddOkrGoal}
            onUpdateGoal={handleUpdateOkrGoal}
            onDeleteGoal={handleDeleteOkrGoal}
            onAddTask={handleAddTask}
            language={lang}
            isRTL={lang === 'ug' || lang === 'ar'}
          />
        )}

        {activeTab === 'blueprint' && (
          <BlueprintView
            lang={lang}
            roadmap={roadmapPhases}
            onToggleRoadmapTask={handleToggleRoadmapTask}
          />
        )}

        {activeTab === 'assistant' && (
          <AssistantChatView
            lang={lang}
            messages={messages}
            chatSessions={chatSessions}
            activeSessionId={activeSessionId}
            selectedModelId={selectedGeminiModel}
            notes={notes}
            onSaveNote={handleSaveNote}
            onSelectModel={handleSelectGeminiModel}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            onCreateNewSession={handleCreateNewSession}
            onSelectSession={handleSelectSession}
            onDeleteSession={handleDeleteSession}
            onRenameSession={handleRenameSession}
            onTogglePinSession={handleTogglePinSession}
            onClearAllSessions={handleClearAllSessions}
            isLoading={isLoadingChat}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            lang={lang}
            events={events}
            tasks={tasks}
            onAddEvent={handleAddCalendarEvent}
            onToggleEvent={handleToggleCalendarEvent}
            onDeleteEvent={handleDeleteCalendarEvent}
            onBulkSetEvents={(newEvents) => setEvents(newEvents)}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeBaseView
            lang={lang}
            docs={docs}
            onAddDoc={handleAddKnowledgeDoc}
            onTogglePinDoc={handleTogglePinDoc}
            onDeleteDoc={handleDeleteKnowledgeDoc}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsHubView
            lang={lang}
            blueprints={blueprints}
            onAddBlueprint={handleAddProjectBlueprint}
          />
        )}

        {(activeTab === 'codingStudio' || activeTab === 'codeStudio') && (
          <CodingStudioView
            lang={lang}
            onSaveToNotes={(title, content) => {
              handleSaveNote({
                id: `note-${Date.now()}`,
                title,
                content,
                tags: ['Coding', 'Snippets'],
                updatedAt: new Date().toISOString(),
              });
            }}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardsView
            lang={lang}
            decks={flashcardDecks}
            onAddDeck={handleAddDeck}
            onUpdateDeck={handleUpdateDeck}
            onDeleteDeck={handleDeleteDeck}
          />
        )}

        {activeTab === 'mindmap' && (
          <MindMapView
            lang={lang}
            mindMaps={mindMaps}
            onAddMindMap={handleAddMindMap}
            onUpdateMindMap={handleUpdateMindMap}
            onDeleteMindMap={handleDeleteMindMap}
          />
        )}

        {activeTab === 'standup' && (
          <DailyStandupView
            lang={lang}
            tasks={tasks}
            events={events}
            habits={habits}
            standupHistory={standupHistory}
            onSaveStandup={handleSaveStandupRecord}
          />
        )}

        {activeTab === 'promptlab' && (
          <PromptLabView
            lang={lang}
            templates={promptTemplates}
            onAddTemplate={handleAddPromptTemplate}
            onDeleteTemplate={handleDeletePromptTemplate}
            onSaveResultAsNote={(title, content) => {
              handleSaveNote({
                id: `note-${Date.now()}`,
                title,
                content,
                tags: ['PromptLab', 'AI'],
                updatedAt: 'ھازىرلا',
              });
              setActiveTab('productivity');
            }}
          />
        )}

        {activeTab === 'financeAndHabits' && (
          <HabitsAndFinanceView
            lang={lang}
            habits={habits}
            transactions={transactions}
            budgetGoals={budgetGoals}
            onToggleHabitToday={handleToggleHabitToday}
            onAddHabit={handleAddHabit}
            onDeleteHabit={handleDeleteHabit}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {activeTab === 'productivity' && (
          <ProductivityView
            lang={lang}
            tasks={tasks}
            notes={notes}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onAddSubtasks={handleAddSubtasks}
            onToggleSubtask={handleToggleSubtask}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
          />
        )}

        {activeTab === 'focus' && (
          <FocusToolsView
            lang={lang}
            onSaveToNotes={(newNote) => {
              handleSaveNote(newNote);
              setActiveTab('productivity');
            }}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsSyncView
            lang={lang}
            onSelectLang={setLang}
            themeMode={themeMode}
            onSelectTheme={setThemeMode}
            onExportAllData={handleExportAllData}
            onImportAllData={handleImportAllData}
            onResetDefaults={handleResetDefaults}
          />
        )}
      </main>

      {/* Global Command Palette & Quick Search Modal */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        lang={lang}
        setLang={setLang}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        tasks={tasks}
        notes={notes}
        events={events}
        docs={docs}
        blueprints={blueprints}
      />

      {/* Realtime Voice Assistant Modal */}
      <VoiceAssistantModal
        lang={lang}
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSendMessage={async (text) => {
          return await handleSendMessage(text, 'universal');
        }}
      />

      {/* Daily Morning Briefing Modal */}
      <MorningBriefingModal
        isOpen={isMorningBriefingOpen}
        onClose={() => setIsMorningBriefingOpen(false)}
        briefing={morningBriefing}
        tasks={tasks}
        events={events}
        habits={habits}
        transactions={transactions}
        onStartFocus={() => setActiveTab('focus')}
        onAddTask={handleAddTask}
        language={lang}
        isRTL={lang === 'ug' || lang === 'ar'}
      />

      {/* Footer */}
      <Footer
        lang={lang}
        setActiveTab={setActiveTab}
        onResetAllData={handleResetDefaults}
      />
    </div>
  );
}
