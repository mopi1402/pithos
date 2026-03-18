import type { LogEntry } from "@/lib/dashboard";

const EVENT_COLORS: Record<string, string> = {
  weatherChanged: "text-purple-600",
  flightSelected: "text-blue-600",
  flightDeselected: "text-slate-500",
  runwayUpdated: "text-amber-600",
  flightStatusChanged: "text-emerald-600",
};

export function MediatorLog({ logs, scrollRef }: { logs: LogEntry[]; scrollRef?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 h-full flex flex-col shadow-sm">
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">mediator log</span>
      </div>
      {!logs.length ? (
        <p className="text-xs text-slate-400 font-mono italic">awaiting events...</p>
      ) : (
        <div ref={scrollRef} className="space-y-1 overflow-y-auto min-h-0 flex-1">
          {logs.map((entry) => (
            <div key={entry.id} className="text-[11px] font-mono py-0.5">
              <div className="flex items-start gap-2">
                <span className="text-slate-400 shrink-0 w-[52px]">{entry.timestamp}</span>
                <div className="min-w-0">
                  <span className={`font-medium ${EVENT_COLORS[entry.event] ?? "text-slate-500"}`}>
                    {entry.event}
                  </span>
                  <div className="text-slate-500">{entry.detail}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
