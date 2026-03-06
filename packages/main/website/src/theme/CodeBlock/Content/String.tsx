import React, { useMemo } from "react";
import { useThemeConfig } from "@docusaurus/theme-common";
import {
  CodeBlockContextProvider,
  createCodeBlockMetadata,
  useCodeWordWrap,
} from "@docusaurus/theme-common/internal";
import useBaseUrl from "@docusaurus/useBaseUrl";
import CodeBlockLayout from "@theme/CodeBlock/Layout";
import {
  CodeLinksProvider,
  parseLinksMetastring,
  type CodeLinksMap,
} from "@site/src/contexts/CodeLinksContext";
import CmdClickHint from "@site/src/components/shared/CmdClickHint";

interface Props {
  children: string;
  className?: string;
  metastring?: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

function useCodeBlockMetadata(props: Props) {
  const { prism } = useThemeConfig();
  return createCodeBlockMetadata({
    code: props.children,
    className: props.className,
    metastring: props.metastring,
    magicComments: prism.magicComments,
    defaultLanguage: prism.defaultLanguage,
    language: props.language,
    title: props.title,
    showLineNumbers: props.showLineNumbers,
  });
}

export default function CodeBlockString(props: Props) {
  const metadata = useCodeBlockMetadata(props);
  const wordWrap = useCodeWordWrap();
  const baseUrl = useBaseUrl("/");
  const rawLinks = useMemo(
    () => parseLinksMetastring(props.metastring),
    [props.metastring],
  );
  const links = useMemo<CodeLinksMap>(() => {
    const resolved: CodeLinksMap = {};
    for (const [name, url] of Object.entries(rawLinks)) {
      let full = url.startsWith("/") ? `${baseUrl}${url.slice(1)}` : url;
      if (full.length > 1 && !full.endsWith("/")) {
        full += "/";
      }
      resolved[name] = full;
    }
    return resolved;
  }, [rawLinks, baseUrl]);
  const hasLinks = Object.keys(links).length > 0;

  return (
    <CodeLinksProvider value={links}>
      <CodeBlockContextProvider metadata={metadata} wordWrap={wordWrap}>
        <CodeBlockLayout />
      </CodeBlockContextProvider>
      {hasLinks && <CmdClickHint />}
    </CodeLinksProvider>
  );
}
