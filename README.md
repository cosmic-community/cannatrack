# CannaTrack UK 🏥

A production-quality, mobile-first medical cannabis patient tracking application for UK prescription patients. Built with Next.js 16 and Cosmic CMS for reference data, with all personal session data stored privately on-device using IndexedDB.

## Features

- 📊 **Smart Dashboard** — Recent sessions, top medications, outcomes at a glance
- 💊 **Medication Library** — Browse medications with THC/CBD, terpenes, pricing, MedBud links
- 📝 **Session Logging** — Track intake, dose, symptoms, side effects, relief, and notes
- 📈 **Insights** — Discover what works best by symptom, time of day, and value
- 🔒 **Privacy-First** — All personal data stays on your device via IndexedDB
- 📤 **Data Portability** — Export/import JSON, CSV export, full data deletion
- 📚 **Educational Content** — CMS-managed articles on UK medical cannabis
- 🌙 **Dark/Light Mode** — System-aware theme switching
- ♿ **Accessible** — WCAG-compliant, keyboard navigable, screen reader friendly
- 📱 **Mobile-First** — Bottom tab nav, one-handed use, 320px+ responsive

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=69d94ec315bc182ad495534e&clone_repository=69d950cd15bc182ad495536b)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create content models for: Build a production-quality, mobile-first, installable-feeling single-page web app for UK medical cannabis patients that runs entirely in the browser and saves all user data locally on the user's own device, giving the patient full control over their information. The app must be polished, accessible, easy to navigate, and easy to use one-handed on a phone. It should feel like a serious health-tracking tool rather than a generic cannabis lifestyle app. Use plain, calm, medical-friendly language throughout. The application is for legal prescription medical cannabis patients in the UK and should support structured tracking of medication, sessions, outcomes, side effects, value, and quality notes. The app's core purpose is to help a patient answer questions like: Which products worked best for my symptoms Which strains or brands caused anxiety, paranoia, dry mouth, sedation, pain relief, appetite effects, etc. Which products were best value Which terpene/cannabinoid profiles seemed to suit me Which medications I would or would not use again How different products compared over time, by dose, by time of day, and by symptom target Use MedBud UK as a primary medication reference source and design the app so it can integrate with or guide users to its data, especially because MedBud provides UK private-prescription cannabis product listings, flower/strain information, pricing, THC/CBD values, terpene details, and formulary-level availability data. Also account for secondary UK-relevant sources for research and optional outbound linking: Weedstrain UK medical strains for cultivar-level overview data and patient-facing strain descriptions. Curaleaf Clinic formulary/glossary content as a clinic-side reference for what a formulary is and how clinic product lists work. Clinic education pages such as Alternaleaf or Cannabis Access Clinics only as secondary educational references, not as the main structured dataset. Do not make the app depend on a backend. It must function as a static HTML/CSS/JS web app. Core product goals Create an app that is: Private-first: all patient entries stored locally on-device by default. Fast and offline-friendly: core features should still work without internet once loaded. Simple but deep: easy for quick logging, but rich enough for long-term pattern tracking. Medical-friendly: symptom-focused, side-effect-aware, non-stoner branding, supportive tone. UK-specific: terminology and workflows should fit UK medical cannabis patients and UK product discovery. User-controlled: easy import/export/backup/delete of all data. Technical requirements Build as a single static HTML file with embedded or linked CSS/JS if needed, but keep it simple to deploy. Do not require any server, authentication system, or cloud database. Storage Use the browser for local persistence, with this priority: IndexedDB for primary structured storage graceful fallback to localStorage only if needed for smaller settings clear data portability tools: export/import JSON optional CSV export for entries and summaries The user must be able to: Export all data Import previously exported data Permanently delete all data Delete individual records Edit existing records Duplicate a previous record as a template for a new session Privacy Include a clear privacy statement in the UI: Data stays on the device unless the user exports it No account required No analytics No hidden syncing Images remain local unless exported by the user Performance Must be lightweight and quick on mobile Responsive from 320px upward Smooth on mid-range Android phones and iPhones Lazy-load images and compress previews when storing photos locally if possible Accessibility WCAG-minded contrast Large tap targets Clear labels Keyboard accessible Good screen-reader structure Reduced-motion support Simple language options in microcopy Design direction Design a calm, trustworthy, modern patient experience. Avoid stereotypical green neon cannabis aesthetics. The app should feel closer to a high-quality symptom journal or medication management tool than a recreational weed app. Visual style Soft neutral base palette One restrained accent color Excellent readability Rounded but not childish UI High information clarity Clean card-based layout Mobile tab bar or segmented navigation Dark mode and light mode Optional system-theme detection Tone Use language like: Medication Product Session Relief Side effects Notes Outcome Would use again Avoid language like: Dank Fire Stash Blazed Recreational slang Main app structure Design the app with these primary sections: Dashboard Medication Library Log Intake / Session History Insights Photos Backup & Settings Use a bottom nav on mobile and a sidebar or top nav on larger screens. Feature requirements Dashboard The home screen should quickly answer: What medication am I currently using What have I logged recently Which products are helping most Which products caused the worst side effects Current stock / active meds Average value rati"

### Code Generation Prompt

> "Build a production-quality, mobile-first, installable-feeling single-page web app for UK medical cannabis patients that runs entirely in the browser and saves all user data locally on the user's own device, giving the patient full control over their information. The app must be polished, accessible, easy to navigate, and easy to use one-handed on a phone. It should feel like a serious health-tracking tool rather than a generic cannabis lifestyle app. Use plain, calm, medical-friendly language throughout. The application is for legal prescription medical cannabis patients in the UK and should support structured tracking of medication, sessions, outcomes, side effects, value, and quality notes."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- [Next.js 16](https://nextjs.org/) — React framework with App Router
- [Cosmic CMS](https://www.cosmicjs.com/docs) — Headless CMS for reference data
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) — Type-safe development
- [IndexedDB (idb)](https://github.com/jakearchibald/idb) — On-device structured storage
- [Inter Font](https://fonts.google.com/specimen/Inter) — Modern, readable typeface

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) runtime installed
- A Cosmic CMS account with the CannaTrack content bucket

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd cannatrack-uk

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Cosmic credentials

# Run development server
bun dev
```

## Cosmic SDK Examples

```typescript
import { createBucketClient } from '@cosmicjs/sdk'

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Fetch medications
const { objects: medications } = await cosmic.objects
  .find({ type: 'medications' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Fetch single medication
const { object: medication } = await cosmic.objects
  .findOne({ type: 'medications', slug: 'product-slug' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)
```

## Cosmic CMS Integration

This app uses the following Cosmic object types:
- **App Settings** — Global configuration, privacy statement, default lists
- **Medications** — Product library with THC/CBD, terpenes, pricing
- **Symptom Targets** — Configurable symptoms for session logging
- **Side Effects** — Categorised adverse reactions
- **Educational Content** — Articles and guides

## Deployment Options

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables: `COSMIC_BUCKET_SLUG`, `COSMIC_READ_KEY`, `COSMIC_WRITE_KEY`
4. Deploy

### Netlify
1. Push your code to GitHub
2. Import in [Netlify](https://netlify.com)
3. Set build command: `bun run build`
4. Set publish directory: `.next`
5. Add environment variables
6. Deploy
<!-- README_END -->