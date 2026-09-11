import { BlueprintPillar, RoadmapPhase, AssistantPersona, QuickTool } from '../types';

export const BLUEPRINT_PILLARS: BlueprintPillar[] = [
  {
    id: 'frontend-ui',
    num: '01',
    titleUg: 'UI/UX يۈزى ۋە كۆپ سۇپا كۆرۈنمىسى',
    titleEn: 'Frontend & Cross-Device UI Architecture',
    icon: 'Layout',
    badgeUg: 'ئىشلەتكۈچى تەجرىبىسى',
    badgeEn: 'User Experience',
    summaryUg: 'ئۇيغۇرچە (RTL) ۋە ئىنگلىزچە (LTR) تەبىئىي كۆرۈنۈشىگە ماس كېلىدىغان، زامانىۋى، كۆپ كۆزنەكلىك ۋە تېز ئىنكاس قايتۇرىدىغان كۆرۈنمە يۈز سىستېمىسى.',
    summaryEn: 'A high-performance, fluid UI system supporting bi-directional typography (RTL/LTR), dark/light modes, and responsive layouts across desktop, tablet, and mobile.',
    coreFeaturesUg: [
      'تولۇق ئۇيغۇرچە ۋە ئىنگلىزچە بىر تۇتاش قوش يۆنىلىشلىك يۈز (Bi-directional RTL/LTR)',
      'زامانىۋى كۆپ كۆزنەكلىك مەشغۇلات رايونى (Modular Dashboard & Bento Grid)',
      'سۈنئىي ئىدراك سۆھبەت رايونى، Markdown بېزەش ۋە كود يورۇتۇش',
      'تېز بۇيرۇق تاختىسى (Command Palette: Ctrl+K / Cmd+K) تېز زىيارەت قىلىش',
      'كۆچمە ئۈسكۈنىلەرگە تولۇق ماسلاشقان يان تاختا ۋە بارماق بېسىش تەجرىبىسى'
    ],
    coreFeaturesEn: [
      'Seamless Uyghur (RTL) & English (LTR) bidirectional layout switching',
      'Modular dashboard workspace with responsive grid card layouts',
      'Interactive AI chat interface with rich Markdown, code highlights & copy actions',
      'Quick Command Palette (Ctrl+K) for instant navigation and action triggering',
      'Mobile-first touch-friendly ergonomics with collapsible sidebars'
    ],
    techChoices: [
      { category: 'Framework', tech: 'React 19 + TypeScript', purposeUg: 'يۇقىرى ئۈنۈملۈك تىپ بىخەتەرلىكى ۋە زاپچاسلارنى قايتا ئىشلىتىش', purposeEn: 'Type-safe, component-driven UI architecture' },
      { category: 'Styling', tech: 'Tailwind CSS v4', purposeUg: 'تېز، جانلىق ۋە زامانىۋى لايىھە كودلىرى', purposeEn: 'Utility-first modern responsive styling' },
      { category: 'Animations', tech: 'Motion (Framer)', purposeUg: 'راۋان كۆرۈنۈش ئالمىشىش ۋە سەكرەش ئۈنۈملىرى', purposeEn: 'Fluid physics-based transition animations' },
      { category: 'Icons', tech: 'Lucide React', purposeUg: 'مۇكەممەل زامانىۋى سىنبەلگە ئامبىرى', purposeEn: 'Crisp, unified minimalist icon set' }
    ],
    architecturePointsUg: [
      'React Context ۋە Custom Hooks ئارقىلىق يەرلىك ھالەتنى مەركەزلىك باشقۇرۇش',
      'Dynamic Font Stack (UKIJ Tuz, Alpida, Segoe UI) بىلەن سۈزۈك ئۇيغۇرچە خەت نۇسخىسى',
      'PWA (Progressive Web App) ئىقتىدارى قوشۇلۇپ يانفوندا ئەپ سۈپىتىدە ئىشلىتىلىش ئىمكانىيىتى'
    ],
    architecturePointsEn: [
      'Centralized state management with lightweight React hooks and local stores',
      'Tailored typographic stack for crisp Arabic/Uyghur script rendering',
      'Progressive Web App (PWA) readiness for native mobile standalone feel'
    ]
  },
  {
    id: 'ai-engine',
    num: '02',
    titleUg: 'سۈنئىي ئىدراك يادروسى (AI Intelligence Engine)',
    titleEn: 'AI Intelligence & LLM Orchestration',
    icon: 'Bot',
    badgeUg: 'ئەقلىي يادرو',
    badgeEn: 'Core Intelligence',
    summaryUg: 'مۇلازىمېتىر تەرەپتىكى Gemini 3.7 Flash مودېلى ئارقىلىق، كۆپ خىل كەسپىي ئەقلىي ياردەمچى، ھۆججەت تەھلىلى، كود يېزىش ۋە تۈر لايىھىلەش مېخانىزمى.',
    summaryEn: 'Server-side LLM pipeline powered by Gemini 3.7 Flash, providing multi-persona intelligence, code generation, real-time translations, and automated task planning.',
    coreFeaturesUg: [
      'كۆپ خىل خاس ياردەمچى خاراكتېرلىرى (لايىھىلىگۈچى، يازغۇچى، كود ئۇستىسى، ئۈنۈم ياردەمچىسى)',
      'سۈنئىي ئىدراك ئارقىلىق نىشاننى كۆپ كىچىك قەدەملەرگە ئايرىش (Task Decomposition)',
      'ئۇيغۇرچە، ئىنگلىزچە ۋە خەنزۇچە ئارىسىدا يۇقىرى سۈپەتلىك تەرجىمە ۋە تېكىست تاۋلاش',
      'مۇرەككەپ تېخنىكىلىق سوئاللار ۋە كود خاتالىقلىرىنى تېز تەھلىل قىلىپ جاۋاب بېرىش',
      'تەپەككۇر جەريانىنى بىخەتەر قوغداش ۋە ئاچقۇچ (API Key) نى پەقەت مۇلازىمېتىردا ساقلاش'
    ],
    coreFeaturesEn: [
      'Specialized Assistant Personas (Architect, Tech Lead, Writer, Productivity Coach)',
      'Automated Goal & Task decomposition into actionable milestones',
      'Deep multilingual translation & text polishing (Uyghur, English, Chinese)',
      'Full-stack code generation, refactoring, and debugging assistance',
      'Server-side API key proxy isolation ensuring complete security'
    ],
    techChoices: [
      { category: 'AI Model', tech: 'Gemini 3.7 Flash', purposeUg: 'تېز تېپىش ۋە كۈچلۈك ئەقلىي تەپەككۇر ئىقتىدارى', purposeEn: 'Ultra-fast multimodal reasoning and tool usage' },
      { category: 'Backend SDK', tech: '@google/genai (Node.js)', purposeUg: 'ئەڭ يېڭى رەسمىي سۈنئىي ئىدراك كېڭەيتىلمىسى', purposeEn: 'Official next-gen Google GenAI TypeScript SDK' },
      { category: 'Server API', tech: 'Express / REST Endpoints', purposeUg: 'يۈك باشقۇرۇش ۋە بىخەتەر تەلەپلەرنى بىر تەرەپ قىلىش', purposeEn: 'Modular API routing with structured error handling' }
    ],
    architecturePointsUg: [
      'ھەر بىر سوئال-جاۋابقا كىرىدىغان System Prompt ئارقىلىق راۋان ئۇيغۇر تىلى مەدەنىيەت ئارقا كۆرۈنۈشىنى ساقلاش',
      'سۆھبەت تارىخىنى قىسقارتىپ ۋە رەتلەپ مودېلغا ئەۋەتىش ئارقىلىق ئۈنۈمنى ئاشۇرۇش',
      'كەلگۈسىدە Function Calling (قورال ئىشلىتىش) ۋە ھۆججەت ئوقۇتۇش (RAG) قوشۇشقا ماسلىشىش'
    ],
    architecturePointsEn: [
      'Dynamic persona-driven system prompting with authentic Uyghur linguistics',
      'Context token window optimization for low latency and high relevance',
      'Ready for Tool Calling, Web Grounding, and Retrieval-Augmented Generation (RAG)'
    ]
  },
  {
    id: 'productivity-suite',
    num: '03',
    titleUg: 'شەخسىي ئۈنۈم ۋە باشقۇرۇش قوراللىرى',
    titleEn: 'Personal Productivity & Utility Suite',
    icon: 'CheckSquare',
    badgeUg: 'ئۈنۈم مەركىزى',
    badgeEn: 'Productivity Hub',
    summaryUg: 'شەخسىي ۋەزىپىلەرنى تەشكىللەش، نىشانلارنى جەدۋەللەشتۈرۈش، ئەقلىي خاتىرە قالدۇرۇش ۋە زېھىن مەركەزلەشتۈرۈش قوراللىرى بىر يەردە.',
    summaryEn: 'Integrated workflow engine with task kanban/checklists, Markdown knowledge base, Pomodoro timer, and soundscape generator for deep work.',
    coreFeaturesUg: [
      'ۋەزىپىلەرنى تۈر، دەرىجە ۋە نىشان بويىچە ئايرىپ باشقۇرۇش (Task Priority Manager)',
      'سۈنئىي ئىدراك ئارقىلىق چوڭ نىشاننى 5 مىنۇتتا قەدەممۇ-قەدەم ۋەزىپە قىلىپ چىقىرىش',
      'ھۆججەت ۋە پىكىرلەرنى سۈزۈك ساقلايدىغان ئەقلىي خاتىرە (Markdown Knowledge Base)',
      'پومودورو (Pomodoro 25/5) زېھىن مەركەزلەشتۈرۈش سائىتى ۋە تەبىئەت ئاۋازلىرى (Web Audio Synth)',
      'بىر كۈنلۈك پىلان ۋە ئېرىشكەن نەتىجىلەرنى تېز ئومۇملاشتۇرۇش'
    ],
    coreFeaturesEn: [
      'Flexible task priority management with categorized tagging and status tracking',
      'One-click AI breakdown converting high-level goals into step-by-step to-dos',
      'Markdown smart notepad with search, tagging, and AI summarization',
      'Built-in Pomodoro focus timer with relaxing ambient soundscapes (Synthesized Audio)',
      'Daily planner review and automated achievement recap'
    ],
    techChoices: [
      { category: 'Audio Synthesis', tech: 'Web Audio API (Synthesizer)', purposeUg: 'سىرتقى ئاۋاز ھۆججىتى تەلەپ قىلماي يەرلىكتە پىچىرلاپ چىقىرىدىغان تەبىئەت ئاۋازلىرى', purposeEn: 'Zero-latency synthesized white noise & ambient audio' },
      { category: 'Markdown Engine', tech: 'react-markdown', purposeUg: 'چىرايلىق تېكىست، تىزىملىك ۋە كود تۈزۈلۈشى', purposeEn: 'Standard semantic Markdown rendering' },
      { category: 'Storage', tech: 'LocalStorage + Cloud Sync Ready', purposeUg: 'تور ئۈزۈلۈپ قالسىمۇ ئىشلەتكۈچىنىڭ سانلىق مەلۇماتىنى يوقاتماي ساقلاش', purposeEn: 'Offline-first robust persistence model' }
    ],
    architecturePointsUg: [
      'Offline-First (تورسىزمۇ ئىشلەش) لايىھىسى — سانلىق مەلۇماتلار ئۈسكۈنىدە دەرھال ساقلىنىدۇ',
      'JSON ھالىتىدە بارلىق خاتىرە ۋە ۋەزىپىلەرنى چىقىرىۋېلىش (Export) ياكى قايتا ئەكىرىش (Import) ئىمكانىيىتى'
    ],
    architecturePointsEn: [
      'Offline-first client persistence guaranteeing data integrity even with flaky connections',
      'Full JSON data backup export & import capability for user autonomy'
    ]
  },
  {
    id: 'backend-architecture',
    num: '04',
    titleUg: 'مۇلازىمېتىر ۋە مۇلازىمەت قۇرۇلمىسى (Backend Engine)',
    titleEn: 'Backend API & Microservices Architecture',
    icon: 'Server',
    badgeUg: 'مۇلازىمېتىر قۇرۇلمىسى',
    badgeEn: 'Backend Core',
    summaryUg: 'Express + Node.js بىلەن قۇرۇلغان، تېز سۈرئەتلىك، مۇقىم ھەم بىخەتەر REST API مۇلازىمېتىرى.',
    summaryEn: 'A high-performance Express server providing secured API routing, rate limiting, request validation, and clean abstraction over external services.',
    coreFeaturesUg: [
      'بىخەتەر API ئېغىزلىرى (/api/chat, /api/generate-plan, /api/ai-tool)',
      'سۈنئىي ئىدراك ئاچقۇچى ۋە شەخسىي تەڭشەكلەرنىڭ مۇلازىمېتىردا مەخپىي قوغدىلىشى',
      'Vite مەشغۇلات مۇھىتى بىلەن بىرلىشىپ بىر پورت (Port 3000) ئارقىلىق تولۇق خىزمەت قىلىش',
      'خاتالىقلارنى چۈشىنىشلىك تۇتۇش ۋە خېرىدار تەرەپكە پايدىلىق ئۇچۇر قايتۇرۇش',
      'كەلگۈسىدە كۆپ ئىشلەتكۈچى (Multi-user) ھېساباتى ۋە Cloud DB غا ئۇلاشقا تولۇق تەييار'
    ],
    coreFeaturesEn: [
      'Secure modular API endpoints (/api/chat, /api/generate-plan, /api/ai-tool)',
      'Zero-leakage secret isolation shielding Gemini keys completely from browsers',
      'Seamless single-port Vite middleware integration on port 3000',
      'Structured error recovery with graceful degradation fallbacks',
      'Extensible foundation ready for user auth (Firebase/OAuth) and Cloud SQL'
    ],
    techChoices: [
      { category: 'Runtime', tech: 'Node.js 22 + tsx', purposeUg: 'تېز تەرەققىيات ۋە ئىجرا مۇھىتى', purposeEn: 'Modern native TypeScript runtime' },
      { category: 'Web Framework', tech: 'Express 4.21', purposeUg: 'يېنىك ۋە دۇنياۋى مۇقىم API قۇرۇلمىسى', purposeEn: 'Lightweight, battle-tested REST server' },
      { category: 'Bundler', tech: 'esbuild (for dist/server.cjs)', purposeUg: 'مەھسۇلات ئىشلەپچىقىرىشتا بىر ھۆججەت قىلىپ ئىخچاملاش', purposeEn: 'Single-file production bundle with source maps' }
    ],
    architecturePointsUg: [
      'CORS ۋە مۇداپىئە بىخەتەرلىكى',
      'Cloud Run ياكى ھەرقانداق Docker كونتېينېرىدا بىۋاسىتە ئىجرا بولۇش ماسلىشىشچانلىقى'
    ],
    architecturePointsEn: [
      'Production-ready containerized deployment compatibility (Cloud Run / Docker)',
      'Strict input sanitization and unified response formatting'
    ]
  },
  {
    id: 'data-security',
    num: '05',
    titleUg: 'سانلىق مەلۇمات، مەخپىيەتلىك ۋە بىخەتەرلىك',
    titleEn: 'Data Persistence, Privacy & Security',
    icon: 'ShieldCheck',
    badgeUg: 'مەخپىيەتلىك',
    badgeEn: 'Privacy & Security',
    summaryUg: 'ئىشلەتكۈچىنىڭ مەخپىيەتلىكىنى ئەڭ ئالدىنقى ئورۇنغا قويغان، بىخەتەر، كۆپ قەۋەتلىك سانلىق مەلۇمات ساقلاش چارىسى.',
    summaryEn: 'Zero-trust architectural design keeping personal data, conversation histories, and notes protected with local client sovereignty and encrypted cloud bridges.',
    coreFeaturesUg: [
      'شەخسىي سانلىق مەلۇمات ئىگىدارچىلىقى: خاتىرە ۋە سۆھبەتلەر ئۈسكۈنىدە بىخەتەر ساقلىنىدۇ',
      'سۈنئىي ئىدراكقا ئەۋەتىلىدىغان مەزمۇنلاردا شەخسىي ئاچقۇچ ۋە قىممەتلەر سۈزۈلىدۇ',
      'بىر كۇنۇپكا بىلەن بارلىق سانلىق مەلۇماتلارنى تازىلاش ياكى بىخەتەر كۆچۈرۈش ئىقتىدارى',
      'HTTPS ۋە مەخپىيلەشتۈرۈلگەن سىفىرلىق ئالاقە يوللىرىنى ئىشلىتىش'
    ],
    coreFeaturesEn: [
      'Data sovereignty: notes and task records stored locally under user control',
      'Zero-leakage architecture: sensitive credentials never transmitted client-side',
      'One-click privacy reset & encrypted JSON export functionality',
      'HTTPS-only TLS 1.3 encrypted data transit'
    ],
    techChoices: [
      { category: 'Client DB', tech: 'IndexedDB / LocalStorage', purposeUg: 'يەرلىك، تېز سۈرئەتلىك سانلىق مەلۇمات ئەستە تۇتۇش', purposeEn: 'Local instant-access indexed persistence' },
      { category: 'Cloud DB Ready', tech: 'Firestore / Cloud SQL', purposeUg: 'كۆپ ئۈسكۈنىدە سىغدۇرۇش تەلەپ قىلىنغاندا ئۇلاش', purposeEn: 'Cloud database bridge for cross-device sync' }
    ],
    architecturePointsUg: [
      'ئىشلەتكۈچىنىڭ رۇخسىتىسىز ھېچقانداق تېكىست ياكى پىكىر سىرتقا ئاشكارىلانمايدۇ'
    ],
    architecturePointsEn: [
      'Client-first data privacy model respecting user boundaries at all times'
    ]
  },
  {
    id: 'dev-roadmap',
    num: '06',
    titleUg: 'كېڭەيتىش ۋە تەرەققىيات پىلانى (Scalability)',
    titleEn: 'Deployment, PWA & Scaling Roadmap',
    icon: 'Rocket',
    badgeUg: 'كېڭىيىش كۆلىمى',
    badgeEn: 'Scale & Launch',
    summaryUg: 'تۈرنى بىر ئادەملىك ياردەمچى ئەپتىن، كۆپ كىشىلىك تور بېكەت ۋە كۆچمە ئەپكە ئايلاندۇرۇشنىڭ كېڭەيتىش پەلەمپىيى.',
    summaryEn: 'Strategic roadmap to evolve this personal assistant workspace into a full-scale web portal, downloadable PWA, and cross-platform native ecosystem.',
    coreFeaturesUg: [
      'Cloud Run ئارقىلىق 24/7 مۇقىم، يۇقىرى سۈرئەتلىك دۇنياۋى تارقىتىش',
      'PWA ئارقىلىق يانفون، تاختا ۋە كومپيۇتېرغا قاچىلىغىلى بولىدىغان قىلىش (Add to Home Screen)',
      'كېيىنكى قەدەمدە ئاۋازلىق پىچىرلاپ پاراڭلىشىش (Voice AI Assistant) قوشۇش پىلانى',
      'باشقا مۇلازىمەتلەر بىلەن (Google Calendar, GitHub, Notion) API ئارقىلىق ئۇلىنىش ئېغىزى'
    ],
    coreFeaturesEn: [
      'Cloud Run serverless zero-downtime automated deployment',
      'Progressive Web App installation capabilities for iOS, Android, and Desktop',
      'Future-ready Voice Interaction bridge (Gemini Live API integration path)',
      'Third-party connector hooks for Google Calendar, GitHub, and Cloud tools'
    ],
    techChoices: [
      { category: 'Hosting', tech: 'Google Cloud Run', purposeUg: 'ئاپتوماتىك كېڭىيىدىغان ۋە دۇنياۋى يۇقىرى سۈرئەتلىك مۇلازىمەت', purposeEn: 'Serverless auto-scaling container infrastructure' },
      { category: 'Mobile Tech', tech: 'PWA / Capacitor / React Native', purposeUg: 'يۈز كودىنى بىۋاسىتە يانفون ئەپ قىلىپ ئوراش', purposeEn: 'Universal web-to-mobile packaging pathway' }
    ],
    architecturePointsUg: [
      'بىرلا كود توپلىمى (Single Codebase) ئارقىلىق تور بېكەت، يانفون ۋە خىزمەت تاختىسىنى تولۇق قاپلاش'
    ],
    architecturePointsEn: [
      'Unified codebase servicing Web, Mobile PWA, and Desktop browsers seamlessly'
    ]
  }
];

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: 'phase-1',
    phaseNumber: 1,
    titleUg: '1-باسقۇچ: يادرولۇق سىناق نۇسخىسى (MVP)',
    titleEn: 'Phase 1: Foundation & Core MVP',
    durationUg: '1 - 2 ھەپتە',
    durationEn: '1 - 2 Weeks',
    badgeUg: 'ئاساس سېلىش',
    badgeEn: 'Foundation',
    descriptionUg: 'ئاساسىي كۆرۈنمە يۈز، يادرولۇق سۈنئىي ئىدراك سۆھبىتى ۋە يەرلىك ۋەزىپە/خاتىرە سىستېمىسىنى قۇرۇپ چىقىش.',
    descriptionEn: 'Establish the core bi-directional UI layout, server-side Gemini integration, and offline-first task & note persistence.',
    tasks: [
      { id: 't1-1', titleUg: 'React 19 + TypeScript + Tailwind v4 يۈز تۈزۈلمىسىنى تەڭشەش', titleEn: 'Initialize React 19 + TypeScript + Tailwind layout structure', done: true },
      { id: 't1-2', titleUg: 'Express API مۇلازىمېتىرى ۋە Gemini 3.7 Flash ئەقلىي يادروسىنى ئۇلاش', titleEn: 'Set up Express server & Gemini 3.7 Flash API bridge', done: true },
      { id: 't1-3', titleUg: 'ئۇيغۇرچە (RTL) ۋە ئىنگلىزچە (LTR) تەبىئىي ئالمىشىشنى يولغا قويۇش', titleEn: 'Implement bi-directional Uyghur (RTL) and English (LTR) switcher', done: true },
      { id: 't1-4', titleUg: 'كۆپ خىل خاس ياردەمچى تىپلىرى (Personas) ۋە چىرايلىق سۆھبەت يۈزى', titleEn: 'Build specialized AI personas & rich Markdown chat UI', done: true },
      { id: 't1-5', titleUg: 'ۋەزىپە ۋە ئەقلىي خاتىرە بۆلىكىنى قۇرۇش', titleEn: 'Create task checklist and smart notes system', done: true }
    ]
  },
  {
    id: 'phase-2',
    phaseNumber: 2,
    titleUg: '2-باسقۇچ: كۆپ ئىقتىدارلىق قوراللار ۋە كېڭەيتىلمىلەر',
    titleEn: 'Phase 2: Multi-tool Expansion & Workflow Automation',
    durationUg: '2 - 3 ھەپتە',
    durationEn: '2 - 3 Weeks',
    badgeUg: 'ئىقتىدار بېيىتىش',
    badgeEn: 'Enhancement',
    descriptionUg: 'تېز تەرجىمە، ۋەزىپىنى ئەقلىي بۆلۈش، پومودورو زېھىن مەركەزلەشتۈرۈش سائىتى ۋە تەبىئەت ئاۋازلىرىنى پۈتۈنلەي تاماملاش.',
    descriptionEn: 'Integrate productivity accelerators: one-click task decomposition, instant translation tools, Pomodoro focus mode, and soundscapes.',
    tasks: [
      { id: 't2-1', titleUg: 'سۈنئىي ئىدراك ئارقىلىق نىشاننى ئاپتوماتىك ۋەزىپىگە پارچىلاش قورالى', titleEn: 'AI Goal & Task auto-decomposition tool', done: true },
      { id: 't2-2', titleUg: 'ئۇيغۇرچە-ئىنگلىزچە-خەنزۇچە تېز تەرجىمە ۋە تېكىست تاۋلاش بۆلىكى', titleEn: 'Multilingual fast translation & text polishing utility', done: true },
      { id: 't2-3', titleUg: 'پومودورو سائىتى ۋە Web Audio ئارقىلىق تەبىئەت ئاۋازلىرى ياراتقۇچى', titleEn: 'Pomodoro timer with Web Audio ambient sound synthesizer', done: true },
      { id: 't2-4', titleUg: 'ئۆزگىچە تۈرلەر ئۈچۈن ئاپتوماتىك پىلان يازغۇچى (Blueprint Generator)', titleEn: 'Dynamic AI Project Blueprint generator for custom user ideas', done: true },
      { id: 't2-5', titleUg: 'سانلىق مەلۇماتلارنى JSON شەكلىدە بىخەتەر ئېكسپورت ۋە ئىمپورت قىلىش', titleEn: 'Secure JSON backup export and import functionality', done: true }
    ]
  },
  {
    id: 'phase-3',
    phaseNumber: 3,
    titleUg: '3-باسقۇچ: كۆچمە ماسلىشىش، PWA ۋە بۇلۇت ساقلاش',
    titleEn: 'Phase 3: PWA, Mobile Packaging & Cloud Sync',
    durationUg: '3 - 4 ھەپتە',
    durationEn: '3 - 4 Weeks',
    badgeUg: 'كۆچمە ئەپ',
    badgeEn: 'Mobile & Cloud',
    descriptionUg: 'تەجرىبىنى يانفوندا بىۋاسىتە ئەپ سۈپىتىدە ئىشلىتىش، سۈرئەتنى تېخىمۇ يۇقىرى پەللىگە كۆتۈرۈش.',
    descriptionEn: 'PWA manifest & service workers for installable mobile experience, offline asset caching, and optional cloud database sync.',
    tasks: [
      { id: 't3-1', titleUg: 'PWA Manifest ۋە Service Worker ئارقىلىق تېلېفونغا ئەپ قىلىپ قاچىلاش', titleEn: 'PWA manifest & service worker for home screen installation', done: false },
      { id: 't3-2', titleUg: 'ھۆججەت ۋە رەسىملەرنى چۈشىنىش (Multimodal Vision / PDF Reading)', titleEn: 'Multimodal vision and document OCR analysis integration', done: false },
      { id: 't3-3', titleUg: 'ئىختىيارىي Firestore / Cloud SQL سانلىق مەلۇمات سىغدۇرۇشىنى ئۇلاش', titleEn: 'Optional Firestore / Cloud SQL multi-device real-time sync', done: false },
      { id: 't3-4', titleUg: 'ئىشلەتكۈچى تەڭشىكى ۋە خاس كۆرۈنۈش ئۇسلۇبلىرىنى كېڭەيتىش', titleEn: 'Expanded custom themes, accent palettes, and sound packs', done: false }
    ]
  },
  {
    id: 'phase-4',
    phaseNumber: 4,
    titleUg: '4-باسقۇچ: ئاۋازلىق ياردەمچى ۋە دۇنياۋى تارقىتىش',
    titleEn: 'Phase 4: Real-Time Voice & Ecosystem Launch',
    durationUg: '4 - 6 ھەپتە',
    durationEn: '4 - 6 Weeks',
    badgeUg: 'كەلگۈسى پەللە',
    badgeEn: 'Ecosystem',
    descriptionUg: 'ھەقىقىي ۋاقىتلىق ئاۋازلىق پىچىرلاپ سۆزلىشىش، سىرتقى قوراللار بىلەن ئۇلىنىش ۋە رەسمىي تاقاش.',
    descriptionEn: 'Real-time bidirectional voice interactions, third-party workspace integrations (Google Workspace, Notion), and production launch.',
    tasks: [
      { id: 't4-1', titleUg: 'Gemini Live API ئارقىلىق ئاۋازلىق پاراڭلىشىش ئۇلىنىشى', titleEn: 'Gemini Live API real-time voice streaming bridge', done: false },
      { id: 't4-2', titleUg: 'Google Calendar ۋە خىزمەت قوراللىرى بىلەن ۋاقىت جەدۋىلىنى ماسلاشتۇرۇش', titleEn: 'Google Workspace / Calendar bidirectional sync', done: false },
      { id: 't4-3', titleUg: 'خاس بەلگىلىمە ۋە شەخسىي ئاپتوماتلاشتۇرۇش سېنارىيەلىرى (Workflows)', titleEn: 'Custom trigger-action automated productivity workflows', done: false }
    ]
  }
];

export const ASSISTANT_PERSONAS: AssistantPersona[] = [
  {
    id: 'universal',
    nameUg: 'ئومۇمىي ئەقلىي ياردەمچى',
    nameEn: 'Universal AI Assistant',
    taglineUg: 'كۈندىلىك مەسىلىلەر ۋە بىلىم مەركىزى',
    taglineEn: 'Daily knowledge & problem solver',
    icon: 'Sparkles',
    color: 'from-blue-600 to-indigo-600',
    bgLight: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    descriptionUg: 'ھەرقانداق ساھەدىكى سوئاللىرىڭىزغا ئەتراپلىق، توغرا ھەم چۈشىنىشلىك ئۇيغۇرچە جاۋاب بېرىدۇ.',
    descriptionEn: 'Comprehensive, accurate, and empathetic assistance for all daily questions, learning, and advice.',
    promptSuggestionsUg: [
      'ماڭا بۈگۈنكى ئىش ئۈنۈمىنى ئاشۇرىدىغان 5 ياخشى ئادەتنى تۈزۈپ بەر',
      'بىر كۆپ ئىقتىدارلىق تور بېكەت قۇرۇش ئۈچۈن قايسى تېخنىكىلارنى ئۆگىنىشىم كېرەك؟',
      'مۇرەككەپ نىشانلارنى قانداق قىلىپ كۈندىلىك ئاددىي ئادەتلەرگە ئايلاندۇرغىلى بولىدۇ؟',
      'ئۆزۈمنى يېڭى پەن ۋە تىللارنى تېز ئۆگىنىشكە قانداق تەربىيەلەيمەن؟'
    ],
    promptSuggestionsEn: [
      'Give me 5 actionable habits to maximize daily productivity',
      'What are the best modern web technologies to learn this year?',
      'How to break down a massive long-term goal into daily milestones?',
      'Suggest a realistic weekly schedule for self-directed learning'
    ]
  },
  {
    id: 'planner',
    nameUg: 'لايىھە ۋە پىلان ئۇستىسى',
    nameEn: 'Architect & Project Planner',
    taglineUg: 'سىستېما قۇرۇلمىسى ۋە تۈر لايىھىسى',
    taglineEn: 'Software architecture & execution roadmap',
    icon: 'Compass',
    color: 'from-amber-600 to-orange-600',
    bgLight: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    descriptionUg: 'ئەپ ۋە توربىكەتلەرنىڭ سىستېما قۇرۇلمىسى، تېخنىكا تاللاش، مەخپىيەتلىك ۋە قەدەممۇ-قەدەم ئىشقا ئاشۇرۇش لايىھەلىرىنى سىزىپ بېرىدۇ.',
    descriptionEn: 'Specialized in modular system design, database schemas, tech stack tradeoffs, and project blueprints.',
    promptSuggestionsUg: [
      'ماڭا بىر كۆچمە ئەپ ۋە تور بېكەتنىڭ تولۇق سىستېما لايىھە پىلانىنى تەپسىلىي تۈزۈپ بەر',
      'Frontend بىلەن Backend ئارىسىدىكى سانلىق مەلۇمات ئېقىمىنى قانداق ئەڭ بىخەتەر لايىھىلەش كېرەك؟',
      'بىر سۈنئىي ئىدراك ياردەمچى ئەپى ئۈچۈن ئەڭ مۇۋاپىق سانلىق مەلۇمات قۇرۇلمىسى قايسى؟',
      'قانداق قىلغاندا ئەپنى تورسىزمۇ (Offline-First) راۋان ئىشلەيدىغان قىلغىلى بولىدۇ؟'
    ],
    promptSuggestionsEn: [
      'Create a detailed architectural blueprint for a modern personal productivity app',
      'What is the optimal database schema for an AI-powered note and task manager?',
      'How should I design an offline-first sync engine between local client and cloud?',
      'Compare PostgreSQL vs Firestore for a multi-device assistant ecosystem'
    ]
  },
  {
    id: 'coder',
    nameUg: 'پروگرامما ۋە كود ياردەمچىسى',
    nameEn: 'Full-Stack Code Guru',
    taglineUg: 'TypeScript, React, Python & Backend',
    taglineEn: 'Clean code, architecture & debugging',
    icon: 'Code2',
    color: 'from-emerald-600 to-teal-600',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    descriptionUg: 'كود يېزىش، خاتالىقلارنى تۈزىتىش، يۇقىرى ئىقتىدارلىق API قۇرۇلمىلىرى ۋە زامانىۋى React زاپچاسلىرىنى قۇرۇپ بېرىدۇ.',
    descriptionEn: 'Expert software development assistant for React 19, TypeScript, Express, API design, and algorithm optimization.',
    promptSuggestionsUg: [
      'React بىلەن ئۇيغۇرچە RTL يۆنىلىشنى تەبىئىي بىر تەرەپ قىلىدىغان كود مىسالى كۆرسىتىپ بەر',
      'Express مۇلازىمېتىرىدا Gemini API نى بىخەتەر چاقىرىشنىڭ ئەڭ ياخشى كود قېلىپىنى يېزىپ بەر',
      'Web Audio API ئارقىلىق پىچىرلايدىغان ئاق شاۋقۇن (White Noise) ھاسىل قىلىش كودى تۈزۈپ بەر',
      'TypeScript تا كۆپ خىل سانلىق مەلۇمات تىپلىرىنى قانداق ئۆلچەملىك ئېنىقلاش كېرەك؟'
    ],
    promptSuggestionsEn: [
      'Show me a clean React component handling RTL & LTR dynamic bidirectional layout',
      'Write a production-ready Express API proxy with Gemini 3.7 SDK integration',
      'How to implement an audio synthesizer for focus soundscapes in Web Audio API?',
      'Provide a modern TypeScript interface architecture for an extensible plugin system'
    ]
  },
  {
    id: 'writer',
    nameUg: 'ئىجادىي يازغۇچى ۋە تەرجىمان',
    nameEn: 'Writer & Translator',
    taglineUg: 'ئۇيغۇرچە-ئىنگلىزچە تېكىست تاۋلاش',
    taglineEn: 'Multilingual copywriting & translation',
    icon: 'PenTool',
    color: 'from-purple-600 to-pink-600',
    bgLight: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    descriptionUg: 'ماقالە، ئېلان، ھۆججەت، كىرىش سۆزلىرى ۋە ئۇيغۇرچە-ئىنگلىزچە-خەنزۇچە دەل ھەم سەنئەتلىك تەرجىمە قىلىپ بېرىدۇ.',
    descriptionEn: 'Specialized in persuasive copywriting, product manuals, professional correspondence, and accurate nuanced translation.',
    promptSuggestionsUg: [
      'مېنىڭ يېڭى پىلانلىغان كۆپ ئىقتىدارلىق ياردەمچى ئەپىم ئۈچۈن كىشىنى جەلپ قىلىدىغان كىرىش سۆزى يېزىپ بەر',
      'بۇ ئىنگلىزچە تېكىستنى پاساھەتلىك ئۇيغۇرچىغا تەرجىمە قىلىپ بەر: "Crafted for seamless focus and clarity."',
      'تۈر لايىھە پىلانى (Project Proposal) ئۈچۈن كەسپىي ئۈستەل دوكلاتى تۈزۈپ بەر',
      'بىر پەن-تېخنىكا ماقالىسى ئۈچۈن ئېنىق قۇرۇلمىلىق مۇندەرىجە لايىھىلەپ بەر'
    ],
    promptSuggestionsEn: [
      'Draft a compelling product launch pitch for our modern AI Assistant suite',
      'Translate this phrase into eloquent Uyghur with cultural nuances',
      'Write an executive summary for our software architecture proposal',
      'Proofread and polish this technical article introduction'
    ]
  }
];

export const QUICK_TOOLS: QuickTool[] = [
  {
    id: 'breakdown-task',
    nameUg: 'نىشاننى بۆلۈش',
    nameEn: 'Decompose Goal',
    icon: 'ListTree',
    descUg: 'چوڭ بىر تۈر ياكى نىشاننى 4-6 كىچىك، ئەمەلىي ۋە تەرتىپلىك ۋەزىپىگە ئايرىپ بېرىدۇ.',
    descEn: 'Break down any large goal or ambition into clear, actionable, prioritized subtasks.',
    actionType: 'breakdown-task',
    placeholderUg: 'مەسىلەن: "بىر شەخسىي كۆپ ئىقتىدارلىق توربىكەت لايىھىلەش ۋە ئېچىش"...',
    placeholderEn: 'e.g., "Build and launch a personal modern portfolio and assistant web app"...'
  },
  {
    id: 'translate',
    nameUg: 'ئەقلىي تەرجىمە',
    nameEn: 'Smart Translate',
    icon: 'Languages',
    descUg: 'ئۇيغۇرچە، ئىنگلىزچە ۋە خەنزۇچە ئارىسىدا مەنىنى دەل ساقلاپ راۋان تەرجىمە قىلىدۇ.',
    descEn: 'Deep contextual translation preserving nuanced professional and cultural meaning.',
    actionType: 'translate',
    placeholderUg: 'تەرجىمە قىلماقچى بولغان تېكىستنى كىرگۈزۈڭ...',
    placeholderEn: 'Enter text to translate accurately...'
  },
  {
    id: 'summarize',
    nameUg: 'قىسقارتىش ۋە خۇلاسىلەش',
    nameEn: 'Summarizer',
    icon: 'FileText',
    descUg: 'ئۇزۇن ھۆججەت ياكى پىكىرلەرنى ئەڭ مۇھىم يادرولۇق نۇقتىلارغا يىغىنچاقلاپ بېرىدۇ.',
    descEn: 'Condense lengthy articles, notes, or ideas into crisp bulleted takeaways.',
    actionType: 'summarize',
    placeholderUg: 'خۇلاسىلىمەكچى بولغان مەزمۇن ياكى ماقالىنى بۇ يەرگە قويۇڭ...',
    placeholderEn: 'Paste the content or article you want to summarize...'
  },
  {
    id: 'code-helper',
    nameUg: 'كود لايىھىلىگۈچى',
    nameEn: 'Code Architect',
    icon: 'Terminal',
    descUg: 'ئېھتىياجىڭىزغا ماس React, TypeScript ياكى Python كود بۆلىكى ۋە چۈشەندۈرۈشى ھاسىل قىلىدۇ.',
    descEn: 'Generate modern, type-safe code snippets with step-by-step technical commentary.',
    actionType: 'code-helper',
    placeholderUg: 'مەسىلەن: "React تىكى تەڭشەك كۇنۇپكىسىنىڭ كودىنى يېزىپ بەر"...',
    placeholderEn: 'e.g., "Write a reusable debounce hook in TypeScript"...'
  }
];

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'لايىھە پىلانى (Blueprint) دىكى 6 تۈۋرۈكنى كۆرۈپ چىقىش ۋە مۇقىملاشتۇرۇش',
    category: 'planning' as const,
    priority: 'high' as const,
    completed: true,
    createdAt: '2026-08-26',
    subtasks: [
      { id: 'st-1', title: 'UI/UX يۈز ۋە كۆپ سۇپا پىلانىنى تەستىقلاش', done: true },
      { id: 'st-2', title: 'سۈنئىي ئىدراك ۋە Gemini مودېل ئۇلىنىشىنى سىناش', done: true }
    ]
  },
  {
    id: 'task-2',
    title: 'ئەقلىي ياردەمچى بىلەن سۆھبەتلىشىپ يېڭى ئىقتىدار پىكىرلىرىنى تەھلىل قىلىش',
    category: 'dev' as const,
    priority: 'high' as const,
    completed: false,
    createdAt: '2026-08-26',
    subtasks: [
      { id: 'st-3', title: 'خاس ياردەمچى تۈرلىرىنى ئىشلىتىپ كۆرۈش', done: true },
      { id: 'st-4', title: 'تېز قوراللار ئارقىلىق نىشاننى كىچىك قەدەملەرگە بۆلۈش', done: false }
    ]
  },
  {
    id: 'task-3',
    title: 'شەخسىي خاتىرىلەر كۆلىمىگە بىر كۈنلۈك خىزمەت پىلانىنى خاتىرىلەش',
    category: 'personal' as const,
    priority: 'medium' as const,
    completed: false,
    createdAt: '2026-08-26',
    subtasks: []
  },
  {
    id: 'task-4',
    title: 'پومودورو سائىتى ئارقىلىق 25 مىنۇتلۇق چوڭقۇر خىزمەت قىلىپ كۆرۈش',
    category: 'personal' as const,
    priority: 'low' as const,
    completed: false,
    createdAt: '2026-08-26',
    subtasks: []
  }
];

export const INITIAL_NOTES = [
  {
    id: 'note-1',
    title: '💡 كۆپ ئىقتىدارلىق زامانىۋى ئەپ ۋە تور بېكەت يادرولۇق ئىدىيەسى',
    content: `بۇ ئەپنىڭ ئاساسىي مەقسىتى:
1. **پۈتۈن بىر گەۋدىلەشكەن سۇپا**: بىرلا ۋاقىتتا سۈنئىي ئىدراك ياردەمچىسى، تۈر پىلانلىغۇچىسى ۋە شەخسىي ئۈنۈم مەركىزى بولۇپ خىزمەت قىلىش.
2. **تەبىئىي ئۇيغۇرچە تەجرىبە**: تولۇق RTL يۆنىلىشى، نەپىس خەت شەكلى ۋە مەدەنىيەتكە ئۇيغۇن جاۋاب بېرىش.
3. **ئىشلەتكۈچىنىڭ تولۇق ھوقۇقى**: يەرلىك سانلىق مەلۇمات ساقلاش، تېز ئېكسپورت ۋە تورسىزمۇ راۋان خىزمەت قىلىش.`,
    tags: ['لايىھە', 'Blueprint', 'ياردەمچى'],
    updatedAt: '2026-08-26',
    pinned: true
  },
  {
    id: 'note-2',
    title: '🚀 تېخنىكا تاللاش نۇقتىلىرى (Tech Stack Strategy)',
    content: `- **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Motion
- **AI Core**: Gemini 3.7 Flash with @google/genai SDK
- **Backend API**: Express server running on port 3000 with secure proxy isolation
- **Audio Synthesis**: Web Audio API (Ambient rain/white noise generator)
- **Deployment**: Google Cloud Run with single-container Node/Express bundle`,
    tags: ['تېخنىكا', 'TechStack', 'React'],
    updatedAt: '2026-08-26',
    pinned: false
  }
];
