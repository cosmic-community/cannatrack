'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllSessions } from '@/lib/db';
import type { Session, MedicationInsight } from '@/types';
import RatingDisplay from '@/components/RatingDisplay';

interface MedOption {
  id: string;
  slug: string;
  name: string;
  brand: string;
}

export default function DashboardClient({
  appName,
  tagline,
  medications,
}: {
  appName: string;
  tagline: string;
  medications: MedOption[];
}) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSessions().then(s => {
      setSessions(s);
      setLoading(false);
    });
  }, []);

  const recentSessions = sessions.slice(0, 5);

  const insights: MedicationInsight[] = [];
  const grouped = new Map<string, Session[]>();
  for (const s of sessions) {
    const key = s.medicationName;
    const arr = grouped.get(key);
    if (arr) {
      arr.push(s);
    } else {
      grouped.set(key, [s]);
    }
  }
  grouped.forEach((sessGroup, name) => {
    const count = sessGroup.length;
    const avgRelief = sessGroup.reduce((a, s) => a + s.reliefRating, 0) / count;
    const avgOverall = sessGroup.reduce((a, s) => a + s.overallRating, 0) / count;
    const avgValue = sessGroup.reduce((a, s) => a + s.valueRating, 0) / count;
    const symptomMap = new Map<string, number>();
    const sideEffectMap = new Map<string, number>();
    const wua = { yes: 0, no: 0, maybe: 0 };
    for (const s of sessGroup) {
      s.symptomsTargeted.forEach(sy => symptomMap.set(sy, (symptomMap.get(sy) || 0) + 1));
      s.sideEffectsExperienced.forEach(se => sideEffectMap.set(se, (sideEffectMap.get(se) || 0) + 1));
      wua[s.wouldUseAgain]++;
    }
    insights.push({
      medicationName: name,
      medicationBrand: sessGroup[0]?.medicationBrand || '',
      sessionCount: count,
      avgRelief: Math.round(avgRelief * 10) / 10,
      avgOverall: Math.round(avgOverall * 10) / 10,
      avgValue: Math.round(avgValue * 10) / 10,
      topSymptoms: [...symptomMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]),
      topSideEffects: [...sideEffectMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]),
      wouldUseAgain: wua,
    });
  });
  insights.sort((a, b) => b.avgOverall - a.avgOverall);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{appName}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{tagline}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/log" className="btn-primary text-center">
          📝 Log Session
        </Link>
        <Link href="/medications" className="btn-secondary text-center">
          💊 Medications
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{sessions.length}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Sessions</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{medications.length}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Medications</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{insights.length}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Tracked</p>
        </div>
      </div>

      {/* Top Medications */}
      {insights.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Top Medications</h2>
          <div className="space-y-3">
            {insights.slice(0, 3).map(insight => (
              <div key={insight.medicationName} className="card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">{insight.medicationName}</p>
                    {insight.medicationBrand && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">{insight.medicationBrand}</p>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{insight.sessionCount} sessions</span>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <RatingDisplay rating={Math.round(insight.avgRelief)} label="Relief" />
                  <RatingDisplay rating={Math.round(insight.avgOverall)} label="Overall" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Sessions */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Sessions</h2>
          {sessions.length > 0 && (
            <Link href="/history" className="text-xs text-teal-600 dark:text-teal-400 font-medium">
              View all →
            </Link>
          )}
        </div>
        {loading ? (
          <div className="card p-8 text-center">
            <div className="animate-pulse text-slate-400 dark:text-slate-500">Loading sessions...</div>
          </div>
        ) : recentSessions.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-3xl mb-2">📝</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">No sessions logged yet.</p>
            <Link href="/log" className="btn-primary mt-4 inline-flex">
              Log your first session
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentSessions.map(session => (
              <Link
                key={session.id}
                href={`/history?session=${session.id}`}
                className="card block p-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-slate-900 dark:text-white truncate">
                      {session.medicationName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {session.date} · {session.timeOfDay} · {session.dose}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <RatingDisplay rating={session.reliefRating} />
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        session.wouldUseAgain === 'yes'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : session.wouldUseAgain === 'no'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}
                    >
                      {session.wouldUseAgain === 'yes' ? '👍' : session.wouldUseAgain === 'no' ? '👎' : '🤷'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Privacy Notice */}
      <div className="card p-4 bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800">
        <div className="flex gap-3">
          <span className="text-lg">🔒</span>
          <div>
            <p className="text-xs font-semibold text-teal-800 dark:text-teal-300">Your data is private</p>
            <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-0.5">
              All session data is stored locally on your device. No account needed. No analytics. No hidden syncing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}