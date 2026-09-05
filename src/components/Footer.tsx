'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, Smartphone, CheckCircle, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { isBangla, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-24 md:pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust & Safety Banner */}
        <div className="bg-slate-800/80 rounded-2xl p-6 mb-12 border border-slate-700/60 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">
                {isBangla ? '১০০% নিরাপদ লেনদেন' : '100% Safe Trading'}
              </h5>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {t('safetyTip1')} {t('safetyTip2')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">
                {isBangla ? 'ভেরিফায়েড সেলার ও পণ্য' : 'Verified Sellers & Ads'}
              </h5>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {isBangla
                  ? 'প্রতিটি বিজ্ঞাপন আমাদের বিশেষজ্ঞ মডারেশন টিম দ্বারা সতর্কতার সাথে যাচাই করা হয়।'
                  : 'Every ad is manually reviewed to protect our community against fraud and spam.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">
                {isBangla ? 'মোবাইল ফ্রেন্ডলি মার্কেটপ্লেস' : 'Fast & Seamless Mobile UX'}
              </h5>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {isBangla
                  ? 'যেকোনো স্মার্টফোন বা কম্পিউটার থেকে অতি দ্রুত ছবি আপলোড ও সরাসরি চ্যাট করুন।'
                  : 'Instant in-app messaging, responsive photo compression, and fast search on any device.'}
              </p>
            </div>
          </div>
        </div>

        {/* Links Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-base">
                ব
              </div>
              <span className="text-xl font-black text-white">
                Bazaar<span className="text-emerald-400">Bondhu</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {t('tagline')}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Made with care for Bangladesh</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h6 className="font-bold text-white text-sm mb-3">
              {isBangla ? 'জনপ্রিয় ক্যাটাগরি' : 'Top Categories'}
            </h6>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/search?category=vehicles" className="hover:text-emerald-400 transition">
                  {isBangla ? 'গাড়ি ও মোটরসাইকেল' : 'Cars & Vehicles'}
                </Link>
              </li>
              <li>
                <Link href="/search?category=electronics" className="hover:text-emerald-400 transition">
                  {isBangla ? 'মোবাইল ও গ্যাজেট' : 'Mobiles & Laptops'}
                </Link>
              </li>
              <li>
                <Link href="/search?category=property" className="hover:text-emerald-400 transition">
                  {isBangla ? 'ফ্ল্যাট ও প্রপার্টি' : 'Apartments & Land'}
                </Link>
              </li>
              <li>
                <Link href="/search?category=home-living" className="hover:text-emerald-400 transition">
                  {isBangla ? 'আসবাবপত্র ও কিচেন' : 'Home & Living'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h6 className="font-bold text-white text-sm mb-3">
              {isBangla ? 'প্রধান শহরসমূহ' : 'Popular Cities'}
            </h6>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/search?division=dhaka" className="hover:text-emerald-400 transition">
                  {isBangla ? 'ঢাকা বিভাগ' : 'Dhaka Division'}
                </Link>
              </li>
              <li>
                <Link href="/search?division=chattogram" className="hover:text-emerald-400 transition">
                  {isBangla ? 'চট্টগ্রাম' : 'Chattogram'}
                </Link>
              </li>
              <li>
                <Link href="/search?division=sylhet" className="hover:text-emerald-400 transition">
                  {isBangla ? 'সিলেট' : 'Sylhet'}
                </Link>
              </li>
              <li>
                <Link href="/search?division=rajshahi" className="hover:text-emerald-400 transition">
                  {isBangla ? 'রাজশাহী' : 'Rajshahi'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h6 className="font-bold text-white text-sm mb-3">
              {isBangla ? 'সহায়তা ও তথ্য' : 'Help & Guidelines'}
            </h6>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <span className="hover:text-white cursor-pointer transition">
                  {t('safetyLearnMore')}
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition">
                  {isBangla ? 'বিজ্ঞাপন বুস্ট নির্দেশিকা' : 'How to Promote Fast'}
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition">
                  {isBangla ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}
                </span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition">
                  {isBangla ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 BazaarBondhu Marketplace Ltd. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Powered by Next.js & PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
