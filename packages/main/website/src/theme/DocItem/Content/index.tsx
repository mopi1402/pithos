import { type ReactNode, useEffect, useRef } from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import Heading from "@theme/Heading";
import MDXContent from "@theme/MDXContent";
import ImportantBadge, {
  importantBadgeStyles,
} from "@site/src/components/shared/badges/ImportantBadge";
import HiddenGemBadge, {
  hiddenGemBadgeStyles,
} from "@site/src/components/shared/badges/HiddenGemBadge";
import TypeBadge from "@site/src/components/shared/badges/TypeBadge";
import type { Props } from "@theme/DocItem/Content";

/**
 Title can be declared inside md content or declared through
 front matter and added manually. To make both cases consistent,
 the added title is added under the same div.markdown block
 See https://github.com/facebook/docusaurus/pull/4882#issuecomment-853021120

 We render a "synthetic title" if:
 - user doesn't ask to hide it with front matter
 - the markdown content does not already contain a top-level h1 heading
*/
function useSyntheticTitle(): string | null {
  const { metadata, frontMatter, contentTitle } = useDoc();
  const shouldRender =
    !frontMatter.hide_title && typeof contentTitle === "undefined";
  if (!shouldRender) {
    return null;
  }
  return metadata.title;
}

export default function DocItemContent({ children }: Props): ReactNode {
  const syntheticTitle = useSyntheticTitle();
  const { frontMatter, contentTitle } = useDoc();
  const contentRef = useRef<HTMLDivElement>(null);

  // If title is in MDX content (not synthetic), inject badges after the first h1
  // Note: We can't use TypeBadge/ImportantBadge here because they use useDoc()
  // and we're creating a new React root outside the DocProvider context
  useEffect(() => {
    if (!syntheticTitle && contentTitle && contentRef.current) {
      const firstH1 = contentRef.current.querySelector("h1");
      if (firstH1 && !firstH1.querySelector(".doc-badges-container")) {
        const h1Element = firstH1 as HTMLElement;
        h1Element.style.position = "relative";

        // Get frontmatter data from useDoc (we're still in the component, so this works)
        const type = (frontMatter as { type?: string }).type;
        const isImportant = (frontMatter as { important?: boolean }).important;
        const isHiddenGem = (frontMatter as { hiddenGem?: boolean }).hiddenGem;

        // Add ImportantBadge inline with the title
        if (isImportant) {
          const importantBadge = document.createElement("span");
          // Use styles from ImportantBadge component
          Object.assign(importantBadge.style, importantBadgeStyles);
          importantBadge.textContent = "👑 Top pick";
          importantBadge.title = "Top pick";
          h1Element.appendChild(importantBadge);
        }

        // Add HiddenGemBadge inline with the title
        if (isHiddenGem) {
          const hiddenGemBadge = document.createElement("span");
          // Use styles from HiddenGemBadge component
          Object.assign(hiddenGemBadge.style, hiddenGemBadgeStyles);
          hiddenGemBadge.textContent = "💎 Hidden gem";
          hiddenGemBadge.title = "Hidden gem";
          h1Element.appendChild(hiddenGemBadge);
        }

        // Add TypeBadge below the title
        const typeBadgeContainer = document.createElement("span");
        typeBadgeContainer.className = "doc-badges-container";
        typeBadgeContainer.style.position = "absolute";
        typeBadgeContainer.style.top = "calc(100% - 30px)";
        typeBadgeContainer.style.left = "0";

        // Create badges manually without using the components that call useDoc()
        const typeLabels: Record<string, string> = {
          function: "Function",
          class: "Class",
          interface: "Interface",
          type: "Type",
          variable: "Variable",
          enum: "Enum",
        };

        if (type && typeLabels[type]) {
          const label = typeLabels[type];
          const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
          const typeBadge = document.createElement("span");
          typeBadge.style.cssText = `
            display: inline-flex;
            align-items: center;
            padding: 0.125rem 0.5rem;
            background-color: transparent;
            color: #666;
            border: 1px solid #666;
            border-radius: 0.375rem;
            font-size: 0.575rem;
            font-weight: 600;
          `;
          typeBadge.textContent = capitalizedType;
          typeBadge.title = `Type: ${label}`;
          typeBadgeContainer.appendChild(typeBadge);
          h1Element.appendChild(typeBadgeContainer);
        }
      }
    }
  }, [syntheticTitle, contentTitle, frontMatter]);

  return (
    <div
      ref={contentRef}
      className={clsx(ThemeClassNames.docs.docMarkdown, "markdown")}
    >
      {syntheticTitle && (
        <header>
          <Heading as="h1" style={{ position: "relative" }}>
            {syntheticTitle}
            <ImportantBadge />
            <HiddenGemBadge />
            <TypeBadge />
          </Heading>
        </header>
      )}
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
