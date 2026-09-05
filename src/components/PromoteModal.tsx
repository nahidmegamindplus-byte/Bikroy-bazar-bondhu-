'use client';

import React, { useState, useEffect } from 'react';
import { X, Zap, Check, ShieldCheck, ArrowRight, Smartphone, CreditCard } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { formatPriceBDT } from '@/lib/utils';

interface PromotionPackage {
  id: string;
  name: string;
  nameBn: string;
  type: string;
  durationDays: number;
  price: number;
  description: string;
  featuresJson: string;
}

interface PromoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  adId: string;
  adTitle: string;
  onPromoted?: () => void;
}

export default function PromoteModal({ isOpen, onClose, adId, adTitle, onPromoted }: PromoteModalProps) {
  const { isBangla, t } = useLanguage();
  const [packages, setPackages] = useState<PromotionPackage[]>([]);
  const [selectedPkg, setSelectedPkg] = useState<PromotionPackage | null>(null);
  const [step, setStep] = useState<'SELECT' | 'PAYMENT' | 'SUCCESS'>('SELECT');
  const [paymentMethod, setPaymentMethod] = useState<'BKASH' | 'NAGAD' | 'ROCKET' | 'CARD'>('BKASH');
  const [accountNumber, setAccountNumber] = useState('017XXXXXXXX');
  const [otpPin, setOtpPin] = useState('1234');
  const [loading, setLoading] = useState(false);
  const [txnResult, setTxnResult] = useState<{ transactionId: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('SELECT');
      fetch('/api/promotions/packages')
        .then((res) => res.json())
        .then((data) => {
          if (data.packages) {
            setPackages(data.packages);
            setSelectedPkg(data.packages[0]);
          }
        })
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPkg) return;
    setLoading(true);

    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adId,
          packageId: selectedPkg.id,
          method: paymentMethod,
          accountNo: accountNumber,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTxnResult(data);
        setStep('SUCCESS');
        if (onPromoted) onPromoted();
      } else {
        alert(data.error || 'Payment failed');
      }
    } catch {
      alert('Payment processing error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-white rounded-xl shadow-sm">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('promoteYourAd')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                {adTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Package Selection */}
        {step === 'SELECT' && (
          <div className="p-6">
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {packages.map((pkg) => {
                const isSelected = selectedPkg?.id === pkg.id;
                let features: string[] = [];
                try {
                  features = JSON.parse(pkg.featuresJson);
                } catch {}

                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPkg(pkg)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-base">
                            {isBangla ? pkg.nameBn : pkg.name}
                          </span>
                          <span className="text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                            {pkg.durationDays} {isBangla ? 'দিন' : 'Days'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {pkg.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                          {formatPriceBDT(pkg.price, isBangla)}
                        </span>
                      </div>
                    </div>

                    {features.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {features.map((f, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setStep('PAYMENT')}
                disabled={!selectedPkg}
                className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition flex items-center gap-2"
              >
                <span>{isBangla ? 'পেমেন্টে এগিয়ে যান' : 'Continue to Payment'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment Gateway Selection (bKash, Nagad, Rocket, Card) */}
        {step === 'PAYMENT' && selectedPkg && (
          <form onSubmit={handlePay} className="p-6 space-y-5">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Package Selected</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {isBangla ? selectedPkg.nameBn : selectedPkg.name}
                </span>
              </div>
              <span className="text-base font-black text-emerald-600">
                {formatPriceBDT(selectedPkg.price, isBangla)}
              </span>
            </div>

            {/* Payment Methods */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {isBangla ? 'পেমেন্ট মাধ্যম বেছে নিন' : 'Select Payment Gateway'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* bKash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('BKASH')}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition ${
                    paymentMethod === 'BKASH'
                      ? 'border-[#E2136E] bg-[#E2136E]/10 text-[#E2136E] font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-[#E2136E]" />
                  <span className="text-xs font-bold">bKash</span>
                </button>

                {/* Nagad */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('NAGAD')}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition ${
                    paymentMethod === 'NAGAD'
                      ? 'border-[#F7941D] bg-[#F7941D]/10 text-[#F7941D] font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-[#F7941D]" />
                  <span className="text-xs font-bold">Nagad</span>
                </button>

                {/* Rocket */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('ROCKET')}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition ${
                    paymentMethod === 'ROCKET'
                      ? 'border-[#8C3494] bg-[#8C3494]/10 text-[#8C3494] font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-[#8C3494]" />
                  <span className="text-xs font-bold">Rocket</span>
                </button>

                {/* Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition ${
                    paymentMethod === 'CARD'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  <span className="text-xs font-bold">Card</span>
                </button>
              </div>
            </div>

            {/* Gateway Interactive Inputs */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {paymentMethod === 'CARD' ? 'Card Number' : `${paymentMethod} Mobile Account Number`}
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder={paymentMethod === 'CARD' ? '4111 2222 3333 4444' : '017XXXXXXXX'}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {paymentMethod === 'CARD' ? 'Expiry & CVV' : 'OTP / PIN'}
                  </label>
                  <input
                    type="password"
                    required
                    value={otpPin}
                    onChange={(e) => setOtpPin(e.target.value)}
                    placeholder="••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex items-end">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>256-Bit SSL Encrypted</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('SELECT')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm shadow-md transition disabled:opacity-60 flex items-center gap-2"
              >
                {loading ? 'Verifying Payment...' : `Pay ${formatPriceBDT(selectedPkg.price, isBangla)}`}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 'SUCCESS' && txnResult && (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('paymentSuccess')}
            </h4>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl inline-block text-xs font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Transaction ID: <span className="font-bold text-emerald-600">{txnResult.transactionId}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Your promotion has been activated server-side and your ad is now boosted to thousands of active buyers.
            </p>
            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
