import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Zap,
  Brain,
  Flame,
  Feather,
  Check,
  X,
  Cpu,
  Layers,
  Gauge,
  HelpCircle,
  Search,
  Gift,
  Image as ImageIcon,
  Mic,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { GEMINI_MODELS } from '../data/geminiModels';
import { AppLanguage, GeminiModelInfo } from '../types';

interface ModelSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  lang: AppLanguage;
}

export const ModelSelectorModal: React.FC<ModelSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedModelId,
  onSelectModel,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'free' | 'text' | 'multimodal'>('all');

  if (!isOpen) return null;

  const isRTL = lang === 'ug' || lang === 'ar';

  const getModelIcon = (iconName: string, color: string) => {
    const iconClass = `w-5 h-5 ${
      color === 'indigo'
        ? 'text-indigo-600 dark:text-indigo-400'
        : color === 'amber'
        ? 'text-amber-500 dark:text-amber-400'
        : color === 'purple'
        ? 'text-purple-600 dark:text-purple-400'
        : color === 'emerald'
        ? 'text-emerald-600 dark:text-emerald-400'
        : color === 'cyan'
        ? 'text-cyan-600 dark:text-cyan-400'
        : color === 'rose'
        ? 'text-rose-600 dark:text-rose-400'
        : color === 'pink'
        ? 'text-pink-600 dark:text-pink-400'
        : 'text-violet-600 dark:text-violet-400'
    }`;

    switch (iconName) {
      case 'Zap':
        return <Zap className={iconClass} />;
      case 'Brain':
        return <Brain className={iconClass} />;
      case 'Flame':
        return <Flame className={iconClass} />;
      case 'Feather':
        return <Feather className={iconClass} />;
      case 'Image':
        return <ImageIcon className={iconClass} />;
      case 'Eye':
        return <Eye className={iconClass} />;
      case 'Mic':
        return <Mic className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  const getBadgeText = (m: GeminiModelInfo) => {
    if (lang === 'ug') return m.badgeUg;
    if (lang === 'tr') return m.badgeTr || m.badgeEn;
    if (lang === 'ar') return m.badgeAr || m.badgeEn;
    return m.badgeEn;
  };

  const getDescriptionText = (m: GeminiModelInfo) => {
    if (lang === 'ug') return m.descriptionUg;
    if (lang === 'tr') return m.descriptionTr || m.descriptionEn;
    if (lang === 'ar') return m.descriptionAr || m.descriptionEn;
    return m.descriptionEn;
  };

  const filteredModels = GEMINI_MODELS.filter((model) => {
    // Filter by tab
    if (activeTab === 'free' && !model.isFreeTier) return false;
    if (activeTab === 'text' && (model.category === 'vision' || model.category === 'audio')) return false;
    if (activeTab === 'multimodal' && model.category !== 'vision' && model.category !== 'audio') return false;

    // Filter by search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      model.name.toLowerCase().includes(q) ||
      model.id.toLowerCase().includes(q) ||
      model.badgeUg.toLowerCase().includes(q) ||
      model.badgeEn.toLowerCase().includes(q) ||
      model.descriptionUg.toLowerCase().includes(q) ||
      model.descriptionEn.toLowerCase().includes(q)
    );
  });

  return (
    <div
      id="gemini-model-selector-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  {lang === 'ug'
                    ? 'Google Gemini ھەقسىز ۋە ئىلغار مودېللىرى'
                    : lang === 'tr'
                    ? 'Google Gemini Modelleri'
                    : lang === 'ar'
                    ? 'نماذج Google Gemini'
                    : 'Google Gemini Models'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <Gift className="w-3 h-3" />
                  {GEMINI_MODELS.length} {lang === 'ug' ? 'ھەقسىز نۇسخا' : 'Free Models'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'ug'
                  ? 'گۇگۇل AI Studio ھەقسىز كوتىسىنى قوللايدىغان رەسمىي Gemini نۇسخىلىرىنى ئەركىن تاللاڭ'
                  : 'Choose from official Google Gemini models with full Free Tier quota support'}
              </p>
            </div>
          </div>

          <button
            id="close-model-selector-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tabs Controls */}
        <div className="p-3 sm:px-5 sm:py-3 border-b border-slate-100 dark:border-slate-800/80 space-y-2.5 bg-slate-50/40 dark:bg-slate-900/40 shrink-0">
          {/* Search Box */}
          <div className="relative flex items-center">
            <Search className={`w-4 h-4 absolute ${isRTL ? 'right-3' : 'left-3'} text-slate-400 pointer-events-none`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'ug'
                  ? 'مودېل ئىزدەش (مەسىلەن: Flash, Pro, كود، رەسىم)...'
                  : 'Search Gemini model (Flash, Pro, Lite, Code, Vision)...'
              }
              className={`w-full ${isRTL ? 'pr-9 pl-8' : 'pl-9 pr-8'} py-2 text-xs rounded-xl bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={`absolute ${isRTL ? 'left-2.5' : 'right-2.5'} text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {lang === 'ug' ? 'بارلىق نۇسخىلار' : 'All Models'} ({GEMINI_MODELS.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('free')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'free'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>{lang === 'ug' ? '🎁 100% ھەقسىز نۇسخىلار' : '100% Free Tier'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'text'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{lang === 'ug' ? 'تېكىست & كود' : 'Text & Code'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('multimodal')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'multimodal'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{lang === 'ug' ? 'رەسىم & ئاۋاز' : 'Vision & Audio'}</span>
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          {filteredModels.length === 0 ? (
            <div className="text-center py-10 space-y-2 text-slate-400">
              <HelpCircle className="w-8 h-8 mx-auto stroke-1" />
              <p className="text-sm font-medium">
                {lang === 'ug' ? 'ماس كېلىدىغان مودېل تېپىلمىدى' : 'No matching models found'}
              </p>
            </div>
          ) : (
            filteredModels.map((model) => {
              const isSelected = model.id === selectedModelId;

              return (
                <div
                  key={model.id}
                  id={`model-card-${model.id}`}
                  onClick={() => {
                    onSelectModel(model.id);
                    onClose();
                  }}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                        {getModelIcon(model.iconName, model.color)}
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                            {model.name}
                          </span>

                          {/* Free Tier Green Badge */}
                          {model.isFreeTier && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800/60 flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>{lang === 'ug' ? '100% ھەقسىز' : 'Free Tier'}</span>
                            </span>
                          )}

                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              model.isRecommended
                                ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                                : model.category === 'fast'
                                ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                                : model.category === 'reasoning'
                                ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
                                : model.category === 'pro'
                                ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                                : model.category === 'vision'
                                ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
                                : model.category === 'audio'
                                ? 'bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300'
                                : 'bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300'
                            }`}
                          >
                            {getBadgeText(model)}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {getDescriptionText(model)}
                        </p>

                        {/* Free Quota Rate Tag */}
                        {model.freeTierLimitsUg && (
                          <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 pt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>
                              {lang === 'ug' ? model.freeTierLimitsUg : model.freeTierLimitsEn}
                            </span>
                          </div>
                        )}

                        {/* Specs */}
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Gauge className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lang === 'ug' ? 'سۈرئەت:' : 'Speed:'}</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <div
                                  key={s}
                                  className={`w-1.5 h-2 rounded-xs ${
                                    s <= model.speedLevel
                                      ? 'bg-indigo-500 dark:bg-indigo-400'
                                      : 'bg-slate-200 dark:bg-slate-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <Brain className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lang === 'ug' ? 'ئەقلىي كۈچ:' : 'Intelligence:'}</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-2 rounded-xs ${
                                    i <= model.intelligenceLevel
                                      ? 'bg-purple-500 dark:bg-purple-400'
                                      : 'bg-slate-200 dark:bg-slate-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {lang === 'ug' ? 'سىغىم:' : 'Context:'} {model.contextWindow}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Selection Radio / Checkmark */}
                    <div className="shrink-0 pt-1">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-700 hover:border-indigo-400 transition-colors" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Note */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              {lang === 'ug'
                ? 'بارلىق نۇسخىلار گۇگۇل AI Studio ھەقسىز كوتا ئاچقۇچى بىلەن تولۇق ئىشلەيدۇ'
                : 'All models are fully functional with Google AI Studio Free Tier API key'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition-colors cursor-pointer"
          >
            {lang === 'ug' ? 'تاماملاش' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};

