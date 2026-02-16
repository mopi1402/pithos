---
sidebar_position: 4
sidebar_label: "Sphalma"
title: "Sphalma - Typed Error Factories for TypeScript | Structured Error Handling"
description: "Create structured, identifiable errors with hex codes for TypeScript. Type-safe error factories for debugging, logging, and API error management."
keywords:
  - typescript error handling
  - typed error factory
  - structured errors
  - error codes typescript
  - debugging errors
image: /img/social/sphalma-card.jpg
---

import ModuleName from '@site/src/components/shared/badges/ModuleName';
import { ModuleSchema } from '@site/src/components/seo/ModuleSchema';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

<ModuleSchema
  name="Sphalma"
  description="Typed error factories with hex codes for TypeScript. Create structured, identifiable errors for debugging, logging, and API error management."
  url="https://pithos.dev/guide/modules/sphalma"
/>

# 🆂 <ModuleName name="Sphalma" />

_σφάλμα - "error"_

Typed error factories with hex codes. Create structured, identifiable errors for debugging and logging.

Sphalma provides a systematic way to create and manage application errors. Instead of scattering `new Error("something went wrong")` throughout your codebase, you define error codes upfront and create typed factories that produce consistent, identifiable errors. Each error carries a numeric code, a type label, and optional details, making it straightforward to trace issues in logs and map errors to user-facing messages. The `CodedError` class extends the native [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) with structured metadata.

## Quick Example

Define your error codes as hex constants for readability, then create a typed factory. Every error produced by the factory includes a structured key like `[Api:0x1001]` that is instantly searchable in logs:

```typescript
import { createErrorFactory, CodedError } from "pithos/sphalma/error-factory";

// Define error codes (hex for readability)
const ErrorCodes = {
  NOT_FOUND: 0x1001,
  INVALID_INPUT: 0x1002,
} as const;

// Create a typed factory
const createApiError = createErrorFactory<0x1001 | 0x1002>("Api");

// Throw structured errors
throw createApiError(ErrorCodes.NOT_FOUND, { id: "user-123" });
// Error: [Api:0x1001] with details.id = "user-123"
```

## CodedError

`CodedError` is the structured error class at the heart of Sphalma. It extends the native `Error` with a numeric code, a type label, and an optional details object. The `key` property combines type and code into a unique identifier for filtering and searching:

```typescript
import { CodedError } from "pithos/sphalma/error-factory";

const error = new CodedError(0x2000, "Semaphore", { count: -1 });

error.code;    // 0x2000 (8192)
error.type;    // "Semaphore"
error.key;     // "Semaphore:0x2000"
error.details; // { count: -1 }
error.message; // "[Semaphore:0x2000]"
```

## Error Code Convention

Pithos uses a 4-digit hex format: `0xMFEE`

<div style={{fontFamily: 'var(--ifm-font-family-monospace)', fontSize: '1.1em', lineHeight: '1.8', margin: '1.5em 0', padding: '1em 1.5em', backgroundColor: 'var(--prism-background)', borderRadius: 'var(--ifm-code-border-radius)'}}>
  <code>0x</code>
  <code style={{color: 'var(--prism-keyword)'}}> M</code>
  <code style={{color: 'var(--prism-number)'}}> F</code>
  <code style={{color: 'var(--prism-string)'}}> EE</code>
  <br/>
  <span>   </span>
  <span style={{color: 'var(--prism-keyword)'}}>&nbsp;&nbsp;&nbsp;│</span>
  <span style={{color: 'var(--prism-number)'}}>&nbsp;&nbsp;│</span>
  <span style={{color: 'var(--prism-string)'}}>&nbsp;&nbsp;└── Error (00-FF) → 256 errors per feature</span>
  <br/>
  <span>   </span>
  <span style={{color: 'var(--prism-keyword)'}}>&nbsp;&nbsp;&nbsp;│</span>
  <span style={{color: 'var(--prism-number)'}}>&nbsp;&nbsp;└── Feature (0-F) → 16 features per module</span>
  <br/>
  <span>   </span>
  <span style={{color: 'var(--prism-keyword)'}}>&nbsp;&nbsp;&nbsp;└── Module (1-F) → 15 modules</span>
</div>

Error code ranges will be documented as modules adopt Sphalma.

## Integration with Zygos

Sphalma pairs naturally with Zygos Result types for functional error handling. Instead of throwing errors, return them as typed `Err` values. This makes every failure path visible in the function signature:

```typescript
import { createErrorFactory } from "pithos/sphalma/error-factory";
import { ok, err, Result } from "pithos/zygos/result/result";

const createUserError = createErrorFactory<0x3001 | 0x3002>("User");

function getUser(id: string): Result<User, CodedError> {
  if (!id) return err(createUserError(0x3001, { reason: "Empty ID" }));
  // ...
  return ok(user);
}
```

## ✅ When to Use

Sphalma is most valuable in projects where errors need to be categorized, tracked, and communicated across system boundaries:

- **Module errors** → Consistent error codes across a module
- **API errors** → Frontend can map codes to UI messages
- **Debugging** → `[Animation:0x1001]` is instantly identifiable in logs

## ❌ When NOT to Use

For simple error cases or specialized error handling patterns, consider these alternatives:

| Need | Use Instead |
|------|-------------|
| Simple throw | Native `Error`, `TypeError`, `RangeError` |
| Validation errors | [Kanon](./kanon.md) |
| Error handling flow | [Zygos](./zygos.md) |

---

## Works Well With

Sphalma is designed to integrate with other Pithos modules. Combine [Sphalma error factories with Zygos Result types](./zygos.md) to get typed error codes and functional error propagation in the same pipeline.

For input validation before error handling, [Kanon schema validation](./kanon.md) catches malformed data early, while Sphalma handles domain-level errors that occur after validation passes.

---

<RelatedLinks title="Related Resources">

- [When to use Sphalma](/comparisons/overview/) — Compare Pithos modules with alternatives and find when each is the right choice
- [Full Pithos comparisons](/comparisons/equivalence-table/) — Complete equivalence table mapping Lodash functions to Pithos replacements
- [Sphalma API Reference](/api/sphalma) — Complete API documentation for error factories and CodedError

</RelatedLinks>
