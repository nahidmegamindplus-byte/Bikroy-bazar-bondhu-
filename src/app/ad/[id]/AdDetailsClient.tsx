'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Clock,
  Eye,
  ShieldCheck,
  Phone,
  MessageSquare,
  Share2,
  Heart,
  Flag,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  Zap,
  Sparkles,
  Store,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { formatPriceBDT, timeAgo } from '@/lib/utils';
import AdCard from '@/components/AdCard';
import PromoteModal from '@/components/PromoteModal';
import ChatModal from '@/components/ChatModal';
import AuthModal from '@/components/AuthModal';

interface AdDetailsClientProps {
  ad: any;
  similarAds: any[];
}

export default function AdDetailsClient({ ad, similarAds }: AdDetailsClientProps) {
  const router = useRouter();
  const { isBangla, t } = useLanguage();
  const { user } = useAuth();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [revealedPhone, setRevealedPhone] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Scam / Fraud');
  const [reportDesc, setReportDesc] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [promoteModalOpen, setPromoteModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const images = ad.images && ad.images.length > 0 ? ad.images : [{ url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80' }];

  const handleRevealPhone = async () => {
    if (phoneRevealed) return;
    try {
      const res = await fetch(`/api/ads/${ad.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incrementPhone: true }),
      });
      if (res.ok) {
        const data = await res.json();
        setRevealedPhone(data.sellerPhone || ad.sellerPhone);
        setPhoneRevealed(true);
      }
    } catch {
      setRevealedPhone(ad.sellerPhone);
      setPhoneRevealed(true);
    }
  };

  const handleStartChat = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setChatModalOpen(true);
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert(isBangla ? 'রিপোর্ট করতে দয়া করে লগইন করুন' : 'Please log in to report');
      return;
    }

    try {
      const res = await fetch(`/api/ads/${ad.id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: reportReason,
          description: reportDesc,
        }),
      });
      if (res.ok) {
        setReportSubmitted(true);
        setTimeout(() => {
          setReportModalOpen(false);
          setReportSubmitted(false);
        }, 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const locationText = [
    ad.area ? (isBangla ? ad.area.nameBn : ad.area.name) : null,
    ad.district ? (isBangla ? ad.district.nameBn : ad.district.name) : null,
    ad.division ? (isBangla ? ad.division.nameBn : ad.division.name) : null,
  ]
    .filter(Boolean)
    .join(', ');

  const isOwner = user && user.id === ad.userId;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 md:pb-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-emerald-600 transition">
          {isBangla ? 'হোম' : 'Home'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/search?category=${ad.category?.slug}`} className="hover:text-emerald-600 transition font-medium">
          {ad.category ? (isBangla ? ad.category.nameBn : ad.category.name) : 'Category'}
        </Link>
        {ad.subcategory && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/search?category=${ad.category?.slug}&subcategory=${ad.subcategory.slug}`}
              className="hover:text-emerald-600 transition font-medium"
            >
              {isBangla ? ad.subcategory.nameBn : ad.subcategory.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 dark:text-slate-300 font-semibold truncate max-w-xs">
          {ad.title}
        </span>
      </nav>

      {/* Main Grid: Left Details & Right Seller Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {ad.isTop && (
                <span className="bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current" /> {t('topBadge')}
                </span>
              )}
              {ad.isFeatured && (
                <span className="bg-amber-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-current" /> {t('featuredBadge')}
                </span>
              )}
              {ad.isUrgent && (
                <span className="bg-rose-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  {t('urgentBadge')}
                </span>
              )}
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {ad.condition === 'NEW' ? t('conditionNew') : ad.condition === 'REFURBISHED' ? t('conditionRefurbished') : t('conditionUsed')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {ad.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {locationText}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {t('postedOn')} {timeAgo(ad.createdAt, isBangla)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {ad.viewsCount} {t('views')}
              </span>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Active Big Image */}
            <div className="relative w-full h-72 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden bg-slate-950">
              <Image
                src={images[activeImageIndex]?.url}
                alt={ad.title}
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 mt-3 overflow-x-auto pb-1">
                {images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                      activeImageIndex === idx
                        ? 'border-emerald-500 scale-105 shadow'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Box */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                {isBangla ? 'বিক্রয় মূল্য' : 'Asking Price'}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {formatPriceBDT(ad.price, isBangla)}
                </span>
                {ad.isNegotiable && (
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                    {t('negotiable')}
                  </span>
                )}
              </div>
            </div>

            {isOwner && (
              <button
                onClick={() => setPromoteModalOpen(true)}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{t('promote')}</span>
              </button>
            )}
          </div>

          {/* Specifications Table */}
          {ad.attributes && ad.attributes.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                {t('specifications')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ad.attributes.map((attr: any) => (
                  <div
                    key={attr.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-500 dark:text-slate-400 capitalize font-medium">
                      {attr.fieldKey.replace('_', ' ')}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-white">
                      {attr.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              {t('descriptionLabel')}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {ad.description}
            </p>
          </div>

          {/* Report & Share */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <button
              onClick={() => setReportModalOpen(true)}
              className="flex items-center gap-1.5 text-rose-600 hover:underline font-semibold"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{t('reportAd')}</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t('shareAd')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Seller Profile & Contact Box (1 Col) */}
        <div className="space-y-6">
          {/* Seller Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-xl flex items-center justify-center shrink-0">
                {ad.user?.name ? ad.user.name.slice(0, 1).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {ad.user?.businessName || ad.user?.name}
                  </h4>
                  {ad.user?.isVerified && (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </div>
                {ad.user?.role === 'BUSINESS_SELLER' && (
                  <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1 mt-0.5">
                    <Store className="w-3 h-3" /> Verified Business Member
                  </span>
                )}
                <p className="text-xs text-slate-400 mt-1">
                  {t('memberSince')} {new Date(ad.user?.memberSince || ad.createdAt).getFullYear()}
                </p>
              </div>
            </div>

            {/* Response Rate & Verification Badge */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Response Rate</span>
                <span className="font-bold text-emerald-600">98% (Quick reply)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Active Listings</span>
                <span className="font-bold">{ad.user?._count?.ads || 1} ads</span>
              </div>
            </div>

            {/* Direct Contact Actions */}
            <div className="space-y-3 pt-2">
              {/* Phone Reveal Button */}
              {ad.showPhone && (
                <button
                  onClick={handleRevealPhone}
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm ${
                    phoneRevealed
                      ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>
                    {phoneRevealed
                      ? revealedPhone || ad.sellerPhone
                      : `${ad.sellerPhone.slice(0, 5)}XXXXXX - ${t('showNumber')}`}
                  </span>
                </button>
              )}

              {/* Chat Button */}
              <button
                onClick={handleStartChat}
                className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>{t('chatWithSeller')}</span>
              </button>

              {/* Seller Profile Link */}
              <Link
                href={`/seller/${ad.userId}`}
                className="block text-center text-xs font-semibold text-emerald-600 hover:underline pt-1"
              >
                {t('viewSellerProfile')}
              </Link>
            </div>
          </div>

          {/* Safe Trading Tips */}
          <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/50 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>{t('safetyTitle')}</span>
            </div>
            <ul className="space-y-2 text-xs text-amber-900/80 dark:text-amber-300/80">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{t('safetyTip1')}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{t('safetyTip2')}</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{t('safetyTip3')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Similar Listings Carousel/Grid */}
      {similarAds.length > 0 && (
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">
            {t('similarAds')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {similarAds.map((sAd) => (
              <AdCard key={sAd.id} ad={sAd} />
            ))}
          </div>
        </div>
      )}

      {/* Sticky Mobile Contact Bar */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shadow-xl">
        <button
          onClick={handleRevealPhone}
          className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
        >
          <Phone className="w-4 h-4" />
          <span>{phoneRevealed ? revealedPhone : t('callSeller')}</span>
        </button>
        <button
          onClick={handleStartChat}
          className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t('chatWithSeller')}</span>
        </button>
      </div>

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {t('reportAd')}
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Help us keep the marketplace safe by reporting spam, fake products, or fraud.
            </p>

            {reportSubmitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl text-center">
                Report submitted! Our moderation team will investigate this ad.
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Reason</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <option value="Scam / Fraud">Scam / Advance Money Fraud</option>
                    <option value="Fake / Replica Product">Fake / Replica Product</option>
                    <option value="Wrong Category / Spam">Wrong Category / Spam</option>
                    <option value="Offensive / Prohibited">Offensive or Prohibited Item</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Details (Optional)</label>
                  <textarea
                    rows={3}
                    value={reportDesc}
                    onChange={(e) => setReportDesc(e.target.value)}
                    placeholder="Provide details about what is wrong..."
                    className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Promotion Modal */}
      <PromoteModal
        isOpen={promoteModalOpen}
        onClose={() => setPromoteModalOpen(false)}
        adId={ad.id}
        adTitle={ad.title}
        onPromoted={() => router.refresh()}
      />

      {/* Interactive In-Page Marketplace Chat Modal */}
      <ChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        ad={ad}
      />

      {/* Auth Modal for Guests */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode="login"
      />
    </div>
  );
}
