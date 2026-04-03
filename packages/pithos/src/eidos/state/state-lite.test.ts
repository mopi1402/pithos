import { describe, it, expect } from "vitest";
import { createLiteMachine } from "./state-lite";

describe("createLiteMachine (no context)", () => {
  it("starts in initial state", () => {
    const m = createLiteMachine(
      { a: { go: { to: "b" } }, b: {} },
      "a",
    );
    expect(m.current()).toBe("a");
  });

  it("transitions on send", () => {
    const m = createLiteMachine(
      { a: { go: { to: "b" } }, b: {} },
      "a",
    );
    expect(m.send("go")).toBe("b");
    expect(m.current()).toBe("b");
  });

  it("stays in state if event not defined", () => {
    const m = createLiteMachine(
      { a: { go: { to: "b" } }, b: {} },
      "a",
    );
    expect(m.send("unknown" as "go")).toBe("a");
  });

  it("matches checks current state", () => {
    const m = createLiteMachine(
      { a: { go: { to: "b" } }, b: {} },
      "a",
    );
    expect(m.matches("a")).toBe(true);
    expect(m.matches("b")).toBe(false);
    m.send("go");
    expect(m.matches("b")).toBe(true);
  });

  it("reset returns to initial state", () => {
    const m = createLiteMachine(
      { a: { go: { to: "b" } }, b: {} },
      "a",
    );
    m.send("go");
    expect(m.current()).toBe("b");
    m.reset();
    expect(m.current()).toBe("a");
  });

  it("onTransition fires on each transition", () => {
    const m = createLiteMachine(
      { a: { go: { to: "b" } }, b: { back: { to: "a" } } },
      "a",
    );
    const calls: [string, string, string][] = [];
    const unsub = m.onTransition((from, event, to) => calls.push([from, event, to]));

    m.send("go");
    m.send("back");

    expect(calls).toEqual([
      ["a", "go", "b"],
      ["b", "back", "a"],
    ]);

    unsub();
    m.send("go");
    expect(calls).toHaveLength(2);
  });
});

describe("createLiteMachine (with context)", () => {
  it("tracks context through transitions", () => {
    const m = createLiteMachine(
      {
        active: {
          increment: { to: "active" as const, update: (ctx: number) => ctx + 1 },
          reset: { to: "active" as const, update: () => 0 },
        },
      },
      "active",
      0,
    );

    m.send("increment");
    m.send("increment");
    expect(m.context()).toBe(2);

    m.send("reset");
    expect(m.context()).toBe(0);
  });

  it("reset restores initial context", () => {
    const m = createLiteMachine(
      {
        on: { inc: { to: "on" as const, update: (n: number) => n + 1 } },
      },
      "on",
      10,
    );

    m.send("inc");
    m.send("inc");
    expect(m.context()).toBe(12);

    m.reset();
    expect(m.context()).toBe(10);
    expect(m.current()).toBe("on");
  });

  it("simple transitions work with context machines", () => {
    const m = createLiteMachine(
      {
        idle: { start: { to: "running" as const } },
        running: {
          stop: { to: "idle" as const },
          tick: { to: "running" as const, update: (n: number) => n + 1 },
        },
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

describe("mutation tests", () => {
  it("[👾] machine without context does not expose context()", () => {
    const m = createLiteMachine(
      { a: { go: { to: "b" } }, b: {} },
      "a",
    );
    expect("context" in m).toBe(false);
  });

  it("[👾] machine with context exposes context()", () => {
    const m = createLiteMachine(
      { a: {} },
      "a",
      42,
    );
    expect("context" in m).toBe(true);
    expect(m.context()).toBe(42);
  });
});
