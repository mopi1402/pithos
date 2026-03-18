import { type Stock } from "@/lib/stockTicker";

export function MiniChart({ stock }: { stock: Stock }) {
  const { symbol, name, price, previousPrice, history } = stock;
  const change = price - previousPrice;
  const changePercent = previousPrice > 0 ? (change / previousPrice) * 100 : 0;
  const isUp = change >= 0;

  // Compute min/max from non-null values
  const values = history.filter((v): v is number => v !== null);
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 1;
  const range = max - min || 1;
  const w = 120;
  const h = 40;

  // Build segments: each segment is a continuous run of non-null values
  const segments: string[] = [];
  let current = "";
  for (let i = 0; i < history.length; i++) {
    const v = history[i];
    if (v !== null) {
      const x = (i / (history.length - 1 || 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      current += (current ? " " : "") + `${x},${y}`;
    } else {
      if (current) { segments.push(current); current = ""; }
    }
  }
  if (current) segments.push(current);

  const strokeColor = isUp ? "#10b981" : "#ef4444";
  const gradId = `grad-${symbol}`;

  return (
    <div className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-3 hover:bg-white/[0.05] transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md overflow-hidden shrink-0 drop-shadow-md">
            <img src={`${symbol}.png`} alt={name} className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-xs font-bold text-white/90">{symbol}</div>
            <div className="text-[10px] text-white/30">{name}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold font-mono text-white/90">${price.toFixed(2)}</div>
          <div className={`text-[10px] font-mono ${isUp ? "text-emerald-400" : "text-red-400"}`}>
            {isUp ? "+" : ""}{changePercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Sparkline with gaps */}
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="overflow-visible">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        {segments.map((pts, i) => (
          <g key={i}>
            <polygon
              points={`${pts.split(" ")[0].split(",")[0]},${h} ${pts} ${pts.split(" ").pop()?.split(",")[0]},${h}`}
              fill={`url(#${gradId})`}
            />
            <polyline
              points={pts}
              fill="none"
              stroke={strokeColor}
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
