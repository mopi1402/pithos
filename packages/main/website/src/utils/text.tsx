import React, { type ReactElement, type ReactNode } from "react";

/**
 * Parses markdown-style links in a string and returns React nodes with `<a>` elements.
 */
export function parseMarkdownLinks(text: string): React.ReactNode {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer">
        {match[1]}
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

/**
 * Extracts text content from a React node recursively.
 */
export function extractTextFromNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (React.isValidElement(node)) {
    const element = node as ReactElement<{ children?: ReactNode }>;
    const children = React.Children.toArray(element.props.children);
    return children.map(extractTextFromNode).join(" ");
  }

  if (Array.isArray(node)) {
    return node.map(extractTextFromNode).join(" ");
  }

  return "";
}

/**
 * Removes a prefix from a React node if it exists.
 * Only removes from the first text node found.
 */
export function removePrefixFromNode(node: ReactNode, prefix: string): ReactNode {
  if (typeof node === "string") {
    const trimmed = node.trim();
    return trimmed.startsWith(prefix)
      ? trimmed.slice(prefix.length).trim()
      : node;
  }

  if (typeof node === "number") {
    return node;
  }

  if (React.isValidElement(node)) {
    const element = node as ReactElement<{ children?: ReactNode }>;
    const children = React.Children.toArray(element.props.children);

    if (children.length > 0) {
      const firstChild = children[0];
      if (typeof firstChild === "string") {
        const trimmed = firstChild.trim();
        if (trimmed.startsWith(prefix)) {
          const newFirstChild = trimmed.slice(prefix.length).trim();
          const newChildren = [newFirstChild, ...children.slice(1)];
          return React.cloneElement(element, {
            children: newChildren,
          } as Partial<{ children?: ReactNode }>);
        }
      }
    }

    const processedChildren = children.map((child) =>
      removePrefixFromNode(child, prefix),
    );
    return React.cloneElement(element, {
      children: processedChildren,
    } as Partial<{ children?: ReactNode }>);
  }

  if (Array.isArray(node)) {
    return node.map((item) => removePrefixFromNode(item, prefix));
  }

  return node;
}
