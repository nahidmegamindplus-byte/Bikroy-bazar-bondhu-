'use client';

import React from 'react';
import Link from 'next/link';
import {
  Car,
  Smartphone,
  Home,
  Armchair,
  Shirt,
  Briefcase,
  Wrench,
  Sprout,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { toBanglaNumber } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  icon?: string | null;
  _count?: { ads: number };
  children?: { id: string; name: string; nameBn: string; slug: string }[];
}

interface CategoryGridProps {
  categories: Category[];
}

const iconMap: { [key: string]: any } = {
  Car: Car,
  Smartphone: Smartphone,
  Home: Home,
  Armchair: Armchair,
  Shirt: Shirt,
  Briefcase: Briefcase,
  Wrench: Wrench,
  Sprout: Sprout,
};

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const { isBangla } = useLanguage();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4">
      {categories.map((cat) => {
        const IconComponent = (cat.icon && iconMap[cat.icon]) || Car;
        const count = cat._count?.ads || 0;

        return (
          <Link
            key={cat.id}
            href={`/search?category=${cat.slug}`}
            className="group relative bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/80 transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <IconComponent className="w-6 h-6" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition" />
            </div>

            <div className="mt-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                {isBangla ? cat.nameBn : cat.name}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                {isBangla ? `${toBanglaNumber(count)}টি বিজ্ঞাপন` : `${count} ads`}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
