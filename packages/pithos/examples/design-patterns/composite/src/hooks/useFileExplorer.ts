import { useState, useCallback } from "react";
import { createInitialTree } from "@/data/initial-tree";
import { computeSize, countFiles, countFolders, traceFold } from "@/lib/composite";
import { addFileToTree } from "@/lib/tree-ops";

export function useFileExplorer() {
  const [tree, setTree] = useState(createInitialTree);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [mobileTab, setMobileTab] = useState<"explorer" | "fold">("explorer");

  const totalSize = computeSize(tree);
  const fileCount = countFiles(tree);
  const folderCount = countFolders(tree);
  const foldSteps = traceFold(tree);

  const handleAddFile = useCallback((folderPath: string[], name: string, size: number): boolean => {
    const result = addFileToTree(tree, folderPath.slice(1), { name, size });
    if (!result) return false;
    setTree(result);
    setHighlightedNode(name);
    setTimeout(() => setHighlightedNode(null), 1500);
    return true;
  }, [tree]);

  const handleReset = useCallback(() => {
    setTree(createInitialTree());
    setHighlightedNode(null);
  }, []);

  const closeModal = useCallback(() => {
    setModalClosing(true);
    setTimeout(() => { setShowAddModal(false); setModalClosing(false); }, 200);
  }, []);

  return {
    tree, highlightedNode, totalSize, fileCount, folderCount, foldSteps,
    showAddModal, setShowAddModal, modalClosing, closeModal,
    mobileTab, setMobileTab,
    handleAddFile, handleReset,
  };
}
