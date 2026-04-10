'use client';

import { useState, useRef, useEffect } from 'react';
import { exportAllData, importData, clearAllData, getAllSessions, sessionsToCSV } from '@/lib/db';
import { useAppContext } from '@/components/AppShell';

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

export default function SettingsClient({ privacyStatement }: { privacyStatement: string }) {
  const { theme, setTheme, glassSettings, setGlassSettings } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    getAllSessions().then(s => setSessionCount(s.length));
  }, []);

  function showMessage(text: string, type: 'success' | 'error' = 'success') {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  }

  async function handleExportJSON() {
    try {
      const json = await exportAllData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cannatrack-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showMessage('Data exported successfully.');
    } catch {
      showMessage('Export failed.', 'error');
    }
  }

  async function handleExportCSV() {
    try {
      const sessions = await getAllSessions();
      if (sessions.length === 0) {
        showMessage('No sessions to export.', 'error');
        return;
      }
      const csv = sessionsToCSV(sessions);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cannatrack-sessions-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showMessage('CSV exported successfully.');
    } catch {
      showMessage('CSV export failed.', 'error');
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const result = await importData(text);
      showMessage(`Imported ${result.sessionsImported} session(s).`);
      setSessionCount(prev => prev + result.sessionsImported);
    } catch {
      showMessage('Import failed. Please check the file format.', 'error');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleDeleteAll() {
    if (!confirm('Are you sure you want to permanently delete ALL your data? This cannot be undone.')) return;
    if (!confirm('This will delete all sessions and settings from your device. Are you absolutely sure?')) return;
    try {
      await clearAllData();
      setSessionCount(0);
      showMessage('All data has been permanently deleted.');
    } catch {
      showMessage('Failed to delete data.', 'error');
    }
  }

  function updateGlassSettings(update: Partial<GlassSettings>) {
    setGlassSettings({ ...glassSettings, ...update });
  }

  function applyGlassPreset(style: GlassStyle) {
    setGlassSettings(glassPresets[style]);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your preferences and data.</p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-xl text-sm font-medium ${
            messageType === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}
          role="alert"
        >
          {message}
        </div>
      )}

      {/* Theme */}
      <section className="card p-4 space-y-3">
        <h2 className="font-semibold text-sm text-slate-900 dark:text-white">🎨 Appearance</h2>
        <div className="flex gap-2">
          {(['system', 'light', 'dark'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`chip flex-1 justify-center ${theme === t ? 'chip-active' : 'chip-inactive'}`}
            >
              {t === 'system' ? '🖥️ System' : t === 'light' ? '☀️ Light' : '🌙 Dark'}
            </button>
          ))}
        </div>
      </section>

      {/* Glass UI */}
      <section className="card p-4 space-y-4">
        <div>
          <h2 className="font-semibold text-sm text-slate-900 dark:text-white">🪟 Liquid Glass UI</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Choose a preset or fine-tune the glass effect. Auto adapts to light/dark mode for best readability.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {([
            { key: 'solid', label: 'Solid UI' },
            { key: 'soft', label: 'Soft Glass' },
            { key: 'medium', label: 'Medium Glass' },
            { key: 'strong', label: 'Strong Glass' },
            { key: 'auto', label: 'Auto Glass' },
          ] as const).map(option => (
            <button
              key={option.key}
              onClick={() => applyGlassPreset(option.key)}
              className={`chip justify-center ${glassSettings.style === option.key ? 'chip-active' : 'chip-inactive'}`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Transparency level</span>
              <span>{glassSettings.transparency}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="80"
              step="1"
              value={glassSettings.transparency}
              onChange={e => updateGlassSettings({ transparency: Number(e.target.value) })}
              className="w-full accent-teal-600"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Blur strength</span>
              <span>{glassSettings.blur}px</span>
            </label>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={glassSettings.blur}
              onChange={e => updateGlassSettings({ blur: Number(e.target.value) })}
              className="w-full accent-teal-600"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Background tint</span>
              <span>{glassSettings.tint}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={glassSettings.tint}
              onChange={e => updateGlassSettings({ tint: Number(e.target.value) })}
              className="w-full accent-teal-600"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Border brightness</span>
              <span>{glassSettings.border}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={glassSettings.border}
              onChange={e => updateGlassSettings({ border: Number(e.target.value) })}
              className="w-full accent-teal-600"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Shadow softness</span>
              <span>{glassSettings.shadow}px</span>
            </label>
            <input
              type="range"
              min="4"
              max="32"
              step="1"
              value={glassSettings.shadow}
              onChange={e => updateGlassSettings({ shadow: Number(e.target.value) })}
              className="w-full accent-teal-600"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Glow amount</span>
              <span>{glassSettings.glow}px</span>
            </label>
            <input
              type="range"
              min="0"
              max="24"
              step="1"
              value={glassSettings.glow}
              onChange={e => updateGlassSettings({ glow: Number(e.target.value) })}
              className="w-full accent-teal-600"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Corner roundness</span>
              <span>{glassSettings.radius}px</span>
            </label>
            <input
              type="range"
              min="10"
              max="30"
              step="1"
              value={glassSettings.radius}
              onChange={e => updateGlassSettings({ radius: Number(e.target.value) })}
              className="w-full accent-teal-600"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Button fill opacity</span>
              <span>{Math.round(glassSettings.buttonOpacity * 100)}%</span>
            </label>
            <input
              type="range"
              min="0.3"
              max="1"
              step="0.05"
              value={glassSettings.buttonOpacity}
              onChange={e => updateGlassSettings({ buttonOpacity: Number(e.target.value) })}
              className="w-full accent-teal-600"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Card opacity</span>
              <span>{Math.round(glassSettings.cardOpacity * 100)}%</span>
            </label>
            <input
              type="range"
              min="0.3"
              max="1"
              step="0.05"
              value={glassSettings.cardOpacity}
              onChange={e => updateGlassSettings({ cardOpacity: Number(e.target.value) })}
              className="w-full accent-teal-600"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Nav bar opacity</span>
              <span>{Math.round(glassSettings.navOpacity * 100)}%</span>
            </label>
            <input
              type="range"
              min="0.3"
              max="1"
              step="0.05"
              value={glassSettings.navOpacity}
              onChange={e => updateGlassSettings({ navOpacity: Number(e.target.value) })}
              className="w-full accent-teal-600"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Popup / modal opacity</span>
              <span>{Math.round(glassSettings.popupOpacity * 100)}%</span>
            </label>
            <input
              type="range"
              min="0.3"
              max="1"
              step="0.05"
              value={glassSettings.popupOpacity}
              onChange={e => updateGlassSettings({ popupOpacity: Number(e.target.value) })}
              className="w-full accent-teal-600"
            />
          </div>
        </div>

        <div className="card p-3 space-y-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">Live preview</p>
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary">Primary</button>
            <button className="btn-secondary">Secondary</button>
            <button className="btn-danger">Danger</button>
          </div>
          <input className="input-field" placeholder="Glass input field" />
        </div>
      </section>

      {/* Data Stats */}
      <section className="card p-4 space-y-3">
        <h2 className="font-semibold text-sm text-slate-900 dark:text-white">📊 Your Data</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          You have <span className="font-bold text-slate-900 dark:text-white">{sessionCount}</span> session{sessionCount !== 1 ? 's' : ''} stored on this device.
        </p>
      </section>

      {/* Export */}
      <section className="card p-4 space-y-3">
        <h2 className="font-semibold text-sm text-slate-900 dark:text-white">📤 Export Data</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Download your data for backup or transfer.</p>
        <div className="flex gap-2">
          <button onClick={handleExportJSON} className="btn-secondary flex-1">
            📋 JSON Backup
          </button>
          <button onClick={handleExportCSV} className="btn-secondary flex-1">
            📊 CSV Export
          </button>
        </div>
      </section>

      {/* Import */}
      <section className="card p-4 space-y-3">
        <h2 className="font-semibold text-sm text-slate-900 dark:text-white">📥 Import Data</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Import a previously exported JSON backup.</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-teal-900/30 dark:file:text-teal-300"
        />
      </section>

      {/* Delete */}
      <section className="card p-4 space-y-3 border-red-200 dark:border-red-900/50">
        <h2 className="font-semibold text-sm text-red-600 dark:text-red-400">⚠️ Danger Zone</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Permanently delete all your data from this device. This cannot be undone.
        </p>
        <button onClick={handleDeleteAll} className="btn-danger w-full">
          🗑️ Delete All Data
        </button>
      </section>

      {/* Privacy */}
      <section className="card p-4 space-y-3 bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800">
        <h2 className="font-semibold text-sm text-teal-800 dark:text-teal-300">🔒 Privacy</h2>
        {privacyStatement ? (
          <p className="text-xs text-teal-700 dark:text-teal-400 leading-relaxed">{privacyStatement}</p>
        ) : (
          <div className="text-xs text-teal-700 dark:text-teal-400 leading-relaxed space-y-1">
            <p>• All data stays on your device unless you export it</p>
            <p>• No account required</p>
            <p>• No analytics or tracking</p>
            <p>• No hidden syncing</p>
            <p>• Images remain local unless exported by you</p>
          </div>
        )}
      </section>
    </div>
  );
}