import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CloudUpload as UploadCloud, FileText, X, CircleCheck as CheckCircle } from 'lucide-react';
import type { Section, ResourceStatus } from '../../types';
import { fetchCategories, adminCreateResource, uploadFile } from '../../lib/api';
import { getFileType } from '../../lib/filetypes';
import { formatFileSize } from '../../lib/format';

export default function Upload() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    section: 'study' as Section,
    category: '',
    year: '',
    subject: '',
    author: '',
    edition: '',
    tags: '',
    status: 'published' as ResourceStatus,
    featured: false,
    popular: false,
  });

  useEffect(() => {
    fetchCategories(form.section).then(setCategories).catch(() => {});
  }, [form.section]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      if (!form.title) {
        setForm((f) => ({ ...f, title: selected.name.replace(/\.[^.]+$/, '') }));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      if (!form.title) {
        setForm((f) => ({ ...f, title: dropped.name.replace(/\.[^.]+$/, '') }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('الرجاء اختيار ملف');
      return;
    }
    setUploading(true);
    setProgress(0);
    try {
      const ext = file.name.split('.').pop();
      const filePath = `${form.section}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      setProgress(30);
      const { path, publicUrl } = await uploadFile('files', filePath, file, (p) => setProgress(30 + p * 0.4));
      setProgress(70);

      const tags = form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await adminCreateResource({
        title: form.title,
        description: form.description || null,
        section: form.section,
        category: form.category || null,
        year: form.year || null,
        subject: form.subject || null,
        author: form.author || null,
        edition: form.edition || null,
        tags,
        file_name: file.name,
        file_path: path,
        file_url: publicUrl,
        file_size: file.size,
        file_type: getFileType(file.name),
        status: form.status,
        featured: form.featured,
        popular: form.popular,
      });

      setProgress(100);
      setSuccess(true);
      setTimeout(() => navigate('/admin/resources'), 1500);
    } catch (err: any) {
      alert('فشل الرفع: ' + (err.message || 'خطأ غير معروف'));
    } finally {
      setUploading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
          <CheckCircle className="h-16 w-16 mx-auto text-success-500 mb-4" />
        </motion.div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">تم رفع الملف بنجاح</h2>
        <p className="text-sm text-neutral-400 mt-2">جارٍ التحويل لقائمة الملفات...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center gap-3">
        <UploadCloud className="h-6 w-6 text-primary-500" />
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">رفع ملف</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById('file-input')?.click()}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 p-8 text-center hover:border-primary-400 transition-colors"
        >
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="h-8 w-8 text-primary-500" />
              <div className="text-right">
                <div className="font-medium text-neutral-900 dark:text-neutral-50">{file.name}</div>
                <div className="text-sm text-neutral-400">{formatFileSize(file.size)}</div>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="rounded-lg p-1 text-neutral-400 hover:text-error-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div>
              <UploadCloud className="h-12 w-12 mx-auto text-neutral-300 dark:text-neutral-700 mb-3" />
              <p className="text-neutral-600 dark:text-neutral-300">اسحب الملف هنا أو اضغط للاختيار</p>
              <p className="text-xs text-neutral-400 mt-1">PDF, DOCX, PPTX, ZIP...</p>
            </div>
          )}
          <input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar,.jpg,.jpeg,.png"
          />
        </div>

        {/* Progress bar */}
        {uploading && (
          <div className="space-y-1">
            <div className="h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-primary-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-neutral-400 text-center">{progress}%</p>
          </div>
        )}

        {/* Form fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">العنوان *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">الوصف</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">القسم *</label>
            <select
              value={form.section}
              onChange={(e) => setForm({ ...form, section: e.target.value as Section, category: '' })}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="study">ملفات دراسية</option>
              <option value="books">كتب</option>
              <option value="interview">انترفيو</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">التصنيف</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">— اختر —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">المادة</label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">السنة</label>
            <input
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              placeholder="مثال: 2024"
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {(form.section === 'books') && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">المؤلف</label>
                <input
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">الإصدار</label>
                <input
                  value={form.edition}
                  onChange={(e) => setForm({ ...form, edition: e.target.value })}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </>
          )}

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">الوسوم (افصل بفواصل)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="تمريض, anatomy, pharmacology"
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">الحالة</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ResourceStatus })}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="published">منشور</option>
              <option value="draft">مسودة</option>
              <option value="scheduled">مجدول</option>
            </select>
          </div>

          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
              />
              مميز
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              <input
                type="checkbox"
                checked={form.popular}
                onChange={(e) => setForm({ ...form, popular: e.target.checked })}
                className="h-4 w-4 rounded text-primary-600 focus:ring-primary-500"
              />
              شائع
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={uploading || !file}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            <UploadCloud className="h-5 w-5" />
            {uploading ? 'جارٍ الرفع...' : 'رفع ونشر'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/resources')}
            className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-6 py-3 text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:border-neutral-300 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
