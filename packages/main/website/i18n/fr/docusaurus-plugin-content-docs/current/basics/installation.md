---
sidebar_position: 3
title: Installation
description: "Configurez Pithos, la bibliothèque utilitaire TypeScript sans dépendance, avec n'importe quel gestionnaire de paquets et bundler dans vos projets web modernes."
slug: installation
---

import { Code } from "@site/src/components/shared/Code";
import InvisibleList from "@site/src/components/shared/InvisibleList";
import { InstallTabs } from "@site/src/components/shared/InstallTabs";

# 🖥️ Installation

Tout ce dont vous avez besoin pour démarrer avec Pithos : TypeScript, tree-shaking et configuration du bundler.

## Installer le package

Ajoutez Pithos à votre projet avec votre gestionnaire de paquets préféré. Un seul package, tous les modules inclus  (Arkhe, Kanon, Zygos, Sphalma et Taphos), zéro dépendance transitive.

<InstallTabs />

Pithos n'a aucune dépendance runtime et ne fournit que des ES modules.

:::note[Pas de CDN ?]
Pithos n'est pas disponible via CDN. Toute la bibliothèque est conçue autour d'imports granulaires et du tree-shaking : un CDN chargerait l'intégralité du code, annulant le principal avantage de Pithos. Utilisez un bundler pour n'embarquer que ce dont vous avez besoin.
:::

---

## Configuration TypeScript

- Ciblez du JavaScript moderne pour préserver les API natives et l'inférence de types complète :
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
`"moduleResolution": "node"` fonctionne aussi, mais `"bundler"` est recommandé pour l'outillage frontend moderne.
:::

- Aucun path mapping requis : tout est exposé via les exports du package.
- Gardez `esModuleInterop` activé si votre projet mélange CJS/ESM.

---

## Tree-shaking et imports optimaux

- Importez à la granularité fonction/module pour garder les bundles petits :
  ```typescript links="chunk:/api/arkhe/array/chunk,parse:/api/kanon/core/parse,ok:/api/zygos/result/ok,err:/api/zygos/result/err"
  import { chunk } from "pithos/arkhe/array/chunk";
  import { parse } from "pithos/kanon";
  import { ok, err } from "pithos/zygos/result/result";
  ```
- Évitez <Code>import <s>* as Pithos</s> from "pithos"</Code> : le package expose des imports granulaires spécifiquement pour le tree-shaking.
- Tous les exports sont ESM et sans effets de bord ; les bundlers modernes supprimeront automatiquement le code inutilisé.

---

## Compatibilité

**Bundlers** : [Vite](https://vite.dev/) / [esbuild](https://esbuild.github.io/) / [Rollup](https://rollupjs.org/) / [webpack 5+](https://webpack.js.org/) / [Turbopack](https://turbopack.dev/)

Fonctionne directement (ESM + package exports). Gardez `build.target` au minimum `es2020` pour éviter un downleveling inutile.

**Frameworks** : Pithos est agnostique au framework. Il fonctionne avec [React](https://react.dev/), [Vue](https://vuejs.org/), [Angular](https://angular.dev/), [Svelte](https://svelte.dev/), [Astro](https://astro.build/), [Next.js](https://nextjs.org/), [Nuxt](https://nuxt.com/), vanilla JS, ou tout autre environnement JavaScript ([Node.js](https://nodejs.org/), [Deno](https://deno.com/), [Bun](https://bun.sh/), scripts navigateur...).

---

## Checklist rapide

<InvisibleList>
☐ Installer via votre gestionnaire de paquets.  
☐ Si vous utilisez TypeScript : définir `module` = `ESNext` et `target` >= `ES2020` dans tsconfig.  
☐ Importer à la granularité fichier pour le tree-shaking.  
</InvisibleList>

---

## Et ensuite ?

- [Démarrage](../get-started.md) — Voir Pithos en action en 5 minutes
- [Exemple pratique](./practical-example.md) — Construire une vraie fonctionnalité combinant plusieurs modules
- [Bonnes pratiques](./best-practices.md) — Valider aux frontières, faire confiance aux types
