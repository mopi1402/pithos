---
sidebar_position: 4
title: Immutabilité vs Mutabilité
description: "Pourquoi Pithos est immuable par défaut. Comparaison avec le style mutable de Lodash et directives pratiques pour quand la mutabilité est acceptable."
---

import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# Immutabilité vs Mutabilité

## La question

> _Devons-nous toujours utiliser des opérations mutables ou immuables ?_

## La réponse : **Immuable par défaut**

```typescript
// ❌ Mutable (style Lodash) - À ÉVITER
const array = [1, 2, 3];
_.reverse(array); // Modifie l'original !
console.log(array); // [3, 2, 1] 😱

// ✅ Immuable (style Pithos) - À PRÉFÉRER
const array = [1, 2, 3];
const reversed = reverse(array); // Nouvelle instance
console.log(array); // [1, 2, 3] ✓
console.log(reversed); // [3, 2, 1] ✓
```

## Règles Pithos

| Principe                        | Implémentation                                      |
| ------------------------------- | --------------------------------------------------- |
| **Immuable par défaut**         | Toutes les fonctions retournent de nouvelles instances |
| **Pas d'effets de bord**        | Les fonctions ne modifient jamais leurs arguments    |
| **Comportement prévisible**     | Même entrée = même sortie (transparence référentielle) |
| **Variantes mutables (optionnel)** | Suffixe `Mut` pour les rares cas critiques en performance |

## Les rares exceptions

Pour les cas critiques en performance où la mutation est nécessaire :

```typescript
// Version immuable (par défaut)
export const shuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  // ... Fisher-Yates sur result
  return result;
};

// Version mutable (optionnelle, pour la performance)
export const shuffleMut = <T>(array: T[]): T[] => {
  // ... Fisher-Yates en place
  return array; // Retourne le même tableau modifié
};
```

## Pourquoi immuable ?


- **Prévisibilité** : Plus facile à raisonner et débugger
- **React/Vue/Solid** : Les frameworks modernes attendent l'immutabilité
- **Sécurité concurrente** : Pas de conditions de course avec des données partagées
- **Time-travel debugging** : Redux DevTools, etc.
- **Fonctions pures** : Meilleures pour les tests et la composition

:::tip

**Performance** : Avec les moteurs JS modernes (V8), le coût de la copie est souvent négligeable.

Optimisez uniquement après avoir mesuré un vrai goulot d'étranglement.

:::

---

<RelatedLinks>

- [Gestion des erreurs](./error-handling.md) — Échouer vite, échouer fort
- [Design d'API](./api-design.md) — Une fonction, une responsabilité
- [Performance & Taille de bundle](./performance-bundle-size.md) — Tree-shaking et optimisation des boucles

</RelatedLinks>

---