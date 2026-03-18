export type FeatureKind = "charging" | "fuel";
export type SourceType = FeatureKind;
export type BBox = { south: number; west: number; north: number; east: number };

export interface MapFeature {
  id: string;
  name: string;
  kind: FeatureKind;
  coords: [lat: number, lng: number];
  meta: Record<string, string | number>;
}

export interface FetchResult {
  features: MapFeature[];
  fallback: boolean;
  cached: boolean;
}
