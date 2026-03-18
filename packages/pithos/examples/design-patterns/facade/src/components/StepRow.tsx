import { Shield, FileCheck, FileJson, Send, CheckCircle, Sparkles, AlertTriangle } from "lucide-react";
import type { StepState } from "@/lib/types";

const STEP_ICONS: Record<string, React.ReactNode> = {
  validate: <FileCheck className="w-4 h-4" />,
  auth: <Shield className="w-4 h-4" />,
  serialize: <FileJson className="w-4 h-4" />,
  fetch: <Send className="w-4 h-4" />,
  parse: <CheckCircle className="w-4 h-4" />,
  format: <Sparkles className="w-4 h-4" />,
};

export function StepRow({ stepKey, label, index, state }: { stepKey: string; label: string; index: number; state: StepState }) {
  const { status, detail, durationMs } = state;
  return (
    <div className={`flex items-center gap-3 px-4 py-3 transition-all duration-300 ${status === "running" ? "bg-blue-50" : status === "done" ? "bg-emerald-50/50" : status === "error" ? "bg-red-50" : ""}`}>
      <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${status === "running" ? "bg-blue-100 text-blue-600 animate-pulse" : status === "done" ? "bg-emerald-100 text-emerald-600" : status === "error" ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-400"}`}>
        {status === "idle" ? <span className="text-xs font-bold">{index}</span> : status === "running" ? <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" /> : status === "done" ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
      </div>
      <div className={`transition-colors duration-300 ${status === "idle" ? "text-slate-400" : status === "running" ? "text-blue-600" : status === "done" ? "text-emerald-600" : "text-red-600"}`}>
        {STEP_ICONS[stepKey]}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium transition-colors duration-300 ${status === "idle" ? "text-slate-400" : "text-slate-800"}`}>{label}</p>
        {detail && <p className="text-xs text-slate-500 truncate mt-0.5">{detail}</p>}
      </div>
      {status === "done" && <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full tabular-nums">{Math.round(durationMs)}ms</span>}
      {status === "error" && <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">failed</span>}
    </div>
  );
}
