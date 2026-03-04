---
sidebar_label: "Performances"
sidebar_position: 2
title: "Benchmarks de performance Arkhe"
description: "Comparaison de performance runtime entre Arkhe, es-toolkit et Lodash pour les fonctions utilitaires"
---

import { ArkheBenchmarkResultsTable, ArkheVersionsTable, ArkhePerformanceSummary, ArkheWeightedSummary, ArkheDetailedStats, ArkheGeneratedDate, ArkhePerfTLDR, ArkheBalancedTLDR, ArkheBalancedChart, ArkheBalancedTable } from '@site/src/components/comparisons/arkhe/PerformanceTable';
import { WeightedScoringTable } from '@site/src/components/comparisons/WeightedScoringTable';
import { Accordion } from '@site/src/components/shared/Accordion';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# 🚅 Benchmarks de performance Arkhe

Comparaison de performance entre **Arkhe**, **es-toolkit**, **es-toolkit/compat** et **lodash-es**.

**Données auto-générées le <ArkheGeneratedDate />.**

## TL;DR

<ArkhePerfTLDR />

Opérations par seconde. Plus c'est élevé, mieux c'est.

--- 

## Méthodologie

Pour garantir une comparaison équitable, les benchmarks sont adaptés de [la suite de benchmarks d'es-toolkit](https://github.com/toss/es-toolkit/tree/main/benchmarks/performance). Utiliser une suite de benchmarks tierce bien connue évite tout biais en notre faveur.

### La performance compte-t-elle ?

Toutes les fonctions n'ont pas la même importance en termes de performance. Un `map` appelé 10 000 fois dans une boucle compte plus qu'un `debounce` appelé une fois à l'initialisation. Nous attribuons des poids basés sur les patterns d'utilisation réels :

<WeightedScoringTable />

Ce scoring donne une image plus réaliste de quelle bibliothèque rendra réellement votre application plus rapide.

:::note Ajustements des benchmarks
Nous avons apporté des ajustements mineurs à certains benchmarks pour nous assurer qu'ils mesurent l'exécution réelle des fonctions plutôt que leur simple création.
:::

Chaque benchmark teste deux scénarios :
1. **Petits tableaux** : Utilisation réelle typique (3-10 éléments)
2. **Grands tableaux** : Test de charge avec 10 000 éléments

Le label "fastest" indique le meilleur performeur pour chaque test.

--- 

## Bibliothèques testées

<ArkheVersionsTable />

--- 

## Résultats des benchmarks

<ArkheBenchmarkResultsTable />

<DashedSeparator />

<ArkhePerformanceSummary />

<DashedSeparator />

<ArkheWeightedSummary />

--- 

## Pourquoi Arkhe est parfois plus lent

Arkhe perd occasionnellement un benchmark, non pas à cause d'une mauvaise optimisation, mais parce qu'il fait **plus de travail** que le concurrent.

**La correction avant la vitesse brute.** Certaines fonctions font un travail supplémentaire pour retourner des résultats corrects :

| Fonction | Ce qu'Arkhe fait en plus | Pourquoi c'est important |
|---|---|---|
| `intersectionWith` | Déduplique le résultat | Une intersection d'ensembles ne devrait pas contenir de doublons. es-toolkit les retourne tels quels. |

**Validation fail-fast.** Arkhe valide les entrées tôt et lève une erreur sur les arguments invalides. Cela ajoute quelques octets et nanosecondes, mais attrape les bugs au point d'appel au lieu de produire silencieusement des résultats erronés en aval. Quand vous voyez un ❌ sur le bundle ou la perf, ce compromis peut en être la raison.

Quand vous comparez les chiffres, vérifiez toujours si la fonction concurrente fait réellement le même travail. Une fonction plus rapide qui retourne des résultats faux n'est pas plus rapide — elle est incomplète.

:::tip
Si une fonction semble plus lente sur de petites entrées mais égale ou plus rapide sur de grandes entrées, la surcharge est probablement la validation des entrées ou la déduplication : un travail qui paie à grande échelle et prévient les bugs.
:::

--- 

## Vue d'ensemble équilibrée

La taille de bundle et la performance racontent des histoires différentes. Cette section croise les deux pour montrer où Arkhe gagne sur chaque axe.

Comparé à **es-toolkit**, **es-toolkit/compat** et **lodash-es** (les mêmes bibliothèques que ci-dessus). Bundle = le plus petit ou à moins de 10%. Perf = le plus rapide dans au moins un scénario.

<DashedSeparator />

<ArkheBalancedTLDR />

<DashedSeparator />

<ArkheBalancedChart />

La colonne "Perf matters?" vous indique si la différence de performance impacte réellement votre application. Un `debounce` marqué ⬜ n'est pas un souci : vous l'appelez une fois. Un `groupBy` marqué ✅ avec un poids CRITICAL est là où Arkhe apporte une vraie valeur.

<Accordion title="Détail fonction par fonction">
  <ArkheBalancedTable />
</Accordion>

<DashedSeparator />

### Points clés

**Arkhe est régulièrement rapide.** Pas de variations extrêmes : vous obtenez des performances prévisibles sur tous les utilitaires.

**es-toolkit/compat paie un prix.** Leur couche de compatibilité Lodash performe souvent moins bien que lodash-es lui-même (voir `omit`, `intersectionWith`). Quand vous priorisez la compatibilité API, vous héritez des contraintes.

**Arkhe fait ses propres choix.** Nous n'imitons pas l'API de Lodash. Cette liberté nous permet d'optimiser pour le JavaScript moderne sans contraintes legacy.

--- 

## Pourquoi Arkhe est rapide (sur petites/moyennes données)

1. **Cible ES2020+** : Pas de surcharge de transpilation, fonctionnalités JavaScript modernes
2. **Pas de vérifications legacy** : Nous ne testons pas les cas limites IE
3. **Internes plus simples** : Moins d'abstraction, plus de code direct
4. **TypeScript-first** : Les types sont au compile-time, zéro coût runtime

---

## Quand Lodash gagne (sur grands tableaux)

Lodash utilise parfois des algorithmes différents optimisés pour les grands jeux de données :
- **Lookups basés sur le hash** pour `intersection`, `difference` sur 10K+ éléments
- **Évaluation paresseuse** dans certaines opérations chaînées
- **Des années d'optimisations en production** affinées par l'utilisation réelle

Pour la plupart du code réel, les tableaux sont petits (< 100 éléments) et l'approche plus simple d'Arkhe gagne. Sur les grands tableaux, les résultats varient par fonction : Arkhe est compétitif ou plus rapide dans de nombreux cas.

--- 

## Statistiques détaillées

Pour les sceptiques qui veulent voir les chiffres bruts :

<ArkheDetailedStats />

--- 

## Reproduire ces résultats

Vous voulez vérifier ces résultats ? Consultez [comment reproduire nos données](../reproduce.md).

---

<RelatedLinks>

- [Arkhe vs Lodash](./arkhe-vs-lodash.md) — Comparaison complète : philosophie, API, migration
- [Taphos — Performance](../taphos/performances.md) — Benchmarks des utilitaires dépréciés (mêmes bibliothèques)
- [Table d'équivalence](/comparisons/equivalence-table/) — Équivalence complète entre bibliothèques

</RelatedLinks>
