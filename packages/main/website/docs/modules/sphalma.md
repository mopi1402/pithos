---
sidebar_position: 4
title: Sphalma
---

# Sphalma

_σφάλμα - "error"_

Typed error factories with hex codes. Create structured, identifiable errors for debugging and logging.

## Quick Example

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

Structured error with numeric code, type, and optional details.

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

| Module | Range | Example |
|--------|-------|---------|

## Integration with Zygos

Combine with Result for functional error handling:

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

## When to Use

- **Module errors** → Consistent error codes across a module
- **API errors** → Frontend can map codes to UI messages
- **Debugging** → `[Animation:0x1001]` is instantly identifiable in logs

## When NOT to Use

| Need | Use Instead |
|------|-------------|
| Simple throw | Native `Error`, `TypeError`, `RangeError` |
| Validation errors | [Kanon](./kanon.md) |
| Error handling flow | [Zygos](./zygos.md) |

## API Reference

[Browse Sphalma →](/api/sphalma)
