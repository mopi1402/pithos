import { Check, ChevronRight, Play } from "lucide-react";
import { STEP_ORDER } from "@/data/profiles";

export function StepPipeline({ overrides, executingStep, completedSteps, accentColor }: {
  overrides: string[];
  executingStep: number | null;
  completedSteps: Set<number>;
  accentColor: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Play size={10} className="text-zinc-600" />
        <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-[0.1em]">Execution Pipeline</span>
      </div>
      <div className="relative">
        <div className="absolute left-[20px] top-3 bottom-3 w-[2px] bg-white/[0.12]" />
        <div className="space-y-0.5">
          {STEP_ORDER.map((step, i) => {
            const isOverridden = overrides.includes(step.key);
            const isExecuting = executingStep === i;
            const isDone = completedSteps.has(i);
            return (
              <div
                key={step.key}
                className={`relative flex items-center gap-3 px-2 py-2 rounded-lg transition-all duration-300 ${isExecuting ? "bg-white/[0.05]" : ""}`}
              >
                <div
                  className={`relative z-10 w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isDone
                      ? "bg-emerald-900 text-emerald-400 scale-100"
                      : isExecuting
                        ? "bg-[#18181b] text-white scale-110 ring-2 ring-white/20"
                        : "bg-[#18181b] text-zinc-700 border border-white/[0.06]"
                  }`}
                >
                  {isDone ? (
                    <Check size={11} strokeWidth={3} />
                  ) : isExecuting ? (
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  ) : (
                    <span className="text-[10px] font-mono">{i + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-medium transition-colors duration-300 ${
                      isExecuting ? "text-zinc-100" : isDone ? "text-zinc-300" : "text-zinc-600"
                    }`}>
                      {step.label}
                    </span>
                    <span
                      className={`text-[8px] font-mono px-1.5 py-0.5 rounded-full transition-all duration-300 ${
                        isOverridden
                          ? isDone || isExecuting ? "opacity-100" : "opacity-40"
                          : "opacity-30"
                      }`}
                      style={{
                        color: isOverridden ? accentColor : "#52525b",
                        backgroundColor: isOverridden ? `${accentColor}12` : "rgba(255,255,255,0.03)",
                      }}
                    >
                      {isOverridden ? "override" : "default"}
                    </span>
                  </div>
                </div>
                {isExecuting && (
                  <ChevronRight size={11} className="text-zinc-500 animate-pulse flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
