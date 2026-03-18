import { useState, useCallback } from "react";
import {
  createTennisGame,
  getStateMetadata,
  getScoreDirections,
  type TennisState,
  type TennisEvent,
  type ScoreDirections,
} from "@/lib/tennisMachine";

export interface ScoreTransition {
  from: { p1: string; p2: string };
  to: { p1: string; p2: string };
  directions: ScoreDirections;
}

export function useTennisGame() {
  const [machine, setMachine] = useState(() => createTennisGame());
  const [history, setHistory] = useState<TennisState[]>(["0-0"]);

  const [transition, setTransition] = useState<ScoreTransition>({
    from: { p1: "0", p2: "0" },
    to: { p1: "0", p2: "0" },
    directions: { p1: "forward", p2: "forward" },
  });

  const currentState = machine.current() as TennisState;
  const metadata = getStateMetadata(currentState);

  const handlePoint = useCallback((player: TennisEvent) => {
    if (metadata.phase === "gameOver") return;

    const before = machine.current() as TennisState;
    const beforeMeta = getStateMetadata(before);
    machine.send(player);
    const after = machine.current() as TennisState;
    const afterMeta = getStateMetadata(after);

    setTransition({
      from: { p1: beforeMeta.p1Score, p2: beforeMeta.p2Score },
      to: { p1: afterMeta.p1Score, p2: afterMeta.p2Score },
      directions: getScoreDirections(before, after),
    });

    setHistory((prev) => [...prev, after]);
    setMachine({ ...machine });
  }, [machine, metadata.phase]);

  const handleReset = useCallback(() => {
    setMachine(createTennisGame());
    setHistory(["0-0"]);
    setTransition({
      from: { p1: "0", p2: "0" },
      to: { p1: "0", p2: "0" },
      directions: { p1: "forward", p2: "forward" },
    });
  }, []);

  return { currentState, ...metadata, history, transition, handlePoint, handleReset };
}
