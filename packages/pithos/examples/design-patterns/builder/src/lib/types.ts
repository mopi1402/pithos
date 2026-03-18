export interface Dataset {
  label: string;
  data: number[];
  color: string;
}

export interface ChartConfig {
  type: "bar" | "line";
  title: string;
  labels: string[];
  datasets: Dataset[];
  showLegend: boolean;
  yAxisLabel: string;
  gridLines: boolean;
}
