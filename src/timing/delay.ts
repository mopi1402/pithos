/**
 * Crée un délai de X millisecondes
 * 
 * @param ms - Délai en millisecondes
 * @returns Promise qui se résout après le délai
 * 
 * @example
 * ```typescript
 * // Attendre 1 seconde
 * await delay(1000);
 * 
 * // Délai dans une animation
 * await delay(500);
 * animate();
 * 
 * // Délai pour éviter le spam
 * await delay(2000);
 * allowNextAction();
 * ```
 */
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));
