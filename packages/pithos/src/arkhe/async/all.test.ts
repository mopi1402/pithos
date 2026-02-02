import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { all } from "./all";

describe("all", () => {
  it("resolves array of promises", async () => {
    const result = await all([Promise.resolve(1), Promise.resolve("a")]);
    expect(result).toEqual([1, "a"]);
  });

  it("resolves object of promises", async () => {
    const result = await all({
      num: Promise.resolve(1),
      str: Promise.resolve("a"),
    });
    expect(result).toEqual({ num: 1, str: "a" });
  });

  it("handles mixed values and promises in array", async () => {
    const result = await all([1, Promise.resolve(2)]);
    expect(result).toEqual([1, 2]);
  });

  it("handles mixed values and promises in object", async () => {
    const result = await all({ a: 1, b: Promise.resolve(2) });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("handles empty array", async () => {
    expect(await all([])).toEqual([]);
  });

  it("handles empty object", async () => {
    expect(await all({})).toEqual({});
  });

  it("rejects if any promise rejects (array)", async () => {
    await expect(
      all([Promise.resolve(1), Promise.reject(new Error("fail"))])
    ).rejects.toThrow("fail");
  });

  it("rejects if any promise rejects (object)", async () => {
    await expect(
      all({ a: Promise.resolve(1), b: Promise.reject(new Error("fail")) })
    ).rejects.toThrow("fail");
  });

  it("[👾] does not add extra keys to result", async () => {
    const result = await all({ a: Promise.resolve(1) });
    expect(Object.keys(result)).toEqual(["a"]);
  });

  itProp.prop([fc.array(fc.anything())])(
    "[🎲] does not mutate original array",
    async (arr) => {
      const original = [...arr];
      await all(arr).catch(() => {}); // Ignore rejections
      expect(arr).toEqual(original);
    }
  );

  itProp.prop([fc.dictionary(fc.string(), fc.anything())])(
    "[🎲] does not mutate original object",
    async (obj) => {
      const original = { ...obj };
      await all(obj).catch(() => {}); // Ignore rejections
      expect(obj).toEqual(original);
    }
  );
});
