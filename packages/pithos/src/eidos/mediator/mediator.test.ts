import { describe, it, expect, vi } from "vitest";
import { createMediator } from "./mediator";

describe("createMediator", () => {
  type TestEvents = {
    userLoggedIn: { userId: string };
    orderPlaced: { orderId: string; total: number };
    notification: { message: string };
  };

  it("routes events to registered handlers", () => {
    const mediator = createMediator<TestEvents>();
    const handler = vi.fn();

    mediator.on("userLoggedIn", handler);
    mediator.emit("userLoggedIn", { userId: "alice" });

    expect(handler).toHaveBeenCalledWith({ userId: "alice" });
  });

  it("supports multiple handlers per event", () => {
    const mediator = createMediator<TestEvents>();
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    mediator.on("orderPlaced", handler1);
    mediator.on("orderPlaced", handler2);
    mediator.emit("orderPlaced", { orderId: "123", total: 99 });

    expect(handler1).toHaveBeenCalledWith({ orderId: "123", total: 99 });
    expect(handler2).toHaveBeenCalledWith({ orderId: "123", total: 99 });
  });

  it("isolates events by type", () => {
    const mediator = createMediator<TestEvents>();
    const loginHandler = vi.fn();
    const orderHandler = vi.fn();

    mediator.on("userLoggedIn", loginHandler);
    mediator.on("orderPlaced", orderHandler);

    mediator.emit("userLoggedIn", { userId: "bob" });

    expect(loginHandler).toHaveBeenCalled();
    expect(orderHandler).not.toHaveBeenCalled();
  });

  it("returns unsubscribe function", () => {
    const mediator = createMediator<TestEvents>();
    const handler = vi.fn();

    const unsubscribe = mediator.on("notification", handler);
    mediator.emit("notification", { message: "first" });
    unsubscribe();
    mediator.emit("notification", { message: "second" });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ message: "first" });
  });

  it("clears handlers for specific event", () => {
    const mediator = createMediator<TestEvents>();
    const loginHandler = vi.fn();
    const orderHandler = vi.fn();

    mediator.on("userLoggedIn", loginHandler);
    mediator.on("orderPlaced", orderHandler);

    mediator.clear("userLoggedIn");

    mediator.emit("userLoggedIn", { userId: "x" });
    mediator.emit("orderPlaced", { orderId: "1", total: 10 });

    expect(loginHandler).not.toHaveBeenCalled();
    expect(orderHandler).toHaveBeenCalled();
  });

  it("clears all handlers when no event specified", () => {
    const mediator = createMediator<TestEvents>();
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    mediator.on("userLoggedIn", handler1);
    mediator.on("orderPlaced", handler2);

    mediator.clear();

    mediator.emit("userLoggedIn", { userId: "x" });
    mediator.emit("orderPlaced", { orderId: "1", total: 10 });

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
  });

  it("handles emit with no handlers gracefully", () => {
    const mediator = createMediator<TestEvents>();

    // Should not throw
    expect(() => {
      mediator.emit("userLoggedIn", { userId: "ghost" });
    }).not.toThrow();
  });
});

describe("mediator orchestration", () => {
  it("enables complex event chains", () => {
    type Events = {
      formSubmitted: { data: string };
      validated: { data: string };
      saved: { id: string };
    };

    const mediator = createMediator<Events>();
    const results: string[] = [];

    // Validation handler
    mediator.on("formSubmitted", ({ data }) => {
      results.push(`validating: ${data}`);
      mediator.emit("validated", { data });
    });

    // Save handler
    mediator.on("validated", ({ data }) => {
      results.push(`saving: ${data}`);
      mediator.emit("saved", { id: "123" });
    });

    // Notification handler
    mediator.on("saved", ({ id }) => {
      results.push(`saved with id: ${id}`);
    });

    mediator.emit("formSubmitted", { data: "test" });

    expect(results).toEqual([
      "validating: test",
      "saving: test",
      "saved with id: 123",
    ]);
  });

  it("decouples components", () => {
    type Events = {
      buttonClicked: { id: string };
      dialogOpened: { title: string };
    };

    const mediator = createMediator<Events>();

    // Button component (doesn't know about Dialog)
    const clickButton = (id: string) => {
      mediator.emit("buttonClicked", { id });
    };

    // Dialog component (doesn't know about Button)
    let dialogTitle = "";
    mediator.on("buttonClicked", ({ id }) => {
      if (id === "openDialog") {
        dialogTitle = "Hello";
        mediator.emit("dialogOpened", { title: dialogTitle });
      }
    });

    clickButton("openDialog");

    expect(dialogTitle).toBe("Hello");
  });
});
