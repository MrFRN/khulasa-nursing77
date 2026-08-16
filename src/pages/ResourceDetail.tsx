import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Eye, Star, ArrowRight, FileText, BookOpen, Circle as HelpCircle, Calendar, User, Tag, HardDrive, Heart } from 'lucide-react';
import type { Resource } from '../types';
import { fetchResourceById, incrementDownload, incrementView, trackEvent } from '../lib/api';
import { formatFileSize, formatDate, formatNumber } from '../lib/format';
import { getFileType, getFileTypeLabel } from '../lib/filetypes';
import { isFavorite, toggleFavorite } from '../lib/favorites';

const sectionIcons: Record<string, React.ReactNode> = {
  study: <FileText className="h-5 w-5" />,
  books: <BookOpen className="h-5 w-5" />,
  interview: <HelpCircle className="h-5 w-5" />,
};

const sectionLabels: Record<string, string> = {
  study: 'ملفات دراسية',
  books: 'كتب التمريض',
  interview: 'أسئلة الانترفيو',
};

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fav, setFav] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchResourceById(id)
      .then((data) => {
        if (!data) {
          setError(true);
          return;
        }
        setResource(data);
        setFav(isFavorite(data.id));
        incrementView(data.id);
        trackEvent('view', data.id);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = () => {
    if (!resource) return;
    incrementDownload(resource.id);
    trackEvent('download', resource.id);
    if (resource.file_url) {
      window.open(resource.file_url, '_blank');
    }
  };

  const handleFav = () => {
    if (!resource) return;
    setFav(toggleFavorite(resource.id));
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20">
        <div className="skeleton h-8 rounded w-1/2 mb-4" />
        <div className="skeleton aspect-[16/9] rounded-2xl mb-6" />
        <div className="space-y-2">
          <div className="skeleton h-4 rounded w-full" />
          <div className="skeleton h-4 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="py-20 text-center">
        <p className="text-neutral-400 text-lg mb-4">الملف غير موجود</p>
        <Link to="/" className="text-primary-600 hover:underline">العودة للرئيسية</Link>
      </div>
    );
  }

  const fileType = getFileType(resource.file_name);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-neutral-400">
        <Link to="/" className="hover:text-primary-600">الرئيسية</Link>
        <span>/</span>
        <Link to={`/${resource.section}`} className="hover:text-primary-600">
          {sectionLabels[resource.section]}
        </Link>
        <span>/</span>
        <span className="text-neutral-600 dark:text-neutral-300">{resource.title}</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Cover + title */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800">
            {resource.cover_image_url ? (
              <img src={resource.cover_image_url} alt={resource.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-neutral-300 dark:text-neutral-600">
                {sectionIcons[resource.section] || <FileText className="h-16 w-16" />}
              </div>
            )}
          </div>

          <div className="sm:col-span-2 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                {resource.title}
              </h1>
              <button
                onClick={handleFav}
                className="shrink-0 rounded-lg p-2 border border-neutral-200 dark:border-neutral-700 hover:border-error-400 transition-colors"
                aria-label="المفضلة"
              >
                <Heart className={`h-5 w-5 ${fav ? 'fill-error-500 text-error-500' : 'text-neutral-400'}`} />
              </button>
            </div>

            {resource.description && (
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {resource.description}
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {resource.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-100 dark:bg-accent-900/30 px-3 py-1 text-xs font-medium text-accent-700 dark:text-accent-400">
                  <Star className="h-3 w-3" /> مميز
                </span>
              )}
              <span className="rounded-full bg-primary-100 dark:bg-primary-900/30 px-3 py-1 text-xs font-medium text-primary-700 dark:text-primary-400">
                {getFileTypeLabel(fileType)}
              </span>
              {resource.category && (
                <span className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                  {resource.category}
                </span>
              )}
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {resource.subject && (
                <div className="flex items-center gap-2 text-neutral-500">
                  <Tag className="h-4 w-4 text-neutral-400" />
                  <span>{resource.subject}</span>
                </div>
              )}
              {resource.year && (
                <div className="flex items-center gap-2 text-neutral-500">
                  <Calendar className="h-4 w-4 text-neutral-400" />
                  <span>{resource.year}</span>
                </div>
              )}
              {resource.author && (
                <div className="flex items-center gap-2 text-neutral-500">
                  <User className="h-4 w-4 text-neutral-400" />
                  <span>{resource.author}</span>
                </div>
              )}
              {resource.file_size != null && (
                <div className="flex items-center gap-2 text-neutral-500">
                  <HardDrive className="h-4 w-4 text-neutral-400" />
                  <span>{formatFileSize(resource.file_size)}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              {resource.file_url && (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
                >
                  <Download className="h-5 w-5" />
                  تحميل الملف
                </button>
              )}
              {fileType === 'pdf' && resource.file_url && (
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:border-primary-400 transition-colors"
                >
                  <Eye className="h-5 w-5" />
                  {showPreview ? 'إخفاء المعاينة' : 'معاينة'}
                </button>
              )}
              <Link
                to={`/${resource.section}`}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:border-primary-400 transition-colors"
              >
                <ArrowRight className="h-5 w-5 rtl-flip" />
                رجوع
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 pt-2 text-sm text-neutral-400">
              <span className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                {formatNumber(resource.download_count)} تحميل
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {formatNumber(resource.view_count)} مشاهدة
              </span>
              <span>· {formatDate(resource.created_at)}</span>
            </div>
          </div>
        </div>

        {/* PDF Preview */}
        {showPreview && resource.file_url && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
          >
            <iframe
              src={resource.file_url}
              title={resource.title}
              className="w-full h-[600px]"
            />
          </motion.div>
        )}

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {resource.tags.map((tag, i) => (
              <span key={i} className="rounded-lg bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs text-neutral-500">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
