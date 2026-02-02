import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { eq } from "./eq";

describe("eq", () => {
  it("compares equal values", () => {
    expect(eq(1, 1)).toBe(true);
    expect(eq("a", "a")).toBe(true);
  });

  it("compares unequal values", () => {
    expect(eq(1, 2)).toBe(false);
    expect(eq("a", "b")).toBe(false);
  });

  it("[🎯] handles NaN comparison", () => {
    expect(eq(NaN, NaN)).toBe(true);
  });

  it("[🎯] handles -0 and +0", () => {
    expect(eq(0, -0)).toBe(true);
  });

  it("[🎯] compares objects by reference", () => {
    const obj = { a: 1 };
    expect(eq(obj, obj)).toBe(true);
    expect(eq({ a: 1 }, { a: 1 })).toBe(false);
  });

  itProp.prop([fc.integer()])(
    "[🎲] integer equals itself",
    (n) => {
      expect(eq(n, n)).toBe(true);
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] string equals itself",
    (s) => {
      expect(eq(s, s)).toBe(true);
    }
  );

  itProp.prop([fc.integer(), fc.integer()])(
    "[🎲] is equivalent to Object.is",
    (a, b) => {
      expect(eq(a, b)).toBe(Object.is(a, b));
    }
  );
});
