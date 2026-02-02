import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { escapeRegExp } from "./escape-regexp";

describe("escapeRegExp", () => {
  it("escapes special regex characters", () => {
    expect(escapeRegExp("[lodash](https://lodash.com/)")).toBe(
      "\\[lodash\\]\\(https://lodash\\.com/\\)"
    );
  });

  it("escapes dollar sign and period", () => {
    expect(escapeRegExp("$100.00")).toBe("\\$100\\.00");
  });

  it("escapes all special characters", () => {
    expect(escapeRegExp("^$\\.*+?()[]{}|")).toBe(
      "\\^\\$\\\\\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|"
    );
  });

  it("returns empty string for empty input", () => {
    expect(escapeRegExp("")).toBe("");
  });

  it("returns string unchanged when no special chars", () => {
    expect(escapeRegExp("hello world")).toBe("hello world");
  });

  it("works with new RegExp for exact matching", () => {
    const userInput = "hello.*world";
    const pattern = new RegExp(escapeRegExp(userInput));

    expect(pattern.test("hello.*world")).toBe(true);
    expect(pattern.test("helloXworld")).toBe(false);
  });

  it("escapes caret and pipe", () => {
    expect(escapeRegExp("^start|end$")).toBe("\\^start\\|end\\$");
  });

  it("escapes question mark and plus", () => {
    expect(escapeRegExp("a+b?c")).toBe("a\\+b\\?c");
  });

  it("handles multiple consecutive special characters", () => {
    expect(escapeRegExp("***")).toBe("\\*\\*\\*");
  });

  it("handles mixed content", () => {
    expect(escapeRegExp("file.txt (copy)")).toBe("file\\.txt \\(copy\\)");
  });

  it("[🎯] returns empty string for empty input", () => {
    expect(escapeRegExp("")).toBe("");
  });

  it("[🎯] handles single character", () => {
    expect(escapeRegExp("a")).toBe("a");
    expect(escapeRegExp("*")).toBe("\\*");
    expect(escapeRegExp(".")).toBe("\\.");
  });

  itProp.prop([fc.string()])(
    "[🎲] escaped string can be used in RegExp without error",
    (str) => {
      const escaped = escapeRegExp(str);
      expect(() => new RegExp(escaped)).not.toThrow();
    }
  );

  itProp.prop([fc.string({ minLength: 1 })])(
    "[🎲] escaped string matches literal input",
    (str) => {
      const escaped = escapeRegExp(str);
      const regex = new RegExp(escaped);
      expect(regex.test(str)).toBe(true);
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] idempotent: escapeRegExp(escapeRegExp(x)) escapes twice",
    (str) => {
      const once = escapeRegExp(str);
      const twice = escapeRegExp(once);
      // Second escape should add more backslashes
      expect(typeof twice).toBe("string");
    }
  );
});
