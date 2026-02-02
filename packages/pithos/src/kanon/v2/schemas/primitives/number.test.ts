/**
 * Tests for number schema
 */

import { describe, it, expect } from "vitest";
import { number } from "./number.js";
import { createDataset } from "@kanon/v2/core/dataset.js";
import type { PithosConfig } from "@kanon/v2/types/base.js";

describe("Number schema", () => {
  const config: PithosConfig = {
    lang: "en",
    abortEarly: false,
  };

  it("should validate number successfully", () => {
    const schema = number();
    const dataset = createDataset(42);

    const result = schema["~run"](dataset, config);

    expect(result.status).toBe("success");
    expect(result.value).toBe(42);
    expect(result.issues).toBeUndefined();
  });

  it("should reject non-number values", () => {
    const schema = number();
    const dataset = createDataset("hello");

    const result = schema["~run"](dataset, config);

    expect(result.typed).toBe(false);
    expect(result.issues).toBeDefined();
    expect(result.issues!.length).toBe(1);
    expect(result.issues![0].kind).toBe("schema");
    expect(result.issues![0].type).toBe("number");
  });

  it("should use custom message", () => {
    const schema = number("Custom number error");
    const dataset = createDataset("hello");

    const result = schema["~run"](dataset, config);

    expect(result.issues![0].message).toBe("Custom number error");
  });

  it("should use custom message function", () => {
    const schema = number((issue) => `Expected number, got ${issue.received}`);
    const dataset = createDataset("hello");

    const result = schema["~run"](dataset, config);

    expect(result.issues![0].message).toBe("Expected number, got string");
  });

  it("should handle zero", () => {
    const schema = number();
    const dataset = createDataset(0);

    const result = schema["~run"](dataset, config);

    expect(result.status).toBe("success");
    expect(result.value).toBe(0);
  });

  it("should handle negative numbers", () => {
    const schema = number();
    const dataset = createDataset(-42);

    const result = schema["~run"](dataset, config);

    expect(result.status).toBe("success");
    expect(result.value).toBe(-42);
  });

  it("should handle decimal numbers", () => {
    const schema = number();
    const dataset = createDataset(3.14);

    const result = schema["~run"](dataset, config);

    expect(result.status).toBe("success");
    expect(result.value).toBe(3.14);
  });

  it("should have correct schema properties", () => {
    const schema = number();

    expect(schema.kind).toBe("schema");
    expect(schema.type).toBe("number");
    expect(schema.expects).toBe("number");
    expect(schema.async).toBe(false);
    expect(typeof schema["~run"]).toBe("function");
  });

  it("should validate numbers quickly", () => {
    const schema = number();

    const start = performance.now();

    for (let i = 0; i < 1000; i++) {
      const dataset = createDataset(42);
      schema["~run"](dataset, config);
    }

    const end = performance.now();
    expect(end - start).toBeLessThan(50); // Should be reasonably fast
  });
});
