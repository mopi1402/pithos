import { useState, useMemo, useCallback } from "react";
import { createChart } from "@/lib/builder";
import { INITIAL_STEPS, MONTHS, REVENUE_DATA, EXPENSES_DATA } from "@/data/charts";
import type { ChartConfig } from "@/lib/types";

export function useChartBuilder() {
  const [steps, setSteps] = useState(INITIAL_STEPS);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  const toggleStep = useCallback((id: string) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  }, []);

  const isEnabled = useCallback((id: string) => steps.find((s) => s.id === id)?.enabled ?? false, [steps]);

  const chartConfig = useMemo((): ChartConfig => {
    let builder = createChart().type(chartType);
    if (isEnabled("title")) builder = builder.title("Monthly Revenue");
    if (isEnabled("labels")) builder = builder.labels(MONTHS);
    if (isEnabled("data")) builder = builder.data({ label: "Revenue", data: REVENUE_DATA, color: "#3b82f6" });
    if (isEnabled("addDataset") && isEnabled("data")) builder = builder.addDataset({ label: "Expenses", data: EXPENSES_DATA, color: "#ef4444" });
    if (isEnabled("legend")) builder = builder.legend(true);
    if (isEnabled("yAxis")) builder = builder.yAxis("Amount ($)");
    return builder.build();
  }, [steps, chartType, isEnabled]);

  const codePreview = useMemo(() => {
    const lines = [`const chart = createChart()\n  .type("${chartType}")`];
    if (isEnabled("title")) lines.push('  .title("Monthly Revenue")');
    if (isEnabled("labels")) lines.push("  .labels([...])");
    if (isEnabled("data")) lines.push('  .data({ label: "Revenue", data: [...], color: "#3b82f6" })');
    if (isEnabled("addDataset") && isEnabled("data")) lines.push('  .addDataset({ label: "Expenses", data: [...], color: "#ef4444" })');
    if (isEnabled("legend")) lines.push("  .legend(true)");
    if (isEnabled("yAxis")) lines.push('  .yAxis("Amount ($)")');
    lines.push("  .build();");
    return lines.join("\n");
  }, [steps, chartType, isEnabled]);

  return { steps, chartType, setChartType, toggleStep, isEnabled, chartConfig, codePreview };
}
