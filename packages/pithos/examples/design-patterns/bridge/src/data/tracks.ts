import { nebulaVisualizer } from "@/lib/visualizers/nebula";
import { silkVisualizer } from "@/lib/visualizers/silk";
import { smearVisualizer } from "@/lib/visualizers/smear";
import { cosmosVisualizer } from "@/lib/visualizers/cosmos";
import { coverVisualizer } from "@/lib/visualizers/sun";
import type { SourceKey, VisualizerKey, Visualizer } from "@/lib/types";

export interface SourceMeta {
  key: SourceKey;
  title: string;
  artist: string;
  filename: string;
  cover: string;
  color: string;
}

export interface VisualizerMeta {
  key: VisualizerKey;
  label: string;
  fn: Visualizer;
}

export const SOURCES: SourceMeta[] = [
  { key: "track1", title: "The Epic Hero", artist: "Keys Of Moon", filename: "track1.mp3", cover: "track1.jpg", color: "#f43f5e" },
  { key: "track2", title: "Ode To The Winners", artist: "MaxKoMusic", filename: "track2.mp3", cover: "track2.jpg", color: "#8b5cf6" },
  { key: "track3", title: "Gaia", artist: "Nova Noma", filename: "track3.mp3", cover: "track3.jpg", color: "#06b6d4" },
];

export const VISUALIZERS: VisualizerMeta[] = [
  { key: "bars", label: "Nebula", fn: nebulaVisualizer },
  { key: "particles", label: "Silk", fn: silkVisualizer },
  { key: "smear", label: "Smear", fn: smearVisualizer },
  { key: "cosmos", label: "Cosmos", fn: cosmosVisualizer },
  { key: "cover", label: "Sun", fn: coverVisualizer },
];
