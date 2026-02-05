import { useDoc } from "@docusaurus/plugin-content-docs/client";
import { translate } from "@docusaurus/Translate";

interface HiddenGemBadgeProps {
  iconOnly?: boolean;
}

const baseStyle = {
  display: "inline-flex" as const,
  alignItems: "center" as const,
  marginLeft: "0.5rem",
  fontSize: "0.875rem",
};

/**
 * CSS styles for HiddenGemBadge component.
 * Exported for use in DOM manipulation contexts where React components can't be used.
 */
export const hiddenGemBadgeStyles: Record<string, string> = {
  display: "inline-flex",
  alignItems: "center",
  marginLeft: "0.5rem",
  padding: "0.125rem 0.5rem",
  backgroundColor: "#87CEEB",
  color: "#000",
  borderRadius: "0.375rem",
  fontSize: "0.875rem",
  fontWeight: "600",
};

export default function HiddenGemBadge({
  iconOnly = false,
}: HiddenGemBadgeProps) {
  const { frontMatter } = useDoc();

  if (!(frontMatter as { hiddenGem?: boolean }).hiddenGem) {
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
              backgroundColor: "#87CEEB",
              color: "#000",
              borderRadius: "0.375rem",
              fontWeight: 600,
            }),
      }}
      title={translate({ id: 'shared.badge.hiddenGem', message: 'Hidden gem' })}
    >
      💎 {iconOnly ? "" : translate({ id: 'shared.badge.hiddenGem', message: 'Hidden gem' })}
    </span>
  );
}


