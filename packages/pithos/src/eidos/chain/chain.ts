/**
 * Functional Chain of Responsibility Pattern.
 *
 * In OOP, Chain of Responsibility requires a Handler interface, a BaseHandler
 * class with a `next` reference, and concrete handler subclasses linked together.
 * In functional TypeScript, a handler is a function that either returns a result
 * or delegates to the next handler. The chain is built by composing handlers.
 *
 * @module eidos/chain
 * @since 2.4.0
 *
 * @see {@link https://pithos.dev/api/eidos/chain/ | Explanations, examples and live demo}
 *
 * @example
 * ```ts
 * import { createChain, type Handler } from "@pithos/core/eidos/chain/chain";
 *
 * const auth: Handler<Request, Response> = (req, next) =>
 *   req.token ? next(req) : { status: 401 };
 *
 * const validate: Handler<Request, Response> = (req, next) =>
 *   req.body ? next(req) : { status: 400 };
 *
 * const handle: Handler<Request, Response> = (req) =>
 *   { status: 200, data: process(req) };
 *
 * const pipeline = createChain(auth, validate, handle);
 * pipeline({ token: "abc", body: "data" }); // { status: 200, ... }
 * ```
 */

import { ok, err } from "@zygos/result/result";
import type { Result } from "@zygos/result/result";

/**
 * A Handler receives an input and a `next` function.
 * It can either return a result directly (stopping the chain)
 * or call `next(input)` to delegate to the next handler.
 *
 * The last handler in the chain receives a `next` that is never called -
 * it must produce a result on its own.
 *
 * @template In - The request/input type
 * @template Out - The response/output type
 * @since 2.4.0
 */
export type Handler<In, Out> = (input: In, next: (input: In) => Out) => Out;

/**
 * Creates a chain from an ordered list of handlers.
 * Each handler can inspect the input and either:
 * - return a result (short-circuit)
 * - call `next(input)` to pass to the next handler
 *
 * The last handler's `next` throws if called, since there is
 * nothing after it. The last handler should always produce a result.
 *
 * @template In - The request/input type
 * @template Out - The response/output type
 * @param handlers - Ordered list of handlers (first = outermost)
 * @returns A function that runs the chain
 * @since 2.4.0
 *
 * @example
 * ```ts
 * const log: Handler<number, string> = (n, next) => {
 *   console.log(`processing ${n}`);
 *   return next(n);
 * };
 *
 * const double: Handler<number, string> = (n) => String(n * 2);
 *
 * const chain = createChain(log, double);
 * chain(21); // logs "processing 21", returns "42"
 * ```
 */
export function createChain<In, Out>(
  ...handlers: Handler<In, Out>[]
): (input: In) => Out {
  if (handlers.length === 0) {
    throw new Error("createChain requires at least one handler");
  }

  return (input: In): Out => {
    let index = 0;

    const next = (inp: In): Out => {
      if (index >= handlers.length) {
        throw new Error("End of chain reached: last handler must not call next()");
      }
      const handler = handlers[index++];
      return handler(inp, next);
    };

    return next(input);
  };
}

/**
 * Creates a safe chain that catches errors and returns a zygos `Result`.
 * Behaves like `createChain`, but wraps the execution in a try/catch.
 *
 * @deprecated Use `Result.fromThrowable` from `@zygos/result/result` instead.
 *
 * ```ts
 * import { Result } from "@zygos/result/result";
 *
 * const chain = createChain(auth, validate, handle);
 * const safeRun = Result.fromThrowable(
 *   (input: Request) => chain(input),
 *   (e) => e instanceof Error ? e : new Error(String(e)),
 * );
 * const result = safeRun(request);
 * ```
 *
 * @see {@link https://pithos.dev/api/eidos/chain/ | Full explanation, examples and live demo}
 * @template In - The request/input type
 * @template Out - The response/output type
 * @param handlers - Ordered list of handlers
 * @returns A function returning `Result<Out, Error>`
 * @since 2.4.0
 */
export function safeChain<In, Out>(
  ...handlers: Handler<In, Out>[]
): (input: In) => Result<Out, Error> {
  const chain = createChain(...handlers);
  return (input: In) => {
    try {
      return ok(chain(input));
    } catch (error) {
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  };
}
