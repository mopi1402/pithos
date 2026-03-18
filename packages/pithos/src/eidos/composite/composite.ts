/**
 * Functional Composite Pattern.
 *
 * In OOP, the Composite pattern requires a Component interface, Leaf classes,
 * and Composite classes that hold children and delegate operations recursively.
 * In functional TypeScript, a composite is a discriminated union (leaf | branch)
 * with a fold function that traverses the tree.
 *
 * The key insight: treat leaves and branches uniformly via pattern matching,
 * not inheritance. The fold function replaces the recursive `operation()` method.
 *
 * @module eidos/composite
 * @since 2.4.0
 *
 * @example
 * ```ts
 * import { leaf, branch, fold, map } from "@pithos/core/eidos/composite/composite";
 *
 * // File system tree
 * type FSNode = Composite<{ name: string; size: number }>;
 *
 * const tree: FSNode = branch({ name: "root", size: 0 }, [
 *   leaf({ name: "file1.txt", size: 100 }),
 *   branch({ name: "docs", size: 0 }, [
 *     leaf({ name: "readme.md", size: 50 }),
 *   ]),
 * ]);
 *
 * // Calculate total size
 * const totalSize = fold(tree, {
 *   leaf: (data) => data.size,
 *   branch: (data, childResults) => childResults.reduce((a, b) => a + b, 0),
 * });
 * ```
 */

import { some, none } from "@zygos/option";
import type { Option } from "@zygos/option";

/**
 * A Leaf node contains data but no children.
 *
 * @template T - The data type stored in nodes
 * @since 2.4.0
 */
export type Leaf<T> = {
  readonly type: "leaf";
  readonly data: T;
};

/**
 * A Branch node contains data and children.
 *
 * @template T - The data type stored in nodes
 * @since 2.4.0
 */
export type Branch<T> = {
  readonly type: "branch";
  readonly data: T;
  readonly children: ReadonlyArray<Composite<T>>;
};

/**
 * A Composite is either a Leaf or a Branch.
 * This discriminated union replaces the OOP Component/Leaf/Composite hierarchy.
 *
 * @template T - The data type stored in nodes
 * @since 2.4.0
 */
export type Composite<T> = Leaf<T> | Branch<T>;

/**
 * Creates a leaf node.
 *
 * @template T - The data type
 * @param data - The leaf's data
 * @returns A Leaf node
 * @since 2.4.0
 */
export function leaf<T>(data: T): Leaf<T> {
  return { type: "leaf", data };
}

/**
 * Creates a branch node with children.
 *
 * @template T - The data type
 * @param data - The branch's data
 * @param children - Child nodes
 * @returns A Branch node
 * @since 2.4.0
 */
export function branch<T>(data: T, children: Composite<T>[]): Branch<T> {
  return { type: "branch", data, children };
}

/**
 * Handlers for folding over a composite tree.
 *
 * @template T - The data type in nodes
 * @template R - The result type
 * @since 2.4.0
 */
export type FoldHandlers<T, R> = {
  /** Handle a leaf node. Receives the leaf's data. */
  leaf: (data: T) => R;
  /** Handle a branch node. Receives the branch's data and results from children. */
  branch: (data: T, childResults: R[]) => R;
};

/**
 * Folds over a composite tree, reducing it to a single value.
 * This replaces the recursive `operation()` method from OOP Composite.
 *
 * @template T - The data type in nodes
 * @template R - The result type
 * @param node - The root node to fold
 * @param handlers - Functions to handle leaf and branch nodes
 * @returns The folded result
 * @since 2.4.0
 *
 * @example
 * ```ts
 * // Count all nodes
 * const count = fold(tree, {
 *   leaf: () => 1,
 *   branch: (_, children) => 1 + children.reduce((a, b) => a + b, 0),
 * });
 *
 * // Render to string
 * const render = fold(tree, {
 *   leaf: (data) => data.name,
 *   branch: (data, children) => `${data.name}(${children.join(", ")})`,
 * });
 * ```
 */
export function fold<T, R>(node: Composite<T>, handlers: FoldHandlers<T, R>): R {
  if (node.type === "leaf") {
    return handlers.leaf(node.data);
  }
  const childResults = node.children.map((child) => fold(child, handlers));
  return handlers.branch(node.data, childResults);
}

/**
 * Maps over a composite tree, transforming each node's data.
 *
 * @template T - The source data type
 * @template U - The target data type
 * @param node - The root node to map
 * @param fn - Function to transform node data
 * @returns A new tree with transformed data
 * @since 2.4.0
 *
 * @example
 * ```ts
 * const doubled = map(tree, (data) => ({ ...data, size: data.size * 2 }));
 * ```
 */
export function map<T, U>(node: Composite<T>, fn: (data: T) => U): Composite<U> {
  if (node.type === "leaf") {
    return leaf(fn(node.data));
  }
  return branch(
    fn(node.data),
    node.children.map((child) => map(child, fn)),
  );
}

/**
 * Flattens a composite tree into an array of all node data.
 * Traverses depth-first, pre-order (parent before children).
 *
 * @template T - The data type
 * @param node - The root node to flatten
 * @returns Array of all node data
 * @since 2.4.0
 *
 * @example
 * ```ts
 * const allFiles = flatten(tree);
 * // [{ name: "root", ... }, { name: "file1.txt", ... }, ...]
 * ```
 */
export function flatten<T>(node: Composite<T>): T[] {
  return fold(node, {
    leaf: (data) => [data],
    branch: (data, childResults) => [data, ...childResults.flat()],
  });
}

/**
 * Finds the first node matching a predicate (depth-first).
 * Short-circuits on first match.
 *
 * @template T - The data type
 * @param node - The root node to search
 * @param predicate - Function to test each node
 * @returns Option containing the matching node data
 * @since 2.4.0
 */
export function find<T>(
  node: Composite<T>,
  predicate: (data: T) => boolean,
): Option<T> {
  if (predicate(node.data)) return some(node.data);
  if (node.type === "branch") {
    for (const child of node.children) {
      const found = find(child, predicate);
      if (found._tag === "Some") return found;
    }
  }
  return none;
}
