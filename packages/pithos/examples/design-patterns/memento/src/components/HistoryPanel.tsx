import { Trash2 } from "lucide-react";
import type { Snapshot } from "@pithos/core/eidos/memento/memento";
import type { PhotoState } from "@/lib/photoEditor";
import { FILTER_DEFS, formatTime } from "@/lib/photoEditor";

export function HistoryPanel({ snapshots, activeIndex, onJumpTo, onClear }: {
  snapshots: ReadonlyArray<Snapshot<PhotoState>>;
  activeIndex: number;
  onJumpTo: (index: number) => void;
  onClear: () => void;
}) {
  return (
    <div className="p-2 space-y-1.5">
      {snapshots.length > 1 && (
        <button onClick={onClear} className="w-full py-2 rounded-lg bg-red-500/[0.06] border border-red-400/10 text-red-400/70 text-[11px] flex items-center justify-center gap-1.5 hover:bg-red-500/10 transition-colors">
          <Trash2 size={11} /> Clear History
        </button>
      )}
      {[...snapshots].reverse().map((snap, revIdx) => {
        const idx = snapshots.length - 1 - revIdx;
        return (
          <SnapshotCard
            key={snap.timestamp}
            snap={snap}
            index={idx}
            isCurrent={idx === activeIndex}
            previous={idx > 0 ? snapshots[idx - 1] : undefined}
            onClick={() => onJumpTo(idx)}
          />
        );
      })}
    </div>
  );
}

function SnapshotCard({ snap, index, isCurrent, previous, onClick }: {
  snap: Snapshot<PhotoState>;
  index: number;
  isCurrent: boolean;
  previous?: Snapshot<PhotoState>;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className={`w-full rounded-md transition-all text-left group overflow-hidden ${isCurrent ? "bg-white/[0.07] ring-1 ring-white/[0.1]" : "hover:bg-white/[0.04]"}`} aria-label={`Restore snapshot ${index + 1}`}>
      <img src={snap.state.thumbnail} alt="" className={`w-full aspect-video object-cover border-b ${isCurrent ? "border-white/20" : "border-white/[0.06]"}`} />
      <div className="px-2 py-1.5">
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-medium truncate ${isCurrent ? "text-zinc-200" : "text-zinc-500 group-hover:text-zinc-400"}`}>
            {index === 0 ? "Original" : `Snapshot #${index}`}
          </span>
          <span className="text-[9px] text-zinc-700 font-mono">{formatTime(snap.timestamp)}</span>
        </div>
        {index > 0 && previous && <FilterDiffLabel current={snap.state} previous={previous.state} />}
      </div>
    </button>
  );
}

function FilterDiffLabel({ current, previous }: { current: PhotoState; previous: PhotoState }) {
  const changes: string[] = [];
  for (const { key, label } of FILTER_DEFS) {
    if (current[key] !== previous[key]) {
      const diff = current[key] - previous[key];
      const sign = diff > 0 ? "+" : "";
      changes.push(`${label} ${sign}${key === "blur" ? diff.toFixed(1) : Math.round(diff)}`);
    }
  }
  if (changes.length === 0) return null;
  return <div className="text-[8px] text-amber-500/50 truncate mt-0.5 font-mono">{changes.join(" · ")}</div>;
}
