import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { toPath } from "./toPath";

describe("toPath", () => {
  it("converts dot notation path", () => {
    expect(toPath("a.b.c")).toEqual(["a", "b", "c"]);
  });

  it("converts bracket notation", () => {
    expect(toPath("a[0].b.c")).toEqual(["a", "0", "b", "c"]);
  });

  it("handles mixed notation", () => {
    expect(toPath("a[0][1].b")).toEqual(["a", "0", "1", "b"]);
  });

  it("[🎯] returns empty array for null", () => {
    expect(toPath(null)).toEqual([]);
  });

  it("[🎯] returns empty array for empty string", () => {
    expect(toPath("")).toEqual([]);
  });

  it("[🎯] returns empty array for undefined", () => {
    expect(toPath(undefined)).toEqual([]);
  });

  it("[🎯] handles double-quoted bracket keys", () => {
    expect(toPath('a["b"].c')).toEqual(["a", "b", "c"]);
  });

  it("[🎯] handles single-quoted bracket keys", () => {
    expect(toPath("a['b'].c")).toEqual(["a", "b", "c"]);
  });

  it("[🎯] handles trailing bracket with no content after it", () => {
    expect(toPath("a[")).toEqual(["a"]);
  });

  it("[🎯] handles path ending with dot (trailing key is empty)", () => {
    // "a." ends with dot → last key="" → key!=="" is false at end
    expect(toPath("a.")).toEqual(["a"]);
  });

  it("[🎯] handles path ending with bracket (key empty at end)", () => {
    expect(toPath("a[0]")).toEqual(["a", "0"]);
  });

  it("[👾] single key without separators returns wrapped value", () => {
    expect(toPath("foo")).toEqual(["foo"]);
    expect(toPath("a")).toEqual(["a"]);
  });

  it("[👾] unclosed double-quoted bracket stops at end of string", () => {
    // Tests index < length guard in quoted bracket scan (line 62)
    // Without the guard, missing closing quote causes infinite loop
    expect(toPath('a["b')).toEqual(["a", "b"]);
  });

  it("[👾] unclosed unquoted bracket stops at end of string", () => {
    // Tests index < length guard in unquoted bracket scan (line 67)
    // Without the guard, missing ] causes infinite loop
    expect(toPath("a[0")).toEqual(["a", "0"]);
  });

  it("[👾] bracket at end of string with no trailing content", () => {
    // Tests index < length guard on dot-skip after bracket (line 73)
    expect(toPath("a[0]")).toEqual(["a", "0"]);
  });

  it("[👾] path with only dots", () => {
    // "..." → firstSep finds dot at index 0, so fast-path is skipped
    // Full parser produces empty keys between dots
    expect(toPath("..")).toEqual(["", ""]);
  });

  it("[👾] path with only a bracket", () => {
    expect(toPath("[0]")).toEqual(["0"]);
  });

  itProp.prop([fc.array(fc.stringMatching(/^[a-z]+$/), { minLength: 1, maxLength: 5 })])(
    "[🎲] dot-joined path splits correctly",
    (parts) => {
      const path = parts.join(".");
      expect(toPath(path)).toEqual(parts);
    }
  );
});
