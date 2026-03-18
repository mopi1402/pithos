import { useState, useCallback, useMemo, useRef } from "react";
import { getSharedStyle, getCopiedStyle, computeStats, resetPool } from "@/lib/flyweight";
import { useContentEditable } from "./useContentEditable";
import { PRESETS } from "@/data/presets";
import type { EditorChar, StylePreset, EditorMode } from "@/lib/types";

export function useTextEditor() {
  const [mode, setMode] = useState<EditorMode>("flyweight");
  const [chars, setChars] = useState<EditorChar[]>([]);
  const [activePreset, setActivePreset] = useState<StylePreset>(PRESETS[0]);
  const presetRef = useRef(activePreset);
  presetRef.current = activePreset;
  const modeRef = useRef(mode);
  modeRef.current = mode;

  const { editorRef, handleBlur, restoreFocus, readInput, clearEditor } = useContentEditable(chars);

  const stats = useMemo(() => computeStats(chars, mode === "flyweight"), [chars, mode]);
  const noFlyweightStats = useMemo(() => (mode === "flyweight" ? computeStats(chars, false) : null), [chars, mode]);

  const changePreset = useCallback((preset: StylePreset) => {
    setActivePreset(preset);
    requestAnimationFrame(() => restoreFocus());
  }, [restoreFocus]);

  const handleInput = useCallback(() => {
    const { text, cursorPos } = readInput();
    const { font, size, color } = presetRef.current;
    const getStyle = modeRef.current === "flyweight" ? getSharedStyle : getCopiedStyle;

    setChars((prev) => {
      const oldLen = prev.length;
      const newLen = text.length;
      if (newLen > oldLen) {
        const inserted = newLen - oldLen;
        const insertPos = cursorPos - inserted;
        const nc: EditorChar[] = [];
        for (let i = 0; i < insertPos && i < oldLen; i++) nc.push({ ...prev[i], char: text[i] });
        for (let i = insertPos; i < insertPos + inserted; i++) nc.push({ char: text[i], style: getStyle(font, size, color), index: i });
        for (let i = insertPos; i < oldLen; i++) nc.push({ ...prev[i], char: text[i + inserted] });
        return nc;
      } else if (newLen < oldLen) {
        const deleted = oldLen - newLen;
        const nc: EditorChar[] = [];
        for (let i = 0; i < cursorPos; i++) nc.push({ ...prev[i], char: text[i] });
        for (let i = cursorPos + deleted; i < oldLen; i++) nc.push({ ...prev[i], char: text[i - deleted] });
        return nc;
      }
      return prev.map((c, i) => ({ ...c, char: text[i] }));
    });
  }, [readInput]);

  const handleReset = useCallback(() => { setChars([]); resetPool(); clearEditor(); }, [clearEditor]);

  const handleModeSwitch = useCallback((newMode: EditorMode) => {
    const getStyle = newMode === "flyweight" ? getSharedStyle : getCopiedStyle;
    setChars((prev) => prev.map((c) => ({ ...c, style: getStyle(c.style.font, c.style.size, c.style.color) })));
    setMode(newMode);
  }, []);

  return {
    mode, activePreset, changePreset, stats, noFlyweightStats,
    editorRef, handleInput, handleBlur, handleReset, handleModeSwitch,
  };
}
