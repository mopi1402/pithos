---
sidebar_position: 3
sidebar_label: "Module Alchemy"
title: "Module Alchemy : Pithos Modules Working Together"
description: "See how Pithos modules combine: Kanon validation to Zygos Result with ensure(), Sphalma typed errors in Result chains, Arkhe transforms with Kanon validation, and full pipelines."
keywords:
  - pithos modules synergy
  - kanon zygos bridge
  - ensure validation result
  - typescript validation pipeline
  - sphalma zygos integration
---

import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# 🪢 Module Alchemy

Each Pithos module solves one problem and works on its own. But some combine naturally to simplify your code. This page covers a few combinations and the synergies they create.

---

## Kanon + Zygos = `ensure()`

The only dedicated bridge function in Pithos. [`ensure()`](/api/bridges/ensure/) takes a [Kanon](/guide/modules/kanon/) schema and returns a [`Result`](/api/zygos/result/) instead of a plain `{ success, data }` object, so you can chain validation with everything else.

### Benefit of `ensure()`

Kanon's `parse()` works fine on its own. But the moment you chain validation with other operations, you end up writing imperative `if/else` blocks:

```typescript
const parsed = parse(schema, data);
if (!parsed.success) {
  return handleError(parsed.error);
}
const transformed = transform(parsed.data);
// ... more if/else for each step
```

`ensure()` simply returns a `Result`:

```typescript links="ensure:/api/bridges/ensure"
import { ensure } from "pithos/bridges/ensure";
import { object, string, number } from "pithos/kanon";

const UserSchema = object({
  name: string().minLength(1),
  age: number().min(0).int(),
});

ensure(UserSchema, data)
  .map(user => ({ ...user, name: user.name.trim() }))
  .mapErr(error => `Validation failed: ${error}`);
```

### Variants

| Function | Returns | Use when |
|----------|---------|----------|
| `ensure()` | `Result<T, string>` | Sync validation : forms, configs, function args |
| `ensureAsync()` | `ResultAsync<T, string>` | Async chains : when data is already resolved in a `ResultAsync` pipeline |
| `ensurePromise()` | `ResultAsync<T, string>` | Promise + validation in one step -> fetch, DB queries |

`ensurePromise()` eliminates the `ResultAsync.fromPromise(...).andThen(...)` boilerplate:

```typescript links="ensurePromise:/api/bridges/ensurePromise"
import { ensurePromise } from "pithos/bridges/ensurePromise";
import { object, string, number } from "pithos/kanon";

const UserSchema = object({
  name: string().minLength(1),
  age: number().min(0).int(),
});

// One line: fetch + validate + typed ResultAsync
ensurePromise(UserSchema, fetch("/api/user").then(r => r.json()))
  .map(user => user.name.toUpperCase());
```

---

## Sphalma + Zygos : Typed errors in Result chains

Instead of throwing errors, return them as typed [`Err`](/api/zygos/result/err/) values. [`CodedError`](/api/sphalma/error-factory/) carries a hex code, a type label, and optional details. Every failure path is visible in the function signature:

```typescript links="createErrorFactory:/api/sphalma/error-factory,ok:/api/zygos/result/ok,err:/api/zygos/result/err"
import { createErrorFactory, CodedError } from "pithos/sphalma/error-factory";
import { ok, err, Result } from "pithos/zygos/result/result";

const createUserError = createErrorFactory<0x3001 | 0x3002>("USER_ERROR");

function getUser(id: string): Result<User, CodedError> {
  if (!id) return err(createUserError(0x3001, { reason: "Empty ID" }));
  const user = db.find(id);
  if (!user) return err(createUserError(0x3002, { id }));
  return ok(user);
}

// The caller handles both cases explicitly
getUser("user-123").match(
  user => console.log(user.name),
  error => console.log(error.key) // "USER_ERROR:0x3002"
);
```

No `try/catch`, no untyped `string` errors. The compiler knows exactly what can go wrong.

---

## Kanon + Sphalma : Validation to domain errors

Kanon catches malformed data. Sphalma handles domain-level errors that occur after validation passes. Together, they cover the full error spectrum:

```typescript links="createErrorFactory:/api/sphalma/error-factory,ok:/api/zygos/result/ok,err:/api/zygos/result/err"
import { parse, object, string, number } from "pithos/kanon";
import { createErrorFactory, CodedError } from "pithos/sphalma/error-factory";
import { ok, err, Result } from "pithos/zygos/result/result";

const createOrderError = createErrorFactory<0x4001 | 0x4002>("ORDER_ERROR");

const OrderSchema = object({
  product: string().minLength(1),
  quantity: number().min(1).int(),
});

function createOrder(input: unknown): Result<Order, CodedError | string> {
  // Step 1: Kanon validates the shape
  const parsed = parse(OrderSchema, input);
  if (!parsed.success) return err(parsed.error);

  // Step 2: Sphalma handles business rules
  if (!isInStock(parsed.data.product)) {
    return err(createOrderError(0x4001, { product: parsed.data.product }));
  }

  return ok(saveOrder(parsed.data));
}
```

Kanon says "is this data well-formed?", Sphalma says "is this operation valid?".

---

## Arkhe → Taphos : a continuity, not a synergy

This isn't a combination of two modules, it's the natural lifecycle of a function. When a native equivalent ships, an Arkhe utility moves to Taphos where it becomes a deprecated polyfill. Your IDE guides you toward the native replacement at your own pace.

See the [Taphos page](/guide/modules/taphos/) for the full migration diagram and code examples.

---

## The full pipeline

Combine all four modules in a single typed chain : validate, transform, handle errors, and propagate structured failures:

```typescript links="ensure:/api/bridges/ensure,createErrorFactory:/api/sphalma/error-factory,ok:/api/zygos/result/ok,err:/api/zygos/result/err"
import { ensure } from "pithos/bridges/ensure";
import { object, string, number } from "pithos/kanon";
import { createErrorFactory, CodedError } from "pithos/sphalma/error-factory";
import { ok, err, Result } from "pithos/zygos/result/result";
import { capitalize, trim } from "pithos/arkhe";

const createApiError = createErrorFactory<0x5001 | 0x5002>("API_ERROR");

const ContactSchema = object({
  name: string().minLength(1),
  email: string().email(),
  age: number().min(18).int(),
});

function processContact(input: unknown): Result<Contact, CodedError | string> {
  return ensure(ContactSchema, input)
    // Arkhe transforms
    .map(data => ({
      ...data,
      name: capitalize(trim(data.name)),
    }))
    // Domain validation with Sphalma
    .andThen(data => {
      if (isBlacklisted(data.email)) {
        return err(createApiError(0x5001, { email: data.email }));
      }
      return ok(data);
    });
}
```

- Kanon validates the shape.
- Arkhe transforms the data.
- Zygos chains everything.
- Sphalma structures the errors.

> One pipeline, four modules, zero `try/catch`.

---

<RelatedLinks title="Related Resources">

- [Kanon : Schema Validation](/guide/modules/kanon/) : Define schemas with Kanon
- [Zygos : Result Types](/guide/modules/zygos/) : Chain and handle errors with Result
- [Sphalma : Typed Errors](/guide/modules/sphalma/) : Structured error factories
- [Practical Example](/guide/basics/practical-example/) : See Kanon + Zygos in a real use case

</RelatedLinks>
