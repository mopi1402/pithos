---
sidebar_position: 2
sidebar_label: "Kanon"
title: "Kanon - Validation de schémas TypeScript | Alternative à Zod"
description: "Validation de schémas runtime pour TypeScript. Type-safe, composable et sans dépendance. Une alternative moderne à Zod avec d'excellentes performances."
keywords:
  - validation schéma typescript
  - alternative zod
  - validation runtime
  - validation typescript
  - validation type-safe
image: /img/social/kanon-card.jpg
---

import ModuleName from '@site/src/components/shared/badges/ModuleName';
import { InstallTabs } from "@site/src/components/shared/InstallTabs";
import { SavingsHighlight } from '@site/src/components/comparisons/BundleSizeTable';
import { ModuleSchema } from '@site/src/components/seo/ModuleSchema';
import { TableConfig } from '@site/src/components/shared/Table/TableConfigContext';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

<ModuleSchema
  name="Kanon"
  description="Validation de schémas runtime pour TypeScript. Type-safe, composable et sans dépendance. Une alternative moderne à Zod avec d'excellentes performances."
  url="https://pithos.dev/guide/modules/kanon"
/>

# 🅺 <ModuleName name="Kanon" />

_κανών - « règle »_

Alternative légère à Zod. Validation de schémas avec inférence TypeScript, coercion et composition de schémas.

Kanon est une bibliothèque de validation de schémas runtime conçue pour les projets [TypeScript](https://www.typescriptlang.org/) qui ont besoin d'une validation rapide et type-safe. Elle infère les types TypeScript directement depuis vos définitions de schémas : vous définissez la forme de vos données une seule fois et obtenez à la fois la validation et la sécurité de types. Kanon supporte la coercion de types (`coerceString`, `coerceNumber`...), les transformations de schémas (`partial`, `pick`, `omit`...) et offre un wrapper [`asZod`](/api/kanon/helpers/asZod) pour une migration progressive depuis Zod.

**Taille du bundle** :

<SavingsHighlight test="full-app" />

---

## 🃏 Quelques exemples

Définissez un schéma avec des primitives composables, puis validez les données entrantes avec [`parse`](/api/kanon/core/parse). Le résultat est une union discriminée : soit une valeur de succès typée, soit une erreur structurée, vous savez donc toujours à quoi vous avez affaire :

```typescript links="object:/api/kanon/schemas/composites/object,string:/api/kanon/schemas/primitives/string,number:/api/kanon/schemas/primitives/number,optional:/api/kanon/schemas/wrappers/optional,parse:/api/kanon/core/parse"
import { object, string, number, optional, parse } from "@pithos/core/kanon";

const userSchema = object({
  name: string().minLength(1),
  age: number().min(0).int(),
  email: string().email(),
  phone: optional(string()),
});

const result = parse(userSchema, data);

if (result.success) {
  console.log(result.data); // Typé comme { name: string, age: number, ... }
} else {
  console.error(result.error);
}
```

---

## Types supportés

<TableConfig noEllipsis>
| Catégorie | Types |
|-----------|-------|
| **Primitifs** | `string`, `number`, `int`, `boolean`, `date`, `bigint`, `symbol`, `null_`, `undefined_`<br/>`any`, `unknown`, `never`, `void_` |
| **Littéraux & Enums** | `literal`, `enum_`, `nativeEnum`, `⁠numberEnum⠀⚡️`, `booleanEnum⠀⚡️`, `mixedEnum⠀⚡️` |
| **Composites** | `object`, `strictObject`, `looseObject`, `array`, `tuple`, `record`, `map`, `set`<br/>`tupleOf⠀⚡️`, `tupleOf3⠀⚡️`, `tupleOf4⠀⚡️`, `tupleWithRest` |
| **Opérateurs** | `unionOf`, `unionOf3⠀⚡️`, `unionOf4⠀⚡️`, `intersection`, `intersection3⠀⚡️` |
| **Wrappers** | `optional`, `nullable`, `default_`, `readonly`, `lazy` |
| **Coercition** | `coerceString`, `coerceNumber`, `coerceBoolean`, `coerceDate`, `coerceBigInt` |
</TableConfig>

:::tip Performance
⚡️ **Variantes optimisées** : ces fonctions sont plus performantes que leurs alternatives imbriquées (ex. `unionOf3(a, b, c)` est plus rapide que `unionOf(unionOf(a, b), c)`). Elles créent un seul schéma avec une validation directe au lieu d'objets imbriqués.
:::

**Raffinements** : `.min()`, `.max()`, `.minLength()`, `.maxLength()`, `.email()`, `.url()`, `.regex()`, `.int()`, ...

---

## V3 vs JIT

Kanon v3 offre deux modes de validation. Le mode standard fonctionne dans n'importe quel environnement, tandis que le compilateur JIT génère des validateurs JavaScript optimisés au runtime pour un débit plus élevé :

<TableConfig noEllipsis columns={{ "Compatible CSP": { width: "240px" } }}>

| Mode | Vitesse | Compatible CSP | Cas d'usage |
|------|---------|----------------|-------------|
| **V3 Standard** | 12.6M ops/s | ✅ Oui | Par défaut, fonctionne partout |
| **V3 JIT** | 23.6M ops/s | ❌ Nécessite `unsafe-eval` | Scénarios à haut débit |

</TableConfig>

```typescript links="parse:/api/kanon/core/parse,compile:/api/kanon/jit/compile"
import { parse } from "@pithos/core/kanon";              // Standard
import { compile } from "@pithos/core/kanon/jit/compiler"; // JIT

// JIT : compiler une fois, valider plusieurs fois
const validator = compile(schema);
validator(data); // 2x plus rapide
```

Le compilateur JIT analyse la structure de votre schéma et génère une fonction de validation spécialisée. Cela évite la surcharge de parcourir l'arbre du schéma à chaque appel. Si votre environnement bloque `new Function()` via la Content Security Policy, Kanon bascule automatiquement sur l'interpréteur standard.

---

## Différence clé avec Zod

Kanon sépare **validation** et **transformation**. L'API native ne propose pas de pipeline `.transform()` chaîné comme Zod : vous validez d'abord, puis vous transformez explicitement dans votre code.

La coercion (`coerceString`, `coerceNumber`...) est la seule transformation intégrée : elle convertit le type d'entrée avant validation (ex. `42` → `"42"`).

:::info
Le wrapper `asZod()` supporte `.transform()` et `.preprocess()` pour faciliter la migration depuis Zod. Mais dans l'API native de Kanon, préférez gérer les transformations explicitement après la validation.
:::

Voir aussi : [Kanon vs Zod](/comparisons/kanon/kanon-vs-zod/#key-design-difference-validation-and-transformation-are-separate).

---

## Helpers

### `z` - Remplacement direct de Zod

**Migrez depuis Zod avec un seul changement de ligne.** Le namespace `z` reproduit l'API de Zod, vos schémas et appels de validation existants fonctionnent donc sans modification. Changez simplement l'import :

```typescript
// Avant (Zod)
import { z } from "zod";

// Après (Kanon) : changez uniquement l'import
import { z } from "@pithos/core/kanon/helpers/as-zod.shim";

// Votre code existant fonctionne sans changement dans la majorité des cas
```

:::tip Migration
Rechercher & remplacer `from "zod"` → `from "@pithos/core/kanon/helpers/as-zod.shim"` dans votre codebase. C'est fait.
:::

Pour la liste complète des fonctionnalités Zod supportées et des cas limites, voir la [matrice d'interopérabilité Kanon ↔ Zod](/comparisons/kanon/interoperability/).

### `k` - Objet namespace

Le namespace `k` fournit la même API que `z`, en utilisant les conventions de nommage propres à Kanon. Il regroupe tous les constructeurs de schémas sous un seul objet pour plus de commodité :

```typescript links="k:/api/kanon/helpers/k"
import { k } from "@pithos/core/kanon/helpers/k";

const schema = k.object({
  name: k.string(),
  age: k.number().min(0),
});

k.parse(schema, data);
```

:::warning
Non tree-shakable : importe tous les schémas. Préférez les imports directs pour une taille de bundle optimale.
:::

### `asZod()` - Encapsuler des schémas individuels

Encapsule n'importe quel schéma Kanon avec des méthodes à la Zod. Utile quand vous voulez des imports tree-shakable mais avez besoin de l'API fluide de Zod pour des schémas spécifiques :

```typescript links="asZod:/api/kanon/helpers/asZod,string:/api/kanon/schemas/primitives/string,number:/api/kanon/schemas/primitives/number,object:/api/kanon/schemas/composites/object"
import { asZod } from "@pithos/core/kanon/helpers/as-zod";
import { string, number, object } from "@pithos/core/kanon";

const schema = asZod(object({
  name: string(),
  age: number(),
}));

// Méthodes de parsing
schema.parse(data);              // throw en cas d'erreur
schema.safeParse(data);          // { success, data/error }
schema.parseAsync(data);         // parse async
schema.safeParseAsync(data);     // safeParse async

// Raffinements & transformations
schema.refine(val => val.age >= 18, "Doit être majeur");
schema.superRefine((val, ctx) => {
  if (val.age < 18) ctx.addIssue({ message: "Trop jeune" });
});
schema.transform(val => ({ ...val, fullName: val.name }));

// Wrappers
schema.optional();               // T | undefined
schema.nullable();               // T | null
schema.default({ name: "Anonyme", age: 0 });
schema.catch({ name: "Inconnu", age: 0 });
schema.readonly();               // Readonly<T>
schema.promise();                // Promise<T>

// Opérateurs
schema.array();                  // T[]
schema.union(otherSchema);       // T | U (alias : .or())
schema.intersection(otherSchema); // T & U (alias : .and())
```
---

## ❌ Quand NE PAS l'utiliser

Kanon est conçu pour la validation directe de données. Pour des cas d'usage qui vont au-delà de la validation de structures de données, considérez ces alternatives :

| Besoin | Utilisez plutôt |
|--------|-----------------|
| Utilitaires de données | [Arkhe](./arkhe.md) |
| Gestion des erreurs (Result) | [Zygos](./zygos.md) |
| Transformations complexes | Logique personnalisée ou Zod |

---

## ⛵️ Migrer depuis Zod

### Étape 1 : Installer Pithos

Ajoutez Pithos à votre projet avec votre gestionnaire de paquets préféré :

<InstallTabs />

### Étape 2 : Changer l'import

```typescript
// Avant
import { z } from "zod";

// Après
import { z } from "@pithos/core/kanon/helpers/as-zod.shim";
```

### Étape 3 : Exécuter vos tests

La plupart des schémas fonctionnent tels quels. Le shim `z` couvre les primitifs, objets, tableaux, unions, intersections, wrappers, coercition et raffinements.

### Étape 4 : Gérer les cas limites

Certaines fonctionnalités Zod (`.pipe()`, `.brand()`, `z.instanceof()`, formats de chaînes spécialisés comme JWT/CUID) ne sont pas directement disponibles dans Kanon. Des alternatives existent pour chacune — voir la [matrice d'interopérabilité](/comparisons/kanon/interoperability/).

### Étape 5 (optionnel) : Passer aux imports directs

Pour une optimisation maximale du bundle, remplacez progressivement le shim `z` par des imports directs :

```typescript links="object:/api/kanon/schemas/composites/object,string:/api/kanon/schemas/primitives/string,parse:/api/kanon/core/parse"
// Shim z (pratique, légèrement plus gros)
import { z } from "@pithos/core/kanon/helpers/as-zod.shim";
const schema = z.object({ name: z.string() });

// Imports directs (bundle le plus petit possible)
import { object, string, parse } from "@pithos/core/kanon";
const schema = object({ name: string() });
```

Pour une correspondance complète des fonctionnalités Zod supportées, voir la [matrice d'interopérabilité](/comparisons/kanon/interoperability/).

Kanon se combine bien avec les [types Result de Zygos pour la gestion d'erreurs typée](./zygos.md) : validez avec Kanon, puis encapsulez les échecs dans des valeurs `Err` typées pour une propagation explicite des erreurs. Voir l'[exemple pratique](/guide/basics/practical-example/).

---

<RelatedLinks title="Ressources associées">

- [Quand utiliser Kanon](/comparisons/overview/) — Comparez Kanon avec les alternatives et trouvez quand c'est le bon choix
- [Taille de bundle & performance de Kanon](/comparisons/kanon/bundle-size/) — Comparaison détaillée de taille de bundle avec Zod
- [Référence API Kanon](/api/kanon) — Documentation API complète pour tous les schémas et validateurs Kanon

</RelatedLinks>