import { useState, useCallback } from "react";
import { DEFAULT_BLOCKS } from "@/data/blocks";
import type { EmailBlock, VisitorKey } from "@/lib/types";

export function useEmailBuilder() {
  const [blocks, setBlocks] = useState<EmailBlock[]>(DEFAULT_BLOCKS);
  const [visitor, setVisitor] = useState<VisitorKey>("preview");
  const [mobileTab, setMobileTab] = useState<"blocks" | "output">("blocks");

  const addBlock = useCallback((block: EmailBlock) => {
    setBlocks((prev) => [...prev, block]);
  }, []);

  const removeBlock = useCallback((index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const reorderBlock = useCallback((fromIndex: number, toIndex: number) => {
    setBlocks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const moveBlock = useCallback((index: number, dir: -1 | 1) => {
    setBlocks((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const resetBlocks = useCallback(() => {
    setBlocks(DEFAULT_BLOCKS);
  }, []);

  return {
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
