import { Send, RotateCcw, Layers, Zap, CheckCircle, AlertTriangle } from "lucide-react";
import { useApiFacade } from "@/hooks/useApiFacade";
import { STEP_DEFS } from "@/data/steps";
import { StepRow } from "./StepRow";

export function ApiFacade() {
  const {
    mode, setMode, userId, setUserId, steps, result, error, running,
    facadeDuration, totalExpandedDuration, doneCount,
    reset, handleFetch,
  } = useApiFacade();

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">API Request Facade</h1>
          <p className="text-sm text-slate-500">6 subsystem calls vs 1 facade function — same result, different experience</p>
        </div>

        <div className="flex justify-center">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 shadow-inner">
            <ModeButton active={mode === "expanded"} onClick={() => { setMode("expanded"); reset(); }} icon={<Layers className="w-4 h-4" />} label="Without Facade" />
            <ModeButton active={mode === "facade"} onClick={() => { setMode("facade"); reset(); }} icon={<Zap className="w-4 h-4" />} label="With Facade" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-2">
            <select value={userId} onChange={(e) => { setUserId(e.target.value); reset(); }} disabled={running} className="flex-1 min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
              <option value="1">1 — Alice Martin</option>
              <option value="2">2 — Bob Chen</option>
              <option value="3">3 — Clara Dupont</option>
              <option value="42">42 — Douglas Adams</option>
              <option value="999">999 — Not Found ⚠️</option>
            </select>
            <button onClick={handleFetch} disabled={running} className="shrink-0 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-40 transition-all flex items-center gap-2 shadow-sm">
              <Send className="w-3.5 h-3.5" /><span className="hidden sm:inline">{running ? "Fetching…" : "Fetch"}</span>
            </button>
            {(result || error) && <button onClick={reset} className="shrink-0 p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors" title="Reset"><RotateCcw className="w-4 h-4" /></button>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {mode === "expanded" ? (
              <>
                <div className="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-slate-500" /><span className="text-sm font-semibold text-slate-700">Pipeline Steps</span></div>
                  {doneCount > 0 && <span className="text-xs text-slate-400 tabular-nums">{doneCount}/{STEP_DEFS.length} complete</span>}
                </div>
                <div className="divide-y divide-slate-50">
                  {STEP_DEFS.map((def, i) => <StepRow key={def.key} stepKey={def.key} label={def.label} index={i + 1} state={steps[def.key]} />)}
                </div>
                {totalExpandedDuration !== null && <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 tabular-nums text-right">Total: {Math.round(totalExpandedDuration)}ms across 6 steps</div>}
              </>
            ) : (
              <>
                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center gap-2"><Zap className="w-4 h-4 text-blue-600" /><span className="text-sm font-semibold text-blue-800">Facade Call</span></div>
                <div className="p-4 sm:p-6 flex flex-col items-center justify-center">
                  <div className="bg-slate-900 rounded-xl p-5 shadow-lg w-full max-w-sm">
                    <pre className="text-sm font-mono leading-relaxed"><span className="text-blue-400">const</span> <span className="text-slate-200">user</span> <span className="text-slate-500">=</span> <span className="text-blue-400">await</span> <span className="text-amber-400">fetchUser</span><span className="text-slate-400">(</span><span className="text-emerald-400">{userId}</span><span className="text-slate-400">)</span></pre>
                  </div>
                  {running && <div className="mt-6 flex items-center gap-2 text-sm text-slate-500"><div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />Executing 6 internal steps…</div>}
                  {facadeDuration !== null && !running && <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600 font-medium"><CheckCircle className="w-4 h-4" />Done in {Math.round(facadeDuration)}ms — same 6 steps, zero ceremony</div>}
                  {!running && facadeDuration === null && !error && <p className="mt-4 text-sm text-slate-400">Click Fetch to see the facade in action</p>}
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            {result && !error && (
              <div className="bg-white rounded-xl shadow-sm border border-emerald-200 overflow-hidden">
                <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /><span className="text-sm font-semibold text-emerald-800">Result</span></div>
                <div className="p-4"><div className="bg-slate-900 rounded-lg p-4 overflow-x-auto"><pre className="text-xs font-mono text-slate-200 leading-relaxed">{JSON.stringify(result, null, 2)}</pre></div></div>
              </div>
            )}
            {error && (
              <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
                <div className="px-4 py-3 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-200 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-600" /><span className="text-sm font-semibold text-red-800">Error</span></div>
                <div className="p-4"><p className="text-sm text-red-700">{error}</p></div>
              </div>
            )}
            <CodeComparison mode={mode} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ModeButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return <button onClick={onClick} className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>{icon}{label}</button>;
}

function CodeComparison({ mode }: { mode: string }) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 text-sm">
      <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-3">{mode === "expanded" ? "What you're seeing" : "What's hidden inside"}</div>
      {mode === "expanded" ? (
        <pre className="font-mono text-xs leading-relaxed overflow-x-auto">
          <span className="text-blue-400">await</span> <span className="text-amber-400">validateInput</span><span className="text-slate-400">(id)</span>{"\n"}
          <span className="text-blue-400">await</span> <span className="text-amber-400">buildAuthHeaders</span><span className="text-slate-400">()</span>{"\n"}
          <span className="text-blue-400">await</span> <span className="text-amber-400">serializeRequest</span><span className="text-slate-400">(id)</span>{"\n"}
          <span className="text-blue-400">await</span> <span className="text-amber-400">executeFetch</span><span className="text-slate-400">(id)</span>{"\n"}
          <span className="text-blue-400">await</span> <span className="text-amber-400">parseResponse</span><span className="text-slate-400">(raw)</span>{"\n"}
          <span className="text-blue-400">await</span> <span className="text-amber-400">formatResult</span><span className="text-slate-400">(raw)</span>
        </pre>
      ) : (
        <div className="space-y-3">
          <pre className="font-mono text-xs leading-relaxed">
            <span className="text-slate-500">{"// Inside fetchUser():"}</span>{"\n"}
            <span className="text-blue-400">await</span> <span className="text-slate-500">validateInput(id)</span>{"\n"}
            <span className="text-blue-400">await</span> <span className="text-slate-500">buildAuthHeaders()</span>{"\n"}
            <span className="text-blue-400">await</span> <span className="text-slate-500">serializeRequest(id)</span>{"\n"}
            <span className="text-blue-400">await</span> <span className="text-slate-500">executeFetch(id)</span>{"\n"}
            <span className="text-blue-400">await</span> <span className="text-slate-500">parseResponse(raw)</span>{"\n"}
            <span className="text-blue-400">await</span> <span className="text-slate-500">formatResult(raw)</span>
          </pre>
          <div className="text-xs text-slate-400 border-t border-slate-700 pt-2">Same 6 calls. The facade just hides the wiring.</div>
        </div>
      )}
    </div>
  );
}
