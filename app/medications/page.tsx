import { getMedications } from '@/lib/cosmic';
import MedicationCard from '@/components/MedicationCard';

export default async function MedicationsPage() {
  const medications = await getMedications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Medication Library</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Browse available products. Tap for details and MedBud UK links.
        </p>
      </div>

      {medications.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-3xl mb-2">💊</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">No medications found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {medications.map(med => (
            <MedicationCard key={med.id} medication={med} />
          ))}
        </div>
      )}
    </div>
  );
}