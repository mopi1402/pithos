import { useEffect, useCallback, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useAdapterMap } from "@/hooks/useAdapterMap";
import { useMapLibre } from "@/hooks/useMapLibre";
import { SOURCES, SOURCE_CONFIG } from "@/data/sources";
import { RoadLogo } from "./icons";
import { FallbackBanner } from "./FallbackBanner";
import { SourceToggle } from "./SourceToggle";
import { FeatureList } from "./FeatureList";
import type { SourceType } from "@/lib/types";
import "maplibre-gl/dist/maplibre-gl.css";

export function AdapterMap() {
  const state = useAdapterMap();
  const {
    charging, fuels, fallback, loadingCharging, loadingFuel,
    activeSources, toggleSource, visibleFeatures,
    mobileTab, setMobileTab, popupOpen, setPopupOpen,
    listOpen, setListOpen, listTab, setListTab,
    handleBoundsChange,
  } = state;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapContainerMobileRef = useRef<HTMLDivElement>(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const activeContainerRef = isMobile ? mapContainerMobileRef : mapContainerRef;
  const { updateMarkers, flyToFeature } = useMapLibre(activeContainerRef, handleBoundsChange, setPopupOpen);

  useEffect(() => {
    updateMarkers(visibleFeatures);
  }, [charging, fuels, activeSources, updateMarkers, visibleFeatures]);

  const handleFeatureClick = useCallback((f: Parameters<typeof flyToFeature>[0]) => {
    setListOpen(false);
    setMobileTab("map");
    flyToFeature(f);
  }, [flyToFeature, setListOpen, setMobileTab]);

  return (
    <>
      {/* Mobile */}
      <div className="flex flex-col h-screen md:hidden" style={{ background: "#1e1e2e" }}>
        <div className="shrink-0 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #27509b 100%)" }}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-[135deg]" />
            <div className="absolute top-8 -right-6 w-32 h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent rotate-[135deg]" />
          </div>
          <div className="relative px-4 pt-4 pb-3 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <RoadLogo size={20} />
              </div>
              <div>
                <h1 className="text-[15px] font-bold text-white tracking-tight">ViaMikeline</h1>
                <p className="text-[10px] text-white/50">2 APIs → 1 model via <code className="text-[#7db4f0] font-mono">adapt()</code></p>
              </div>
            </div>
            <FallbackBanner fallback={fallback} />
            <div className="flex gap-2">
              {SOURCES.map((s) => (
                <SourceToggle key={s} source={s} active={activeSources.has(s)} count={s === "charging" ? charging.length : fuels.length} loading={s === "charging" ? loadingCharging : loadingFuel} onToggle={() => toggleSource(s)} />
              ))}
            </div>
          </div>
          <div className="relative flex">
            <button onClick={() => setMobileTab("map")} className={`flex-1 py-2.5 text-xs font-semibold tracking-wide transition-all ${mobileTab === "map" ? "text-white border-b-[3px] border-[#7db4f0]" : "text-white/40"}`}>🗺️ Map</button>
            <button onClick={() => setMobileTab("list")} className={`flex-1 py-2.5 text-xs font-semibold tracking-wide transition-all ${mobileTab === "list" ? "text-white border-b-[3px] border-[#7db4f0]" : "text-white/40"}`}>📋 List</button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full transition-transform duration-300 ease-out" style={{ transform: mobileTab === "list" ? "translateX(-50%)" : "translateX(0)", width: "200%" }}>
            <div className="w-1/2 h-full relative">
              <div ref={mapContainerMobileRef} className="h-full w-full" style={{ background: "repeating-linear-gradient(135deg, #f5f5f5, #f5f5f5 5px, #eee 5px 10px)" }} />
              <div className={`absolute inset-0 bg-black/60 pointer-events-none z-[1] transition-opacity duration-300 ${popupOpen ? "opacity-100" : "opacity-0"}`} />
            </div>
            <div className="w-1/2 h-full overflow-auto px-3 py-2">
              <FeatureList features={visibleFeatures} onFeatureClick={handleFeatureClick} />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex h-screen relative" style={{ background: "#1e1e2e" }}>
        <div ref={mapContainerRef} className="absolute inset-0" style={{ background: "repeating-linear-gradient(135deg, #f5f5f5, #f5f5f5 5px, #eee 5px 10px)" }} />
        <div className={`absolute inset-0 bg-black/60 pointer-events-none z-[1] transition-opacity duration-300 ${popupOpen ? "opacity-100" : "opacity-0"}`} />

        {/* Top-left controls */}
        <div className="absolute top-4 left-4 z-[2]">
          <div className="flex flex-col transition-all duration-300 ease-out" style={{ gap: listOpen ? "0px" : "8px", width: "320px" }}>
            <button onClick={() => setListOpen((v) => !v)} className="flex items-center gap-2 px-3 py-2.5 text-[12px] font-medium text-white transition-all duration-300 ease-out" style={{ background: "rgba(15, 23, 42, 0.92)", backdropFilter: "blur(12px)", boxShadow: listOpen ? "none" : "0 8px 32px rgba(0,0,0,0.3)", borderRadius: listOpen ? "16px 16px 0 0" : "14px", width: listOpen ? "320px" : "130px" }}>
              <svg className={`w-4 h-4 transition-transform duration-300 ${listOpen ? "rotate-90" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
              <span>List</span>
              <span className="min-w-[24px] h-5 px-1.5 flex items-center justify-center rounded-full text-[10px] font-mono text-white tabular-nums" style={{ background: "#4a7fd4" }}>{visibleFeatures.length}</span>
              <span onClick={(e) => { e.stopPropagation(); setListOpen(false); }} className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all duration-300" style={{ opacity: listOpen ? 1 : 0, pointerEvents: listOpen ? "auto" : "none" }}>✕</span>
            </button>

            <div className="flex transition-all duration-300 ease-out" style={{ gap: listOpen ? "0px" : "8px" }}>
              {SOURCES.map((s: SourceType) => {
                const cfg = SOURCE_CONFIG[s];
                const count = s === "charging" ? charging.length : fuels.length;
                const isLoading = s === "charging" ? loadingCharging : loadingFuel;
                const isActive = activeSources.has(s);
                const isSelectedTab = listTab === s;
                return (
                  <button key={s} onClick={() => { if (listOpen) setListTab(s); else toggleSource(s); }} className="flex-1 flex items-center justify-center gap-1.5 text-[12px] font-medium transition-all duration-300 ease-out" style={{ padding: listOpen ? "10px 0" : "8px 12px", background: "rgba(15, 23, 42, 0.92)", backdropFilter: "blur(12px)", boxShadow: listOpen ? "none" : "0 8px 32px rgba(0,0,0,0.3)", borderRadius: listOpen ? "0" : "14px", borderBottom: listOpen && isSelectedTab ? `3px solid ${cfg.color}` : "3px solid transparent", color: listOpen ? (isSelectedTab ? "#fff" : "rgba(255,255,255,0.4)") : (isActive ? "#fff" : "rgba(255,255,255,0.4)") }}>
                    <span>{cfg.emoji}</span><span>{cfg.label}</span>
                    <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-[10px] font-mono text-white tabular-nums" style={{ background: cfg.color }}>{isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : count}</span>
                  </button>
                );
              })}
            </div>

            <div className="transition-all duration-300 ease-out overflow-hidden" style={{ maxHeight: listOpen ? "calc(100vh - 160px)" : "0px", opacity: listOpen ? 1 : 0, background: "rgba(15, 23, 42, 0.92)", backdropFilter: "blur(12px)", borderRadius: listOpen ? "0 0 16px 16px" : "0", borderTop: listOpen ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
              <div className="overflow-auto px-3 pb-3" style={{ maxHeight: "calc(100vh - 180px)" }}>
                <FeatureList features={listTab === "charging" ? charging : fuels} onFeatureClick={handleFeatureClick} />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[2] hidden lg:block">
          <div className="rounded-full px-4 py-2 backdrop-blur-md shadow-lg text-[11px] text-white/70" style={{ background: "rgba(15, 23, 42, 0.75)" }}>
            <code className="text-[#7db4f0]">adapt()</code> normalizes IRVE + fuel APIs → uniform <code className="text-[#7db4f0]">MapFeature</code>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 z-[2]">
          <div className="rounded-xl px-4 py-2.5 backdrop-blur-md shadow-lg flex items-center gap-3" style={{ background: "rgba(15, 23, 42, 0.85)" }}>
            <RoadLogo size={24} />
            <span className="w-px h-8 bg-white/20 shrink-0" />
            <div>
              <h1 className="text-[14px] font-bold text-white tracking-tight">ViaMikeline</h1>
              <p className="text-[10px] text-white/50 mt-0.5"><code className="text-[#7db4f0] font-mono">adapt()</code> normalizes 2 APIs → 1 <code className="text-[#7db4f0] font-mono">MapFeature</code></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
