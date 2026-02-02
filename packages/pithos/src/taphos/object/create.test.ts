import { describe, it, expect } from "vitest";
import { create } from "./create";

describe("create", () => {
  it("creates object with prototype", () => {
    const proto = { greet: () => "Hello" };
    const obj = create(proto);
    expect(obj.greet()).toBe("Hello");
  });

  it("[🎯] assigns properties to object", () => {
    const proto = { greet: () => "Hello" };
    const obj = create(proto, { name: "Fred" }) as typeof proto & { name: string };
    expect(obj.name).toBe("Fred");
  });

  it("[🎯] inherits from prototype", () => {
    const proto = { value: 42 };
    const obj = create(proto);
    expect(Object.getPrototypeOf(obj)).toBe(proto);
  });
});
