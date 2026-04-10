export default function RatingDisplay({ rating, max = 5, label }: { rating: number; max?: number; label?: string }) {
  return (
    <div className="flex items-center gap-1.5" role="img" aria-label={label ? `${label}: ${rating} out of ${max}` : `${rating} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${
            i < rating ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-700'
          }`}
        />
      ))}
      {label && <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">{label}</span>}
    </div>
  );
}