/**
 * Chart builder using the Builder pattern.
 *
 * Fluent API: createChart().type("bar").title("...").labels([...]).data({...}).build()
 * The key insight: .addDataset() composes with previous state — something
 * a simple options object can't do.
 */

import { createBuilder } from "@pithos/core/eidos/builder/builder";
import type { ChartConfig, Dataset } from "./types";

const defaultConfig: ChartConfig = {
  type: "bar",
  title: "",
  labels: [],
  datasets: [],
  showLegend: false,
  yAxisLabel: "",
  gridLines: true,
};

export const chartBuilder = createBuilder(defaultConfig)
  .step("type", (state, type: "bar" | "line") => ({ ...state, type }))
  .step("title", (state, title: string) => ({ ...state, title }))
  .step("labels", (state, labels: string[]) => ({ ...state, labels }))
  .step("data", (state, dataset: Dataset) => ({ ...state, datasets: [dataset] }))
  .step("addDataset", (state, dataset: Dataset) => ({ ...state, datasets: [...state.datasets, dataset] }))
  .step("legend", (state, show: boolean) => ({ ...state, showLegend: show }))
  .step("yAxis", (state, label: string) => ({ ...state, yAxisLabel: label }))
  .step("gridLines", (state, show: boolean) => ({ ...state, gridLines: show }))
  .done();

export const createChart = () => chartBuilder();
