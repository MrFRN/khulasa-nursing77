import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { getFavorites } from '../lib/favorites';
import { fetchResourceById } from '../lib/api';
import type { Resource } from '../types';
import ResourceCard from '../components/ResourceCard';

export default function Favorites() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = getFavorites();
    if (ids.length === 0) {
      setResources([]);
      setLoading(false);
      return;
    }
    Promise.all(ids.map((id) => fetchResourceById(id)))
      .then((data) => setResources(data.filter((r): r is Resource => r !== null)))
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center gap-3">
        <Heart className="h-6 w-6 text-error-500" />
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">المفضلة</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {loading ? 'جارٍ التحميل...' : `${resources.length} ملف`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="skeleton aspect-[4/3]" />
              <div className="p-4 space-y-2">
                <div className="skeleton h-4 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="py-20 text-center">
          <Heart className="h-12 w-12 mx-auto text-neutral-300 dark:text-neutral-700 mb-4" />
          <p className="text-neutral-400 text-lg">لا توجد ملفات في المفضلة</p>
          <Link to="/" className="mt-4 inline-block text-primary-600 hover:underline">
            تصفح الملفات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {resources.map((r, i) => (
            <ResourceCard key={r.id} resource={r} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
