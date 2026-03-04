---
sidebar_position: 9
title: Documentation & DX
description: "Standards de documentation et directives d'expérience développeur pour Pithos. TSDoc obligatoire, exemples de code et pages de référence API générées."
keyword_stuffing_ignore:
  - function
  - example
  - description
---

import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# Documentation & DX

## TSDoc obligatoire

Chaque fonction exportée dans Pithos doit inclure un bloc de commentaire TSDoc complet. Cela garantit une documentation API cohérente, active les suggestions d'autocomplétion dans l'IDE et alimente les pages de référence générées. Voici un exemple complet montrant tous les tags requis pour une fonction utilitaire typique :

````typescript
/**
 * Splits an array into groups of specified size.
 *
 * @template T - The type of array elements.
 * @param input - The array to split.
 * @param size - The size of each group (must be > 0).
 * @returns An array of arrays, each containing at most `size` elements.
 * @throws {TypeError} If `input` is not an array.
 * @throws {RangeError} If `size` <= 0.
 * @since 1.1.0
 *
 * @example
 * ```typescript
 * chunk([1, 2, 3, 4, 5], 2)
 * // → [[1, 2], [3, 4], [5]]
 * ```
 *
 * @example
 * ```typescript
 * chunk(['a', 'b', 'c'], 3)
 * // → [['a', 'b', 'c']]
 * ```
 */
````

## Éléments requis

| Élément         | Requis        | Description                                |
| --------------- | ------------- | ------------------------------------------ |
| **Description** | ✅            | Courte, claire, commence par un verbe       |
| **@template**   | ✅            | Si des génériques sont utilisés             |
| **@param**      | ✅            | Tous les paramètres                         |
| **@returns**    | ✅            | Type de retour et description               |
| **@throws**     | ✅            | Si peut lever une exception, documenter quand et quoi |
| **@since**      | ✅            | Version d'introduction                      |
| **@example**    | ✅            | Au moins un exemple fonctionnel             |
| **@deprecated** | Si applicable | Avec @see pointant vers le remplacement     |

---

<RelatedLinks>

- [TypeScript-First](./typescript-first.md) — Comment l'inférence guide le design de l'API
- [Design de l'API](./api-design.md) — Conventions de nommage et signatures de fonctions
- [Bonnes pratiques](../../basics/best-practices.md) — Le contrat Pithos pour les utilisateurs finaux

</RelatedLinks>
