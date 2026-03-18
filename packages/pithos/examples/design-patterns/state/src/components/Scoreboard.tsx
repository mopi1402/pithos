import { PAST_SETS, SET_WINNERS, resolveLabel } from "@/lib/data";
import { FlipDigit } from "./FlipDigit";
import type { ScoreTransition } from "@/hooks/useTennisGame";

interface ScoreboardProps {
  phase: string;
  winner: "p1" | "p2" | null;
  statusLabel: string | null;
  transition: ScoreTransition;
}

export function Scoreboard({ phase, winner, statusLabel, transition }: ScoreboardProps) {
  const currentSetIndex = PAST_SETS.p1.length - 1;
  const p1PrevSet = PAST_SETS.p1[currentSetIndex];
  const p2PrevSet = PAST_SETS.p2[currentSetIndex];
  const p1CurrentSet = p1PrevSet + (winner === "p1" ? 1 : 0);
  const p2CurrentSet = p2PrevSet + (winner === "p2" ? 1 : 0);

  const isGameOver = phase === "gameOver";

  return (
    <div>
      <div style={{ background: "#214634", overflow: "hidden", position: "relative", zIndex: 2 }}>
        <PlayerRow
          name="Nadal"
          showBall
          sets={PAST_SETS.p1}
          currentSet={p1CurrentSet}
          prevSet={p1PrevSet}
          currentSetIndex={currentSetIndex}
          setWinners={SET_WINNERS}
          player="p1"
          fromScore={isGameOver ? transition.from.p1 : transition.from.p1}
          toScore={isGameOver ? "—" : transition.to.p1}
          direction={isGameOver ? "forward" : transition.directions.p1}
        />
        <PlayerRow
          name="Djokovic"
          sets={PAST_SETS.p2}
          currentSet={p2CurrentSet}
          prevSet={p2PrevSet}
          currentSetIndex={currentSetIndex}
          setWinners={SET_WINNERS}
          player="p2"
          fromScore={isGameOver ? transition.from.p2 : transition.from.p2}
          toScore={isGameOver ? "—" : transition.to.p2}
          direction={isGameOver ? "forward" : transition.directions.p2}
        />
      </div>

      <div className="text-sm uppercase tracking-wider text-center" style={{ perspective: "400px", height: "2.5em" }}>
        <div
          className={statusLabel ? "animate-panel-swing" : ""}
          style={{
            background: "#1a3829",
            color: "#6fb076",
            lineHeight: "2.5em",
            transform: statusLabel ? undefined : "rotateX(-110deg)",
            transformOrigin: "top center",
          }}
        >
          {statusLabel ? resolveLabel(statusLabel) : "\u00A0"}
        </div>
      </div>
    </div>
  );
}


function PlayerRow({
  name, showBall, sets, currentSet, prevSet, currentSetIndex, setWinners, player,
  fromScore, toScore, direction,
}: {
  name: string;
  showBall?: boolean;
  sets: number[];
  currentSet: number;
  prevSet: number;
  currentSetIndex: number;
  setWinners: string[];
  player: string;
  fromScore: string;
  toScore: string;
  direction: "forward" | "backward";
}) {
  return (
    <div className="flex items-center h-12">
      <div
        className="flex-1 shrink-0 h-12 flex items-center font-bold text-lg tracking-wide uppercase truncate pl-3"
        style={{ color: "#e7ece6", background: "linear-gradient(to bottom, #214634, #1d3f2f)" }}
      >
        {name}
        {showBall && (
          <span
            className="ml-2 inline-block rounded-full"
            style={{ width: 10, height: 10, background: "radial-gradient(circle at 35% 35%, #ffe066, #fbbf24, #d4a017)" }}
          />
        )}
      </div>
      {sets.map((score, i) => {
        if (i === currentSetIndex) {
          return (
            <div key={i} className="w-12 h-12 shrink-0" style={{ background: "linear-gradient(to bottom, #6fb076, #649b6b)" }}>
              <FlipDigit
                from={String(prevSet)}
                to={String(currentSet)}
                direction="forward"
                colorFn={() => "#e7ece6"}
              />
            </div>
          );
        }
        return (
          <SetCell
            key={i}
            value={score}
            won={setWinners[i] === player}
          />
        );
      })}
      <div className="w-12 h-12 shrink-0" style={{ background: "linear-gradient(to bottom, #ffffff, #e6e6e6)" }}>
        <FlipDigit from={fromScore} to={toScore} direction={direction} />
      </div>
    </div>
  );
}

function SetCell({ value, won }: { value: number; won?: boolean }) {
  return (
    <div
      className="w-12 h-12 flex items-center justify-center font-bold text-xl shrink-0"
      style={{
        background: "linear-gradient(to bottom, #214634, #1d3f2f)",
        color: won ? "#e7ece6" : "#6e9c78",
      }}
    >
      {value}
    </div>
  );
}
