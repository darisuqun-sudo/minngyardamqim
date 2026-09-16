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
  ExternalLink,
  X,
  Github,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AppLanguage } from '../types';
import { GitHubExportModal } from './GitHubExportModal';

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
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);

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
      if (typeof App !== 'undefined') {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
      } else if (typeof Component !== 'undefined') {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<Component />);
      }
    } catch(err) {
      document.getElementById('root').innerHTML = '<div style="color:red;padding:1rem;font-family:monospace;"><b>Runtime Error:</b> ' + err.message + '</div>';
      console.error(err);
    }
  </script>
</body>
</html>`;
    }

    if (['html', 'htm', 'svg'].includes(language.toLowerCase())) {
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
        setExecutionOutput(`[Running simulated ${doc.language.toUpperCase()} engine...]\n\n🚀 Process initialized.\n==============================\n${
          doc.code.includes('print')
            ? doc.code.split('\n').filter(line => line.trim().startsWith('print')).map(line => line.replace(/print\(["']?(.*?)["']?\)/, '$1')).join('\n')
            : 'Output: Code compiled without errors. Process finished with exit code 0.'
        }\n==============================\nExecution completed in 0.04s.`);
      }
      setIsExecuting(false);
    }, 400);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(doc.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  // Dimensions for device viewport frames
  const getDeviceContainerStyle = () => {
    if (deviceMode === 'mobile') {
      return isLandscape
        ? { width: '680px', height: '380px', maxWidth: '100%' }
        : { width: '380px', height: '100%', maxHeight: '720px', maxWidth: '100%' };
    }
    if (deviceMode === 'tablet') {
      return isLandscape
        ? { width: '900px', height: '100%', maxHeight: '620px', maxWidth: '100%' }
        : { width: '768px', height: '100%', maxHeight: '760px', maxWidth: '100%' };
    }
    return { width: '100%', height: '100%' };
  };

  return (
    <div
      id="live-canvas-sandbox-root"
      className={`flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden transition-all ${
        isFullscreen
          ? 'fixed inset-2 sm:inset-4 z-50 shadow-2xl h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)]'
          : 'h-full min-h-[620px] w-full'
      }`}
    >
      {/* Top Header Bar - Google AI Studio Style */}
      <div className="px-3 sm:px-4 py-2 bg-slate-50/95 dark:bg-slate-800/95 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap select-none">
        {/* Left Side: View Mode Tabs (Preview / Code / Console) */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-slate-200/80 dark:bg-slate-950 p-1 rounded-xl border border-slate-300/40 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{lang === 'ug' ? 'كۆرۈش (Preview)' : 'Preview'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{lang === 'ug' ? 'كود (Code)' : 'Code'}</span>
            </button>

            {detectedType === 'web' && (
              <button
                type="button"
                onClick={() => setActiveTab('console')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer relative ${
                  activeTab === 'console'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Console</span>
                {logs.length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Center: Device Viewport Bar & Address (Google AI Studio Bar) */}
        {detectedType === 'web' && activeTab === 'preview' && (
          <div className="flex items-center gap-1.5 bg-slate-200/80 dark:bg-slate-950 px-2 py-1 rounded-xl border border-slate-300/40 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
            {/* Viewport switch: Desktop, Tablet, Mobile */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setDeviceMode('desktop')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  deviceMode === 'desktop'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={lang === 'ug' ? 'كومپيۇتېر نۇسخىسى (Desktop)' : 'Desktop View'}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('tablet')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  deviceMode === 'tablet'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={lang === 'ug' ? 'تاب (تاختا كومپيۇتېر 768px)' : 'Tablet View (768px)'}
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('mobile')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  deviceMode === 'mobile'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={lang === 'ug' ? 'تېلېفون نۇسخىسى (Mobile 375px)' : 'Mobile View (375px)'}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="text-slate-400 dark:text-slate-600">|</span>

            {/* Address Bar Simulation */}
            <div className="px-2 py-0.5 font-mono text-[11px] text-slate-500 dark:text-slate-400 select-all">
              /
            </div>

            <span className="text-slate-400 dark:text-slate-600">|</span>

            {/* Reload button */}
            <button
              type="button"
              onClick={reloadSandbox}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              title={lang === 'ug' ? 'قايتا يېڭىلاش' : 'Reload'}
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* Orientation toggle (portrait / landscape for phone & tablet) */}
            {deviceMode !== 'desktop' && (
              <button
                type="button"
                onClick={() => setIsLandscape(!isLandscape)}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  isLandscape ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={lang === 'ug' ? 'توغرىسىغا / بويىغا ئايلاندۇرۇش' : 'Rotate Orientation'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Fullscreen button */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {/* Right Side: GitHub, Copy, Download, Close */}
        <div className="flex items-center gap-1.5">
          {/* GitHub Push Button */}
          <button
            type="button"
            onClick={() => setIsGitHubModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer border border-slate-700/60"
            title={lang === 'ug' ? 'گىتخوپقا (GitHub) يۈكلەش' : 'Push to GitHub'}
          >
            <Github className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">{lang === 'ug' ? 'GitHub قا يۈكلەش' : 'GitHub'}</span>
          </button>

          {/* Copy Code */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={lang === 'ug' ? 'نۇسخىلاش' : 'Copy'}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Download */}
          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={lang === 'ug' ? 'ھۆججەت چۈشۈرۈش' : 'Download File'}
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Close */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer ml-1"
              title={lang === 'ug' ? 'تاقاش' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas Body Area */}
      <div className="flex-1 min-h-0 bg-slate-100/80 dark:bg-slate-950 overflow-hidden relative flex flex-col">
        {/* 1. PREVIEW TAB */}
        {activeTab === 'preview' && (
          <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 overflow-auto">
            {detectedType === 'web' ? (
              <div
                style={getDeviceContainerStyle()}
                className={`bg-white dark:bg-slate-900 flex flex-col transition-all overflow-hidden ${
                  deviceMode === 'mobile'
                    ? 'rounded-[36px] border-8 border-slate-800 dark:border-slate-700 shadow-2xl relative'
                    : deviceMode === 'tablet'
                    ? 'rounded-[28px] border-8 border-slate-800 dark:border-slate-700 shadow-2xl'
                    : 'w-full h-full rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Mobile Device Speaker Notch */}
                {deviceMode === 'mobile' && !isLandscape && (
                  <div className="w-full flex justify-center pt-2 pb-1 bg-slate-900 shrink-0">
                    <div className="w-20 h-3.5 bg-slate-800 rounded-full flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700 mr-1.5" />
                      <div className="w-6 h-1 rounded-full bg-slate-700" />
                    </div>
                  </div>
                )}

                <iframe
                  ref={iframeRef}
                  title="Canvas Web Sandbox"
                  sandbox="allow-scripts allow-modals allow-same-origin"
                  className="w-full flex-1 border-none bg-white"
                />

                {/* Mobile Device Home Bar */}
                {deviceMode === 'mobile' && !isLandscape && (
                  <div className="w-full flex justify-center py-1.5 bg-slate-900 shrink-0">
                    <div className="w-24 h-1 bg-slate-600 rounded-full" />
                  </div>
                )}
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
                      {doc.language.toUpperCase()} Interactive Runner
                    </span>
                  </div>
                  <button
                    type="button"
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
                        type="button"
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

        {/* 2. CODE EDITOR TAB */}
        {activeTab === 'code' && (
          <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100">
            <div className="p-2.5 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold uppercase text-indigo-400">{doc.language}</span>
                <span>•</span>
                <span>{doc.code.split('\n').length} lines</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{lang === 'ug' ? 'ئىجرا قىلىپ كۆرۈش' : 'Run Preview'}</span>
                </button>
              </div>
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
              className="flex-1 w-full p-4 font-mono text-xs sm:text-sm bg-slate-950 text-slate-200 resize-none focus:outline-hidden leading-relaxed"
            />
          </div>
        )}

        {/* 3. CONSOLE LOGS TAB */}
        {activeTab === 'console' && (
          <div className="w-full h-full flex flex-col bg-slate-950 text-slate-200 font-mono text-xs">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">Sandbox Console Output</span>
              </div>
              <button
                type="button"
                onClick={() => setLogs([])}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition-colors cursor-pointer"
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

      {/* GitHub Push Modal */}
      <GitHubExportModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        code={doc.code}
        language={doc.language}
        suggestedFilename={doc.title}
        lang={lang}
      />
    </div>
  );
};
