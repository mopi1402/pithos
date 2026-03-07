---
sidebar_position: 8
title: Performance & Taille du Bundle
description: "Stratégies de performance et de taille de bundle dans Pithos : tree-shaking, zéro dépendance, APIs modernes et exports granulaires pour une empreinte minimale."
keyword_stuffing_ignore:
  - native
---

import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# Performance & Taille du Bundle

## Principes

| Objectif              | Stratégie                                        |
| --------------------- | ------------------------------------------------ |
| **Tree-shaking**      | Exports granulaires, pas de barrel exports        |
| **Zéro dépendance**   | Aucune dépendance externe                         |
| **APIs modernes**     | Utiliser les APIs natives quand équivalent         |
| **Pas de code mort**  | Pas de code legacy pour anciens navigateurs        |
| **Optimisation des boucles** | Préférer les boucles `for` pour les opérations critiques |

## Optimisation des boucles

Pour les opérations critiques en performance, préférez les boucles `for` aux méthodes chaînées (`map`, `filter`, `reduce`). Les boucles `for` évitent les allocations intermédiaires et le surcoût des appels de fonction.

```typescript
// ✅ Bien : boucle for pour la performance
export function keyBy<T>(
  array: readonly T[],
  iteratee: (value: T) => PropertyKey
): Record<string, T> {
  const result: Record<string, T> = {};
  for (let i = 0; i < array.length; i++) {
    const key = String(iteratee(array[i]));
    result[key] = array[i];
  }
  return result;
}

// ✅ Bien : les méthodes Array sont acceptables pour du code simple et lisible
export function difference<T>(array: readonly T[], values: readonly T[]): T[] {
  const excludeSet = new Set(values);
  return array.filter((item) => !excludeSet.has(item));
}
```

**Documentation de la complexité** : Utilisez le tag `@performance` dans TSDoc pour documenter la complexité temporelle (O(n), O(n²), etc.) quand c'est pertinent.

## Structure des imports

```typescript links="chunk:/api/arkhe/array/chunk"
// ✅ Import direct (tree-shaking optimal)
import { chunk } from "@pithos/core/arkhe/array/chunk";
import { isString } from "@pithos/core/arkhe/is/isString";

// ⚠️ Import groupé (acceptable, tree-shakable)
import { chunk, map, filter } from "@pithos/core/arkhe/array";

// ❌ Import global (à éviter, inclut tout)
import * as Arkhe from "@pithos/core/arkhe";
```

## Cible ES2020+

Pithos cible ES2020+ pour bénéficier des APIs modernes :

```typescript
// Utilisation des APIs natives modernes
Object.fromEntries()    // au lieu d'un fromPairs custom
Array.prototype.flat()  // au lieu d'un flatten custom
??                      // nullish coalescing
?.                      // optional chaining
```

:::tip

**Philosophie** : Si une API native fait le travail, ne la réimplémentez pas.

Documentez l'alternative native dans Taphos (utilitaires dépréciés).

:::

---

<RelatedLinks>

- [Design de l'API](./api-design.md) — Conventions de nommage et signatures de fonctions
- [Arkhe vs Lodash — Taille du Bundle](/comparisons/arkhe/bundle-size) — Comparaisons réelles de taille de bundle
- [Taphos — Équivalence Native](/comparisons/taphos/native-equivalence/) — Quand le JS natif suffit

</RelatedLinks>
