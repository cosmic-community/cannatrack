import SettingsClient from '@/components/SettingsClient';
import { getAppSettings, getMetafieldValue } from '@/lib/cosmic';

export default async function SettingsPage() {
  const settings = await getAppSettings();
  const privacyStatement = settings ? getMetafieldValue(settings.metadata?.privacy_statement) : '';

  return <SettingsClient privacyStatement={privacyStatement} />;
}