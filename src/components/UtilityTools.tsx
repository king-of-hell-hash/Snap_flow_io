import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, 
  QrCode, 
  Type, 
  Download, 
  Upload, 
  Sliders, 
  Sparkles, 
  Check, 
  Copy,
  RefreshCw,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const UtilityTools: React.FC = () => {
  const [activeSubTool, setActiveSubTool] = useState<'image' | 'qr' | 'text'>('image');

  // Image Compressor State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<'image/webp' | 'image/jpeg' | 'image/png'>('image/webp');
  const [quality, setQuality] = useState<number>(0.85);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // QR Code State
  const [qrText, setQrText] = useState('https://github.com');
  const [qrColor, setQrColor] = useState('#4f46e5');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Text Case Converter State
  const [textContent, setTextContent] = useState('Welcome to the universal multi-platform web utility suite.');
  const [copiedText, setCopiedText] = useState(false);

  // Handle Image Upload & Compression
  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setOriginalSize(file.size);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    compressImage(file, quality, targetFormat);
  };

  const compressImage = (file: File, q: number, format: string) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedSize(blob.size);
              setCompressedPreview(URL.createObjectURL(blob));
            }
          },
          format,
          q
        );
      }
    };
  };

  const downloadCompressedImage = () => {
    if (!compressedPreview || !imageFile) return;
    const a = document.createElement('a');
    a.href = compressedPreview;
    const ext = targetFormat.split('/')[1];
    a.download = `optimized_${imageFile.name.replace(/\.[^/.]+$/, '')}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  // Generate QR Code via standard SVG/Canvas Matrix representation
  const renderQrToCanvas = () => {
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use QuickChart / QR API to draw sharp bitmap into canvas for export
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrText)}&color=${qrColor.replace('#', '')}&bgcolor=${qrBgColor.replace('#', '')}`;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = qrUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 300, 300);
    };
  };

  React.useEffect(() => {
    if (activeSubTool === 'qr') {
      renderQrToCanvas();
    }
  }, [qrText, qrColor, qrBgColor, activeSubTool]);

  const downloadQrCode = () => {
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `qrcode_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    confetti({ particleCount: 50, spread: 50 });
  };

  // Text Transformations
  const transformText = (type: 'upper' | 'lower' | 'title' | 'slug' | 'clean') => {
    let result = textContent;
    if (type === 'upper') result = textContent.toUpperCase();
    if (type === 'lower') result = textContent.toLowerCase();
    if (type === 'title') {
      result = textContent.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
    if (type === 'slug') {
      result = textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (type === 'clean') {
      result = textContent.replace(/\s+/g, ' ').trim();
    }
    setTextContent(result);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Subtool Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md mx-auto">
        <button
          onClick={() => setActiveSubTool('image')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTool === 'image'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Image Compressor</span>
        </button>

        <button
          onClick={() => setActiveSubTool('qr')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTool === 'qr'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>QR Generator</span>
        </button>

        <button
          onClick={() => setActiveSubTool('text')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSubTool === 'text'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Text Formatter</span>
        </button>
      </div>

      {/* Tool 1: Image Converter & Compressor */}
      {activeSubTool === 'image' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-500" />
                Image to WebP / PNG Compressor
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Compress JPG, PNG, and WebP images up to 80% without visible quality loss.
              </p>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              HTML5 Canvas
            </span>
          </div>

          {!imageFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-10 text-center hover:border-indigo-500 transition cursor-pointer"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                className="hidden"
              />
              <Upload className="w-10 h-10 mx-auto text-indigo-500 mb-2" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Click or Drop Image Here
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, JPEG, and WebP</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Original */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span>Original Image</span>
                    <span className="text-slate-500">{(originalSize / 1024).toFixed(1)} KB</span>
                  </div>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Original"
                      className="w-full h-48 object-contain rounded-lg bg-black/5"
                    />
                  )}
                </div>

                {/* Optimized */}
                <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-indigo-600 dark:text-indigo-400">Optimized ({targetFormat.split('/')[1].toUpperCase()})</span>
                    <span className="text-emerald-600 font-bold">
                      {(compressedSize / 1024).toFixed(1)} KB (
                      {originalSize ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0}% saved)
                    </span>
                  </div>
                  {compressedPreview && (
                    <img
                      src={compressedPreview}
                      alt="Optimized"
                      className="w-full h-48 object-contain rounded-lg bg-black/5"
                    />
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between mb-1.5">
                    <span>Quality Level ({Math.round(quality * 100)}%)</span>
                  </label>
                  <input
                    type="range"
                    min="0.2"
                    max="1.0"
                    step="0.05"
                    value={quality}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setQuality(val);
                      if (imageFile) compressImage(imageFile, val, targetFormat);
                    }}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Output Format
                  </label>
                  <select
                    value={targetFormat}
                    onChange={(e) => {
                      const fmt = e.target.value as any;
                      setTargetFormat(fmt);
                      if (imageFile) compressImage(imageFile, quality, fmt);
                    }}
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                  >
                    <option value="image/webp">WebP (Smallest file size)</option>
                    <option value="image/jpeg">JPEG (Standard photo)</option>
                    <option value="image/png">PNG (Lossless / transparent)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                >
                  Upload Different Image
                </button>
                <button
                  type="button"
                  onClick={downloadCompressedImage}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Optimized Image
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tool 2: QR Code Generator */}
      {activeSubTool === 'qr' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-500" />
                Custom High-Res QR Code Generator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate high-resolution scannable QR codes for websites, WiFi, and contact links.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
            <div className="sm:col-span-7 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Enter URL or Text
                </label>
                <input
                  type="text"
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    QR Foreground Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer p-0.5"
                    />
                    <span className="text-xs font-mono">{qrColor}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
                    Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer p-0.5"
                    />
                    <span className="text-xs font-mono">{qrBgColor}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={downloadQrCode}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download High-Res PNG (300x300)
              </button>
            </div>

            <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <canvas
                ref={qrCanvasRef}
                width={300}
                height={300}
                className="w-48 h-48 rounded-xl shadow-md bg-white p-2"
              />
              <p className="text-[11px] text-slate-400 mt-2">Instant Live Preview</p>
            </div>
          </div>
        </div>
      )}

      {/* Tool 3: Text Formatter */}
      {activeSubTool === 'text' && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Type className="w-5 h-5 text-indigo-500" />
                Text Case & Slug Formatter
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transform strings, capitalize sentences, clean whitespace, and generate URL slugs.
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(textContent);
                setCopiedText(true);
                setTimeout(() => setCopiedText(false), 2000);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            rows={6}
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Type or paste text to transform..."
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => transformText('upper')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-xs font-semibold cursor-pointer"
            >
              UPPERCASE
            </button>
            <button
              onClick={() => transformText('lower')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-xs font-semibold cursor-pointer"
            >
              lowercase
            </button>
            <button
              onClick={() => transformText('title')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-xs font-semibold cursor-pointer"
            >
              Title Case
            </button>
            <button
              onClick={() => transformText('slug')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-xs font-semibold cursor-pointer"
            >
              url-slug-format
            </button>
            <button
              onClick={() => transformText('clean')}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-xs font-semibold cursor-pointer"
            >
              Trim Extra Whitespace
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
