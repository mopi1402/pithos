import { describe, it, expect } from "vitest";
import { evolve } from "./evolve";
import { it as itProp } from "@fast-check/vitest";
import { safeObject } from "_internal/test/arbitraries";

describe("evolve", () => {
  it("applies transformation functions to properties", () => {
    const result = evolve({ a: 5, b: 10 }, { a: (x: number) => x * 2 });
    expect(result).toEqual({ a: 10, b: 10 });
  });

  it("handles nested transformations", () => {
    const result = evolve(
      { nested: { value: 5 } },
      { nested: { value: (x: number) => x + 1 } }
    );
    expect(result).toEqual({ nested: { value: 6 } });
  });

  it("preserves properties without transformations", () => {
    const result = evolve({ a: 1, b: 2 }, {});
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("preserves value when transformation is object but value is primitive", () => {
    const result = evolve(
      { a: "string" },
      // INTENTIONAL testing runtime defensive behavior
      // @ts-expect-error - testing runtime defensive behavior
      { a: { nested: (x: number) => x * 2 } }
    );
    expect(result).toEqual({ a: "string" });
  });

  it("ignores inherited properties", () => {
    const parent = { inherited: "value" };
    const obj = Object.create(parent);
    obj.own = "ownValue";

    const result = evolve(obj, { own: (s: string) => s.toUpperCase() });
    expect(result).toEqual({ own: "OWNVALUE" });
    expect(result).not.toHaveProperty("inherited");
  });

  it("[🎯] applies function transformation to object value", () => {
    const result = evolve(
      { nested: { value: 5 } },
      { nested: (obj: { value: number }) => ({ value: obj.value * 2 }) }
    );
    expect(result).toEqual({ nested: { value: 10 } });
  });

  it("[👾] handles undefined transformation for nested object", () => {
    const result = evolve(
      { nested: { value: 5 }, other: 10 },
      { other: (x: number) => x * 2 }
    );
    expect(result).toEqual({ nested: { value: 5 }, other: 20 });
  });

  // Invariant: without transformations, object is preserved
  itProp.prop([safeObject()])(
    "[🎲] preserves object when no transformations",
    (obj) => {
      expect(evolve(obj, {})).toEqual(obj);
    }
  );

  // Invariant: all keys are preserved
  itProp.prop([safeObject()])("[🎲] preserves all keys", (obj) => {
    const result = evolve(obj, {});
    expect(Object.keys(result).sort()).toEqual(Object.keys(obj).sort());
  });

  // Independence: evolve returns a new object
  itProp.prop([safeObject()])("[🎲] returns new object reference", (obj) => {
    const result = evolve(obj, {});
    if (Object.keys(obj).length > 0) {
      expect(result).not.toBe(obj);
    }
  });
});
