import { Play } from "lucide-react";
import type { LogEntry } from "@/lib/types";

export function ExecutionLog({ log }: { log: LogEntry[] }) {
  if (log.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-slate-400">
        <Play className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">Run analysis to see execution</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 font-mono text-xs">
      {log.map((entry, i) => (
        <div key={i} className={`flex items-start gap-2 p-2 rounded ${entry.action.includes("✓") ? "bg-emerald-50 text-emerald-700" : entry.action.includes("✗") || entry.action.includes("❌") ? "bg-red-50 text-red-700" : "bg-slate-50 text-slate-600"}`}>
          <span className="font-semibold shrink-0 w-24 truncate">{entry.decorator}</span>
          <span className="flex-1">{entry.action}</span>
          {entry.duration !== undefined && <span className="text-slate-400 shrink-0">{entry.duration}ms</span>}
        </div>
      ))}
    </div>
  );
}
