import { useState, useCallback, useRef, useEffect } from "react";
import { createKanbanStack } from "@/lib/command";
import { COLUMNS, INITIAL_BOARD } from "@/data/kanban";
import type { BoardState, ColumnId, Task } from "@/lib/types";

export function useKanbanBoard() {
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [isReplaying, setIsReplaying] = useState(false);
  const [highlightedTask, setHighlightedTask] = useState<string | null>(null);
  const stackRef = useRef(createKanbanStack(setBoard));
  const abortRef = useRef<AbortController | null>(null);
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

    const controller = new AbortController();
    abortRef.current = controller;
    const { signal } = controller;

    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        const id = setTimeout(resolve, ms);
        signal.addEventListener("abort", () => { clearTimeout(id); reject(new DOMException("Aborted", "AbortError")); }, { once: true });
      });

    setIsReplaying(true);
    while (stack.canUndo) stack.undo();
    sync();
    try {
      for (let i = 0; i < totalCommands; i++) {
        await wait(600);
        if (signal.aborted) break;
        const entry = stack.history[stack.cursor + 1];
        if (entry) {
          const match = entry.description.match(/Move "(.+)" from (.+) to (.+)/);
          if (match) {
            const [, title, fromLabel] = match;
            const from = (Object.entries(COLUMNS).find(([, v]) => v.label === fromLabel)?.[0] ?? "todo") as ColumnId;
            const task = stack.state[from].find((t: Task) => t.title === title);
            if (task) { setHighlightedTask(task.id); await wait(400); }
          }
        }
        if (signal.aborted) break;
        stack.redo();
        sync();
        setHighlightedTask(null);
      }
    } catch {
      // aborted — no-op
    }
    setIsReplaying(false);
  }, [isReplaying, sync]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const { canUndo, canRedo, history, cursor } = stackRef.current;

  return {
    board, isReplaying, highlightedTask, canUndo, canRedo, history, cursor,
    handleDrop, handleUndo, handleRedo, handleReset, handleReplay,
  };
}
