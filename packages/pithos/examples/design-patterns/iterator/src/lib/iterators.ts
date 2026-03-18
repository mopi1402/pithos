/**
 * Iterator factories using Pithos createIterable.
 *
 * This is the core of the Iterator pattern:
 * three different traversal strategies, one interface (Iterable<Pokemon>).
 * The consumer calls .next() identically for all three.
 */

import { createIterable } from "@pithos/core/eidos/iterator/iterator";
import { some, none } from "@pithos/core/zygos/option";
import { ALL, EVOLUTION_CHAINS, TYPE_GROUPS } from "./data";
import type { Pokemon, SourceId } from "./types";

// ── Helper: iterate over groups, tagging the first item of each ──────

function createGroupedIterator(
  groups: { label: string; items: Pokemon[] }[],
): Iterable<Pokemon> {
  return createIterable(() => {
    let groupIdx = 0;
    let itemIdx = 0;
    return () => {
      while (groupIdx < groups.length) {
        const group = groups[groupIdx];
        if (itemIdx < group.items.length) {
          const p = group.items[itemIdx];
          const result: Pokemon = itemIdx === 0
            ? { ...p, groupStart: group.label }
            : p;
          itemIdx++;
          return some(result);
        }
        groupIdx++;
        itemIdx = 0;
      }
      return none;
    };
  });
}

// ── Three traversal strategies ───────────────────────────────────────

function createByIndexIterator(): Iterable<Pokemon> {
  return createIterable(() => {
    let i = 0;
    return () => i < ALL.length ? some(ALL[i++]) : none;
  });
}

function createByEvolutionIterator(): Iterable<Pokemon> {
  return createGroupedIterator(
    EVOLUTION_CHAINS.map((chain) => ({
      label: chain.map((c) => c.name).join(" → "),
      items: chain,
    })),
  );
}

function createByTypeIterator(): Iterable<Pokemon> {
  return createGroupedIterator(
    TYPE_GROUPS.map((g) => ({
      label: `${g.type} (${g.pokemon.length})`,
      items: g.pokemon,
    })),
  );
}

export const ITERATOR_FACTORIES: Record<SourceId, () => Iterable<Pokemon>> = {
  byIndex: createByIndexIterator,
  byEvolution: createByEvolutionIterator,
  byType: createByTypeIterator,
};
