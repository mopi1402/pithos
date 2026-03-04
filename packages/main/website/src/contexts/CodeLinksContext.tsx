import React, { createContext, useContext } from "react";

/** Map of symbol name → API URL for the current code block */
export type CodeLinksMap = Record<string, string>;

const CodeLinksContext = createContext<CodeLinksMap>({});

export const CodeLinksProvider = CodeLinksContext.Provider;

export function useCodeLinks(): CodeLinksMap {
  return useContext(CodeLinksContext);
}

/**
 * Parse the `links` metastring value into a map.
 * Format: "chunk:/api/arkhe/array/chunk,get:/api/arkhe/object/get"
 */
export function parseLinksMetastring(metastring?: string): CodeLinksMap {
  if (!metastring) return {};

  const linksMatch = metastring.match(/links="([^"]*)"/);
  if (!linksMatch) return {};

  const map: CodeLinksMap = {};
  for (const entry of linksMatch[1].split(",")) {
    const colonIdx = entry.indexOf(":");
    if (colonIdx > 0) {
      const name = entry.slice(0, colonIdx).trim();
      const url = entry.slice(colonIdx + 1).trim();
      if (name && url) map[name] = url;
    }
  }
  return map;
}
