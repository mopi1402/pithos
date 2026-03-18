import { CHANNELS } from "@/data/channels";
import type { AppNotification } from "@/lib/types";

export function NotificationCard({ notif, isNew }: { notif: AppNotification; isNew: boolean }) {
  const def = CHANNELS[notif.channel];
  const time = new Date(notif.sentAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className={`px-4 py-3 transition-all duration-500 ${isNew ? def.bgColor : ""}`}>
      <div className="flex items-start gap-3">
        <div className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ${def.bgColor} ${def.color}`}>
          <span className="text-lg">{def.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold uppercase tracking-wide ${def.color}`}>{def.label}</span>
            <span className="text-xs text-slate-400 tabular-nums">{time}</span>
          </div>
          <p className="text-sm font-medium text-slate-800 mb-1.5">{notif.title}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {notif.fields.map((f) => (
              <div key={f.label} className="text-xs">
                <span className="text-slate-400">{f.label}: </span>
                <span className="text-slate-600">{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
