import { describe, it, expect } from "vitest";
import { type Handler, createChain, safeChain } from "./chain";

// --- Handler type ---

describe("Handler type", () => {
  it("can short-circuit the chain", () => {
    const block: Handler<number, string> = () => "blocked";
    const never: Handler<number, string> = (n) => `reached: ${n}`;

    const chain = createChain(block, never);

    expect(chain(42)).toBe("blocked");
  });

  it("can delegate to next", () => {
    const passthrough: Handler<number, string> = (n, next) => next(n);
    const format: Handler<number, string> = (n) => `value: ${n}`;

    const chain = createChain(passthrough, format);

    expect(chain(42)).toBe("value: 42");
  });
});

// --- createChain ---

describe("createChain", () => {
  it("executes handlers in order", () => {
    const order: string[] = [];

    const first: Handler<string, string> = (s, next) => {
      order.push("first");
      return next(s);
    };

    const second: Handler<string, string> = (s, next) => {
      order.push("second");
      return next(s);
    };

    const last: Handler<string, string> = (s) => {
      order.push("last");
      return s.toUpperCase();
    };

    const chain = createChain(first, second, last);
    chain("hello");

    expect(order).toEqual(["first", "second", "last"]);
  });

  it("allows a handler to transform the input before passing", () => {
    const addPrefix: Handler<string, string> = (s, next) => next(`[${s}]`);
    const echo: Handler<string, string> = (s) => s;

    const chain = createChain(addPrefix, echo);

    expect(chain("hello")).toBe("[hello]");
  });

  it("allows a handler to transform the output after next", () => {
    const uppercase: Handler<string, string> = (s, next) => next(s).toUpperCase();
    const echo: Handler<string, string> = (s) => s;

    const chain = createChain(uppercase, echo);

    expect(chain("hello")).toBe("HELLO");
  });

  it("works as middleware: auth -> validate -> handle", () => {
    type Req = { token?: string; body?: string };
    type Res = { status: number; data?: string };

    const auth: Handler<Req, Res> = (req, next) =>
      req.token ? next(req) : { status: 401 };

    const validate: Handler<Req, Res> = (req, next) =>
      req.body ? next(req) : { status: 400 };

    const handle: Handler<Req, Res> = (req) => ({
      status: 200,
      data: req.body,
    });

    const pipeline = createChain(auth, validate, handle);

    expect(pipeline({ token: "abc", body: "data" })).toEqual({
      status: 200,
      data: "data",
    });

    expect(pipeline({})).toEqual({ status: 401 });

    expect(pipeline({ token: "abc" })).toEqual({ status: 400 });
  });

  it("throws if no handlers provided", () => {
    expect(() => createChain()).toThrow("at least one handler");
  });

  it("throws if last handler calls next", () => {
    const bad: Handler<number, number> = (n, next) => next(n);

    const chain = createChain(bad);

    expect(() => chain(1)).toThrow("last handler must not call next");
  });

  it("works with a single handler", () => {
    const only: Handler<number, string> = (n) => `only: ${n}`;

    const chain = createChain(only);

    expect(chain(42)).toBe("only: 42");
  });
});

// --- safeChain (zygos integration) ---

describe("safeChain", () => {
  it("returns Ok on success", () => {
    const handler: Handler<number, number> = (n) => n * 2;

    const chain = safeChain(handler);
    const result = chain(21);

    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      expect(result.value).toBe(42);
    }
  });

  it("returns Err when a handler throws", () => {
    const risky: Handler<string, number> = (s) => {
      if (s === "") throw new Error("empty input");
      return s.length;
    };

    const chain = safeChain(risky);
    const result = chain("");

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toBe("empty input");
    }
  });

  it("catches errors from any handler in the chain", () => {
    const pass: Handler<number, number> = (n, next) => next(n);
    const boom: Handler<number, number> = () => {
      throw new Error("handler 2 failed");
    };

    const chain = safeChain(pass, boom);
    const result = chain(1);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toBe("handler 2 failed");
    }
  });

  it("wraps non-Error thrown values in Error", () => {
    const throwString: Handler<number, number> = () => {
      throw "string error";
    };

    const chain = safeChain(throwString);
    const result = chain(1);

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe("string error");
    }
  });
});
