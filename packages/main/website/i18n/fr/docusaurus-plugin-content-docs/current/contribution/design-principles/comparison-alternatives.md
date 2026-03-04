---
sidebar_position: 10
title: Comparaison avec les alternatives
description: "Comment Pithos se compare à Lodash, es-toolkit, Remeda, Radash, Ramda et d'autres bibliothèques utilitaires TypeScript sur les dimensions clés de conception."
keyword_stuffing_ignore:
  - first
  - default
---

import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# Comparaison avec les alternatives

| !Aspect           | !**Pithos**    | Lodash      | es-toolkit | Remeda  | Radash  | Ramda   | moderndash | @antfu/utils | Effect  |
| ----------------- | -------------- | ----------- | ---------- | ------- | ------- | ------- | ---------- | ------------ | ------- |
| **TypeScript**    | **First**      | Ajouté après | First      | First   | First   | Ajouté  | First      | First        | First   |
| **Immutabilité**  | **Par défaut** | Mixte       | Par défaut | Par défaut | Par défaut | Par défaut | Par défaut | Par défaut | Par défaut |
| **Entrée invalide** | **Throw**   | Silencieux  | Throw      | Throw   | Mixte   | Silencieux | Mixte   | Mixte        | Effect  |
| **Paradigme données** | **First** | First       | First      | Dual    | First   | Last    | First      | First        | Pipe    |
| **Tree-shakable** | **Oui**       | lodash-es   | Oui        | Oui     | Oui     | Oui     | Oui        | Oui          | Oui     |
| **Dépendances**   | **0**          | 0           | 0          | 0       | 0       | 0       | 0          | 0            | 0       |
| **Monade Result** | **✅ (Zygos)** | ❌          | ❌         | ❌      | ❌      | ❌      | ❌         | ❌           | ✅      |
| **Validation**    | **✅ (Kanon)** | ❌          | ❌         | ❌      | ❌      | ❌      | ❌         | ❌           | ✅      |
| **Orienté FP**    | **Pragmatique**| Non         | Non        | Oui     | Non     | Oui     | Non        | Non          | Oui     |

> **Comportement sur entrée invalide :**
> - **Throw** = Échoue rapidement avec une exception sur entrée invalide
> - **Silencieux** = Retourne `undefined`/`null` silencieusement (peut masquer des bugs)
> - **Mixte** = Dépend de la fonction
> - **Effect** = Retourne un type d'erreur (pas d'exceptions)

## Ce qui différencie Pithos

1. **Écosystème complet** : Utilitaires + Validation + Gestion d'erreurs
2. **Pattern Result intégré** : Zygos pour la gestion fonctionnelle des erreurs
3. **Cohérence** : API unifiée à travers tous les modules
4. **Mythologie grecque** : Nommage mémorable et storytelling

---

## Checklist pour les nouvelles fonctions

Avant d'ajouter une fonction à Arkhe/Pithos :

- [ ] **Besoin réel** : Est-ce vraiment utile ? Pas déjà natif en ES2020+ ?
- [ ] **TypeScript-first** : Types inférés, pas de `any`
- [ ] **Immuable** : Ne modifie pas les arguments
- [ ] **Validation des entrées** : Throw sur entrée invalide
- [ ] **TSDoc complet** : Description, params, returns, throws, exemples
- [ ] **100% tests** : Couverture complète, cas limites inclus
- [ ] **Benchmark** : Pas de régression de performance
- [ ] **Tree-shakable** : Export granulaire

---

## Évolutions futures possibles

| Fonctionnalité      | Statut    | Notes                            |
| ------------------- | --------- | -------------------------------- |
| Évaluation paresseuse | À étudier | Pour les opérations chaînées     |
| Extensions Web APIs  | Planifié  | Fetch, Storage, etc.             |
| Itérateurs async     | Planifié  | Generators et AsyncGenerators    |

---

<RelatedLinks>

- [Arkhe vs Lodash — Taille du Bundle](/comparisons/arkhe/bundle-size) — Chiffres réels sur l'impact bundle
- [Kanon vs Zod — Interopérabilité](/comparisons/kanon/interoperability/) — Comparaison fonctionnalité par fonctionnalité
- [Zygos vs Neverthrow — Interopérabilité](/comparisons/zygos/interoperability/) — Détails du remplacement drop-in

</RelatedLinks>
