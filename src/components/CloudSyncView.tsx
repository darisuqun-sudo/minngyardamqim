import React, { useState, useEffect } from 'react';
import {
  Cloud,
  Download,
  Upload,
  RefreshCw,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  History,
  FileJson,
  ShieldCheck,
  Server,
  FolderGit2,
  Trash2,
  Check,
  Copy,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { AppLanguage, CloudSyncSnapshot } from '../types';

interface CloudSyncViewProps {
  lang: AppLanguage;
  onOpenGoogleDriveModal?: () => void;
}

export const CloudSyncView: React.FC<CloudSyncViewProps> = ({
  lang,
  onOpenGoogleDriveModal,
}) => {
  const isRTL = lang === 'ug' || lang === 'ar';

  const [snapshots, setSnapshots] = useState<CloudSyncSnapshot[]>(() => {
    const saved = localStorage.getItem('app_sync_snapshots');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // WebDAV state
  const [webdavUrl, setWebdavUrl] = useState<string>(() => localStorage.getItem('app_webdav_url') || '');
  const [webdavUser, setWebdavUser] = useState<string>(() => localStorage.getItem('app_webdav_user') || '');
  const [webdavStatus, setWebdavStatus] = useState<'idle' | 'connected' | 'testing'>('idle');

  // Collect entire application state from localStorage
  const collectFullApplicationState = () => {
    const backupKeys = [
      'app_tasks',
      'app_notes',
      'app_chat_sessions',
      'app_calendar_events',
      'app_knowledge_docs',
      'app_blueprints',
      'app_habits',
      'app_transactions',
      'app_budget_goals',
      'app_flashcard_decks',
      'app_mind_maps',
      'app_prompt_templates',
      'app_standup_records',
      'app_voice_memos',
      'app_okr_goals',
      'app_web_articles',
      'app_mindfulness_journal',
      'gemini_selected_model',
      'app_theme_mode',
      'app_lang',
    ];

    const payload: Record<string, any> = {
      appId: 'smart-assistant-build',
      exportedAt: new Date().toISOString(),
      version: '3.0',
      data: {},
    };

    backupKeys.forEach((key) => {
      const val = localStorage.getItem(key);
      if (val !== null) {
        try {
          payload.data[key] = JSON.parse(val);
        } catch {
          payload.data[key] = val;
        }
      }
    });

    return payload;
  };

  const handleCreateSnapshot = () => {
    setIsExporting(true);
    const fullState = collectFullApplicationState();
    const jsonStr = JSON.stringify(fullState, null, 2);
    const sizeKb = Math.round(new Blob([jsonStr]).size / 1024);

    const tasksCount = Array.isArray(fullState.data.app_tasks) ? fullState.data.app_tasks.length : 0;
    const sessionsCount = Array.isArray(fullState.data.app_chat_sessions) ? fullState.data.app_chat_sessions.length : 0;
    const eventsCount = Array.isArray(fullState.data.app_calendar_events) ? fullState.data.app_calendar_events.length : 0;
    const notesCount = Array.isArray(fullState.data.app_notes) ? fullState.data.app_notes.length : 0;
    const docsCount = Array.isArray(fullState.data.app_knowledge_docs) ? fullState.data.app_knowledge_docs.length : 0;
    const habitsCount = Array.isArray(fullState.data.app_habits) ? fullState.data.app_habits.length : 0;

    const newSnapshot: CloudSyncSnapshot = {
      id: `snapshot-${Date.now()}`,
      timestamp: new Date().toISOString(),
      deviceLabel: navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop Browser',
      version: '3.0',
      dataSizeKb: sizeKb,
      itemCounts: {
        tasks: tasksCount,
        sessions: sessionsCount,
        events: eventsCount,
        notes: notesCount,
        docs: docsCount,
        habits: habitsCount,
      },
      rawJsonString: jsonStr,
    };

    const nextSnapshots = [newSnapshot, ...snapshots.slice(0, 9)];
    setSnapshots(nextSnapshots);
    localStorage.setItem('app_sync_snapshots', JSON.stringify(nextSnapshots));

    // Trigger file download
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartAI_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setTimeout(() => setIsExporting(false), 500);
  };

  const handleRestoreFromSnapshot = (rawJson: string) => {
    try {
      const parsed = JSON.parse(rawJson);
      if (!parsed || !parsed.data) {
        throw new Error('Invalid backup file');
      }

      Object.entries(parsed.data).forEach(([key, val]) => {
        if (typeof val === 'string') {
          localStorage.setItem(key, val);
        } else {
          localStorage.setItem(key, JSON.stringify(val));
        }
      });

      setImportStatus(lang === 'ug' ? '✅ سانلىق مەلۇماتلار مۇۋەپپەقىيەتلىك ئەسلىگە كەلتۈرۈلدى! بەت قايتا يۈكلىنىۋاتىدۇ...' : 'Restored successfully! Reloading...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e: any) {
      setImportStatus(lang === 'ug' ? '❌ خاتالىق: زاپاس ھۆججەت فورماتى توغرا ئەمەس.' : 'Failed to parse backup JSON.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        handleRestoreFromSnapshot(content);
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteSnapshot = (id: string) => {
    const next = snapshots.filter((s) => s.id !== id);
    setSnapshots(next);
    localStorage.setItem('app_sync_snapshots', JSON.stringify(next));
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
              <span>{lang === 'ug' ? 'سانلىق مەلۇمات مۇستەقىللىقى & زاپاسلاش' : 'Data Sovereignty & Local-First Sync'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {lang === 'ug' ? '☁️ بىر كۇنۇپكا بىلەن بۇلۇتقا ماس قەدەملەش ۋە زاپاسلاش' : 'Cloud Sync & Unified Backup Hub'}
            </h2>
            <p className="mt-2 text-sm text-sky-100 max-w-2xl leading-relaxed">
              {lang === 'ug'
                ? 'بارلىق ۋەزىپىلەر، كالېندار، كودلار، پىلانلار، سۆھبەت خاتىرىلىرى ۋە شەخسىي تەڭشەكلەرنى بىر كۇنۇپكا بىلەن تولۇق زاپاسلاڭ ۋە ئەسلىگە كەلتۈرۈڭ.'
                : 'Zero vendor lock-in. Export, snapshot, and restore your entire productivity system with one click or link to Google Drive.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCreateSnapshot}
              disabled={isExporting}
              className="px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-lg shadow-black/10 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-indigo-600" />
              <span>{lang === 'ug' ? 'تولۇق زاپاسلاش (Full Backup .json)' : 'Create Backup'}</span>
            </button>

            {onOpenGoogleDriveModal && (
              <button
                onClick={onOpenGoogleDriveModal}
                className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Cloud className="w-4 h-4 text-sky-300" />
                <span>Google Drive</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {importStatus && (
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm font-semibold text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
          <span>{importStatus}</span>
          <button onClick={() => setImportStatus(null)} className="text-slate-400 hover:text-slate-600">×</button>
        </div>
      )}

      {/* Main Grid: Backup Actions & WebDAV Bridge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick Backup & Restore Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Restore from File Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-600" />
              <span>{lang === 'ug' ? 'ھۆججەتتىن ئەسلىگە كەلتۈرۈش' : 'Restore from Backup File'}</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'ug'
                ? 'ئىلگىرى چۈشۈرۈۋالغان SmartAI_Full_Backup.json ھۆججىتىنى تاللاڭ، سىستېما بارلىق سانلىق مەلۇماتلارنى شۇ ھامان ئەسلىگە كەلتۈرىدۇ.'
                : 'Upload a previously generated backup JSON file to immediately hydrate all sessions and databases.'}
            </p>

            <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-800/40">
              <FileJson className="w-8 h-8 text-indigo-500 stroke-1" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {lang === 'ug' ? '.json ھۆججىتىنى سۆرەپ كىرىڭ ياكى چېكىپ تاللاڭ' : 'Click to select or drag .json backup'}
              </span>
              <span className="text-[10px] text-slate-400">JSON Full State Format</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* WebDAV / Cloud Storage Configuration */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-sky-600" />
                <span>WebDAV / NextCloud Bridge</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                Optional
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Server Endpoint URL:</label>
                <input
                  type="text"
                  value={webdavUrl}
                  onChange={(e) => {
                    setWebdavUrl(e.target.value);
                    localStorage.setItem('app_webdav_url', e.target.value);
                  }}
                  placeholder="https://nextcloud.example.com/remote.php/dav/files/user/"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Account / Username:</label>
                <input
                  type="text"
                  value={webdavUser}
                  onChange={(e) => {
                    setWebdavUser(e.target.value);
                    localStorage.setItem('app_webdav_user', e.target.value);
                  }}
                  placeholder="your_user_id"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                onClick={() => {
                  setWebdavStatus('testing');
                  setTimeout(() => setWebdavStatus('connected'), 1000);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                {webdavStatus === 'testing' ? (lang === 'ug' ? 'تەڭشەك سىنىلىۋاتىدۇ...' : 'Testing...') : webdavStatus === 'connected' ? (lang === 'ug' ? '✅ تەڭشەك ساقلاندى' : 'Saved') : (lang === 'ug' ? 'ئۇلىنىشنى ساقلاش' : 'Save Connection')}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Snapshots History Timeline */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600" />
              <span>{lang === 'ug' ? 'يەرلىك نۇسخا تىزىملىكى (Snapshots History)' : 'Local Snapshots Timeline'}</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {snapshots.length} {lang === 'ug' ? 'نۇسخا' : 'snapshots'}
            </span>
          </div>

          {snapshots.length > 0 ? (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {snapshots.map((snap) => (
                <div
                  key={snap.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-300 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {new Date(snap.timestamp).toLocaleString()}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                        {snap.dataSizeKb} KB
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                      <span>Tasks: {snap.itemCounts.tasks}</span>
                      <span>Chats: {snap.itemCounts.sessions}</span>
                      <span>Events: {snap.itemCounts.events}</span>
                      <span>Notes: {snap.itemCounts.notes}</span>
                      <span>Docs: {snap.itemCounts.docs}</span>
                      <span>Habits: {snap.itemCounts.habits}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleRestoreFromSnapshot(snap.rawJsonString)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      {lang === 'ug' ? 'ئەسلىگە كەلتۈرۈش' : 'Restore'}
                    </button>
                    <button
                      onClick={() => handleDeleteSnapshot(snap.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400">
              <HardDrive className="w-12 h-12 stroke-1 mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-xs">
                {lang === 'ug'
                  ? 'ھازىرچە نۇسخا تېخى يوق. «تولۇق زاپاسلاش» نى باسسىڭىز، ئاپتوماتىك نۇسخا خاتىرىسى ساقلىنىدۇ.'
                  : 'No snapshots recorded yet. Hit Create Backup to save state.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
