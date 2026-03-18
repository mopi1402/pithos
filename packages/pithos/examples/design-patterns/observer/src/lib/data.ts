import type { Stock } from "./types";

export const STOCKS: Stock[] = [
  { symbol: "AAPL", name: "Apple", price: 178.50, previousPrice: 178.50, history: [], color: "#3b82f6" },
  { symbol: "GOOGL", name: "Google", price: 141.25, previousPrice: 141.25, history: [], color: "#10b981" },
  { symbol: "NVDA", name: "Nvidia", price: 248.75, previousPrice: 248.75, history: [], color: "#f59e0b" },
  { symbol: "MSFT", name: "Microsoft", price: 415.30, previousPrice: 415.30, history: [], color: "#8b5cf6" },
];

// Pre-generate history so charts aren't empty on load
const PREFILL_COUNT = 20;

function seedHistory(basePrice: number): (number | null)[] {
  const history: (number | null)[] = [];
  let price = basePrice;
  for (let i = 0; i < PREFILL_COUNT; i++) {
    price = Math.max(1, price + price * ((Math.random() - 0.5) * 0.04));
    history.push(price);
  }
  return history;
}

// Apply seeded history to stocks
for (const stock of STOCKS) {
  stock.history = seedHistory(stock.price);
  stock.price = stock.history[stock.history.length - 1] as number;
}

export const ALERT_THRESHOLD = 2;

export interface Index {
  symbol: string;
  name: string;
  basePrice: number;
  price: number;
}

export const INDICES: Index[] = [
  { symbol: "S&P 500", name: "US", basePrice: 5420.50, price: 5420.50 },
  { symbol: "CAC 40", name: "FR", basePrice: 7635.20, price: 7635.20 },
  { symbol: "DAX", name: "DE", basePrice: 18450.80, price: 18450.80 },
  { symbol: "NIKKEI", name: "JP", basePrice: 38920.10, price: 38920.10 },
];
export const MARKET_START_HOUR = 8;
export const MINUTES_PER_TICK = 15;
export const HISTORY_SIZE = 96; // 24h at 15min intervals

export const HOLDINGS: Record<string, number> = {
  AAPL: 10,
  GOOGL: 5,
  NVDA: 8,
  MSFT: 6,
};
