---
title: "Iterator Pattern in TypeScript"
sidebar_label: "Iterator"
description: "Learn how to implement the Iterator design pattern in TypeScript with functional programming. Build lazy sequences with chainable operations."
keywords:
  - iterator pattern typescript
  - lazy evaluation
  - generator functions
  - iterable typescript
  - sequence operations
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Iterator Pattern

Provide a way to access elements of a collection sequentially without exposing its underlying representation.

---

## The Problem

You're building a Pokédex. Pokémon come from different sources: a local array for Generation 1 (151 entries), a paginated API for the full database (1000+), and a type-based tree (Fire > Charmander > Charmeleon...). Each source has a different structure, but the consumer just wants "give me the next Pokémon."

The naive approach:

```typescript
// Different code for each source
function showFromArray(pokemon: Pokemon[], index: number) {
  return pokemon[index]; // what if index > length?
}

function showFromAPI(page: number) {
  const response = await fetch(`/api/pokemon?page=${page}`);
  return response.json(); // different shape, pagination logic leaks
}

function showFromTree(node: TypeNode) {
  // depth-first traversal? breadth-first? who decides?
  return node.children[0]; // completely different logic
}
```

Three sources, three traversal strategies, three consumer APIs. Adding a fourth source means writing a fourth consumer path.

---

## The Solution

Wrap each source in a lazy iterable. The consumer calls `next()` identically for all three:

```typescript
import { createIterable, take, toArray } from "@pithos/core/eidos/iterator/iterator";
import { some, none } from "@zygos/option";

// Source 1: local array (finite, 151 entries)
const gen1 = createIterable(() => {
  let i = 0;
  return () => i < gen1Data.length ? some(gen1Data[i++]) : none;
});

// Source 2: paginated API (lazy, loads pages on demand)
const allPokemon = createIterable(() => {
  let page = 0;
  let items: Pokemon[] = [];
  let index = 0;
  return () => {
    if (index >= items.length) {
      items = fetchPage(page++);
      index = 0;
    }
    return index < items.length ? some(items[index++]) : none;
  };
});

// Source 3: type tree (depth-first traversal)
const byType = createIterable(() => {
  const stack = [typeTree];
  return () => {
    while (stack.length) {
      const node = stack.pop()!;
      if (node.children) stack.push(...node.children);
      if (node.pokemon) return some(node.pokemon);
    }
    return none;
  };
});

// Consumer code is identical for all three
for (const pokemon of take(10)(gen1)) {
  display(pokemon);
}
```

One interface, three sources. The consumer never knows if data comes from memory, a network call, or a tree traversal.

---

## Live Demo

Browse a Pokédex with three interchangeable sources: a local Generation 1 array (151 Pokémon, finite), a paginated API (lazy, infinite), and a type-based tree. The consumer code calls `iterator.next()` identically for all three sources.

<PatternDemo pattern="iterator" />

---

## Real-World Analogy

A TV remote with channel up/down buttons. You don't need to know how channels are stored internally. You just press "next" to see the next one. The remote is the iterator: it provides sequential access without exposing the cable box's internals.

---

## When to Use It

- Unify traversal across different data sources
- Process large or infinite datasets lazily (only load what's needed)
- Chain transformations that should execute on demand
- Hide collection implementation details from consumers

---

## When NOT to Use It

If all your data fits in memory and comes from a single array, a regular `for...of` loop is simpler. Don't wrap a 10-element array in `createIterable` just for the pattern.

---

## API

- [createIterable](/api/eidos/iterator/createIterable) — Wrap a generator in a chainable iterable
- [lazyRange](/api/eidos/iterator/lazyRange) — Create lazy numeric ranges
- [iterate](/api/eidos/iterator/iterate) — Generate infinite sequences from a seed and function
