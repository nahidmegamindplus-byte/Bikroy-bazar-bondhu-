import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import CategoryGrid from '@/components/CategoryGrid';
import AdCard from '@/components/AdCard';
import HomeSearchHero from '@/components/HomeSearchHero';
import { Zap, ShieldCheck, Sparkles, Flame, ArrowRight, Store, MapPin } from 'lucide-react';

export const revalidate = 0; // Fresh dynamic data on every request

export default async function HomePage() {
  const [categories, featuredAds, recentAds, urgentAds, businessSellers, popularLocations] =
    await Promise.all([
      // Categories with ad count
      prisma.category.findMany({
        where: { parentId: null, isActive: true },
        orderBy: { order: 'asc' },
        include: {
          _count: { select: { ads: true } },
          children: true,
        },
      }),

      // Featured & Top Ads
      prisma.ad.findMany({
        where: {
          status: 'APPROVED',
          OR: [{ isFeatured: true }, { isTop: true }],
        },
        orderBy: [{ isTop: 'desc' }, { createdAt: 'desc' }],
        take: 6,
        include: {
          images: { orderBy: { order: 'asc' } },
          category: true,
          division: true,
          district: true,
          area: true,
          user: true,
        },
      }),

      // Recent Ads
      prisma.ad.findMany({
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: {
          images: { orderBy: { order: 'asc' } },
          category: true,
          division: true,
          district: true,
          area: true,
          user: true,
        },
      }),

      // Urgent Clearance Sales
      prisma.ad.findMany({
        where: { status: 'APPROVED', isUrgent: true },
        orderBy: { createdAt: 'desc' },
        take: 4,
        include: {
          images: { orderBy: { order: 'asc' } },
          category: true,
          division: true,
          district: true,
          area: true,
          user: true,
        },
      }),

      // Verified Business Sellers
      prisma.user.findMany({
        where: { role: 'BUSINESS_SELLER', isVerified: true },
        take: 4,
        select: {
          id: true,
          name: true,
          businessName: true,
          businessLogo: true,
          businessDesc: true,
          _count: { select: { ads: true } },
        },
      }),

      // Popular Divisions
      prisma.location.findMany({
        where: { type: 'DIVISION' },
        orderBy: { order: 'asc' },
        take: 6,
        include: {
          _count: { select: { divisionAds: true } },
        },
      }),
    ]);

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. Hero Dual Search Section */}
      <HomeSearchHero />

      {/* 2. Main Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Explore Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Browse thousands of authentic listings across verified sectors
            </p>
          </div>
          <Link
            href="/search"
            className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <CategoryGrid categories={categories} />
      </section>

      {/* 3. Featured & Premium Listings */}
      {featuredAds.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Featured & Top Listings
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Premium verified deals from our most trusted members
                </p>
              </div>
            </div>
            <Link
              href="/search?featured=true"
              className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
            {featuredAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Urgent Clearance Deals */}
      {urgentAds.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 dark:from-rose-950/20 dark:via-amber-950/20 dark:to-orange-950/20 rounded-3xl p-6 sm:p-8 border border-rose-200/60 dark:border-rose-900/40">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-600 text-white rounded-xl shadow-md">
                  <Flame className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Urgent Clearance Sales
                  </h2>
                  <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300 font-medium">
                    Sellers looking for quick cash deals — great negotiation opportunity!
                  </p>
                </div>
              </div>
              <Link
                href="/search?urgent=true"
                className="text-xs sm:text-sm font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                See All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {urgentAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Fresh Recommendations / Recent Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Fresh Recommendations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Recently posted classifieds across Bangladesh
            </p>
          </div>
          <Link
            href="/search"
            className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            Browse All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {recentAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </section>

      {/* 6. Popular Locations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Browse Ads by Division
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Find items and services near your hometown
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {popularLocations.map((loc) => (
            <Link
              key={loc.id}
              href={`/search?division=${loc.slug}`}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md transition text-center group"
            >
              <MapPin className="w-5 h-5 mx-auto mb-2 text-slate-400 group-hover:text-emerald-600 transition" />
              <h5 className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-emerald-600 transition">
                {loc.name}
              </h5>
              <span className="text-[11px] text-slate-600 dark:text-slate-300">
                {loc._count.divisionAds} ads
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Verified Business Sellers Spotlight */}
      {businessSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500 text-slate-950 rounded-xl">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                    Verified Business Showrooms
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Trusted showrooms, authorized dealers, and verified tech hubs
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {businessSellers.map((seller) => (
                <Link
                  key={seller.id}
                  href={`/seller/${seller.id}`}
                  className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl p-4 transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition truncate">
                        {seller.businessName || seller.name}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {seller.businessDesc || 'Authorized dealer with warranty-backed inventory.'}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                    <span>{seller._count.ads} active listings</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
