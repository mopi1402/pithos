import { RotateCcw } from "lucide-react";
import { BLOCK_PALETTE } from "@/data/blocks";
import type { EmailBlock } from "@/lib/types";

export function BlockPalette({ onAdd, onReset, showLabels }: {
  onAdd: (block: EmailBlock) => void;
  onReset: () => void;
  showLabels?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] text-slate-400 uppercase tracking-wide font-medium shrink-0">Add</span>
      {BLOCK_PALETTE.map((def) => (
        <button
          key={def.type}
          onClick={() => onAdd(def.create())}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <span>{def.emoji}</span>
          {showLabels !== false && <span className={showLabels ? "" : "hidden sm:inline"}>{def.label}</span>}
        </button>
      ))}
      <div className="flex-1" />
      <button onClick={onReset} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="Reset">
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
