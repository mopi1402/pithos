---
sidebar_label: "Interopérabilité"
sidebar_position: 3
title: "Interopérabilité Kanon ↔ Zod"
description: "Comparez les API Kanon et Zod : fonctionnalités compatibles, manquantes, supplémentaires et guide de migration"
---

import { Accordion } from '@site/src/components/shared/Accordion';
import { Code } from '@site/src/components/shared/Code';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { TableConfig } from '@site/src/components/shared/Table/TableConfigContext';
import { MigrationCTA } from '@site/src/components/comparisons/MigrationCTA';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# ⛓️‍💥 Interopérabilité Kanon ↔ Zod

Données de compatibilité réelles. Pas de suppositions. **Analysé contre Zod v4 Classic.**

:::info[Zod v4 Classic vs Mini]
Zod v4 propose deux API :
- **Classic** : Chaînage de méthodes (`.optional()`, `.nullable()`). Cette page couvre Classic.
- **Mini** : Fonctions pures comme l'API native de Kanon (`optional(schema)`, `nullable(schema)`)

Si vous utilisez Zod Mini, envisagez d'utiliser les [imports directs](./bundle-size.md#direct-imports) de Kanon au lieu du shim `z` : la syntaxe est quasi identique.
:::

## TL;DR

**API principale compatible.** Primitives, composites, unions, wrappers, coercition, refinements et transforms fonctionnent avec le shim `z`.

| Métrique | Valeur |
|--------|-------|
| **Primitives** | 15/15 (100%) |
| **Composites** | 6/6 (100%) |
| **Opérateurs** | 3/3 (100%) |
| **Modes objet** | 3/3 (100%) |
| **Effort de migration** | Changement d'imports uniquement (pour la plupart des schémas) |

:::tip[En résumé]
Si vous utilisez des primitives, objets, tableaux, unions et wrappers basiques, **vous êtes couvert**. Changez vos imports et c'est fait.
:::

---

## À propos de cette page

L'API native de Kanon est conçue pour un **tree-shaking optimal** : fonctions pures, imports directs, pas de surcharge de classes. Nous recommandons d'utiliser les [imports directs pour les applications en production](./bundle-size.md#direct-imports).

Cependant, pour une **migration fluide depuis Zod**, Kanon fournit un shim `z` avec une API compatible 1:1 avec Zod :

```typescript
// Changez juste votre import
import { z } from "pithos/kanon/helpers/as-zod.shim";

// Votre code Zod existant fonctionne tel quel
const schema = z.object({
  name: z.string(),
  age: z.number().optional(),
});
```

**Cette page se concentre sur le shim `z`** : toutes les tables de compatibilité ci-dessous utilisent la syntaxe `z.`. Une fois migré, vous pouvez progressivement refactorer vers les imports directs pour une optimisation maximale du bundle.

---

## ✅ Ce que Kanon gère de la même façon

Cliquez pour développer chaque catégorie et voir les fonctionnalités supportées :

<Accordion title="Primitives (100%)" badge="15/15">

<Code>z.string()</Code>, <Code>z.number()</Code>, <Code>z.boolean()</Code>, <Code>z.bigint()</Code>, <Code>z.date()</Code>, <Code>z.symbol()</Code>, <Code>z.undefined()</Code>, <Code>z.null()</Code>, <Code>z.void()</Code>, <Code>z.any()</Code>, <Code>z.unknown()</Code>, <Code>z.never()</Code>, <Code>z.literal()</Code>, <Code>z.enum()</Code>, <Code>z.nativeEnum()</Code>

</Accordion>

<Accordion title="Composites (100%)" badge="6/6">

<Code>z.object()</Code>, <Code>z.array()</Code>, <Code>z.tuple()</Code>, <Code>z.record()</Code>, <Code>z.map()</Code>, <Code>z.set()</Code>

</Accordion>

<Accordion title="Opérateurs (100%)" badge="3/3">

<Code>z.union()</Code>, <Code>z.intersection()</Code>, <Code>z.discriminatedUnion()</Code>, <Code>.or()</Code>, <Code>.and()</Code>

</Accordion>

<Accordion title="Wrappers (100%)" badge="7/7">

<Code>.optional()</Code>, <Code>.nullable()</Code>, <Code>.nullish()</Code>, <Code>.default()</Code>, <Code>.readonly()</Code>, <Code>z.lazy()</Code>, <Code>.catch()</Code>

</Accordion>

<Accordion title="Transformations d'objets (100%)" badge="5/5">

<Code>.partial()</Code>, <Code>.required()</Code>, <Code>.pick()</Code>, <Code>.omit()</Code>, <Code>.keyof()</Code>

</Accordion>

<Accordion title="Modes objet (100%)" badge="3/3">

<Code>z.object()</Code> (strip par défaut), <Code>.strict()</Code>, <Code>.passthrough()</Code>

</Accordion>

<Accordion title="Coercition (100%)" badge="5/5">

<Code>z.coerce.string()</Code>, <Code>z.coerce.number()</Code>, <Code>z.coerce.boolean()</Code>, <Code>z.coerce.bigint()</Code>, <Code>z.coerce.date()</Code>

</Accordion>

<Accordion title="Refinements (100%)" badge="2/2">

<Code>.refine()</Code>, <Code>.superRefine()</Code>

</Accordion>

<Accordion title="Transforms (100%)" badge="2/2">

<Code>.transform()</Code>, <Code>.array()</Code>

</Accordion>

<Accordion title="Contraintes de chaînes (100%)" badge="10/10">

<Code>.min()</Code>, <Code>.max()</Code>, <Code>.length()</Code>, <Code>.email()</Code>, <Code>.url()</Code>, <Code>.uuid()</Code>, <Code>.regex()</Code>, <Code>.includes()</Code>, <Code>.startsWith()</Code>, <Code>.endsWith()</Code>

</Accordion>

<Accordion title="Contraintes numériques (100%)" badge="10/10">

<Code>.min()</Code>, <Code>.max()</Code>, <Code>.int()</Code>, <Code>.positive()</Code>, <Code>.negative()</Code>, <Code>.gt()</Code>, <Code>.gte()</Code>, <Code>.lt()</Code>, <Code>.lte()</Code>, <Code>.multipleOf()</Code>

</Accordion>

<DashedSeparator noMarginBottom />

### Exemples de code

Avec le shim `z`, votre code Zod fonctionne tel quel. Changez juste l'import.

#### Schéma basique

```typescript
// Zod
import { z } from "zod";

// Kanon (changez juste l'import !)
import { z } from "pithos/kanon/helpers/as-zod.shim";

// Le même code fonctionne dans les deux
const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  active: z.boolean(),
});
```
<DashedSeparator noMarginBottom />

#### Avec contraintes

Kanon supporte les mêmes méthodes de contraintes que Zod, y compris les longueurs min/max, les nombres positifs et la validation d'email :

```typescript
import { z } from "pithos/kanon/helpers/as-zod.shim";

const productSchema = z.object({
  sku: z.string().min(3).max(10),
  price: z.number().positive().max(9999),
  email: z.string().email(),
});
```

<DashedSeparator noMarginBottom />

#### Avec Optional/Nullable

Les modificateurs optional, nullable et nullish fonctionnent de manière identique à Zod, aucun changement de code nécessaire :

```typescript
import { z } from "pithos/kanon/helpers/as-zod.shim";

const profileSchema = z.object({
  username: z.string(),
  bio: z.string().optional(),
  avatar: z.string().nullable(),
  nickname: z.string().nullish(),
});
```

<DashedSeparator noMarginBottom />

#### Types union

Kanon supporte les types union via `z.union()` et les valeurs littérales, comme Zod :

```typescript
import { z } from "pithos/kanon/helpers/as-zod.shim";

const statusSchema = z.union([
  z.literal("pending"),
  z.literal("approved"),
  z.literal("rejected"),
]);

const responseSchema = z.object({
  data: z.union([z.string(), z.number()]),
});
```

---

## ⚠️ Ce que Kanon ne supporte pas

Le shim `z` se concentre sur la validation principale. Certaines fonctionnalités de Zod ne sont pas disponibles et ne le seront probablement jamais.

### Absent du shim `z`

| Fonctionnalité | Alternative |
|---------|------------|
| `.pipe()` | Chaînez les schémas manuellement |
| `.brand()` | Utilisez des assertions de types |
| `z.instanceof()` | Utilisez `.refine(v => v instanceof Class)` |
| `z.preprocess()` | Utilisez `.transform()` avant la validation |
| `z.custom()` | Utilisez `.refine()` ou `.superRefine()` |

### Validateurs de format de chaînes (Zod v4)

| Fonctionnalité | Alternative |
|---------|------------|
| `z.email()`, `z.uuid()`, `z.url()` | Utilisez `z.string().email()`, etc. |
| `z.jwt()`, `z.ipv4()`, `z.base64()` | Utilisez `z.string().regex()` |

<Accordion title="Pourquoi Kanon ne couvre pas 100% de Zod">

**Kanon se concentre délibérément sur les fonctionnalités essentielles** : celles que vous utilisez réellement dans 90%+ des projets.

**Couvert à 100% :**
- Primitives, objets, tableaux, tuples, unions, intersections
- Optional, nullable, default, transforms, refinements
- Contraintes de chaînes (min, max, regex, email, url...)

**Non inclus par choix :**
- Formats d'identifiants spécialisés (CUID, ULID, KSUID, XID, NanoID...)
- Validateurs réseau (plages CIDR, numéros de téléphone E.164...)
- Validateurs de hash (MD5, SHA256, SHA512 en hex/base64...)
- Parsing de durées ISO 8601, formats datetime étendus...

Ce sont des cas limites. Zod les embarque par défaut, ce qui ajoute du poids même si vous ne les utilisez jamais. Kanon non. Si vous en avez besoin, `z.string().regex()` fonctionne parfaitement.

</Accordion>

---

## ✨ Ce que Kanon ajoute

Au-delà de la compatibilité Zod, Kanon apporte des fonctionnalités uniques :

<TableConfig noEllipsis>

| Fonctionnalité | Description |
|---------|-------------|
| ✨ **Compilation JIT** | Compilation automatique en validateurs optimisés (2-10x plus rapide) |
| 📦 **Tree-Shaking parfait** | Fonctions pures, pas de surcharge de classes, bundle le plus petit possible |
| 🎯 **`strictObject()` / `looseObject()`** | Modes de validation d'objets explicites |
| ⚡️ **`parseBulk()`** | Validation par lots optimisée pour les tableaux |
| 📎 **Imports directs** | Importez uniquement ce que vous utilisez pour un tree-shaking maximal |

</TableConfig>

<MigrationCTA module="Kanon" guideLink="/guide/modules/kanon/#migrating-from-zod" guideDescription="installer, changer les imports, gérer les cas limites et optimiser avec les imports directs" />

:::tip[Après la migration]
Une fois migré avec le shim `z`, vous pouvez progressivement refactorer vers les imports directs pour des bundles encore plus petits. Consultez la [documentation API](/api/kanon) pour l'API native de Kanon.
:::

---

<RelatedLinks>

- [Kanon vs Zod](./kanon-vs-zod.md) — Comparaison complète : philosophie, API, migration
- [Interopérabilité Zygos ↔ Neverthrow](../zygos/interoperability.md) — Une autre histoire de remplacement direct
- [Table d'équivalence](/comparisons/equivalence-table/) — Équivalence complète entre bibliothèques
- [Guide du module Kanon](/guide/modules/kanon/) — Documentation complète du module

</RelatedLinks>
