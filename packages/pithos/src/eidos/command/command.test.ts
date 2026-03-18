import { describe, it, expect } from "vitest";
import {
  type Command,
  undoable,
  createCommandStack,
  safeExecute,
  undoableState,
  createReactiveCommandStack,
} from "./command";

// --- Command type ---

describe("Command type", () => {
  it("is just a thunk", () => {
    let called = false;
    const cmd: Command = () => { called = true; };

    cmd();

    expect(called).toBe(true);
  });
});

// --- undoable ---

describe("undoable", () => {
  it("pairs execute and undo", () => {
    let value = 0;
    const cmd = undoable(() => { value += 10; }, () => { value -= 10; });

    cmd.execute();
    expect(value).toBe(10);

    cmd.undo();
    expect(value).toBe(0);
  });

  it("captures context via closure", () => {
    const items: string[] = [];

    const addHello = undoable(
      () => { items.push("hello"); },
      () => { items.pop(); },
    );

    addHello.execute();
    expect(items).toEqual(["hello"]);

    addHello.undo();
    expect(items).toEqual([]);
  });
});

// --- createCommandStack ---

describe("createCommandStack", () => {
  it("executes commands and tracks history", () => {
    let value = 0;
    const stack = createCommandStack();

    stack.execute(undoable(() => { value += 1; }, () => { value -= 1; }));
    stack.execute(undoable(() => { value += 1; }, () => { value -= 1; }));

    expect(value).toBe(2);
    expect(stack.canUndo).toBe(true);
  });

  it("undoes commands in reverse order", () => {
    let value = 0;
    const stack = createCommandStack();

    stack.execute(undoable(() => { value += 10; }, () => { value -= 10; }));
    stack.execute(undoable(() => { value *= 2; }, () => { value /= 2; }));
    // value = 20

    stack.undo(); // undo *2
    expect(value).toBe(10);

    stack.undo(); // undo +10
    expect(value).toBe(0);
  });

  it("redo re-executes undone commands", () => {
    let value = 0;
    const stack = createCommandStack();

    stack.execute(undoable(() => { value += 5; }, () => { value -= 5; }));
    stack.undo();
    expect(value).toBe(0);

    stack.redo();
    expect(value).toBe(5);
  });

  it("undo returns false when nothing to undo", () => {
    const stack = createCommandStack();

    expect(stack.undo()).toBe(false);
    expect(stack.canUndo).toBe(false);
  });

  it("redo returns false when nothing to redo", () => {
    const stack = createCommandStack();

    expect(stack.redo()).toBe(false);
    expect(stack.canRedo).toBe(false);
  });

  it("execute clears redo stack", () => {
    const stack = createCommandStack();

    stack.execute(undoable(() => {}, () => {}));
    stack.undo();
    expect(stack.canRedo).toBe(true);

    // New command clears redo
    stack.execute(undoable(() => {}, () => {}));
    expect(stack.canRedo).toBe(false);
  });

  it("clear removes all history", () => {
    const stack = createCommandStack();

    stack.execute(undoable(() => {}, () => {}));
    stack.execute(undoable(() => {}, () => {}));
    stack.undo();

    stack.clear();

    expect(stack.canUndo).toBe(false);
    expect(stack.canRedo).toBe(false);
  });
});

// --- safeExecute (zygos integration) ---

describe("safeExecute", () => {
  it("returns Ok on success", () => {
    let called = false;
    const result = safeExecute(() => { called = true; });

    expect(result.isOk()).toBe(true);
    expect(called).toBe(true);
  });

  it("returns Err when command throws", () => {
    const result = safeExecute(() => { throw new Error("boom"); });

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toBe("boom");
    }
  });

  it("wraps non-Error throws", () => {
    const result = safeExecute(() => { throw "string error"; });

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe("string error");
    }
  });
});

// --- Mutation tests ---

describe("mutation tests", () => {
  it("[👾] undo returns true when successful", () => {
    const stack = createCommandStack();
    stack.execute(undoable(() => {}, () => {}));

    expect(stack.undo()).toBe(true);
  });

  it("[👾] redo returns true when successful", () => {
    const stack = createCommandStack();
    stack.execute(undoable(() => {}, () => {}));
    stack.undo();

    expect(stack.redo()).toBe(true);
  });
});


// --- undoableState ---

describe("undoableState", () => {
  it("pairs pure execute and undo transforms", () => {
    interface Counter { value: number }

    const increment = undoableState<Counter>(
      (s) => ({ ...s, value: s.value + 1 }),
      (s) => ({ ...s, value: s.value - 1 }),
    );

    const state = { value: 0 };
    const next = increment.execute(state);
    expect(next).toEqual({ value: 1 });
    expect(state).toEqual({ value: 0 }); // original unchanged

    const prev = increment.undo(next);
    expect(prev).toEqual({ value: 0 });
  });
});

// --- createReactiveCommandStack ---

describe("createReactiveCommandStack", () => {
  interface Counter { value: number }

  const increment = undoableState<Counter>(
    (s) => ({ ...s, value: s.value + 1 }),
    (s) => ({ ...s, value: s.value - 1 }),
  );

  const double = undoableState<Counter>(
    (s) => ({ ...s, value: s.value * 2 }),
    (s) => ({ ...s, value: s.value / 2 }),
  );

  it("executes commands and notifies onChange", () => {
    let notified: Counter | null = null;
    const stack = createReactiveCommandStack<Counter>({
      initial: { value: 0 },
      onChange: (s) => { notified = s; },
    });

    stack.execute(increment);
    expect(stack.state).toEqual({ value: 1 });
    expect(notified).toEqual({ value: 1 });

    stack.execute(increment);
    expect(stack.state).toEqual({ value: 2 });
    expect(notified).toEqual({ value: 2 });
  });

  it("undoes commands in reverse order", () => {
    let notified: Counter | null = null;
    const stack = createReactiveCommandStack<Counter>({
      initial: { value: 0 },
      onChange: (s) => { notified = s; },
    });

    stack.execute(increment); // 1
    stack.execute(double);    // 2

    stack.undo(); // undo *2 → 1
    expect(stack.state).toEqual({ value: 1 });
    expect(notified).toEqual({ value: 1 });

    stack.undo(); // undo +1 → 0
    expect(stack.state).toEqual({ value: 0 });
    expect(notified).toEqual({ value: 0 });
  });

  it("redo re-executes undone commands", () => {
    let notified: Counter | null = null;
    const stack = createReactiveCommandStack<Counter>({
      initial: { value: 0 },
      onChange: (s) => { notified = s; },
    });

    stack.execute(increment);
    stack.undo();
    expect(stack.state).toEqual({ value: 0 });

    stack.redo();
    expect(stack.state).toEqual({ value: 1 });
    expect(notified).toEqual({ value: 1 });
  });

  it("undo returns false when nothing to undo", () => {
    const stack = createReactiveCommandStack<Counter>({
      initial: { value: 0 },
      onChange: () => {},
    });

    expect(stack.undo()).toBe(false);
    expect(stack.canUndo).toBe(false);
  });

  it("redo returns false when nothing to redo", () => {
    const stack = createReactiveCommandStack<Counter>({
      initial: { value: 0 },
      onChange: () => {},
    });

    expect(stack.redo()).toBe(false);
    expect(stack.canRedo).toBe(false);
  });

  it("execute clears redo stack", () => {
    const stack = createReactiveCommandStack<Counter>({
      initial: { value: 0 },
      onChange: () => {},
    });

    stack.execute(increment);
    stack.undo();
    expect(stack.canRedo).toBe(true);

    stack.execute(double);
    expect(stack.canRedo).toBe(false);
  });

  it("clear resets to initial state and notifies", () => {
    let notified: Counter | null = null;
    const stack = createReactiveCommandStack<Counter>({
      initial: { value: 0 },
      onChange: (s) => { notified = s; },
    });

    stack.execute(increment);
    stack.execute(increment);
    stack.undo();

    stack.clear();

    expect(stack.state).toEqual({ value: 0 });
    expect(stack.canUndo).toBe(false);
    expect(stack.canRedo).toBe(false);
    expect(notified).toEqual({ value: 0 });
  });

  it("[👾] canUndo returns true after execute", () => {
    const stack = createReactiveCommandStack<Counter>({
      initial: { value: 0 },
      onChange: () => {},
    });
    stack.execute(increment);

    expect(stack.canUndo).toBe(true);
  });

  it("[👾] undo returns true when successful", () => {
    const stack = createReactiveCommandStack<Counter>({
      initial: { value: 0 },
      onChange: () => {},
    });
    stack.execute(increment);

    expect(stack.undo()).toBe(true);
  });

  it("[👾] redo returns true when successful", () => {
    const stack = createReactiveCommandStack<Counter>({
      initial: { value: 0 },
      onChange: () => {},
    });
    stack.execute(increment);
    stack.undo();

    expect(stack.redo()).toBe(true);
  });
});
