import { useState, useCallback, useEffect, useRef } from "react";
import {
  stockTicker,
  marketTick,
  getMarketIndices,
  getMarketTime,
  resetMarket,
  STOCKS,
  INDICES,
  HISTORY_SIZE,
  type Stock,
  type Index,
} from "@/lib/stockTicker";
import { useInterval } from "./useInterval";

export function useStockDashboard() {
  const [stocks, setStocks] = useState<Stock[]>(STOCKS);
  const [indices, setIndices] = useState<Index[]>(INDICES);
  const [isRunning, setIsRunning] = useState(true);
  const [tickCount, setTickCount] = useState(0);
  const isRunningRef = useRef(true);
  const unsubRef = useRef<(() => void) | null>(null);

  // Subscribe: receive real price updates
  const subscribe = useCallback(() => {
    unsubRef.current?.();
    unsubRef.current = stockTicker.subscribe((update) => {
      setStocks((prev) =>
        prev.map((stock) => {
          if (stock.symbol !== update.symbol) return stock;
          return {
            ...stock,
            price: update.price,
            history: [...stock.history.slice(-(HISTORY_SIZE - 1)), update.price],
          };
        }),
      );
      setTickCount((c) => c + 1);
    });
  }, []);

  // Unsubscribe: stop receiving, but time keeps moving
  const unsubscribe = useCallback(() => {
    unsubRef.current?.();
    unsubRef.current = null;
  }, []);

  // Subscribe on mount
  useEffect(() => {
    subscribe();
    return () => unsubscribe();
  }, [subscribe, unsubscribe]);

  // Market always ticks
  const tick = useCallback(() => {
    marketTick();
    setIndices(getMarketIndices().map((i) => ({ ...i })));

    // When unsubscribed, push null into history so the chart advances with a gap
    if (!isRunningRef.current) {
      setStocks((prev) =>
        prev.map((stock) => ({
          ...stock,
          history: [...stock.history.slice(-(HISTORY_SIZE - 1)), null],
        })),
      );
    }
  }, []);

  useInterval(tick, 800);

  const handleToggle = useCallback(() => {
    if (isRunningRef.current) {
      unsubscribe();
      isRunningRef.current = false;
    } else {
      subscribe();
      isRunningRef.current = true;
    }
    setIsRunning(isRunningRef.current);
  }, [subscribe, unsubscribe]);

  const handleReset = useCallback(() => {
    unsubscribe();
    isRunningRef.current = false;
    resetMarket();
    setStocks(STOCKS.map((s) => ({ ...s, history: [s.price as number | null] })));
    setIndices(INDICES.map((i) => ({ ...i })));
    setTickCount(0);
    setIsRunning(false);
  }, [unsubscribe]);

  return {
    stocks,
    indices,
    isRunning,
    tickCount,
    marketTime: getMarketTime(),
    handleToggle,
    handleReset,
  };
}
