import React, { useState } from 'react';
import {
  FolderGit2,
  FileCode,
  Download,
  Plus,
  Play,
  Copy,
  Sparkles,
  CheckCircle2,
  Layers,
  Terminal,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { AppLanguage, ProjectBlueprint } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ProjectsHubViewProps {
  lang: AppLanguage;
  blueprints: ProjectBlueprint[];
  onAddBlueprint: (bp: ProjectBlueprint) => void;
}

export const ProjectsHubView: React.FC<ProjectsHubViewProps> = ({
  lang,
  blueprints,
  onAddBlueprint,
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const isRTL = lang === 'ug' || lang === 'ar';

  const [selectedProjectId, setSelectedProjectId] = useState<string>(blueprints[0]?.id || '');
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const currentProject = blueprints.find((p) => p.id === selectedProjectId) || blueprints[0];
  const currentFile = currentProject?.files[selectedFileIdx] || currentProject?.files[0];

  const handleCopyCode = () => {
    if (!currentFile) return;
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadProjectZip = () => {
    if (!currentProject) return;
    // Export files bundle as JSON or text format
    const bundleData = JSON.stringify(currentProject, null, 2);
    const blob = new Blob([bundleData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentProject.title.toLowerCase().replace(/\s+/g, '-')}-project.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="projects-hub-container" className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t.projectsTitle}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.projectsDesc}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadProjectZip}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{t.exportGithubZip}</span>
          </button>
        </div>
      </div>

      {/* Projects Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {blueprints.map((p) => {
          const isSelected = p.id === selectedProjectId;
          return (
            <button
              key={p.id}
              onClick={() => {
                setSelectedProjectId(p.id);
                setSelectedFileIdx(0);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-2 ${
                isSelected
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>{p.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Two-Column Code Workspace */}
      {currentProject && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* File Tree & Metadata */}
          <div className="lg:col-span-1 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold">
                {currentProject.category}
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                {currentProject.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {currentProject.description}
              </p>
            </div>

            {/* Tech Stack Chips */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                Tech Stack
              </span>
              <div className="flex flex-wrap gap-1">
                {currentProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* File Directory List */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                {t.filesStructure}
              </span>

              <div className="space-y-1">
                {currentProject.files.map((f, idx) => (
                  <button
                    key={f.path}
                    onClick={() => setSelectedFileIdx(idx)}
                    className={`w-full text-left p-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
                      idx === selectedFileIdx
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{f.path}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Code Viewer & Sandbox */}
          <div className="lg:col-span-3 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 overflow-hidden flex flex-col shadow-xl">
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 mr-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-mono text-slate-300 font-semibold">
                  {currentFile?.path || 'file.ts'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono uppercase">
                  {currentFile?.language || 'typescript'}
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 p-5 overflow-auto font-mono text-xs leading-relaxed text-emerald-300/90 bg-slate-950/90">
              <pre>{currentFile?.content}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
