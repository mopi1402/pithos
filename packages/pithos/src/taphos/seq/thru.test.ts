import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { thru } from "./thru";

describe("thru", () => {
  it("returns result of interceptor", () => {
    expect(thru([1, 2, 3], (arr) => arr.map((n) => n * 2))).toEqual([2, 4, 6]);
  });

  it("passes value to interceptor", () => {
    expect(thru(5, (n) => n * 2)).toBe(10);
  });

  it("[🎯] can transform type", () => {
    expect(thru(42, (n) => String(n))).toBe("42");
  });

  itProp.prop([fc.integer()])(
    "[🎲] returns interceptor result",
    (n) => {
      const result = thru(n, (v) => v * 2);
      expect(result).toBe(n * 2);
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] can transform string to length",
    (s) => {
      const result = thru(s, (v) => v.length);
      expect(result).toBe(s.length);
    }
  );
});
