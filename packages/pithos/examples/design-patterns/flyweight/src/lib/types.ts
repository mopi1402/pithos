export interface CharStyle {
  font: string;
  size: number;
  color: string;
}

export interface EditorChar {
  char: string;
  style: CharStyle;
  index: number;
}

export interface EditorStats {
  totalChars: number;
  styleObjects: number;
  memoryBytes: number;
  savedPercent: number;
}

export interface StylePreset {
  label: string;
  font: string;
  size: number;
  color: string;
  swatch: string;
}

export type EditorMode = "flyweight" | "no-flyweight";
