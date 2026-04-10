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
                    var root = document.documentElement;
                    var theme = localStorage.getItem('cannatrack-theme');
                    var isDark = theme === 'dark' || (!theme || theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (isDark) {
                      root.classList.add('dark');
                    }

                    var raw = localStorage.getItem('cannatrack-glass');
                    if (!raw) {
                      root.dataset.uiStyle = 'solid';
                      return;
                    }

                    function clamp(val, min, max) {
                      return Math.min(max, Math.max(min, val));
                    }

                    var settings = JSON.parse(raw) || {};
                    var style = settings.style || 'auto';
                    var effectiveStyle = style === 'auto' ? (isDark ? 'medium' : 'soft') : style;
                    root.dataset.uiStyle = effectiveStyle;
                    root.dataset.uiStylePreference = style;

                    var transparency = clamp(Number(settings.transparency) || 0, 0, 90);
                    var baseOpacity = Math.max(0.24, (100 - transparency) / 100);
                    var blur = clamp(Number(settings.blur) || (effectiveStyle === 'solid' ? 0 : 14), 0, 30);
                    var radius = clamp(Number(settings.radius) || 18, 10, 30);
                    var shadow = clamp(Number(settings.shadow) || 16, 4, 32);
                    var glow = clamp(Number(settings.glow) || 8, 0, 24);
                    var tint = clamp(Number(settings.tint) || 30, 0, 100);
                    var border = clamp(Number(settings.border) || 40, 0, 100);

                    function safeOpacity(value, fallback) {
                      var rawVal = typeof value === 'number' && !Number.isNaN(value) ? value : fallback;
                      return Math.min(1, Math.max(baseOpacity, rawVal));
                    }

                    var buttonOpacity = safeOpacity(Number(settings.buttonOpacity), baseOpacity);
                    var cardOpacity = safeOpacity(Number(settings.cardOpacity), baseOpacity);
                    var navOpacity = safeOpacity(Number(settings.navOpacity), baseOpacity);
                    var popupOpacity = safeOpacity(Number(settings.popupOpacity), baseOpacity);
                    var tintBoost = baseOpacity < 0.35 ? 12 : 0;

                    var tintL = isDark
                      ? Math.max(10, Math.min(32, 12 + (tint + tintBoost) * 0.2))
                      : Math.max(70, Math.min(98, 98 - (tint + tintBoost) * 0.3));
                    var tintS = isDark ? 20 + tint * 0.25 : 28 + tint * 0.2;
                    var borderL = isDark ? 26 + border * 0.35 : 80 + border * 0.15;
                    var borderS = isDark ? 18 + border * 0.2 : 20 + border * 0.2;

                    root.style.setProperty('--glass-blur', blur + 'px');
                    root.style.setProperty('--glass-radius', radius + 'px');
                    root.style.setProperty('--glass-shadow', shadow + 'px');
                    root.style.setProperty('--glass-glow', glow + 'px');
                    root.style.setProperty('--glass-base-opacity', String(baseOpacity));
                    root.style.setProperty('--glass-button-opacity', String(buttonOpacity));
                    root.style.setProperty('--glass-card-opacity', String(cardOpacity));
                    root.style.setProperty('--glass-nav-opacity', String(navOpacity));
                    root.style.setProperty('--glass-popup-opacity', String(popupOpacity));
                    root.style.setProperty('--glass-overlay-opacity', baseOpacity < 0.35 ? '0.12' : '0.06');
                    root.style.setProperty('--glass-tint-h', isDark ? '220' : '210');
                    root.style.setProperty('--glass-tint-s', tintS + '%');
                    root.style.setProperty('--glass-tint-l', tintL + '%');
                    root.style.setProperty('--glass-border-h', isDark ? '220' : '210');
                    root.style.setProperty('--glass-border-s', borderS + '%');
                    root.style.setProperty('--glass-border-l', borderL + '%');
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