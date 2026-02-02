/**
 * Tests for String Code Builder
 */

import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { createGeneratorContext, pushPath, increaseIndent } from "../../context";
import {
  generateStringTypeCheck,
  generateMinLengthCheck,
  generateMaxLengthCheck,
  generateLengthCheck,
  generateEmailCheck,
  generateUrlCheck,
  generateUuidCheck,
  generateRegexCheck,
  generateIncludesCheck,
  generateStartsWithCheck,
  generateEndsWithCheck,
  generateStringValidation,
  STRING_PATTERNS,
} from "./string";

describe("String Code Builder", () => {
  describe("generateStringTypeCheck", () => {
    it("generates correct type check code", () => {
      const ctx = createGeneratorContext();
      const result = generateStringTypeCheck("value", ctx);
      expect(result.code).toBe('if (typeof value !== "string") return "Expected string";');
    });

    it("includes path in error message when path is set", () => {
      const ctx = pushPath(createGeneratorContext(), "name");
      const result = generateStringTypeCheck("v_0", ctx);
      expect(result.code).toBe('if (typeof v_0 !== "string") return "Property \'name\': Expected string";');
    });

    it("uses custom error message when provided", () => {
      const ctx = createGeneratorContext();
      const result = generateStringTypeCheck("value", ctx, "Custom error");
      expect(result.code).toBe('if (typeof value !== "string") return "Custom error";');
    });

    it("adds indentation in debug mode", () => {
      const ctx = increaseIndent(createGeneratorContext({ debug: true }));
      const result = generateStringTypeCheck("value", ctx);
      // In debug mode, the code includes a comment before the if statement
      expect(result.code).toContain("// Type check: string");
      expect(result.code).toContain("if (typeof value !==");
    });
  });

  describe("generateMinLengthCheck", () => {
    it("generates correct minLength check code", () => {
      const ctx = createGeneratorContext();
      const result = generateMinLengthCheck("value", 5, ctx);
      expect(result.code).toBe('if (value.length < 5) return "String must be at least 5 characters long";');
    });

    it("uses custom error message when provided", () => {
      const ctx = createGeneratorContext();
      const result = generateMinLengthCheck("value", 5, ctx, "Too short!");
      expect(result.code).toBe('if (value.length < 5) return "Too short!";');
    });
  });

  describe("generateMaxLengthCheck", () => {
    it("generates correct maxLength check code", () => {
      const ctx = createGeneratorContext();
      const result = generateMaxLengthCheck("value", 100, ctx);
      expect(result.code).toBe('if (value.length > 100) return "String must be at most 100 characters long";');
    });
  });

  describe("generateLengthCheck", () => {
    it("generates correct exact length check code", () => {
      const ctx = createGeneratorContext();
      const result = generateLengthCheck("value", 10, ctx);
      expect(result.code).toBe('if (value.length !== 10) return "String must be exactly 10 characters long";');
    });
  });

  describe("generateStringValidation", () => {
    it("generates type check only when no constraints", () => {
      const ctx = createGeneratorContext();
      const result = generateStringValidation("value", ctx);
      expect(result.code).toHaveLength(1);
      expect(result.code[0]).toContain('typeof value !== "string"');
    });

    it("generates all constraint checks", () => {
      const ctx = createGeneratorContext();
      const result = generateStringValidation("value", ctx, {
        minLength: { value: 5 },
        maxLength: { value: 100 },
      });
      expect(result.code).toHaveLength(3);
      expect(result.code[0]).toContain('typeof value !== "string"');
      expect(result.code[1]).toContain("value.length < 5");
      expect(result.code[2]).toContain("value.length > 100");
    });
  });
});

describe("String Code Builder - Advanced Constraints", () => {
  describe("generateEmailCheck", () => {
    it("generates correct email check code", () => {
      const ctx = createGeneratorContext();
      const result = generateEmailCheck("value", ctx);
      expect(result.code).toContain("test(value)");
      expect(result.code).toContain('return "Invalid email format"');
    });

    it("uses custom error message when provided", () => {
      const ctx = createGeneratorContext();
      const result = generateEmailCheck("value", ctx, "Please enter a valid email");
      expect(result.code).toContain('return "Please enter a valid email"');
    });
  });

  describe("generateUrlCheck", () => {
    it("generates correct URL check code", () => {
      const ctx = createGeneratorContext();
      const result = generateUrlCheck("value", ctx);
      expect(result.code).toContain("test(value)");
      expect(result.code).toContain('return "Invalid URL format"');
    });
  });

  describe("generateUuidCheck", () => {
    it("generates correct UUID check code", () => {
      const ctx = createGeneratorContext();
      const result = generateUuidCheck("value", ctx);
      expect(result.code).toContain("test(value)");
      expect(result.code).toContain('return "Invalid UUID format"');
    });
  });

  describe("generateRegexCheck", () => {
    it("generates correct regex check code with external reference", () => {
      const ctx = createGeneratorContext();
      const result = generateRegexCheck("value", /^[a-z]+$/, ctx);
      expect(result.code).toContain('externals.get("ref_0")');
      expect(result.code).toContain('return "String must match pattern');
      expect(result.ctx.externals.size).toBe(1);
    });
  });

  describe("generateIncludesCheck", () => {
    it("generates correct includes check code", () => {
      const ctx = createGeneratorContext();
      const result = generateIncludesCheck("value", "foo", ctx);
      expect(result.code).toBe('if (!value.includes("foo")) return "String must include \\"foo\\"";');
    });
  });

  describe("generateStartsWithCheck", () => {
    it("generates correct startsWith check code", () => {
      const ctx = createGeneratorContext();
      const result = generateStartsWithCheck("value", "http", ctx);
      expect(result.code).toBe('if (!value.startsWith("http")) return "String must start with \\"http\\"";');
    });
  });

  describe("generateEndsWithCheck", () => {
    it("generates correct endsWith check code", () => {
      const ctx = createGeneratorContext();
      const result = generateEndsWithCheck("value", ".js", ctx);
      expect(result.code).toBe('if (!value.endsWith(".js")) return "String must end with \\".js\\"";');
    });
  });

  describe("STRING_PATTERNS", () => {
    it("exports valid regex patterns", () => {
      expect(STRING_PATTERNS.EMAIL).toBeInstanceOf(RegExp);
      expect(STRING_PATTERNS.URL).toBeInstanceOf(RegExp);
      expect(STRING_PATTERNS.UUID).toBeInstanceOf(RegExp);
    });

    it("EMAIL pattern matches valid emails", () => {
      expect(STRING_PATTERNS.EMAIL.test("test@example.com")).toBe(true);
      expect(STRING_PATTERNS.EMAIL.test("user.name@domain.org")).toBe(true);
      expect(STRING_PATTERNS.EMAIL.test("invalid")).toBe(false);
      expect(STRING_PATTERNS.EMAIL.test("@domain.com")).toBe(false);
    });

    it("URL pattern matches valid URLs", () => {
      expect(STRING_PATTERNS.URL.test("https://example.com")).toBe(true);
      expect(STRING_PATTERNS.URL.test("http://localhost:3000")).toBe(true);
      // Note: URL_REGEX only supports http/https, not ftp (by design - see patterns.ts)
      expect(STRING_PATTERNS.URL.test("ftp://files.example.com")).toBe(false);
      expect(STRING_PATTERNS.URL.test("invalid")).toBe(false);
    });

    it("UUID pattern matches valid UUIDs", () => {
      expect(STRING_PATTERNS.UUID.test("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
      expect(STRING_PATTERNS.UUID.test("invalid")).toBe(false);
    });
  });

  describe("generateStringValidation with advanced constraints", () => {
    it("generates all advanced constraint checks", () => {
      const ctx = createGeneratorContext();
      const result = generateStringValidation("value", ctx, {
        minLength: { value: 5 },
        email: {},
        includes: { value: "@" },
      });
      expect(result.code.length).toBeGreaterThanOrEqual(4);
      expect(result.code[0]).toContain('typeof value !== "string"');
      expect(result.code[1]).toContain("value.length < 5");
    });
  });
});

describe("String generated code execution", () => {
  it("string type check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const result = generateStringTypeCheck("value", ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", `${result.code} return true;`);
    
    expect(fn("hello")).toBe(true);
    expect(fn(123)).toBe("Expected string");
    expect(fn(null)).toBe("Expected string");
  });

  it("string minLength check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateStringTypeCheck("value", ctx);
    const minCheck = generateMinLengthCheck("value", 5, ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", `${typeCheck.code}\n${minCheck.code}\nreturn true;`);
    
    expect(fn("hello")).toBe(true);
    expect(fn("hello world")).toBe(true);
    expect(fn("hi")).toBe("String must be at least 5 characters long");
  });

  it("email check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateStringTypeCheck("value", ctx);
    const emailCheck = generateEmailCheck("value", typeCheck.ctx);
    
    // Create externals map
    const externals = emailCheck.ctx.externals;
    
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", "externals", `${typeCheck.code}\n${emailCheck.code}\nreturn true;`);
    
    expect(fn("test@example.com", externals)).toBe(true);
    expect(fn("user.name@domain.org", externals)).toBe(true);
    expect(fn("invalid", externals)).toBe("Invalid email format");
    expect(fn("@domain.com", externals)).toBe("Invalid email format");
  });

  it("url check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateStringTypeCheck("value", ctx);
    const urlCheck = generateUrlCheck("value", typeCheck.ctx);
    
    // Create externals map
    const externals = urlCheck.ctx.externals;
    
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", "externals", `${typeCheck.code}\n${urlCheck.code}\nreturn true;`);
    
    expect(fn("https://example.com", externals)).toBe(true);
    expect(fn("http://localhost:3000/path", externals)).toBe(true);
    expect(fn("invalid", externals)).toBe("Invalid URL format");
  });

  it("uuid check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateStringTypeCheck("value", ctx);
    const uuidCheck = generateUuidCheck("value", typeCheck.ctx);
    
    // Create externals map
    const externals = uuidCheck.ctx.externals;
    
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", "externals", `${typeCheck.code}\n${uuidCheck.code}\nreturn true;`);
    
    expect(fn("550e8400-e29b-41d4-a716-446655440000", externals)).toBe(true);
    expect(fn("invalid", externals)).toBe("Invalid UUID format");
  });

  it("includes check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateStringTypeCheck("value", ctx);
    const includesCheck = generateIncludesCheck("value", "foo", ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", `${typeCheck.code}\n${includesCheck.code}\nreturn true;`);
    
    expect(fn("hello foo world")).toBe(true);
    expect(fn("foobar")).toBe(true);
    expect(fn("hello world")).toContain("must include");
  });

  it("startsWith check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateStringTypeCheck("value", ctx);
    const startsWithCheck = generateStartsWithCheck("value", "http", ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", `${typeCheck.code}\n${startsWithCheck.code}\nreturn true;`);
    
    expect(fn("https://example.com")).toBe(true);
    expect(fn("http://example.com")).toBe(true);
    expect(fn("ftp://example.com")).toContain("must start with");
  });

  it("endsWith check works correctly when executed", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateStringTypeCheck("value", ctx);
    const endsWithCheck = generateEndsWithCheck("value", ".js", ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", `${typeCheck.code}\n${endsWithCheck.code}\nreturn true;`);
    
    expect(fn("index.js")).toBe(true);
    expect(fn("app.js")).toBe(true);
    expect(fn("index.ts")).toContain("must end with");
  });

  it("regex check works correctly when executed with externals", () => {
    const ctx = createGeneratorContext();
    const typeCheck = generateStringTypeCheck("value", ctx);
    const regexCheck = generateRegexCheck("value", /^[a-z]+$/, typeCheck.ctx);
    
    // Create externals map
    const externals = regexCheck.ctx.externals;
    
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", "externals", `${typeCheck.code}\n${regexCheck.code}\nreturn true;`);
    
    expect(fn("hello", externals)).toBe(true);
    expect(fn("abc", externals)).toBe(true);
    expect(fn("Hello", externals)).toBe("String must match pattern ^[a-z]+$");
    expect(fn("123", externals)).toBe("String must match pattern ^[a-z]+$");
  });
});


// ============================================================================
// Property-Based Tests
// Feature: kanon-jit-optimization
// Property 2: String Constraint Code Generation
// Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5
// ============================================================================

describe("[🎲] Property 2: String Constraint Code Generation", () => {
  // ============================================================================
  // Property 2.1: minLength generates inline code `if (value.length < n)`
  // Validates: Requirement 2.1
  // ============================================================================
  describe("Requirement 2.1: minLength inline code generation", () => {
    itProp.prop([fc.nat({ max: 1000 })])(
      "[🎲] minLength(n) generates inline `value.length < n` check",
      (minLen) => {
        const ctx = createGeneratorContext();
        const result = generateMinLengthCheck("value", minLen, ctx);

        // Must contain inline length check using property access (not a function call)
        expect(result.code).toContain(`value.length < ${minLen}`);
        // Must not contain external function calls (externals.get, validate, etc.)
        expect(result.code).not.toContain("externals");
        expect(result.code).not.toContain("validate(");
        // Must be a single if statement with return
        expect(result.code).toMatch(/^if \(.+\) return ".+";$/);
      }
    );

    itProp.prop([fc.nat({ max: 1000 }), fc.string({ minLength: 0, maxLength: 100 })])(
      "[🎲] minLength generated code correctly validates strings",
      (minLen, testValue) => {
        const ctx = createGeneratorContext();
        const typeCheck = generateStringTypeCheck("value", ctx);
        const minCheck = generateMinLengthCheck("value", minLen, ctx);

        // eslint-disable-next-line no-new-func
        const fn = new Function("value", `${typeCheck.code}\n${minCheck.code}\nreturn true;`);

        const result = fn(testValue);
        if (testValue.length < minLen) {
          expect(typeof result).toBe("string"); // Error message
        } else {
          expect(result).toBe(true);
        }
      }
    );
  });

  // ============================================================================
  // Property 2.2: maxLength generates inline code `if (value.length > n)`
  // Validates: Requirement 2.2
  // ============================================================================
  describe("Requirement 2.2: maxLength inline code generation", () => {
    itProp.prop([fc.nat({ max: 1000 })])(
      "[🎲] maxLength(n) generates inline `value.length > n` check",
      (maxLen) => {
        const ctx = createGeneratorContext();
        const result = generateMaxLengthCheck("value", maxLen, ctx);

        // Must contain inline length check using property access (not a function call)
        expect(result.code).toContain(`value.length > ${maxLen}`);
        // Must not contain external function calls
        expect(result.code).not.toContain("externals");
        expect(result.code).not.toContain("validate(");
        // Must be a single if statement with return
        expect(result.code).toMatch(/^if \(.+\) return ".+";$/);
      }
    );

    itProp.prop([fc.nat({ max: 1000 }), fc.string({ minLength: 0, maxLength: 100 })])(
      "[🎲] maxLength generated code correctly validates strings",
      (maxLen, testValue) => {
        const ctx = createGeneratorContext();
        const typeCheck = generateStringTypeCheck("value", ctx);
        const maxCheck = generateMaxLengthCheck("value", maxLen, ctx);

        // eslint-disable-next-line no-new-func
        const fn = new Function("value", `${typeCheck.code}\n${maxCheck.code}\nreturn true;`);

        const result = fn(testValue);
        if (testValue.length > maxLen) {
          expect(typeof result).toBe("string"); // Error message
        } else {
          expect(result).toBe(true);
        }
      }
    );
  });

  // ============================================================================
  // Property 2.3: email generates inline regex test
  // Validates: Requirement 2.3
  // ============================================================================
  describe("Requirement 2.3: email inline regex generation", () => {
    it("[🎲] email() generates inline regex test", () => {
      const ctx = createGeneratorContext();
      const result = generateEmailCheck("value", ctx);

      // Must contain inline regex test
      expect(result.code).toContain(".test(value)");
      // Must be a single if statement with return
      expect(result.code).toMatch(/^if \(!.+\.test\(value\)\) return ".+";$/);
    });

    itProp.prop([fc.emailAddress()])(
      "[🎲] email generated code accepts valid emails",
      (email) => {
        const ctx = createGeneratorContext();
        const typeCheck = generateStringTypeCheck("value", ctx);
        const emailCheck = generateEmailCheck("value", typeCheck.ctx);

        // Create externals map
        const externals = emailCheck.ctx.externals;

        // eslint-disable-next-line no-new-func
        const fn = new Function("value", "externals", `${typeCheck.code}\n${emailCheck.code}\nreturn true;`);

        // Valid emails should pass
        expect(fn(email, externals)).toBe(true);
      }
    );

    itProp.prop([fc.string().filter((s) => !s.includes("@") || !s.includes("."))])(
      "[🎲] email generated code rejects invalid emails",
      (invalidEmail) => {
        const ctx = createGeneratorContext();
        const typeCheck = generateStringTypeCheck("value", ctx);
        const emailCheck = generateEmailCheck("value", typeCheck.ctx);

        // Create externals map
        const externals = emailCheck.ctx.externals;

        // eslint-disable-next-line no-new-func
        const fn = new Function("value", "externals", `${typeCheck.code}\n${emailCheck.code}\nreturn true;`);

        const result = fn(invalidEmail, externals);
        // Invalid emails should return error message
        expect(typeof result).toBe("string");
      }
    );
  });

  // ============================================================================
  // Property 2.4: regex generates inline pattern test
  // Validates: Requirement 2.4
  // ============================================================================
  describe("Requirement 2.4: regex inline pattern generation", () => {
    itProp.prop([fc.string({ minLength: 1, maxLength: 20 }).filter((s) => {
      try {
        new RegExp(s);
        return true;
      } catch {
        return false;
      }
    })])(
      "[🎲] regex(pattern) generates external reference for pattern test",
      (patternStr) => {
        const ctx = createGeneratorContext();
        const pattern = new RegExp(patternStr);
        const result = generateRegexCheck("value", pattern, ctx);

        // Must use external reference for regex patterns
        expect(result.code).toContain('externals.get("ref_');
        // Must use .test() method for regex
        expect(result.code).toMatch(/^if \(!externals\.get\(".+"\)\.test\(.+\)\) return ".+";$/);
        // Context must have the external registered
        expect(result.ctx.externals.size).toBe(1);
      }
    );

    it("[🎲] regex generated code correctly validates with externals", () => {
      const ctx = createGeneratorContext();
      const pattern = /^[a-z]+$/;
      const typeCheck = generateStringTypeCheck("value", ctx);
      const regexCheck = generateRegexCheck("value", pattern, typeCheck.ctx);

      const externals = regexCheck.ctx.externals;

      // eslint-disable-next-line no-new-func
      const fn = new Function(
        "value",
        "externals",
        `${typeCheck.code}\n${regexCheck.code}\nreturn true;`
      );

      // Valid values
      expect(fn("hello", externals)).toBe(true);
      expect(fn("abc", externals)).toBe(true);

      // Invalid values
      expect(typeof fn("Hello", externals)).toBe("string");
      expect(typeof fn("123", externals)).toBe("string");
    });
  });

  // ============================================================================
  // Property 2.5: Multiple constraints generate sequential inline checks
  // Validates: Requirement 2.5
  // ============================================================================
  describe("Requirement 2.5: Multiple constraints generate sequential checks", () => {
    itProp.prop([
      fc.nat({ max: 50 }),
      fc.nat({ max: 100 }).filter((n) => n >= 50),
    ])(
      "[🎲] multiple constraints generate all checks sequentially",
      (minLen, maxLen) => {
        const ctx = createGeneratorContext();
        const result = generateStringValidation("value", ctx, {
          minLength: { value: minLen },
          maxLength: { value: maxLen },
        });

        // Must have type check + minLength + maxLength = 3 lines
        expect(result.code.length).toBe(3);

        // First line is type check
        expect(result.code[0]).toContain('typeof value !== "string"');

        // Second line is minLength (inline property access, not function call)
        expect(result.code[1]).toContain(`value.length < ${minLen}`);

        // Third line is maxLength (inline property access, not function call)
        expect(result.code[2]).toContain(`value.length > ${maxLen}`);

        // No external function calls in constraint checks
        expect(result.code[1]).not.toContain("externals");
        expect(result.code[2]).not.toContain("externals");
      }
    );

    itProp.prop([
      fc.nat({ max: 20 }),
      fc.nat({ max: 100 }).filter((n) => n >= 20),
      fc.string({ minLength: 0, maxLength: 50 }),
    ])(
      "[🎲] combined constraints correctly validate strings",
      (minLen, maxLen, testValue) => {
        const ctx = createGeneratorContext();
        const result = generateStringValidation("value", ctx, {
          minLength: { value: minLen },
          maxLength: { value: maxLen },
        });

        const code = result.code.join("\n") + "\nreturn true;";
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", code);

        const fnResult = fn(testValue);

        // Validate behavior matches expected
        if (testValue.length < minLen) {
          expect(typeof fnResult).toBe("string");
          expect(fnResult).toContain("at least");
        } else if (testValue.length > maxLen) {
          expect(typeof fnResult).toBe("string");
          expect(fnResult).toContain("at most");
        } else {
          expect(fnResult).toBe(true);
        }
      }
    );
  });

  // ============================================================================
  // Additional string constraint properties
  // ============================================================================
  describe("Additional string constraints", () => {
    itProp.prop([fc.string({ minLength: 1, maxLength: 20 })])(
      "[🎲] includes(substring) generates inline includes check",
      (substring) => {
        const ctx = createGeneratorContext();
        const result = generateIncludesCheck("value", substring, ctx);

        // Must contain inline includes check
        expect(result.code).toContain(".includes(");
        // Must be a single if statement
        expect(result.code).toMatch(/^if \(!value\.includes\(".+"\)\) return ".+";$/);
      }
    );

    itProp.prop([fc.string({ minLength: 1, maxLength: 20 })])(
      "[🎲] startsWith(prefix) generates inline startsWith check",
      (prefix) => {
        const ctx = createGeneratorContext();
        const result = generateStartsWithCheck("value", prefix, ctx);

        // Must contain inline startsWith check
        expect(result.code).toContain(".startsWith(");
        // Must be a single if statement
        expect(result.code).toMatch(/^if \(!value\.startsWith\(".+"\)\) return ".+";$/);
      }
    );

    itProp.prop([fc.string({ minLength: 1, maxLength: 20 })])(
      "[🎲] endsWith(suffix) generates inline endsWith check",
      (suffix) => {
        const ctx = createGeneratorContext();
        const result = generateEndsWithCheck("value", suffix, ctx);

        // Must contain inline endsWith check
        expect(result.code).toContain(".endsWith(");
        // Must be a single if statement
        expect(result.code).toMatch(/^if \(!value\.endsWith\(".+"\)\) return ".+";$/);
      }
    );

    it("[🎲] url() generates inline regex test", () => {
      const ctx = createGeneratorContext();
      const result = generateUrlCheck("value", ctx);

      // Must contain inline regex test
      expect(result.code).toContain(".test(value)");
    });

    it("[🎲] uuid() generates inline regex test", () => {
      const ctx = createGeneratorContext();
      const result = generateUuidCheck("value", ctx);

      // Must contain inline regex test
      expect(result.code).toContain(".test(value)");
    });

    itProp.prop([fc.nat({ max: 100 })])(
      "[🎲] length(n) generates inline exact length check",
      (len) => {
        const ctx = createGeneratorContext();
        const result = generateLengthCheck("value", len, ctx);

        // Must contain inline length check using property access (not a function call)
        expect(result.code).toContain(`value.length !== ${len}`);
        // Must not contain external function calls
        expect(result.code).not.toContain("externals");
        expect(result.code).not.toContain("validate(");
      }
    );
  });

  // ============================================================================
  // Code execution correctness properties
  // ============================================================================
  describe("Code execution correctness", () => {
    itProp.prop([fc.string({ minLength: 1, maxLength: 50 }), fc.string({ minLength: 0, maxLength: 100 })])(
      "[🎲] includes check correctly validates substring presence",
      (substring, testValue) => {
        const ctx = createGeneratorContext();
        const typeCheck = generateStringTypeCheck("value", ctx);
        const includesCheck = generateIncludesCheck("value", substring, ctx);

        // eslint-disable-next-line no-new-func
        const fn = new Function("value", `${typeCheck.code}\n${includesCheck.code}\nreturn true;`);

        const result = fn(testValue);
        if (testValue.includes(substring)) {
          expect(result).toBe(true);
        } else {
          expect(typeof result).toBe("string");
        }
      }
    );

    itProp.prop([fc.string({ minLength: 1, maxLength: 20 }), fc.string({ minLength: 0, maxLength: 50 })])(
      "[🎲] startsWith check correctly validates prefix",
      (prefix, testValue) => {
        const ctx = createGeneratorContext();
        const typeCheck = generateStringTypeCheck("value", ctx);
        const startsWithCheck = generateStartsWithCheck("value", prefix, ctx);

        // eslint-disable-next-line no-new-func
        const fn = new Function("value", `${typeCheck.code}\n${startsWithCheck.code}\nreturn true;`);

        const result = fn(testValue);
        if (testValue.startsWith(prefix)) {
          expect(result).toBe(true);
        } else {
          expect(typeof result).toBe("string");
        }
      }
    );

    itProp.prop([fc.string({ minLength: 1, maxLength: 20 }), fc.string({ minLength: 0, maxLength: 50 })])(
      "[🎲] endsWith check correctly validates suffix",
      (suffix, testValue) => {
        const ctx = createGeneratorContext();
        const typeCheck = generateStringTypeCheck("value", ctx);
        const endsWithCheck = generateEndsWithCheck("value", suffix, ctx);

        // eslint-disable-next-line no-new-func
        const fn = new Function("value", `${typeCheck.code}\n${endsWithCheck.code}\nreturn true;`);

        const result = fn(testValue);
        if (testValue.endsWith(suffix)) {
          expect(result).toBe(true);
        } else {
          expect(typeof result).toBe("string");
        }
      }
    );

    itProp.prop([fc.nat({ max: 100 }), fc.string({ minLength: 0, maxLength: 150 })])(
      "[🎲] exact length check correctly validates string length",
      (len, testValue) => {
        const ctx = createGeneratorContext();
        const typeCheck = generateStringTypeCheck("value", ctx);
        const lengthCheck = generateLengthCheck("value", len, ctx);

        // eslint-disable-next-line no-new-func
        const fn = new Function("value", `${typeCheck.code}\n${lengthCheck.code}\nreturn true;`);

        const result = fn(testValue);
        if (testValue.length === len) {
          expect(result).toBe(true);
        } else {
          expect(typeof result).toBe("string");
        }
      }
    );
  });

  // ============================================================================
  // Type check property
  // ============================================================================
  describe("Type check generation", () => {
    itProp.prop([fc.anything()])(
      "[🎲] type check correctly identifies non-strings",
      (value) => {
        const ctx = createGeneratorContext();
        const typeCheck = generateStringTypeCheck("value", ctx);

        // eslint-disable-next-line no-new-func
        const fn = new Function("value", `${typeCheck.code}\nreturn true;`);

        const result = fn(value);
        if (typeof value === "string") {
          expect(result).toBe(true);
        } else {
          expect(typeof result).toBe("string");
          expect(result).toContain("Expected string");
        }
      }
    );
  });
});
