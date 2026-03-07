---
sidebar_label: "Taille de bundle"
sidebar_position: 1
title: "Taille de bundle Kanon"
description: "Comparez la taille de bundle de Kanon avec Zod, Valibot et d'autres bibliothèques de validation"
---

import { BundleSizeComparisonTable, SingleLibraryTable, HelpersImpactTable, WhenToUseTable, ZodMiniComparisonTable, SummaryTable, DynamicSize, GeneratedDate, SavingsHighlight } from '@site/src/components/comparisons/BundleSizeTable';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# 📦 Taille de bundle Kanon

Des chiffres réels. Pas de marketing. **Données auto-générées le <GeneratedDate />.**

## TL;DR

<SavingsHighlight test="full-app" />

---

## Cas d'utilisation réels

Voici des scénarios de validation que vous rencontrerez en production :

<BundleSizeComparisonTable
  variants={["kanon", "zod4-mini", "zod4-classic", "zod3"]}
  tests={["login-form", "user-profile", "api-response", "config-validation", "form-with-coercion", "full-app"]}
  category="real-world"
  showDiff={true}
  baseVariant="kanon"
  showDescription={true}
  stickySecondColumn={true}
/>

<DashedSeparator noMarginBottom />

### Ce que chaque test valide

| Cas d'utilisation | Ce qu'il valide |
|----------|-------------------|
| **Formulaire de connexion** | Email + mot de passe avec contraintes |
| **Profil utilisateur** | UUID, email, âge optionnel, tableau de rôles |
| **Réponse API** | Union discriminée (succès/erreur) |
| **Validation de config** | URL, plage de ports, enum, timeout optionnel |
| **Formulaire + Coercition** | String→Number, String→Boolean, String→Date |
| **Application complète** | Tout ce qui précède + discriminatedUnion, record, etc. |

---

## Détail Kanon

<SingleLibraryTable variant="kanon" category="real-world" />

---

## Pourquoi Kanon est plus petit : le vrai tree-shaking {#direct-imports}

**Kanon utilise des fonctions pures. Zod utilise des classes.** Cette différence architecturale est la raison pour laquelle Kanon fait un tree-shaking parfait.

```typescript links="string:/api/kanon/schemas/primitives/string,object:/api/kanon/schemas/composites/object,parse:/api/kanon/core/parse"
// ✅ Kanon - chaque fonction est autonome
// Seuls string() et object() se retrouvent dans votre bundle
import { string, object, parse } from "@pithos/core/kanon";

const loginSchema = object({
  email: string({ format: "email" }),
  password: string({ minLength: 8 }),
});
```

```typescript
// ⚠️ Zod - z est un namespace qui embarque TOUTES les méthodes
// La bibliothèque Zod entière se retrouve dans votre bundle
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

Même `z.string().min(1)` embarque **<DynamicSize variant="zod4-classic" />** car les méthodes de classe sont bundlées ensemble.

<DashedSeparator noMarginBottom />

### Zod 4 Mini : une solution partielle

Zod 4 a introduit `zod/mini` qui est plus petit, mais ne peut toujours pas faire un tree-shaking complet :

<ZodMiniComparisonTable />

Le bundle de Kanon **grandit proportionnellement** avec l'utilisation. Celui de Zod est principalement une surcharge fixe.

---

## Helpers de commodité : `k`, `z` & `validation`

Kanon offre des helpers de commodité pour différents cas d'utilisation, mais ils ont un compromis :

<HelpersImpactTable />

---

## Reproduire ces résultats

Vous voulez vérifier ces résultats ? Consultez [comment reproduire nos données](../reproduce.md).

---

## Résumé

<SummaryTable />

:::tip[En résumé]
**En production** : Utilisez les imports directs pour le plus petit bundle.
**Prototypage** : Utilisez le namespace `k` pour la commodité.
**Migration depuis Zod** : Utilisez le shim `z`, puis passez progressivement aux imports directs.
:::

---

<RelatedLinks>

- [Kanon vs Zod](./kanon-vs-zod.md) — Comparaison complète : philosophie, API, migration
- [Zygos — Taille de bundle](../zygos/bundle-size.md) — Comparaison de taille du pattern Result
- [Arkhe — Taille de bundle](../arkhe/bundle-size.md) — Comparaison de taille des fonctions utilitaires
- [Guide du module Kanon](/guide/modules/kanon/) — Documentation complète du module

</RelatedLinks>
