---
sidebar_label: "Taille de bundle"
sidebar_position: 1
title: "Taphos vs Lodash, es-toolkit, Remeda & Radashi - Comparaison de taille de bundle"
description: "Comparez la taille de bundle de Pithos Taphos avec Lodash, es-toolkit, Remeda et Radashi"
---

import { ArkheBundleTable, GeneratedDate, TLDR, Legend } from '@site/src/components/comparisons/arkhe/BundleSizeTable';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# 📦 Taille de bundle Taphos

Des chiffres réels. Pas de marketing. **Données auto-générées le <GeneratedDate />.**


## TL;DR

<TLDR module="taphos" />

---

## Comparaison des utilitaires Taphos

Tailles individuelles des fonctions, minifiées + gzippées.

<Legend />

<ArkheBundleTable module="taphos" />

---

## Pourquoi Pithos est compétitif

Les utilitaires Taphos partagent la même architecture qu'Arkhe : fonctions pures, cible ES2020+ et points d'entrée par fonction. Pour une explication détaillée de pourquoi les bundles Pithos sont plus petits, consultez l'[analyse de taille de bundle Arkhe](../arkhe/bundle-size.md).

:::tip[Ces fonctions sont dépréciées]
Les fonctions Taphos existent comme aides à la migration. La plupart ont un équivalent Arkhe plus petit ou un remplacement JavaScript natif. Consultez la TSDoc de chaque fonction pour le chemin de migration recommandé. Vous finirez probablement avec un bundle encore plus petit.
:::

---

## Reproduire ces résultats

Vous voulez vérifier ces résultats ? Consultez [comment reproduire nos données](../reproduce.md).

---

<RelatedLinks>

- [Arkhe — Taille de bundle](../arkhe/bundle-size.md) — Tailles des utilitaires non dépréciés (mêmes bibliothèques)
- [Taphos — Équivalence native](./native-equivalence.md) — Quand le JS natif suffit
- [Guide du module Taphos](/guide/modules/taphos/) — Guide de migration et types d'enterrement

</RelatedLinks>
