---
sidebar_label: "🚀 Quick Start"
sidebar_position: 1
title: "Quick Start"
description: "Get started with Pithos in 5 minutes"
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { Highlight } from "@site/src/components/shared/Highlight";
import { FeatureSection } from "@site/src/components/shared/FeatureSection";

# ⚡️ Quick Start

Everything you need to know about Pithos in 5 minutes.

## 🖥️ Installation

<Tabs groupId="package-managers">
  <TabItem value="npm" label="npm" default>
```bash
npm install pithos
```

  </TabItem>
  <TabItem value="pnpm" label="pnpm">
```bash
pnpm install pithos
```

  </TabItem>
  <TabItem value="yarn" label="yarn">
```bash
yarn add pithos
```

  </TabItem>
</Tabs>

That's it. Zero dependencies means zero headaches.

---

## 🎰 What's in the box?

Pithos is a complete utilities ecosystem. One package, five modules:

| !Module     | What it does                                            |
| ----------- | ------------------------------------------------------- |
| **Arkhe**   | Data manipulation (arrays, objects, strings, functions, ...) |
| **Kanon**   | Schema validation with JIT support                      |
| **Zygos**   | Functional error handling (Result, Option, Either, Task) |
| **Sphalma** | Typed error factories with hex codes                    |
| **Taphos**  | Migration guide & deprecated utilities with IDE hints   |

---

## 📎 How to import

Direct imports for optimal tree-shaking:

```typescript
// Array utilities
import { chunk } from "pithos/arkhe/array/chunk";

// Validation
import { object, string, number, optional } from "pithos/kanon";

// Result pattern
import { ok, err } from "pithos/zygos/result/result";
```

---

## 🃏 Quick examples

### Data manipulation

```typescript
import { chunk } from "pithos/arkhe/array/chunk";
import { get } from "pithos/arkhe/object/get";

// Split array into chunks
chunk([1, 2, 3, 4, 5], 2);
// → [[1, 2], [3, 4], [5]]

// Safe nested access
get(user, "profile.address.city", "Unknown");
// → Returns city or "Unknown" if path doesn't exist
```

### Validation

```typescript
import { object, string, number, optional, parse } from "pithos/kanon";
import { asZod } from "pithos/kanon/helpers/as-zod";

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

```typescript
import { ResultAsync } from "pithos/zygos/result/result-async";

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
  imageSrc="/img/quick-start/why-developers-love-it.png" 
  imageAlt="Why developers love it"
  imagePosition="left"
>

<Highlight>Full TypeScript inference.</Highlight> Type it once, infer it everywhere. No manual generics, no `any` leaks.

<Highlight>Zero dependencies.</Highlight> Complete supply chain security. What you install is what you get.

<Highlight>Tree-shakable by design.</Highlight> Import only what you use. Your bundle stays small.

<Highlight>Modern JavaScript.</Highlight> ES2020+, no legacy baggage.

</FeatureSection>

## Why your users benefit

<FeatureSection 
  imageSrc="/img/quick-start/why-your-users-benefit.png" 
  imageAlt="Why your users benefit"
  imagePosition="right"
>

<Highlight>2-3× better performance.</Highlight> Optimized for modern JavaScript runtimes.

<Highlight>Up to 97% smaller bundles.</Highlight> Less code to download, parse, and execute.

<Highlight>Battle-tested reliability.</Highlight> 100% test coverage + 100% mutation testing.

<Highlight>Production-ready.</Highlight> Used and validated in real-world applications.

</FeatureSection>

---

## 🕯️ What's next?

:::info Looking for use cases?
Explore practical examples and find the right utility for your needs in the [Use Cases Explorer](/use-cases).
:::

- [About Pithos](./basics/about-pithos.md) — The story and philosophy behind the project
- [Installation guide](./basics/installation.md) — Advanced setup and configuration
- [Practical Example](./basics/practical-example.md) — Build something real with Pithos
