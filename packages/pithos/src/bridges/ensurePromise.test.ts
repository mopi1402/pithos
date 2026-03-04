import { describe, it, expect } from "vitest";
import { ensurePromise } from "./ensurePromise";
import { string, number, object } from "@kanon";

describe("ensurePromise", () => {
  const schema = object({
    name: string().minLength(1),
    age: number().min(0),
  });

  it("returns Ok when promise resolves with valid data", async () => {
    const promise = Promise.resolve({ name: "Alice", age: 30 });
    const result = await ensurePromise(schema, promise);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toEqual({ name: "Alice", age: 30 });
    }
  });

  it("returns Err when promise resolves with invalid data", async () => {
    const promise = Promise.resolve({ name: "", age: -1 });
    const result = await ensurePromise(schema, promise);

    expect(result.isErr()).toBe(true);
  });

  it("returns Err when promise rejects", async () => {
    const promise = Promise.reject(new Error("Network error"));
    const result = await ensurePromise(schema, promise);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe("Network error");
    }
  });

  it("returns Err when promise rejects with non-Error", async () => {
    const promise = Promise.reject("connection refused");
    const result = await ensurePromise(schema, promise);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBe("connection refused");
    }
  });

  it("is chainable with map", async () => {
    const promise = Promise.resolve({ name: "Alice", age: 30 });
    const result = await ensurePromise(schema, promise)
      .map(user => user.name.toUpperCase());

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe("ALICE");
    }
  });

  it("is chainable with mapErr", async () => {
    const promise = Promise.resolve("not an object");
    const result = await ensurePromise(schema, promise)
      .mapErr(error => `Failed: ${error}`);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toContain("Failed:");
    }
  });
});
