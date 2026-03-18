import { useState, useRef, useCallback, useEffect } from "react";
import type { Snapshot } from "@pithos/core/eidos/memento/memento";
import {
  type FilterState,
  type PhotoState,
  type FilterKey,
  DEFAULT_FILTERS,
  SAMPLE_IMAGE,
  loadImageToCanvas,
  renderThumbnail,
  createPhotoHistory,
  isDefault,
} from "@/lib/photoEditor";

export function usePhotoEditor() {
  const sourceRef = useRef<HTMLCanvasElement | null>(null);
  const sourceReady = useRef(false);
  const historyRef = useRef<ReturnType<typeof createPhotoHistory> | null>(null);

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [snapshots, setSnapshots] = useState<ReadonlyArray<Snapshot<PhotoState>>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [pendingFilter, setPendingFilter] = useState<{ key: FilterKey; value: number } | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  /** Sync all React state from the history manager. */
  const syncAndClearPending = useCallback(() => {
    const h = historyRef.current;
    if (!h) return;
    const snaps = h.history();
    setSnapshots(snaps);
    setActiveIndex(snaps.length - 1);
    setCanUndo(h.canUndo());
    setCanRedo(h.canRedo());
    setFilters(h.current());
    setPendingFilter(null);
  }, []);

  /** Run a history action then sync. */
  const withSync = useCallback(
    (action: () => void) => () => {
      action();
      syncAndClearPending();
    },
    [syncAndClearPending],
  );

  useEffect(() => {
    const canvas = sourceRef.current;
    if (!canvas || sourceReady.current) return;
    sourceReady.current = true;
    loadImageToCanvas(canvas, SAMPLE_IMAGE).then(() => {
      const thumb = renderThumbnail(canvas, DEFAULT_FILTERS);
      historyRef.current = createPhotoHistory({ ...DEFAULT_FILTERS, thumbnail: thumb });
      syncAndClearPending();
      setImageLoaded(true);
    });
  }, [syncAndClearPending]);

  const commitFilters = useCallback((next: FilterState) => {
    const h = historyRef.current;
    const canvas = sourceRef.current;
    if (!h || !canvas) return;
    h.push({ ...next, thumbnail: renderThumbnail(canvas, next) });
    syncAndClearPending();
  }, [syncAndClearPending]);

  const handleSliderChange = useCallback((key: FilterKey, value: number) => {
    setPendingFilter({ key, value });
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSliderCommit = useCallback(() => {
    if (!pendingFilter) return;
    commitFilters({ ...filters });
  }, [pendingFilter, filters, commitFilters]);

  const handleUndo = withSync(() => historyRef.current?.undo());
  const handleRedo = withSync(() => historyRef.current?.redo());
  const handleClear = withSync(() => historyRef.current?.clear());

  const handleJumpTo = useCallback((index: number) => {
    const h = historyRef.current;
    if (!h) return;
    const snaps = h.history();
    if (index < 0 || index >= snaps.length) return;
    const currentPos = snaps.length - 1;
    for (let i = 0; i < currentPos - index; i++) h.undo();
    syncAndClearPending();
  }, [syncAndClearPending]);

  return {
    sourceRef,
    filters,
    snapshots,
    activeIndex,
    canUndo,
    canRedo,
    imageLoaded,
    isFiltersDefault: isDefault(filters),
    handleSliderChange,
    handleSliderCommit,
    handleUndo,
    handleRedo,
    handleClear,
    handleJumpTo,
  };
}
