import type { ReactNode } from "react";
import { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

const TOTAL_STEPS = 4; // clicks 3–6 → countdown 4, 3, 2, 1

interface DevModeToastProps {
  countdown: number | null;
  unlocked: boolean;
}

export default function DevModeToast({ countdown, unlocked }: DevModeToastProps): ReactNode {
  if (!unlocked && countdown === null) return null;

  const progress = unlocked ? 1 : 1 - (countdown ?? 0) / TOTAL_STEPS;

  const tapSingular = translate({ id: "easterEgg.tap", message: "tap" });
  const tapPlural = translate({ id: "easterEgg.taps", message: "taps" });
  const countdownMessage = translate(
    { id: "easterEgg.countdown", message: "You're {count} {taps} away from being a developer." },
    { count: String(countdown), taps: countdown === 1 ? tapSingular : tapPlural },
  );

  const unlockedMessage = translate({
    id: "easterEgg.unlocked",
    message: "Developer mode has been enabled.",
  });

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <div className={styles.bar}>
        <div
          className={`${styles.fill} ${unlocked ? styles.fillDone : ""}`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span className={styles.label}>
        {unlocked ? unlockedMessage : countdownMessage}
      </span>
    </div>
  );
}
