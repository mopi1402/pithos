---
sidebar_label: "Arkhe vs Lodash"
sidebar_position: 4
title: "Arkhe vs Lodash : une comparaison complète pour les projets TypeScript"
description: "Comparez Arkhe et Lodash pour les projets TypeScript. Taille de bundle, benchmarks de performance, tree-shaking, sécurité des types et guide de migration."
keywords:
  - arkhe vs lodash
  - lodash alternative typescript
  - lodash replacement
  - tree-shakable lodash
  - typescript utility library comparison
  - lodash bundle size
  - zero dependency utilities
---

import ModuleName from '@site/src/components/shared/badges/ModuleName';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { ArticleSchema } from '@site/src/components/seo/ArticleSchema';
import { MigrationCTA } from '@site/src/components/comparisons/MigrationCTA';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

<ArticleSchema
  headline="Arkhe vs Lodash : une comparaison complète pour les projets TypeScript"
  description="Comparez Arkhe et Lodash pour les projets TypeScript. Taille de bundle, benchmarks de performance, tree-shaking, sécurité des types et guide de migration."
  datePublished="2026-02-16"
/>

# Arkhe vs Lodash : quelle bibliothèque utilitaire pour TypeScript ?

Lodash est la bibliothèque utilitaire JavaScript de référence depuis plus d'une décennie. Elle couvre quasiment tous les besoins de manipulation de données, du clonage profond aux opérations complexes sur les collections. Mais cette étendue a un coût : des bundles volumineux, une inférence TypeScript faible et des couches de compatibilité legacy dont les projets modernes n'ont pas besoin.

<ModuleName name="Arkhe" /> est une alternative moderne construite de zéro en [TypeScript](https://www.typescriptlang.org/). Elle cible ES2020+, est distribuée en [modules ES](https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Modules) avec des points d'entrée granulaires, et n'a aucune dépendance. Cette page compare les deux bibliothèques sur les dimensions qui comptent pour les projets TypeScript en production.

---

## En un coup d'œil

| Aspect | Arkhe | Lodash (lodash-es) |
|--------|-------|---------------------|
| **Langage** | TypeScript-first | JavaScript avec @types/lodash |
| **Cible** | ES2020+ | Compatible ES5 |
| **Dépendances** | Zéro | Zéro (mais polyfills internes) |
| **Tree-shaking** | Points d'entrée par fonction | Partiel (lodash-es) |
| **Inférence de types** | Types stricts et étroits | Types larges, souvent `any` |
| **Bundle par fonction** | ~100-300 octets gzippés | ~1-15 ko gzippés |
| **Couverture API** | Sous-ensemble sélectionné | 300+ fonctions |

---

## Taille de bundle

C'est là que la différence est la plus visible. Lodash embarque des utilitaires internes et des couches de compatibilité ES5 dans chaque fonction. Arkhe distribue des fonctions pures autonomes sans runtime partagé.

Pour des comparaisons détaillées par fonction avec des données auto-générées, consultez la [comparaison de taille de bundle Arkhe](./bundle-size.md).

**Point clé** : Les fonctions Arkhe sont typiquement **10 à 50 fois plus petites** que leurs équivalents Lodash. Même comparé à es-toolkit, Arkhe est généralement 10 à 30% plus petit sur les fonctions individuelles.

```typescript links="chunk:/api/arkhe/array/chunk"
// Arkhe : seul chunk se retrouve dans votre bundle (~150 octets gzippés)
import { chunk } from "pithos/arkhe/array/chunk";

// Lodash-es : chunk + dépendances internes (~3 ko gzippés)
import { chunk } from "lodash-es";
```

---

## Performance

Les deux bibliothèques sont suffisamment rapides pour la plupart des applications. Les différences apparaissent dans les boucles serrées et les grands jeux de données.

Pour des résultats de benchmarks détaillés avec des données auto-générées, consultez les [benchmarks de performance Arkhe](./performances.md).

**Résultats clés** :
- Arkhe et Lodash alternent les victoires selon la fonction et la taille des entrées
- Arkhe priorise la **correction sur la vitesse brute** : certaines fonctions font un travail supplémentaire (déduplication, validation des entrées) que Lodash ne fait pas
- Sur le scoring pondéré réel, Arkhe est compétitif sur toute la ligne

<DashedSeparator noMarginBottom />

### Compromis de correction

Quand Arkhe est plus lent, c'est généralement parce qu'il fait plus de travail pour retourner des résultats corrects :

| Fonction | Ce qu'Arkhe fait en plus | Pourquoi c'est important |
|---|---|---|
| `intersectionWith` | Déduplique le résultat | Une intersection d'ensembles ne devrait pas contenir de doublons |

Une fonction plus rapide qui retourne des résultats faux n'est pas plus rapide — elle est incomplète.

---

## Sécurité des types

Lodash a été écrit en JavaScript. Le support TypeScript vient de `@types/lodash`, maintenu séparément. Cela crée des lacunes :

```typescript links="get:/api/arkhe/object/get"
const obj = { a: { b: { c: 42 } } };

// Lodash : l'inférence de types est large
import { get } from "lodash-es";
const value = get(obj, "a.b.c"); // any

// Arkhe : l'inférence de types est précise
import { get } from "pithos/arkhe/object/get";
const value = get(obj, ["a", "b", "c"]); // correctement typé
```

Les fonctions Arkhe utilisent des génériques TypeScript et des types conditionnels pour inférer les types de retour aussi étroitement que possible. Pas de fuites `any`, pas d'assertions de types manuelles nécessaires.

---

## Tree-Shaking

Le build CommonJS original de Lodash (`lodash`) ne fait pas du tout de tree-shaking. `lodash-es` améliore cela, mais les fonctions partagent toujours des utilitaires internes que les bundlers ne peuvent pas toujours éliminer.

Arkhe utilise des **points d'entrée par fonction**. Chaque import se résout en un module autonome sans runtime partagé :

```typescript links="chunk:/api/arkhe/array/chunk,groupBy:/api/arkhe/array/groupBy,get:/api/arkhe/object/get"
// Chaque import est totalement indépendant
import { chunk } from "pithos/arkhe/array/chunk";
import { groupBy } from "pithos/arkhe/array/groupBy";
import { get } from "pithos/arkhe/object/get";
```

Cela signifie que votre bundle contient exactement le code que vous utilisez, rien de plus.

---

## Guide de migration

<MigrationCTA module="Arkhe" guideLink="/guide/modules/arkhe/#migrating-from-lodash" guideDescription="installer, remplacer les imports progressivement et consulter la table d'équivalence" />

---

<RelatedLinks title="Pour aller plus loin">

- [Comparaison de taille de bundle Arkhe](./bundle-size.md) : données auto-générées par fonction
- [Benchmarks de performance Arkhe](./performances.md) : résultats de benchmarks auto-générés
- [Table d'équivalence complète](/comparisons/equivalence-table/) : correspondance des fonctions Lodash → Arkhe
- [Documentation du module Arkhe](/guide/modules/arkhe/) : vue d'ensemble de l'API et guide d'utilisation
- [Référence API Arkhe](/api/arkhe/) : référence complète des fonctions

</RelatedLinks>
