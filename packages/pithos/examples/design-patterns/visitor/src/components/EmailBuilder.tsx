import { useEmailBuilder } from "@/hooks/useEmailBuilder";
import { VISITORS } from "@/data/blocks";
import { BlockPalette } from "./BlockPalette";
import { BlockRow } from "./BlockRow";
import { VisitorOutput } from "./VisitorOutput";

export function EmailBuilder() {
  const {
    items, blocks, visitor, setVisitor, mobileTab, setMobileTab,
    addBlock, removeBlock, reorderBlock, moveBlock, resetBlocks,
  } = useEmailBuilder();

  const blockList = (
    <div className="divide-y divide-slate-50 overflow-y-auto flex-1">
      {items.length === 0 ? (
        <div className="p-6 text-center text-sm text-slate-400">Add blocks from the palette above</div>
      ) : (
        items.map((item, i) => (
          <BlockRow key={item.id} block={item.block} index={i} total={items.length}
            onRemove={() => removeBlock(i)} onReorder={reorderBlock} onMove={moveBlock} />
        ))
      )}
    </div>
  );

  const visitorTabs = (
    <div className="flex items-center gap-1 overflow-x-auto">
      {VISITORS.map((v) => (
        <button key={v.key} onClick={() => setVisitor(v.key)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
            visitor === v.key ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"
          }`}>
          <span className="text-sm">{v.emoji}</span>
          <span className="hidden sm:inline">{v.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-6 px-2 sm:px-4 h-screen flex flex-col">
      <div className="space-y-4 lg:space-y-5 flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="text-center space-y-1 shrink-0">
          <h1 className="text-2xl font-bold text-slate-900">Email Builder</h1>
          <p className="text-sm text-slate-500">Same blocks, different visitors. Switch tabs to see each rendering.</p>
        </div>

        {/* Mobile tab switcher */}
        <div className="flex justify-center lg:hidden shrink-0">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 shadow-inner">
            <button onClick={() => setMobileTab("blocks")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${mobileTab === "blocks" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              Blocks ({blocks.length})
            </button>
            <button onClick={() => setMobileTab("output")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${mobileTab === "output" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              Output
            </button>
          </div>
        </div>

        {/* Mobile: one panel at a time */}
        <div className="lg:hidden flex-1 flex flex-col min-h-0 space-y-3">
          {mobileTab === "blocks" ? (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3">
                <BlockPalette onAdd={addBlock} onReset={resetBlocks} />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-0">
                <div className="px-4 py-2.5 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex items-center justify-between shrink-0">
                  <span className="text-sm font-semibold text-slate-700">Blocks</span>
                  <span className="text-[10px] text-slate-400 tabular-nums">{blocks.length} blocks</span>
                </div>
                {blockList}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-0">
              <div className="px-2 py-2 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 shrink-0">
                {visitorTabs}
              </div>
              <div className="overflow-y-auto flex-1">
                <VisitorOutput visitor={visitor} blocks={blocks} />
              </div>
            </div>
          )}
        </div>

        {/* Desktop: palette + two panels */}
        <div className="hidden lg:flex lg:flex-col lg:flex-1 lg:min-h-0 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 shrink-0">
            <BlockPalette onAdd={addBlock} onReset={resetBlocks} showLabels />
          </div>
          <div className="grid grid-cols-2 flex-1 min-h-0 border border-slate-200 rounded-xl overflow-hidden">
            {/* Block list */}
            <div className="overflow-hidden flex flex-col min-h-0 max-h-full border-r border-slate-200">
              <div className="h-[50px] px-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex items-center justify-between shrink-0">
                <span className="text-sm font-semibold text-slate-700">Blocks</span>
                <span className="text-[10px] text-slate-400 tabular-nums">{blocks.length} blocks</span>
              </div>
              <div className="divide-y divide-slate-50 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="p-6 text-center text-sm text-slate-400">Add blocks from the palette above</div>
                ) : (
                  items.map((item, i) => (
                    <BlockRow key={item.id} block={item.block} index={i} total={items.length}
                      onRemove={() => removeBlock(i)} onReorder={reorderBlock} onMove={moveBlock} />
                  ))
                )}
              </div>
            </div>
            {/* Visitor output */}
            <div className="overflow-hidden flex flex-col min-h-0 max-h-full">
              <div className="h-[50px] px-2 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 flex items-center shrink-0">
                {visitorTabs}
              </div>
              <div className="overflow-y-auto flex-1">
                <VisitorOutput visitor={visitor} blocks={blocks} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
