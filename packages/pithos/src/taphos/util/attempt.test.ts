import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { attempt } from "./attempt";

describe("attempt", () => {
  it("returns result on success", () => {
    expect(attempt((str: unknown) => JSON.parse(str as string), '{"a":1}')).toEqual({ a: 1 });
  });

  it("[🎯] returns Error on failure", () => {
    const result = attempt((str: unknown) => JSON.parse(str as string), "invalid");
    expect(result).toBeInstanceOf(Error);
  });

  it("passes arguments to function", () => {
    expect(attempt((a: unknown, b: unknown) => (a as number) + (b as number), 1, 2)).toBe(3);
  });

  it("[🎯] wraps non-Error throws", () => {
    const result = attempt(() => {
      throw "string error";
    });
    expect(result).toBeInstanceOf(Error);
  });

  itProp.prop([fc.integer(), fc.integer()])(
    "[🎲] returns result for non-throwing functions",
    (a, b) => {
      const result = attempt((x: unknown, y: unknown) => (x as number) + (y as number), a, b);
      expect(result).toBe(a + b);
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] returns Error for always-throwing functions",
    (msg) => {
      const result = attempt(() => { throw new Error(msg); });
      expect(result).toBeInstanceOf(Error);
    }
  );
});
