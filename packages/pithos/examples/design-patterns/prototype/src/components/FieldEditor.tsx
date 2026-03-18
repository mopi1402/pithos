export function FieldEditor({
  field,
  value,
  originalValue,
  onChange,
  dark,
}: {
  field: { path: string; label: string; type: string; options?: string[] };
  value: string | number | boolean;
  originalValue: string | number | boolean;
  onChange: (v: string | number | boolean) => void;
  dark?: boolean;
}) {
  const changed = value !== originalValue;

  const base = dark
    ? `flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg transition-colors ${changed ? "bg-violet-500/10" : ""}`
    : `flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg transition-colors ${changed ? "bg-amber-50" : ""}`;

  const labelClass = dark ? "text-[11px] text-white/60 shrink-0" : "text-xs text-slate-600 shrink-0";

  const inputClass = dark
    ? "w-20 text-right text-[11px] bg-white/[0.04] border border-white/[0.08] text-white/80 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-violet-500"
    : "w-20 text-right text-xs border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500";

  const selectClass = dark
    ? "text-[11px] bg-white/[0.04] border border-white/[0.08] text-white/80 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-violet-500"
    : "text-xs border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <div className={base}>
      <label className={labelClass}>{field.label}</label>
      {field.type === "number" && (
        <input
          type="number"
          value={value as number}
          onChange={(e) => onChange(Number(e.target.value))}
          className={inputClass}
        />
      )}
      {field.type === "boolean" && (
        <button
          onClick={() => onChange(!(value as boolean))}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            value ? "bg-emerald-500" : dark ? "bg-white/20" : "bg-slate-300"
          }`}
        >
          <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
            value ? "translate-x-4" : "translate-x-0.5"
          }`} />
        </button>
      )}
      {field.type === "string" && field.options && (
        <select
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className={selectClass}
        >
          {field.options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      )}
    </div>
  );
}
