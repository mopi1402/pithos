import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { stubFalse } from "./stubFalse";

describe("stubFalse", () => {
  it("returns false", () => {
    expect(stubFalse()).toBe(false);
  });

  itProp.prop([fc.integer({ min: 1, max: 100 })])(
    "[🎲] always returns false regardless of calls",
    (n) => {
      for (let i = 0; i < n; i++) {
        expect(stubFalse()).toBe(false);
      }
    }
  );
});
