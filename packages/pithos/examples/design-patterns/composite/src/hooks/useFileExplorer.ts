import { useState, useCallback, useRef, useEffect } from "react";
import { createInitialTree } from "@/data/initial-tree";
import { computeSize, countFiles, countFolders, traceFold } from "@/lib/composite";
import { addFileToTree } from "@/lib/tree-ops";

export function useFileExplorer() {
  const [tree, setTree] = useState(createInitialTree);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [mobileTab, setMobileTab] = useState<"explorer" | "fold">("explorer");
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const modalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalSize = computeSize(tree);
  const fileCount = countFiles(tree);
  const folderCount = countFolders(tree);
  const foldSteps = traceFold(tree);

  const handleAddFile = useCallback((folderPath: string[], name: string, size: number): boolean => {
    const result = addFileToTree(tree, folderPath.slice(1), { name, size });
    if (!result) return false;
    setTree(result);
    setHighlightedNode(name);
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    highlightTimerRef.current = setTimeout(() => setHighlightedNode(null), 1500);
    return true;
  }, [tree]);

  const handleReset = useCallback(() => {
    setTree(createInitialTree());
    setHighlightedNode(null);
  }, []);

  const closeModal = useCallback(() => {
    setModalClosing(true);
    if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
    modalTimerRef.current = setTimeout(() => { setShowAddModal(false); setModalClosing(false); }, 200);
  }, []);

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
      if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
    };
  }, []);

  return {
    tree, highlightedNode, totalSize, fileCount, folderCount, foldSteps,
    showAddModal, setShowAddModal, modalClosing, closeModal,
    mobileTab, setMobileTab,
    handleAddFile, handleReset,
  };
}
