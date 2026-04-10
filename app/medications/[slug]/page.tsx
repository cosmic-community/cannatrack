// app/medications/[slug]/page.tsx
import { getMedication, getMetafieldValue } from '@/lib/cosmic';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function MedicationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const medication = await getMedication(slug);

  if (!medication) return notFound();

  const meta = medication.metadata;
  const productName = getMetafieldValue(meta?.product_name) || medication.title;
  const brand = getMetafieldValue(meta?.brand);
  const strainType = getMetafieldValue(meta?.strain_type);
  const thc = getMetafieldValue(meta?.thc_percentage);
  const cbd = getMetafieldValue(meta?.cbd_percentage);
  const price = getMetafieldValue(meta?.price_per_unit);
  const unit = getMetafieldValue(meta?.unit_size);
  const category = getMetafieldValue(meta?.category);
  const terpenes = getMetafieldValue(meta?.terpene_profile);
  const cultivar = getMetafieldValue(meta?.cultivar_name);
  const formulary = getMetafieldValue(meta?.formulary_availability);
  const medbud = getMetafieldValue(meta?.medbud_link);
  const description = getMetafieldValue(meta?.description);
  const imageUrl = meta?.product_image?.imgix_url;

  return (
    <div className="space-y-6">
      <Link href="/medications" className="inline-flex items-center gap-1 text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline">
        ← Back to Medications
      </Link>

      <div className="card overflow-hidden">
        {imageUrl && (
          <div className="aspect-video bg-slate-100 dark:bg-slate-800">
            <img
              src={`${imageUrl}?w=800&h=450&fit=crop&auto=format,compress`}
              alt={productName}
              width={800}
              height={450}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-5 space-y-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{productName}</h1>
            {brand && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{brand}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            {strainType && (
              <span className="chip chip-inactive">{strainType}</span>
            )}
            {category && (
              <span className="chip bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">{category}</span>
            )}
            {formulary && (
              <span className="chip bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{formulary}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {thc && (
              <div className="card p-3 text-center">
                <p className="text-lg font-bold text-slate-900 dark:text-white">{thc}%</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">THC</p>
              </div>
            )}
            {cbd && (
              <div className="card p-3 text-center">
                <p className="text-lg font-bold text-slate-900 dark:text-white">{cbd}%</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">CBD</p>
              </div>
            )}
          </div>

          {price && unit && (
            <div className="card p-3 bg-slate-50 dark:bg-slate-800 border-0">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                £{price} per {unit}
              </p>
            </div>
          )}

          {cultivar && (
            <div>
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Cultivar</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">{cultivar}</p>
            </div>
          )}

          {terpenes && (
            <div>
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Terpene Profile</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">{terpenes}</p>
            </div>
          )}

          {description && (
            <div>
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Description</h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{description}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {medbud && (
              <a
                href={medbud}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 text-center"
              >
                View on MedBud UK →
              </a>
            )}
            <Link href={`/log?med=${medication.slug}`} className="btn-secondary flex-1 text-center">
              📝 Log Session
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}