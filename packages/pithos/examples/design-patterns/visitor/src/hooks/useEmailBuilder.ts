import { useState, useCallback } from "react";
import { DEFAULT_BLOCKS } from "@/data/blocks";
import type { EmailBlock, VisitorKey } from "@/lib/types";

export interface IdentifiedBlock {
  id: number;
  block: EmailBlock;
}

let globalId = 0;
function nextId(): number { return ++globalId; }

export function useEmailBuilder() {
  const [items, setItems] = useState<IdentifiedBlock[]>(() =>
    DEFAULT_BLOCKS.map((b) => ({ id: nextId(), block: b })),
  );
  const [visitor, setVisitor] = useState<VisitorKey>("preview");
  const [mobileTab, setMobileTab] = useState<"blocks" | "output">("blocks");

  const blocks = items.map((i) => i.block);

  const addBlock = useCallback((block: EmailBlock) => {
    setItems((prev) => [...prev, { id: nextId(), block }]);
  }, []);

  const removeBlock = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const reorderBlock = useCallback((fromIndex: number, toIndex: number) => {
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const moveBlock = useCallback((index: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const resetBlocks = useCallback(() => {
    setItems(DEFAULT_BLOCKS.map((b) => ({ id: nextId(), block: b })));
  }, []);

  return {
    items,
    blocks,
    visitor,
    setVisitor,
    mobileTab,
    setMobileTab,
    addBlock,
    removeBlock,
    reorderBlock,
    moveBlock,
    resetBlocks,
  };
}
