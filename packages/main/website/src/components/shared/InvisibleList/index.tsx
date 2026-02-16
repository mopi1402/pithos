import type { ReactNode } from "react";
import { Children, isValidElement, Fragment } from "react";

interface InvisibleListProps {
  children: ReactNode;
}

/**
 * Splits MDX content on `<br>` elements and wraps each segment
 * in a semantic `<ul>/<li>` without bullet markers.
 *
 * MDX compiles trailing double-spaces into `<br>` inside a `<p>`.
 * This component unwraps the `<p>`, splits on `<br>`, and produces
 * a proper `<ul>/<li>` structure.
 *
 * ```mdx
 * <InvisibleList>
 * ☐ First item.  
 * ☐ Second item.  
 * ☐ Third item.
 * </InvisibleList>
 * ```
 */
export default function InvisibleList({ children }: InvisibleListProps): ReactNode {
  // Flatten: if MDX wraps content in a <p>, unwrap it
  const flat: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === "p") {
      Children.forEach(child.props.children, (inner: ReactNode) => flat.push(inner));
    } else {
      flat.push(child);
    }
  });

  // Split on <br> elements
  const lines: ReactNode[][] = [[]];
  for (const node of flat) {
    if (isValidElement(node) && node.type === "br") {
      lines.push([]);
    } else {
      lines[lines.length - 1].push(node);
    }
  }

  // Filter empty lines, only trim leading/trailing whitespace of each line
  const items = lines
    .map((segments) => {
      // Trim only the first and last text nodes of each line
      const result = [...segments];
      for (let i = 0; i < result.length; i++) {
        if (typeof result[i] === "string") {
          if (i === 0) result[i] = (result[i] as string).trimStart();
          if (i === result.length - 1) result[i] = (result[i] as string).trimEnd();
        }
      }
      return result.filter((s) => s !== "");
    })
    .filter((segments) => segments.length > 0);

  return (
    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
      {items.map((segments, i) => (
        <li key={i}>{segments.length === 1 ? segments[0] : segments}</li>
      ))}
    </ul>
  );
}
