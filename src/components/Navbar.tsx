import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Moon, Sun, Menu, X, BookOpen, FileText, Circle as HelpCircle, LayoutDashboard, User, Sparkles, Heart } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { SECTIONS } from '../lib/constants';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSettings();
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  };

  const sectionIcons: Record<string, React.ReactNode> = {
    study: <FileText className="h-4 w-4" />,
    books: <BookOpen className="h-4 w-4" />,
    interview: <HelpCircle className="h-4 w-4" />,
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40'
        : 'text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.site_name} className="h-8 w-8 rounded-lg object-cover" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-bold text-sm">
                خ
              </div>
            )}
            <span className="hidden sm:block text-lg font-bold text-neutral-900 dark:text-neutral-50">
              {settings.site_name}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {SECTIONS.map((s) => (
              <NavLink key={s.key} to={`/${s.key}`} className={navLinkClass}>
                <span className="flex items-center gap-1.5">
                  {sectionIcons[s.key]}
                  {s.label}
                </span>
              </NavLink>
            ))}
            <NavLink to="/ai-assistant" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                المساعد الذكي
              </span>
            </NavLink>
            <NavLink to="/favorites" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <Heart className="h-4 w-4" />
                المفضلة
              </span>
            </NavLink>
          </div>

          {/* Search + actions */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="hidden lg:block">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث..."
                  className="w-44 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-800/50 py-2 pr-9 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:w-56 transition-all"
                />
              </div>
            </form>

            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="تبديل الوضع"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {session ? (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  لوحة التحكم
                </Link>
                <button
                  onClick={signOut}
                  className="rounded-lg p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  aria-label="خروج"
                >
                  <User className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
              >
                <User className="h-4 w-4" />
                دخول
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden rounded-lg p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="القائمة"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="space-y-2 py-3">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="بحث..."
                      className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 py-2 pr-9 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </form>
                {SECTIONS.map((s) => (
                  <NavLink
                    key={s.key}
                    to={`/${s.key}`}
                    onClick={() => setMobileOpen(false)}
                    className={navLinkClass}
                  >
                    <span className="flex items-center gap-2">
                      {sectionIcons[s.key]}
                      {s.label}
                    </span>
                  </NavLink>
                ))}
                <NavLink to="/ai-assistant" onClick={() => setMobileOpen(false)} className={navLinkClass}>
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    المساعد الذكي
                  </span>
                </NavLink>
                <NavLink to="/favorites" onClick={() => setMobileOpen(false)} className={navLinkClass}>
                  <span className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    المفضلة
                  </span>
                </NavLink>
                {session ? (
                  <>
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      لوحة التحكم
                    </Link>
                    <button
                      onClick={() => { signOut(); setMobileOpen(false); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300"
                    >
                      <User className="h-4 w-4" />
                      خروج
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    <User className="h-4 w-4" />
                    دخول
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
