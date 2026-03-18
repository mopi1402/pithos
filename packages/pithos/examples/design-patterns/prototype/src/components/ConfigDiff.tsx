import { useState } from "react";
import { RotateCcw, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { useConfigDiff } from "@/hooks/useConfigDiff";
import { StepChoose } from "./StepChoose";
import { StepEdit } from "./StepEdit";
import { StepCompare } from "./StepCompare";

const STEPS = [
  { label: "Choose" },
  { label: "Clone & Edit" },
  { label: "Compare" },
];

export function ConfigDiff() {
  const {
    mode, clone, original, refs, diffs, leaked,
    handleClone, handleReset, handleModeSwitch, handleFieldChange,
  } = useConfigDiff();

  const [step, setStep] = useState(0);

  const goNext = () => {
    if (step === 0) { handleClone(); setStep(1); }
    else if (step < 2) { setStep(step + 1); }
  };

  const goBack = () => { if (step > 0) setStep(step - 1); };

  const restart = () => { handleReset(); setStep(0); };

  return (
    <div className="h-screen flex flex-col bg-[#0c0c0f] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-fuchsia-950/10 pointer-events-none" />

      {/* Header */}
      <div className="shrink-0 border-b border-white/[0.06] relative z-10">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            <span className="text-sm font-bold tracking-tight">Runway</span>
            <span className="hidden sm:inline text-[10px] text-white/30 ml-3">Prototype pattern</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
              mode === "shallow"
                ? "text-red-400 bg-red-500/10 border-red-500/20"
                : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
            }`}>
              {mode === "shallow" ? "{ ...spread }" : "deepClone()"}
            </span>
            <button onClick={restart} className="p-1.5 rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors" title="Start over">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="shrink-0 border-b border-white/[0.04] relative z-10">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center justify-center">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex items-center">
                <button
                  onClick={() => i <= step && setStep(i)}
                  className={`flex items-center gap-1.5 shrink-0 ${i <= step ? "cursor-pointer" : "cursor-default"}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    i < step ? "bg-violet-500 text-white"
                      : i === step ? "bg-violet-500/20 text-violet-400 border border-violet-500/50"
                        : "bg-white/[0.04] text-white/20 border border-white/[0.06]"
                  }`}>
                    {i < step ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className={`text-[11px] font-medium ml-1.5 hidden sm:inline ${i <= step ? "text-white/70" : "text-white/20"}`}>
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={`w-12 sm:w-20 h-px mx-2 sm:mx-3 ${i < step ? "bg-violet-500/50" : "bg-white/[0.06]"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto relative z-10">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 h-full flex flex-col">
          {step === 0 && <StepChoose mode={mode} original={original} onModeSwitch={handleModeSwitch} />}
          {step === 1 && <StepEdit original={original} clone={clone} mode={mode} leaked={leaked} onFieldChange={handleFieldChange} />}
          {step === 2 && <StepCompare refs={refs} diffs={diffs} leaked={leaked} />}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="shrink-0 border-t border-white/[0.06] relative z-10">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between">
          <button onClick={goBack} disabled={step === 0} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white/40 hover:text-white/60 disabled:opacity-20 disabled:cursor-default transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> Back
          </button>
          <div className="text-[10px] text-white/15">
            <code className="text-white/20">deepClone()</code> from Arkhe
          </div>
          {step < 2 ? (
            <button onClick={goNext} className="flex items-center gap-1.5 px-4 py-1.5 bg-violet-600 text-white rounded-md text-xs font-medium hover:bg-violet-500 shadow-lg shadow-violet-600/20 transition-all">
              {step === 0 ? "Clone" : "Compare"} <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button onClick={restart} className="flex items-center gap-1.5 px-4 py-1.5 bg-white/[0.06] text-white/60 rounded-md text-xs font-medium hover:bg-white/[0.08] transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
