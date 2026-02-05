import React from "react";
import styles from "./styles.module.css";

/**
 * Represents a single item in a legend.
 * @property colorClass - CSS class name applied to the color swatch
 * @property label - Display text for the legend item
 */
export interface LegendItem {
  colorClass: string;
  label: string;
}

interface LegendProps {
  items: LegendItem[];
}

/**
 * Legend component that displays a list of color-coded legend items.
 * Renders as a sticky bar that hides when the associated table scrolls out of view.
 *
 * The Legend automatically tracks the visibility of the next sibling table container
 * and hides itself when the table is no longer visible.
 */
export function Legend({ items }: LegendProps): React.ReactElement {
  const legendRef = React.useRef<HTMLDivElement>(null);
  const [isTableVisible, setIsTableVisible] = React.useState(true);

  React.useEffect(() => {
    const legend = legendRef.current;
    if (!legend) return;

    // Find the table container (next sibling's table wrapper)
    const findTableContainer = (): HTMLElement | null => {
      let sibling = legend.nextElementSibling;
      while (sibling) {
        const table = sibling.querySelector(".tableContainer, table");
        if (table) return sibling as HTMLElement;
        sibling = sibling.nextElementSibling;
      }
      return null;
    };

    const tableContainer = findTableContainer();
    if (!tableContainer) return;

    const checkVisibility = () => {
      const rect = tableContainer.getBoundingClientRect();
      // Hide legend when table bottom is above the navbar (60px)
      setIsTableVisible(rect.bottom > 60);
    };

    checkVisibility();
    window.addEventListener("scroll", checkVisibility, { passive: true });
    return () => window.removeEventListener("scroll", checkVisibility);
  }, []);

  return (
    <div
      ref={legendRef}
      className={`${styles.legend} ${!isTableVisible ? styles.legendHidden : ""}`}
    >
      {items.map((item) => (
        <span key={item.label} className={styles.legendItem}>
          <span className={`${styles.legendColor} ${item.colorClass}`}></span>
          {item.label}
        </span>
      ))}
    </div>
  );
}

interface StickyLegendProps {
  items: LegendItem[];
  children: React.ReactNode;
}

/**
 * StickyLegend wraps children with a sticky legend header.
 * The legend hides when the content scrolls past the viewport.
 * A sentinel element at the bottom of the children tracks scroll position.
 */
export function StickyLegend({
  items,
  children,
}: StickyLegendProps): React.ReactElement {
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const checkVisibility = () => {
      const sentinel = sentinelRef.current;
      if (!sentinel) return;

      const rect = sentinel.getBoundingClientRect();
      // Hide when sentinel is above the navbar (60px)
      setIsVisible(rect.bottom > 60);
    };

    checkVisibility();
    window.addEventListener("scroll", checkVisibility, { passive: true });
    return () => window.removeEventListener("scroll", checkVisibility);
  }, []);

  return (
    <div>
      <div
        className={`${styles.legend} ${isVisible ? "" : styles.legendHidden}`}
      >
        {items.map((item) => (
          <span key={item.label} className={styles.legendItem}>
            <span className={`${styles.legendColor} ${item.colorClass}`}></span>
            {item.label}
          </span>
        ))}
      </div>
      {children}
      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  );
}
