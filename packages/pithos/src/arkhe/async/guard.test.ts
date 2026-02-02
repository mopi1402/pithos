import { describe, it, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { guard } from "./guard";

describe("guard", () => {
  it("returns result on success", async () => {
    expect(await guard(() => Promise.resolve(42))).toBe(42);
  });

  it("returns undefined on error without fallback", async () => {
    expect(
      await guard(() => Promise.reject(new Error("fail")))
    ).toBeUndefined();
  });

  it("returns fallback value on error", async () => {
    expect(
      await guard(() => Promise.reject(new Error("fail")), "default")
    ).toBe("default");
  });

  it("calls fallback function on error", async () => {
    const fallback = vi.fn().mockReturnValue("recovered");
    const result = await guard(
      () => Promise.reject(new Error("fail")),
      fallback
    );
    expect(result).toBe("recovered");
    expect(fallback).toHaveBeenCalledTimes(1);
  });

  it("passes error to fallback function", async () => {
    const error = new Error("test");
    const fallback = vi.fn().mockReturnValue("recovered");
    await guard(() => Promise.reject(error), fallback);
    expect(fallback).toHaveBeenCalledWith(error);
  });

  itProp.prop([
    fc.oneof(
      fc.dictionary(fc.string(), fc.anything()),
      fc.array(fc.anything())
    ),
  ])("[🎲] does not mutate fallback object", async (fallback) => {
    // We pass a collection as fallback (object or array)
    // We force an error so the fallback is returned

    // Create a deep copy for comparison
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deepClone = (obj: any): any => {
      if (obj === null || typeof obj !== "object") return obj;
      if (Array.isArray(obj)) return obj.map(deepClone);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const clone = { ...obj } as any;
      for (const key in clone) {
        clone[key] = deepClone(clone[key]);
      }
      return clone;
    };

    const original = deepClone(fallback);

    // Test with direct value fallback (not function)
    const result = await guard(
      () => Promise.reject(new Error("fail")),
      fallback
    );

    expect(result).toBe(fallback); // Should return the exact same reference
    expect(fallback).toEqual(original); // Should not be mutated
  });
});
