import { Send, RotateCcw } from "lucide-react";
import { useNotificationDemo } from "@/hooks/useNotificationDemo";
import { CHANNELS, CHANNEL_KEYS } from "@/data/channels";
import { NotificationCard } from "./NotificationCard";

export function NotificationDemo() {
  const { channel, setChannel, notifications, lastSent, handleSend, handleReset } = useNotificationDemo();
  const def = CHANNELS[channel];

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <div className="space-y-5">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">Notification Sender</h1>
          <p className="text-sm text-slate-500">Same <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">sendNotification(factory)</code> call — swap the factory, get a different notification</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Select factory</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CHANNEL_KEYS.map((key) => {
              const d = CHANNELS[key];
              const active = channel === key;
              return (
                <button key={key} onClick={() => setChannel(key)} className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${active ? `${d.bgColor} ${d.borderColor} ${d.color} shadow-sm ring-1 ring-offset-1 ${d.borderColor}` : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                  <span className="text-base">{d.icon}</span>{d.label}
                </button>
              );
            })}
          </div>
          <div className="bg-slate-900 rounded-lg p-3">
            <pre className="text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto">
              <span className="text-slate-500">{"// This line never changes:"}</span>{"\n"}
              <span className="text-amber-400">sendNotification</span><span className="text-slate-400">(</span><span className="text-emerald-400">create{def.label}Notification</span><span className="text-slate-400">)</span>
            </pre>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSend} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white shadow-sm transition-all ${def.buttonColor}`}>
              <Send className="w-4 h-4" />Send {def.label}
            </button>
            {notifications.length > 0 && (
              <button onClick={handleReset} className="p-2.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors" title="Clear all"><RotateCcw className="w-4 h-4" /></button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Sent Notifications</span>
            <span className="text-xs text-slate-400 tabular-nums">{notifications.length} sent</span>
          </div>
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">Pick a channel and hit Send. The consumer code stays the same.</div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
              {notifications.map((notif) => <NotificationCard key={notif.id} notif={notif} isNew={lastSent === notif.id} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
