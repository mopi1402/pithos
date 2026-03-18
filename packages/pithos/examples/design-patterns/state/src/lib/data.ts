/** Past set scores (decorative — the state machine only handles the current game) */
export const PAST_SETS = {
  p1: [6, 4, 4],
  p2: [2, 6, 1],
};

/** Which player won each past set */
export const SET_WINNERS = ["p1", "p2"];

/** Map generic P1/P2 labels to player names */
const PLAYER_NAMES: Record<string, string> = { P1: "Nadal", P2: "Djokovic" };

export function resolveLabel(label: string): string {
  return label.replace(/P[12]/g, (m) => PLAYER_NAMES[m] ?? m);
}
