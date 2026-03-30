import { useState, useEffect, type RefObject } from "react";

/**
 * Returns `true` once the observed element enters the viewport.
 * Once visible, stays `true` forever (no re-hiding).
 *
 * @param ref - React ref attached to the element to observe
 * @param rootMargin - IntersectionObserver rootMargin (default: "200px", triggers slightly before visible)
 */
export function useVisibleOnce(
  ref: RefObject<HTMLElement | null>,
  rootMargin = "200px",
): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return visible;
}
