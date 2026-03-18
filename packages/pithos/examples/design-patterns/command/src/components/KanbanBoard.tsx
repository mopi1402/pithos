import { Undo2, Redo2, RotateCcw, Play } from "lucide-react";
import { useKanbanBoard } from "@/hooks/useKanbanBoard";
import { COLUMNS } from "@/data/kanban";
import { KanbanColumn } from "./KanbanColumn";
import { HistoryPanel } from "./HistoryPanel";
import type { ColumnId } from "@/lib/types";

export function KanbanBoard() {
  const {
    board, isReplaying, highlightedTask, canUndo, canRedo, history, cursor,
    handleDrop, handleUndo, handleRedo, handleReset, handleReplay,
  } = useKanbanBoard();

  const columns = (Object.keys(COLUMNS) as ColumnId[]).map((colId) => (
    <KanbanColumn key={colId} id={colId} tasks={board[colId]} onDrop={handleDrop} highlightedTask={highlightedTask} disabled={isReplaying} />
  ));

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-col h-screen max-w-2xl mx-auto md:hidden">
        <div className="shrink-0 bg-slate-50 px-3 pt-3 space-y-3">
          <div className="flex items-center gap-2">
            <UndoButton onClick={handleUndo} disabled={!canUndo || isReplaying} />
            <RedoButton onClick={handleRedo} disabled={!canRedo || isReplaying} />
            <button onClick={handleReset} disabled={isReplaying} className="p-2 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 disabled:opacity-40 transition-all"><RotateCcw className="w-4 h-4" /></button>
          </div>
          <div className="border-t border-slate-200" />
        </div>
        <div className="flex-1 overflow-auto px-3 pb-3">
          <div className="grid grid-cols-3 gap-2 min-h-[300px]">{columns}</div>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Command History</span>
              {cursor >= 0 && <ReplayButton onClick={handleReplay} disabled={isReplaying} small />}
            </div>
            <HistoryPanel history={history} cursor={cursor} />
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block max-w-5xl mx-auto py-8 px-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Kanban Board</h1>
              <p className="text-sm text-slate-500 mt-1">Command pattern: every move is reversible with human-readable history</p>
            </div>
            <div className="flex items-center gap-2">
              <UndoButton onClick={handleUndo} disabled={!canUndo || isReplaying} />
              <RedoButton onClick={handleRedo} disabled={!canRedo || isReplaying} />
              <ReplayButton onClick={handleReplay} disabled={cursor < 0 || isReplaying} isReplaying={isReplaying} />
              <button onClick={handleReset} disabled={isReplaying} className="p-2 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 disabled:opacity-40 transition-all" title="Reset"><RotateCcw className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">{columns}</div>
          <section className="bg-slate-800 rounded-xl p-4 max-h-48 overflow-auto">
            <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2"><span className="text-base">📜</span> Command History</h2>
            <HistoryPanel history={history} cursor={cursor} />
          </section>
          <div className="bg-slate-100 rounded-lg p-4 text-sm text-slate-600">
            <strong>How it works:</strong> Each drag creates a command via <code className="bg-slate-200 px-1 rounded">undoableState(execute, undo)</code>. The reactive stack manages state and calls <code className="bg-slate-200 px-1 rounded">onChange</code> on every transition.
          </div>
        </div>
      </div>
    </>
  );
}

function UndoButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return <button onClick={onClick} disabled={disabled} className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 md:px-4 py-2 rounded-lg font-medium bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-40 transition-all"><Undo2 className="w-4 h-4" /> Undo</button>;
}

function RedoButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return <button onClick={onClick} disabled={disabled} className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 md:px-4 py-2 rounded-lg font-medium bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-40 transition-all"><Redo2 className="w-4 h-4" /> Redo</button>;
}

function ReplayButton({ onClick, disabled, isReplaying, small }: { onClick: () => void; disabled: boolean; isReplaying?: boolean; small?: boolean }) {
  if (small) return <button onClick={onClick} disabled={disabled} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded disabled:opacity-40 transition-all"><Play className="w-3 h-3" /> Replay</button>;
  return <button onClick={onClick} disabled={disabled} className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-40 transition-all"><Play className="w-4 h-4" /> {isReplaying ? "Replaying..." : "Replay All"}</button>;
}
