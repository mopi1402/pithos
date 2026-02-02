import { describe, it, expect } from "vitest";
import { isMap } from "./is-map";

describe("isMap", () => {
  it("should return true for Map instances", () => {
    expect(isMap(new Map())).toBe(true);
    expect(isMap(new Map([["a", 1]]))).toBe(true);
  });

  it("[🎯] should return false for WeakMap", () => {
    expect(isMap(new WeakMap())).toBe(false);
  });

  it("[🎯] should return false for other collections", () => {
    expect(isMap(new Set())).toBe(false);
    expect(isMap([])).toBe(false);
    expect(isMap({})).toBe(false);
  });

  it("[🎯] should return false for primitives", () => {
    expect(isMap(null)).toBe(false);
    expect(isMap(undefined)).toBe(false);
    expect(isMap("map")).toBe(false);
  });
});
