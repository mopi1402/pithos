import { useChartBuilder } from "@/hooks/useChartBuilder";
import { Chart } from "./Chart";
import { Check, Plus } from "lucide-react";

export function ChartBuilder() {
  const { steps, chartType, setChartType, toggleStep, isEnabled, chartConfig, codePreview } = useChartBuilder();

  const chartTypeToggle = (
    <div className="flex gap-2">
      {(["bar", "line"] as const).map((t) => (
        <button key={t} onClick={() => setChartType(t)} className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${chartType === t ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
          {t === "bar" ? "Bar Chart" : "Line Chart"}
        </button>
      ))}
    </div>
  );

  const stepToggles = (
    <div className="space-y-2">
      {steps.map((step) => (
        <StepToggle key={step.id} step={step} onToggle={() => toggleStep(step.id)} disabled={step.id === "addDataset" && !isEnabled("data")} />
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-col h-screen max-w-2xl mx-auto md:hidden">
        <div className="shrink-0 bg-slate-50 px-3 pt-3 space-y-3">
          <div className="bg-white rounded-lg border border-slate-200 p-3 h-[230px]">
            <Chart config={chartConfig} />
          </div>
          <div className="border-t border-slate-200" />
          {chartTypeToggle}
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Toggle builder steps</div>
        </div>
        <div className="flex-1 overflow-auto px-3 pb-3">{stepToggles}</div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block max-w-5xl mx-auto py-8 px-4">
        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Builder Steps</h2>
            <div className="mb-4">{chartTypeToggle}</div>
            {stepToggles}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-slate-700 mb-2">Generated Code</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto"><code>{codePreview}</code></pre>
            </div>
          </section>
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Live Preview</h2>
            <div className="h-[300px]"><Chart config={chartConfig} /></div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Key insight:</strong> The <code className="bg-blue-100 px-1 rounded">.addDataset()</code> step composes with previous data. A simple options object couldn't do this — you'd need to manually merge arrays. The builder handles composition internally.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function StepToggle({ step, onToggle, disabled }: { step: { id: string; label: string; enabled: boolean }; onToggle: () => void; disabled?: boolean }) {
  return (
    <button onClick={onToggle} disabled={disabled} className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${disabled ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-200" : step.enabled ? "bg-blue-50 border-blue-200 hover:bg-blue-100" : "bg-white border-slate-200 hover:bg-slate-50"}`}>
      <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${step.enabled ? "bg-blue-500" : "bg-slate-200"}`}>
        {step.enabled ? <Check className="w-3 h-3 text-white" /> : <Plus className="w-3 h-3 text-slate-400" />}
      </div>
      <code className="text-sm text-slate-700 font-mono">{step.label}</code>
    </button>
  );
}
