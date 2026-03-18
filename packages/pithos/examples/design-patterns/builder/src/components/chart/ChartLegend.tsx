import type { Dataset } from "@/lib/types";

export function ChartLegend({ datasets }: { datasets: Dataset[] }) {
  return (
    <div className="flex justify-center gap-4 mt-2">
      {datasets.map((dataset, i) => (
        <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: dataset.color }} />
          {dataset.label}
        </div>
      ))}
    </div>
  );
}
