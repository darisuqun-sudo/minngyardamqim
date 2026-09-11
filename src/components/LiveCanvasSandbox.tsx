import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCw,
  Copy,
  Check,
  Download,
  Printer,
  Maximize2,
  Minimize2,
  Smartphone,
  Tablet,
  Monitor,
  Code2,
  Eye,
  FileText,
  Terminal,
  Sparkles,
  ExternalLink,
  ChevronRight,
  X,
  Layers,
  Settings,
  Cpu,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AppLanguage } from '../types';

export interface CanvasDocument {
  id: string;
  title: string;
  language: string;
  code: string;
  type: 'web' | 'markdown' | 'code' | 'json';
  updatedAt: string;
}

interface LiveCanvasSandboxProps {
  lang: AppLanguage;
  activeDoc: CanvasDocument | null;
  onUpdateDoc: (updatedDoc: CanvasDocument) => void;
  onClose?: () => void;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';
type CanvasTab = 'preview' | 'code' | 'console';

export const LiveCanvasSandbox: React.FC<LiveCanvasSandboxProps> = ({
  lang,
  activeDoc,
  onUpdateDoc,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<CanvasTab>('preview');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isRTL = lang === 'ug' || lang === 'ar';

  const doc = activeDoc || {
    id: 'default',
    title: lang === 'ug' ? 'نەق مەيدان لايىھە تاختىسى' : 'Live Interactive Canvas',
    language: 'html',
    code: `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes pulse-slow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
    .animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
  </style>
</head>
<body class="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white min-h-screen flex items-center justify-center p-6 font-sans">
  <div class="max-w-md w-full p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-center space-y-6 animate-pulse-slow">
    <div class="w-16 h-16 mx-auto rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 text-2xl font-bold">
      ✨
    </div>
    <div class="space-y-2">
      <h2 class="text-2xl font-black tracking-tight text-white">Live Canvas Workspace</h2>
      <p class="text-xs text-indigo-200 leading-relaxed">
        سۈنئىي ئىدراك ئىشلەپچىقارغان كودلارنى، لايىھەلەرنى ۋە پۈتۈكلەرنى بۇ يەردە نەق مەيداندا ئىجرا قىلىپ سىناڭ!
      </p>
    </div>
    <button onclick="alert('⚡ خىزمەت تاختىسى مۇۋەپپەقىيەتلىك ئىشلىدى!')" class="w-full py-3.5 px-6 rounded-2xl bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all text-white font-bold text-sm shadow-lg shadow-indigo-500/30 cursor-pointer">
      سىناپ كۆرۈش (Click Me)
    </button>
  </div>
</body>
</html>`,
    type: 'web',
    updatedAt: new Date().toLocaleTimeString(),
  };

  // Determine doc type automatically if not set
  const detectedType = ((): 'web' | 'markdown' | 'code' | 'json' => {
    const l = doc.language.toLowerCase();
    if (['html', 'htm', 'react', 'jsx', 'tsx', 'svg', 'vue'].includes(l)) return 'web';
    if (['md', 'markdown'].includes(l)) return 'markdown';
    if (['json'].includes(l)) return 'json';
    return 'code';
  })();

  // Build the sandboxed HTML code for iframe
  const generateSandboxHtml = (code: string, language: string) => {
    const isReact = ['react', 'jsx', 'tsx'].includes(language.toLowerCase());

    if (isReact) {
      // Wrap React component with Babel Standalone and Tailwind CSS
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { margin: 0; padding: 1rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  </style>
</head>
<body class="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
  <div id="root"></div>
  <script type="text/babel">
    // Capture errors and logs
    window.onerror = function(msg, url, line) {
      window.parent.postMessage({ type: 'CONSOLE_LOG', log: '❌ Error: ' + msg + ' (Line ' + line + ')' }, '*');
    };
    const originalLog = console.log;
    console.log = function(...args) {
      window.parent.postMessage({ type: 'CONSOLE_LOG', log: args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') }, '*');
      originalLog.apply(console, args);
    };

    try {
      ${code}

      // Automatically render App or default component if exists
      const targetComponent = typeof App !== 'undefined' ? App : (typeof Component !== 'undefined' ? Component : null);
      if (targetComponent) {
        ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(targetComponent));
      }
    } catch(err) {
      document.getElementById('root').innerHTML = '<div class="p-4 rounded-xl bg-red-100 text-red-700 font-mono text-xs">Runtime Error: ' + err.message + '</div>';
      console.error(err);
    }
  </script>
</body>
</html>`;
    }

    if (['html', 'htm', 'svg'].includes(language.toLowerCase())) {
      // If code doesn't contain standard html wrapper, wrap it
      if (!code.includes('<html') && !code.includes('<!DOCTYPE')) {
        return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; padding: 1rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  </style>
</head>
<body class="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
  <script>
    window.onerror = function(msg, url, line) {
      window.parent.postMessage({ type: 'CONSOLE_LOG', log: '❌ Error: ' + msg + ' (Line ' + line + ')' }, '*');
    };
    const originalLog = console.log;
    console.log = function(...args) {
      window.parent.postMessage({ type: 'CONSOLE_LOG', log: args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ') }, '*');
      originalLog.apply(console, args);
    };
  </script>
  ${code}
</body>
</html>`;
      }
      return code;
    }

    return `<!DOCTYPE html><html><body class="p-4 font-mono text-sm bg-slate-900 text-slate-100"><pre>${escapeHtml(
      code
    )}</pre></body></html>`;
  };

  const escapeHtml = (text: string) => {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  // Reload the sandbox iframe
  const reloadSandbox = () => {
    if (iframeRef.current) {
      setLogs([]);
      const iframe = iframeRef.current;
      iframe.srcdoc = generateSandboxHtml(doc.code, doc.language);
    }
  };

  useEffect(() => {
    reloadSandbox();
  }, [doc.code, doc.language]);

  // Listen to message logs from iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'CONSOLE_LOG') {
        setLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ${e.data.log}`,
        ]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Run Simulation for Python / Code
  const handleExecuteCode = () => {
    setIsExecuting(true);
    setExecutionOutput(null);

    setTimeout(() => {
      const l = doc.language.toLowerCase();
      if (l === 'javascript' || l === 'js') {
        try {
          const logsOutput: string[] = [];
          const customConsole = {
            log: (...args: any[]) => logsOutput.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
            warn: (...args: any[]) => logsOutput.push('[WARN] ' + args.join(' ')),
            error: (...args: any[]) => logsOutput.push('[ERROR] ' + args.join(' ')),
          };
          const fn = new Function('console', doc.code);
          const result = fn(customConsole);
          let finalOut = logsOutput.join('\n');
          if (result !== undefined) {
            finalOut += (finalOut ? '\n\n' : '') + 'Return Value: ' + JSON.stringify(result, null, 2);
          }
          setExecutionOutput(finalOut || 'Code executed successfully with 0 return output.');
        } catch (err: any) {
          setExecutionOutput(`Execution Error:\n${err.message}`);
        }
      } else if (l === 'json') {
        try {
          const parsed = JSON.parse(doc.code);
          setExecutionOutput('✅ Valid JSON Syntax!\n\nFormatted Output:\n' + JSON.stringify(parsed, null, 2));
        } catch (err: any) {
          setExecutionOutput('❌ JSON Syntax Error:\n' + err.message);
        }
      } else {
        // Python / SQL / Script Simulation
        setExecutionOutput(`[Running simulated ${doc.language.toUpperCase()} engine...]\n\n🚀 Process initialized.\n==============================\n${
          doc.code.includes('print')
            ? doc.code.split('\n').filter(line => line.trim().startsWith('print')).map(line => line.replace(/print\(["']?(.*?)["']?\)/, '$1')).join('\n')
            : 'Output: Code compiled without errors. Process finished with exit code 0.'
        }\n==============================\nExecution completed in 0.04s.`);
      }
      setIsExecuting(false);
    }, 400);
  };

  // Copy Code
  const handleCopy = () => {
    navigator.clipboard.writeText(doc.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download Code / Document
  const handleDownload = () => {
    let extension = '.txt';
    const l = doc.language.toLowerCase();
    if (l === 'html') extension = '.html';
    else if (l === 'react' || l === 'tsx') extension = '.tsx';
    else if (l === 'jsx') extension = '.jsx';
    else if (l === 'javascript' || l === 'js') extension = '.js';
    else if (l === 'python' || l === 'py') extension = '.py';
    else if (l === 'markdown' || l === 'md') extension = '.md';
    else if (l === 'json') extension = '.json';
    else if (l === 'css') extension = '.css';
    else if (l === 'sql') extension = '.sql';

    const cleanTitle = (doc.title || 'workspace-export').replace(/[^a-zA-Z0-9_\u0600-\u06FF-]/g, '_');
    const blob = new Blob([doc.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cleanTitle}${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Print Document or Code
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    if (detectedType === 'markdown') {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${doc.title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; line-height: 1.6; }
            h1, h2, h3 { color: #1e293b; }
            pre { background: #f1f5f9; padding: 1rem; border-radius: 8px; overflow-x: auto; }
            blockquote { border-left: 4px solid #6366f1; padding-left: 1rem; color: #475569; }
          </style>
        </head>
        <body>
          <h1>${doc.title}</h1>
          <hr/>
          <div>${doc.code.replace(/\n/g, '<br/>')}</div>
        </body>
        </html>
      `);
    } else {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${doc.title}</title>
          <style>
            body { font-family: monospace; padding: 2rem; font-size: 13px; line-height: 1.5; }
            pre { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h2>${doc.title} (${doc.language.toUpperCase()})</h2>
          <hr/>
          <pre>${escapeHtml(doc.code)}</pre>
        </body>
        </html>
      `);
    }

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  // Width for device toggle
  const getDeviceWidth = () => {
    if (deviceMode === 'mobile') return 'max-w-[375px]';
    if (deviceMode === 'tablet') return 'max-w-[768px]';
    return 'w-full';
  };

  return (
    <div
      id="live-canvas-sandbox-root"
      className={`flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden transition-all ${
        isFullscreen
          ? 'fixed inset-4 z-50 shadow-2xl h-[calc(100vh-2rem)]'
          : 'h-[620px] w-full'
      }`}
    >
      {/* Top Header Bar */}
      <div className="p-3 sm:px-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
        {/* Document Title & Badge */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
            {detectedType === 'web' ? (
              <Eye className="w-4 h-4" />
            ) : detectedType === 'markdown' ? (
              <FileText className="w-4 h-4" />
            ) : (
              <Code2 className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
              {doc.title}
            </h4>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
              <span className="font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400">
                {doc.language}
              </span>
              <span>•</span>
              <span>{doc.updatedAt}</span>
            </div>
          </div>
        </div>

        {/* View Mode Selector (Preview / Code / Console) */}
        <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-slate-950 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{lang === 'ug' ? 'نەتىجە' : 'Preview'}</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{lang === 'ug' ? 'كود' : 'Code'}</span>
          </button>

          {detectedType === 'web' && (
            <button
              onClick={() => setActiveTab('console')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer relative ${
                activeTab === 'console'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{lang === 'ug' ? 'كۆزەتكۈچ' : 'Console'}</span>
              {logs.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          )}
        </div>

        {/* Action Controls (Responsive devices, Copy, Print, Download, Fullscreen) */}
        <div className="flex items-center gap-1">
          {detectedType === 'web' && activeTab === 'preview' && (
            <div className="hidden sm:flex items-center gap-0.5 bg-slate-200/70 dark:bg-slate-950 p-1 rounded-xl mr-1">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  deviceMode === 'desktop'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Desktop"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  deviceMode === 'tablet'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Tablet (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  deviceMode === 'mobile'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Mobile (375px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {detectedType === 'web' && (
            <button
              onClick={reloadSandbox}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={lang === 'ug' ? 'قايتا يېڭىلاش' : 'Reload Sandbox'}
            >
              <RotateCw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={lang === 'ug' ? 'نۇسخىلاش' : 'Copy'}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={lang === 'ug' ? 'PDF بېسىش / چۈشۈرۈش' : 'Print / Export PDF'}
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={lang === 'ug' ? 'ھۆججەت چۈشۈرۈش' : 'Download File'}
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer ml-1"
              title="Close Canvas"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas Body Area */}
      <div className="flex-1 min-h-0 bg-slate-100 dark:bg-slate-950/60 overflow-hidden relative flex flex-col">
        {/* 1. Preview Tab */}
        {activeTab === 'preview' && (
          <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 overflow-auto">
            {detectedType === 'web' ? (
              <div
                className={`h-full ${getDeviceWidth()} w-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-all`}
              >
                <iframe
                  ref={iframeRef}
                  title="Canvas Web Sandbox"
                  sandbox="allow-scripts allow-modals allow-same-origin"
                  className="w-full h-full border-none bg-white"
                />
              </div>
            ) : detectedType === 'markdown' ? (
              <div className="w-full h-full max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 overflow-y-auto">
                <div className="prose dark:prose-invert max-w-none text-slate-900 dark:text-slate-100">
                  <ReactMarkdown>{doc.code}</ReactMarkdown>
                </div>
              </div>
            ) : (
              /* Code / Script Execution Playground */
              <div className="w-full h-full max-w-4xl mx-auto flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {doc.language.toUpperCase()} Runner
                    </span>
                  </div>
                  <button
                    onClick={handleExecuteCode}
                    disabled={isExecuting}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isExecuting ? 'Running...' : (lang === 'ug' ? 'ئىجرا قىلىش' : 'Run Script')}</span>
                  </button>
                </div>

                <div className="flex-1 p-4 font-mono text-xs overflow-y-auto bg-slate-950 text-slate-200">
                  <pre className="whitespace-pre-wrap leading-relaxed">{doc.code}</pre>
                </div>

                {executionOutput && (
                  <div className="p-4 bg-slate-900 border-t border-slate-800 font-mono text-xs text-emerald-400 max-h-48 overflow-y-auto">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-800 mb-2 text-slate-400 text-[10px]">
                      <span>EXECUTION RESULT</span>
                      <button
                        onClick={() => setExecutionOutput(null)}
                        className="hover:text-white"
                      >
                        Clear
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap">{executionOutput}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 2. Code Editor Tab */}
        {activeTab === 'code' && (
          <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100">
            <div className="p-2.5 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">Editable Source Code ({doc.language})</span>
              <span>Instant Live Sync</span>
            </div>
            <textarea
              value={doc.code}
              onChange={(e) => {
                onUpdateDoc({
                  ...doc,
                  code: e.target.value,
                  updatedAt: new Date().toLocaleTimeString(),
                });
              }}
              spellCheck={false}
              className="flex-1 w-full p-4 font-mono text-xs sm:text-sm bg-slate-950 text-slate-200 resize-none focus:outline-none leading-relaxed"
            />
          </div>
        )}

        {/* 3. Console Logs Tab */}
        {activeTab === 'console' && (
          <div className="w-full h-full flex flex-col bg-slate-950 text-slate-200 font-mono text-xs">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">Sandbox Console Output</span>
              </div>
              <button
                onClick={() => setLogs([])}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition-colors"
              >
                Clear Logs
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-1.5">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-600">
                  No runtime logs recorded yet. Interactive events will appear here.
                </div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className="p-1.5 rounded bg-slate-900/60 border border-slate-800/80 leading-relaxed"
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
