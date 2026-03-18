import { X } from "lucide-react";
import { AddFileForm } from "./AddFileForm";
import type { FileTree } from "@/lib/types";

export function AddFileModal({ tree, modalClosing, onAdd, onClose }: {
  tree: FileTree;
  modalClosing: boolean;
  onAdd: (folderPath: string[], name: string, size: number) => boolean;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center" onClick={onClose}>
      <div className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${modalClosing ? "opacity-0" : "opacity-100"}`} />
      <div
        className={`relative w-full md:w-auto md:min-w-[420px] md:max-w-lg rounded-t-2xl md:rounded-2xl p-4 pb-8 md:pb-4 ${modalClosing ? "animate-slide-down md:opacity-0" : "animate-slide-up md:animate-none"}`}
        style={{ background: "#1e1e2e" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-slate-200">Add a file</span>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <AddFileForm
          tree={tree}
          onAdd={(...args) => {
            const ok = onAdd(...args);
            if (ok) onClose();
            return ok;
          }}
        />
      </div>
    </div>
  );
}
