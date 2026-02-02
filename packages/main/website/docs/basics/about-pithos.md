---
sidebar_position: 1
title: About Pithos
slug: about-pithos
---

import ModuleName from "@site/src/components/ModuleName";

# <span style={{display: 'inline-flex', alignItems: 'center', gap: '0.2em'}}><img src="/img/logos/logo.svg" alt="" style={{height: '0.9em'}} /> Pithos</span>

## Why this jar exists

Pithos is the box you open when you're done rewriting the same helpers for the fifth time. It was built to keep the best utilities in one place, typed and battle-tested, so you spend time shipping instead of searching.

:::info From Utils to Ecosystem
Pithos started as a public utility library. While improving it, I realized utilities alone weren't enough. I needed a **coherent ecosystem**. So I merged two of my private packages into Pithos: **Kanon** (schema validation) and **Zygos** (safe error handling).

This marks the shift to a complete ecosystem with a unified philosophy: **trust TypeScript at compile-time, validate at boundaries**.
:::

## The problems that sparked it

- "Where did I put that utility again?"
- Rewriting logic because digging through old repos is slower.
- Great snippets scattered across projects, never improving.
- Fear of supply-chain surprises from external dependencies.

## The answer inside the jar

- ✅ Centralize the proven pieces so they keep getting better.
- ✅ Stay dependency-free to keep builds lean and predictable.
- ✅ Let TypeScript do the heavy lifting: full inference, no `any` leaks.
- ✅ Remain compatible with familiar patterns (Neverthrow/fp-ts style) so migration is easy.

## The myth behind the name

Pandora's "box" was actually a large jar - _pithos_ in Greek. This project embraces that story: a single jar holding both the pains we faced and the solutions we crafted to solve them.

## What you'll find

- <ModuleName name="Arkhe" to="/guide/modules/arkhe/">Core data utilities and TypeScript types (the foundation).</ModuleName>
- <ModuleName name="Kanon" to="/guide/modules/kanon/">Schema validation with a lightweight, Zod-like feel.</ModuleName>
- <ModuleName name="Zygos" to="/guide/modules/zygos/">Result/Either/Option/Task patterns for safe, composable flows.</ModuleName>
- <ModuleName name="Sphalma" to="/guide/modules/sphalma/">Error factories for consistent, typed failures.</ModuleName>
- <ModuleName name="Taphos" to="/guide/modules/taphos/">Deprecated utilities with clear migration paths to modern/native APIs.</ModuleName>

## How it's meant to be used

- Import only what you need: everything is tree-shakeable.
- Mix and match: validation (Kanon) + safe flows (Zygos) + core helpers (Arkhe).
- Rely on the docs and TSDoc comments; every function is described.
