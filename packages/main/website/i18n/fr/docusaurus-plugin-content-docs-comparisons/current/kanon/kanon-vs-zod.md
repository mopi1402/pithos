---
sidebar_label: "Kanon vs Zod"
sidebar_position: 4
title: "Kanon vs Zod : comparaison de validation de schémas TypeScript"
description: "Comparez Kanon et Zod pour la validation TypeScript. Taille de bundle, benchmarks de performance, compatibilité API, compilation JIT et guide de migration."
keywords:
  - kanon vs zod
  - zod alternative typescript
  - typescript schema validation comparison
  - zod replacement
  - lightweight validation library
  - zod bundle size
  - runtime validation typescript
---

import ModuleName from '@site/src/components/shared/badges/ModuleName';
import { ArticleSchema } from '@site/src/components/seo/ArticleSchema';
import { MigrationCTA } from '@site/src/components/comparisons/MigrationCTA';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

<ArticleSchema
  headline="Kanon vs Zod : comparaison de validation de schémas TypeScript"
  description="Comparez Kanon et Zod pour la validation TypeScript. Taille de bundle, benchmarks de performance, compatibilité API, compilation JIT et guide de migration."
  datePublished="2026-02-16"
/>

# Kanon vs Zod : quelle bibliothèque de validation pour TypeScript ?

Zod est la bibliothèque de validation de schémas [TypeScript](https://www.typescriptlang.org/) la plus populaire. Elle offre une API fluide, des transformations intégrées et un large écosystème. Mais son architecture basée sur des classes fait que chaque import embarque la bibliothèque entière, et sa taille de bundle en témoigne.

<ModuleName name="Kanon" /> adopte une approche différente : fonctions pures, imports granulaires et un compilateur JIT optionnel pour les scénarios à haut débit. Il couvre les cas d'utilisation de validation principaux tout en restant significativement plus petit. Cette page compare les deux bibliothèques sur les dimensions qui comptent en production.

---

## En un coup d'œil

| Aspect | Kanon | Zod v4 Classic |
|--------|-------|----------------|
| **Architecture** | Fonctions pures | Basée sur des classes |
| **Tree-shaking** | Imports par fonction | Limité (méthodes de classes bundlées ensemble) |
| **Compilation JIT** | Oui (2-10x plus rapide) | Non |
| **Transformations** | Coercion uniquement (natif) | Intégrées (`.transform()`) |
| **Dépendances** | Zéro | Zéro |
| **Compatibilité API** | Shim `z` pour migration directe | — |
| **Bundle (formulaire de connexion)** | ~0,5 ko | ~12 ko |

---

## Taille de bundle

La différence architecturale explique l'écart de bundle. Zod utilise des classes : importer `z.string()` embarque toutes les méthodes de la classe `ZodString`. Kanon utilise des fonctions autonomes : vous importez uniquement ce que vous validez.

Pour des comparaisons détaillées par scénario avec des données auto-générées, consultez la [comparaison de taille de bundle Kanon](./bundle-size.md).

```typescript links="string:/api/kanon/schemas/primitives/string,object:/api/kanon/schemas/composites/object,parse:/api/kanon/core/parse"
// Kanon : seuls string() et object() se retrouvent dans votre bundle
import { string, object, parse } from "pithos/kanon";

const loginSchema = object({
  email: string({ format: "email" }),
  password: string({ minLength: 8 }),
});
```

```typescript
// Zod : la bibliothèque entière se retrouve dans votre bundle
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

Le bundle de Kanon **grandit proportionnellement** avec l'utilisation. Celui de Zod est principalement une surcharge fixe.

---

## Performance

Kanon offre deux modes de validation : un interpréteur standard et un compilateur JIT qui génère des validateurs JavaScript optimisés au runtime.

Pour des résultats de benchmarks détaillés avec des données auto-générées, consultez les [benchmarks de performance Kanon](./performances.md).

| Mode | Débit | Compatible CSP |
|------|-----------|----------------|
| Kanon Standard | ~12,6M ops/s | Oui |
| Kanon JIT | ~23,6M ops/s | Nécessite `unsafe-eval` |
| Zod v4 | Variable selon le schéma | Oui |

Le compilateur JIT analyse la structure de votre schéma et émet une fonction de validation spécialisée, évitant la surcharge de parcours de l'arbre de schéma à chaque appel. Pour les scénarios à haut débit (serveurs API, traitement par lots), cela fait une différence mesurable.

---

## Compatibilité API

Kanon fournit un shim `z` qui reproduit l'API de Zod pour une migration fluide :

```typescript
// Changez juste l'import
import { z } from "pithos/kanon/helpers/as-zod.shim";

// Votre code Zod existant fonctionne sans modification
const userSchema = z.object({
  name: z.string().min(1),
  age: z.number().int(),
  email: z.string().email(),
});

userSchema.parse(data);
userSchema.safeParse(data);
```

Pour une matrice de compatibilité complète, consultez la [page d'interopérabilité Kanon ↔ Zod](./interoperability.md).

**Résumé de la couverture** :
- Primitives : 15/15 (100%)
- Composites : 6/6 (100%)
- Opérateurs : 3/3 (100%)
- Wrappers, refinements, coercition : 100%

---

## Différence de conception clé : validation et transformation sont séparées

L'API native de Kanon se concentre sur la validation. La coercion (`coerceString`, `coerceNumber`...) est la seule transformation intégrée : elle convertit le type d'entrée avant validation. Il n'y a pas de pipeline `.transform()` chaîné comme dans Zod :

```typescript links="parse:/api/kanon/core/parse"
// Kanon : validation pure
parse(string(), "  hello  "); // ✅ Retourne "  hello  " tel quel

// Zod : validation + transformation
z.string().trim().parse("  hello  "); // Retourne "hello"
```

Si vous avez besoin de remodeler les données, gérez-le explicitement après la validation.

---

## Guide de migration

<MigrationCTA module="Kanon" guideLink="/guide/modules/kanon/#migrating-from-zod" guideDescription="installer, changer les imports, gérer les cas limites et optimiser avec les imports directs" />

--- 

<RelatedLinks title="Pour aller plus loin">

- [Comparaison de taille de bundle Kanon](./bundle-size.md) : données auto-générées par scénario
- [Benchmarks de performance Kanon](./performances.md) : résultats de benchmarks auto-générés
- [Interopérabilité Kanon ↔ Zod](./interoperability.md) : matrice de compatibilité API complète
- [Documentation du module Kanon](/guide/modules/kanon/) : vue d'ensemble de l'API et guide d'utilisation
- [Référence API Kanon](/api/kanon/) : référence complète des schémas

</RelatedLinks>
