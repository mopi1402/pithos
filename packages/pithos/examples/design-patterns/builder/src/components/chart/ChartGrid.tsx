export function ChartGrid({ gridLines, padding, innerHeight, chartWidth, chartHeight, maxValue, yAxisLabel, labels, groupWidth }: {
  gridLines: boolean;
  padding: { top: number; right: number; bottom: number; left: number };
  innerHeight: number;
  chartWidth: number;
  chartHeight: number;
  maxValue: number;
  yAxisLabel: string;
  labels: string[];
  groupWidth: number;
}) {
  const gridLineCount = 5;
  const lines = gridLines
    ? Array.from({ length: gridLineCount + 1 }, (_, i) => ({
        y: padding.top + (innerHeight / gridLineCount) * i,
        value: Math.round(maxValue - (maxValue / gridLineCount) * i),
      }))
    : [];

  return (
    <>
      {lines.map(({ y, value }) => (
        <g key={y}>
          <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="#e2e8f0" strokeDasharray="4,4" />
          <text x={padding.left - 8} y={y + 4} textAnchor="end" className="text-[10px] fill-slate-400">{value}</text>
        </g>
      ))}
      {yAxisLabel && (
        <text x={12} y={chartHeight / 2} textAnchor="middle" transform={`rotate(-90, 12, ${chartHeight / 2})`} className="text-[10px] fill-slate-500 font-medium">
          {yAxisLabel}
        </text>
      )}
      {labels.map((label, i) => (
        <text key={i} x={padding.left + groupWidth * i + groupWidth / 2} y={chartHeight - padding.bottom + 20} textAnchor="middle" className="text-[10px] fill-slate-500">
          {label}
        </text>
      ))}
    </>
  );
}
