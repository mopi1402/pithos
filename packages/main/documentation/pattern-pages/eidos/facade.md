---
title: "Facade Pattern in TypeScript"
sidebar_label: "Facade"
description: "Learn why the Facade design pattern is absorbed by functional TypeScript. Simplify complex subsystems with plain functions."
keywords:
  - facade pattern typescript
  - simplify api
  - wrapper function
  - functional alternative
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# Facade Pattern

Provide a single simplified interface to a complex subsystem.

---

## The Problem

You have a complex user registration flow: validate input, hash password, save to database, send welcome email. The naive approach scatters all these calls at every registration site.

```typescript
// Scattered across controllers, routes, tests...
const validated = validateUser(data);
const hashed = await hashPassword(validated.password);
const user = await saveToDb({ ...validated, password: hashed });
await sendWelcomeEmail(user.email);
```

Every place that registers a user repeats the same sequence. Change the order or add a step? Hunt down every call site.

---

## The Solution

A function that orchestrates the subsystems. That's it.

```typescript
const validateUser = (data: UserInput) => { /* ... */ };
const hashPassword = (password: string) => { /* ... */ };
const saveToDb = (user: User) => { /* ... */ };
const sendWelcomeEmail = (email: string) => { /* ... */ };

// Facade: one function, one place
async function registerUser(data: UserInput): Promise<User> {
  const validated = validateUser(data);
  const hashed = await hashPassword(validated.password);
  const user = await saveToDb({ ...validated, password: hashed });
  await sendWelcomeEmail(user.email);
  return user;
}

// Client only sees registerUser
await registerUser({ name: "Alice", email: "alice@example.com", password: "..." });
```

No class needed. A function that calls functions is already a facade.

:::info Absorbed by the Language
This solution doesn't use Pithos. That's the point.

In functional TypeScript, every function that simplifies a complex operation **is** a facade. Eidos exports a `@deprecated` `createFacade()` function that exists only to guide you here.
:::

---

## Live Demo

Type a user ID and click Fetch. Toggle between "Without Facade" (6 steps executing visually one by one) and "With Facade" (one `fetchUser(id)` call). Same output, radically different experience.

<PatternDemo pattern="facade" />

---

## API

- [facade](/api/eidos/facade/facade) `@deprecated` — just write a function

---

<RelatedLinks title="Related">

- [Eidos: Design Patterns Module](/guide/modules/eidos) All 23 GoF patterns reimagined for functional TypeScript
- [Why FP over OOP?](/guide/modules/eidos#philosophie) The philosophy behind Eidos: no classes, no inheritance, just functions and types
- [Zygos Result](/api/zygos/result/Result) Combine your facades with `Result` for typed error handling

</RelatedLinks>
