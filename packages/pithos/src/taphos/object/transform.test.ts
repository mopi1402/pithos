import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { transform } from "./transform";

describe("transform", () => {
  it("transforms object with accumulator", () => {
    const result = transform(
      { a: 1, b: 2, c: 1 },
      (acc, value, key) => {
        (acc[value] ||= []).push(key);
      },
      {} as Record<number, string[]>
    );
    expect(result).toEqual({ 1: ["a", "c"], 2: ["b"] });
  });

  it("[🎯] returns accumulator", () => {
    const acc = { initial: true };
    const result = transform({ a: 1 }, () => {}, acc);
    expect(result).toBe(acc);
  });

  it("[🎯] handles empty object", () => {
    const result = transform({}, (acc) => acc, { count: 0 });
    expect(result).toEqual({ count: 0 });
  });

  itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
    "[🎲] accumulator is returned",
    (obj) => {
      const acc = { sum: 0 };
      const result = transform(obj, (a, v) => { a.sum += v; }, acc);
      expect(result).toBe(acc);
    }
  );
});
