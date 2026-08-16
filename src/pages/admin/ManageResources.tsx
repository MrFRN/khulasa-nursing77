import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CreditCard as Edit, Trash2, Plus, Search, Eye, EyeOff, Star, TrendingUp } from 'lucide-react';
import type { Resource } from '../../types';
import { adminFetchResources, adminDeleteResource, adminUpdateResource } from '../../lib/api';
import { formatDate, formatNumber } from '../../lib/format';
import { RESOURCE_STATUS_LABELS } from '../../lib/constants';

export default function ManageResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');

  const PAGE_SIZE = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, count } = await adminFetchResources({
        section: sectionFilter || undefined,
        status: statusFilter || undefined,
        search: search || undefined,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      });
      setResources(data);
      setTotal(count);
    } catch {
      setResources([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sectionFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`هل تريد حذف "${title}"؟`)) return;
    try {
      await adminDeleteResource(id);
      load();
    } catch (err) {
      alert('فشل الحذف');
    }
  };

  const toggleFeatured = async (r: Resource) => {
    try {
      await adminUpdateResource(r.id, { featured: !r.featured });
      load();
    } catch {
      alert('فشل التحديث');
    }
  };

  const togglePopular = async (r: Resource) => {
    try {
      await adminUpdateResource(r.id, { popular: !r.popular });
      load();
    } catch {
      alert('فشل التحديث');
    }
  };

  const toggleStatus = async (r: Resource) => {
    const newStatus = r.status === 'published' ? 'draft' : 'published';
    try {
      await adminUpdateResource(r.id, { status: newStatus });
      load();
    } catch {
      alert('فشل التحديث');
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const statusColors: Record<string, string> = {
    published: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
    draft: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
    scheduled: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary-500" />
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">إدارة الملفات</h1>
        </div>
        <Link
          to="/admin/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          رفع ملف
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="بحث..."
            className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-2 pr-9 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={sectionFilter}
          onChange={(e) => { setSectionFilter(e.target.value); setPage(0); }}
          className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
        >
          <option value="">كل الأقسام</option>
          <option value="study">ملفات دراسية</option>
          <option value="books">كتب</option>
          <option value="interview">انترفيو</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
        >
          <option value="">كل الحالات</option>
          <option value="published">منشور</option>
          <option value="draft">مسودة</option>
          <option value="scheduled">مجدول</option>
        </select>
      </div>

      <p className="mb-4 text-sm text-neutral-500">{total} ملف</p>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="py-20 text-center text-neutral-400">لا توجد ملفات</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-500">
              <tr>
                <th className="px-4 py-3 text-right font-medium">العنوان</th>
                <th className="px-4 py-3 text-right font-medium hidden sm:table-cell">القسم</th>
                <th className="px-4 py-3 text-right font-medium">الحالة</th>
                <th className="px-4 py-3 text-right font-medium hidden md:table-cell">تحميلات</th>
                <th className="px-4 py-3 text-right font-medium hidden lg:table-cell">التاريخ</th>
                <th className="px-4 py-3 text-center font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 bg-white dark:bg-neutral-900">
              {resources.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900 dark:text-neutral-100 line-clamp-1">{r.title}</div>
                    {r.subject && <div className="text-xs text-neutral-400">{r.subject}</div>}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-neutral-500">
                    {r.section === 'study' ? 'دراسية' : r.section === 'books' ? 'كتب' : 'انترفيو'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[r.status]}`}>
                      {RESOURCE_STATUS_LABELS[r.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-neutral-500">
                    {formatNumber(r.download_count)}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-neutral-400 text-xs">
                    {formatDate(r.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => toggleFeatured(r)}
                        className={`rounded-lg p-1.5 transition-colors ${r.featured ? 'text-accent-500' : 'text-neutral-400 hover:text-accent-500'}`}
                        title="مميز"
                      >
                        <Star className={`h-4 w-4 ${r.featured ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => togglePopular(r)}
                        className={`rounded-lg p-1.5 transition-colors ${r.popular ? 'text-success-500' : 'text-neutral-400 hover:text-success-500'}`}
                        title="شائع"
                      >
                        <TrendingUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleStatus(r)}
                        className="rounded-lg p-1.5 text-neutral-400 hover:text-primary-500 transition-colors"
                        title={r.status === 'published' ? 'إلغاء النشر' : 'نشر'}
                      >
                        {r.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <Link
                        to={`/resource/${r.id}`}
                        className="rounded-lg p-1.5 text-neutral-400 hover:text-primary-500 transition-colors"
                        title="عرض"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(r.id, r.title)}
                        className="rounded-lg p-1.5 text-neutral-400 hover:text-error-500 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="rounded-lg px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 disabled:opacity-30 text-sm"
          >
            السابق
          </button>
          <span className="text-sm text-neutral-500">{page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-lg px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 disabled:opacity-30 text-sm"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}
