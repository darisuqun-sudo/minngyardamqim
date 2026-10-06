import { AppLanguage } from '../types';

export interface TranslationDict {
  appName: string;
  appSubtitle: string;
  modelBadge: string;
  hub: string;
  blueprint: string;
  assistant: string;
  calendar: string;
  knowledge: string;
  projects: string;
  codingStudio?: string;
  imageStudio?: string;
  languageTutor?: string;
  contractBuilder?: string;
  mindfulness?: string;
  cloudSync?: string;
  financeAndHabits: string;
  tasksAndNotes: string;
  focusAndTools: string;
  flashcards: string;
  mindmap: string;
  standup: string;
  promptlab: string;
  voicememo: string;
  voiceMemos?: string;
  analytics: string;
  okr: string;
  okrGoals?: string;
  webreader: string;
  webReader?: string;
  exporter: string;
  docExporter?: string;
  morningBriefing: string;
  commandPalette: string;
  searchAll: string;
  settings: string;
  sixPillars: string;
  switchLang: string;
  themeToggle: string;
  
  // Theme Modes
  themeLight: string;
  themeDark: string;
  themeMidnight: string;
  themeOled: string;
  themeSepia: string;
  
  // Voice AI
  voiceInputTitle: string;
  voiceInputListening: string;
  voiceInputStart: string;
  voiceInputStop: string;
  speakResponse: string;
  stopSpeaking: string;
  voiceNotSupported: string;
  
  // Dashboard
  welcomeBadge: string;
  heroTitle: string;
  heroDesc: string;
  askAiPlaceholder: string;
  askAiBtn: string;
  pillarsMetricLabel: string;
  roadmapMilestonesDone: string;
  trackedTasks: string;
  pending: string;
  aiEngineLabel: string;
  pillarsSectionTitle: string;
  pillarsSectionDesc: string;
  exploreFullBlueprint: string;
  techStackChoices: string;
  details: string;
  quickActionsTitle: string;
  customPlanCardTitle: string;
  customPlanCardDesc: string;
  codeGuruCardTitle: string;
  codeGuruCardDesc: string;
  translateCardTitle: string;
  translateCardDesc: string;
  pomodoroCardTitle: string;
  pomodoroCardDesc: string;
  todayTasksTitle: string;
  manageAll: string;
  smartNotesTitle: string;
  openNotepad: string;
  
  // Blueprint
  masterPlanBadge: string;
  blueprintMainTitle: string;
  blueprintMainDesc: string;
  exportMarkdown: string;
  sixCorePillarsTab: string;
  phaseRoadmapTab: string;
  aiCustomPlanTab: string;
  selectPillarTitle: string;
  pillarNumber: string;
  coreFeaturesHeading: string;
  techStackHeading: string;
  techCategory: string;
  techName: string;
  techPurpose: string;
  architecturalNotesHeading: string;
  roadmapProgressHeading: string;
  roadmapProgressDesc: string;
  overallProgress: string;
  customPlanTitle: string;
  customPlanDesc: string;
  projectIdeaLabel: string;
  projectIdeaPlaceholder: string;
  targetPlatformLabel: string;
  generateBlueprintBtn: string;
  generatingBlueprint: string;
  generatedPlanBadge: string;
  
  // Assistant Chat
  universalAiAssistant: string;
  generatingResponse: string;
  chatPlaceholder: string;
  sendBtn: string;
  exportChat: string;
  clearChat: string;
  quickSuggestions: string;
  
  // Smart Calendar & Schedule
  calendarTitle: string;
  calendarDesc: string;
  today: string;
  addEvent: string;
  eventTitle: string;
  eventStartTime: string;
  eventEndTime: string;
  eventCategory: string;
  aiOptimizeSchedule: string;
  optimizingSchedule: string;
  timeBlocksHeading: string;
  noEventsScheduled: string;
  
  // Knowledge Base
  knowledgeTitle: string;
  knowledgeDesc: string;
  uploadDocument: string;
  supportedFileTypes: string;
  analyzingDocument: string;
  keyInsightsHeading: string;
  docSummaryHeading: string;
  askDocQuestion: string;
  searchKnowledge: string;
  noDocsYet: string;
  
  // Project Architect Hub
  projectsTitle: string;
  projectsDesc: string;
  createNewProject: string;
  projectTemplates: string;
  exportGithubZip: string;
  codePlayground: string;
  filesStructure: string;
  
  // Habits & Finance
  habitsAndFinanceTitle: string;
  habitsAndFinanceDesc: string;
  dailyHabitsTab: string;
  financeBudgetTab: string;
  currentStreak: string;
  bestStreak: string;
  addHabit: string;
  habitTitle: string;
  income: string;
  expense: string;
  netSavings: string;
  addTransaction: string;
  transactionAmount: string;
  aiFinanceAdvisor: string;
  analyzingFinances: string;
  
  // Productivity
  productivityHubTitle: string;
  productivityHubDesc: string;
  tasksLabel: string;
  notesLabel: string;
  createNewTask: string;
  taskTitleLabel: string;
  taskTitlePlaceholder: string;
  categoryLabel: string;
  priorityLabel: string;
  addTaskBtn: string;
  aiBreakdown: string;
  breakingDown: string;
  actionableSteps: string;
  noTasksYet: string;
  searchNotesPlaceholder: string;
  newNoteBtn: string;
  noteTitlePlaceholder: string;
  aiSummarizeNote: string;
  aiExpandNote: string;
  saveNote: string;
  tagsPlaceholder: string;
  noteContentPlaceholder: string;
  noNoteSelected: string;
  planningCat: string;
  devCat: string;
  designCat: string;
  personalCat: string;
  highPriority: string;
  medPriority: string;
  lowPriority: string;
  
  // Focus & Tools
  focusToolsTitle: string;
  focusToolsDesc: string;
  twentyFiveMinFocus: string;
  fiveMinBreak: string;
  fifteenMinLongBreak: string;
  deepFocusSession: string;
  restAndRecharge: string;
  startFocus: string;
  pauseFocus: string;
  completedSessions: string;
  ambientSoundscapes: string;
  ambientSoundscapesDesc: string;
  rainSound: string;
  whiteNoiseSound: string;
  zenDroneSound: string;
  aiAcceleratorsTitle: string;
  aiAcceleratorsDesc: string;
  toLang: string;
  processWithAi: string;
  executingAi: string;
  aiResultBadge: string;
  saveToNotes: string;
  saved: string;
  
  // Data Sync & Settings
  dataSettingsTitle: string;
  dataSettingsDesc: string;
  exportFullBackup: string;
  importBackup: string;
  cloudSyncStatus: string;
  activeAndSecure: string;
  
  // Footer
  footerBrandDesc: string;
  localDataPrivacy: string;
  serverAiProxy: string;
  resetSampleData: string;
  resetConfirmMessage: string;
}

export const TRANSLATIONS: Record<AppLanguage, TranslationDict> = {
  ug: {
    appName: 'ئەقلىي ياردەمچى & لايىھە مەركىزى',
    appSubtitle: 'كۆپ ئىقتىدارلىق زامانىۋى ئەپ ۋە سىستېما لايىھە بازىسى',
    modelBadge: 'Gemini 3.7',
    hub: 'مەركەز',
    blueprint: 'لايىھە پىلانى',
    assistant: 'ئەقلىي ياردەمچى',
    calendar: 'كالېندار & ۋاقىت',
    knowledge: 'بىلىم ئامبىرى',
    projects: 'تۈر قېلىپلىرى',
    codingStudio: 'پىروگرامما & كود مەركىزى',
    imageStudio: 'رەسىم ئىجادىيىتى (AI)',
    languageTutor: 'تىل مەشقاۋۇلى (AI)',
    contractBuilder: 'رەسمىي پۈتۈك & ھۆججەت',
    mindfulness: 'خاتىرجەملىك & نەپەس',
    cloudSync: 'بۇلۇتقا زاپاسلاش',
    financeAndHabits: 'ئادەت & خامچوت',
    tasksAndNotes: 'ۋەزىپە & خاتىرە',
    focusAndTools: 'زېھىن & قوراللار',
    flashcards: 'ئۆگىنىش كارتىلىرى & سىناق',
    mindmap: 'پىكىر خەرىتىسى',
    standup: 'كۈندىلىك خۇلاسە',
    promptlab: 'بۇيرۇق سېخى',
    voicememo: 'ئاۋازلىق خاتىرە & ئايلاندۇرغۇچ',
    analytics: 'ئەقلىي ئۈنۈم ئانالىزى',
    okr: 'ئەقلىي نىشان & پىلان (OKR)',
    webreader: 'تور ماقالىسى & ئوقۇغۇچ',
    exporter: 'ھۆججەت چىقىرىش & مەتبەئە',
    morningBriefing: 'ئەتىگەنلىك كۈن تەرتىپى',
    commandPalette: 'تېز بۇيرۇق مەركىزى (Ctrl+K)',
    searchAll: 'پۈتۈن سىستېمىدىن ئىزدەش',
    settings: 'تەڭشەك & زاپاسلاش',
    sixPillars: '6 تۈۋرۈك',
    switchLang: 'تىل تاللاش',
    themeToggle: 'كۆرۈنۈش تەڭشىكى',
    themeLight: 'يورۇق ھالەت',
    themeDark: 'قاراڭغۇ ھالەت',
    themeMidnight: 'سۈرمە كېچە (Midnight)',
    themeOled: 'ساپ قارا (OLED Black)',
    themeSepia: 'كۆز قوغداش سارغۇچ (Sepia)',
    voiceInputTitle: 'ئاۋازلىق كىرگۈزۈش',
    voiceInputListening: 'ئاڭلاۋاتىدۇ... گەپ قىلىڭ',
    voiceInputStart: 'ئاۋازلىق سۆزلەش',
    voiceInputStop: 'ئاۋازنى توختىتىش',
    speakResponse: 'جاۋابنى ئوقۇپ بېرىش',
    stopSpeaking: 'ئاۋازنى ئۆچۈرۈش',
    voiceNotSupported: 'توركۆرگۈچىڭىز ئاۋاز پەرقلەندۈرۈشنى قوللىمىدى',
    welcomeBadge: 'كۆپ ئىقتىدارلىق زامانىۋى ئەپ ۋە توربىكەت لايىھە بازىسى',
    heroTitle: 'مۇكەممەل ئەقلىي ياردەمچى ۋە تۈر لايىھە پىلانى مەركىزىگە خۇش كەپسىز!',
    heroDesc: 'بۇ سۇپا سىزنىڭ شەخسىي كۆپ ئىقتىدارلىق ئەقلىي ئەپىڭىزنى لايىھىلەش، قۇرۇلما پىلانى (Blueprint) تۈزۈش، ۋەزىپىلەرنى تەشكىللەش ۋە كۈندىلىك خىزمەت ئۈنۈمىنى ئاشۇرۇش ئۈچۈن مەخسۇس يۈرۈشلەشتۈرۈپ قۇرۇپ چىقىلدى.',
    askAiPlaceholder: 'ياردەمچىدىن خالىغان سوئال، پىلان ياكى كود سوراڭ (مەسىلەن: "ماڭا لايىھە تۈزۈپ بەر")...',
    askAiBtn: 'سوراڭ',
    pillarsMetricLabel: 'يادرولۇق قۇرۇلما تۈۋرۈكلىرى',
    roadmapMilestonesDone: 'ئىشقا ئاشۇرۇش قەدەم باسقۇچلىرى',
    trackedTasks: 'شەخسىي نىشان ۋە ۋەزىپىلەر',
    pending: 'كۈتۈۋاتىدۇ',
    aiEngineLabel: 'ئەقلىي تەپەككۇر & يادرو',
    pillarsSectionTitle: '🏛️ كۆپ ئىقتىدارلىق ئەپنىڭ 6 تۈۋرۈك قۇرۇلما پىلانى',
    pillarsSectionDesc: 'سىز سوراغان ياردەمچى ئەپ ۋە توربىكەتنىڭ تېخنىكىلىق قۇرۇلما خەرىتىسى',
    exploreFullBlueprint: 'تولۇق پىلاننى كۆرۈش',
    techStackChoices: 'تېخنىكا تاللانمىسى',
    details: 'تەپسىلاتى',
    quickActionsTitle: '⚡ تېز مەشغۇلات ۋە ياردەمچى قوراللار',
    customPlanCardTitle: 'لايىھە پىلانى تۈزگۈچى',
    customPlanCardDesc: 'يېڭى بىر ئەپ ياكى توربىكەت پىكىرى ئۈچۈن سۈنئىي ئىدراك ئارقىلىق پىلان ھاسىل قىلىش',
    codeGuruCardTitle: 'كود ۋە API مەسلىھەتچىسى',
    codeGuruCardDesc: 'TypeScript, React, Node.js كودلىرى ۋە تەڭشەكلەرنى سوراش',
    translateCardTitle: 'ئەقلىي تەرجىمە & تېكىست',
    translateCardDesc: 'ئۇيغۇرچە، تۈركچە، ئەرەبچە، ئىنگلىزچە ۋە خەنزۇچە دەل ھەم راۋان تەرجىمە قىلىش',
    pomodoroCardTitle: '25m پومودورو & تەبىئەت ئاۋازى',
    pomodoroCardDesc: 'يۇقىرى ئۈنۈملۈك چوڭقۇر خىزمەت سائىتى ۋە پىچىرلايدىغان ئاۋاز',
    todayTasksTitle: 'كۈندىلىك ۋەزىپىلەر ۋە نىشانلار',
    manageAll: 'ھەممىسىنى كۆرۈش',
    smartNotesTitle: 'ئەقلىي خاتىرىلەر ۋە پىكىرلەر',
    openNotepad: 'خاتىرە قوشۇش',
    masterPlanBadge: 'سىستېما لايىھە پىلانى (System Blueprint)',
    blueprintMainTitle: 'كۆپ ئىقتىدارلىق زامانىۋى ياردەمچى ئەپ ۋە توربىكەت لايىھە لايىھىسى',
    blueprintMainDesc: 'تولۇق قۇرۇلما، تېخنىكا تاللاشلىرى، باسقۇچلۇق ئىشقا ئاشۇرۇش ۋە بىخەتەرلىك پەلەمپىيىنىڭ بىر گەۋدىلەشكەن ئۆلچىمى.',
    exportMarkdown: 'پىلاننى ساقلاش (.md)',
    sixCorePillarsTab: '🏛️ 6 قۇرۇلما تۈۋرۈكى',
    phaseRoadmapTab: '🚀 ئىشقا ئاشۇرۇش خەرىتىسى',
    aiCustomPlanTab: '✨ ئاپتوماتىك لايىھە ھاسىللىغۇچى',
    selectPillarTitle: 'قۇرۇلما تۈۋرۈكلىرى تىزىملىكى',
    pillarNumber: 'بۆلەك نومۇرى',
    coreFeaturesHeading: '✨ ئاساسىي ئىقتىدارلار ۋە مەقسەتلەر',
    techStackHeading: '💻 تەۋسىيە قىلىنغان تېخنىكا تاللانمىلىرى',
    techCategory: 'تۈرى',
    techName: 'تېخنىكا',
    techPurpose: 'مەقسىتى ۋە ئەۋزەللىكى',
    architecturalNotesHeading: '📐 تېخنىكىلىق قۇرۇلما ئەسكەرتمىلىرى',
    roadmapProgressHeading: '🚀 تۈرنى باسقۇچلۇق ئىشقا ئاشۇرۇش پىلانى',
    roadmapProgressDesc: 'ھەر بىر باسقۇچتىكى ۋەزىپىلەرنى تاماملاپ، پىلاننىڭ ئومۇمىي تەرەققىياتىنى تەستىقلاڭ.',
    overallProgress: 'ئومۇمىي نەتىجە',
    customPlanTitle: 'خاس ئەپ ۋە توربىكەت لايىھەسىنى ھاسىللاش',
    customPlanDesc: 'ئۆزىڭىز كۆڭلىڭىزدىكى تۈر ئىدىيەسىنى يېزىڭ، Gemini 3.7 Flash سىزگە تەپسىلىي تېخنىكا پىلانى ھاسىللاپ بېرىدۇ.',
    projectIdeaLabel: 'تۈر ياكى ئەپ ئىدىيەسى:',
    projectIdeaPlaceholder: 'مەسىلەن: شەخسىي كۆپ ئىقتىدارلىق ئەقلىي ياردەمچى ئەپ ۋە خاتىرە قورالى...',
    targetPlatformLabel: 'نىشان سۇپا:',
    generateBlueprintBtn: 'لايىھە پىلانىنى تۈزۈش',
    generatingBlueprint: 'لايىھە ھاسىللىنىۋاتىدۇ...',
    generatedPlanBadge: '🎉 سۈنئىي ئىدراك تۈزگەن لايىھە پىلانى',
    universalAiAssistant: 'ئومۇمىي ئەقلىي ياردەمچى',
    generatingResponse: 'جاۋاب تەييارلىنىۋاتىدۇ...',
    chatPlaceholder: 'ئەقلىي ياردەمچىگە سوئال ياكى پىكىرىڭىزنى يېزىڭ (مەسىلەن: "لايىھە قۇرۇلمىسىنى تەھلىل قىلىپ بەر")...',
    sendBtn: 'ئەۋەتىش',
    exportChat: 'سۆھبەتنى ساقلاش (.md)',
    clearChat: 'سۆھبەتنى تازىلاش',
    quickSuggestions: '💡 تېز باشلاش سوئاللىرى:',
    calendarTitle: 'ئەقلىي كالېندار & ۋاقىت بۆلەكلىرى (Time-Blocking)',
    calendarDesc: 'كۈندىلىك ۋەزىپىلەرنى ئەقلىي ۋاقىت بۆلەكلىرىگە ئورۇنلاشتۇرۇش ۋە پىلانلاش.',
    today: 'بۈگۈن',
    addEvent: 'پائالىيەت قوشۇش',
    eventTitle: 'پائالىيەت ماۋزۇسى',
    eventStartTime: 'باشلىنىش ۋاقتى',
    eventEndTime: 'ئاخىرلىشىش ۋاقتى',
    eventCategory: 'تۈرى',
    aiOptimizeSchedule: 'AI ئەقلىي كۈنتەرتىپ تۈزۈش',
    optimizingSchedule: 'كۈنتەرتىپ ئەلالاشتۇرۇلۇۋاتىدۇ...',
    timeBlocksHeading: 'بۈگۈنكى ۋاقىت بۆلەكلىرى',
    noEventsScheduled: 'بۇ كۈنگە پائالىيەت بېكىتىلمىدى. يېڭى پائالىيەت قوشۇڭ ياكى AI ئارقىلىق ئورۇنلاشتۇرۇڭ!',
    knowledgeTitle: 'شەخسىي بىلىم ئامبىرى & ھۆججەت تەھلىلى (RAG)',
    knowledgeDesc: 'ھۆججەت ۋە تېكىستلەرنى يۈكلەپ، سۈنئىي ئىدراك ئارقىلىق تەھلىل قىلىش ۋە سوئال-جاۋاب ئېلىپ بېرىش.',
    uploadDocument: 'ھۆججەت ياكى تېكىست قوشۇش',
    supportedFileTypes: 'قوللايدىغان ھۆججەتلەر: .txt, .md, .json, .ts, .pdf تېكىستلىرى',
    analyzingDocument: 'سۈنئىي ئىدراك ھۆججەتنى تەھلىل قىلىۋاتىدۇ...',
    keyInsightsHeading: '🔑 مۇھىم يارقىن نۇقتىلار',
    docSummaryHeading: '📋 قىسقىچە مەزمۇنى',
    askDocQuestion: 'بۇ ھۆججەت ھەققىدە سوئال سوراڭ...',
    searchKnowledge: 'بىلىم ئامبىرىدىن ئىزدەش...',
    noDocsYet: 'ھازىرچە ھۆججەت يوق. بىر ھۆججەت قوشۇپ بىلىم ئامبىرىنى باشلاڭ!',
    projectsTitle: 'تۈر قۇرۇلمىسى & كود قېلىپلىرى مەركىزى',
    projectsDesc: 'زامانىۋى سىستېما لايىھەلىرىنى تەييار كود قېلىپىغا ئايلاندۇرۇش ۋە كۆرۈش.',
    createNewProject: 'يېڭى تۈر لايىھىسى',
    projectTemplates: 'تەييار قۇرۇلما قېلىپلىرى',
    exportGithubZip: 'ZIP / كود چۈشۈرۈش',
    codePlayground: 'جانلىق كود كۆرۈنۈشى',
    filesStructure: 'ھۆججەت ۋە مۇندەرىجە قۇرۇلمىسى',
    habitsAndFinanceTitle: 'ئادەت يېتىلدۈرۈش & شەخسىي خامچوت باشقۇرۇش',
    habitsAndFinanceDesc: 'كۈندىلىك ئادەتلەرنى ئۈزمەي داۋاملاشتۇرۇش ۋە كىرىم-چىقىمنى تەھلىل قىلىش.',
    dailyHabitsTab: '🔥 كۈندىلىك ئادەتلەر',
    financeBudgetTab: '💰 پۇل-مۇئامىلە & خامچوت',
    currentStreak: 'نۆۋەتتىكى ئۈزۈلمەس كۈن',
    bestStreak: 'ئەڭ ياخشى رېكورت',
    addHabit: 'يېڭى ئادەت قوشۇش',
    habitTitle: 'ئادەت نامى',
    income: 'كىرىم',
    expense: 'چىقىم',
    netSavings: 'ساپ قالدۇق',
    addTransaction: 'كىرىم/چىقىم قوشۇش',
    transactionAmount: 'سوممىسى',
    aiFinanceAdvisor: 'AI پۇل-مۇئامىلە مەسلىھەتچىسى',
    analyzingFinances: 'پۇل تەھلىل قىلىنىۋاتىدۇ...',
    productivityHubTitle: 'شەخسىي ئۈنۈم ۋە بىلىم مەركىزى',
    productivityHubDesc: 'كۈندىلىك نىشانلارنى ئەقلىي بۆلۈش، ۋەزىپىلەرنى تەشكىللەش ۋە بىلىملەرنى خاتىرىلەش.',
    tasksLabel: 'ۋەزىپىلەر',
    notesLabel: 'خاتىرىلەر',
    createNewTask: 'يېڭى ۋەزىپە قوشۇش',
    taskTitleLabel: 'ۋەزىپە نامى:',
    taskTitlePlaceholder: 'مەسىلەن: ئەپنىڭ UI سىستېما لايىھىسىنى پۈتتۈرۈش...',
    categoryLabel: 'تۈرى:',
    priorityLabel: 'دەرىجىسى:',
    addTaskBtn: 'ۋەزىپىنى قوشۇش',
    aiBreakdown: 'AI بۆلۈش',
    breakingDown: 'بۆلۈنۈۋاتىدۇ...',
    actionableSteps: 'بۆلۈنگەن باسقۇچلار:',
    noTasksYet: 'ھازىرچە ۋەزىپە يوق. يېڭى ۋەزىپە قوشۇپ خىزمەتنى باشلاڭ!',
    searchNotesPlaceholder: 'خاتىرىلەرنى ئىزدەش...',
    newNoteBtn: 'يېڭى خاتىرە',
    noteTitlePlaceholder: 'خاتىرە ماۋزۇسى...',
    aiSummarizeNote: 'AI خۇلاسىلەش',
    aiExpandNote: 'AI كېڭەيتىش',
    saveNote: 'ساقلاش',
    tagsPlaceholder: 'بەلگىلەر (پەش بىلەن ئايرىڭ: لايىھە, پىلان)...',
    noteContentPlaceholder: 'خاتىرىڭىزنى Markdown شەكلىدە يېزىڭ...',
    noNoteSelected: 'خاتىرە كۆرۈش ئۈچۈن سول تەرەپتىن بىرنى تاللاڭ ياكى يېڭى خاتىرە قۇرۇڭ.',
    planningCat: '📋 پىلانلاش',
    devCat: '💻 تەرەققىيات',
    designCat: '🎨 لايىھە',
    personalCat: '👤 شەخسىي',
    highPriority: '🔴 جىددىي (High)',
    medPriority: '🟡 ئوتتۇرا (Medium)',
    lowPriority: '🟢 ئاددىي (Low)',
    focusToolsTitle: 'زېھىن مەركەزلەشتۈرۈش & ئەقلىي قوراللار',
    focusToolsDesc: 'پومودورو ۋاقىت باشقۇرۇش، تەبىئەت ئاۋازلىرى ۋە سۈنئىي ئىدراك ئارقىلىق نىشانلارنى تېز بىر تەرەپ قىلىش.',
    twentyFiveMinFocus: '25m زېھىن',
    fiveMinBreak: '5m ئارام',
    fifteenMinLongBreak: '15m ئۇزۇن ئارام',
    deepFocusSession: 'چوڭقۇر دىققەت قىلىش ۋاقتى',
    restAndRecharge: 'قىسقا ئارام ئېلىش ۋاقتى',
    startFocus: 'باشلاش',
    pauseFocus: 'توختىتىش',
    completedSessions: 'تاماملانغان مەشغۇلات:',
    ambientSoundscapes: 'تەبىئەت ئاۋازلىرى (Web Audio Synth)',
    ambientSoundscapesDesc: 'سىرتقى ئاۋاز ھۆججىتى تەلەپ قىلماي، بىۋاسىتە كومپيۇتېرىڭىزدا تەبىئىي ئاۋاز ھاسىل قىلىدۇ.',
    rainSound: 'يامغۇر',
    whiteNoiseSound: 'ئاق شاۋقۇن',
    zenDroneSound: 'سۈكۈنات (Zen)',
    aiAcceleratorsTitle: 'سۈنئىي ئىدراك ئۈنۈم قوراللىرى',
    aiAcceleratorsDesc: 'بىر كۇنۇپكا بىلەن مەقسەتنى كىچىك قەدەملەرگە بۆلۈش، تەرجىمە قىلىش ۋە كود ھاسىللاش.',
    toLang: 'نىشان تىل:',
    processWithAi: 'ھاسىللاش / ئىجرا قىلىش',
    executingAi: 'سۈنئىي ئىدراك ئىجرا قىلىۋاتىدۇ...',
    aiResultBadge: '🎉 نەتىجە:',
    saveToNotes: 'خاتىرىگە ساقلاش',
    saved: 'ساقلاندى!',
    dataSettingsTitle: 'سانلىق مەلۇمات زاپاسلاش & بۇلۇت تەڭشەكلىرى',
    dataSettingsDesc: 'بارلىق ۋەزىپە، لايىھە ۋە خاتىرىلەرنى بىر كۇنۇپكا بىلەن JSON شەكلىدە ئېكسپورت قىلىش ۋە قايتۇرۇش.',
    exportFullBackup: 'تولۇق زاپاسلاش ھۆججىتى چۈشۈرۈش (.json)',
    importBackup: 'زاپاس ھۆججەتنى كىرگۈزۈش',
    cloudSyncStatus: 'بۇلۇت ۋە يەرلىك ماسلىشىش ھالىتى',
    activeAndSecure: 'ئاكتىپ ۋە بىخەتەر',
    footerBrandDesc: 'React 19 + Express + Gemini 3.7 Flash بىلەن مۇكەممەل قۇرۇلدى',
    localDataPrivacy: 'يەرلىك سانلىق مەلۇمات مەخپىيەتلىكى',
    serverAiProxy: 'مۇلازىمېتىر تەرەپ AI يادروسى',
    resetSampleData: 'ئەسلىگە قايتۇرۇش',
    resetConfirmMessage: 'بارلىق دەسلەپكى ئۈلگە سانلىق مەلۇماتلارنى ئەسلىگە قايتۇرامسىز؟',
  },
  en: {
    appName: 'Smart Assistant & Blueprint Hub',
    appSubtitle: 'Multifunctional AI Assistant & Modern Architecture Planner',
    modelBadge: 'Gemini 3.7',
    hub: 'Hub',
    blueprint: 'Blueprint',
    assistant: 'AI Assistant',
    calendar: 'Calendar & Schedule',
    knowledge: 'Knowledge Vault',
    projects: 'Project Templates',
    codingStudio: 'Coding & Dev Studio',
    imageStudio: 'AI Image & Art Studio',
    languageTutor: 'AI Language Tutor',
    contractBuilder: 'Smart Contracts & Docs',
    mindfulness: 'Mindfulness & Breathing',
    cloudSync: 'Cloud Sync & Backup',
    financeAndHabits: 'Habits & Finance',
    tasksAndNotes: 'Tasks & Notes',
    focusAndTools: 'Focus & Tools',
    flashcards: 'Flashcards & Quiz',
    mindmap: 'Mind Map & Flow',
    standup: 'Daily Standup',
    promptlab: 'Prompt Lab',
    voicememo: 'Voice Memos & AI Scribe',
    analytics: 'Performance Analytics',
    okr: 'Smart OKRs & Milestones',
    webreader: 'Web Article Reader',
    exporter: 'Doc Studio & PDF Export',
    morningBriefing: 'Morning Briefing',
    commandPalette: 'Command Center (Ctrl+K)',
    searchAll: 'Global Search',
    settings: 'Settings & Sync',
    sixPillars: '6 Pillars',
    switchLang: 'Language',
    themeToggle: 'Theme Mode',
    themeLight: 'Light Mode',
    themeDark: 'Dark Mode',
    themeMidnight: 'Midnight Slate',
    themeOled: 'Pure OLED Black',
    themeSepia: 'Eye-Care Warm (Sepia)',
    voiceInputTitle: 'Voice Input',
    voiceInputListening: 'Listening... Speak now',
    voiceInputStart: 'Start Voice Input',
    voiceInputStop: 'Stop Voice Input',
    speakResponse: 'Read Aloud',
    stopSpeaking: 'Stop Audio',
    voiceNotSupported: 'Speech Recognition is not supported by your browser',
    welcomeBadge: 'Multifunctional Modern Assistant App & Web Architecture',
    heroTitle: 'Welcome to your Comprehensive Smart Assistant & Blueprint Workspace',
    heroDesc: 'Designed to help you architect your personal multifunctional modern assistant web app, structure system blueprints, manage tasks & notes, and leverage Gemini AI intelligence.',
    askAiPlaceholder: 'Ask the AI Assistant anything (e.g. "Draft an architecture plan")...',
    askAiBtn: 'Ask AI',
    pillarsMetricLabel: 'Core Architecture Pillars',
    roadmapMilestonesDone: 'Roadmap Milestones Done',
    trackedTasks: 'Total Tracked Tasks',
    pending: 'Pending',
    aiEngineLabel: 'Multimodal LLM Engine',
    pillarsSectionTitle: '🏛️ 6 Core System Architecture Pillars',
    pillarsSectionDesc: 'High-level architectural blueprint crafted for your personal assistant & web platform',
    exploreFullBlueprint: 'Explore Full Blueprint',
    techStackChoices: 'Tech Stack choices',
    details: 'Details',
    quickActionsTitle: '⚡ Quick Actions & Instant Utilities',
    customPlanCardTitle: 'Custom Blueprint Generator',
    customPlanCardDesc: 'Generate tailored system architecture for any product idea',
    codeGuruCardTitle: 'Code & API Architect',
    codeGuruCardDesc: 'Generate clean TypeScript, React, and backend API components',
    translateCardTitle: 'Multilingual Translator',
    translateCardDesc: 'Nuanced translations between Uyghur, Turkish, Arabic, English & Chinese',
    pomodoroCardTitle: 'Pomodoro & Ambient Audio',
    pomodoroCardDesc: 'Deep focus timer with zero-latency synthesized rain & noise',
    todayTasksTitle: 'Today’s Tasks & Milestones',
    manageAll: 'Manage All',
    smartNotesTitle: 'Smart Notes & Knowledge Base',
    openNotepad: 'Open Notepad',
    masterPlanBadge: 'Master Architecture Plan',
    blueprintMainTitle: 'Multifunctional Modern Assistant App & Web Platform Blueprint',
    blueprintMainDesc: 'End-to-end architecture specification covering UI/UX, AI pipelines, microservices, privacy, and progressive roadmap milestones.',
    exportMarkdown: 'Export Markdown',
    sixCorePillarsTab: '🏛️ 6 Core Pillars',
    phaseRoadmapTab: '🚀 Phase Roadmap',
    aiCustomPlanTab: '✨ AI Custom Plan Generator',
    selectPillarTitle: 'Select Pillar to Inspect',
    pillarNumber: 'Pillar #',
    coreFeaturesHeading: '✨ Core Features & Capabilities',
    techStackHeading: '💻 Recommended Tech Stack & Rationale',
    techCategory: 'Category',
    techName: 'Technology',
    techPurpose: 'Purpose & Tradeoff',
    architecturalNotesHeading: '📐 Architectural Best Practices',
    roadmapProgressHeading: '🚀 Phased Implementation Roadmap',
    roadmapProgressDesc: 'Track milestone progress across all 4 architectural execution phases.',
    overallProgress: 'Overall Progress',
    customPlanTitle: 'Generate Custom AI Architecture Plan',
    customPlanDesc: 'Describe your application vision, and Gemini will generate a custom technical blueprint roadmap for you.',
    projectIdeaLabel: 'Project or App Concept:',
    projectIdeaPlaceholder: 'e.g. A multifunctional personal productivity assistant with voice and offline notes...',
    targetPlatformLabel: 'Target Platform:',
    generateBlueprintBtn: 'Generate Master Blueprint',
    generatingBlueprint: 'Generating Blueprint...',
    generatedPlanBadge: '🎉 Generated Master Blueprint',
    universalAiAssistant: 'Universal AI Assistant',
    generatingResponse: 'Generating response...',
    chatPlaceholder: 'Ask your AI Assistant anything...',
    sendBtn: 'Send',
    exportChat: 'Export Chat (.md)',
    clearChat: 'Clear Chat',
    quickSuggestions: '💡 Quick prompt suggestions:',
    calendarTitle: 'Smart Calendar & Time-Blocking',
    calendarDesc: 'Intelligently allocate your daily priorities into focused 24-hour time blocks.',
    today: 'Today',
    addEvent: 'Add Event',
    eventTitle: 'Event Title',
    eventStartTime: 'Start Time',
    eventEndTime: 'End Time',
    eventCategory: 'Category',
    aiOptimizeSchedule: 'AI Schedule Optimizer',
    optimizingSchedule: 'Optimizing your day...',
    timeBlocksHeading: 'Today’s Time-Blocks',
    noEventsScheduled: 'No events scheduled for this day. Add one or let AI build your schedule!',
    knowledgeTitle: 'Personal Knowledge Vault & Document Intelligence (RAG)',
    knowledgeDesc: 'Upload documents or notes to unlock instant AI summarization, key takeaways, and context-grounded Q&A.',
    uploadDocument: 'Add Document or Text',
    supportedFileTypes: 'Supported: .txt, .md, .json, .ts, PDF text',
    analyzingDocument: 'AI is analyzing your document...',
    keyInsightsHeading: '🔑 Key Insights & Takeaways',
    docSummaryHeading: '📋 Executive Summary',
    askDocQuestion: 'Ask a question grounded in this document...',
    searchKnowledge: 'Search knowledge vault...',
    noDocsYet: 'No documents in vault yet. Add one to start building your personal library!',
    projectsTitle: 'Project Architect & Code Boilerplate Hub',
    projectsDesc: 'Transform system architecture blueprints into working scaffolds, code playgrounds, and exports.',
    createNewProject: 'New Project Blueprint',
    projectTemplates: 'Ready-to-Use Templates',
    exportGithubZip: 'Download Code / ZIP',
    codePlayground: 'Live Code Sandbox',
    filesStructure: 'Directory & File Tree',
    habitsAndFinanceTitle: 'Habit Formation & Personal Budgeting',
    habitsAndFinanceDesc: 'Build enduring positive streaks and maintain crisp financial health with AI advisory.',
    dailyHabitsTab: '🔥 Daily Habit Streaks',
    financeBudgetTab: '💰 Budget & Cash Flow',
    currentStreak: 'Current Streak',
    bestStreak: 'Best Record',
    addHabit: 'Add Habit',
    habitTitle: 'Habit Name',
    income: 'Total Income',
    expense: 'Total Expenses',
    netSavings: 'Net Savings',
    addTransaction: 'Log Transaction',
    transactionAmount: 'Amount ($)',
    aiFinanceAdvisor: 'AI Wealth & Budget Coach',
    analyzingFinances: 'Analyzing financial health...',
    productivityHubTitle: 'Productivity & Knowledge Workspace',
    productivityHubDesc: 'AI-assisted task decomposition, goal tracking, and Markdown knowledge vault.',
    tasksLabel: 'Tasks',
    notesLabel: 'Notes',
    createNewTask: 'Create New Task',
    taskTitleLabel: 'Task Title:',
    taskTitlePlaceholder: 'e.g. Complete mobile UI system design...',
    categoryLabel: 'Category:',
    priorityLabel: 'Priority:',
    addTaskBtn: 'Add Task',
    aiBreakdown: 'AI Steps',
    breakingDown: 'Breaking down...',
    actionableSteps: 'Actionable Substeps:',
    noTasksYet: 'No tasks yet. Create one to get started!',
    searchNotesPlaceholder: 'Search notes...',
    newNoteBtn: 'New Note',
    noteTitlePlaceholder: 'Note Title...',
    aiSummarizeNote: 'AI Summarize',
    aiExpandNote: 'AI Expand',
    saveNote: 'Save',
    tagsPlaceholder: 'Tags (comma separated)...',
    noteContentPlaceholder: 'Write your notes in Markdown format...',
    noNoteSelected: 'Select a note or create a new one.',
    planningCat: '📋 Planning',
    devCat: '💻 Development',
    designCat: '🎨 Design',
    personalCat: '👤 Personal',
    highPriority: '🔴 High',
    medPriority: '🟡 Medium',
    lowPriority: '🟢 Low',
    focusToolsTitle: 'Deep Focus & AI Accelerators',
    focusToolsDesc: 'Deep work timer with zero-latency synthesized audio and instant AI task helpers.',
    twentyFiveMinFocus: '25m Focus',
    fiveMinBreak: '5m Break',
    fifteenMinLongBreak: '15m Long',
    deepFocusSession: 'Deep Focus Session',
    restAndRecharge: 'Rest & Recharge',
    startFocus: 'Start Focus',
    pauseFocus: 'Pause',
    completedSessions: 'Completed Sessions:',
    ambientSoundscapes: 'Ambient Soundscapes',
    ambientSoundscapesDesc: 'Zero-latency synthetic ambient audio designed for distraction-free flow.',
    rainSound: 'Rain',
    whiteNoiseSound: 'White Noise',
    zenDroneSound: 'Zen Drone',
    aiAcceleratorsTitle: 'AI Productivity Accelerators',
    aiAcceleratorsDesc: 'Fast-action AI workflows powered by server-side Gemini 3.7 Flash.',
    toLang: 'To:',
    processWithAi: 'Process with AI',
    executingAi: 'Executing...',
    aiResultBadge: '🎉 AI Result:',
    saveToNotes: 'Save to Notes',
    saved: 'Saved!',
    dataSettingsTitle: 'Data Management, Backup & Cloud Sync',
    dataSettingsDesc: 'Full client-side sovereignty. Export your entire assistant state as JSON or synchronize across devices.',
    exportFullBackup: 'Export Full JSON Backup',
    importBackup: 'Import JSON Backup',
    cloudSyncStatus: 'Cloud & Local Sync Status',
    activeAndSecure: 'Active & Encrypted Locally',
    footerBrandDesc: 'Powered by React 19, Express & Gemini 3.7 Flash',
    localDataPrivacy: 'Local Client Sovereignty',
    serverAiProxy: 'Server-side AI Proxy',
    resetSampleData: 'Reset Sample Data',
    resetConfirmMessage: 'Reset all data back to original defaults?',
  },
  tr: {
    appName: 'Akıllı Asistan & Mimari Planlama Merkezi',
    appSubtitle: 'Çok Fonksiyonlu AI Asistanı ve Modern Sistem Mimari Merkezi',
    modelBadge: 'Gemini 3.7',
    hub: 'Merkez',
    blueprint: 'Mimari Plan (Blueprint)',
    assistant: 'AI Asistan',
    calendar: 'Takvim & Zaman Çizelgesi',
    knowledge: 'Bilgi Kasası',
    projects: 'Proje Şablonları',
    codingStudio: 'Kodlama & Geliştirici Stüdyosu',
    imageStudio: 'AI Resim & Sanat Stüdyosu',
    languageTutor: 'AI Dil Koçu',
    contractBuilder: 'Resmi Sözleşme & Belge',
    mindfulness: 'Farkındalık & Nefes',
    cloudSync: 'Bulut Yedekleme',
    financeAndHabits: 'Alışkanlık & Finans',
    tasksAndNotes: 'Görevler & Notlar',
    focusAndTools: 'Odak & Araçlar',
    flashcards: 'Bilgi Kartları & Test',
    mindmap: 'Zihin Haritası',
    standup: 'Günlük Rapor & Özet',
    promptlab: 'İstem Atölyesi',
    voicememo: 'Sesli Not & Yazıya Dökme',
    analytics: 'Performans Analitiği',
    okr: 'Akıllı Hedefler (OKR)',
    webreader: 'Web Makale Okuyucu',
    exporter: 'Belge & PDF Dışa Aktarma',
    morningBriefing: 'Sabah Brifingi',
    commandPalette: 'Komut Merkezi (Ctrl+K)',
    searchAll: 'Genel Arama',
    settings: 'Ayarlar & Yedekleme',
    sixPillars: '6 Temel Direk',
    switchLang: 'Dil Seçimi',
    themeToggle: 'Görünüm Modu',
    themeLight: 'Açık Mod',
    themeDark: 'Karanlık Mod',
    themeMidnight: 'Gece Mavisi (Midnight)',
    themeOled: 'Tam Siyah (OLED Black)',
    themeSepia: 'Göz Koruma Sıcak Mod (Sepia)',
    voiceInputTitle: 'Sesli Giriş',
    voiceInputListening: 'Dinleniyor... Konuşabilirsiniz',
    voiceInputStart: 'Sesli Konuşmayı Başlat',
    voiceInputStop: 'Ses Girişini Durdur',
    speakResponse: 'Sesli Oku',
    stopSpeaking: 'Sesi Kapat',
    voiceNotSupported: 'Tarayıcınız ses tanımayı desteklemiyor',
    welcomeBadge: 'Çok Fonksiyonlu Modern Asistan Uygulaması & Web Mimarisi',
    heroTitle: 'Kapsamlı Akıllı Asistan & Proje Mimari Çalışma Alanınıza Hoş Geldiniz!',
    heroDesc: 'Kişisel çok fonksiyonlu modern asistan web uygulamanızı tasarlamak, sistem planlarını yapılandırmak, görev ve notları yönetmek ve Gemini AI yapay zekasından güç almak için özel olarak inşa edildi.',
    askAiPlaceholder: 'AI asistana dilediğinizi sorun (örn: "Bana sistem mimari planı hazırla")...',
    askAiBtn: 'Sor',
    pillarsMetricLabel: 'Temel Mimari Direkleri',
    roadmapMilestonesDone: 'Tamamlanan Yol Haritası Adımları',
    trackedTasks: 'Kayıtlı Görevler',
    pending: 'Bekliyor',
    aiEngineLabel: 'Çok Modlu LLM Motoru',
    pillarsSectionTitle: '🏛️ Çok Fonksiyonlu Uygulamanın 6 Temel Mimari Direği',
    pillarsSectionDesc: 'Kişisel asistan ve web platformunuz için özel olarak hazırlanan teknik mimari yol haritası',
    exploreFullBlueprint: 'Tüm Planı İncele',
    techStackChoices: 'Teknoloji Tercihi',
    details: 'Detaylar',
    quickActionsTitle: '⚡ Hızlı İşlemler & Pratik Araçlar',
    customPlanCardTitle: 'Özel Mimari Plan Oluşturucu',
    customPlanCardDesc: 'Her türlü proje fikri için yapay zeka ile teknik mimari plan üretin',
    codeGuruCardTitle: 'Kod & API Mimarı',
    codeGuruCardDesc: 'TypeScript, React ve Node.js için temiz kod ve yapılandırmalar oluşturun',
    translateCardTitle: 'Akıllı Çok Dilli Çevirmen',
    translateCardDesc: 'Uygurca, Türkçe, Arapça, İngilizce ve Çince arasında akıcı ve bağlamsal çeviri',
    pomodoroCardTitle: '25dk Pomodoro & Doğa Sesleri',
    pomodoroCardDesc: 'Sıfır gecikmeli sentezlenmiş yağmur ve beyaz gürültü ile derin odaklanma sayacı',
    todayTasksTitle: 'Bugünün Görevleri & Hedefleri',
    manageAll: 'Tümünü Yönet',
    smartNotesTitle: 'Akıllı Notlar & Bilgi Bankası',
    openNotepad: 'Not Defterini Aç',
    masterPlanBadge: 'Sistem Mimari Planı (System Blueprint)',
    blueprintMainTitle: 'Çok Fonksiyonlu Modern Asistan ve Web Platformu Tasarım Planı',
    blueprintMainDesc: 'UI/UX, yapay zeka entegrasyonu, mikroservisler, veri gizliliği ve aşamalı yol haritasını içeren uçtan uca mimari şartname.',
    exportMarkdown: 'Markdown Olarak İndir (.md)',
    sixCorePillarsTab: '🏛️ 6 Temel Direk',
    phaseRoadmapTab: '🚀 Aşamalı Yol Haritası',
    aiCustomPlanTab: '✨ AI Özel Plan Oluşturucu',
    selectPillarTitle: 'İncelemek İçin Bir Direk Seçin',
    pillarNumber: 'Bölüm No',
    coreFeaturesHeading: '✨ Temel Özellikler & Amaçlar',
    techStackHeading: '💻 Önerilen Teknoloji Yığını & Gerekçeleri',
    techCategory: 'Kategori',
    techName: 'Teknoloji',
    techPurpose: 'Amaç & Avantajlar',
    architecturalNotesHeading: '📐 Mimari Tasarım İlkeleri',
    roadmapProgressHeading: '🚀 Aşamalı Proje Geliştirme Yol Haritası',
    roadmapProgressDesc: '4 temel mimari uygulama aşamasındaki görevleri tamamlayarak genel ilerlemeyi takip edin.',
    overallProgress: 'Genel İlerleme',
    customPlanTitle: 'Özel Uygulama & Web Sitesi Mimarisi Üretin',
    customPlanDesc: 'Hayalinizdeki proje fikrini açıklayın, Gemini 3.7 Flash sizin için detaylı bir teknik mimari plan hazırlasın.',
    projectIdeaLabel: 'Proje veya Uygulama Fikri:',
    projectIdeaPlaceholder: 'Örn: Sesli komutlu ve çevrimdışı not tutabilen çok fonksiyonlu kişisel verimlilik asistanı...',
    targetPlatformLabel: 'Hedef Platform:',
    generateBlueprintBtn: 'Mimari Planı Oluştur',
    generatingBlueprint: 'Plan Hazırlanıyor...',
    generatedPlanBadge: '🎉 Yapay Zeka Tarafından Oluşturulan Plan',
    universalAiAssistant: 'Genel AI Asistanı',
    generatingResponse: 'Cevap hazırlanıyor...',
    chatPlaceholder: 'AI Asistanınıza dilediğinizi yazın (örn: "Sistem mimarisini analiz et")...',
    sendBtn: 'Gönder',
    exportChat: 'Sohbeti Kaydet (.md)',
    clearChat: 'Sohbeti Temizle',
    quickSuggestions: '💡 Hızlı Başlangıç Önerileri:',
    calendarTitle: 'Akıllı Takvim & Zaman Bloklama (Time-Blocking)',
    calendarDesc: 'Günlük görevlerinizi akıllıca 24 saatlik odak bloklarına yerleştirin ve organize edin.',
    today: 'Bugün',
    addEvent: 'Etkinlik Ekle',
    eventTitle: 'Etkinlik Başlığı',
    eventStartTime: 'Başlangıç Saati',
    eventEndTime: 'Bitiş Saati',
    eventCategory: 'Kategori',
    aiOptimizeSchedule: 'AI ile Çizelgeyi Optimize Et',
    optimizingSchedule: 'Gününüz planlanıyor...',
    timeBlocksHeading: 'Bugünün Zaman Blokları',
    noEventsScheduled: 'Bugün için planlanan etkinlik yok. Yeni ekleyin veya AI ile otomatik oluşturun!',
    knowledgeTitle: 'Kişisel Bilgi Kasası & Belge Zekası (RAG)',
    knowledgeDesc: 'Belge ve metin yükleyin, yapay zeka ile anında özetleyin, önemli çıkarımlar alın ve soru sorun.',
    uploadDocument: 'Belge veya Metin Ekle',
    supportedFileTypes: 'Desteklenenler: .txt, .md, .json, .ts, PDF metinleri',
    analyzingDocument: 'Yapay zeka belgeyi inceliyor...',
    keyInsightsHeading: '🔑 Önemli Çıkarımlar & Noktalar',
    docSummaryHeading: '📋 Yönetici Özeti',
    askDocQuestion: 'Bu belge hakkında soru sorun...',
    searchKnowledge: 'Bilgi kasasında ara...',
    noDocsYet: 'Henüz belge yüklenmedi. Kişisel kütüphanenizi oluşturmak için bir belge ekleyin!',
    projectsTitle: 'Proje Mimarı & Kod İskeletleri Merkezi',
    projectsDesc: 'Mimari planları hazır proje iskelelerine, kod şablonlarına ve çıktılara dönüştürün.',
    createNewProject: 'Yeni Proje Taslağı',
    projectTemplates: 'Hazır Mimari Şablonlar',
    exportGithubZip: 'Kodu İndir / ZIP',
    codePlayground: 'Canlı Kod Alanı',
    filesStructure: 'Klasör ve Dosya Yapısı',
    habitsAndFinanceTitle: 'Alışkanlık Takibi & Kişisel Bütçe Yönetimi',
    habitsAndFinanceDesc: 'Günlük alışkanlık serilerini sürdürün ve yapay zeka tavsiyeleriyle finansal kontrolü sağlayın.',
    dailyHabitsTab: '🔥 Günlük Alışkanlıklar',
    financeBudgetTab: '💰 Bütçe & Nakit Akışı',
    currentStreak: 'Mevcut Seri',
    bestStreak: 'En İyi Rekor',
    addHabit: 'Alışkanlık Ekle',
    habitTitle: 'Alışkanlık Adı',
    income: 'Toplam Gelir',
    expense: 'Toplam Gider',
    netSavings: 'Net Birikim',
    addTransaction: 'Gelir/Gider Ekle',
    transactionAmount: 'Miktar ($)',
    aiFinanceAdvisor: 'AI Finans & Bütçe Koçu',
    analyzingFinances: 'Finansal durum analiz ediliyor...',
    productivityHubTitle: 'Kişisel Verimlilik ve Bilgi Merkezi',
    productivityHubDesc: 'Hedefleri yapay zeka ile küçük adımlara bölme, görev yönetimi ve Markdown not defteri.',
    tasksLabel: 'Görevler',
    notesLabel: 'Notlar',
    createNewTask: 'Yeni Görev Ekle',
    taskTitleLabel: 'Görev Başlığı:',
    taskTitlePlaceholder: 'Örn: Mobil UI sistem tasarımını tamamla...',
    categoryLabel: 'Kategori:',
    priorityLabel: 'Öncelik:',
    addTaskBtn: 'Görevi Ekle',
    aiBreakdown: 'AI ile Böl',
    breakingDown: 'Bölünüyor...',
    actionableSteps: 'Eyleme Geçirilebilir Alt Adımlar:',
    noTasksYet: 'Henüz görev yok. Başlamak için yeni bir görev oluşturun!',
    searchNotesPlaceholder: 'Notlarda ara...',
    newNoteBtn: 'Yeni Not',
    noteTitlePlaceholder: 'Not Başlığı...',
    aiSummarizeNote: 'AI ile Özetle',
    aiExpandNote: 'AI ile Genişlet',
    saveNote: 'Kaydet',
    tagsPlaceholder: 'Etiketler (virgülle ayırın: plan, yazılım)...',
    noteContentPlaceholder: 'Notlarınızı Markdown formatında buraya yazın...',
    noNoteSelected: 'Görüntülemek için soldan bir not seçin veya yeni bir not oluşturun.',
    planningCat: '📋 Planlama',
    devCat: '💻 Geliştirme',
    designCat: '🎨 Tasarım',
    personalCat: '👤 Kişisel',
    highPriority: '🔴 Yüksek (High)',
    medPriority: '🟡 Orta (Medium)',
    lowPriority: '🟢 Düşük (Low)',
    focusToolsTitle: 'Derin Odaklanma & Akıllı Hızlandırıcılar',
    focusToolsDesc: 'Pomodoro zaman yönetimi, sentetik doğa sesleri ve yapay zeka destekli üretkenlik araçları.',
    twentyFiveMinFocus: '25dk Odak',
    fiveMinBreak: '5dk Mola',
    fifteenMinLongBreak: '15dk Uzun Mola',
    deepFocusSession: 'Derin Odaklanma Seansı',
    restAndRecharge: 'Kısa Dinlenme & Şarj',
    startFocus: 'Başlat',
    pauseFocus: 'Durdur',
    completedSessions: 'Tamamlanan Seanslar:',
    ambientSoundscapes: 'Doğa Sesleri (Web Audio Synth)',
    ambientSoundscapesDesc: 'Harici ses dosyasına ihtiyaç duymadan doğrudan tarayıcınızda üretilen akıllı ortam sesleri.',
    rainSound: 'Yağmur',
    whiteNoiseSound: 'Beyaz Gürültü',
    zenDroneSound: 'Dinginlik (Zen)',
    aiAcceleratorsTitle: 'Yapay Zeka Verimlilik Araçları',
    aiAcceleratorsDesc: 'Tek tıkla hedef parçalama, çeviri yapma ve kod taslakları üretme.',
    toLang: 'Hedef Dil:',
    processWithAi: 'AI ile İşle',
    executingAi: 'İşleniyor...',
    aiResultBadge: '🎉 Sonuç:',
    saveToNotes: 'Notlara Kaydet',
    saved: 'Kaydedildi!',
    dataSettingsTitle: 'Veri Yönetimi, Yedekleme & Bulut Senkronizasyonu',
    dataSettingsDesc: 'Veri egemenliği tamamen sizde. Tüm asistan verilerinizi JSON olarak dışa aktarın veya geri yükleyin.',
    exportFullBackup: 'Tam JSON Yedeği İndir',
    importBackup: 'JSON Yedeğini İçe Aktar',
    cloudSyncStatus: 'Bulut ve Yerel Eşitleme Durumu',
    activeAndSecure: 'Aktif ve Yerel Olarak Şifreli',
    footerBrandDesc: 'React 19, Express & Gemini 3.7 Flash ile modern olarak geliştirildi',
    localDataPrivacy: 'Yerel Veri Egemenliği & Gizlilik',
    serverAiProxy: 'Sunucu Taraflı Güvenli AI Proxy',
    resetSampleData: 'Varsayılan Verileri Geri Yükle',
    resetConfirmMessage: 'Tüm örnek verileri varsayılan ayarlara sıfırlamak istiyor musunuz?',
  },
  ar: {
    appName: 'المساعد الذكي ومركز المخطط الهيكلي',
    appSubtitle: 'مساعد ذكاء اصطناعي متعدد الوظائف ومخطط معماري حديث للأنظمة',
    modelBadge: 'Gemini 3.7',
    hub: 'المركز الرئيسي',
    blueprint: 'المخطط الهيكلي (Blueprint)',
    assistant: 'المساعد الذكي',
    calendar: 'التقويم والجدول الزمني',
    knowledge: 'قاعدة المعرفة',
    projects: 'نماذج المشاريع',
    codingStudio: 'استوديو البرمجة والتطوير',
    imageStudio: 'استوديو الصور والفن الذكي',
    languageTutor: 'معلم اللغات الذكي',
    contractBuilder: 'العقود والوثائق الرسمية',
    mindfulness: 'الراحة والتنفس الذهني',
    cloudSync: 'المزامنة السحابية',
    financeAndHabits: 'العادات والميزانية',
    tasksAndNotes: 'المهام والملاحظات',
    focusAndTools: 'التركيز والأدوات',
    flashcards: 'بطاقات الاستذكار والاختبار',
    mindmap: 'الخرائط الذهنية',
    standup: 'التقرير اليومي والتأمل',
    promptlab: 'مختبر الأوامر',
    voicememo: 'المذكرات الصوتية والتحويل الذكي',
    analytics: 'تحليلات الأداء والإنتاجية',
    okr: 'الأهداف الذكية (OKRs)',
    webreader: 'قارئ ومحلل المقالات',
    exporter: 'استوديو المستندات وتصدير PDF',
    morningBriefing: 'الإحاطة الصباحية',
    commandPalette: 'لوحة الأوامر السريعة (Ctrl+K)',
    searchAll: 'بحث شامل في النظام',
    settings: 'الإعدادات والنسخ الاحتياطي',
    sixPillars: '٦ ركائز',
    switchLang: 'تغيير اللغة',
    themeToggle: 'وضع المظهر',
    themeLight: 'الوضع الفاتح',
    themeDark: 'الوضع الداكن',
    themeMidnight: 'الوضع الليلي الأزرق (Midnight)',
    themeOled: 'الأسود التام (OLED Black)',
    themeSepia: 'حماية العين الدافئ (Sepia)',
    voiceInputTitle: 'الإدخال الصوتي',
    voiceInputListening: 'جاري الاستماع... تحدث الآن',
    voiceInputStart: 'بدء الإدخال الصوتي',
    voiceInputStop: 'إيقاف الإدخال الصوتي',
    speakResponse: 'قراءة صوتية',
    stopSpeaking: 'إيقاف الصوت',
    voiceNotSupported: 'متصفحك لا يدعم التعرف على الصوت',
    welcomeBadge: 'منصة معمارية متطورة لتطبيقات ومواقع الويب متعددة الوظائف',
    heroTitle: 'مرحبًا بك في مساحة عمل المساعد الذكي والمخطط الهيكلي الشاملة!',
    heroDesc: 'صُممت هذه المنصة خصيصًا لمساعدتك في هندسة تطبيق الويب الذكي متعدد الوظائف، وهيكلة المخططات البرمجية، وتنظيم المهام والملاحظات، والاستفادة من قدرات نموذج Gemini 3.7 الذكية.',
    askAiPlaceholder: 'اسأل المساعد الذكي عن أي فكرة أو كود أو مخطط تريده...',
    askAiBtn: 'اسأل الذكاء',
    pillarsMetricLabel: 'الركائز المعمارية الأساسية',
    roadmapMilestonesDone: 'مراحل خارطة الطريق المنجزة',
    trackedTasks: 'المهام المجدولة',
    pending: 'قيد الانتظار',
    aiEngineLabel: 'محرك الذكاء الاصطناعي',
    pillarsSectionTitle: '🏛️ الركائز المعمارية الـ ٦ لتطبيق وموقع متكامل',
    pillarsSectionDesc: 'المخطط الهندسي عالي المستوى المصمم خصيصًا لمساعدك الشخصي ومنصتك الرقمية',
    exploreFullBlueprint: 'استعراض المخطط بالكامل',
    techStackChoices: 'خيارات تقنية',
    details: 'التفاصيل',
    quickActionsTitle: '⚡ إجراءات سريعة وأدوات فورية',
    customPlanCardTitle: 'منشئ المخططات المخصصة',
    customPlanCardDesc: 'توليد خطة هندسية تقنية متكاملة لأي فكرة مشروع في ثوانٍ',
    codeGuruCardTitle: 'خبير الأكواد وواجهات API',
    codeGuruCardDesc: 'توليد أكواد TypeScript وReact وأنظمة Express نظيفة وآمنة',
    translateCardTitle: 'المترجم الذكي متعدد اللغات',
    translateCardDesc: 'ترجمة دقيقة وسياقية بين الأويغورية، التركية، العربية، الإنجليزية والصينية',
    pomodoroCardTitle: 'مؤقت بومودورو وأصوات الطبيعة',
    pomodoroCardDesc: 'مؤقت تركيز عميق مع أصوات طبيعية مُولدة رقمياً بدون تأخير',
    todayTasksTitle: 'مهام وأهداف اليوم',
    manageAll: 'إدارة الكل',
    smartNotesTitle: 'الملاحظات الذكية وقاعدة المعرفة',
    openNotepad: 'فتح دفتر الملاحظات',
    masterPlanBadge: 'المخطط الهيكلي الرئيسي (System Blueprint)',
    blueprintMainTitle: 'مخطط التصميم الهندسي للمساعد الحديث ومنصة الويب الشاملة',
    blueprintMainDesc: 'مواصفات معمارية شاملة تغطي واجهة المستخدم، مسارات الذكاء الاصطناعي، الخدمات المصغرة، الخصوصية ومراحل الإطلاق.',
    exportMarkdown: 'تصدير بصيغة Markdown (.md)',
    sixCorePillarsTab: '🏛️ الركائز الـ ٦ الأساسية',
    phaseRoadmapTab: '🚀 خارطة طريق التنفيذ',
    aiCustomPlanTab: '✨ منشئ المخططات بالذكاء الاصطناعي',
    selectPillarTitle: 'اختر ركيزة للاطلاع على تفاصيلها',
    pillarNumber: 'رقم الركيزة',
    coreFeaturesHeading: '✨ الميزات والقدرات الأساسية',
    techStackHeading: '💻 حزمة التقنيات الموصى بها والمبررات',
    techCategory: 'المجال',
    techName: 'التقنية',
    techPurpose: 'الهدف والمزايا',
    architecturalNotesHeading: '📐 أفضل الممارسات الهندسية والمعمارية',
    roadmapProgressHeading: '🚀 خارطة طريق التنفيذ المرحلي للمشروع',
    roadmapProgressDesc: 'تتبع تقدم المهام عبر المراحل الهندسية الأربع وصولاً إلى الإطلاق النهائي.',
    overallProgress: 'التقدم العام',
    customPlanTitle: 'توليد مخطط معماري مخصص لمشروعك',
    customPlanDesc: 'صف فكرة تطبيقك أو موقعك، وسيقوم نموذج Gemini 3.7 Flash بتوليد مخطط تقني وخارطة طريق مفصلة.',
    projectIdeaLabel: 'فكرة المشروع أو التطبيق:',
    projectIdeaPlaceholder: 'مثال: تطبيق مساعد شخصي متعدد الوظائف يدعم الأوامر الصوتية والملاحظات بدون إنترنت...',
    targetPlatformLabel: 'المنصة المستهدفة:',
    generateBlueprintBtn: 'توليد المخطط الهيكلي',
    generatingBlueprint: 'جاري إنشاء المخطط...',
    generatedPlanBadge: '🎉 المخطط المعماري المُولد بالذكاء الاصطناعي',
    universalAiAssistant: 'المساعد الذكي الشامل',
    generatingResponse: 'جاري صياغة الإجابة...',
    chatPlaceholder: 'اكتب سؤالك أو استفسارك للمساعد الذكي...',
    sendBtn: 'إرسال',
    exportChat: 'تصدير المحادثة (.md)',
    clearChat: 'مسح المحادثة',
    quickSuggestions: '💡 مقترحات سريعة للبدء:',
    calendarTitle: 'التقويم الذكي وحزم الوقت (Time-Blocking)',
    calendarDesc: 'تنظيم مهامك اليومية ضمن حزم زمنية دقيقة لرفع مستوى التركيز والإنتاجية.',
    today: 'اليوم',
    addEvent: 'إضافة موعد/مهمة',
    eventTitle: 'عنوان الموعد',
    eventStartTime: 'وقت البدء',
    eventEndTime: 'وقت الانتهاء',
    eventCategory: 'التصنيف',
    aiOptimizeSchedule: 'تنظيم الجدول بالذكاء الاصطناعي',
    optimizingSchedule: 'جاري تحسين جدول اليوم...',
    timeBlocksHeading: 'حزم وقت اليوم',
    noEventsScheduled: 'لا توجد مواعيد مجدولة لهذا اليوم. أضف موعداً أو دع الذكاء الاصطناعي ينظمه!',
    knowledgeTitle: 'قاعدة المعرفة وتحليل المستندات (RAG)',
    knowledgeDesc: 'ارفع ملفاتك ومستنداتك لتلخيصها فورياً، استخراج النقاط الجوهرية، وإجراء محادثات مستندة إليها.',
    uploadDocument: 'إضافة مستند أو نص',
    supportedFileTypes: 'الملفات المدعومة: .txt, .md, .json, .ts, نصوص PDF',
    analyzingDocument: 'جاري تحليل المستند بالذكاء الاصطناعي...',
    keyInsightsHeading: '🔑 النقاط الجوهرية والتحليلات',
    docSummaryHeading: '📋 الملخص التنفيذي',
    askDocQuestion: 'اطرح سؤالاً حول هذا المستند...',
    searchKnowledge: 'بحث في قاعدة المعرفة...',
    noDocsYet: 'لا توجد مستندات بعد. أضف مستنداً لبدء بناء مكتبتك الشخصية!',
    projectsTitle: 'مهندس المشاريع وقوالب الأكواد البرمجية',
    projectsDesc: 'تحويل المخططات الهندسية إلى هياكل برمجية متكاملة وقابلة للتصدير.',
    createNewProject: 'مخطط مشروع جديد',
    projectTemplates: 'قوالب جاهزة',
    exportGithubZip: 'تصدير الكود / ZIP',
    codePlayground: 'محرر ومستعرض الكود المباشر',
    filesStructure: 'هيكل المجلدات والملفات',
    habitsAndFinanceTitle: 'بناء العادات وإدارة الميزانية الشخصية',
    habitsAndFinanceDesc: 'تتبع استمرارية العادات اليومية والحفاظ على إدارة مالية ذكية ومحكمة.',
    dailyHabitsTab: '🔥 العادات اليومية المتتابعة',
    financeBudgetTab: '💰 الميزانية والتدفق المالي',
    currentStreak: 'التتابع الحالي',
    bestStreak: 'أفضل رقم قياسي',
    addHabit: 'إضافة عادة جديدة',
    habitTitle: 'اسم العادة',
    income: 'إجمالي الدخل',
    expense: 'إجمالي المصروفات',
    netSavings: 'صافي الادخار',
    addTransaction: 'تسجيل معاملة مالية',
    transactionAmount: 'المبلغ ($)',
    aiFinanceAdvisor: 'المستشار المالي الذكي',
    analyzingFinances: 'جاري تحليل الوضع المالي...',
    productivityHubTitle: 'مساحة الإنتاجية وإدارة المعرفة',
    productivityHubDesc: 'تفكيك الأهداف بالذكاء الاصطناعي، تتبع قوائم المهام، وتدوين الملاحظات بنظام Markdown.',
    tasksLabel: 'المهام',
    notesLabel: 'الملاحظات',
    createNewTask: 'إضافة مهمة جديدة',
    taskTitleLabel: 'عنوان المهمة:',
    taskTitlePlaceholder: 'مثال: إنهاء تصميم واجهات المستخدم لتطبيق الجوال...',
    categoryLabel: 'التصنيف:',
    priorityLabel: 'الأولوية:',
    addTaskBtn: 'إضافة المهمة',
    aiBreakdown: 'تفكيك بالذكاء',
    breakingDown: 'جاري التفكيك...',
    actionableSteps: 'الخطوات التنفيذية المقترحة:',
    noTasksYet: 'لا توجد مهام حتى الآن. أنشئ مهمة جديدة لتبدأ إنجازك!',
    searchNotesPlaceholder: 'البحث في الملاحظات...',
    newNoteBtn: 'ملاحظة جديدة',
    noteTitlePlaceholder: 'عنوان الملاحظة...',
    aiSummarizeNote: 'تلخيص ذكي',
    aiExpandNote: 'توسيع ذكي',
    saveNote: 'حفظ',
    tagsPlaceholder: 'الوسوم (مفصولة بفواصل: تخطيط، برمجة)...',
    noteContentPlaceholder: 'اكتب ملاحظاتك بنظام Markdown هنا...',
    noNoteSelected: 'اختر ملاحظة من القائمة الجانبية أو أنشئ ملاحظة جديدة.',
    planningCat: '📋 تخطيط',
    devCat: '💻 برمجة وتطوير',
    designCat: '🎨 تصميم واجهات',
    personalCat: '👤 شخصي',
    highPriority: '🔴 عاجل (High)',
    medPriority: '🟡 متوسط (Medium)',
    lowPriority: '🟢 عادي (Low)',
    focusToolsTitle: 'أدوات التركيز العميق ومسرعات الإنتاجية',
    focusToolsDesc: 'إدارة الوقت بنظام بومودورو، أصوات الطبيعة المصنعة رقميًا، وأدوات الذكاء الاصطناعي السريعة.',
    twentyFiveMinFocus: '٢٥د تركيز',
    fiveMinBreak: '٥د استراحة',
    fifteenMinLongBreak: '١٥د راحة طويلة',
    deepFocusSession: 'جلسة تركيز عميق',
    restAndRecharge: 'استراحة وتجديد النشاط',
    startFocus: 'ابدأ التركيز',
    pauseFocus: 'إيقاف مؤقت',
    completedSessions: 'الجلسات المكتملة:',
    ambientSoundscapes: 'أصوات الطبيعة (Web Audio Synth)',
    ambientSoundscapesDesc: 'أصوات طبيعية مولدة رقميًا بدون تحميل ملفات خارجية تضمن تدفق العمل بدون تشتيت.',
    rainSound: 'مطر',
    whiteNoiseSound: 'ضوضاء بيضاء',
    zenDroneSound: 'صفاء (Zen)',
    aiAcceleratorsTitle: 'مسرعات الإنتاجية بالذكاء الاصطناعي',
    aiAcceleratorsDesc: 'تفكيك الأهداف، ترجمة النصوص، وهندسة الأكواد بنقرة زر واحدة.',
    toLang: 'إلى اللغة:',
    processWithAi: 'معالجة بالذكاء الاصطناعي',
    executingAi: 'جاري التنفيذ...',
    aiResultBadge: '🎉 النتيجة:',
    saveToNotes: 'حفظ في الملاحظات',
    saved: 'تم الحفظ!',
    dataSettingsTitle: 'إدارة البيانات، النسخ الاحتياطي ومزامنة السحابة',
    dataSettingsDesc: 'سيادة كاملة على بياناتك. قم بتصدير حالتك بالكامل بصيغة JSON أو استيرادها متى شئت.',
    exportFullBackup: 'تصدير نسخة احتياطية كاملة (.json)',
    importBackup: 'استيراد نسخة احتياطية (.json)',
    cloudSyncStatus: 'حالة المزامنة السحابية والمحلية',
    activeAndSecure: 'نشط ومحمي محلياً',
    footerBrandDesc: 'تم التطوير باستخدام React 19 و Express ونموذج Gemini 3.7 Flash',
    localDataPrivacy: 'سيادة وخصوصية البيانات المحلية للمستخدم',
    serverAiProxy: 'خادم ذكاء اصطناعي آمن ومعزول',
    resetSampleData: 'استعادة البيانات الافتراضية',
    resetConfirmMessage: 'هل تريد إعادة ضبط كافة البيانات إلى القيم الافتراضية؟',
  }
};
