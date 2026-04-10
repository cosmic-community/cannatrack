'use client';

export default function ChipSelect({
  options,
  selected,
  onChange,
  label,
}: {
  options: { value: string; label: string; emoji?: string }[];
  selected: string[];
  onChange: (vals: string[]) => void;
  label: string;
}) {
  function toggle(val: string) {
    if (selected.includes(val)) {
      onChange(selected.filter(v => v !== val));
    } else {
      onChange([...selected, val]);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map(opt => {
          const isActive = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`chip ${isActive ? 'chip-active' : 'chip-inactive'}`}
              role="checkbox"
              aria-checked={isActive}
            >
              {opt.emoji && <span>{opt.emoji}</span>}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}