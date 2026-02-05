import type { ReactNode } from "react";
import styles from "./styles.module.css";

const TOTAL_STEPS = 3; // clicks 3, 4, 5 → countdown 2, 1, 0

interface DevModeToastProps {
  countdown: number | null;
  unlocked: boolean;
}

export default function DevModeToast({ countdown, unlocked }: DevModeToastProps): ReactNode {
  if (!unlocked && countdown === null) return null;

  const progress = unlocked ? 1 : 1 - (countdown ?? 0) / TOTAL_STEPS;

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <div className={styles.bar}>
        <div
          className={`${styles.fill} ${unlocked ? styles.fillDone : ""}`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span className={styles.label}>
        {unlocked
          ? "Vous êtes en mode développeur !"
          : `Encore ${countdown} clic${countdown! > 1 ? "s" : ""}\u2026`}
      </span>
    </div>
  );
}
