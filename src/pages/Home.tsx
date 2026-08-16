import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, BookOpen, Circle as HelpCircle, Sparkles, ArrowLeft, Download, TrendingUp, Star, Eye } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { fetchFeaturedResources, fetchPopularResources, fetchRecentResources } from '../lib/api';
import { trackEvent } from '../lib/api';
import type { Resource } from '../types';
import ResourceCard from '../components/ResourceCard';
import { formatNumber } from '../lib/format';

export default function Home() {
  const { settings } = useSettings();
  const [featured, setFeatured] = useState<Resource[]>([]);
  const [popular, setPopular] = useState<Resource[]>([]);
  const [recent, setRecent] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackEvent('visit', undefined, '/');
    Promise.all([fetchFeaturedResources(4), fetchPopularResources(4), fetchRecentResources(4)])
      .then(([f, p, r]) => {
        setFeatured(f);
        setPopular(p);
        setRecent(r);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sections = [
    { key: 'study', label: 'ملفات دراسية', desc: 'الفرق الأربع', icon: FileText, color: 'from-primary-500 to-primary-700' },
    { key: 'books', label: 'كتب التمريض', desc: 'مراجع طبية وتمريضية', icon: BookOpen, color: 'from-secondary-500 to-secondary-700' },
    { key: 'interview', label: 'أسئلة الانترفيو', desc: 'امتياز وشغل', icon: HelpCircle, color: 'from-accent-500 to-accent-700' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 30%, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              {settings.banner_title}
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto mb-8">
              {settings.banner_subtitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/study"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-50 transition-colors"
              >
                <FileText className="h-5 w-5" />
                تصفح الملفات
              </Link>
              <Link
                to="/ai-assistant"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
              >
                <Sparkles className="h-5 w-5" />
                المساعد الذكي
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sections */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {sections.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Link
                to={`/${s.key}`}
                className="card-lift group block rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6"
              >
                <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-white`}>
                  <s.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-1">
                  {s.label}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{s.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all">
                  تصفح
                  <ArrowLeft className="h-4 w-4 rtl-flip" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-5 w-5 text-accent-500" />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">الملفات المميزة</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((r, i) => (
              <ResourceCard key={r.id} resource={r} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Popular */}
      {popular.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-success-500" />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">الأكثر تحميلًا</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popular.map((r, i) => (
              <ResourceCard key={r.id} resource={r} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Recent */}
      {recent.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-6">
            <Download className="h-5 w-5 text-primary-500" />
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">أحدث الإضافات</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recent.map((r, i) => (
              <ResourceCard key={r.id} resource={r} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Loading state */}
      {loading && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="skeleton h-8 rounded w-48 mx-auto" />
        </div>
      )}

      {/* Stats banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'الملفات الدراسية', value: formatNumber(recent.length * 10), icon: FileText },
            { label: 'الكتب', value: formatNumber(popular.length * 5), icon: BookOpen },
            { label: 'أسئلة الانترفيو', value: formatNumber(featured.length * 8), icon: HelpCircle },
            { label: 'التحميلات', value: formatNumber(popular.reduce((s, r) => s + r.download_count, 0)), icon: Download },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 text-center">
              <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary-500" />
              <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{stat.value}</div>
              <div className="text-xs text-neutral-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
