// app/learn/[slug]/page.tsx
import { getEducationalArticle, getMetafieldValue } from '@/lib/cosmic';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getEducationalArticle(slug);

  if (!article) return notFound();

  const category = getMetafieldValue(article.metadata?.category);
  const source = getMetafieldValue(article.metadata?.source_name);
  const sourceUrl = getMetafieldValue(article.metadata?.source_url);
  const contentHtml = getMetafieldValue(article.metadata?.content) || article.content || '';
  const imageUrl = article.metadata?.hero_image?.imgix_url;

  return (
    <div className="space-y-6">
      <Link href="/learn" className="inline-flex items-center gap-1 text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline">
        ← Back to Articles
      </Link>

      <article className="card overflow-hidden">
        {imageUrl && (
          <div className="aspect-[2/1] bg-slate-100 dark:bg-slate-800">
            <img
              src={`${imageUrl}?w=800&h=400&fit=crop&auto=format,compress`}
              alt={article.title}
              width={800}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-5 space-y-4">
          {category && (
            <span className="chip chip-inactive text-[10px]">{category}</span>
          )}
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{article.title}</h1>

          {contentHtml && (
            <div
              className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          )}

          {source && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Source: {sourceUrl ? (
                  <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 underline">
                    {source}
                  </a>
                ) : source}
              </p>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}