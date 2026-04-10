'use client';

import { useState, useEffect } from 'react';
import { getAllSessions } from '@/lib/db';
import type { Session, MedicationInsight } from '@/types';
import RatingDisplay from '@/components/RatingDisplay';

export default function InsightsClient() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'overall' | 'relief' | 'value' | 'sessions'>('overall');

  useEffect(() => {
    getAllSessions().then(s => {
      setSessions(s);
      setLoading(false);
    });
  }, []);

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

  insights.sort((a, b) => {
    switch (sortBy) {
      case 'relief': return b.avgRelief - a.avgRelief;
      case 'value': return b.avgValue - a.avgValue;
      case 'sessions': return b.sessionCount - a.sessionCount;
      default: return b.avgOverall - a.avgOverall;
    }
  });

  // Top symptoms across all sessions
  const allSymptomCounts = new Map<string, number>();
  const allSideEffectCounts = new Map<string, number>();
  sessions.forEach(s => {
    s.symptomsTargeted.forEach(sy => allSymptomCounts.set(sy, (allSymptomCounts.get(sy) || 0) + 1));
    s.sideEffectsExperienced.forEach(se => allSideEffectCounts.set(se, (allSideEffectCounts.get(se) || 0) + 1));
  });
  const topSymptoms = [...allSymptomCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topSideEffects = [...allSideEffectCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Insights</h1>
        <div className="card p-8 text-center animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Insights</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Discover patterns in your medication usage and outcomes.
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-3xl mb-2">📈</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Log some sessions to see insights here.
          </p>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-3">
            {topSymptoms.length > 0 && (
              <div className="card p-4">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Top Symptoms Targeted</h3>
                <div className="space-y-1.5">
                  {topSymptoms.map(([name, count]) => (
                    <div key={name} className="flex items-center justify-between">
                      <span className="text-xs text-slate-700 dark:text-slate-300 truncate">{name}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {topSideEffects.length > 0 && (
              <div className="card p-4">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Top Side Effects</h3>
                <div className="space-y-1.5">
                  {topSideEffects.map(([name, count]) => (
                    <div key={name} className="flex items-center justify-between">
                      <span className="text-xs text-slate-700 dark:text-slate-300 truncate">{name}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Sort by:</span>
            {(['overall', 'relief', 'value', 'sessions'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`chip text-[10px] ${sortBy === s ? 'chip-active' : 'chip-inactive'}`}
              >
                {s === 'overall' ? 'Overall' : s === 'relief' ? 'Relief' : s === 'value' ? 'Value' : 'Sessions'}
              </button>
            ))}
          </div>

          {/* Medication Insights */}
          <div className="space-y-3">
            {insights.map((insight, idx) => (
              <div key={insight.medicationName} className="card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-teal-600 dark:text-teal-400">#{idx + 1}</span>
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{insight.medicationName}</h3>
                    </div>
                    {insight.medicationBrand && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">{insight.medicationBrand}</p>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{insight.sessionCount} sessions</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <RatingDisplay rating={Math.round(insight.avgRelief)} label="" />
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Relief {insight.avgRelief}</p>
                  </div>
                  <div className="text-center">
                    <RatingDisplay rating={Math.round(insight.avgOverall)} label="" />
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Overall {insight.avgOverall}</p>
                  </div>
                  <div className="text-center">
                    <RatingDisplay rating={Math.round(insight.avgValue)} label="" />
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Value {insight.avgValue}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-green-600 dark:text-green-400">👍 {insight.wouldUseAgain.yes}</span>
                  <span className="text-yellow-600 dark:text-yellow-400">🤷 {insight.wouldUseAgain.maybe}</span>
                  <span className="text-red-600 dark:text-red-400">👎 {insight.wouldUseAgain.no}</span>
                </div>

                {insight.topSymptoms.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {insight.topSymptoms.map(s => (
                      <span key={s} className="chip chip-inactive text-[10px]">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}