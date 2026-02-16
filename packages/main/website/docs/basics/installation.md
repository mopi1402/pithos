---
sidebar_position: 3
title: Installation
description: "Set up Pithos, the zero-dependency TypeScript utilities library, with any package manager and bundler in your modern web projects."
slug: installation
---

import { Code } from "@site/src/components/shared/Code";
import InvisibleList from "@site/src/components/shared/InvisibleList";
import { InstallTabs } from "@site/src/components/shared/InstallTabs";

# 🖥️ Installation

Everything you need to get started with Pithos: TypeScript, tree-shaking, and bundler setup.

## Install the package

Add Pithos to your project using your preferred package manager. The library is published on npm as a single package that includes every module (Arkhe, Kanon, Zygos, Sphalma, and Taphos), so one install gives you the full toolkit with zero transitive dependencies.

<InstallTabs />

Pithos ships zero runtime dependencies and ES modules only.

---

## TypeScript configuration

- Target modern JS to preserve native APIs and full type inference:
  ```json
  {
    "compilerOptions": {
      "target": "ES2020",
      "module": "ESNext",
      "moduleResolution": "bundler",
      "esModuleInterop": true,
      "skipLibCheck": true
    }
  }
  ```

:::tip
`"moduleResolution": "node"` works too, but `"bundler"` is recommended for modern frontend tooling.
:::

- No path mapping required: everything is exposed through package exports.
- Keep `esModuleInterop` enabled if your project mixes CJS/ESM.

---

## Tree-shaking and optimal imports

- Import at function/module granularity to keep bundles small:
  ```typescript
  import { chunk } from "pithos/arkhe/array/chunk";
  import { parse } from "pithos/kanon";
  import { ok, err } from "pithos/zygos/result/result";
  ```
- Avoid <Code>import <s>* as Pithos</s> from "pithos"</Code>: the package exposes per-file entry points specifically for tree-shaking.
- All exports are ESM and side-effect free; modern bundlers will drop unused code automatically.

---

## Compatibility

**Bundlers**: [Vite](https://vite.dev/) / [esbuild](https://esbuild.github.io/) / [Rollup](https://rollupjs.org/) / [webpack 5+](https://webpack.js.org/) / [Turbopack](https://turbopack.dev/)

Works out of the box (ESM + package exports). Keep `build.target` at least `es2020` to avoid unnecessary downleveling.

**Frameworks**: Pithos is framework-agnostic. It works with [React](https://react.dev/), [Vue](https://vuejs.org/), [Angular](https://angular.dev/), [Svelte](https://svelte.dev/), [Astro](https://astro.build/), vanilla JS, or any other JavaScript setup ([Node.js](https://nodejs.org/), [Deno](https://deno.com/), [Bun](https://bun.sh/), browser scripts...).

---

## Quick checklist

<InvisibleList>
☐ Install via your package manager.  
☐ If using TypeScript: set `module` = `ESNext` and `target` >= `ES2020` in tsconfig.  
☐ Import at file granularity for tree-shaking.
</InvisibleList>

---

## What's next?

- [Get Started](../get-started.md) — See Pithos in action in 5 minutes
- [Practical Example](./practical-example.md) — Build a real feature combining multiple modules
- [Best Practices](./best-practices.md) — Validate at boundaries, trust the types
