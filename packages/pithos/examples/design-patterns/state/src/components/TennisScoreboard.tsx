import { RotateCcw } from "lucide-react";
import { useTennisGame } from "@/hooks/useTennisGame";
import { ClayNoiseOverlay, clayCourtStyle } from "./ClayNoiseOverlay";
import { Scoreboard } from "./Scoreboard";
import { GameControls } from "./GameControls";
import { FlipDigit } from "./FlipDigit";
import { LedClock } from "./LedClock";
import { useGameClock } from "@/hooks/useGameClock";
import { TransitionHistory } from "./TransitionHistory";

const bigScoreColor = (val: string) => {
  if (val === "AD") return "#f59e0b";
  if (val === "—") return "#6b7280";
  return "#ffffff";
};

export function TennisScoreboard() {
  const { currentState, phase, winner, statusLabel, history, transition, handlePoint, handleReset } = useTennisGame();
  const clock = useGameClock(history.length, phase === "gameOver");

  return (
    <>
      {/* Mobile layout */}
      <div className="flex flex-col h-screen md:hidden">
        <div className="shrink-0 px-4 pt-4 pb-3" style={{ ...clayCourtStyle, background: "#c75b12" }}>
          <ClayNoiseOverlay />
          <div style={{ position: "relative", zIndex: 2 }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-white">🎾 Tennis Scoreboard</h2>
              <ResetButton onClick={handleReset} />
            </div>
            <Scoreboard phase={phase} winner={winner} statusLabel={statusLabel} transition={transition} />
          </div>
        </div>

        <div className="shrink-0 px-4 py-3" style={{ ...clayCourtStyle, background: "#b34e0f" }}>
          <ClayNoiseOverlay />
          <div className="flex flex-col gap-3" style={{ position: "relative", zIndex: 2 }}>
            <p className="text-white/80 text-sm text-center">Tap to score a point<br />Watch the state machine transitions</p>
            <GameControls phase={phase} onPoint={handlePoint} layout="column" />
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden px-4 py-3 bg-slate-100">
          <TransitionHistory history={history} fillHeight />
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block max-w-5xl mx-auto py-8 px-4 space-y-6">
        {/* Top row: scoreboard + big score — single orange block */}
        <section className="rounded-xl shadow-lg overflow-hidden" style={{ ...clayCourtStyle, background: "rgba(0,0,0,0.2)" }}>
          <ClayNoiseOverlay />
          <div className="flex relative" style={{ zIndex: 2 }}>
            {/* Left 2/3: scoreboard + controls */}
            <div className="w-2/3 p-6 border-r border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4">🎾 Tennis Scoreboard</h2>
              <Scoreboard phase={phase} winner={winner} statusLabel={statusLabel} transition={transition} />
              <hr className="border-white/20 my-4" />
              <p className="text-white/80 text-sm text-center mb-3">Tap to score a point · Watch the state machine transitions</p>
              <div className="flex flex-col gap-3">
                <GameControls phase={phase} onPoint={handlePoint} />
                <ResetButton onClick={handleReset} showLabel />
              </div>
            </div>

            {/* Right 1/3: big score */}
            <div className="w-1/3 flex flex-col items-center justify-center px-10 py-6" style={{ background: "#1a3829" }}>
                <div className="text-sm text-white/50 uppercase tracking-wider mb-4">Current Game</div>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-6">
                  <div className="w-24 h-20 overflow-hidden">
                    <FlipDigit
                      from={phase === "gameOver" ? transition.from.p1 : transition.from.p1}
                      to={phase === "gameOver" ? "—" : transition.to.p1}
                      direction={transition.directions.p1}
                      textClass="font-bold text-5xl tabular-nums"
                      colorFn={bigScoreColor}
                    />
                  </div>
                  <span className="text-3xl text-white/30 font-light">–</span>
                  <div className="w-24 h-20 overflow-hidden">
                    <FlipDigit
                      from={phase === "gameOver" ? transition.from.p2 : transition.from.p2}
                      to={phase === "gameOver" ? "—" : transition.to.p2}
                      direction={transition.directions.p2}
                      textClass="font-bold text-5xl tabular-nums"
                      colorFn={bigScoreColor}
                    />
                  </div>
                  <div className="text-sm text-white/50 text-center mt-2">Nadal</div>
                  <div />
                  <div className="text-sm text-white/50 text-center mt-2">Djokovic</div>
                </div>
                <hr className="border-white/20 w-full my-4" />
                {/* Match clock — LED display */}
                <div className="mt-6 text-center">
                  <LedClock value={clock} />
                  <div className="text-sm text-white/50 uppercase tracking-wider mt-1">Match Time</div>
                </div>
            </div>
          </div>
        </section>

        {/* Bottom: State Machine (horizontal) */}
        <section className="bg-white/70 rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-start gap-8">
            <div className="shrink-0">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">State Machine</h2>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500 mb-1">Current State</div>
                <div className="text-xl font-mono font-bold" style={{ color: "#c75b12" }}>{currentState}</div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <TransitionHistory history={history} />
            </div>
          </div>
        </section>

        {/* Key insight */}
        <section className="bg-amber-50 rounded-xl shadow-sm border border-amber-200 p-5">
          <p className="text-sm text-amber-800">
            <strong>Key insight:</strong> No if/else, just a lookup in STATE_METADATA[currentState].
            The Deuce ↔ Advantage loop is encoded in transitions, not conditionals.
          </p>
        </section>
      </div>
    </>
  );
}

function ResetButton({ onClick, showLabel }: { onClick: () => void; showLabel?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`${showLabel ? "w-full py-3 px-4" : "py-2 px-3"} bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2`}
      aria-label="Reset game"
    >
      <RotateCcw className={showLabel ? "w-5 h-5" : "w-4 h-4"} />
      {showLabel && "Reset"}
    </button>
  );
}
