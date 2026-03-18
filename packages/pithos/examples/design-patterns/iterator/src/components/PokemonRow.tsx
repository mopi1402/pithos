import type { Pokemon } from "@/lib/pokedex";
import { TypeBadge, TYPE_STYLES, DEFAULT_STYLE } from "./TypeBadge";

export function PokemonRow({ pokemon, isNew, delay }: { pokemon: Pokemon; isNew: boolean; delay: number }) {
  const style = TYPE_STYLES[pokemon.types[0]] ?? DEFAULT_STYLE;

  return (
    <div
      className={`
        flex items-center gap-3 bg-gradient-to-r ${style.bg} rounded-xl px-3 py-2
        transition-all duration-700 ease-out shadow-sm
      `}
      style={isNew ? { animation: `flipInX 0.4s ease-out both`, animationDelay: `${delay * 50}ms` } : undefined}
    >
      <span className="text-[11px] font-mono text-black/20 font-bold w-10 shrink-0">
        #{String(pokemon.id).padStart(3, "0")}
      </span>
      <img
        src={pokemon.sprite}
        alt={pokemon.name}
        className="w-10 h-10 object-contain drop-shadow"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <div className={`font-bold text-sm ${style.text} truncate`}>{pokemon.name}</div>
      </div>
      <div className="flex gap-1 shrink-0">
        {pokemon.types.map((t) => (
          <TypeBadge key={t} type={t} />
        ))}
      </div>
    </div>
  );
}
