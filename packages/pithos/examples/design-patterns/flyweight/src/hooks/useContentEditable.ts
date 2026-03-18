import { useCallback, useRef, useEffect } from "react";
import type { EditorChar } from "@/lib/types";

/** Manages contentEditable DOM rendering, cursor save/restore */
export function useContentEditable(chars: EditorChar[]) {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedCursorRef = useRef<number | null>(null);

  /** Get cursor offset inside the editor */
  function getCursorOffset(el: HTMLDivElement): number {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return 0;
    const range = sel.getRangeAt(0);
    const preRange = document.createRange();
    preRange.selectNodeContents(el);
    preRange.setEnd(range.startContainer, range.startOffset);
    return preRange.toString().length;
  }

  /** Set cursor at a character offset inside the editor */
  function setCursorOffset(el: HTMLDivElement, offset: number) {
    const sel = window.getSelection();
    if (!sel) return;
    const newRange = document.createRange();
    let remaining = offset;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      const len = node.textContent?.length ?? 0;
      if (remaining <= len) {
        newRange.setStart(node, remaining);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
        return;
      }
      remaining -= len;
      node = walker.nextNode();
    }
  }

  /** Save cursor on blur */
  const handleBlur = useCallback(() => {
    const el = editorRef.current;
    if (el) savedCursorRef.current = getCursorOffset(el);
  }, []);

  /** Restore cursor and focus */
  const restoreFocus = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    if (savedCursorRef.current !== null) setCursorOffset(el, savedCursorRef.current);
  }, []);

  /** Sync DOM spans from chars, preserving cursor */
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const cursorOffset = getCursorOffset(el);
    el.innerHTML = "";
    if (chars.length === 0) return;
    let i = 0;
    while (i < chars.length) {
      const style = chars[i].style;
      let text = "";
      while (i < chars.length && chars[i].style === style) { text += chars[i].char; i++; }
      const span = document.createElement("span");
      span.style.fontFamily = style.font;
      span.style.fontSize = `${style.size}px`;
      span.style.color = style.color;
      span.textContent = text;
      el.appendChild(span);
    }
    if (cursorOffset > 0) {
      try { setCursorOffset(el, cursorOffset); } catch { /* not critical */ }
    }
  }, [chars]);

  /** Read current text + cursor position from the DOM */
  const readInput = useCallback((): { text: string; cursorPos: number } => {
    const el = editorRef.current;
    if (!el) return { text: "", cursorPos: 0 };
    return { text: el.textContent ?? "", cursorPos: getCursorOffset(el) };
  }, []);

  const clearEditor = useCallback(() => {
    if (editorRef.current) editorRef.current.innerHTML = "";
  }, []);

  return { editorRef, handleBlur, restoreFocus, readInput, clearEditor };
}
