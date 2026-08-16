import { Link } from 'react-router-dom';
import { Download, Eye, Star, FileText, BookOpen, Circle as HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Resource } from '../types';
import { formatFileSize, formatNumber, timeAgo } from '../lib/format';
import { getFileType, getFileTypeLabel } from '../lib/filetypes';
import { isFavorite, toggleFavorite } from '../lib/favorites';
import { useState } from 'react';
import { Heart } from 'lucide-react';

const sectionIcons: Record<string, React.ReactNode> = {
  study: <FileText className="h-5 w-5" />,
  books: <BookOpen className="h-5 w-5" />,
  interview: <HelpCircle className="h-5 w-5" />,
};

export default function ResourceCard({ resource, index = 0 }: { resource: Resource; index?: number }) {
  const [fav, setFav] = useState(isFavorite(resource.id));
  const fileType = getFileType(resource.file_name);

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFav(toggleFavorite(resource.id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
    >
      <Link
        to={`/resource/${resource.id}`}
        className="card-lift group block overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
      >
        {/* Cover */}
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          {resource.cover_image_url ? (
            <img
              src={resource.cover_image_url}
              alt={resource.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-300 dark:text-neutral-600">
              {sectionIcons[resource.section] || <FileText className="h-12 w-12" />}
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-2 right-2 flex gap-1.5">
            {resource.featured && (
              <span className="flex items-center gap-1 rounded-full bg-accent-500/90 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
                <Star className="h-3 w-3" />
                مميز
              </span>
            )}
            <span className="rounded-full bg-black/50 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
              {getFileTypeLabel(fileType)}
            </span>
          </div>
          {/* Favorite */}
          <button
            onClick={handleFav}
            className="absolute top-2 left-2 rounded-full p-1.5 bg-black/40 backdrop-blur transition-colors hover:bg-black/60"
            aria-label="إضافة للمفضلة"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                fav ? 'fill-error-500 text-error-500' : 'text-white'
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {resource.title}
          </h3>
          {resource.description && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
              {resource.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
            {resource.subject && <span>{resource.subject}</span>}
            {resource.year && <span>· {resource.year}</span>}
            {resource.author && <span>· {resource.author}</span>}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <span className="flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                {formatNumber(resource.download_count)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {formatNumber(resource.view_count)}
              </span>
            </div>
            <span className="text-xs text-neutral-400">{timeAgo(resource.created_at)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
