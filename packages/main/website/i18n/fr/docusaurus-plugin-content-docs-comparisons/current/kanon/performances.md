---
sidebar_label: "Performances"
sidebar_position: 2
title: "Benchmarks de performance Kanon"
description: "Comparaison de performance runtime entre Kanon JIT et d'autres bibliothèques de validation (Zod, Valibot, AJV, TypeBox...)"
---

import { BenchmarkResultsTable, VersionsTable, PerformanceSummary, WeightedSummary, DetailedStats, GeneratedDate, FilterableBenchmarkSection, KanonPerfTLDR } from '@site/src/components/comparisons/kanon/PerformanceTable';
import { WeightedScoringTable } from '@site/src/components/comparisons/WeightedScoringTable';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# 🚅 Benchmarks de performance Kanon

Benchmarks de validation en conditions réelles. **Données auto-générées le <GeneratedDate />.**

## TL;DR

<KanonPerfTLDR />

Opérations par seconde. Plus c'est élevé, mieux c'est.

---

## Méthodologie

Chaque benchmark :
1. Crée un pool de 10 000 objets de test
2. Exécute la validation en boucle serrée
3. Mesure les opérations par seconde avec analyse statistique
4. Rapporte min, max, moyenne, percentiles (p75, p99, p995, p999)
5. Inclut la marge d'erreur relative (rme) pour la confiance

Le label "fastest" n'est attribué que lorsque le gagnant est **≥10% plus rapide** que le second. Sinon, c'est considéré comme une égalité statistique.

<DashedSeparator noMarginBottom />

### La performance compte-t-elle ?

Toutes les validations n'ont pas la même importance en termes de performance. Valider une réponse API appelée 1000x/sec compte plus qu'une vérification de config ponctuelle. Nous attribuons des poids basés sur les patterns d'utilisation réels :

<WeightedScoringTable />

Ce scoring donne une image plus réaliste de quelle bibliothèque rendra réellement votre application plus rapide.

---

## Bibliothèques testées

<VersionsTable />

---

## Résultats des benchmarks

<FilterableBenchmarkSection />

---

## Pourquoi Kanon JIT est rapide

1. **Compilation JIT** : Les schémas sont compilés en fonctions JavaScript optimisées au runtime
2. **Pas de vérifications de types au runtime** : Les types sont validés au compile-time par TypeScript
3. **Abstraction minimale** : Logique de validation directe, pas de hiérarchies de classes
4. **Unions discriminées** : Lookup O(1) au lieu d'un essai-erreur O(n)

---

## Une note sur la performance de coercition

Sur les opérations de coercition basiques, Kanon et Zod sont **à peu près équivalents** : chacun gagne certains benchmarks. Ceci malgré une différence architecturale délibérée.

**Zod mute l'entrée directement :**
```typescript
// Approche de Zod (simplifiée)
if (def.coerce) {
  payload.value = new Date(payload.value); // mutation !
}
```

**Kanon retourne une nouvelle valeur :**
```typescript
// Approche de Kanon
if (value instanceof Date) return true;
return { coerced: new Date(value) }; // pur, pas de mutation
```

Nous avons choisi **l'immutabilité plutôt que la vitesse brute** parce que :
- **Prévisibilité** : Les fonctions ne modifient pas leurs arguments
- **Débogage** : Plus facile de tracer d'où viennent les valeurs
- **Composition** : Les fonctions pures se composent mieux
- **Sécurité** : Pas d'effets de bord inattendus

La différence de performance est négligeable en pratique (~0,00001ms par validation), et Kanon domine toujours sur la **coercition avec contraintes** (36x plus rapide que Zod sur `date.max()`), qui est le cas d'utilisation réel courant.

---

## Reproduire ces résultats

Vous voulez vérifier ces résultats ? Consultez [comment reproduire nos données](../reproduce.md).

---

<RelatedLinks>

- [Kanon vs Zod](./kanon-vs-zod.md) — Comparaison complète : philosophie, API, migration
- [Zygos — Performance](../zygos/performances.md) — Benchmarks du pattern Result
- [Guide du module Kanon](/guide/modules/kanon/) — Documentation complète du module

</RelatedLinks>
