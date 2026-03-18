import type { MdNode, TableAlign } from "./parsing-pipeline";

type EvalFn = (node: MdNode, ctx: { indent: number }) => string;

export function evalChildren(children: MdNode[], ctx: { indent: number }, evalNode: EvalFn): string {
  return children.map((c) => evalNode(c, ctx)).join("");
}

export function evalListItem(
  item: { children: MdNode[]; sublist: MdNode | null },
  ctx: { indent: number },
  evalNode: EvalFn,
): string {
  const content = evalChildren(item.children, ctx, evalNode);
  const sub = item.sublist ? evalNode(item.sublist, ctx) : "";
  return `<li>${content}${sub}</li>`;
}

export function evalTable(
  node: { headers: MdNode[][]; alignments: TableAlign[]; rows: MdNode[][][] },
  ctx: { indent: number },
  evalNode: EvalFn,
): string {
  const alignAttr = (i: number) => {
    const a = node.alignments[i];
    if (a === "none") return "";
    return ` style="text-align:${a}"`;
  };

  const thead = `<thead><tr>${node.headers.map((h, i) => `<th${alignAttr(i)}>${evalChildren(h, ctx, evalNode)}</th>`).join("")}</tr></thead>`;
  const tbody = node.rows.length > 0
    ? `<tbody>${node.rows.map((row) => `<tr>${row.map((cell, i) => `<td${alignAttr(i)}>${evalChildren(cell, ctx, evalNode)}</td>`).join("")}</tr>`).join("")}</tbody>`
    : "";

  return `<table>${thead}${tbody}</table>`;
}
