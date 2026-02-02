import type { Metric } from "../types";
import { formatBytes } from "../utils";

export function MetricValue({
  value,
  visible,
  metric,
}: {
  value: number;
  visible: boolean;
  metric: Metric;
}) {
  if (!visible) return null;
  return <span class={`metric ${metric}`}>{formatBytes(value)}</span>;
}

