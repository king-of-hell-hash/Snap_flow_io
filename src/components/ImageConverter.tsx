import React, { useState, useRef } from 'react';
import { Upload, Download, Loader2, Sparkles, AlertCircle, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ImageConverter: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);

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

  const handleDrop = (e: React.DragEvent) => {
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

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG).');
      return;
    }
    setError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setConvertedUrl(null);
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('/api/convert-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Failed to convert image');
      }

      const blob = await response.blob();
      setConvertedUrl(URL.createObjectURL(blob));

      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.7 },
      });
    } catch (err: any) {
      console.error('Conversion error:', err);
      setError(err.message || 'An error occurred during conversion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Server-Side Image Conversion API</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Convert Images to <span className="text-indigo-600 dark:text-indigo-400">WebP Format</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Fast server-side conversion powered by Sharp. Upload a JPG or PNG to automatically compress and convert it to modern WebP format.
        </p>
      </div>

      {!selectedFile ? (
        /* Drop Zone */
        <div
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
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {dragActive ? 'Drop Image Here' : 'Click or Drag & Drop Image here'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Supports JPG, PNG, and standard image formats
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Preview & Action Area */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 space-y-5 transition-all text-left">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center shrink-0 font-bold">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate max-w-sm sm:max-w-md">
                  {selectedFile.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="font-semibold">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
                setConvertedUrl(null);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Original Image</span>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 p-2 h-48 flex items-center justify-center overflow-hidden">
                {previewUrl && <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg" />}
              </div>
            </div>
            
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Converted WebP</span>
                {convertedUrl && <span className="text-emerald-500 font-medium">Ready!</span>}
              </span>
              <div className={`rounded-xl border p-2 h-48 flex items-center justify-center overflow-hidden transition-colors ${convertedUrl ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800'}`}>
                {convertedUrl ? (
                  <img src={convertedUrl} alt="Converted" className="max-h-full max-w-full object-contain rounded-lg" />
                ) : (
                  <div className="text-center text-slate-400">
                    {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500" /> : <ImageIcon className="w-6 h-6 mx-auto opacity-50" />}
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-900 flex items-center gap-2 text-rose-800 dark:text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <p className="text-xs font-semibold">{error}</p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            {!convertedUrl ? (
              <button
                onClick={handleConvert}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{loading ? 'Converting via API...' : 'Convert to WebP'}</span>
              </button>
            ) : (
              <a
                href={convertedUrl}
                download={`${selectedFile.name.replace(/\.[^/.]+$/, "")}.webp`}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download WebP</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
