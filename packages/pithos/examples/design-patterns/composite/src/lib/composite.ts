/**
 * Composite pattern operations via fold().
 *
 * fold() traverses the tree bottom-up: leaves emit values,
 * branches reduce their children's results.
 */

import { fold } from "@pithos/core/eidos/composite/composite";
import type { FileTree, FoldStep } from "./types";

export { fold };

/** Fold a tree by summing: leaf emits a value, branch sums children. */
function sumFold(node: FileTree, leafValue: (data: FileTree["data"]) => number, branchBonus: number = 0): number {
  return fold(node, {
    leaf: (data) => leafValue(data),
    branch: (_data, children) => branchBonus + children.reduce((a, b) => a + b, 0),
  });
}

export function computeSize(node: FileTree): number {
  return sumFold(node, (data) => data.size);
}

export function countFiles(node: FileTree): number {
  return sumFold(node, () => 1);
}

export function countFolders(node: FileTree): number {
  return sumFold(node, () => 0, 1);
}

export function traceFold(node: FileTree, depth: number = 0): FoldStep[] {
  if (node.type === "leaf") {
    return [{ name: node.data.name, type: "leaf", result: node.data.size, depth }];
  }
  const childSteps = node.children.flatMap((child) => traceFold(child, depth + 1));
  const total = computeSize(node);
  return [...childSteps, { name: node.data.name, type: "branch", result: total, depth }];
}
