---
sidebar_label: "Taille de bundle"
sidebar_position: 1
title: "Arkhe vs Lodash, es-toolkit, Remeda & Radashi - Comparaison de taille de bundle"
description: "Comparez la taille de bundle de Pithos Arkhe avec Lodash, es-toolkit, Remeda et Radashi"
---

import { ArkheBundleTable, GeneratedDate, TLDR, Legend } from '@site/src/components/comparisons/arkhe/BundleSizeTable';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# 📦 Taille de bundle Arkhe

Des chiffres réels. Pas de marketing. **Données auto-générées le <GeneratedDate />.**

## TL;DR

<TLDR module="arkhe" />

--- 

## Comparaison des utilitaires Arkhe

Tailles individuelles des fonctions, minifiées + gzippées.

<Legend />

<ArkheBundleTable module="arkhe" />

---

## Pourquoi Pithos est compétitif

**Cible JavaScript moderne.** Pithos cible ES2020+. Pas de polyfills, pas de couches de compatibilité legacy.

**Fonctions pures.** Chaque utilitaire est une fonction autonome. Pas de classes, pas de prototypes, pas de dépendances cachées.

**Vrai tree-shaking.** Importez ce que vous utilisez, embarquez ce que vous importez :

```typescript links="chunk:/api/arkhe/array/chunk"
// Seul chunk se retrouve dans votre bundle
import { chunk } from "@pithos/core/arkhe/array/chunk";
```

---

## Pourquoi Lodash est plus lourd

Lodash a été pionnier de l'écosystème utilitaire JavaScript et reste largement utilisé. Sa taille de bundle plus importante vient d'un choix délibéré : une compatibilité large entre les environnements, y compris ES5 et les runtimes plus anciens. Chaque fonction embarque des utilitaires internes et des polyfills pour garantir un comportement cohérent partout.

Ce support legacy a un coût. **Lodash est 10 à 50 fois plus lourd** que Pithos pour la plupart des utilitaires. Non pas parce qu'il est mal écrit, mais parce qu'il résout un problème différent : compatibilité universelle vs approche moderne.

---

## es-toolkit

es-toolkit est un remplacement moderne de Lodash avec un bon tree-shaking. Pithos est généralement 10 à 30% plus petit sur les fonctions individuelles.

**es-toolkit/compat** est leur couche de compatibilité Lodash, significativement plus lourde en raison du support de l'API legacy.

---

## Reproduire ces résultats

Vous voulez vérifier ces résultats ? Consultez [comment reproduire nos données](../reproduce.md).

--- 

<RelatedLinks>

- [Arkhe vs Lodash](./arkhe-vs-lodash.md) — Comparaison complète : philosophie, API, migration
- [Taphos — Taille de bundle](../taphos/bundle-size.md) — Comparaison de taille des utilitaires dépréciés
- [Table d'équivalence](/comparisons/equivalence-table/) — Équivalence complète entre bibliothèques
- [Vue d'ensemble des comparaisons](/comparisons/overview/) — Quand utiliser chaque module Pithos

</RelatedLinks>
