'use client';

import { useState, useEffect } from 'react';
import { getAllSessions, deleteSession } from '@/lib/db';
import type { Session } from '@/types';
import RatingDisplay from '@/components/RatingDisplay';

export default function HistoryClient() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    const data = await getAllSessions();
    setSessions(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this session? This cannot be undone.')) return;
    setDeleting(id);
    await deleteSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
    setDeleting(null);
    setExpandedId(null);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Session History</h1>
        <div className="card p-8 text-center animate-pulse text-slate-400 dark:text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Session History</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded</p>
      </div>

      {sessions.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-3xl mb-2">📋</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">No sessions logged yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map(session => {
            const isExpanded = expandedId === session.id;
            return (
              <div key={session.id} className="card overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : session.id)}
                  className="w-full p-4 text-left"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                        {session.medicationName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {session.date} · {session.timeOfDay || 'Any time'} · {session.dose || 'No dose recorded'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <RatingDisplay rating={session.reliefRating} />
                      <span className="text-slate-400 dark:text-slate-500 text-sm">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Relief</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{session.reliefRating}/5</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Overall</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{session.overallRating}/5</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Value</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{session.valueRating}/5</p>
                      </div>
                    </div>
                    {session.intakeMethod && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Method</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{session.intakeMethod}</p>
                      </div>
                    )}
                    {session.symptomsTargeted.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Symptoms Targeted</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {session.symptomsTargeted.map(s => (
                            <span key={s} className="chip chip-inactive text-[10px]">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {session.sideEffectsExperienced.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Side Effects</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {session.sideEffectsExperienced.map(se => (
                            <span key={se} className="chip bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px]">{se}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Would Use Again</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 capitalize">{session.wouldUseAgain}</p>
                    </div>
                    {session.notes && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Notes</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{session.notes}</p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleDelete(session.id)}
                        disabled={deleting === session.id}
                        className="btn-danger flex-1"
                      >
                        {deleting === session.id ? 'Deleting...' : '🗑️ Delete'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}