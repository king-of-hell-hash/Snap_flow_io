import React, { useState, useEffect } from 'react';
import { TabType } from '../types';
import { 
  DownloadCloud, 
  FileText, 
  Wrench, 
  Code2, 
  Moon, 
  Sun, 
  DollarSign, 
  ImageIcon,
  Bot,
  History,
  LogIn,
  LogOut
} from 'lucide-react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  adTestMode: boolean;
  setAdTestMode: (val: boolean) => void;
  openAdModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  adTestMode,
  openAdModal,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'downloader',
      label: 'Social Downloader',
      icon: <DownloadCloud className="w-4 h-4" />,
      badge: 'TikTok • Reels • Shorts',
    },
    {
      id: 'pdf',
      label: 'PDF to Word',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'image-converter',
      label: 'Image to WebP',
      icon: <ImageIcon className="w-4 h-4" />,
    },
    {
      id: 'ai-assistant',
      label: 'AI Assistant',
      icon: <Bot className="w-4 h-4" />,
      badge: 'Flash Lite',
    },
    {
      id: 'history',
      label: 'History',
      icon: <History className="w-4 h-4" />,
    },
    {
      id: 'code',
      label: 'Vercel / Vanilla Code',
      icon: <Code2 className="w-4 h-4" />,
      badge: 'Export Hub',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('downloader')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <DownloadCloud className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-indigo-500">
                    SnapFlow.io
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-slate-900 dark:text-slate-400">
                    v2.4.0 (Stable)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Social Media Downloader & Document Suite
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Tab Navigation */}
          <nav className="hidden xl:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: User + Dark Mode */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2 pr-2 border-r border-slate-200 dark:border-slate-800">
                <img src={user.photoURL || ''} alt="User" className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700" />
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition mr-2"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            <button
              id="adsense-config-btn"
              onClick={openAdModal}
              title="Configure Google AdSense & Publisher Settings"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-medium hover:bg-amber-100 transition cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden lg:inline">AdSense Ready</span>
            </button>

            <button
              id="theme-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="xl:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
