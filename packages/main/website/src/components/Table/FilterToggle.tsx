import React from "react";
import { useFilterableTable, type FilterTag } from "./FilterableTableContext";
import { StickyBar } from "../StickyBar";
import styles from "./styles.module.css";

const FILTER_OPTIONS: { tag: FilterTag; label: string; description: string }[] = [
  { tag: "native", label: "Native / One-liners", description: "Functions with native JS equivalents" },
  { tag: "niche", label: "Niche / Rare", description: "Rarely used or very specific functions" },
  { tag: "mutable", label: "Mutable", description: "Functions that encourage mutation" },
];

/**
 * Toggle component to show/hide filtered function categories.
 */
export function FilterToggle(): React.ReactElement | null {
  const context = useFilterableTable();
  
  if (!context) {
    return null;
  }

  const { visibleTags, toggleTag } = context;

  return (
    <StickyBar>
      <div className={styles.filterToggleGroup}>
        <span className={styles.filterLabel}>Show:</span>
        <div className={styles.filterToggleList}>
          {FILTER_OPTIONS.map(({ tag, label, description }) => (
            <label key={tag} className={styles.filterToggle} title={description}>
              <input
                type="checkbox"
                checked={visibleTags.has(tag)}
                onChange={() => toggleTag(tag)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </StickyBar>
  );
}
