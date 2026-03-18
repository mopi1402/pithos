/**
 * Kanban command stack using Pithos's reactive command pattern.
 *
 * undoableState() creates pure (State) => State transforms.
 * createReactiveCommandStack manages state + undo/redo + onChange notifications.
 */

import { undoableState, createReactiveCommandStack } from "@pithos/core/eidos/command/command";
import { COLUMNS, INITIAL_BOARD } from "@/data/kanban";
import type { BoardState, ColumnId, HistoryEntry } from "./types";

function moveTask(board: BoardState, taskId: string, from: ColumnId, to: ColumnId): BoardState {
  const task = board[from].find((t) => t.id === taskId);
  if (!task) return board;
  return { ...board, [from]: board[from].filter((t) => t.id !== taskId), [to]: [...board[to], task] };
}

export function createKanbanStack(onChange: (board: BoardState) => void) {
  const stack = createReactiveCommandStack<BoardState>({ initial: INITIAL_BOARD, onChange });
  const log: HistoryEntry[] = [];
  let cursor = -1;
  let entryId = 0;

  return {
    move(taskId: string, from: ColumnId, to: ColumnId) {
      const task = stack.state[from].find((t) => t.id === taskId);
      if (!task) return;
      stack.execute(undoableState(
        (b) => moveTask(b, taskId, from, to),
        (b) => moveTask(b, taskId, to, from),
      ));
      log.length = cursor + 1;
      entryId++;
      log.push({ id: entryId, description: `Move "${task.title}" from ${COLUMNS[from].label} to ${COLUMNS[to].label}` });
      cursor = log.length - 1;
    },
    undo(): boolean { const ok = stack.undo(); if (ok) cursor--; return ok; },
    redo(): boolean { const ok = stack.redo(); if (ok) cursor++; return ok; },
    clear() { stack.clear(); log.length = 0; cursor = -1; entryId = 0; },
    get state(): BoardState { return stack.state; },
    get canUndo(): boolean { return stack.canUndo; },
    get canRedo(): boolean { return stack.canRedo; },
    get history(): readonly HistoryEntry[] { return log; },
    get cursor(): number { return cursor; },
  };
}
