import type { FilterState, FilterKey, FilterDef } from "@/lib/photoEditor";
import { FILTER_DEFS } from "@/lib/photoEditor";
import { FILTER_ICONS } from "./constants";

export function FilterSliders({ filters, onChange, onCommit, compact }: {
  filters: FilterState;
  onChange: (key: FilterKey, value: number) => void;
  onCommit: () => void;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="space-y-1.5">
        {FILTER_DEFS.map((def) => {
          const Icon = FILTER_ICONS[def.key];
          return (
            <div key={def.key} className="bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.04]">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <Icon size={12} style={{ color: def.color }} className="opacity-70" />
                  <span className="text-[11px] text-zinc-400">{def.label}</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-600">
                  {def.key === "blur" ? filters[def.key].toFixed(1) : filters[def.key]}{def.unit}
                </span>
              </div>
              <SliderTrack {...def} value={filters[def.key]} onChange={(v) => onChange(def.key, v)} onCommit={onCommit} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {FILTER_DEFS.map((def) => {
        const Icon = FILTER_ICONS[def.key];
        return (
          <div key={def.key} className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-2">
              <Icon size={12} style={{ color: def.color }} className="opacity-60" />
              <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{def.label}</span>
              <span className="ml-auto text-[10px] font-mono text-zinc-600">
                {def.key === "blur" ? filters[def.key].toFixed(1) : filters[def.key]}{def.unit}
              </span>
            </div>
            <SliderTrack {...def} value={filters[def.key]} onChange={(v) => onChange(def.key, v)} onCommit={onCommit} />
          </div>
        );
      })}
    </div>
  );
}

function SliderTrack({ min, max, step, value, color, label, onChange, onCommit }: FilterDef & { value: number; onChange: (v: number) => void; onCommit: () => void }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative h-4 flex items-center">
      <div className="absolute left-0 right-0 h-1.5 rounded-full bg-white/[0.06] pointer-events-none">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.7 }} />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        onMouseUp={onCommit}
        onTouchEnd={onCommit}
        className="slider-input absolute inset-0 w-full"
        aria-label={label}
      />
    </div>
  );
}
