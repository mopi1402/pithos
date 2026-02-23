# ⚠️ This package has moved to [`@pithos/core`](https://www.npmjs.com/package/@pithos/core)

## [2.0.0] - 2026-02-22 — Complete Ecosystem Rewrite

### Breaking Changes

- Complete API redesign — new module structure
- Package renamed from `pithos` to [`@pithos/core`](https://www.npmjs.com/package/@pithos/core)
- The following modules from v1 have been removed and will be available in dedicated packages (Talaria, Themelia) in a future release:
  - **Animations** — `AnimationController`, all easing functions, `AnimationOptions`, `TransitionConfig`, etc.
  - **DOM** — Browser feature detection, CSS utilities
  - **Gestures** — `DragDetector`, `TouchGestureHandler`, `WheelGestureHandler`, etc.
  - **Timing** — `Debouncer`, `EventDebouncerManager`, `FrameScheduler`
  - **Data** — `LocalStorage`

### What's New in 2.0

- **Arkhe** — 70+ array/object/string/function utilities (modern Lodash alternative)
- **Kanon** — Schema validation with JIT compilation (Zod alternative, 2.5× faster)
- **Zygos** — Result pattern & monads (Neverthrow alternative, 3× smaller, 100% API compatible)
- **Sphalma** — Typed error factories with error codes
- **Taphos** — Deprecated utilities with IDE-guided migration paths from Lodash

---

## Migration

```bash
npm i @pithos/core
```

```diff
- "pithos": "^1.x"
+ "@pithos/core": "^2.x"
```

```diff
- import { ok, err } from "pithos/zygos/result/result";
+ import { ok, err } from "@pithos/core/zygos/result/result";
```

```diff
- import { parseFloatDef } from "pithos/arkhe/number/parsers/parseFloatDef";
+ import { parseFloatDef } from "@pithos/core/arkhe/number/parsers/parseFloatDef";
```

---

## Why Upgrade?

### 🛡️ Zero Dependencies
Complete supply chain security. No external vulnerabilities, ever.

### ⚡️ Ultra-Performance

Fully tree-shakable. Benchmarked on February 22, 2026:

| Module | vs | Bundle Size (avg) | Performance (avg) |
|--------|-----|-------------------|-------------------|
| **Arkhe** | Lodash | 20.9× smaller | 8.4× faster |
| **Kanon** | Zod | 4.1× smaller | 11.0× faster |
| **Zygos** | Neverthrow | 2.7× smaller | 1.6× faster |

### 🏛️ TypeScript-First
Full inference, no manual generics, no `any` leaks. Native types included — zero `@types` needed.

### 🧪 Battle-Tested
100% test coverage. 100% mutation testing coverage. Every edge case covered.

### 🔄 Drop-in Replacements
100% API compatible with Neverthrow. Zod-compatible `z` shim covering 90% of common use cases.

---

## Quick Examples

**Data manipulation:**
```typescript
import { chunk } from "@pithos/core/arkhe/array/chunk";
chunk([1, 2, 3, 4, 5, 6], 3); // [[1, 2, 3], [4, 5, 6]]
```

**Schema validation (Zod-like API):**
```typescript
import { validation } from "@pithos/core/kanon/validation";
const User = validation.object({
  name: validation.string(),
  age: validation.number(),
});
```

**Safe error handling:**
```typescript
import { ResultAsync } from "@pithos/core/zygos/result/result-async";
const safeFetch = ResultAsync.fromThrowable(fetch, (e) => `Network error: ${e}`);
```

---

## 5 Modules, One Ecosystem

| Module | Purpose | Alternative to |
|--------|---------|----------------|
| **Arkhe** | 70+ utilities (array, object, string, number) | Lodash, Ramda |
| **Kanon** | Schema validation with JIT compilation | Zod, Yup |
| **Zygos** | Result/Either/Option monads | Neverthrow, fp-ts |
| **Sphalma** | Typed error factories | Custom error classes |
| **Taphos** | Lodash migration with IDE guidance | — |

---

## Links

- 📦 **New package**: [@pithos/core on npm](https://www.npmjs.com/package/@pithos/core)
- 🌐 **Website & docs**: [pithos.dev](https://pithos.dev)
- 🚀 **Get started**: [pithos.dev/guide/get-started](https://pithos.dev/guide/get-started/)
- 📊 **Benchmarks**: [pithos.dev/comparisons/overview](https://pithos.dev/comparisons/overview/)
- 🔬 **Reproduce our benchmarks**: [pithos.dev/comparisons/reproduce](https://pithos.dev/comparisons/reproduce/)
- 🐙 **GitHub**: [github.com/mopi1402/pithos](https://github.com/mopi1402/pithos)
