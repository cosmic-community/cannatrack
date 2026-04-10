import { getMedications, getAppSettings, getMetafieldValue } from '@/lib/cosmic';
import DashboardClient from '@/components/DashboardClient';

export default async function DashboardPage() {
  const [medications, settings] = await Promise.all([
    getMedications(),
    getAppSettings(),
  ]);

  const appName = settings ? getMetafieldValue(settings.metadata?.app_name) || 'CannaTrack' : 'CannaTrack';
  const tagline = settings ? getMetafieldValue(settings.metadata?.tagline) || 'Your medication tracking journal' : 'Your medication tracking journal';

  const medicationOptions = medications.map(m => ({
    id: m.id,
    slug: m.slug,
    name: getMetafieldValue(m.metadata?.product_name) || m.title,
    brand: getMetafieldValue(m.metadata?.brand),
  }));

  return <DashboardClient appName={appName} tagline={tagline} medications={medicationOptions} />;
}