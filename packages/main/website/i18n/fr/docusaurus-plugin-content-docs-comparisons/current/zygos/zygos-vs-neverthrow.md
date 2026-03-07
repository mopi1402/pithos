---
sidebar_label: "Zygos vs Neverthrow"
sidebar_position: 4
title: "Zygos vs Neverthrow : comparaison des types Result TypeScript"
description: "Comparez Zygos et Neverthrow pour la gestion d'erreurs TypeScript. Taille de bundle, performance, 100% de compatibilité API, ponts fp-ts et guide de migration."
keywords:
  - zygos vs neverthrow
  - neverthrow alternative typescript
  - result type typescript comparison
  - neverthrow replacement
  - typescript error handling library
  - result pattern typescript
  - either type typescript
---

import ModuleName from '@site/src/components/shared/badges/ModuleName';
import { ArticleSchema } from '@site/src/components/seo/ArticleSchema';
import { MigrationCTA } from '@site/src/components/comparisons/MigrationCTA';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { ZygosSizeHighlight } from '@site/src/components/comparisons/zygos/BundleSizeTable';

<ArticleSchema
  headline="Zygos vs Neverthrow : comparaison des types Result TypeScript"
  description="Comparez Zygos et Neverthrow pour la gestion d'erreurs TypeScript. Taille de bundle, performance, 100% de compatibilité API, ponts fp-ts et guide de migration."
  datePublished="2026-02-16"
/>

# Zygos vs Neverthrow : quel type Result pour TypeScript ?

[Neverthrow](https://www.npmjs.com/package/neverthrow) a popularisé le pattern Result en TypeScript : une façon de rendre les erreurs explicites dans les signatures de fonctions au lieu de s'appuyer sur [try/catch](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/try...catch). C'est bien conçu et largement adopté.

<ModuleName name="Zygos" /> est une micro-implémentation du même pattern : **100% compatible API** avec Neverthrow, mais <ZygosSizeHighlight type="ratio" />. Il fournit aussi les monades Option, Either, Task et TaskEither pour les projets qui ont besoin de plus que Result. Cette page compare les deux bibliothèques sur les dimensions qui comptent en production.

---

## En un coup d'œil

| Aspect | Zygos | Neverthrow |
|--------|-------|------------|
| **API Result** | 100% compatible | — |
| **API ResultAsync** | 100% compatible | — |
| **Taille de bundle** | <ZygosSizeHighlight type="zygos-size" /> (<ZygosSizeHighlight type="ratio" />) | <ZygosSizeHighlight type="nev-size" /> |
| **Sécurité des types** | Zéro type `any` | Utilise `any` à certains endroits |
| **Monades supplémentaires** | Option, Either, Task, TaskEither | Result uniquement |
| **Ponts fp-ts** | Oui (fromOption, fromEither, toEither) | Non |
| **Dépendances** | Zéro | Zéro |
| **Effort de migration** | Changement d'import uniquement | — |

---

## Taille de bundle

Zygos Result est **<ZygosSizeHighlight type="full" />** par rapport à Neverthrow (gzippé). La différence vient de l'approche d'implémentation : Zygos utilise de simples littéraux d'objets (`{ _tag: "Ok", value }`) tandis que Neverthrow utilise l'instanciation de classes avec plus de surcharge.

Pour des comparaisons détaillées par module avec des données auto-générées, consultez la [comparaison de taille de bundle Zygos](./bundle-size.md).

```typescript links="ok:/api/zygos/result/ok,err:/api/zygos/result/err,ResultAsync:/api/zygos/result/ResultAsync"
// Zygos : Result + ResultAsync
import { ok, err, Result } from "@pithos/core/zygos/result/result";
import { ResultAsync } from "@pithos/core/zygos/result/result-async";

// Neverthrow : importer n'importe quelle fonction embarque la bibliothèque entière
import { ok, err, Result, ResultAsync } from "neverthrow";
```

---

## Performance

Zygos est **2-4x plus rapide** sur la création d'objets et les opérations chaînées. Les vérifications simples de propriétés (`isOk`, `isErr`, `unwrapOr`) performent de manière identique dans les deux bibliothèques.

Pour des résultats de benchmarks détaillés avec des données auto-générées, consultez les [benchmarks de performance Zygos](./performances.md).

**Résultats clés** :
- Création d'objets (`ok()`, `err()`) : Zygos est 2-3x plus rapide (littéraux d'objets vs instanciation de classes)
- Opérations chaînées (`andThen`) : Zygos est 2-4x plus rapide
- Vérifications simples (`isOk`, `unwrapOr`) : équivalent, les deux sont des accès de propriétés

---

## 100% de compatibilité API

Zygos est un remplacement direct. Chaque méthode Result et ResultAsync fonctionne de manière identique :

```typescript links="ok:/api/zygos/result/ok,err:/api/zygos/result/err,safeTry:/api/zygos/result/safeTry,ResultAsync:/api/zygos/result/ResultAsync,okAsync:/api/zygos/result/okAsync,errAsync:/api/zygos/result/errAsync"
// Changez juste l'import, zéro changement de code
import { ok, err, Result, safeTry } from "@pithos/core/zygos/result/result";
import { ResultAsync, okAsync, errAsync } from "@pithos/core/zygos/result/result-async";

// Tous les patterns Neverthrow fonctionnent tels quels
const result = ok(5)
  .map(x => x * 2)
  .mapErr(e => `Error: ${e}`)
  .andThen(x => x > 0 ? ok(x) : err("negative"));

const asyncResult = ResultAsync.fromPromise(
  fetch("/api/data"),
  () => "Network error"
);

const combined = Result.combine([ok(1), ok(2), ok(3)]); // Ok([1, 2, 3])
```

Pour la matrice de compatibilité complète, consultez la [page d'interopérabilité Zygos ↔ Neverthrow](./interoperability.md).

---

## Ce que Zygos ajoute au-delà de Neverthrow

### Ponts fp-ts

Convertissez entre Result et les types fp-ts sans mapping manuel :

```typescript links="fromOption:/api/zygos/result/fromOption,fromEither:/api/zygos/result/fromEither,toEither:/api/zygos/result/toEither"
import { fromOption, fromEither, toEither } from "@pithos/core/zygos/result/result";

// Option → Result
const fromSome = fromOption(() => "No value")(someOption); // Ok(42)

// Either → Result
const fromRight = fromEither(rightEither); // Ok(42)

// Result → Either
const either = toEither(ok(42)); // { _tag: "Right", right: 42 }
```

<DashedSeparator noMarginBottom />

### Monades supplémentaires

Zygos fournit Option, Either, Task et TaskEither, des implémentations légères compatibles avec fp-ts :

```typescript links="some:/api/zygos/option/some,none:/api/zygos/option/none,fromNullable:/api/zygos/option/fromNullable"
// Option : absence explicite (pas de null/undefined)
import { some, none, fromNullable } from "@pithos/core/zygos/option";

// Either, Task, TaskEither : compatible fp-ts
import * as E from "@pithos/core/zygos/either";
import * as T from "@pithos/core/zygos/task";
import * as TE from "@pithos/core/zygos/task-either";
```

<DashedSeparator noMarginBottom />

### Zéro type `any`

Neverthrow utilise `any` dans certains types internes. Zygos utilise `unknown` partout, offrant une sécurité des types plus stricte et attrapant plus d'erreurs au compile-time.

<DashedSeparator noMarginBottom />

### `safeAsyncTry`

Gestion d'erreurs async simplifiée sans générateurs :

```typescript links="safeAsyncTry:/api/zygos/result/safeAsyncTry"
import { safeAsyncTry } from "@pithos/core/zygos/result/result";

const result = await safeAsyncTry(() => fetch("/api/users/123").then(r => r.json()));
```

---

## Guide de migration

<MigrationCTA module="Zygos" guideLink="/guide/modules/zygos/#migrating-from-neverthrow-or-fp-ts" guideDescription="installer, changer les imports et commencer à utiliser les fonctionnalités supplémentaires" />

---

<RelatedLinks title="Pour aller plus loin">

- [Comparaison de taille de bundle Zygos](./bundle-size.md) : données auto-générées par module
- [Benchmarks de performance Zygos](./performances.md) : résultats de benchmarks auto-générés
- [Interopérabilité Zygos ↔ Neverthrow](./interoperability.md) : matrice de compatibilité API complète
- [Documentation du module Zygos](/guide/modules/zygos/) : vue d'ensemble de l'API et guide d'utilisation
- [Référence API Zygos](/api/zygos/) : référence complète des fonctions

</RelatedLinks>
