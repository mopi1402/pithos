---
sidebar_position: 3
title: Gestion des erreurs
description: "Philosophie de gestion des erreurs dans Pithos : fail fast, fail loud. Pourquoi les erreurs explicites sont meilleures que les échecs silencieux pour les utilitaires TypeScript."
---

import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# Gestion des erreurs

## La question fondamentale

> _Devons-nous masquer silencieusement les erreurs, retourner `undefined`, ou lancer des erreurs ?_

## La réponse moderne : **Fail fast, fail loud**

```typescript
// ❌ Approche Lodash (échec silencieux) - À ÉVITER
_.get(null, "a.b.c"); // → undefined (masque le problème)

// ✅ Approche moderne (échec explicite) - À PRÉFÉRER
get(null, "a.b.c"); // → throw TypeError("Expected object, got null")
```

## Règles Pithos

| Situation                | Type d'erreur           | Module responsable      | Approche                  | Exemple                     |
| ------------------------ | ----------------------- | ----------------------- | ------------------------- | --------------------------- |
| Mauvais usage / Invariant | **Erreur développeur** | **Arkhe** (Fondations)  | `Throw Error` (Fail Fast) | `throw new TypeError()`     |
| Absence possible         | **Absence attendue**    | Tous                    | `undefined`               | `find(...) ?? undefined`    |

## Exemples concrets

```typescript
// 1️⃣ Entrée invalide → THROW
const chunk = <T>(array: T[], size: number): T[][] => {
  // ✅ On vérifie les valeurs, pas les types des paramètres
  // TypeScript garantit déjà que array est T[] et size est number
  if (size <= 0 || !Number.isInteger(size)) {
    throw new RangeError("Chunk size must be a positive integer, got " + size);
  }
  // ... implémentation
};

// ❌ NE JAMAIS vérifier les types des paramètres
const badChunk = <T>(array: T[], size: number): T[][] => {
  if (!Array.isArray(array)) {
    // ❌ TypeScript garantit déjà que array est T[]
    throw new TypeError("Expected array");
  }
  if (typeof size !== "number") {
    // ❌ TypeScript garantit déjà que size est number
    throw new TypeError("Expected number");
  }
  // ...
};


// 2️⃣ Valeur absente attendue → UNDEFINED
const find = <T>(
  array: T[],
  predicate: (item: T) => boolean
): T | undefined => {
  for (const item of array) {
    if (predicate(item)) return item;
  }
  return undefined; // Non trouvé = cas normal
};

// 3️⃣ Opération faillible → RESULT (via Zygos)
const parseJSON = (json: string): Result<unknown, SyntaxError> => {
  try {
    return ok(JSON.parse(json));
  } catch (error) {
    return err(error as SyntaxError);
  }
};
```

## Pourquoi ce choix ?

- **Debugging plus facile** : Les erreurs silencieuses causent des bugs difficiles à tracer
- **Fail fast** : Détecter les problèmes le plus tôt possible dans le cycle de développement
- **Alignement TypeScript** : Le système de types reflète le comportement réel
- **Écosystème JS moderne** : Compatible avec `?.` et `??` pour les valeurs absentes

:::important

**Règle d'or** : Si l'entrée est malformée, c'est une erreur développeur → throw.

Si la valeur est simplement absente, c'est un cas normal → undefined.

:::

## Valeurs de retour

### Types de retour cohérents

- **`T | undefined`** : Acceptable quand l'absence est sémantiquement significative (ex. `findBest`, `sample`, `minBy` retournent `undefined` quand aucun élément n'est trouvé).
- **Collections vides** : Retourner `[]` (tableau vide) quand une collection vide est un résultat valide. Lancer une erreur quand une collection vide indique une entrée invalide (suivre le principe "Fail Fast").

```typescript
// ✅ Bien : undefined est sémantiquement correct pour "non trouvé"
export function sample<T>(array: readonly T[]): T | undefined {
  return array.length ? array[Math.floor(Math.random() * array.length)] : undefined;
}

// ✅ Bien : Tableau vide pour un résultat vide valide
export function unionBy<T, Key>(
  arrays: readonly (readonly T[])[],
  iteratee: (item: T) => Key
): T[] {
  if (arrays.length === 0) return []; // Valide : pas de tableaux à unir = résultat vide
  // ...
}

// ✅ Bien : Throw quand une collection vide indique une entrée invalide
export function process<T>(array: T[]): T[] {
  if (array.length === 0) {
    throw new RangeError("Array must not be empty"); // Invalide : la fonction nécessite au moins un élément
  }
  // ...
}

// ❌ Mauvais : Type de retour incohérent
export function process<T>(array: T[]): T[] | undefined {
  return array.length > 0 ? array.map(...) : undefined; // Devrait retourner [] si vide est valide, ou throw si invalide
}
```

**Documentation** : Documenter explicitement les valeurs de retour pour les cas limites dans le TSDoc.

## Validation aux frontières

### Qu'est-ce qu'une « frontière » ?

Une frontière est toute source de données **non garantie par TypeScript** :

- ✅ API externe (fetch, WebSocket)
- ✅ Stockage (localStorage, sessionStorage, IndexedDB)
- ✅ Entrée utilisateur (formulaires, paramètres URL)
- ✅ `JSON.parse()` (retourne `any`)
- ✅ Bibliothèques tierces retournant `any` ou des types incorrects
- ✅ Code JavaScript legacy sans types fiables

**Règle** : Si TypeScript ne peut pas garantir le type → Valider avec Kanon

---

<RelatedLinks>

- [Sphalma — Fabriques d'erreurs typées](../../modules/sphalma.md) — Erreurs structurées avec codes hex
- [Zygos — Gestion des erreurs](../../modules/zygos.md) — Patterns Result, Option, Either et Task
- [Immutabilité vs Mutabilité](./immutability.md) — Pourquoi Pithos est immuable par défaut

</RelatedLinks>

---