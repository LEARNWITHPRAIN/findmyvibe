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
  Edit2,
  Trash2,
  Check,
  X,
  ArrowLeft,
  Users,
} from 'lucide-react';

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get('user');

  const {
    currentUser,
    profiles,
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    isLoading,
  } = useAuth();

  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState<boolean>(false);
  const [messageText, setMessageText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editInputText, setEditInputText] = useState('');
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
      setMobileShowChat(true);
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

  // Filter messages for current conversation
  const threadMessages = messages.filter(
    (m) =>
      (m.sender_id === currentUser?.id && m.receiver_id === activePartnerId) ||
      (m.sender_id === activePartnerId && m.receiver_id === currentUser?.id)
  );

  const handleSelectPartner = (id: string) => {
    setActivePartnerId(id);
    setMobileShowChat(true);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activePartnerId) return;

    const text = messageText;
    setMessageText('');
    setIsSending(true);
    try {
      await sendMessage(activePartnerId, text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleStartEdit = (msgId: string, currentContent: string) => {
    setEditingMsgId(msgId);
    setEditInputText(currentContent);
  };

  const handleSaveEdit = async (msgId: string) => {
    if (!editInputText.trim()) return;
    await editMessage(msgId, editInputText.trim());
    setEditingMsgId(null);
    setEditInputText('');
  };

  const handleCancelEdit = () => {
    setEditingMsgId(null);
    setEditInputText('');
  };

  const handleDelete = async (msgId: string) => {
    if (window.confirm('Unsend this message? It will be removed for everyone.')) {
      await deleteMessage(msgId);
    }
  };

  const activeFilteredProfiles = profiles.filter(
    (p) =>
      p.id !== currentUser?.id &&
      (searchFilter ? (p.full_name || '').toLowerCase().includes(searchFilter.toLowerCase()) : true)
  );

  return (
    <div className="h-[calc(100dvh-4.1rem)] w-full flex flex-col overflow-hidden bg-zinc-950 select-none">
      <div className="flex-1 flex overflow-hidden w-full h-full max-w-[1600px] mx-auto border-x border-zinc-800/80">
        
        {/* Left: Conversations Sidebar */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-zinc-800 flex flex-col bg-zinc-950 shrink-0 ${
            mobileShowChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/40">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-black text-white text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <span>Messages</span>
              </h2>
              {isVerified ? (
                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full font-bold border border-teal-500/40">
                  Verified Chat
                </span>
              ) : (
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full font-bold border border-rose-500/40">
                  Read Only
                </span>
              )}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search CSJMU students..."
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Student list */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-900/60 custom-scrollbar">
            {activeFilteredProfiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center space-y-2">
                <Users className="w-8 h-8 text-zinc-700 mx-auto" />
                <p className="text-xs text-zinc-400 font-semibold">No students found</p>
                <p className="text-[11px] text-zinc-600 max-w-[200px]">
                  Explore batchmates in Discover and start chatting!
                </p>
                <Link href="/discover" className="text-xs text-teal-400 hover:text-teal-300 font-semibold mt-2 inline-block">
                  Go to Discover →
                </Link>
              </div>
            ) : (
              activeFilteredProfiles.map((profile) => {
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
                    onClick={() => handleSelectPartner(profile.id)}
                    className={`w-full p-3.5 text-left flex items-center gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-900 border-l-4 border-purple-500 text-white'
                        : 'hover:bg-zinc-900/50 text-zinc-300'
                    }`}
                  >
                    <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-zinc-800 shrink-0 flex items-center justify-center font-bold text-xs">
                      {isVerified && profile.avatar_url ? (
                        <Image src={profile.avatar_url} alt={profile.full_name || 'Student'} fill className="object-cover" unoptimized />
                      ) : (
                        <span>{(profile.full_name || 'U').charAt(0).toUpperCase()}</span>
                      )}
                      {profile.verification_status === 'verified' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-zinc-950 z-10" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-xs text-white truncate">
                          {profile.full_name || 'CSJMU Student'}
                        </span>
                        {lastMsg && (
                          <span className="text-[10px] text-zinc-500 shrink-0">
                            {new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate">
                        {lastMsg ? lastMsg.content : profile.department || 'CSJMU Student'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Chat Thread Window */}
        <div
          className={`flex-1 flex flex-col bg-zinc-950/80 overflow-hidden ${
            !mobileShowChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activePartner ? (
            <>
              {/* Chat Thread Header */}
              <div className="p-3.5 sm:p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setMobileShowChat(false)}
                    className="md:hidden p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-zinc-800 flex items-center justify-center font-bold text-xs shrink-0">
                    {isVerified && activePartner.avatar_url ? (
                      <Image src={activePartner.avatar_url} alt={activePartner.full_name || 'Student'} fill className="object-cover" unoptimized />
                    ) : (
                      <span>{(activePartner.full_name || 'U').charAt(0).toUpperCase()}</span>
                    )}
                    {activePartner.verification_status === 'verified' && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-zinc-950 z-10" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-white text-sm truncate">
                        {activePartner.full_name || 'CSJMU Student'}
                      </h3>
                      {activePartner.verification_status === 'verified' && (
                        <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {isVerified
                        ? `${activePartner.department || 'CSJMU'} ${activePartner.year ? `• Year ${activePartner.year}` : ''}`
                        : 'CSJMU Student'}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/profile/${activePartner.id}`}
                  className="text-xs font-semibold text-purple-400 hover:text-purple-300 px-3 py-1.5 rounded-xl hover:bg-purple-950/40 transition-colors shrink-0"
                >
                  View Profile →
                </Link>
              </div>

              {/* Messages History List */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5 custom-scrollbar">
                {threadMessages.length > 0 ? (
                  threadMessages.map((msg) => {
                    const isMine = msg.sender_id === currentUser?.id;
                    const isEditing = editingMsgId === msg.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col group ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        {isEditing ? (
                          <div className="w-full max-w-md bg-zinc-900 border border-purple-500/60 rounded-2xl p-3 shadow-2xl space-y-2.5">
                            <input
                              type="text"
                              value={editInputText}
                              onChange={(e) => setEditInputText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(msg.id);
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                              autoFocus
                              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-teal-400"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" /> Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(msg.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-teal-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" /> Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="relative flex items-center gap-2 group/bubble">
                            {/* Action Buttons for own messages */}
                            {isMine && (
                              <div className="opacity-80 sm:opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-1.5 py-1 rounded-xl shadow-lg shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(msg.id, msg.content)}
                                  title="Edit message"
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-purple-300 hover:bg-zinc-800 transition-colors cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(msg.id)}
                                  title="Unsend / Delete message"
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}

                            <div
                              className={`max-w-[85vw] sm:max-w-md rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                                isMine
                                  ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-br-none shadow-md'
                                  : 'bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-bl-none shadow-sm'
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mt-1 px-1">
                          <span>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {msg.updated_at && (
                            <span className="text-[9px] text-zinc-600 italic">(edited)</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-20 text-zinc-500 space-y-3">
                    <div className="w-12 h-12 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-zinc-300">No messages yet with {activePartner.full_name}.</p>
                    <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                      Send a message to connect and match vibes on CSJMU campus!
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Bottom Bar */}
              <div className="p-3 sm:p-4 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md shrink-0">
                {isVerified ? (
                  <form onSubmit={handleSend} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder={`Message ${activePartner.full_name || 'student'}...`}
                      className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={isSending || !messageText.trim()}
                      className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-500 hover:to-teal-400 text-white text-xs font-bold shadow-glow-purple transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">Send</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-rose-300">
                      <Lock className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>
                        <strong>Messaging locked:</strong> Verify your CSJMU student ID card to start chatting.
                      </span>
                    </div>
                    <Link
                      href="/verify-id"
                      className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <Camera className="w-3.5 h-3.5" /> Verify ID Now
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-500">
              <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-600">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-zinc-200 text-sm">Select a Conversation</h3>
              <p className="text-xs text-zinc-500 max-w-xs mt-1">
                Choose a CSJMU student from the list on the left to start chatting.
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
      <div className="h-[calc(100dvh-4rem)] flex items-center justify-center text-zinc-400 text-xs">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
