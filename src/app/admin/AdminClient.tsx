'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Package,
  DollarSign,
  Flag,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatPriceBDT } from '@/lib/utils';

export default function AdminClient() {
  const { user } = useAuth();
  const { isBangla, t } = useLanguage();

  const [tab, setTab] = useState<'moderation' | 'users' | 'reports'>('moderation');
  const [stats, setStats] = useState<any>(null);
  const [ads, setAds] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState<{ [id: string]: string }>({});

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchModerationAds = async () => {
    try {
      const res = await fetch('/api/admin/ads?status=ALL');
      if (res.ok) {
        const data = await res.json();
        setAds(data.ads || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsersList(data.users || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/admin/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchModerationAds();
  }, []);

  useEffect(() => {
    if (tab === 'moderation') fetchModerationAds();
    if (tab === 'users') fetchUsers();
    if (tab === 'reports') fetchReports();
  }, [tab]);

  const handleUpdateAdStatus = async (adId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/admin/ads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adId,
          status,
          rejectionReason: status === 'REJECTED' ? rejectReason[adId] || 'Violates terms' : null,
        }),
      });

      if (res.ok) {
        fetchModerationAds();
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleUserVerification = async (userId: string, current: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isVerified: !current }),
      });
      if (res.ok) fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDismissReport = async (reportId: string) => {
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status: 'RESOLVED' }),
      });
      if (res.ok) fetchReports();
    } catch (e) {
      console.error(e);
    }
  };

  if (!user || (user.role !== 'ADMIN' && user.role !== 'MODERATOR')) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm max-w-md mx-auto">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold mb-1">Restricted Access</h3>
        <p className="text-xs text-slate-500 mb-6">You must be logged in as an Administrator or Moderator.</p>
        <Link href="/" className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {t('adminPanel')}
            </h2>
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-xs font-bold">
              {user.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Platform moderation, advertisement approvals, user management, and revenue overview
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">Pending Review</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-2xl font-black text-amber-500">{stats.pendingAds}</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">Total Advertisements</span>
              <Package className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalAds}</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">Platform Revenue</span>
              <DollarSign className="w-4 h-4 text-teal-600" />
            </div>
            <span className="text-2xl font-black text-teal-600">
              {formatPriceBDT(stats.totalRevenue, isBangla)}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">Open Reports</span>
              <Flag className="w-4 h-4 text-rose-500" />
            </div>
            <span className="text-2xl font-black text-rose-500">{stats.openReports}</span>
          </div>
        </div>
      )}

      {/* Main Admin Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <button
            onClick={() => setTab('moderation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              tab === 'moderation'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            {t('moderationQueue')} ({ads.length})
          </button>
          <button
            onClick={() => setTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              tab === 'users'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            {t('manageUsers')}
          </button>
          <button
            onClick={() => setTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              tab === 'reports'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            {t('reports')}
          </button>
        </div>

        {/* Tab 1: Moderation Queue */}
        {tab === 'moderation' && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {ads.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                All advertisements have been reviewed!
              </div>
            ) : (
              ads.map((ad) => (
                <div key={ad.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                      <Image
                        src={ad.images?.[0]?.url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link href={`/ad/${ad.id}`} className="font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600">
                          {ad.title}
                        </Link>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <span className="font-black text-xs text-emerald-600 block mt-0.5">
                        {formatPriceBDT(ad.price, isBangla)}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Seller: <span className="font-semibold text-slate-700 dark:text-slate-300">{ad.user?.name}</span> ({ad.user?.phone}) • Status: <span className="font-bold">{ad.status}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {ad.status !== 'APPROVED' && (
                      <button
                        onClick={() => handleUpdateAdStatus(ad.id, 'APPROVED')}
                        className="py-1.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{t('approve')}</span>
                      </button>
                    )}

                    {ad.status !== 'REJECTED' && (
                      <button
                        onClick={() => handleUpdateAdStatus(ad.id, 'REJECTED')}
                        className="py-1.5 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{t('reject')}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Users Management */}
        {tab === 'users' && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {usersList.map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {u.name}
                    </span>
                    {u.isVerified && (
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                      {u.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {u.phone} • {u._count?.ads || 0} listings posted
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleUserVerification(u.id, u.isVerified)}
                    className={`py-1.5 px-3 rounded-xl font-bold text-xs border ${
                      u.isVerified
                        ? 'border-slate-300 text-slate-600 hover:bg-slate-100'
                        : 'border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {u.isVerified ? 'Remove Verified' : 'Grant Verified Badge'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Reports Queue */}
        {tab === 'reports' && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {reports.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No reports submitted. Marketplace is clean!
              </div>
            ) : (
              reports.map((rep) => (
                <div key={rep.id} className="p-4 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-rose-600 block mb-1">
                      Reason: {rep.reason}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      Target Ad: <Link href={`/ad/${rep.adId}`} className="font-bold hover:underline">{rep.ad?.title}</Link>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Reported by: {rep.reporter?.name} ({rep.reporter?.phone})
                    </p>
                    {rep.description && (
                      <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg">
                        "{rep.description}"
                      </p>
                    )}
                  </div>

                  {rep.status === 'PENDING' && (
                    <button
                      onClick={() => handleDismissReport(rep.id)}
                      className="py-1 px-3 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Dismiss Report
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
