---
title: "Chain of Responsibility Pattern in TypeScript"
sidebar_label: "Chain of Responsibility"
description: "Learn how to implement the Chain of Responsibility design pattern in TypeScript with functional programming. Build flexible request processing pipelines."
keywords:
  - chain of responsibility typescript
  - middleware pattern
  - request pipeline
  - handler chain
  - sequential processing
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Chain of Responsibility Pattern

Pass a request along a chain of handlers. Each handler decides to process the request or pass it to the next handler.

---

## The Problem

You're building an API. Every request needs authentication, validation, rate limiting, and logging. But it's all tangled together:

```typescript
async function handleRequest(req: Request): Promise<Response> {
  // Auth mixed in
  const user = verifyToken(req.headers.authorization);
  if (!user) return new Response("Unauthorized", { status: 401 });

  // Rate limiting mixed in
  if (isRateLimited(user.id)) return new Response("Too many requests", { status: 429 });

  // Validation mixed in
  const body = await req.json();
  if (!isValid(body)) return new Response("Bad request", { status: 400 });

  // Logging mixed in
  console.log(`${req.method} ${req.url} by ${user.id}`);

  // Actual business logic buried at the bottom
  return processBusinessLogic(body);
}
```

Every new concern = modify the handler. Cross-cutting logic is tangled with business logic.

---

## The Solution

Each concern is a middleware. Chain them together, each one decides to handle or pass to next:

```typescript
import { createChain } from "@pithos/core/eidos/chain/chain";

const handleRequest = createChain<Request, Response>(
  // Auth: reject or enrich and pass
  (req, next) => {
    const user = verifyToken(req.headers.authorization);
    if (!user) return new Response("Unauthorized", { status: 401 });
    return next({ ...req, user });
  },
  // Rate limit: reject or pass
  (req, next) => {
    if (isRateLimited(req.user.id)) return new Response("Too Many Requests", { status: 429 });
    return next(req);
  },
  // Validation: reject or pass
  (req, next) => {
    if (!isValid(req.body)) return new Response("Bad Request", { status: 400 });
    return next(req);
  },
  // Logger: observe and always pass
  (req, next) => {
    console.log(`${req.method} ${req.url}`);
    return next(req);
  },
);
```

Add, remove, or reorder middleware without touching others. Each handler has a single responsibility. Sound familiar? It's exactly how Express, Hono, and Koa work under the hood.

---

## Live Demo

<PatternDemo pattern="chain" />

---

## Real-World Analogy

Airport security. Your boarding pass is checked (auth), your bag goes through X-ray (validation), you walk through the metal detector (screening), then you're cleared to board. Each checkpoint can stop you or let you through to the next. Adding a new check doesn't change the others.

---

## When to Use It

- Multiple handlers might process a request
- The handler isn't known in advance
- You want to add/remove processing steps dynamically
- Building middleware pipelines (like Express, Hono, Koa)

---

## When NOT to Use It

If your processing is always the same fixed sequence with no early exits, a simple function composition or pipe is clearer. Chain shines when handlers can short-circuit.

---

## API

- [createChain](/api/eidos/chain/createChain) — Build a handler chain with typed input/output
- [safeChain](/api/eidos/chain/safeChain) — Chain that catches errors and returns Result
