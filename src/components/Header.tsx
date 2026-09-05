'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Globe,
  PlusCircle,
  User,
  LogOut,
  LayoutDashboard,
  Heart,
  MessageSquare,
  ShieldCheck,
  Moon,
  Sun,
  ChevronDown,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import LocationModal from './LocationModal';
import AuthModal from './AuthModal';

export default function Header() {
  const { lang, setLang, isBangla, t } = useLanguage();
  const { user, logout } = useAuth();

  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    division?: any;
    district?: any;
    area?: any;
  } | null>(null);

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const locationLabel = selectedLocation?.area
    ? isBangla ? selectedLocation.area.nameBn : selectedLocation.area.name
    : selectedLocation?.district
    ? isBangla ? selectedLocation.district.nameBn : selectedLocation.district.name
    : selectedLocation?.division
    ? isBangla ? selectedLocation.division.nameBn : selectedLocation.division.name
    : t('allBangladesh');

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            {/* Left: Brand Logo & Location */}
            <div className="flex items-center gap-3 sm:gap-6">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  ব
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                    Bazaar<span className="text-emerald-600">Bondhu</span>
                  </span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold tracking-wider uppercase hidden sm:block">
                    {isBangla ? 'বাংলাদেশের আধুনিক মার্কেটপ্লেস' : 'Bangladesh Classifieds'}
                  </span>
                </div>
              </Link>

              {/* Location Selector Button */}
              <button
                onClick={() => setIsLocationOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="max-w-[120px] truncate">{locationLabel}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            {/* Right: Language, Dark Mode, Auth & Post Ad */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher */}
              <button
                onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
                title="Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Toggle Theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* User Dropdown / Login */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-sm font-semibold text-slate-800 dark:text-white"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                      {user.name.slice(0, 1).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline-block max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fadeIn"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate">{user.phone}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                          {user.role}
                        </span>
                      </div>

                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        {t('dashboard')}
                      </Link>

                      <Link
                        href="/dashboard/messages"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <MessageSquare className="w-4 h-4 text-teal-600" />
                        {t('messages')}
                      </Link>

                      <Link
                        href="/dashboard?tab=favorites"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        {t('favorites')}
                      </Link>

                      {(user.role === 'ADMIN' || user.role === 'MODERATOR') && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          {t('adminPanel')}
                        </Link>
                      )}

                      <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          {t('logout')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>{t('login')}</span>
                </button>
              )}

              {/* Post Ad CTA Button */}
              <Link
                href="/post-ad"
                className="flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 hover:shadow-lg transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('postAd')}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        selectedLocation={selectedLocation}
        onSelect={(loc) => setSelectedLocation(loc)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultMode={authMode}
      />
    </>
  );
}
