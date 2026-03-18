import { describe, it, expect } from "vitest";
import { once, singleton } from "./singleton";

describe("Singleton Pattern (re-exports from Arkhe)", () => {
  describe("once / singleton", () => {
    it("returns same result on multiple calls", () => {
      let callCount = 0;
      const getInstance = once(() => {
        callCount++;
        return { id: Math.random() };
      });

      const a = getInstance();
      const b = getInstance();
      const c = getInstance();

      expect(a).toBe(b);
      expect(b).toBe(c);
      expect(callCount).toBe(1);
    });

    it("singleton is alias for once", () => {
      let called = false;
      const getInstance = singleton(() => {
        called = true;
        return { value: 42 };
      });

      expect(called).toBe(false);
      const result = getInstance();
      expect(called).toBe(true);
      expect(result.value).toBe(42);
      expect(getInstance()).toBe(result);
    });
  });

  describe("idiomatic module singleton", () => {
    it("module const is evaluated once (simulated)", () => {
      // In real code: export const config = createConfig();
      const createConfig = () => ({ apiUrl: "http://localhost" });
      const config = createConfig();

      const import1 = config;
      const import2 = config;

      expect(import1).toBe(import2);
    });

    it("lazy singleton with once", () => {
      const getDb = once(() => ({ connected: true, id: Date.now() }));

      const a = getDb();
      const b = getDb();

      expect(a).toBe(b);
      expect(a.connected).toBe(true);
    });
  });
});
