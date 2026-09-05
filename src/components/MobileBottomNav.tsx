'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, PlusCircle, MessageSquare, User } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { isBangla, t } = useLanguage();
  const { user } = useAuth();

  const navItems = [
    { label: isBangla ? 'হোম' : 'Home', href: '/', icon: Home },
    { label: isBangla ? 'ব্রাউজ' : 'Browse', href: '/search', icon: Grid },
    { label: t('postAd'), href: '/post-ad', icon: PlusCircle, isCta: true },
    { label: t('messages'), href: '/dashboard/messages', icon: MessageSquare },
    { label: user ? (isBangla ? 'প্রোফাইল' : 'Account') : t('login'), href: '/dashboard', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isCta) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 transition ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
