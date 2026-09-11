import { BlueprintPillar, RoadmapPhase, AssistantPersona, QuickTool, AppLanguage } from '../types';

export interface LocalizedBlueprintPillar {
  id: string;
  num: string;
  title: Record<AppLanguage, string>;
  icon: string;
  badge: Record<AppLanguage, string>;
  summary: Record<AppLanguage, string>;
  coreFeatures: Record<AppLanguage, string[]>;
  techChoices: {
    category: string;
    tech: string;
    purpose: Record<AppLanguage, string>;
  }[];
  architecturePoints: Record<AppLanguage, string[]>;
}

export interface LocalizedRoadmapPhase {
  id: string;
  phaseNumber: number;
  title: Record<AppLanguage, string>;
  duration: Record<AppLanguage, string>;
  badge: Record<AppLanguage, string>;
  description: Record<AppLanguage, string>;
  tasks: {
    id: string;
    title: Record<AppLanguage, string>;
    done: boolean;
  }[];
}

export interface LocalizedAssistantPersona {
  id: string;
  name: Record<AppLanguage, string>;
  tagline: Record<AppLanguage, string>;
  icon: string;
  description: Record<AppLanguage, string>;
  color: string;
  bgLight: string;
  promptSuggestions: Record<AppLanguage, string[]>;
}

export interface LocalizedQuickTool {
  id: string;
  name: Record<AppLanguage, string>;
  icon: string;
  desc: Record<AppLanguage, string>;
  actionType: 'translate' | 'breakdown-task' | 'summarize' | 'code-helper';
  placeholder: Record<AppLanguage, string>;
}

export const LOCALIZED_PILLARS: LocalizedBlueprintPillar[] = [
  {
    id: 'frontend-ui',
    num: '01',
    icon: 'Layout',
    title: {
      ug: 'UI/UX يۈزى ۋە كۆپ سۇپا كۆرۈنمىسى',
      en: 'Frontend & Cross-Device UI Architecture',
      tr: 'Frontend ve Çoklu Cihaz UI Mimarisi',
      ar: 'واجهة المستخدم والمعمارية متعددة الأجهزة (UI/UX)',
    },
    badge: {
      ug: 'ئىشلەتكۈچى تەجرىبىسى',
      en: 'User Experience',
      tr: 'Kullanıcı Deneyimi',
      ar: 'تجربة المستخدم',
    },
    summary: {
      ug: 'ئۇيغۇرچە/ئەرەبچە (RTL) ۋە ئىنگلىزچە/تۈركچە (LTR) تەبىئىي كۆرۈنۈشىگە ماس كېلىدىغان، زامانىۋى، كۆپ كۆزنەكلىك كۆرۈنمە يۈز سىستېمىسى.',
      en: 'A high-performance, fluid UI system supporting bi-directional typography (RTL/LTR), dark/light modes, and responsive layouts across desktop, tablet, and mobile.',
      tr: 'RTL (Arapça/Uygurca) ve LTR (Türkçe/İngilizce) çift yönlü tipografiyi, karanlık/aydınlık modları ve tüm cihazları destekleyen akıcı UI sistemi.',
      ar: 'نظام واجهات فائق السرعة يدعم الاتجاهين (RTL/LTR)، والوضع الليلي، والتصميم المتجاوب مع الحواسيب والأجهزة اللوحية والهواتف.',
    },
    coreFeatures: {
      ug: [
        'تولۇق كۆپ تىللىق قوش يۆنىلىشلىك يۈز (Bi-directional RTL/LTR)',
        'زامانىۋى كۆپ كۆزنەكلىك مەشغۇلات رايونى (Modular Dashboard & Bento Grid)',
        'سۈنئىي ئىدراك سۆھبەت رايونى، Markdown بېزەش ۋە كود يورۇتۇش',
        'تېز بۇيرۇق تاختىسى ۋە قولايلىق مەشغۇلات كونتروللىرى',
        'كۆچمە ئۈسكۈنىلەرگە تولۇق ماسلاشقان يان تاختا ۋە بارماق بېسىش تەجرىبىسى',
      ],
      en: [
        'Seamless multilingual bidirectional layout switching (RTL & LTR)',
        'Modular dashboard workspace with responsive grid card layouts',
        'Interactive AI chat interface with rich Markdown & code highlights',
        'Quick Command shortcuts for instant navigation and action triggering',
        'Mobile-first touch-friendly ergonomics with collapsible sidebars',
      ],
      tr: [
        'Kusursuz çift yönlü çok dilli düzen geçişi (RTL & LTR)',
        'Duyarlı kart ızgaralarına sahip modüler kontrol paneli çalışma alanı',
        'Zengin Markdown ve kod renklendirmeli etkileşimli AI sohbet arayüzü',
        'Hızlı gezinme ve eylem tetikleme için pratik komut çubuğu',
        'Katlanabilir yan paneller ile mobil öncelikli dokunmatik ergonomi',
      ],
      ar: [
        'تبديل سلس وثنائي الاتجاه لجميع اللغات (RTL و LTR)',
        'مساحة عمل تفاعلية بنظام البطاقات الشبكية الموديلية',
        'واجهة محادثة ذكية تدعم التنسيق المتقدم للأكواد وMarkdown',
        'لوحة أوامر سريعة للتنقل وتنفيذ المهام الفورية',
        'تجربة لمسية فائقة المرونة مخصصة للهواتف والشاشات المختلفة',
      ],
    },
    techChoices: [
      {
        category: 'Framework',
        tech: 'React 19 + TypeScript',
        purpose: {
          ug: 'يۇقىرى ئۈنۈملۈك تىپ بىخەتەرلىكى ۋە زاپچاسلارنى قايتا ئىشلىتىش',
          en: 'Type-safe, component-driven UI architecture',
          tr: 'Tip güvenli, bileşen odaklı modern UI mimarisi',
          ar: 'معمارية مكونات آمنة الأنواع وفائقة الأداء',
        },
      },
      {
        category: 'Styling',
        tech: 'Tailwind CSS v4',
        purpose: {
          ug: 'تېز، جانلىق ۋە زامانىۋى لايىھە كودلىرى',
          en: 'Utility-first modern responsive styling',
          tr: 'Modern, hızlı ve esnek yardımcı sınıf tabanlı tasarım',
          ar: 'تصميم فائق السرعة ومتجاوب بأحدث معايير الويب',
        },
      },
      {
        category: 'Animations',
        tech: 'Motion (Framer)',
        purpose: {
          ug: 'راۋان كۆرۈنۈش ئالمىشىش ۋە سەكرەش ئۈنۈملىرى',
          en: 'Fluid physics-based transition animations',
          tr: 'Akıcı ve doğal arayüz geçiş animasyonları',
          ar: 'حركات انتقالية انسيابية تعتمد على محاكاة الحركة الطبيعية',
        },
      },
      {
        category: 'Icons',
        tech: 'Lucide React',
        purpose: {
          ug: 'مۇكەممەل زامانىۋى سىنبەلگە ئامبىرى',
          en: 'Crisp, unified minimalist icon set',
          tr: 'Net, tutarlı ve minimalist modern ikon kütüphanesi',
          ar: 'مجموعة أيقونات موحدة ودقيقة التصميم',
        },
      },
    ],
    architecturePoints: {
      ug: [
        'React Context ۋە State ئارقىلىق يەرلىك ھالەتنى مەركەزلىك باشقۇرۇش',
        'تەبىئىي خەت نۇسخىسى ۋە يۆنىلىشكە ماسلىشىشچان Typography سىستېمىسى',
        'PWA (Progressive Web App) ئارقىلىق يانفونغا ئەپ سۈپىتىدە قاچىلاش ئىمكانىيىتى',
      ],
      en: [
        'Centralized state management with lightweight React hooks and local stores',
        'Tailored typographic stack for crisp bidirectional script rendering',
        'Progressive Web App (PWA) readiness for native mobile standalone feel',
      ],
      tr: [
        'Hafif React hookları ve yerel depolar ile merkezi durum yönetimi',
        'Çift yönlü metinler için optimize edilmiş net tipografi yığını',
        'Cihaza doğrudan uygulama gibi kurulabilen PWA (Progressive Web App) desteği',
      ],
      ar: [
        'إدارة مركزية للحالة بالاعتماد على خطافات React ومخازن البيانات المحلية',
        'مجموعة خطوط منتقاة بعناية لتقديم نصوص واضحة في الاتجاهين',
        'جاهزية كاملة للعمل كتطبيق ويب تقدمي (PWA) قابل للتثبيت',
      ],
    },
  },
  {
    id: 'ai-engine',
    num: '02',
    icon: 'Bot',
    title: {
      ug: 'سۈنئىي ئىدراك يادروسى (AI Intelligence Engine)',
      en: 'AI Intelligence & LLM Orchestration',
      tr: 'Yapay Zeka Motoru & LLM Orkestrasyonu',
      ar: 'محرك الذكاء الاصطناعي وإدارة النماذج اللغوية',
    },
    badge: {
      ug: 'ئەقلىي يادرو',
      en: 'Core Intelligence',
      tr: 'Akıllı Çekirdek',
      ar: 'الذكاء الأساسي',
    },
    summary: {
      ug: 'مۇلازىمېتىر تەرەپتىكى Gemini 3.7 Flash مودېلى ئارقىلىق كۆپ خىل كەسپىي ئەقلىي ياردەمچى، تەرجىمە ۋە تۈر لايىھىلەش مېخانىزمى.',
      en: 'Server-side LLM pipeline powered by Gemini 3.7 Flash, providing multi-persona intelligence, code generation, real-time translations, and automated task planning.',
      tr: 'Gemini 3.7 Flash tarafından desteklenen, çoklu uzman kimlikleri, kod üretimi, anlık çeviri ve otomatik görev planlama sağlayan sunucu taraflı yapay zeka hattı.',
      ar: 'مسار معالجة ذكي من جانب الخادم مدعوم بنموذج Gemini 3.7 Flash لتوفير شخصيات ذكية متعددة، توليد الأكواد، الترجمة والتخطيط التلقائي.',
    },
    coreFeatures: {
      ug: [
        'كۆپ خىل خاس ياردەمچى خاراكتېرلىرى (لايىھىلىگۈچى، يازغۇچى، كود ئۇستىسى، ئۈنۈم ياردەمچىسى)',
        'سۈنئىي ئىدراك ئارقىلىق نىشاننى كۆپ كىچىك قەدەملەرگە ئايرىش (Task Decomposition)',
        'ئۇيغۇرچە، تۈركچە، ئەرەبچە، ئىنگلىزچە ۋە خەنزۇچە ئارىسىدا يۇقىرى سۈپەتلىك تەرجىمە',
        'مۇرەككەپ تېخنىكىلىق سوئاللار ۋە كود خاتالىقلىرىنى تېز تەھلىل قىلىپ جاۋاب بېرىش',
        'تەپەككۇر جەريانىنى بىخەتەر قوغداش ۋە ئاچقۇچ (API Key) نى پەقەت مۇلازىمېتىردا ساقلاش',
      ],
      en: [
        'Specialized Assistant Personas (Architect, Tech Lead, Writer, Productivity Coach)',
        'Automated Goal & Task decomposition into actionable milestones',
        'Deep multilingual translation & text polishing (Uyghur, Turkish, Arabic, English, Chinese)',
        'Full-stack code generation, refactoring, and debugging assistance',
        'Server-side API key proxy isolation ensuring complete security',
      ],
      tr: [
        'Özelleştirilmiş Uzman Asistan Kimlikleri (Mimar, Kod Ustası, Yazar, Verimlilik Koçu)',
        'Hedef ve görevleri uygulanabilir adımlara otomatik ayrıştırma',
        'Derin çok dilli çeviri ve metin parlatma (Uygurca, Türkçe, Arapça, İngilizce, Çince)',
        'Uçtan uca kod üretimi, refactoring ve hata ayıklama desteği',
        'API anahtarını tamamen gizleyen güvenli sunucu proxy izolasyonu',
      ],
      ar: [
        'شخصيات ذكاء اصطناعي متخصصة (مهندس معماري، خبير برمجي، كاتب، مدرب إنتاجية)',
        'تفكيك تلقائي للأهداف والمشاريع إلى خطوات عملية محددة',
        'ترجمة ذكية فائقة الدقة (الأويغورية، التركية، العربية، الإنجليزية، الصينية)',
        'توليد وتصحيح الأكواد البرمجية وتحسين الأداء',
        'عزل أمني تام لمفاتيح API داخل خادم الباك إند بعيداً عن المتصفح',
      ],
    },
    techChoices: [
      {
        category: 'AI Model',
        tech: 'Gemini 3.7 Flash',
        purpose: {
          ug: 'تېز تېپىش ۋە كۈچلۈك ئەقلىي تەپەككۇر ئىقتىدارى',
          en: 'Ultra-fast multimodal reasoning and tool usage',
          tr: 'Ultra hızlı çok modlu akıl yürütme ve araç kullanımı',
          ar: 'استدلال فائق السرعة ومتعدد الوسائط',
        },
      },
      {
        category: 'Backend SDK',
        tech: '@google/genai (Node.js)',
        purpose: {
          ug: 'ئەڭ يېڭى رەسمىي سۈنئىي ئىدراك كېڭەيتىلمىسى',
          en: 'Official next-gen Google GenAI TypeScript SDK',
          tr: 'Resmi yeni nesil Google GenAI TypeScript SDK',
          ar: 'حزمة أدوات Google GenAI الرسمية والحديثة',
        },
      },
      {
        category: 'Server API',
        tech: 'Express / REST Endpoints',
        purpose: {
          ug: 'يۈك باشقۇرۇش ۋە بىخەتەر تەلەپلەرنى بىر تەرەپ قىلىش',
          en: 'Modular API routing with structured error handling',
          tr: 'Yapılandırılmış hata yönetimli modüler API yönlendirmesi',
          ar: 'توجيه طلبات منظم وآمن لمعالجة الأخطاء والمدخلات',
        },
      },
    ],
    architecturePoints: {
      ug: [
        'ھەر بىر سوئال-جاۋابقا كىرىدىغان System Prompt ئارقىلىق راۋان مەدەنىيەت ئارقا كۆرۈنۈشىنى ساقلاش',
        'سۆھبەت تارىخىنى قىسقارتىپ ۋە رەتلەپ مودېلغا ئەۋەتىش ئارقىلىق ئۈنۈمنى ئاشۇرۇش',
        'كەلگۈسىدە Function Calling (قورال ئىشلىتىش) ۋە ھۆججەت ئوقۇتۇش (RAG) قوشۇشقا ماسلىشىش',
      ],
      en: [
        'Dynamic persona-driven system prompting with authentic multilingual linguistics',
        'Context token window optimization for low latency and high relevance',
        'Ready for Tool Calling, Web Grounding, and Retrieval-Augmented Generation (RAG)',
      ],
      tr: [
        'Zengin çok dilli bağlama uygun dinamik uzman yönlendirme sistemi',
        'Düşük gecikme ve yüksek alaka düzeyi için optimize edilmiş bağlam penceresi',
        'Araç çağırma (Tool Calling) ve RAG (Doküman okuma) genişletmelerine hazır yapı',
      ],
      ar: [
        'توجيه منهجي ذكي يحافظ على بلاغة وسياق كل لغة بدقة',
        'تحسين نافذة السياق لتقليل وقت الاستجابة وزيادة الدقة',
        'جاهزية لتكامل استدعاء الدوال وربط البيانات الخارجية (RAG)',
      ],
    },
  },
  {
    id: 'productivity-suite',
    num: '03',
    icon: 'CheckSquare',
    title: {
      ug: 'شەخسىي ئۈنۈم ۋە باشقۇرۇش قوراللىرى',
      en: 'Personal Productivity & Utility Suite',
      tr: 'Kişisel Verimlilik ve Araç Seti',
      ar: 'أجنحة الإنتاجية وإدارة المهام الشخصية',
    },
    badge: {
      ug: 'ئۈنۈم مەركىزى',
      en: 'Productivity Hub',
      tr: 'Verimlilik Merkezi',
      ar: 'مركز الإنتاجية',
    },
    summary: {
      ug: 'شەخسىي ۋەزىپىلەرنى تەشكىللەش، نىشانلارنى جەدۋەللەشتۈرۈش، ئەقلىي خاتىرە قالدۇرۇش ۋە زېھىن مەركەزلەشتۈرۈش قوراللىرى بىر يەردە.',
      en: 'Integrated workflow engine with task kanban/checklists, Markdown knowledge base, Pomodoro timer, and soundscape generator for deep work.',
      tr: 'Görev listeleri, Markdown bilgi tabanı, Pomodoro sayacı ve derin çalışma için ortam sesi üreticisi içeren entegre iş akışı motoru.',
      ar: 'محرك عمل متكامل يشمل إدارة المهام، قاعدة معرفية بنظام Markdown، مؤقت بومودورو ومولد أصوات طبيعية للتركيز العميق.',
    },
    coreFeatures: {
      ug: [
        'ۋەزىپىلەرنى تۈر، دەرىجە ۋە نىشان بويىچە ئايرىپ باشقۇرۇش (Task Priority Manager)',
        'سۈنئىي ئىدراك ئارقىلىق چوڭ نىشاننى 5 مىنۇتتا قەدەممۇ-قەدەم ۋەزىپە قىلىپ چىقىرىش',
        'ھۆججەت ۋە پىكىرلەرنى سۈزۈك ساقلايدىغان ئەقلىي خاتىرە (Markdown Knowledge Base)',
        'پومودورو (Pomodoro 25/5) زېھىن مەركەزلەشتۈرۈش سائىتى ۋە تەبىئەت ئاۋازلىرى',
        'بىر كۈنلۈك پىلان ۋە ئېرىشكەن نەتىجىلەرنى تېز ئومۇملاشتۇرۇش',
      ],
      en: [
        'Flexible task priority management with categorized tagging and status tracking',
        'One-click AI breakdown converting high-level goals into step-by-step to-dos',
        'Markdown smart notepad with search, tagging, and AI summarization',
        'Built-in Pomodoro focus timer with relaxing ambient soundscapes (Synthesized Audio)',
        'Daily planner review and automated achievement recap',
      ],
      tr: [
        'Kategorize edilmiş etiketleme ve durum takibi ile esnek görev öncelik yönetimi',
        'Büyük hedefleri adım adım yapılacaklar listesine dönüştüren tek tıkla AI ayrıştırma',
        'Arama, etiketleme ve AI özetleme özellikli Markdown akıllı not defteri',
        'Sentezlenmiş rahatlatıcı ortam seslerine sahip entegre Pomodoro odak sayacı',
        'Günlük plan incelemesi ve otomatik başarı özeti',
      ],
      ar: [
        'إدارة مرنة للمهام مع تصنيف الأولويات وتتبع حالة الإنجاز',
        'تفكيك فوري للأهداف الكبيرة بنقرة زر إلى خطوات تنفيذية واضحة',
        'دفتر ملاحظات ذكي بنظام Markdown مع البحث، التصنيف وتلخيص الذكاء الاصطناعي',
        'مؤقت بومودورو مدمج مع أصوات طبيعية مولدة رقمياً لتهيئة بيئة التركيز',
        'مراجعة يومية للإنجازات والملخصات المعرفية',
      ],
    },
    techChoices: [
      {
        category: 'Audio Synthesis',
        tech: 'Web Audio API (Synthesizer)',
        purpose: {
          ug: 'سىرتقى ئاۋاز ھۆججىتى تەلەپ قىلماي يەرلىكتە پىچىرلاپ چىقىرىدىغان تەبىئەت ئاۋازلىرى',
          en: 'Zero-latency synthesized white noise & ambient audio',
          tr: 'Harici ses dosyası gerektirmeyen sıfır gecikmeli sentetik ortam sesi',
          ar: 'توليد فوري لأصوات الطبيعة والضوضاء البيضاء بدون تأخير عبر المتصفح',
        },
      },
      {
        category: 'Markdown Engine',
        tech: 'react-markdown',
        purpose: {
          ug: 'چىرايلىق تېكىست، تىزىملىك ۋە كود تۈزۈلۈشى',
          en: 'Standard semantic Markdown rendering',
          tr: 'Standart semantik Markdown metin ve kod işleme',
          ar: 'عرض متقدم ومنظم لنصوص وجداول وأكواد Markdown',
        },
      },
      {
        category: 'Storage',
        tech: 'LocalStorage + Cloud Ready',
        purpose: {
          ug: 'تور ئۈزۈلۈپ قالسىمۇ ئىشلەتكۈچىنىڭ سانلىق مەلۇماتىنى يوقاتماي ساقلاش',
          en: 'Offline-first robust persistence model',
          tr: 'İnternet olmasa dahi verileri koruyan çevrimdışı öncelikli kalıcılık',
          ar: 'حفظ واسترجاع فوري للبيانات محلياً حتى في حال انقطاع الاتصال',
        },
      },
    ],
    architecturePoints: {
      ug: [
        'Offline-First (تورسىزمۇ ئىشلەش) لايىھىسى — سانلىق مەلۇماتلار ئۈسكۈنىدە دەرھال ساقلىنىدۇ',
        'JSON ھالىتىدە بارلىق خاتىرە ۋە ۋەزىپىلەرنى چىقىرىۋېلىش (Export) ياكى ئىمپورت قىلىش',
      ],
      en: [
        'Offline-first client persistence guaranteeing data integrity even with flaky connections',
        'Full JSON data backup export & import capability for user autonomy',
      ],
      tr: [
        'Bağlantı kopsa bile veri bütünlüğünü garanti eden çevrimdışı öncelikli istemci modeli',
        'Kullanıcı veri bağımsızlığı için tam JSON yedekleme dışa/içe aktarma yeteneği',
      ],
      ar: [
        'نموذج حفظ محلي يضمن سلامة البيانات وسرعتها حتى بدون اتصال بالإنترنت',
        'إمكانية تصدير واستيراد كامل النسخ الاحتياطية بصيغة JSON بسهولة',
      ],
    },
  },
  {
    id: 'backend-architecture',
    num: '04',
    icon: 'Server',
    title: {
      ug: 'مۇلازىمېتىر ۋە مۇلازىمەت قۇرۇلمىسى (Backend Engine)',
      en: 'Backend API & Microservices Architecture',
      tr: 'Backend API ve Mikroservis Mimarisi',
      ar: 'معمارية خادم الباك إند والخدمات المصغرة',
    },
    badge: {
      ug: 'مۇلازىمېتىر قۇرۇلمىسى',
      en: 'Backend Core',
      tr: 'Sunucu Çekirdeği',
      ar: 'جوهر الخادم',
    },
    summary: {
      ug: 'Express + Node.js بىلەن قۇرۇلغان، تېز سۈرئەتلىك، مۇقىم ھەم بىخەتەر REST API مۇلازىمېتىرى.',
      en: 'A high-performance Express server providing secured API routing, rate limiting, request validation, and clean abstraction over external services.',
      tr: 'Güvenli API yönlendirmesi, istek doğrulaması ve harici servisler üzerinde temiz soyutlama sağlayan yüksek performanslı Express sunucusu.',
      ar: 'خادم Express فائق الأداء يوفر توجيهاً آمناً لواجهات API، والتحقق من المدخلات، وتجريداً سلساً للخدمات الخارجية.',
    },
    coreFeatures: {
      ug: [
        'بىخەتەر API ئېغىزلىرى (/api/chat, /api/generate-plan, /api/ai-tool)',
        'سۈنئىي ئىدراك ئاچقۇچى ۋە شەخسىي تەڭشەكلەرنىڭ مۇلازىمېتىردا مەخپىي قوغدىلىشى',
        'Vite مەشغۇلات مۇھىتى بىلەن بىرلىشىپ بىر پورت (Port 3000) ئارقىلىق تولۇق خىزمەت قىلىش',
        'خاتالىقلارنى چۈشىنىشلىك تۇتۇش ۋە خېرىدار تەرەپكە پايدىلىق ئۇچۇر قايتۇرۇش',
        'كەلگۈسىدە كۆپ ئىشلەتكۈچى ھېساباتى ۋە Cloud DB غا ئۇلاشقا تولۇق تەييار',
      ],
      en: [
        'Secure modular API endpoints (/api/chat, /api/generate-plan, /api/ai-tool)',
        'Zero-leakage secret isolation shielding Gemini keys completely from browsers',
        'Seamless single-port Vite middleware integration on port 3000',
        'Structured error recovery with graceful degradation fallbacks',
        'Extensible foundation ready for user auth (Firebase/OAuth) and Cloud SQL',
      ],
      tr: [
        'Güvenli modüler API uç noktaları (/api/chat, /api/generate-plan, /api/ai-tool)',
        'Gemini anahtarlarını tarayıcıdan tamamen izole eden sıfır sızıntılı gizlilik',
        '3000 numaralı bağlantı noktasında kusursuz tek portlu Vite ara yazılım entegrasyonu',
        'Zarif hata kurtarma ve geri dönüş mekanizmaları',
        'Kullanıcı kimlik doğrulaması ve Bulut Veritabanı entegrasyonuna hazır yapı',
      ],
      ar: [
        'نقاط نهاية API معيارية وآمنة للمحادثة، توليد المخططات، والأدوات السريعة',
        'عزل تام لأسرار النظام ومفاتيح Gemini بعيداً عن المتصفح',
        'تكامل كامل للواجهة والخادم عبر منفذ واحد موحد (Port 3000)',
        'معالجة استباقية للأخطاء مع بدائل ذكية في حالة الانقطاع',
        'أساس برمجي قابل للتوسع مع المصادقة (Firebase/OAuth) وقواعد البيانات السحابية',
      ],
    },
    techChoices: [
      {
        category: 'Runtime',
        tech: 'Node.js 22 + tsx',
        purpose: {
          ug: 'تېز تەرەققىيات ۋە ئىجرا مۇھىتى',
          en: 'Modern native TypeScript runtime',
          tr: 'Modern yerel TypeScript çalışma zamanı',
          ar: 'بيئة تشغيل TypeScript حديثة ومباشرة',
        },
      },
      {
        category: 'Web Framework',
        tech: 'Express 4.21',
        purpose: {
          ug: 'يېنىك ۋە دۇنياۋى مۇقىم API قۇرۇلمىسى',
          en: 'Lightweight, battle-tested REST server',
          tr: 'Hafif, kendini kanıtlamış kararlı REST sunucu çatısı',
          ar: 'إطار عمل خفيف ومجرب لبناء خوادم REST API',
        },
      },
      {
        category: 'Bundler',
        tech: 'esbuild (for dist/server.cjs)',
        purpose: {
          ug: 'مەھسۇلات ئىشلەپچىقىرىشتا بىر ھۆججەت قىلىپ ئىخچاملاش',
          en: 'Single-file production bundle with source maps',
          tr: 'Kaynak haritalı tek dosyalı üretim paketi',
          ar: 'حزم الخادم بالكامل في ملف تنفيذي موحد عالي الكفاءة',
        },
      },
    ],
    architecturePoints: {
      ug: [
        'CORS ۋە مۇداپىئە بىخەتەرلىكى',
        'Cloud Run ياكى ھەرقانداق Docker كونتېينېرىدا بىۋاسىتە ئىجرا بولۇش ماسلىشىشچانلىقى',
      ],
      en: [
        'Production-ready containerized deployment compatibility (Cloud Run / Docker)',
        'Strict input sanitization and unified response formatting',
      ],
      tr: [
        'Üretime hazır konteyner dağıtım uyumluluğu (Cloud Run / Docker)',
        'Sıkı girdi temizleme ve birleşik yanıt biçimlendirme',
      ],
      ar: [
        'جاهزية تامة للنشر السحابي داخل حاويات Docker أو Google Cloud Run',
        'تنقية صارمة للمدخلات وتوحيد هياكل الاستجابة',
      ],
    },
  },
  {
    id: 'data-security',
    num: '05',
    icon: 'ShieldCheck',
    title: {
      ug: 'سانلىق مەلۇمات، مەخپىيەتلىك ۋە بىخەتەرلىك',
      en: 'Data Persistence, Privacy & Security',
      tr: 'Veri Kalıcılığı, Gizlilik ve Güvenlik',
      ar: 'أمان البيانات، الخصوصية والحفظ المحلي',
    },
    badge: {
      ug: 'مەخپىيەتلىك',
      en: 'Privacy & Security',
      tr: 'Gizlilik ve Güvenlik',
      ar: 'الخصوصية والأمان',
    },
    summary: {
      ug: 'ئىشلەتكۈچىنىڭ مەخپىيەتلىكىنى ئەڭ ئالدىنقى ئورۇنغا قويغان، بىخەتەر، كۆپ قەۋەتلىك سانلىق مەلۇمات ساقلاش چارىسى.',
      en: 'Zero-trust architectural design keeping personal data, conversation histories, and notes protected with local client sovereignty and encrypted cloud bridges.',
      tr: 'Kişisel verileri, sohbet geçmişlerini ve notları yerel istemci egemenliği ve şifreli bulut köprüleriyle koruyan sıfır güven mimarisi.',
      ar: 'تصميم أمني منعدم الثقة (Zero-Trust) يحفظ خصوصية الملاحظات والمحادثات على جهاز المستخدم مع جسور تشفير سحابية آمنة.',
    },
    coreFeatures: {
      ug: [
        'شەخسىي سانلىق مەلۇمات ئىگىدارچىلىقى: خاتىرە ۋە سۆھبەتلەر ئۈسكۈنىدە بىخەتەر ساقلىنىدۇ',
        'سۈنئىي ئىدراكقا ئەۋەتىلىدىغان مەزمۇنلاردا شەخسىي ئاچقۇچ ۋە قىممەتلەر سۈزۈلىدۇ',
        'بىر كۇنۇپكا بىلەن بارلىق سانلىق مەلۇماتلارنى تازىلاش ياكى كۆچۈرۈش ئىقتىدارى',
        'HTTPS ۋە مەخپىيلەشتۈرۈلگەن سىفىرلىق ئالاقە يوللىرىنى ئىشلىتىش',
      ],
      en: [
        'Data sovereignty: notes and task records stored locally under user control',
        'Zero-leakage architecture: sensitive credentials never transmitted client-side',
        'One-click privacy reset & encrypted JSON export functionality',
        'HTTPS-only TLS 1.3 encrypted data transit',
      ],
      tr: [
        'Veri egemenliği: notlar ve görev kayıtları kullanıcının kontrolünde yerel olarak saklanır',
        'Sıfır sızıntı mimarisi: hassas kimlik bilgileri asla istemci tarafına iletilmez',
        'Tek tıkla gizlilik sıfırlama ve şifrelenebilir JSON dışa aktarma işlevi',
        'Yalnızca HTTPS ve TLS 1.3 şifreli veri aktarımı',
      ],
      ar: [
        'سيادة تامة على البيانات: حفظ كافة المهام والملاحظات محلياً تحت تصرف المستخدم',
        'بنية خالية من التسريبات: عدم إرسال مفاتيح الاعتماد الحساسة إلى المتصفح أبداً',
        'إمكانية محو البيانات بضغطة زر واحدة وتصديرها بصيغة JSON',
        'نقل مشفر لكافة البيانات عبر بروتوكولات HTTPS و TLS 1.3',
      ],
    },
    techChoices: [
      {
        category: 'Client DB',
        tech: 'IndexedDB / LocalStorage',
        purpose: {
          ug: 'يەرلىك، تېز سۈرئەتلىك سانلىق مەلۇمات ئەستە تۇتۇش',
          en: 'Local instant-access indexed persistence',
          tr: 'Anında erişimli yerel indeksli veri kalıcılığı',
          ar: 'تخزين مفهرس وفوري للبيانات محلياً في جهاز المستخدم',
        },
      },
      {
        category: 'Cloud DB Ready',
        tech: 'Firestore / Cloud SQL',
        purpose: {
          ug: 'كۆپ ئۈسكۈنىدە سىغدۇرۇش تەلەپ قىلىنغاندا ئۇلاش',
          en: 'Cloud database bridge for cross-device sync',
          tr: 'Cihazlar arası senkronizasyon için bulut veritabanı köprüsü',
          ar: 'جسر اتصال بقواعد البيانات السحابية لمزامنة الأجهزة المتعددة',
        },
      },
    ],
    architecturePoints: {
      ug: ['ئىشلەتكۈچىنىڭ رۇخسىتىسىز ھېچقانداق تېكىست ياكى پىكىر سىرتقا ئاشكارىلانمايدۇ'],
      en: ['Client-first data privacy model respecting user boundaries at all times'],
      tr: ['Kullanıcı sınırlarına daima saygı duyan istemci öncelikli veri gizliliği modeli'],
      ar: ['نموذج حماية يضع خصوصية ورغبة المستخدم في المقام الأول دائماً'],
    },
  },
  {
    id: 'dev-roadmap',
    num: '06',
    icon: 'Rocket',
    title: {
      ug: 'كېڭەيتىش ۋە تەرەققىيات پىلانى (Scalability)',
      en: 'Deployment, PWA & Scaling Roadmap',
      tr: 'Dağıtım, PWA ve Ölçeklendirme Yol Haritası',
      ar: 'خارطة طريق النشر، تطبيقات PWA والتوسع المستقبلي',
    },
    badge: {
      ug: 'كېڭىيىش كۆلىمى',
      en: 'Scale & Launch',
      tr: 'Ölçek ve Çıkış',
      ar: 'التوسع والإطلاق',
    },
    summary: {
      ug: 'تۈرنى بىر ئادەملىك ياردەمچى ئەپتىن، كۆپ كىشىلىك تور بېكەت ۋە كۆچمە ئەپكە ئايلاندۇرۇشنىڭ كېڭەيتىش پەلەمپىيى.',
      en: 'Strategic roadmap to evolve this personal assistant workspace into a full-scale web portal, downloadable PWA, and cross-platform native ecosystem.',
      tr: 'Bu kişisel asistan çalışma alanını tam ölçekli bir web portalına, kurulabilir PWA\'ya ve çok platformlu bir ekosisteme dönüştürmek için stratejik yol haritası.',
      ar: 'خارطة طريق استراتيجية لتطوير مساحة عمل المساعد الشخصي إلى منصة ويب متكاملة وتطبيق جوال قابل للتثبيت.',
    },
    coreFeatures: {
      ug: [
        'Cloud Run ئارقىلىق 24/7 مۇقىم، يۇقىرى سۈرئەتلىك دۇنياۋى تارقىتىش',
        'PWA ئارقىلىق يانفون، تاختا ۋە كومپيۇتېرغا قاچىلىغىلى بولىدىغان قىلىش (Add to Home Screen)',
        'كېيىنكى قەدەمدە ئاۋازلىق پىچىرلاپ پاراڭلىشىش (Voice AI Assistant) قوشۇش پىلانى',
        'باشقا مۇلازىمەتلەر بىلەن (Google Calendar, GitHub, Notion) API ئارقىلىق ئۇلىنىش ئېغىزى',
      ],
      en: [
        'Cloud Run serverless zero-downtime automated deployment',
        'Progressive Web App installation capabilities for iOS, Android, and Desktop',
        'Future-ready Voice Interaction bridge (Gemini Live API integration path)',
        'Third-party connector hooks for Google Calendar, GitHub, and Cloud tools',
      ],
      tr: [
        'Cloud Run sunucusuz kesintisiz otomatik küresel dağıtım',
        'iOS, Android ve Masaüstü için Progressive Web App (PWA) kurulum özellikleri',
        'Geleceğe hazır Sesli Etkileşim köprüsü (Gemini Live API entegrasyon yolu)',
        'Google Calendar, GitHub ve Notion için üçüncü taraf bağlantı kancaları',
      ],
      ar: [
        'نشر تلقائي مستمر عبر Google Cloud Run بدون أي توقف',
        'إمكانية تثبيت تطبيق الويب (PWA) على هواتف iOS وAndroid والحواسيب مباشرة',
        'مسار جاهز للتكامل مع الأوامر الصوتية الحية (Gemini Live API)',
        'خطافات تكامل جاهزة مع تقويم Google وGitHub وNotion',
      ],
    },
    techChoices: [
      {
        category: 'Hosting',
        tech: 'Google Cloud Run',
        purpose: {
          ug: 'ئاپتوماتىك كېڭىيىدىغان ۋە دۇنياۋى يۇقىرى سۈرئەتلىك مۇلازىمەت',
          en: 'Serverless auto-scaling container infrastructure',
          tr: 'Sunucusuz otomatik ölçeklenen konteyner altyapısı',
          ar: 'بنية تحتية سحابية تتوسع تلقائياً بحسب حجم الاستخدام',
        },
      },
      {
        category: 'Mobile Tech',
        tech: 'PWA / Capacitor / React Native',
        purpose: {
          ug: 'يۈز كودىنى بىۋاسىتە يانفون ئەپ قىلىپ ئوراش',
          en: 'Universal web-to-mobile packaging pathway',
          tr: 'Web kodlarını doğrudan mobil uygulamaya dönüştürme yolu',
          ar: 'تحويل كود الويب بسهولة إلى تطبيقات جوال أصلية',
        },
      },
    ],
    architecturePoints: {
      ug: ['بىرلا كود توپلىمى (Single Codebase) ئارقىلىق تور بېكەت، يانفون ۋە خىزمەت تاختىسىنى تولۇق قاپلاش'],
      en: ['Unified codebase servicing Web, Mobile PWA, and Desktop browsers seamlessly'],
      tr: ['Web, Mobil PWA ve Masaüstü tarayıcılara kusursuz hizmet veren birleşik kod tabanı'],
      ar: ['قاعدة كود برمجية موحدة تدير تطبيقات الويب والهواتف والحواسيب بكفاءة'],
    },
  },
];

export const LOCALIZED_ROADMAP: LocalizedRoadmapPhase[] = [
  {
    id: 'phase-1',
    phaseNumber: 1,
    title: {
      ug: '1-باسقۇچ: يادرولۇق سىناق نۇسخىسى (MVP)',
      en: 'Phase 1: Foundation & Core MVP',
      tr: '1. Aşama: Temel & Çekirdek MVP',
      ar: 'المرحلة الأولى: التأسيس وإطلاق النموذج الأولي (MVP)',
    },
    duration: {
      ug: '1 - 2 ھەپتە',
      en: '1 - 2 Weeks',
      tr: '1 - 2 Hafta',
      ar: '١ - ٢ أسبوع',
    },
    badge: {
      ug: 'ئاساس سېلىش',
      en: 'Foundation',
      tr: 'Temel Atma',
      ar: 'التأسيس',
    },
    description: {
      ug: 'ئاساسىي كۆرۈنمە يۈز، يادرولۇق سۈنئىي ئىدراك سۆھبىتى ۋە يەرلىك ۋەزىپە/خاتىرە سىستېمىسىنى قۇرۇپ چىقىش.',
      en: 'Establish the core bi-directional UI layout, server-side Gemini integration, and offline-first task & note persistence.',
      tr: 'Çift yönlü UI düzeni, sunucu taraflı Gemini entegrasyonu ve çevrimdışı görev/not sistemini kurma.',
      ar: 'بناء واجهات المستخدم ثنائية الاتجاه، ربط خادم Gemini الذكي، وتأسيس نظام حفظ المهام والملاحظات محلياً.',
    },
    tasks: [
      {
        id: 't1-1',
        title: {
          ug: 'React 19 + TypeScript + Tailwind v4 يۈز تۈزۈلمىسىنى تەڭشەش',
          en: 'Initialize React 19 + TypeScript + Tailwind layout structure',
          tr: 'React 19 + TypeScript + Tailwind arayüz yapısını başlatma',
          ar: 'تهيئة هيكل الواجهات باستخدام React 19 و TypeScript و Tailwind v4',
        },
        done: true,
      },
      {
        id: 't1-2',
        title: {
          ug: 'Express API مۇلازىمېتىرى ۋە Gemini 3.7 Flash ئەقلىي يادروسىنى ئۇلاش',
          en: 'Set up Express server & Gemini 3.7 Flash API bridge',
          tr: 'Express API sunucusu ve Gemini 3.7 Flash entegrasyonunu kurma',
          ar: 'إعداد خادم Express وربطه بنموذج Gemini 3.7 Flash',
        },
        done: true,
      },
      {
        id: 't1-3',
        title: {
          ug: 'ئۇيغۇرچە، تۈركچە، ئەرەبچە ۋە ئىنگلىزچە كۆپ تىللىق تەبىئىي ئالمىشىشنى يولغا قويۇش',
          en: 'Implement bi-directional multilingual switcher (Uyghur, Turkish, Arabic, English)',
          tr: 'Uygurca, Türkçe, Arapça ve İngilizce çift yönlü dil desteğini uygulama',
          ar: 'تفعيل التبديل متعدد اللغات والاتجاهات (أويغورية، تركية، عربية، إنجليزية)',
        },
        done: true,
      },
      {
        id: 't1-4',
        title: {
          ug: 'كۆپ خىل خاس ياردەمچى تىپلىرى (Personas) ۋە چىرايلىق سۆھبەت يۈزى',
          en: 'Build specialized AI personas & rich Markdown chat UI',
          tr: 'Özelleştirilmiş AI kimlikleri ve zengin Markdown sohbet arayüzü oluşturma',
          ar: 'بناء شخصيات الذكاء الاصطناعي وواجهة محادثة متطورة بنظام Markdown',
        },
        done: true,
      },
      {
        id: 't1-5',
        title: {
          ug: 'ۋەزىپە ۋە ئەقلىي خاتىرە بۆلىكىنى قۇرۇش',
          en: 'Create task checklist and smart notes system',
          tr: 'Görev listesi ve akıllı not defteri sistemini oluşturma',
          ar: 'إنشاء نظام قائمة المهام والملاحظات الذكية',
        },
        done: true,
      },
    ],
  },
  {
    id: 'phase-2',
    phaseNumber: 2,
    title: {
      ug: '2-باسقۇچ: كۆپ ئىقتىدارلىق قوراللار ۋە كېڭەيتىلمىلەر',
      en: 'Phase 2: Multi-tool Expansion & Workflow Automation',
      tr: '2. Aşama: Çoklu Araç Genişletmesi & Otomasyon',
      ar: 'المرحلة الثانية: توسيع الأدوات المتعددة وأتمتة العمل',
    },
    duration: {
      ug: '2 - 3 ھەپتە',
      en: '2 - 3 Weeks',
      tr: '2 - 3 Hafta',
      ar: '٢ - ٣ أسابيع',
    },
    badge: {
      ug: 'ئىقتىدار بېيىتىش',
      en: 'Enhancement',
      tr: 'Geliştirme',
      ar: 'التعزيز والتطوير',
    },
    description: {
      ug: 'تېز تەرجىمە، ۋەزىپىنى ئەقلىي بۆلۈش، پومودورو زېھىن مەركەزلەشتۈرۈش سائىتى ۋە تەبىئەت ئاۋازلىرىنى پۈتۈنلەي تاماملاش.',
      en: 'Integrate productivity accelerators: one-click task decomposition, instant translation tools, Pomodoro focus mode, and soundscapes.',
      tr: 'Tek tıkla hedef ayrıştırma, anlık çeviri, Pomodoro odak sayacı ve ortam seslerini tamamlama.',
      ar: 'دمج مسرعات الإنتاجية: التفكيك الذكي للمهام، أدوات الترجمة الفورية، مؤقت بومودورو وأصوات التركيز.',
    },
    tasks: [
      {
        id: 't2-1',
        title: {
          ug: 'سۈنئىي ئىدراك ئارقىلىق نىشاننى ئاپتوماتىك ۋەزىپىگە پارچىلاش قورالى',
          en: 'AI Goal & Task auto-decomposition tool',
          tr: 'Yapay zeka ile hedefleri otomatik alt görevlere ayrıştırma aracı',
          ar: 'أداة التفكيك التلقائي للأهداف والمشاريع بالذكاء الاصطناعي',
        },
        done: true,
      },
      {
        id: 't2-2',
        title: {
          ug: 'ئۇيغۇرچە-تۈركچە-ئەرەبچە-ئىنگلىزچە تېز تەرجىمە ۋە تېكىست تاۋلاش بۆلىكى',
          en: 'Multilingual fast translation & text polishing utility (Uyghur, Turkish, Arabic, English)',
          tr: 'Uygurca-Türkçe-Arapça-İngilizce hızlı çeviri ve metin geliştirme aracı',
          ar: 'أداة الترجمة الفورية وصقل النصوص (أويغورية، تركية، عربية، إنجليزية)',
        },
        done: true,
      },
      {
        id: 't2-3',
        title: {
          ug: 'پومودورو سائىتى ۋە Web Audio ئارقىلىق تەبىئەت ئاۋازلىرى ياراتقۇچى',
          en: 'Pomodoro timer with Web Audio ambient sound synthesizer',
          tr: 'Web Audio ortam sesi sentezleyicili Pomodoro sayacı',
          ar: 'مؤقت بومودورو مع مولد أصوات طبيعية بتقنية Web Audio',
        },
        done: true,
      },
      {
        id: 't2-4',
        title: {
          ug: 'ئۆزگىچە تۈرلەر ئۈچۈن ئاپتوماتىك پىلان يازغۇچى (Blueprint Generator)',
          en: 'Dynamic AI Project Blueprint generator for custom user ideas',
          tr: 'Kullanıcı fikirleri için dinamik AI Proje Planı oluşturucu',
          ar: 'منشئ المخططات الهندسية الذكي لأفكار المشاريع المخصصة',
        },
        done: true,
      },
      {
        id: 't2-5',
        title: {
          ug: 'سانلىق مەلۇماتلارنى JSON شەكلىدە بىخەتەر ئېكسپورت ۋە ئىمپورت قىلىش',
          en: 'Secure JSON backup export and import functionality',
          tr: 'Güvenli JSON yedekleme dışa ve içe aktarma işlevi',
          ar: 'تصدير واستيراد النسخ الاحتياطية للبيانات بأمان بصيغة JSON',
        },
        done: true,
      },
    ],
  },
  {
    id: 'phase-3',
    phaseNumber: 3,
    title: {
      ug: '3-باسقۇچ: كۆچمە ماسلىشىش، PWA ۋە بۇلۇت ساقلاش',
      en: 'Phase 3: PWA, Mobile Packaging & Cloud Sync',
      tr: '3. Aşama: PWA, Mobil Paketleme ve Bulut Senkronizasyonu',
      ar: 'المرحلة الثالثة: تطبيقات PWA، دعم الجوال والمزامنة السحابية',
    },
    duration: {
      ug: '3 - 4 ھەپتە',
      en: '3 - 4 Weeks',
      tr: '3 - 4 Hafta',
      ar: '٣ - ٤ أسابيع',
    },
    badge: {
      ug: 'كۆچمە ئەپ',
      en: 'Mobile & Cloud',
      tr: 'Mobil & Bulut',
      ar: 'الجوال والسحابة',
    },
    description: {
      ug: 'تەجرىبىنى يانفوندا بىۋاسىتە ئەپ سۈپىتىدە ئىشلىتىش، سۈرئەتنى تېخىمۇ يۇقىرى پەللىگە كۆتۈرۈش.',
      en: 'PWA manifest & service workers for installable mobile experience, offline asset caching, and optional cloud database sync.',
      tr: 'Mobil kurulum için PWA bildirimi ve servis çalışanları, çevrimdışı önbellekleme ve bulut senkronizasyonu.',
      ar: 'توفير ملف Manifest وعمال الخدمة للتثبيت كتطبيق جوال، والتخزين المؤقت، والمزامنة السحابية الاختيارية.',
    },
    tasks: [
      {
        id: 't3-1',
        title: {
          ug: 'PWA Manifest ۋە Service Worker ئارقىلىق تېلېفونغا ئەپ قىلىپ قاچىلاش',
          en: 'PWA manifest & service worker for home screen installation',
          tr: 'Ana ekrana yükleme için PWA bildirimi ve servis çalışanı',
          ar: 'إعداد ملفات PWA للتثبيت المباشر على الشاشة الرئيسية للهواتف',
        },
        done: false,
      },
      {
        id: 't3-2',
        title: {
          ug: 'ھۆججەت ۋە رەسىملەرنى چۈشىنىش (Multimodal Vision / PDF Reading)',
          en: 'Multimodal vision and document OCR analysis integration',
          tr: 'Görsel analiz ve PDF/Doküman OCR okuma entegrasyonu',
          ar: 'دمج قراءة المستندات والتحليل البصري المتعدد الوسائط للمستندات والصور',
        },
        done: false,
      },
      {
        id: 't3-3',
        title: {
          ug: 'ئىختىيارىي Firestore / Cloud SQL سانلىق مەلۇمات سىغدۇرۇشىنى ئۇلاش',
          en: 'Optional Firestore / Cloud SQL multi-device real-time sync',
          tr: 'İsteğe bağlı Firestore / Cloud SQL çoklu cihaz gerçek zamanlı senkronizasyonu',
          ar: 'ربط اختياري مع Firestore أو Cloud SQL لمزامنة الأجهزة المختلفة في الوقت الفعلي',
        },
        done: false,
      },
      {
        id: 't3-4',
        title: {
          ug: 'ئىشلەتكۈچى تەڭشىكى ۋە خاس كۆرۈنۈش ئۇسلۇبلىرىنى كېڭەيتىش',
          en: 'Expanded custom themes, accent palettes, and sound packs',
          tr: 'Genişletilmiş özel temalar, vurgu renkleri ve ses paketleri',
          ar: 'توسيع خيارات التخصيص، السمات اللونية، وباقات الأصوات الطبيعية',
        },
        done: false,
      },
    ],
  },
  {
    id: 'phase-4',
    phaseNumber: 4,
    title: {
      ug: '4-باسقۇچ: ئاۋازلىق ياردەمچى ۋە دۇنياۋى تارقىتىش',
      en: 'Phase 4: Real-Time Voice & Ecosystem Launch',
      tr: '4. Aşama: Gerçek Zamanlı Ses & Ekosistem Lansmanı',
      ar: 'المرحلة الرابعة: التفاعل الصوتي الحي والإطلاق الشامل',
    },
    duration: {
      ug: '4 - 6 ھەپتە',
      en: '4 - 6 Weeks',
      tr: '4 - 6 Hafta',
      ar: '٤ - ٦ أسابيع',
    },
    badge: {
      ug: 'كەلگۈسى پەللە',
      en: 'Ecosystem',
      tr: 'Ekosistem',
      ar: 'المنظومة الكاملة',
    },
    description: {
      ug: 'ھەقىقىي ۋاقىتلىق ئاۋازلىق پىچىرلاپ سۆزلىشىش، سىرتقى قوراللار بىلەن ئۇلىنىش ۋە رەسمىي تاقاش.',
      en: 'Real-time bidirectional voice interactions, third-party workspace integrations (Google Workspace, Notion), and production launch.',
      tr: 'Gerçek zamanlı çift yönlü sesli etkileşim, üçüncü taraf çalışma alanı entegrasyonları ve canlıya geçiş.',
      ar: 'تفاعل صوتي ثنائي الاتجاه في الوقت الفعلي، والتكامل مع Google Workspace و Notion والإطلاق الإنتاجي.',
    },
    tasks: [
      {
        id: 't4-1',
        title: {
          ug: 'Gemini Live API ئارقىلىق ئاۋازلىق پاراڭلىشىش ئۇلىنىشى',
          en: 'Gemini Live API real-time voice streaming bridge',
          tr: 'Gemini Live API gerçek zamanlı ses akışı köprüsü',
          ar: 'جسر البث الصوتي المباشر عبر Gemini Live API',
        },
        done: false,
      },
      {
        id: 't4-2',
        title: {
          ug: 'Google Calendar ۋە خىزمەت قوراللىرى بىلەن ۋاقىت جەدۋىلىنى ماسلاشتۇرۇش',
          en: 'Google Workspace / Calendar bidirectional sync',
          tr: 'Google Takvim ve çalışma araçlarıyla çift yönlü senkronizasyon',
          ar: 'مزامنة المواعيد والجداول مع Google Calendar وتطبيقات العمل',
        },
        done: false,
      },
      {
        id: 't4-3',
        title: {
          ug: 'خاس بەلگىلىمە ۋە شەخسىي ئاپتوماتلاشتۇرۇش سېنارىيەلىرى (Workflows)',
          en: 'Custom trigger-action automated productivity workflows',
          tr: 'Özel tetikleyici-eylem otomatik verimlilik iş akışları',
          ar: 'مسارات أتمتة مخصصة وسيناريوهات عمل ذكية لزيادة الإنتاجية',
        },
        done: false,
      },
    ],
  },
];

export const LOCALIZED_PERSONAS: LocalizedAssistantPersona[] = [
  {
    id: 'universal',
    name: {
      ug: 'ئومۇمىي ئەقلىي ياردەمچى',
      en: 'Universal AI Assistant',
      tr: 'Genel Yapay Zeka Asistanı',
      ar: 'المساعد الذكي الشامل',
    },
    tagline: {
      ug: 'كۈندىلىك مەسىلىلەر ۋە بىلىم مەركىزى',
      en: 'Daily knowledge & problem solver',
      tr: 'Günlük bilgi & problem çözücü',
      ar: 'مركز المعرفة وحل المشكلات اليومية',
    },
    icon: 'Sparkles',
    color: 'from-blue-600 to-indigo-600',
    bgLight: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    description: {
      ug: 'ھەرقانداق ساھەدىكى سوئاللىرىڭىزغا ئەتراپلىق، توغرا ھەم چۈشىنىشلىك ئۇيغۇرچە جاۋاب بېرىدۇ.',
      en: 'Comprehensive, accurate, and empathetic assistance for all daily questions, learning, and advice.',
      tr: 'Tüm günlük sorularınız, öğrenme ve tavsiye ihtiyaçlarınız için kapsamlı ve doğru destek sağlar.',
      ar: 'مساعد شامل ودقيق يقدم إجابات وافية وموثوقة لجميع استفساراتك اليومية والتعليمية.',
    },
    promptSuggestions: {
      ug: [
        'ماڭا بۈگۈنكى ئىش ئۈنۈمىنى ئاشۇرىدىغان 5 ياخشى ئادەتنى تۈزۈپ بەر',
        'بىر كۆپ ئىقتىدارلىق تور بېكەت قۇرۇش ئۈچۈن قايسى تېخنىكىلارنى ئۆگىنىشىم كېرەك؟',
        'مۇرەككەپ نىشانلارنى قانداق قىلىپ كۈندىلىك ئاددىي ئادەتلەرگە ئايلاندۇرغىلى بولىدۇ؟',
        'ئۆزۈمنى يېڭى پەن ۋە تىللارنى تېز ئۆگىنىشكە قانداق تەربىيەلەيمەن؟',
      ],
      en: [
        'Give me 5 actionable habits to maximize daily productivity',
        'What are the best modern web technologies to learn this year?',
        'How to break down a massive long-term goal into daily milestones?',
        'Suggest a realistic weekly schedule for self-directed learning',
      ],
      tr: [
        'Günlük verimliliği en üst düzeye çıkaracak 5 uygulanabilir alışkanlık öner',
        'Bu yıl modern bir web uygulaması geliştirmek için hangi teknolojileri öğrenmeliyim?',
        'Büyük bir uzun vadeli hedef günlük uygulanabilir adımlara nasıl bölünür?',
        'Kişisel öğrenme için gerçekçi bir haftalık çalışma planı hazırla',
      ],
      ar: [
        'اقترح عليّ ٥ عادات عملية لمضاعفة إنتاجيتي اليومية',
        'ما هي أفضل التقنيات الحديثة لبناء موقع وتطبيق متعدد الوظائف هذا العام؟',
        'كيف أفكك هدفاً كبيراً طويل المدى إلى خطوات ومحطات يومية ملموسة؟',
        'صمم لي جدولاً أسبوعياً متوازناً للتعلم الذاتي والتطوير المهني',
      ],
    },
  },
  {
    id: 'planner',
    name: {
      ug: 'لايىھە ۋە پىلان ئۇستىسى',
      en: 'Architect & Project Planner',
      tr: 'Sistem Mimarı & Proje Planlayıcı',
      ar: 'مهندس الأنظمة ومخطط المشاريع',
    },
    tagline: {
      ug: 'سىستېما قۇرۇلمىسى ۋە تۈر لايىھىسى',
      en: 'Software architecture & execution roadmap',
      tr: 'Yazılım mimarisi & uygulama yol haritası',
      ar: 'المعمارية البرمجية وخارطة طريق التنفيذ',
    },
    icon: 'Compass',
    color: 'from-amber-600 to-orange-600',
    bgLight: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    description: {
      ug: 'ئەپ ۋە توربىكەتلەرنىڭ سىستېما قۇرۇلمىسى، تېخنىكا تاللاش، مەخپىيەتلىك ۋە قەدەممۇ-قەدەم ئىشقا ئاشۇرۇش لايىھەلىرىنى سىزىپ بېرىدۇ.',
      en: 'Specialized in modular system design, database schemas, tech stack tradeoffs, and project blueprints.',
      tr: 'Modüler sistem tasarımı, veritabanı şemaları, teknoloji seçimleri ve proje mimari planlarında uzmanlaşmıştır.',
      ar: 'متخصص في تصميم الأنظمة الموديلية، مخططات قواعد البيانات، مفاضلة التقنيات وصياغة الخطط الهندسية.',
    },
    promptSuggestions: {
      ug: [
        'ماڭا بىر كۆچمە ئەپ ۋە تور بېكەتنىڭ تولۇق سىستېما لايىھە پىلانىنى تەپسىلىي تۈزۈپ بەر',
        'Frontend بىلەن Backend ئارىسىدىكى سانلىق مەلۇمات ئېقىمىنى قانداق ئەڭ بىخەتەر لايىھىلەش كېرەك؟',
        'بىر سۈنئىي ئىدراك ياردەمچى ئەپى ئۈچۈن ئەڭ مۇۋاپىق سانلىق مەلۇمات قۇرۇلمىسى قايسى؟',
        'قانداق قىلغاندا ئەپنى تورسىزمۇ (Offline-First) راۋان ئىشلەيدىغان قىلغىلى بولىدۇ؟',
      ],
      en: [
        'Create a detailed architectural blueprint for a modern personal productivity app',
        'What is the optimal database schema for an AI-powered note and task manager?',
        'How should I design an offline-first sync engine between local client and cloud?',
        'Compare PostgreSQL vs Firestore for a multi-device assistant ecosystem',
      ],
      tr: [
        'Modern bir kişisel verimlilik uygulaması için detaylı bir mimari plan hazırla',
        'Yapay zeka destekli bir not ve görev yöneticisi için en uygun veritabanı şeması nedir?',
        'Yerel istemci ile bulut arasında çevrimdışı öncelikli (Offline-First) senkronizasyon nasıl tasarlanır?',
        'Çok cihazlı bir asistan ekosistemi için PostgreSQL ile Firestore\'u karşılaştır',
      ],
      ar: [
        'أنشئ مخططاً معمارياً تفصيلياً لتطبيق إنتاجية شخصي وموقع ويب حديث',
        'ما هو المخطط المثالي لقواعد البيانات لتطبيق ملاحظات ومهام مدعوم بالذكاء الاصطناعي؟',
        'كيف أصمم محرك مزامنة يعمل أولاً بدون إنترنت (Offline-First) بين المتصفح والسحابة؟',
        'قارن بين PostgreSQL و Firestore لبناء منظومة مساعد ذكي متعدد الأجهزة',
      ],
    },
  },
  {
    id: 'coder',
    name: {
      ug: 'پروگرامما ۋە كود ياردەمچىسى',
      en: 'Full-Stack Code Guru',
      tr: 'Full-Stack Kod Uzmanı',
      ar: 'خبير البرمجة والأكواد المتكاملة',
    },
    tagline: {
      ug: 'TypeScript, React, Python & Backend',
      en: 'Clean code, architecture & debugging',
      tr: 'Temiz kod, mimari & hata ayıklama',
      ar: 'أكواد برمجية نظيفة، معمارية وتصحيح الأخطاء',
    },
    icon: 'Code2',
    color: 'from-emerald-600 to-teal-600',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    description: {
      ug: 'كود يېزىش، خاتالىقلارنى تۈزىتىش، يۇقىرى ئىقتىدارلىق API قۇرۇلمىلىرى ۋە زامانىۋى React زاپچاسلىرىنى قۇرۇپ بېرىدۇ.',
      en: 'Expert software development assistant for React 19, TypeScript, Express, API design, and algorithm optimization.',
      tr: 'React 19, TypeScript, Express, API tasarımı ve algoritma optimizasyonunda uzman yazılım geliştirme asistanı.',
      ar: 'مساعد برمجي متقدم في React 19 و TypeScript و Express وتصميم واجهات برمجة التطبيقات وتحسين الخوارزميات.',
    },
    promptSuggestions: {
      ug: [
        'React بىلەن كۆپ تىللىق RTL/LTR يۆنىلىشنى تەبىئىي بىر تەرەپ قىلىدىغان كود مىسالى كۆرسىتىپ بەر',
        'Express مۇلازىمېتىرىدا Gemini API نى بىخەتەر چاقىرىشنىڭ ئەڭ ياخشى كود قېلىپىنى يېزىپ بەر',
        'Web Audio API ئارقىلىق پىچىرلايدىغان ئاق شاۋقۇن (White Noise) ھاسىل قىلىش كودى تۈزۈپ بەر',
        'TypeScript تا كۆپ خىل سانلىق مەلۇمات تىپلىرىنى قانداق ئۆلچەملىك ئېنىقلاش كېرەك؟',
      ],
      en: [
        'Show me a clean React component handling RTL & LTR dynamic bidirectional layout',
        'Write a production-ready Express API proxy with Gemini 3.7 SDK integration',
        'How to implement an audio synthesizer for focus soundscapes in Web Audio API?',
        'Provide a modern TypeScript interface architecture for an extensible plugin system',
      ],
      tr: [
        'Dinamik RTL ve LTR çift yönlü düzeni yöneten temiz bir React bileşeni göster',
        'Gemini 3.7 SDK entegrasyonuna sahip üretime hazır bir Express API proxy kodu yaz',
        'Web Audio API kullanarak odaklanma sesleri için sentetik ses motoru nasıl kodlanır?',
        'Genişletilebilir bir eklenti sistemi için modern TypeScript arayüz mimarisi sun',
      ],
      ar: [
        'أرني مكون React نظيف يتعامل مع التبديل الديناميكي بين اتجاهي RTL و LTR',
        'اكتب كود خادم Express احترافي وآمن كـ Proxy لنموذج Gemini 3.7 SDK',
        'كيف أبرمج مولد أصوات طبيعية باستخدام Web Audio API بدون تحميل ملفات؟',
        'قدم هيكلية واجهات TypeScript متطورة لنظام وحدات قابلة للتوسع',
      ],
    },
  },
  {
    id: 'writer',
    name: {
      ug: 'ئىجادىي يازغۇچى ۋە تەرجىمان',
      en: 'Writer & Multilingual Translator',
      tr: 'Yazar & Çok Dilli Çevirmen',
      ar: 'الكاتب الإبداعي والمترجم متعدد اللغات',
    },
    tagline: {
      ug: 'كۆپ تىللىق تېكىست تاۋلاش ۋە تەھرىرلەش',
      en: 'Multilingual copywriting & translation',
      tr: 'Çok dilli metin yazarlığı & çeviri',
      ar: 'صياغة النصوص الإبداعية والترجمة متعددة اللغات',
    },
    icon: 'PenTool',
    color: 'from-purple-600 to-pink-600',
    bgLight: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    description: {
      ug: 'ماقالە، ئېلان، ھۆججەت، كىرىش سۆزلىرى ۋە ئۇيغۇرچە-تۈركچە-ئەرەبچە-ئىنگلىزچە دەل ھەم سەنئەتلىك تەرجىمە قىلىپ بېرىدۇ.',
      en: 'Specialized in persuasive copywriting, product manuals, professional correspondence, and accurate nuanced translation.',
      tr: 'İkna edici metin yazarlığı, ürün kılavuzları, profesyonel yazışmalar ve nüanslı doğru çeviride uzmanlaşmıştır.',
      ar: 'متخصص في الكتابة الإقناعية، أدلة المنتجات، المراسلات الاحترافية والترجمة الدقيقة الحافظة للسياق.',
    },
    promptSuggestions: {
      ug: [
        'مېنىڭ يېڭى پىلانلىغان كۆپ ئىقتىدارلىق ياردەمچى ئەپىم ئۈچۈن كىشىنى جەلپ قىلىدىغان كىرىش سۆزى يېزىپ بەر',
        'بۇ تېكىستنى پاساھەتلىك ئۇيغۇرچە ۋە تۈركچىگە تەرجىمە قىلىپ بەر: "Crafted for seamless focus and clarity."',
        'تۈر لايىھە پىلانى (Project Proposal) ئۈچۈن كەسپىي ئۈستەل دوكلاتى تۈزۈپ بەر',
        'بىر پەن-تېخنىكا ماقالىسى ئۈچۈن ئېنىق قۇرۇلمىلىق مۇندەرىجە لايىھىلەپ بەر',
      ],
      en: [
        'Draft a compelling product launch pitch for our modern AI Assistant suite',
        'Translate this phrase into eloquent Arabic and Turkish: "Crafted for seamless focus and clarity."',
        'Write an executive summary for our software architecture proposal',
        'Proofread and polish this technical article introduction',
      ],
      tr: [
        'Yeni çok fonksiyonlu AI Asistan platformumuz için etkileyici bir lansman metni yaz',
        'Şu ifadeyi akıcı Türkçe ve Uygurcaya çevir: "Crafted for seamless focus and clarity."',
        'Yazılım mimarisi proje teklifimiz için profesyonel bir yönetici özeti hazırla',
        'Bu teknik makale girişini gözden geçir ve daha akıcı hale getir',
      ],
      ar: [
        'اكتب مقدمة تسويقية جذابة لإطلاق منصة المساعد الذكي متعدد الوظائف',
        'ترجم هذه العبارة ببلاغة إلى العربية والتركية: "Crafted for seamless focus and clarity."',
        'اكتب ملخصاً تنفيذياً احترافياً لمقترح المشروع المعماري التقني',
        'راجع ودقق لغوياً مقدمة هذا المقال التقني واجعله أكثر انسيابية',
      ],
    },
  },
];

export const LOCALIZED_QUICK_TOOLS: LocalizedQuickTool[] = [
  {
    id: 'breakdown-task',
    icon: 'ListTree',
    actionType: 'breakdown-task',
    name: {
      ug: 'نىشاننى بۆلۈش',
      en: 'Decompose Goal',
      tr: 'Hedefi Ayrıştır',
      ar: 'تفكيك الهدف',
    },
    desc: {
      ug: 'چوڭ بىر تۈر ياكى نىشاننى 4-6 كىچىك، ئەمەلىي ۋە تەرتىپلىك ۋەزىپىگە ئايرىپ بېرىدۇ.',
      en: 'Break down any large goal or ambition into clear, actionable, prioritized subtasks.',
      tr: 'Büyük bir hedefi 4-6 net, uygulanabilir ve öncelikli alt göreve ayırır.',
      ar: 'تفكيك أي هدف أو مشروع كبير إلى ٤-٦ خطوات تنفيذية متسلسلة وواضحة.',
    },
    placeholder: {
      ug: 'مەسىلەن: "بىر شەخسىي كۆپ ئىقتىدارلىق توربىكەت لايىھىلەش ۋە ئېچىش"...',
      en: 'e.g., "Build and launch a personal modern portfolio and assistant web app"...',
      tr: 'örn., "Kişisel çok fonksiyonlu modern portfolyo ve asistan web uygulaması geliştirmek"...',
      ar: 'مثال: "تصميم وإطلاق موقع شخصي ومساعد ذكي متعدد الوظائف"...',
    },
  },
  {
    id: 'translate',
    icon: 'Languages',
    actionType: 'translate',
    name: {
      ug: 'ئەقلىي تەرجىمە',
      en: 'Smart Translate',
      tr: 'Akıllı Çeviri',
      ar: 'الترجمة الذكية',
    },
    desc: {
      ug: 'ئۇيغۇرچە، تۈركچە، ئەرەبچە، ئىنگلىزچە ۋە خەنزۇچە ئارىسىدا مەنىنى دەل ساقلاپ راۋان تەرجىمە قىلىدۇ.',
      en: 'Deep contextual translation preserving nuanced professional and cultural meaning.',
      tr: 'Uygurca, Türkçe, Arapça, İngilizce ve Çince arasında bağlamsal ve akıcı çeviri.',
      ar: 'ترجمة سياقية عميقة تحافظ على الدقة المهنية وبلاغة المعنى بين اللغات.',
    },
    placeholder: {
      ug: 'تەرجىمە قىلماقچى بولغان تېكىستنى كىرگۈزۈڭ...',
      en: 'Enter text to translate accurately...',
      tr: 'Doğru çevrilmesini istediğiniz metni girin...',
      ar: 'أدخل النص المراد ترجمته بدقة وبلاغة...',
    },
  },
  {
    id: 'summarize',
    icon: 'FileText',
    actionType: 'summarize',
    name: {
      ug: 'قىسقارتىش ۋە خۇلاسىلەش',
      en: 'Summarizer',
      tr: 'Özetleyici',
      ar: 'التلخيص الذكي',
    },
    desc: {
      ug: 'ئۇزۇن ھۆججەت ياكى پىكىرلەرنى ئەڭ مۇھىم يادرولۇق نۇقتىلارغا يىغىنچاقلاپ بېرىدۇ.',
      en: 'Condense lengthy articles, notes, or ideas into crisp bulleted takeaways.',
      tr: 'Uzun makaleleri, notları veya fikirleri net maddeler halinde özetler.',
      ar: 'تلخيص المقالات والملاحظات الطويلة إلى نقاط جوهرية مركزة.',
    },
    placeholder: {
      ug: 'خۇلاسىلىمەكچى بولغان مەزمۇن ياكى ماقالىنى بۇ يەرگە قويۇڭ...',
      en: 'Paste the content or article you want to summarize...',
      tr: 'Özetlemek istediğiniz içeriği veya makaleyi buraya yapıştırın...',
      ar: 'الصق المحتوى أو المقال الذي تريد تلخيصه هنا...',
    },
  },
  {
    id: 'code-helper',
    icon: 'Terminal',
    actionType: 'code-helper',
    name: {
      ug: 'كود لايىھىلىگۈچى',
      en: 'Code Architect',
      tr: 'Kod Mimarı',
      ar: 'مهندس الأكواد',
    },
    desc: {
      ug: 'ئېھتىياجىڭىزغا ماس React, TypeScript ياكى Python كود بۆلىكى ۋە چۈشەندۈرۈشى ھاسىل قىلىدۇ.',
      en: 'Generate modern, type-safe code snippets with step-by-step technical commentary.',
      tr: 'Adım adım teknik açıklamalarla modern, tip güvenli kod parçacıkları üretir.',
      ar: 'توليد أكواد برمجية حديثة وآمنة بلغات TypeScript وReact وPython مع الشرح.',
    },
    placeholder: {
      ug: 'مەسىلەن: "React تىكى كۆپ تىللىق يۆنىلىش كۇنۇپكىسىنىڭ كودىنى يېزىپ بەر"...',
      en: 'e.g., "Write a reusable debounce hook in TypeScript"...',
      tr: 'örn., "TypeScript ile yeniden kullanılabilir bir debounce hook yaz"...',
      ar: 'مثال: "اكتب مكون React لإدارة اللغات المتعددة والاتجاهين RTL/LTR"...',
    },
  },
];
