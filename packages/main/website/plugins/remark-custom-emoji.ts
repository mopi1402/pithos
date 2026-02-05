/**
 * Remark plugin that replaces emoji characters with custom images.
 *
 * Only replaces emojis in text nodes — code blocks, inline code,
 * and mermaid diagrams are left untouched.
 *
 * At build time (SSG), every ✅ and ❌ becomes an <img> tag,
 * so the browser never renders a native emoji.
 */
import type { Root, Text, PhrasingContent } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { EMOJI_MAP } from "./emoji-map";

const EMOJI_PATTERN = new RegExp(
  `(${Object.keys(EMOJI_MAP).map((e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
  "g"
);

/** Node types where emojis should NOT be replaced */
const SKIP_TYPES = new Set(["code", "inlineCode", "mermaid"]);

function makeImgNode(emoji: string): PhrasingContent {
  const { src, alt, id } = EMOJI_MAP[emoji]!;
  const className = id ?? alt;
  const cls = className ? `custom-emoji custom-emoji--${className}` : "custom-emoji";
  return {
    type: "mdxJsxTextElement" as any,
    name: "img",
    attributes: [
      { type: "mdxJsxAttribute", name: "src", value: src },
      { type: "mdxJsxAttribute", name: "alt", value: alt },
      { type: "mdxJsxAttribute", name: "className", value: cls },
      { type: "mdxJsxAttribute", name: "loading", value: "lazy" },
      { type: "mdxJsxAttribute", name: "decoding", value: "async" },
    ],
    children: [],
  } as unknown as PhrasingContent;
}

const remarkCustomEmoji: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "text", (node: Text, index, parent) => {
      if (!parent || index === undefined) return;
      if (SKIP_TYPES.has(parent.type)) return;

      const text = node.value;
      if (!EMOJI_PATTERN.test(text)) return;

      // Reset regex state
      EMOJI_PATTERN.lastIndex = 0;

      const children: PhrasingContent[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = EMOJI_PATTERN.exec(text)) !== null) {
        // Text before the emoji
        if (match.index > lastIndex) {
          children.push({ type: "text", value: text.slice(lastIndex, match.index) });
        }
        children.push(makeImgNode(match[0]!));
        lastIndex = match.index + match[0]!.length;
      }

      // Remaining text after last emoji
      if (lastIndex < text.length) {
        children.push({ type: "text", value: text.slice(lastIndex) });
      }

      // Replace the text node with the new children
      parent.children.splice(index, 1, ...children);
    });
  };
};

export default remarkCustomEmoji;
