import { describe, it, expect } from "vitest";
import { isEqual } from "./is-equal";

describe("isEqual", () => {
  describe("primitives and identity", () => {
    it("should return true for identical references", () => {
      const obj = { a: 1 };
      expect(isEqual(obj, obj)).toBe(true);
    });

    it("should return true for NaN (SameValueZero)", () => {
      expect(isEqual(NaN, NaN)).toBe(true);
    });

    it("should return true for equal primitives", () => {
      expect(isEqual(42, 42)).toBe(true);
      expect(isEqual("abc", "abc")).toBe(true);
    });

    it("should return false for different primitives", () => {
      expect(isEqual(1, 2)).toBe(false);
      expect(isEqual("a", "b")).toBe(false);
    });
  });

  describe("null handling", () => {
    it("should return true for null vs null", () => {
      expect(isEqual(null, null)).toBe(true);
    });

    it("should return false for null vs object", () => {
      expect(isEqual(null, {})).toBe(false);
      expect(isEqual({}, null)).toBe(false);
    });
  });

  describe("Date", () => {
    it("should return true for same dates", () => {
      expect(isEqual(new Date("2024-01-01"), new Date("2024-01-01"))).toBe(true);
    });

    it("should return false for different dates", () => {
      expect(isEqual(new Date("2024-01-01"), new Date("2024-01-02"))).toBe(false);
    });
  });

  describe("RegExp", () => {
    it("should return true for same pattern and flags", () => {
      expect(isEqual(/abc/gi, /abc/gi)).toBe(true);
    });

    it("should return false for different source or flags", () => {
      expect(isEqual(/abc/, /def/)).toBe(false);
      expect(isEqual(/abc/i, /abc/g)).toBe(false);
    });
  });

  describe("Map", () => {
    it("should return true for equal Maps", () => {
      expect(isEqual(new Map([["a", 1]]), new Map([["a", 1]]))).toBe(true);
    });

    it("should return false for different size", () => {
      expect(isEqual(new Map([["a", 1]]), new Map())).toBe(false);
      expect(isEqual(new Map(), new Map([["a", 1]]))).toBe(false);
    });

    it("should return false for missing key or different value", () => {
      expect(isEqual(new Map([["a", 1]]), new Map([["b", 1]]))).toBe(false);
      expect(isEqual(new Map([["a", 1]]), new Map([["a", 2]]))).toBe(false);
    });
  });

  describe("Set", () => {
    it("should return true for equal Sets", () => {
      expect(isEqual(new Set([1, 2]), new Set([1, 2]))).toBe(true);
    });

    it("should return false for different size", () => {
      expect(isEqual(new Set([1]), new Set([1, 2]))).toBe(false);
      expect(isEqual(new Set(), new Set([1]))).toBe(false);
    });

    it("should return false for missing element", () => {
      expect(isEqual(new Set([1]), new Set([2]))).toBe(false);
    });
  });

  describe("Array", () => {
    it("should return true for equal arrays", () => {
      expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    });

    it("should return false for different length", () => {
      expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
    });

    it("should return false for different elements", () => {
      expect(isEqual([1, 2], [1, 3])).toBe(false);
    });

    it("should return false for array vs array-like object", () => {
      expect(isEqual([1], { 0: 1, length: 1 })).toBe(false);
    });
  });

  describe("Object", () => {
    it("should return true for equal objects", () => {
      expect(isEqual({ a: 1 }, { a: 1 })).toBe(true);
    });

    it("should return false for different key count", () => {
      expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it("should return false for missing key", () => {
      expect(isEqual({ a: 1 }, { b: 1 })).toBe(false);
    });

    it("should return false for different values", () => {
      expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
    });

    it("should return false for object vs primitive", () => {
      expect(isEqual({}, 1)).toBe(false);
      expect(isEqual(1, {})).toBe(false);
      expect(isEqual({}, null)).toBe(false);
      expect(isEqual({}, undefined)).toBe(false);
    });
  });

  describe("mixed types", () => {
    it("should return false for Date vs Object", () => {
      expect(isEqual(new Date(), {})).toBe(false);
      expect(isEqual({}, new Date())).toBe(false);
    });

    it("should return false for RegExp vs Object", () => {
      expect(isEqual(/abc/, {})).toBe(false);
      expect(isEqual({}, /abc/)).toBe(false);
    });

    it("should return false for Map vs Object", () => {
      expect(isEqual(new Map(), {})).toBe(false);
      expect(isEqual({}, new Map())).toBe(false);
    });

    it("should return false for Set vs Object", () => {
      expect(isEqual(new Set(), {})).toBe(false);
      expect(isEqual({}, new Set())).toBe(false);
    });

    it("should return false for Array vs Object (exact keys)", () => {
      expect(isEqual([1], { 0: 1 })).toBe(false);
    });
  });

  describe("nested structures", () => {
    it("should compare deeply nested objects", () => {
      expect(isEqual({ a: { b: 2 } }, { a: { b: 2 } })).toBe(true);
      expect(isEqual({ a: { b: 2 } }, { a: { b: 3 } })).toBe(false);
    });

    it("should compare nested arrays", () => {
      expect(isEqual([[1], [2]], [[1], [2]])).toBe(true);
    });
  });

  describe("circular references", () => {
    it("should handle circular references", () => {
      const a: Record<string, unknown> = { x: 1 };
      a.self = a;
      const b: Record<string, unknown> = { x: 1 };
      b.self = b;
      expect(isEqual(a, b)).toBe(true);
    });

    it("should detect different circular structures", () => {
      const a: Record<string, unknown> = { x: 1 };
      a.self = a;
      const b: Record<string, unknown> = { x: 1 };
      const c: Record<string, unknown> = { x: 1 };
      b.self = c;
      c.self = b;
      expect(isEqual(a, b)).toBe(false);
    });
  });

  it("[🎯] Set matching prevents double-matching same element", () => {
    const set1 = new Set([{ a: 1 }, { a: 1 }]);
    const set2 = new Set([{ a: 1 }, { a: 2 }]);
    expect(isEqual(set1, set2)).toBe(false);
    expect(isEqual(set1, set2)).toBe(false);
  });

  it("[👾] nested null vs object returns false in deep comparison", () => {
    // Exercises isEqualDeep guard: value === null, other is object
    expect(isEqual({ a: null }, { a: {} })).toBe(false);
    expect(isEqual({ a: {} }, { a: null })).toBe(false);
  });

  it("[👾] nested primitive vs object returns false in deep comparison", () => {
    // Exercises isEqualDeep guard: typeof value !== "object"
    expect(isEqual({ a: 1 }, { a: {} })).toBe(false);
    expect(isEqual({ a: {} }, { a: 1 })).toBe(false);
  });

  it("[👾] nested string vs object returns false in deep comparison", () => {
    // Exercises isEqualDeep guard: typeof other !== "object"
    expect(isEqual({ a: "x" }, { a: {} })).toBe(false);
    expect(isEqual({ a: {} }, { a: "x" })).toBe(false);
  });

});
