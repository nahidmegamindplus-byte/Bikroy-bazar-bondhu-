'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Clock, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { formatPriceBDT, timeAgo } from '@/lib/utils';

interface AdCardProps {
  ad: {
    id: string;
    title: string;
    slug?: string;
    price: number;
    isNegotiable?: boolean;
    condition: string;
    isFeatured?: boolean;
    isTop?: boolean;
    isUrgent?: boolean;
    createdAt: string | Date;
    images?: { url: string; isCover?: boolean }[];
    division?: { name: string; nameBn: string } | null;
    district?: { name: string; nameBn: string } | null;
    area?: { name: string; nameBn: string } | null;
    category?: { name: string; nameBn: string } | null;
    user?: { name: string; isVerified: boolean; businessName?: string | null } | null;
  };
  layout?: 'grid' | 'list';
  initialFavorited?: boolean;
}

export default function AdCard({ ad, layout = 'grid', initialFavorited = false }: AdCardProps) {
  const { isBangla, t } = useLanguage();
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [favLoading, setFavLoading] = useState(false);

  const coverImage =
    ad.images?.find((img) => img.isCover)?.url ||
    ad.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';

  const locationText = [
    ad.area ? (isBangla ? ad.area.nameBn : ad.area.name) : null,
    ad.district ? (isBangla ? ad.district.nameBn : ad.district.name) : null,
  ]
    .filter(Boolean)
    .join(', ');

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert(isBangla ? 'বিজ্ঞাপন সংরক্ষণ করতে দয়া করে লগইন করুন' : 'Please login to save this ad');
      return;
    }

    setFavLoading(true);
    try {
      const res = await fetch(`/api/ads/${ad.id}/favorite`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setIsFavorited(data.favorited);
      }
    } catch {
      console.error('Failed to toggle favorite');
    } finally {
      setFavLoading(false);
    }
  };

  const isList = layout === 'list';

  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 hover:shadow-xl overflow-hidden ${
        ad.isTop
          ? 'border-indigo-500/80 ring-1 ring-indigo-500/40'
          : ad.isFeatured
          ? 'border-amber-400/80 ring-1 ring-amber-400/30'
          : 'border-slate-200/90 dark:border-slate-800/90 hover:border-emerald-500/50'
      } ${isList ? 'flex flex-col sm:flex-row' : 'flex flex-col'}`}
    >
      {/* Badges Container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {ad.isTop && (
          <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" /> {t('topBadge')}
          </span>
        )}
        {ad.isFeatured && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider flex items-center gap-1">
            ★ {t('featuredBadge')}
          </span>
        )}
        {ad.isUrgent && (
          <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider">
            {t('urgentBadge')}
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        disabled={favLoading}
        title={isFavorited ? 'Remove favorite' : 'Save ad'}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm text-slate-400 hover:text-rose-500 shadow-sm transition hover:scale-110"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isFavorited ? 'fill-rose-500 text-rose-500' : 'text-slate-600 dark:text-slate-300'
          }`}
        />
      </button>

      {/* Image Thumbnail */}
      <Link
        href={`/ad/${ad.id}`}
        className={`relative block overflow-hidden bg-slate-100 dark:bg-slate-800 ${
          isList ? 'sm:w-64 h-52 sm:h-auto shrink-0' : 'w-full h-48 sm:h-52'
        }`}
      >
        <Image
          src={coverImage}
          alt={ad.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Condition */}
          <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-400 mb-1.5">
            <span className="font-medium text-emerald-700 dark:text-emerald-400 truncate max-w-[140px]">
              {ad.category ? (isBangla ? ad.category.nameBn : ad.category.name) : ''}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
              {ad.condition === 'NEW'
                ? t('conditionNew')
                : ad.condition === 'REFURBISHED'
                ? t('conditionRefurbished')
                : t('conditionUsed')}
            </span>
          </div>

          {/* Ad Title */}
          <Link href={`/ad/${ad.id}`} className="block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base line-clamp-2 leading-snug">
              {ad.title}
            </h4>
          </Link>

          {/* Price */}
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatPriceBDT(ad.price, isBangla)}
            </span>
            {ad.isNegotiable && (
              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                ({t('negotiable')})
              </span>
            )}
          </div>
        </div>

        {/* Footer info: Location, Time & Seller */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-1.5 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 truncate max-w-[170px]">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{locationText || t('allBangladesh')}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 text-[11px] shrink-0">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{timeAgo(ad.createdAt, isBangla)}</span>
            </div>
          </div>

          {ad.user && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                {ad.user.businessName || ad.user.name}
              </span>
              {ad.user.isVerified && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5 fill-emerald-100 dark:fill-emerald-950" />
                  {t('verifiedSeller')}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
