---
sidebar_position: 1
title: Arkhe
---

import ModuleName from '@site/src/components/shared/badges/ModuleName';

# 🅰 <ModuleName name="Arkhe" />

_ἀρχή - "origin"_

Modern, lightweight alternative to lodash. Data manipulation, type guards, and function utilities with TypeScript-first design and optimal tree-shaking.

---

## Quick Example

```typescript
import { chunk } from "pithos/arkhe/array/chunk";
import { groupBy } from "pithos/arkhe/array/group-by";
import { get } from "pithos/arkhe/object/get";
import { debounce } from "pithos/arkhe/function/debounce";

chunk([1, 2, 3, 4, 5], 2);           // [[1, 2], [3, 4], [5]]
groupBy(users, (u) => u.role);       // { admin: [...], user: [...] }
get(user, "profile.name", "Anonymous"); // Safe nested access
debounce(handleSearch, 300);         // Rate-limited function
```

---

## When to Use

- **Arrays**: chunk, groupBy, partition, difference, intersection, orderBy...
- **Objects**: get, set, merge, pick, omit, evolve...
- **Strings**: camelCase, kebabCase, capitalize, template...
- **Functions**: debounce, throttle, memoize, pipe, curry...
- **Async**: retry, parallel, defer, sleep...
- **Types**: Nullable, Arrayable, PartialKeys, type guards...

---

## When NOT to Use

| Need | Use Instead |
|------|-------------|
| Schema validation | [Kanon](./kanon.md) |
| Error handling (Result/Either) | [Zygos](./zygos.md) |

---

## API Reference

[Browse all Arkhe functions →](/api/arkhe)
