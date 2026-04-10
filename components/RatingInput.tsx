'use client';

export default function RatingInput({
  value,
  onChange,
  max = 5,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
  label: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
      <div className="flex gap-2" role="radiogroup" aria-label={label}>
        {Array.from({ length: max }, (_, i) => {
          const val = i + 1;
          const isActive = val <= value;
          return (
            <button
              key={val}
              type="button"
              onClick={() => onChange(val)}
              className={`w-10 h-10 rounded-xl text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                isActive
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
              }`}
              role="radio"
              aria-checked={val === value}
              aria-label={`${val} out of ${max}`}
            >
              {val}
            </button>
          );
        })}
      </div>
    </div>
  );
}