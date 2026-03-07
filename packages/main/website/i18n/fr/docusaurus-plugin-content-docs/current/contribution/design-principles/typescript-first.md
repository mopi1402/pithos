---
sidebar_position: 5
title: TypeScript-First
description: "Ce que TypeScript-First signifie dans Pithos : les types comme source de vérité, inférence stricte, pas de any, et en quoi cela diffère des bibliothèques TypeScript-ready."
---

import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# TypeScript-First

## Pas « TypeScript-Ready », mais « TypeScript-First »

La différence est cruciale :

```typescript
// ❌ TypeScript-ready (Lodash) - Types ajoutés après coup
// Les types sont souvent approximatifs ou trop permissifs
declare function get(object: any, path: string): any;

// ✅ TypeScript-first (Pithos) - Conçu pour l'inférence
// Types précis, automatiquement inférés
const get = <T, K extends keyof T>(obj: T, key: K): T[K] => obj[key];
```

## Règles Pithos

| Principe                     | Application                                                                                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Inférence maximale**       | Jamais `any`, rarement des génériques explicites                                                                                                                         |
| **Narrowing automatique**    | Les type guards affinent les types                                                                                                                                       |
| **Erreurs au compile-time**  | Attraper les bugs avant l'exécution                                                                                                                                      |
| **Intelligence IDE**         | Autocomplétion, refactoring, go-to-definition                                                                                                                            |
| **Pas de vérifications de types runtime** | Ne jamais vérifier les types au runtime (`typeof`, `instanceof`, `Array.isArray`). TypeScript garantit les types au compile time. Vérifier uniquement les valeurs/plages invalides (ex. `size < 0`) |
| **Nommage explicite des types** | Préférer des noms explicites pour les types génériques (comme React/React Native), sauf pour `T` ou les types trivialement évidents |

## Exemples d'inférence

```typescript
import { chunk } from "@pithos/core/arkhe/array/chunk";

const numbers = [1, 2, 3, 4, 5, 6];
const chunks = chunk(numbers, 2);
//    ^? T[][] inféré comme number[][]

// Le type est automatiquement préservé
chunks.forEach((group) => {
  group.forEach((n) => console.log(n.toFixed(2)));
  //                              ^? number inféré
});
```

## Pas de Any, pas de trappes de secours


```typescript
// ❌ JAMAIS
const process = (data: any) => { ... }

// ✅ TOUJOURS
const process = <T>(data: T) => { ... }
// ou avec des contraintes
const process = <T extends Record<string, unknown>>(data: T) => { ... }
```

---

<RelatedLinks>

- [Design d'API](./api-design.md) — Conventions de nommage et signatures de fonctions
- [Bonnes pratiques](../../basics/best-practices.md) — Laisser l'inférence travailler, faire confiance aux types
- [Documentation & DX](./documentation-dx.md) — Standards TSDoc pour chaque fonction exportée

</RelatedLinks>