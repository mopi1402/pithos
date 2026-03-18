import type { TennisState } from "@/lib/tennisMachine";

export function TransitionHistory({ history, fillHeight }: { history: TennisState[]; fillHeight?: boolean }) {
  return (
    <div className={fillHeight ? "flex flex-col h-full" : ""}>
      <div className="text-sm font-medium text-slate-700 mb-2 shrink-0">Transition History</div>
      <div className={`flex flex-wrap gap-2 overflow-y-auto content-start ${fillHeight ? "flex-1 min-h-0" : "max-h-32"}`}>
        {history.map((state, i) => (
          <div key={i} className="flex items-center gap-1">
            <span
              className={`px-2 py-1 rounded text-sm font-mono ${
                i === history.length - 1 ? "text-white" : "bg-slate-100 text-slate-600"
              }`}
              style={i === history.length - 1 ? { background: "#c75b12" } : undefined}
            >
              {state}
            </span>
            {i < history.length - 1 && <span className="text-slate-400">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
