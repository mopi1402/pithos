---
sidebar_label: "Overview"
sidebar_position: 1
title: "Pithos Modules Overview"
description: "A quick guide to Pithos modules: Arkhe (utilities), Kanon (validation), and Zygos (error handling) - when to use each and how they compare to alternatives"
---

import { QuickComparisonTable } from '@site/src/components/QuickComparisonTable';

# Pithos Modules Overview

Pithos is organized into three focused modules. Each solves a specific problem with minimal bundle impact.

## Quick Comparison

<QuickComparisonTable />

## When to Use Each Module

### Arkhe — Utility Functions

**Use Arkhe when:**
- You want smaller bundles than Lodash
- You're building a modern app (no IE11)
- You want better TypeScript inference
- You care about supply chain security

**Use Lodash instead when:**
- You need IE11 support
- Your codebase already uses it heavily
- You need `_.cloneDeep` with circular references

**Migration:** Many Lodash functions have native equivalents now. See [Taphos](/api/taphos) for guidance on what to replace with native JS vs Arkhe.

### Kanon — Schema Validation

**Use Kanon when:**
- You want smaller bundles than Zod
- You need basic validation only
- You want zero dependencies
- You're already using Pithos

**Use Zod instead when:**
- You need complex transforms (`.transform()`)
- You need async validation
- You need refinements with custom errors
- You're already using it

**API Comparison:**

```typescript
// Zod
import { z } from "zod";
const schema = z.object({
  name: z.string().min(1),
  age: z.number().positive(),
});

// Kanon
import { validation } from "pithos/kanon/validation";
const schema = validation.object({
  name: validation.string(),
  age: validation.number(),
});
```

### Zygos — Error Handling

**Use Zygos when:**
- You want smaller bundles
- You also need Option/Either/Task monads
- You're already using Pithos
- You want a drop-in Neverthrow replacement

**Use Neverthrow instead when:**
- You installed Pithos only to replace Neverthrow (not worth it alone)
- You want the "original" implementation

**Use fp-ts instead when:**
- You want full functional programming
- You need Functor, Applicative, Monad abstractions
- You're comfortable with Haskell-style FP
- You need `pipe` with type-safe composition

## The Pithos Philosophy

We're not trying to replace everything. We're trying to:

1. <span style={{color: '#e67e22', fontWeight: 600}}>**Cover 80% of needs**</span> with minimal bundle impact
2. <span style={{color: '#e67e22', fontWeight: 600}}>**Stay compatible**</span> where it matters (Neverthrow API)
3. <span style={{color: '#e67e22', fontWeight: 600}}>**Point to native**</span> when JavaScript caught up (Taphos)
4. <span style={{color: '#e67e22', fontWeight: 600}}>**Stay honest**</span> about when other libs are better

Use what works for you. Mix and match if needed.
