import type { Dataset } from "@/lib/types";

export function ChartLines({ datasets, labels, maxValue, padding, innerHeight, groupWidth }: {
  datasets: Dataset[];
  labels: string[];
  maxValue: number;
  padding: { top: number; left: number };
  innerHeight: number;
  groupWidth: number;
}) {
  return (
    <>
      {datasets.map((dataset, di) => {
        const points = dataset.data.slice(0, labels.length).map((value, i) => ({
          x: padding.left + groupWidth * i + groupWidth / 2,
          y: padding.top + innerHeight - (value / maxValue) * innerHeight,
        }));
        const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
        return (
          <g key={di}>
            <path d={pathD} fill="none" stroke={dataset.color} strokeWidth={2} className="transition-all duration-300" />
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={4} fill={dataset.color} className="transition-all duration-300" />
            ))}
          </g>
        );
      })}
    </>
  );
}
