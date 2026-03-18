import type { TennisEvent } from "@/lib/tennisMachine";

interface GameControlsProps {
  phase: string;
  onPoint: (player: TennisEvent) => void;
  layout?: "row" | "column";
}

export function GameControls({ phase, onPoint, layout = "row" }: GameControlsProps) {
  const disabled = phase === "gameOver";
  const btnClass = "flex-1 py-3 px-4 text-white font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:translate-y-[-1px] hover:shadow-xl active:translate-y-[1px] active:shadow-md";
  const btnStyle = { background: "linear-gradient(to bottom, #2a5e42, #1d4430)" };

  return (
    <div className={`flex gap-3 ${layout === "column" ? "flex-col" : ""}`}>
      <button onClick={() => onPoint("p1")} disabled={disabled} className={btnClass} style={btnStyle}>
        Point Nadal
      </button>
      <button onClick={() => onPoint("p2")} disabled={disabled} className={btnClass} style={btnStyle}>
        Point Djokovic
      </button>
    </div>
  );
}
