export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
}

export type StepStatus = "idle" | "running" | "done" | "error";

export interface StepState {
  status: StepStatus;
  detail: string;
  durationMs: number;
}

export type Mode = "expanded" | "facade";
