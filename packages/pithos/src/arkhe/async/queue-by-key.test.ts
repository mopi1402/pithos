import { describe, it, expect, vi } from "vitest";
import { queueByKey } from "./queue-by-key";

describe("queueByKey", () => {
  it("returns result of fn", async () => {
    const result = await queueByKey("a", () => Promise.resolve(42));
    expect(result).toBe(42);
  });

  it("[🎯] queues sequential calls with same key", async () => {
    const order: number[] = [];
    const fn1 = () =>
      new Promise<void>((r) =>
        setTimeout(() => {
          order.push(1);
          r();
        }, 50)
      );
    const fn2 = () =>
      new Promise<void>((r) =>
        setTimeout(() => {
          order.push(2);
          r();
        }, 10)
      );

    await Promise.all([queueByKey("a", fn1), queueByKey("a", fn2)]);

    expect(order).toEqual([1, 2]);
  });

  it("[🎯] allows different keys concurrently", async () => {
    const order: string[] = [];
    const fn1 = () =>
      new Promise<void>((r) =>
        setTimeout(() => {
          order.push("a");
          r();
        }, 50)
      );
    const fn2 = () =>
      new Promise<void>((r) =>
        setTimeout(() => {
          order.push("b");
          r();
        }, 10)
      );

    await Promise.all([queueByKey("a", fn1), queueByKey("b", fn2)]);

    expect(order).toEqual(["b", "a"]);
  });

  it("[🎯] continues queue after rejection", async () => {
    const results: string[] = [];

    const p1 = queueByKey("a", () => Promise.reject(new Error("fail"))).catch(
      () => results.push("error")
    );
    const p2 = queueByKey("a", () => Promise.resolve("success")).then((r) =>
      results.push(r)
    );

    await Promise.all([p1, p2]);

    expect(results).toEqual(["error", "success"]);
  });

  it("cleans up after queue drains", async () => {
    await queueByKey("a", () => Promise.resolve());
    await queueByKey("a", () => Promise.resolve());

    const fn = vi.fn().mockResolvedValue("fresh");
    await queueByKey("a", fn);

    expect(fn).toHaveBeenCalledTimes(1);
  });
});
