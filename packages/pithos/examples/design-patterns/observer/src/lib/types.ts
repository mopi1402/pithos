export interface StockUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export interface Alert {
  id: string;
  symbol: string;
  message: string;
  type: "up" | "down";
  timestamp: number;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  previousPrice: number;
  history: (number | null)[];
  color: string;
}
