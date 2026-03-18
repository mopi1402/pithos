import { useState, useRef } from "react";
import { Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import type { EmailBlock } from "@/lib/types";

const BLOCK_EMOJI: Record<EmailBlock["type"], string> = {
  header: "🔤", text: "📝", image: "🖼️", button: "🔘", divider: "➖",
};

function blockSummary(block: EmailBlock): string {
  switch (block.type) {
    case "header": return block.text;
    case "text": return block.content.slice(0, 50) + (block.content.length > 50 ? "..." : "");
    case "image": return block.alt || "(no alt text)";
    case "button": return block.label;
    case "divider": return "Horizontal rule";
  }
}

export function BlockRow({ block, index, total, onRemove, onReorder, onMove }: {
  block: EmailBlock;
  index: number;
  total: number;
  onRemove: () => void;
  onReorder: (from: number, to: number) => void;
  onMove: (index: number, dir: -1 | 1) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={dragRef}
      draggable
      onDragStart={(e) => { e.dataTransfer.setData("text/plain", String(index)); e.dataTransfer.effectAllowed = "move"; setIsDragging(true); }}
      onDragEnd={() => setIsDragging(false)}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragOver(false); const from = Number(e.dataTransfer.getData("text/plain")); if (from !== index) onReorder(from, index); }}
      className={`flex items-center gap-2 px-3 py-2 group cursor-grab active:cursor-grabbing transition-colors ${
        isDragging ? "bg-blue-100 opacity-60" : isDragOver ? "bg-blue-50 border-t-2 border-blue-400" : ""
      }`}
    >
      <GripVertical className="w-3.5 h-3.5 text-slate-300 shrink-0 hidden lg:block" />
      <div className="flex flex-col gap-0.5 shrink-0 lg:hidden">
        <button onClick={() => onMove(index, -1)} disabled={index === 0} className="text-slate-300 hover:text-slate-600 disabled:opacity-20">
          <ChevronUp className="w-3 h-3" />
        </button>
        <button onClick={() => onMove(index, 1)} disabled={index === total - 1} className="text-slate-300 hover:text-slate-600 disabled:opacity-20">
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
      <span className="text-sm shrink-0">{BLOCK_EMOJI[block.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-700 capitalize">{block.type}</p>
        <p className="text-[10px] text-slate-400 truncate">{blockSummary(block)}</p>
      </div>
      <button onClick={onRemove} className="p-1 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}
