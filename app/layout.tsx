import type { Metadata } from 'next';
import './globals.css';
import { getAppSettings } from '@/lib/cosmic';
import { getMetafieldValue } from '@/lib/cosmic';
import AppShell from '@/components/AppShell';
import CosmicBadge from '@/components/CosmicBadge';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAppSettings();
  const appName = settings ? getMetafieldValue(settings.metadata?.app_name) || 'CannaTrack' : 'CannaTrack';
  const tagline = settings ? getMetafieldValue(settings.metadata?.tagline) || 'UK Medical Cannabis Patient Tracker' : 'UK Medical Cannabis Patient Tracker';

  return {
    title: `${appName} — ${tagline}`,
    description: tagline,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getAppSettings();
  const appName = settings ? getMetafieldValue(settings.metadata?.app_name) || 'CannaTrack' : 'CannaTrack';
  const privacyStatement = settings ? getMetafieldValue(settings.metadata?.privacy_statement) : '';
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏥</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script src="/dashboard-console-capture.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('cannatrack-theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <AppShell appName={appName} privacyStatement={privacyStatement}>
          {children}
        </AppShell>
        <CosmicBadge bucketSlug={bucketSlug} />
      </body>
    </html>
  );
}