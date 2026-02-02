//AI_OK Code Review OK by Claude Opus 4.5, 2025-12-16
const LIGATURES: Record<string, string> = {
  // Ligatures classiques
  Œ: "OE",
  œ: "oe",
  Æ: "AE",
  æ: "ae",
  Ĳ: "IJ",
  ĳ: "ij",
  ß: "ss",
  // Caractères nordiques
  Ð: "D",
  ð: "d",
  Þ: "Th",
  þ: "th",
  Ø: "O",
  ø: "o",
  // Caractères d'Europe de l'Est
  Ł: "L",
  ł: "l",
  Đ: "D",
  đ: "d",
  Ħ: "H",
  ħ: "h",
  Ŧ: "T",
  ŧ: "t",
  // Autres
  Ŋ: "N",
  ŋ: "n",
  Ŀ: "L",
  ŀ: "l",
  ĸ: "k",
  ı: "i",
  ſ: "s",
  ŉ: "'n",
};

// Regex pré-compilée pour les ligatures
const LIGATURE_REGEX = new RegExp(`[${Object.keys(LIGATURES).join("")}]`, "g");

/**
 * Removes diacritical marks and converts ligatures to basic Latin letters.
 *
 * @param str - The string to deburr.
 * @returns The deburred string.
 * @since 1.1.0
 *
 * @note Uses NFD normalization. Expands ligatures (œ→oe, ß→ss, æ→ae, Þ→Th, etc.).
 *
 * @performance O(n) time where n is string length. Uses native `normalize()` and object lookup for ligatures.
 *
 * @example
 * ```typescript
 * deburr('café');      // => 'cafe'
 * deburr('Müller');    // => 'Muller'
 * deburr('Straße');    // => 'Strasse'
 * deburr('Œuvre');     // => 'OEuvre'
 * deburr('Þór');       // => 'Thor'
 * deburr('Łódź');      // => 'Lodz'
 * ```
 */
export function deburr(str: string): string {
  // Stryker disable next-line ConditionalExpression: equivalent mutant - empty string normalize/replace returns "" anyway
  if (str.length === 0) return "";

  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f\ufe20-\ufe2f]/g, "")
    .replace(LIGATURE_REGEX, (match) => LIGATURES[match]);
}
