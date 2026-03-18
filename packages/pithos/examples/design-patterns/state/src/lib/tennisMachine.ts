import { createMachine } from "@pithos/core/eidos/state/state";

/**
 * Tennis game scoring state machine.
 * 
 * States represent score combinations: "P1Score-P2Score"
 * Events: "p1" (player 1 scores) or "p2" (player 2 scores)
 */

export type TennisState = 
  | "0-0" | "15-0" | "0-15" | "30-0" | "15-15" | "0-30"
  | "40-0" | "30-15" | "15-30" | "0-40" | "40-15" | "30-30"
  | "15-40" | "40-30" | "30-40" | "Deuce" | "AD-P1" | "AD-P2"
  | "Game-P1" | "Game-P2";

export type TennisEvent = "p1" | "p2";

/** Metadata for each state — NO if/else needed */
interface StateMetadata {
  p1Score: string;
  p2Score: string;
  phase: "normal" | "deuce" | "gameOver";
  winner: "p1" | "p2" | null;
  statusLabel: string | null;
}

/** All state metadata in a single record — the State pattern way */
const STATE_METADATA: Record<TennisState, StateMetadata> = {
  // Normal scoring
  "0-0":     { p1Score: "0",    p2Score: "0",    phase: "normal",   winner: null, statusLabel: null },
  "15-0":    { p1Score: "15",   p2Score: "0",    phase: "normal",   winner: null, statusLabel: null },
  "0-15":    { p1Score: "0",    p2Score: "15",   phase: "normal",   winner: null, statusLabel: null },
  "30-0":    { p1Score: "30",   p2Score: "0",    phase: "normal",   winner: null, statusLabel: null },
  "15-15":   { p1Score: "15",   p2Score: "15",   phase: "normal",   winner: null, statusLabel: null },
  "0-30":    { p1Score: "0",    p2Score: "30",   phase: "normal",   winner: null, statusLabel: null },
  "40-0":    { p1Score: "40",   p2Score: "0",    phase: "normal",   winner: null, statusLabel: null },
  "30-15":   { p1Score: "30",   p2Score: "15",   phase: "normal",   winner: null, statusLabel: null },
  "15-30":   { p1Score: "15",   p2Score: "30",   phase: "normal",   winner: null, statusLabel: null },
  "0-40":    { p1Score: "0",    p2Score: "40",   phase: "normal",   winner: null, statusLabel: null },
  "40-15":   { p1Score: "40",   p2Score: "15",   phase: "normal",   winner: null, statusLabel: null },
  "30-30":   { p1Score: "30",   p2Score: "30",   phase: "normal",   winner: null, statusLabel: null },
  "15-40":   { p1Score: "15",   p2Score: "40",   phase: "normal",   winner: null, statusLabel: null },
  "40-30":   { p1Score: "40",   p2Score: "30",   phase: "normal",   winner: null, statusLabel: null },
  "30-40":   { p1Score: "30",   p2Score: "40",   phase: "normal",   winner: null, statusLabel: null },
  // Deuce phase
  "Deuce":   { p1Score: "40",   p2Score: "40",   phase: "deuce",    winner: null, statusLabel: "Deuce" },
  "AD-P1":   { p1Score: "AD",   p2Score: "40",   phase: "deuce",    winner: null, statusLabel: "Advantage P1" },
  "AD-P2":   { p1Score: "40",   p2Score: "AD",   phase: "deuce",    winner: null, statusLabel: "Advantage P2" },
  // Terminal states
  "Game-P1": { p1Score: "Game", p2Score: "",     phase: "gameOver", winner: "p1", statusLabel: "Game" },
  "Game-P2": { p1Score: "",     p2Score: "Game", phase: "gameOver", winner: "p2", statusLabel: "Game" },
};

/** State transitions — the machine definition */
const TENNIS_TRANSITIONS = {
  "0-0":   { p1: { to: "15-0" },    p2: { to: "0-15" } },
  "15-0":  { p1: { to: "30-0" },    p2: { to: "15-15" } },
  "0-15":  { p1: { to: "15-15" },   p2: { to: "0-30" } },
  "30-0":  { p1: { to: "40-0" },    p2: { to: "30-15" } },
  "15-15": { p1: { to: "30-15" },   p2: { to: "15-30" } },
  "0-30":  { p1: { to: "15-30" },   p2: { to: "0-40" } },
  "40-0":  { p1: { to: "Game-P1" }, p2: { to: "40-15" } },
  "30-15": { p1: { to: "40-15" },   p2: { to: "30-30" } },
  "15-30": { p1: { to: "30-30" },   p2: { to: "15-40" } },
  "0-40":  { p1: { to: "15-40" },   p2: { to: "Game-P2" } },
  "40-15": { p1: { to: "Game-P1" }, p2: { to: "40-30" } },
  "30-30": { p1: { to: "40-30" },   p2: { to: "30-40" } },
  "15-40": { p1: { to: "30-40" },   p2: { to: "Game-P2" } },
  "40-30": { p1: { to: "Game-P1" }, p2: { to: "Deuce" } },
  "30-40": { p1: { to: "Deuce" },   p2: { to: "Game-P2" } },
  // Deuce and Advantage loop
  "Deuce": { p1: { to: "AD-P1" },   p2: { to: "AD-P2" } },
  "AD-P1": { p1: { to: "Game-P1" }, p2: { to: "Deuce" } },
  "AD-P2": { p1: { to: "Deuce" },   p2: { to: "Game-P2" } },
  // Terminal states (no transitions)
  "Game-P1": {},
  "Game-P2": {},
} as const;

export function createTennisGame() {
  return createMachine(TENNIS_TRANSITIONS, "0-0");
}

/** Get metadata for a state — just a lookup, no conditionals */
export function getStateMetadata(state: TennisState): StateMetadata {
  return STATE_METADATA[state];
}

export interface ScoreDirections {
  p1: "forward" | "backward";
  p2: "forward" | "backward";
}

/** Determine flip direction per player between two states */
export function getScoreDirections(from: TennisState, to: TennisState): ScoreDirections {
  const prev = STATE_METADATA[from];
  const next = STATE_METADATA[to];

  return {
    p1: isScoreBackward(prev.p1Score, next.p1Score) ? "backward" : "forward",
    p2: isScoreBackward(prev.p2Score, next.p2Score) ? "backward" : "forward",
  };
}

const SCORE_ORDER = ["", "0", "15", "30", "40", "AD", "Game"];

function isScoreBackward(from: string, to: string): boolean {
  const fi = SCORE_ORDER.indexOf(from);
  const ti = SCORE_ORDER.indexOf(to);
  if (fi === -1 || ti === -1) return false;
  return ti < fi;
}
