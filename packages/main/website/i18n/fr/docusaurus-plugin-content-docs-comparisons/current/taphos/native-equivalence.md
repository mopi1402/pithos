---
sidebar_label: "Équivalence native"
sidebar_position: 3
title: "Taphos - Équivalence native"
description: "Niveaux d'équivalence native pour chaque fonction utilitaire Taphos : API native directe, composition d'API natives ou réimplémentation personnalisée"
keyword_stuffing_ignore:
  - lodash
---

import { NativeEquivalenceList } from '@site/src/components/comparisons/taphos/NativeEquivalence';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# 🟰 Équivalence native

Chaque fonction Taphos est `@deprecated` par conception : l'objectif est de migrer vers du JavaScript natif. Mais toutes les fonctions n'ont pas un équivalent natif direct. Cette page classe chaque fonction par son **niveau d'équivalence native**.

---

## Niveaux d'équivalence

| Niveau | Signification |
|-------|---------|
| 🟢 **API native** | Un équivalent natif direct existe. Vous pouvez remplacer la fonction par un seul appel natif. |
| 🟡 **Composition** | Pas d'appel natif unique, mais réalisable en composant quelques API natives ensemble. |
| 🔴 **Personnalisé** | Pas de vrai équivalent natif. La fonction implémente une logique qui n'existe pas nativement. |

---

## Différences de comportement

Certaines fonctions marquées 🟢 ou 🟡 ont un équivalent natif, mais avec des **différences de comportement subtiles** entre taphos/lodash et l'implémentation native. Celles-ci sont marquées avec ⚠️. Cliquez dessus pour voir les détails.

Ces différences sont intentionnelles. Taphos s'aligne sur la sémantique JavaScript moderne plutôt que de reproduire chaque cas limite de Lodash. Si Lodash retourne `true` pour `isNaN(new Number(NaN))` mais que `Number.isNaN` ne le fait pas, ce n'est pas un bug, c'est le web qui avance.

:::tip
Dans la plupart du code réel, ces différences n'ont pas d'importance. Le ⚠️ est là pour que vous puissiez prendre une décision éclairée, pas pour vous décourager de migrer.
:::

---

## Fonctions par niveau

<NativeEquivalenceList />

---

<RelatedLinks>

- [Arkhe vs Lodash](../arkhe/arkhe-vs-lodash.md) — Comparaison complète pour les utilitaires non dépréciés
- [Table d'équivalence](/comparisons/equivalence-table/) — Équivalence complète entre bibliothèques
- [Guide du module Taphos](/guide/modules/taphos/) — Guide de migration et types d'enterrement

</RelatedLinks>
