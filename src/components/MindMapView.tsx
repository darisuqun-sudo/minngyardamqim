import React, { useState } from 'react';
import {
  Network,
  Sparkles,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  RotateCw,
  FolderTree,
  Download,
  Search,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Edit2,
  Check,
} from 'lucide-react';
import { AppLanguage, MindMapItem, MindMapNode } from '../types';

interface MindMapViewProps {
  lang: AppLanguage;
  mindMaps: MindMapItem[];
  onAddMindMap: (mm: MindMapItem) => void;
  onUpdateMindMap: (mm: MindMapItem) => void;
  onDeleteMindMap: (id: string) => void;
}

export const MindMapView: React.FC<MindMapViewProps> = ({
  lang,
  mindMaps,
  onAddMindMap,
  onUpdateMindMap,
  onDeleteMindMap,
}) => {
  const [activeMapId, setActiveMapId] = useState<string>(mindMaps[0]?.id || '');
  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const activeMap = mindMaps.find((m) => m.id === activeMapId) || mindMaps[0];

  const handleGenerateMindMap = async () => {
    if (!aiTopic.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-mindmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          language: lang,
        }),
      });

      const data = await res.json();
      if (data.root) {
        const newMap: MindMapItem = {
          id: `mm-${Date.now()}`,
          title: data.root.label || aiTopic,
          topic: aiTopic,
          root: data.root,
          createdAt: new Date().toISOString().slice(0, 10),
        };
        onAddMindMap(newMap);
        setActiveMapId(newMap.id);
        setAiTopic('');
      }
    } catch (e) {
      console.error('Error generating mind map:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleNodeExpansion = (nodeId: string) => {
    if (!activeMap) return;

    const updateRecursive = (node: MindMapNode): MindMapNode => {
      if (node.id === nodeId) {
        return { ...node, expanded: node.expanded === undefined ? false : !node.expanded };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateRecursive),
        };
      }
      return node;
    };

    const updatedRoot = updateRecursive(activeMap.root);
    onUpdateMindMap({ ...activeMap, root: updatedRoot });
  };

  const addChildNode = (parentId: string) => {
    if (!activeMap) return;
    const newId = `node-${Date.now()}`;
    const newChild: MindMapNode = {
      id: newId,
      label: lang === 'ug' ? 'يېڭى نۇقتا' : 'New Sub-topic',
      color: '#6366f1',
      expanded: true,
    };

    const insertRecursive = (node: MindMapNode): MindMapNode => {
      if (node.id === parentId) {
        return {
          ...node,
          expanded: true,
          children: [...(node.children || []), newChild],
        };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(insertRecursive),
        };
      }
      return node;
    };

    const updatedRoot = insertRecursive(activeMap.root);
    onUpdateMindMap({ ...activeMap, root: updatedRoot });
  };

  const deleteNode = (targetId: string) => {
    if (!activeMap || targetId === activeMap.root.id) return;

    const removeRecursive = (node: MindMapNode): MindMapNode => {
      if (!node.children) return node;
      return {
        ...node,
        children: node.children.filter((c) => c.id !== targetId).map(removeRecursive),
      };
    };

    const updatedRoot = removeRecursive(activeMap.root);
    onUpdateMindMap({ ...activeMap, root: updatedRoot });
  };

  const handleExportText = () => {
    if (!activeMap) return;

    const buildIndent = (node: MindMapNode, level = 0): string => {
      const indent = '  '.repeat(level);
      let line = `${indent}- ${node.label}${node.description ? `: ${node.description}` : ''}\n`;
      if (node.children) {
        node.children.forEach((c) => {
          line += buildIndent(c, level + 1);
        });
      }
      return line;
    };

    const outline = `# ${activeMap.title}\n\n${buildIndent(activeMap.root)}`;
    const blob = new Blob([outline], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeMap.title.replace(/\s+/g, '_')}_mindmap.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Node Component
  const RenderTreeNode: React.FC<{ node: MindMapNode; depth: number }> = ({ node, depth }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = node.expanded !== false;
    const [isEditing, setIsEditing] = useState(false);
    const [labelInput, setLabelInput] = useState(node.label);

    const matchesSearch =
      !searchFilter.trim() ||
      node.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (node.description && node.description.toLowerCase().includes(searchFilter.toLowerCase()));

    const handleSaveLabel = () => {
      if (!activeMap || !labelInput.trim()) return;
      const renameRecursive = (n: MindMapNode): MindMapNode => {
        if (n.id === node.id) return { ...n, label: labelInput.trim() };
        if (n.children) return { ...n, children: n.children.map(renameRecursive) };
        return n;
      };
      onUpdateMindMap({ ...activeMap, root: renameRecursive(activeMap.root) });
      setIsEditing(false);
    };

    return (
      <div className={`relative pl-4 sm:pl-6 my-2 ${matchesSearch ? 'opacity-100' : 'opacity-30'}`}>
        {/* Branch connector lines */}
        {depth > 0 && (
          <div className="absolute left-0 top-4 w-4 sm:w-6 h-[2px] bg-slate-300 dark:bg-slate-700" />
        )}
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-slate-200 dark:bg-slate-800" />

        <div className="relative inline-flex items-center gap-2 group">
          {/* Collapse/Expand button */}
          {hasChildren ? (
            <button
              onClick={() => toggleNodeExpansion(node.id)}
              className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs shrink-0 cursor-pointer"
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <div className="w-2 h-2 rounded-full bg-slate-400 shrink-0 ml-1.5" />
          )}

          {/* Node pill */}
          <div
            className={`px-3.5 py-2 rounded-2xl border transition-all flex items-center gap-2 ${
              depth === 0
                ? 'bg-indigo-600 text-white font-bold text-sm shadow-md border-indigo-500'
                : depth === 1
                ? 'bg-white dark:bg-slate-900 border-indigo-300 dark:border-indigo-800/80 text-slate-900 dark:text-white font-bold text-xs shadow-xs'
                : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 text-xs'
            }`}
          >
            {isEditing ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={labelInput}
                  onChange={(e) => setLabelInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveLabel()}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-2 py-0.5 rounded-lg text-xs outline-none"
                  autoFocus
                />
                <button onClick={handleSaveLabel} className="p-1 text-emerald-500">
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="leading-tight">{node.label}</span>
                {node.description && (
                  <span className="text-[10px] opacity-75 font-normal">{node.description}</span>
                )}
              </div>
            )}

            {/* Quick Actions (Hover) */}
            <div className="hidden group-hover:flex items-center gap-1 ml-2 shrink-0">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-1 rounded-md bg-black/10 hover:bg-black/20 text-current text-[10px]"
                title="Edit node"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={() => addChildNode(node.id)}
                className="p-1 rounded-md bg-emerald-500 text-white text-[10px]"
                title="Add child node"
              >
                <Plus className="w-3 h-3" />
              </button>
              {depth > 0 && (
                <button
                  onClick={() => deleteNode(node.id)}
                  className="p-1 rounded-md bg-red-500 text-white text-[10px]"
                  title="Delete node"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Render Children */}
        {hasChildren && isExpanded && (
          <div className="ml-2 sm:ml-4 border-l border-dashed border-slate-300 dark:border-slate-700 pl-2">
            {node.children!.map((child) => (
              <RenderTreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="mindmap-main-container" className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-700 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {lang === 'ug'
                  ? '🎨 ئەقلىي پىكىر خەرىتىسى (AI Mind Map)'
                  : lang === 'tr'
                  ? '🎨 AI Zihin Haritası ve Kavram Ağacı'
                  : lang === 'ar'
                  ? '🎨 الخرائط الذهنية الذكية وشجرة المفاهيم'
                  : '🎨 AI Interactive Mind Map & Concept Tree'}
              </h2>
              <p className="text-xs text-white/80">
                {lang === 'ug'
                  ? 'مۇرەككەپ تۈر ۋە كۆز قاراشلارنى شېخىلانغان گرافىكلىق قۇرۇلمىدا كۆرۈنۈشلەشتۈرۈش'
                  : 'Hierarchical conceptual visualization and tree architecture'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportText}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs backdrop-blur-md transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'ug' ? 'Markdown چىقىرىش' : 'Export MD'}</span>
            </button>
          </div>
        </div>

        {/* AI Quick Generator Input Bar */}
        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md p-2 rounded-2xl border border-white/20">
          <Sparkles className="w-4 h-4 text-amber-300 ml-2 shrink-0" />
          <input
            type="text"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateMindMap()}
            placeholder={
              lang === 'ug'
                ? 'AI پىكىر خەرىتىسى ھاسىللاش ئۈچۈن بىر نىشان ياكى تېما يېزىڭ (مەسىلەن: "SaaS Startup Architecture")...'
                : 'Enter a topic to generate an AI mind map structure...'
            }
            className="w-full bg-transparent text-xs text-white placeholder-white/60 focus:outline-none"
          />
          <button
            onClick={handleGenerateMindMap}
            disabled={!aiTopic.trim() || isGenerating}
            className="px-4 py-2 rounded-xl bg-white text-teal-900 font-bold text-xs hover:bg-white/90 disabled:opacity-50 transition-all flex items-center gap-1 shrink-0 cursor-pointer"
          >
            {isGenerating && <RotateCw className="w-3.5 h-3.5 animate-spin" />}
            <span>{isGenerating ? 'ھاسىللاۋاتىدۇ...' : 'ھاسىللاش'}</span>
          </button>
        </div>
      </div>

      {/* Map selector + Zoom + Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          {mindMaps.map((map) => (
            <button
              key={map.id}
              onClick={() => setActiveMapId(map.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                map.id === activeMap?.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <FolderTree className="w-3 h-3" />
              <span>{map.title}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={lang === 'ug' ? 'نۇقتىلارنى سۈزۈش...' : 'Filter nodes...'}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none w-36 sm:w-44"
            />
          </div>

          <button
            onClick={() => setZoomLevel((prev) => Math.max(70, prev - 10))}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-bold text-slate-500">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel((prev) => Math.min(140, prev + 10))}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Visual Canvas Container */}
      <div
        className="p-6 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 shadow-inner overflow-x-auto min-h-[480px]"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
      >
        {activeMap ? (
          <RenderTreeNode node={activeMap.root} depth={0} />
        ) : (
          <div className="p-12 text-center text-slate-400">
            {lang === 'ug' ? 'پىكىر خەرىتىسى تېپىلمىدى' : 'No mind map available'}
          </div>
        )}
      </div>
    </div>
  );
};
