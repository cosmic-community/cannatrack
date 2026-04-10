'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { saveSession } from '@/lib/db';
import type { Session } from '@/types';
import RatingInput from '@/components/RatingInput';
import ChipSelect from '@/components/ChipSelect';

interface MedOption {
  id: string;
  slug: string;
  name: string;
  brand: string;
}
interface ChipOption {
  value: string;
  label: string;
  emoji?: string;
}

export default function LogSessionClient({
  medications,
  symptomOptions,
  sideEffectOptions,
}: {
  medications: MedOption[];
  symptomOptions: ChipOption[];
  sideEffectOptions: ChipOption[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedMed = searchParams.get('med') || '';

  const initialMed = medications.find(m => m.slug === preselectedMed);

  const [medicationSlug, setMedicationSlug] = useState(initialMed?.slug || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0] || '');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [dose, setDose] = useState('');
  const [intakeMethod, setIntakeMethod] = useState('');
  const [symptomsTargeted, setSymptomsTargeted] = useState<string[]>([]);
  const [sideEffectsExperienced, setSideEffectsExperienced] = useState<string[]>([]);
  const [reliefRating, setReliefRating] = useState(0);
  const [overallRating, setOverallRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);
  const [wouldUseAgain, setWouldUseAgain] = useState<'yes' | 'no' | 'maybe' | ''>('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectedMed = medications.find(m => m.slug === medicationSlug);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMed || !date || reliefRating === 0 || overallRating === 0) return;

    setSaving(true);
    const session: Session = {
      id: crypto.randomUUID(),
      medicationId: selectedMed.id,
      medicationName: selectedMed.name,
      medicationBrand: selectedMed.brand,
      date,
      timeOfDay,
      dose,
      intakeMethod,
      symptomsTargeted,
      sideEffectsExperienced,
      reliefRating,
      overallRating,
      valueRating,
      wouldUseAgain: (wouldUseAgain || 'maybe') as 'yes' | 'no' | 'maybe',
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveSession(session);
    setSaving(false);
    setSaved(true);
    setTimeout(() => router.push('/history'), 1500);
  }

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Session Logged</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Redirecting to history...</p>
      </div>
    );
  }

  const timeOptions = ['Morning', 'Afternoon', 'Evening', 'Night', 'Before bed'];
  const methodOptions = ['Vaporiser', 'Oil/Tincture', 'Capsule', 'Edible', 'Topical', 'Other'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Log Session</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Record your medication use and outcome.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Medication */}
        <div>
          <label htmlFor="medication" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Medication *
          </label>
          <select
            id="medication"
            value={medicationSlug}
            onChange={e => setMedicationSlug(e.target.value)}
            className="input-field"
            required
          >
            <option value="">Select medication...</option>
            {medications.map(m => (
              <option key={m.slug} value={m.slug}>
                {m.name} {m.brand ? `(${m.brand})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Date *
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="input-field"
            required
          />
        </div>

        {/* Time of Day */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Time of Day</label>
          <div className="flex flex-wrap gap-2">
            {timeOptions.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeOfDay(timeOfDay === t ? '' : t)}
                className={`chip ${timeOfDay === t ? 'chip-active' : 'chip-inactive'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Dose */}
        <div>
          <label htmlFor="dose" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Dose
          </label>
          <input
            id="dose"
            type="text"
            value={dose}
            onChange={e => setDose(e.target.value)}
            placeholder="e.g., 0.2g, 3 drops, 1 capsule"
            className="input-field"
          />
        </div>

        {/* Intake Method */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Intake Method</label>
          <div className="flex flex-wrap gap-2">
            {methodOptions.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setIntakeMethod(intakeMethod === m ? '' : m)}
                className={`chip ${intakeMethod === m ? 'chip-active' : 'chip-inactive'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        {symptomOptions.length > 0 && (
          <ChipSelect
            options={symptomOptions}
            selected={symptomsTargeted}
            onChange={setSymptomsTargeted}
            label="Symptoms Targeted"
          />
        )}

        {/* Side Effects */}
        {sideEffectOptions.length > 0 && (
          <ChipSelect
            options={sideEffectOptions}
            selected={sideEffectsExperienced}
            onChange={setSideEffectsExperienced}
            label="Side Effects Experienced"
          />
        )}

        {/* Ratings */}
        <RatingInput value={reliefRating} onChange={setReliefRating} label="Relief Rating *" />
        <RatingInput value={overallRating} onChange={setOverallRating} label="Overall Rating *" />
        <RatingInput value={valueRating} onChange={setValueRating} label="Value for Money" />

        {/* Would Use Again */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Would Use Again?</label>
          <div className="flex gap-2">
            {([['yes', '👍 Yes'], ['maybe', '🤷 Maybe'], ['no', '👎 No']] as const).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setWouldUseAgain(val)}
                className={`chip flex-1 justify-center ${wouldUseAgain === val ? 'chip-active' : 'chip-inactive'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="How did you feel? Any observations..."
            className="input-field resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving || !medicationSlug || !date || reliefRating === 0 || overallRating === 0}
          className="btn-primary w-full"
        >
          {saving ? 'Saving...' : '💾 Save Session'}
        </button>
      </form>
    </div>
  );
}