---
sidebar_label: "Best Practices"
sidebar_position: 4.5
title: "Best Practices"
description: "Discover best practices for using Pithos: validate data at boundaries with Kanon and trust TypeScript for your business logic."
slug: best-practices
keyword_stuffing_ignore:
  - types
---

import ResponsiveMermaid from "@site/src/components/shared/ResponsiveMermaid";
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';

# ✅ Best Practices

These practices aren't style conventions: they follow directly from how Pithos works. Respecting them ensures the library behaves as intended.

:::warning[The Pithos Contract]
Pithos delegates type checking entirely to TypeScript and does not duplicate it at runtime.  
That's why **validating at boundaries and trusting the types** isn't just a recommendation, it's a requirement for everything to work as expected.  
This principle is directly inspired by the [Parse, don't validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/) approach.
:::

---

## ✍️ The Contract

### ❌ Scattered validation (shotgun parsing)

Without a clear contract, type checks multiply at every step. Each function doubts its inputs, the code fills up with defensive checks, and errors can surface anywhere.

<ResponsiveMermaid
  desktop={`flowchart LR
    API[API] --> C1{typeof ?}
    C1 --> |ok| T[Processing]
    C1 --> |ko| E1[❌]
    T --> C2{null ?}
    C2 --> |ok| L[Logic]
    C2 --> |ko| E2[❌]
    L --> C3{valid ?}
    C3 --> |ok| DB[DB]
    C3 --> |ko| E3[❌]

    style C1 fill:#e74c3c,color:#fff
    style C2 fill:#e74c3c,color:#fff
    style C3 fill:#e74c3c,color:#fff
    style E1 fill:#e74c3c,color:#fff
    style E2 fill:#e74c3c,color:#fff
    style E3 fill:#e74c3c,color:#fff
`}
/>

<span style={{color: '#e74c3c'}}>■</span> Errors and defensive checks

### ✅ Parse, don't validate

With the Pithos contract, you validate once at the boundary. All downstream code trusts the types. One checkpoint, zero doubt after that.

<ResponsiveMermaid
  desktop={`flowchart LR
    API[API] --> K{Kanon parse}
    K --> |❌| E[Clear error]
    K --> |✅| TY[Typed data]
    TY --> T[Processing]
    TY --> L[Logic]
    TY --> DB[DB]

    style K fill:#f39c12,color:#fff
    style TY fill:#2ecc71,color:#fff
    style T fill:#2ecc71,color:#fff
    style L fill:#2ecc71,color:#fff
    style DB fill:#2ecc71,color:#fff
    style E fill:#e74c3c,color:#fff
`}
/>

1. <span style={{color: '#f39c12', fontWeight: 'bold'}}>Boundaries</span> = where data enters your system (APIs, user input, files, localStorage)
2. <span style={{color: '#f39c12', fontWeight: 'bold'}}>Validate once</span> at the boundary with Kanon
3. <span style={{color: '#2ecc71', fontWeight: 'bold'}}>Trust the types</span> everywhere else: no runtime checks needed

This is why Pithos functions don't defensively check types at runtime. TypeScript already did that job.

---

## How to respect the contract

### ❌ Don't

#### Type Casting (`as any`, `as unknown`)

The moment you cast, you break the chain of trust.

```typescript
// ❌ Bad: You just told TypeScript to shut up
const data = JSON.parse(response) as User;
processUser(data); // TypeScript trusts you... but should it?

// ❌ Also bad: "I'll validate later" (you won't)
const config = loadConfig() as unknown as AppConfig;
```

> **The risk**: Pithos functions assume valid types. If you pass garbage disguised as a `User`, you'll get garbage out, or worse, a cryptic runtime error three layers deep.

:::info[Need to check a type?]
`as unknown` is often used before a manual type check. Arkhe provides ready-made [guards and predicates](/api/arkhe/is/guard/) (`isString`, `isNumber`, `isPlainObject`...) to avoid this work and keep TypeScript narrowing intact.
:::

<DashedSeparator noMarginBottom />

#### Ignoring Results

Zygos `Result` exists to force you to handle errors. Ignoring them defeats the purpose.

```typescript
// ❌ Bad: Silent failure
const result = await fetchUser(id);
if (result.isErr()) return; // Error vanishes into the void

// ❌ Also bad: Pretending it's always Ok
const user = result.value; // TypeScript error, but you might @ts-ignore it
```

> **The problem**: Unhandled errors become bugs that surface in production, far from their source.

<DashedSeparator noMarginBottom />

#### `@ts-ignore` / `@ts-expect-error`

These are escape hatches, not solutions.

```typescript
// ❌ Bad: Hiding the problem
// @ts-ignore
processUser(maybeUser);
```

If TypeScript complains, there's usually a reason. Fix the type, silencing the compiler is rarely the right call.

<DashedSeparator noMarginBottom />

#### Manual Type Annotations on Inferred Values

TypeScript's inference is excellent. Fighting it creates maintenance burden.

```typescript
// ❌ Unnecessary: TypeScript already knows this
const users: User[] = getUsers();
const count: number = users.length;

// ❌ Worse: Now you have to maintain this
const result: Result<User, ApiError> = fetchUser(id);
```

---

### ✅ Do

#### Validate at Boundaries

Use Kanon to validate external data exactly once, at the point of entry. Once data passes validation, every downstream function can trust the types without additional runtime checks. This keeps your codebase clean and your bundle small:

```typescript links="object:/api/kanon/schemas/composites/object,string:/api/kanon/schemas/primitives/string,number:/api/kanon/schemas/primitives/number,parse:/api/kanon/core/parse"
import { object, string, number, parse } from "pithos/kanon";

const UserSchema = object({
  id: string(),
  name: string(),
  age: number(),
});

// ✅ Good: Validate at the boundary
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  
  const result = parse(UserSchema, data);
  if (!result.success) {
    return err(result.error);
  }
  
  return ok(result.data); // Now it's a real User
}

// ✅ Downstream code trusts the type
function processUser(user: User) {
  // No need to check if user.name exists: Kanon already validated
  return user.name.toUpperCase();
}
```

<DashedSeparator noMarginBottom />

#### Handle Results Explicitly

Every `Result` should be handled. Use `match`, `map`, or explicit checks. The compiler helps you here: if you forget to handle a case, TypeScript will flag it. This makes error handling visible and intentional rather than accidental:

```typescript links="ok:/api/zygos/result/ok,err:/api/zygos/result/err"
import { ok, err, Result } from "pithos/zygos/result/result";

// ✅ Good: Explicit handling with match
const message = result.match({
  ok: (user) => `Welcome, ${user.name}!`,
  err: (error) => `Error: ${error.message}`,
});

// ✅ Good: Transform success, propagate errors
const upperName = result.map((user) => user.name.toUpperCase());

// ✅ Good: Early return with clear intent
if (result.isErr()) {
  logger.error("Failed to fetch user", result.error);
  return showErrorPage(result.error);
}
const user = result.value; // TypeScript knows it's Ok here
```

<DashedSeparator noMarginBottom />

#### Let Inference Work

Trust TypeScript to figure out types. Add annotations only when necessary. Redundant type annotations create maintenance burden and can mask real type errors when the underlying code changes:

```typescript
// ✅ Good: Inference handles it
const users = getUsers();
const count = users.length;
const result = fetchUser(id);

// ✅ Good: Annotation needed for function parameters
function processUser(user: User) { ... }

// ✅ Good: Annotation needed for empty collections
const cache: Map<string, User> = new Map();
```

<DashedSeparator noMarginBottom />

#### Use Arkhe Utility Types

Arkhe provides utility types that make your intentions clear. These types communicate the shape and constraints of your data at the type level, so other developers understand the contract without reading the implementation:

```typescript
import type { Arrayable } from "pithos/arkhe/types/common/arrayable";
import type { Nullish } from "pithos/arkhe/types/common/nullish";
import type { DeepPartial } from "pithos/arkhe/types/utilities/deep-partial";

// ✅ Clear intent: accepts single item or array
function process(input: Arrayable<User>) {
  const users = Array.isArray(input) ? input : [input];
  // ...
}

// ✅ Clear intent: might be null or undefined
function findUser(id: string): Nullish<User> {
  return users.get(id) ?? null;
}

// ✅ Clear intent: partial at any depth
function updateConfig(patch: DeepPartial<Config>) {
  // ...
}
```

---

## 🎁 The Payoff

When you follow the contract:

- **No runtime type checks**: TypeScript already validated at compile-time
- **No defensive coding**: Functions trust their inputs
- **Smaller bundles**: No runtime validation code scattered everywhere
- **Faster execution**: No unnecessary checks on hot paths
- **Clear error sources**: Validation errors happen at boundaries, not deep in business logic

---

## 🕯️ Learn More

- [Core Philosophy](/guide/basics/core-philosophy): The "why" behind these practices
- [Kanon API](/api/kanon): Schema validation at boundaries
- [Zygos API](/api/zygos): Result pattern for error handling
- [Arkhe Types](/api/arkhe): Utility types for cleaner code
