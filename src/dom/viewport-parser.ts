import { parseFloatDef } from "../data/number-utils";
import { parseKeyValuePairs } from "../data/parsers/string-parser";
import { ViewportValues } from "../types/dom/viewport";

export function parseViewportMeta(): ViewportValues {
  const content =
    document
      .querySelector('meta[name="viewport"]') //
      ?.getAttribute("content") ?? "";

  const pairs = parseKeyValuePairs(content);

  return {
    initialScale: parseFloatDef(pairs["initial-scale"]),
    minimumScale: parseFloatDef(pairs["minimum-scale"]),
    maximumScale: parseFloatDef(pairs["maximum-scale"]),
    userScalable: pairs["user-scalable"]
      ? pairs["user-scalable"] !== "no"
      : null,
  };
}
