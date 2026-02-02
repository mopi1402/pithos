/**
 * Key codes for keyboard input detection
 */
export const Keys = {
  CTRL_C: 3,
  ENTER: 13,
  ESCAPE: 27,
  BACKSPACE: 127,
  
  // Letters
  Q: 113,
  Q_UPPER: 81,
  B: 98,
  B_UPPER: 66,
  
  // Arrow key sequence: 27, 91, X
  ARROW_PREFIX_1: 27,
  ARROW_PREFIX_2: 91,
  ARROW_UP: 65,
  ARROW_DOWN: 66,
  ARROW_RIGHT: 67,
  ARROW_LEFT: 68,
} as const;

/**
 * Check if key is an arrow up sequence
 */
export function isArrowUp(key: Buffer): boolean {
  return key[0] === Keys.ARROW_PREFIX_1 && key[1] === Keys.ARROW_PREFIX_2 && key[2] === Keys.ARROW_UP;
}

/**
 * Check if key is an arrow down sequence
 */
export function isArrowDown(key: Buffer): boolean {
  return key[0] === Keys.ARROW_PREFIX_1 && key[1] === Keys.ARROW_PREFIX_2 && key[2] === Keys.ARROW_DOWN;
}

/**
 * Check if key is an arrow left sequence
 */
export function isArrowLeft(key: Buffer): boolean {
  return key[0] === Keys.ARROW_PREFIX_1 && key[1] === Keys.ARROW_PREFIX_2 && key[2] === Keys.ARROW_LEFT;
}

/**
 * Check if key is an arrow right sequence
 */
export function isArrowRight(key: Buffer): boolean {
  return key[0] === Keys.ARROW_PREFIX_1 && key[1] === Keys.ARROW_PREFIX_2 && key[2] === Keys.ARROW_RIGHT;
}

/**
 * Check if key is quit (q or Ctrl+C)
 */
export function isQuit(key: Buffer): boolean {
  return key[0] === Keys.CTRL_C || key[0] === Keys.Q || key[0] === Keys.Q_UPPER;
}

/**
 * Check if key is back (Backspace or Escape only, not arrow keys)
 */
export function isBack(key: Buffer): boolean {
  return key[0] === Keys.BACKSPACE || isEscape(key);
}

/**
 * Check if key is Escape only
 */
export function isEscape(key: Buffer): boolean {
  // Escape alone is just byte 27, arrow keys are 27 + 91 + X
  return key[0] === Keys.ESCAPE && key.length === 1;
}

/**
 * Check if key is Backspace
 */
export function isBackspace(key: Buffer): boolean {
  return key[0] === Keys.BACKSPACE;
}

/**
 * Check if key is a printable character
 */
export function isPrintable(key: Buffer): boolean {
  // Single byte, printable ASCII range (32-126)
  return key.length === 1 && key[0] >= 32 && key[0] <= 126;
}

/**
 * Get the character from a printable key
 */
export function getChar(key: Buffer): string {
  return String.fromCharCode(key[0]);
}

/**
 * Check if key is Enter
 */
export function isEnter(key: Buffer): boolean {
  return key[0] === Keys.ENTER;
}

/**
 * Check if key is Tab (used to toggle options mode)
 */
export function isTab(key: Buffer): boolean {
  return key[0] === 9;
}

/**
 * Check if key is Space (used to toggle checkbox)
 */
export function isSpace(key: Buffer): boolean {
  return key[0] === 32;
}

/**
 * Check if key is Ctrl+V (paste)
 */
export function isPaste(key: Buffer): boolean {
  return key[0] === 22; // Ctrl+V = 0x16
}

/**
 * Check if key is a bracketed paste start sequence
 * Terminals send ESC [ 200 ~ before pasted content
 */
export function isBracketedPasteStart(key: Buffer): boolean {
  return key[0] === 27 && key[1] === 91 && key[2] === 50 && key[3] === 48 && key[4] === 48 && key[5] === 126;
}

/**
 * Check if buffer contains pasted text (multi-byte printable content)
 */
export function isPastedText(key: Buffer): boolean {
  // Multiple printable ASCII characters at once = likely pasted
  if (key.length > 1) {
    for (let i = 0; i < key.length; i++) {
      if (key[i] < 32 || key[i] > 126) return false;
    }
    return true;
  }
  return false;
}
