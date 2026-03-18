import { useState, useEffect, useRef } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { stockTicker, ALERT_THRESHOLD, type Alert } from "@/lib/stockTicker";

export function AlertPanel({ subscribed }: { subscribed: boolean }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const counterRef = useRef(0);

  useEffect(() => {
    if (!subscribed) return;

    const unsubscribe = stockTicker.subscribe((update) => {
      const { symbol, changePercent, price } = update;

      if (Math.abs(changePercent) >= ALERT_THRESHOLD) {
        const isUp = changePercent > 0;
        counterRef.current += 1;
        const newAlert: Alert = {
          id: `${symbol}-${Date.now()}-${counterRef.current}`,
          symbol,
          message: `${symbol} ${isUp ? "↑" : "↓"} ${Math.abs(changePercent).toFixed(1)}% → $${price.toFixed(2)}`,
          type: isUp ? "up" : "down",
          timestamp: Date.now(),
        };

        setAlerts((prev) => [newAlert, ...prev].slice(0, 15));
      }
    });

    return unsubscribe;
  }, [subscribed]);

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-white/20">
        <p className="text-xs">No alerts yet</p>
        <p className="text-[10px] mt-0.5">Triggers on ±{ALERT_THRESHOLD}% moves</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/[0.04]">
      {alerts.map((alert) => (
        <div key={alert.id} className="flex items-center gap-2 px-4 py-2">
          <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
            alert.type === "up" ? "bg-emerald-500/20" : "bg-red-500/20"
          }`}>
            {alert.type === "up" ? (
              <TrendingUp className="w-3 h-3 text-emerald-400" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-400" />
            )}
          </div>
          <span className={`text-xs flex-1 ${alert.type === "up" ? "text-emerald-300/80" : "text-red-300/80"}`}>
            {alert.message}
          </span>
          <span className="text-[9px] text-white/15 font-mono shrink-0">
            {new Date(alert.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
      ))}
    </div>
  );
}
