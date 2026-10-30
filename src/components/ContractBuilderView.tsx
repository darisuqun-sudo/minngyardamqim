import React, { useState } from 'react';
import {
  FileText,
  Briefcase,
  Shield,
  FileCheck,
  Send,
  Download,
  Copy,
  Printer,
  Sparkles,
  RefreshCw,
  Check,
  Building,
  User,
  Scale,
  Calendar,
  Layers,
  ChevronRight,
  Eye,
  Edit3,
} from 'lucide-react';
import { AppLanguage, ContractType, ContractDocument } from '../types';

interface ContractBuilderViewProps {
  lang: AppLanguage;
}

export const ContractBuilderView: React.FC<ContractBuilderViewProps> = ({ lang }) => {
  const isRTL = lang === 'ug' || lang === 'ar';

  const [selectedType, setSelectedType] = useState<ContractType>('job');
  const [docTitle, setDocTitle] = useState<string>('يۇمشاق دېتال ئېچىش خىزمەت توختىمى');
  const [partyA, setPartyA] = useState<string>('تېخنىكا شىركىتى (تەكلىپ قىلغۇچى)');
  const [partyB, setPartyB] = useState<string>('ئالىي ئىنژېنېر (ئىجرا قىلغۇچى)');
  const [keyTerms, setKeyTerms] = useState<string>('مۇددىتى: 1 يىل. ئايلىق مائاش: رىقابەت كۈچىگە ئىگە. مەخپىيەتلىك ۋە ئەقلىي مۈلۈك كاپالىتى تولۇق بەلگىلەنسۇن.');
  const [targetDocLang, setTargetDocLang] = useState<'ug' | 'tr' | 'en' | 'ar'>('ug');

  const [generatedDoc, setGeneratedDoc] = useState<ContractDocument | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editableMarkdown, setEditableMarkdown] = useState<string>('');

  const contractCategories: {
    type: ContractType;
    labelUg: string;
    labelEn: string;
    icon: any;
    defaultTitleUg: string;
    defaultTermsUg: string;
  }[] = [
    {
      type: 'job',
      labelUg: '💼 خىزمەت توختىمى',
      labelEn: 'Employment Agreement',
      icon: Briefcase,
      defaultTitleUg: 'رەسمىي خىزمەت ۋە ھەمكارلىق توختىمى',
      defaultTermsUg: 'لاۋازىم: ئالىي پىروگراممېر. خىزمەت شەكلى: يىراقتىن ياكى ئىشخانىدا. ھوقۇق-مەجبۇرىيەتلەر، دەم ئېلىش ۋە بىخەتەرلىك شەرتلىرى ئېنىق بەلگىلەنسۇن.',
    },
    {
      type: 'nda',
      labelUg: '🔒 مەخپىيەتلىك كېلىشىمى (NDA)',
      labelEn: 'Non-Disclosure Agreement',
      icon: Shield,
      defaultTitleUg: 'سودا ۋە تېخنىكىلىق ئۇچۇر مەخپىيەتلىك كېلىشىمى',
      defaultTermsUg: 'بارلىق كود، سودا سىرلىرى ۋە ئىشلەتكۈچى سانلىق مەلۇماتلىرى 3 يىلغىچە قەتئىي مەخپىي تۇتۇلىدۇ. خىلاپلىق قىلغۇچى جاۋابكارلىققا تارتىلىدۇ.',
    },
    {
      type: 'petition',
      labelUg: '📄 رەسمىي ئىلتىماس / چۈشەندۈرۈش',
      labelEn: 'Formal Petition / Cover Letter',
      icon: FileText,
      defaultTitleUg: 'تۈر تەستىقلاش ۋە بايلىق ئىلتىماسى',
      defaultTermsUg: 'سەۋەبى: سۈنئىي ئىدراك ئۇل ئەسلىھەسى بەرپا قىلىش. تەلەپ: مۇلازىمېتىر ۋە كېرەكلىك بايلىقلار تەستىقلانسۇن. رەسمىي تىل بىلەن يېزىلسۇن.',
    },
    {
      type: 'offer',
      labelUg: '🤝 سودا تەكلىپنامىسى / كېلىشىم',
      labelEn: 'Business Proposal / Offer Letter',
      icon: FileCheck,
      defaultTitleUg: 'تېخنىكىلىق ھەل قىلىش چارىسى ۋە سودا تەكلىپنامىسى',
      defaultTermsUg: 'تۈر مۆلچەر ۋاقتى: 3 ئاي. باسقۇچلۇق پۇل تۆلەش تەرتىپى. مۇلازىمەت دائىرىسى ۋە سۈپەت كاپالىتى كىرگۈزۈلسۇن.',
    },
    {
      type: 'cv',
      labelUg: '🎓 تەرجىمىھال & باياننامە (CV)',
      labelEn: 'Professional CV / Bio',
      icon: User,
      defaultTitleUg: 'ئالىي يۇمشاق دېتال قۇرۇلمىچىسى تەرجىمىھالى',
      defaultTermsUg: 'ماھارەتلەر: React, TypeScript, Python, AI Engineering, Cloud Architecture. تەجرىبە: 5+ يىللىق ئىشلەپچىقىرىش تۈرلىرى.',
    },
    {
      type: 'lease',
      labelUg: '🏠 ئىجارە & كېلىشىمنامە',
      labelEn: 'Lease & Commercial Contract',
      icon: Building,
      defaultTitleUg: 'ئىشخانا / ئۆي-مۈلۈك ئىجارە كېلىشىمى',
      defaultTermsUg: 'ئىجارە ۋاقتى: 12 ئاي. كاپالەت پۇلى: 2 ئايلىق. سۇ، توك، ئالاقە ۋە رېمونت مەسئۇلىيىتى ئايدىڭلاشتۇرۇلسۇن.',
    },
  ];

  const handleSelectCategory = (cat: typeof contractCategories[0]) => {
    setSelectedType(cat.type);
    setDocTitle(cat.defaultTitleUg);
    setKeyTerms(cat.defaultTermsUg);
  };

  const handleGenerateContract = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/contract/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          title: docTitle,
          parties: { partyA, partyB },
          keyTerms,
          language: targetDocLang,
        }),
      });

      const data = await res.json();
      setGeneratedDoc(data);
      setEditableMarkdown(data.documentMarkdown || '');
      setIsEditing(false);
    } catch (err) {
      console.error('Contract generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = isEditing ? editableMarkdown : (generatedDoc?.documentMarkdown || '');
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const content = isEditing ? editableMarkdown : (generatedDoc?.documentMarkdown || '');
    if (!content) return;
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <html>
          <head>
            <title>${docTitle}</title>
            <style>
              body { font-family: "Microsoft Uighur", "Segoe UI", Arial, sans-serif; padding: 40px; line-height: 1.8; direction: ${targetDocLang === 'ug' || targetDocLang === 'ar' ? 'rtl' : 'ltr'}; }
              h1, h2, h3 { color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
              hr { border: 0; border-top: 1px solid #cbd5e1; margin: 20px 0; }
            </style>
          </head>
          <body>
            <pre style="white-space: pre-wrap; font-family: inherit;">${content}</pre>
          </body>
        </html>
      `);
      doc.close();
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }
    setTimeout(() => {
      try {
        document.body.removeChild(iframe);
      } catch (e) {}
    }, 2000);
  };

  const handleDownload = () => {
    const content = isEditing ? editableMarkdown : (generatedDoc?.documentMarkdown || '');
    if (!content) return;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(docTitle || 'document').replace(/\s+/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
              <Scale className="w-3.5 h-3.5" />
              <span>{lang === 'ug' ? 'قانۇنىي & رەسمىي پۈتۈك مەركىزى' : 'Official Legal & Contract Studio'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {lang === 'ug' ? '📝 رەسمىي پۈتۈك & ھۆججەت تەييارلاش مەركىزى' : 'Smart Contract & Document Builder'}
            </h2>
            <p className="mt-2 text-sm text-blue-100 max-w-2xl leading-relaxed">
              {lang === 'ug'
                ? 'خىزمەت توختىمى، مەخپىيەتلىك كېلىشىمى (NDA)، رەسمىي ئىلتىماس، سودا تەكلىپنامىسى ۋە كەسپىي تەرجىمىھاللارنى بىر نەچچە سېكۇنتتا قېلىپلاشقان كەسپىي تىل بىلەن ھازىرلاڭ.'
                : 'Draft legally structured employment contracts, NDAs, formal petitions, business proposals, and CVs instantly with AI legal precision.'}
            </p>
          </div>

          {/* Target Language Toggle for Document */}
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 self-start md:self-auto">
            {(['ug', 'tr', 'en', 'ar'] as const).map((lKey) => (
              <button
                key={lKey}
                onClick={() => setTargetDocLang(lKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  targetDocLang === lKey ? 'bg-white text-slate-900 shadow-md font-bold' : 'text-white/80 hover:bg-white/20'
                }`}
              >
                {lKey === 'ug' ? 'ئۇيغۇرچە' : lKey === 'tr' ? 'Türkçe' : lKey === 'en' ? 'English' : 'العربية'}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {contractCategories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedType === cat.type;
            return (
              <button
                key={cat.type}
                onClick={() => handleSelectCategory(cat)}
                className={`p-3 rounded-2xl text-xs font-bold transition-all flex flex-col items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-indigo-900 shadow-md scale-105'
                    : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-center">{lang === 'ug' ? cat.labelUg : cat.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Drafting Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-indigo-600" />
              <span>{lang === 'ug' ? 'ھۆججەت كىرگۈزۈش پارامېتىرلىرى' : 'Document Parameters'}</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 uppercase">
              {selectedType}
            </span>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {lang === 'ug' ? 'ھۆججەت ماۋزۇسى:' : 'Document Title:'}
            </label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Parties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-indigo-500" />
                <span>{lang === 'ug' ? '1-تەرەپ (تەكلىپچى):' : 'Party A (Issuer):'}</span>
              </label>
              <input
                type="text"
                value={partyA}
                onChange={(e) => setPartyA(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-violet-500" />
                <span>{lang === 'ug' ? '2-تەرەپ (قوبۇللىغۇچى):' : 'Party B (Recipient):'}</span>
              </label>
              <input
                type="text"
                value={partyB}
                onChange={(e) => setPartyB(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Terms & Details */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {lang === 'ug' ? 'يادرولۇق شەرتلەر ۋە ئالاھىدە مەزمۇنلار:' : 'Core Clauses & Special Terms:'}
            </label>
            <textarea
              rows={5}
              value={keyTerms}
              onChange={(e) => setKeyTerms(e.target.value)}
              placeholder={lang === 'ug' ? 'مائاش، مۇددەت، تۆلەم، قوشۇمچە تەلەپلەرنى يېزىڭ...' : 'Specify compensation, duration, obligations...'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateContract}
            disabled={isGenerating}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{lang === 'ug' ? 'سۈنئىي ئىدراك پۈتۈكنى يېزىۋاتىدۇ...' : 'Drafting Legal Contract...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'ug' ? 'پۈتۈكنى تۈزۈش (AI Contract Builder)' : 'Generate Official Document'}</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Live Document Preview */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 min-h-[500px]">
          <div>
            {/* Action Bar */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {generatedDoc?.title || (lang === 'ug' ? 'ھۆججەت كۆرۈنۈشى' : 'Document Preview')}
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    isEditing ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                  title="Toggle Markdown Editing"
                >
                  {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                  <span>{isEditing ? (lang === 'ug' ? 'كۆرۈش' : 'Preview') : (lang === 'ug' ? 'تەھرىرلەش' : 'Edit')}</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Copy Document"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (lang === 'ug' ? 'كۆچۈرۈلدى' : 'Copied') : (lang === 'ug' ? 'كۆچۈرۈش' : 'Copy')}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Print Document"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{lang === 'ug' ? 'بېسىش' : 'Print'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Download .md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>MD</span>
                </button>
              </div>
            </div>

            {/* Document Body */}
            {generatedDoc ? (
              <div className="mt-4 space-y-4">
                {generatedDoc.summary && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">💡 {lang === 'ug' ? 'خۇلاسە:' : 'Summary:'} </span>
                    {generatedDoc.summary}
                  </div>
                )}

                {isEditing ? (
                  <textarea
                    rows={18}
                    value={editableMarkdown}
                    onChange={(e) => setEditableMarkdown(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <div
                    className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 max-h-[500px] overflow-y-auto space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans shadow-inner whitespace-pre-wrap select-text"
                    dir={targetDocLang === 'ug' || targetDocLang === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {editableMarkdown || generatedDoc.documentMarkdown}
                  </div>
                )}

                {/* Legal Tips */}
                {generatedDoc.legalTips?.length > 0 && (
                  <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
                    <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-2">
                      <Scale className="w-3.5 h-3.5" />
                      <span>{lang === 'ug' ? 'قانۇنىي مەسلىھەت ۋە ئىمزا ئەسكەرتمىسى:' : 'Legal Tips & Caveats:'}</span>
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 dark:text-slate-300">
                      {generatedDoc.legalTips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center text-center text-slate-400">
                <FileText className="w-12 h-12 stroke-1 mb-3 text-slate-300 dark:text-slate-600" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {lang === 'ug' ? 'پۈتۈك تاختىسى بوش' : 'No Document Generated Yet'}
                </h4>
                <p className="text-xs max-w-sm mt-1">
                  {lang === 'ug'
                    ? 'سول تەرەپتىكى پارامېتىرلارنى تاللاپ «پۈتۈكنى تۈزۈش» نى بېسىڭ. كەسپىي پۈتۈك نەتىجىسى بۇ يەردە كۆرۈنىدۇ.'
                    : 'Select category and terms on the left, then click generate to review complete document.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
