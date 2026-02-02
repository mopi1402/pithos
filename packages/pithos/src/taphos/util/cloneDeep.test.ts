import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { cloneDeep } from "./cloneDeep";

describe("cloneDeep", () => {
  it("should be a wrapper of structuredClone", () => {
    expect(cloneDeep).not.toBe(structuredClone);
    
    const original = { a: 1, b: { c: 2 } };
    
    const cloned = cloneDeep(original);
    const nativeCloned = structuredClone(original);
    
    expect(cloned).toEqual(nativeCloned);
    expect(cloned).not.toBe(original);
    expect(cloned.b).not.toBe(original.b);
    
    cloned.b.c = 3;
    expect(original.b.c).toBe(2);
    expect(cloned.b.c).toBe(3);
  });

  itProp.prop([fc.jsonValue()])(
    "[🎲] cloned value equals original but is not same reference",
    (value) => {
      if (typeof value === "object" && value !== null) {
        const cloned = cloneDeep(value);
        expect(cloned).toEqual(value);
        expect(cloned).not.toBe(value);
      }
    }
  );

  itProp.prop([fc.record({ a: fc.integer(), b: fc.string() })])(
    "[🎲] modifications to clone do not affect original",
    (obj) => {
      const original = { ...obj };
      const cloned = cloneDeep(obj);
      cloned.a = 999;
      expect(obj.a).toBe(original.a);
    }
  );
});
