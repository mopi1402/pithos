/**
 * Tests for string schema
 */

import { describe, it, expect } from "vitest";
import { string } from "./string.js";
import { createDataset } from "@kanon/v2/core/dataset.js";
import type { PithosConfig } from "@kanon/v2/types/base.js";

describe("String schema", () => {
  const config: PithosConfig = {
    lang: "en",
    abortEarly: false,
  };

  it("should validate string successfully", () => {
    const schema = string();
    const dataset = createDataset("hello");

    const result = schema["~run"](dataset, config);

    expect(result.status).toBe("success");
    expect(result.value).toBe("hello");
    expect(result.issues).toBeUndefined();
  });

  it("should reject non-string values", () => {
    const schema = string();
    const dataset = createDataset(123);

    const result = schema["~run"](dataset, config);

    expect(result.typed).toBe(false);
    expect(result.issues).toBeDefined();
    expect(result.issues!.length).toBe(1);
    expect(result.issues![0].kind).toBe("schema");
    expect(result.issues![0].type).toBe("string");
  });

  it("should use custom message", () => {
    const schema = string("Custom string error");
    const dataset = createDataset(123);

    const result = schema["~run"](dataset, config);

    expect(result.issues![0].message).toBe("Custom string error");
  });

  it("should use custom message function", () => {
    const schema = string((issue) => `Expected string, got ${issue.received}`);
    const dataset = createDataset(123);

    const result = schema["~run"](dataset, config);

    expect(result.issues![0].message).toBe("Expected string, got number");
  });

  it("should handle empty string", () => {
    const schema = string();
    const dataset = createDataset("");

    const result = schema["~run"](dataset, config);

    expect(result.status).toBe("success");
    expect(result.value).toBe("");
  });

  it("should have correct schema properties", () => {
    const schema = string();

    expect(schema.kind).toBe("schema");
    expect(schema.type).toBe("string");
    expect(schema.expects).toBe("string");
    expect(schema.async).toBe(false);
    expect(typeof schema["~run"]).toBe("function");
  });

  it("should validate strings quickly", () => {
    const schema = string();

    const start = performance.now();

    for (let i = 0; i < 1000; i++) {
      const dataset = createDataset("hello");
      schema["~run"](dataset, config);
    }

    const end = performance.now();
    expect(end - start).toBeLessThan(50); // Should be reasonably fast
  });
});
