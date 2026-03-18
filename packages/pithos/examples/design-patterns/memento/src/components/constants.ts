import type { FilterKey } from "@/lib/photoEditor";
import { Sun, Contrast, Droplets, CircleDot, Palette } from "lucide-react";

export const FILTER_ICONS: Record<FilterKey, typeof Sun> = {
  brightness: Sun,
  contrast: Contrast,
  saturation: Droplets,
  blur: CircleDot,
  sepia: Palette,
};
