import React, { useRef, useEffect, useState } from "react";
import styles from "./StickyBar.module.css";

interface StickyBarProps {
  children: React.ReactNode;
  /** Additional class name */
  className?: string;
  /** Offset from top (default: navbar height) */
  topOffset?: string;
}

/**
 * A container that becomes sticky when it reaches the top of the viewport.
 * Shows a subtle shadow when in sticky mode.
 */
export function StickyBar({ 
  children, 
  className,
  topOffset = "var(--ifm-navbar-height)"
}: StickyBarProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel is not visible, the bar is stuck
        setIsStuck(!entry.isIntersecting);
      },
      { 
        threshold: 0,
        rootMargin: `-60px 0px 0px 0px`
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={sentinelRef} style={{ height: "1px", marginBottom: "-1px" }} />
      <div
        ref={ref}
        className={`${styles.stickyBar} ${isStuck ? styles.stuck : ""} ${className || ""}`}
        style={{ "--sticky-top-offset": topOffset } as React.CSSProperties}
      >
        {children}
      </div>
    </>
  );
}
