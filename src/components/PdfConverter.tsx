import React, { useState, useRef } from 'react';
import { ParsedPdf } from '../types';
import { 
  parsePdfFile, 
  generateDocxBlob, 
  createSamplePdfFile 
} from '../utils/pdfConverter';
import { 
  FileUp, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Search, 
  FileCode, 
  Layers, 
  Loader2, 
  RefreshCw, 
  Sparkles, 
  AlertCircle,
  FileCheck2,
  Edit3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { logUsage } from '../utils/history';

export const PdfConverter: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [parsedDoc, setParsedDoc] = useState<ParsedPdf | null>(null);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [editedText, setEditedText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [exportingDocx, setExportingDocx] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setError('Please upload a valid .PDF document.');
      return;
    }

    setLoading(true);
    setError(null);
    setStatusMessage('Reading PDF binary structure & rendering pages...');

    try {
      const parsed = await parsePdfFile(file);
      setParsedDoc(parsed);
      setEditedText(parsed.fullText);
      setSelectedPage(1);
      setStatusMessage('Conversion Complete!');

      logUsage('pdf-to-word', `Converted ${file.name}`);

      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.7 },
      });
    } catch (err: any) {
      console.error('PDF parsing error:', err);
      setError(err.message || 'Failed to extract text from this PDF file.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = () => {
    const sample = createSamplePdfFile();
    processFile(sample);
  };

  const handleDownloadDocx = async () => {
    if (!parsedDoc) return;
    setExportingDocx(true);
    try {
      const blob = await generateDocxBlob(parsedDoc.name, editedText, parsedDoc.pages);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${parsedDoc.name.replace(/\.pdf$/i, '')}_converted.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Docx export error:', err);
      setError('Failed to generate .docx file. Falling back to .txt download.');
    } finally {
      setExportingDocx(false);
    }
  };

  const handleDownloadTxt = () => {
    if (!parsedDoc) return;
    const blob = new Blob([editedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${parsedDoc.name.replace(/\.pdf$/i, '')}_extracted.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMd = () => {
    if (!parsedDoc) return;
    const mdContent = `# ${parsedDoc.name.replace(/\.pdf$/i, '')}\n\n*Converted via OmniUtility PDF Hub on ${new Date().toLocaleDateString()}*\n\n---\n\n${editedText}`;
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${parsedDoc.name.replace(/\.pdf$/i, '')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(editedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Client-Side PDF to Word & Text Converter</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Convert PDF to <span className="text-indigo-600 dark:text-indigo-400">Word (.docx)</span> & <span className="text-emerald-600 dark:text-emerald-400">Plain Text</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Fast, 100% private in-browser conversion. No file uploads to external servers. Extract text, inspect pages, and download formatted Word or Text documents.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        id="pdf-drop-zone"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer ${
          dragActive
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-sm'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
            {loading ? (
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            ) : (
              <FileUp className="w-8 h-8" />
            )}
          </div>
          
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {dragActive ? 'Drop PDF File Here' : 'Click or Drag & Drop PDF here'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Supports invoices, contracts, papers, articles, and book chapters
            </p>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <span className="text-[11px] px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              100% Client-Side Privacy
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLoadSample();
              }}
              className="text-[11px] px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 font-semibold transition cursor-pointer"
            >
              ⚡ Load Demo PDF
            </button>
          </div>
        </div>
      </div>

      {/* Loading & Status Alerts */}
      {loading && (
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
          <div className="text-left">
            <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">{statusMessage}</p>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400">Extracting glyph maps, line breaks, and page layouts...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-3 text-rose-800 dark:text-rose-200">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="text-xs font-semibold">{error}</p>
        </div>
      )}

      {/* Parsed PDF Workspace */}
      {parsedDoc && (
        <div id="pdf-workspace" className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-5 transition-all text-left">
          
          {/* Top Document Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center shrink-0 font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate max-w-sm sm:max-w-md">
                  {parsedDoc.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="font-semibold">{parsedDoc.totalPages} Pages</span>
                  <span>•</span>
                  <span>{parsedDoc.wordCount.toLocaleString()} Words</span>
                  <span>•</span>
                  <span>{(parsedDoc.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
            </div>

            {/* Quick Action Export Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                id="download-docx-btn"
                onClick={handleDownloadDocx}
                disabled={exportingDocx}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition cursor-pointer"
              >
                {exportingDocx ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>Download Word (.docx)</span>
              </button>

              <button
                type="button"
                id="download-txt-btn"
                onClick={handleDownloadTxt}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Text (.txt)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadMd}
                className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Markdown</span>
              </button>

              <button
                type="button"
                onClick={handleCopyText}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Search and Page Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search within document */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search extracted words..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Page Jump Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Pages:
              </span>
              {parsedDoc.pages.map((p) => (
                <button
                  key={p.pageNumber}
                  onClick={() => setSelectedPage(p.pageNumber)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                    selectedPage === p.pageNumber
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  Pg {p.pageNumber}
                </button>
              ))}
              <button
                onClick={() => setSelectedPage(0)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  selectedPage === 0
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                All Pages
              </button>
            </div>
          </div>

          {/* Interactive Text Viewer / Editor */}
          <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2 border-b border-slate-200 dark:border-slate-800 pb-1.5">
              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                <Edit3 className="w-3.5 h-3.5" />
                {selectedPage === 0 ? 'Full Document View (Editable)' : `Page ${selectedPage} View`}
              </span>
              <span>{editedText.length} characters</span>
            </div>

            <textarea
              id="extracted-text-area"
              value={
                selectedPage === 0
                  ? editedText
                  : parsedDoc.pages.find((p) => p.pageNumber === selectedPage)?.text || editedText
              }
              onChange={(e) => {
                if (selectedPage === 0) {
                  setEditedText(e.target.value);
                } else {
                  const updatedPages = parsedDoc.pages.map((p) =>
                    p.pageNumber === selectedPage ? { ...p, text: e.target.value } : p
                  );
                  setParsedDoc({ ...parsedDoc, pages: updatedPages });
                  setEditedText(updatedPages.map((p) => `--- Page ${p.pageNumber} ---\n\n${p.text}`).join('\n\n'));
                }
              }}
              rows={12}
              className="w-full bg-transparent text-slate-800 dark:text-slate-200 font-mono text-xs sm:text-sm leading-relaxed outline-none resize-y border-none focus:ring-0"
              placeholder="Extracted PDF content will display here..."
            />
          </div>

          {/* Security & Features Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Full Unicode, special characters, and line break reconstruction</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Native Microsoft Word (.docx) styling and heading tags</span>
            </div>
          </div>

        </div>
      )}

      {/* Feature Explanations */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Zero Server Uploads</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Your sensitive PDFs never leave your browser memory. Ideal for confidential legal & financial documents.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">True Word (.docx) Format</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Exports compliant OpenXML .docx files ready to edit in Microsoft Word, Google Docs, or LibreOffice.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Multi-Page Pagination</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Easily jump between individual pages or export the entire book/document in one seamless workflow.
          </p>
        </div>
      </div>

    </div>
  );
};
