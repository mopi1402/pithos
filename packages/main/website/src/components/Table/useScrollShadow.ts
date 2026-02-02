import React from "react";

interface UseScrollShadowOptions {
  shadowWidth?: number;
}

interface UseScrollShadowReturn {
  isScrolledToEnd: boolean;
  shadowScale: number;
}

/**
 * Hook to manage scroll shadow visibility and scale based on scroll position.
 * The shadow stays fully visible until within shadowWidth pixels of the end,
 * then scales from 1 to 0 over those last pixels (1:1 ratio).
 *
 * @param wrapperRef - Ref to the scrollable wrapper element
 * @param options - Configuration options
 * @param options.shadowWidth - Width of the shadow in pixels (default: 60)
 * @returns Object with isScrolledToEnd and shadowScale values
 */
export function useScrollShadow(
  wrapperRef: React.RefObject<HTMLDivElement | null>,
  options: UseScrollShadowOptions = {}
): UseScrollShadowReturn {
  const { shadowWidth = 60 } = options;
  const [isScrolledToEnd, setIsScrolledToEnd] = React.useState(true);
  const [shadowScale, setShadowScale] = React.useState(1);

  const setupScrollDetection = React.useCallback(
    (wrapper: HTMLDivElement) => {
      const checkScroll = (scrollTarget?: HTMLElement) => {
        const table = wrapper.querySelector("table");
        // Use scrollWidth to get the actual content width, not the rendered width
        const tableContentWidth = table?.scrollWidth || 0;

        // Find which element actually scrolls (wrapper or table)
        const actualScrollElement =
          scrollTarget ||
          (wrapper.scrollWidth > wrapper.clientWidth ? wrapper : table) ||
          wrapper;

        const scrollLeft = actualScrollElement?.scrollLeft || 0;
        const clientWidth = wrapper.clientWidth;

        // Compare table content width with wrapper width to detect if scrollable
        const isScrollable = tableContentWidth > clientWidth;
        // Use tableContentWidth instead of wrapper.scrollWidth to detect end
        // Use >= instead of exact match to handle rounding errors
        // Add small tolerance (2px) to prevent flickering
        const scrollRight = scrollLeft + clientWidth;
        const isAtEnd = scrollRight >= tableContentWidth - 2; // Within 2px tolerance
        const shouldShowShadow = isScrollable && !isAtEnd;
        setIsScrolledToEnd(!shouldShowShadow);

        // Calculate shadow scale based on scroll position
        // Shadow stays at scale = 1 until we're within shadowWidth pixels of the end
        // Then it scales from 1 to 0 over those last shadowWidth pixels (1:1 ratio)
        if (isScrollable) {
          const scrollableWidth = tableContentWidth - clientWidth;
          const startFadePosition = scrollableWidth - shadowWidth;

          if (scrollLeft < startFadePosition) {
            // Before fade zone: shadow fully visible
            setShadowScale(1);
          } else {
            // In fade zone: scale from 1 to 0 over shadowWidth pixels
            const fadeProgress = (scrollLeft - startFadePosition) / shadowWidth;
            const scale = Math.max(0, Math.min(1, 1 - fadeProgress));
            setShadowScale(scale);
          }
        } else {
          setShadowScale(0);
        }
      };

      // Check immediately and after delays to account for layout
      checkScroll();
      const timeoutId1 = setTimeout(() => checkScroll(), 100);
      const timeoutId2 = setTimeout(() => checkScroll(), 500);

      const handleScroll = (event: Event) => {
        const target = event.target as HTMLElement;
        // Pass the actual scrolling element
        checkScroll(target);
      };

      // Listen to scroll on wrapper (the element with overflow-x: auto)
      wrapper.addEventListener("scroll", handleScroll, { passive: true });
      // Also listen on table in case it scrolls directly
      const tableElement = wrapper.querySelector("table");
      if (tableElement) {
        tableElement.addEventListener("scroll", handleScroll, {
          passive: true,
        });
      }
      const handleResize = () => checkScroll();
      window.addEventListener("resize", handleResize);

      // Also check when table is fully rendered
      const observer = new ResizeObserver(() => checkScroll());
      observer.observe(wrapper);

      return () => {
        clearTimeout(timeoutId1);
        clearTimeout(timeoutId2);
        wrapper.removeEventListener("scroll", handleScroll);
        if (tableElement) {
          tableElement.removeEventListener("scroll", handleScroll);
        }
        window.removeEventListener("resize", handleResize);
        observer.disconnect();
      };
    },
    [shadowWidth]
  );

  React.useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      // Retry after a short delay
      const timeout = setTimeout(() => {
        const retryWrapper = wrapperRef.current;
        if (retryWrapper) {
          setupScrollDetection(retryWrapper);
        }
      }, 100);
      return () => clearTimeout(timeout);
    }

    return setupScrollDetection(wrapper);
  }, [setupScrollDetection]);

  return { isScrolledToEnd, shadowScale };
}
