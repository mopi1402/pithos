---
sidebar_position: 1
sidebar_label: "Arkhe"
title: "Arkhe - Modern Lodash Alternative with Zero Dependencies"
description: "Modern TypeScript utilities for arrays, objects, strings, and functions. Tree-shakable, type-safe, and zero dependencies. A lightweight Lodash alternative."
keywords:
  - lodash alternative
  - typescript utilities
  - tree-shakable
  - zero dependencies
  - array utilities
  - object utilities
image: /img/social/arkhe-card.jpg
---

import ModuleName from '@site/src/components/shared/badges/ModuleName';
import { ModuleSchema } from '@site/src/components/seo/ModuleSchema';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

<ModuleSchema
  name="Arkhe"
  description="Modern TypeScript utilities for arrays, objects, strings, and functions. Tree-shakable Lodash alternative with zero dependencies."
  url="https://pithos.dev/guide/modules/arkhe"
/>

# 🅰 <ModuleName name="Arkhe" />

_ἀρχή - "origin"_

Modern, lightweight alternative to lodash. Data manipulation, type guards, and function utilities with TypeScript-first design and optimal tree-shaking.

Arkhe provides a curated set of utility functions for everyday TypeScript development. Unlike Lodash, every function is written in [TypeScript](https://www.typescriptlang.org/) from the ground up, with strict type inference and no runtime type checks. The library ships as [ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) with granular entry points, so bundlers can eliminate unused code automatically.

---

## Quick Example

Each import targets a single function for optimal tree-shaking. Your bundler only includes the code you actually use, keeping your production bundle minimal:

```typescript
import { chunk } from "pithos/arkhe/array/chunk";
import { groupBy } from "pithos/arkhe/array/group-by";
import { get } from "pithos/arkhe/object/get";
import { debounce } from "pithos/arkhe/function/debounce";

const users = [{ name: "Alice", role: "admin" }, { name: "Bob", role: "user" }];

chunk([1, 2, 3, 4, 5], 2);           // [[1, 2], [3, 4], [5]]
groupBy(users, (u) => u.role);       // { admin: [...], user: [...] }
get(users[0], "name", "Anonymous");  // "Alice"
debounce(handleSearch, 300);         // Rate-limited function
```

`chunk` splits an array into groups of a given size. `groupBy` categorizes items by a key function. `get` safely accesses deeply nested properties with a fallback value, avoiding runtime errors on missing paths. `debounce` limits how often a function fires, which is useful for search inputs or resize handlers.

---

## When to Use

Arkhe covers the most common data manipulation needs in TypeScript projects. Whether you are transforming collections, reshaping objects, formatting strings, or controlling function execution, Arkhe provides a type-safe, immutable utility for the job:

- **Arrays**: chunk, groupBy, partition, difference, intersection, orderBy...
- **Objects**: get, set, merge, pick, omit, evolve...
- **Strings**: camelCase, kebabCase, capitalize, template...
- **Functions**: debounce, throttle, memoize, pipe, curry...
- **Async**: retry, parallel, defer, sleep...
- **Types**: Nullable, Arrayable, PartialKeys, type guards...

---

## When NOT to Use

Arkhe focuses on general-purpose data utilities. For specialized needs, other Pithos modules are a better fit:

| Need | Use Instead |
|------|-------------|
| Schema validation | [Kanon](./kanon.md) |
| Error handling (Result/Either) | [Zygos](./zygos.md) |

---

import { InstallTabs } from "@site/src/components/shared/InstallTabs";

## Migrating from Lodash

### Step 1: Install Pithos

<InstallTabs />

### Step 2: Replace imports incrementally

You don't need to migrate everything at once. Replace one function at a time:

```typescript
// Before
import { chunk, groupBy } from "lodash-es";

// After: replace one at a time
import { chunk } from "pithos/arkhe/array/chunk";
import { groupBy } from "lodash-es"; // migrate later
```

### Step 3: Check the equivalence table

Not every Lodash function has an Arkhe equivalent. Some have native JavaScript replacements, and some are intentionally excluded. See the [full equivalence table](/comparisons/equivalence-table/) for a complete mapping.

### Step 4: Run your tests

Arkhe aims for behavioral compatibility on common use cases, but edge cases may differ, especially around:
- Handling of `null`/`undefined` arguments (Arkhe validates inputs, Lodash often silently returns defaults)
- Deep cloning behavior
- Prototype chain handling

For functions that have been superseded by native JavaScript, [Taphos provides IDE-guided migration paths](/guide/modules/taphos/) with deprecation warnings pointing you to the right replacement.

---

<RelatedLinks title="Related Resources">

- [When to use Arkhe](/comparisons/overview/) — Compare Arkhe with alternatives and find when it's the right choice
- [Arkhe bundle size & performance](/comparisons/arkhe/bundle-size/) — Detailed bundle size comparison with Lodash and es-toolkit
- [Arkhe API Reference](/api/arkhe) — Complete API documentation for all Arkhe utilities

</RelatedLinks>
