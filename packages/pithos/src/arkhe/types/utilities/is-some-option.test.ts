import { describe, it, expect } from "vitest";
import { isSomeOption } from "./is-some-option";

describe("isSomeOption", () => {
  it("[🎯] returns true for Some", () => {
    expect(isSomeOption({ _tag: "Some", value: 42 })).toBe(true);
  });

  it("[🎯] returns false for None", () => {
    expect(isSomeOption({ _tag: "None" })).toBe(false);
  });

  it("narrows type correctly", () => {
    const option: { _tag: "Some" | "None"; value?: number } = {
      _tag: "Some",
      value: 42,
    };
    if (isSomeOption(option)) {
      expect(option.value).toBe(42);
    }
  });
});
