'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { Message } from '@/lib/types';

export function NotificationManager() {
  const { currentUser, messages } = useAuth();
  const router = useRouter();
  const prevMessageCountRef = useRef(0);
  const permissionRequestedRef = useRef(false);

  // Request push notification permission after user logs in
  useEffect(() => {
    if (!currentUser || permissionRequestedRef.current) return;
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted' || Notification.permission === 'denied') return;

    permissionRequestedRef.current = true;
    // Ask after 5 seconds of being logged in, not immediately
    const timer = setTimeout(() => {
      Notification.requestPermission();
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentUser]);

  // Watch for new incoming messages and fire browser notification
  useEffect(() => {
    if (!currentUser || !messages) return;

    const incomingMessages = messages.filter((m: Message) => m.receiver_id === currentUser.id);
    const newCount = incomingMessages.length;
    const prevCount = prevMessageCountRef.current;

    if (prevCount === 0) {
      // Initial load — just set the baseline
      prevMessageCountRef.current = newCount;
      return;
    }

    if (newCount > prevCount) {
      // New messages arrived
      const newMessages = incomingMessages.slice(prevCount);
      prevMessageCountRef.current = newCount;

      // Only fire notification if tab is hidden / not focused
      if (document.hidden && Notification.permission === 'granted') {
        newMessages.forEach((msg: Message) => {
          const notification = new Notification('New message on FindMyVibe 💬', {
            body: 'You have a new message. Tap to view.',
            icon: '/logo.jpg',
            badge: '/logo.jpg',
            tag: `msg-${msg.sender_id}`, // Group by sender
          } as NotificationOptions & { renotify?: boolean });

          notification.onclick = () => {
            window.focus();
            router.push(`/messages?user=${msg.sender_id}`);
            notification.close();
          };
        });
      }
    }
  }, [messages, currentUser, router]);

  return null; // Invisible utility component
}
