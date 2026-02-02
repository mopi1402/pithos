import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { trim } from "./trim";

describe("trim", () => {
  describe("basic functionality", () => {
    it("removes leading and trailing spaces", () => {
      expect(trim("  hello  ")).toBe("hello");
      expect(trim(" hello ")).toBe("hello");
      expect(trim("   hello   ")).toBe("hello");
    });

    it("handles strings without whitespace", () => {
      expect(trim("hello world")).toBe("hello world");
      expect(trim("hello")).toBe("hello");
      expect(trim("test")).toBe("test");
    });

    it("handles empty strings", () => {
      expect(trim("")).toBe("");
    });

    it("handles strings with only whitespace", () => {
      expect(trim("   ")).toBe("");
      expect(trim(" ")).toBe("");
      expect(trim("  ")).toBe("");
    });
  });

  describe("different whitespace characters", () => {
    it("handles tabs", () => {
      expect(trim("\thello\t")).toBe("hello");
      expect(trim("\t\thello\t\t")).toBe("hello");
    });

    it("handles newlines", () => {
      expect(trim("\nhello\n")).toBe("hello");
      expect(trim("\r\nhello\r\n")).toBe("hello");
      expect(trim("\rhello\r")).toBe("hello");
    });

    it("handles mixed whitespace", () => {
      expect(trim("\t\nhello\r\n")).toBe("hello");
      expect(trim("  \t  \n  ")).toBe("");
      expect(trim("\t \n hello \n \t")).toBe("hello");
    });

    it("handles carriage returns", () => {
      expect(trim("\rhello\r")).toBe("hello");
      expect(trim("\r\nhello\r\n")).toBe("hello");
    });
  });

  describe("unicode whitespace support", () => {
    it("handles non-breaking space", () => {
      expect(trim("\u00A0hello\u00A0")).toBe("hello");
      expect(trim("\u00A0\u00A0hello\u00A0\u00A0")).toBe("hello");
    });

    it("handles en quad", () => {
      expect(trim("\u2000hello\u2000")).toBe("hello");
    });

    it("handles em quad", () => {
      expect(trim("\u2001hello\u2001")).toBe("hello");
    });

    it("handles en space", () => {
      expect(trim("\u2002hello\u2002")).toBe("hello");
    });

    it("handles em space", () => {
      expect(trim("\u2003hello\u2003")).toBe("hello");
    });

    it("handles three-per-em space", () => {
      expect(trim("\u2004hello\u2004")).toBe("hello");
    });

    it("handles four-per-em space", () => {
      expect(trim("\u2005hello\u2005")).toBe("hello");
    });

    it("handles six-per-em space", () => {
      expect(trim("\u2006hello\u2006")).toBe("hello");
    });

    it("handles figure space", () => {
      expect(trim("\u2007hello\u2007")).toBe("hello");
    });

    it("handles punctuation space", () => {
      expect(trim("\u2008hello\u2008")).toBe("hello");
    });

    it("handles thin space", () => {
      expect(trim("\u2009hello\u2009")).toBe("hello");
    });

    it("handles hair space", () => {
      expect(trim("\u200Ahello\u200A")).toBe("hello");
    });

    it("handles narrow no-break space", () => {
      expect(trim("\u202Fhello\u202F")).toBe("hello");
    });

    it("handles medium mathematical space", () => {
      expect(trim("\u205Fhello\u205F")).toBe("hello");
    });

    it("handles ideographic space", () => {
      expect(trim("\u3000hello\u3000")).toBe("hello");
    });

    it("handles mixed unicode whitespace", () => {
      expect(trim("\u00A0\u2000hello\u2000\u00A0")).toBe("hello");
      expect(trim("\u2009\u200Ahello\u200A\u2009")).toBe("hello");
    });
  });

  describe("null and undefined handling", () => {
    it("[🎯] handles null input", () => {
      expect(trim(null)).toBe("");
    });

    it("[🎯] handles undefined input", () => {
      expect(trim(undefined)).toBe("");
    });
  });

  describe("real-world usage patterns", () => {
    it("cleans user input", () => {
      expect(trim("  john@example.com  ")).toBe("john@example.com");
      expect(trim("  user@domain.org  ")).toBe("user@domain.org");
    });

    it("cleans form data", () => {
      expect(trim("  John Doe  ")).toBe("John Doe");
      expect(trim("  Jane Smith  ")).toBe("Jane Smith");
    });

    it("cleans search queries", () => {
      expect(trim("  javascript tutorial  ")).toBe("javascript tutorial");
      expect(trim("  react hooks  ")).toBe("react hooks");
    });

    it("cleans file paths", () => {
      expect(trim("  /usr/local/bin  ")).toBe("/usr/local/bin");
      expect(trim("  C:\\Windows\\System32  ")).toBe("C:\\Windows\\System32");
    });

    it("cleans configuration values", () => {
      expect(trim("  production  ")).toBe("production");
      expect(trim("  development  ")).toBe("development");
    });

    it("cleans API responses", () => {
      expect(trim('  {"status": "success"}  ')).toBe('{"status": "success"}');
      expect(trim('  {"error": "not found"}  ')).toBe('{"error": "not found"}');
    });

    it("cleans CSV data", () => {
      expect(trim("  John,Doe,25  ")).toBe("John,Doe,25");
      expect(trim("  Jane,Smith,30  ")).toBe("Jane,Smith,30");
    });

    it("cleans HTML content", () => {
      expect(trim("  <div>Hello World</div>  ")).toBe("<div>Hello World</div>");
      expect(trim("  <span>Text</span>  ")).toBe("<span>Text</span>");
    });

    it("cleans SQL queries", () => {
      expect(trim("  SELECT * FROM users  ")).toBe("SELECT * FROM users");
      expect(trim("  INSERT INTO table VALUES (1, 'test')  ")).toBe(
        "INSERT INTO table VALUES (1, 'test')"
      );
    });

    it("cleans URLs", () => {
      expect(trim("  https://example.com  ")).toBe("https://example.com");
      expect(trim("  http://localhost:3000  ")).toBe("http://localhost:3000");
    });

    it("cleans environment variables", () => {
      expect(trim("  DATABASE_URL  ")).toBe("DATABASE_URL");
      expect(trim("  API_KEY  ")).toBe("API_KEY");
    });
  });

  describe("edge cases", () => {
    it("handles single character strings", () => {
      expect(trim("a")).toBe("a");
      expect(trim(" a ")).toBe("a");
      expect(trim("  a  ")).toBe("a");
    });

    it("handles strings with only whitespace", () => {
      expect(trim("\t")).toBe("");
      expect(trim("\n")).toBe("");
      expect(trim("\r")).toBe("");
      expect(trim("\t\n\r")).toBe("");
    });

    it("handles very long strings", () => {
      const longString = "  " + "hello".repeat(1000) + "  ";
      const expected = "hello".repeat(1000);
      expect(trim(longString)).toBe(expected);
    });

    it("handles strings with internal whitespace", () => {
      expect(trim("  hello   world  ")).toBe("hello   world");
      expect(trim("  hello\t\tworld  ")).toBe("hello\t\tworld");
      expect(trim("  hello\n\nworld  ")).toBe("hello\n\nworld");
    });

    it("handles strings with special characters", () => {
      expect(trim("  !@#$hello%^&*  ")).toBe("!@#$hello%^&*");
      expect(trim("  hello-world  ")).toBe("hello-world");
      expect(trim("  hello_world  ")).toBe("hello_world");
    });

    it("handles strings with numbers", () => {
      expect(trim("  123  ")).toBe("123");
      expect(trim("  hello123  ")).toBe("hello123");
      expect(trim("  123hello  ")).toBe("123hello");
    });

    it("handles unicode characters", () => {
      expect(trim("  café  ")).toBe("café");
      expect(trim("  москва  ")).toBe("москва");
      expect(trim("  αθήνα  ")).toBe("αθήνα");
    });
  });

  describe("type safety", () => {
    it("accepts correct string type", () => {
      const str: string = "  hello  ";
      expect(trim(str)).toBe("hello");
    });

    it("handles mixed null/undefined types", () => {
      const str: string | null = null;
      expect(trim(str)).toBe("");

      const str2: string | undefined = undefined;
      expect(trim(str2)).toBe("");
    });
  });

  describe("performance edge cases", () => {
    it("handles strings with only leading whitespace", () => {
      expect(trim("  hello")).toBe("hello");
      expect(trim("\thello")).toBe("hello");
      expect(trim("\nhello")).toBe("hello");
    });

    it("handles strings with only trailing whitespace", () => {
      expect(trim("hello  ")).toBe("hello");
      expect(trim("hello\t")).toBe("hello");
      expect(trim("hello\n")).toBe("hello");
    });

    it("handles strings with no whitespace", () => {
      expect(trim("hello")).toBe("hello");
      expect(trim("test")).toBe("test");
      expect(trim("123")).toBe("123");
    });

    it("handles very long whitespace", () => {
      const longWhitespace = " ".repeat(1000);
      expect(trim(longWhitespace)).toBe("");
      expect(trim(longWhitespace + "hello" + longWhitespace)).toBe("hello");
    });
  });

  describe("whitespace combinations", () => {
    it("handles all standard whitespace", () => {
      expect(trim(" \t\n\r hello \t\n\r ")).toBe("hello");
    });

    it("handles unicode whitespace combinations", () => {
      expect(trim("\u00A0\u2000\u2001hello\u2001\u2000\u00A0")).toBe("hello");
    });

    it("handles mixed standard and unicode whitespace", () => {
      expect(trim(" \u00A0\t\u2000hello\u2000\t\u00A0 ")).toBe("hello");
    });
  });

  describe("Property-based tests", () => {
    itProp.prop([fc.string()])("[🎲] result equals native trim", (str) => {
      expect(trim(str)).toBe(str.trim());
    });

    itProp.prop([fc.string()])("[🎲] idempotent - applying twice gives same result", (str) => {
      const once = trim(str);
      const twice = trim(once);
      expect(once).toBe(twice);
    });

    itProp.prop([fc.string()])("[🎲] result does not start or end with space", (str) => {
      const result = trim(str);
      if (result.length > 0) {
        expect(result[0]).not.toBe(" ");
        expect(result[result.length - 1]).not.toBe(" ");
      }
    });
  });
});
