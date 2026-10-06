import React, { useState, useEffect } from 'react';
import {
  Globe,
  BookOpen,
  Volume2,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Send,
  MessageSquare,
  Check,
  Award,
  HelpCircle,
  Play,
  Languages,
  PenTool,
  BookmarkCheck,
  ChevronRight,
  AlertCircle,
  VolumeX,
} from 'lucide-react';
import { AppLanguage, LanguageLesson, GrammarCheckResult } from '../types';
import { speakTextAi, stopSpeakingAi } from '../utils/aiVoiceService';

interface LanguageTutorViewProps {
  lang: AppLanguage;
}

export const LanguageTutorView: React.FC<LanguageTutorViewProps> = ({ lang }) => {
  const isRTL = lang === 'ug' || lang === 'ar';

  const [targetLang, setTargetLang] = useState<'en' | 'tr' | 'ar'>('en');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [topic, setTopic] = useState<string>('Daily Tech & Work Conversation');
  const [activeSubTab, setActiveSubTab] = useState<'vocabulary' | 'dialogue' | 'grammarChecker' | 'quiz'>('vocabulary');

  const [lesson, setLesson] = useState<LanguageLesson | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState<boolean>(false);
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);

  // Grammar Checker State
  const [userGrammarInput, setUserGrammarInput] = useState<string>('');
  const [grammarResult, setGrammarResult] = useState<GrammarCheckResult | null>(null);
  const [isCheckingGrammar, setIsCheckingGrammar] = useState<boolean>(false);

  // Quiz State
  const [quizScore, setQuizScore] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const predefinedTopics = [
    { id: 'tech', labelUg: '💻 كود & پەن-تېخنىكا', labelEn: 'Tech & IT', prompt: 'Software Engineering & IT Vocabulary' },
    { id: 'daily', labelUg: '☕ كۈندىلىك تۇرمۇش', labelEn: 'Daily Life', prompt: 'Daily Habits & Casual Conversations' },
    { id: 'business', labelUg: '💼 سودا ۋە خىزمەت', labelEn: 'Business', prompt: 'Business Meetings & Professional Negotiation' },
    { id: 'travel', labelUg: '✈️ ساياھەت ۋە ئايرودروم', labelEn: 'Travel', prompt: 'Travel, Airports, Hotel & Dining' },
    { id: 'academic', labelUg: '🎓 ئۇنىۋېرسىتېت & ئىمتىھان', labelEn: 'Academic', prompt: 'University Studies & Academic Research' },
  ];

  // Fetch or generate lesson
  const fetchLesson = async (chosenTopic = topic, chosenLang = targetLang, chosenLevel = level) => {
    setIsLoadingLesson(true);
    try {
      const res = await fetch('/api/language-tutor/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetLanguage: chosenLang,
          level: chosenLevel,
          topic: chosenTopic,
          userLang: lang,
        }),
      });
      const data = await res.json();
      setLesson(data);
      // Reset quiz
      setSelectedAnswers({});
      setQuizSubmitted(false);
      setQuizScore(0);
    } catch (err) {
      console.error('Error fetching lesson:', err);
    } finally {
      setIsLoadingLesson(false);
    }
  };

  useEffect(() => {
    fetchLesson();
  }, [targetLang, level]);

  const handleSpeak = async (text: string, id: string) => {
    stopSpeakingAi();
    setPlayingWordId(id);
    try {
      await speakTextAi(text, targetLang as any, {
        onEnd: () => setPlayingWordId(null),
        onError: () => setPlayingWordId(null),
      });
    } catch {
      setPlayingWordId(null);
    }
  };

  const handleCheckGrammar = async () => {
    if (!userGrammarInput.trim()) return;
    setIsCheckingGrammar(true);
    try {
      const res = await fetch('/api/language-tutor/check-grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: userGrammarInput,
          targetLanguage: targetLang,
          userLang: lang,
        }),
      });
      const data = await res.json();
      setGrammarResult(data);
    } catch (e) {
      console.error('Grammar check failed:', e);
    } finally {
      setIsCheckingGrammar(false);
    }
  };

  const targetLangLabels = {
    en: { name: 'English', native: 'English', flag: '🇬🇧', defaultPlaceholder: 'Write a sentence in English to check grammar (e.g., I has finished my work yesterday)...' },
    tr: { name: 'Türkçe', native: 'Türkçe', flag: '🇹🇷', defaultPlaceholder: 'Türkçe bir cümle yazın (örn: Ben dün okula gidiyorum)...' },
    ar: { name: 'العربية', native: 'العربية', flag: '🇸🇦', defaultPlaceholder: 'اكتب جملة باللغة العربية للتحقق من القواعد...' },
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-teal-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'ug' ? 'سۈنئىي ئىدراك كۆپ تىل مەركىزى' : 'AI Polyglot Language Studio'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {lang === 'ug' ? '🌍 تىل ئۆگىنىش ۋە گرامماتىكا مەشقاۋۇلى' : 'AI Language Learning & Grammar Tutor'}
            </h2>
            <p className="mt-2 text-sm text-teal-100 max-w-2xl leading-relaxed">
              {lang === 'ug'
                ? 'ئىنگلىزچە، تۈركچە ۋە ئەرەبچە تىللىرىنى كۈندىلىك سۆزلۈك، سىنارىيەلىك سۆزلىشىش، ھەقىقىي تەلەپپۇز ئاڭلاش ۋە گرامماتىكا تۈزىتىش ئارقىلىق سىستېمىلىق ئۆگىنىڭ.'
                : 'Master English, Turkish, and Arabic with tailored daily vocabulary, real-life dialogue simulations, native audio pronunciations, and AI grammar audits.'}
            </p>
          </div>

          {/* Quick Language Selector */}
          <div className="flex flex-wrap items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
            {(['en', 'tr', 'ar'] as const).map((lKey) => {
              const info = targetLangLabels[lKey];
              const isSelected = targetLang === lKey;
              return (
                <button
                  key={lKey}
                  onClick={() => setTargetLang(lKey)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-md scale-105'
                      : 'text-white/90 hover:bg-white/20'
                  }`}
                >
                  <span className="text-base">{info.flag}</span>
                  <span>{info.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Level and Topic Controls Bar */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-teal-100">{lang === 'ug' ? 'دەرىجە:' : 'Level:'}</span>
            {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  level === lvl ? 'bg-white text-teal-800 font-bold shadow-xs' : 'bg-black/20 text-white/80 hover:bg-black/30'
                }`}
              >
                {lang === 'ug'
                  ? lvl === 'beginner'
                    ? 'باشلانغۇچ'
                    : lvl === 'intermediate'
                    ? 'ئوتتۇرا'
                    : 'يۇقىرى'
                  : lvl}
              </button>
            ))}
          </div>

          {/* Predefined Topic Chips */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
            {predefinedTopics.map((pt) => (
              <button
                key={pt.id}
                onClick={() => {
                  setTopic(pt.prompt);
                  fetchLesson(pt.prompt, targetLang, level);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                  topic === pt.prompt ? 'bg-amber-400 text-slate-900 font-bold' : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {lang === 'ug' ? pt.labelUg : pt.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('vocabulary')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'vocabulary'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{lang === 'ug' ? '🔤 كۈندىلىك سۆزلۈك & ئاۋاز' : 'Vocabulary & Audio'}</span>
          {lesson?.dailyWords?.length ? (
            <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-white/20 text-white">{lesson.dailyWords.length}</span>
          ) : null}
        </button>

        <button
          onClick={() => setActiveSubTab('dialogue')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'dialogue'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{lang === 'ug' ? '💬 سىنارىيەلىك سۆزلىشىش' : 'Dialogue Practice'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('grammarChecker')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'grammarChecker'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>{lang === 'ug' ? '✍️ جۈملە & گرامماتىكا تەكشۈرۈش' : 'Grammar Audit & Explainer'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'quiz'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{lang === 'ug' ? '🎯 كۈندىلىك سىناق تېستى' : 'Daily Quiz'}</span>
        </button>

        <button
          onClick={() => fetchLesson()}
          disabled={isLoadingLesson}
          className="mr-auto px-3 py-2 text-xs font-bold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Refresh lesson"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLesson ? 'animate-spin' : ''}`} />
          <span>{lang === 'ug' ? 'يېڭىلاش' : 'Generate New'}</span>
        </button>
      </div>

      {/* 1. Vocabulary Sub-Tab */}
      {activeSubTab === 'vocabulary' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lesson?.dailyWords?.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-teal-400 dark:hover:border-teal-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 uppercase">
                      {item.partOfSpeech || 'word'}
                    </span>
                    <button
                      onClick={() => handleSpeak(item.word, item.id)}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        playingWordId === item.id
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-teal-100 dark:hover:bg-teal-900/60'
                      }`}
                      title="Listen native pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-wide">
                      {item.word}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{item.phonetic}</p>
                    <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 mt-2">
                      {item.translation}
                    </p>
                  </div>

                  {item.exampleSentence && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                        "{item.exampleSentence}"
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {item.exampleTranslation}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 flex items-center justify-between">
                  <button
                    onClick={() => handleSpeak(item.exampleSentence || item.word, `${item.id}-sentence`)}
                    className="text-[11px] font-semibold text-slate-500 hover:text-teal-600 flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3" />
                    <span>{lang === 'ug' ? 'جۈملىنى ئاڭلاش' : 'Listen sentence'}</span>
                  </button>
                  <span className="text-[10px] text-slate-400 font-medium">Gemini Voice</span>
                </div>
              </div>
            ))}
          </div>

          {/* Grammar Quick Card */}
          {lesson?.grammarTip && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800/60 rounded-3xl p-6">
              <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300 font-bold text-sm mb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{lesson.grammarTip.title || (lang === 'ug' ? 'مۇھىم گرامماتىكا نۇقتىسى' : 'Grammar Focus')}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {lesson.grammarTip.rule}
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 mb-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>{lang === 'ug' ? 'توغرا ئىپادىلەش' : 'Correct'}</span>
                  </span>
                  <p className="text-slate-800 dark:text-slate-200">{lesson.grammarTip.goodExample}</p>
                </div>

                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                  <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1 mb-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{lang === 'ug' ? 'كۆپ كۆرۈلىدىغان خاتالىق' : 'Common Mistake'}</span>
                  </span>
                  <p className="text-slate-800 dark:text-slate-200">{lesson.grammarTip.badExample}</p>
                </div>
              </div>

              {lesson.grammarTip.explanation && (
                <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                  💡 {lesson.grammarTip.explanation}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. Dialogue Sub-Tab */}
      {activeSubTab === 'dialogue' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-600" />
              <span>{lesson?.dialogue?.title || 'Dialogue Session'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">{lesson?.dialogue?.scenario}</p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {lesson?.dialogue?.turns?.map((turn, idx) => {
              const isSpeakerA = turn.role === 'speakerA';
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isSpeakerA ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                      {turn.speakerName}
                    </span>
                    <button
                      onClick={() => handleSpeak(turn.text, `dialogue-${idx}`)}
                      className="p-1 rounded-md text-slate-400 hover:text-teal-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Speak line"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div
                    className={`max-w-lg p-4 rounded-2xl text-xs sm:text-sm font-medium ${
                      isSpeakerA
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-sm'
                        : 'bg-teal-600 text-white rounded-tr-sm'
                    }`}
                  >
                    <p className="leading-relaxed font-sans">{turn.text}</p>
                    <p
                      className={`text-xs mt-2 pt-2 border-t font-normal ${
                        isSpeakerA
                          ? 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                          : 'border-teal-500/60 text-teal-100'
                      }`}
                    >
                      {turn.translation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Grammar Checker Sub-Tab */}
      {activeSubTab === 'grammarChecker' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PenTool className="w-4 h-4 text-teal-600" />
                <span>{lang === 'ug' ? 'جۈملىنى يېزىڭ ياكى چاپلاڭ' : 'Input Text to Audit'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'ug'
                  ? `${targetLangLabels[targetLang].name} تىلىدىكى جۈملە ياكى ماقالىڭىزنى كىرگۈزۈڭ، سۈنئىي ئىدراك گرامماتىكا ۋە سۆز ئىشلىتىلىشىنى تەھلىل قىلىدۇ.`
                  : `Type sentences in ${targetLangLabels[targetLang].name}. AI will inspect tense, prepositions, spelling, and tone.`}
              </p>
            </div>

            <textarea
              rows={6}
              value={userGrammarInput}
              onChange={(e) => setUserGrammarInput(e.target.value)}
              placeholder={targetLangLabels[targetLang].defaultPlaceholder}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {userGrammarInput.trim().split(/\s+/).filter(Boolean).length} {lang === 'ug' ? 'سۆز' : 'words'}
              </span>
              <button
                onClick={handleCheckGrammar}
                disabled={isCheckingGrammar || !userGrammarInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-md shadow-teal-500/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isCheckingGrammar ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{lang === 'ug' ? 'تەكشۈرۈۋاتىدۇ...' : 'Auditing...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'ug' ? 'گرامماتىكىنى تەكشۈرۈش' : 'Check Grammar'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Grammar Result Column */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'ug' ? 'تەھلىل نەتىجىسى ۋە تۈزىتىلگەن نۇسخا' : 'Audit Result & Polish'}</span>
            </h3>

            {grammarResult ? (
              <div className="space-y-4">
                {/* Score Banner */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">{lang === 'ug' ? 'تەبىئىيلىك ۋە توغرىلىق دەرىجىسى' : 'Accuracy Score'}</p>
                    <p className="text-2xl font-black text-teal-600 dark:text-teal-400">{grammarResult.score} / 100</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      grammarResult.hasErrors
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}
                  >
                    {grammarResult.hasErrors
                      ? (lang === 'ug' ? 'تۈزىتىشكە تېگىشلىك ئورۇنلار بار' : 'Corrections Suggested')
                      : (lang === 'ug' ? 'مۇكەممەل! خاتالىق بايقالمىدى' : 'Pristine Grammar')}
                  </span>
                </div>

                {/* Corrected Text Box */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      {lang === 'ug' ? 'تۈزىتىلگەن نۇسخىسى:' : 'Corrected Version:'}
                    </span>
                    <button
                      onClick={() => handleSpeak(grammarResult.correctedText, 'corrected-text')}
                      className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-semibold hover:underline"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{lang === 'ug' ? 'ئاڭلاش' : 'Listen'}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-900 dark:text-white font-medium leading-relaxed font-sans">
                    {grammarResult.correctedText}
                  </p>
                </div>

                {/* Explanations List */}
                {grammarResult.explanations?.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {lang === 'ug' ? 'تەپسىلىي خاتالىق ئانالىزى:' : 'Detailed Breakdown:'}
                    </h4>
                    {grammarResult.explanations.map((exp, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="line-through text-rose-500 font-medium">{exp.errorSnippet}</span>
                          <ChevronRight className="w-3 h-3 text-slate-400" />
                          <span className="text-emerald-600 font-bold">{exp.correction}</span>
                          {exp.category && (
                            <span className="mr-auto px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {exp.category}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">{exp.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400">
                <PenTool className="w-8 h-8 stroke-1 mb-2 text-slate-300 dark:text-slate-600" />
                <p className="text-xs">
                  {lang === 'ug'
                    ? 'جۈملىنى يېزىپ «تەكشۈرۈش» كۇنۇپكىسىنى باسسىڭىز، گرامماتىكا تەھلىلى بۇ يەردە كۆرۈنىدۇ.'
                    : 'Input your sentence and hit audit to see comprehensive explanations.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Quiz Sub-Tab */}
      {activeSubTab === 'quiz' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>{lang === 'ug' ? 'بۈگۈنكى سۆزلۈك سىنىقى' : 'Daily Vocabulary Quiz'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'ug' ? 'يۇقىرىدا ئۆگەنگەن سۆزلەر بويىچە بىلىمىڭىزنى مۇستەھكەملەڭ.' : 'Reinforce the words you just learned.'}
              </p>
            </div>
            {quizSubmitted && (
              <div className="text-right">
                <p className="text-xs text-slate-500">{lang === 'ug' ? 'نەتىجىڭىز' : 'Score'}</p>
                <p className="text-xl font-bold text-teal-600">{quizScore} / {lesson?.dailyWords?.length || 0}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {lesson?.dailyWords?.map((wordItem, qIdx) => {
              // Generate mock options: correct one + 3 other word translations
              const correctOption = wordItem.translation;
              const allTranslations = lesson.dailyWords.map((w) => w.translation);
              const otherOptions = allTranslations.filter((t) => t !== correctOption);
              const options = [correctOption, ...otherOptions.slice(0, 3)].sort();

              const userPick = selectedAnswers[qIdx];
              return (
                <div key={wordItem.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                    {qIdx + 1}. "{wordItem.word}" {lang === 'ug' ? 'سۆزىنىڭ ئۇيغۇرچە مەنىسى نېمە؟' : 'means:'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {options.map((opt, optIdx) => {
                      const isChosen = userPick === optIdx;
                      const isCorrect = opt === correctOption;
                      let btnStyle = 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-400 font-bold';
                        } else if (isChosen && !isCorrect) {
                          btnStyle = 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-400';
                        }
                      } else if (isChosen) {
                        btnStyle = 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-500 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                          className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {!quizSubmitted ? (
              <button
                onClick={() => {
                  let score = 0;
                  lesson?.dailyWords?.forEach((w, idx) => {
                    const allTranslations = lesson.dailyWords.map((item) => item.translation);
                    const options = [w.translation, ...allTranslations.filter((t) => t !== w.translation).slice(0, 3)].sort();
                    if (options[selectedAnswers[idx]] === w.translation) {
                      score++;
                    }
                  });
                  setQuizScore(score);
                  setQuizSubmitted(true);
                }}
                disabled={Object.keys(selectedAnswers).length < (lesson?.dailyWords?.length || 1)}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-md shadow-teal-500/20 disabled:opacity-50 cursor-pointer"
              >
                {lang === 'ug' ? 'نەتىجىنى تاپشۇرۇش' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setQuizSubmitted(false);
                }}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all cursor-pointer"
              >
                {lang === 'ug' ? 'قايتا سىناش' : 'Retake Quiz'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
