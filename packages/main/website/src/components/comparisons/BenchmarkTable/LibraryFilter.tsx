import React, { createContext, useContext, useState, useMemo } from "react";
import { translate } from "@docusaurus/Translate";
import { StickyBar } from "@site/src/components/shared/StickyBar/StickyBar";
import { LibraryFilterGroup } from "./types";
import styles from "./LibraryFilter.module.css";

// ============================================
// Filter Context
// ============================================

export interface LibraryFilterContextValue {
  selectedGroups: Set<string>;
  toggleGroup: (group: string) => void;
  selectedLibraries: Set<string>;
  toggleLibrary: (lib: string) => void;
  visibleLibraries: string[];
}

const LibraryFilterContext = createContext<LibraryFilterContextValue | null>(null);

export function useLibraryFilter(): LibraryFilterContextValue | null {
  return useContext(LibraryFilterContext);
}

// ============================================
// Filter Provider
// ============================================

interface LibraryFilterProviderProps {
  groups: Record<string, LibraryFilterGroup>;
  allLibraries: string[];
  children: React.ReactNode;
}

export function LibraryFilterProvider({ groups, allLibraries, children }: LibraryFilterProviderProps): React.ReactElement {
  const groupKeys = useMemo(() => Object.keys(groups), [groups]);

  const allGroupLibraries = useMemo(() => {
    const libs = new Set<string>();
    for (const group of Object.values(groups)) {
      for (const lib of group.libraries) {
        libs.add(lib);
      }
    }
    return Array.from(libs);
  }, [groups]);

  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set(groupKeys));
  const [selectedLibraries, setSelectedLibraries] = useState<Set<string>>(new Set(allGroupLibraries));

  const toggleGroup = (group: string) => {
    const groupLibs = groups[group]?.libraries ?? [];

    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
        setSelectedLibraries((prevLibs) => {
          const nextLibs = new Set(prevLibs);
          for (const lib of groupLibs) {
            nextLibs.delete(lib);
          }
          return nextLibs;
        });
      } else {
        next.add(group);
        setSelectedLibraries((prevLibs) => {
          const nextLibs = new Set(prevLibs);
          for (const lib of groupLibs) {
            nextLibs.add(lib);
          }
          return nextLibs;
        });
      }
      return next;
    });
  };

  const toggleLibrary = (lib: string) => {
    setSelectedLibraries((prev) => {
      const next = new Set(prev);
      if (next.has(lib)) {
        next.delete(lib);
      } else {
        next.add(lib);
      }
      return next;
    });
  };

  const visibleLibraries = useMemo(() => {
    if (selectedLibraries.size === 0) {
      return allLibraries;
    }
    return Array.from(selectedLibraries);
  }, [selectedLibraries, allLibraries]);

  return (
    <LibraryFilterContext.Provider value={{ selectedGroups, toggleGroup, selectedLibraries, toggleLibrary, visibleLibraries }}>
      {children}
    </LibraryFilterContext.Provider>
  );
}

// ============================================
// Filter Toggle Component
// ============================================

interface LibraryFilterToggleProps {
  groups: Record<string, LibraryFilterGroup>;
}

export function LibraryFilterToggle({ groups }: LibraryFilterToggleProps): React.ReactElement | null {
  const context = useLibraryFilter();
  if (!context) return null;

  const { selectedGroups, toggleGroup, selectedLibraries, toggleLibrary } = context;

  const availableLibraries = useMemo(() => {
    const libs: { lib: string; group: string }[] = [];
    const groupsToShow = selectedGroups.size > 0
      ? selectedGroups
      : new Set(Object.keys(groups));

    for (const group of groupsToShow) {
      for (const lib of groups[group]?.libraries ?? []) {
        libs.push({ lib, group });
      }
    }
    return libs;
  }, [selectedGroups, groups]);

  return (
    <StickyBar>
      <div className={styles.filterContainer}>
        <div className={styles.filterToggleGroup}>
          <span className={styles.filterLabel}>{translate({ id: 'comparison.filter.groups', message: 'Groups:' })}</span>
          <div className={styles.filterToggleList}>
            {Object.entries(groups).map(([group, config]) => (
              <label key={group} className={styles.filterToggle} title={config.description}>
                <input
                  type="checkbox"
                  checked={selectedGroups.has(group)}
                  onChange={() => toggleGroup(group)}
                />
                <span>{config.label}</span>
              </label>
            ))}
          </div>
        </div>
        {availableLibraries.length > 0 && (
          <>
            <div className={styles.filterDivider} />
            <div className={styles.filterLibrariesGroup}>
              <span className={styles.filterLabel}>{translate({ id: 'comparison.filter.libraries', message: 'Libraries:' })}</span>
              <div className={styles.filterLibrariesList}>
                {availableLibraries.map(({ lib }) => (
                  <label
                    key={lib}
                    className={`${styles.filterLibrary} ${selectedLibraries.has(lib) ? styles.filterLibraryActive : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedLibraries.has(lib)}
                      onChange={() => toggleLibrary(lib)}
                    />
                    <span>{lib}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </StickyBar>
  );
}
