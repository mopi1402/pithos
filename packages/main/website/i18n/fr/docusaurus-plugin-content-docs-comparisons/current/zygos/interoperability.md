---
sidebar_label: "Interopérabilité"
sidebar_position: 3
title: "Interopérabilité Zygos — Neverthrow & fp-ts"
description: "Zygos est 100% compatible avec Neverthrow (Result, ResultAsync) et fp-ts (Either, Task, TaskEither). Remplacement direct, zéro changement de code."
---

import { Accordion } from '@site/src/components/shared/Accordion';
import { Code } from '@site/src/components/shared/Code';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { TableConfig } from '@site/src/components/shared/Table/TableConfigContext';
import { MigrationCTA } from '@site/src/components/comparisons/MigrationCTA';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';
import { ZygosSizeHighlight } from '@site/src/components/comparisons/zygos/BundleSizeTable';


# ⛓️‍💥 Interopérabilité Zygos

Zygos remplace deux bibliothèques par un seul package, plus léger. Que vous veniez de <a href="https://github.com/supermacro/neverthrow" rel="nofollow">Neverthrow</a> ou de <a href="https://github.com/gcanti/fp-ts" rel="nofollow">fp-ts</a>, il suffit de changer les imports — aucun changement de code requis.

## TL;DR

| Bibliothèque | Remplacement Zygos | Compatibilité | Migration |
|---------|-------------------|---------------|-----------|
| **Neverthrow** | Result, ResultAsync | 100% compatible API | Changement d'import uniquement |
| **fp-ts** | Either, Task, TaskEither | 100% compatible API | Changement d'import uniquement |

:::tip[En résumé]
Changez vos imports. Votre code fonctionne tel quel. Zygos est <ZygosSizeHighlight type="full" /> que Neverthrow, avec zéro type `any`.
:::

---

## Neverthrow — Result & ResultAsync

Zygos Result est une micro-implémentation du type Result de Neverthrow : **<ZygosSizeHighlight type="full" />**, 100% compatible API, zéro type `any`.

```typescript
// Avant
import { ok, err, Result, ResultAsync } from "neverthrow";

// Après
import { ok, err, Result } from "@pithos/core/zygos/result/result";
import { ResultAsync } from "@pithos/core/zygos/result/result-async";
```

### Compatibilité API complète

Cliquez pour développer chaque catégorie :

<Accordion title="Constructeurs Result (100%)" badge="2/2">

<Code>ok(value)</Code>, <Code>err(error)</Code>

```typescript
import { ok, err, Result } from "@pithos/core/zygos/result/result";

const success: Result<number, string> = ok(42);
const failure: Result<number, string> = err("Something went wrong");
```

</Accordion>

<Accordion title="Méthodes Result (100%)" badge="7/7">

<Code>.isOk()</Code>, <Code>.isErr()</Code>, <Code>.map()</Code>, <Code>.mapErr()</Code>, <Code>.andThen()</Code>, <Code>.unwrapOr()</Code>, <Code>.match()</Code>

```typescript
const result = ok(5)
  .map(x => x * 2)
  .mapErr(e => `Error: ${e}`)
  .andThen(x => x > 0 ? ok(x) : err("negative"));

const value = result.unwrapOr(0);

const message = result.match(
  value => `Success: ${value}`,
  error => `Error: ${error}`
);
```

</Accordion>

<Accordion title="Méthodes statiques Result (100%)" badge="2/2">

<Code>Result.fromThrowable()</Code>, <Code>Result.combine()</Code>

```typescript
const safeParse = Result.fromThrowable(
  JSON.parse,
  (error) => `Parse error: ${error}`
);

const result = safeParse('{"valid": "json"}'); // Ok({valid: "json"})
const error = safeParse('invalid'); // Err("Parse error: ...")

const combined = Result.combine([ok(1), ok(2), ok(3)]); // Ok([1, 2, 3])
```

</Accordion>

<Accordion title="Constructeurs ResultAsync (100%)" badge="2/2">

<Code>okAsync()</Code>, <Code>errAsync()</Code>

```typescript
import { okAsync, errAsync, ResultAsync } from "@pithos/core/zygos/result/result-async";

const asyncSuccess = okAsync(Promise.resolve(42));
const asyncError = errAsync("network error");
```

</Accordion>

<Accordion title="Méthodes ResultAsync (100%)" badge="7/7">

<Code>.map()</Code>, <Code>.mapErr()</Code>, <Code>.andThen()</Code>, <Code>.unwrapOr()</Code>, <Code>.match()</Code>, <Code>.orElse()</Code>, <Code>.then()</Code>

```typescript
const result = await okAsync(Promise.resolve(5))
  .map(x => x * 2)
  .andThen(x => okAsync(Promise.resolve(x.toString())));

const message = await result.match(
  value => `Success: ${value}`,
  error => `Error: ${error}`
);

const withFallback = await errAsync("error")
  .orElse(() => okAsync("fallback"));
```

</Accordion>

<Accordion title="Méthodes statiques ResultAsync (100%)" badge="4/4">

<Code>ResultAsync.fromPromise()</Code>, <Code>ResultAsync.fromSafePromise()</Code>, <Code>ResultAsync.fromThrowable()</Code>, <Code>ResultAsync.combine()</Code>

```typescript
const result = ResultAsync.fromPromise(
  fetch('/api/data'),
  (error) => `Fetch failed: ${error}`
);

const safe = ResultAsync.fromSafePromise(Promise.resolve(42));

const safeFetch = ResultAsync.fromThrowable(
  async (url: string) => {
    const res = await fetch(url);
    return res.json();
  },
  (error) => `Request failed: ${error}`
);

const combined = ResultAsync.combine([
  okAsync(1),
  okAsync(2),
  okAsync(3)
]); // Ok([1, 2, 3])
```

</Accordion>

<Accordion title="safeTry (100%)" badge="1/1">

<Code>safeTry()</Code>

```typescript
import { safeTry, ok, err } from "@pithos/core/zygos/result/result";

const result = safeTry(function* () {
  yield err("validation failed");
  return ok(42);
});

const direct = safeTry(() => ok(42));
```

</Accordion>

---

## fp-ts — Either, Task, TaskEither

Réimplémentations légères des monades fp-ts, **100% compatibles API**. Mêmes fonctions, mêmes signatures, bundle plus petit.

```typescript
// Avant
import * as E from "fp-ts/Either";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";

// Après
import * as E from "@pithos/core/zygos/either";
import * as T from "@pithos/core/zygos/task";
import * as TE from "@pithos/core/zygos/task-either";
```

### Fonctions supportées

<TableConfig noEllipsis>

| Module | Fonctions |
|--------|-----------|
| **Either** | `left`, `right`, `isLeft`, `isRight`, `map`, `mapLeft`, `flatMap`, `fold`, `match`, `getOrElse`, `orElse`, `fromOption`, `fromNullable`, `tryCatch`, `Do`, `bind`, `bindTo`, `apS` |
| **Task** | `of`, `map`, `flatMap`, `ap` |
| **TaskEither** | `left`, `right`, `tryCatch`, `fromEither`, `fromTask`, `fromOption`, `map`, `mapLeft`, `flatMap`, `chain`, `fold`, `match`, `getOrElse`, `orElse`, `swap` |

</TableConfig>

### Exemple d'utilisation

```typescript
import * as E from "@pithos/core/zygos/either";
import * as TE from "@pithos/core/zygos/task-either";
import { pipe } from "@pithos/core/arkhe/function/pipe";

// Either — identique à fp-ts
const result = pipe(
  E.right(5),
  E.map(x => x * 2),
  E.flatMap(x => E.right(x + 1))
);

// TaskEither — opérations async qui peuvent échouer
const fetchUser = pipe(
  TE.tryCatch(
    () => fetch("/api/user").then(r => r.json()),
    () => "Erreur réseau"
  ),
  TE.map(user => user.name)
);
```

---

## ✨ Fonctionnalités exclusives Zygos

Au-delà de la compatibilité, Zygos ajoute des fonctionnalités que ni Neverthrow ni fp-ts ne proposent :

<TableConfig noEllipsis>

| Fonctionnalité | Description |
|---------|-------------|
| 📦 **<ZygosSizeHighlight type="ratio" />** | <ZygosSizeHighlight type="sizes" /> |
| 🔒 **Zéro type `any`** | Meilleure sécurité des types avec `unknown` |
| 🔄 **Ponts Result ↔ fp-ts** | Conversion entre Result et Either/Option |
| ⚡️ **safeAsyncTry** | Gestion d'erreurs async simplifiée |
| 🎯 **combineWithAllErrors** | Collecter toutes les erreurs au lieu de s'arrêter à la première |

</TableConfig>

<DashedSeparator noMarginBottom />

### Ponts Result ↔ fp-ts

Conversion entre Result et les types fp-ts :

```typescript
import { fromOption, fromEither, toEither, ok, err } from "@pithos/core/zygos/result/result";

// Option → Result
const fromSome = fromOption(() => "No value")({ _tag: "Some", value: 42 }); // Ok(42)
const fromNone = fromOption(() => "No value")({ _tag: "None" });            // Err("No value")

// Either → Result
const fromRight = fromEither({ _tag: "Right", right: 42 });  // Ok(42)
const fromLeft = fromEither({ _tag: "Left", left: "error" }); // Err("error")

// Result → Either
const toRight = toEither(ok(42));       // { _tag: "Right", right: 42 }
const toLeft = toEither(err("error"));  // { _tag: "Left", left: "error" }
```

<DashedSeparator noMarginBottom />

### safeAsyncTry

Gestion d'erreurs async simplifiée sans générateurs :

```typescript
import { safeAsyncTry } from "@pithos/core/zygos/result/result";

const result = await safeAsyncTry(() => fetch("/api/user").then(r => r.json()));

if (result.isOk()) {
  console.log(result.value);
} else {
  console.log(result.error);
}
```

<DashedSeparator noMarginBottom />

### combineWithAllErrors

Collecter toutes les erreurs au lieu de s'arrêter à la première :

```typescript
import { ResultAsync, okAsync, errAsync } from "@pithos/core/zygos/result/result-async";

const combined = ResultAsync.combineWithAllErrors([
  okAsync(1),
  errAsync("error1"),
  okAsync(3),
  errAsync("error2")
]);

const resolved = await combined;
// Err(["error1", "error2"]) — collecte TOUTES les erreurs
```

---

## Pourquoi choisir Zygos ?

| Aspect | Zygos | Neverthrow | fp-ts |
|--------|-------|------------|-------|
| **Taille de bundle** | <ZygosSizeHighlight type="zygos-size" /> | <ZygosSizeHighlight type="nev-size" /> | ~50 kB+ |
| **Sécurité des types** | Zéro type `any` | Utilise `any` à certains endroits | ✅ |
| **Result + Either** | ✅ Les deux | Result uniquement | Either uniquement |
| **Ponts** | ✅ Result ↔ Either/Option | ❌ | ❌ |
| **Migration** | — | Changement d'import uniquement | Changement d'import uniquement |

:::tip[Recommandation]
Que vous veniez de Neverthrow ou de fp-ts, passer à Zygos c'est la même chose : changez vos imports, gardez votre code. Vous obtenez un bundle plus petit, de meilleurs types, et les deux écosystèmes dans un seul package.
:::

<MigrationCTA module="Zygos" guideLink="/guide/modules/zygos/#migrer-depuis-neverthrow-ou-fp-ts" guideDescription="installer, changer les imports et profiter des fonctionnalités supplémentaires" />

---

<RelatedLinks>

- [Zygos vs Neverthrow](./zygos-vs-neverthrow.md) — Comparaison complète : philosophie, API, migration
- [Interopérabilité Kanon ↔ Zod](../kanon/interoperability.md) — Une autre histoire de compatibilité de migration
- [Table d'équivalence](/comparisons/equivalence-table/) — Équivalence complète entre bibliothèques
- [Guide du module Zygos](/guide/modules/zygos/) — Documentation complète du module

</RelatedLinks>
