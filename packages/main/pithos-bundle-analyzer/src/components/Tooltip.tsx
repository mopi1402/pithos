import { useRef, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";

export function Tooltip({
  text,
  children,
}: {
  text: string;
  children: ComponentChildren;
}) {
  const [show, setShow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (containerRef.current) {
      const child = containerRef.current.firstElementChild as HTMLElement;
      if (child && child.scrollWidth > child.clientWidth) {
        setShow(true);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      class="tooltip-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && <div class="tooltip">{text}</div>}
    </div>
  );
}
