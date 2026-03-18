import { RotateCcw, Plus } from "lucide-react";
import { useFileExplorer } from "@/hooks/useFileExplorer";
import { TreeNode } from "./TreeNode";
import { FoldPanel } from "./FoldPanel";
import { StatsBar } from "./StatsBar";
import { AddFileModal } from "./AddFileModal";

export function FileExplorer() {
  const {
    tree, highlightedNode, totalSize, fileCount, folderCount, foldSteps,
    showAddModal, setShowAddModal, modalClosing, closeModal,
    mobileTab, setMobileTab,
    handleAddFile, handleReset,
  } = useFileExplorer();

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-col h-screen max-w-2xl mx-auto md:hidden">
        <div className="shrink-0 px-3 pt-3 pb-2 space-y-3" style={{ background: "#1e1e2e" }}>
          <div className="flex items-center justify-between">
            <h1 className="text-base font-semibold text-slate-200">🗂️ File Explorer</h1>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowAddModal(true)} className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-all"><Plus className="w-4 h-4" /></button>
              <button onClick={handleReset} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-all"><RotateCcw className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
        <div className="shrink-0 flex border-b border-white/10" style={{ background: "#1e1e2e" }}>
          <button onClick={() => setMobileTab("explorer")} className={`flex-1 py-2.5 text-xs font-medium tracking-wide transition-all ${mobileTab === "explorer" ? "text-indigo-300 border-b-2 border-indigo-400" : "text-slate-500 hover:text-slate-400"}`}>🗂️ Explorer</button>
          <button onClick={() => setMobileTab("fold")} className={`flex-1 py-2.5 text-xs font-medium tracking-wide transition-all ${mobileTab === "fold" ? "text-indigo-300 border-b-2 border-indigo-400" : "text-slate-500 hover:text-slate-400"}`}>🔍 Fold Trace</button>
        </div>
        <div className="flex-1 overflow-hidden" style={{ background: "#1e1e2e" }}>
          <div className="flex h-full transition-transform duration-300 ease-out" style={{ transform: mobileTab === "fold" ? "translateX(-50%)" : "translateX(0)", width: "200%" }}>
            <div className="w-1/2 h-full overflow-auto px-2 py-1"><TreeNode node={tree} highlightedNode={highlightedNode} /></div>
            <div className="w-1/2 h-full overflow-auto px-3 py-4"><FoldPanel steps={foldSteps} /></div>
          </div>
        </div>
        <StatsBar fileCount={fileCount} folderCount={folderCount} totalSize={totalSize} compact />
      </div>

      {showAddModal && <AddFileModal tree={tree} modalClosing={modalClosing} onAdd={handleAddFile} onClose={closeModal} />}

      {/* Desktop */}
      <div className="hidden md:block max-w-5xl mx-auto p-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🗂️</span>
              <span className="w-px h-8 bg-white/10 shrink-0" />
              <div>
                <h1 className="text-2xl font-bold text-indigo-300">File Explorer</h1>
                <p className="text-sm text-slate-400 mt-1">Composite pattern — <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">fold()</code> computes sizes recursively up the tree</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-4 h-10 rounded-lg font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-all"><Plus className="w-4 h-4" /> Add File</button>
              <button onClick={handleReset} className="h-10 w-10 flex items-center justify-center rounded-lg bg-white/10 text-slate-400 hover:bg-white/15 transition-all" title="Reset"><RotateCcw className="w-4 h-4" /></button>
            </div>
          </div>

          <StatsBar fileCount={fileCount} folderCount={folderCount} totalSize={totalSize} />

          <div className="grid md:grid-cols-5 gap-4" style={{ minHeight: "420px" }}>
            <section className="md:col-span-2 rounded-xl overflow-hidden flex flex-col" style={{ background: "#1e1e2e" }}>
              <div className="px-4 py-3 border-b border-white/5"><span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Explorer</span></div>
              <div className="flex-1 overflow-auto p-2"><TreeNode node={tree} highlightedNode={highlightedNode} /></div>
            </section>
            <div className="md:col-span-3 flex flex-col">
              <section className="flex-1 rounded-xl overflow-hidden flex flex-col" style={{ background: "#1e1e2e" }}>
                <div className="px-4 py-3 border-b border-white/5"><span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">🔍 Fold Trace</span></div>
                <div className="flex-1 overflow-auto p-3"><FoldPanel steps={foldSteps} /></div>
              </section>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 text-sm text-slate-400">
            <strong className="text-slate-300">How it works:</strong> The file tree is a <code className="bg-white/10 px-1 rounded text-slate-300">Composite&lt;FSNode&gt;</code> — a discriminated union of leaves (files) and branches (folders). <code className="bg-white/10 px-1 rounded text-slate-300">fold()</code> traverses the tree bottom-up: leaves return their size, branches sum their children's results. Add a file and watch every ancestor folder's size recalculate automatically.
          </div>
        </div>
      </div>
    </>
  );
}
