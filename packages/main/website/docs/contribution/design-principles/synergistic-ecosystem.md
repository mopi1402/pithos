---
sidebar_position: 2
title: Synergistic Ecosystem
description: "How Pithos modules work together as a synergistic ecosystem. Shared conventions, consistent APIs, and interoperability between Arkhe, Kanon, and Zygos."
---

import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# The Synergistic Ecosystem

## The Problem

Developers typically use separate libraries that weren't designed to work together:

```typescript
// The fragmented approach (before Pithos)
import { chunk } from "lodash-es"; // API style A, philosophy A
import { z } from "zod"; // API style B, philosophy B
import { Result } from "neverthrow"; // API style C, philosophy C
// 3 different teams, 3 documentations, 3 ways of doing things 😕
```

## The Pithos Vision

**A layered architecture, from purest to most complex.**

import Mermaid from "@theme/Mermaid";

{(() => {
const styleModule = (name) => `<strong style="color:var(--golden-color); font-family: var(--greek-font), serif; font-weight: 700">${name}</strong>`;

return (
<Mermaid
value={`flowchart TD
WORLD["🌍 OUTSIDE WORLD<br/>(APIs, forms, storage, ...)"]
KANON["📏 ${styleModule("KANON")}<br/>(Boundary)<br/>Validation + Parsing<br/>'Is the data valid?'"]
ARKHE["🏛️ ${styleModule("ARKHE")}<br/>(Foundations)<br/>Pure, immutable primitives<br/>Throw on misuse"]
TAPHOS["⚰️ ${styleModule("TAPHOS")}<br/>(Legacy)"]
ZYGOS["⚡ ${styleModule("ZYGOS")}<br/>(Result/Either)"]
SPHALMA["🔧 ${styleModule("SPHALMA")}<br/>(Error Factories)"]

    WORLD --> KANON
    KANON -->|"✅ Typed and safe data"| ARKHE
    KANON -.->|"deprecated"| TAPHOS
    ARKHE --> ZYGOS
    ZYGOS --> SPHALMA

    classDef legacy fill:#ff000000,stroke:#888888,stroke-width:1px,stroke-dasharray: 5 5
    class TAPHOS legacy

    linkStyle 0 stroke:#888888
    linkStyle 1 stroke:#22c55e,stroke-width:3px
    linkStyle 2 stroke:#888888,stroke-dasharray: 5 5
    linkStyle 3 stroke:#888888
    linkStyle 4 stroke:#ec4899,stroke-width:3px

`}
/>
);
})()}

## Key Synergies

| Combination                                                    | Flow                   | Use Case                                                         |
| -------------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------- |
| <span style={{color: '#22c55e'}}>**Kanon → Arkhe**</span>      | Validate → Transform   | Once validated, Arkhe safely manipulates the data                |
| <span style={{color: '#ec4899'}}>**Sphalma + Zygos**</span>    | Error Factory → Result | Creating typed errors encapsulated in a Result                   |

## Synergy Examples

### Creation: Custom App Error

Here, we create our own application errors using the same infrastructure as Pithos (`Sphalma` + `Zygos`).

```typescript
import { createErrorFactory } from "@sphalma/error-factory";
import { Result, ok, err } from "@zygos/result";
import { validation } from "@kanon/validation";

// 1. Define codes (Hex) for our App
const AppErrorCodes = {
  INVALID_USER_DATA: 0x9001,
  NETWORK_FAILURE: 0x9002,
} as const;

// 2. Create the "App" factory
const createAppError = createErrorFactory<number>("App");

// 3. Business function with Synergy (Kanon + Zygos + Sphalma)
function registerUser(data: unknown): Result<User, Error> {
  // Validation (Kanon)
  const schema = validation.object({ username: validation.string() });
  const parseResult = schema.safeParse(data);

  if (!parseResult.success) {
    // Dispatch a typed error (Sphalma) wrapped in a Result (Zygos)
    return err(
      createAppError(AppErrorCodes.INVALID_USER_DATA, {
        reasons: parseResult.error.issues,
      })
    );
  }

  // Success (Zygos)
  return ok({ id: 1, role: "user" });
}
```

## What This Changes

| Aspect              | Separate Libraries          | Pithos                |
| ------------------- | --------------------------- | --------------------- |
| **API consistency** | 3+ different styles         | Unified style         |
| **Documentation**   | 3+ sources                  | Single source         |
| **Updates**         | Potential incompatibilities | Coordinated evolution |
| **Bundle**          | Possible duplication        | Optimized together    |
| **Learning curve**  | Learn 3+ libs               | Learn one philosophy  |

:::important

**The goal of Pithos is not to replace each library individually.**

It's to provide a **coherent ecosystem** where everything is designed to work together.

**Arkhe + Kanon + Zygos = more than the sum of its parts.**

:::

## Synergy Commitment

To maintain this consistency, each new module or function must:

- [ ] Use the same naming conventions
- [ ] Follow the same error philosophy (throw vs Result)
- [ ] Be compatible with other modules
- [ ] Share the same utility types (Arkhe types)
- [ ] Be documented with the same TSDoc standard

---

## Golden Rules

4. **Kanon is the GUARDIAN**: It converts unknown data (runtime) into typed data (static), failing cleanly via `Result` or `throw` depending on context (but often wrapped).

---

For more details on error handling philosophy, see [Error Handling](./error-handling.md).

---

<RelatedLinks>

- [Design Philosophy](./design-philosophy.md) — The guiding principles behind Pithos
- [Comparison with Alternatives](./comparison-alternatives.md) — How Pithos compares to Lodash, Remeda, and others

</RelatedLinks>
