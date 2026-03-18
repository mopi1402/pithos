import { useEffect } from "react";
import { FileText } from "lucide-react";
import { useMarkdownEditor } from "@/hooks/useMarkdownEditor";
import { useSyncScroll } from "@/hooks/useSyncScroll";
import { PREVIEW_STYLES } from "@/data/previewStyles";
import { PanelHeader } from "./PanelHeader";
import { AstTreeLine } from "./AstTreeLine";
import { TabBar } from "./TabBar";
import { RightPanelToggle } from "./RightPanelToggle";

export function MarkdownPreview() {
  const { source, setSource, tab, setTab, rightPanel, setRightPanel, html, astLines } = useMarkdownEditor();
  const { editorRef, previewRef, onEditorScroll, onPreviewScroll } = useSyncScroll();

  useEffect(() => { editorRef.current?.focus(); }, [editorRef]);

  const editorPanel = (
    <div className="flex flex-col h-full min-h-0">
      <PanelHeader icon={<FileText size={14} />} title="Markdown" />
      <textarea ref={editorRef} value={source} onChange={(e) => setSource(e.target.value)} onScroll={onEditorScroll} spellCheck={false} className="flex-1 min-h-0 resize-none bg-transparent p-3 text-[13px] font-mono leading-relaxed text-zinc-300 placeholder-zinc-600 outline-none" placeholder="Type markdown here..." aria-label="Markdown editor" />
    </div>
  );

  const previewContent = (
    <div ref={previewRef} onScroll={onPreviewScroll} className="flex-1 min-h-0 overflow-auto p-4">
      <style>{PREVIEW_STYLES}</style>
      <div className="md-preview" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );

  const astContent = (
    <div className="flex-1 min-h-0 overflow-auto p-1">
      {astLines.map((line, i) => <AstTreeLine key={i} line={line} />)}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02] shrink-0">
        <svg width="22" height="14" viewBox="0 0 208 128" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="5" width="198" height="118" rx="15" ry="15" fill="none" stroke="#f59e0b" strokeWidth="10" />
          <path d="M30 98V30h20l20 25 20-25h20v68H90V59L70 84 50 59v39H30zm125 0l-30-33h20V30h20v35h20L155 98z" fill="#f59e0b" />
        </svg>
        <span className="text-sm font-semibold text-zinc-200">Markdown Interpreter</span>
        <span className="text-[10px] text-zinc-600 ml-auto font-mono hidden sm:inline">tokenize → parse → evaluate</span>
      </div>

      {/* Mobile tabs */}
      <TabBar active={tab} onChange={setTab} />

      {/* Mobile: single panel */}
      <div className="flex-1 min-h-0 sm:hidden">
        {tab === "editor" && editorPanel}
        {tab === "preview" && <div className="flex flex-col h-full min-h-0">{previewContent}</div>}
        {tab === "ast" && <div className="flex flex-col h-full min-h-0">{astContent}</div>}
      </div>

      {/* Desktop: 2 columns */}
      <div className="hidden sm:flex flex-1 min-h-0">
        <div className="flex-1 min-w-0 border-r border-white/[0.06]">{editorPanel}</div>
        <div className="flex-1 min-w-0 flex flex-col h-full">
          <div className="flex items-center px-3 h-[42px] border-b border-white/[0.06] bg-white/[0.02] shrink-0">
            <RightPanelToggle active={rightPanel} onChange={setRightPanel} />
          </div>
          {rightPanel === "preview" ? previewContent : astContent}
        </div>
      </div>
    </div>
  );
}
