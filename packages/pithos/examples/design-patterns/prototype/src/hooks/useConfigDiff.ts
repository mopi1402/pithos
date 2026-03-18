import { useState, useCallback, useMemo, useRef } from "react";
import { deepClone } from "@pithos/core/eidos/prototype/prototype";
import {
  BASE_CONFIG,
  FIELDS,
  cloneConfig,
  getField,
  setField,
  checkReferences,
  type AppConfig,
  type CloneMode,
  type ConfigPath,
} from "@/lib/configPrototype";

function freshOriginal(): AppConfig {
  return deepClone(BASE_CONFIG);
}

export function useConfigDiff() {
  const [mode, setMode] = useState<CloneMode>("deep");
  const [clone, setClone] = useState<AppConfig | null>(null);
  const originalRef = useRef(BASE_CONFIG);

  const handleClone = useCallback(() => {
    setClone(cloneConfig(originalRef.current, mode));
  }, [mode]);

  const resetOriginal = useCallback(() => {
    originalRef.current = freshOriginal();
    setClone(null);
  }, []);

  const handleModeSwitch = useCallback((newMode: CloneMode) => {
    setMode(newMode);
    resetOriginal();
  }, [resetOriginal]);

  const handleFieldChange = useCallback((path: ConfigPath, value: string | number | boolean) => {
    if (!clone) return;
    setField(clone, path, value);
    setClone({ ...clone });
  }, [clone]);

  const refs = useMemo(
    () => (clone ? checkReferences(originalRef.current, clone) : null),
    [clone],
  );

  const diffs = useMemo(() => {
    if (!clone) return [];
    return FIELDS.filter((f) => getField(originalRef.current, f.path) !== getField(clone, f.path))
      .map((f) => ({
        path: f.path,
        original: String(getField(originalRef.current, f.path)),
        cloned: String(getField(clone, f.path)),
      }));
  }, [clone]);

  const leaked = useMemo(() => {
    if (!clone || mode !== "shallow") return false;
    return FIELDS.some((f) => {
      const orig = getField(originalRef.current, f.path);
      const base = getField(BASE_CONFIG, f.path);
      return orig !== base;
    });
  }, [clone, mode]);

  return {
    mode,
    clone,
    original: originalRef.current,
    refs,
    diffs,
    leaked,
    handleClone,
    handleReset: resetOriginal,
    handleModeSwitch,
    handleFieldChange,
  };
}
