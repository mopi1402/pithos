import { useState, useMemo } from "react";
import { renderMarkdown } from "@/lib/interpreter";
import { astToDisplayLines } from "@/lib/parsing-pipeline/astDisplay";
import { SAMPLE_MARKDOWN } from "@/data/sampleMarkdown";
import type { Tab } from "@/components/TabBar";
import type { RightPanel } from "@/components/RightPanelToggle";

export function useMarkdownEditor() {
  const [source, setSource] = useState(SAMPLE_MARKDOWN);
  const [tab, setTab] = useState<Tab>("editor");
  const [rightPanel, setRightPanel] = useState<RightPanel>("preview");

  const { ast, html } = useMemo(() => renderMarkdown(source), [source]);
  const astLines = useMemo(() => astToDisplayLines(ast), [ast]);

  return { source, setSource, tab, setTab, rightPanel, setRightPanel, html, astLines };
}
