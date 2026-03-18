import type { Pokemon } from "@/lib/pokedex";
import { TypeBadge, TYPE_STYLES, DEFAULT_STYLE } from "./TypeBadge";

export function PokemonCard({ pokemon, isNew, delay }: { pokemon: Pokemon; isNew: boolean; delay: number }) {
  const style = TYPE_STYLES[pokemon.types[0]] ?? DEFAULT_STYLE;

  return (
    <div className="card-flip">
      <div
        className={`
          card-flip-inner card-flip-front
          relative overflow-hidden rounded-xl bg-gradient-to-br ${style.bg}
          transition-all duration-700 ease-out
          ${isNew ? "shadow-lg" : "shadow-sm hover:shadow-md"}
        `}
        key={pokemon.id}
        style={isNew ? { animation: `flipIn 0.4s ease-out both`, animationDelay: `${delay * 50}ms` } : undefined}
      >
        <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-white/30" />
        <div className="relative p-2.5">
          <span className="absolute top-1.5 right-1.5 text-[9px] font-mono text-black/15 font-bold">
            #{String(pokemon.id).padStart(3, "0")}
          </span>
          <div className="flex justify-center py-0.5">
            <img
              src={pokemon.sprite}
              alt={pokemon.name}
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-md"
              loading="lazy"
            />
          </div>
          <div className="text-center mt-0.5">
            <div className={`font-bold text-xs ${style.text} truncate`}>{pokemon.name}</div>
            <div className="flex justify-center gap-0.5 mt-0.5">
              {pokemon.types.map((t) => (
                <TypeBadge key={t} type={t} small />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
