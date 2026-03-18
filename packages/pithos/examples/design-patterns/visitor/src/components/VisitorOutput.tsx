import { toHtml, toPlainText, audit } from "@/lib/visitors";
import type { EmailBlock, VisitorKey } from "@/lib/types";

export function VisitorOutput({ visitor, blocks }: { visitor: VisitorKey; blocks: EmailBlock[] }) {
  switch (visitor) {
    case "preview": return <PreviewOutput blocks={blocks} />;
    case "html": return <HtmlOutput blocks={blocks} />;
    case "plaintext": return <PlainTextOutput blocks={blocks} />;
    case "audit": return <AuditOutput blocks={blocks} />;
  }
}

function Empty() {
  return <div className="p-6 text-center text-sm text-slate-400">Add blocks to see the output</div>;
}

function linkify(text: string): React.ReactNode[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a key={i} href={part} className="text-blue-600 underline underline-offset-2 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
        {part.replace(/^https?:\/\//, "")}
      </a>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function PreviewOutput({ blocks }: { blocks: EmailBlock[] }) {
  if (!blocks.length) return <Empty />;
  return (
    <div className="p-4 space-y-3">
      {blocks.map((block, i) => <PreviewBlock key={`${block.type}-${i}`} block={block} />)}
    </div>
  );
}

function PreviewBlock({ block }: { block: EmailBlock }) {
  switch (block.type) {
    case "header":
      return block.level === 1
        ? <h1 className="text-xl font-bold text-slate-900">{block.text}</h1>
        : block.level === 2
          ? <h2 className="text-lg font-semibold text-slate-800">{block.text}</h2>
          : <h3 className="text-base font-medium text-slate-700">{block.text}</h3>;
    case "text":
      return <p className="text-sm text-slate-600 leading-relaxed">{linkify(block.content)}</p>;
    case "image":
      return <img src={block.src} alt={block.alt} className="w-full rounded-lg" />;
    case "button":
      return <div><span className="inline-block px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg">{block.label}</span></div>;
    case "divider":
      return <hr className="border-slate-200" />;
  }
}

function HtmlOutput({ blocks }: { blocks: EmailBlock[] }) {
  if (!blocks.length) return <Empty />;
  return (
    <div className="bg-slate-900 p-4">
      <pre className="text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap break-all">
        {blocks.map(toHtml).join("\n")}
      </pre>
    </div>
  );
}

function PlainTextOutput({ blocks }: { blocks: EmailBlock[] }) {
  if (!blocks.length) return <Empty />;
  return (
    <div className="p-4">
      <pre className="text-sm font-mono text-slate-700 leading-relaxed whitespace-pre-wrap">
        {blocks.map(toPlainText).join("\n\n")}
      </pre>
    </div>
  );
}

function AuditOutput({ blocks }: { blocks: EmailBlock[] }) {
  if (!blocks.length) return <Empty />;
  const results = blocks.map((b, i) => audit(b, i));
  const errors = results.filter((r) => r.severity === "error").length;
  const warnings = results.filter((r) => r.severity === "warning").length;

  return (
    <div className="p-4 space-y-3">
      <div className={`rounded-lg px-3 py-2 text-xs font-medium ${
        errors > 0 ? "bg-red-50 text-red-700 border border-red-200"
          : warnings > 0 ? "bg-amber-50 text-amber-700 border border-amber-200"
            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
      }`}>
        {errors > 0
          ? `${errors} error${errors > 1 ? "s" : ""}, ${warnings} warning${warnings !== 1 ? "s" : ""}`
          : warnings > 0
            ? `All clear, ${warnings} warning${warnings > 1 ? "s" : ""}`
            : "All checks passed ✓"}
      </div>
      <div className="space-y-1.5">
        {results.map((r) => (
          <div key={r.index} className="flex items-start gap-2 text-xs">
            <span className={`shrink-0 mt-0.5 w-2 h-2 rounded-full ${
              r.severity === "error" ? "bg-red-500" : r.severity === "warning" ? "bg-amber-500" : "bg-emerald-500"
            }`} />
            <span className="text-slate-500 shrink-0">#{r.index + 1} {r.block.type}</span>
            <span className={
              r.severity === "error" ? "text-red-700 font-medium" : r.severity === "warning" ? "text-amber-700" : "text-slate-500"
            }>{r.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
