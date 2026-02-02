import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { parallel } from "./parallel";

describe("parallel", () => {
  it("executes all functions", async () => {
    const fns = [() => Promise.resolve(1), () => Promise.resolve(2)];
    expect(await parallel(fns)).toEqual([1, 2]);
  });

  it("preserves order", async () => {
    const fns = [
      () => new Promise<number>((r) => setTimeout(() => r(1), 50)),
      () => Promise.resolve(2),
    ];
    expect(await parallel(fns)).toEqual([1, 2]);
  });

  it("limits concurrency", async () => {
    let active = 0;
    let maxActive = 0;

    const createFn = () => async () => {
      active++;
      maxActive = Math.max(maxActive, active);
      await new Promise((r) => setTimeout(r, 10));
      active--;
      return true;
    };

    await parallel([createFn(), createFn(), createFn(), createFn()], 2);
    expect(maxActive).toBe(2);
  });

  it("handles empty array", async () => {
    expect(await parallel([])).toEqual([]);
  });

  it("handles concurrency greater than array length", async () => {
    const fns = [() => Promise.resolve(1)];
    expect(await parallel(fns, 10)).toEqual([1]);
  });

  it("handles Infinity concurrency", async () => {
    const fns = [() => Promise.resolve(1), () => Promise.resolve(2)];
    expect(await parallel(fns, Infinity)).toEqual([1, 2]);
  });

  it("rejects when any function rejects", async () => {
    const error = new Error("Test error");
    const fns = [
      () => Promise.resolve(1),
      () => Promise.reject(error),
      () => Promise.resolve(3),
    ];

    await expect(parallel(fns, 2)).rejects.toThrow(error);
  });

  it("aborts remaining operations on error", async () => {
    let executedCount = 0;
    const error = new Error("Test error");

    const fns = [
      () => {
        executedCount++;
        return Promise.resolve(1);
      },
      () => {
        executedCount++;
        return Promise.reject(error);
      },
      () => {
        executedCount++;
        return Promise.resolve(3);
      },
      () => {
        executedCount++;
        return Promise.resolve(4);
      },
    ];

    try {
      await parallel(fns, 2);
    } catch {
      // Expected to throw
    }

    expect(executedCount).toBeLessThan(fns.length);
  });

  it("[🎯] executes sequentially with concurrency = 1", async () => {
    const order: number[] = [];
    const fns = [
      async () => {
        order.push(1);
        await new Promise((r) => setTimeout(r, 10));
        order.push(2);
        return "a";
      },
      async () => {
        order.push(3);
        return "b";
      },
    ];
    const results = await parallel(fns, 1);
    expect(results).toEqual(["a", "b"]);
    expect(order).toEqual([1, 2, 3]);
  });

  itProp.prop([fc.array(fc.anything()), fc.integer({ min: 1, max: 100 })])(
    "[🎲] does not mutate original tasks array",
    async (arr, concurrency) => {
      // Mock tasks that return promises
      const tasks = arr.map((val) => () => Promise.resolve(val));
      const original = [...tasks];

      await parallel(tasks, concurrency);

      // Check that the functions in the array are the same instances
      expect(tasks.length).toBe(original.length);
      for (let i = 0; i < tasks.length; i++) {
        expect(tasks[i]).toBe(original[i]);
      }
    }
  );
});
