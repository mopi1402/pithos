import { useState, useCallback } from "react";
import { sendNotification, factories, resetCounter } from "@/lib/factory";
import type { AppNotification, ChannelKey } from "@/lib/types";

export function useNotificationDemo() {
  const [channel, setChannel] = useState<ChannelKey>("email");
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [lastSent, setLastSent] = useState<string | null>(null);

  const handleSend = useCallback(() => {
    const notif = sendNotification(factories[channel]);
    setNotifications((prev) => [notif, ...prev]);
    setLastSent(notif.id);
    setTimeout(() => setLastSent(null), 600);
  }, [channel]);

  const handleReset = useCallback(() => {
    setNotifications([]);
    setLastSent(null);
    resetCounter();
  }, []);

  return { channel, setChannel, notifications, lastSent, handleSend, handleReset };
}
