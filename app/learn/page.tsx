import { getEducationalContent, getMetafieldValue } from '@/lib/cosmic';
import Link from 'next/link';

export default async function LearnPage() {
  const articles = await getEducationalContent();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Learn</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Educational resources about UK medical cannabis.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-3xl mb-2">📚</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">No articles available yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map(article => {
            const category = getMetafieldValue(article.metadata?.category);
            const source = getMetafieldValue(article.metadata?.source_name);
            const imageUrl = article.metadata?.hero_image?.imgix_url;
            const featured = article.metadata?.featured;

            return (
              <Link
                key={article.id}
                href={`/learn/${article.slug}`}
                className="card block overflow-hidden hover:shadow-md transition-shadow group"
              >
                {imageUrl && (
                  <div className="aspect-[3/1] bg-slate-100 dark:bg-slate-800">
                    <img
                      src={`${imageUrl}?w=600&h=200&fit=crop&auto=format,compress`}
                      alt={article.title}
                      width={600}
                      height={200}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {featured && (
                      <span className="chip bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px]">
                        ⭐ Featured
                      </span>
                    )}
                    {category && (
                      <span className="chip chip-inactive text-[10px]">{category}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {article.title}
                  </h3>
                  {source && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Source: {source}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}