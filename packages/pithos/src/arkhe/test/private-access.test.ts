import { describe, it, expect } from "vitest";
import {
  cast,
  castArray,
  castMap,
  testNull,
  testUndefined,
} from "./private-access";

describe("private-access", () => {
  describe("cast", () => {
    it("casts object to target type", () => {
      const obj = { secret: 42 };
      const result = cast<{ secret: number }>(obj);
      expect(result.secret).toBe(42);
    });

    it("defaults to any when no type provided", () => {
      const obj = { a: 1 };
      const result = cast(obj);
      expect(result.a).toBe(1);
    });

    it("casts primitives", () => {
      expect(cast<number>("123" as unknown)).toBe("123");
    });
  });

  describe("castArray", () => {
    it("casts to typed array", () => {
      const obj = [1, 2, 3];
      const result = castArray<number>(obj);
      expect(result).toEqual([1, 2, 3]);
    });

    it("defaults to any array", () => {
      const result = castArray([{ x: 1 }]);
      expect(result[0].x).toBe(1);
    });
  });

  describe("castMap", () => {
    it("casts to Map", () => {
      const map = new Map([["a", 1]]);
      const result = castMap<string, number>(map);
      expect(result.get("a")).toBe(1);
    });
  });

  describe("testNull", () => {
    it("is null", () => {
      expect(testNull).toBeNull();
    });
  });

  describe("testUndefined", () => {
    it("is undefined", () => {
      expect(testUndefined).toBeUndefined();
    });
  });

  describe("cast", () => {
    it("[🎯] casts null", () => {
      const result = cast<null>(null);
      expect(result).toBeNull();
    });

    it("[🎯] casts undefined", () => {
      const result = cast<undefined>(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe("castArray", () => {
    it("[🎯] casts empty array", () => {
      const result = castArray<number>([]);
      expect(result).toEqual([]);
    });
  });

  describe("castMap", () => {
    it("[🎯] casts empty Map", () => {
      const map = new Map();
      const result = castMap<string, number>(map);
      expect(result.size).toBe(0);
    });
  });
});
