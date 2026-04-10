import { getMedications, getSymptomTargets, getSideEffects, getMetafieldValue } from '@/lib/cosmic';
import LogSessionClient from '@/components/LogSessionClient';

export default async function LogPage() {
  const [medications, symptoms, sideEffects] = await Promise.all([
    getMedications(),
    getSymptomTargets(),
    getSideEffects(),
  ]);

  const medOptions = medications.map(m => ({
    id: m.id,
    slug: m.slug,
    name: getMetafieldValue(m.metadata?.product_name) || m.title,
    brand: getMetafieldValue(m.metadata?.brand),
  }));

  const symptomOptions = symptoms.map(s => ({
    value: getMetafieldValue(s.metadata?.symptom_name) || s.title,
    label: getMetafieldValue(s.metadata?.symptom_name) || s.title,
    emoji: getMetafieldValue(s.metadata?.icon_emoji),
  }));

  const sideEffectOptions = sideEffects.map(se => ({
    value: getMetafieldValue(se.metadata?.effect_name) || se.title,
    label: getMetafieldValue(se.metadata?.effect_name) || se.title,
    emoji: getMetafieldValue(se.metadata?.icon_emoji),
  }));

  return (
    <LogSessionClient
      medications={medOptions}
      symptomOptions={symptomOptions}
      sideEffectOptions={sideEffectOptions}
    />
  );
}