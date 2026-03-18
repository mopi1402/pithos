import { useState } from "react";
import { ChevronRight, FileText, Folder, FolderOpen } from "lucide-react";
import type { FileTree } from "@/lib/types";
import { computeSize } from "@/lib/composite";
import { formatSize, extColor } from "@/lib/helpers";

type TreeNodeProps = {
  node: FileTree;
  depth?: number;
  highlightedNode?: string | null;
};

export function TreeNode({ node, depth = 0, highlightedNode }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2);
  const isHighlighted = highlightedNode === node.data.name;

  if (node.type === "leaf") {
    const color = extColor(node.data.name);
    return (
      <div
        className={`
          group flex items-center gap-2 py-[5px] px-2 rounded-md text-[13px] transition-all duration-500
          ${isHighlighted
            ? "bg-indigo-500/20 ring-1 ring-indigo-400/50"
            : "hover:bg-white/5"
          }
        `}
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
      >
        <FileText className="w-4 h-4 shrink-0 opacity-80" style={{ color }} />
        <span className="text-slate-300 truncate">{node.data.name}</span>
        <span className="ml-auto text-[11px] text-slate-500 font-mono tabular-nums shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {formatSize(node.data.size)}
        </span>
      </div>
    );
  }

  const totalSize = computeSize(node);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className={`
          group w-full flex items-center gap-1.5 py-[5px] px-2 rounded-md text-[13px] transition-all duration-500
          ${isHighlighted
            ? "bg-indigo-500/20 ring-1 ring-indigo-400/50"
            : "hover:bg-white/5"
          }
        `}
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
      >
        <span className={`transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}>
          <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
        </span>
        {expanded
          ? <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
          : <Folder className="w-4 h-4 text-amber-400/70 shrink-0" />
        }
        <span className="text-slate-200 font-medium truncate">{node.data.name}</span>
        <span className={`
          ml-auto text-[11px] font-mono tabular-nums shrink-0 px-1.5 py-0.5 rounded-full transition-all duration-500
          ${isHighlighted
            ? "bg-indigo-500/30 text-indigo-300"
            : "bg-white/5 text-slate-500 group-hover:text-slate-400"
          }
        `}>
          {formatSize(totalSize)}
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div
            className="border-l border-white/[0.06]"
            style={{ marginLeft: `${depth === 0 ? 12 : depth * 16 + 12}px` }}
          >
          {[...node.children]
            .sort((a, b) => {
              if (a.type === b.type) return a.data.name.localeCompare(b.data.name);
              return a.type === "branch" ? -1 : 1;
            })
            .map((child: FileTree, i: number) => (
            <TreeNode
              key={`${child.data.name}-${i}`}
              node={child}
              depth={1}
              highlightedNode={highlightedNode}
            />
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}
