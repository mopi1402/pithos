---
sidebar_position: 9
title: Documentation & DX
---

# Documentation & DX

## Mandatory TSDoc

Each function must have:

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
