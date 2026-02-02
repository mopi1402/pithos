---
sidebar_position: 7
title: Taphos
---

# Taphos

*τάφος - "tomb" - The resting place of utilities*

## What is Taphos?

Taphos is Pithos's "tomb" module — a place where utilities come to rest. Named after the Greek word for "tomb," Taphos serves two main purposes:

1. **A strategic migration guide** helping you transition from Lodash utilities to their proper replacements
2. **IDE-integrated deprecation warnings** showing the migration path directly in your editor

Think of Taphos as both a cemetery and a memorial. Like any tomb, it marks the end of something — but it also honors what came before and guides visitors toward the future.

<details>
<summary>Why a Tomb?</summary>

The metaphor is intentional and meaningful:

**Dead Code** — When a utility ends up in Taphos, it means the code is **dead**. There's a better way now — whether native JavaScript, a Pithos alternative, or simply a different approach. The message is clear: don't use this anymore.

**A Ceremony** — These utilities served us well. Lodash, Underscore, and similar libraries carried the JavaScript ecosystem for years. Taphos is a way to **honor their service** while acknowledging it's time to move on. It's a respectful farewell, not an unceremonious deletion.

**A Memorial to Visit** — Like a memorial, Taphos is a place you can **visit to learn**. Want to know how to do something in modern JavaScript? Want to understand why a certain pattern is discouraged? Taphos documents these use-cases and points you to the right solution.

</details>

## The Four Types of Burials

Not all functions in Taphos are buried for the same reason. Understanding the type of burial helps you know where to migrate.

### 1. Superseded by Native JavaScript

These utilities have been replaced by native JavaScript/TypeScript APIs. The native version is now the canonical way. This is similar to what [You Don't Need Lodash/Underscore](https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore) documents.

```typescript
// Buried in Taphos
import { flatten } from "pithos/taphos/array/flatten";
const flat = flatten([[1, 2], [3, 4]]);

// ✅ Native replacement
const flat = [[1, 2], [3, 4]].flat();
```

**Migration direction:** Taphos → Native JavaScript

### 2. Native Exists but Violates Pithos Principles

Some native JavaScript functions exist but go against Pithos's design principles — typically because they **mutate** data. These are buried to discourage their use in favor of immutable Pithos alternatives.

```typescript
// ❌ Native sort mutates
const arr = [3, 1, 2];
arr.sort(); // arr is now [1, 2, 3] - mutated!

// ✅ Use Pithos immutable alternative
import { sort } from "pithos/arkhe/array/sort";
const sorted = sort([3, 1, 2]); // Returns new array, original unchanged
```

**Migration direction:** Taphos → Arkhe (Pithos immutable alternative)

### 3. Aliases for Migration Convenience

Some functions in Taphos aren't truly "dead" — they're **aliases** that redirect to the canonical Pithos function. These exist to help developers coming from other libraries (Lodash, Ramda, etc.) find the right function.

```typescript
// Alias in Taphos (Lodash naming)
import { castArray } from "pithos/taphos/util/castArray";

// ✅ Canonical Pithos function
import { toArray } from "pithos/arkhe/array/toArray";

// Both do the same thing, but 'toArray' is the canonical name in Pithos
```

This isn't a real burial — it's a **signpost** saying "you're looking for X? It's over here now."

**Migration direction:** Taphos alias → Canonical Pithos function

### 4. Marked for Future Burial

Some utilities are still in Arkhe but have a known native replacement that's too recent to use. They're living on borrowed time — once the target ES version allows it, they'll be moved to Taphos.

Think of it as a reserved plot in the cemetery. We know who's going there, just not when.

```typescript
// Still in Arkhe (targeting ES2020)
import { groupBy } from "pithos/arkhe/collection/groupBy";
const grouped = groupBy(users, (user) => user.role);

// Future native replacement (ES2024) - not yet available for our target
// const grouped = Object.groupBy(users, (user) => user.role);
```

**Status:** Arkhe (for now) → Taphos (when ES target allows)

## IDE-Guided Migration

Every function in Taphos is marked `@deprecated` and includes its migration path directly in the TSDoc. This means your IDE shows you exactly what to use instead — no need to open the documentation.

```typescript
import { at } from "pithos/taphos/array/at";
//         ^^ Your IDE shows: "Deprecated: Use native Array.prototype.at() instead"
```

When you hover over a Taphos function or see the deprecation warning, the TSDoc tells you:
- **Why** it's deprecated (native replacement, Arkhe alternative, etc.)
- **What** to use instead
- **How** to migrate with code examples

![TSDoc migration hints in IDE](/img/taphos/ide-hint.png)

This makes migration progressive and frictionless — you can keep using Taphos functions while gradually replacing them, guided by your IDE at each step.

## API Reference

[Browse Taphos functions →](/api/taphos)
