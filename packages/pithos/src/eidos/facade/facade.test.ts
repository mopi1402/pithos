import { describe, it, expect } from "vitest";
import { createFacade } from "./facade";

describe("Facade Pattern", () => {
  // The pattern is absorbed — these tests demonstrate idiomatic usage

  describe("createFacade (deprecated)", () => {
    it("is the identity function", () => {
      const fn = (a: number, b: number) => a + b;
      const facade = createFacade(fn);

      expect(facade).toBe(fn);
      expect(facade(2, 3)).toBe(5);
    });
  });

  describe("idiomatic functional facade", () => {
    // Subsystems
    const validate = (data: { name: string }) => {
      if (!data.name) throw new Error("Name required");
      return { ...data, validated: true };
    };

    const enrich = (data: { name: string; validated: boolean }) => ({
      ...data,
      createdAt: new Date().toISOString(),
    });

    const save = (data: { name: string; createdAt: string }) => ({
      id: "123",
      ...data,
    });

    it("facade is just a function orchestrating subsystems", () => {
      // This IS the Facade pattern in functional style
      const createUser = (data: { name: string }) => {
        const validated = validate(data);
        const enriched = enrich(validated);
        return save(enriched);
      };

      const user = createUser({ name: "Alice" });

      expect(user.id).toBe("123");
      expect(user.name).toBe("Alice");
      expect(user.createdAt).toBeDefined();
    });

    it("facade hides complexity from client", () => {
      // Client doesn't need to know about validate, enrich, save
      const processOrder = (items: string[], total: number) => {
        // Imagine these are complex subsystem calls
        const validated = items.length > 0;
        const discounted = total * 0.9;
        const orderId = `ORD-${Date.now()}`;
        return { orderId, items, total: discounted, validated };
      };

      const order = processOrder(["item1", "item2"], 100);

      expect(order.total).toBe(90);
      expect(order.validated).toBe(true);
    });
  });
});
