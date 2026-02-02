import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { stubArray } from "./stubArray";

describe("stubArray", () => {
  it("returns empty array", () => {
    expect(stubArray()).toEqual([]);
  });

  it("[🎯] returns new array each call", () => {
    expect(stubArray()).not.toBe(stubArray());
  });

  itProp.prop([fc.integer({ min: 1, max: 100 })])(
    "[🎲] always returns empty array regardless of calls",
    (n) => {
      for (let i = 0; i < n; i++) {
        expect(stubArray()).toEqual([]);
      }
    }
  );
});
