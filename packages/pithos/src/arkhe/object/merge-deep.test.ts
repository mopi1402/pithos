import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { mergeDeepLeft, mergeDeepRight } from "./merge-deep";
import { cast, testNull, testUndefined } from "@arkhe/test/private-access";

const stringAsNull = cast("string");

describe("mergeDeepLeft", () => {
  it("left values take precedence", () => {
    expect(mergeDeepLeft({ a: 1 }, { a: 2, b: 3 })).toEqual({ a: 1, b: 3 });
  });

  it("merges nested objects recursively", () => {
    const left = { a: { x: 1 } };
    const right = { a: { x: 2, y: 3 }, b: 4 };
    expect(mergeDeepLeft(left, right)).toEqual({ a: { x: 1, y: 3 }, b: 4 });
  });

  it("returns right when left is null/undefined", () => {
    expect(mergeDeepLeft(testNull, { a: 1 })).toEqual({ a: 1 });
    expect(mergeDeepLeft(testUndefined, { a: 1 })).toEqual({ a: 1 });
  });

  it("returns left when right is null/undefined", () => {
    expect(mergeDeepLeft({ a: 1 }, testNull)).toEqual({ a: 1 });
  });

  it("returns left when left is not an object", () => {
    expect(mergeDeepLeft(stringAsNull, { a: 1 })).toBe("string");
  });

  it("returns left when right is not an object", () => {
    expect(mergeDeepLeft({ a: 1 }, stringAsNull)).toEqual({ a: 1 });
  });

  it("returns left array when both are arrays", () => {
    expect(mergeDeepLeft(cast([1, 2]), cast([3, 4]))).toEqual([1, 2]);
  });

  it("does not merge arrays in objects", () => {
    expect(mergeDeepLeft({ a: [1, 2] }, { a: [3, 4] })).toEqual({ a: [1, 2] });
  });

  it("ignores inherited properties", () => {
    const parent = { inherited: "value" };
    const right = Object.create(parent);
    right.own = "ownValue";

    const result = mergeDeepLeft({ a: 1 }, right);
    expect(result).toEqual({ a: 1, own: "ownValue" });
    expect(result).not.toHaveProperty("inherited");
  });

  it("[👾] returns left when only right is array", () => {
    // Kills: || → && on line 18
    expect(mergeDeepLeft({ a: 1 }, cast([1, 2]))).toEqual({ a: 1 });
  });

  it("[👾] returns left when only left is array", () => {
    // Kills: || → && on line 18
    expect(mergeDeepLeft(cast([1, 2]), { a: 1 })).toEqual([1, 2]);
  });

  it("[👾] keeps null when left is null and right is object", () => {
    // Kills: leftVal !== null → true (line 33)
    expect(mergeDeepLeft({ a: null }, { a: { x: 1 } })).toEqual({ a: null });
  });

  itProp.prop([
    fc.dictionary(fc.string(), fc.anything()),
    fc.dictionary(fc.string(), fc.anything()),
  ])("[🎲] does not mutate original objects", (left, right) => {
    // We need to clone to handle potential mutation since structuredClone handles deep structures
    // For fast-check inputs we might have to use JSON roundtrip if they contain unsupported types,
    // but fc.anything() is usually JSON safe-ish if we restrict it or use a custom generator.
    // Given the context, we will trust fc.anything() but handle failures if needed.
    // Actually, to be safe with fast-check's anything() which can produce cyclic deps,
    // let's stick to JSON safe values for now or rely on vitest's deep equality check?
    // Let's modify the generator to safe objects to avoid cycles if deepClone fails.

    // Better: clone before calling
    const originalLeft = structuredClone(left);
    const originalRight = structuredClone(right);

    mergeDeepLeft(left, right);

    expect(left).toEqual(originalLeft);
    expect(right).toEqual(originalRight);
  });
});

describe("mergeDeepRight", () => {
  it("right values take precedence", () => {
    expect(mergeDeepRight({ a: 1, b: 2 }, { a: 3 })).toEqual({ a: 3, b: 2 });
  });

  it("merges nested objects recursively", () => {
    const left = { a: { x: 1, y: 2 }, b: 4 };
    const right = { a: { x: 3 } };
    expect(mergeDeepRight(left, right)).toEqual({ a: { x: 3, y: 2 }, b: 4 });
  });

  it("returns left when right is null/undefined", () => {
    expect(mergeDeepRight({ a: 1 }, testNull)).toEqual({ a: 1 });
  });

  it("returns right when left is null/undefined", () => {
    expect(mergeDeepRight(testNull, { a: 1 })).toEqual({ a: 1 });
  });

  it("returns right when right is not an object", () => {
    expect(mergeDeepRight({ a: 1 }, stringAsNull)).toBe("string");
  });

  it("returns right when left is not an object", () => {
    expect(mergeDeepRight(stringAsNull, { a: 1 })).toEqual({ a: 1 });
  });

  it("returns right array when both are arrays", () => {
    expect(mergeDeepRight(cast([1, 2]), cast([3, 4]))).toEqual([3, 4]);
  });

  it("does not merge arrays in objects", () => {
    expect(mergeDeepRight({ a: [1, 2] }, { a: [3, 4] })).toEqual({ a: [3, 4] });
  });

  it("ignores inherited properties", () => {
    const parent = { inherited: "value" };
    const right = Object.create(parent);
    right.own = "ownValue";

    const result = mergeDeepRight({ a: 1 }, right);
    expect(result).toEqual({ a: 1, own: "ownValue" });
    expect(result).not.toHaveProperty("inherited");
  });

  it("[👾] returns right when only left is array", () => {
    expect(mergeDeepRight(cast([1, 2]), { a: 1 })).toEqual({ a: 1 });
  });

  it("[👾] returns right when only right is array", () => {
    expect(mergeDeepRight({ a: 1 }, cast([1, 2]))).toEqual([1, 2]);
  });

  it("[👾] replaces object with null when right is null", () => {
    // Kills: rightVal !== null → true (line 36)
    expect(mergeDeepRight({ a: { x: 1 } }, { a: null })).toEqual({ a: null });
  });

  it("[👾] replaces null with object when right is object", () => {
    // Kills: leftVal !== null → true (line 33)
    expect(mergeDeepRight({ a: null }, { a: { x: 1 } })).toEqual({
      a: { x: 1 },
    });
  });

  itProp.prop([
    fc.dictionary(fc.string(), fc.anything()),
    fc.dictionary(fc.string(), fc.anything()),
  ])("[🎲] does not mutate original objects", (left, right) => {
    const originalLeft = structuredClone(left);
    const originalRight = structuredClone(right);

    mergeDeepRight(left, right);

    expect(left).toEqual(originalLeft);
    expect(right).toEqual(originalRight);
  });
});
