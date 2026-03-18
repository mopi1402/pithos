import { Type, RotateCcw } from "lucide-react";
import { useTextEditor } from "@/hooks/useTextEditor";
import { PRESETS } from "@/data/presets";
import { formatBytes } from "@/lib/flyweight";

export function TextEditor() {
  const { mode, activePreset, changePreset, stats, noFlyweightStats, editorRef, handleInput, handleBlur, handleReset, handleModeSwitch } = useTextEditor();

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 px-2 sm:px-4">
      <div className="space-y-5">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">Text Editor</h1>
          <p className="text-sm text-slate-500">Type, swap styles, watch memory</p>
        </div>

        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">Flyweight</span>
            <button onClick={() => handleModeSwitch(mode === "flyweight" ? "no-flyweight" : "flyweight")} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${mode === "flyweight" ? "bg-emerald-500" : "bg-slate-300"}`} role="switch" aria-checked={mode === "flyweight"}>
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${mode === "flyweight" ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Style for new text</span>
              <div className="flex-1 h-px bg-slate-100" />
              {stats.totalChars > 0 && <button onClick={handleReset} className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="Clear"><RotateCcw className="w-3.5 h-3.5" /></button>}
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button key={preset.label} onClick={() => changePreset(preset)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${activePreset === preset ? "bg-slate-900 text-white border-slate-900 shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${preset.swatch}`} />{preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-4 py-2.5 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Editor</span>
                <span className="text-xs text-slate-400">Active: {activePreset.label} · <span style={{ color: activePreset.color }}>■</span></span>
              </div>
              <div ref={editorRef} contentEditable onInput={handleInput} onBlur={handleBlur} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }} data-placeholder="Start typing — change styles between words to see the flyweight in action…" className="min-h-[3rem] sm:min-h-[120px] lg:min-h-[180px] px-4 py-3 text-sm focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-4 py-2.5 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200"><span className="text-sm font-semibold text-slate-700">Memory</span></div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><span className="text-sm font-bold text-slate-800 tabular-nums block">{stats.totalChars}</span><span className="text-[10px] text-slate-500">Characters</span></div>
                  <div><span className={`text-sm font-bold tabular-nums block ${mode === "flyweight" && stats.totalChars > 0 ? "text-emerald-600" : "text-slate-800"}`}>{stats.styleObjects}</span><span className="text-[10px] text-slate-500">Style objects</span></div>
                  <div><span className="text-sm font-bold text-slate-800 tabular-nums block">{formatBytes(stats.memoryBytes)}</span><span className="text-[10px] text-slate-500">Memory</span></div>
                </div>
                {mode === "flyweight" && <><div className="h-px bg-slate-100" /><div className="flex items-center justify-between"><span className="text-xs text-slate-500">Memory saved</span><span className="text-lg font-bold text-emerald-600 tabular-nums">{stats.savedPercent}%</span></div></>}
                {mode === "no-flyweight" && <><div className="h-px bg-slate-100" /><div className="text-xs text-slate-400">Every character gets its own style object — no sharing.</div></>}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-4 py-2.5 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200"><span className="text-sm font-semibold text-slate-700">Comparison</span></div>
              <div className="p-4">
                {mode === "flyweight" && stats.totalChars > 0 && noFlyweightStats ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-5 bg-red-400 rounded-full flex items-center justify-between px-2.5"><span className="text-[10px] font-medium text-white">Without</span><span className="text-[10px] font-medium text-white/80 tabular-nums">{formatBytes(noFlyweightStats.memoryBytes)}</span></div>
                    <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden relative">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.max((stats.memoryBytes / noFlyweightStats.memoryBytes) * 100, 2)}%` }} />
                      <div className="absolute inset-0 flex items-center justify-between px-2.5"><span className="text-[10px] font-medium text-slate-700">With</span><span className="text-[10px] font-medium text-slate-500 tabular-nums">{formatBytes(stats.memoryBytes)}</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-5 bg-slate-200 rounded-full flex items-center justify-between px-2.5"><span className="text-[10px] font-medium text-slate-400">Without</span><span className="text-[10px] font-medium text-slate-400 tabular-nums">0 B</span></div>
                    <div className="flex-1 h-5 bg-slate-100 rounded-full flex items-center justify-between px-2.5"><span className="text-[10px] font-medium text-slate-400">With</span><span className="text-[10px] font-medium text-slate-400 tabular-nums">0 B</span></div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-slate-900 rounded-xl p-4">
              <pre className="text-xs font-mono leading-relaxed"><span className="text-slate-500">{"// Same style args = same ref"}</span>{"\n"}<span className="text-slate-200">char1.style</span> <span className="text-slate-500">===</span> <span className="text-slate-200">char2.style</span>{"\n"}<span className="text-emerald-400">{"// true — same object in memory"}</span></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
