import { useState, useCallback, useRef } from "react";
import { createKanbanStack } from "@/lib/command";
import { COLUMNS, INITIAL_BOARD } from "@/data/kanban";
import type { BoardState, ColumnId, Task } from "@/lib/types";

export function useKanbanBoard() {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [isReplaying, setIsReplaying] = useState(false);
  const [highlightedTask, setHighlightedTask] = useState<string | null>(null);
  const stackRef = useRef(createKanbanStack(setBoard));
  const [, forceUpdate] = useState(0);
  const sync = useCallback(() => forceUpdate((n) => n + 1), []);

  const handleDrop = useCallback((taskId: string, from: ColumnId, to: ColumnId) => {
    if (from === to || isReplaying) return;
    stackRef.current.move(taskId, from, to);
    sync();
  }, [isReplaying, sync]);

  const handleUndo = useCallback(() => { if (!isReplaying) { stackRef.current.undo(); sync(); } }, [isReplaying, sync]);
  const handleRedo = useCallback(() => { if (!isReplaying) { stackRef.current.redo(); sync(); } }, [isReplaying, sync]);
  const handleReset = useCallback(() => { stackRef.current.clear(); sync(); }, [sync]);

  const handleReplay = useCallback(async () => {
    const stack = stackRef.current;
    const totalCommands = stack.cursor + 1;
    if (totalCommands <= 0 || isReplaying) return;
    setIsReplaying(true);
    while (stack.canUndo) stack.undo();
    sync();
    for (let i = 0; i < totalCommands; i++) {
      await new Promise((r) => setTimeout(r, 600));
      const entry = stack.history[stack.cursor + 1];
      if (entry) {
        const match = entry.description.match(/Move "(.+)" from (.+) to (.+)/);
        if (match) {
          const [, title, fromLabel] = match;
          const from = (Object.entries(COLUMNS).find(([, v]) => v.label === fromLabel)?.[0] ?? "todo") as ColumnId;
          const task = stack.state[from].find((t: Task) => t.title === title);
          if (task) { setHighlightedTask(task.id); await new Promise((r) => setTimeout(r, 400)); }
        }
      }
      stack.redo();
      sync();
      setHighlightedTask(null);
    }
    setIsReplaying(false);
  }, [isReplaying, sync]);

  const { canUndo, canRedo, history, cursor } = stackRef.current;

  return {
    board, isReplaying, highlightedTask, canUndo, canRedo, history, cursor,
    handleDrop, handleUndo, handleRedo, handleReset, handleReplay,
  };
}
