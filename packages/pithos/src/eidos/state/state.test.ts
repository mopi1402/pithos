import { describe, it, expect } from "vitest";
import { isSome, isNone } from "@zygos/option";
import { createMachine } from "./state";

// --- simple machine (no context) ---

describe("createMachine (no context)", () => {
  const _light = createMachine(
    {
      green: { timer: { to: "yellow" } },
      yellow: { timer: { to: "red" } },
      red: { timer: { to: "green" } },
    },
    "green",
  );

  it("starts in initial state", () => {
    const m = createMachine(
      { a: { go: { to: "b" } }, b: {} },
      "a",
    );
    expect(m.current()).toBe("a");
  });

  it("transitions on send", () => {
    const m = createMachine(
      { a: { go: { to: "b" } }, b: {} },
      "a",
    );
    expect(m.send("go")).toBe("b");
    expect(m.current()).toBe("b");
  });

  it("stays in state if event not defined", () => {
    const m = createMachine(
      { a: { go: { to: "b" } }, b: {} },
      "a",
    );
    expect(m.send("unknown" as "go")).toBe("a");
  });

  it("matches checks current state", () => {
    const m = createMachine(
      { a: { go: { to: "b" } }, b: {} },
      "a",
    );
    expect(m.matches("a")).toBe(true);
    expect(m.matches("b")).toBe(false);
    m.send("go");
    expect(m.matches("b")).toBe(true);
  });

  it("trySend returns Some on valid transition", () => {
    const m = createMachine(
      { a: { go: { to: "b" } }, b: {} },
      "a",
    );
    const result = m.trySend("go");
    expect(isSome(result)).toBe(true);
  });

  it("trySend returns None on invalid transition", () => {
    const m = createMachine(
      { a: { go: { to: "b" } }, b: {} },
      "a",
    );
    const result = m.trySend("unknown" as "go");
    expect(isNone(result)).toBe(true);
  });

  it("reset returns to initial state", () => {
    const m = createMachine(
      { a: { go: { to: "b" } }, b: {} },
      "a",
    );
    m.send("go");
    expect(m.current()).toBe("b");
    m.reset();
    expect(m.current()).toBe("a");
  });

  it("onTransition fires on each transition", () => {
    const m = createMachine(
      { a: { go: { to: "b" } }, b: { back: { to: "a" } } },
      "a",
    );
    const calls: [string, string, string][] = [];
    const unsubscribe = m.onTransition((from, event, to) => calls.push([from, event, to]));

    m.send("go");
    m.send("back");

    expect(calls).toEqual([
      ["a", "go", "b"],
      ["b", "back", "a"],
    ]);

    // Test unsubscribe
    unsubscribe();
    m.send("go");
    expect(calls.length).toBe(2); // No new calls after unsubscribe
  });
});


// --- machine with context ---

describe("createMachine (with context)", () => {
  it("exposes context()", () => {
    const m = createMachine(
      { active: { inc: { to: "active", update: (n: number) => n + 1 } } },
      "active",
      0,
    );
    expect(m.context()).toBe(0);
  });

  it("updates context on transition", () => {
    const m = createMachine(
      { active: { inc: { to: "active", update: (n: number) => n + 1 } } },
      "active",
      0,
    );
    m.send("inc");
    expect(m.context()).toBe(1);
    m.send("inc");
    expect(m.context()).toBe(2);
  });

  it("reset restores initial context", () => {
    const m = createMachine(
      { active: { inc: { to: "active", update: (n: number) => n + 1 } } },
      "active",
      0,
    );
    m.send("inc");
    m.send("inc");
    expect(m.context()).toBe(2);
    m.reset();
    expect(m.context()).toBe(0);
  });

  it("simple transitions work with context machines", () => {
    const m = createMachine(
      {
        idle: { start: { to: "running" } },
        running: { stop: { to: "idle" }, tick: { to: "running", update: (n: number) => n + 1 } },
      },
      "idle",
      0,
    );
    m.send("start");
    expect(m.current()).toBe("running");
    expect(m.context()).toBe(0);
    m.send("tick");
    expect(m.context()).toBe(1);
  });
});


// --- Mutation tests ---

describe("mutation tests", () => {
  it("[👾] machine without context does not expose context()", () => {
    const m = createMachine(
      { a: { go: { to: "b" } }, b: {} },
      "a",
    );

    expect("context" in m).toBe(false);
  });

  it("[👾] machine with context exposes context()", () => {
    const m = createMachine(
      { a: {} },
      "a",
      42,
    );

    expect("context" in m).toBe(true);
    expect(m.context()).toBe(42);
  });
});
