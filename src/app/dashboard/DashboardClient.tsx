'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Package,
  Heart,
  MessageSquare,
  Zap,
  CheckCircle2,
  Trash2,
  PlusCircle,
  Clock,
  Eye,
  Phone,
  ShieldCheck,
  Store,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatPriceBDT } from '@/lib/utils';
import PromoteModal from '@/components/PromoteModal';

export default function DashboardClient() {
  const { user } = useAuth();
  const { isBangla, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'ads' | 'favorites'>('ads');
  const [adFilter, setAdFilter] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'SOLD'>('ALL');
  const [ads, setAds] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [counts, setCounts] = useState({ all: 0, active: 0, pending: 0, sold: 0 });
  const [loading, setLoading] = useState(true);

  // Promote Modal state
  const [promoteTarget, setPromoteTarget] = useState<{ id: string; title: string } | null>(null);

  const fetchUserAds = async () => {
    try {
      const res = await fetch(`/api/user/ads?status=${adFilter}`);
      if (res.ok) {
        const data = await res.json();
        setAds(data.ads || []);
        setCounts(data.counts || { all: 0, active: 0, pending: 0, sold: 0 });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/user/favorites');
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.favorites || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeTab === 'ads') {
      fetchUserAds();
    } else {
      fetchFavorites();
    }
  }, [activeTab, adFilter]);

  const handleMarkSold = async (adId: string) => {
    if (!confirm('Mark this listing as Sold?')) return;
    try {
      const res = await fetch(`/api/ads/${adId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'SOLD' }),
      });
      if (res.ok) fetchUserAds();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (adId: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;
    try {
      const res = await fetch(`/api/ads/${adId}`, { method: 'DELETE' });
      if (res.ok) fetchUserAds();
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm max-w-md mx-auto">
        <h3 className="text-lg font-bold mb-2">Please Sign In</h3>
        <p className="text-xs text-slate-500 mb-6">You must be logged in to view your dashboard.</p>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const totalViews = ads.reduce((acc, a) => acc + a.viewsCount, 0);
  const totalPhoneLeads = ads.reduce((acc, a) => acc + a.phoneViewsCount, 0);

  return (
    <div className="space-y-8">
      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-2xl flex items-center justify-center">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {user.businessName || user.name}
              </h2>
              {user.isVerified && (
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
            </div>
            <p className="text-xs text-slate-500">{user.phone} {user.email ? `• ${user.email}` : ''}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {user.role}
              </span>
              {user.role === 'BUSINESS_SELLER' && (
                <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                  <Store className="w-3.5 h-3.5" /> Verified Showroom
                </span>
              )}
            </div>
          </div>
        </div>

        <Link
          href="/post-ad"
          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('postAd')}</span>
        </Link>
      </div>

      {/* Analytics KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1">{t('activeAds')}</span>
          <span className="text-2xl font-black text-emerald-600">{counts.active}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1">{t('pendingAds')}</span>
          <span className="text-2xl font-black text-amber-500">{counts.pending}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1">{t('totalViews')}</span>
          <span className="text-2xl font-black text-indigo-600">{totalViews}</span>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1">{t('phoneLeads')}</span>
          <span className="text-2xl font-black text-teal-600">{totalPhoneLeads}</span>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('ads')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'ads'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t('myAds')} ({counts.all})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'favorites'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t('favorites')}
            </button>
            <Link
              href="/dashboard/messages"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t('messages')}</span>
            </Link>
          </div>

          {activeTab === 'ads' && (
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl text-xs">
              {(['ALL', 'APPROVED', 'PENDING', 'SOLD'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setAdFilter(st)}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    adFilter === st
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {st === 'ALL'
                    ? 'All'
                    : st === 'APPROVED'
                    ? 'Active'
                    : st === 'PENDING'
                    ? 'Pending'
                    : 'Sold'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tab Content: Ads Table / List */}
        {activeTab === 'ads' && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading ads...</div>
            ) : ads.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold">No ads in this category</p>
                <Link
                  href="/post-ad"
                  className="mt-3 inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow"
                >
                  Post Your First Ad
                </Link>
              </div>
            ) : (
              ads.map((ad) => {
                const cover =
                  ad.images?.find((img: any) => img.isCover)?.url ||
                  ad.images?.[0]?.url ||
                  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';

                return (
                  <div
                    key={ad.id}
                    className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                        <Image src={cover} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <Link
                          href={`/ad/${ad.id}`}
                          className="font-bold text-slate-900 dark:text-white text-sm hover:text-emerald-600 line-clamp-1"
                        >
                          {ad.title}
                        </Link>
                        <span className="text-sm font-black text-emerald-600 block mt-0.5">
                          {formatPriceBDT(ad.price, isBangla)}
                        </span>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                          <span>{ad.category?.name}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {ad.viewsCount}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {ad.phoneViewsCount} leads
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status badge & Actions */}
                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          ad.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : ad.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {ad.status}
                      </span>

                      <button
                        onClick={() => setPromoteTarget({ id: ad.id, title: ad.title })}
                        className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Boost</span>
                      </button>

                      {ad.status !== 'SOLD' && (
                        <button
                          onClick={() => handleMarkSold(ad.id)}
                          className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 hover:bg-slate-100 text-xs"
                          title="Mark as Sold"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 hover:bg-rose-50 text-xs"
                        title="Delete Ad"
                      >
                        <Trash2 className="w-4 h-4 text-rose-500" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab Content: Saved Ads */}
        {activeTab === 'favorites' && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {favorites.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold">No saved ads yet</p>
                <Link
                  href="/search"
                  className="mt-3 inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow"
                >
                  Browse Marketplace
                </Link>
              </div>
            ) : (
              favorites.map((fav) => (
                <div key={fav.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                      <Image
                        src={fav.ad?.images?.[0]?.url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/ad/${fav.adId}`}
                        className="font-bold text-sm hover:text-emerald-600 line-clamp-1"
                      >
                        {fav.ad?.title}
                      </Link>
                      <span className="text-xs font-bold text-emerald-600">
                        {formatPriceBDT(fav.ad?.price || 0, isBangla)}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/ad/${fav.adId}`}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    View Listing
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Promotion Modal */}
      {promoteTarget && (
        <PromoteModal
          isOpen={!!promoteTarget}
          onClose={() => setPromoteTarget(null)}
          adId={promoteTarget.id}
          adTitle={promoteTarget.title}
          onPromoted={fetchUserAds}
        />
      )}
    </div>
  );
}
