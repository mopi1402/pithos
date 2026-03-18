import { useState, useCallback, useRef } from "react";
import { fetchCharging, fetchFuels } from "@/lib/cache";
import { SOURCES } from "@/data/sources";
import type { MapFeature, SourceType, FeatureKind, BBox } from "@/lib/types";

export function useAdapterMap() {
  const [charging, setCharging] = useState<MapFeature[]>([]);
  const [fuels, setFuels] = useState<MapFeature[]>([]);
  const [fallback, setFallback] = useState({ charging: false, fuel: false });
  const [loadingCharging, setLoadingCharging] = useState(false);
  const [loadingFuel, setLoadingFuel] = useState(false);
  const [activeSources, setActiveSources] = useState<Set<SourceType>>(new Set(SOURCES));
  const [mobileTab, setMobileTab] = useState<"map" | "list">("map");
  const [popupOpen, setPopupOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [listTab, setListTab] = useState<FeatureKind>("charging");
  const fetchRef = useRef(0);

  const handleBoundsChange = useCallback((bbox: BBox) => {
    const id = ++fetchRef.current;
    setLoadingCharging(true);
    fetchCharging(bbox).then((result) => {
      if (id !== fetchRef.current) return;
      setCharging(result.features);
      setFallback((prev) => ({ ...prev, charging: result.fallback }));
      setLoadingCharging(false);
    });
    setLoadingFuel(true);
    fetchFuels(bbox).then((result) => {
      if (id !== fetchRef.current) return;
      setFuels(result.features);
      setFallback((prev) => ({ ...prev, fuel: result.fallback }));
      setLoadingFuel(false);
    });
  }, []);

  const toggleSource = useCallback((source: SourceType) => {
    setActiveSources((prev) => {
      const next = new Set(prev);
      if (next.has(source)) next.delete(source);
      else next.add(source);
      return next;
    });
  }, []);

  const visibleFeatures: MapFeature[] = [
    ...(activeSources.has("charging") ? charging : []),
    ...(activeSources.has("fuel") ? fuels : []),
  ];

  return {
    charging, fuels, fallback, loadingCharging, loadingFuel,
    activeSources, toggleSource, visibleFeatures,
    mobileTab, setMobileTab, popupOpen, setPopupOpen,
    listOpen, setListOpen, listTab, setListTab,
    handleBoundsChange,
  };
}
