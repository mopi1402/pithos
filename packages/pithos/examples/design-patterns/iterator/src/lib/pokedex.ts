/**
 * Pokédex public API.
 *
 * Wraps the iterators into a stateful consumer with next(), nextBatch(),
 * and getState() for the UI.
 */

import { ITERATOR_FACTORIES } from "./iterators";
import type { Pokemon, SourceId } from "./types";

// Re-export types for consumers
export type { Pokemon, SourceId } from "./types";
export { SOURCES, SOURCE_IDS } from "./types";

export interface PokedexState {
  source: SourceId;
  displayed: Pokemon[];
  exhausted: boolean;
  nextCount: number;
}

export function createPokedex(source: SourceId) {
  const iterable = ITERATOR_FACTORIES[source]();
  const iterator = iterable[Symbol.iterator]();
  const displayed: Pokemon[] = [];
  let exhausted = false;
  let nextCount = 0;

  return {
    next(): Pokemon | null {
      if (exhausted) return null;
      const result = iterator.next();
      if (result.done) {
        exhausted = true;
        return null;
      }
      nextCount++;
      displayed.push(result.value);
      return result.value;
    },

    nextBatch(n: number): Pokemon[] {
      const batch: Pokemon[] = [];
      for (let i = 0; i < n; i++) {
        const p = this.next();
        if (!p) break;
        batch.push(p);
      }
      return batch;
    },

    getState(): PokedexState {
      return { source, displayed: [...displayed], exhausted, nextCount };
    },
  };
}
