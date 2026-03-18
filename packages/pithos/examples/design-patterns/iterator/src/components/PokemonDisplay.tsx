import type { SourceId, Pokemon } from "@/lib/pokedex";
import { PokemonRow } from "./PokemonRow";
import { PokemonCard } from "./PokemonCard";

export function PokemonDisplay({ source, displayed, lastAdded }: {
  source: SourceId;
  displayed: Pokemon[];
  lastAdded: Map<number, number>;
}) {
  if (source === "byIndex") {
    return (
      <div className="space-y-1.5">
        {displayed.map((p) => {
          const isNew = lastAdded.has(p.id);
          return (
            <PokemonRow key={p.id} pokemon={p} isNew={isNew} delay={lastAdded.get(p.id) ?? 0} />
          );
        })}
      </div>
    );
  }

  // byEvolution and byType: show group separators
  const items: React.ReactNode[] = [];
  for (let i = 0; i < displayed.length; i++) {
    const p = displayed[i];
    if (p.groupStart) {
      items.push(
        <div key={`sep-${i}`} className={`col-span-full ${i > 0 ? "mt-2" : ""}`}>
          <div className="flex items-center gap-2 px-1 py-1.5">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
              {p.groupStart}
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
        </div>
      );
    }
    const isNew = lastAdded.has(p.id);
    items.push(
      <PokemonCard key={`${source}-${p.id}`} pokemon={p} isNew={isNew} delay={lastAdded.get(p.id) ?? 0} />
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {items}
    </div>
  );
}
