import type { Dataset } from "@/lib/types";

export function ChartBars({ datasets, labels, maxValue, padding, innerHeight, groupWidth, barWidth }: {
  datasets: Dataset[];
  labels: string[];
  maxValue: number;
  padding: { top: number; left: number };
  innerHeight: number;
  groupWidth: number;
  barWidth: number;
}) {
  return (
    <>
      {datasets.map((dataset, di) =>
        dataset.data.slice(0, labels.length).map((value, i) => {
          const h = (value / maxValue) * innerHeight;
          const x = padding.left + groupWidth * i + (groupWidth - barWidth * datasets.length) / 2 + barWidth * di;
          const y = padding.top + innerHeight - h;
          return <rect key={`${di}-${i}`} x={x} y={y} width={barWidth * 0.9} height={h} fill={dataset.color} rx={2} className="transition-all duration-300" />;
        }),
      )}
    </>
  );
}
