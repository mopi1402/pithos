import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { toUpper } from "./toUpper";

describe("toUpper", () => {
  describe("basic functionality", () => {
    it("converts lowercase to uppercase", () => {
      expect(toUpper("hello")).toBe("HELLO");
      expect(toUpper("world")).toBe("WORLD");
      expect(toUpper("foo")).toBe("FOO");
      expect(toUpper("bar")).toBe("BAR");
    });

    it("converts mixed case to uppercase", () => {
      expect(toUpper("Hello World")).toBe("HELLO WORLD");
      expect(toUpper("camelCase")).toBe("CAMELCASE");
      expect(toUpper("javascript")).toBe("JAVASCRIPT");
      expect(toUpper("typescript")).toBe("TYPESCRIPT");
    });

    it("handles already uppercase strings", () => {
      expect(toUpper("HELLO")).toBe("HELLO");
      expect(toUpper("WORLD")).toBe("WORLD");
      expect(toUpper("ALREADY UPPERCASE")).toBe("ALREADY UPPERCASE");
    });

    it("handles strings with numbers", () => {
      expect(toUpper("hello123")).toBe("HELLO123");
      expect(toUpper("test456")).toBe("TEST456");
      expect(toUpper("abc123def")).toBe("ABC123DEF");
    });
  });

  describe("empty and whitespace handling", () => {
    it("handles empty strings", () => {
      expect(toUpper("")).toBe("");
    });

    it("preserves whitespace", () => {
      expect(toUpper(" ")).toBe(" ");
      expect(toUpper("  ")).toBe("  ");
      expect(toUpper("hello   world")).toBe("HELLO   WORLD");
      expect(toUpper("\t")).toBe("\t");
      expect(toUpper("\n")).toBe("\n");
    });

    it("handles strings with only whitespace", () => {
      expect(toUpper("   ")).toBe("   ");
      expect(toUpper("\t\t")).toBe("\t\t");
      expect(toUpper("\n\n")).toBe("\n\n");
    });
  });

  describe("special characters", () => {
    it("preserves special characters", () => {
      expect(toUpper("!@#$hello%^&*")).toBe("!@#$HELLO%^&*");
      expect(toUpper("hello-world")).toBe("HELLO-WORLD");
      expect(toUpper("hello_world")).toBe("HELLO_WORLD");
      expect(toUpper("hello.world")).toBe("HELLO.WORLD");
    });

    it("handles punctuation", () => {
      expect(toUpper("hello, world!")).toBe("HELLO, WORLD!");
      expect(toUpper("what's up?")).toBe("WHAT'S UP?");
      expect(toUpper("hello: world")).toBe("HELLO: WORLD");
      expect(toUpper("hello; world")).toBe("HELLO; WORLD");
    });

    it("handles brackets and parentheses", () => {
      expect(toUpper("hello(world)")).toBe("HELLO(WORLD)");
      expect(toUpper("hello[world]")).toBe("HELLO[WORLD]");
      expect(toUpper("hello{world}")).toBe("HELLO{WORLD}");
      expect(toUpper("hello<world>")).toBe("HELLO<WORLD>");
    });
  });

  describe("unicode support", () => {
    it("handles accented characters", () => {
      expect(toUpper("café")).toBe("CAFÉ");
      expect(toUpper("über")).toBe("ÜBER");
      expect(toUpper("señor")).toBe("SEÑOR");
      expect(toUpper("naïve")).toBe("NAÏVE");
      expect(toUpper("résumé")).toBe("RÉSUMÉ");
    });

    it("handles cyrillic characters", () => {
      expect(toUpper("москва")).toBe("МОСКВА");
      expect(toUpper("санкт-петербург")).toBe("САНКТ-ПЕТЕРБУРГ");
      expect(toUpper("киев")).toBe("КИЕВ");
    });

    it("handles greek characters", () => {
      expect(toUpper("αθήνα")).toBe("ΑΘΉΝΑ");
      expect(toUpper("θεσσαλονικη")).toBe("ΘΕΣΣΑΛΟΝΙΚΗ");
      expect(toUpper("θεσσαλονίκη")).toBe("ΘΕΣΣΑΛΟΝΊΚΗ");
      expect(toUpper("πατρα")).toBe("ΠΑΤΡΑ");
    });

    it("handles other unicode characters", () => {
      expect(toUpper("istanbul")).toBe("ISTANBUL");
      expect(toUpper("i̇stanbul")).toBe("İSTANBUL");
      expect(toUpper("zürich")).toBe("ZÜRICH");
      expect(toUpper("münchen")).toBe("MÜNCHEN");
    });
  });

  describe("control characters", () => {
    it("handles tabs and newlines", () => {
      expect(toUpper("tabs\tand\nnewlines")).toBe("TABS\tAND\nNEWLINES");
      expect(toUpper("hello\tworld")).toBe("HELLO\tWORLD");
      expect(toUpper("hello\nworld")).toBe("HELLO\nWORLD");
      expect(toUpper("hello\r\nworld")).toBe("HELLO\r\nWORLD");
    });

    it("handles carriage returns", () => {
      expect(toUpper("hello\rworld")).toBe("HELLO\rWORLD");
      expect(toUpper("hello\r\nworld")).toBe("HELLO\r\nWORLD");
    });
  });

  describe("null and undefined handling", () => {
    it("[🎯] handles null input", () => {
      expect(toUpper(null)).toBe("");
    });

    it("[🎯] handles undefined input", () => {
      expect(toUpper(undefined)).toBe("");
    });
  });

  describe("real-world usage patterns", () => {
    it("normalizes constants", () => {
      expect(toUpper("api_key")).toBe("API_KEY");
      expect(toUpper("user_name")).toBe("USER_NAME");
      expect(toUpper("user-name")).toBe("USER-NAME");
    });

    it("converts environment variable names", () => {
      expect(toUpper("database_url")).toBe("DATABASE_URL");
      expect(toUpper("api_key")).toBe("API_KEY");
      expect(toUpper("secret_token")).toBe("SECRET_TOKEN");
    });

    it("converts CSS property names", () => {
      expect(toUpper("background-color")).toBe("BACKGROUND-COLOR");
      expect(toUpper("font_size")).toBe("FONT_SIZE");
      expect(toUpper("margin.top")).toBe("MARGIN.TOP");
    });

    it("converts HTML attribute names", () => {
      expect(toUpper("data-value")).toBe("DATA-VALUE");
      expect(toUpper("aria_label")).toBe("ARIA_LABEL");
      expect(toUpper("class.name")).toBe("CLASS.NAME");
    });

    it("converts file extensions", () => {
      expect(toUpper("txt")).toBe("TXT");
      expect(toUpper("pdf")).toBe("PDF");
      expect(toUpper("docx")).toBe("DOCX");
      expect(toUpper("html")).toBe("HTML");
    });

    it("converts status values", () => {
      expect(toUpper("active")).toBe("ACTIVE");
      expect(toUpper("inactive")).toBe("INACTIVE");
      expect(toUpper("pending")).toBe("PENDING");
      expect(toUpper("completed")).toBe("COMPLETED");
    });

    it("converts error codes", () => {
      expect(toUpper("not_found")).toBe("NOT_FOUND");
      expect(toUpper("bad_request")).toBe("BAD_REQUEST");
      expect(toUpper("internal_error")).toBe("INTERNAL_ERROR");
    });

    it("converts HTTP methods", () => {
      expect(toUpper("get")).toBe("GET");
      expect(toUpper("post")).toBe("POST");
      expect(toUpper("put")).toBe("PUT");
      expect(toUpper("delete")).toBe("DELETE");
    });

    it("converts protocol names", () => {
      expect(toUpper("http")).toBe("HTTP");
      expect(toUpper("https")).toBe("HTTPS");
      expect(toUpper("ftp")).toBe("FTP");
      expect(toUpper("ws")).toBe("WS");
    });
  });

  describe("edge cases", () => {
    it("handles single character strings", () => {
      expect(toUpper("a")).toBe("A");
      expect(toUpper("z")).toBe("Z");
      expect(toUpper("1")).toBe("1");
      expect(toUpper("!")).toBe("!");
    });

    it("handles very long strings", () => {
      const longString = "hello".repeat(1000);
      const expected = "HELLO".repeat(1000);
      expect(toUpper(longString)).toBe(expected);
    });

    it("handles strings with only special characters", () => {
      expect(toUpper("!@#$%^&*()")).toBe("!@#$%^&*()");
      expect(toUpper("[]{}|\\:;\"'<>,.?/")).toBe("[]{}|\\:;\"'<>,.?/");
    });

    it("handles strings with only numbers", () => {
      expect(toUpper("123456789")).toBe("123456789");
      expect(toUpper("0")).toBe("0");
    });

    it("handles mixed content", () => {
      expect(toUpper("hello123world!@#")).toBe("HELLO123WORLD!@#");
      expect(toUpper("test123_abc!@#")).toBe("TEST123_ABC!@#");
    });
  });

  describe("type safety", () => {
    it("accepts correct string type", () => {
      const str: string = "hello";
      expect(toUpper(str)).toBe("HELLO");
    });

    it("handles mixed null/undefined types", () => {
      const str: string | null = null;
      expect(toUpper(str)).toBe("");

      const str2: string | undefined = undefined;
      expect(toUpper(str2)).toBe("");
    });
  });

  describe("performance edge cases", () => {
    it("handles repeated characters efficiently", () => {
      expect(toUpper("aaaaaaaaaa")).toBe("AAAAAAAAAA");
      expect(toUpper("zzzzzzzzzz")).toBe("ZZZZZZZZZZ");
    });

    it("handles alternating case", () => {
      expect(toUpper("hElLo")).toBe("HELLO");
      expect(toUpper("WoRlD")).toBe("WORLD");
      expect(toUpper("CaMeLcAsE")).toBe("CAMELCASE");
    });
  });

  describe("locale-specific behavior", () => {
    it("handles turkish i", () => {
      expect(toUpper("i")).toBe("I");
      expect(toUpper("i̇")).toBe("İ");
    });

    it("handles german eszett", () => {
      expect(toUpper("gross")).toBe("GROSS");
      expect(toUpper("strasse")).toBe("STRASSE");
    });
  });

  describe("unicode normalization", () => {
    it("handles precomposed characters", () => {
      expect(toUpper("café")).toBe("CAFÉ");
      expect(toUpper("naïve")).toBe("NAÏVE");
    });

    it("handles decomposed characters", () => {
      expect(toUpper("cafe\u0301")).toBe("CAFE\u0301");
      expect(toUpper("naive\u0308")).toBe("NAIVE\u0308");
    });
  });

  describe("Property-based tests", () => {
    itProp.prop([fc.string()])("[🎲] result equals native toUpperCase", (str) => {
      expect(toUpper(str)).toBe(str.toUpperCase());
    });

    itProp.prop([fc.string()])("[🎲] idempotent - applying twice gives same result", (str) => {
      const once = toUpper(str);
      const twice = toUpper(once);
      expect(once).toBe(twice);
    });

    itProp.prop([fc.string()])("[🎲] result length equals input length", (str) => {
      expect(toUpper(str).length).toBe(str.toUpperCase().length);
    });
  });
});
