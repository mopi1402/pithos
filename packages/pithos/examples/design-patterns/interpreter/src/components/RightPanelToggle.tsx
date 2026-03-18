import { Eye, TreePine } from "lucide-react";

export type RightPanel = "preview" | "ast";

export function RightPanelToggle({ active, onChange }: { active: RightPanel; onChange: (p: RightPanel) => void }) {
  const items: { key: RightPanel; label: string; icon: React.ReactNode }[] = [
    { key: "preview", label: "Preview", icon: <Eye size={12} /> },
    { key: "ast", label: "AST", icon: <TreePine size={12} /> },
  ];

  return (
    <div className="flex rounded bg-white/[0.04] border border-white/[0.06] overflow-hidden">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium transition-colors ${
            active === item.key
              ? "bg-white/[0.08] text-amber-400"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}
