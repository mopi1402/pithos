import { Files, FolderTree, HardDrive } from "lucide-react";
import { formatSize } from "@/lib/helpers";

export function StatsBar({ fileCount, folderCount, totalSize, compact }: {
  fileCount: number;
  folderCount: number;
  totalSize: number;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="shrink-0 flex items-center gap-4 px-3 py-2 text-[11px] border-t border-white/10" style={{ background: "#181825" }}>
        <span className="flex items-center gap-1.5 text-blue-400">
          <Files className="w-3 h-3" />
          <span className="font-mono tabular-nums">{fileCount}</span> files
        </span>
        <span className="flex items-center gap-1.5 text-amber-400">
          <FolderTree className="w-3 h-3" />
          <span className="font-mono tabular-nums">{folderCount}</span> folders
        </span>
        <span className="flex items-center gap-1.5 text-indigo-300 ml-auto">
          <HardDrive className="w-3 h-3" />
          <span className="font-mono tabular-nums font-medium">{formatSize(totalSize)}</span>
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-5 px-4 py-2 rounded-xl text-sm" style={{ background: "#1e1e2e" }}>
      <span className="flex items-center gap-1.5 text-blue-400">
        <Files className="w-3.5 h-3.5" />
        <span className="font-bold font-mono tabular-nums text-slate-100">{fileCount}</span> files
      </span>
      <div className="w-px h-4 bg-white/10" />
      <span className="flex items-center gap-1.5 text-amber-400">
        <FolderTree className="w-3.5 h-3.5" />
        <span className="font-bold font-mono tabular-nums text-slate-100">{folderCount}</span> folders
      </span>
      <div className="w-px h-4 bg-white/10" />
      <span className="flex items-center gap-1.5 text-indigo-400">
        <HardDrive className="w-3.5 h-3.5" />
        <span className="font-bold font-mono tabular-nums text-indigo-300">{formatSize(totalSize)}</span> total via fold
      </span>
    </div>
  );
}
