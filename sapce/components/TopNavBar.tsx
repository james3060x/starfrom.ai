
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage, useTheme } from '../App';

export const TopNavBar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-solid border-border-light dark:border-border-dark bg-white/80 dark:bg-background-dark/80 backdrop-blur-md transition-colors duration-300">
      <div className="px-4 md:px-10 py-3 flex items-center justify-between mx-auto max-w-7xl gap-2 relative">
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 text-slate-900 dark:text-white shrink-0 transition-opacity hover:opacity-80 overflow-hidden">
          <div className="size-9 md:size-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 text-white shrink-0">
            <span className="material-symbols-outlined text-[20px] md:text-[24px]">neurology</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-base md:text-xl font-bold leading-none tracking-tight truncate">StarFromSpace</h2>
          </div>
        </Link>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-center size-8 md:size-10 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 hover:text-primary hover:bg-slate-200 dark:hover:text-white dark:hover:bg-white/10 transition-all"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="material-symbols-outlined text-xl">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Language Toggle */}
          <button 
            onClick={() => setLanguage(language === 'en' ? 'cn' : 'en')}
            className="flex items-center justify-center h-8 md:h-10 px-2.5 md:px-3 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-gray-300 hover:text-primary hover:bg-slate-200 dark:hover:text-white dark:hover:bg-white/10 transition-all uppercase"
            title={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
          >
            <span className="material-symbols-outlined text-sm">language</span>
            <span className="hidden md:inline ml-1">{language === 'en' ? '中文' : 'EN'}</span>
          </button>
          
          {/* Desktop Links */}
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/admin" className="flex items-center justify-center px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:text-primary dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 text-sm font-medium transition-all">
              {t.nav.login}
            </Link>
            <Link to="/admin" className="flex items-center justify-center h-10 px-4 rounded-lg text-white text-sm font-medium bg-primary/80 dark:bg-primary/20 hover:bg-primary dark:hover:bg-primary/30 transition-colors border border-primary/30 shadow-lg shadow-primary/10 whitespace-nowrap">
              {t.nav.adminPortal}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden flex items-center justify-center size-9 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-all"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div 
            ref={menuRef}
            className="absolute top-full right-4 mt-2 w-56 py-2 bg-white dark:bg-modal-bg border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl sm:hidden animate-fade-in-up origin-top-right overflow-hidden transition-colors"
          >
            <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 mb-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">{t.nav.adminPortal}</span>
            </div>
            <Link 
              to="/admin" 
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-primary">login</span>
              {t.nav.login}
            </Link>
            <Link 
              to="/admin" 
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-primary">admin_panel_settings</span>
              {t.nav.adminPortal}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
