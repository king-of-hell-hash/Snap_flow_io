import React, { useState } from 'react';
import { DollarSign, ShieldCheck, Check, Sparkles, AlertCircle, Info, ExternalLink } from 'lucide-react';

interface AdConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  publisherId: string;
  setPublisherId: (id: string) => void;
  adTestMode: boolean;
  setAdTestMode: (val: boolean) => void;
}

export const AdConfigModal: React.FC<AdConfigModalProps> = ({
  isOpen,
  onClose,
  publisherId,
  setPublisherId,
  adTestMode,
  setAdTestMode,
}) => {
  const [localId, setLocalId] = useState(publisherId);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setPublisherId(localId.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in text-left">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Google AdSense & Monetization Setup
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure your Publisher ID and ad slot behaviors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Preview Mode:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAdTestMode(true)}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition cursor-pointer ${
                  adTestMode
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Simulated Ads
              </button>
              <button
                type="button"
                onClick={() => setAdTestMode(false)}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition cursor-pointer ${
                  !adTestMode
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Live AdSense
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {adTestMode
              ? 'Currently showing responsive simulated demo banners for layout testing.'
              : 'Using official Google AdSense <ins> tags with your Publisher ID.'}
          </p>
        </div>

        {/* Publisher ID Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            AdSense Publisher ID
          </label>
          <input
            type="text"
            value={localId}
            onChange={(e) => setLocalId(e.target.value)}
            placeholder="ca-pub-1234567890123456"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-mono outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
          />
          <p className="text-[11px] text-slate-400">
            Found in your Google AdSense Dashboard &gt; Account &gt; Settings &gt; Publisher ID.
          </p>
        </div>

        {/* Placement Guide */}
        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            AdSense Policy Compliance Checklist:
          </h4>
          <ul className="space-y-1 list-disc list-inside text-[11px]">
            <li>Distinct "ADVERTISEMENT" / "SPONSORED" label above each ad slot.</li>
            <li>No accidental click layout overlays or deceptive close buttons.</li>
            <li>Proper viewport spacing between interactive download buttons & ad units.</li>
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{saved ? 'Saved!' : 'Save Settings'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
