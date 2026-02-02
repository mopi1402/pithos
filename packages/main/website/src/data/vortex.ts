import { VortexConfig } from "../types/vortex";

const speed = 0.5;
export const VORTEX_CONFIGS: VortexConfig[] = [
  {
    numLetters: 500,
    baseRadius: 100,
    radiusVariation: 400,
    baseDuration: 60 / speed,
    durationVariation: 4,
    baseOpacity: 0.05,
    opacityVariation: 0.08,
  },
  {
    numLetters: 300,
    baseRadius: 250,
    radiusVariation: 300,
    baseDuration: 52 / speed,
    durationVariation: 2,
    baseOpacity: 0.005,
    opacityVariation: 0.75,
  },
  {
    numLetters: 30,
    baseRadius: 420,
    radiusVariation: 80,
    baseDuration: 40 / speed,
    durationVariation: 8,
    baseOpacity: 0.02,
    opacityVariation: 0.05,
  },
  {
    numLetters: 300,
    baseRadius: 680,
    radiusVariation: 500,
    baseDuration: 58 / speed,
    durationVariation: 6,
    baseOpacity: 0.08,
    opacityVariation: 0.5,
  },
];
