import { Play, Pause, RotateCcw } from "lucide-react";
import { type Index } from "@/lib/stockTicker";
import { useStockDashboard } from "@/hooks/useStockDashboard";
import { MiniChart } from "./MiniChart";
import { AlertPanel } from "./AlertPanel";
import { PortfolioSummary } from "./PortfolioSummary";

export function StockDashboard() {
  const {
    stocks, indices, isRunning, tickCount, marketTime,
    handleToggle, handleReset,
  } = useStockDashboard();

  return (
    <div className="h-screen flex flex-col bg-[#0a0e17] text-white overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-bold tracking-tight text-white">Ninja</span>
              <span className="text-sm font-light text-white/50">Focus</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 ml-4 text-[10px] text-white/30">
              <span>Observer pattern</span>
              <span>·</span>
              <span>3 widgets, 1 observable</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Market status */}
            <div className="hidden sm:flex items-center gap-2 mr-3 text-[10px]">
              <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? "bg-emerald-500 animate-pulse" : "bg-white/20"}`} />
              <span className={isRunning ? "text-emerald-400" : "text-white/30"}>
                {isRunning ? "LIVE" : "PAUSED"}
              </span>
              <span className="text-white/40 font-mono">{marketTime}</span>
              {tickCount > 0 && (
                <span className="text-white/20 font-mono">{tickCount} ticks</span>
              )}
            </div>

            <button
              onClick={handleToggle}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                isRunning
                  ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
              }`}
            >
              {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span className="hidden sm:inline">{isRunning ? "Pause" : "Start"}</span>
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Ticker strip */}
      <div className="shrink-0 border-b border-white/[0.04] bg-white/[0.02] overflow-hidden">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-1.5">
          <div className="sm:flex items-center gap-4 sm:gap-6 hidden">
            {indices.map((idx) => (
              <IndexItem key={idx.symbol} index={idx} />
            ))}
          </div>
          {/* Mobile: scrolling marquee */}
          <div className="sm:hidden relative">
            <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
              {[...indices, ...indices].map((idx, i) => (
                <IndexItem key={`${idx.symbol}-${i}`} index={idx} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 h-full flex flex-col">
          {/* Charts grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4 shrink-0">
            {stocks.map((stock) => (
              <MiniChart key={stock.symbol} stock={stock} />
            ))}
          </div>

          {/* Bottom row: Alerts + Portfolio, fill remaining space */}
          <div className="grid sm:grid-cols-2 gap-2 sm:gap-3 flex-1 min-h-0">
            {/* Alerts */}
            <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden flex flex-col min-h-0">
              <div className="h-10 px-4 flex items-center justify-between border-b border-white/[0.04] shrink-0">
                <span className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Alerts</span>
                <span className="text-[10px] text-white/20">±2% threshold</span>
              </div>
              <div className="overflow-y-auto flex-1">
                <AlertPanel subscribed={isRunning} />
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] overflow-hidden flex flex-col min-h-0">
              <div className="h-10 px-4 flex items-center border-b border-white/[0.04] shrink-0">
                <span className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Portfolio</span>
              </div>
              <div className="overflow-y-auto flex-1">
                <PortfolioSummary stocks={stocks} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-white/[0.04] py-1.5 text-center text-[10px] text-white/15">
        Simulated data · <code className="text-white/20">createObservable()</code> · 3 independent subscribers
      </div>
    </div>
  );
}

function IndexItem({ index }: { index: Index }) {
  const change = index.price - index.basePrice;
  const pct = index.basePrice > 0 ? (change / index.basePrice) * 100 : 0;
  const isUp = change >= 0;
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-[10px] text-white/30">{index.name}</span>
      <span className="text-xs font-bold text-white/70">{index.symbol}</span>
      <span className="text-xs font-mono text-white/50">{index.price.toFixed(0)}</span>
      <span className={`text-[10px] font-mono ${isUp ? "text-emerald-400" : "text-red-400"}`}>
        {isUp ? "+" : ""}{pct.toFixed(2)}%
      </span>
    </div>
  );
}
