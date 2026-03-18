import { describe, it, expect } from "vitest";
import {
  type Adapter,
  createAdapter,
  adapt,
} from "./adapter";

// --- Adapter type ---

describe("Adapter type", () => {
  it("is a function that transforms one function signature into another", () => {
    const toUpper: Adapter<string, string, number, string> = (fn) => (id) =>
      fn(String(id)).toUpperCase();

    const greet = (name: string) => `hello, ${name}`;
    const greetById = toUpper(greet);

    expect(greetById(42)).toBe("HELLO, 42");
  });
});

// --- createAdapter ---

describe("createAdapter", () => {
  it("creates a reusable adapter from mappers", () => {
    const stringToNumber = createAdapter<number, number, string, string>(
      (s: string) => parseInt(s),
      (n) => String(n),
    );

    const double = (n: number) => n * 2;
    const doubleString = stringToNumber(double);

    expect(doubleString("21")).toBe("42");
  });

  it("can be reused on multiple source functions", () => {
    const adapter = createAdapter<number, number, string, string>(
      (s: string) => parseInt(s),
      (n) => String(n),
    );

    const double = adapter((n) => n * 2);
    const triple = adapter((n) => n * 3);

    expect(double("10")).toBe("20");
    expect(triple("10")).toBe("30");
  });
});

// --- adapt ---

describe("adapt", () => {
  it("adapts both input and output in one shot", () => {
    const sortNumbers = (nums: number[]) => [...nums].sort((a, b) => a - b);

    const sortStrings = adapt(
      sortNumbers,
      (strs: string[]) => strs.map(Number),
      (nums) => nums.map(String),
    );

    expect(sortStrings(["3", "1", "2"])).toEqual(["1", "2", "3"]);
  });

  it("works as a classic OOP adapter replacement", () => {
    // "Legacy" function with incompatible signature
    const legacySearch = (query: { term: string; maxResults: number }) => {
      return Array.from({ length: query.maxResults }, (_, i) => ({
        id: i,
        match: `${query.term}_${i}`,
      }));
    };

    // Adapt to a simpler signature
    const search = adapt(
      legacySearch,
      (term: string) => ({ term, maxResults: 3 }),
      (results) => results.map((r) => r.match),
    );

    expect(search("foo")).toEqual(["foo_0", "foo_1", "foo_2"]);
  });
});

// --- composition ---

describe("composition", () => {
  it("createAdapter composes with itself", () => {
    // Adapter 1: string -> number domain
    const a1 = createAdapter<number, number, string, string>(
      (s: string) => parseInt(s),
      (n) => String(n),
    );

    // Adapter 2: add prefix/suffix in string domain
    const a2 = createAdapter<string, string, string, string>(
      (s) => s.replace("$", ""),
      (s) => `$${s}`,
    );

    const double = (n: number) => n * 2;

    // Chain: "$42" -> "42" -> 42 -> 84 -> "84" -> "$84"
    const adapted = a2(a1(double));

    expect(adapted("$21")).toBe("$42");
  });
});
