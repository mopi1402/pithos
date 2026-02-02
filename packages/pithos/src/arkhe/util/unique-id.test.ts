import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { uniqueId } from "./unique-id";

describe("uniqueId", () => {
  it("generates sequential IDs", () => {
    const id1 = uniqueId();
    const id2 = uniqueId();
    const id3 = uniqueId();

    expect(Number(id1)).toBeLessThan(Number(id2));
    expect(Number(id2)).toBeLessThan(Number(id3));
  });

  it("supports prefix", () => {
    const id = uniqueId("user_");
    expect(id).toMatch(/^user_\d+$/);
  });

  it("supports different prefixes", () => {
    const userId = uniqueId("user_");
    const itemId = uniqueId("item_");

    expect(userId).toMatch(/^user_\d+$/);
    expect(itemId).toMatch(/^item_\d+$/);
  });

  it("generates unique IDs", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(uniqueId());
    }
    expect(ids.size).toBe(100);
  });

  it("returns string type", () => {
    expect(typeof uniqueId()).toBe("string");
    expect(typeof uniqueId("prefix_")).toBe("string");
  });

  it("handles empty prefix", () => {
    const id = uniqueId("");
    expect(id).toMatch(/^\d+$/);
  });

  it("increments counter globally", () => {
    const id1 = uniqueId("a_");
    const id2 = uniqueId("b_");

    const num1 = Number(id1.replace("a_", ""));
    const num2 = Number(id2.replace("b_", ""));

    expect(num2).toBe(num1 + 1);
  });

  it("[🎯] tests JSDoc example without prefix", () => {
    const id1 = uniqueId();
    const id2 = uniqueId();
    expect(Number(id2)).toBe(Number(id1) + 1);
  });

  it("[🎯] tests JSDoc example with prefix", () => {
    const userId = uniqueId("user_");
    const itemId = uniqueId("item_");
    expect(userId).toMatch(/^user_\d+$/);
    expect(itemId).toMatch(/^item_\d+$/);
  });

  itProp.prop([fc.string()])(
    "[🎲] always returns string starting with prefix",
    (prefix) => {
      const id = uniqueId(prefix);
      expect(id.startsWith(prefix)).toBe(true);
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] suffix is always a positive integer",
    (prefix) => {
      const id = uniqueId(prefix);
      const suffix = id.slice(prefix.length);
      const num = Number(suffix);
      expect(Number.isInteger(num)).toBe(true);
      expect(num).toBeGreaterThan(0);
    }
  );

  it("[🎲] generates unique IDs across multiple calls", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 50; i++) {
      ids.add(uniqueId("test_"));
    }
    expect(ids.size).toBe(50);
  });
});
