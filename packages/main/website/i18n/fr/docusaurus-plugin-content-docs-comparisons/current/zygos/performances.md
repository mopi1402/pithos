---
sidebar_label: "Performances"
sidebar_position: 2
title: "Benchmarks de performance Zygos"
description: "Comparaison de performance runtime entre Zygos, Neverthrow et fp-ts pour les patterns Result et Option"
---

import { ZygosResultBenchmarkTable, ZygosOptionBenchmarkTable, ZygosVersionsTable, ZygosPerformanceSummary, ZygosDetailedStats, ZygosGeneratedDate, ZygosPerfTLDR } from '@site/src/components/comparisons/zygos/PerformanceTable';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';
import { ZygosSizeHighlight } from '@site/src/components/comparisons/zygos/BundleSizeTable';

# 🚅 Benchmarks de performance Zygos

Comparaison de performance entre **Zygos**, **Neverthrow** (Result) et **fp-ts** (Option).

**Données auto-générées le <ZygosGeneratedDate />.**

## TL;DR

<ZygosPerfTLDR />

Opérations par seconde. Plus c'est élevé, mieux c'est.

---

## Méthodologie

Chaque benchmark :
1. Crée des données de test correspondant aux patterns réels (chaînes de Result, transformations d'Option)
2. Exécute les opérations en boucle serrée
3. Mesure les opérations par seconde avec analyse statistique
4. Rapporte min, max, moyenne, percentiles (p75, p99, p995, p999)
5. Inclut la marge d'erreur relative (rme) pour la confiance

Le label "fastest" n'est attribué que lorsque le gagnant est **≥10% plus rapide** que le second. Sinon, c'est considéré comme une égalité statistique.

---

## Bibliothèques testées

<ZygosVersionsTable />

---

## Pattern Result (Zygos vs Neverthrow)

Le pattern Result est le cœur de la gestion d'erreurs dans les deux bibliothèques. Voici comment elles se comparent :

<ZygosResultBenchmarkTable />

<DashedSeparator noMarginBottom />

### Résultats clés

**La création d'objets est 2-3x plus rapide.** Zygos utilise de simples littéraux d'objets tandis que Neverthrow utilise l'instanciation de classes avec plus de surcharge.

**Les opérations chaînées (`andThen`) sont 2-4x plus rapides.** L'implémentation plus simple de Zygos paie quand on chaîne plusieurs opérations.

**Les opérations simples sont équivalentes.** `isOk()`, `isErr()`, `unwrapOr()` performent de manière identique : les deux sont juste des vérifications de propriétés.

## Pattern Option (Zygos vs fp-ts)

Zygos fournit une implémentation légère d'Option comparée à l'approche plus complète (mais plus lourde) de fp-ts :

<ZygosOptionBenchmarkTable />

<DashedSeparator noMarginBottom />

### Résultats clés

**Zygos est 1,5-8x plus rapide sur toutes les opérations Option.** Les plus gros gains sont sur `flatMap` (8x) et `getOrElse` (2x).

**Le `pipe` de fp-ts ajoute de la surcharge.** Bien qu'élégant, le style de composition fonctionnelle a un coût runtime.

**Zygos utilise des appels de fonctions directs.** Pas d'abstractions intermédiaires, juste des conditionnels simples.

<ZygosPerformanceSummary />

---

## Pourquoi Zygos est rapide

1. **Littéraux d'objets simples** : `{ _tag: "Ok", value }` au lieu d'instances de classes
2. **Pas d'abstractions intermédiaires** : Accès direct aux propriétés, pas de chaînes de méthodes
3. **JavaScript moderne** : Cible ES2020+, pas de surcharge de transpilation
4. **Code minimal** : Moins de code = moins à exécuter

---

## Quand la performance n'a pas d'importance

Pour la plupart des applications, Zygos et Neverthrow sont tous deux "assez rapides". Le vrai différenciateur est :

- **Taille de bundle** : Zygos est <ZygosSizeHighlight type="ratio" /> par rapport à Neverthrow
- **Ergonomie de l'API** : Choisissez ce qui convient à votre équipe
- **Écosystème** : Zygos s'intègre avec les autres modules Pithos

---

## Statistiques détaillées

Pour les sceptiques qui veulent voir les chiffres bruts :

<ZygosDetailedStats />

---

## Reproduire ces résultats

Vous voulez vérifier ces résultats ? Consultez [comment reproduire nos données](../reproduce.md).

---

<RelatedLinks>

- [Zygos vs Neverthrow](./zygos-vs-neverthrow.md) — Comparaison complète : philosophie, API, migration
- [Kanon — Performance](../kanon/performances.md) — Benchmarks des bibliothèques de validation
- [Guide du module Zygos](/guide/modules/zygos/) — Documentation complète du module

</RelatedLinks>
