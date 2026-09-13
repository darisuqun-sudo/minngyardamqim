export type AppLanguage = 'ug' | 'en' | 'tr' | 'ar';

export type NavTab =
  | 'dashboard'
  | 'codingStudio'
  | 'codeStudio'
  | 'blueprint'
  | 'assistant'
  | 'calendar'
  | 'knowledge'
  | 'projects'
  | 'flashcards'
  | 'mindmap'
  | 'standup'
  | 'promptlab'
  | 'voicememo'
  | 'voicememos'
  | 'analytics'
  | 'okr'
  | 'okrGoals'
  | 'webreader'
  | 'webReader'
  | 'exporter'
  | 'docExporter'
  | 'finance-habits'
  | 'financeAndHabits'
  | 'productivity'
  | 'focus'
  | 'settings';

export type ThemeMode = 'light' | 'dark' | 'midnight' | 'oled' | 'sepia';

export interface ChatAttachment {
  id: string;
  name: string;
  type: 'image' | 'file';
  mimeType: string;
  size: number;
  dataUrl?: string;
  base64Data?: string;
  textContent?: string;
  driveUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  persona?: string;
  modelUsed?: string;
  audioGenerated?: boolean;
  attachments?: ChatAttachment[];
}

export interface GeminiModelInfo {
  id: string;
  name: string;
  badgeUg: string;
  badgeEn: string;
  badgeTr?: string;
  badgeAr?: string;
  descriptionUg: string;
  descriptionEn: string;
  descriptionTr?: string;
  descriptionAr?: string;
  category: 'default' | 'fast' | 'reasoning' | 'pro' | 'lite' | 'vision' | 'audio';
  speedLevel: number; // 1 to 5
  intelligenceLevel: number; // 1 to 5
  contextWindow: string;
  iconName: string;
  color: string;
  isRecommended?: boolean;
  isFreeTier?: boolean;
  freeTierLimitsUg?: string;
  freeTierLimitsEn?: string;
  freeTierRate?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  personaId?: string;
  pinned?: boolean;
}

export interface AssistantPersona {
  id: string;
  nameUg: string;
  nameEn: string;
  taglineUg: string;
  taglineEn: string;
  icon: string;
  descriptionUg: string;
  descriptionEn: string;
  color: string;
  bgLight: string;
  promptSuggestionsUg: string[];
  promptSuggestionsEn: string[];
}

export interface BlueprintPillar {
  id: string;
  num: string;
  titleUg: string;
  titleEn: string;
  icon: string;
  badgeUg: string;
  badgeEn: string;
  summaryUg: string;
  summaryEn: string;
  coreFeaturesUg: string[];
  coreFeaturesEn: string[];
  techChoices: {
    category: string;
    tech: string;
    purposeUg: string;
    purposeEn: string;
  }[];
  architecturePointsUg: string[];
  architecturePointsEn: string[];
}

export interface RoadmapTask {
  id: string;
  titleUg: string;
  titleEn: string;
  done: boolean;
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  titleUg: string;
  titleEn: string;
  durationUg: string;
  durationEn: string;
  badgeUg: string;
  badgeEn: string;
  descriptionUg: string;
  descriptionEn: string;
  tasks: RoadmapTask[];
}

export interface TaskItem {
  id: string;
  title: string;
  category: 'dev' | 'design' | 'planning' | 'personal';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  recurring?: 'none' | 'daily' | 'weekdays' | 'weekly' | 'monthly';
  estimatedMinutes?: number;
  subtasks?: { id: string; title: string; done: boolean }[];
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
  pinned?: boolean;
  isChatSync?: boolean;
  chatSessionId?: string;
}

export interface QuickTool {
  id: string;
  nameUg: string;
  nameEn: string;
  icon: string;
  descUg: string;
  descEn: string;
  actionType: 'translate' | 'breakdown-task' | 'summarize' | 'code-helper';
  placeholderUg: string;
  placeholderEn: string;
}

// 1. Smart Calendar & Time-Blocking
export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  date: string;      // "YYYY-MM-DD"
  category: 'work' | 'meeting' | 'study' | 'personal' | 'health' | 'code';
  color: string;
  description?: string;
  completed?: boolean;
}

// 2. Personal Knowledge Base & Document Intelligence
export interface KnowledgeDoc {
  id: string;
  title: string;
  fileType: 'text' | 'markdown' | 'pdf' | 'code' | 'json';
  content: string;
  summary?: string;
  keyInsights?: string[];
  tags: string[];
  uploadedAt: string;
  sizeKb: number;
  pinned?: boolean;
}

// 3. Project Architect & Code Boilerplate Hub
export interface ProjectBlueprint {
  id: string;
  title: string;
  category: 'web' | 'mobile' | 'ai-agent' | 'fullstack';
  description: string;
  techStack: string[];
  architectureDiagram?: string;
  status: 'planned' | 'in-progress' | 'completed';
  files: { path: string; content: string; language: string }[];
}

// 4. Habit Tracking with Streaks
export interface HabitItem {
  id: string;
  title: string;
  frequency: 'daily' | 'weekdays' | 'custom';
  streak: number;
  bestStreak: number;
  completedDates: string[]; // ['2026-08-26', ...]
  category: 'health' | 'learning' | 'coding' | 'mindset' | 'focus';
  icon: string;
  color: string;
}

// 5. Personal Finance & Budgeting
export interface FinanceTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: 'salary' | 'freelance' | 'software' | 'living' | 'food' | 'learning' | 'other';
  date: string; // 'YYYY-MM-DD'
  title: string;
  note?: string;
}

export interface BudgetGoal {
  id: string;
  category: string;
  monthlyLimit: number;
  spent: number;
}

// 6. AI Flashcards & Quiz Engine
export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  hint?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  lastReviewed?: string;
  repetitionCount: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  userSelectedIndex?: number;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  category: string;
  cards: Flashcard[];
  quizzes?: QuizQuestion[];
  createdAt: string;
}

// 7. AI Interactive Mind Map & Concept Tree
export interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  color?: string;
  icon?: string;
  children?: MindMapNode[];
  expanded?: boolean;
}

export interface MindMapItem {
  id: string;
  title: string;
  topic: string;
  root: MindMapNode;
  createdAt: string;
}

// 8. AI Daily Standup & Evening Reflection
export interface DailyStandupRecord {
  id: string;
  date: string;
  mood: 'great' | 'good' | 'neutral' | 'tired' | 'stressed';
  energyLevel: number; // 1-5
  accomplished: string[];
  blockers?: string[];
  tomorrowGoals: string[];
  reportMarkdown: string;
  motivationalQuote?: string;
  userNotes?: string;
  createdAt: string;
}

// 9. AI Prompt Lab & Custom Templates
export interface PromptVariable {
  name: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  type?: 'text' | 'textarea';
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: 'coding' | 'writing' | 'learning' | 'business' | 'translation' | 'custom';
  description: string;
  icon: string;
  systemPrompt?: string;
  userPromptTemplate: string;
  variables: PromptVariable[];
  isCustom?: boolean;
}

// 10. Global Command Palette Item
export interface CommandPaletteAction {
  id: string;
  title: string;
  category: 'navigation' | 'action' | 'search' | 'theme' | 'ai';
  icon: string;
  shortcut?: string;
  action: () => void;
  keywords?: string[];
}

// 11. AI Voice Memos & Audio Transcriptions
export interface VoiceMemo {
  id: string;
  title: string;
  transcript: string;
  audioDataUrl?: string;
  durationSec: number;
  createdAt: string;
  summary: string;
  actionItems: string[];
  tags: string[];
  category: 'idea' | 'meeting' | 'task' | 'learning' | 'personal';
}

// 12. Smart OKRs & Goal Tracker
export interface OKRMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface OKRKeyResult {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  progressPercentage: number;
  milestones: OKRMilestone[];
}

export interface OKRGoal {
  id: string;
  title: string;
  objective: string;
  quarter: string;
  category: 'career' | 'health' | 'finance' | 'learning' | 'project';
  keyResults: OKRKeyResult[];
  status: 'on-track' | 'at-risk' | 'completed' | 'behind';
  dueDate: string;
  aiStrategicAdvice?: string;
  createdAt: string;
}

// 13. Web Article & URL Reader Mode
export interface WebArticleSummary {
  id: string;
  url?: string;
  originalTitle: string;
  authors?: string;
  readingTimeMin: number;
  tldr: string;
  keyTakeaways: string[];
  inDepthSummary: string;
  actionItems: string[];
  translations: {
    ug?: string;
    tr?: string;
    en?: string;
    ar?: string;
  };
  tags: string[];
  analyzedAt: string;
}

// 14. Morning Briefing & Daily Focus Launchpad
export interface MorningPriorityItem {
  id: string;
  title: string;
  urgency: 'high' | 'medium' | 'low';
  whyImportant: string;
  done: boolean;
}

export interface MorningBriefing {
  date: string;
  greeting: string;
  weatherOrVibe: string;
  dailyWisdomQuote: string;
  quoteAuthor?: string;
  top3Priorities: MorningPriorityItem[];
  calendarSummary: string;
  aiEnergyRecommendation: string;
  generatedAt: string;
}

// 15. Weekly & Monthly Productivity Analytics
export interface AnalyticsReport {
  id: string;
  period: 'week' | 'month';
  startDate: string;
  endDate: string;
  productivityScore: number; // 0-100
  tasksCompleted: number;
  tasksCompletionRate: number; // percentage
  focusMinutesTotal: number;
  habitConsistencyScore: number; // percentage
  topCategory: string;
  insightsMarkdown: string;
  strengths: string[];
  opportunities: string[];
  recommendations: string[];
  generatedAt: string;
}

// 16. Rich Multi-Format Exporter Config
export interface ExportDocConfig {
  title: string;
  format: 'pdf' | 'markdown' | 'text' | 'json' | 'html';
  sections: string[];
  theme: 'clean' | 'modern' | 'minimal';
}

