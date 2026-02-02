import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { orderBy } from "./order-by";

describe("orderBy", () => {
  const users = [
    { name: "alice", age: 30 },
    { name: "bob", age: 25 },
    { name: "charlie", age: 30 },
  ];

  it("sorts by single key ascending", () => {
    const result = orderBy(users, ["age"]);
    expect(result.map((u) => u.name)).toEqual(["bob", "alice", "charlie"]);
  });

  it("sorts by single key descending", () => {
    const result = orderBy(users, ["age"], ["desc"]);
    expect(result.map((u) => u.name)).toEqual(["alice", "charlie", "bob"]);
  });

  it("sorts by multiple keys", () => {
    const result = orderBy(users, ["age", "name"], ["desc", "asc"]);
    expect(result.map((u) => u.name)).toEqual(["alice", "charlie", "bob"]);
  });

  it("sorts by function iteratee", () => {
    const result = orderBy(users, [(u) => u.name.length]);
    expect(result.map((u) => u.name)).toEqual(["bob", "alice", "charlie"]);
  });

  it("returns copy without sorting when no iteratees", () => {
    const arr = [{ a: 2 }, { a: 1 }];
    const result = orderBy(arr, []);
    expect(result).toEqual([{ a: 2 }, { a: 1 }]);
    expect(result).not.toBe(arr);
  });

  it("returns empty array for empty input", () => {
    expect(orderBy([], ["name"])).toEqual([]);
  });

  it("[🎯] stable sort preserves relative order of equal elements", () => {
    const items = [
      { name: "a", priority: 1 },
      { name: "b", priority: 1 },
      { name: "c", priority: 1 },
    ];
    const result = orderBy(items, ["priority"]);
    expect(result.map((i) => i.name)).toEqual(["a", "b", "c"]);
  });

  it("[🎯] supports mixed keyof and function iteratees", () => {
    const items = [
      { name: "alice", age: 30 },
      { name: "bob", age: 25 },
      { name: "al", age: 25 },
    ];
    const result = orderBy(
      items,
      ["age", (u) => u.name.length],
      ["asc", "asc"]
    );
    expect(result.map((u) => u.name)).toEqual(["al", "bob", "alice"]);
  });

  it("[🎯] defaults to 'asc' when orders array is shorter than iteratees", () => {
    const items = [
      { a: 2, b: 1 },
      { a: 1, b: 2 },
      { a: 1, b: 1 },
    ];
    const result = orderBy(items, ["a", "b"], ["asc"]);
    expect(result).toEqual([
      { a: 1, b: 1 },
      { a: 1, b: 2 },
      { a: 2, b: 1 },
    ]);
  });

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] result has same length as input",
    (arr) => {
      const result = orderBy(
        arr.map((x) => ({ val: x })),
        ["val"]
      );
      expect(result.length).toBe(arr.length);
    }
  );

  itProp.prop([fc.array(fc.integer({ min: 0, max: 100 }))])(
    "[🎲] ascending sort is monotonic",
    (arr) => {
      const objs = arr.map((x) => ({ val: x }));
      const result = orderBy(objs, ["val"], ["asc"]);
      for (let i = 1; i < result.length; i++) {
        expect(result[i].val).toBeGreaterThanOrEqual(result[i - 1].val);
      }
    }
  );

  itProp.prop([fc.array(fc.integer({ min: 0, max: 50 }))])(
    "[🎲] result is a permutation of input",
    (arr) => {
      const objs = arr.map((x, i) => ({ val: x, id: i }));
      const result = orderBy(objs, ["val"]);

      const sortedInput = [...objs].sort((a, b) => a.id - b.id);
      const sortedResult = [...result].sort((a, b) => a.id - b.id);
      expect(sortedResult).toEqual(sortedInput);
    }
  );

  itProp.prop([fc.array(fc.integer())])(
    "[🎲] does not mutate original array",
    (arr) => {
      const objs = arr.map((x) => ({ val: x }));
      const original = objs.map((o) => ({ ...o }));
      orderBy(objs, ["val"]);
      expect(objs).toEqual(original);
    }
  );
});
