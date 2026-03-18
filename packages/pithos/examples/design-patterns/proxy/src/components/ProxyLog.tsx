import type { ProxyLogEntry } from "@/lib/llmProxy";

const TYPE_CONFIG: Record<ProxyLogEntry["type"], { label: string; bg: string; text: string }> = {
  "cache-miss": { label: "MISS", bg: "bg-blue-500/15", text: "text-blue-400" },
  "cache-hit":  { label: "HIT",  bg: "bg-emerald-500/15", text: "text-emerald-400" },
  "rate-limited": { label: "LIMIT", bg: "bg-red-500/15", text: "text-red-400" },
  "fallback":   { label: "FALLBACK", bg: "bg-amber-500/15", text: "text-amber-400" },
};

export function ProxyLog({ logs, className = "" }: { logs: ProxyLogEntry[]; className?: string }) {
  return (
    <div className={`bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden flex flex-col ${className}`}>
      <div className="h-10 px-4 flex items-center gap-2 border-b border-white/[0.04] shrink-0">
        <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
        <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">Proxy Log</span>
      </div>

      {logs.length === 0 ? (
        <div className="p-6 text-center text-xs text-white/20">Ask a question to see the proxy in action</div>
      ) : (
        <div className="overflow-y-auto flex-1 divide-y divide-white/[0.03]">
          {logs.map((entry) => (
            <LogEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}

function LogEntryCard({ entry }: { entry: ProxyLogEntry }) {
  const config = TYPE_CONFIG[entry.type];

  return (
    <div className="px-4 py-2.5">
      <div className="flex items-center gap-2 mb-1">
        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${config.bg} ${config.text}`}>
          {config.label}
        </span>
        {entry.provider && (
          <span className="text-[10px] text-white/20">via {entry.provider}</span>
        )}
        <span className="ml-auto text-[10px] text-white/15 tabular-nums font-mono">{entry.duration}ms</span>
      </div>
      <div className="text-xs text-white/40 truncate mb-0.5">"{entry.question}"</div>
      <div className="flex items-center gap-3 text-[10px] text-white/20">
        <span className="tabular-nums font-mono">{entry.cost > 0 ? `$${entry.cost.toFixed(3)}` : "$0.000"}</span>
        {entry.type === "cache-hit" && <span className="text-emerald-400/70">⚡ saved</span>}
        {entry.type === "fallback" && <span className="text-amber-400/70">primary down</span>}
        {entry.type === "rate-limited" && <span className="text-red-400/70">throttled</span>}
      </div>
    </div>
  );
}
