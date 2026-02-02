import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { isElement } from "./isElement";

describe("isElement", () => {
  let MockElement: typeof Element;
  let elementInstance: Element;

  beforeAll(() => {
    MockElement = class MockElement {
      constructor() {
        // @ts-expect-error Mock element
        this.tagName = "DIV";
      }
    } as unknown as typeof Element;

    global.Element = MockElement;
    elementInstance = new MockElement() as Element;
  });

  afterAll(() => {
    // @ts-expect-error Cleanup global
    delete global.Element;
  });

  it("[🎯] returns true for DOM element", () => {
    expect(isElement(elementInstance)).toBe(true);
  });

  it("returns false for string", () => {
    expect(isElement("<body>")).toBe(false);
  });

  it("[🎯] returns false for plain object", () => {
    expect(isElement({ tagName: "div" })).toBe(false);
  });

  it("[🎯] returns false for null", () => {
    expect(isElement(null)).toBe(false);
  });
});
