/**
 * Functional Memento Pattern.
 *
 * In OOP, the Memento pattern requires an Originator class that creates
 * snapshots, a Memento class that stores state, and a Caretaker that manages
 * the history.
 *
 * In functional TypeScript with immutable data, state is already a snapshot.
 * The pattern simplifies to a history manager that tracks state changes
 * and enables undo/redo.
 *
 * ## Memento vs Command for undo/redo
 *
 * - **Memento** (`createHistory`): stores *state snapshots*.
 *   Undo restores the previous state. Use when state is cheap to copy.
 *
 * - **Command** (`createCommandStack`): stores *actions* with their inverses.
 *   Undo calls the command's undo function. Use when you have reversible operations.
 *
 * @module eidos/memento
 * @since 2.4.0
 *
 * @example
 * ```ts
 * import { createHistory } from "@pithos/core/eidos/memento/memento";
 *
 * type EditorState = { content: string; cursor: number };
 *
 * const history = createHistory<EditorState>({ content: "", cursor: 0 });
 *
 * history.push({ content: "Hello", cursor: 5 });
 * history.push({ content: "Hello World", cursor: 11 });
 *
 * history.current(); // { content: "Hello World", cursor: 11 }
 * history.undo();    // Some({ content: "Hello", cursor: 5 })
 * history.redo();    // Some({ content: "Hello World", cursor: 11 })
 * ```
 */

import { some, none } from "@zygos/option";
import type { Option } from "@zygos/option";

/**
 * A snapshot with metadata.
 *
 * @template T - The state type
 * @since 2.4.0
 */
export type Snapshot<T> = {
  readonly state: T;
  readonly timestamp: number;
};

/**
 * History manager for undo/redo functionality.
 *
 * @template T - The state type
 * @since 2.4.0
 */
export type History<T> = {
  /** Returns the current state. */
  current: () => T;
  /** Pushes a new state, clearing any redo history. */
  push: (state: T) => void;
  /** Undoes to previous state. Returns the new current state, or None if at beginning. */
  undo: () => Option<T>;
  /** Redoes to next state. Returns the new current state, or None if at end. */
  redo: () => Option<T>;
  /** Returns true if undo is possible. */
  canUndo: () => boolean;
  /** Returns true if redo is possible. */
  canRedo: () => boolean;
  /** Returns all snapshots in the undo stack (oldest first). */
  history: () => ReadonlyArray<Snapshot<T>>;
  /** Clears all history, keeping only current state. */
  clear: () => void;
};

/**
 * Creates a history manager for undo/redo functionality.
 *
 * Tracks state changes as snapshots. Pushing a new state clears any
 * redo history (standard undo/redo behavior).
 *
 * @template T - The state type
 * @param initial - The initial state
 * @returns A history manager
 * @since 2.4.0
 *
 * @example
 * ```ts
 * const history = createHistory({ count: 0 });
 *
 * history.push({ count: 1 });
 * history.push({ count: 2 });
 * history.push({ count: 3 });
 *
 * history.undo(); // Some({ count: 2 })
 * history.undo(); // Some({ count: 1 })
 * history.redo(); // Some({ count: 2 })
 *
 * // New push clears redo stack
 * history.push({ count: 10 });
 * history.canRedo(); // false
 * ```
 */
export function createHistory<T>(initial: T): History<T> {
  const undoStack: Snapshot<T>[] = [{ state: initial, timestamp: Date.now() }];
  const redoStack: Snapshot<T>[] = [];

  return {
    current() {
      return undoStack[undoStack.length - 1].state;
    },

    push(state: T) {
      undoStack.push({ state, timestamp: Date.now() });
      redoStack.length = 0;
    },

    undo() {
      if (undoStack.length <= 1) return none;
      const lastIndex = undoStack.length - 1;
      const snapshot = undoStack[lastIndex];
      undoStack.length = lastIndex;
      redoStack.push(snapshot);
      return some(undoStack[undoStack.length - 1].state);
    },

    redo() {
      if (redoStack.length === 0) return none;
      const lastIndex = redoStack.length - 1;
      const snapshot = redoStack[lastIndex];
      redoStack.length = lastIndex;
      undoStack.push(snapshot);
      return some(undoStack[undoStack.length - 1].state);
    },

    canUndo() {
      return undoStack.length > 1;
    },

    canRedo() {
      return redoStack.length > 0;
    },

    history() {
      return undoStack;
    },

    clear() {
      const current = undoStack[undoStack.length - 1];
      undoStack.length = 0;
      undoStack.push(current);
      redoStack.length = 0;
    },
  };
}
