'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  MessageSquare,
  Send,
  Lock,
  ShieldCheck,
  Search,
  Camera,
} from 'lucide-react';

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get('user');

  const { currentUser, profiles, messages, sendMessage, isLoading } = useAuth();

  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auth guard
  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, isLoading, router]);

  const isVerified = currentUser?.verification_status === 'verified';

  useEffect(() => {
    if (targetUserId && targetUserId !== currentUser?.id) {
      setActivePartnerId(targetUserId);
    } else if (!activePartnerId && profiles.length > 0) {
      const other = profiles.find((p) => p.id !== currentUser?.id);
      if (other) setActivePartnerId(other.id);
    }
  }, [targetUserId, currentUser?.id, profiles, activePartnerId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activePartnerId]);

  const activePartner = profiles.find((p) => p.id === activePartnerId);

  // Filter messages for the current active conversation
  const threadMessages = messages.filter(
    (m) =>
      (m.sender_id === currentUser?.id && m.receiver_id === activePartnerId) ||
      (m.sender_id === activePartnerId && m.receiver_id === currentUser?.id)
  );

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activePartnerId) return;

    setIsSending(true);
    try {
      await sendMessage(activePartnerId, messageText);
      setMessageText('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] max-w-7xl mx-auto w-full p-2 sm:p-6 flex flex-col">
      <div className="flex-1 bg-zinc-900/70 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col md:flex-row">
        {/* Left: Conversations List */}
        <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col bg-zinc-950/50">
          {/* Header */}
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-white text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <span>Messages</span>
              </h2>
              {isVerified ? (
                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-semibold border border-teal-500/30">
                  Verified Chat
                </span>
              ) : (
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-semibold border border-rose-500/30">
                  Read Only
                </span>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search students..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Student list */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-900">
            {profiles.filter(
              (p) =>
                p.id !== currentUser?.id &&
                (searchFilter ? (p.full_name || '').toLowerCase().includes(searchFilter.toLowerCase()) : true)
            ).length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-10 px-4 text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-zinc-700 mx-auto" />
                <p className="text-xs text-zinc-500 font-semibold">No students yet</p>
                <p className="text-[11px] text-zinc-600">
                  Discover students and start a conversation!
                </p>
                <Link href="/discover" className="text-[11px] text-teal-400 hover:text-teal-300 font-semibold mt-1">
                  Go to Discover →
                </Link>
              </div>
            )}
            {profiles
              .filter(
                (p) =>
                  p.id !== currentUser?.id &&
                  (searchFilter ? (p.full_name || '').toLowerCase().includes(searchFilter.toLowerCase()) : true)
              )
              .map((profile) => {
                const isSelected = profile.id === activePartnerId;
                const lastMsg = [...messages]
                  .reverse()
                  .find(
                    (m) =>
                      (m.sender_id === profile.id && m.receiver_id === currentUser?.id) ||
                      (m.sender_id === currentUser?.id && m.receiver_id === profile.id)
                  );

                return (
                  <button
                    key={profile.id}
                    onClick={() => setActivePartnerId(profile.id)}
                    className={`w-full p-3.5 text-left flex items-center gap-3 transition-colors ${
                      isSelected
                        ? 'bg-zinc-800/90 border-l-4 border-purple-500'
                        : 'hover:bg-zinc-900/60'
                    }`}
                  >
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-zinc-800 shrink-0 flex items-center justify-center font-bold text-xs">
                      {isVerified && profile.avatar_url ? (
                        <Image src={profile.avatar_url} alt={profile.full_name || 'Student'} fill className="object-cover" unoptimized />
                      ) : (
                        <span>{(profile.full_name || 'U').charAt(0).toUpperCase()}</span>
                      )}
                      {profile.verification_status === 'verified' && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-zinc-950 z-10" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-xs text-white truncate">
                          {profile.full_name || 'CSJMU Student'}
                        </span>
                        {lastMsg && (
                          <span className="text-[10px] text-zinc-500">
                            {new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate">
                        {lastMsg ? lastMsg.content : profile.department || 'CSJMU'}
                      </p>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Right: Active Chat Thread */}
        <div className="flex-1 flex flex-col bg-zinc-950/30">
          {activePartner ? (
            <>
              {/* Chat Thread Header */}
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/40">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-zinc-800 flex items-center justify-center font-bold text-xs">
                    {isVerified && activePartner.avatar_url ? (
                      <Image src={activePartner.avatar_url} alt={activePartner.full_name} fill className="object-cover" unoptimized />
                    ) : (
                      <span>{activePartner.full_name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm">
                        {activePartner.full_name}
                      </h3>
                      {activePartner.verification_status === 'verified' && (
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      {isVerified ? `${activePartner.department} • Year ${activePartner.year}` : 'CSJMU Student'}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/profile/${activePartner.id}`}
                  className="text-xs font-semibold text-purple-400 hover:text-purple-300"
                >
                  View Profile →
                </Link>
              </div>

              {/* Messages Thread Content */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {threadMessages.length > 0 ? (
                  threadMessages.map((msg) => {
                    const isMine = msg.sender_id === currentUser?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                            isMine
                              ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-br-none shadow-md'
                              : 'bg-zinc-800/90 text-zinc-100 rounded-bl-none border border-zinc-700/60'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-zinc-500 mt-1 px-1">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 text-zinc-500 space-y-2">
                    <MessageSquare className="w-8 h-8 mx-auto opacity-40 text-purple-400" />
                    <p className="text-xs">No messages yet with {activePartner.full_name}.</p>
                    <p className="text-[11px] text-zinc-600">
                      Say hello to break the ice and vibe check!
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <div className="p-4 border-t border-zinc-800 bg-zinc-950/60">
                {isVerified ? (
                  <form onSubmit={handleSend} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder={`Message ${activePartner.full_name}...`}
                      className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={isSending || !messageText.trim()}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white text-xs font-bold shadow-glow-purple transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Send</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-rose-300">
                      <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>
                        <strong>Messaging is locked:</strong> Verify your CSJMU ID card to chat.
                      </span>
                    </div>
                    <Link
                      href="/verify-id"
                      className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-[11px] shadow transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Camera className="w-3 h-3" /> Verify ID Now
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-500">
              <MessageSquare className="w-12 h-12 text-zinc-700 mb-3" />
              <h3 className="font-bold text-zinc-300 text-sm">Select a Conversation</h3>
              <p className="text-xs text-zinc-500 max-w-xs mt-1">
                Choose a student from the sidebar to view your messages and chat.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center text-zinc-400 text-xs">
        Loading Messages...
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
