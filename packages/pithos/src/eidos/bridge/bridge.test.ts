import { describe, it, expect } from "vitest";
import {
  createBridge,
  composeBridges,
  type Bridge,
} from "./bridge";

// --- createBridge ---

describe("createBridge", () => {
  type Renderer = {
    drawCircle: (x: number, y: number, r: number) => string;
    drawRect: (x: number, y: number, w: number, h: number) => string;
  };

  const shapes = createBridge((impl: Renderer) => ({
    icon: (x: number, y: number) =>
      `${impl.drawCircle(x, y, 10)}+${impl.drawRect(x, y, 5, 5)}`,
    dot: (x: number, y: number) => impl.drawCircle(x, y, 2),
  }));

  const svgRenderer: Renderer = {
    drawCircle: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}"/>`,
    drawRect: (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`,
  };

  const asciiRenderer: Renderer = {
    drawCircle: (x, y, r) => `O(${x},${y},${r})`,
    drawRect: (x, y, w, h) => `[${x},${y},${w}x${h}]`,
  };

  it("creates abstraction from implementation", () => {
    const svg = shapes(svgRenderer);

    expect(svg.dot(10, 20)).toBe('<circle cx="10" cy="20" r="2"/>');
  });

  it("same abstraction works with different implementations", () => {
    const svg = shapes(svgRenderer);
    const ascii = shapes(asciiRenderer);

    expect(svg.dot(5, 5)).toBe('<circle cx="5" cy="5" r="2"/>');
    expect(ascii.dot(5, 5)).toBe("O(5,5,2)");
  });

  it("abstraction combines primitives", () => {
    const ascii = shapes(asciiRenderer);

    expect(ascii.icon(0, 0)).toBe("O(0,0,10)+[0,0,5x5]");
  });

  it("implementations are independent", () => {
    const svg = shapes(svgRenderer);
    const ascii = shapes(asciiRenderer);

    // Each has its own implementation, no shared state
    expect(svg.icon(1, 2)).toContain("<circle");
    expect(ascii.icon(1, 2)).toContain("O(");
  });
});

// --- Bridge type ---

describe("Bridge type", () => {
  it("is a function from implementation to abstraction", () => {
    type Impl = { add: (a: number, b: number) => number };
    type Abs = { sum: (nums: number[]) => number };

    const bridge: Bridge<Impl, Abs> = (impl) => ({
      sum: (nums) => nums.reduce((a, b) => impl.add(a, b), 0),
    });

    const abs = bridge({ add: (a, b) => a + b });
    expect(abs.sum([1, 2, 3])).toBe(6);
  });
});

// --- composeBridges ---

describe("composeBridges", () => {
  type Low = { raw: (s: string) => string };
  type Mid = { wrap: (s: string) => string };
  type _High = { format: (s: string) => string };

  const lowToMid = createBridge((low: Low) => ({
    wrap: (s: string) => `[${low.raw(s)}]`,
  }));

  const midToHigh = createBridge((mid: Mid) => ({
    format: (s: string) => mid.wrap(s).toUpperCase(),
  }));

  it("composes two bridges into one", () => {
    const composed = composeBridges(lowToMid, midToHigh);
    const high = composed({ raw: (s) => s });

    expect(high.format("hello")).toBe("[HELLO]");
  });

  it("preserves implementation independence", () => {
    const composed = composeBridges(lowToMid, midToHigh);

    const impl1 = composed({ raw: (s) => s.toLowerCase() });
    const impl2 = composed({ raw: (s) => s.toUpperCase() });

    expect(impl1.format("Test")).toBe("[TEST]");
    expect(impl2.format("Test")).toBe("[TEST]");
  });
});



// --- Mutation tests ---

describe("mutation tests", () => {
  it("[👾] createBridge returns the factory function", () => {
    const factory = (impl: { x: number }) => ({ doubled: impl.x * 2 });
    const bridge = createBridge(factory);

    // The bridge should be the same function as factory
    expect(bridge({ x: 5 })).toEqual({ doubled: 10 });
  });
});
