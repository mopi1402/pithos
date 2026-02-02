import { useEffect, useRef, useCallback, useState, type RefObject } from "react";

interface StickyHeaderOptions {
  /** Offset from top of viewport (default: 60px for navbar) */
  topOffset?: number;
  /** Ref to the wrapper div that scrolls horizontally */
  wrapperRef: RefObject<HTMLDivElement>;
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
  const { topOffset = 60, wrapperRef } = options;
  
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
    cloneWrapperRef.current.style.setProperty("--clone-height", `${headerHeight + 2}px`);
    
    // Sync shadow scale calculation
    updateShadowScale();
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
        } else if (diffBottom < -offset) {
          // Header should be fixed at top
          cloneWrapperRef.current.style.display = "block";
          cloneWrapperRef.current.style.position = "fixed";
          cloneWrapperRef.current.style.top = `${offset}px`;
          cloneWrapperRef.current.style.clipPath = "";
          // Clip the original table to hide the header area
          const clipTop = offset - tableTop + headerHeight;
          wrapperRef.current.style.clipPath = `inset(${clipTop}px 0 0 0)`;
          setHorizontalScrollOnClone();
        } else {
          // Header should slide up with the table bottom
          // Calculate how much the header should be pushed up
          const pushUp = offset + diffBottom; // diffBottom is negative, so this reduces the top
          cloneWrapperRef.current.style.display = "block";
          cloneWrapperRef.current.style.position = "fixed";
          cloneWrapperRef.current.style.top = `${offset - pushUp}px`;
          // Clip the header from the top as it slides up
          cloneWrapperRef.current.style.clipPath = `inset(${pushUp}px 0 0 0)`;
          wrapperRef.current.style.clipPath = "";
          setHorizontalScrollOnClone();
        }
      }
    });
  }, [getTableBottom, createClone, setHorizontalScrollOnClone]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const table = tableElement;
    const cloneWrapper = cloneWrapperElement;
    
    if (!wrapper || !table || !cloneWrapper || !cloneTableElement) {
      return;
    }
    
    // Initial update
    updateSticky();

    // Scroll listener (vertical page scroll)
    const handleScroll = () => updateSticky();
    window.addEventListener("scroll", handleScroll);

    // Horizontal scroll sync: table -> clone wrapper
    const handleTableScroll = () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      cloneWrapper.scrollLeft = table.scrollLeft;
      updateShadowScale();
      isSyncingRef.current = false;
    };
    table.addEventListener("scroll", handleTableScroll, { passive: true });

    // Horizontal scroll sync: clone wrapper -> table
    const handleCloneScroll = () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      table.scrollLeft = cloneWrapper.scrollLeft;
      updateShadowScale();
      isSyncingRef.current = false;
    };
    cloneWrapper.addEventListener("scroll", handleCloneScroll, { passive: true });

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
    };
  }, [tableElement, cloneTableElement, cloneWrapperElement, updateSticky, setHorizontalScrollOnClone, updateShadowScale, createClone]);

  return {
    tableRef: tableCallbackRef,
    cloneTableRef: cloneTableCallbackRef,
    cloneWrapperRef: cloneWrapperCallbackRef,
  };
}
