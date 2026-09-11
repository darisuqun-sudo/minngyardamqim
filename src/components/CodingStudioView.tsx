import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Bug,
  Sparkles,
  Play,
  Copy,
  CheckCircle2,
  RefreshCw,
  Database,
  Search,
  ArrowRightLeft,
  BookOpen,
  FileCode2,
  Layers,
  Zap,
  Cpu,
  ShieldCheck,
  AlertCircle,
  Clock,
  HardDrive,
  Download,
  Share2,
} from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface CodingStudioViewProps {
  lang: AppLanguage;
  onSaveToNotes?: (title: string, content: string) => void;
}

type StudioTab = 'generate' | 'debug' | 'explain' | 'convert' | 'database' | 'runner' | 'regex' | 'templates';

export const CodingStudioView: React.FC<CodingStudioViewProps> = ({
  lang,
  onSaveToNotes,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRTL = lang === 'ug' || lang === 'ar';

  const [activeSubTab, setActiveSubTab] = useState<StudioTab>('generate');

  // Generator State
  const [genPrompt, setGenPrompt] = useState<string>('');
  const [genLanguage, setGenLanguage] = useState<string>('python');
  const [genFramework, setGenFramework] = useState<string>('fastapi');
  const [genComplexity, setGenComplexity] = useState<string>('intermediate');
  const [genIncludeTests, setGenIncludeTests] = useState<boolean>(true);
  const [genIncludeTypes, setGenIncludeTypes] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genResult, setGenResult] = useState<any>(null);

  // Debugger State
  const [debugCode, setDebugCode] = useState<string>(`def process_transactions(data):
    total = 0
    # Bug 1: Missing null check and incorrect key access
    for item in data:
        amount = item["amount"]
        if amount > 100:
            total += amount
    return total

# Sample call that throws KeyError / TypeError
records = [{"id": 1, "amount": 150}, {"id": 2}, None]
print(process_transactions(records))`);
  const [debugErrorLog, setDebugErrorLog] = useState<string>(`TypeError: 'NoneType' object is not subscriptable
KeyError: 'amount'`);
  const [debugLang, setDebugLang] = useState<string>('python');
  const [isDebugging, setIsDebugging] = useState<boolean>(false);
  const [debugResult, setDebugResult] = useState<any>(null);

  // Explainer State
  const [explainCode, setExplainCode] = useState<string>(`function quicksort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  return [...quicksort(left), ...middle, ...quicksort(right)];
}`);
  const [explainLang, setExplainLang] = useState<string>('javascript');
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const [explainResult, setExplainResult] = useState<any>(null);

  // Converter State
  const [convertCode, setConvertCode] = useState<string>(`def calculate_fibonacci(n: int) -> list[int]:
    if n <= 0:
        return []
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence[:n]`);
  const [fromLang, setFromLang] = useState<string>('python');
  const [toLang, setToLang] = useState<string>('typescript');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [convertResult, setConvertResult] = useState<any>(null);

  // Database State
  const [dbPrompt, setDbPrompt] = useState<string>('ئېلېكترونلۇق تىجارەت سىستېمىسى: ئابونت، مەھسۇلات، زاكاز، زاكاز تۈرى ۋە باھا تەھلىلى');
  const [dbType, setDbType] = useState<string>('postgresql');
  const [isBuildingDb, setIsBuildingDb] = useState<boolean>(false);
  const [dbResult, setDbResult] = useState<any>(null);

  // Sandbox Runner State
  const [runnerCode, setRunnerCode] = useState<string>(`// 🚀 JavaScript / TypeScript Live Sandbox
function calculateStats(numbers) {
  console.log("سانلار تەھلىل قىلىنىۋاتىدۇ:", numbers);
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  const avg = sum / numbers.length;
  const max = Math.max(...numbers);
  const min = Math.min(...numbers);
  
  return {
    يىغىندىسى: sum,
    ئوتتۇرىچە: avg.toFixed(2),
    ئەڭ_چوڭ: max,
    ئەڭ_كىچىك: min
  };
}

const data = [12, 45, 67, 89, 34, 99, 23, 56];
const result = calculateStats(data);
console.log("تەھلىل نەتىجىسى:", result);
result;`);
  const [runnerLogs, setRunnerLogs] = useState<string[]>([]);
  const [runnerOutput, setRunnerOutput] = useState<string>('');
  const [runnerError, setRunnerError] = useState<string>('');
  const [runnerExecTime, setRunnerExecTime] = useState<number | null>(null);

  // Regex State
  const [regexPrompt, setRegexPrompt] = useState<string>('ئېلخەت ئادرېسى، تېلېفون نومۇرى ياكى توربېكەت ئۇلىنىشىنى پەرقلەندۈرۈش');
  const [regexTestString, setRegexTestString] = useState<string>(`ئالاقىلىشىش ئۇچۇرلىرى:
- ئېلخەت: developer@example.com
- شىركەت: contact@studio.org
- كونا خەت: invalid-email@
- تور بېكەت: https://github.com/developer`);
  const [isBuildingRegex, setIsBuildingRegex] = useState<boolean>(false);
  const [regexResult, setRegexResult] = useState<any>(null);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Handler: Generate Code
  const handleGenerateCode = async () => {
    if (!genPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/code/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: genPrompt,
          language: genLanguage,
          framework: genFramework,
          complexity: genComplexity,
          includeTests: genIncludeTests,
          includeTypes: genIncludeTypes,
          targetLang: lang,
        }),
      });
      const data = await res.json();
      setGenResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler: Debug Code
  const handleDebugCode = async () => {
    if (!debugCode.trim()) return;
    setIsDebugging(true);
    try {
      const res = await fetch('/api/code/debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: debugCode,
          language: debugLang,
          errorLog: debugErrorLog,
          targetLang: lang,
        }),
      });
      const data = await res.json();
      setDebugResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDebugging(false);
    }
  };

  // Handler: Explain Code
  const handleExplainCode = async () => {
    if (!explainCode.trim()) return;
    setIsExplaining(true);
    try {
      const res = await fetch('/api/code/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: explainCode,
          language: explainLang,
          targetLang: lang,
        }),
      });
      const data = await res.json();
      setExplainResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExplaining(false);
    }
  };

  // Handler: Convert Code
  const handleConvertCode = async () => {
    if (!convertCode.trim()) return;
    setIsConverting(true);
    try {
      const res = await fetch('/api/code/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: convertCode,
          fromLanguage: fromLang,
          toLanguage: toLang,
          targetLang: lang,
        }),
      });
      const data = await res.json();
      setConvertResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsConverting(false);
    }
  };

  // Handler: Database Builder
  const handleBuildDatabase = async () => {
    if (!dbPrompt.trim()) return;
    setIsBuildingDb(true);
    try {
      const res = await fetch('/api/code/sql-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: dbPrompt,
          dbType,
          targetLang: lang,
        }),
      });
      const data = await res.json();
      setDbResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsBuildingDb(false);
    }
  };

  // Handler: Run JavaScript Sandbox
  const handleRunSandbox = () => {
    const logs: string[] = [];
    setRunnerError('');
    setRunnerOutput('');
    setRunnerLogs([]);

    const originalLog = console.log;
    const originalError = console.error;
    const startTime = performance.now();

    console.log = (...args: any[]) => {
      logs.push(
        args
          .map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)))
          .join(' ')
      );
      originalLog(...args);
    };

    console.error = (...args: any[]) => {
      logs.push(
        '❌ ERROR: ' +
          args
            .map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)))
            .join(' ')
      );
      originalError(...args);
    };

    try {
      // Evaluate within sandbox scope
      const evalResult = new Function(runnerCode)();
      const endTime = performance.now();
      setRunnerExecTime(Number((endTime - startTime).toFixed(2)));
      setRunnerLogs(logs);

      if (evalResult !== undefined) {
        setRunnerOutput(
          typeof evalResult === 'object'
            ? JSON.stringify(evalResult, null, 2)
            : String(evalResult)
        );
      }
    } catch (err: any) {
      const endTime = performance.now();
      setRunnerExecTime(Number((endTime - startTime).toFixed(2)));
      setRunnerLogs(logs);
      setRunnerError(err.message || String(err));
    } finally {
      console.log = originalLog;
      console.error = originalError;
    }
  };

  // Handler: Regex Studio
  const handleBuildRegex = async () => {
    if (!regexPrompt.trim()) return;
    setIsBuildingRegex(true);
    try {
      const res = await fetch('/api/code/regex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: regexPrompt,
          testString: regexTestString,
          targetLang: lang,
        }),
      });
      const data = await res.json();
      setRegexResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsBuildingRegex(false);
    }
  };

  // Built-in presets
  const presets = [
    {
      title: 'Python + FastAPI + Pydantic API',
      prompt: 'RESTful API with asynchronous database session, JWT auth, and Pydantic v2 schemas',
      lang: 'python',
      framework: 'fastapi',
    },
    {
      title: 'React 19 + TypeScript Data Table',
      prompt: 'Interactive responsive Data Table with multi-column sorting, search filtering, and pagination',
      lang: 'react',
      framework: 'nextjs',
    },
    {
      title: 'C++20 ThreadPool & Concurrency Engine',
      prompt: 'Thread-safe worker task queue with std::jthread, mutex synchronization, and condition variables',
      lang: 'cpp',
      framework: 'none',
    },
    {
      title: 'Gemini 3.7 AI Function Calling Tool',
      prompt: 'Complete Google GenAI TypeScript SDK setup with schema-based function calling and streaming response',
      lang: 'typescript',
      framework: 'nodejs',
    },
    {
      title: 'PostgreSQL Relational E-Commerce Schema',
      prompt: 'Users, Products, Categories, Orders, OrderItems with foreign keys, indexes, and total revenue query',
      lang: 'sql',
      framework: 'postgresql',
    },
  ];

  return (
    <div id="coding-studio-view" className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <span>{lang === 'ug' ? 'پىروگرامما & كود مەركىزى' : 'Coding & Developer Studio'}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Polyglot AI
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                {lang === 'ug'
                  ? 'Python, TypeScript, React, C++, سۈنئىي ئىدراك ۋە سانلىق مەلۇمات ئامبىرى كودلىرىنى يېزىش، تۈزىتىش ۋە سىناش'
                  : 'Code generation, debugging, cross-language conversion, database modeling, and live runner.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gemini Engine Ready</span>
          </span>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'generate', label: lang === 'ug' ? '✨ كود ھاسىللاش' : '✨ Code Generator', icon: Sparkles },
          { id: 'debug', label: lang === 'ug' ? '🐞 خاتالىق تۈزىتىش' : '🐞 AI Debugger', icon: Bug },
          { id: 'explain', label: lang === 'ug' ? '📖 كود چۈشەندۈرۈش' : '📖 Code Explainer', icon: BookOpen },
          { id: 'convert', label: lang === 'ug' ? '🔄 تىل ئايلاندۇرغۇچ' : '🔄 Polyglot Converter', icon: ArrowRightLeft },
          { id: 'database', label: lang === 'ug' ? '🗄️ SQL & ئامبار لايىھىسى' : '🗄️ Database Studio', icon: Database },
          { id: 'runner', label: lang === 'ug' ? '▶️ كود سىناش ساندۇقى' : '▶️ Live JS Runner', icon: Play },
          { id: 'regex', label: lang === 'ug' ? '🔍 دائىملىق ئىپادە (Regex)' : '🔍 Regex Studio', icon: Search },
          { id: 'templates', label: lang === 'ug' ? '📦 تەييار قېلىپلار' : '📦 Starter Templates', icon: Layers },
        ].map((tab) => {
          const isSelected = activeSubTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as StudioTab)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-2 ${
                isSelected
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CODE GENERATOR */}
      {activeSubTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>{lang === 'ug' ? 'كود تەلىپى ۋە تەڭشەكلىرى' : 'Code Requirements & Settings'}</span>
            </h2>

            {/* Presets shortcut */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase">
                {lang === 'ug' ? 'تېز تاللاش قېلىپلىرى' : 'Quick Presets'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setGenPrompt(p.prompt);
                      setGenLanguage(p.lang);
                      setGenFramework(p.framework);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-400 transition-colors text-left"
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase">
                {lang === 'ug' ? 'تەلەپ ياكى ئىقتىدار بايانى' : 'Prompt / Feature Specification'}
              </label>
              <textarea
                value={genPrompt}
                onChange={(e) => setGenPrompt(e.target.value)}
                placeholder={
                  lang === 'ug'
                    ? 'مەسىلەن: Python دا سۈنئىي ئىدراك ئارقىلىق تېكىست خۇلاسىلەش API قۇرۇش، تىپ تەكشۈرۈش ۋە بىرلىك سىناقلىرى بىلەن...'
                    : 'e.g. Build an asynchronous rate-limited web scraper in Python with retry policies and unit tests...'
                }
                rows={4}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            {/* Language & Framework Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 uppercase">
                  {lang === 'ug' ? 'پىروگرامما تىلى' : 'Language'}
                </label>
                <select
                  value={genLanguage}
                  onChange={(e) => setGenLanguage(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value="python">Python 3.12</option>
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript (ESNext)</option>
                  <option value="react">React / Next.js</option>
                  <option value="cpp">Modern C++20</option>
                  <option value="sql">SQL / PostgreSQL</option>
                  <option value="golang">Go (Golang)</option>
                  <option value="rust">Rust</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 uppercase">
                  {lang === 'ug' ? 'ئېكوسىستېما / رامكا' : 'Framework'}
                </label>
                <select
                  value={genFramework}
                  onChange={(e) => setGenFramework(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value="fastapi">FastAPI / Pydantic</option>
                  <option value="nextjs">Next.js / Tailwind</option>
                  <option value="express">Express / Node.js</option>
                  <option value="pytorch">PyTorch / ML</option>
                  <option value="genai">Google GenAI / LLM</option>
                  <option value="none">Standard Library / None</option>
                </select>
              </div>
            </div>

            {/* Options Checkboxes */}
            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={genIncludeTests}
                  onChange={(e) => setGenIncludeTests(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>{lang === 'ug' ? 'بىرلىك سىناقلىرى (Unit Tests)' : 'Unit Tests'}</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={genIncludeTypes}
                  onChange={(e) => setGenIncludeTypes(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>{lang === 'ug' ? 'تىپ بايانلىرى (Types & Specs)' : 'Type Annotations'}</span>
              </label>
            </div>

            {/* Action button */}
            <button
              onClick={handleGenerateCode}
              disabled={isGenerating || !genPrompt.trim()}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{lang === 'ug' ? 'كود لايىھىلەۋاتىدۇ...' : 'Generating Code...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === 'ug' ? 'كود ھاسىل قىلىش' : 'Generate Production Code'}</span>
                </>
              )}
            </button>
          </div>

          {/* Code Viewer Output */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 overflow-hidden shadow-2xl flex flex-col min-h-[460px]">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 mr-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-mono text-slate-300 font-semibold">
                    {genResult?.title || 'generated_solution.py'}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono uppercase">
                    {genResult?.language || genLanguage}
                  </span>
                </div>

                {genResult && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(genResult.code, 'gen-code')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    >
                      {copiedKey === 'gen-code' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Code content */}
              <div className="flex-1 p-5 overflow-auto font-mono text-xs leading-relaxed text-emerald-300/90 bg-slate-950/90">
                {genResult ? (
                  <pre className="whitespace-pre-wrap">{genResult.code}</pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 dark:text-slate-500 space-y-2 py-16">
                    <Code2 className="w-12 h-12 stroke-[1.5] text-slate-700" />
                    <p className="text-xs">
                      {lang === 'ug'
                        ? 'سول تەرەپتىن تەلەپنى كىرگۈزۈپ "كود ھاسىل قىلىش" نى بېسىڭ'
                        : 'Enter your requirements on the left and click "Generate Production Code"'}
                    </p>
                  </div>
                )}
              </div>

              {/* Stats Footer */}
              {genResult && (
                <div className="p-4 bg-slate-900/90 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/60">
                    <span className="text-slate-400 block font-mono">Time Complexity</span>
                    <span className="text-emerald-400 font-bold font-mono">{genResult.timeComplexity || 'O(N)'}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/60">
                    <span className="text-slate-400 block font-mono">Space Complexity</span>
                    <span className="text-emerald-400 font-bold font-mono">{genResult.spaceComplexity || 'O(1)'}</span>
                  </div>
                  <div className="col-span-2 p-2 rounded-xl bg-slate-950 border border-slate-800/60">
                    <span className="text-slate-400 block font-mono">Architecture Notes</span>
                    <span className="text-slate-200 line-clamp-1">{genResult.explanation || 'Clean modular implementation'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Explanation & Best Practices Box */}
            {genResult && genResult.explanation && (
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {lang === 'ug' ? '💡 كود تەھلىلى ۋە قۇرۇلما چۈشەندۈرۈشى' : '💡 Architecture & Best Practices'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {genResult.explanation}
                </p>
                {genResult.bestPractices && genResult.bestPractices.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      {lang === 'ug' ? 'تەۋسىيەلىك تەدبىرلەر:' : 'Key Engineering Tips:'}
                    </span>
                    <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      {genResult.bestPractices.map((tip: string, idx: number) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AI DEBUGGER */}
      {activeSubTab === 'debug' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bug className="w-4 h-4 text-red-500" />
                  <span>{lang === 'ug' ? 'خاتالىق كۆرۈلگەن كود' : 'Problematic / Buggy Code'}</span>
                </h2>
                <select
                  value={debugLang}
                  onChange={(e) => setDebugLang(e.target.value)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="react">React</option>
                  <option value="cpp">C++</option>
                  <option value="sql">SQL</option>
                </select>
              </div>

              <textarea
                value={debugCode}
                onChange={(e) => setDebugCode(e.target.value)}
                rows={9}
                className="w-full p-3.5 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>{lang === 'ug' ? 'خاتالىق تېكىستى / ئىز قوغلاش خاتىرىسى (Error / Stack Trace)' : 'Error Log / Stack Trace'}</span>
                </label>
                <textarea
                  value={debugErrorLog}
                  onChange={(e) => setDebugErrorLog(e.target.value)}
                  placeholder="Paste error logs here..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-red-500 placeholder-slate-400"
                />
              </div>

              <button
                onClick={handleDebugCode}
                disabled={isDebugging || !debugCode.trim()}
                className="w-full py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
              >
                {isDebugging ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{lang === 'ug' ? 'خاتالىق تەھلىل قىلىنىۋاتىدۇ...' : 'Analyzing & Diagnosing Bugs...'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{lang === 'ug' ? 'خاتالىقنى تەكشۈرۈش ۋە تولۇق تۈزىتىش' : 'Diagnose & Fix All Bugs'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 overflow-hidden shadow-2xl flex flex-col min-h-[460px]">
              <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-slate-300 font-semibold">
                    {lang === 'ug' ? 'تۈزىتىلگەن پۈتۈن كود' : 'fixed_solution.code'}
                  </span>
                </div>

                {debugResult && (
                  <button
                    onClick={() => copyToClipboard(debugResult.fixedCode, 'debug-fixed')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                  >
                    {copiedKey === 'debug-fixed' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Fixed Code</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex-1 p-5 overflow-auto font-mono text-xs leading-relaxed text-emerald-300/90 bg-slate-950/90">
                {debugResult ? (
                  <pre className="whitespace-pre-wrap">{debugResult.fixedCode}</pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 py-16 space-y-2">
                    <Bug className="w-12 h-12 stroke-[1.5] text-slate-700" />
                    <p className="text-xs">
                      {lang === 'ug'
                        ? 'كودنى كىرگۈزۈپ "خاتالىقنى تەكشۈرۈش ۋە تولۇق تۈزىتىش" نى بېسىڭ'
                        : 'Submit your code on the left to get a root cause breakdown and fixed code.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {debugResult && (
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60">
                  <h4 className="text-xs font-bold text-red-700 dark:text-red-300 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>{lang === 'ug' ? 'خاتالىقنىڭ ئەسلى سەۋەبى (Root Cause):' : 'Root Cause Analysis:'}</span>
                  </h4>
                  <p className="text-xs text-red-800 dark:text-red-200 mt-1 leading-relaxed">
                    {debugResult.rootCause}
                  </p>
                </div>

                {debugResult.changesSummary && debugResult.changesSummary.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      {lang === 'ug' ? 'تۈزىتىلگەن نۇقتىلار:' : 'Changes Applied:'}
                    </span>
                    <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      {debugResult.changesSummary.map((item: string, idx: number) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CODE EXPLAINER */}
      {activeSubTab === 'explain' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>{lang === 'ug' ? 'چۈشەندۈرمەكچى بولغان كود' : 'Code to Explain'}</span>
            </h2>

            <textarea
              value={explainCode}
              onChange={(e) => setExplainCode(e.target.value)}
              rows={12}
              className="w-full p-3.5 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />

            <button
              onClick={handleExplainCode}
              disabled={isExplaining || !explainCode.trim()}
              className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
            >
              {isExplaining ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{lang === 'ug' ? 'چۈشەندۈرۈش ھازىرلىنىۋاتىدۇ...' : 'Analyzing & Explaining Code...'}</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>{lang === 'ug' ? 'كودنى قەدەممۇ-قەدەم چۈشەندۈرۈش' : 'Explain Step-by-Step'}</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 min-h-[460px]">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>{lang === 'ug' ? 'كود چۈشەندۈرۈش نەتىجىسى' : 'Code Breakdown & Deep Explanation'}</span>
              </h3>

              {explainResult ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
                    <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase">
                      {lang === 'ug' ? 'ئومۇمىي خۇلاسە' : 'High-Level Summary'}
                    </h4>
                    <p className="text-xs text-blue-900 dark:text-blue-100 mt-1 leading-relaxed">
                      {explainResult.summary}
                    </p>
                  </div>

                  {/* Line by line breakdown */}
                  {explainResult.lineByLine && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">
                        {lang === 'ug' ? 'باسقۇچلۇق تەھلىل:' : 'Step-by-Step Breakdown:'}
                      </h4>
                      <div className="space-y-2">
                        {explainResult.lineByLine.map((item: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                              {item.section}
                            </span>
                            <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                              {item.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Complexity & Optimization */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                      <span className="text-[11px] font-bold text-slate-500 block uppercase">Complexity</span>
                      <span className="text-slate-800 dark:text-slate-200 font-mono font-bold mt-1 block">
                        {explainResult.timeAndSpaceComplexity || 'Time: O(N log N), Space: O(N)'}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                      <span className="text-[11px] font-bold text-slate-500 block uppercase">Data Structures & Patterns</span>
                      <span className="text-slate-800 dark:text-slate-200 font-mono mt-1 block">
                        {explainResult.dataStructuresAndPatterns?.join(', ') || 'Divide & Conquer, Recursion'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 space-y-2">
                  <BookOpen className="w-12 h-12 stroke-[1.5]" />
                  <p className="text-xs">
                    {lang === 'ug'
                      ? 'چۈشەندۈرمەكچى بولغان كودنى كىرگۈزۈپ تۈگمىنى بېسىڭ'
                      : 'Paste any code to generate an intuitive breakdown and complexity audit.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: POLYGLOT CONVERTER */}
      {activeSubTab === 'convert' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {lang === 'ug' ? 'مەنبە تىل:' : 'From:'}
                  </span>
                  <select
                    value={fromLang}
                    onChange={(e) => setFromLang(e.target.value)}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-800 dark:text-slate-200"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="cpp">C++</option>
                    <option value="golang">Go</option>
                    <option value="rust">Rust</option>
                    <option value="sql">SQL</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {lang === 'ug' ? 'نىشان تىل:' : 'To:'}
                  </span>
                  <select
                    value={toLang}
                    onChange={(e) => setToLang(e.target.value)}
                    className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300"
                  >
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="cpp">C++</option>
                    <option value="golang">Go</option>
                    <option value="rust">Rust</option>
                    <option value="sql">SQL</option>
                  </select>
                </div>
              </div>

              <textarea
                value={convertCode}
                onChange={(e) => setConvertCode(e.target.value)}
                rows={12}
                className="w-full p-3.5 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />

              <button
                onClick={handleConvertCode}
                disabled={isConverting || !convertCode.trim()}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
              >
                {isConverting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{lang === 'ug' ? 'كود ئايلاندۇرۇلۇۋاتىدۇ...' : 'Transpiling Code...'}</span>
                  </>
                ) : (
                  <>
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>{lang === 'ug' ? 'باشقا تىلغا ئايلاندۇرۇش' : `Convert to ${toLang.toUpperCase()}`}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 overflow-hidden shadow-2xl flex flex-col min-h-[460px]">
              <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800 text-xs">
                <span className="font-mono text-emerald-400 font-semibold">
                  {`converted_to_${toLang}.code`}
                </span>

                {convertResult && (
                  <button
                    onClick={() => copyToClipboard(convertResult.convertedCode, 'convert-code')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                  >
                    {copiedKey === 'convert-code' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Converted</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex-1 p-5 overflow-auto font-mono text-xs leading-relaxed text-emerald-300/90 bg-slate-950/90">
                {convertResult ? (
                  <pre className="whitespace-pre-wrap">{convertResult.convertedCode}</pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 py-16 space-y-2">
                    <ArrowRightLeft className="w-12 h-12 stroke-[1.5] text-slate-700" />
                    <p className="text-xs">
                      {lang === 'ug'
                        ? 'كودنى كىرگۈزۈپ تىللار ئارا ئايلاندۇرۇشنى تاللاڭ'
                        : 'Transpiles idiomatic code preserving memory management and typing patterns.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {convertResult && convertResult.explanation && (
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block uppercase">
                  {lang === 'ug' ? 'ئايلاندۇرۇش تەپسىلاتى:' : 'Mapping & Paradigms:'}
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {convertResult.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: DATABASE & SQL STUDIO */}
      {activeSubTab === 'database' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-500" />
              <span>{lang === 'ug' ? 'سانلىق مەلۇمات ئامبىرى تەلىپى' : 'Database & Schema Requirements'}</span>
            </h2>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500 uppercase">
                {lang === 'ug' ? 'ئامبار تۈرى (Engine)' : 'Target Engine'}
              </label>
              <select
                value={dbType}
                onChange={(e) => setDbType(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="postgresql">PostgreSQL 16</option>
                <option value="mysql">MySQL 8.0</option>
                <option value="sqlite">SQLite 3</option>
                <option value="mongodb">MongoDB / Mongoose Schema</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase">
                {lang === 'ug' ? 'تۈر ياكى جەدۋەل ئېھتىياجى' : 'Entities & Relationship Needs'}
              </label>
              <textarea
                value={dbPrompt}
                onChange={(e) => setDbPrompt(e.target.value)}
                rows={5}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <button
              onClick={handleBuildDatabase}
              disabled={isBuildingDb || !dbPrompt.trim()}
              className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
            >
              {isBuildingDb ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{lang === 'ug' ? 'ئامبار قۇرۇلمىسى پىلانلىنىۋاتىدۇ...' : 'Generating Database Schema...'}</span>
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  <span>{lang === 'ug' ? 'SQL قۇرۇلمىسى ۋە سۈرۈشتۈرۈش ھاسىللاش' : 'Generate Full DDL Schema & Queries'}</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 overflow-hidden shadow-2xl flex flex-col min-h-[460px]">
              <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800 text-xs">
                <span className="font-mono text-indigo-400 font-semibold">
                  {dbResult?.title || 'schema.sql'}
                </span>

                {dbResult && (
                  <button
                    onClick={() => copyToClipboard(dbResult.schemaSql, 'db-schema')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                  >
                    {copiedKey === 'db-schema' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Schema</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex-1 p-5 overflow-auto font-mono text-xs leading-relaxed text-indigo-300/90 bg-slate-950/90">
                {dbResult ? (
                  <pre className="whitespace-pre-wrap">{dbResult.schemaSql}</pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 py-16 space-y-2">
                    <Database className="w-12 h-12 stroke-[1.5] text-slate-700" />
                    <p className="text-xs">
                      {lang === 'ug'
                        ? 'تەلەپنى كىرگۈزۈپ كۈچلۈك SQL ئامبار لايىھىسىنى قۇرۇپ چىقىڭ'
                        : 'Generates DDL, Seed Inserts, Indexes, and Complex Join Queries.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {dbResult && dbResult.sampleQueries && (
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-800 dark:text-slate-200">
                  {lang === 'ug' ? '⚡ ئەلالاشتۇرۇلغان SQL سۈرۈشتۈرۈش ئۈلگىلىرى:' : '⚡ Optimized Queries & Aggregations:'}
                </h4>
                {dbResult.sampleQueries.map((q: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[11px] font-bold text-indigo-400">{q.queryTitle}</span>
                    <pre className="text-xs font-mono text-slate-300 overflow-x-auto">{q.sql}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: LIVE JAVASCRIPT / TYPESCRIPT RUNNER */}
      {activeSubTab === 'runner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-500" />
                  <span>{lang === 'ug' ? 'كود كىرگۈزۈش ساندۇقى' : 'Live Code Sandbox Editor'}</span>
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  In-Browser Engine
                </span>
              </div>

              <textarea
                value={runnerCode}
                onChange={(e) => setRunnerCode(e.target.value)}
                rows={14}
                className="w-full p-3.5 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />

              <button
                onClick={handleRunSandbox}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{lang === 'ug' ? 'كودنى دەرھال ئىجرا قىلىش (Run Code)' : 'Execute Code Instantly'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-4 min-h-[460px] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-slate-300">Console & Terminal Output</span>
                </div>
                {runnerExecTime !== null && (
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{runnerExecTime} ms</span>
                  </span>
                )}
              </div>

              {/* Logs */}
              <div className="flex-1 space-y-2 overflow-auto font-mono text-xs">
                {runnerLogs.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Standard Output (Console.log):</span>
                    {runnerLogs.map((log, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-900/90 text-slate-200 border border-slate-800/80 whitespace-pre-wrap">
                        {log}
                      </div>
                    ))}
                  </div>
                )}

                {runnerOutput && (
                  <div className="space-y-1 pt-2">
                    <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-bold">Returned Value:</span>
                    <div className="p-3 rounded-xl bg-emerald-950/40 text-emerald-300 border border-emerald-900/60 whitespace-pre-wrap">
                      {runnerOutput}
                    </div>
                  </div>
                )}

                {runnerError && (
                  <div className="p-3 rounded-xl bg-red-950/40 text-red-300 border border-red-900/60 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="whitespace-pre-wrap">{runnerError}</span>
                  </div>
                )}

                {!runnerOutput && !runnerError && runnerLogs.length === 0 && (
                  <div className="h-48 flex flex-col items-center justify-center text-slate-600 space-y-2">
                    <Terminal className="w-10 h-10 stroke-[1.5]" />
                    <p className="text-xs">Click "Execute Code Instantly" to see runtime outputs and logs.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: REGEX STUDIO */}
      {activeSubTab === 'regex' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-500" />
              <span>{lang === 'ug' ? 'دائىملىق ئىپادە تەلىپى (Regex)' : 'Regex Specification'}</span>
            </h2>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase">
                {lang === 'ug' ? 'نېمىنى پەرقلەندۈرمەكچى؟' : 'What pattern to match?'}
              </label>
              <textarea
                value={regexPrompt}
                onChange={(e) => setRegexPrompt(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase">
                {lang === 'ug' ? 'سىناق تېكىستى (Test String)' : 'Test String'}
              </label>
              <textarea
                value={regexTestString}
                onChange={(e) => setRegexTestString(e.target.value)}
                rows={5}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200"
              />
            </div>

            <button
              onClick={handleBuildRegex}
              disabled={isBuildingRegex || !regexPrompt.trim()}
              className="w-full py-3 px-4 rounded-2xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
            >
              {isBuildingRegex ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{lang === 'ug' ? 'ئىپادە ھاسىللىنىۋاتىدۇ...' : 'Building Regular Expression...'}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>{lang === 'ug' ? 'دائىملىق ئىپادە قۇرۇش ۋە سىناش' : 'Build & Analyze Regex'}</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 min-h-[460px]">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{lang === 'ug' ? 'ئىپادە نەتىجىسى ۋە چۈشەندۈرۈلۈشى' : 'Regex Pattern & Token Breakdown'}</span>
              </h3>

              {regexResult ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-mono">Regular Expression Pattern</span>
                      <code className="text-sm font-mono text-amber-400 font-bold block">
                        /{regexResult.pattern}/{regexResult.flags || 'gmi'}
                      </code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`/${regexResult.pattern}/${regexResult.flags || 'gmi'}`, 'regex-pat')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium"
                    >
                      {copiedKey === 'regex-pat' ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {regexResult.explanation}
                  </p>

                  {/* Token breakdown */}
                  {regexResult.tokenBreakdown && (
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">
                        {lang === 'ug' ? 'ھەر بىر بەلگىنىڭ مەنىسى:' : 'Token Breakdown:'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {regexResult.tokenBreakdown.map((t: any, idx: number) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                            <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{t.token}</span>
                            <span className="text-slate-600 dark:text-slate-400 block text-[11px] mt-0.5">{t.meaning}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 space-y-2">
                  <Search className="w-12 h-12 stroke-[1.5]" />
                  <p className="text-xs">
                    {lang === 'ug'
                      ? 'تەلەپنى كىرگۈزۈپ دائىملىق ئىپادىنى تەھلىل قىلىڭ'
                      : 'Input requirements to generate and explain regular expression patterns.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: STARTER TEMPLATES */}
      {activeSubTab === 'templates' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: 'Python 3.12 AI Voice Scribe',
                desc: 'Whisper integration, streaming audio pipeline, and structured JSON entity extraction.',
                lang: 'python',
                code: `import asyncio
from typing import AsyncGenerator
import httpx

async def stream_audio_transcription(audio_bytes: bytes) -> AsyncGenerator[str, None]:
    """Streams transcription chunks using AI Scribe pipeline."""
    # Async audio chunk processing
    for chunk in range(0, len(audio_bytes), 1024 * 32):
        yield f"Processed chunk: {chunk}"`,
              },
              {
                title: 'React 19 Custom Debounce Hook',
                desc: 'Clean generic React hook with cleanup and customizable delay timer.',
                lang: 'typescript',
                code: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}`,
              },
              {
                title: 'Modern C++20 Thread-Safe Queue',
                desc: 'Concurrency queue with std::mutex and std::condition_variable.',
                lang: 'cpp',
                code: `#include <queue>
#include <mutex>
#include <condition_variable>

template <typename T>
class SafeQueue {
public:
    void push(T value) {
        std::lock_guard<std::mutex> lock(mutex_);
        queue_.push(std::move(value));
        cv_.notify_one();
    }
    
    T pop() {
        std::unique_lock<std::mutex> lock(mutex_);
        cv_.wait(lock, [this] { return !queue_.empty(); });
        T val = std::move(queue_.front());
        queue_.pop();
        return val;
    }
private:
    std::queue<T> queue_;
    std::mutex mutex_;
    std::condition_variable cv_;
};`,
              },
              {
                title: 'PostgreSQL User & Analytics Schema',
                desc: 'UUID primary keys, partitioned daily event logs, and materialized views.',
                lang: 'sql',
                code: `CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_activity_logs (
    id UUID DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
) PARTITION BY RANGE (created_at);`,
              },
              {
                title: 'Express 5 + Zod Request Validator',
                desc: 'Type-safe request body and query middleware validator for Node.js backends.',
                lang: 'typescript',
                code: `import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  };
};`,
              },
              {
                title: 'Gemini 3.8 Streaming Multi-Turn Chat',
                desc: 'Official @google/genai TypeScript SDK implementation with streaming support.',
                lang: 'typescript',
                code: `import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function chatStream(prompt: string) {
  const responseStream = await ai.models.generateContentStream({
    model: 'gemini-3.8-flash',
    contents: prompt,
  });
  
  for await (const chunk of responseStream) {
    process.stdout.write(chunk.text || '');
  }
}`,
              },
            ].map((tpl, idx) => (
              <div key={idx} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                      {tpl.lang}
                    </span>
                    <button
                      onClick={() => copyToClipboard(tpl.code, `tpl-${idx}`)}
                      className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                    >
                      {copiedKey === `tpl-${idx}` ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">{tpl.title}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{tpl.desc}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-[11px] overflow-x-auto max-h-36">
                  <pre>{tpl.code}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
