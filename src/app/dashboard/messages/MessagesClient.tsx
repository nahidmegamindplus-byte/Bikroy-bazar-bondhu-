'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Send, MessageSquare, ShieldCheck, Check, Clock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatPriceBDT, timeAgo } from '@/lib/utils';

export default function MessagesClient() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const { isBangla, t } = useLanguage();

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(searchParams.get('conv') || null);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
        if (!activeConvId && data.conversations?.length > 0) {
          setActiveConvId(data.conversations[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/conversations/${convId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setActiveConv(data.conversation);
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConvId) {
      fetchMessages(activeConvId);
      // Poll every 4 seconds for incoming messages
      const interval = setInterval(() => fetchMessages(activeConvId), 4000);
      return () => clearInterval(interval);
    }
  }, [activeConvId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConvId) return;

    setSending(true);
    try {
      const res = await fetch(`/api/conversations/${activeConvId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputMessage.trim() }),
      });

      if (res.ok) {
        setInputMessage('');
        fetchMessages(activeConvId);
        fetchConversations();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border shadow-sm max-w-md mx-auto">
        <h3 className="text-lg font-bold mb-2">Please Sign In</h3>
        <p className="text-xs text-slate-500 mb-6">Sign in to view your chats and communicate with sellers.</p>
        <Link href="/" className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[680px]">
      {/* Left Pane: Conversations Inbox */}
      <div
        className={`col-span-1 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 ${
          activeConvId ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            {t('conversations')}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {loading ? (
            <div className="p-6 text-center text-xs text-slate-500">Loading inbox...</div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              No conversations yet. Inquire on any ad listing to start chatting!
            </div>
          ) : (
            conversations.map((c) => {
              const otherUser = c.buyerId === user.id ? c.seller : c.buyer;
              const isSelected = activeConvId === c.id;
              const lastMsg = c.messages?.[0]?.text || 'Started a conversation';
              const lastTime = c.messages?.[0]?.createdAt || c.updatedAt;

              return (
                <button
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`w-full p-4 text-left transition flex items-start gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30'
                      : 'hover:bg-white dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-sm">
                    {otherUser?.name ? otherUser.name.slice(0, 1).toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                        {otherUser?.businessName || otherUser?.name}
                      </span>
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 shrink-0 font-medium">
                        {timeAgo(lastTime, isBangla)}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 truncate mt-0.5">
                      {c.ad?.title}
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-200 truncate mt-0.5 font-medium">
                      {lastMsg}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Pane: Chat Thread */}
      <div
        className={`col-span-1 md:col-span-2 flex flex-col h-full bg-white dark:bg-slate-900 ${
          !activeConvId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {activeConv ? (
          <>
            {/* Chat Thread Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveConvId(null)}
                  className="md:hidden p-1.5 rounded-lg hover:bg-slate-200 text-slate-600"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {activeConv.buyerId === user.id
                      ? activeConv.seller?.businessName || activeConv.seller?.name
                      : activeConv.buyer?.name}
                  </h4>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    {t('online')}
                  </span>
                </div>
              </div>

              {/* Linked Ad Quick Bar */}
              {activeConv.ad && (
                <Link
                  href={`/ad/${activeConv.ad.id}`}
                  className="hidden sm:flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs hover:border-emerald-500 transition max-w-xs truncate"
                >
                  <span className="truncate font-semibold text-slate-800 dark:text-white">
                    {activeConv.ad.title}
                  </span>
                  <span className="font-black text-emerald-600 shrink-0">
                    {formatPriceBDT(activeConv.ad.price, isBangla)}
                  </span>
                </Link>
              )}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => {
                const isMe = m.senderId === user.id;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-br-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-sm'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-300 mt-1 px-1 font-medium">
                      {timeAgo(m.createdAt, isBangla)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t('typeMessage')}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={sending || !inputMessage.trim()}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 text-xs">
            <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600 dark:text-slate-300">{t('noConversationSelected')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
