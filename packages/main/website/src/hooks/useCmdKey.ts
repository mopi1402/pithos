import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Tracks whether Cmd (macOS) or Ctrl (other OS) is currently held down.
 *
 * Uses multiple event sources to work around the macOS bug where
 * `keyup` for Meta is swallowed by system shortcuts (e.g. Shift+Cmd+5):
 *
 * - `keydown`/`keyup`: primary tracking
 * - `mousemove`/`mousedown`/`mouseup`/`click`: every mouse event carries
 *   `metaKey`/`ctrlKey`, so any interaction corrects stale state
 * - `keydown`/`keyup` for *any* key: also carry `metaKey`/`ctrlKey`
 * - `blur`/`visibilitychange`: reset when the window loses focus
 */
export function useCmdKey(): boolean {
  const [pressed, setPressed] = useState(false);
  const pressedRef = useRef(false);

  const set = useCallback((v: boolean) => {
    if (pressedRef.current !== v) {
      pressedRef.current = v;
      setPressed(v);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Meta" || e.key === "Control") {
        set(true);
      } else if (!e.metaKey && !e.ctrlKey) {
        // Another key pressed but modifier is gone → OS swallowed keyup
        set(false);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Meta" || e.key === "Control") {
        set(false);
      } else if (!e.metaKey && !e.ctrlKey) {
        set(false);
      }
    };

    // Every mouse event carries metaKey/ctrlKey — correct stale state
    const onMouseEvent = (e: MouseEvent) => {
      if (pressedRef.current && !e.metaKey && !e.ctrlKey) {
        set(false);
      } else if (!pressedRef.current && (e.metaKey || e.ctrlKey)) {
        set(true);
      }
    };

    // Window lost focus → assume modifier released
    const onBlur = () => set(false);
    const onVisibilityChange = () => {
      if (document.hidden) set(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousemove", onMouseEvent);
    window.addEventListener("mousedown", onMouseEvent);
    window.addEventListener("mouseup", onMouseEvent);
    window.addEventListener("click", onMouseEvent);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousemove", onMouseEvent);
      window.removeEventListener("mousedown", onMouseEvent);
      window.removeEventListener("mouseup", onMouseEvent);
      window.removeEventListener("click", onMouseEvent);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [set]);

  return pressed;
}
