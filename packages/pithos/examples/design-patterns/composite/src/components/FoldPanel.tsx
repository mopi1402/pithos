import { FileText, Folder, CornerRightUp } from "lucide-react";
import type { FoldStep } from "@/lib/types";
import { formatSize } from "@/lib/helpers";

type FoldPanelProps = {
  steps: FoldStep[];
};

export function FoldPanel({ steps }: FoldPanelProps) {
  return (
    <div className="font-mono text-xs">
      <div className="flex items-center gap-2 text-slate-500 mb-3 text-[11px]">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        fold traverses bottom-up — leaves emit, branches reduce
      </div>
      <div className="space-y-0.5 overflow-auto pr-1">
        {steps.map((step, i) => (
          <div
            key={`${step.name}-${i}`}
            className={`
              flex items-center gap-2 py-1.5 px-2.5 rounded-md transition-colors
              ${step.type === "branch"
                ? "bg-indigo-500/10 text-indigo-300"
                : "text-slate-400 hover:bg-white/[0.03]"
              }
            `}
          >
            <span className="text-slate-600 w-5 text-right shrink-0">{i + 1}</span>
            <span className="text-slate-700 shrink-0">│</span>
            {step.type === "leaf" ? (
              <FileText className="w-3 h-3 shrink-0 text-slate-500" />
            ) : (
              <Folder className="w-3 h-3 shrink-0 text-indigo-400" />
            )}
            <span className="truncate">{step.name}</span>
            {step.type === "branch" && (
              <CornerRightUp className="w-3 h-3 text-indigo-400/60 shrink-0" />
            )}
            <span className={`ml-auto shrink-0 tabular-nums ${
              step.type === "branch" ? "text-indigo-300" : "text-slate-500"
            }`}>
              {step.type === "branch" ? `Σ ${formatSize(step.result)}` : formatSize(step.result)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
