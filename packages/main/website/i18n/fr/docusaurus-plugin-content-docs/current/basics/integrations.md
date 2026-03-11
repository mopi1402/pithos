---
sidebar_position: 4.2
title: "Intégrations"
description: "Pithos s'intègre sans friction dans votre stack : React, Angular, Preact, Next.js, Nuxt, SvelteKit, Express, Hono ou Bun."
slug: integrations
---

import ResponsiveMermaid from "@site/src/components/shared/ResponsiveMermaid";
import ModuleName from "@site/src/components/shared/badges/ModuleName";
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';

# 🔌 Intégrations

Pithos est **framework-agnostic**. Un seul package, zéro adaptateur, zéro plugin. Vous importez ce dont vous avez besoin, et ça marche, quel que soit votre stack.

Parce que chaque technologie répond à un besoin différent, nous avons écrit plusieurs intégrations de Pithos avec les stacks les plus courantes afin de montrer comment il peut s'intégrer sans friction. Ces pages sont là pour vous aider à comprendre comment l'utiliser en harmonie avec votre techno préférée.

Pas besoin de vous convaincre que Pithos est framework-agnostic... ces intégrations parlent d'elles-mêmes.

:::tip[Philosophie]
Pithos **comble les lacunes, il ne remplace pas ce qui existe**. Quand un framework gère déjà une feature nativement, on l'utilise. Par exemple :
- **Angular** : on passe par `HttpClient` pour les appels réseau, puis on encapsule le résultat dans `ResultAsync` pour la validation
- **SvelteKit** : on utilise `fail()` et `error()` natifs pour la gestion d'erreurs, Sphalma n'est pas nécessaire
- **Nuxt** : on s'appuie sur `createError` et les server routes natives

L'objectif n'est jamais de réinventer la roue, mais de s'intégrer de la façon la plus naturelle possible.
:::

---

## Frontend (SPA)

Applications client-only qui communiquent avec un backend via `fetch`.

| Techno | Pithos | Natif |
|--------|----------------------|------------------------------|
| **[React](https://github.com/mopi1402/pithos/tree/main/packages/main/integrations/react)** | Validation, pipeline async, tri et groupement | State management, routing, rendu |
| **[Angular](https://github.com/mopi1402/pithos/tree/main/packages/main/integrations/angular)** | Validation des réponses API, normalisation des données | `HttpClient`, Signals, Reactive Forms, DI |
| **[Preact](https://github.com/mopi1402/pithos/tree/main/packages/main/integrations/preact)** | Même pipeline que React, bundle minimal (~3 Ko) | Hooks, rendu |

## Fullstack (SSR)

Frameworks avec rendu serveur. Le schéma Kanon est partagé entre client et serveur, une seule source de vérité.

| Techno | Pithos | Natif |
|--------|----------------------|------------------------------|
| **[Next.js](https://github.com/mopi1402/pithos/tree/main/packages/main/integrations/nextjs)** | Validation dans les Server Actions, normalisation | App Router, Server Components, `useActionState` |
| **[Nuxt](https://github.com/mopi1402/pithos/tree/main/packages/main/integrations/nuxt)** | Validation dans les server routes, composables de tri | Auto-imports, `createError`, `defineEventHandler` |
| **[SvelteKit](https://github.com/mopi1402/pithos/tree/main/packages/main/integrations/sveltekit)** | Validation dans les form actions, load functions | `fail()`, `error()`, runes Svelte 5 |

## Backend

Serveurs API purs. Pithos gère la validation des entrées et la normalisation.

| Techno | Pithos | Natif |
|--------|----------------------|------------------------------|
| **[Express](https://github.com/mopi1402/pithos/tree/main/packages/main/integrations/express)** | Validation, normalisation, erreurs métier structurées (`CodedError`) | Routing, middleware, `ErrorRequestHandler` |
| **[Hono](https://github.com/mopi1402/pithos/tree/main/packages/main/integrations/hono)** | Même pipeline que Express | `app.onError`, routing |
| **[Bun](https://github.com/mopi1402/pithos/tree/main/packages/main/integrations/bun)** | Même pipeline, zéro framework | `Bun.serve()`, Web Standards API |

---

## Le pattern commun

Quel que soit le framework, le pipeline reste le même :

1. **Valider** les entrées avec <ModuleName name="Kanon" to="/guide/modules/kanon/" /> via [`ensure`](/api/bridges/ensure/) ou [`ensurePromise`](/api/bridges/ensurePromise/)
2. **Normaliser** les données avec <ModuleName name="Arkhe" to="/guide/modules/arkhe/" /> ([`capitalize`](/api/arkhe/string/capitalize), [`titleCase`](/api/arkhe/string/titlecase), [`groupBy`](/api/arkhe/array/groupBy), [`orderBy`](/api/arkhe/array/orderBy))
3. **Gérer les erreurs** avec <ModuleName name="Zygos" to="/guide/modules/zygos/" /> ([`Result`](/api/zygos/result/), [`ResultAsync`](/api/zygos/result/ResultAsync)) ou les mécanismes natifs du framework
4. **Structurer les erreurs métier** avec <ModuleName name="Sphalma" to="/guide/modules/sphalma/" /> quand le framework n'a pas d'équivalent natif

<DashedSeparator noMarginBottom />
<br />

<ResponsiveMermaid
  desktop={`graph LR
    A[Entrée
    utilisateur] --> B["ensure
    (schema, data)"]
    B -->|Error| C["capitalize,\ntitleCase"]
    C --> D[Stockage]
    B -->|Success| E[Message d'erreur]
    D --> F["groupBy\n + orderBy"]
    F --> G[Affichage]
    linkStyle 1 stroke:#16a34a
    linkStyle 3 stroke:#dc2626
    style C fill:#dcfce7,stroke:#16a34a,color:#166534
    style D fill:#dcfce7,stroke:#16a34a,color:#166534
    style F fill:#dcfce7,stroke:#16a34a,color:#166534
    style G fill:#dcfce7,stroke:#16a34a,color:#166534
    style E fill:#fee2e2,stroke:#dc2626,color:#991b1b`}
/>

<DashedSeparator noMarginBottom />
<br />

:::info[Code source complet]
Chaque intégration est une app fonctionnelle complète avec tests. Les démos frontend et backend sont interchangeables : vous pouvez combiner n'importe quel frontend (React, Angular, Preact) avec n'importe quel backend (Express, Hono, Bun), ils partagent le même contrat API. Explorez le code dans [`packages/main/integrations/`](https://github.com/mopi1402/pithos/tree/main/packages/main/integrations).
:::
