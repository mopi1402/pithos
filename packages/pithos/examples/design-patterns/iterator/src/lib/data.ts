/**
 * Pokemon data loading and grouping.
 * Builds the three data structures consumed by the iterators.
 */

import pokemonData from "@/data/pokemon-data.json";
import type { Pokemon } from "./types";

// ── All 151 Gen 1 Pokémon ────────────────────────────────────────────

export const ALL: Pokemon[] = pokemonData.map((p) => ({
  id: p.id,
  name: p.name,
  types: p.types,
  sprite: p.sprite,
}));

const byId = new Map(ALL.map((p) => [p.id, p]));

// ── Evolution chains ─────────────────────────────────────────────────

function buildEvolutionChains(): Pokemon[][] {
  const childOf = new Map<number, number>();
  for (const p of pokemonData) {
    if (p.evolvesFrom !== null && byId.has(p.evolvesFrom)) {
      childOf.set(p.id, p.evolvesFrom);
    }
  }

  const roots = ALL.filter((p) => !childOf.has(p.id));

  const children = new Map<number, number[]>();
  for (const [child, parent] of childOf) {
    const list = children.get(parent) ?? [];
    list.push(child);
    children.set(parent, list);
  }

  const chains: Pokemon[][] = [];
  for (const root of roots) {
    const chain: Pokemon[] = [];
    const stack = [root.id];
    while (stack.length) {
      const id = stack.pop();
      if (id === undefined) break;
      const p = byId.get(id);
      if (p) chain.push(p);
      const kids = children.get(id) ?? [];
      for (let i = kids.length - 1; i >= 0; i--) stack.push(kids[i]);
    }
    if (chain.length) chains.push(chain);
  }

  return chains;
}

// ── Type groups ──────────────────────────────────────────────────────

function buildTypeGroups(): { type: string; pokemon: Pokemon[] }[] {
  const groups = new Map<string, Pokemon[]>();
  for (const p of ALL) {
    const type = p.types[0];
    const list = groups.get(type) ?? [];
    list.push(p);
    groups.set(type, list);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([type, pokemon]) => ({ type, pokemon }));
}

export const EVOLUTION_CHAINS = buildEvolutionChains();
export const TYPE_GROUPS = buildTypeGroups();
