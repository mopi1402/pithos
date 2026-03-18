import { Zap } from "lucide-react";
import type { ProxyStats } from "@/lib/llmProxy";

export function StatsPanel({ stats }: { stats: ProxyStats }) {
  return (
    <>
      {/* Mobile: 2x2 compact grid */}
      <div className="grid grid-cols-4 gap-1.5 sm:hidden">
        <MiniStat value={`$${stats.totalCost.toFixed(3)}`} label="cost" color="text-white/70" />
        <MiniStat value={`$${stats.totalSaved.toFixed(3)}`} label="saved" color="text-emerald-400" />
        <MiniStat value={`${stats.cacheHits}`} label="cache" color="text-amber-400" />
        <MiniStat value={`${stats.rateLimitHits}`} label="limit" color="text-red-400" />
      </div>

      {/* Desktop: 2x2 grid */}
      <div className="hidden sm:grid grid-cols-2 gap-2">
        <StatCard label="Total Cost" value={`$${stats.totalCost.toFixed(3)}`} color="text-white/70" />
        <StatCard label="Saved" value={`$${stats.totalSaved.toFixed(3)}`} color="text-emerald-400" />
        <StatCard label="Cache Hits" value={`${stats.cacheHits}`} color="text-amber-400" icon={<Zap className="w-3 h-3 text-amber-400" />} />
        <StatCard label="Rate Limited" value={`${stats.rateLimitHits}`} color="text-red-400" />
      </div>
    </>
  );
}

function MiniStat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.04] rounded-md px-2 py-1.5 text-center">
      <div className={`text-[11px] font-bold font-mono ${color}`}>{value}</div>
      <div className="text-[8px] text-white/20 uppercase">{label}</div>
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: string; color: string; icon?: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.04] rounded-lg px-3 py-2.5 text-center">
      <div className="text-[10px] text-white/25 uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-sm font-bold font-mono ${color} flex items-center justify-center gap-1`}>
        {icon}{value}
      </div>
    </div>
  );
}
