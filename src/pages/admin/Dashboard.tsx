import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FileText, Upload, Settings as SettingsIcon,
  FolderTree, TrendingUp, Eye, Download, HardDrive, Files,
} from 'lucide-react';
import { fetchAnalytics, fetchStorageUsage } from '../lib/api';
import { formatNumber, formatFileSize } from '../lib/format';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState({
    totalVisits: 0,
    totalDownloads: 0,
    totalViews: 0,
    recentEvents: [],
  });
  const [storage, setStorage] = useState({ totalSize: 0, fileCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAnalytics(), fetchStorageUsage()])
      .then(([a, s]) => {
        setAnalytics(a);
        setStorage(s);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'الزوار', value: formatNumber(analytics.totalVisits), icon: Eye, color: 'text-primary-500' },
    { label: 'التحميلات', value: formatNumber(analytics.totalDownloads), icon: Download, color: 'text-success-500' },
    { label: 'المشاهدات', value: formatNumber(analytics.totalViews), icon: TrendingUp, color: 'text-accent-500' },
    { label: 'المساحة', value: formatFileSize(storage.totalSize), icon: HardDrive, color: 'text-secondary-500' },
  ];

  const quickLinks = [
    { to: '/admin/resources', label: 'إدارة الملفات', icon: FileText, desc: 'عرض وتعديل وحذف' },
    { to: '/admin/upload', label: 'رفع ملف', icon: Upload, desc: 'إضافة ملفات جديدة' },
    { to: '/admin/categories', label: 'التصنيفات', icon: FolderTree, desc: 'إدارة الأقسام' },
    { to: '/admin/settings', label: 'الإعدادات', icon: SettingsIcon, desc: 'محتوى الموقع' },
  ];

  const maxActivity = Math.max(
    ...analytics.recentEvents.map((e) => e.visits + e.downloads + e.views),
    1
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center gap-3">
        <LayoutDashboard className="h-6 w-6 text-primary-500" />
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">لوحة التحكم</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5"
          >
            <s.icon className={`h-6 w-6 mb-3 ${s.color}`} />
            <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              {loading ? '—' : s.value}
            </div>
            <div className="text-sm text-neutral-400 mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Activity chart */}
      <div className="mb-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
          نشاط آخر 14 يوم
        </h2>
        {analytics.recentEvents.length > 0 ? (
          <div className="flex items-end gap-1 h-40">
            {analytics.recentEvents.map((e) => {
              const total = e.visits + e.downloads + e.views;
              const height = (total / maxActivity) * 100;
              return (
                <div
                  key={e.date}
                  className="flex-1 flex flex-col items-center gap-1 group relative"
                >
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-primary-600 to-primary-400 transition-all group-hover:from-primary-700 group-hover:to-primary-500"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  >
                    <div className="absolute -top-8 hidden group-hover:block whitespace-nowrap rounded bg-neutral-900 dark:bg-neutral-700 px-2 py-1 text-xs text-white">
                      {e.visits + e.downloads + e.views}
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400 rotate-0">
                    {e.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-neutral-400 py-8 text-center">لا توجد بيانات بعد</p>
        )}
        <div className="mt-4 flex items-center gap-4 text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-primary-500" /> الزوار + التحميلات + المشاهدات
          </span>
        </div>
      </div>

      {/* Quick links */}
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">إجراءات سريعة</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((q, i) => (
          <motion.div
            key={q.to}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={q.to}
              className="card-lift group block rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5"
            >
              <q.icon className="h-6 w-6 mb-3 text-primary-500" />
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-1">{q.label}</h3>
              <p className="text-sm text-neutral-400">{q.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Storage info */}
      <div className="mt-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Files className="h-5 w-5 text-neutral-400" />
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">معلومات التخزين</h2>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">عدد الملفات: {storage.fileCount}</span>
          <span className="text-neutral-500">المساحة المستخدمة: {formatFileSize(storage.totalSize)}</span>
        </div>
      </div>
    </div>
  );
}
