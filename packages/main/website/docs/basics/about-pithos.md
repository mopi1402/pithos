---
sidebar_position: 1
title: About Pithos
slug: about-pithos
description: Pithos is a modern TypeScript utilities library and Lodash alternative with zero dependencies, featuring schema validation and functional error handling.
---

import ModuleName from "@site/src/components/shared/badges/ModuleName";
import InvisibleList from "@site/src/components/shared/InvisibleList";

# <span style={{display: 'inline-flex', alignItems: 'center', gap: '0.2em'}}><img src="/img/emoji/pithos.webp" alt="Pithos logo" style={{height: '1.2em'}} /> Pithos</span>

## Why this jar exists

Pithos is a modern TypeScript utilities library you open when you're done rewriting the same helpers for the fifth time.  
Built as a unified alternative to Lodash, Zod, and Neverthrow with zero dependencies, it keeps everything in one place, fully typed and thoroughly tested, so you spend time shipping instead of searching.

:::info From Utils to Ecosystem
Pithos started as a utility library, then grew into a complete ecosystem by merging two standalone projects: **Kanon** (schema validation) and **Zygos** (functional error handling).

One unified philosophy: **trust TypeScript at compile-time, validate at boundaries**.
:::

---

## The problems that sparked it

- "Where did I put that utility again?"
- Rewriting logic because digging through old repos is slower.
- Great snippets scattered across projects, never improving.
- Fear of supply-chain surprises from external dependencies.

---

## The answer inside the jar

<InvisibleList>
✅ Centralize the proven pieces so they keep getting better.  
✅ Stay dependency-free to keep builds lean and predictable.  
✅ Let TypeScript do the heavy lifting: full inference, no `any` leaks.  
✅ Familiar API patterns so migration from existing tools is seamless.  
</InvisibleList>

---

## The myth behind the name

Pandora's "box" was actually a large jar: _pithos_ in Greek.  
This project embraces that story: a single jar holding both the pains we faced and the solutions we crafted to solve them.

---

## What you'll find

- <ModuleName name="Arkhe" to="/guide/modules/arkhe/">Core data utilities and TypeScript types (the foundation).</ModuleName>
- <ModuleName name="Kanon" to="/guide/modules/kanon/">Schema validation with a lightweight, Zod-like feel.</ModuleName>
- <ModuleName name="Zygos" to="/guide/modules/zygos/">Result/Either/Option/Task patterns for safe, composable flows.</ModuleName>
- <ModuleName name="Sphalma" to="/guide/modules/sphalma/">Error factories for consistent, typed failures.</ModuleName>
- <ModuleName name="Taphos" to="/guide/modules/taphos/">Deprecated utilities with clear migration paths to modern/native APIs.</ModuleName>

---

## How it's meant to be used

- Import only what you need: everything is tree-shakable.
- Mix and match: validation (Kanon) + safe flows (Zygos) + core helpers (Arkhe).
- Rely on the docs and TSDoc comments; every function is described.

---

## Next steps

- [Get Started](../get-started.md) — Get up and running in 5 minutes
- [Installation](./installation.md) — Advanced setup and configuration
- [Best Practices](./best-practices.md) — The Pithos contract: validate at boundaries, trust the types
- [Practical Example](./practical-example.md) — Build something real with Pithos
