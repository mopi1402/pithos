import { useSidebarFilter } from "@site/src/contexts/SidebarFilterContext";

export default function SidebarTopbarFilter() {
  const {
    showTopPicksOnly,
    setShowTopPicksOnly,
    showHiddenGemsOnly,
    setShowHiddenGemsOnly,
  } = useSidebarFilter();

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
    fontSize: "0.875rem",
    userSelect: "none" as const,
  };

  const inputStyle = {
    cursor: "pointer" as const,
    width: "1rem",
    height: "1rem",
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        backgroundColor: "var(--ifm-background-color)",
        borderBottom:
          "1px solid color-mix(in srgb, var(--ifm-color-emphasis-300) 20%, transparent)",
        borderRight: "1px solid var(--ifm-toc-border-color)",
        padding: "0.75rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <label style={labelStyle}>
        <input
          type="checkbox"
          checked={showTopPicksOnly}
          onChange={(e) => setShowTopPicksOnly(e.target.checked)}
          style={inputStyle}
        />
        <span>👑 Top picks</span>
      </label>
      <label style={labelStyle}>
        <input
          type="checkbox"
          checked={showHiddenGemsOnly}
          onChange={(e) => setShowHiddenGemsOnly(e.target.checked)}
          style={inputStyle}
        />
        <span>💎 Hidden gem</span>
      </label>
    </div>
  );
}
