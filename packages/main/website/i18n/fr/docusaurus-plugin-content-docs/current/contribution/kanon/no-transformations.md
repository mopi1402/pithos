---
sidebar_position: 5
title: "Pourquoi pas de transformations ?"
description: "Pourquoi Kanon ne supporte délibérément pas les transformations de données. Le raisonnement architectural derrière la validation pure versus la coercition de type."
slug: "no-transformations"
keyword_stuffing_ignore:
  - transformation
---

import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# Pourquoi Kanon ne supporte pas les transformations

Kanon **ne supporte délibérément pas les transformations de données**. C'est une décision architecturale fondamentale, pas une fonctionnalité manquante.

## La distinction

### Validation vs Transformation

Ce sont des opérations fondamentalement différentes :

| Opération | Question | Exemple |
|-----------|----------|---------|
| **Validation** | « Ces données sont-elles valides ? » | `"hello"` est une chaîne ✅ |
| **Transformation** | « Transforme ceci en autre chose » | `"  hello  "` → `"hello"` |

Mélanger les deux crée de la complexité et de l'imprévisibilité.

## Ce que fait Kanon

### ✅ Validation

```typescript
import { string, parse } from "@pithos/core/kanon";

parse(string(), "  hello  ");
// → { success: true, data: "  hello  " }
// Données retournées telles quelles
```

### ✅ Coercition (Conversion de type avant validation)

```typescript
import { coerceNumber, parse } from "@pithos/core/kanon";

parse(coerceNumber(), "123");
// → { success: true, data: 123 }
// Convertit le type AVANT la validation
```

La coercition est acceptable car elle se produit **avant** la validation et concerne la conversion de type, pas la manipulation de données.

### ❌ Transformation (Non supportée)

```typescript
// Ceci n'existe pas dans Kanon
string().trim().parse("  hello  "); // ❌ Pas de méthode .trim()
string().toLowerCase().parse("HELLO"); // ❌ Pas de méthode .toLowerCase()
string().transform(s => s.slice(0, 10)); // ❌ Pas de méthode .transform()
```

## Pourquoi ce choix ?

### 1. Séparation des préoccupations

**Validation** et **transformation** sont des responsabilités différentes :

```typescript
// ❌ Préoccupations mélangées (style Zod)
const schema = z.string().trim().toLowerCase().email();
// Est-ce de la validation ? De la transformation ? Les deux ? Pas clair.

// ✅ Préoccupations séparées (style Kanon)
const result = parse(string().email(), input);
if (result.success) {
  const normalized = result.data.trim().toLowerCase();
}
// Clair : validation d'abord, puis transformation
```

### 2. Prévisibilité

Avec Kanon, `parse()` retourne toujours les données **exactement telles que reçues** (si valides) :

```typescript
const input = "  Hello World  ";
const result = parse(string(), input);

if (result.success) {
  console.log(result.data === input); // ✅ Toujours vrai
}
```

Pas de surprises, pas de transformations cachées.

### 3. Performance

Les transformations ajoutent un surcoût à l'exécution :

```typescript
// Zod : validation + transformation
z.string().trim().toLowerCase().parse(input);
// → Valide, puis trim, puis lowercase

// Kanon : validation uniquement
parse(string(), input);
// → Valide, retourne tel quel (plus rapide)
```

### 4. Simplicité

Moins de code = moins de bugs :

- Pas de logique de transformation à maintenir
- Pas de cas limites liés à l'ordre des transformations
- Pas de questions sur « quand la transformation se produit-elle ? »

### 5. Philosophie Compile-Time > Runtime

Les transformations sont des opérations purement runtime. Kanon privilégie ce qui peut être fait au compile-time (vérification de types, inférence) plutôt que la magie runtime.

## Comment gérer les transformations

### Approche 1 : Transformer après la validation (Recommandé)

```typescript
import { string, parse } from "@pithos/core/kanon";

const result = parse(string().email(), input);

if (result.success) {
  // Transformer après la validation
  const normalized = result.data.trim().toLowerCase();
  // Utiliser normalized...
}
```

**Avantages :**
- Séparation claire des préoccupations
- Logique de transformation explicite
- Facile à tester et déboguer

### Approche 2 : Transformer avant la validation

```typescript
import { string, parse } from "@pithos/core/kanon";

// Transformer d'abord
const normalized = input.trim().toLowerCase();

// Puis valider
const result = parse(string().email(), normalized);
```

**Avantages :**
- Normaliser l'entrée avant la validation
- Utile pour l'assainissement des entrées utilisateur

### Approche 3 : Utiliser la coercition pour la conversion de type

```typescript
import { coerceNumber, coerceBoolean, parse } from "@pithos/core/kanon";

// La coercition de type est intégrée
parse(coerceNumber(), "123"); // → { success: true, data: 123 }
parse(coerceBoolean(), "true"); // → { success: true, data: true }
```

**Avantages :**
- Gère les conversions de type courantes
- Utile pour les entrées d'API, paramètres de requête, données de formulaire

### Approche 4 : Utiliser les utilitaires Arkhe

```typescript
import { string, parse } from "@pithos/core/kanon";
import { evolve } from "@pithos/core/arkhe/object/evolve";

const result = parse(userSchema, input);

if (result.success) {
  // Utiliser Arkhe pour les transformations complexes
  const transformed = evolve(result.data, {
    name: (s) => s.trim().toLowerCase(),
    email: (s) => s.toLowerCase(),
  });
}
```

**Avantages :**
- Tirer parti de l'écosystème Pithos
- Transformations déclaratives
- Type-safe

## Et `asZod()` ?

Le helper `asZod()` fournit une API compatible Zod à des **fins de migration** :

```typescript
import { asZod } from "@pithos/core/kanon/helpers/as-zod";
import { string } from "@pithos/core/kanon";

const schema = asZod(string());

// Méthodes style Zod disponibles
schema.transform(s => s.trim());
schema.preprocess(s => s.toLowerCase());
```

**Mais :**
- C'est une **couche de compatibilité**, pas une fonctionnalité principale
- Ajoute du surcoût et de la complexité
- À utiliser uniquement pour une migration progressive depuis Zod

## Comparaison avec Zod

| Fonctionnalité | Zod | Kanon |
|----------------|-----|-------|
| Validation | ✅ | ✅ |
| Inférence de type | ✅ | ✅ |
| Transformations | ✅ Intégrées | ❌ Non supportées |
| `.transform()` | ✅ | ❌ (utiliser `asZod()` pour la migration) |
| `.preprocess()` | ✅ | ❌ |
| `.trim()`, `.toLowerCase()` | ✅ | ❌ |
| Coercition | ✅ | ✅ |
| Performance | Bonne | Meilleure (pas de surcoût de transformation) |
| Taille du bundle | Plus grande | Plus petite |

## Quand utiliser Zod à la place

Utilisez Zod si vous avez besoin de :
- Transformations de données intégrées
- Méthodes `.transform()` et `.preprocess()`
- Méthodes de manipulation de chaînes (`.trim()`, `.toLowerCase()`, etc.)
- Pipelines de transformation complexes dans les schémas

Kanon est fait pour la **validation uniquement**. Si les transformations sont un besoin fondamental, Zod est le meilleur choix.

## Alignement philosophique

Cette décision s'aligne avec la philosophie fondamentale de Pithos :

> **UX > DX > Élégance du code**

- **UX** : Pas de surcoût de transformation = meilleure performance
- **DX** : Séparation claire = plus facile à comprendre et déboguer
- **Compile-time > Runtime** : Validation au runtime, transformations dans le code applicatif

Voir [Philosophie fondamentale](../../basics/core-philosophy.md) pour plus de contexte.

## Résumé

**Kanon valide. Il ne transforme pas.**

C'est intentionnel, pas une limitation. Cela garde la bibliothèque :
- Rapide (pas de surcoût de transformation)
- Simple (moins de code, moins de bugs)
- Prévisible (données retournées telles quelles)
- Focalisée (une seule responsabilité : la validation)

Si vous avez besoin de transformations, gérez-les dans votre logique applicative, là où elles ont leur place.

---

<RelatedLinks>

- [Fonctionnalités & API](./features.md) — Référence complète des fonctionnalités de Kanon V3
- [Architecture & Évolution](./architecture.md) — Comment Kanon a évolué de V1 à V3
- [Kanon vs Zod — Interopérabilité](/comparisons/kanon/interoperability/) — Comparaison fonctionnalité par fonctionnalité

</RelatedLinks>
