---
title: "Prototype Pattern in TypeScript"
sidebar_label: "Prototype"
description: "Learn how to implement the Prototype design pattern in TypeScript with functional programming. Clone objects without depending on their classes."
keywords:
  - prototype pattern typescript
  - object cloning
  - deep clone
  - copy objects
  - immutable updates
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Prototype Pattern

Create new objects by copying an existing object (the prototype) rather than creating from scratch.

---

## The Problem

You have a complex configuration object. You need variations of it, but constructing from scratch is tedious and error-prone.

The naive approach:

```typescript
const baseConfig = {
  server: { host: "localhost", port: 3000, ssl: { enabled: true, cert: "..." } },
  database: { host: "localhost", pool: { min: 5, max: 20 } },
  logging: { level: "info", format: "json" },
};

// Creating a test config - manual copying is painful
const testConfig = {
  server: { ...baseConfig.server, port: 3001 },
  database: { ...baseConfig.database, pool: { ...baseConfig.database.pool } },
  logging: { ...baseConfig.logging, level: "debug" },
};
// Forgot to deep-copy ssl? Now they share the same object!
```

Shallow spread doesn't deep-clone. Nested objects are shared. Mutations leak.

---

## The Solution

Clone the prototype, then modify:

```typescript
import { deepClone } from "@pithos/core/arkhe";

const baseConfig = {
  server: { host: "localhost", port: 3000, ssl: { enabled: true, cert: "..." } },
  database: { host: "localhost", pool: { min: 5, max: 20 } },
  logging: { level: "info", format: "json" },
};

// Deep clone, then modify safely
const testConfig = deepClone(baseConfig);
testConfig.server.port = 3001;
testConfig.logging.level = "debug";

// baseConfig is untouched - no shared references
```

True deep copy. Modify freely without affecting the original.

---

## Live Demo

Clone a config, edit fields in the clone, see the diff. Toggle between "Shallow Copy" and "Deep Clone" — shallow copy leaks mutations to the original on nested objects. Deep clone keeps them isolated.

<PatternDemo pattern="prototype" />

---

## Real-World Analogy

A document template. You don't write every letter from scratch — you copy a template and fill in the specifics. The template is the prototype.

---

## When to Use It

Whenever you need variations of a complex nested object — config overrides, test fixtures, game entity spawning, form presets. If the object has nested references, `deepClone` guarantees isolation. Shallow spread doesn't.

---

## When NOT to Use It

If your object is flat (no nesting), the spread operator `{ ...obj }` is simpler and faster. Don't deep-clone when a shallow copy is sufficient.

---

## API

These functions are from [Arkhe](/guide/modules/arkhe/) and re-exported by Eidos:

- [deepClone](/api/arkhe/object/deepClone) — Deep clone with common types (objects, arrays, dates, maps, sets)
- [deepCloneFull](/api/arkhe/object/deepCloneFull) — Deep clone including binary data (TypedArrays, ArrayBuffer, Blob, File)

