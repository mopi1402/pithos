import type { MdNode } from "./types";

export type AstLine = {
  indent: number;
  label: string;
  kind: string;
};

export function astToDisplayLines(node: MdNode, depth: number = 0): AstLine[] {
  const indent = depth;
  const lines: AstLine[] = [];

  switch (node.type) {
    case "document":
      lines.push({ indent, label: "Document", kind: "document" });
      for (const child of node.children) {
        lines.push(...astToDisplayLines(child, depth + 1));
      }
      break;

    case "heading":
      lines.push({ indent, label: `Heading (h${node.level})`, kind: "heading" });
      for (const child of node.children) {
        lines.push(...astToDisplayLines(child, depth + 1));
      }
      break;

    case "paragraph":
      lines.push({ indent, label: "Paragraph", kind: "paragraph" });
      for (const child of node.children) {
        lines.push(...astToDisplayLines(child, depth + 1));
      }
      break;

    case "blockquote":
      lines.push({ indent, label: "Blockquote", kind: "blockquote" });
      for (const child of node.children) {
        lines.push(...astToDisplayLines(child, depth + 1));
      }
      break;

    case "code-block":
      lines.push({ indent, label: `CodeBlock (${node.lang || "plain"})`, kind: "code-block" });
      break;

    case "hr":
      lines.push({ indent, label: "HorizontalRule", kind: "hr" });
      break;

    case "unordered-list":
      lines.push({ indent, label: "UnorderedList", kind: "list" });
      for (const [i, item] of node.items.entries()) {
        lines.push({ indent: depth + 1, label: `Item ${i + 1}`, kind: "list-item" });
        for (const child of item.children) {
          lines.push(...astToDisplayLines(child, depth + 2));
        }
        if (item.sublist) {
          lines.push(...astToDisplayLines(item.sublist, depth + 2));
        }
      }
      break;

    case "ordered-list":
      lines.push({ indent, label: "OrderedList", kind: "list" });
      for (const [i, item] of node.items.entries()) {
        lines.push({ indent: depth + 1, label: `Item ${i + 1}`, kind: "list-item" });
        for (const child of item.children) {
          lines.push(...astToDisplayLines(child, depth + 2));
        }
        if (item.sublist) {
          lines.push(...astToDisplayLines(item.sublist, depth + 2));
        }
      }
      break;

    case "table":
      lines.push({ indent, label: `Table (${node.headers.length} cols)`, kind: "table" });
      lines.push({ indent: depth + 1, label: "Header", kind: "table-header" });
      for (const cell of node.headers) {
        for (const child of cell) {
          lines.push(...astToDisplayLines(child, depth + 2));
        }
      }
      for (const [i, row] of node.rows.entries()) {
        lines.push({ indent: depth + 1, label: `Row ${i + 1}`, kind: "table-row" });
        for (const cell of row) {
          for (const child of cell) {
            lines.push(...astToDisplayLines(child, depth + 2));
          }
        }
      }
      break;

    case "text":
      lines.push({ indent, label: `"${node.value}"`, kind: "text" });
      break;

    case "bold":
      lines.push({ indent, label: "Bold", kind: "bold" });
      for (const child of node.children) {
        lines.push(...astToDisplayLines(child, depth + 1));
      }
      break;

    case "italic":
      lines.push({ indent, label: "Italic", kind: "italic" });
      for (const child of node.children) {
        lines.push(...astToDisplayLines(child, depth + 1));
      }
      break;

    case "bold-italic":
      lines.push({ indent, label: "BoldItalic", kind: "bold-italic" });
      for (const child of node.children) {
        lines.push(...astToDisplayLines(child, depth + 1));
      }
      break;

    case "strikethrough":
      lines.push({ indent, label: "Strikethrough", kind: "strikethrough" });
      for (const child of node.children) {
        lines.push(...astToDisplayLines(child, depth + 1));
      }
      break;

    case "inline-code":
      lines.push({ indent, label: `Code("${node.value}")`, kind: "inline-code" });
      break;

    case "link":
      lines.push({ indent, label: `Link(${node.href})`, kind: "link" });
      for (const child of node.children) {
        lines.push(...astToDisplayLines(child, depth + 1));
      }
      break;

    case "autolink":
      lines.push({ indent, label: `Autolink(${node.href})`, kind: "link" });
      break;

    case "image":
      lines.push({ indent, label: `Image(${node.alt})`, kind: "image" });
      break;

    case "checkbox":
      lines.push({ indent, label: node.checked ? "Checkbox [x]" : "Checkbox [ ]", kind: "checkbox" });
      break;

    case "line-break":
      lines.push({ indent, label: "LineBreak", kind: "line-break" });
      break;

    case "html-block":
      lines.push({ indent, label: "HtmlBlock", kind: "html-block" });
      break;

    case "inline-html":
      lines.push({ indent, label: `Html(${node.content})`, kind: "inline-html" });
      break;
  }

  return lines;
}
