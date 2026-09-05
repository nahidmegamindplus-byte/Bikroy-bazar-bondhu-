'use client';

import React, { useState } from 'react';
import { X, Lock, Phone, User, Store, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const { login } = useAuth();
  const { isBangla } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isBusiness, setIsBusiness] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const success = await login(phone, password);
        if (success) {
          onClose();
        } else {
          setError(isBangla ? 'ভুল ফোন নম্বর অথবা পাসওয়ার্ড' : 'Invalid phone number or password');
        }
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            phone,
            password,
            role: isBusiness ? 'BUSINESS_SELLER' : 'USER',
            businessName: isBusiness ? businessName : null,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          await login(phone, password);
          onClose();
        } else {
          setError(data.error || 'Registration failed');
        }
      }
    } catch {
      setError(isBangla ? 'অনাকাঙ্ক্ষিত ত্রুটি ঘটেছে' : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoPhone: string, demoPass: string) => {
    setLoading(true);
    setError('');
    const success = await login(demoPhone, demoPass);
    if (success) {
      onClose();
    } else {
      setError('Demo login failed');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 rounded-2xl mb-3">
            {mode === 'login' ? <Lock className="w-6 h-6" /> : <User className="w-6 h-6" />}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            {mode === 'login'
              ? isBangla ? 'বাজারবন্ধুতে লগইন করুন' : 'Welcome to BazaarBondhu'
              : isBangla ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create Free Account'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isBangla
              ? 'বিজ্ঞাপন দিতে বা বিক্রেতাদের সাথে চ্যাট করতে সাইন ইন করুন'
              : 'Sign in to post ads, manage listings, and chat with buyers'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-600 dark:text-rose-300 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isBangla ? 'আপনার পূর্ণ নাম' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isBangla ? 'যেমন: মোহাম্মদ তানভীর' : 'e.g. Tanvir Rahman'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isBangla ? 'মোবাইল নম্বর' : 'Phone Number'}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isBangla ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={isBusiness}
                  onChange={(e) => setIsBusiness(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <Store className="w-4 h-4 text-emerald-600" />
                {isBangla ? 'আমি একজন বিজনেস সেলার (প্রতিষ্ঠান/শো-রুম)' : 'Register as a Business Seller'}
              </label>

              {isBusiness && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder={isBangla ? 'প্রতিষ্ঠানের নাম' : 'Business / Shop Name'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm shadow-md transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (isBangla ? 'অপেক্ষা করুন...' : 'Processing...') : (mode === 'login' ? (isBangla ? 'লগইন করুন' : 'Sign In') : (isBangla ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account'))}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center">
          {mode === 'login' ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isBangla ? 'অ্যাকাউন্ট নেই?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setMode('register')}
                className="font-semibold text-emerald-600 hover:underline"
              >
                {isBangla ? 'রেজিস্ট্রেশন করুন' : 'Sign Up Free'}
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isBangla ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'Already have an account?'}{' '}
              <button
                onClick={() => setMode('login')}
                className="font-semibold text-emerald-600 hover:underline"
              >
                {isBangla ? 'লগইন করুন' : 'Sign In'}
              </button>
            </p>
          )}
        </div>

        {/* Demo Fast Login Bar */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block text-center mb-2.5">
            ⚡ {isBangla ? 'দ্রুত ডেমো লগইন টেস্ট করুন' : 'Instant Demo Logins'}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('01711000001', 'admin123')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" /> Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('01711000002', 'admin123')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> Moderator
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('01811000003', '123456')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition"
            >
              <Store className="w-3.5 h-3.5 text-amber-500" /> Business Seller
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('01611000005', '123456')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition"
            >
              <User className="w-3.5 h-3.5 text-emerald-500" /> Regular User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
