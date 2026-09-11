import {
  FlashcardDeck,
  MindMapItem,
  PromptTemplate,
  DailyStandupRecord,
  VoiceMemo,
  OKRGoal,
  WebArticleSummary,
  MorningBriefing,
} from '../types';

export const INITIAL_FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-ai-arch',
    title: 'Full-Stack AI & System Design',
    description: 'سۈنئىي ئىدراك، تىل مودېللىرى ۋە كۆپ قاتلاملىق سىستېما لايىھە پرىنسىپلىرى',
    category: 'Architecture',
    createdAt: '2026-08-26',
    cards: [
      {
        id: 'fc-1',
        deckId: 'deck-ai-arch',
        front: 'RAG (Retrieval-Augmented Generation) نىڭ ئاساسىي خىزمەت پرىنسىپى نېمە؟',
        back: 'تەبىئىي تىل مودېلى سوئالغا جاۋاب بېرىشتىن بۇرۇن، سىرتقى بىلىم ئامبىرى ياكى ۋېكتورلۇق ئامباردىن ئالاقىدار مەزمۇنلارنى ئىزدەپ تېپىپ (Retrieval)، ئۇنى دەسلەپكى سوئال بىلەن بىللە مودېلغا ئەۋەتىپ دەلىللەنگەن جاۋاب ھاسىل قىلىش (Generation) ئۇسۇلىدۇر.',
        hint: 'ئىزدەش + كۈچەيتىش + ھاسىل قىلىش',
        difficulty: 'medium',
        repetitionCount: 2,
      },
      {
        id: 'fc-2',
        deckId: 'deck-ai-arch',
        front: 'SPA (Single Page Application) دا كېچىكىشنى (Latency) ئازايتىشنىڭ ئەڭ ياخشى ئۇسۇلى قايسى؟',
        back: 'كودنى بۆلەكلەرگە بۆلۈش (Code Splitting/Lazy Loading)، تۇراقلىق ھۆججەتلەرنى CDN لارغا تارقىتىش، ئېھتىياجغا قاراپ ئەستە تۇتۇش (SWR / React Query caching) ۋە بايلىقلارنى قىسقارتىش (Minification).',
        hint: 'كود بۆلۈش ۋە ئەستە ساقلاش',
        difficulty: 'easy',
        repetitionCount: 3,
      },
      {
        id: 'fc-3',
        deckId: 'deck-ai-arch',
        front: 'Web Speech API نىڭ SpeechRecognition بىلەن SpeechSynthesis نىڭ پەرقى نېمە؟',
        back: 'SpeechRecognition ئابونتنىڭ مىكروفوندىن كىرگۈزگەن ئاۋازىنى تېكىستكە ئايلاندۇرىدۇ (STT); SpeechSynthesis بولسا تېكىستنى ئاۋازغا ئايلاندۇرۇپ ياڭراتقۇدىن ياڭرىتىدۇ (TTS).',
        hint: 'ئاۋازنى تېكىستكە VS تېكىستنى ئاۋازغا',
        difficulty: 'easy',
        repetitionCount: 1,
      },
      {
        id: 'fc-4',
        deckId: 'deck-ai-arch',
        front: 'TypeScript تىپ سىستېمىسىدا "Generics" نېمە ئۈچۈن قىممەتلىك؟',
        back: 'Generics پىروگراممېرغا بىر قېتىم يېزىلغان فۇنكسىيە ياكى كۆرۈنمە يۈزنى كۆپ خىل سانلىق مەلۇمات تىپلىرى بىلەن تىپ بىخەتەرلىكىنى (Type Safety) ساقلىغان ئاساستا قايتا ئىشلىتىش ئىمكانىيىتى يارىتىپ بېرىدۇ.',
        hint: 'قايتا ئىشلىتىشچان تىپ بەلگىلەش',
        difficulty: 'medium',
        repetitionCount: 2,
      },
    ],
    quizzes: [
      {
        id: 'quiz-1',
        question: 'تۆۋەندىكىلەرنىڭ قايسىسى سۈنئىي ئىدراك مودېللىرىنىڭ تەننەرخىنى تۆۋەنلىتىش ۋە سۈرئىتىنى ئاشۇرۇشقا ئەڭ ياردەم بېرىدۇ؟',
        options: [
          'سوئال-جاۋاب مەزمۇنىنى كەڭ دائىرىدە Context Caching قىلىش',
          'ھەر بىر تەلەپتە بىر پۈتۈن چوڭ كود ئامبىرىنى قايتا ئەۋەتىش',
          'بارلىق سۈرەتلەرنى 4K ئېنىقلىقتا بىر تەرەپ قىلىش',
          'مۇلازىمېتىر ئۇلىنىشىنى ھەر تەلەپتە قايتىدىن قۇرۇش',
        ],
        correctIndex: 0,
        explanation: 'Context Caching قايتا-قايتا ئىشلىتىلىدىغان سىستېما بۇيرۇقلىرى ياكى چوڭ ھۆججەتلەرنى قايتا ھېسابلىماي سۈرئەتنى تېزلىتىدۇ ۋە خىراجەتنى كۆرۈنەرلىك ئازايتىدۇ.',
      },
    ],
  },
  {
    id: 'deck-frontend-pro',
    title: 'React 18 & Modern Web Performance',
    description: 'React Concurrent Mode, Hooks, State Management ۋە Tailwind CSS ئۇسۇللىرى',
    category: 'Frontend',
    createdAt: '2026-08-25',
    cards: [
      {
        id: 'fc-5',
        deckId: 'deck-frontend-pro',
        front: 'React تا `useEffect` ئىچىدىكى مەڭگۈلۈك ئايلىنىش (Infinite loop) نىڭ ئاساسلىق سەۋەبى نېمە؟',
        back: 'تەۋەلىك تىزىملىكى (dependency array) غا يېڭى ئوبيېكت ياكى سانلار گۇرۇپپىسىنى تۇراقلاشتۇرماي كىرگۈزۈش، ياكى تەۋەلىك تىزىملىكىدىكى قىممەتنى ئۆزگەرتىدىغان state نى بىۋاسىتە ئىجرا قىلىش.',
        hint: 'Dependency Array & State Mutations',
        difficulty: 'medium',
        repetitionCount: 1,
      },
      {
        id: 'fc-6',
        deckId: 'deck-frontend-pro',
        front: 'Tailwind CSS نىڭ JIT (Just-in-Time) موتورىنىڭ ئاساسلىق ئەۋزەللىكى نېمە؟',
        back: 'پەقەت كودتا راستىنلا ئىشلىتىلگەن utility class لارنىلا دەل ۋاقتىدا قۇراشتۇرۇپ ئىشلەپچىقىرىش، بۇنىڭ بىلەن ئاخىرقى CSS ھۆججەت چوڭلۇقى 10-20KB ئەتراپىدا ئىنتايىن كىچىك چىقىدۇ.',
        hint: 'كېرەكلىكنىلا تېز پىرىسلاپ چىقىرىش',
        difficulty: 'easy',
        repetitionCount: 4,
      },
    ],
  },
];

export const INITIAL_MIND_MAPS: MindMapItem[] = [
  {
    id: 'mm-full-system',
    title: 'كۆپ ئىقتىدارلىق ئەقلىي ياردەمچى سىستېما قۇرۇلمىسى',
    topic: 'Smart AI Assistant Hub Architecture',
    createdAt: '2026-08-26',
    root: {
      id: 'mm-root-1',
      label: '🚀 Smart Assistant Hub',
      description: 'كۆپ ئىقتىدارلىق زامانىۋى ئەقلىي ياردەمچى ۋە تۈر لايىھە مەركىزى',
      color: '#4f46e5',
      expanded: true,
      children: [
        {
          id: 'mm-node-1',
          label: '1. ئاۋاز & سۆزلىشىش (Voice AI & Chat)',
          color: '#3b82f6',
          expanded: true,
          children: [
            { id: 'mm-node-1-1', label: 'Web Speech API (STT/TTS)', description: 'ئاۋازنى يېزىققا، يېزىقنى ئاۋازغا تېز ئايلاندۇرۇش', color: '#60a5fa' },
            { id: 'mm-node-1-2', label: 'كۆپ تىللىق خاراكتېر كارتىلىرى', description: 'Architect, Coder, Writer, Life Coach', color: '#60a5fa' },
          ],
        },
        {
          id: 'mm-node-2',
          label: '2. ۋاقىت & بىلىم (Time & Knowledge Engine)',
          color: '#10b981',
          expanded: true,
          children: [
            { id: 'mm-node-2-1', label: 'Time-Blocking ئەقلىي جەدۋەل', description: 'سائەتلىك ئاپتوماتىك تەقسىملەش', color: '#34d399' },
            { id: 'mm-node-2-2', label: 'RAG بىلىم ئامبىرى', description: 'ھۆججەت ئانالىزى ۋە ئاچقۇچلۇق نۇقتىلار', color: '#34d399' },
            { id: 'mm-node-2-3', label: 'AI Flashcards & Quiz', description: 'ئەستە تۇتۇش ۋە سىناق مەركىزى', color: '#34d399' },
          ],
        },
        {
          id: 'mm-node-3',
          label: '3. شەخسىي باشقۇرۇش (Productivity & Finance)',
          color: '#f59e0b',
          expanded: true,
          children: [
            { id: 'mm-node-3-1', label: 'Streak ئادەت تەھلىلى', description: 'كۈندىلىك نىشانلار ۋە زەنجىرلىك كۆرسەتكۈچ', color: '#fbbf24' },
            { id: 'mm-node-3-2', label: 'شەخسىي خامچوت & AI نەسىھەتچىسى', description: 'كىرىم-چىقىم گرافىكى ۋە ئانالىز', color: '#fbbf24' },
            { id: 'mm-node-3-3', label: 'Daily Standup دوكلاتى', description: 'كۈندىلىك خىزمەت نەتىجە خۇلاسىسى', color: '#fbbf24' },
          ],
        },
        {
          id: 'mm-node-4',
          label: '4. تېخنىكا كاپالىتى & بىخەتەرلىك',
          color: '#8b5cf6',
          expanded: true,
          children: [
            { id: 'mm-node-4-1', label: 'Full Data Sovereignty', description: 'JSON يەرلىك كۆچۈرۈش & ئەسلىگە كەلتۈرۈش', color: '#a78bfa' },
            { id: 'mm-node-4-2', label: 'كۆپ خىل كېچىلىك ھالەت', description: 'Light, Dark, Midnight, OLED, Sepia', color: '#a78bfa' },
          ],
        },
      ],
    },
  },
];

export const INITIAL_PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'pt-code-review',
    title: 'پىروگرامما كود تەكشۈرگۈچى (Code Reviewer)',
    category: 'coding',
    description: 'كودتىكى كاشىلىلار، بىخەتەرلىك يوشۇرۇن خەۋپلىرى ۋە ئۈنۈم يۇقىرى كۆتۈرۈش تەۋسىيەلىرىنى تەھلىل قىلىش',
    icon: 'Code',
    systemPrompt: 'You are a Principal Software Engineer. Review code thoroughly, identify bugs, security vulnerabilities, performance anti-patterns, and provide a refactored version with TypeScript best practices.',
    userPromptTemplate: 'Please review the following {{language}} code:\n\n```{{language}}\n{{code}}\n```\n\nRequirements:\n1. Spot critical bugs or edge-case failures\n2. Performance & memory optimizations\n3. Clean refactored solution with clear comments.',
    variables: [
      { name: 'language', label: 'پىروگرامما تىلى', placeholder: 'TypeScript, Python, Go, Rust...', defaultValue: 'TypeScript', type: 'text' },
      { name: 'code', label: 'تەھلىل قىلىنىدىغان كود پارچىسى', placeholder: 'كودنى بۇ يەرگە چاپلاڭ...', defaultValue: '', type: 'textarea' },
    ],
  },
  {
    id: 'pt-email-polish',
    title: 'كەسپىي خىزمەت ئېلخېتى (Business Email Polisher)',
    category: 'writing',
    description: 'قوپال ياكى ئاددىي ئېلخەت مەزمۇنىنى تەسىرلىك، سىلىق ۋە رەسمىي ئېلخەتكە ئايلاندۇرۇش',
    icon: 'Mail',
    systemPrompt: 'You are an executive communication coach. Rewrite the email to be clear, professional, respectful, and persuasive while maintaining the intended goal.',
    userPromptTemplate: 'Rewrite this draft email into a polished professional message:\n\nTone: {{tone}}\nRecipient: {{recipient}}\nDraft Content:\n"{{draft}}"\n\nProvide Subject line and finalized email body.',
    variables: [
      { name: 'tone', label: 'ئۇسلۇب (Tone)', placeholder: 'Formal, Friendly, Direct, Persuasive...', defaultValue: 'Professional & Courteous', type: 'text' },
      { name: 'recipient', label: 'تاپشۇرۇۋالغۇچى', placeholder: 'Manager, Client, Colleague, Investor...', defaultValue: 'Client Partner', type: 'text' },
      { name: 'draft', label: 'دەسلەپكى ئېلخەت لايىھىسى', placeholder: 'ئېلخەت مەزمۇنىنى كىرگۈزۈڭ...', defaultValue: '', type: 'textarea' },
    ],
  },
  {
    id: 'pt-academic-summary',
    title: 'ئىلمىي ماقالە قىسقىچە بايانى (Paper Abstract & Takeaways)',
    category: 'learning',
    description: 'مۇرەككەپ ئىلمىي ماقالە ياكى تەتقىقاتنى 3 قىسقا نۇقتا ۋە ئەمەلىي ئەھمىيىتىگە ئايرىپ چۈشەندۈرۈش',
    icon: 'BookOpen',
    systemPrompt: 'You are a research scientist. Extract the core hypothesis, methodology, key findings, and practical real-world impact of the paper.',
    userPromptTemplate: 'Summarize this research text into:\n1. Core problem being solved\n2. Key innovations/findings\n3. Practical applications\n\nText:\n{{paperText}}',
    variables: [
      { name: 'paperText', label: 'تەتقىقات ياكى ماقالە تېكىستى', placeholder: 'ماقالە تېكىستىنى بۇ يەرگە چاپلاڭ...', defaultValue: '', type: 'textarea' },
    ],
  },
  {
    id: 'pt-polyglot-translate',
    title: 'كۆپ تىللىق كەسپىي تەرجىمان (Polyglot Translator)',
    category: 'translation',
    description: 'ئۇيغۇرچە، تۈركچە، ئەرەبچە، ئىنگلىزچە ئوتتۇرىسىدا يۇقىرى سۈپەتلىك، مەدەنىيەتكە ماس تەرجىمە قىلىش',
    icon: 'Globe',
    systemPrompt: 'You are a master literary and technical translator proficient in Uyghur, Turkish, Arabic, and English. Ensure correct grammar, natural flow, and accurate terminology.',
    userPromptTemplate: 'Translate the following text accurately into {{targetLanguage}} with natural flow and cultural nuance:\n\nText:\n"{{sourceText}}"',
    variables: [
      { name: 'targetLanguage', label: 'نىشان تىل', placeholder: 'ئۇيغۇرچە, Türkçe, العربية, English...', defaultValue: 'ئۇيغۇرچە (Uyghur)', type: 'text' },
      { name: 'sourceText', label: 'تەرجىمە قىلىنىدىغان ئەسلى تېكىست', placeholder: 'تېكىستنى كىرگۈزۈڭ...', defaultValue: '', type: 'textarea' },
    ],
  },
];

export const INITIAL_STANDUP_RECORDS: DailyStandupRecord[] = [
  {
    id: 'standup-sample',
    date: '2026-08-26',
    mood: 'great',
    energyLevel: 5,
    accomplished: [
      'كۆپ ئىقتىدارلىق ئەقلىي ياردەمچى سىستېمىسىنىڭ ئاساسىي مۇلازىمەت ئامبىرى قۇرۇلدى',
      'ئاۋازلىق كىرگۈزۈش ۋە ئاۋاز چىقىرىش تېخنىكىسى مۇۋەپپەقىيەتلىك تۇتاشتۇرۇلدى',
      'ئەقلىي كېچىلىك كۆرۈنۈشلەر (OLED, Midnight, Sepia) مۇكەممەللەشتۈرۈلدى',
    ],
    blockers: ['ھېچقانداق توسالغۇ يوق، پىلان بويىچە تېز ئالغا بېسىلماقتا'],
    tomorrowGoals: [
      'Flashcards ۋە ئەستە تۇتۇش سىستېمىسىنى كېڭەيتىش',
      'پىكىر خەرىتىسى گېنېراتورىنىڭ گرافىكىلىق ئۇلىنىشىنى ئىنچىكىلەشتۈرۈش',
    ],
    reportMarkdown: `### 🌟 كۈندىلىك خىزمەت نەتىجە دوكلاتى
- **بۈگۈنكى قىممەت يارىتىش:** سىستېمىنىڭ بارلىق ئاساسىي مودۇللىرى تولۇق قۇرۇلدى.
- **ئېنېرگىيە & تەپەككۇر:** يۇقىرى قىزغىنلىق ۋە پۇختا ئۈنۈم باشتىن كەچۈرۈلدى.
- **نىشان:** پۈتۈن سىستېمىنى ئىشلەتكۈچى ئۈچۈن قولايلىق دەرىجىگە يەتكۈزۈش.`,
    motivationalQuote: 'بۈگۈن قىلىنغان سۈپەتلىك ئىش ئەتىكى چوڭ ئىشەنچنىڭ تۈۋرىكىدۇر.',
    createdAt: '2026-08-26T21:00:00.000Z',
  },
];

// Initial Voice Memos
export const INITIAL_VOICE_MEMOS: VoiceMemo[] = [
  {
    id: 'memo-1',
    title: 'تۈر لايىھىسى & ئىقتىدارلارنى بىر گەۋدىلەشتۈرۈش',
    transcript: 'بۈگۈن پۈتۈن كۆپ ئىقتىدارلىق سىستېمىنىڭ بارلىق يادرولۇق بۆلەكلىرىنى تولۇق ئاچتۇق. كېيىنكى قەدەمدە ئاۋازلىق كىرگۈزۈش، OKR نىشان ۋە ھۆججەت چىقىرىش مودۇلىنى تۇتاشتۇرىمىز.',
    durationSec: 24,
    createdAt: '2026-08-26T14:30:00.000Z',
    summary: 'كۆپ ئىقتىدارلىق سىستېمىنىڭ بارلىق بۆلەكلىرى مۇۋەپپەقىيەتلىك بىر گەۋدىلەشتۈرۈلدى ھەم كېيىنكى قەدەم پىلانلاندى.',
    actionItems: [
      'ئاۋازلىق سىستېما بىلەن ۋەزىپىلەرنى بىر كۇنۇپكا بىلەن ماسلاشتۇرۇش',
      'PDF ۋە Markdown ھۆججەت چىقىرىشنى سىناش'
    ],
    tags: ['Architecture', 'VoiceAI', 'Productivity'],
    category: 'idea',
  },
  {
    id: 'memo-2',
    title: 'كۈندىلىك پومودورو ۋە زېھىن ئادەتلىرى',
    transcript: 'ئەتىگەن سائەت توققۇزدىن ئون بىرگىچە ئەڭ ئېغىر، زېھىن كېرەك قىلىدىغان كودلارنى بىر تەرەپ قىلىش ئۈنۈمنى ئەڭ يۇقىرى چەككە يەتكۈزىدۇ.',
    durationSec: 18,
    createdAt: '2026-08-26T09:15:00.000Z',
    summary: 'چوڭقۇر زېھىن خىزمەت بۆلىكى (Deep Work Block) نى ئەتىگەنلىك سائەتلەرگە ئورۇنلاشتۇرۇش مەسلىھەت بېرىلدى.',
    actionItems: [
      'ئەتىگەنلىك زېھىن ۋاقتىنى كالېندارغا قۇلۇپلاپ قويۇش'
    ],
    tags: ['Focus', 'TimeBlocking'],
    category: 'personal',
  }
];

// Initial OKR Goals
export const INITIAL_OKR_GOALS: OKRGoal[] = [
  {
    id: 'okr-1',
    title: 'كۆپ ئىقتىدارلىق ئەقلىي ياردەمچى ئەپنى بازارغا سېلىش',
    objective: 'پۈتۈنلەي مۇستەقىل، دۇنياۋى سەۋىيەدىكى كۆپ ئىقتىدارلىق ياردەمچى سۇپىسىنى پۈتتۈرۈش ۋە 1,000 ئاكتىپ ئىشلەتكۈچىگە يەتكۈزۈش',
    quarter: '2026 Q3-Q4',
    category: 'project',
    status: 'on-track',
    dueDate: '2026-10-31',
    aiStrategicAdvice: 'ئالدى بىلەن يەرلىك سانلىق مەلۇمات مۇستەقىللىقى ۋە كۆپ تىللىق يېقىشلىق ئىشلىتىش تەجرىبىسىنى ئىنتايىن راۋان قىلىڭ. كېيىنكى قەدەمدە PWA ئارقىلىق يانفونلارغا بىر چېكىش بىلەن ئورنىتىلىشىنى كۈچەيتىڭ.',
    createdAt: '2026-08-26',
    keyResults: [
      {
        id: 'kr-1',
        title: '6 تۈۋرۈك ۋە 10 دىن ئارتۇق ئەقلىي بۆلەكنى تولۇق ئېچىش',
        currentValue: 10,
        targetValue: 10,
        unit: 'مودۇل',
        progressPercentage: 100,
        milestones: [
          { id: 'm-1', title: 'Gemini 3.7 Flash بىلەن مۇلازىمېتىر ئۇلىنىش', completed: true },
          { id: 'm-2', title: 'بىلىم ئامبىرى ۋە كود تەھرىرلىگۈچ', completed: true },
          { id: 'm-3', title: 'ئاۋازلىق خاتىرە ۋە ئانالىز مەركىزى', completed: true }
        ]
      },
      {
        id: 'kr-2',
        title: 'ئىشلەتكۈچىنىڭ كۈندىلىك ۋەزىپە تاماملاش سۈرئىتىنى ئاشۇرۇش',
        currentValue: 85,
        targetValue: 100,
        unit: '%',
        progressPercentage: 85,
        milestones: [
          { id: 'm-4', title: 'ئەتىگەنلىك كۈن تەرتىپى بىلەن بىر چېكىشتە ۋەزىپىگە كىرىش', completed: true },
          { id: 'm-5', title: 'كەچلىك Standup ئارقىلىق خۇلاسىلەش', completed: true }
        ]
      }
    ]
  },
  {
    id: 'okr-2',
    title: 'تېخنىكا سەۋىيەسى ۋە تەتقىقاتنى يۇقىرى پەللىگە كۆتۈرۈش',
    objective: 'زامانىۋى سۈنئىي ئىدراك ۋە سىستېما قۇرۇلمىسى بويىچە 20 دىن ئارتۇق تەتقىقات خاتىرىسىنى ئېلان قىلىش',
    quarter: '2026 Q3',
    category: 'learning',
    status: 'on-track',
    dueDate: '2026-09-30',
    aiStrategicAdvice: 'ھەر بىر ئۆگەنگەن چوڭ تېمىنى Flashcards ۋە Mind Map شەكلىگە ئايلاندۇرۇپ تەكرارلاپ تۇرۇڭ.',
    createdAt: '2026-08-25',
    keyResults: [
      {
        id: 'kr-3',
        title: 'بىلىم ئامبىرىغا چوڭقۇر تېخنىكىلىق ماقالىلەرنى قوشۇش',
        currentValue: 14,
        targetValue: 20,
        unit: 'پارچە',
        progressPercentage: 70,
        milestones: [
          { id: 'm-6', title: 'React 19 Concurrent تېخنىكىسى', completed: true },
          { id: 'm-7', title: 'LLM Agent Architecture & Workflows', completed: true }
        ]
      }
    ]
  }
];

// Initial Web Articles
export const INITIAL_WEB_ARTICLES: WebArticleSummary[] = [
  {
    id: 'art-1',
    url: 'https://deepmind.google/technologies/gemini/',
    originalTitle: 'Gemini: Frontier Multimodal AI Intelligence',
    authors: 'Google DeepMind',
    readingTimeMin: 6,
    tldr: 'Gemini 3.7 تەبىئىي كۆپ تىللىق تەپەككۇر، كود يېزىش، ئاۋاز بىر تەرەپ قىلىش ۋە سۈرئەت جەھەتتە يېڭى سەۋىيە ياراتتى.',
    keyTakeaways: [
      'تېكىست، كود، ئاۋاز ۋە سۈرەتلەرنى يۇقىرى سۈرئەتتە بىرلەشتۈرۈپ تەپەككۇر قىلىدۇ',
      'Context Caching ئارقىلىق سىستېما كېچىكىشىنى 80% ئازايتىدۇ',
      'شەخسىي ياردەمچى ئەپلەرگە جانلىق مۇلازىمېتىر ئۇلىنىش ئىمكانىيىتى بېرىدۇ'
    ],
    inDepthSummary: `### 🚀 Gemini ئارخىپى ۋە يادرولۇق كۈچى
- **كۆپ مەنبەلىك چۈشىنىش:** ئاۋاز، تېكىست، سۈرەتنى ئوخشاش بىر تەپەككۇر تۈۋرۈكىدە بىر تەرەپ قىلىدۇ.
- **ئۇيغۇرچە ۋە دۇنيا تىللىرىغا تولۇق ماسلىشىش:** شەرقىي ۋە غەربىي ئەدەبىيات، تېخنىكا تىلىنى تەبىئىي بايان قىلىدۇ.`,
    actionItems: [
      'مۇلازىمېتىردا ئەقلىي ياردەمچىگە تېز قوراللار بىلەن تۇتاشتۇرۇش'
    ],
    translations: {
      ug: 'Gemini نىڭ زامانىۋى كۆپ قاتلاملىق ئەقلىي ئىقتىدارلىرى.',
      en: 'Frontier multimodal capabilities of the Gemini model ecosystem.',
      tr: 'Gemini çok modlu yapay zeka ekosisteminin teknik yetenekleri.',
      ar: 'قدرات نموذج Gemini المتقدمة في معالجة الوسائط المتعددة.'
    },
    tags: ['AI', 'Gemini', 'Research', 'Multimodal'],
    analyzedAt: '2026-08-26'
  }
];

// Initial Morning Briefing
export const INITIAL_MORNING_BRIEFING: MorningBriefing = {
  date: '2026-08-27',
  greeting: 'خەيرلىك ئەتىگەن! بۈگۈن نىشانلىرىڭىزنى مۇكەممەل ئىشقا ئاشۇرىدىغان ئاجايىپ كۈن.',
  weatherOrVibe: '⚡ تۇزەلمەس قىزغىنلىق & يۈكسەك زېھىن',
  dailyWisdomQuote: 'ئەڭ ياخشى كەلگۈسى — بۈگۈن قىلىنغان بوشاشماس ئەقىل ۋە ئىنتىزام بىلەن بەرپا قىلىنىدۇ.',
  quoteAuthor: 'دانىشمەنلىك',
  top3Priorities: [
    {
      id: 'p-1',
      title: 'ئاۋازلىق خاتىرە ۋە ئانالىز مەركىزىنى تولۇق باھالاش',
      urgency: 'high',
      whyImportant: 'بۈگۈنكى ئەڭ قىممەت يارىتىدىغان يېڭى ئىقتىدار سىستېمىسى',
      done: false
    },
    {
      id: 'p-2',
      title: '25 مىنۇتلۇق پومودورو چوڭقۇر زېھىن بۆلىكىنى تاماملاش',
      urgency: 'medium',
      whyImportant: 'كۈندىلىك پىلان ۋە ئادەت ئىنتىزامىنى قوغداش',
      done: false
    },
    {
      id: 'p-3',
      title: 'بىلىم ئامبىرى ۋە OKR نىشانلىرىنى كۆزدىن كەچۈرۈش',
      urgency: 'medium',
      whyImportant: 'ئۇزۇن مەزگىللىك چوڭ نىشانلار بويىچە ئالغا ئىلگىرىلەش',
      done: false
    }
  ],
  calendarSummary: 'بۈگۈن سائەت 09:00 دىن 16:00 غىچە 3 چوڭ ۋاقىت بۆلىكى پىلانلاندى.',
  aiEnergyRecommendation: 'چۈشتىن بۇرۇنقى ئەڭ سۈزۈك پەيتنى يۇقىرى قىممەت يارىتىدىغان پىروگراممىلاش ۋە لايىھەگە ئاجرىتىڭ، چۈشتىن كېيىن ئۆگىنىش ۋە ئالاقىگە مايىل بولۇڭ.',
  generatedAt: '2026-08-27T08:00:00.000Z'
};

