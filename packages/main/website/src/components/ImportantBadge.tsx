import { useDoc } from "@docusaurus/plugin-content-docs/client";

interface ImportantBadgeProps {
  iconOnly?: boolean;
}

const baseStyle = {
  display: "inline-flex" as const,
  alignItems: "center" as const,
  marginLeft: "0.5rem",
  fontSize: "0.875rem",
};

/**
 * CSS styles for ImportantBadge component.
 * Exported for use in DOM manipulation contexts where React components can't be used.
 */
export const importantBadgeStyles: Record<string, string> = {
  display: "inline-flex",
  alignItems: "center",
  marginLeft: "0.5rem",
  padding: "0.125rem 0.5rem",
  backgroundColor: "#ffd700",
  color: "#000",
  borderRadius: "0.375rem",
  fontSize: "0.875rem",
  fontWeight: "600",
};

export default function ImportantBadge({
  iconOnly = false,
}: ImportantBadgeProps) {
  const { frontMatter } = useDoc();

  if (!(frontMatter as { important?: boolean }).important) {
    return null;
  }

  return (
    <span
      style={{
        ...baseStyle,
        ...(iconOnly
          ? {}
          : {
              padding: "0.125rem 0.5rem",
              backgroundColor: "#ffd700",
              color: "#000",
              borderRadius: "0.375rem",
              fontWeight: 600,
            }),
      }}
      title="Top pick"
    >
      👑 {iconOnly ? "" : "Top pick"}
    </span>
  );
}
