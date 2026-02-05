/**
 * Hook for the Pithos jar easter egg.
 *
 * Tracks clicks on a target element. The first 2 clicks are silent.
 * From click 3 onward, a countdown toast appears (à la Android dev mode).
 * At click 5, shows "Vous êtes en mode développeur !" then triggers
 * the hero transition. Once discovered, a single click re-opens.
 */

import { useRef, useState, useCallback } from "react";

interface PithosEasterEggState {
  startRect: DOMRect;
}

interface UsePithosEasterEggReturn {
  jarRef: React.RefObject<HTMLDivElement | null>;
  handleClick: () => void;
  easterEgg: PithosEasterEggState | null;
  animating: boolean;
  jarHidden: boolean;
  devModeCountdown: number | null;
  devModeUnlocked: boolean;
  setJarHidden: (v: boolean) => void;
  setAnimating: (v: boolean) => void;
  finishReturn: () => void;
  close: () => void;
}

const CLICK_THRESHOLD = 5;
const SILENT_CLICKS = 2;
const DEV_MODE_MESSAGE_MS = 1200;

export function usePithosEasterEgg(): UsePithosEasterEggReturn {
  const jarRef = useRef<HTMLDivElement>(null);
  const clickCountRef = useRef(0);
  const [easterEgg, setEasterEgg] = useState<PithosEasterEggState | null>(null);
  const [animating, setAnimating] = useState(false);
  const [jarHidden, setJarHidden] = useState(false);

  const [devModeCountdown, setDevModeCountdown] = useState<number | null>(null);
  const [devModeUnlocked, setDevModeUnlocked] = useState(false);
  const devModeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const discoveredRef = useRef(false);

  const handleClick = useCallback(() => {
    // Once discovered, skip the countdown entirely
    if (discoveredRef.current) {
      if (jarRef.current) {
        const rect = jarRef.current.getBoundingClientRect();
        setEasterEgg({ startRect: rect });
      }
      return;
    }

    clickCountRef.current += 1;
    const count = clickCountRef.current;

    if (count > SILENT_CLICKS && count < CLICK_THRESHOLD) {
      // Show remaining clicks
      setDevModeCountdown(CLICK_THRESHOLD - count);
    }

    if (count >= CLICK_THRESHOLD && jarRef.current) {
      const rect = jarRef.current.getBoundingClientRect();
      clickCountRef.current = 0;
      discoveredRef.current = true;
      setDevModeCountdown(null);
      setDevModeUnlocked(true);

      // Show "dev mode" message, then trigger the easter egg
      clearTimeout(devModeTimerRef.current);
      devModeTimerRef.current = setTimeout(() => {
        setDevModeUnlocked(false);
        setEasterEgg({ startRect: rect });
      }, DEV_MODE_MESSAGE_MS);
    }
  }, []);

  const close = useCallback(() => {
    if (!animating) {
      setEasterEgg(null);
      setJarHidden(false);
    } else {
      setAnimating(false);
    }
  }, [animating]);

  const finishReturn = useCallback(() => {
    setEasterEgg(null);
    setJarHidden(false);
  }, []);

  return {
    jarRef, handleClick, easterEgg, animating, jarHidden,
    devModeCountdown, devModeUnlocked,
    setJarHidden, setAnimating, finishReturn, close,
  };
}
