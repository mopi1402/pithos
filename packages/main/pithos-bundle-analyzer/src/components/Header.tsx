import type { Metric } from "../types";
import { formatBytes } from "../utils";
import { metrics } from "../types";

export function Header({
  visibleMetrics,
  totals,
  toggleMetric,
}: {
  visibleMetrics: Record<Metric, boolean>;
  totals: { raw: number; gzip: number; brotli: number } | null;
  toggleMetric: (metric: Metric) => void;
}) {
  return (
    <header>
      <h1>Pithos</h1>
      <div class="subtitle">Bundle sizes (raw / gzip / brotli)</div>
      <div class="controls">
        <div class="controls-left">
          {metrics.map((metric) => (
            <label class="control" key={metric}>
              <input
                type="checkbox"
                checked={visibleMetrics[metric]}
                onChange={() => toggleMetric(metric)}
              />
              <span class={`label-${metric}`}>● {metric}</span>
              <span class="size">
                | {totals ? formatBytes(totals[metric]) : "…"}
              </span>
            </label>
          ))}
        </div>
      </div>
    </header>
  );
}
