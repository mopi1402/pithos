---
sidebar_position: 5
title: "Why No Transformations?"
slug: "no-transformations"
---

# Why Kanon Doesn't Support Transformations

Kanon deliberately **does not support data transformations**. This is a core architectural decision, not a missing feature.

## The Distinction

### Validation vs Transformation

These are fundamentally different operations:

| Operation | Question | Example |
|-----------|----------|---------|
| **Validation** | "Is this data valid?" | `"hello"` is a string ✅ |
| **Transformation** | "Change this into something else" | `"  hello  "` → `"hello"` |

Mixing both creates complexity and unpredictability.

## What Kanon Does

### ✅ Validation

```typescript
import { string, parse } from "pithos/kanon/v3";

parse(string(), "  hello  ");
// → { success: true, data: "  hello  " }
// Data returned as-is
```

### ✅ Coercion (Type Conversion Before Validation)

```typescript
import { coerceNumber, parse } from "pithos/kanon/v3";

parse(coerceNumber(), "123");
// → { success: true, data: 123 }
// Converts type BEFORE validation
```

Coercion is acceptable because it happens **before** validation and is about type conversion, not data manipulation.

### ❌ Transformation (Not Supported)

```typescript
// This doesn't exist in Kanon
string().trim().parse("  hello  "); // ❌ No .trim() method
string().toLowerCase().parse("HELLO"); // ❌ No .toLowerCase() method
string().transform(s => s.slice(0, 10)); // ❌ No .transform() method
```

## Why This Choice?

### 1. Separation of Concerns

**Validation** and **transformation** are different responsibilities:

```typescript
// ❌ Mixed concerns (Zod style)
const schema = z.string().trim().toLowerCase().email();
// Is this validating? Transforming? Both? Unclear.

// ✅ Separated concerns (Kanon style)
const result = parse(string().email(), input);
if (result.success) {
  const normalized = result.data.trim().toLowerCase();
}
// Clear: validation first, then transformation
```

### 2. Predictability

With Kanon, `parse()` always returns data **exactly as received** (if valid):

```typescript
const input = "  Hello World  ";
const result = parse(string(), input);

if (result.success) {
  console.log(result.data === input); // ✅ Always true
}
```

No surprises, no hidden transformations.

### 3. Performance

Transformations add runtime overhead:

```typescript
// Zod: validation + transformation
z.string().trim().toLowerCase().parse(input);
// → Validates, then trims, then lowercases

// Kanon: validation only
parse(string(), input);
// → Validates, returns as-is (faster)
```

### 4. Simplicity

Less code = fewer bugs:

- No transformation logic to maintain
- No edge cases around transformation order
- No questions about "when does transformation happen?"

### 5. Compile-Time > Runtime Philosophy

Transformations are pure runtime operations. Kanon prioritizes what can be done at compile-time (type checking, inference) over runtime magic.

## How to Handle Transformations

### Approach 1: Transform After Validation (Recommended)

```typescript
import { string, parse } from "pithos/kanon/v3";

const result = parse(string().email(), input);

if (result.success) {
  // Transform after validation
  const normalized = result.data.trim().toLowerCase();
  // Use normalized...
}
```

**Benefits:**
- Clear separation of concerns
- Explicit transformation logic
- Easy to test and debug

### Approach 2: Transform Before Validation

```typescript
import { string, parse } from "pithos/kanon/v3";

// Transform first
const normalized = input.trim().toLowerCase();

// Then validate
const result = parse(string().email(), normalized);
```

**Benefits:**
- Normalize input before validation
- Useful for user input sanitization

### Approach 3: Use Coercion for Type Conversion

```typescript
import { coerceNumber, coerceBoolean, parse } from "pithos/kanon/v3";

// Type coercion is built-in
parse(coerceNumber(), "123"); // → { success: true, data: 123 }
parse(coerceBoolean(), "true"); // → { success: true, data: true }
```

**Benefits:**
- Handles common type conversions
- Useful for API inputs, query params, form data

### Approach 4: Use Arkhe Utilities

```typescript
import { string, parse } from "pithos/kanon/v3";
import { evolve } from "pithos/arkhe/object/evolve";

const result = parse(userSchema, input);

if (result.success) {
  // Use Arkhe for complex transformations
  const transformed = evolve(result.data, {
    name: (s) => s.trim().toLowerCase(),
    email: (s) => s.toLowerCase(),
  });
}
```

**Benefits:**
- Leverage Pithos ecosystem
- Declarative transformations
- Type-safe

## What About `asZod()`?

The `asZod()` helper provides Zod-compatible API for **migration purposes**:

```typescript
import { asZod } from "pithos/kanon/v3/helpers/as-zod";
import { string } from "pithos/kanon/v3";

const schema = asZod(string());

// Zod-like methods available
schema.transform(s => s.trim());
schema.preprocess(s => s.toLowerCase());
```

**But:**
- This is a **compatibility layer**, not a core feature
- Adds overhead and complexity
- Only use for gradual migration from Zod

## Comparison with Zod

| Feature | Zod | Kanon |
|---------|-----|-------|
| Validation | ✅ | ✅ |
| Type inference | ✅ | ✅ |
| Transformations | ✅ Built-in | ❌ Not supported |
| `.transform()` | ✅ | ❌ (use `asZod()` for migration) |
| `.preprocess()` | ✅ | ❌ |
| `.trim()`, `.toLowerCase()` | ✅ | ❌ |
| Coercion | ✅ | ✅ |
| Performance | Good | Better (no transformation overhead) |
| Bundle size | Larger | Smaller |

## When to Use Zod Instead

Use Zod if you need:
- Built-in data transformations
- `.transform()` and `.preprocess()` methods
- String manipulation methods (`.trim()`, `.toLowerCase()`, etc.)
- Complex transformation pipelines in schemas

Kanon is for **validation only**. If transformations are a core requirement, Zod is the better choice.

## Philosophy Alignment

This decision aligns with Pithos core philosophy:

> **UX > DX > Code elegance**

- **UX**: No transformation overhead = better performance
- **DX**: Clear separation = easier to understand and debug
- **Compile-time > Runtime**: Validation at runtime, transformations in application code

See [Core Philosophy](../../basics/core-philosophy.md) for more context.

## Summary

**Kanon validates. It doesn't transform.**

This is intentional, not a limitation. It keeps the library:
- Fast (no transformation overhead)
- Simple (less code, fewer bugs)
- Predictable (data returned as-is)
- Focused (one responsibility: validation)

If you need transformations, handle them in your application logic where they belong.
