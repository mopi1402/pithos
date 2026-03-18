import { Play, RotateCcw } from "lucide-react";
import { useMiddlewareSimulator } from "@/hooks/useMiddlewareSimulator";
import { MIDDLEWARE_OPTIONS, REQUEST_PRESETS } from "@/data/middleware";
import { PipelineVisualization } from "./PipelineVisualization";
import { ResponseCard } from "./ResponseCard";

export function MiddlewareSimulator() {
  const {
    selectedPreset, config, steps, finalResponse, isRunning,
    handleRun, handleReset, toggleMiddleware, selectPreset, currentRequest,
  } = useMiddlewareSimulator();

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-col h-screen max-w-2xl mx-auto md:hidden">
        <div className="shrink-0 bg-slate-50 px-3 pt-3 space-y-3">
          <div className="flex items-center gap-2">
            <RunButton isRunning={isRunning} onClick={handleRun} />
            <ResetButton onClick={handleReset} />
          </div>
          <div className="border-t border-slate-200" />
          <div className="flex gap-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest writing-vertical shrink-0">Request</div>
            <div className="flex-1 grid grid-cols-2 gap-2">
              {REQUEST_PRESETS.map((preset, i) => (
                <button key={preset.name} onClick={() => selectPreset(i)} className={`px-3 py-2 rounded-lg text-left text-sm transition-all ${selectedPreset === i ? "bg-indigo-500 text-white" : "bg-white border border-slate-200 hover:border-slate-300"}`}>
                  <div className="font-medium truncate">{preset.name}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-200" />
          <div className="flex gap-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest writing-vertical shrink-0">Middleware</div>
            <div className="flex-1 grid grid-cols-2 gap-2">
              {MIDDLEWARE_OPTIONS.map((opt) => (
                <MiddlewareToggle key={opt.key} label={opt.label} icon={opt.icon} active={config[opt.key]} onToggle={() => toggleMiddleware(opt.key)} />
              ))}
            </div>
          </div>
          <div className="border-t border-slate-200" />
        </div>
        <div className="flex-1 overflow-auto px-3 pb-3">
          <PipelineVisualization steps={steps} config={config} isRunning={isRunning} />
          {finalResponse && <ResponseCard response={finalResponse} />}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block max-w-5xl mx-auto p-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">HTTP Middleware Pipeline</h1>
              <p className="text-sm text-slate-500 mt-1">Chain of Responsibility: each middleware can pass or short-circuit</p>
            </div>
            <div className="flex items-center gap-2">
              <RunButton isRunning={isRunning} onClick={handleRun} />
              <ResetButton onClick={handleReset} />
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-72 shrink-0 space-y-4">
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">📨 Request</h2>
                <div className="space-y-2">
                  {REQUEST_PRESETS.map((preset, i) => (
                    <button key={preset.name} onClick={() => selectPreset(i)} className={`w-full px-3 py-2 rounded-lg text-left transition-all ${selectedPreset === i ? "bg-indigo-50 border-2 border-indigo-500" : "bg-slate-50 border-2 border-transparent hover:bg-slate-100"}`}>
                      <div className="font-medium text-slate-900">{preset.name}</div>
                      <div className="text-xs text-slate-500">{preset.description}</div>
                    </button>
                  ))}
                </div>
              </section>
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-3">🔧 Middleware</h2>
                <div className="space-y-2">
                  {MIDDLEWARE_OPTIONS.map((opt) => (
                    <MiddlewareToggle key={opt.key} label={opt.label} icon={opt.icon} active={config[opt.key]} onToggle={() => toggleMiddleware(opt.key)} full />
                  ))}
                </div>
              </section>
            </div>
            <div className="flex-1 space-y-4">
              <section className="bg-slate-800 rounded-xl p-4 font-mono text-sm">
                <div className="text-slate-400 mb-2">// Incoming request</div>
                <div className="text-emerald-400">{currentRequest.request.method} <span className="text-white">{currentRequest.request.path}</span></div>
                {currentRequest.request.headers.authorization && <div className="text-slate-500 text-xs mt-1">Authorization: {currentRequest.request.headers.authorization}</div>}
              </section>
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h2 className="text-sm font-semibold text-slate-900 mb-4">⛓️ Pipeline Execution</h2>
                <PipelineVisualization steps={steps} config={config} isRunning={isRunning} />
              </section>
              {finalResponse && <ResponseCard response={finalResponse} />}
            </div>
          </div>
          <div className="bg-slate-100 rounded-lg p-4 text-sm text-slate-600">
            <strong>How it works:</strong> Each middleware calls <code className="bg-slate-200 px-1 rounded">next(req)</code> to pass to the next handler, or returns a response to short-circuit. Toggle middleware on/off to see how the chain adapts.
          </div>
        </div>
      </div>
    </>
  );
}

function RunButton({ isRunning, onClick }: { isRunning: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={isRunning} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 transition-all">
      <Play className="w-4 h-4" />{isRunning ? "Running..." : "Send Request"}
    </button>
  );
}

function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="p-2.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition-all" title="Reset">
      <RotateCcw className="w-4 h-4" />
    </button>
  );
}

function MiddlewareToggle({ label, icon, active, onToggle, full }: { label: string; icon: string; active: boolean; onToggle: () => void; full?: boolean }) {
  return (
    <button onClick={onToggle} className={`${full ? "w-full" : ""} flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${active ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-400"}`}>
      <span>{icon}</span>
      <span className="font-medium text-sm">{label}</span>
      <span className={`ml-auto text-xs ${active ? "text-slate-300" : "text-slate-400"}`}>{active ? "ON" : "OFF"}</span>
    </button>
  );
}
