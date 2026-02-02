import { describe, test, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { upperFirst } from "./upperFirst";
import { capitalize } from "../../arkhe/string/capitalize";

describe("upperFirst", () => {
  test("upperFirst is a wrapper of capitalize", () => {
    expect(upperFirst).not.toBe(capitalize);
    
    expect(upperFirst("hello")).toBe(capitalize("hello"));
    expect(upperFirst("hello")).toBe("Hello");
    
    expect(upperFirst("HELLO")).toBe(capitalize("HELLO"));
    expect(upperFirst("HELLO")).toBe("Hello");
    
    expect(upperFirst("")).toBe(capitalize(""));
    expect(upperFirst("")).toBe("");
  });

  itProp.prop([fc.string({ minLength: 1 })])(
    "[🎲] first character is uppercase if alphabetic",
    (str) => {
      const result = upperFirst(str);
      if (/[a-zA-Z]/.test(str[0])) {
        expect(result[0]).toBe(str[0].toUpperCase());
      }
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] consistent with capitalize",
    (str) => {
      expect(upperFirst(str)).toBe(capitalize(str));
    }
  );
});
