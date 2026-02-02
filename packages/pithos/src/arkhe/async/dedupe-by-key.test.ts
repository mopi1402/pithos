import { describe, it, expect, vi } from "vitest";
import { dedupeByKey } from "./dedupe-by-key";

describe("dedupeByKey", () => {
  it("returns result of fn", async () => {
    const result = await dedupeByKey("a", () => Promise.resolve(42));
    expect(result).toBe(42);
  });

  it("deduplicates concurrent calls with same key", async () => {
    const fn = vi.fn().mockResolvedValue("result");
    const [r1, r2] = await Promise.all([
      dedupeByKey("a", fn),
      dedupeByKey("a", fn),
    ]);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(r1).toBe("result");
    expect(r2).toBe("result");
  });

  it("allows different keys concurrently", async () => {
    const fn = vi.fn().mockResolvedValue("result");
    await Promise.all([dedupeByKey("a", fn), dedupeByKey("b", fn)]);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("cleans up after completion", async () => {
    await dedupeByKey("a", () => Promise.resolve());
    const fn = vi.fn().mockResolvedValue("new");
    const result = await dedupeByKey("a", fn);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe("new");
  });

  it("cleans up after rejection", async () => {
    await dedupeByKey("a", () => Promise.reject(new Error("fail"))).catch(
      () => {}
    );
    const fn = vi.fn().mockResolvedValue("recovered");
    const result = await dedupeByKey("a", fn);
    expect(result).toBe("recovered");
  });

  it("[🎯] shares rejection among concurrent callers", async () => {
    const error = new Error("shared failure");
    const [r1, r2] = await Promise.allSettled([
      dedupeByKey("a", () => Promise.reject(error)),
      dedupeByKey("a", () => Promise.reject(error)),
    ]);
    expect(r1).toEqual({ status: "rejected", reason: error });
    expect(r2).toEqual({ status: "rejected", reason: error });
  });
});
