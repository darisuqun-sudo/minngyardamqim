import {
  CalendarEvent,
  KnowledgeDoc,
  ProjectBlueprint,
  HabitItem,
  FinanceTransaction,
  BudgetGoal,
} from '../types';

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'تۈر قۇرۇلمىسى & UI سىستېما تەكشۈرۈش',
    startTime: '09:00',
    endTime: '10:30',
    date: '2026-08-27',
    category: 'work',
    color: '#6366f1',
    description: 'Frontend component architecture & state machine verification',
    completed: true,
  },
  {
    id: 'evt-2',
    title: 'Gemini 3.7 Flash API ئۇلاش & سىناش',
    startTime: '11:00',
    endTime: '12:30',
    date: '2026-08-27',
    category: 'code',
    color: '#8b5cf6',
    description: 'Server-side API proxy verification and error boundary check',
    completed: false,
  },
  {
    id: 'evt-3',
    title: 'چوڭقۇر زېھىن مەركەزلەشتۈرۈش (Deep Focus)',
    startTime: '14:00',
    endTime: '16:00',
    date: '2026-08-27',
    category: 'study',
    color: '#10b981',
    description: 'Writing documentation & architecture blueprint diagrams',
    completed: false,
  },
  {
    id: 'evt-4',
    title: 'كۈندىلىك پىلان ۋە ئادەت خۇلاسىسى',
    startTime: '20:30',
    endTime: '21:00',
    date: '2026-08-27',
    category: 'personal',
    color: '#f59e0b',
    description: 'Reviewing daily streaks and adjusting tomorrow schedule',
    completed: false,
  },
];

export const INITIAL_KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: 'doc-1',
    title: 'زامانىۋى ياردەمچى ئەپنىڭ قۇرۇلما پىرىنسىپلىرى (System Blueprint)',
    fileType: 'markdown',
    content: `# زامانىۋى كۆپ ئىقتىدارلىق ئەپ ۋە توربىكەت لايىھىسى

بۇ پىلان شەخسىي كۆپ ئىقتىدارلىق ئەقلىي ياردەمچى ۋە تۈر قۇرۇلما مەركىزىنىڭ يادرولۇق قائىدىلىرىنى ئۆز ئىچىگە ئالىدۇ:

1. **يەرلىك سانلىق مەلۇمات مۇستەقىللىقى**: ئىشلەتكۈچىنىڭ بارلىق ۋەزىپە ۋە خاتىرىلىرى ئالدى بىلەن يەرلىكتە تېز ھەم بىخەتەر ساقلىنىدۇ.
2. **مۇلازىمېتىر تەرەپ AI قورۇقى**: Gemini API مەخپىي ئاچقۇچى توركۆرگۈچكە ئاشكارىلانمايدۇ.
3. **كۆپ تىللىق يېقىشلىق كۆرۈنمە يۈز**: ئۇيغۇرچە، تۈركچە، ئەرەبچە (RTL) ۋە ئىنگلىزچە (LTR) دەل ئالماشتۇرۇلىدۇ.
4. **ئاۋازلىق كىرگۈزۈش ۋە تېز قوراللار**: زېھىن چېچىلماي تېز خىزمەت قىلىش ئۈچۈن لايىھىلەنگەن.`,
    summary: 'شەخسىي كۆپ ئىقتىدارلىق ئەپنىڭ يادرولۇق پىرىنسىپلىرى، يەرلىك سانلىق مەلۇمات بىخەتەرلىكى ۋە كۆپ تىللىق قۇرۇلما پىلانى بايان قىلىنغان.',
    keyInsights: [
      'يەرلىك سانلىق مەلۇماتلار ھەرگىز يوقالمايدۇ ۋە تېز يۈكلىنىدۇ',
      'API ئاچقۇچلىرى بىخەتەر قوغدىلىدۇ',
      'RTL ۋە LTR تىللار تەبىئىي ماسلىشىدۇ',
    ],
    tags: ['لايىھە', 'قۇرۇلما', 'پىلان', 'AI'],
    uploadedAt: '2026-08-26',
    sizeKb: 1.8,
  },
  {
    id: 'doc-2',
    title: 'React 19 + Express ئۈنۈملۈك قېلىپى',
    fileType: 'code',
    content: `// Express + Gemini Clean Architecture Pattern
import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/assistant', async (req, res) => {
  const { prompt } = req.body;
  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
  });
  res.json({ reply: response.text });
});`,
    summary: 'Express مۇلازىمېتىرى بىلەن Gemini 3.8 Flash مودېلىنى بىخەتەر ئۇلاشنىڭ ئەڭ يۇقىرى سۈپەتلىك كود قېلىپى.',
    keyInsights: [
      'Lazy client initialization ئىشلىتىلىدۇ',
      'API ئاچقۇچىنى مۇلازىمېتىردا مەخپىي ساقلاش كېرەك',
      'TypeScript كۆرۈنمە يۈزى بىلەن تىپ بىخەتەرلىكى كاپالەتكە ئىگە قىلىنىدۇ',
    ],
    tags: ['كود', 'Express', 'React', 'TypeScript'],
    uploadedAt: '2026-08-26',
    sizeKb: 0.9,
  },
];

export const INITIAL_PROJECT_BLUEPRINTS: ProjectBlueprint[] = [
  {
    id: 'proj-1',
    title: 'كۆپ ئىقتىدارلىق شەخسىي ئەقلىي ياردەمچى (Universal AI Assistant)',
    category: 'fullstack',
    description: 'React 19 + Tailwind CSS + Express + Gemini 3.7 Flash ئاساسىدىكى تولۇق كۆپ تىللىق ياردەمچى سىستېما.',
    techStack: ['React 19', 'TypeScript', 'Express', 'Tailwind CSS v4', 'Gemini 3.7 Flash'],
    status: 'in-progress',
    files: [
      {
        path: 'src/App.tsx',
        language: 'typescript',
        content: `// Main Universal Assistant App
import React from 'react';
export default function App() {
  return <div className="p-6">Smart Assistant Hub Active</div>;
}`,
      },
      {
        path: 'server.ts',
        language: 'typescript',
        content: `// Backend Gemini AI Proxy Server
import express from 'express';
const app = express();
app.listen(3000, () => console.log('Server online'));`,
      },
    ],
  },
  {
    id: 'proj-2',
    title: 'تېز سۈرئەتلىك بىلىم ئامبىرى & RAG ھۆججەت سىستېمىسى',
    category: 'ai-agent',
    description: 'ئۆزىڭىزنىڭ ھۆججەتلىرىنى يەرلىكتە يۈكلەپ، Gemini ئارقىلىق دەل جاۋاب ئىزدەيدىغان سىستېما.',
    techStack: ['Vector Embeddings', 'IndexedDB', 'React', 'Gemini API'],
    status: 'planned',
    files: [
      {
        path: 'src/lib/rag.ts',
        language: 'typescript',
        content: `// RAG semantic search helper
export async function queryDocument(doc: string, question: string) {
  // query logic
}`,
      },
    ],
  },
];

export const INITIAL_HABITS: HabitItem[] = [
  {
    id: 'habit-1',
    title: 'كۈندە 30 مىنۇت كود يېزىش ۋە پىلان تەھلىلى',
    frequency: 'daily',
    streak: 12,
    bestStreak: 28,
    completedDates: ['2026-08-26', '2026-08-25', '2026-08-24', '2026-08-23', '2026-08-22'],
    category: 'coding',
    icon: 'code',
    color: '#6366f1',
  },
  {
    id: 'habit-2',
    title: 'كىتاب ئوقۇش ياكى تېخنىكا ھۆججىتى كۆرۈش (20m)',
    frequency: 'daily',
    streak: 7,
    bestStreak: 15,
    completedDates: ['2026-08-26', '2026-08-25', '2026-08-24', '2026-08-23'],
    category: 'learning',
    icon: 'book',
    color: '#10b981',
  },
  {
    id: 'habit-3',
    title: 'كۈندىلىك نىشانلارنى خۇلاسىلەش ۋە ئەتە پىلانلاش',
    frequency: 'daily',
    streak: 5,
    bestStreak: 14,
    completedDates: ['2026-08-26', '2026-08-25', '2026-08-24'],
    category: 'mindset',
    icon: 'sparkles',
    color: '#f59e0b',
  },
  {
    id: 'habit-4',
    title: 'چوڭقۇر زېھىن پومودورو چېنىقىشى (2 قېتىم)',
    frequency: 'daily',
    streak: 9,
    bestStreak: 18,
    completedDates: ['2026-08-26', '2026-08-25', '2026-08-24', '2026-08-23', '2026-08-22'],
    category: 'focus',
    icon: 'timer',
    color: '#ec4899',
  },
];

export const INITIAL_TRANSACTIONS: FinanceTransaction[] = [
  {
    id: 'tx-1',
    type: 'income',
    amount: 3200,
    category: 'freelance',
    date: '2026-08-25',
    title: 'Full-Stack Web App Architecture Freelance',
    note: 'Completed Milestone 1 delivery',
  },
  {
    id: 'tx-2',
    type: 'expense',
    amount: 49,
    category: 'software',
    date: '2026-08-26',
    title: 'Cloud Server & Domain Hosting',
    note: 'Monthly infrastructure fee',
  },
  {
    id: 'tx-3',
    type: 'expense',
    amount: 35,
    category: 'learning',
    date: '2026-08-24',
    title: 'AI & Software Architecture Masterclass',
    note: 'Online course textbook',
  },
  {
    id: 'tx-4',
    type: 'income',
    amount: 1500,
    category: 'salary',
    date: '2026-08-20',
    title: 'Consulting & Technical Mentorship',
    note: 'Bi-weekly advisory payout',
  },
];

export const INITIAL_BUDGET_GOALS: BudgetGoal[] = [
  { id: 'bg-1', category: 'software', monthlyLimit: 150, spent: 49 },
  { id: 'bg-2', category: 'learning', monthlyLimit: 200, spent: 35 },
  { id: 'bg-3', category: 'living', monthlyLimit: 800, spent: 310 },
];
