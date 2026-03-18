import { useState } from "react";
import { Undo2, Redo2, Trash2, RotateCcw } from "lucide-react";
import { usePhotoEditor } from "@/hooks/usePhotoEditor";
import { ImagePreview } from "./ImagePreview";
import { FilterSliders } from "./FilterSliders";
import { HistoryPanel } from "./HistoryPanel";

export function PhotoEditor() {
  const {
    sourceRef, filters, snapshots, activeIndex,
    canUndo, canRedo, imageLoaded, isFiltersDefault,
    handleSliderChange, handleSliderCommit,
    handleUndo, handleRedo, handleClear, handleJumpTo,
  } = usePhotoEditor();

  const [mobileTab, setMobileTab] = useState<"editor" | "history">("editor");

  return (
    <div className="h-screen flex flex-col bg-[#0d0d0d] text-white overflow-hidden select-none">
      <canvas ref={sourceRef} className="hidden" />

      {/* Mobile */}
      <div className="sm:hidden flex flex-col h-full">
        <MobileHeader canUndo={canUndo} canRedo={canRedo} onUndo={handleUndo} onRedo={handleRedo} />
        <div className="flex-1 overflow-auto">
          {mobileTab === "editor" ? (
            <div className="p-2 space-y-2">
              <ImagePreview sourceRef={sourceRef} filters={filters} loaded={imageLoaded} />
              <FilterSliders filters={filters} onChange={handleSliderChange} onCommit={handleSliderCommit} compact />
              <button
                onClick={handleClear}
                disabled={isFiltersDefault}
                className="w-full py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-500 text-[11px] hover:bg-white/[0.07] disabled:opacity-20 disabled:hover:bg-white/[0.04] transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={11} /> Reset
              </button>
            </div>
          ) : (
            <HistoryPanel snapshots={snapshots} activeIndex={activeIndex} onJumpTo={(i) => { handleJumpTo(i); setMobileTab("editor"); }} onClear={handleClear} />
          )}
        </div>
        <MobileTabBar tab={mobileTab} onTabChange={setMobileTab} snapshotCount={snapshots.length} />
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex h-full">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-11 flex items-center justify-between px-4 border-b border-white/[0.06] bg-[#161616] flex-shrink-0">
            <span className="text-[13px] font-medium text-zinc-300 tracking-wide">Photo Editor</span>
            <div className="flex items-center gap-0.5">
              <ToolbarButton icon={Undo2} onClick={handleUndo} disabled={!canUndo} title="Undo" />
              <ToolbarButton icon={Redo2} onClick={handleRedo} disabled={!canRedo} title="Redo" />
              <ToolbarButton icon={RotateCcw} onClick={handleClear} disabled={isFiltersDefault} title="Reset" />
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-6 bg-[#0d0d0d] min-h-0">
            <ImagePreview sourceRef={sourceRef} filters={filters} loaded={imageLoaded} />
          </div>
          <div className="border-t border-white/[0.06] bg-[#161616] px-4 py-3 flex-shrink-0">
            <FilterSliders filters={filters} onChange={handleSliderChange} onCommit={handleSliderCommit} />
          </div>
        </div>

        <div className="w-[200px] flex flex-col border-l border-white/[0.06] bg-[#141414] flex-shrink-0">
          <div className="h-11 flex items-center justify-between px-3 border-b border-white/[0.06] flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">History</span>
              {snapshots.length > 1 && (
                <span className="px-1.5 text-[9px] h-4 inline-flex items-center justify-center rounded-full bg-white/[0.06] text-zinc-500 font-mono">{snapshots.length}</span>
              )}
            </div>
            {snapshots.length > 1 && (
              <button onClick={handleClear} className="p-1 rounded text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors" title="Clear history">
                <Trash2 size={12} />
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
            <HistoryPanel snapshots={snapshots} activeIndex={activeIndex} onJumpTo={handleJumpTo} onClear={handleClear} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Small UI helpers (too small to extract) ──────────────────────────

function ToolbarButton({ icon: Icon, onClick, disabled, title }: { icon: typeof Undo2; onClick: () => void; disabled?: boolean; title: string }) {
  return (
    <button onClick={onClick} disabled={disabled} title={title} aria-label={title} className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition-colors">
      <Icon size={15} />
    </button>
  );
}

function MobileHeader({ canUndo, canRedo, onUndo, onRedo }: { canUndo: boolean; canRedo: boolean; onUndo: () => void; onRedo: () => void }) {
  return (
    <div className="h-11 flex items-center justify-between px-3 bg-[#161616] border-b border-white/[0.06] flex-shrink-0">
      <span className="text-[13px] font-medium text-zinc-300">Photo Editor</span>
      <div className="flex gap-0.5">
        <ToolbarButton icon={Undo2} onClick={onUndo} disabled={!canUndo} title="Undo" />
        <ToolbarButton icon={Redo2} onClick={onRedo} disabled={!canRedo} title="Redo" />
      </div>
    </div>
  );
}

function MobileTabBar({ tab, onTabChange, snapshotCount }: { tab: "editor" | "history"; onTabChange: (t: "editor" | "history") => void; snapshotCount: number }) {
  return (
    <div className="h-12 bg-[#161616] border-t border-white/[0.06] flex flex-shrink-0">
      <button onClick={() => onTabChange("editor")} className={`flex-1 flex items-center justify-center text-[11px] font-medium transition-colors ${tab === "editor" ? "text-zinc-200" : "text-zinc-600"}`}>
        🎨 Editor
      </button>
      <button onClick={() => onTabChange("history")} className={`flex-1 flex items-center justify-center text-[11px] font-medium transition-colors ${tab === "history" ? "text-zinc-200" : "text-zinc-600"}`}>
        📸 History
        {snapshotCount > 1 && (
          <span className="ml-1.5 px-1.5 text-[9px] h-4 inline-flex items-center justify-center rounded-full bg-white/[0.06] text-zinc-500 font-mono">{snapshotCount}</span>
        )}
      </button>
    </div>
  );
}
