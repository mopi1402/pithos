import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { toLower } from "./toLower";

describe("toLower", () => {
  describe("basic functionality", () => {
    it("converts uppercase to lowercase", () => {
      expect(toLower("HELLO")).toBe("hello");
      expect(toLower("WORLD")).toBe("world");
      expect(toLower("FOO")).toBe("foo");
      expect(toLower("BAR")).toBe("bar");
    });

    it("converts mixed case to lowercase", () => {
      expect(toLower("Hello World")).toBe("hello world");
      expect(toLower("CamelCase")).toBe("camelcase");
      expect(toLower("JavaScript")).toBe("javascript");
      expect(toLower("TypeScript")).toBe("typescript");
    });

    it("handles already lowercase strings", () => {
      expect(toLower("hello")).toBe("hello");
      expect(toLower("world")).toBe("world");
      expect(toLower("already lowercase")).toBe("already lowercase");
    });

    it("handles strings with numbers", () => {
      expect(toLower("HELLO123")).toBe("hello123");
      expect(toLower("Test456")).toBe("test456");
      expect(toLower("ABC123DEF")).toBe("abc123def");
    });
  });

  describe("empty and whitespace handling", () => {
    it("handles empty strings", () => {
      expect(toLower("")).toBe("");
    });

    it("preserves whitespace", () => {
      expect(toLower(" ")).toBe(" ");
      expect(toLower("  ")).toBe("  ");
      expect(toLower("HELLO   WORLD")).toBe("hello   world");
      expect(toLower("\t")).toBe("\t");
      expect(toLower("\n")).toBe("\n");
    });

    it("handles strings with only whitespace", () => {
      expect(toLower("   ")).toBe("   ");
      expect(toLower("\t\t")).toBe("\t\t");
      expect(toLower("\n\n")).toBe("\n\n");
    });
  });

  describe("special characters", () => {
    it("preserves special characters", () => {
      expect(toLower("!@#$HELLO%^&*")).toBe("!@#$hello%^&*");
      expect(toLower("HELLO-WORLD")).toBe("hello-world");
      expect(toLower("HELLO_WORLD")).toBe("hello_world");
      expect(toLower("HELLO.WORLD")).toBe("hello.world");
    });

    it("handles punctuation", () => {
      expect(toLower("HELLO, WORLD!")).toBe("hello, world!");
      expect(toLower("WHAT'S UP?")).toBe("what's up?");
      expect(toLower("HELLO: WORLD")).toBe("hello: world");
      expect(toLower("HELLO; WORLD")).toBe("hello; world");
    });

    it("handles brackets and parentheses", () => {
      expect(toLower("HELLO(WORLD)")).toBe("hello(world)");
      expect(toLower("HELLO[WORLD]")).toBe("hello[world]");
      expect(toLower("HELLO{WORLD}")).toBe("hello{world}");
      expect(toLower("HELLO<WORLD>")).toBe("hello<world>");
    });
  });

  describe("unicode support", () => {
    it("handles accented characters", () => {
      expect(toLower("CAFÉ")).toBe("café");
      expect(toLower("ÜBER")).toBe("über");
      expect(toLower("SEÑOR")).toBe("señor");
      expect(toLower("NAÏVE")).toBe("naïve");
      expect(toLower("RÉSUMÉ")).toBe("résumé");
    });

    it("handles cyrillic characters", () => {
      expect(toLower("МОСКВА")).toBe("москва");
      expect(toLower("САНКТ-ПЕТЕРБУРГ")).toBe("санкт-петербург");
      expect(toLower("КИЕВ")).toBe("киев");
    });

    it("handles greek characters", () => {
      expect(toLower("Αθήνα")).toBe("αθήνα");
      expect(toLower("ΘΕΣΣΑΛΟΝΙΚΗ")).toBe("θεσσαλονικη");
      expect(toLower("ΠΑΤΡΑ")).toBe("πατρα");
    });

    it("handles other unicode characters", () => {
      expect(toLower("İSTANBUL")).toBe("i̇stanbul");
      expect(toLower("ZÜRICH")).toBe("zürich");
      expect(toLower("MÜNCHEN")).toBe("münchen");
    });
  });

  describe("control characters", () => {
    it("handles tabs and newlines", () => {
      expect(toLower("TABS\tAND\nNEWLINES")).toBe("tabs\tand\nnewlines");
      expect(toLower("HELLO\tWORLD")).toBe("hello\tworld");
      expect(toLower("HELLO\nWORLD")).toBe("hello\nworld");
      expect(toLower("HELLO\r\nWORLD")).toBe("hello\r\nworld");
    });

    it("handles carriage returns", () => {
      expect(toLower("HELLO\rWORLD")).toBe("hello\rworld");
      expect(toLower("HELLO\r\nWORLD")).toBe("hello\r\nworld");
    });
  });

  describe("null and undefined handling", () => {
    it("[🎯] handles null input", () => {
      expect(toLower(null)).toBe("");
    });

    it("[🎯] handles undefined input", () => {
      expect(toLower(undefined)).toBe("");
    });
  });

  describe("real-world usage patterns", () => {
    it("normalizes user input", () => {
      expect(toLower("USERNAME")).toBe("username");
      expect(toLower("USER_NAME")).toBe("user_name");
      expect(toLower("USER-NAME")).toBe("user-name");
    });

    it("converts email addresses", () => {
      expect(toLower("USER@EXAMPLE.COM")).toBe("user@example.com");
      expect(toLower("TEST.USER@DOMAIN.ORG")).toBe("test.user@domain.org");
      expect(toLower("ADMIN@SITE.NET")).toBe("admin@site.net");
    });

    it("converts CSS class names", () => {
      expect(toLower("MY-COMPONENT")).toBe("my-component");
      expect(toLower("BUTTON_PRIMARY")).toBe("button_primary");
      expect(toLower("HEADER.NAV")).toBe("header.nav");
    });

    it("converts HTML tag names", () => {
      expect(toLower("DIV")).toBe("div");
      expect(toLower("SPAN")).toBe("span");
      expect(toLower("BUTTON")).toBe("button");
      expect(toLower("INPUT")).toBe("input");
    });

    it("converts environment variable names", () => {
      expect(toLower("DATABASE_URL")).toBe("database_url");
      expect(toLower("API_KEY")).toBe("api_key");
      expect(toLower("SECRET_TOKEN")).toBe("secret_token");
    });

    it("converts file extensions", () => {
      expect(toLower("TXT")).toBe("txt");
      expect(toLower("PDF")).toBe("pdf");
      expect(toLower("DOCX")).toBe("docx");
      expect(toLower("HTML")).toBe("html");
    });

    it("converts HTTP methods", () => {
      expect(toLower("GET")).toBe("get");
      expect(toLower("POST")).toBe("post");
      expect(toLower("PUT")).toBe("put");
      expect(toLower("DELETE")).toBe("delete");
    });

    it("converts protocol names", () => {
      expect(toLower("HTTP")).toBe("http");
      expect(toLower("HTTPS")).toBe("https");
      expect(toLower("FTP")).toBe("ftp");
      expect(toLower("WS")).toBe("ws");
    });
  });

  describe("edge cases", () => {
    it("handles single character strings", () => {
      expect(toLower("A")).toBe("a");
      expect(toLower("Z")).toBe("z");
      expect(toLower("1")).toBe("1");
      expect(toLower("!")).toBe("!");
    });

    it("handles very long strings", () => {
      const longString = "HELLO".repeat(1000);
      const expected = "hello".repeat(1000);
      expect(toLower(longString)).toBe(expected);
    });

    it("handles strings with only special characters", () => {
      expect(toLower("!@#$%^&*()")).toBe("!@#$%^&*()");
      expect(toLower("[]{}|\\:;\"'<>,.?/")).toBe("[]{}|\\:;\"'<>,.?/");
    });

    it("handles strings with only numbers", () => {
      expect(toLower("123456789")).toBe("123456789");
      expect(toLower("0")).toBe("0");
    });

    it("handles mixed content", () => {
      expect(toLower("HELLO123WORLD!@#")).toBe("hello123world!@#");
      expect(toLower("Test123_ABC!@#")).toBe("test123_abc!@#");
    });
  });

  describe("type safety", () => {
    it("accepts correct string type", () => {
      const str: string = "HELLO";
      expect(toLower(str)).toBe("hello");
    });

    it("handles mixed null/undefined types", () => {
      const str: string | null = null;
      expect(toLower(str)).toBe("");

      const str2: string | undefined = undefined;
      expect(toLower(str2)).toBe("");
    });
  });

  describe("performance edge cases", () => {
    it("handles repeated characters efficiently", () => {
      expect(toLower("AAAAAAAAAA")).toBe("aaaaaaaaaa");
      expect(toLower("ZZZZZZZZZZ")).toBe("zzzzzzzzzz");
    });

    it("handles alternating case", () => {
      expect(toLower("HeLlO")).toBe("hello");
      expect(toLower("WoRlD")).toBe("world");
      expect(toLower("CaMeLcAsE")).toBe("camelcase");
    });
  });

  describe("locale-specific behavior", () => {
    it("handles turkish i", () => {
      expect(toLower("İ")).toBe("i̇");
      expect(toLower("I")).toBe("i");
    });

    it("handles german eszett", () => {
      expect(toLower("GROSS")).toBe("gross");
      expect(toLower("STRASSE")).toBe("strasse");
    });
  });

  describe("Property-based tests", () => {
    itProp.prop([fc.string()])("[🎲] result equals native toLowerCase", (str) => {
      expect(toLower(str)).toBe(str.toLowerCase());
    });

    itProp.prop([fc.string()])("[🎲] idempotent - applying twice gives same result", (str) => {
      const once = toLower(str);
      const twice = toLower(once);
      expect(once).toBe(twice);
    });

    itProp.prop([fc.string()])("[🎲] result length equals input length", (str) => {
      expect(toLower(str).length).toBe(str.toLowerCase().length);
    });
  });
});
