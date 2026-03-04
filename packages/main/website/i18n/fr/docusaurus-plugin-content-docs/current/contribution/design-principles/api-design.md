---
sidebar_position: 7
title: Design d'API
description: "Principes de design d'API dans Pithos : responsabilité unique, signatures explicites, paradigme data-first et conventions de nommage cohérentes pour les utilitaires TypeScript."
keyword_stuffing_ignore:
  - cases
---

import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# Design d'API

## Principes fondamentaux

### 1. Une fonction = Une responsabilité

```typescript
// ❌ Fonction polymorphe (ancien style Lodash)
_.map(collection, iteratee, [thisArg]);
// Accepte tableau, objet, chaîne... confusion

// ✅ Fonctions spécialisées
mapArray(array, fn); // Pour les tableaux
mapObject(object, fn); // Pour les objets
mapString(string, fn); // Pour les chaînes
```

### 2. Nommage explicite et cohérent

| Pattern          | Convention               | Exemples                                |
| ---------------- | ------------------------ | --------------------------------------- |
| **Verbes d'action** | Verbes pour transformation | `chunk`, `flatten`, `merge`, `debounce` |
| **Prédicats**    | `is`/`has`/`can` + Nom   | `isEmpty`, `hasOwn`, `canRead`          |
| **Transformeurs** | Verbe + Nom              | `toString`, `toNumber`, `toArray`       |
| **Accesseurs**   | `get`/`set` + Propriété  | `getFirst`, `getLast`, `getAt`          |
| **Mutables**     | Base + `Mut`             | `shuffleMut`, `sortMut`, `reverseMut`   |
| **Async**        | Base + `Async`           | `mapAsync`, `filterAsync`               |

**Pas d'abréviations cryptiques** : Préférer les mots complets aux abréviations (`debounce` ✅, `dbnc` ❌). Les abréviations courantes sont acceptables (`min`, `max`, `id`).

### 3. Signatures prévisibles

```typescript
// Pattern cohérent : (input, ...options) => output
chunk(array, size); // (T[], number) => T[][]
take(array, count); // (T[], number) => T[]
groupBy(array, keyFn); // (T[], (T) => K) => Record<K, T[]>
```

### 4. Pas de configuration complexe

```typescript
// ❌ Trop d'options (confus)
sort(array, {
  direction: "desc",
  compareBy: "name",
  nullsFirst: true,
  locale: "fr-FR",
});

// ✅ Fonctions composables
sortBy(array, (item) => item.name);
sortByDesc(array, (item) => item.name);
// Pour les cas complexes, utilisez les comparateurs natifs
array.sort((a, b) => customLogic(a, b));
```

### 5. Simplicité avant exhaustivité

**Principe** : Préférer une fonction simple qui couvre 99% des cas d'usage à une fonction complexe avec beaucoup d'options pour des cas limites rares.

```typescript
// ❌ Complexité inutile (style es-toolkit)
export function windowed<T>(
  arr: readonly T[],
  size: number,
  step = 1,
  { partialWindows = false }: WindowedOptions = {}
): T[][] {
  /* ... */
}

// ✅ Simple et efficace (style Pithos)
export function window<T>(array: readonly T[], size: number): T[][] {
  /* ... */
}
```

**Pourquoi cette approche ?**

- **Règle 80/20** : Les options complexes ne servent que 1% des cas
- **Maintenance** : Plus de code = plus de bugs potentiels
- **Surface d'API** : Une API plus petite est plus facile à apprendre et utiliser
- **Composition** : Pour les cas rares, composez plusieurs fonctions simples
- **Taille du bundle** : Moins de code = bundle plus petit

---

<RelatedLinks>

- [Paradigme Data-First](./data-first-paradigm.md) — Pourquoi Pithos met les données en premier
- [Performance & Taille de bundle](./performance-bundle-size.md) — Chaque octet compte
- [TypeScript-First](./typescript-first.md) — Conçu pour l'inférence

</RelatedLinks>
