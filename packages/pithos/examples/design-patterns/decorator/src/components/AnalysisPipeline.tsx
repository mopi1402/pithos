import { Play, RotateCcw, Dna, Filter, Database, RefreshCw, Timer } from "lucide-react";
import { useAnalysisPipeline } from "@/hooks/useAnalysisPipeline";
import { SAMPLE_SEQUENCES, DECORATOR_INFO } from "@/data/sequences";
import { ExecutionLog } from "./ExecutionLog";
import { ResultPanel } from "./ResultPanel";
import type { DecoratorOption } from "@/lib/types";

const DECORATOR_ICONS: Record<DecoratorOption, React.ReactNode> = {
  qualityFilter: <Filter className="w-4 h-4" />,
  cache: <Database className="w-4 h-4" />,
  retry: <RefreshCw className="w-4 h-4" />,
  timing: <Timer className="w-4 h-4" />,
};

export function AnalysisPipeline() {
  const {
    selectedDecorators, selectedSequence, setSelectedSequence,
    isRunning, result, error, log,
    toggleDecorator, runAnalysis, handleReset,
  } = useAnalysisPipeline();

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-col h-screen max-w-2xl mx-auto md:hidden">
        <div className="shrink-0 bg-slate-50 px-3 pt-3 space-y-3">
          <div className="flex items-center gap-2">
            <RunButton isRunning={isRunning} onClick={runAnalysis} />
            <button onClick={handleReset} className="p-2.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition-all"><RotateCcw className="w-4 h-4" /></button>
          </div>
          <SequenceSelector selected={selectedSequence} onSelect={setSelectedSequence} />
          <div className="border-t border-slate-200" />
          <DecoratorToggles selected={selectedDecorators} onToggle={toggleDecorator} />
          <div className="border-t border-slate-200" />
        </div>
        <div className="flex-1 overflow-auto px-3 pb-3 space-y-3">
          <ExecutionLog log={log} />
          <ResultPanel result={result} error={error} />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block max-w-5xl mx-auto py-8 px-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">DNA Analysis Pipeline</h1>
              <p className="text-sm text-slate-500 mt-1">Decorator pattern: stack behaviors without modifying the core function</p>
            </div>
            <div className="flex items-center gap-2">
              <RunButton isRunning={isRunning} onClick={runAnalysis} />
              <button onClick={handleReset} className="p-2.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition-all" title="Reset"><RotateCcw className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-4">
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">🧬 DNA Sequence</h2>
                <SequenceSelector selected={selectedSequence} onSelect={setSelectedSequence} expanded />
              </section>
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">🔧 Pipeline Decorators</h2>
                <DecoratorToggles selected={selectedDecorators} onToggle={toggleDecorator} expanded />
              </section>
            </div>
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 shrink-0">📋 Execution Log</h2>
              <div className="flex-1 overflow-auto min-h-0"><ExecutionLog log={log} /></div>
            </section>
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">📊 Result</h2>
              <ResultPanel result={result} error={error} />
            </section>
          </div>
          <div className="bg-slate-100 rounded-lg p-4 text-sm text-slate-600">
            <strong>How it works:</strong> Each decorator wraps the previous one with <code className="bg-slate-200 px-1 rounded">decorate(fn, ...decorators)</code>. The pipeline has the same signature as the core function — decorators are invisible to the caller.
          </div>
        </div>
      </div>
    </>
  );
}

function RunButton({ isRunning, onClick }: { isRunning: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={isRunning} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 transition-all">
      <Play className="w-4 h-4" />{isRunning ? "Analyzing..." : "Run Analysis"}
    </button>
  );
}

function SequenceSelector({ selected, onSelect, expanded }: { selected: number; onSelect: (i: number) => void; expanded?: boolean }) {
  return (
    <div className={expanded ? "space-y-2" : "space-y-1"}>
      {!expanded && <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">DNA Sequence</div>}
      <div className={expanded ? "space-y-2" : "grid grid-cols-2 gap-2"}>
        {SAMPLE_SEQUENCES.map((seq, i) => (
          <button key={seq.name} onClick={() => onSelect(i)} className={`${expanded ? "w-full" : ""} flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${selected === i ? (expanded ? "bg-indigo-50 border-2 border-indigo-500" : "bg-indigo-500 text-white") : (expanded ? "bg-slate-50 border-2 border-transparent hover:bg-slate-100" : "bg-white border border-slate-200 hover:border-slate-300")}`}>
            <Dna className={`w-4 h-4 shrink-0 ${expanded && selected === i ? "text-indigo-500" : ""}`} />
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{seq.name}</div>
              {expanded && <div className="text-xs text-slate-500">{seq.description}</div>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function DecoratorToggles({ selected, onToggle, expanded }: { selected: DecoratorOption[]; onToggle: (d: DecoratorOption) => void; expanded?: boolean }) {
  return (
    <div className={expanded ? "space-y-2" : "space-y-1"}>
      {!expanded && <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Pipeline Decorators</div>}
      <div className={expanded ? "space-y-2" : "grid grid-cols-2 gap-2"}>
        {(Object.keys(DECORATOR_INFO) as DecoratorOption[]).map((key) => {
          const info = DECORATOR_INFO[key];
          const isActive = selected.includes(key);
          return (
            <button key={key} onClick={() => onToggle(key)} className={`${expanded ? "w-full" : ""} flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${isActive ? `${info.color} text-white` : (expanded ? "bg-slate-50 text-slate-600 hover:bg-slate-100" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300")}`}>
              {DECORATOR_ICONS[key]}
              <span className="text-sm font-medium">{info.label}</span>
              {expanded && <span className={`ml-auto text-xs ${isActive ? "text-white/80" : "text-slate-400"}`}>{isActive ? "ON" : "OFF"}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
