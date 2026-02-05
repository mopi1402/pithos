import { useEffect, useRef, useCallback, useState, type RefObject } from "react";

interface StickyHeaderOptions {
  /** Offset from top of viewport (default: 60px for navbar) */
  topOffset?: number;
  /** Ref to the wrapper div that scrolls horizontally */
  wrapperRef: RefObject<HTMLDivElement>;
  /** Whether sections are enabled */
  hasSections?: boolean;
}

/**
 * Hook to make table header sticky while supporting horizontal scroll.
 * Inspired by vh-sticky-table-header but adapted for our use case with sticky columns.
 * 
 * ## Implementation Note: Direct DOM Manipulation
 * 
 * This hook intentionally bypasses React's virtual DOM for performance reasons.
 * The sticky header requires:
 * - Cloning the thead element (cloneNode) to create a fixed duplicate
 * - Real-time style updates on scroll (position, clip-path, scrollLeft)
 * - Synchronizing scroll positions between original table and clone
 * 
 * These operations happen at 60fps during scroll events. Using React state
 * would cause excessive re-renders and janky scrolling. Instead, we:
 * - Use refs to access DOM elements directly
 * - Mutate styles imperatively within requestAnimationFrame
 * - Manage the cloned thead lifecycle outside React's tree
 * 
 * The clone is appended to a React-rendered container (cloneTableRef), so React
 * still controls the container's lifecycle. The clone itself is an "escape hatch"
 * that React doesn't track - we clean it up manually in the useEffect cleanup.
 */
export function useStickyHeader(options: StickyHeaderOptions) {
  const { topOffset = 60, wrapperRef, hasSections = false } = options;
  
  // Store topOffset in ref to avoid recreating callbacks when it changes
  const topOffsetRef = useRef(topOffset);
  topOffsetRef.current = topOffset;
  
  // Use refs for stable access in callbacks + state to trigger useEffect
  const tableRef = useRef<HTMLTableElement | null>(null);
  const cloneTableRef = useRef<HTMLTableElement | null>(null);
  const cloneWrapperRef = useRef<HTMLDivElement | null>(null);
  
  const [tableElement, setTableElement] = useState<HTMLTableElement | null>(null);
  const [cloneTableElement, setCloneTableElement] = useState<HTMLTableElement | null>(null);
  const [cloneWrapperElement, setCloneWrapperElement] = useState<HTMLDivElement | null>(null);
  
  // Callback refs that update both ref and state
  const tableCallbackRef = useCallback((el: HTMLTableElement | null) => {
    tableRef.current = el;
    setTableElement(el);
  }, []);
  
  const cloneTableCallbackRef = useCallback((el: HTMLTableElement | null) => {
    cloneTableRef.current = el;
    setCloneTableElement(el);
  }, []);
  
  const cloneWrapperCallbackRef = useCallback((el: HTMLDivElement | null) => {
    cloneWrapperRef.current = el;
    setCloneWrapperElement(el);
  }, []);
  
  const cloneHeaderRef = useRef<HTMLTableSectionElement | null>(null);
  const cloneSectionRowRef = useRef<HTMLTableRowElement | null>(null);
  const sectionLabelRef = useRef<HTMLDivElement | null>(null);
  const sectionWrapperRef = useRef<HTMLDivElement | null>(null);
  const [sectionWrapperElement, setSectionWrapperElement] = useState<HTMLDivElement | null>(null);
  
  const sectionWrapperCallbackRef = useCallback((el: HTMLDivElement | null) => {
    sectionWrapperRef.current = el;
    setSectionWrapperElement(el);
  }, []);
  
  const frameRequestRef = useRef<number | null>(null);
  const isSyncingRef = useRef(false);

  const getTableBottom = useCallback(() => {
    if (!tableRef.current) return 0;
    const tableRect = tableRef.current.getBoundingClientRect();
    const header = tableRef.current.querySelector("thead");
    const headerHeight = header?.getBoundingClientRect().height || 0;
    
    // Find last row
    const lastRow = tableRef.current.querySelector("tbody > tr:last-child");
    if (lastRow) {
      return lastRow.getBoundingClientRect().y - headerHeight;
    }
    return tableRect.y + tableRect.height - headerHeight;
  }, []);

  const updateShadowScale = useCallback(() => {
    if (!tableRef.current || !cloneWrapperRef.current) return;
    
    const table = tableRef.current;
    const tableContentWidth = table.scrollWidth;
    const clientWidth = table.clientWidth;
    const scrollLeft = table.scrollLeft;
    const shadowWidth = 60;
    
    // Check if table is scrollable at all
    const isScrollable = tableContentWidth > clientWidth;
    if (!isScrollable) {
      cloneWrapperRef.current.style.setProperty("--shadow-scale", "0");
      if (sectionWrapperRef.current) {
        sectionWrapperRef.current.style.setProperty("--shadow-scale", "0");
      }
      return;
    }
    
    const scrollableWidth = tableContentWidth - clientWidth;
    const startFadePosition = scrollableWidth - shadowWidth;
    
    let scale = 1;
    if (scrollLeft >= startFadePosition) {
      const fadeProgress = (scrollLeft - startFadePosition) / shadowWidth;
      scale = Math.max(0, Math.min(1, 1 - fadeProgress));
    }
    
    cloneWrapperRef.current.style.setProperty("--shadow-scale", String(scale));
    // Sync section wrapper shadow scale
    if (sectionWrapperRef.current) {
      sectionWrapperRef.current.style.setProperty("--shadow-scale", String(scale));
    }
  }, []);

  const setHorizontalScrollOnClone = useCallback(() => {
    if (!wrapperRef.current || !cloneWrapperRef.current || !tableRef.current) return;
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    cloneWrapperRef.current.style.width = `${wrapperRect.width}px`;
    cloneWrapperRef.current.style.left = `${wrapperRect.left}px`;
    // Sync horizontal scroll from TABLE (not wrapper, because table scrolls due to global CSS)
    // Use Math.ceil to avoid sub-pixel issues at the end of scroll
    cloneWrapperRef.current.scrollLeft = Math.ceil(tableRef.current.scrollLeft);
    
    // Set CSS variables for fixed shadow positioning
    const header = tableRef.current.querySelector("thead");
    const headerHeight = header?.getBoundingClientRect().height || 0;
    cloneWrapperRef.current.style.setProperty("--clone-top", `${topOffsetRef.current}px`);
    cloneWrapperRef.current.style.setProperty("--clone-right", `${window.innerWidth - wrapperRect.right}px`);
    
    // Clone height is updated by updateHeaderShadowHeight based on section visibility
    // Set initial height here (header only), updateSectionClone will adjust if needed
    cloneWrapperRef.current.style.setProperty("--clone-height", `${headerHeight}px`);
    
    // Sync shadow scale calculation
    updateShadowScale();
    
    // Also update section wrapper if it exists
    if (sectionWrapperRef.current) {
      sectionWrapperRef.current.style.width = `${wrapperRect.width}px`;
      sectionWrapperRef.current.style.left = `${wrapperRect.left}px`;
      sectionWrapperRef.current.scrollLeft = Math.ceil(tableRef.current.scrollLeft);
    }
  }, [updateShadowScale]);

  const createClone = useCallback(() => {
    if (!tableRef.current || !cloneTableRef.current) return null;
    
    const header = tableRef.current.querySelector("thead");
    if (!header) return null;

    const clone = header.cloneNode(true) as HTMLTableSectionElement;
    cloneTableRef.current.appendChild(clone);

    // Use the full scrollable width of the original table + 1px for border
    const tableScrollWidth = tableRef.current.scrollWidth + 1;

    // Copy cell widths in pixels (not percentage) to match sticky column offsets
    Array.from(header.children).forEach((row, rowIndex) => {
      Array.from(row.children).forEach((cell, cellIndex) => {
        const cloneCell = clone.children[rowIndex]?.children[cellIndex] as HTMLTableCellElement;
        if (cloneCell) {
          const cellWidth = cell.getBoundingClientRect().width;
          cloneCell.style.width = `${cellWidth}px`;
        }
      });
    });

    cloneTableRef.current.style.display = "table";
    cloneTableRef.current.style.width = `${tableScrollWidth}px`;
    cloneTableRef.current.style.minWidth = `${tableScrollWidth}px`;

    return clone;
  }, []);

  // Find the current active section row based on scroll position
  const findActiveSectionRow = useCallback((): { active: HTMLTableRowElement | null; next: HTMLTableRowElement | null } => {
    if (!tableRef.current || !hasSections) return { active: null, next: null };
    
    const header = tableRef.current.querySelector("thead");
    const headerHeight = header?.getBoundingClientRect().height || 0;
    const stickyTop = topOffsetRef.current + headerHeight;
    
    // Get all section rows
    const sectionRows = Array.from(tableRef.current.querySelectorAll("tr[class*='sectionRow']")) as HTMLTableRowElement[];
    if (sectionRows.length === 0) return { active: null, next: null };
    
    let activeRow: HTMLTableRowElement | null = null;
    let nextRow: HTMLTableRowElement | null = null;
    
    for (let i = 0; i < sectionRows.length; i++) {
      const row = sectionRows[i];
      const rect = row.getBoundingClientRect();
      // A section is "active" if its top has scrolled past the sticky position
      if (rect.top <= stickyTop) {
        activeRow = row;
        nextRow = sectionRows[i + 1] || null;
      } else {
        break;
      }
    }
    
    return { active: activeRow, next: nextRow };
  }, [hasSections]);

  // Get the bottom position of the last row in the current section
  const getSectionBottom = useCallback((activeRow: HTMLTableRowElement, nextRow: HTMLTableRowElement | null): number => {
    if (!tableRef.current) return Infinity;
    
    if (nextRow) {
      // The section ends where the next section starts
      return nextRow.getBoundingClientRect().top;
    } else {
      // Last section - ends at the last row of the table
      const lastRow = tableRef.current.querySelector("tbody > tr:last-child");
      if (lastRow) {
        const rect = lastRow.getBoundingClientRect();
        return rect.bottom;
      }
      return Infinity;
    }
  }, []);

  // Helper to update header shadow height based on section visibility
  const updateHeaderShadowHeight = useCallback((visibleSectionHeight?: number) => {
    if (!cloneWrapperRef.current || !tableRef.current) return;
    
    const header = tableRef.current.querySelector("thead");
    const headerHeight = header?.getBoundingClientRect().height || 0;
    
    let totalHeight = headerHeight;
    
    // If visibleSectionHeight is provided, use it (for partial visibility during slide)
    if (visibleSectionHeight !== undefined && visibleSectionHeight > 0) {
      totalHeight = headerHeight + visibleSectionHeight;
    } else if (sectionWrapperRef.current && sectionWrapperRef.current.style.display !== "none") {
      const sectionTable = sectionWrapperRef.current.querySelector("table");
      const sectionRow = sectionTable?.querySelector("tr");
      const sectionHeight = sectionRow?.getBoundingClientRect().height || 0;
      totalHeight = headerHeight + sectionHeight;
    }
    cloneWrapperRef.current.style.setProperty("--clone-height", `${totalHeight}px`);
  }, []);

  // Create or update the section row clone
  const updateSectionClone = useCallback(() => {
    if (!sectionWrapperRef.current || !tableRef.current || !hasSections || !wrapperRef.current) return;
    
    const { active: activeRow, next: nextRow } = findActiveSectionRow();
    const header = tableRef.current.querySelector("thead");
    const headerHeight = header?.getBoundingClientRect().height || 0;
    
    // If no active section or header clone isn't visible, hide section clone
    if (!activeRow || !cloneHeaderRef.current) {
      sectionWrapperRef.current.style.display = "none";
      if (sectionLabelRef.current) {
        sectionLabelRef.current.style.display = "none";
      }
      updateHeaderShadowHeight(0);
      return;
    }
    
    // Get the section table and ensure tbody exists
    const sectionTable = sectionWrapperRef.current.querySelector("table");
    if (!sectionTable) return;
    
    let tbody = sectionTable.querySelector("tbody");
    if (!tbody) {
      tbody = document.createElement("tbody");
      sectionTable.appendChild(tbody);
    }
    
    // Create clone row if it doesn't exist
    if (!cloneSectionRowRef.current) {
      const clone = activeRow.cloneNode(true) as HTMLTableRowElement;
      // Keep the text for height calculation but make it invisible
      const cell = clone.querySelector("td");
      if (cell) {
        cell.style.color = "transparent";
      }
      cloneSectionRowRef.current = clone;
      tbody.appendChild(clone);
    }
    
    // Update content if section changed (keep text for height, but invisible)
    const activeCell = activeRow.querySelector("td");
    const cloneCell = cloneSectionRowRef.current.querySelector("td");
    if (activeCell && cloneCell && activeCell.textContent !== cloneCell.textContent) {
      cloneCell.textContent = activeCell.textContent;
    }
    
    // Create fixed label for section name if it doesn't exist
    if (!sectionLabelRef.current) {
      const label = document.createElement("div");
      label.style.cssText = `
        position: fixed;
        font-weight: 700;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 0.5rem 1rem;
        z-index: 200;
        pointer-events: none;
        display: none;
      `;
      document.body.appendChild(label);
      sectionLabelRef.current = label;
    }
    
    // Update label content and color
    if (activeCell && sectionLabelRef.current.textContent !== activeCell.textContent) {
      sectionLabelRef.current.textContent = activeCell.textContent;
    }
    
    // Get computed styles from original section for colors
    const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
    sectionLabelRef.current.style.color = isDarkMode 
      ? "var(--ifm-color-primary-lighter)" 
      : "var(--ifm-color-primary-darkest)";
    
    // Match table width
    const tableScrollWidth = tableRef.current.scrollWidth + 1;
    sectionTable.style.width = `${tableScrollWidth}px`;
    sectionTable.style.minWidth = `${tableScrollWidth}px`;
    
    // Section sticky position is below the header
    const sectionOffset = topOffsetRef.current + headerHeight;
    const sectionRowHeight = activeRow.getBoundingClientRect().height;
    
    // Get section top and bottom positions (like header does with tableTop/tableBottom)
    const sectionTop = activeRow.getBoundingClientRect().top;
    const sectionBottom = getSectionBottom(activeRow, nextRow) - sectionRowHeight;
    
    const diffTop = -sectionTop;
    const diffBottom = -sectionBottom;
    
    // Position the section wrapper
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    sectionWrapperRef.current.style.width = `${wrapperRect.width - 2}px`;
    sectionWrapperRef.current.style.left = `${wrapperRect.left + 1}px`;
    sectionWrapperRef.current.scrollLeft = Math.ceil(tableRef.current.scrollLeft);
    
    // Position the fixed label
    sectionLabelRef.current.style.left = `${wrapperRect.left + 1}px`;
    
    if (diffTop <= -sectionOffset) {
      // Section row is visible in normal position - hide clone but keep label if section is partially under header
      sectionWrapperRef.current.style.display = "none";
      
      // Check if the original section is still partially hidden under the header clone
      const sectionRect = activeRow.getBoundingClientRect();
      const headerBottom = topOffsetRef.current + headerHeight;
      
      if (sectionRect.top < headerBottom && sectionRect.bottom > headerBottom) {
        // Section is partially visible - keep label visible at the section's position
        sectionLabelRef.current.style.display = "block";
        sectionLabelRef.current.style.top = `${Math.max(sectionRect.top, topOffsetRef.current + headerHeight)}px`;
      } else {
        sectionLabelRef.current.style.display = "none";
      }
      updateHeaderShadowHeight(0);
    } else if (diffBottom < -sectionOffset) {
      // Section should be fixed at top (normal sticky behavior)
      sectionWrapperRef.current.style.display = "block";
      sectionWrapperRef.current.style.position = "fixed";
      sectionWrapperRef.current.style.top = `${sectionOffset}px`;
      sectionWrapperRef.current.style.clipPath = "";
      sectionLabelRef.current.style.display = "block";
      sectionLabelRef.current.style.top = `${sectionOffset}px`;
      sectionLabelRef.current.style.clipPath = "";
      updateHeaderShadowHeight(sectionRowHeight);
    } else {
      // Section should slide up with the section bottom
      const pushUp = sectionOffset + diffBottom;
      if (pushUp >= sectionRowHeight) {
        sectionWrapperRef.current.style.display = "none";
        sectionLabelRef.current.style.display = "none";
        updateHeaderShadowHeight(0);
      } else {
        sectionWrapperRef.current.style.display = "block";
        sectionWrapperRef.current.style.position = "fixed";
        sectionWrapperRef.current.style.top = `${sectionOffset - pushUp}px`;
        sectionWrapperRef.current.style.clipPath = `inset(${pushUp}px 0 0 0)`;
        // Keep label visible and slide it with the section clone (same top position)
        sectionLabelRef.current.style.display = "block";
        sectionLabelRef.current.style.top = `${sectionOffset - pushUp}px`;
        sectionLabelRef.current.style.clipPath = `inset(${pushUp}px 0 0 0)`;
        // Visible section height = total height - clipped portion
        const visibleHeight = sectionRowHeight - pushUp;
        updateHeaderShadowHeight(visibleHeight);
      }
    }
  }, [hasSections, findActiveSectionRow, getSectionBottom, updateHeaderShadowHeight]);

  const updateSticky = useCallback(() => {
    frameRequestRef.current = requestAnimationFrame(() => {
      if (!tableRef.current || !cloneWrapperRef.current || !cloneTableRef.current || !wrapperRef.current) return;

      const tableRect = tableRef.current.getBoundingClientRect();
      const tableTop = tableRect.y;
      const tableBottom = getTableBottom();
      const header = tableRef.current.querySelector("thead");
      const headerHeight = header?.getBoundingClientRect().height || 0;
      const offset = topOffsetRef.current;

      const diffTop = -tableTop;
      const diffBottom = -tableBottom;

      // Should we show the sticky header?
      if (diffTop > -offset && !cloneHeaderRef.current) {
        // Create clone when header would go off screen
        cloneWrapperRef.current.style.display = "none";
        cloneHeaderRef.current = createClone();
      }

      if (cloneHeaderRef.current) {
        if (diffTop <= -offset) {
          // Header is visible in normal position - hide clone and remove clip
          cloneWrapperRef.current.style.display = "none";
          wrapperRef.current.style.clipPath = "";
          cloneTableRef.current.removeChild(cloneHeaderRef.current);
          cloneHeaderRef.current = null;
          // Also hide section clone and label
          if (sectionWrapperRef.current) {
            sectionWrapperRef.current.style.display = "none";
          }
          if (sectionLabelRef.current) {
            sectionLabelRef.current.style.display = "none";
          }
        } else if (diffBottom < -offset) {
          // Header should be fixed at top
          cloneWrapperRef.current.style.display = "block";
          cloneWrapperRef.current.style.position = "fixed";
          cloneWrapperRef.current.style.top = `${offset}px`;
          cloneWrapperRef.current.style.clipPath = "";
          cloneTableRef.current.style.clipPath = "";
          // Clip the original table to hide the header area
          const clipTop = offset - tableTop + headerHeight;
          wrapperRef.current.style.clipPath = `inset(${clipTop}px 0 0 0)`;
          setHorizontalScrollOnClone();
          // Update section clone
          updateSectionClone();
        } else {
          // Header should slide up with the table bottom
          // Calculate how much the header should be pushed up
          const pushUp = offset + diffBottom; // diffBottom is negative, so this reduces the top
          
          // If the last row of the table has scrolled above the sticky area, remove clone entirely
          const lastRow = tableRef.current.querySelector("tbody > tr:last-child");
          const lastRowBottom = lastRow ? lastRow.getBoundingClientRect().bottom : 0;
          if (lastRowBottom < offset) {
            cloneWrapperRef.current.style.display = "none";
            wrapperRef.current.style.clipPath = "";
            cloneTableRef.current.style.clipPath = "";
            cloneTableRef.current.removeChild(cloneHeaderRef.current);
            cloneHeaderRef.current = null;
            // Hide section and label
            if (sectionWrapperRef.current) {
              sectionWrapperRef.current.style.display = "none";
            }
            if (sectionLabelRef.current) {
              sectionLabelRef.current.style.display = "none";
            }
          } else {
          cloneWrapperRef.current.style.display = "block";
          cloneWrapperRef.current.style.position = "fixed";
          cloneWrapperRef.current.style.top = `${offset - pushUp}px`;
          cloneWrapperRef.current.style.clipPath = "";
          cloneTableRef.current.style.clipPath = `inset(${pushUp}px 0 0 0)`;
          wrapperRef.current.style.clipPath = "";
          setHorizontalScrollOnClone();
          // Section clone should also slide in/out with the header
          // Section is BELOW header, so it slides in BEFORE header becomes visible
          if (sectionWrapperRef.current) {
            const { active: activeRow } = findActiveSectionRow();
            if (activeRow) {
              // Ensure clone exists
              if (!cloneSectionRowRef.current) {
                updateSectionClone();
              }
              
              if (cloneSectionRowRef.current) {
                const sectionRowHeight = cloneSectionRowRef.current.getBoundingClientRect().height || activeRow.getBoundingClientRect().height;
                const sectionOffset = offset + headerHeight;
                
                // Section clip: when pushUp = headerHeight + sectionRowHeight, section is fully hidden
                // when pushUp = headerHeight, section is fully visible
                // when pushUp < headerHeight, section stays fully visible (header is clipping)
                const sectionClip = Math.max(0, pushUp - headerHeight);
                
                if (sectionClip >= sectionRowHeight) {
                  // Section is fully hidden
                  sectionWrapperRef.current.style.display = "none";
                  if (sectionLabelRef.current) {
                    sectionLabelRef.current.style.display = "none";
                  }
                  updateHeaderShadowHeight(0);
                } else {
                  sectionWrapperRef.current.style.display = "block";
                  sectionWrapperRef.current.style.position = "fixed";
                  sectionWrapperRef.current.style.top = `${sectionOffset - pushUp}px`;
                  sectionWrapperRef.current.style.clipPath = sectionClip > 0 ? `inset(${sectionClip}px 0 0 0)` : "";
                  // Update horizontal position
                  const wrapperRect = wrapperRef.current.getBoundingClientRect();
                  sectionWrapperRef.current.style.width = `${wrapperRect.width - 2}px`;
                  sectionWrapperRef.current.style.left = `${wrapperRect.left + 1}px`;
                  sectionWrapperRef.current.scrollLeft = Math.ceil(tableRef.current.scrollLeft);
                  // Keep label visible and slide it with the section
                  if (sectionLabelRef.current) {
                    sectionLabelRef.current.style.display = "block";
                    sectionLabelRef.current.style.top = `${sectionOffset - pushUp}px`;
                    sectionLabelRef.current.style.left = `${wrapperRect.left + 1}px`;
                    sectionLabelRef.current.style.clipPath = sectionClip > 0 ? `inset(${sectionClip}px 0 0 0)` : "";
                  }
                  // Update shadow height to cover visible section
                  const visibleSectionHeight = sectionRowHeight - sectionClip;
                  updateHeaderShadowHeight(visibleSectionHeight + 15);
                }
              }
            } else {
              // No active section during slide-out, hide label
              if (sectionLabelRef.current) {
                sectionLabelRef.current.style.display = "none";
              }
            }
          }
          }
        }
      }
    });
  }, [getTableBottom, createClone, setHorizontalScrollOnClone, updateSectionClone]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const table = tableElement;
    const cloneWrapper = cloneWrapperElement;
    const sectionWrapper = sectionWrapperElement;
    
    if (!wrapper || !table || !cloneWrapper || !cloneTableElement) {
      return;
    }
    
    // Initial update
    updateSticky();

    // Scroll listener (vertical page scroll)
    const handleScroll = () => updateSticky();
    window.addEventListener("scroll", handleScroll);

    // Horizontal scroll sync: table -> clone wrapper (and section wrapper)
    const handleTableScroll = () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      cloneWrapper.scrollLeft = table.scrollLeft;
      if (sectionWrapper) {
        sectionWrapper.scrollLeft = table.scrollLeft;
      }
      updateShadowScale();
      isSyncingRef.current = false;
    };
    table.addEventListener("scroll", handleTableScroll, { passive: true });

    // Horizontal scroll sync: clone wrapper -> table
    const handleCloneScroll = () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      table.scrollLeft = cloneWrapper.scrollLeft;
      if (sectionWrapper) {
        sectionWrapper.scrollLeft = cloneWrapper.scrollLeft;
      }
      updateShadowScale();
      isSyncingRef.current = false;
    };
    cloneWrapper.addEventListener("scroll", handleCloneScroll, { passive: true });

    // Horizontal scroll sync: section wrapper -> table
    const handleSectionScroll = () => {
      if (isSyncingRef.current || !sectionWrapper) return;
      isSyncingRef.current = true;
      table.scrollLeft = sectionWrapper.scrollLeft;
      cloneWrapper.scrollLeft = sectionWrapper.scrollLeft;
      updateShadowScale();
      isSyncingRef.current = false;
    };
    if (sectionWrapper) {
      sectionWrapper.addEventListener("scroll", handleSectionScroll, { passive: true });
    }

    // Resize listener (window)
    const handleResize = () => {
      requestAnimationFrame(() => {
        if (!tableRef.current || !cloneTableRef.current || !cloneWrapperRef.current || !wrapperRef.current) return;
        
        // Destroy existing clone and recreate it with new dimensions
        if (cloneHeaderRef.current) {
          cloneTableRef.current.removeChild(cloneHeaderRef.current);
          cloneHeaderRef.current = null;
          cloneHeaderRef.current = createClone();
        }
        
        // Update wrapper dimensions
        setHorizontalScrollOnClone();
        updateSticky();
      });
    };
    window.addEventListener("resize", handleResize);

    // ResizeObserver on table to detect content changes (e.g., filtering)
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(table);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      table.removeEventListener("scroll", handleTableScroll);
      cloneWrapper.removeEventListener("scroll", handleCloneScroll);
      if (sectionWrapper) {
        sectionWrapper.removeEventListener("scroll", handleSectionScroll);
      }
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      if (frameRequestRef.current) {
        cancelAnimationFrame(frameRequestRef.current);
      }
      // Cleanup clone
      if (cloneHeaderRef.current && cloneTableRef.current) {
        cloneTableRef.current.removeChild(cloneHeaderRef.current);
        cloneHeaderRef.current = null;
      }
      // Cleanup section clone
      if (cloneSectionRowRef.current) {
        cloneSectionRowRef.current.remove();
        cloneSectionRowRef.current = null;
      }
      // Cleanup section label
      if (sectionLabelRef.current) {
        sectionLabelRef.current.remove();
        sectionLabelRef.current = null;
      }
    };
  }, [tableElement, cloneTableElement, cloneWrapperElement, sectionWrapperElement, updateSticky, setHorizontalScrollOnClone, updateShadowScale, createClone]);

  return {
    tableRef: tableCallbackRef,
    cloneTableRef: cloneTableCallbackRef,
    cloneWrapperRef: cloneWrapperCallbackRef,
    sectionWrapperRef: sectionWrapperCallbackRef,
  };
}
