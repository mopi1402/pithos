---
sidebar_label: "Best Practices"
sidebar_position: 4.5
title: "Best Practices"
description: "The Pithos contract: validate at boundaries, trust the types"
slug: best-practices
---

import ResponsiveMermaid from "@site/src/components/ResponsiveMermaid";

# Best Practices

> **The Pithos Contract**: Validate at boundaries, then trust the types.

Pithos is built on a simple premise: TypeScript guarantees your types at compile-time. If you respect that contract, everything flows smoothly. If you cheat, everything breaks.

---

## The Contract

<ResponsiveMermaid
  desktop={`flowchart LR
    E[External data] --> V[Validate with Kanon] --> T[Typed data] --> TR[Trust TypeScript]
`}
/>

1. **Boundaries** = where data enters your system (APIs, user input, files, localStorage)
2. **Validate once** at the boundary with Kanon
3. **Trust the types** everywhere else: no runtime checks needed

This is why Pithos functions don't defensively check types at runtime. TypeScript already did that job.

---

## ❌ Don't

### Type Casting (`as any`, `as unknown`)

The moment you cast, you break the chain of trust.

```typescript
// ❌ Bad: You just told TypeScript to shut up
const data = JSON.parse(response) as User;
processUser(data); // TypeScript trusts you... but should it?

// ❌ Also bad: "I'll validate later" (you won't)
const config = loadConfig() as unknown as AppConfig;
```

**Why it matters**: Pithos functions assume valid types. If you pass garbage disguised as a `User`, you'll get garbage out, or worse, a cryptic runtime error three layers deep.

### Ignoring Results

Zygos `Result` exists to force you to handle errors. Ignoring them defeats the purpose.

```typescript
// ❌ Bad: Silent failure
const result = await fetchUser(id);
if (result.isErr()) return; // Error vanishes into the void

// ❌ Also bad: Pretending it's always Ok
const user = result.value; // TypeScript error, but you might @ts-ignore it
```

**Why it matters**: Unhandled errors become bugs that surface in production, far from their source.

### `@ts-ignore` / `@ts-expect-error`

These are escape hatches, not solutions.

```typescript
// ❌ Bad: Hiding the problem
// @ts-ignore
processUser(maybeUser);
```

**Why it matters**: If TypeScript complains, there's usually a reason. Fix the type, don't silence the compiler.

### Manual Type Annotations on Inferred Values

TypeScript's inference is excellent. Fighting it creates maintenance burden.

```typescript
// ❌ Unnecessary: TypeScript already knows this
const users: User[] = getUsers();
const count: number = users.length;

// ❌ Worse: Now you have to maintain this
const result: Result<User, ApiError> = fetchUser(id);
```

---

## ✅ Do

### Validate at Boundaries

Use Kanon to validate external data exactly once, at the point of entry.

```typescript
import { object, string, number, parse } from "pithos/kanon/v3";

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

### Handle Results Explicitly

Every `Result` should be handled. Use `match`, `map`, or explicit checks.

```typescript
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

### Let Inference Work

Trust TypeScript to figure out types. Add annotations only when necessary.

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

### Use Arkhe Utility Types

Arkhe provides utility types that make your intentions clear.

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

## The Payoff

When you follow the contract:

- **No runtime type checks**: TypeScript already validated at compile-time
- **No defensive coding**: Functions trust their inputs
- **Smaller bundles**: No runtime validation code scattered everywhere
- **Faster execution**: No unnecessary checks on hot paths
- **Clear error sources**: Validation errors happen at boundaries, not deep in business logic

---

## Learn More

- [Core Philosophy](/guide/basics/core-philosophy): The "why" behind these practices
- [Kanon API](/api/kanon): Schema validation at boundaries
- [Zygos API](/api/zygos): Result pattern for error handling
- [Arkhe Types](/api/arkhe): Utility types for cleaner code
