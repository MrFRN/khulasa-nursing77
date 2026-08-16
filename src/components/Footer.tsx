import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Send } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { SECTIONS } from '../lib/constants';

export default function Footer() {
  const { settings } = useSettings();
  const year = new Date().getFullYear();

  const socialLinks = [
    { url: settings.social_links?.facebook, icon: Facebook, label: 'Facebook' },
    { url: settings.social_links?.twitter, icon: Twitter, label: 'Twitter' },
    { url: settings.social_links?.instagram, icon: Instagram, label: 'Instagram' },
    { url: settings.social_links?.telegram, icon: Send, label: 'Telegram' },
  ].filter((s) => s.url);

  return (
    <footer className="mt-16 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-bold text-sm">
                خ
              </div>
              <span className="font-bold text-neutral-900 dark:text-neutral-50">
                {settings.site_name}
              </span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {settings.tagline}
            </p>
          </div>

          {/* Sections */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">الأقسام</h3>
            <ul className="space-y-2">
              {SECTIONS.map((s) => (
                <li key={s.key}>
                  <Link
                    to={`/${s.key}`}
                    className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/ai-assistant" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  المساعد الذكي
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  المفضلة
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  البحث
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  دخول الإدارة
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">تواصل معنا</h3>
            {socialLinks.length > 0 ? (
              <div className="flex gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-primary-500 hover:text-white transition-colors"
                    aria-label={s.label}
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-400">لا توجد روابط بعد</p>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-200 dark:border-neutral-800 pt-6 text-center">
          <p className="text-sm text-neutral-400">
            © {year} {settings.site_name} — جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}
