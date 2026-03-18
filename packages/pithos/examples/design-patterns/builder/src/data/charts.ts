export interface BuilderStep {
  id: string;
  label: string;
  enabled: boolean;
}

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
export const REVENUE_DATA = [120, 340, 220, 510, 480, 390];
export const EXPENSES_DATA = [80, 150, 120, 200, 180, 160];

export const INITIAL_STEPS: BuilderStep[] = [
  { id: "title", label: '.title("Monthly Revenue")', enabled: false },
  { id: "labels", label: ".labels([...])", enabled: true },
  { id: "data", label: ".data({ label, data, color })", enabled: true },
  { id: "addDataset", label: ".addDataset({ ... })", enabled: false },
  { id: "legend", label: ".legend(true)", enabled: false },
  { id: "yAxis", label: '.yAxis("Amount ($)")', enabled: false },
];
