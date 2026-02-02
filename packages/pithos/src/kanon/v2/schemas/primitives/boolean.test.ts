/**
 * Tests for boolean schema
 */

import { describe, it, expect } from "vitest";
import { boolean } from "./boolean.js";
import { createDataset } from "@kanon/v2/core/dataset.js";
import type { PithosConfig } from "@kanon/v2/types/base.js";

describe("Boolean schema", () => {
  const config: PithosConfig = {
    lang: "en",
    abortEarly: false,
  };

  it("should validate boolean successfully", () => {
    const schema = boolean();
    const dataset = createDataset(true);

    const result = schema["~run"](dataset, config);

    expect(result.status).toBe("success");
    expect(result.value).toBe(true);
    expect(result.issues).toBeUndefined();
  });

  it("should validate false boolean", () => {
    const schema = boolean();
    const dataset = createDataset(false);

    const result = schema["~run"](dataset, config);

    expect(result.status).toBe("success");
    expect(result.value).toBe(false);
    expect(result.issues).toBeUndefined();
  });

  it("should reject non-boolean values", () => {
    const schema = boolean();
    const dataset = createDataset("hello");

    const result = schema["~run"](dataset, config);

    expect(result.typed).toBe(false);
    expect(result.issues).toBeDefined();
    expect(result.issues!.length).toBe(1);
    expect(result.issues![0].kind).toBe("schema");
    expect(result.issues![0].type).toBe("boolean");
  });

  it("should use custom message", () => {
    const schema = boolean("Custom boolean error");
    const dataset = createDataset("hello");

    const result = schema["~run"](dataset, config);

    expect(result.issues![0].message).toBe("Custom boolean error");
  });

  it("should use custom message function", () => {
    const schema = boolean(
      (issue) => `Expected boolean, got ${issue.received}`
    );
    const dataset = createDataset("hello");

    const result = schema["~run"](dataset, config);

    expect(result.issues![0].message).toBe("Expected boolean, got string");
  });

  it("should have correct schema properties", () => {
    const schema = boolean();

    expect(schema.kind).toBe("schema");
    expect(schema.type).toBe("boolean");
    expect(schema.expects).toBe("boolean");
    expect(schema.async).toBe(false);
    expect(typeof schema["~run"]).toBe("function");
  });

  it("should validate booleans quickly", () => {
    const schema = boolean();

    const start = performance.now();

    for (let i = 0; i < 1000; i++) {
      const dataset = createDataset(true);
      schema["~run"](dataset, config);
    }

    const end = performance.now();
    expect(end - start).toBeLessThan(50); // Should be reasonably fast
  });
});
