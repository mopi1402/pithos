---
sidebar_label: "Get Started"
sidebar_position: 1
title: "Get Started"
description: "Get started with Pithos, the zero-dependency TypeScript utilities library, in just 5 minutes."
---

import { Highlight } from "@site/src/components/shared/Highlight";
import { FeatureSection } from "@site/src/components/shared/FeatureSection";
import { Picture } from "@site/src/components/shared/Picture";
import { InstallTabs } from "@site/src/components/shared/InstallTabs";

# 🚪 Get Started

**Everything you need to know about Pithos in 5 minutes.**

Pithos is a TypeScript utilities library with zero dependencies, designed for modern web development. One package gives you data manipulation, schema validation, and functional error handling: all tree-shakable and fully typed.

## 🖥️ Installation

<InstallTabs />

That's it. Zero dependencies means zero headaches.

---

## 🎰 What's in the box?

Pithos is a complete utilities ecosystem. One package, six modules:

| !Module     | What it does                                            |
| ----------- | ------------------------------------------------------- |
| **Arkhe**   | Data manipulation (arrays, objects, strings, functions, ...) |
| **Eidos**   | Functional design patterns (adapter, proxy, observer, strategy, ...) |
| **Kanon**   | Schema validation with JIT support                      |
| **Sphalma** | Typed error factories with hex codes                    |
| **Taphos**  | Migration guide & deprecated utilities with IDE hints   |
| **Zygos**   | Functional error handling ([Result](/api/zygos/result), [Option](/api/zygos/option), [Either](/api/zygos/either), [Task](/api/zygos/task)) |

---

## 📎 How to import

Pithos uses granular entry points for optimal tree-shaking. Import each function directly from its module path, and your bundler will only include the code you actually use:

```typescript links="chunk:/api/arkhe/array/chunk,object:/api/kanon/schemas/composites/object,string:/api/kanon/schemas/primitives/string,number:/api/kanon/schemas/primitives/number,optional:/api/kanon/schemas/wrappers/optional,ok:/api/zygos/result/ok,err:/api/zygos/result/err"
// Array utilities
import { chunk } from "@pithos/core/arkhe/array/chunk";

// Validation
import { object, string, number, optional } from "@pithos/core/kanon";

// Result pattern
import { ok, err } from "@pithos/core/zygos/result/result";
```

---

## 🃏 Quick examples

### Data manipulation

Arkhe utilities follow a consistent pattern: they take the data as the first argument and return a new value without mutating the original.

This makes them safe to use in any context, from React state updates to server-side processing:

```typescript links="chunk:/api/arkhe/array/chunk,get:/api/arkhe/object/get"
import { chunk } from "@pithos/core/arkhe/array/chunk";
import { get } from "@pithos/core/arkhe/object/get";

// Split array into chunks
chunk([1, 2, 3, 4, 5], 2);
// → [[1, 2], [3, 4], [5]]

// Safe nested access
const user = { profile: { address: { city: "Paris" } } };
get(user, "profile.address.city", "Unknown");
// → "Paris"
```

### Validation

Kanon schemas compose together to describe complex data structures. The [`parse`](/api/kanon/core/parse) function returns a discriminated union, so TypeScript narrows the type automatically in each branch.  
Already using Zod? The [`asZod`](/api/kanon/helpers/asZod) wrapper provides a compatible API, so you can migrate incrementally and benefit from Kanon's full tree-shaking:

```typescript links="object:/api/kanon/schemas/composites/object,string:/api/kanon/schemas/primitives/string,number:/api/kanon/schemas/primitives/number,optional:/api/kanon/schemas/wrappers/optional,parse:/api/kanon/core/parse,asZod:/api/kanon/helpers/asZod"
import { object, string, number, optional, parse } from "@pithos/core/kanon";
import { asZod } from "@pithos/core/kanon/helpers/as-zod";

const userSchema = object({
  name: string(),
  email: string().email(),
  age: optional(number()),
});

// Kanon API
const result = parse(userSchema, data);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}

// Zod-like API
const zSchema = asZod(userSchema);
const zodResult = zSchema.safeParse(data);
if (zodResult.success) {
  console.log(zodResult.data);
} else {
  console.error(zodResult.error.issues);
}
```

### Error handling

[`ResultAsync`](/api/zygos/result/ResultAsync) wraps Promise-based operations in the [Result](/api/zygos/result) pattern.

Instead of try/catch, you get a typed value that forces you to handle both success and failure paths:

```typescript links="ResultAsync:/api/zygos/result/ResultAsync"
import { ResultAsync } from "@pithos/core/zygos/result/result-async";

const safeFetch = ResultAsync.fromThrowable(
  fetch,
  (error) => `Network error: ${error}`
);

const result = await safeFetch("/api/users/1");

if (result.isOk()) {
  console.log(result.value);
} else {
  console.error(result.error); // No try/catch needed
}
```

---

## Why developers love it

<FeatureSection
  image={
    <Picture
      src="/img/generated/quick-start/why-developers-love-it"
      alt="TypeScript utilities with zero dependencies, tree-shakable and type-safe"
      displaySize={200}
      sourceWidth={400}
    />
  }
  imagePosition="left"
>

<Highlight>[Full TypeScript inference.](/guide/contribution/design-principles/typescript-first)</Highlight> Type it once, infer it everywhere. No manual generics, no `any` leaks.

<Highlight>[Zero dependencies.](/guide/basics/installation)</Highlight> Complete supply chain security. What you install is what you get.

<Highlight>[Tree-shakable by design.](/guide/basics/installation)</Highlight> Import only what you use. Your bundle stays small.

<Highlight>[Modern JavaScript.](/guide/contribution/design-principles/design-philosophy)</Highlight> ES2020+, no legacy baggage.

</FeatureSection>

## Why your users benefit

<FeatureSection
  image={
    <Picture
      src="/img/generated/quick-start/why-your-users-benefit"
      alt="Performance benefits: faster execution, smaller bundles, battle-tested reliability"
      displaySize={200}
      sourceWidth={400}
    />
  }
  imagePosition="right"
>

<Highlight>[~7× faster on average.](/comparisons/overview)</Highlight> Your app feels snappier. Users wait less, interactions respond faster.

<Highlight>[~9× smaller bundles on average.](/comparisons/overview)</Highlight> Pages load fast, even on slow connections or low-end devices.

<Highlight>[Battle-tested reliability.](/guide/basics/testing-strategy)</Highlight> Things just work. No surprise crashes or edge-case glitches.

<Highlight>[No silent errors.](/guide/contribution/design-principles/error-handling)</Highlight> Bugs are caught before they ship, so your users never hit unexplainable behavior.

</FeatureSection>

---

## 🕯️ What's next?

:::info Looking for use cases?
Explore practical examples and find the right utility for your needs in the [Use Cases Explorer](/use-cases).
:::

- [About Pithos](./basics/about-pithos.md) - The story and philosophy behind the project
- [Installation guide](./basics/installation.md) - Advanced setup and configuration
- [Practical Example](./basics/practical-example.md) - Build something real with Pithos
