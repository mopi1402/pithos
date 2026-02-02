import { useDoc } from "@docusaurus/plugin-content-docs/client";

export default function TypeBadge() {
  const { frontMatter } = useDoc();
  const type = (frontMatter as { type?: string }).type;

  if (!type) {
    return null;
  }

  const colors = { color: "#666", borderColor: "#666" };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.125rem 0.5rem",
        color: colors.color,
        border: `1px solid ${colors.borderColor}`,
        borderRadius: "0.375rem",
        fontSize: "0.575rem",
        fontWeight: 600,
        backgroundColor: "transparent",
        textTransform: "capitalize",
      }}
      title={`Type: ${type}`}
    >
      {type}
    </span>
  );
}
