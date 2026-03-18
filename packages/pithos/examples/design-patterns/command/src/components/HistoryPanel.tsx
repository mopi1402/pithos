import { GripVertical } from "lucide-react";
import type { HistoryEntry } from "@/lib/types";

export function HistoryPanel({ history, cursor }: { history: readonly HistoryEntry[]; cursor: number }) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-slate-500">
        <GripVertical className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm text-center">Drag tasks to see commands</p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 font-mono text-xs">
      {history.map((entry, i) => {
        const isActive = i <= cursor;
        const isCurrent = i === cursor;
        return (
          <div key={entry.id} className={`p-2 rounded transition-all duration-400 ${isActive ? (isCurrent ? "bg-indigo-500 text-white" : "bg-slate-700 text-slate-200") : "bg-slate-900 text-slate-500"}`}>
            <span className="text-slate-400 mr-2">#{i + 1}</span>
            {entry.description}
            {isCurrent && <span className="ml-2 text-indigo-200">◀</span>}
          </div>
        );
      })}
    </div>
  );
}
