import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { stubObject } from "./stubObject";

describe("stubObject", () => {
  it("returns empty object", () => {
    expect(stubObject()).toEqual({});
  });

  it("[🎯] returns new object each call", () => {
    expect(stubObject()).not.toBe(stubObject());
  });

  itProp.prop([fc.integer({ min: 1, max: 100 })])(
    "[🎲] always returns empty object regardless of calls",
    (n) => {
      for (let i = 0; i < n; i++) {
        expect(stubObject()).toEqual({});
      }
    }
  );
});
