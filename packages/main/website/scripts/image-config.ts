/**
 * Shared image optimization configuration
 *
 * Centralizes quality settings, emoji pipeline config, and common types
 * used by both the generation scripts and the `<Picture>` component.
 */

// ─── Types ───────────────────────────────────────────────────────

export type ImageFormat = "avif" | "webp" | "png" | "jpg";

export interface QualityConfig {
  /** AVIF quality (0-100) */
  avif: number;
  /** WebP quality (0-100) */
  webp: number;
  /** PNG compression effort (0-10, higher = slower but smaller) */
  png: number;
}

// ─── Quality defaults ────────────────────────────────────────────

export const DEFAULT_QUALITY: QualityConfig = {
  avif: 65,
  webp: 75,
  png: 9,
} as const;

// ─── Emoji pipeline ─────────────────────────────────────────────

export const EMOJI_CONFIG = {
  /** Max CSS display size of emojis (px) */
  maxDisplaySize: 64,
  /** Target density multiplier (2× covers Retina screens) */
  targetDensity: 2,
  /** Output size in px (maxDisplaySize × targetDensity) */
  targetSize: 128,
  /** WebP quality for emoji output (85-90 range) */
  webpQuality: 90,
} as const;
