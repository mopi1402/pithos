import { SOURCE_CONFIG } from "@/data/sources";
import type { MapFeature } from "@/lib/types";

export function FeatureList({ features, onFeatureClick }: { features: MapFeature[]; onFeatureClick?: (f: MapFeature) => void }) {
  if (features.length === 0) {
    return <div className="text-center text-slate-600 text-sm py-8">No data</div>;
  }
  return (
    <div className="space-y-1 mt-2">
      {features.map((f) => {
        const config = SOURCE_CONFIG[f.kind];
        return (
          <div
            key={f.id}
            onClick={() => onFeatureClick?.(f)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
          >
            <span className="text-sm">{config.emoji}</span>
            <span className="text-[12px] text-slate-300 truncate flex-1">{f.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0" style={{ background: `${config.color}15`, color: config.color }}>
              {f.kind === "charging" ? `${f.meta.power}` : f.meta["best price"]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
