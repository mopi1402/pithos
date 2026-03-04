import { describe, it, expect } from "vitest";
import { ensure } from "./ensure";
import { string, number, object } from "@kanon";

describe("ensure", () => {
  const schema = object({
    name: string().minLength(1),
    age: number().min(0),
  });

  it("returns Ok with valid data", () => {
    const result = ensure(schema, { name: "Alice", age: 30 });

    expect(result.isOk()).toBe(true);
    expect(result.isErr()).toBe(false);
    if (result.isOk()) {
      expect(result.value).toEqual({ name: "Alice", age: 30 });
    }
  });

  it("returns Err with invalid data", () => {
    const result = ensure(schema, { name: "", age: -1 });

    expect(result.isErr()).toBe(true);
    expect(result.isOk()).toBe(false);
  });

  it("returns Err with wrong type", () => {
    const result = ensure(schema, "not an object");

    expect(result.isErr()).toBe(true);
  });

  it("is chainable with map", () => {
    const result = ensure(schema, { name: "Alice", age: 30 })
      .map(user => user.name.toUpperCase());

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe("ALICE");
    }
  });

  it("is chainable with mapErr", () => {
    const result = ensure(schema, "bad")
      .mapErr(error => `Validation failed: ${error}`);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toContain("Validation failed:");
    }
  });
});
