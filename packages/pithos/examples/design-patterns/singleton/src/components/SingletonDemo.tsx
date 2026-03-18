import { SERVICE_KEYS } from "@/lib/services";
import { useSingletonDemo } from "@/hooks/useSingletonDemo";
import { ServiceCard } from "./ServiceCard";
import { StatsBar } from "./StatsBar";
import { TracelyLogo } from "./TracelyLogo";

export function SingletonDemo() {
  const { services, stats, handleRequest, handleReset } = useSingletonDemo();

  return (
    <div className="h-screen flex flex-col bg-[#0a0e14] text-white overflow-hidden relative">
      {/* Glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-600/6 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="shrink-0 border-b border-white/[0.06] relative z-10">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <TracelyLogo size={18} />
              <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Tracely
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 ml-3 text-[10px] text-white/25">
              <span>Singleton pattern</span>
              <span>·</span>
              <span>once() · single instance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto relative z-10">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-10 space-y-5 sm:space-y-6">
          {/* Intro */}
          <div className="text-center space-y-1">
            <h1 className="text-lg sm:text-xl font-semibold text-white/90">Service Connectors</h1>
            <p className="text-xs text-white/30">
              Each connector initializes once — subsequent calls return the same instance
            </p>
          </div>

          {/* Service cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {SERVICE_KEYS.map((key) => (
              <ServiceCard key={key} serviceKey={key} state={services[key]} onRequest={handleRequest} />
            ))}
          </div>

          {/* Stats */}
          <StatsBar stats={stats} onReset={handleReset} />

          {/* Code snippet */}
          <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-4">
            <pre className="text-xs font-mono leading-relaxed">
              <span className="text-white/25">{"// First call → initializes (slow)"}</span>{"\n"}
              <span className="text-cyan-400">const</span>{" "}
              <span className="text-white/70">db1</span>{" "}
              <span className="text-white/30">=</span>{" "}
              <span className="text-cyan-400">await</span>{" "}
              <span className="text-emerald-400">getDatabase</span>
              <span className="text-white/30">()</span>{"\n"}
              <span className="text-white/25">{"// Second call → same instance (instant)"}</span>{"\n"}
              <span className="text-cyan-400">const</span>{" "}
              <span className="text-white/70">db2</span>{" "}
              <span className="text-white/30">=</span>{" "}
              <span className="text-cyan-400">await</span>{" "}
              <span className="text-emerald-400">getDatabase</span>
              <span className="text-white/30">()</span>{"\n"}
              <span className="text-emerald-400/70">{"// db1 === db2  ✓"}</span>
            </pre>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-white/[0.04] py-1.5 text-center text-[10px] text-white/15 relative z-10">
        <code className="text-white/20">once()</code> · Singleton pattern · single instance guarantee
      </div>
    </div>
  );
}
