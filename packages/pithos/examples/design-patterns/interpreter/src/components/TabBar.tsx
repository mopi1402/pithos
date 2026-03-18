import { FileText, Eye, TreePine } from "lucide-react";

export type Tab = "editor" | "preview" | "ast";

export function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "editor", label: "Markdown", icon: <FileText size={14} /> },
    { key: "preview", label: "Preview", icon: <Eye size={14} /> },
    { key: "ast", label: "AST", icon: <TreePine size={14} /> },
  ];

  return (
    <div className="flex sm:hidden border-b border-white/[0.06] bg-white/[0.02] shrink-0">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
            active === t.key
              ? "text-amber-400 border-b-2 border-amber-400"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}
