import React, { useState, useEffect } from 'react';
import {
  Palette,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Image as ImageIcon,
  Sliders,
  Layers,
  Code2,
  Share2,
  Trash2,
  Maximize2,
  X,
  Compass,
  FileCode,
  Zap,
  BookmarkPlus,
  Monitor,
  Smartphone,
  Square,
  RectangleHorizontal,
  RectangleVertical,
} from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ImageStudioViewProps {
  lang: AppLanguage;
  onSaveToNotes?: (title: string, content: string) => void;
}

interface GeneratedImageItem {
  id: string;
  prompt: string;
  revisedPrompt?: string;
  style: string;
  aspectRatio: string;
  imageUrl: string;
  svgContent?: string | null;
  createdAt: string;
}

const STYLE_OPTIONS = [
  { id: 'digital-art', labelUg: 'رەقەملىك سەنئەت (Digital Art)', labelEn: 'Digital Art', icon: '🎨', desc: 'Vibrant concept art with dynamic composition' },
  { id: 'photorealistic', labelUg: 'ھەقىقىي سۈرەت (Photorealistic)', labelEn: 'Photorealistic', icon: '📸', desc: '35mm raw photograph, ultra high-detail lighting' },
  { id: 'logo', labelUg: 'ۋېكتور لوگو (Vector Logo & Icon)', labelEn: 'Vector Logo', icon: '💎', desc: 'Clean geometric brand identity with companion SVG' },
  { id: 'ui-design', labelUg: 'ئەپ & تور UI لايىھىسى (UI/UX Mockup)', labelEn: 'UI/UX Mockup', icon: '📱', desc: 'Figma-style modern dashboard or mobile interface' },
  { id: 'anime', labelUg: 'ئانىمې & كارتون (Anime Aesthetic)', labelEn: 'Anime / Manga', icon: '✨', desc: 'Makoto Shinkai style, vivid cinematic colors' },
  { id: 'watercolor', labelUg: 'سۇ بوياق سەنئىتى (Watercolor)', labelEn: 'Watercolor', icon: '🖌️', desc: 'Soft washes, paper texture, delicate gradients' },
  { id: 'cyberpunk', labelUg: 'كەلگۈسى نېئون (Cyberpunk)', labelEn: 'Cyberpunk', icon: '🌆', desc: 'Futuristic dark sci-fi with volumetric glow' },
  { id: 'sketch', labelUg: 'قەلەم سىزمىسى (Pencil Sketch)', labelEn: 'Pencil Sketch', icon: '✏️', desc: 'Textured graphite hatching, artistic drawing' },
];

const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1', descUg: 'تۆت تەرەپلىك', descEn: 'Square (Social)', icon: Square },
  { id: '16:9', label: '16:9', descUg: 'توغرىسىغا كەڭ', descEn: 'Landscape (Desktop)', icon: RectangleHorizontal },
  { id: '9:16', label: '9:16', descUg: 'بويىغا ئېگىز', descEn: 'Portrait (Stories/Phone)', icon: RectangleVertical },
  { id: '4:3', label: '4:3', descUg: 'ئۆلچەملىك رەسىم', descEn: 'Standard', icon: Monitor },
];

const INSPIRATION_PROMPTS = [
  {
    titleUg: 'قۇياش پاتقاندىكى تەڭرىتاغ ئورمىنى',
    titleEn: 'Sunset Alpine Forest',
    promptUg: 'ئېگىز قارلىق تاغلار ئارىسىدىكى قارىغاي ئورمىنى، قىپقىزىل قۇياش ئالتۇن نۇر چېچىۋاتقان رەقەملىك سەنئەت مەنزىرىسى',
    style: 'digital-art',
    ratio: '16:9',
  },
  {
    titleUg: 'ئەقلىي سۈنئىي ئىدراك لوگوسى',
    titleEn: 'Modern AI Tech Logo',
    promptUg: 'زىننەتسىز ئەڭ ئاددىي كۆك ۋە بىنەپشە نۇر چاقناپ تۇرغان مېڭە ۋە كۋانت چېكىتلىرى بىرلەشتۈرۈلگەن يۇقىرى تېخنىكىلىق ۋېكتور لوگو',
    style: 'logo',
    ratio: '1:1',
  },
  {
    titleUg: 'شەخسىي ئىقتىساد ئەپ كۆرۈنمە يۈزى',
    titleEn: 'FinTech Mobile Dashboard UI',
    promptUg: 'زامانىۋى يانفون پۇل-مۇئامىلە ئەپ كۆرۈنمە يۈزى (FinTech Mobile App UI)، قاراڭغۇ نەپىس كارتىلار، كىرىم ۋە چىقىم گىرافىكى',
    style: 'ui-design',
    ratio: '9:16',
  },
  {
    titleUg: 'كەلگۈسى ئەقلىي ياردەمچى روبوت',
    titleEn: 'Futuristic Cyber Assistant',
    promptUg: 'مېھىرلىك كۆزلىرى چاقناپ تۇرغان، نېئون نۇرلار بىلەن بېزەلگەن ئاق ۋە خروم مېتاللىق سايپەربانك ياردەمچى روبوت',
    style: 'cyberpunk',
    ratio: '1:1',
  },
];

export const ImageStudioView: React.FC<ImageStudioViewProps> = ({ lang, onSaveToNotes }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRTL = lang === 'ug' || lang === 'ar';

  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('digital-art');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImageItem | null>(null);
  const [history, setHistory] = useState<GeneratedImageItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'generate' | 'gallery' | 'svgEditor'>('generate');
  const [svgViewMode, setSvgViewMode] = useState<'preview' | 'code'>('preview');

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ai_smart_image_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          setCurrentImage(parsed[0]);
        }
      }
    } catch (e) {
      console.warn('Failed to load image history:', e);
    }
  }, []);

  const saveHistory = (items: GeneratedImageItem[]) => {
    setHistory(items);
    try {
      localStorage.setItem('ai_smart_image_history', JSON.stringify(items.slice(0, 30)));
    } catch (e) {
      console.warn('Failed to save image history:', e);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/image/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
          language: lang,
        }),
      });
      const data = await res.json();
      if (data.enhancedPromptEn) {
        if (lang === 'ug' && data.enhancedPromptUg) {
          setPrompt(`${prompt} (${data.enhancedPromptUg})`);
        } else {
          setPrompt(data.enhancedPromptEn);
        }
      }
    } catch (e) {
      console.error('Enhance prompt failed:', e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async (customPrompt?: string, customStyle?: string, customRatio?: string) => {
    const textToGen = (customPrompt || prompt).trim();
    if (!textToGen || isGenerating) return;

    const styleToUse = customStyle || selectedStyle;
    const ratioToUse = customRatio || aspectRatio;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToGen,
          style: styleToUse,
          aspectRatio: ratioToUse,
          seed: Math.floor(Math.random() * 1000000),
          language: lang,
        }),
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        const newItem: GeneratedImageItem = {
          id: `img-${Date.now()}`,
          prompt: data.prompt || textToGen,
          revisedPrompt: data.revisedPrompt,
          style: data.style || styleToUse,
          aspectRatio: data.aspectRatio || ratioToUse,
          imageUrl: data.imageUrl,
          svgContent: data.svgContent,
          createdAt: data.createdAt || new Date().toISOString(),
        };

        setCurrentImage(newItem);
        const updated = [newItem, ...history.filter((h) => h.id !== newItem.id)];
        saveHistory(updated);
      }
    } catch (e) {
      console.error('Image generation error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (item: GeneratedImageItem) => {
    const a = document.createElement('a');
    a.href = item.imageUrl;
    a.download = `smart-ai-${item.style}-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSvg = (item: GeneratedImageItem) => {
    if (!item.svgContent) return;
    const blob = new Blob([item.svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-ai-vector-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter((item) => item.id !== id);
    saveHistory(updated);
    if (currentImage?.id === id) {
      setCurrentImage(updated[0] || null);
    }
  };

  return (
    <div className={`p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950 p-6 md:p-8 text-white shadow-2xl border border-indigo-700/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'ug' ? 'كۆپ ۋاسىتىلىك كۆرۈنمە يۈز & رەسىم سېخى' : 'Multimodal AI Vision & Image Studio'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {lang === 'ug' ? '🎨 سۈنئىي ئىدراك رەسىم & لوگو ستۇدىيىسى' : '🎨 AI Image, Logo & UI Design Studio'}
            </h1>
            <p className="text-sm text-indigo-200/90 max-w-2xl">
              {lang === 'ug'
                ? 'ئۇيغۇرچە ۋە باشقا تىللاردىكى تەسۋىرلەرنى نەپىس رەسىم، كەسپىي ۋېكتور لوگو ۋە زامانىۋى ئەپ/تور كۆرۈنمە يۈزى (UI) قىلىپ ھاسىل قىلىڭ.'
                : 'Turn your text prompts into artistic images, vector logos, and UI prototypes with high-fidelity neural rendering.'}
            </p>
          </div>

          {/* Quick Stats / History Switcher */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'generate'
                  ? 'bg-white text-indigo-950 shadow-md'
                  : 'text-indigo-100 hover:bg-white/10'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>{lang === 'ug' ? 'ئىجاد قىلىش' : 'Create'}</span>
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'gallery'
                  ? 'bg-white text-indigo-950 shadow-md'
                  : 'text-indigo-100 hover:bg-white/10'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>
                {lang === 'ug' ? 'ئامبار' : 'Gallery'} ({history.length})
              </span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Prompt Studio Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              {/* Prompt Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-indigo-500" />
                    <span>{lang === 'ug' ? 'رەسىم ياكى لوگو تەسۋىرى' : 'Prompt Description'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleEnhancePrompt}
                    disabled={!prompt.trim() || isEnhancing}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 transition-colors disabled:opacity-40"
                    title={lang === 'ug' ? 'تەسۋىرنى پەننىي ۋە كىنوچىلىق دەرىجىسىدە كېڭەيتىش' : 'Enrich prompt with cinematic lighting & tags'}
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
                    <span>{isEnhancing ? (lang === 'ug' ? 'ئەلالاشتۇرۇۋاتىدۇ...' : 'Enhancing...') : (lang === 'ug' ? '✨ سۈپىتىنى ئاشۇرۇش' : '✨ Enhance')}</span>
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    placeholder={
                      lang === 'ug'
                        ? 'مەسىلەن: تەڭرىتاغ چوققىسى، ئالتۇن كۈز، قۇياش نۇرىدا جۇلالانغان كۆل ۋە يېشىل قارىغاي دەرەخلىرى...'
                        : 'Describe the scene, logo, or UI mockup in vivid detail...'
                    }
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                  />
                  {prompt && (
                    <button
                      onClick={() => setPrompt('')}
                      className="absolute top-2.5 right-2.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Style Grid */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-500" />
                  <span>{lang === 'ug' ? 'سەنئەت ۋە تېخنىكا ئۇسلۇبى' : 'Artistic & Technical Style'}</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {STYLE_OPTIONS.map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-2.5 rounded-2xl text-start transition-all border flex items-center gap-2.5 ${
                        selectedStyle === style.id
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 dark:border-indigo-500 shadow-sm'
                          : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="text-lg">{style.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {lang === 'ug' ? style.labelUg : style.labelEn}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-500" />
                  <span>{lang === 'ug' ? 'رەسىم نىسبىتى (Aspect Ratio)' : 'Aspect Ratio'}</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {ASPECT_RATIOS.map((ratio) => {
                    const IconComp = ratio.icon;
                    return (
                      <button
                        key={ratio.id}
                        type="button"
                        onClick={() => setAspectRatio(ratio.id)}
                        className={`p-2 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${
                          aspectRatio === ratio.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                            : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                        <span className="text-xs font-mono font-bold">{ratio.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={!prompt.trim() || isGenerating}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{lang === 'ug' ? 'سۈنئىي ئىدراك رەسىم سىزىۋاتىدۇ...' : 'Neural Canvas Rendering...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{lang === 'ug' ? '🎨 رەسىمنى سىزىش (Generate Image)' : '🎨 Render Artwork Now'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Inspiration presets */}
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Compass className="w-4 h-4 text-amber-500" />
                <span>{lang === 'ug' ? '💡 تەييار تۈر ئۈلگىلىرى ۋە ئىلھاملار' : '💡 Inspiration & Quick Prompts'}</span>
              </div>
              <div className="space-y-2">
                {INSPIRATION_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPrompt(item.promptUg);
                      setSelectedStyle(item.style);
                      setAspectRatio(item.ratio);
                    }}
                    className="w-full p-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500 text-start transition-all flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600">
                        {lang === 'ug' ? item.titleUg : item.titleEn}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.promptUg}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                      {item.style}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Display Canvas & Vector Studio (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 min-h-[580px] flex flex-col">
              {currentImage ? (
                <>
                  {/* Canvas Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                        {STYLE_OPTIONS.find((s) => s.id === currentImage.style)?.labelUg || currentImage.style}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{currentImage.aspectRatio}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyPrompt(currentImage.prompt)}
                        className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title={lang === 'ug' ? 'تەسۋىرنى كۆچۈرۈۋېلىش' : 'Copy prompt'}
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>

                      {onSaveToNotes && (
                        <button
                          onClick={() =>
                            onSaveToNotes(
                              `AI Image: ${currentImage.prompt.slice(0, 30)}`,
                              `Prompt: ${currentImage.prompt}\nStyle: ${currentImage.style}\nURL: ${currentImage.imageUrl}`
                            )
                          }
                          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title={lang === 'ug' ? 'خاتىرىگە ساقلاش' : 'Save to Notes'}
                        >
                          <BookmarkPlus className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => setZoomImage(currentImage.imageUrl)}
                        className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title={lang === 'ug' ? 'چوڭايتىپ كۆرۈش' : 'Zoom image'}
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDownload(currentImage)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{lang === 'ug' ? 'چۈشۈرۈۋېلىش' : 'Download'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Artwork Preview Area */}
                  <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 rounded-2xl p-4 overflow-hidden relative group min-h-[360px]">
                    <img
                      src={currentImage.imageUrl}
                      alt={currentImage.prompt}
                      className="max-h-[460px] w-auto max-w-full rounded-xl object-contain shadow-2xl transition-transform duration-300 group-hover:scale-[1.01]"
                    />

                    {/* Prompt Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl">
                      <p className="text-xs text-white line-clamp-2">{currentImage.prompt}</p>
                    </div>
                  </div>

                  {/* Companion SVG Vector Code (If Logo or UI style) */}
                  {currentImage.svgContent && (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileCode className="w-4 h-4 text-emerald-500" />
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {lang === 'ug' ? '✨ ۋېكتور SVG ھۆججەت كودى (Vector Graphic)' : 'Companion SVG Vector Graphic'}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSvgViewMode(svgViewMode === 'preview' ? 'code' : 'preview')}
                            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            {svgViewMode === 'preview' ? (lang === 'ug' ? 'كودنى كۆرۈش' : 'View Code') : (lang === 'ug' ? 'كۆرۈنمە يۈزنى كۆرۈش' : 'Preview SVG')}
                          </button>
                          <button
                            onClick={() => handleDownloadSvg(currentImage)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>SVG</span>
                          </button>
                        </div>
                      </div>

                      {svgViewMode === 'preview' ? (
                        <div
                          className="w-full h-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-3 overflow-hidden shadow-inner [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-40"
                          dangerouslySetInnerHTML={{ __html: currentImage.svgContent }}
                        />
                      ) : (
                        <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] max-h-44 overflow-auto border border-slate-800">
                          {currentImage.svgContent}
                        </pre>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 text-slate-400">
                  <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center">
                    <Palette className="w-10 h-10" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                      {lang === 'ug' ? 'سەنئەت ئىجادىيىتىنى باشلاڭ' : 'Ready to Create Artworks'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {lang === 'ug'
                        ? 'سول تەرەپكە تەسۋىرنى يېزىپ «رەسىمنى سىزىش» نى بېسىڭ ياكى تەييار ئۈلگىلەردىن بىرنى تاللاڭ.'
                        : 'Type your prompt on the left and click "Render Artwork Now" to generate high-resolution visuals.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gallery View Tab */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-500" />
              <span>{lang === 'ug' ? 'ھاسىللانغان رەسىم ۋە لوگولار ئامبىرى' : 'Rendered Artworks Gallery'}</span>
            </h2>
            {history.length > 0 && (
              <button
                onClick={() => {
                  saveHistory([]);
                  setCurrentImage(null);
                }}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-bold cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'ug' ? 'ئامبارنى تازىلاش' : 'Clear Gallery'}</span>
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <p className="text-sm text-slate-500">{lang === 'ug' ? 'تېخى ھېچقانداق رەسىم ھاسىللانمىدى.' : 'No images generated yet.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setCurrentImage(item);
                    setActiveTab('generate');
                  }}
                  className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-indigo-500 cursor-pointer shadow-md transition-all flex flex-col"
                >
                  <div className="aspect-square w-full overflow-hidden bg-black flex items-center justify-center">
                    <img
                      src={item.imageUrl}
                      alt={item.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 flex-1 flex flex-col justify-between space-y-2">
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-2">
                      {item.prompt}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-mono text-indigo-500 font-bold">{item.style}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(item);
                          }}
                          className="p-1 text-slate-400 hover:text-indigo-600"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteItem(item.id, e)}
                          className="p-1 text-slate-400 hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox / Zoom Modal */}
      {zoomImage && (
        <div
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <button
              onClick={() => setZoomImage(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={zoomImage} alt="Zoom" className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};
