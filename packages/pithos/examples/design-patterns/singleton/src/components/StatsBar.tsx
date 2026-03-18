import { RotateCcw } from "lucide-react";
import type { ServiceStats } from "@/lib/services";

interface StatsBarProps {
  stats: ServiceStats;
  onReset: () => void;
}

export function StatsBar({ stats, onReset }: StatsBarProps) {
  return (
    <div className="flex items-center gap-4 px-3 py-2.5 bg-white/[0.03] rounded-lg border border-white/[0.06]">
      <Stat label="Instances" value={stats.instancesCreated} color="text-emerald-400" />
      <div className="w-px h-4 bg-white/[0.06]" />
      <Stat label="Requests" value={stats.totalRequests} color="text-cyan-400" />
      <div className="w-px h-4 bg-white/[0.06]" />
      <Stat label="Reused" value={Math.max(0, stats.totalRequests - stats.instancesCreated)} color="text-amber-400" />
      <div className="ml-auto">
        <button
          onClick={onReset}
          className="p-1.5 rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] text-white/25 uppercase">{label}</span>
      <span className={`text-xs font-bold font-mono ${color}`}>{value}</span>
    </div>
  );
}
