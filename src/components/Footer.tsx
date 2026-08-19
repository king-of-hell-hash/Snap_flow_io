import React from 'react';
import { TabType } from '../types';
import { AdBanner } from './AdBanner';
import { Heart, ShieldCheck, Zap, DownloadCloud } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: TabType) => void;
  publisherId: string;
  adTestMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  publisherId,
  adTestMode,
}) => {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      
      {/* Sticky/Responsive Footer AdSense Banner */}
      <div className="w-full py-4 px-4 border-b border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-900">
        <AdBanner
          slotType="footer"
          publisherId={publisherId}
          testMode={adTestMode}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                <DownloadCloud className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-slate-900 dark:text-indigo-500">
                SnapFlow.io
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              Fast, high-performance web utility suite. Download TikTok, Instagram Reels, and YouTube Shorts in MP4 HD or MP3 audio, and convert PDF documents to Word (.docx) and Plain Text 100% in your browser.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Client-Side Private Document Processing</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Core Hub Tools
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => setActiveTab('downloader')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                >
                  Social Media Downloader
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('pdf')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                >
                  PDF to Word / Text Converter
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('utilities')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                >
                  Image Compressor & QR Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('code')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                >
                  Vercel Serverless Code Export
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Disclaimer & Terms */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Legal & Usage
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              This utility is intended for personal archiving of public content. Please respect copyright laws and content creators' rights.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Optimized for High-Speed Edge Delivery</span>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} SnapFlow.io. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with precision • Production-Ready for Vercel
          </p>
        </div>
      </div>
    </footer>
  );
};
