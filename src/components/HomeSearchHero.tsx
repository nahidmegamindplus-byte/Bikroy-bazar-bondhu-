'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import LocationModal from './LocationModal';

export default function HomeSearchHero() {
  const router = useRouter();
  const { isBangla, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{
    division?: any;
    district?: any;
    area?: any;
  } | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (selectedLocation?.division) params.set('division', selectedLocation.division.slug);
    if (selectedLocation?.district) params.set('district', selectedLocation.district.slug);
    if (selectedLocation?.area) params.set('area', selectedLocation.area.slug);

    router.push(`/search?${params.toString()}`);
  };

  const locationLabel = selectedLocation?.area
    ? isBangla ? selectedLocation.area.nameBn : selectedLocation.area.name
    : selectedLocation?.district
    ? isBangla ? selectedLocation.district.nameBn : selectedLocation.district.name
    : selectedLocation?.division
    ? isBangla ? selectedLocation.division.nameBn : selectedLocation.division.name
    : t('allBangladesh');

  const trendingTags = [
    { label: 'Toyota Allion', q: 'toyota' },
    { label: 'iPhone 15 Pro Max', q: 'iphone' },
    { label: 'Bashundhara Flat', q: 'apartment' },
    { label: 'Yamaha R15', q: 'yamaha' },
    { label: 'Sony Bravia TV', q: 'sony' },
    { label: 'Dining Table', q: 'table' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-slate-900 to-slate-950 text-white py-14 sm:py-20">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/25 text-emerald-300 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isBangla ? 'বাংলাদেশের ১ নম্বর বিশ্বস্ত মার্কেটপ্লেস' : "Bangladesh's #1 Trusted Marketplace"}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none mb-4">
          {isBangla ? (
            <>
              খুঁজুন, কিনুন ও বিক্রি করুন{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                নিরাপদে ও সহজে
              </span>
            </>
          ) : (
            <>
              Buy & Sell Anything Across{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Bangladesh
              </span>
            </>
          )}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 font-normal">
          {isBangla
            ? 'গাড়ি, মোবাইল, ফ্ল্যাট, আসবাবপত্র থেকে শুরু করে সব ধরনের নতুন ও পুরাতন পণ্য কিনুন ভেরিফায়েড বিক্রেতাদের কাছ থেকে।'
            : 'Over 50,000+ verified listings for cars, electronics, properties, furniture and jobs with direct seller contact.'}
        </p>

        {/* Dual Search Box */}
        <form
          onSubmit={handleSearch}
          className="bg-white dark:bg-slate-900 p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/40 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2 text-slate-900 dark:text-white"
        >
          {/* Query Input */}
          <div className="relative flex-1 w-full flex items-center">
            <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full px-3 py-3 rounded-xl bg-transparent text-sm focus:outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Location Trigger */}
          <div className="w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 flex items-center">
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="w-full sm:w-48 px-3.5 py-3 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition"
            >
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{locationLabel}</span>
              </div>
            </button>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md transition shrink-0"
          >
            {t('searchBtn')}
          </button>
        </form>

        {/* Trending Searches */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">
            {isBangla ? 'জনপ্রিয় অনুসন্ধান:' : 'Trending Searches:'}
          </span>
          {trendingTags.map((tag) => (
            <button
              key={tag.label}
              onClick={() => router.push(`/search?q=${tag.q}`)}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-emerald-600/30 border border-slate-700/80 hover:border-emerald-500/50 text-slate-300 hover:text-white transition text-[11px]"
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Feature Points */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Phone & Sellers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Zero Hidden Fees</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Direct Buyer-to-Seller Chat</span>
          </div>
        </div>
      </div>

      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={selectedLocation}
        onSelect={(loc) => setSelectedLocation(loc)}
      />
    </div>
  );
}
