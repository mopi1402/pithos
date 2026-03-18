import type { ChannelKey, ChannelDef } from "@/lib/types";

export const CHANNELS: Record<ChannelKey, ChannelDef> = {
  email: { label: "Email", icon: "✉️", color: "text-blue-700", bgColor: "bg-blue-50", borderColor: "border-blue-200", buttonColor: "bg-blue-600 hover:bg-blue-700" },
  sms: { label: "SMS", icon: "💬", color: "text-emerald-700", bgColor: "bg-emerald-50", borderColor: "border-emerald-200", buttonColor: "bg-emerald-600 hover:bg-emerald-700" },
  push: { label: "Push", icon: "🔔", color: "text-amber-700", bgColor: "bg-amber-50", borderColor: "border-amber-200", buttonColor: "bg-amber-600 hover:bg-amber-700" },
  slack: { label: "Slack", icon: "💼", color: "text-purple-700", bgColor: "bg-purple-50", borderColor: "border-purple-200", buttonColor: "bg-purple-600 hover:bg-purple-700" },
};

export const CHANNEL_KEYS = Object.keys(CHANNELS) as ChannelKey[];
