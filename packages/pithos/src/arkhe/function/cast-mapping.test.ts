import { describe, it, expect } from "vitest";
import { castMapping } from "./cast-mapping";

interface User {
  id: number;
  name: string;
}

const user: User = { id: 1, name: "Alice" };

describe("castMapping", () => {
  it("returns property accessor for key", () => {
    const getName = castMapping<User, "name">("name");
    expect(getName(user)).toBe("Alice");
  });

  it("returns function as-is", () => {
    const getNameLength = castMapping((u: User) => u.name.length);
    expect(getNameLength(user)).toBe(5);
  });

  it("[🎯] returns identity for null", () => {
    const identity = castMapping<User>(null);
    expect(identity(user)).toBe(user);
  });

  it("returns identity for undefined", () => {
    const identity = castMapping<User>();
    expect(identity(user)).toBe(user);
  });
});
