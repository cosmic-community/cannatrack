import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Session } from '@/types';

interface CannaTrackDB extends DBSchema {
  sessions: {
    key: string;
    value: Session;
    indexes: {
      'by-date': string;
      'by-medication': string;
    };
  };
  settings: {
    key: string;
    value: { key: string; value: string };
  };
}

let dbPromise: Promise<IDBPDatabase<CannaTrackDB>> | null = null;

function getDB(): Promise<IDBPDatabase<CannaTrackDB>> {
  if (!dbPromise) {
    dbPromise = openDB<CannaTrackDB>('cannatrack-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
          sessionStore.createIndex('by-date', 'date');
          sessionStore.createIndex('by-medication', 'medicationId');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllSessions(): Promise<Session[]> {
  const db = await getDB();
  const sessions = await db.getAll('sessions');
  return sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getSession(id: string): Promise<Session | undefined> {
  const db = await getDB();
  return db.get('sessions', id);
}

export async function saveSession(session: Session): Promise<void> {
  const db = await getDB();
  await db.put('sessions', session);
}

export async function deleteSession(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('sessions', id);
}

export async function deleteAllSessions(): Promise<void> {
  const db = await getDB();
  await db.clear('sessions');
}

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDB();
  const result = await db.get('settings', key);
  return result?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDB();
  await db.put('settings', { key, value });
}

export async function exportAllData(): Promise<string> {
  const db = await getDB();
  const sessions = await db.getAll('sessions');
  const settings = await db.getAll('settings');
  return JSON.stringify({ sessions, settings, exportedAt: new Date().toISOString(), version: 1 }, null, 2);
}

export async function importData(jsonString: string): Promise<{ sessionsImported: number }> {
  const data = JSON.parse(jsonString) as { sessions?: Session[]; settings?: { key: string; value: string }[] };
  const db = await getDB();
  let sessionsImported = 0;

  if (data.sessions && Array.isArray(data.sessions)) {
    const tx = db.transaction('sessions', 'readwrite');
    for (const session of data.sessions) {
      await tx.store.put(session);
      sessionsImported++;
    }
    await tx.done;
  }

  if (data.settings && Array.isArray(data.settings)) {
    const tx = db.transaction('settings', 'readwrite');
    for (const setting of data.settings) {
      await tx.store.put(setting);
    }
    await tx.done;
  }

  return { sessionsImported };
}

export async function clearAllData(): Promise<void> {
  const db = await getDB();
  await db.clear('sessions');
  await db.clear('settings');
}

export function sessionsToCSV(sessions: Session[]): string {
  if (sessions.length === 0) return '';
  const headers = [
    'Date', 'Time of Day', 'Medication', 'Brand', 'Dose', 'Intake Method',
    'Symptoms Targeted', 'Side Effects', 'Relief Rating', 'Overall Rating',
    'Value Rating', 'Would Use Again', 'Notes'
  ];
  const rows = sessions.map(s => [
    s.date,
    s.timeOfDay,
    s.medicationName,
    s.medicationBrand,
    s.dose,
    s.intakeMethod,
    s.symptomsTargeted.join('; '),
    s.sideEffectsExperienced.join('; '),
    String(s.reliefRating),
    String(s.overallRating),
    String(s.valueRating),
    s.wouldUseAgain,
    `"${s.notes.replace(/"/g, '""')}"`,
  ]);
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}