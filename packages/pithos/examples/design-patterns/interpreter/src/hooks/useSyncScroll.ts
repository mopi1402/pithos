import { useRef, useCallback } from "react";

export function useSyncScroll() {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const scrollingRef = useRef<"editor" | "preview" | null>(null);

  const getScrollRatio = (el: HTMLElement): number => {
    const max = el.scrollHeight - el.clientHeight;
    return max > 0 ? el.scrollTop / max : 0;
  };

  const setScrollRatio = (el: HTMLElement, ratio: number) => {
    el.scrollTop = ratio * (el.scrollHeight - el.clientHeight);
  };

  const onEditorScroll = useCallback(() => {
    if (scrollingRef.current === "preview") return;
    scrollingRef.current = "editor";
    const editor = editorRef.current;
    const preview = previewRef.current;
    if (editor && preview) setScrollRatio(preview, getScrollRatio(editor));
    requestAnimationFrame(() => { scrollingRef.current = null; });
  }, []);

  const onPreviewScroll = useCallback(() => {
    if (scrollingRef.current === "editor") return;
    scrollingRef.current = "preview";
    const editor = editorRef.current;
    const preview = previewRef.current;
    if (editor && preview) setScrollRatio(editor, getScrollRatio(preview));
    requestAnimationFrame(() => { scrollingRef.current = null; });
  }, []);

  return { editorRef, previewRef, onEditorScroll, onPreviewScroll };
}
