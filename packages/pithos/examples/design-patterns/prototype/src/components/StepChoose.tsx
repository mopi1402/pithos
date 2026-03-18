import { ShieldCheck, ShieldAlert } from "lucide-react";
import type { AppConfig, CloneMode } from "@/lib/configPrototype";

export function StepChoose({ mode, original, onModeSwitch }: {
  mode: CloneMode;
  original: AppConfig;
  onModeSwitch: (m: CloneMode) => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-white/90 mb-1">How do you want to clone?</h2>
        <p className="text-xs text-white/30">Choose a method, then clone your production config to staging</p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        <button
          onClick={() => onModeSwitch("shallow")}
          className={`p-4 rounded-xl border text-left transition-all ${
            mode === "shallow"
              ? "bg-red-500/10 border-red-500/30 ring-1 ring-red-500/20"
              : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]"
          }`}
        >
          <ShieldAlert className={`w-5 h-5 mb-2 ${mode === "shallow" ? "text-red-400" : "text-white/30"}`} />
          <div className={`text-sm font-medium mb-0.5 ${mode === "shallow" ? "text-red-400" : "text-white/60"}`}>Shallow Copy</div>
          <div className="text-[10px] text-white/25">{"{ ...config }"}</div>
          <div className="text-[10px] text-white/20 mt-1">Top-level only. Nested objects are shared.</div>
        </button>
        <button
          onClick={() => onModeSwitch("deep")}
          className={`p-4 rounded-xl border text-left transition-all ${
            mode === "deep"
              ? "bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20"
              : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]"
          }`}
        >
          <ShieldCheck className={`w-5 h-5 mb-2 ${mode === "deep" ? "text-emerald-400" : "text-white/30"}`} />
          <div className={`text-sm font-medium mb-0.5 ${mode === "deep" ? "text-emerald-400" : "text-white/60"}`}>Deep Clone</div>
          <div className="text-[10px] text-white/25">deepClone(config)</div>
          <div className="text-[10px] text-white/20 mt-1">Full copy. All references isolated.</div>
        </button>
      </div>

      <div className="w-full max-w-md bg-gradient-to-b from-white/[0.04] to-white/[0.02] rounded-xl border border-white/[0.06] overflow-hidden">
        <div className="h-9 px-3 flex items-center gap-2 border-b border-white/[0.04]">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Production config</span>
        </div>
        <pre className="p-3 text-[10px] font-mono text-white/40 leading-relaxed overflow-x-auto max-h-[150px] overflow-y-auto">
          {JSON.stringify(original, null, 2)}
        </pre>
      </div>
    </div>
  );
}
