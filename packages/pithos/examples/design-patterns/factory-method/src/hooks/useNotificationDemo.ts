import { useState, useCallback, useRef, useEffect } from "react";
import { sendNotification, factories, resetCounter } from "@/lib/factory";
import type { AppNotification, ChannelKey } from "@/lib/types";

export function useNotificationDemo() {
  const [channel, setChannel] = useState<ChannelKey>("email");
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [lastSent, setLastSent] = useState<string | null>(null);
  const lastSentTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(lastSentTimerRef.current);
  }, []);

  const handleSend = useCallback(() => {
    const notif = sendNotification(factories[channel]);
    setNotifications((prev) => [notif, ...prev]);
    setLastSent(notif.id);
    clearTimeout(lastSentTimerRef.current);
    lastSentTimerRef.current = setTimeout(() => setLastSent(null), 600);
  }, [channel]);

  const handleReset = useCallback(() => {
    setNotifications([]);
    setLastSent(null);
    clearTimeout(lastSentTimerRef.current);
    resetCounter();
  }, []);

  return { channel, setChannel, notifications, lastSent, handleSend, handleReset };
}
