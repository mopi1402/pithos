import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { stubString } from "./stubString";

describe("stubString", () => {
  it("returns empty string", () => {
    expect(stubString()).toBe("");
  });

  itProp.prop([fc.integer({ min: 1, max: 100 })])(
    "[🎲] always returns empty string regardless of calls",
    (n) => {
      for (let i = 0; i < n; i++) {
        expect(stubString()).toBe("");
      }
    }
  );
});
