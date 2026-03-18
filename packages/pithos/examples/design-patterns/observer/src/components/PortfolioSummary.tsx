import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { stockTicker, type Stock } from "@/lib/stockTicker";
import { HOLDINGS } from "@/lib/data";

export function PortfolioSummary({ stocks }: { stocks: Stock[] }) {
  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    const unsubscribe = stockTicker.subscribe(() => {
      setUpdateCount((c) => c + 1);
    });
    return unsubscribe;
  }, []);

  const totalValue = stocks.reduce((sum, stock) => {
    const shares = HOLDINGS[stock.symbol] || 0;
    return sum + stock.price * shares;
  }, 0);

  const initialValue = stocks.reduce((sum, stock) => {
    const shares = HOLDINGS[stock.symbol] || 0;
    return sum + stock.previousPrice * shares;
  }, 0);

  const totalChange = totalValue - initialValue;
  const totalChangePercent = initialValue > 0 ? (totalChange / initialValue) * 100 : 0;
  const isUp = totalChange >= 0;

  return (
    <div className="p-4 space-y-4">
      {/* Total */}
      <div className="text-center py-3 bg-white/[0.03] rounded-lg border border-white/[0.04]">
        <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Total Value</div>
        <div className="text-xl font-bold font-mono text-white/90">${totalValue.toFixed(2)}</div>
        <div className={`flex items-center justify-center gap-1 text-xs font-mono mt-1 ${isUp ? "text-emerald-400" : "text-red-400"}`}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isUp ? "+" : ""}${Math.abs(totalChange).toFixed(2)} ({isUp ? "+" : ""}{totalChangePercent.toFixed(2)}%)
        </div>
      </div>

      {/* Holdings */}
      <div className="space-y-1">
        {stocks.map((stock) => {
          const shares = HOLDINGS[stock.symbol] || 0;
          const value = stock.price * shares;
          const change = (stock.price - stock.previousPrice) * shares;
          const stockIsUp = change >= 0;

          return (
            <div key={stock.symbol} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
              <div>
                <span className="text-xs font-bold text-white/80">{stock.symbol}</span>
                <span className="text-[10px] text-white/20 ml-1.5">{shares} shares</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-white/70">${value.toFixed(2)}</span>
                <span className={`text-[10px] font-mono ml-2 ${stockIsUp ? "text-emerald-400" : "text-red-400"}`}>
                  {stockIsUp ? "+" : ""}${change.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Update counter */}
      <div className="text-[10px] text-white/15 text-center font-mono">
        {updateCount} updates received
      </div>
    </div>
  );
}
