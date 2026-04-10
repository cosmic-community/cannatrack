'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import BottomNav from '@/components/BottomNav';

type GlassStyle = 'solid' | 'soft' | 'medium' | 'strong' | 'auto';

interface GlassSettings {
  style: GlassStyle;
  transparency: number;
  blur: number;
  tint: number;
  border: number;
  shadow: number;
  glow: number;
  radius: number;
  buttonOpacity: number;
  cardOpacity: number;
  navOpacity: number;
  popupOpacity: number;
}

interface AppContextType {
  appName: string;
  privacyStatement: string;
  theme: string;
  setTheme: (t: string) => void;
  glassSettings: GlassSettings;
  setGlassSettings: (settings: GlassSettings) => void;
}

const glassPresets: Record<GlassStyle, GlassSettings> = {
  solid: {
    style: 'solid',
    transparency: 0,
    blur: 0,
    tint: 20,
    border: 30,
    shadow: 12,
    glow: 0,
    radius: 18,
    buttonOpacity: 1,
    cardOpacity: 1,
    navOpacity: 1,
    popupOpacity: 1,
  },
  soft: {
    style: 'soft',
    transparency: 35,
    blur: 12,
    tint: 30,
    border: 40,
    shadow: 16,
    glow: 10,
    radius: 20,
    buttonOpacity: 0.8,
    cardOpacity: 0.78,
    navOpacity: 0.8,
    popupOpacity: 0.85,
  },
  medium: {
    style: 'medium',
    transparency: 48,
    blur: 18,
    tint: 38,
    border: 48,
    shadow: 20,
    glow: 14,
    radius: 22,
    buttonOpacity: 0.7,
    cardOpacity: 0.68,
    navOpacity: 0.7,
    popupOpacity: 0.75,
  },
  strong: {
    style: 'strong',
    transparency: 60,
    blur: 24,
    tint: 46,
    border: 56,
    shadow: 24,
    glow: 18,
    radius: 24,
    buttonOpacity: 0.6,
    cardOpacity: 0.58,
    navOpacity: 0.6,
    popupOpacity: 0.65,
  },
  auto: {
    style: 'auto',
    transparency: 42,
    blur: 16,
    tint: 34,
    border: 44,
    shadow: 18,
    glow: 12,
    radius: 22,
    buttonOpacity: 0.72,
    cardOpacity: 0.7,
    navOpacity: 0.7,
    popupOpacity: 0.78,
  },
};

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function isGlassStyle(value: unknown): value is GlassStyle {
  return value === 'solid' || value === 'soft' || value === 'medium' || value === 'strong' || value === 'auto';
}

function normalizeGlassSettings(input: Partial<GlassSettings>): GlassSettings {
  const style = isGlassStyle(input.style) ? input.style : 'auto';
  const base = glassPresets[style];
  return {
    ...base,
    transparency: typeof input.transparency === 'number' ? input.transparency : base.transparency,
    blur: typeof input.blur === 'number' ? input.blur : base.blur,
    tint: typeof input.tint === 'number' ? input.tint : base.tint,
    border: typeof input.border === 'number' ? input.border : base.border,
    shadow: typeof input.shadow === 'number' ? input.shadow : base.shadow,
    glow: typeof input.glow === 'number' ? input.glow : base.glow,
    radius: typeof input.radius === 'number' ? input.radius : base.radius,
    buttonOpacity: typeof input.buttonOpacity === 'number' ? input.buttonOpacity : base.buttonOpacity,
    cardOpacity: typeof input.cardOpacity === 'number' ? input.cardOpacity : base.cardOpacity,
    navOpacity: typeof input.navOpacity === 'number' ? input.navOpacity : base.navOpacity,
    popupOpacity: typeof input.popupOpacity === 'number' ? input.popupOpacity : base.popupOpacity,
  };
}

function getEffectiveStyle(style: GlassStyle, prefersDark: boolean) {
  if (style !== 'auto') return style;
  return prefersDark ? 'medium' : 'soft';
}

function applyGlassSettings(settings: GlassSettings, prefersDark: boolean) {
  const root = document.documentElement;
  const effectiveStyle = getEffectiveStyle(settings.style, prefersDark);

  root.dataset.uiStyle = effectiveStyle;
  root.dataset.uiStylePreference = settings.style;

  const transparency = clampNumber(settings.transparency, 0, 90);
  const baseOpacity = Math.max(0.24, (100 - transparency) / 100);
  const blur = clampNumber(settings.blur, 0, 30);
  const radius = clampNumber(settings.radius, 10, 30);
  const shadow = clampNumber(settings.shadow, 4, 32);
  const glow = clampNumber(settings.glow, 0, 24);
  const tint = clampNumber(settings.tint, 0, 100);
  const border = clampNumber(settings.border, 0, 100);

  const safeOpacity = (value: number) => Math.min(1, Math.max(baseOpacity, value));
  const buttonOpacity = safeOpacity(settings.buttonOpacity);
  const cardOpacity = safeOpacity(settings.cardOpacity);
  const navOpacity = safeOpacity(settings.navOpacity);
  const popupOpacity = safeOpacity(settings.popupOpacity);

  const tintBoost = baseOpacity < 0.35 ? 12 : 0;
  const tintL = prefersDark
    ? clampNumber(12 + (tint + tintBoost) * 0.2, 10, 32)
    : clampNumber(98 - (tint + tintBoost) * 0.3, 70, 98);
  const tintS = prefersDark ? 20 + tint * 0.25 : 28 + tint * 0.2;
  const borderL = prefersDark ? 26 + border * 0.35 : 80 + border * 0.15;
  const borderS = prefersDark ? 18 + border * 0.2 : 20 + border * 0.2;

  root.style.setProperty('--glass-blur', `${blur}px`);
  root.style.setProperty('--glass-radius', `${radius}px`);
  root.style.setProperty('--glass-shadow', `${shadow}px`);
  root.style.setProperty('--glass-glow', `${glow}px`);
  root.style.setProperty('--glass-base-opacity', String(baseOpacity));
  root.style.setProperty('--glass-button-opacity', String(buttonOpacity));
  root.style.setProperty('--glass-card-opacity', String(cardOpacity));
  root.style.setProperty('--glass-nav-opacity', String(navOpacity));
  root.style.setProperty('--glass-popup-opacity', String(popupOpacity));
  root.style.setProperty('--glass-overlay-opacity', baseOpacity < 0.35 ? '0.12' : '0.06');
  root.style.setProperty('--glass-tint-h', prefersDark ? '220' : '210');
  root.style.setProperty('--glass-tint-s', `${tintS}%`);
  root.style.setProperty('--glass-tint-l', `${tintL}%`);
  root.style.setProperty('--glass-border-h', prefersDark ? '220' : '210');
  root.style.setProperty('--glass-border-s', `${borderS}%`);
  root.style.setProperty('--glass-border-l', `${borderL}%`);
}

export const AppContext = createContext<AppContextType>({
  appName: 'CannaTrack',
  privacyStatement: '',
  theme: 'system',
  setTheme: () => {},
  glassSettings: glassPresets.auto,
  setGlassSettings: () => {},
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
  const [glassSettings, setGlassSettingsState] = useState<GlassSettings>(glassPresets.auto);

  useEffect(() => {
    const savedTheme = localStorage.getItem('cannatrack-theme') || 'system';
    setThemeState(savedTheme);
    const prefersDark = applyTheme(savedTheme);

    const savedGlass = localStorage.getItem('cannatrack-glass');
    if (savedGlass) {
      try {
        const parsed = JSON.parse(savedGlass) as Partial<GlassSettings>;
        const normalized = normalizeGlassSettings(parsed);
        setGlassSettingsState(normalized);
        applyGlassSettings(normalized, prefersDark);
      } catch {
        setGlassSettingsState(glassPresets.auto);
        applyGlassSettings(glassPresets.auto, prefersDark);
      }
    } else {
      setGlassSettingsState(glassPresets.auto);
      applyGlassSettings(glassPresets.auto, prefersDark);
    }
  }, []);

  function applyTheme(t: string) {
    const root = document.documentElement;
    const prefersDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (prefersDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    return prefersDark;
  }

  function setTheme(t: string) {
    setThemeState(t);
    localStorage.setItem('cannatrack-theme', t);
    const prefersDark = applyTheme(t);
    applyGlassSettings(glassSettings, prefersDark);
  }

  function setGlassSettings(next: GlassSettings) {
    setGlassSettingsState(next);
    localStorage.setItem('cannatrack-glass', JSON.stringify(next));
    const prefersDark = document.documentElement.classList.contains('dark');
    applyGlassSettings(next, prefersDark);
  }

  return (
    <AppContext.Provider value={{ appName, privacyStatement, theme, setTheme, glassSettings, setGlassSettings }}>
      <div className="min-h-screen pb-20 lg:pb-0 lg:pl-64">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex-col lg:border-r lg:border-slate-200 lg:dark:border-slate-800 lg:bg-white lg:dark:bg-slate-900 glass-panel">
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