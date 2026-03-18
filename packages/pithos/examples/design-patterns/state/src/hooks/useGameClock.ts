import { useState, useEffect, useRef } from "react";

/**
 * A match clock that starts immediately and stops on game over.
 * Starts at a base offset (default 2h43m) to simulate an ongoing match.
 * Returns a formatted "H:MM" string (hours and minutes only).
 */
export function useGameClock(pointCount: number, gameOver: boolean) {
  const BASE_OFFSET = 2 * 3600 + 43 * 60; // 2h43m in seconds
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number>(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start ticking immediately, stop on game over
  useEffect(() => {
    if (gameOver) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const secs = Math.floor((Date.now() - startRef.current) / 1000);
      setElapsed(secs);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [gameOver]);

  // Reset
  useEffect(() => {
    if (pointCount <= 1) {
      startRef.current = Date.now();
      setElapsed(0);
    }
  }, [pointCount]);

  const total = BASE_OFFSET + elapsed;
  const hours = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);

  return `${hours}:${String(mins).padStart(2, "0")}`;
}
