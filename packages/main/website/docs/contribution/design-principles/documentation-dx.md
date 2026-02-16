---
sidebar_position: 9
title: Documentation & DX
description: "Documentation standards and developer experience guidelines for Pithos. Mandatory TSDoc, code examples, and generated API reference pages."
keyword_stuffing_ignore:
  - function
  - example
  - description
---

import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# Documentation & DX

## Mandatory TSDoc

Every exported function in Pithos must include a complete TSDoc comment block. This ensures consistent API documentation, enables IDE autocompletion hints, and powers the generated reference pages. Below is a full example showing all required tags for a typical utility function:

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

## Required Elements

| Element         | Required      | Description                          |
| --------------- | ------------- | ------------------------------------ |
| **Description** | ✅            | Short, clear, starts with a verb     |
| **@template**   | ✅            | If generics are used                 |
| **@param**      | ✅            | All parameters                       |
| **@returns**    | ✅            | Return type and description          |
| **@throws**     | ✅            | If can throw, document when and what |
| **@since**      | ✅            | Introduction version                 |
| **@example**    | ✅            | At least one working example         |
| **@deprecated** | If applicable | With @see pointing to replacement    |

---

<RelatedLinks>

- [TypeScript-First](./typescript-first.md) — How inference drives the API design
- [API Design](./api-design.md) — Naming conventions and function signatures
- [Best Practices](../../basics/best-practices.md) — The Pithos contract for end users

</RelatedLinks>
