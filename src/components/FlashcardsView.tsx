import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Plus,
  RotateCw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  BookOpen,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Check,
  Zap,
} from 'lucide-react';
import { AppLanguage, Flashcard, FlashcardDeck, QuizQuestion } from '../types';

interface FlashcardsViewProps {
  lang: AppLanguage;
  decks: FlashcardDeck[];
  onAddDeck: (deck: FlashcardDeck) => void;
  onUpdateDeck: (deck: FlashcardDeck) => void;
  onDeleteDeck: (id: string) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  lang,
  decks,
  onAddDeck,
  onUpdateDeck,
  onDeleteDeck,
}) => {
  const isRTL = lang === 'ug' || lang === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [activeDeckId, setActiveDeckId] = useState<string>(decks[0]?.id || '');
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [mode, setMode] = useState<'study' | 'quiz'>('study');

  // Quiz state
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // AI Generator state
  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNewDeckModal, setShowNewDeckModal] = useState(false);

  const activeDeck = decks.find((d) => d.id === activeDeckId) || decks[0];
  const cards = activeDeck?.cards || [];
  const currentCard = cards[currentCardIndex];
  const quizzes = activeDeck?.quizzes || [];
  const currentQuiz = quizzes[quizIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentCardIndex((prev) => (prev + 1) % (cards.length || 1));
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    setCurrentCardIndex((prev) => (prev - 1 + cards.length) % (cards.length || 1));
  };

  const handleDifficultyRating = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (!currentCard || !activeDeck) return;
    const updatedCards = activeDeck.cards.map((c) =>
      c.id === currentCard.id
        ? {
            ...c,
            difficulty,
            lastReviewed: new Date().toISOString().slice(0, 10),
            repetitionCount: (c.repetitionCount || 0) + 1,
          }
        : c
    );
    onUpdateDeck({ ...activeDeck, cards: updatedCards });
    handleNextCard();
  };

  const handleGenerateAiDeck = async () => {
    if (!aiTopic.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          language: lang,
          count: 6,
        }),
      });

      const data = await res.json();
      const newDeckId = `deck-${Date.now()}`;
      const newCards: Flashcard[] = (data.cards || []).map((c: any, i: number) => ({
        id: `fc-${newDeckId}-${i}`,
        deckId: newDeckId,
        front: c.front,
        back: c.back,
        hint: c.hint,
        difficulty: c.difficulty || 'medium',
        repetitionCount: 0,
      }));

      const newQuizzes: QuizQuestion[] = (data.quizzes || []).map((q: any, i: number) => ({
        id: `quiz-${newDeckId}-${i}`,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      }));

      const newDeck: FlashcardDeck = {
        id: newDeckId,
        title: data.deckTitle || aiTopic,
        description: data.description || 'AI تەلىم كارتىلىرى',
        category: 'AI Generated',
        cards: newCards,
        quizzes: newQuizzes,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      onAddDeck(newDeck);
      setActiveDeckId(newDeckId);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setAiTopic('');
      setShowNewDeckModal(false);
    } catch (e) {
      console.error('Failed to generate deck:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectQuizOption = (idx: number) => {
    if (quizSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitQuiz = () => {
    if (selectedOption === null || quizSubmitted || !currentQuiz) return;
    setQuizSubmitted(true);
    if (selectedOption === currentQuiz.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setQuizSubmitted(false);
    setQuizIndex((prev) => (prev + 1) % (quizzes.length || 1));
  };

  return (
    <div id="flashcards-main-container" className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 text-white shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {lang === 'ug'
                  ? '🧠 ئەقلىي ئۆگىنىش كارتىلىرى & سىناق مەركىزى'
                  : lang === 'tr'
                  ? '🧠 AI Destekli Bilgi Kartları & Test Merkezi'
                  : lang === 'ar'
                  ? '🧠 بطاقات الاستذكار الذكية ومركز الاختبار'
                  : '🧠 AI Flashcards & Knowledge Quiz Engine'}
              </h2>
              <p className="text-xs text-white/80">
                {lang === 'ug'
                  ? 'سۈنئىي ئىدراك ئارقىلىق مۇرەككەپ بىلىملەرنى قەدەممۇ-قەدەم پۇختا ئەستە قالدۇرۇش'
                  : 'Spaced repetition learning & generative knowledge reinforcement'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewDeckModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white text-indigo-900 font-bold text-xs shadow-md hover:bg-white/90 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                {lang === 'ug' ? 'AI كارتىسى ھاسىللاش' : 'Generate AI Deck'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Decks Selection Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {decks.map((deck) => {
          const isActive = deck.id === activeDeck?.id;
          return (
            <button
              key={deck.id}
              onClick={() => {
                setActiveDeckId(deck.id);
                setCurrentCardIndex(0);
                setIsFlipped(false);
                setShowHint(false);
                setQuizIndex(0);
                setQuizSubmitted(false);
                setSelectedOption(null);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{deck.title}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {deck.cards.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mode Switcher: Study Cards vs. Interactive Quiz */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setMode('study')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'study'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {lang === 'ug' ? '📖 قايتىلاش ھالىتى' : '📖 Study Mode'}
          </button>
          {quizzes.length > 0 && (
            <button
              onClick={() => setMode('quiz')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'quiz'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {lang === 'ug' ? '🎯 سىناق ھالىتى' : '🎯 Quiz Mode'}
            </button>
          )}
        </div>

        {mode === 'study' && cards.length > 0 && (
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {currentCardIndex + 1} / {cards.length}
          </span>
        )}
      </div>

      {/* Main View Area */}
      {mode === 'study' ? (
        cards.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <BrainCircuit className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              {lang === 'ug'
                ? 'بۇ تۈردە تېخى كارتىلار يوق. AI ئارقىلىق يېڭى كارتا ھاسىللاڭ.'
                : 'No cards in this deck. Generate new cards with AI.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Interactive Flip Card */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative min-h-[300px] sm:min-h-[360px] rounded-3xl p-6 sm:p-10 bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-950/80 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group select-none"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    isFlipped
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                  }`}
                >
                  {isFlipped
                    ? lang === 'ug'
                      ? 'جاۋاب (Back)'
                      : 'Answer'
                    : lang === 'ug'
                    ? 'سوئال / ئۇقۇم (Front)'
                    : 'Question'}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <RotateCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
                    {lang === 'ug' ? 'ئايلاندۇرۇش ئۈچۈن بېسىڭ' : 'Click to flip'}
                  </span>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="my-auto py-6 text-center space-y-4">
                <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed max-w-2xl mx-auto">
                  {isFlipped ? currentCard.back : currentCard.front}
                </h3>

                {!isFlipped && currentCard.hint && (
                  <div>
                    {showHint ? (
                      <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl inline-flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>{currentCard.hint}</span>
                      </p>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHint(true);
                        }}
                        className="text-xs text-slate-400 hover:text-amber-500 inline-flex items-center gap-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{lang === 'ug' ? 'ئەسكەرتىشنى كۆرۈش' : 'Show Hint'}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Rating Controls (When flipped) */}
              {isFlipped ? (
                <div
                  className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleDifficultyRating('hard')}
                    className="px-3.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 transition-colors"
                  >
                    🔴 {lang === 'ug' ? 'تەس (Hard)' : 'Hard'}
                  </button>
                  <button
                    onClick={() => handleDifficultyRating('medium')}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 text-xs font-bold hover:bg-amber-100 transition-colors"
                  >
                    🟡 {lang === 'ug' ? 'ئوتتۇراھال' : 'Medium'}
                  </button>
                  <button
                    onClick={() => handleDifficultyRating('easy')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-100 transition-colors"
                  >
                    🟢 {lang === 'ug' ? 'ئاسان (Easy)' : 'Easy'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{activeDeck.title}</span>
                  <span>{currentCard.repetitionCount || 0} قېتىم كۆرۈلدى</span>
                </div>
              )}
            </div>

            {/* Prev / Next Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handlePrevCard}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 shadow-xs transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
              >
                {isFlipped
                  ? lang === 'ug'
                    ? 'سوئالغا قايتىش'
                    : 'Show Front'
                  : lang === 'ug'
                  ? 'جاۋابنى ئېچىش'
                  : 'Flip Card'}
              </button>
              <button
                onClick={handleNextCard}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 shadow-xs transition-all"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )
      ) : (
        /* Quiz Mode */
        quizzes.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {lang === 'ug' ? 'سىناق سوئالى' : 'Quiz Question'} {quizIndex + 1} / {quizzes.length}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                {lang === 'ug' ? 'نەتىجە:' : 'Score:'} {quizScore} / {quizzes.length}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQuiz.question}
            </h3>

            <div className="space-y-2.5">
              {currentQuiz.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = currentQuiz.correctIndex === idx;

                let btnStyle =
                  'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
                if (quizSubmitted) {
                  if (isCorrect) {
                    btnStyle =
                      'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500';
                  } else if (isSelected && !isCorrect) {
                    btnStyle =
                      'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-900 dark:text-red-200';
                  }
                } else if (isSelected) {
                  btnStyle =
                    'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuizOption(idx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {quizSubmitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                    {quizSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {quizSubmitted && currentQuiz.explanation && (
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
                  {lang === 'ug' ? 'ئىزاھات:' : 'Explanation:'}
                </span>
                <p>{currentQuiz.explanation}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={selectedOption === null}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs disabled:opacity-40 shadow-md transition-all cursor-pointer"
                >
                  {lang === 'ug' ? 'جاۋابنى تەكشۈرۈش' : 'Submit Answer'}
                </button>
              ) : (
                <button
                  onClick={handleNextQuiz}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{lang === 'ug' ? 'كېيىنكى سوئال' : 'Next Question'}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )
      )}

      {/* AI Generate New Deck Modal */}
      {showNewDeckModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in-50">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                {lang === 'ug' ? 'AI ئارقىلىق تەلىم كارتىسى ھاسىللاش' : 'Generate AI Flashcard Deck'}
              </h3>
              <button
                onClick={() => setShowNewDeckModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'ug'
                ? 'خالىغان بىر تېمىنى كىرگۈزسىڭىز (مەسىلەن: "Node.js Architecture", "Docker Basics")، AI ئاپتوماتىك سوئال-جاۋاب كارتىلىرىنى ھاسىللايدۇ.'
                : 'Enter any subject or skill to generate a structured flashcard set.'}
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {lang === 'ug' ? 'تېما ياكى مەزمۇن:' : 'Topic or Subject:'}
              </label>
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g. Next.js 15 Server Actions, Clean Architecture..."
                className="w-full mt-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNewDeckModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
              >
                {lang === 'ug' ? 'بىكار قىلىش' : 'Cancel'}
              </button>
              <button
                onClick={handleGenerateAiDeck}
                disabled={!aiTopic.trim() || isGenerating}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold disabled:opacity-50 shadow-md flex items-center gap-1.5"
              >
                {isGenerating && <RotateCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{isGenerating ? 'ھاسىللاۋاتىدۇ...' : 'ھاسىللاش'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
