/**
 * ANSI color codes for terminal output
 */
export const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  inverse: '\x1b[7m',
  
  // Foreground colors
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  black: '\x1b[30m',
  
  // Background colors
  bgWhite: '\x1b[47m',
  bgCyan: '\x1b[46m',
  bgOrange: '\x1b[48;2;255;140;0m', // True color orange background
  
  // Cursor control
  hideCursor: '\x1b[?25l',
  showCursor: '\x1b[?25h',
  
  // Alternate screen buffer (no scroll history)
  enterAltScreen: '\x1b[?1049h',
  exitAltScreen: '\x1b[?1049l',
  
  // Screen control
  // \x1b[H = move cursor home, \x1b[2J = clear entire screen, \x1b[3J = clear scrollback
  clear: '\x1b[2J\x1b[H',
  clearFull: '\x1b[2J\x1b[3J\x1b[H', // Also clears scrollback
  home: '\x1b[H', // Just move cursor to top-left without clearing
} as const;

/**
 * Create a true color foreground code (24-bit)
 */
export function fg(hex: string): string {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `\x1b[38;2;${r};${g};${b}m`;
}

/**
 * Create a true color background code (24-bit)
 */
export function bg(hex: string): string {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `\x1b[48;2;${r};${g};${b}m`;
}

/**
 * Create a colored block (2 spaces with background)
 */
export function block(hex: string): string {
  return `${bg(hex)}  ${colors.reset}`;
}
