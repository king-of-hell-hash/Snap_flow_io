import React, { useState, useEffect } from 'react';
import { 
  PlatformType, 
  VideoMetadata, 
  DownloadHistoryItem 
} from '../types';
import { 
  Download, 
  Link as LinkIcon, 
  Sparkles, 
  Music, 
  Film, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Trash2, 
  History, 
  Copy, 
  Play, 
  Volume2, 
  Info,
  ExternalLink,
  RefreshCw,
  Clock,
  Eye,
  Heart,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { logUsage } from '../utils/history';

const SAMPLE_LINKS = [
  {
    name: 'TikTok Aesthetic Timelapse',
    platform: 'tiktok' as PlatformType,
    url: 'https://www.tiktok.com/@citywanderer/video/7328192839128391283',
    tag: 'TikTok (No Watermark)',
  },
  {
    name: 'Amalfi Coast Travel Reel',
    platform: 'instagram' as PlatformType,
    url: 'https://www.instagram.com/reel/C8_AmalfiCoast_Sunset99/',
    tag: 'Instagram Reel HD',
  },
  {
    name: 'SpaceX 4K Launch Short',
    platform: 'youtube' as PlatformType,
    url: 'https://youtube.com/shorts/3xSpaceX_RocketLanding4K',
    tag: 'YouTube Shorts 1080p',
  },
];

export const SocialDownloader: React.FC = () => {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState<PlatformType>('auto');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VideoMetadata | null>(null);
  const [history, setHistory] = useState<DownloadHistoryItem[]>([]);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [previewMediaOpen, setPreviewMediaOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('omni_download_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to parse history from localStorage', e);
    }
  }, []);

  // Auto detect platform as user types or pastes
  useEffect(() => {
    if (url) {
      const lower = url.toLowerCase();
      if (lower.includes('tiktok.com') || lower.includes('douyin.com')) {
        setPlatform('tiktok');
      } else if (lower.includes('instagram.com') || lower.includes('instagr.am')) {
        setPlatform('instagram');
      } else if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
        setPlatform('youtube');
      }
    }
  }, [url]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setError(null);
      }
    } catch (err) {
      console.warn('Clipboard read failed:', err);
    }
  };

  const handleFetch = async (overrideUrl?: string, overridePlatform?: PlatformType) => {
    const targetUrl = (overrideUrl || url).trim();
    if (!targetUrl) {
      setError('Please enter or paste a valid video URL.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setStatusMessage('Analyzing video stream & resolving platform metadata...');

    try {
      // Step 1: Simulated progress feedback
      const timer = setTimeout(() => {
        setStatusMessage('Extracting high-definition audio & video streams...');
      }, 700);

      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          platform: overridePlatform || platform,
        }),
      });

      clearTimeout(timer);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch video stream. Please check link validity.');
      }

      setResult(data);
      setStatusMessage('Stream Ready for High Speed Download!');
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Unable to download video stream. Please ensure the link is public.');
    } finally {
      setLoading(false);
    }
  };

  const triggerDownload = async (downloadUrl: string, formatName: 'mp4-hd' | 'mp4-sd' | 'mp3' | 'cover', extension: string) => {
    if (!result) return;
    setDownloadingFormat(formatName);

    try {
      // Create safe filename
      const cleanTitle = (result.title || 'video')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .substring(0, 40);
      const filename = `${cleanTitle}_${formatName}.${extension}`;

      // Use proxy endpoint for attachment download
      const proxyUrl = `/api/proxy-download?url=${encodeURIComponent(downloadUrl)}&filename=${encodeURIComponent(filename)}`;

      // Create hidden link and click
      const a = document.createElement('a');
      a.href = proxyUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.75 },
      });

      // Save to download history
      const historyItem: DownloadHistoryItem = {
        id: Date.now().toString(),
        title: result.title || 'Video Media',
        platform: result.platform,
        thumbnail: result.thumbnail,
        format: formatName,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        url: downloadUrl,
      };

      const updatedHistory = [historyItem, ...history.filter(h => h.id !== historyItem.id)].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('omni_download_history', JSON.stringify(updatedHistory));

      logUsage('social-download', `Downloaded ${formatName} from ${result.platform}`);

    } catch (e) {
      console.error('Download trigger error:', e);
      window.open(downloadUrl, '_blank');
    } finally {
      setTimeout(() => setDownloadingFormat(null), 1000);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('omni_download_history');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Hero Header */}
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Universal Social Media Downloader (HD & MP3)</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Download Videos from <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">TikTok</span>, <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">Reels</span> & <span className="text-red-500">Shorts</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Paste any public link to download high definition MP4 video without watermarks or extract crystal-clear 320kbps MP3 audio streams instantly.
        </p>
      </div>

      {/* Main Input Box */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 transition-all">
        
        {/* Source selector & badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target Platform:</span>
            <select
              id="platform-select"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as PlatformType)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
            >
              <option value="auto">⚡ Auto-Detect Platform</option>
              <option value="tiktok">🎵 TikTok (No Watermark)</option>
              <option value="instagram">📸 Instagram Reels</option>
              <option value="youtube">▶️ YouTube Shorts</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className={`px-2 py-0.5 rounded-md transition ${platform === 'tiktok' ? 'bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-bold' : 'text-slate-400'}`}>
              TikTok
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className={`px-2 py-0.5 rounded-md transition ${platform === 'instagram' ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold' : 'text-slate-400'}`}>
              Instagram
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className={`px-2 py-0.5 rounded-md transition ${platform === 'youtube' ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold' : 'text-slate-400'}`}>
              YouTube
            </span>
          </div>
        </div>

        {/* Input Bar Form */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <LinkIcon className="w-5 h-5" />
            </div>
            <input
              id="video-url-input"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              placeholder="Paste TikTok, Instagram Reel, or YouTube Shorts link here..."
              className="w-full pl-11 pr-24 py-3.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
            <button
              id="paste-clipboard-btn"
              type="button"
              onClick={handlePaste}
              className="absolute inset-y-1.5 right-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>Paste</span>
            </button>
          </div>

          <button
            id="fetch-video-btn"
            type="button"
            disabled={loading}
            onClick={() => handleFetch()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Get Download Links</span>
              </>
            )}
          </button>
        </div>

        {/* Quick 1-Click Samples */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Try Sample Link:
          </span>
          {SAMPLE_LINKS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setUrl(sample.url);
                setPlatform(sample.platform);
                handleFetch(sample.url, sample.platform);
              }}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer flex items-center gap-1"
            >
              <span>{sample.tag}</span>
            </button>
          ))}
        </div>

        {/* Status Indicator */}
        {loading && (
          <div className="mt-4 p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-3 animate-pulse">
            <Loader2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-spin" />
            <div className="text-left">
              <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                {statusMessage}
              </p>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400">
                Contacting stream servers, parsing audio channels & bypassing watermark tags...
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-rose-800 dark:text-rose-200">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-left">
              <p className="text-xs font-bold">Download Error</p>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{error}</p>
            </div>
          </div>
        )}

      </div>

      {/* Result Card: Video Details & Format Options */}
      {result && (
        <div id="video-result-container" className="rounded-2xl border border-indigo-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 transition-all">
          
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3.5 mb-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Download Stream Ready
              </h3>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Verified
              </span>
            </div>
            <button
              onClick={copyShareLink}
              className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Tool'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Thumbnail & Media Details */}
            <div className="lg:col-span-5 flex flex-col items-center sm:items-start text-left gap-4">
              <div className="relative group w-full max-w-[280px] sm:max-w-none aspect-[9/14] sm:aspect-video rounded-xl overflow-hidden shadow-md bg-slate-900">
                <img
                  src={result.thumbnail}
                  alt={result.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3.5">
                  <span className="self-end px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur">
                    {result.duration || '0:35'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewMediaOpen(true)}
                    className="self-center w-12 h-12 rounded-full bg-white/90 hover:bg-white text-indigo-600 flex items-center justify-center shadow-lg transition hover:scale-110 cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </button>
                  <div className="flex items-center justify-between text-white text-[11px] font-medium">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-slate-300" /> {result.views || '1.8M'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-pink-400 fill-pink-400" /> {result.likes || '340K'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Creator info */}
              <div className="w-full">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                  {result.title}
                </h4>
                <div className="flex items-center gap-2.5 mt-2">
                  {result.authorAvatar && (
                    <img
                      src={result.authorAvatar}
                      alt={result.author}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                  )}
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {result.authorName || result.author}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{result.author}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Download Options (MP4 HD, MP4 SD, MP3 Audio, Cover) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Select Download Format
              </h4>

              {/* Option 1: MP4 HD Video (No Watermark) */}
              <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Film className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        MP4 Video (HD 1080p)
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        No Watermark
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Size: ~{result.sizeMp4 || '16 MB'} • High Bitrate Clean Video
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => triggerDownload(result.downloadUrlMp4Hd || result.downloadUrlMp4, 'mp4-hd', 'mp4')}
                  disabled={downloadingFormat === 'mp4-hd'}
                  className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                >
                  {downloadingFormat === 'mp4-hd' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  <span>Download MP4 HD</span>
                </button>
              </div>

              {/* Option 2: MP4 SD Fast */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0">
                    <Film className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      MP4 Video (Standard 720p)
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Faster download • Optimized for mobile sharing
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => triggerDownload(result.downloadUrlMp4, 'mp4-sd', 'mp4')}
                  disabled={downloadingFormat === 'mp4-sd'}
                  className="px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                >
                  {downloadingFormat === 'mp4-sd' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  <span>Download SD</span>
                </button>
              </div>

              {/* Option 3: MP3 Audio Only */}
              <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Music className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Audio Only (MP3 320kbps)
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        Crystal Audio
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Size: ~{result.sizeMp3 || '3.2 MB'} • Extracted sound & background track
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => triggerDownload(result.downloadUrlMp3, 'mp3', 'mp3')}
                  disabled={downloadingFormat === 'mp3'}
                  className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                >
                  {downloadingFormat === 'mp3' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>Download MP3</span>
                </button>
              </div>

              {/* Option 4: Thumbnail Cover HD */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      HD Cover Thumbnail
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Original full resolution image (.jpg)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => triggerDownload(result.thumbnail, 'cover', 'jpg')}
                  className="px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Cover</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewMediaOpen && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-white">
              <h4 className="text-sm font-bold truncate max-w-md">{result.title}</h4>
              <button
                onClick={() => setPreviewMediaOpen(false)}
                className="px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                Close ✕
              </button>
            </div>
            <div className="my-4 flex items-center justify-center bg-black rounded-lg overflow-hidden max-h-[60vh]">
              <video
                src={result.downloadUrlMp4}
                controls
                autoPlay
                className="max-h-[55vh] w-auto rounded-lg shadow-lg"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => triggerDownload(result.downloadUrlMp4Hd || result.downloadUrlMp4, 'mp4-hd', 'mp4')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download MP4 HD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download History Section */}
      {history.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-left">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Recent Downloads History ({history.length})
              </h3>
            </div>
            <button
              onClick={clearHistory}
              className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear History
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex items-center gap-3 hover:border-indigo-300 transition"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover bg-slate-200 dark:bg-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                    <span className="uppercase font-bold text-indigo-500">{item.format}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                </div>
                <button
                  onClick={() => window.open(item.url, '_blank')}
                  title="Re-download stream"
                  className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 hover:bg-indigo-100 cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60">
          <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-600 flex items-center justify-center font-bold mb-2">
            ✨
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">No Watermark Filter</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Automatically scrubs intrusive watermarks and logos from TikTok and Instagram clips.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold mb-2">
            🎵
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">320kbps Audio Extractor</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Extract high-fidelity MP3 sound tracks from music trends and spoken audio reels.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold mb-2">
            ⚡
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Edge Stream Proxy</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Direct high-speed streaming without speed throttling or cross-origin popup blocks.
          </p>
        </div>
      </div>

    </div>
  );
};
