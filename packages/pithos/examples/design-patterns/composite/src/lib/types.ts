import type { Composite } from "@pithos/core/eidos/composite/composite";

export type FSNode = { name: string; size: number };
export type FileTree = Composite<FSNode>;

export type FoldStep = {
  name: string;
  type: "leaf" | "branch";
  result: number;
  depth: number;
};
