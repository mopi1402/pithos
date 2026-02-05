import React, { useState, useMemo } from "react";
import { translate } from "@docusaurus/Translate";
import { SearchBar } from "../SearchBar";
import { Accordion } from "../Accordion";
import type { BadgeVariant } from "../Badge";
import styles from "./styles.module.css";

export interface AccordionGroupItem {
  /** Unique key for the item */
  key: string;
  /** Searchable label (used for filtering) */
  label: string;
  /** Content to render inside the inner accordion */
  content: React.ReactNode;
}

export interface AccordionGroupCategory {
  /** Category display name */
  title: string;
  /** Items in this category */
  items: AccordionGroupItem[];
  /** Optional badge variant for the category count */
  badgeVariant?: BadgeVariant;
}

interface SearchableAccordionGroupProps {
  categories: AccordionGroupCategory[];
  placeholder?: string;
}

export function SearchableAccordionGroup({
  categories,
  placeholder,
}: SearchableAccordionGroupProps): React.ReactElement {
  const [query, setQuery] = useState("");
  const resolvedPlaceholder = placeholder ?? translate({ id: 'shared.accordionGroup.searchPlaceholder', message: 'Search...' });

  const normalizedQuery = query.toLowerCase().trim();

  const filtered = useMemo(() => {
    if (!normalizedQuery) return categories;

    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((item) =>
          item.label.toLowerCase().includes(normalizedQuery),
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [categories, normalizedQuery]);

  const totalResults = filtered.reduce((sum, cat) => sum + cat.items.length, 0);
  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const isFiltering = normalizedQuery.length > 0;

  return (
    <div className={styles.container}>
      <SearchBar value={query} onChange={setQuery} placeholder={resolvedPlaceholder} />
      {isFiltering && (
        <div className={styles.resultCount}>
          {translate(
            { id: 'shared.accordionGroup.resultCount', message: '{found} / {total} result(s)' },
            { found: String(totalResults), total: String(totalItems) }
          )}
        </div>
      )}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          {translate(
            { id: 'shared.accordionGroup.noResults', message: 'No results for "{query}"' },
            { query }
          )}
        </div>
      ) : (
        filtered.map((cat) => (
          <Accordion
            key={cat.title}
            title={cat.title}
            badge={`${cat.items.length}`}
            badgeVariant={cat.badgeVariant ?? "neutral"}
            defaultOpen={isFiltering}
          >
            {cat.items.map((item) => item.content)}
          </Accordion>
        ))
      )}
    </div>
  );
}
