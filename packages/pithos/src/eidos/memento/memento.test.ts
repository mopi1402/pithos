import { describe, it, expect } from "vitest";
import { isSome, isNone } from "@zygos/option";
import { createHistory } from "./memento";

describe("createHistory", () => {
  it("starts with initial state", () => {
    const history = createHistory({ count: 0 });

    expect(history.current()).toEqual({ count: 0 });
  });

  it("pushes new states", () => {
    const history = createHistory({ count: 0 });

    history.push({ count: 1 });
    history.push({ count: 2 });

    expect(history.current()).toEqual({ count: 2 });
  });

  it("undoes to previous state", () => {
    const history = createHistory({ count: 0 });
    history.push({ count: 1 });
    history.push({ count: 2 });

    const result = history.undo();

    expect(isSome(result)).toBe(true);
    if (isSome(result)) {
      expect(result.value).toEqual({ count: 1 });
    }
    expect(history.current()).toEqual({ count: 1 });
  });

  it("redoes to next state", () => {
    const history = createHistory({ count: 0 });
    history.push({ count: 1 });
    history.undo();

    const result = history.redo();

    expect(isSome(result)).toBe(true);
    if (isSome(result)) {
      expect(result.value).toEqual({ count: 1 });
    }
    expect(history.current()).toEqual({ count: 1 });
  });

  it("returns None when undo not possible", () => {
    const history = createHistory({ count: 0 });

    const result = history.undo();

    expect(isNone(result)).toBe(true);
  });

  it("returns None when redo not possible", () => {
    const history = createHistory({ count: 0 });

    const result = history.redo();

    expect(isNone(result)).toBe(true);
  });

  it("clears redo stack on push", () => {
    const history = createHistory({ count: 0 });
    history.push({ count: 1 });
    history.push({ count: 2 });
    history.undo();

    expect(history.canRedo()).toBe(true);

    history.push({ count: 10 });

    expect(history.canRedo()).toBe(false);
    expect(history.current()).toEqual({ count: 10 });
  });

  it("reports canUndo correctly", () => {
    const history = createHistory({ count: 0 });

    expect(history.canUndo()).toBe(false);

    history.push({ count: 1 });

    expect(history.canUndo()).toBe(true);
  });

  it("reports canRedo correctly", () => {
    const history = createHistory({ count: 0 });
    history.push({ count: 1 });

    expect(history.canRedo()).toBe(false);

    history.undo();

    expect(history.canRedo()).toBe(true);
  });

  it("returns history with timestamps", () => {
    const history = createHistory({ count: 0 });
    history.push({ count: 1 });

    const snapshots = history.history();

    expect(snapshots).toHaveLength(2);
    expect(snapshots[0].state).toEqual({ count: 0 });
    expect(snapshots[1].state).toEqual({ count: 1 });
    expect(typeof snapshots[0].timestamp).toBe("number");
  });

  it("clears history keeping current state", () => {
    const history = createHistory({ count: 0 });
    history.push({ count: 1 });
    history.push({ count: 2 });

    history.clear();

    expect(history.current()).toEqual({ count: 2 });
    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(false);
    expect(history.history()).toHaveLength(1);
  });
});

describe("memento real-world usage", () => {
  it("text editor undo/redo", () => {
    type EditorState = { content: string; cursor: number };

    const history = createHistory<EditorState>({ content: "", cursor: 0 });

    // User types
    history.push({ content: "H", cursor: 1 });
    history.push({ content: "He", cursor: 2 });
    history.push({ content: "Hel", cursor: 3 });
    history.push({ content: "Hell", cursor: 4 });
    history.push({ content: "Hello", cursor: 5 });

    expect(history.current().content).toBe("Hello");

    // Undo twice
    history.undo();
    history.undo();

    expect(history.current().content).toBe("Hel");

    // Redo once
    history.redo();

    expect(history.current().content).toBe("Hell");

    // Type something new (clears redo)
    history.push({ content: "Help", cursor: 4 });

    expect(history.current().content).toBe("Help");
    expect(history.canRedo()).toBe(false);
  });
});
