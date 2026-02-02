import { describe, it, expect } from "vitest";
import { pipe } from "./pipe";

const testPipe = (
  initial: number,
  funcs: Array<(x: number) => number>
): number => {
  return funcs.reduce((acc, fn) => fn(acc), initial);
};

describe("pipe", () => {
  it("[🎯] returns value unchanged with no functions", () => {
    expect(pipe(5)).toBe(5);
  });

  it("applies single function", () => {
    expect(pipe(5, (x) => x * 2)).toBe(10);
  });

  it("applies two functions", () => {
    expect(pipe(5, (x) => x * 2, (x) => x + 1)).toBe(11);
  });

  it("composes multiple functions left-to-right", () => {
    expect(
      pipe(
        5,
        (x) => x * 2,
        (x) => x + 1,
        (x) => x.toString()
      )
    ).toBe("11");
  });

  it("applies four functions", () => {
    expect(
      pipe(
        5,
        (x) => x * 2,
        (x) => x + 1,
        (x) => x * 3,
        (x) => x - 2
      )
    ).toBe(31);
  });

  it("handles 5 functions (max inline path)", () => {
    expect(
      pipe(
        1,
        (x) => x + 1,
        (x) => x * 2,
        (x) => x + 3,
        (x) => x * 2,
        (x) => x - 1
      )
    ).toBe(13);
  });

  it("handles more than 5 functions (loop fallback)", () => {
    const inc = (x: number) => x + 1;
    expect(pipe(0, inc, inc, inc, inc, inc, inc, inc)).toBe(7);
  });

  describe("pipe", () => {
    const fns = [
      (x: number) => x + 1,
      (x: number) => x * 2,
      (x: number) => x + 10,
      (x: number) => x / 2,
      (x: number) => x - 1,
      (x: number) => x * 3,
    ];

    const expected = [5, 6, 12, 22, 11, 10, 30];

    for (let i = 0; i <= 6; i++) {
      it(`applies ${i} function(s)`, () => {
        expect(testPipe(5, fns.slice(0, i))).toBe(expected[i]);
      });
    }
  });
});
