'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import BottomNav from '@/components/BottomNav';

interface AppContextType {
  appName: string;
  privacyStatement: string;
  theme: string;
  setTheme: (t: string) => void;
}

export const AppContext = createContext<AppContextType>({
  appName: 'CannaTrack',
  privacyStatement: '',
  theme: 'system',
  setTheme: () => {},
});

export function useAppContext() {
  return useContext(AppContext);
}

export default function AppShell({
  children,
  appName,
  privacyStatement,
}: {
  children: React.ReactNode;
  appName: string;
  privacyStatement: string;
}) {
  const [theme, setThemeState] = useState('system');

  useEffect(() => {
    const saved = localStorage.getItem('cannatrack-theme') || 'system';
    setThemeState(saved);
    applyTheme(saved);
  }, []);

  function applyTheme(t: string) {
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
    } else if (t === 'light') {
      root.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }

  function setTheme(t: string) {
    setThemeState(t);
    localStorage.setItem('cannatrack-theme', t);
    applyTheme(t);
  }

  return (
    <AppContext.Provider value={{ appName, privacyStatement, theme, setTheme }}>
      <div className="min-h-screen pb-20 lg:pb-0 lg:pl-64">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex-col lg:border-r lg:border-slate-200 lg:dark:border-slate-800 lg:bg-white lg:dark:bg-slate-900">
          <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-200 dark:border-slate-800">
            <span className="text-2xl">🏥</span>
            <span className="font-semibold text-lg text-slate-900 dark:text-white">{appName}</span>
          </div>
          <DesktopNav />
        </aside>
        <main className="max-w-5xl mx-auto px-4 py-6 lg:py-8">{children}</main>
        <BottomNav />
      </div>
    </AppContext.Provider>
  );
}

function DesktopNav() {
  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/medications', label: 'Medications', icon: '💊' },
    { href: '/log', label: 'Log Session', icon: '📝' },
    { href: '/history', label: 'History', icon: '📋' },
    { href: '/insights', label: 'Insights', icon: '📈' },
    { href: '/learn', label: 'Learn', icon: '📚' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto" aria-label="Main navigation">
      {navItems.map(item => (
        <a
          key={item.href}
          href={item.href}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <span className="text-lg">{item.icon}</span>
          {item.label}
        </a>
      ))}
    </nav>
  );
}