import { ChevronRight } from "lucide-react";
import type { AstLine } from "@/lib/parsing-pipeline/astDisplay";

const KIND_COLORS: Record<string, string> = {
  document: "#94a3b8",
  heading: "#f59e0b",
  paragraph: "#a78bfa",
  blockquote: "#34d399",
  "code-block": "#fb923c",
  hr: "#64748b",
  list: "#38bdf8",
  "list-item": "#38bdf8",
  table: "#818cf8",
  "table-header": "#a5b4fc",
  "table-row": "#818cf8",
  text: "#e4e4e7",
  bold: "#f472b6",
  italic: "#c084fc",
  "bold-italic": "#e879f9",
  strikethrough: "#71717a",
  "inline-code": "#fb923c",
  link: "#22d3ee",
  image: "#4ade80",
  checkbox: "#34d399",
  "line-break": "#64748b",
  "html-block": "#94a3b8",
  "inline-html": "#94a3b8",
};

export function AstTreeLine({ line }: { line: AstLine }) {
  const color = KIND_COLORS[line.kind] ?? "#e4e4e7";
  const isLeaf = line.kind === "text" || line.kind === "inline-code" || line.kind === "image" || line.kind === "hr" || line.kind === "checkbox" || line.kind === "line-break" || line.kind === "autolink" || line.kind === "html-block" || line.kind === "inline-html";

  return (
    <div
      className="flex items-center gap-1 py-[1px] font-mono text-[11px] leading-tight whitespace-nowrap"
      style={{ paddingLeft: `${line.indent * 16 + 8}px` }}
    >
      {isLeaf ? (
        <span className="w-3.5 text-center text-zinc-600">·</span>
      ) : (
        <ChevronRight size={11} className="text-zinc-600 shrink-0" />
      )}
      <span style={{ color }}>{line.label}</span>
    </div>
  );
}
