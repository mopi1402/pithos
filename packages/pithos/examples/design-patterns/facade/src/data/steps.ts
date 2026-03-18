import type { StepState } from "@/lib/types";

export interface StepDef {
  key: string;
  label: string;
}

export const STEP_DEFS: StepDef[] = [
  { key: "validate", label: "Validate Input" },
  { key: "auth", label: "Build Auth Headers" },
  { key: "serialize", label: "Serialize Request" },
  { key: "fetch", label: "Execute Fetch" },
  { key: "parse", label: "Parse Response" },
  { key: "format", label: "Format Result" },
];

export const STEP_KEYS = STEP_DEFS.map((s) => s.key);

export const makeInitialSteps = (): Record<string, StepState> =>
  Object.fromEntries(STEP_KEYS.map((k) => [k, { status: "idle" as const, detail: "", durationMs: 0 }]));
