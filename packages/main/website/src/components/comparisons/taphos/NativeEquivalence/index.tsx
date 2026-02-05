import React from "react";
import { translate } from "@docusaurus/Translate";
import { Accordion } from "@site/src/components/shared/Accordion";
import { Code } from "@site/src/components/shared/Code";
import { WarningModalProvider, WarningTooltip, useWarningModal } from "@site/src/components/shared/WarningTooltip";
import { taphosConfig, type TaphosCategory } from "../PerformanceTable/config";
import type { BadgeVariant } from "@site/src/components/shared/Badge";
import styles from "./styles.module.css";

type NativenessLevel = "native" | "composition" | "custom";

const nativenessLevel: Record<string, "native" | "composition" | "custom"> = {
  // 🔴 custom: no real native equivalent
  pad: "custom", upperCase: "custom",
  // 🟡 composition: honest composition of native APIs
  create: "composition", flatMapDeep: "composition", flatMapDepth: "composition",
  forOwn: "composition", nthArg: "composition", overEvery: "composition", overSome: "composition",
  pull: "composition", pullAt: "composition", pullAllBy: "composition", pullAllWith: "composition",
  without: "composition", sortBy: "composition", toFinite: "composition", toSafeInteger: "composition",
  transform: "composition", zipObject: "composition", rangeRight: "composition", wrap: "composition",
  size: "composition", toPath: "composition",
};

interface FunctionEntry {
  name: string;
  warning?: React.ReactNode;
}

interface CategoryGroup {
  label: string;
  functions: FunctionEntry[];
}

interface LevelGroup {
  level: NativenessLevel;
  title: string;
  badge: string;
  badgeVariant: BadgeVariant;
  defaultOpen?: boolean;
  categories: CategoryGroup[];
}

const categoryOrder: TaphosCategory[] = ["array", "collection", "function", "lang", "math", "object", "string", "util"];

const categoryLabels: Record<TaphosCategory, string> = {
  array: "Array",
  collection: "Collection",
  function: "Function",
  lang: "Lang",
  math: "Math",
  object: "Object",
  string: "String",
  util: "Util",
};

function buildGroups(): LevelGroup[] {
  const { functionToCategory, quasiEquivalentFunctions } = taphosConfig;
  const allFunctions = Object.keys(functionToCategory);

  const byLevel = new Map<NativenessLevel, Map<TaphosCategory, FunctionEntry[]>>();

  for (const fn of allFunctions) {
    const level: NativenessLevel = Object.prototype.hasOwnProperty.call(nativenessLevel, fn)
      ? nativenessLevel[fn]
      : "native";
    const cat = functionToCategory[fn] as TaphosCategory;
    const warning = quasiEquivalentFunctions?.[fn];

    if (!byLevel.has(level)) byLevel.set(level, new Map());
    const catMap = byLevel.get(level)!;
    if (!catMap.has(cat)) catMap.set(cat, []);
    catMap.get(cat)!.push({ name: fn, warning: warning || undefined });
  }

  // Sort functions within each category
  for (const catMap of byLevel.values()) {
    for (const fns of catMap.values()) {
      fns.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  const total = allFunctions.length;

  const levels: { level: NativenessLevel; title: string; badgeVariant: BadgeVariant; defaultOpen?: boolean }[] = [
    { level: "native", title: translate({ id: "comparison.taphos.equivalence.native", message: "🟢 Native API" }), badgeVariant: "success", defaultOpen: true },
    { level: "composition", title: translate({ id: "comparison.taphos.equivalence.composition", message: "🟡 Composition" }), badgeVariant: "warning" },
    { level: "custom", title: translate({ id: "comparison.taphos.equivalence.custom", message: "🔴 Custom" }), badgeVariant: "error" },
  ];

  return levels.map(({ level, title, badgeVariant, defaultOpen }) => {
    const catMap = byLevel.get(level) ?? new Map();
    const categories: CategoryGroup[] = [];
    let count = 0;

    for (const cat of categoryOrder) {
      const fns = catMap.get(cat);
      if (fns && fns.length > 0) {
        categories.push({ label: categoryLabels[cat], functions: fns });
        count += fns.length;
      }
    }

    return { level, title, badge: `${count}/${total}`, badgeVariant, defaultOpen, categories };
  }).filter(g => g.categories.length > 0);
}

function FunctionCode({ entry }: { entry: FunctionEntry }) {
  const warningModal = useWarningModal();

  if (!entry.warning) {
    return <Code>{entry.name}()</Code>;
  }

  return (
    <WarningTooltip content={entry.warning} icon={<></>}>
      <code
        className={styles.warningCode}
        onClick={() => warningModal?.openModal(entry.warning)}
      >
        {entry.name}() <span className={styles.warningBadge}>⚠️</span>
      </code>
    </WarningTooltip>
  );
}

function CategoryFunctions({ group }: { group: CategoryGroup }) {
  return (
    <div className={styles.categoryGroup}>
      <strong>{group.label}</strong>
      <br />
      {group.functions.map((entry, i) => (
        <React.Fragment key={entry.name}>
          {i > 0 && ", "}
          <FunctionCode entry={entry} />
        </React.Fragment>
      ))}
    </div>
  );
}

export function NativeEquivalenceList(): React.ReactElement {
  const groups = buildGroups();

  return (
    <WarningModalProvider>
      {groups.map((group) => (
        <Accordion
          key={group.level}
          title={group.title}
          badge={group.badge}
          badgeVariant={group.badgeVariant}
          defaultOpen={group.defaultOpen}
        >
          {group.categories.map((cat) => (
            <CategoryFunctions key={cat.label} group={cat} />
          ))}
        </Accordion>
      ))}
    </WarningModalProvider>
  );
}
