export type AudioFrame = Uint8Array;

export type Visualizer = (
  ctx: CanvasRenderingContext2D,
  frame: AudioFrame,
  width: number,
  height: number,
  accent: string,
  time: number,
) => void;

export type SourceKey = "track1" | "track2" | "track3";
export type VisualizerKey = "bars" | "particles" | "smear" | "cosmos" | "cover";
