---
sidebar_position: 3
sidebar_label: "Zygos"
title: "Zygos - Type Result pour TypeScript | Alternative à Neverthrow"
description: "Gestion d'erreurs type-safe avec les types Result et Either. Sans dépendance, entièrement composable. Une alternative moderne à Neverthrow pour TypeScript."
keywords:
  - type result typescript
  - alternative neverthrow
  - gestion erreurs typescript
  - type either
  - erreurs type-safe
image: /img/social/zygos-card.jpg
---

import ModuleName from '@site/src/components/shared/badges/ModuleName';
import { ModuleSchema } from '@site/src/components/seo/ModuleSchema';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';
import { ZygosSizeHighlight } from '@site/src/components/comparisons/zygos/BundleSizeTable';
import { InstallTabs } from "@site/src/components/shared/InstallTabs";
import { TableConfig } from '@site/src/components/shared/Table/TableConfigContext';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';

<ModuleSchema
  name="Zygos"
  description="Gestion d'erreurs type-safe avec les types Result et Either pour TypeScript. Sans dépendance, entièrement composable. Une alternative moderne à Neverthrow et fp-ts."
  url="https://pithos.dev/guide/modules/zygos"
/>

# 🆉 <ModuleName name="Zygos" />  

_ζυγός - « balance »_

Gestion fonctionnelle des erreurs. Alternatives légères à Neverthrow et fp-ts (Either, Task, TaskEither).

Zygos apporte les patterns de gestion fonctionnelle des erreurs à [TypeScript](https://www.typescriptlang.org/) sans le poids d'une bibliothèque FP complète. Au lieu de blocs [try/catch](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/try...catch) qui perdent l'information de type, Zygos utilise les types [`Result`](/api/zygos/result/), [`Option`](/api/zygos/option/) et [`Either`](/api/zygos/either/) pour rendre les erreurs explicites dans les signatures de vos fonctions. Chaque chemin d'échec est visible par le compilateur, vous gérez donc les erreurs avant qu'elles n'atteignent la production.

---

## 🃏 Quelques exemples

Le type `Result` représente une opération qui peut réussir ([`Ok`](/api/zygos/result/ok)) ou échouer ([`Err`](/api/zygos/result/err)). Le pattern matching sur le résultat vous force à gérer les deux cas, éliminant les exceptions non gérées :

```typescript links="ok:/api/zygos/result/ok,err:/api/zygos/result/err"
import { ok, err, Result } from "pithos/zygos/result/result";

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return err("Division par zéro");
  return ok(a / b);
}

const result = divide(10, 2);

if (result.isOk()) {
  console.log(result.value); // 5
} else {
  console.log(result.error); // Jamais atteint
}
```

---

## Monades disponibles

| Monade | Description | Cas d'usage |
|--------|-------------|-------------|
| [**Result**](#result) | `Ok<T>` ou `Err<E>` | Opérations qui peuvent échouer |
| [**Option**](#option) | `Some<A>` ou `None` | Valeurs optionnelles (pas de null) |
| [**Either**](#either-task-taskeither) | `Left<E>` ou `Right<A>` | Branchement générique à deux cas |
| [**Task**](#either-task-taskeither) | Calcul async paresseux | Opérations async différées |
| [**TaskEither**](#either-task-taskeither) | Either async | Opérations async qui peuvent échouer |

--- 

## Result

Le Result de Zygos est <ZygosSizeHighlight type="full" /> que Neverthrow, tout en maintenant une **[compatibilité API à 100%](/comparisons/zygos/interoperability/)**. Vous obtenez la même expérience développeur avec une fraction du coût en bundle.

### Interchangeabilité avec Neverthrow

**Pour migrer de Neverthrow vers Zygos, rien de plus simple : remplacez les imports et le tour est joué.**

```typescript
// Avant (Neverthrow)
import { ok, err, Result, ResultAsync } from "neverthrow";

// Après (Zygos) : changez uniquement l'import, le code reste IDENTIQUE
import { ok, err, Result } from "pithos/zygos/result/result";
import { ResultAsync } from "pithos/zygos/result/result-async";

// Votre code existant fonctionne sans changement
```

:::tip Migration
Rechercher & remplacer `from "neverthrow"` → séparer en les deux imports ci-dessus. Toutes les méthodes fonctionnent pareil.
:::

### Utilisation

Les Results supportent le chaînage avec [`map`](/api/zygos/result/), [`mapErr`](/api/zygos/result/) et [`andThen`](/api/zygos/result/). Chaque opération transforme la valeur de succès tout en propageant automatiquement les erreurs, similaire à la façon dont les Promises chaînent avec `.then()` :

```typescript links="ok:/api/zygos/result/ok,err:/api/zygos/result/err,ResultAsync:/api/zygos/result/ResultAsync"
import { ok, err, Result } from "pithos/zygos/result/result";
import { ResultAsync } from "pithos/zygos/result/result-async";

// Sync
const success = ok(42);
const failure = err("Quelque chose s'est mal passé");

// Le chaînage transforme la valeur Ok à travers chaque étape.
// Si une étape retourne un Err, la chaîne court-circuite.
ok(5)
  .map(x => x * 2)           // Ok(10)
  .mapErr(e => `Erreur : ${e}`) // Toujours Ok(10)
  .andThen(x => ok(x + 1));   // Ok(11)

// ResultAsync encapsule les Promises dans le même pattern Result,
// pour que les opérations async aient aussi une gestion d'erreurs typée.
const asyncResult = ResultAsync.fromPromise(
  fetch("/api/data"),
  () => "Erreur réseau"
);
```

--- 

## Option

Gérez les valeurs optionnelles sans null/undefined. Le type `Option` rend l'absence de valeur explicite dans le système de types, remplaçant les types nullable par [`Some`](/api/zygos/option/some) (valeur présente) ou [`None`](/api/zygos/option/none) (valeur absente) :

```typescript links="some:/api/zygos/option/some,none:/api/zygos/option/none,fromNullable:/api/zygos/option/fromNullable,map:/api/zygos/option/map,flatMap:/api/zygos/option/flatMap,pipe:/api/arkhe/function/pipe"
import { some, none, fromNullable, Option, map, flatMap } from "pithos/zygos/option";
import { pipe } from "pithos/arkhe/function/pipe";

const value = some(42);
const empty = none;

// Depuis nullable
const maybeNull: string | null = "hello";
const opt = fromNullable(maybeNull); // Some("hello")

// Pattern matching
const result = isSome(opt)
  ? opt.value
  : "default";

// Chaînage avec pipe
pipe(
  some(5),
  map(x => x * 2),        // Some(10)
  flatMap(x => some(x + 1)) // Some(11)
);
```

---

## Either, Task, TaskEither

Implémentations légères basées sur fp-ts, **[100% compatibles API](/comparisons/zygos/interoperability/)**. Ces monades couvrent des patterns de programmation fonctionnelle plus avancés : [`Either`](/api/zygos/either/) pour le branchement générique à deux cas, [`Task`](/api/zygos/task/) pour les calculs async paresseux, et [`TaskEither`](/api/zygos/task-either/) pour les opérations async qui peuvent échouer.

### Interchangeabilité avec fp-ts

**Migrer de fp-ts vers Zygos est tout aussi simple : remplacez les imports et c'est tout.**

```typescript
// Avant (fp-ts)
import * as E from "fp-ts/Either";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";

// Après (Zygos) : changez uniquement l'import, le code reste IDENTIQUE
import * as E from "pithos/zygos/either";
import * as T from "pithos/zygos/task";
import * as TE from "pithos/zygos/task-either";

// Votre code existant fonctionne sans changement
const result = pipe(
  E.right(5),
  E.map(x => x * 2),
  E.flatMap(x => E.right(x + 1))
);
```

:::tip Migration
Rechercher & remplacer `from "fp-ts/Either"` → `from "pithos/zygos/either"`, etc. Toutes les fonctions fonctionnent pareil.
:::

### Fonctions disponibles

<TableConfig noEllipsis>

| Module | Fonctions |
|--------|-----------|
| **Either** | `left`, `right`, `isLeft`, `isRight`, `map`, `mapLeft`, `flatMap`, `fold`, `match`, `getOrElse`, `orElse`, `fromOption`, `fromNullable`, `tryCatch`, `Do`, `bind`, `bindTo`, `apS` |
| **Task** | `of`, `map`, `flatMap`, `ap` |
| **TaskEither** | `left`, `right`, `tryCatch`, `fromEither`, `fromTask`, `fromOption`, `map`, `mapLeft`, `flatMap`, `chain`, `fold`, `match`, `getOrElse`, `orElse`, `swap` |

</TableConfig>

---

## safe() - Du try/catch au Result en une ligne

Permet d'encapsuler n'importe quelle fonction qui pourrait `throw` dans une fonction retournant un `Result`. C'est particulièrement utile pour les API tierces ou les fonctions natives comme `JSON.parse` qui communiquent les erreurs via des exceptions :

```typescript links="safe:/api/zygos/safe"
import { safe } from "pithos/zygos/safe";

const safeJsonParse = safe(JSON.parse);

const result = safeJsonParse('{"valid": true}');
// Ok({ valid: true })

const invalid = safeJsonParse('not json');
// Err(SyntaxError: ...)
```

---

## ✅ Quand l'utiliser

Zygos brille dans les codebases où la gestion des erreurs doit être explicite et composable :

- **Appels API** → `ResultAsync` pour une gestion d'erreurs typée
- **Chaînes de validation** → `Result` avec `andThen`
- **Données optionnelles** → `Option` au lieu de `null | undefined`
- **Encapsuler du code unsafe** → `safe()` pour éliminer les try/catch

:::info Kanon + Zygos
[`ensure()`](/api/bridges/ensure/) valide une donnée avec un schéma Kanon et retourne directement un `Result<T, string>` — prêt à chaîner avec `map`, `andThen`, etc. [`ensureAsync()`](/api/bridges/ensureAsync/) fait la même chose pour les pipelines async avec `ResultAsync`, et [`ensurePromise()`](/api/bridges/ensurePromise/) combine une Promise et la validation en un seul appel. Voir [Alchimie des modules](/guide/module-alchemy/) pour d'autres combinaisons.
:::

---

## ❌ Quand NE PAS l'utiliser

Pour des tâches en dehors de la gestion des erreurs et du flux de contrôle, d'autres modules Pithos sont plus appropriés :

| Besoin | Utilisez plutôt |
|--------|-----------------|
| Validation de schémas | [Kanon](./kanon.md) |
| Transformation de données | [Arkhe](./arkhe.md) |
| Fabriques d'erreurs typées | [Sphalma](./sphalma.md) |

---

## ⛵️ Migrer depuis Neverthrow ou fp-ts

### Depuis Neverthrow

#### Étape 1 : Installer

Ajoutez Pithos à votre projet. Il inclut Zygos et tous les autres modules :

<InstallTabs />

<DashedSeparator noMarginBottom />

#### Étape 2 : Mettre à jour les imports

```typescript links="ok:/api/zygos/result/ok,err:/api/zygos/result/err,safeTry:/api/zygos/result/safeTry,ResultAsync:/api/zygos/result/ResultAsync"
// Avant
import { ok, err, Result, ResultAsync, safeTry } from "neverthrow";

// Après
import { ok, err, Result, safeTry } from "pithos/zygos/result/result";
import { ResultAsync } from "pithos/zygos/result/result-async";
```

<DashedSeparator noMarginBottom />

#### Étape 3 : Exécuter vos tests

Tout votre code existant fonctionne tel quel. L'API est 100% compatible.

<DashedSeparator noMarginBottom />

#### Étape 4 (optionnel) : Utiliser les fonctionnalités supplémentaires

Une fois migré, vous pouvez profiter des fonctionnalités spécifiques à Zygos :

```typescript links="fromOption:/api/zygos/result/fromOption,fromEither:/api/zygos/result/fromEither,toEither:/api/zygos/result/toEither,safeAsyncTry:/api/zygos/result/safeAsyncTry"
// Ponts fp-ts
import { fromOption, fromEither, toEither } from "pithos/zygos/result/result";

// Try async simplifié
import { safeAsyncTry } from "pithos/zygos/result/result";

// Collecter toutes les erreurs
const allErrors = ResultAsync.combineWithAllErrors(results);
```

### Depuis fp-ts

#### Étape 1 : Installer

Ajoutez Pithos à votre projet. Il inclut Zygos et tous les autres modules :

<InstallTabs />

<DashedSeparator noMarginBottom />

#### Étape 2 : Mettre à jour les imports

```typescript
// Avant
import * as E from "fp-ts/Either";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";

// Après
import * as E from "pithos/zygos/either";
import * as T from "pithos/zygos/task";
import * as TE from "pithos/zygos/task-either";
```

<DashedSeparator noMarginBottom />

#### Étape 3 : Exécuter vos tests

Toutes les fonctions fonctionnent pareil. `pipe`, `map`, `flatMap`, `fold`, etc. sont tous compatibles.

Pour la liste complète des méthodes Neverthrow et fp-ts supportées, voir la [matrice d'interopérabilité Zygos](/comparisons/zygos/interoperability/) qui documente chaque fonction à travers Result, ResultAsync, Either, Task et TaskEither.

Zygos fonctionne naturellement avec les [fabriques d'erreurs typées de Sphalma](./sphalma.md) : définissez des codes d'erreur structurés avec Sphalma, puis retournez-les comme des valeurs `Err` typées dans vos chaînes Result.

---

<RelatedLinks title="Ressources associées">

- [Quand utiliser Zygos](/comparisons/overview/) — Comparez Zygos avec les alternatives et trouvez quand c'est le bon choix
- [Taille de bundle & performance de Zygos](/comparisons/zygos/bundle-size/) — Comparaison détaillée de taille de bundle avec Neverthrow et fp-ts
- [Référence API Zygos](/api/zygos) — Documentation API complète pour Result, Either, Option et plus

</RelatedLinks>
