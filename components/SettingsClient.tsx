'use client';

import { useState, useRef, useEffect } from 'react';
import { exportAllData, importData, clearAllData, getAllSessions, sessionsToCSV } from '@/lib/db';
import { useAppContext } from '@/components/AppShell';

export default function SettingsClient({ privacyStatement }: { privacyStatement: string }) {
  const { theme, setTheme } = useAppContext();
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