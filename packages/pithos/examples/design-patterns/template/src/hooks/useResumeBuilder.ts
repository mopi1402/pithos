import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { generateResume } from "@/lib/template";
import { PROFILES, STEP_ORDER } from "@/data/profiles";
import type { ProfileKey } from "@/lib/types";

export function useResumeBuilder() {
  const [profile, setProfile] = useState<ProfileKey>("developer");
  const [executingStep, setExecutingStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [animating, setAnimating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const resume = useMemo(() => generateResume(profile), [profile]);
  const profileMeta = PROFILES.find((p) => p.key === profile);

  const runAnimation = useCallback((key: ProfileKey) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setProfile(key);
    setAnimating(true);
    setCompletedSteps(new Set());
    setExecutingStep(null);

    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    (async () => {
      await wait(500);
      if (ctrl.signal.aborted) return;
      setExecutingStep(0);

      for (let i = 0; i < STEP_ORDER.length; i++) {
        await wait(400);
        if (ctrl.signal.aborted) return;
        setCompletedSteps((prev) => new Set([...prev, i]));
        if (i < STEP_ORDER.length - 1) {
          setExecutingStep(i + 1);
        } else {
          setExecutingStep(null);
          setAnimating(false);
        }
      }
    })();
  }, []);

  useEffect(() => {
    runAnimation("developer");
    return () => abortRef.current?.abort();
  }, [runAnimation]);

  return {
    profile,
    resume,
    profileMeta,
    executingStep,
    completedSteps,
    animating,
    runAnimation,
  };
}
