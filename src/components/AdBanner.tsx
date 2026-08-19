import React from 'react';
import { Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

interface AdBannerProps {
  slotType: 'leaderboard' | 'rectangle' | 'infeed' | 'footer';
  publisherId?: string;
  adSlotId?: string;
  testMode?: boolean;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotType,
  publisherId = 'ca-pub-1234567890123456',
  adSlotId = '9876543210',
  testMode = true,
  className = '',
}) => {
  // If publisher provided real ID and not in test mode, render real Google AdSense markup
  if (!testMode && publisherId && publisherId.startsWith('ca-pub-')) {
    return (
      <div id={`ad-container-${slotType}`} className={`w-full my-4 flex flex-col items-center justify-center overflow-hidden ${className}`}>
        <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 mb-1 tracking-wider">
          Advertisement
        </span>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={publisherId}
          data-ad-slot={adSlotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Simulated High-Converting AdSense Mock for Testing & Preview
  if (slotType === 'leaderboard') {
    return (
      <div
        id="ad-slot-leaderboard"
        className={`w-full max-w-4xl mx-auto rounded-xl border border-dashed border-indigo-200 dark:border-slate-800 bg-indigo-50 dark:bg-ad-bg p-3 sm:p-4 transition-all hover:shadow-sm ${className}`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-indigo-100 dark:border-indigo-900/40 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span>Google AdSense • Responsive Leaderboard (728x90)</span>
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Sponsored</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              ⚡
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Deploy Next-Gen Web Apps with High-Speed Serverless Hosting
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                Zero configuration, global edge network, and instant Git deployments. Try for free today.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
          >
            <span>Learn More</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  if (slotType === 'rectangle') {
    return (
      <div
        id="ad-slot-rectangle"
        className={`w-full max-w-[340px] mx-auto rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-ad-bg p-4 transition-all hover:border-indigo-400 dark:hover:border-indigo-600 ${className}`}
      >
        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 mb-2.5">
          <span>AdSense Medium Rectangle (300x250)</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Ad</span>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 p-4 text-white text-center shadow-sm">
          <div className="w-10 h-10 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <h4 className="text-sm font-bold leading-tight mb-1">
            Unlimited Cloud Storage & Video Suite
          </h4>
          <p className="text-[11px] text-purple-100 mb-3 leading-relaxed">
            Backup your media files in 4K resolution with 256-bit bank-grade encryption.
          </p>
          <button
            type="button"
            className="w-full py-2 bg-white text-purple-700 hover:bg-purple-50 text-xs font-bold rounded-md shadow transition cursor-pointer"
          >
            Claim 50GB Free
          </button>
        </div>
        <div className="mt-2 text-center">
          <span className="text-[9px] text-slate-400">Ads by Google AdSense • Slots customizable in settings</span>
        </div>
      </div>
    );
  }

  if (slotType === 'infeed') {
    return (
      <div
        id="ad-slot-infeed"
        className={`w-full rounded-xl border border-dashed border-emerald-200 dark:border-slate-800 bg-emerald-50 dark:bg-ad-bg p-3.5 ${className}`}
      >
        <div className="flex items-center justify-between text-[10px] text-emerald-700 dark:text-emerald-400 font-medium mb-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Sponsored Utility Recommendation
          </span>
          <span className="text-[9px] text-slate-400">AdSense In-Feed</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Need to compress 100+ documents at once?
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              High-throughput batch document pipeline with 99.9% uptime.
            </p>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/60 hover:bg-emerald-200 rounded-md transition cursor-pointer shrink-0"
          >
            Explore
          </button>
        </div>
      </div>
    );
  }

  // Footer Banner (Sticky or Inline Responsive)
  return (
    <div
      id="ad-slot-footer"
      className={`w-full max-w-5xl mx-auto rounded-lg border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-ad-bg px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs ${className}`}
    >
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
          Ad
        </span>
        <span>
          <strong className="text-slate-700 dark:text-slate-200">AdSense Responsive Footer:</strong> Monetize mobile & desktop traffic seamlessly.
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-400">Ready for Google Publisher ID</span>
        <button
          type="button"
          className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold text-xs cursor-pointer"
        >
          Partner With Us
        </button>
      </div>
    </div>
  );
};
