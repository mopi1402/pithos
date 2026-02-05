import type { ReactNode } from "react";

interface HighlightProps {
  children: ReactNode;
  color?: string;
}

export function Highlight({ children, color = "var(--ifm-color-primary)" }: HighlightProps): ReactNode {
  return <strong style={{ color }}>{children}</strong>;
}
