import { Server, Database, FileText, Lock } from "lucide-react";
import { FIELDS, getField, type AppConfig, type CloneMode, type ConfigPath } from "@/lib/configPrototype";
import { FieldEditor } from "./FieldEditor";

const FIELD_ICONS: Record<string, React.ReactNode> = {
  "server.port": <Server className="w-3.5 h-3.5" />,
  "server.ssl.enabled": <Lock className="w-3.5 h-3.5" />,
  "database.pool.max": <Database className="w-3.5 h-3.5" />,
  "logging.level": <FileText className="w-3.5 h-3.5" />,
};

export function StepEdit({ original, clone, mode, leaked, onFieldChange }: {
  original: AppConfig;
  clone: AppConfig | null;
  mode: CloneMode;
  leaked: boolean;
  onFieldChange: (path: ConfigPath, value: string | number | boolean) => void;
}) {
  return (
    <div className="flex-1 flex flex-col gap-3">
      <div className="grid sm:grid-cols-2 gap-3 flex-1 min-h-0">
        {/* Production */}
        <div className="bg-gradient-to-b from-white/[0.04] to-white/[0.02] rounded-xl border border-white/[0.06] overflow-hidden flex flex-col min-h-0">
          <div className="h-9 px-3 flex items-center justify-between border-b border-white/[0.04] shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Production</span>
            </div>
            {leaked && (
              <span className="text-[9px] font-bold text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full">MUTATED</span>
            )}
          </div>
          <pre className="p-3 text-[10px] font-mono text-white/40 leading-relaxed overflow-auto flex-1">
            {JSON.stringify(original, null, 2)}
          </pre>
        </div>

        {/* Staging */}
        <div className="bg-gradient-to-b from-white/[0.04] to-white/[0.02] rounded-xl border border-violet-500/30 overflow-hidden flex flex-col min-h-0">
          <div className="h-9 px-3 flex items-center justify-between border-b border-white/[0.04] shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-500" />
              <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Staging</span>
            </div>
            <span className="text-[9px] text-white/25 font-mono">
              {mode === "deep" ? "deepClone()" : "{ ...spread }"}
            </span>
          </div>
          {clone && (
            <div className="p-3 space-y-2 overflow-y-auto flex-1">
              {FIELDS.map((field) => (
                <div key={field.path} className="flex items-center gap-2">
                  <span className="text-white/20 shrink-0">{FIELD_ICONS[field.path]}</span>
                  <FieldEditor
                    field={field}
                    value={getField(clone, field.path)}
                    originalValue={getField(original, field.path)}
                    onChange={(v) => onFieldChange(field.path, v)}
                    dark
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
