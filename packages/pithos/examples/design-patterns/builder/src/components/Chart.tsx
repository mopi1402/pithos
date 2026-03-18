import type { ChartConfig } from "@/lib/types";
import { ChartGrid } from "./chart/ChartGrid";
import { ChartBars } from "./chart/ChartBars";
import { ChartLines } from "./chart/ChartLines";
import { ChartLegend } from "./chart/ChartLegend";

const CHART_W = 400;
const CHART_H = 200;
const PADDING = { top: 20, right: 20, bottom: 40, left: 50 };

export function Chart({ config }: { config: ChartConfig }) {
  const { type, title, labels, datasets, showLegend, yAxisLabel, gridLines } = config;

  if (datasets.length === 0 || labels.length === 0) {
    return <div className="h-full flex items-center justify-center text-slate-400">Add data and labels to see the chart</div>;
  }

  const maxValue = Math.max(...datasets.flatMap((d) => d.data), 1);
  const innerW = CHART_W - PADDING.left - PADDING.right;
  const innerH = CHART_H - PADDING.top - PADDING.bottom;
  const groupWidth = innerW / labels.length;
  const barWidth = innerW / labels.length / (datasets.length + 0.5);

  return (
    <div className="h-full flex flex-col">
      {title && <h3 className="text-center text-sm font-semibold text-slate-700 mb-2">{title}</h3>}
      <div className="flex-1 flex items-center justify-center">
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full h-full max-h-[250px]">
          <ChartGrid gridLines={gridLines} padding={PADDING} innerHeight={innerH} chartWidth={CHART_W} chartHeight={CHART_H} maxValue={maxValue} yAxisLabel={yAxisLabel} labels={labels} groupWidth={groupWidth} />
          {type === "bar"
            ? <ChartBars datasets={datasets} labels={labels} maxValue={maxValue} padding={PADDING} innerHeight={innerH} groupWidth={groupWidth} barWidth={barWidth} />
            : <ChartLines datasets={datasets} labels={labels} maxValue={maxValue} padding={PADDING} innerHeight={innerH} groupWidth={groupWidth} />
          }
        </svg>
      </div>
      {showLegend && datasets.length > 0 && <ChartLegend datasets={datasets} />}
    </div>
  );
}
