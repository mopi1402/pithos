import { useState } from "react";
import { RotateCcw, Send, Zap, AlertTriangle, Terminal, X } from "lucide-react";
import { PRESET_QUESTIONS } from "@/lib/llmProxy";
import { useLLMProxy } from "@/hooks/useLLMProxy";
import { StatsPanel } from "./StatsPanel";
import { TinyLLMLogo } from "./TinyLLMLogo";
import { ProxyLog } from "./ProxyLog";

export function LLMProxy() {
  const {
    stats, input, setInput, loading, lastResponse, simulateFailure, inputRef,
    handleAsk, handleReset, toggleFailure, handleSpam,
  } = useLLMProxy();

  const [logOpen, setLogOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-[#09090f] text-white overflow-hidden relative">
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="shrink-0 border-b border-white/[0.06] relative z-10">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <TinyLLMLogo size={18} />
              <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent">TinyLLM</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 ml-3 text-[10px] text-white/25">
              <span>Proxy pattern</span>
              <span>·</span>
              <span>cache, rate-limit, fallback</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLogOpen(!logOpen)}
              className="md:hidden p-1.5 rounded-md bg-white/[0.04] border border-white/[0.06] relative"
            >
              {logOpen ? <X className="w-3.5 h-3.5 text-white/50" /> : <Terminal className="w-3.5 h-3.5 text-violet-400" />}
              {!logOpen && stats.logs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center">
                  {stats.logs.length}
                </span>
              )}
            </button>
            <button onClick={handleReset} className="p-1.5 rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors" title="Reset">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto md:overflow-hidden relative z-10">
        {/* Mobile: log overlay */}
        {logOpen && (
          <div className="md:hidden h-full p-3 flex flex-col">
            <ProxyLog logs={stats.logs} className="flex-1" />
          </div>
        )}

        <div className={`max-w-5xl mx-auto px-3 sm:px-4 py-4 h-full ${logOpen ? "hidden md:block" : ""}`}>
          <div className="grid md:grid-cols-2 gap-4 h-full">
            {/* Left column */}
            <div className="space-y-3">
              {/* Controls */}
              <div className="flex gap-2">
                <button
                  onClick={toggleFailure}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 border ${
                    simulateFailure
                      ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                      : "bg-white/[0.03] text-white/40 border-white/[0.06] hover:bg-white/[0.06]"
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  {simulateFailure ? "Failure ON" : "Simulate failure"}
                </button>
                <button
                  onClick={handleSpam}
                  disabled={loading}
                  className="px-3 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 disabled:opacity-30"
                >
                  <Zap className="w-3 h-3" /> ×5
                </button>
              </div>

              <div className="h-px bg-white/[0.06]" />

              {/* Quick questions */}
              <div className="space-y-1.5">
                <div className="text-[10px] text-white/25 font-medium uppercase tracking-wider">Quick questions</div>
                {PRESET_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleAsk(q)}
                    disabled={loading}
                    className="w-full text-left px-3 py-2 text-xs bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] rounded-lg transition-colors disabled:opacity-30 truncate text-white/50"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Ask input */}
              <form onSubmit={(e) => { e.preventDefault(); handleAsk(input); }} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Or type your own question..."
                  className="flex-1 px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/30 transition-all"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-violet-500 hover:to-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-600/20 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ask</span>
                </button>
              </form>

              {/* Response */}
              {(loading || lastResponse) && (
                <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-3">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                      <span className="text-xs text-white/30">Thinking...</span>
                    </div>
                  ) : (
                    <p className="text-sm text-white/70 leading-relaxed">{lastResponse}</p>
                  )}
                </div>
              )}

              <div className="h-px bg-white/[0.06]" />

              {/* Status + Stats */}
              <div className="flex gap-2">
                <div className={`flex-1 px-2.5 py-2 rounded-lg border text-[10px] transition-all ${
                  simulateFailure
                    ? "bg-red-500/10 border-red-500/20 text-red-400"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                }`}>
                  <span className="font-medium">Primary</span> · {simulateFailure ? "⛔ Down" : "✓ Online"}
                </div>
                <div className={`flex-1 px-2.5 py-2 rounded-lg border text-[10px] transition-all ${
                  simulateFailure
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    : "bg-white/[0.03] border-white/[0.06] text-white/25"
                }`}>
                  <span className="font-medium">Backup</span> · {simulateFailure ? "⚡ Active" : "Standby"}
                </div>
              </div>
              <StatsPanel stats={stats} />
            </div>

            {/* Right: Proxy Log (desktop only) */}
            <div className="hidden md:flex md:flex-col md:min-h-0">
              <ProxyLog logs={stats.logs} className="flex-1 min-h-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-white/[0.04] py-1.5 text-center text-[10px] text-white/15 relative z-10">
        <code className="text-white/20">memoize()</code> · Proxy pattern · cache, rate-limit, fallback
      </div>
    </div>
  );
}
