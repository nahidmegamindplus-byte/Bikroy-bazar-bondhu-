import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import AdCard from '@/components/AdCard';
import { ShieldCheck, Store, Clock, Phone, MapPin } from 'lucide-react';

export const revalidate = 0;

export default async function SellerProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;

  const seller = await prisma.user.findUnique({
    where: { id },
    include: {
      ads: {
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
        include: {
          images: { orderBy: { order: 'asc' } },
          category: true,
          division: true,
          district: true,
          area: true,
          user: true,
        },
      },
      reviewsReceived: {
        include: { reviewer: true },
      },
      _count: {
        select: { ads: true, reviewsReceived: true },
      },
    },
  });

  if (!seller) {
    notFound();
  }

  const avgRating =
    seller.reviewsReceived.length > 0
      ? (
          seller.reviewsReceived.reduce((acc, r) => acc + r.rating, 0) /
          seller.reviewsReceived.length
        ).toFixed(1)
      : '5.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Seller Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-3xl flex items-center justify-center shadow-inner">
            {seller.name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {seller.businessName || seller.name}
              </h1>
              {seller.isVerified && (
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              )}
            </div>

            {seller.businessDesc && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl leading-relaxed">
                {seller.businessDesc}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-3">
              <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> Member since {new Date(seller.memberSince).getFullYear()}
              </span>
              <span>•</span>
              <span className="font-medium text-slate-600 dark:text-slate-300">
                ★ {avgRating} Rating ({seller._count.reviewsReceived} reviews)
              </span>
              <span>•</span>
              <span className="font-semibold text-emerald-600">
                {seller.ads.length} Active Listings
              </span>
            </div>
          </div>
        </div>

        {seller.role === 'BUSINESS_SELLER' && (
          <div className="px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center gap-2 text-amber-700 dark:text-amber-300 text-xs font-bold shrink-0">
            <Store className="w-4 h-4" />
            <span>Verified Business Partner</span>
          </div>
        )}
      </div>

      {/* Seller Active Ads Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            All Listings by this Seller ({seller.ads.length})
          </h2>
        </div>

        {seller.ads.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-3xl border">
            No active listings from this seller at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {seller.ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        )}
      </div>

      {/* Seller Reviews */}
      {seller.reviewsReceived.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Buyer Feedback & Reviews
          </h3>
          <div className="space-y-4">
            {seller.reviewsReceived.map((rev) => (
              <div key={rev.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-slate-800 dark:text-white">
                    {rev.reviewer.name}
                  </span>
                  <div className="flex text-amber-400 text-xs">
                    {'★'.repeat(rev.rating)}
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {rev.comment}
                </p>
                {rev.reply && (
                  <div className="mt-2.5 pl-3 border-l-2 border-emerald-500 text-[11px] text-slate-500">
                    <span className="font-bold text-emerald-600">Seller reply: </span>
                    {rev.reply}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
