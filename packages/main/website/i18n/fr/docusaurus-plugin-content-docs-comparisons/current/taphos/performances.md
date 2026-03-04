---
sidebar_label: "Performances"
sidebar_position: 2
title: "Benchmarks de performance Taphos"
description: "Comparaison de performance runtime entre Taphos, es-toolkit et Lodash pour les fonctions utilitaires"
---

import { TaphosBenchmarkResultsTable, TaphosVersionsTable, TaphosPerformanceSummary, TaphosWeightedSummary, TaphosDetailedStats, TaphosGeneratedDate, TaphosPerfTLDR } from '@site/src/components/comparisons/taphos/PerformanceTable';
import { WeightedScoringTable } from '@site/src/components/comparisons/WeightedScoringTable';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# 🚅 Benchmarks de performance Taphos

Comparaison de performance entre **Taphos**, **es-toolkit**, **lodash** et **lodash-es**.

**Données auto-générées le <TaphosGeneratedDate />.**

## TL;DR

<TaphosPerfTLDR />

---

## Méthodologie

Pour garantir une comparaison équitable, les benchmarks sont adaptés de [la suite de benchmarks d'es-toolkit](https://github.com/toss/es-toolkit/tree/main/benchmarks/performance). Utiliser une suite de benchmarks tierce bien connue évite tout biais en notre faveur.

<DashedSeparator noMarginBottom />

### La performance compte-t-elle ?

Toutes les fonctions n'ont pas la même importance en termes de performance. Un `map` appelé 10 000 fois dans une boucle compte plus qu'un `debounce` appelé une fois à l'initialisation. Nous attribuons des poids basés sur les patterns d'utilisation réels :

<WeightedScoringTable />

Ce scoring donne une image plus réaliste de quelle bibliothèque rendra réellement votre application plus rapide.

:::note Ajustements des benchmarks
Nous avons apporté des ajustements mineurs à certains benchmarks pour nous assurer qu'ils mesurent l'exécution réelle des fonctions :

**Exclus :**
- **delay** : Les fonctions basées sur des timers ne sont pas pertinentes à benchmarker.

**Ajustés pour tester l'invocation (pas seulement la création) :**
- constant, wrap, partial, rest, spread, unary
:::

Chaque benchmark teste deux scénarios :
1. **Petits tableaux** : Utilisation réelle typique (3-10 éléments)
2. **Grands tableaux** : Test de charge avec 10 000 éléments

Le label "fastest" indique le meilleur performeur pour chaque test.

---

## Bibliothèques testées

<TaphosVersionsTable />

---

## Résultats des benchmarks

<TaphosBenchmarkResultsTable />

<DashedSeparator noMarginBottom />

<TaphosPerformanceSummary />

<DashedSeparator noMarginBottom />

<TaphosWeightedSummary />

<DashedSeparator noMarginBottom />

### Points clés

**Le JavaScript natif gagne.** Le résumé pondéré montre `native` en tête avec une large avance. C'est intentionnel : le JavaScript moderne a rattrapé la plupart des bibliothèques utilitaires.

**Taphos est un chemin de migration, pas une destination.** Toutes les fonctions Taphos sont marquées `@deprecated` car l'objectif est de vous aider à migrer vers du JavaScript natif, pas de vous enfermer dans une autre bibliothèque.

**Taphos bat la concurrence pendant votre migration.** Parmi les bibliothèques utilitaires, Taphos surpasse régulièrement es-toolkit/compat et lodash-es sur les fonctions critiques. Utilisez-le comme polyfill de qualité tout en adoptant progressivement les équivalents natifs.

---

## La philosophie Taphos

:::tip Migrez vers le natif
Taphos existe pour rendre votre migration Lodash indolore. Mais le vrai gain de performance vient de l'adoption des méthodes JavaScript natives. Chaque fonction Taphos est dépréciée : c'est par conception.
:::

**Pourquoi tout déprécier ?**
- Le natif `Array.prototype.flat()` est plus rapide que le `flatten` de n'importe quelle bibliothèque
- Le natif `structuredClone()` bat `cloneDeep`
- Le natif `Object.keys()` n'a pas besoin de wrapper
- Le JavaScript moderne (ES2020+) couvre 90% des cas d'utilisation de Lodash

**Taphos vous aide à :**
1. Abandonner Lodash sans casser votre codebase
2. Obtenir immédiatement les types TypeScript et le tree-shaking
3. Migrer fonction par fonction vers les équivalents natifs
4. Supprimer Taphos entièrement quand vous avez terminé

---

## ✅ Quand utiliser le natif

| Lodash/Taphos | Équivalent natif |
|---------------|-------------------|
| `flatten(arr)` | `arr.flat()` |
| `flattenDeep(arr)` | `arr.flat(Infinity)` |
| `includes(arr, val)` | `arr.includes(val)` |
| `keys(obj)` | `Object.keys(obj)` |
| `values(obj)` | `Object.values(obj)` |
| `entries(obj)` | `Object.entries(obj)` |
| `cloneDeep(obj)` | `structuredClone(obj)` |
| `isArray(val)` | `Array.isArray(val)` |
| `isNaN(val)` | `Number.isNaN(val)` |

---

## Pourquoi Taphos reste rapide

Pendant votre migration, Taphos ne vous ralentira pas :

1. **Cible ES2020+** : Pas de surcharge de transpilation
2. **Pas de vérifications legacy** : Nous ne testons pas les cas limites IE
3. **Internes plus simples** : Moins d'abstraction, plus de code direct
4. **TypeScript-first** : Les types sont au compile-time, zéro coût runtime

---

## Quand Lodash gagne

Lodash utilise des algorithmes optimisés pour les très grands jeux de données :
- **Lookups basés sur le hash** pour `intersection`, `difference` sur 10K+ éléments
- **Évaluation paresseuse** dans certaines opérations chaînées

Pour la plupart du code réel, les tableaux sont petits (< 100 éléments) et les approches plus simples gagnent.

---

## Statistiques détaillées

Pour les sceptiques qui veulent voir les chiffres bruts :

<TaphosDetailedStats />

---

## Reproduire ces résultats

Vous voulez vérifier ces résultats ? Consultez [comment reproduire nos données](../reproduce.md).

---

<RelatedLinks>

- [Guide du module Taphos](/guide/modules/taphos/) — Les quatre types d'enterrement et la migration guidée par l'IDE
- [Arkhe — Performance](../arkhe/performances.md) — Benchmarks des utilitaires non dépréciés (mêmes bibliothèques)
- [Taphos — Équivalence native](./native-equivalence.md) — Quand le JS natif suffit
- [Table d'équivalence](/comparisons/equivalence-table/) — Équivalence complète entre bibliothèques

</RelatedLinks>
