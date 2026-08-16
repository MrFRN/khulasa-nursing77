import { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Save, CircleCheck as CheckCircle, Upload } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { adminUpdateSettings, uploadFile } from '../../lib/api';
import type { SiteSettings } from '../../types';

export default function Settings() {
  const { settings, refresh } = useSettings();
  const [form, setForm] = useState<SiteSettings>(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminUpdateSettings(form);
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert('فشل الحفظ: ' + (err.message || ''));
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const ext = file.name.split('.').pop();
      const { publicUrl } = await uploadFile('media', `logo-${Date.now()}.${ext}`, file);
      setForm({ ...form, logo_url: publicUrl });
    } catch {
      alert('فشل رفع الشعار');
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const ext = file.name.split('.').pop();
      const { publicUrl } = await uploadFile('media', `banner-${Date.now()}.${ext}`, file);
      setForm({ ...form, banner_image_url: publicUrl });
    } catch {
      alert('فشل رفع البانر');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center gap-3">
        <SettingsIcon className="h-6 w-6 text-primary-500" />
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">الإعدادات</h1>
      </div>

      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 px-4 py-3 text-sm text-success-600 dark:text-success-400">
          <CheckCircle className="h-4 w-4" />
          تم حفظ التغييرات
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4">
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-50">العلامة التجارية</h2>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">اسم الموقع</label>
            <input
              value={form.site_name}
              onChange={(e) => setForm({ ...form, site_name: e.target.value })}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">الوصف المختصر</label>
            <input
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">الشعار (Logo)</label>
            <div className="flex items-center gap-3">
              {form.logo_url && (
                <img src={form.logo_url} alt="logo" className="h-12 w-12 rounded-lg object-cover" />
              )}
              <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:border-primary-400 transition-colors">
                <Upload className="h-4 w-4" />
                رفع شعار
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
              {form.logo_url && (
                <button type="button" onClick={() => setForm({ ...form, logo_url: '' })} className="text-sm text-error-500">
                  إزالة
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4">
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-50">البانر الرئيسي</h2>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">عنوان البانر</label>
            <input
              value={form.banner_title}
              onChange={(e) => setForm({ ...form, banner_title: e.target.value })}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">نص البانر الفرعي</label>
            <textarea
              value={form.banner_subtitle}
              onChange={(e) => setForm({ ...form, banner_subtitle: e.target.value })}
              rows={2}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">صورة البانر (اختياري)</label>
            <div className="flex items-center gap-3">
              {form.banner_image_url && (
                <img src={form.banner_image_url} alt="banner" className="h-16 w-24 rounded-lg object-cover" />
              )}
              <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:border-primary-400 transition-colors">
                <Upload className="h-4 w-4" />
                رفع صورة
                <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
              </label>
              {form.banner_image_url && (
                <button type="button" onClick={() => setForm({ ...form, banner_image_url: '' })} className="text-sm text-error-500">
                  إزالة
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Social links */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4">
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-50">روابط التواصل</h2>

          {(['facebook', 'twitter', 'instagram', 'telegram'] as const).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 capitalize">{key}</label>
              <input
                value={(form.social_links as any)?.[key] || ''}
                onChange={(e) => setForm({
                  ...form,
                  social_links: { ...form.social_links, [key]: e.target.value },
                })}
                placeholder={`https://${key}.com/...`}
                dir="ltr"
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            <Save className="h-5 w-5" />
            {saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </form>
    </div>
  );
}
