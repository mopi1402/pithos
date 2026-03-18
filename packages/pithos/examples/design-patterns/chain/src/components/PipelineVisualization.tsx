import { Check, X, ChevronRight } from "lucide-react";
import { MIDDLEWARE_OPTIONS } from "@/data/middleware";
import type { MiddlewareStep, MiddlewareConfig } from "@/lib/types";

export function PipelineVisualization({ steps, config, isRunning }: {
  steps: MiddlewareStep[];
  config: MiddlewareConfig;
  isRunning: boolean;
}) {
  const activeMiddleware = MIDDLEWARE_OPTIONS.filter((opt) => config[opt.key]);
  const allSteps = [...activeMiddleware.map((m) => m.label), "Handler"];

  if (steps.length === 0 && !isRunning) {
    return <div className="flex items-center justify-center py-12 text-slate-400"><p className="text-sm">Click "Send Request" to see the pipeline in action</p></div>;
  }

  return (
    <div className="space-y-2">
      {allSteps.map((stepName, i) => {
        const executed = steps.find((s) => s.name === stepName || (stepName === "Handler" && s.name === "Handler"));
        const isWaiting = !executed && steps.length === i && isRunning;
        return (
          <div key={stepName} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 transition-all duration-400 ${executed ? (executed.passed ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600") : isWaiting ? "bg-amber-100 text-amber-600 animate-pulse" : "bg-slate-100 text-slate-400"}`}>
              {executed ? (executed.passed ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />) : (MIDDLEWARE_OPTIONS.find((m) => m.label === stepName)?.icon || "🎯")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-medium ${executed ? "text-slate-900" : "text-slate-400"}`}>{stepName}</span>
                {executed && !executed.passed && (
                  <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">{executed.response?.status} {executed.response?.statusText}</span>
                )}
              </div>
              {executed && <div className="text-sm text-slate-500 truncate">{executed.message}</div>}
            </div>
            {i < allSteps.length - 1 && executed?.passed && <ChevronRight className="w-5 h-5 text-emerald-500 shrink-0" />}
          </div>
        );
      })}
    </div>
  );
}
