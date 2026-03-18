import { leaf, branch } from "@pithos/core/eidos/composite/composite";
import type { FileTree, FSNode } from "./types";

export function addFileToTree(node: FileTree, folderPath: string[], file: FSNode): FileTree | null {
  if (folderPath.length === 0) {
    if (node.type === "branch") {
      if (node.children.some((c) => c.data.name === file.name)) return null;
      return branch(node.data, [...node.children, leaf(file)]);
    }
    return null;
  }
  if (node.type === "leaf") return null;
  const [next, ...rest] = folderPath;
  let found = false;
  const newChildren = node.children.map((child) => {
    if (child.data.name === next) { found = true; return addFileToTree(child, rest, file) ?? child; }
    return child;
  });
  if (!found) return null;
  return branch(node.data, newChildren);
}

export function collectFolderPaths(node: FileTree, prefix: string[] = []): string[][] {
  if (node.type === "leaf") return [];
  const current = [...prefix, node.data.name];
  const childPaths = node.children.flatMap((child) => collectFolderPaths(child, current));
  return [current, ...childPaths];
}
