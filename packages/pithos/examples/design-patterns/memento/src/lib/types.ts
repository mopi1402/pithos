export interface FilterState {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sepia: number;
}

export interface PhotoState extends FilterState {
  thumbnail: string;
}

export type FilterKey = keyof FilterState;

export interface FilterDef {
  key: FilterKey;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  color: string;
}
