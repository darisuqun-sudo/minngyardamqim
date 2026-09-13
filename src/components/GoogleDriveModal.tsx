import React, { useState } from 'react';
import {
  HardDrive,
  Link2,
  FileText,
  FileSpreadsheet,
  ExternalLink,
  Check,
  X,
  Sparkles,
  FolderOpen,
  Plus,
} from 'lucide-react';
import { AppLanguage, ChatAttachment } from '../types';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachDriveFile: (attachment: ChatAttachment) => void;
  lang: AppLanguage;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  onAttachDriveFile,
  lang,
}) => {
  const isRTL = lang === 'ug' || lang === 'ar';

  const [driveUrl, setDriveUrl] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  if (!isOpen) return null;

  const presets = [
    {
      id: 'doc-1',
      titleUg: 'تۈر لايىھە ھۆججىتى (Project Spec)',
      titleEn: 'Project Architecture & Plan',
      type: 'doc',
      url: 'https://docs.google.com/document/d/1A2B3C4D_project_spec/edit',
      size: '124 KB',
    },
    {
      id: 'sheet-1',
      titleUg: 'مالىيە ۋە تەننەرخ كۆرسەتكۈچ جەدۋىلى (Budget Sheet)',
      titleEn: 'Quarterly Budget & Financial Sheet',
      type: 'sheet',
      url: 'https://docs.google.com/spreadsheets/d/1X2Y3Z_financial_budget/edit',
      size: '240 KB',
    },
    {
      id: 'doc-2',
      titleUg: 'سۈنئىي ئەقىل مەھسۇلات ئانالىزى (AI Product Notes)',
      titleEn: 'AI Assistant Research & Insights',
      type: 'doc',
      url: 'https://docs.google.com/document/d/1M9N8B_ai_research/edit',
      size: '88 KB',
    },
  ];

  const handleSelectPreset = (preset: (typeof presets)[0]) => {
    setSelectedPresetId(preset.id);
    setDriveUrl(preset.url);
    setDocTitle(lang === 'ug' ? preset.titleUg : preset.titleEn);
  };

  const handleAttach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveUrl.trim()) return;

    let inferredTitle = docTitle.trim();
    if (!inferredTitle) {
      if (driveUrl.includes('spreadsheets')) {
        inferredTitle = 'Google Sheets - سانلىق مەلۇمات جەدۋىلى';
      } else if (driveUrl.includes('presentation')) {
        inferredTitle = 'Google Slides - تەقدىقات ھۆججىتى';
      } else if (driveUrl.includes('document')) {
        inferredTitle = 'Google Docs - يازما ھۆججەت';
      } else {
        inferredTitle = 'Google Drive ھۆججىتى';
      }
    }

    const attachment: ChatAttachment = {
      id: `drive-${Date.now()}`,
      name: inferredTitle,
      type: 'file',
      mimeType: 'application/google-drive',
      size: 1024 * 64,
      driveUrl: driveUrl.trim(),
      textContent: `[Google Drive ھۆججىتى]: ${inferredTitle}\nئۇلىنىش: ${driveUrl.trim()}\nھۆججەت تۈرى: Google Workspace Cloud File`,
    };

    onAttachDriveFile(attachment);
    setDriveUrl('');
    setDocTitle('');
    setSelectedPresetId(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        {/* Header with Google Drive Branding */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-850/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-blue-500 p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {lang === 'ug' ? 'Google Drive ھۆججىتى ئۇلاش' : 'Google Drive Integration'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                  Drive
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'ug'
                  ? 'Google Docs, Sheets ياكى Drive ئۇلىنىشىنى سۆھبەتكە قوشۇڭ'
                  : 'Attach Google Docs, Sheets or Drive files directly into the conversation'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleAttach} className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* URL Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>
                {lang === 'ug'
                  ? 'Google Drive / Docs / Sheets ئۇلىنىشى (URL)'
                  : 'Google Drive / Docs / Sheets Link (URL)'}
              </span>
            </label>
            <input
              type="url"
              autoFocus
              value={driveUrl}
              onChange={(e) => {
                setDriveUrl(e.target.value);
                setSelectedPresetId(null);
              }}
              placeholder="https://docs.google.com/document/d/... ياكى https://drive.google.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
              required
            />
          </div>

          {/* Document Title Input (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>{lang === 'ug' ? 'ھۆججەت نامى (تاللاشچان)' : 'Document Title (Optional)'}</span>
            </label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder={
                lang === 'ug'
                  ? 'مەسىلەن: 2026-يىللىق لايىھە پىلانى'
                  : 'e.g. 2026 Project Architecture Spec'
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Quick Presets / Templates */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  {lang === 'ug'
                    ? 'ياكى تەييار Google Drive ئۈلگىلىرىدىن تاللاڭ:'
                    : 'Or choose from Google Drive templates:'}
                </span>
              </span>
            </div>

            <div className="space-y-1.5">
              {presets.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-500 ring-1 ring-emerald-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300">
                        {preset.type === 'sheet' ? (
                          <FileSpreadsheet className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {lang === 'ug' ? preset.titleUg : preset.titleEn}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate font-mono">
                          {preset.url}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400">{preset.size}</span>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <Plus className="w-4 h-4 text-slate-400 hover:text-emerald-600" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {lang === 'ug' ? 'بىكار قىلىش' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={!driveUrl.trim()}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>{lang === 'ug' ? 'Drive دىن قوشۇش' : 'Attach from Drive'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
