import { colors, block, fg, bg } from '../common/colors.js';

const c = colors;

// Logo colors
const PITHOS_TEXT = fg('c9a962');
const PITHOS_SHINE_1 = fg('d4b872'); // Slight shine
const PITHOS_SHINE_2 = fg('e8d090'); // Medium shine
const PITHOS_SHINE_3 = fg('fff5d4'); // Bright shine (center)
const GRAY_TEXT = fg('666666'); // dim gray
const GRAY_SHINE_1 = fg('888888'); // slight shine
const GRAY_SHINE_2 = fg('aaaaaa'); // medium shine  
const GRAY_SHINE_3 = fg('cccccc'); // brightest
const DARK_ORANGE = 'f26e16';
const LIGHT_ORANGE = 'fc8e38';
const DARK_BROWN = '2c1300';
const LIGHT_BROWN = '481f00';

// PITHOS ASCII art lines (just the text part)
const PITHOS_LINES = [
  '██████╗ ██╗████████╗██╗  ██╗ █████╗ ███████╗',
  '██╔══██╗██║╚══██╔══╝██║  ██║██╔══██╗██╔════╝',
  '██████╔╝██║   ██║   ███████║██║  ██║███████╗',
  '██╔═══╝ ██║   ██║   ██╔══██║██║  ██║╚════██║',
  '██║     ██║   ██║   ██║  ██║╚█████╔╝███████║',
  '╚═╝     ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚════╝ ╚══════╝',
];

const SUBTITLE_LINE = 'A comprehensive TypeScript utility library';
const COPYRIGHT_LINE = `(C) Copyright ${new Date().getFullYear()}, Pierre Moati`;

const PITHOS_WIDTH = PITHOS_LINES[0].length;

/**
 * Render a PITHOS line with gradient shimmer effect at given position
 */
function renderShimmerLine(line: string, shimmerPos: number): string {
  const r = c.reset;
  const normal = PITHOS_TEXT;
  
  // No shimmer active
  if (shimmerPos < -3 || shimmerPos >= line.length + 4) {
    return `${normal}${line}${r}`;
  }
  
  // Build the line with gradient shimmer (7 chars wide)
  let result = '';
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const dist = i - shimmerPos;
    
    let color = normal;
    if (dist >= -3 && dist <= 3) {
      if (dist === 0) {
        color = PITHOS_SHINE_3; // Center - brightest
      } else if (dist === -1 || dist === 1) {
        color = PITHOS_SHINE_2; // Near center
      } else if (dist === -2 || dist === 2) {
        color = PITHOS_SHINE_1; // Edge
      } else {
        color = PITHOS_SHINE_1; // Outer edge
      }
    }
    result += `${color}${char}${r}`;
  }
  return result;
}

/**
 * Render gray text with shimmer effect
 */
function renderGrayShimmerLine(line: string, shimmerPos: number): string {
  const r = c.reset;
  const normal = GRAY_TEXT;
  
  // No shimmer active
  if (shimmerPos < -3 || shimmerPos >= line.length + 4) {
    return `${normal}${line}${r}`;
  }
  
  // Build the line with gradient shimmer
  let result = '';
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const dist = i - shimmerPos;
    
    let color = normal;
    if (dist >= -3 && dist <= 3) {
      if (dist === 0) {
        color = GRAY_SHINE_3; // Center - brightest
      } else if (dist === -1 || dist === 1) {
        color = GRAY_SHINE_2; // Near center
      } else if (dist === -2 || dist === 2) {
        color = GRAY_SHINE_1; // Edge
      } else {
        color = GRAY_SHINE_1; // Outer edge
      }
    }
    result += `${color}${char}${r}`;
  }
  return result;
}

/** Height threshold below which we hide the pixel art */
export const COMPACT_HEIGHT_THRESHOLD = 36;

/** Height threshold below which we show minimal single-line logo */
export const MINIMAL_HEIGHT_THRESHOLD = 27;

/**
 * Build logo as a string (for buffered rendering)
 * @param shimmerPos - Position of shimmer effect
 * @param compact - If true, only show text logo without pixel art
 * @param minimal - If true, only show "PITHOS" on a single line
 */
export function buildLogo(shimmerPos: number = -10, compact: boolean = false, minimal: boolean = false): string {
  // Minimal mode: just "PITHOS" text (black on gold background)
  if (minimal) {
    const goldBg = bg('c9a962');
    return ` ${goldBg}${c.bold}${c.black} PITHOS ${c.reset}  ${GRAY_TEXT}A comprehensive TypeScript utility library${c.reset}\n`;
  }

  // Render PITHOS lines with shimmer (nearly vertical: small offset per line)
  const p0 = renderShimmerLine(PITHOS_LINES[0], shimmerPos);
  const p1 = renderShimmerLine(PITHOS_LINES[1], shimmerPos - 1);
  const p2 = renderShimmerLine(PITHOS_LINES[2], shimmerPos - 2);
  const p3 = renderShimmerLine(PITHOS_LINES[3], shimmerPos - 3);
  const p4 = renderShimmerLine(PITHOS_LINES[4], shimmerPos - 4);
  const p5 = renderShimmerLine(PITHOS_LINES[5], shimmerPos - 5);
  
  // Compact mode: just the text logo
  if (compact) {
    const sub = renderGrayShimmerLine(SUBTITLE_LINE, shimmerPos - 6);
    const copy = renderGrayShimmerLine(COPYRIGHT_LINE, shimmerPos - 7);
    
    return ` ${p0}
 ${p1}
 ${p2}
 ${p3}
 ${p4}
 ${p5}
 ${sub}
 ${copy}
`;
  }

  // Full mode with pixel art
  const O = block(DARK_ORANGE);
  const L = block(LIGHT_ORANGE);
  const B = block(DARK_BROWN);
  const M = block(LIGHT_BROWN);
  const _ = '  ';
  
  // Subtitle and copyright continue the shimmer (offset continues: 7 and 8)
  // There's 1 empty line between p5 and subtitle, so offset is -7
  const sub = renderGrayShimmerLine(SUBTITLE_LINE, shimmerPos - 7);
  const copy = renderGrayShimmerLine(COPYRIGHT_LINE, shimmerPos - 8);

  return `${_}${_}${_}${_}${_}${B}${B}${B}${B}${M}${M}${_}${_}${_}${_}${_}${_}
${_}${_}${_}${_}${_}${_}${O}${O}${O}${L}${_}${_}${_}${_}${_}${_}${_}
${_}${_}${_}${_}${_}${_}${O}${O}${O}${L}${_}${_}${_}${_}${_}${_}${_}
${_}${_}${_}${_}${_}${O}${O}${O}${O}${L}${L}${_}${_}${_}${_}${_}${_}${p0}
${_}${_}${_}${O}${O}${O}${O}${O}${O}${O}${O}${L}${L}${_}${_}${_}${_}${p1}
${_}${_}${O}${B}${B}${B}${B}${B}${B}${B}${B}${M}${M}${M}${_}${_}${_}${p2}
${_}${_}${O}${B}${O}${O}${O}${O}${O}${B}${O}${L}${L}${L}${_}${_}${_}${p3}
${_}${_}${O}${B}${O}${B}${B}${B}${O}${B}${O}${M}${M}${M}${_}${_}${_}${p4}
${_}${_}${O}${B}${O}${O}${O}${B}${O}${B}${O}${O}${L}${M}${_}${_}${_}${p5}
${_}${_}${_}${B}${B}${B}${O}${B}${O}${B}${B}${B}${L}${_}${_}${_}${_}
${_}${_}${_}${O}${O}${O}${O}${B}${O}${O}${O}${O}${L}${_}${_}${_}${_}${sub}
${_}${_}${_}${_}${B}${B}${B}${B}${B}${B}${B}${M}${_}${_}${_}${_}${_}${copy}
${_}${_}${_}${_}${_}${O}${O}${O}${O}${O}${L}${_}${_}${_}${_}${_}${_}
${_}${_}${_}${_}${_}${O}${O}${O}${O}${O}${L}${_}${_}${_}${_}${_}${_}
${_}${_}${_}${_}${_}${_}${O}${O}${O}${L}${_}${_}${_}${_}${_}${_}${_}
${_}${_}${_}${_}${_}${B}${B}${B}${B}${M}${M}${_}${_}${_}${_}${_}${_}
`;
}

export function printLogo(shimmerPos: number = -10): void {
  console.log(buildLogo(shimmerPos));
}

// Export for shimmer animation
export const SHIMMER_WIDTH = PITHOS_WIDTH + 15; // Extra for gradient + gray text lines

/** Get terminal dimensions */
export function getTerminalSize(): { width: number; height: number } {
  return {
    width: process.stdout.columns || 80,
    height: process.stdout.rows || 24
  };
}
