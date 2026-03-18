---
title: "Composite Pattern in TypeScript"
sidebar_label: "Composite"
description: "Learn how to implement the Composite design pattern in TypeScript with functional programming. Build tree structures with uniform operations."
keywords:
  - composite pattern typescript
  - tree structure
  - recursive data
  - file system tree
  - hierarchical data
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Composite Pattern

Compose objects into tree structures to represent part-whole hierarchies. Treat individual objects and compositions uniformly.

---

## The Problem

You're building a file explorer. Files have a size. Folders contain files and other folders. You need to display the total size of any folder, calculated recursively from its contents.

The naive approach:

```typescript
function getSize(item: File | Folder): number {
  if (item.type === "file") {
    return item.size;
  }
  let total = 0;
  for (const child of item.children) {
    if (child.type === "file") {
      total += child.size;
    } else {
      total += getSize(child); // recursive, but type checks everywhere
    }
  }
  return total;
}
```

Type checks at every level. Adding a new operation (count files, find largest, render tree) means writing another recursive function with the same if/else structure.

---

## The Solution

Model the tree as a discriminated union. Use `fold` to traverse it uniformly:

```typescript
import { leaf, branch, fold } from "@pithos/core/eidos/composite/composite";

const project = branch({ name: "project", size: 0 }, [
  leaf({ name: "README.md", size: 1024 }),
  branch({ name: "src", size: 0 }, [
    leaf({ name: "index.ts", size: 2048 }),
    leaf({ name: "utils.ts", size: 512 }),
  ]),
  branch({ name: "docs", size: 0 }, [
    leaf({ name: "guide.md", size: 768 }),
  ]),
]);

// Total size: one fold, no type checks
const totalSize = fold(project, {
  leaf: (data) => data.size,
  branch: (_data, childSizes) => childSizes.reduce((a, b) => a + b, 0),
}); // 4352

// File count: same structure, different logic
const fileCount = fold(project, {
  leaf: () => 1,
  branch: (_data, counts) => counts.reduce((a, b) => a + b, 0),
}); // 4
```

One traversal pattern. Add new operations without modifying the tree. Sizes recalculate automatically when you add or remove nodes.

---

## Live Demo

A file explorer with foldable directories. Each file shows its size, each folder shows its total size computed recursively via `fold`. Add files and watch sizes recalculate up the tree. A panel shows the fold operation in action.

<PatternDemo pattern="composite" />

---

## Real-World Analogy

A company org chart. Departments contain teams, teams contain people. When you ask "how many employees?", you don't care if you're asking a department, team, or individual: the question works the same way at every level.

---

## When to Use It

- Represent hierarchical data (files, org charts, UI components, menus)
- Apply operations uniformly to leaves and branches
- Build recursive structures with type safety
- Need sizes, counts, or aggregations that propagate up the tree

---

## When NOT to Use It

If your data is flat (a simple list), don't force it into a tree. Composite adds complexity that only pays off with genuinely hierarchical structures.

---

## API

- [leaf](/api/eidos/composite/leaf) — Create a leaf node with data
- [branch](/api/eidos/composite/branch) — Create a branch node with children
- [fold](/api/eidos/composite/fold) — Reduce a tree to a single value
- [map](/api/eidos/composite/map) — Transform all nodes in a tree
- [flatten](/api/eidos/composite/flatten) — Collect all leaf values
- [find](/api/eidos/composite/find) — Search for a node matching a predicate
