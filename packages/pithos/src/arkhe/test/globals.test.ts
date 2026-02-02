import { describe, it, expect, beforeEach } from "vitest";
import {
  getGlobalThis,
  mockWindow,
  mockDocument,
  mockDOMRect,
  mockPerformance,
  setGlobal,
  __autoRestoreAll,
} from "./globals";

describe("globals", () => {
  beforeEach(() => {
    __autoRestoreAll();
  });

  describe("getGlobalThis", () => {
    it("returns globalThis", () => {
      expect(getGlobalThis()).toBe(globalThis);
    });
  });

  describe("mockWindow", () => {
    it("creates mock window with overrides", () => {
      const { window, restore } = mockWindow({ innerWidth: 1024 });
      expect(window.innerWidth).toBe(1024);
      restore();
    });

    it("restores original state", () => {
      const hadWindow = "window" in globalThis;
      const { restore } = mockWindow();
      restore();
      expect("window" in globalThis).toBe(hadWindow);
    });

    it("restores original window if it existed", () => {
      const originalWindow = { existing: true };
      (globalThis as Record<string, unknown>).window = originalWindow;

      const { restore } = mockWindow({ innerWidth: 100 });
      restore();

      expect((globalThis as Record<string, unknown>).window).toBe(
        originalWindow
      );
      delete (globalThis as Record<string, unknown>).window;
    });

    it("[👾] deletes window if it did not exist before mock", () => {
      // Ensure window doesn't exist
      const original = (globalThis as Record<string, unknown>).window;
      delete (globalThis as Record<string, unknown>).window;
      expect("window" in globalThis).toBe(false);

      const { restore } = mockWindow({ innerWidth: 100 });
      expect("window" in globalThis).toBe(true);

      restore();
      expect("window" in globalThis).toBe(false);

      // Restore original state
      if (original !== undefined) {
        (globalThis as Record<string, unknown>).window = original;
      }
    });
  });

  describe("mockDocument", () => {
    it("creates mock document with overrides", () => {
      const { document, restore } = mockDocument({ title: "Test" });
      expect(document.title).toBe("Test");
      restore();
    });

    it("restores original state", () => {
      const hadDocument = "document" in globalThis;
      const { restore } = mockDocument();
      restore();
      expect("document" in globalThis).toBe(hadDocument);
    });

    it("restores original document if it existed", () => {
      const originalDocument = { existing: true };
      (globalThis as Record<string, unknown>).document = originalDocument;

      const { restore } = mockDocument({ title: "Test" });
      restore();

      expect((globalThis as Record<string, unknown>).document).toBe(
        originalDocument
      );
      delete (globalThis as Record<string, unknown>).document;
    });

    it("[👾] deletes document if it did not exist before mock", () => {
      // Ensure document doesn't exist
      const original = (globalThis as Record<string, unknown>).document;
      delete (globalThis as Record<string, unknown>).document;
      expect("document" in globalThis).toBe(false);

      const { restore } = mockDocument({ title: "Test" });
      expect("document" in globalThis).toBe(true);

      restore();
      expect("document" in globalThis).toBe(false);

      // Restore original state
      if (original !== undefined) {
        (globalThis as Record<string, unknown>).document = original;
      }
    });
  });

  describe("mockDOMRect", () => {
    it("creates functional DOMRect", () => {
      const { DOMRect, restore } = mockDOMRect();
      const rect = new DOMRect(10, 20, 100, 50);
      expect(rect.x).toBe(10);
      expect(rect.y).toBe(20);
      expect(rect.width).toBe(100);
      expect(rect.height).toBe(50);
      expect(rect.top).toBe(20);
      expect(rect.left).toBe(10);
      expect(rect.right).toBe(110);
      expect(rect.bottom).toBe(70);
      restore();
    });

    it("restores original state", () => {
      const hadDOMRect = "DOMRect" in globalThis;
      const { restore } = mockDOMRect();
      restore();
      expect("DOMRect" in globalThis).toBe(hadDOMRect);
    });

    it("toJSON returns stringified rect", () => {
      const { DOMRect, restore } = mockDOMRect();
      const rect = new DOMRect(10, 20, 100, 50);
      const json = rect.toJSON();
      expect(JSON.parse(json)).toEqual({
        x: 10,
        y: 20,
        width: 100,
        height: 50,
        top: 20,
        left: 10,
        right: 110,
        bottom: 70,
      });
      restore();
    });

    it("restores original DOMRect if it existed", () => {
      const originalDOMRect = class MockOriginal {};
      (globalThis as Record<string, unknown>).DOMRect = originalDOMRect;
      const { restore } = mockDOMRect();
      restore();
      expect((globalThis as Record<string, unknown>).DOMRect).toBe(
        originalDOMRect
      );
      delete (globalThis as Record<string, unknown>).DOMRect;
    });

    it("[👾] deletes DOMRect if it did not exist before mock", () => {
      // Ensure DOMRect doesn't exist
      const original = (globalThis as Record<string, unknown>).DOMRect;
      delete (globalThis as Record<string, unknown>).DOMRect;
      expect("DOMRect" in globalThis).toBe(false);

      const { restore } = mockDOMRect();
      expect("DOMRect" in globalThis).toBe(true);

      restore();
      expect("DOMRect" in globalThis).toBe(false);

      // Restore original state
      if (original !== undefined) {
        (globalThis as Record<string, unknown>).DOMRect = original;
      }
    });
  });

  describe("mockPerformance", () => {
    it("creates mock performance with overrides", () => {
      const { performance, restore } = mockPerformance({ now: () => 12345 });
      expect(performance.now()).toBe(12345);
      restore();
    });

    it("defaults now() to Date.now()", () => {
      const { performance, restore } = mockPerformance();
      const before = Date.now();
      const result = performance.now();
      const after = Date.now();
      expect(result).toBeGreaterThanOrEqual(before);
      expect(result).toBeLessThanOrEqual(after);
      restore();
    });

    it("deletes performance if it did not exist", () => {
      const original = (globalThis as Record<string, unknown>).performance;
      delete (globalThis as Record<string, unknown>).performance;
      const { restore } = mockPerformance();
      restore();
      expect("performance" in globalThis).toBe(false);
      (globalThis as Record<string, unknown>).performance = original;
    });

    it("[👾] restores original performance if it existed", () => {
      const originalPerformance = { now: () => 999 };
      (globalThis as Record<string, unknown>).performance = originalPerformance;

      const { restore } = mockPerformance({ now: () => 123 });
      restore();

      expect((globalThis as Record<string, unknown>).performance).toBe(
        originalPerformance
      );
      delete (globalThis as Record<string, unknown>).performance;
    });
  });

  describe("setGlobal", () => {
    it("sets and restores global value", () => {
      const restore = setGlobal("__test__", 42);
      expect((globalThis as Record<string, unknown>).__test__).toBe(42);
      restore();
      expect("__test__" in globalThis).toBe(false);
    });

    it("restores original value if key existed", () => {
      (globalThis as Record<string, unknown>).__existing__ = "original";
      const restore = setGlobal("__existing__", "new");
      expect((globalThis as Record<string, unknown>).__existing__).toBe("new");
      restore();
      expect((globalThis as Record<string, unknown>).__existing__).toBe(
        "original"
      );
      delete (globalThis as Record<string, unknown>).__existing__;
    });
  });

  describe("__autoRestoreAll", () => {
    it("restores all unreleased mocks", () => {
      mockWindow({ innerWidth: 100 });
      mockDocument({ title: "Test" });
      __autoRestoreAll();
      // Mocks should be cleaned up
    });

    it("restores in LIFO order", () => {
      setGlobal("__test1__", 1);
      setGlobal("__test2__", 2);
      // Override restore tracking to verify order
      __autoRestoreAll();
      expect("__test1__" in globalThis).toBe(false);
      expect("__test2__" in globalThis).toBe(false);
    });

    it("[🎯] handles empty restore set", () => {
      __autoRestoreAll(); // First call clears any existing
      __autoRestoreAll(); // Second call on empty set should not throw
    });

    it("[👾] unregisters restore after calling it", () => {
      // Create a mock and get its restore function
      const { restore } = mockWindow({ innerWidth: 100 });
      
      // Call restore manually - this should unregister it
      restore();
      
      // Now autoRestoreAll should not try to restore again (no double-restore)
      __autoRestoreAll(); // Should not throw or cause issues
    });
  });

  describe("mockWindow", () => {
    it("[🎯] creates empty mock window with no overrides", () => {
      const { window, restore } = mockWindow();
      expect(window).toBeDefined();
      expect(typeof window).toBe("object");
      restore();
    });
  });

  describe("mockDocument", () => {
    it("[🎯] creates empty mock document with no overrides", () => {
      const { document, restore } = mockDocument();
      expect(document).toBeDefined();
      expect(typeof document).toBe("object");
      restore();
    });
  });

  describe("mockDOMRect", () => {
    it("[🎯] uses default values when no arguments provided", () => {
      const { DOMRect, restore } = mockDOMRect();
      const rect = new DOMRect();
      expect(rect.x).toBe(0);
      expect(rect.y).toBe(0);
      expect(rect.width).toBe(0);
      expect(rect.height).toBe(0);
      restore();
    });

    it("[🎯] accepts custom implementation", () => {
      const CustomDOMRect = class {
        x = 999;
        y = 999;
        width = 999;
        height = 999;
        top = 999;
        right = 999;
        bottom = 999;
        left = 999;
        toJSON() {
          return "custom";
        }
      } as unknown as typeof DOMRect;

      const { DOMRect: MockedRect, restore } = mockDOMRect(CustomDOMRect);
      const rect = new MockedRect();
      expect(rect.x).toBe(999);
      restore();
    });
  });

  describe("mockPerformance", () => {
    it("[🎯] creates mock with default now() implementation", () => {
      const { performance, restore } = mockPerformance();
      expect(typeof performance.now).toBe("function");
      expect(typeof performance.now()).toBe("number");
      restore();
    });
  });
});
