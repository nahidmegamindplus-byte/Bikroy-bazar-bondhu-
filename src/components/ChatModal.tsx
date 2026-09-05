'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Send,
  ShieldCheck,
  Store,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Check,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatPriceBDT, timeAgo } from '@/lib/utils';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  ad: {
    id: string;
    title: string;
    price: number;
    userId: string;
    sellerPhone?: string;
    images?: { url: string; isCover?: boolean }[];
    user?: {
      id: string;
      name: string;
      businessName?: string | null;
      isVerified?: boolean;
      role?: string;
    };
  };
}

export default function ChatModal({ isOpen, onClose, ad }: ChatModalProps) {
  const { user } = useAuth();
  const { isBangla, t } = useLanguage();

  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isUserOwner = user?.id === ad.userId;

  const quickQuestions = isBangla
    ? [
        'এটি কি এখনও পাওয়া যাবে?',
        'দাম কি কিছুটা কম রাখা যাবে?',
        'পণ্যটি কোথায় সামনাসামনি দেখতে পারি?',
        'হোম ডেলিভারি ব্যবস্থা আছে কি?',
      ]
    : [
        'Is this still available?',
        'Is the price slightly negotiable?',
        'Where can I inspect the item in person?',
        'Do you offer home delivery in Dhaka?',
      ];

  // Initialize or fetch conversation for this ad
  const loadConversation = async () => {
    if (!isOpen || !user) return;
    try {
      const res = await fetch(`/api/conversations?adId=${ad.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.conversation) {
          setConversation(data.conversation);
          setMessages(data.conversation.messages || []);
        } else if (!isUserOwner) {
          // Automatically initialize empty conversation
          const initRes = await fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adId: ad.id }),
          });
          if (initRes.ok) {
            const initData = await initRes.json();
            setConversation(initData.conversation);
            setMessages(initData.conversation?.messages || []);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      setLoading(true);
      loadConversation();
      // Poll every 3 seconds for live replies
      const interval = setInterval(loadConversation, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, user, ad.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || !user) return;

    setSending(true);
    try {
      if (conversation?.id) {
        const res = await fetch(`/api/conversations/${conversation.id}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: text.trim() }),
        });
        if (res.ok) {
          setInputMessage('');
          loadConversation();
        }
      } else {
        const res = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adId: ad.id, message: text.trim() }),
        });
        if (res.ok) {
          const data = await res.json();
          setConversation(data.conversation);
          setMessages(data.conversation?.messages || []);
          setInputMessage('');
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const coverImg =
    ad.images?.find((img) => img.isCover)?.url ||
    ad.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';

  const sellerName = ad.user?.businessName || ad.user?.name || 'Seller';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col h-[600px] max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-sm">
              {sellerName.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {sellerName}
                </h4>
                {ad.user?.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Active Marketplace Seller
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {conversation?.id && (
              <Link
                href={`/dashboard/messages?conv=${conversation.id}`}
                className="p-2 text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs flex items-center gap-1"
                title="Open in Full Inbox"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ad Quick Header Pill */}
        <div className="px-4 py-2.5 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-10 h-8 rounded-lg overflow-hidden bg-slate-900 shrink-0">
              <Image src={coverImg} alt="" fill className="object-cover" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              {ad.title}
            </span>
          </div>
          <span className="text-xs font-black text-emerald-600 shrink-0">
            {formatPriceBDT(ad.price, isBangla)}
          </span>
        </div>

        {/* Owner Notice if viewing own ad */}
        {isUserOwner && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-center justify-between">
            <span>This is your own advertisement. You can review customer inquiries here.</span>
            <Link href="/dashboard/messages" className="font-bold underline ml-2 shrink-0">
              Go to Inbox
            </Link>
          </div>
        )}

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30 dark:bg-slate-900/30">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              Loading chat...
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-2">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                {isBangla ? 'বিক্রেতাকে সরাসরি মেসেজ পাঠান' : 'Direct Message with Seller'}
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                {isBangla
                  ? 'নিচের দ্রুত প্রশ্নগুলোতে ক্লিক করুন অথবা আপনার প্রশ্ন লিখে সেন্ড করুন।'
                  : 'Click a quick question below or type your message to inquire about this listing.'}
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.senderId === user?.id;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-br-sm shadow-sm'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 mt-1 px-1 font-medium">
                    {timeAgo(m.createdAt, isBangla)}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        {!isUserOwner && (
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto flex gap-1.5 scrollbar-none">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                disabled={sending}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] font-medium text-slate-600 dark:text-slate-300 shrink-0 border border-slate-200 dark:border-slate-700 transition"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t('typeMessage')}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={sending || !inputMessage.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
