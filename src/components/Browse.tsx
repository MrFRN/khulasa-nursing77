import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import ResourceCard from './ResourceCard';
import type { Resource, NursingCategory } from '../types';
import { fetchResources, fetchCategories } from '../lib/api';
import { PAGE_SIZE } from '../lib/constants';

interface BrowseProps {
  section: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function Browse({ section, title, subtitle, icon }: BrowseProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<NursingCategory[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('created_at');

  useEffect(() => {
    fetchCategories(section).then(setCategories).catch(() => {});
  }, [section]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, count } = await fetchResources({
        section,
        category: selectedCategory || undefined,
        search: search || undefined,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        orderBy: sortBy,
        ascending: sortBy === 'title',
      });
      setResources(data);
      setTotal(count);
    } catch {
      setResources([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [section, selectedCategory, search, page, sortBy]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    load();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{title}</h1>
          {subtitle && <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{subtitle}</p>}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في هذا القسم..."
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-3 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setSelectedCategory(''); setPage(0); }}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.slug); setPage(0); }}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {cat.name}
            </button>
          ))}

          <div className="mr-auto flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-neutral-400" />
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
              className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="created_at">الأحدث</option>
              <option value="download_count">الأكثر تحميلًا</option>
              <option value="title">العنوان (أبجديًا)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
        {loading ? 'جارٍ التحميل...' : `${total} ملف`}
      </p>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="skeleton aspect-[4/3]" />
              <div className="p-4 space-y-2">
                <div className="skeleton h-4 rounded w-3/4" />
                <div className="skeleton h-3 rounded w-full" />
                <div className="skeleton h-3 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-neutral-400 text-lg">لا توجد ملفات في هذا القسم بعد</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {resources.map((r, i) => (
            <ResourceCard key={r.id} resource={r} index={i} />
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="rounded-lg p-2 border border-neutral-200 dark:border-neutral-700 disabled:opacity-30 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <ChevronRight className="h-5 w-5 rtl-flip" />
          </button>
          <span className="text-sm text-neutral-500">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-lg p-2 border border-neutral-200 dark:border-neutral-700 disabled:opacity-30 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 rtl-flip" />
          </button>
        </div>
      )}
    </div>
  );
}
