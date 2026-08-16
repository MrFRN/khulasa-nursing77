import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderTree, Plus, CreditCard as Edit2, Trash2, X } from 'lucide-react';
import type { NursingCategory, Section } from '../../types';
import { fetchCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '../../lib/api';

const ICON_OPTIONS = ['FileText', 'BookOpen', 'HelpCircle', 'Heart', 'Stethoscope', 'Brain', 'Pill', 'Activity', 'Baby', 'Syringe', 'ClipboardList', 'FlaskConical'];

export default function Categories() {
  const [categories, setCategories] = useState<NursingCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<NursingCategory | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', section: 'study' as Section, icon: 'FileText', sort: 0 });

  const load = () => {
    setLoading(true);
    fetchCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', slug: '', section: 'study', icon: 'FileText', sort: 0 });
    setShowForm(true);
  };

  const openEdit = (cat: NursingCategory) => {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, section: cat.section, icon: cat.icon || 'FileText', sort: cat.sort });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await adminUpdateCategory(editing.id, form);
      } else {
        await adminCreateCategory(form);
      }
      setShowForm(false);
      load();
    } catch (err: any) {
      alert('فشل الحفظ: ' + (err.message || ''));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`حذف تصنيف "${name}"؟`)) return;
    try {
      await adminDeleteCategory(id);
      load();
    } catch {
      alert('فشل الحذف');
    }
  };

  const grouped = ['study', 'books', 'interview'].map((s) => ({
    section: s,
    label: s === 'study' ? 'ملفات دراسية' : s === 'books' ? 'كتب' : 'انترفيو',
    items: categories.filter((c) => c.section === s).sort((a, b) => a.sort - b.sort),
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderTree className="h-6 w-6 text-primary-500" />
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">التصنيفات</h1>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          إضافة تصنيف
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-14 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map((g) => (
            <div key={g.section}>
              <h2 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-3">{g.label}</h2>
              {g.items.length === 0 ? (
                <p className="text-sm text-neutral-400 py-4">لا توجد تصنيفات</p>
              ) : (
                <div className="space-y-2">
                  {g.items.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-neutral-400">{cat.icon}</span>
                        <div>
                          <div className="font-medium text-neutral-900 dark:text-neutral-100">{cat.name}</div>
                          <div className="text-xs text-neutral-400">{cat.slug}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(cat)}
                          className="rounded-lg p-1.5 text-neutral-400 hover:text-primary-500 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="rounded-lg p-1.5 text-neutral-400 hover:text-error-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                  {editing ? 'تعديل تصنيف' : 'تصنيف جديد'}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-neutral-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">الاسم</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">المعرّف (slug)</label>
                  <input
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ltr:text-left"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">القسم</label>
                  <select
                    value={form.section}
                    onChange={(e) => setForm({ ...form, section: e.target.value as Section })}
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="study">ملفات دراسية</option>
                    <option value="books">كتب</option>
                    <option value="interview">انترفيو</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">الأيقونة</label>
                  <select
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {ICON_OPTIONS.map((ic) => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">الترتيب</label>
                  <input
                    type="number"
                    value={form.sort}
                    onChange={(e) => setForm({ ...form, sort: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                  >
                    {editing ? 'حفظ' : 'إضافة'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-6 py-2.5 text-sm font-semibold text-neutral-600 dark:text-neutral-300"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
