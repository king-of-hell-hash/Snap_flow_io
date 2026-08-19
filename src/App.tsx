import React, { useState, useEffect } from 'react';
import { TabType } from './types';
import { Header } from './components/Header';
import { SocialDownloader } from './components/SocialDownloader';
import { PdfConverter } from './components/PdfConverter';
import { UtilityTools } from './components/UtilityTools';
import { CodeExportModal } from './components/CodeExportModal';
import { AdBanner } from './components/AdBanner';
import { AdConfigModal } from './components/AdConfigModal';
import { Footer } from './components/Footer';
import { ImageConverter } from './components/ImageConverter';
import { PolicyPage } from './components/PolicyPage';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('downloader');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('omni_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  const [publisherId, setPublisherId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('omni_adsense_pub') || 'ca-pub-1234567890123456';
    }
    return 'ca-pub-1234567890123456';
  });

  const [adTestMode, setAdTestMode] = useState<boolean>(true);
  const [isAdModalOpen, setIsAdModalOpen] = useState<boolean>(false);

  // Sync Dark mode to document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('omni_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('omni_theme', 'light');
    }
  }, [darkMode]);

  // Sync publisher ID
  useEffect(() => {
    localStorage.setItem('omni_adsense_pub', publisherId);
  }, [publisherId]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
      
      {/* Top AdSense Leaderboard Slot (728x90 responsive) */}
      <div className="w-full bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-2 px-4 transition-colors">
        <AdBanner
          slotType="leaderboard"
          publisherId={publisherId}
          testMode={adTestMode}
        />
      </div>

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        adTestMode={adTestMode}
        setAdTestMode={setAdTestMode}
        openAdModal={() => setIsAdModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Active Tab View */}
        {activeTab === 'downloader' && (
          <div className="space-y-8 animate-fade-in">
            <SocialDownloader />
            
            {/* Medium Rectangle AdSense Slot (300x250) */}
            <div className="pt-4 flex justify-center">
              <AdBanner
                slotType="rectangle"
                publisherId={publisherId}
                testMode={adTestMode}
              />
            </div>
          </div>
        )}

        {activeTab === 'pdf' && (
          <div className="space-y-8 animate-fade-in">
            <PdfConverter />

            {/* In-feed AdSense Slot */}
            <div className="max-w-3xl mx-auto pt-2">
              <AdBanner
                slotType="infeed"
                publisherId={publisherId}
                testMode={adTestMode}
              />
            </div>
          </div>
        )}

        {activeTab === 'image-converter' && (
          <div className="space-y-8 animate-fade-in">
            <ImageConverter />
          </div>
        )}

        {activeTab === 'utilities' && (
          <div className="space-y-8 animate-fade-in">
            <UtilityTools />
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-8 animate-fade-in">
            <CodeExportModal />
          </div>
        )}

        {['about', 'privacy', 'terms', 'disclaimer', 'contact'].includes(activeTab) && (
          <div className="space-y-8 animate-fade-in bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <PolicyPage pageType={activeTab as any} />
          </div>
        )}

      </main>

      {/* Footer with Responsive AdSense Footer Banner */}
      <Footer
        setActiveTab={setActiveTab}
        publisherId={publisherId}
        adTestMode={adTestMode}
      />

      {/* AdSense Configuration Modal */}
      <AdConfigModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        publisherId={publisherId}
        setPublisherId={setPublisherId}
        adTestMode={adTestMode}
        setAdTestMode={setAdTestMode}
      />

    </div>
  );
}
