import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { stubTrue } from "./stubTrue";

describe("stubTrue", () => {
  it("returns true", () => {
    expect(stubTrue()).toBe(true);
  });

  itProp.prop([fc.integer({ min: 1, max: 100 })])(
    "[🎲] always returns true regardless of calls",
    (n) => {
      for (let i = 0; i < n; i++) {
        expect(stubTrue()).toBe(true);
      }
    }
  );
});
