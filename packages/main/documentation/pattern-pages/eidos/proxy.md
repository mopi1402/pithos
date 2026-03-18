---
title: "Proxy Pattern in TypeScript"
sidebar_label: "Proxy"
description: "Learn how to implement the Proxy design pattern in TypeScript with functional programming. Control access to functions with caching, rate limiting, and fallback."
keywords:
  - proxy pattern typescript
  - llm proxy
  - api caching
  - rate limiting
  - function proxy
  - memoization
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Proxy Pattern

Provide a surrogate or placeholder for another object to control access to it.

---

## The Problem

You're calling an LLM API from your app. Every call costs money and takes time. The same question asked twice shouldn't cost twice. Users spam the button. And when the primary provider goes down, your app crashes.

The naive approach:

```typescript
async function askLLM(question: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat", {
    method: "POST",
    body: JSON.stringify({ prompt: question }),
  });
  return response.json(); // $0.003 every single time
}

// "What is the capital of France?" asked 10 times = 10 API calls = $0.03
// Provider goes down? App crashes.
// User spams? You burn through your rate limit.
```

No cache. No rate limit. No fallback. Every call hits the API, burns money, and prays the provider stays up.

---

## The Solution

Wrap the function with proxy layers. Same interface, three layers of protection:

```typescript
import { memoize, throttle } from "@pithos/core/arkhe";
import { withFallback } from "@pithos/core/eidos/strategy/strategy";

// 1. Cache: same question = instant response, $0.000
const cachedAsk = memoize(askLLM);

// 2. Rate limit: max 1 call per second
const rateLimitedAsk = throttle(cachedAsk, 1000);

// 3. Fallback: if primary fails, try backup silently
const resilientAsk = withFallback(rateLimitedAsk, askBackupLLM);

// Consumer code is identical — just a function call
const answer = await resilientAsk("What is the capital of France?");
// First call:  1.2s, $0.003 — cache miss
// Second call: 2ms,  $0.000 — cache hit ⚡
```

Three Pithos utilities, three proxy layers. The consumer never knows about caching, rate limiting, or failover.

---

## Live Demo

Ask questions to a simulated LLM and watch the proxy in action: cache hits, rate limits, and provider failover.

<PatternDemo pattern="proxy" />

---

## Real-World Analogy

A credit card is a proxy for your bank account. It provides the same "pay for things" interface, but adds access control (credit limit), logging (transaction history), and can work offline (signature-based transactions).

---

## When to Use It

- Cache expensive computations or API calls
- Rate-limit access to external services
- Add fallback/retry logic without changing consumer code
- Add logging or metrics transparently
- Lazy-load resources on first access

---

## When NOT to Use It

If the function is cheap, fast, and reliable, a proxy adds overhead for no benefit. Don't cache a function that returns `Date.now()` or wrap a pure synchronous calculation in a rate limiter.

---

## Proxy Variants in Arkhe

Arkhe provides several proxy utilities:

```typescript
import { memoize, once, throttle, debounce, lazy, guarded } from "@pithos/core/arkhe";

// Caching proxy — cache results by arguments
const cached = memoize(expensiveCalculation);

// Single-execution proxy — run only once
const initialize = once(loadConfig);

// Rate-limiting proxies
const throttled = throttle(saveToServer, 1000);  // max once per second
const debounced = debounce(search, 300);         // wait for pause in calls

// Lazy initialization proxy
const config = lazy(() => loadExpensiveConfig());

// Conditional execution proxy
const adminOnly = guarded(deleteUser, (user) => user.isAdmin);
```

---

## API

These functions are from [Arkhe](/guide/modules/arkhe/) and re-exported by Eidos:

- [memoize](/api/arkhe/function/memoize) — Cache function results
- [once](/api/arkhe/function/once) — Execute only on first call
- [throttle](/api/arkhe/function/throttle) — Limit call frequency
- [debounce](/api/arkhe/function/debounce) — Delay until calls stop
- [lazy](/api/arkhe/function/lazy) — Defer initialization
- [guarded](/api/arkhe/function/guarded) — Conditional execution
- [withFallback](/api/eidos/strategy/withFallback) — Chain a primary function with a backup (from [Strategy](/api/eidos/strategy/))
