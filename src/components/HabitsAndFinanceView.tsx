import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Flame,
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Sparkles,
  CheckCircle2,
  Trash2,
  PieChart,
  Calendar,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { AppLanguage, HabitItem, FinanceTransaction, BudgetGoal } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HabitsAndFinanceViewProps {
  lang: AppLanguage;
  habits: HabitItem[];
  transactions: FinanceTransaction[];
  budgetGoals: BudgetGoal[];
  onToggleHabitToday: (id: string) => void;
  onAddHabit: (habit: Omit<HabitItem, 'id' | 'streak' | 'bestStreak' | 'completedDates'>) => void;
  onDeleteHabit: (id: string) => void;
  onAddTransaction: (tx: Omit<FinanceTransaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
}

export const HabitsAndFinanceView: React.FC<HabitsAndFinanceViewProps> = ({
  lang,
  habits,
  transactions,
  budgetGoals,
  onToggleHabitToday,
  onAddHabit,
  onDeleteHabit,
  onAddTransaction,
  onDeleteTransaction,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRTL = lang === 'ug' || lang === 'ar';

  const [activeTab, setActiveTab] = useState<'habits' | 'finance'>('habits');
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);
  const [showAddTxModal, setShowAddTxModal] = useState(false);

  // New Habit Form
  const [habitTitle, setHabitTitle] = useState('');
  const [habitCategory, setHabitCategory] = useState<HabitItem['category']>('coding');
  const [habitColor, setHabitColor] = useState('#6366f1');

  // New Transaction Form
  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState<number>(50);
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');
  const [txCategory, setTxCategory] = useState<FinanceTransaction['category']>('software');
  const [txNote, setTxNote] = useState('');

  // AI Financial Advisor State
  const [isAdvising, setIsAdvising] = useState(false);
  const [adviceResult, setAdviceResult] = useState<{ advice: string; tips: string[] } | null>(null);

  const todayStr = new Date().toISOString().slice(0, 10);

  const handleHabitToggle = (id: string) => {
    onToggleHabitToday(id);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
    });
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitTitle.trim()) return;

    onAddHabit({
      title: habitTitle,
      frequency: 'daily',
      category: habitCategory,
      icon: 'sparkles',
      color: habitColor,
    });

    setHabitTitle('');
    setShowAddHabitModal(false);
  };

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txTitle.trim() || txAmount <= 0) return;

    onAddTransaction({
      title: txTitle,
      amount: txAmount,
      type: txType,
      category: txCategory,
      date: todayStr,
      note: txNote,
    });

    setTxTitle('');
    setTxAmount(50);
    setTxNote('');
    setShowAddTxModal(false);
  };

  const handleGetAiAdvice = async () => {
    setIsAdvising(true);
    try {
      const res = await fetch('/api/finance-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions,
          budgetGoals,
          language: lang,
        }),
      });
      const data = await res.json();
      setAdviceResult({
        advice: data.advice || 'Financial status is healthy and on track.',
        tips: data.actionableTips || ['Track software subscriptions monthly'],
      });
    } catch (e) {
      console.error('Advisor error:', e);
    } finally {
      setIsAdvising(false);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const netSavings = totalIncome - totalExpense;

  return (
    <div id="habits-finance-container" className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t.habitsAndFinanceTitle}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.habitsAndFinanceDesc}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('habits')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'habits'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>{t.dailyHabitsTab}</span>
          </button>
          <button
            onClick={() => setActiveTab('finance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'finance'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4 text-emerald-500" />
            <span>{t.financeBudgetTab}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Daily Habits Tracker */}
      {activeTab === 'habits' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-500" />
              <span>Active Streak Habits</span>
            </h2>

            <button
              onClick={() => setShowAddHabitModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addHabit}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map((habit) => {
              const isCompletedToday = habit.completedDates.includes(todayStr);
              return (
                <div
                  key={habit.id}
                  style={{ borderLeftColor: habit.color }}
                  className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border-y border-r border-slate-200 dark:border-slate-800 border-l-4 shadow-sm space-y-4 transition-all ${
                    isCompletedToday ? 'bg-amber-50/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                        {habit.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white pt-1">
                        {habit.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => onDeleteHabit(habit.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Streak Metrics */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                        <Flame className="w-5 h-5 fill-amber-500" />
                        <span className="text-lg font-extrabold font-mono">{habit.streak}</span>
                        <span className="text-[10px] uppercase text-slate-400">days</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        (Best: {habit.bestStreak}d)
                      </span>
                    </div>

                    <button
                      onClick={() => handleHabitToggle(habit.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isCompletedToday
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isCompletedToday ? 'Done Today' : 'Mark Done'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Finance & Cash Flow */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>{t.income}</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                ${totalIncome.toLocaleString()}
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>{t.expense}</span>
                <ArrowDownLeft className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-2xl font-extrabold font-mono text-red-600 dark:text-red-400">
                ${totalExpense.toLocaleString()}
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>{t.netSavings}</span>
                <TrendingUp className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-2xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
                ${netSavings.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Action Bar & AI Coach */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleGetAiAdvice}
              disabled={isAdvising}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isAdvising ? 'animate-spin' : 'text-amber-300'}`} />
              <span>{isAdvising ? t.analyzingFinances : t.aiFinanceAdvisor}</span>
            </button>

            <button
              onClick={() => setShowAddTxModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addTransaction}</span>
            </button>
          </div>

          {/* AI Advisor Result */}
          {adviceResult && (
            <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Financial Advice:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {adviceResult.advice}
              </p>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 pt-1">
                {adviceResult.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Transaction Ledger Table */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Transactions
            </h3>

            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {tx.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-400 font-mono">
                        {tx.category}
                      </span>
                    </div>
                    {tx.note && (
                      <p className="text-[11px] text-slate-400">{tx.note}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-bold font-mono ${
                        tx.type === 'income'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-red-500 dark:text-red-400'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}${tx.amount}
                    </span>

                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Habit Modal */}
      {showAddHabitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.addHabit}
            </h3>

            <form onSubmit={handleCreateHabit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t.habitTitle}
                </label>
                <input
                  type="text"
                  required
                  value={habitTitle}
                  onChange={(e) => setHabitTitle(e.target.value)}
                  placeholder="e.g. Read 20 pages of architecture docs..."
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select
                  value={habitCategory}
                  onChange={(e) => setHabitCategory(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="coding">Coding & Tech</option>
                  <option value="learning">Learning & Books</option>
                  <option value="focus">Deep Focus</option>
                  <option value="health">Health & Fitness</option>
                  <option value="mindset">Mindset & Journal</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Color Accent
                </label>
                <div className="flex items-center gap-2 mt-2">
                  {['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setHabitColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        habitColor === c ? 'scale-125 ring-2 ring-slate-900 dark:ring-white' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddHabitModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  {t.addHabit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.addTransaction}
            </h3>

            <form onSubmit={handleCreateTx} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Description / Title
                </label>
                <input
                  type="text"
                  required
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  placeholder="e.g. Freelance project milestone 1"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Type
                  </label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={txAmount}
                    onChange={(e) => setTxAmount(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value as FinanceTransaction['category'])}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="software">Software / Tech</option>
                  <option value="freelance">Freelance</option>
                  <option value="salary">Salary</option>
                  <option value="learning">Learning / Education</option>
                  <option value="living">Living / Rent</option>
                  <option value="food">Food & Dining</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTxModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
