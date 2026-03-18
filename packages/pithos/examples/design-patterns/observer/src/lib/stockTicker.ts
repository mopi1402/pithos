/**
 * Stock ticker using Pithos Observer pattern.
 *
 * The market ALWAYS runs. Subscribers receive updates only when subscribed.
 * Unsubscribe = you stop receiving, but the market doesn't stop.
 */

import { createObservable } from "@pithos/core/eidos/observer/observer";
import type { Stock, StockUpdate } from "./types";
import type { Index } from "./data";
import { STOCKS as INITIAL_STOCKS, MARKET_START_HOUR, MINUTES_PER_TICK, INDICES as INITIAL_INDICES } from "./data";

export type { StockUpdate, Alert, Stock } from "./types";
export type { Index } from "./data";
export { STOCKS, ALERT_THRESHOLD, HOLDINGS, INDICES, MARKET_START_HOUR, MINUTES_PER_TICK, HISTORY_SIZE } from "./data";

/** The observable — the market emits updates, subscribers listen */
export const stockTicker = createObservable<StockUpdate>();

let tickIndex = 20;

export function getMarketTime(): string {
  const totalMinutes = MARKET_START_HOUR * 60 + tickIndex * MINUTES_PER_TICK;
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function randomChange(currentPrice: number): number {
  return currentPrice * ((Math.random() - 0.5) * 6 / 100);
}

/** Internal market state — always running */
let marketStocks: Stock[] = INITIAL_STOCKS.map((s) => ({ ...s }));
let marketIndices: Index[] = INITIAL_INDICES.map((i) => ({ ...i }));

/** Tick the market: updates prices and notifies subscribers */
export function marketTick(): void {
  tickIndex++;

  marketStocks = marketStocks.map((stock) => {
    const change = randomChange(stock.price);
    const newPrice = Math.max(1, stock.price + change);
    const changePercent = ((newPrice - stock.previousPrice) / stock.previousPrice) * 100;

    // Notify subscribers
    queueMicrotask(() => {
      stockTicker.notify({
        symbol: stock.symbol,
        price: newPrice,
        change: newPrice - stock.price,
        changePercent,
        timestamp: Date.now(),
      });
    });

    return { ...stock, price: newPrice };
  });

  marketIndices = marketIndices.map((idx) => {
    const pctChange = (Math.random() - 0.5) * 0.4;
    return { ...idx, price: Math.max(1, idx.price + idx.price * (pctChange / 100)) };
  });
}

/** Get current market indices (always live) */
export function getMarketIndices(): Index[] {
  return marketIndices;
}

/** Reset everything */
export function resetMarket(): void {
  tickIndex = 20;
  marketStocks = INITIAL_STOCKS.map((s) => ({ ...s }));
  marketIndices = INITIAL_INDICES.map((i) => ({ ...i }));
}
