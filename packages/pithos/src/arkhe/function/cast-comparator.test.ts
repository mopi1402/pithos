import { describe, it, expect } from "vitest";
import { castComparator } from "./cast-comparator";

describe("castComparator", () => {
  it("compares by object key", () => {
    const items = [{ name: "Charlie" }, { name: "Alice" }, { name: "Bob" }];
    items.sort(castComparator("name"));
    expect(items.map((i) => i.name)).toEqual(["Alice", "Bob", "Charlie"]);
  });

  it("compares by mapper function", () => {
    const items = [{ value: 3 }, { value: 1 }, { value: 2 }];
    items.sort(castComparator((i) => i.value));
    expect(items.map((i) => i.value)).toEqual([1, 2, 3]);
  });

  it("reverses sort order", () => {
    const items = [{ n: 1 }, { n: 3 }, { n: 2 }];
    items.sort(castComparator("n", { reverse: true }));
    expect(items.map((i) => i.n)).toEqual([3, 2, 1]);
  });

  it("uses custom compare function", () => {
    const items = [{ s: "bb" }, { s: "aaa" }, { s: "c" }];
    items.sort(castComparator("s", { compare: (a, b) => a.length - b.length }));
    expect(items.map((i) => i.s)).toEqual(["c", "bb", "aaa"]);
  });

  it("sorts null/undefined last", () => {
    const items = [{ v: null }, { v: 2 }, { v: undefined }, { v: 1 }];
    items.sort(castComparator("v"));
    expect(items.map((i) => i.v)).toEqual([1, 2, null, undefined]);
  });

  it("compares dates by timestamp", () => {
    const d1 = new Date("2020-01-01");
    const d2 = new Date("2022-01-01");
    const d3 = new Date("2021-01-01");
    const items = [{ d: d2 }, { d: d1 }, { d: d3 }];
    items.sort(castComparator("d"));
    expect(items.map((i) => i.d)).toEqual([d1, d3, d2]);
  });

  it("[🎯] returns 0 for identical values (Object.is)", () => {
    const compare = castComparator<{ v: number }, "v">("v");
    expect(compare({ v: NaN }, { v: NaN })).toBe(0);
  });

  it("falls back to string comparison for non-primitive types", () => {
    const items = [{ v: 2n }, { v: 1n }];
    items.sort(castComparator((i) => i.v));
    expect(items.map((i) => i.v)).toEqual([1n, 2n]);
  });

  it("[👾] null a vs defined b returns 1 (not String fallback)", () => {
    const compare = castComparator<{ v: string | null }, "v">("v");
    // "zzz" kills mutant: String(null).localeCompare("zzz") = -1, not 1
    expect(compare({ v: null }, { v: "zzz" })).toBe(1);
  });

  it("[👾] undefined a vs defined b returns 1 (not String fallback)", () => {
    const compare = castComparator<{ v: string | undefined }, "v">("v");
    expect(compare({ v: undefined }, { v: "zzz" })).toBe(1);
  });

  it("[👾] defined a vs null b returns -1 (not String fallback)", () => {
    const compare = castComparator<{ v: string | null }, "v">("v");
    // "zzz".localeCompare(String(null)) = 1, not -1
    expect(compare({ v: "zzz" }, { v: null })).toBe(-1);
  });

  it("[👾] defined a vs undefined b returns -1 (not String fallback)", () => {
    const compare = castComparator<{ v: string | undefined }, "v">("v");
    expect(compare({ v: "zzz" }, { v: undefined })).toBe(-1);
  });

  it("[👾] numbers use subtraction (exact values)", () => {
    const compare = castComparator<{ v: number }, "v">("v");
    expect(compare({ v: 10 }, { v: 5 })).toBe(5);
    expect(compare({ v: 5 }, { v: 10 })).toBe(-5);
  });

  it("[👾] mixed types fall through to String() comparison", () => {
    const compare = castComparator<{ v: string | number }, "v">("v");
    // "a".localeCompare("1") > 0
    expect(compare({ v: "a" }, { v: 1 })).toBeGreaterThan(0);
    // "1".localeCompare("a") < 0
    expect(compare({ v: 1 }, { v: "a" })).toBeLessThan(0);
  });

  it("[👾] reverse with mapper function", () => {
    const items = [{ value: 1 }, { value: 3 }, { value: 2 }];
    items.sort(castComparator((i) => i.value, { reverse: true }));
    expect(items.map((i) => i.value)).toEqual([3, 2, 1]);
  });

  it("[👾] custom compare with mapper function", () => {
    const items = [{ s: "bb" }, { s: "aaa" }, { s: "c" }];
    items.sort(
      castComparator((i) => i.s, { compare: (a, b) => a.length - b.length })
    );
    expect(items.map((i) => i.s)).toEqual(["c", "bb", "aaa"]);
  });

  it("[👾] Date vs non-Date falls through to String() (not getTime)", () => {
    const compare = castComparator<{ v: Date | string }, "v">("v");
    const date = new Date("2020-01-01");

    // With &&: falls back to String(), consistent result
    // With ||: attempts b.getTime() on string → TypeError!
    const result = compare({ v: date }, { v: "test" });

    // String(date).localeCompare("test") should return a valid number
    expect(result).not.toBeNaN();
    expect(Number.isFinite(result)).toBe(true);
  });
});
