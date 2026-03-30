import { useState, useMemo, useRef, useEffect } from "react";
import { AlertCircle, Folder } from "lucide-react";
import type { FileTree } from "@/lib/types";
import { collectFolderPaths } from "@/lib/tree-ops";
import { fold } from "@/lib/composite";
import { PRESET_FILES } from "@/data/initial-tree";

type AddFileFormProps = {
  tree: FileTree;
  onAdd: (folderPath: string[], name: string, size: number) => boolean;
};

export function AddFileForm({ tree, onAdd }: AddFileFormProps) {
  const [selectedFolder, setSelectedFolder] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(errorTimerRef.current);
  }, []);

  const folderPaths = useMemo(() => collectFolderPaths(tree), [tree]);

  // Check which files already exist in the selected folder
  const existingFiles = useMemo(() => {
    const path = folderPaths[selectedFolder];
    if (!path) return new Set<string>();
    const targetPath = path.slice(1);
    let current: FileTree = tree;
    for (const segment of targetPath) {
      if (current.type === "leaf") return new Set<string>();
      const child = current.children.find((c) => c.data.name === segment);
      if (!child) return new Set<string>();
      current = child;
    }
    if (current.type === "leaf") return new Set<string>();
    return new Set(current.children.map((c) => c.data.name));
  }, [tree, folderPaths, selectedFolder]);

  const handleAdd = (file: typeof PRESET_FILES[number]) => {
    const folder = folderPaths[selectedFolder];
    const ok = onAdd(folder, file.name, file.size);
    if (!ok) {
      setError(`${file.name} already exists`);
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => setError(null), 2000);
    }
  };

  const totalFiles = fold(tree, {
    leaf: () => 1,
    branch: (_d, c) => c.reduce((a, b) => a + b, 0),
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
          Target folder
        </label>
        <div className="flex flex-wrap gap-1.5">
          {folderPaths.map((path, i) => {
            const label = path[path.length - 1];
            const isSelected = selectedFolder === i;
            return (
              <button
                key={i}
                onClick={() => { setSelectedFolder(i); setError(null); }}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all
                  ${isSelected
                    ? "bg-indigo-500/25 text-indigo-200 ring-1 ring-indigo-500/40"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
                  }
                `}
              >
                <Folder className="w-3 h-3 text-amber-400/70" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-2">
          Pick a file ({totalFiles} in tree)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_FILES.map((file) => {
            const exists = existingFiles.has(file.name);
            return (
              <button
                key={file.name}
                onClick={() => handleAdd(file)}
                disabled={exists}
                className={`
                  flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm transition-all
                  ${exists
                    ? "bg-slate-800/50 text-slate-600 cursor-not-allowed"
                    : "bg-slate-800 text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-200 hover:ring-1 hover:ring-indigo-500/30 active:scale-[0.98]"
                  }
                `}
              >
                <span className="text-base">{file.icon}</span>
                <div className="min-w-0">
                  <div className={`truncate text-[13px] ${exists ? "line-through" : ""}`}>{file.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{file.size} B</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 rounded-lg px-3 py-2 animate-pulse">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
