import React, { useState, useEffect, useRef, type ReactNode } from "react";
import { translate } from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const STORAGE_KEY = "pithos-cmd-click-hint-dismissed";

/** Ensures only one hint instance is shown across all code blocks */
let globalShown = false;

export default function CmdClickHint(): ReactNode {
  const [visible, setVisible] = useState(false);
  const ownedRef = useRef(false);
  const sparklesUrl = useBaseUrl("/img/emoji/sparkles.webp");

  useEffect(() => {
    if (globalShown) return;
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "true") {
        globalShown = true;
        ownedRef.current = true;
        setVisible(true);
      }
    } catch {
      // SSR or localStorage unavailable
    }
    return () => {
      if (ownedRef.current) globalShown = false;
    };
  }, []);

  if (!visible) return null;

  const dismiss = (forever: boolean) => {
    if (forever) {
      try {
        localStorage.setItem(STORAGE_KEY, "true");
      } catch {
        // ignore
      }
    }
    setVisible(false);
  };

  const title = translate({
    id: "codeLinks.hint.title",
    message: "Did you know?",
  });

  const message = translate({
    id: "codeLinks.hint.message",
    message: "You can Cmd + Click (or Ctrl + Click) on highlighted symbols in code blocks to jump to their API reference.",
  });

  const gotIt = translate({
    id: "codeLinks.hint.gotIt",
    message: "Got it",
  });

  const dontShowAgain = translate({
    id: "codeLinks.hint.dontShowAgain",
    message: "Don't show again",
  });

  return (
    <div className={styles.hint} role="status">
      <div className={styles.header}>
        <img
          src={sparklesUrl}
          alt=""
          width="20"
          height="20"
          className={styles.icon}
        />
        <span className={styles.title}>{title}</span>
      </div>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={() => dismiss(false)}
        >
          {gotIt}
        </button>
        <button
          type="button"
          className={styles.btnSecondary}
          onClick={() => dismiss(true)}
        >
          {dontShowAgain}
        </button>
      </div>
    </div>
  );
}
