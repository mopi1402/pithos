import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { mergeWith } from "./merge-with";

describe("mergeWith", () => {
  it("merges with array concatenation customizer", () => {
    const result = mergeWith(
      { items: [1, 2] },
      { items: [3, 4] },
      (objValue, srcValue) => {
        if (Array.isArray(objValue) && Array.isArray(srcValue)) {
          return objValue.concat(srcValue);
        }
        return undefined;
      }
    );

    expect(result).toEqual({ items: [1, 2, 3, 4] });
  });

  it("merges with numeric sum customizer", () => {
    const result = mergeWith(
      { a: 1, b: 2 },
      { a: 3, b: 4 },
      (objValue, srcValue) => {
        if (typeof objValue === "number" && typeof srcValue === "number") {
          return objValue + srcValue;
        }
        return undefined;
      }
    );

    expect(result).toEqual({ a: 4, b: 6 });
  });

  it("uses default merge when customizer returns undefined", () => {
    const result = mergeWith({ a: 1 }, { b: 2 }, () => undefined);

    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("recursively merges nested objects", () => {
    const result = mergeWith({ a: { b: 1 } }, { a: { c: 2 } }, () => undefined);

    expect(result).toEqual({ a: { b: 1, c: 2 } });
  });

  it("does not mutate original objects", () => {
    const obj = { a: 1 };
    const source = { b: 2 };
    mergeWith(obj, source, () => undefined);

    expect(obj).toEqual({ a: 1 });
    expect(source).toEqual({ b: 2 });
  });

  it("passes correct arguments to customizer", () => {
    const calls: Array<{ objValue: unknown; srcValue: unknown; key: string }> =
      [];

    mergeWith({ a: 1 }, { a: 2 }, (objValue, srcValue, key) => {
      calls.push({ objValue, srcValue, key });
      return undefined;
    });

    expect(calls).toEqual([{ objValue: 1, srcValue: 2, key: "a" }]);
  });

  it("handles empty objects", () => {
    expect(mergeWith({}, {}, () => undefined)).toEqual({});
    expect(mergeWith({ a: 1 }, {}, () => undefined)).toEqual({ a: 1 });
    expect(mergeWith({}, { a: 1 }, () => undefined)).toEqual({ a: 1 });
  });

  it("replaces arrays by default", () => {
    const result = mergeWith(
      { items: [1, 2] },
      { items: [3, 4] },
      () => undefined
    );

    expect(result).toEqual({ items: [3, 4] });
  });

  describe("mergeWith - mutation tests", () => {
    it("[👾] replaces object with primitive when srcValue is primitive", () => {
      // Kills: && → || on line 90
      const result = mergeWith({ a: { x: 1 } }, { a: 2 }, () => undefined);
      expect(result).toEqual({ a: 2 });
    });

    it("[👾] handles null values without crash", () => {
      // Kills: value === null → false on line 113
      expect(() =>
        mergeWith({ a: null }, { a: { x: 1 } }, () => undefined)
      ).not.toThrow();
      expect(mergeWith({ a: null }, { a: { x: 1 } }, () => undefined)).toEqual({
        a: { x: 1 },
      });
    });

    it("[👾] recursively merges Object.create(null) objects", () => {
      // Kills: proto === null → false on line 115
      const left = { a: Object.assign(Object.create(null), { b: 1 }) };
      const right = { a: Object.assign(Object.create(null), { c: 2 }) };

      const result = mergeWith(left, right, () => undefined);
      expect(result.a).toHaveProperty("b", 1);
      expect(result.a).toHaveProperty("c", 2);
    });
  });

  itProp.prop([
    fc.dictionary(fc.string(), fc.anything()),
    fc.dictionary(fc.string(), fc.anything()),
  ])("[🎲] does not mutate original objects", (obj, source) => {
    const originalObj = structuredClone(obj);
    const originalSource = structuredClone(source);

    mergeWith(obj, source, () => undefined);

    expect(obj).toEqual(originalObj);
    expect(source).toEqual(originalSource);
  });
});
