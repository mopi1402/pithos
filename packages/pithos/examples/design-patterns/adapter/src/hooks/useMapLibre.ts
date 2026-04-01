import { useEffect, useCallback, useRef } from "react";
import maplibregl from "maplibre-gl";
import { SOURCE_CONFIG } from "@/data/sources";
import type { MapFeature, FeatureKind, BBox } from "@/lib/types";

const IGN_STYLE_URL = `${import.meta.env.BASE_URL}styles/ign-custom.json`;
const CLUSTER_SOURCE = "features";
const CLUSTER_LAYER = "clusters";
const CLUSTER_COUNT_LAYER = "cluster-count";
const POINT_LAYER = "unclustered-point";
const POINT_LABEL_LAYER = "unclustered-label";

function toGeoJSON(features: MapFeature[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: features.map((f) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [f.coords[1], f.coords[0]] },
      properties: { id: f.id, name: f.name, kind: f.kind, emoji: SOURCE_CONFIG[f.kind].emoji, symbol: SOURCE_CONFIG[f.kind].symbol, color: SOURCE_CONFIG[f.kind].color, ...f.meta },
    })),
  };
}

export function useMapLibre(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onBoundsChange: (bbox: BBox) => void,
  onPopupChange: (open: boolean) => void,
) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const lastBboxRef = useRef<BBox | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const highlightRef = useRef<maplibregl.Marker | null>(null);

  const openFeaturePopup = useCallback((map: maplibregl.Map, lngLat: [number, number], props: Record<string, unknown>) => {
    const config = SOURCE_CONFIG[props.kind as FeatureKind];
    const metaKeys = Object.keys(props).filter((k) => !["id", "name", "kind", "emoji", "symbol", "color"].includes(k));
    const fmt = (v: string) => v.replace(/\s(\d{5})\b/, '<br>$1');
    const metaRows = metaKeys
      .map((k) => `<div class="popup-row"><span class="popup-row-label">${k}</span><span class="popup-row-value">${fmt(String(props[k]))}</span></div>`)
      .join("");
    const html = `<div class="popup-card"><div class="popup-header" style="border-left:3px solid ${config.color}"><span class="popup-emoji">${config.emoji}</span><div class="popup-title-group"><span class="popup-title">${props.name}</span><span class="popup-badge" style="background:${config.color}18;color:${config.color}">${config.label}</span></div></div><div class="popup-body">${metaRows}</div></div>`;

    popupRef.current?.remove();
    highlightRef.current?.remove();

    const markerWrapper = document.createElement("div");
    markerWrapper.style.zIndex = "2";
    const markerInner = document.createElement("div");
    markerInner.className = "highlight-marker";
    markerInner.style.cssText = `width:24px;height:24px;border-radius:50%;background:${config.color};border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:14px;line-height:1;color:#fff;`;
    markerInner.textContent = config.emoji;
    markerWrapper.appendChild(markerInner);
    const highlight = new maplibregl.Marker({ element: markerWrapper }).setLngLat(lngLat).addTo(map);
    highlight.getElement().style.zIndex = "2";
    highlightRef.current = highlight;

    onPopupChange(true);

    const mapHeight = map.getContainer().clientHeight;
    const isMobileView = mapHeight > 0 && window.innerWidth < 768;

    const popup = new maplibregl.Popup({ offset: 20, maxWidth: "300px", className: "popup-reveal" })
      .setLngLat(lngLat).setHTML(html).addTo(map);
    popupRef.current = popup;
    popup.on("close", () => { onPopupChange(false); highlightRef.current?.remove(); highlightRef.current = null; });

    const popupEl = popup.getElement();
    const popupHeight = popupEl ? popupEl.offsetHeight : 200;
    const offsetY = isMobileView
      ? Math.max(mapHeight * 0.3, popupHeight / 2 + 40)
      : Math.max(90, popupHeight / 2 + 20);
    map.panTo(lngLat, { offset: [0, offsetY], duration: 300 });
  }, [onPopupChange]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: IGN_STYLE_URL,
      center: [2.3522, 48.8566],
      zoom: 11,
      maxZoom: 18,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    const hasBboxChanged = (next: BBox): boolean => {
      const prev = lastBboxRef.current;
      if (!prev) return true;
      const E = 0.001;
      return Math.abs(next.south - prev.south) > E || Math.abs(next.west - prev.west) > E || Math.abs(next.north - prev.north) > E || Math.abs(next.east - prev.east) > E;
    };

    const emitBounds = () => {
      const b = map.getBounds();
      const bbox: BBox = { south: b.getSouth(), west: b.getWest(), north: b.getNorth(), east: b.getEast() };
      if (!hasBboxChanged(bbox)) return;
      lastBboxRef.current = bbox;
      onBoundsChange(bbox);
    };

    map.on("load", () => {
      map.addSource(CLUSTER_SOURCE, { type: "geojson", data: { type: "FeatureCollection", features: [] }, cluster: true, clusterMaxZoom: 14, clusterRadius: 120 });
      map.addLayer({ id: CLUSTER_LAYER, type: "circle", source: CLUSTER_SOURCE, filter: ["has", "point_count"], paint: { "circle-color": "#4a7fd4", "circle-radius": ["step", ["get", "point_count"], 18, 20, 24, 50, 30], "circle-stroke-width": 2, "circle-stroke-color": "#fff" } });
      map.addLayer({ id: CLUSTER_COUNT_LAYER, type: "symbol", source: CLUSTER_SOURCE, filter: ["has", "point_count"], layout: { "text-field": "{point_count_abbreviated}", "text-font": ["Source Sans Pro Regular"], "text-size": 13 }, paint: { "text-color": "#ffffff" } });
      map.addLayer({ id: POINT_LAYER, type: "circle", source: CLUSTER_SOURCE, filter: ["!", ["has", "point_count"]], paint: { "circle-color": ["get", "color"], "circle-radius": 18, "circle-stroke-width": 2, "circle-stroke-color": "#fff" } });
      map.addLayer({ id: POINT_LABEL_LAYER, type: "symbol", source: CLUSTER_SOURCE, filter: ["!", ["has", "point_count"]], layout: { "text-field": ["get", "emoji"], "text-size": 24, "text-allow-overlap": true, "text-ignore-placement": true }, paint: { "text-color": "#ffffff" } });

      map.on("click", CLUSTER_LAYER, (e) => {
        const feature = e.features?.[0];
        if (!feature || feature.geometry.type !== "Point") return;
        const coords = feature.geometry.coordinates as [number, number];
        const clusterId = typeof feature.properties.cluster_id === "string" ? Number(feature.properties.cluster_id) : feature.properties.cluster_id;
        (map.getSource(CLUSTER_SOURCE) as maplibregl.GeoJSONSource).getClusterExpansionZoom(clusterId).then((z) => map.flyTo({ center: coords, zoom: z + 0.5, speed: 1.5 }));
      });

      map.on("click", POINT_LAYER, (e) => {
        const feature = e.features?.[0];
        if (!feature || feature.geometry.type !== "Point") return;
        openFeaturePopup(map, feature.geometry.coordinates as [number, number], feature.properties);
      });

      map.on("mouseenter", CLUSTER_LAYER, () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", CLUSTER_LAYER, () => { map.getCanvas().style.cursor = ""; });
      map.on("mouseenter", POINT_LAYER, () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", POINT_LAYER, () => { map.getCanvas().style.cursor = ""; });

      emitBounds();
    });

    let debounceTimer: ReturnType<typeof setTimeout>;
    map.on("moveend", () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(emitBounds, 400); });
    mapRef.current = map;

    return () => { clearTimeout(debounceTimer); popupRef.current?.remove(); highlightRef.current?.remove(); map.remove(); mapRef.current = null; };
  }, [containerRef, onBoundsChange, openFeaturePopup]);

  const updateMarkers = useCallback((features: MapFeature[]) => {
    const source = mapRef.current?.getSource(CLUSTER_SOURCE) as maplibregl.GeoJSONSource | undefined;
    source?.setData(toGeoJSON(features));
  }, []);

  const flyToFeature = useCallback((feature: MapFeature) => {
    const map = mapRef.current;
    if (!map) return;
    const lngLat: [number, number] = [feature.coords[1], feature.coords[0]];
    const props: Record<string, unknown> = { id: feature.id, name: feature.name, kind: feature.kind, emoji: SOURCE_CONFIG[feature.kind].emoji, symbol: SOURCE_CONFIG[feature.kind].symbol, color: SOURCE_CONFIG[feature.kind].color, ...feature.meta };
    map.flyTo({ center: lngLat, zoom: Math.max(map.getZoom(), 14), speed: 1.5 });
    map.once("moveend", () => openFeaturePopup(map, lngLat, props));
  }, [openFeaturePopup]);

  return { updateMarkers, flyToFeature };
}
