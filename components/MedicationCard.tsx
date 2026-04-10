import Link from 'next/link';
import { getMetafieldValue } from '@/lib/cosmic';
import type { Medication } from '@/types';

export default function MedicationCard({ medication }: { medication: Medication }) {
  const meta = medication.metadata;
  const productName = getMetafieldValue(meta?.product_name) || medication.title;
  const brand = getMetafieldValue(meta?.brand);
  const strainType = getMetafieldValue(meta?.strain_type);
  const thc = getMetafieldValue(meta?.thc_percentage);
  const cbd = getMetafieldValue(meta?.cbd_percentage);
  const price = getMetafieldValue(meta?.price_per_unit);
  const unit = getMetafieldValue(meta?.unit_size);
  const category = getMetafieldValue(meta?.category);
  const imageUrl = meta?.product_image?.imgix_url;

  return (
    <Link href={`/medications/${medication.slug}`} className="card block p-4 hover:shadow-md transition-shadow group">
      <div className="flex gap-4">
        {imageUrl ? (
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
            <img
              src={`${imageUrl}?w=128&h=128&fit=crop&auto=format,compress`}
              alt={productName}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">💊</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {productName}
          </h3>
          {brand && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{brand}</p>
          )}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {strainType && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                {strainType}
              </span>
            )}
            {category && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-900/30 text-[10px] font-medium text-teal-700 dark:text-teal-300">
                {category}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {thc && <span>THC: {thc}%</span>}
            {cbd && <span>CBD: {cbd}%</span>}
            {price && unit && <span className="ml-auto font-medium text-slate-700 dark:text-slate-300">£{price}/{unit}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}