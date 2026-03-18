import { Loader2 } from "lucide-react";
import { SOURCE_CONFIG } from "@/data/sources";
import type { SourceType } from "@/lib/types";

export function SourceToggle({ source, active, count, loading, onToggle }: {
  source: SourceType;
  active: boolean;
  count: number;
  loading?: boolean;
  onToggle: () => void;
}) {
  const config = SOURCE_CONFIG[source];
  return (
    <button
      onClick={onToggle}
      className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border text-[12px] font-medium whitespace-nowrap overflow-hidden transition-colors duration-200 ${
        active
          ? "border-white/20 bg-white/10 text-slate-200"
          : "border-white/5 bg-white/[0.02] text-slate-600 hover:border-white/10"
      }`}
    >
      <span className="shrink-0">{config.emoji}</span>
      <span className="truncate">{config.label}</span>
      <span className="shrink-0 w-7 flex items-center justify-center">
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: config.color }} />
        ) : (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono tabular-nums text-white" style={{ background: config.color }}>
            {count}
          </span>
        )}
      </span>
    </button>
  );
}
