import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { head } from "./head";
import { first } from "./first";

describe("head", () => {
  it("should be a wrapper of first function", () => {
    expect(head).not.toBe(first);
    
    const array = [1, 2, 3, 4, 5];
    expect(head(array)).toBe(first(array));
    expect(head(array)).toBe(1);
    
    const empty: number[] = [];
    expect(head(empty)).toBe(first(empty));
    expect(head(empty)).toBeUndefined();
  });

  itProp.prop([fc.array(fc.anything(), { minLength: 1 })])(
    "[🎲] head returns first element",
    (arr) => {
      expect(head(arr)).toBe(arr[0]);
    }
  );

  it("[🎯] returns undefined for empty array", () => {
    expect(head([])).toBeUndefined();
  });
});
