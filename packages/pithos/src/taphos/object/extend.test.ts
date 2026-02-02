import { describe, test, expect } from "vitest";
import { extend } from "./extend";
import { assign } from "./assign";

describe("extend", () => {
  test("[🎯] extend is a wrapper of assign function", () => {
    expect(extend).not.toBe(assign);
    
    const target: Record<string, number> = { a: 1, b: 2 };
    const source1: Record<string, number> = { b: 3, c: 4 };
    const source2: Record<string, number> = { c: 5, d: 6 };
    
    const extendResult = extend({ ...target }, source1, source2);
    const assignResult = assign({ ...target }, source1, source2);
    
    expect(extendResult).toEqual(assignResult);
  });
});
