/**
 * Font subsetting configuration
 *
 * Defines which characters to keep when subsetting fonts.
 * The subset script uses pyftsubset to strip unused glyphs,
 * producing a minimal woff2 for self-hosting.
 *
 * To update: add any new characters used with --greek-font
 * in the codebase, then re-run the font generation script.
 */

// ─── Latin characters ────────────────────────────────────────────
// Used in: Pithos, Arkhe, Kanon, Zygos, Sphalma, Taphos, Modules,
// KeyFigures, 404 page, MarbleQuote, NotFound button labels

const LATIN = [
  // Uppercase
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  // Lowercase
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
  "p", "r", "s", "t", "u", "v", "w", "x", "y", "z",
].join("");

// ─── Greek characters ────────────────────────────────────────────
// Used in: VortexCanvas (animated background)

const GREEK = [
  // Lowercase
  "α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ",
  "ν", "ξ", "ο", "π", "ρ", "σ", "τ", "υ", "φ", "χ", "ψ", "ω",
  // Uppercase
  "Α", "Β", "Γ", "Δ", "Ε", "Ζ", "Η", "Θ", "Λ", "Π", "Σ", "Φ", "Ψ", "Ω",
].join("");

// ─── Numbers & symbols ──────────────────────────────────────────
// Used in: KeyFigures (11.0×, -89%, 100%), 404 page

const NUMBERS_SYMBOLS = "0123456789×%-.,'?! ";

/** All characters to keep in the subset */
export const SUBSET_CHARS = LATIN + GREEK + NUMBERS_SYMBOLS;

/** Font definitions for subsetting */
export const FONT_CONFIG = {
  source: "assets/fonts/CormorantGaramond-Bold.ttf",
  output: "static/fonts/CormorantGaramond-Bold.subset.woff2",
  family: "Cormorant Garamond",
  weight: 700,
  display: "swap" as const,
} as const;
