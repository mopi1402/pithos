// ── Type styles ──────────────────────────────────────────────────────

export const TYPE_STYLES: Record<string, { bg: string; text: string; badge: string }> = {
  Fire:     { bg: "from-orange-50 to-orange-100", text: "text-orange-900", badge: "bg-orange-500" },
  Water:    { bg: "from-blue-50 to-blue-100",     text: "text-blue-900",   badge: "bg-blue-500" },
  Grass:    { bg: "from-emerald-50 to-emerald-100", text: "text-emerald-900", badge: "bg-emerald-500" },
  Electric: { bg: "from-yellow-50 to-amber-100",  text: "text-amber-900",  badge: "bg-amber-500" },
  Psychic:  { bg: "from-purple-50 to-purple-100", text: "text-purple-900", badge: "bg-purple-500" },
  Ghost:    { bg: "from-violet-50 to-violet-100", text: "text-violet-900", badge: "bg-violet-500" },
  Dragon:   { bg: "from-indigo-50 to-indigo-100", text: "text-indigo-900", badge: "bg-indigo-500" },
  Normal:   { bg: "from-slate-50 to-slate-100",   text: "text-slate-800",  badge: "bg-slate-400" },
  Fighting: { bg: "from-red-50 to-red-100",       text: "text-red-900",    badge: "bg-red-500" },
  Rock:     { bg: "from-amber-50 to-stone-100",   text: "text-stone-900",  badge: "bg-stone-500" },
  Poison:   { bg: "from-fuchsia-50 to-fuchsia-100", text: "text-fuchsia-900", badge: "bg-fuchsia-500" },
  Ground:   { bg: "from-amber-50 to-amber-100",   text: "text-amber-900",  badge: "bg-amber-600" },
  Bug:      { bg: "from-lime-50 to-lime-100",     text: "text-lime-900",   badge: "bg-lime-500" },
  Flying:   { bg: "from-sky-50 to-sky-100",       text: "text-sky-900",    badge: "bg-sky-500" },
  Fairy:    { bg: "from-pink-50 to-pink-100",     text: "text-pink-900",   badge: "bg-pink-500" },
  Ice:      { bg: "from-cyan-50 to-cyan-100",     text: "text-cyan-900",   badge: "bg-cyan-500" },
  Steel:    { bg: "from-gray-50 to-gray-200",     text: "text-gray-800",   badge: "bg-gray-500" },
};

export const DEFAULT_STYLE = { bg: "from-slate-50 to-slate-100", text: "text-slate-800", badge: "bg-slate-400" };

export function TypeBadge({ type, small }: { type: string; small?: boolean }) {
  const style = TYPE_STYLES[type] ?? DEFAULT_STYLE;
  return (
    <span className={`inline-block rounded-full font-bold uppercase text-white ${style.badge} ${
      small ? "px-1.5 py-0 text-[8px]" : "px-2 py-0.5 text-[10px]"
    }`}>
      {type}
    </span>
  );
}
