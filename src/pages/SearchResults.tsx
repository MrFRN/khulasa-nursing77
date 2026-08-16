import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { fetchResources } from '../lib/api';
import { trackEvent } from '../lib/api';
import type { Resource } from '../types';
import ResourceCard from '../components/ResourceCard';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchResources({ search: query, limit: 48 })
      .then(({ data }) => setResults(data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center gap-3">
        <SearchIcon className="h-6 w-6 text-primary-500" />
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            نتائج البحث
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {loading ? 'جارٍ البحث...' : `${results.length} نتيجة لـ "${query}"`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="skeleton aspect-[4/3]" />
              <div className="p-4 space-y-2">
                <div className="skeleton h-4 rounded w-3/4" />
                <div className="skeleton h-3 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="py-20 text-center">
          <SearchIcon className="h-12 w-12 mx-auto text-neutral-300 dark:text-neutral-700 mb-4" />
          <p className="text-neutral-400 text-lg">لا توجد نتائج مطابقة</p>
          <Link to="/" className="mt-4 inline-block text-primary-600 hover:underline">
            العودة للرئيسية
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map((r, i) => (
            <ResourceCard key={r.id} resource={r} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
