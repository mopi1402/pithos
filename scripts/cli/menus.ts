import { colors, bg } from '../common/colors.js';
import { buildLogo, getTerminalSize, COMPACT_HEIGHT_THRESHOLD, MINIMAL_HEIGHT_THRESHOLD } from './logo.js';
import { renderTextField, renderInlineTextField } from './components.js';
import { buildCommand, getVisibleFlags, isCustomSelected } from './utils.js';
import { renderAnimatedLabel, renderAnimatedArrow } from './animations.js';
import type { HelpData, MenuItem, Command } from './types.js';
import type { FlagState } from './state.js';

const c = colors;
const MIN_LINE_WIDTH = 60;
const GROUP_COL_WIDTH = 18;

/** Get the line width based on terminal size */
function getLineWidth(): number {
  const { width } = getTerminalSize();
  // Leave 2 chars margin on each side
  return Math.max(MIN_LINE_WIDTH, width - 2);
}

/** Check if we should use compact mode (no pixel art) */
function isCompactMode(): boolean {
  const { height } = getTerminalSize();
  return height < COMPACT_HEIGHT_THRESHOLD;
}

/** Check if we should use minimal mode (single line logo) */
function isMinimalMode(): boolean {
  const { height } = getTerminalSize();
  return height < MINIMAL_HEIGHT_THRESHOLD;
}

/** Check if terminal is too small */
function isTooSmall(): boolean {
  const { width, height } = getTerminalSize();
  return width < 80 || height < 24;
}

/** Render the "too small" warning screen */
function renderTooSmallScreen(): void {
  const { width, height } = getTerminalSize();
  
  let buffer = c.clear;
  
  // Center vertically
  const messageLines = [
    '',
    'PITHOS',
    '',
    'Please resize your terminal',
    `to at least 80×24 (current: ${width}×${height})`,
    ''
  ];
  
  const startY = Math.max(0, Math.floor((height - messageLines.length) / 2));
  
  // Add empty lines to center vertically
  for (let i = 0; i < startY; i++) {
    buffer += '\n';
  }
  
  // PITHOS logo line (centered)
  const goldBg = bg('c9a962');
  const pithosText = ` PITHOS `;
  const pithosLine = `${goldBg}${c.bold}${c.black}${pithosText}${c.reset}`;
  const pithosPadding = Math.max(0, Math.floor((width - 8) / 2));
  buffer += ' '.repeat(pithosPadding) + pithosLine + '\n\n';
  
  // Warning message (centered)
  const msg1 = 'Please resize your terminal';
  const msg2 = `to at least 80×24 (current: ${width}×${height})`;
  const pad1 = Math.max(0, Math.floor((width - msg1.length) / 2));
  const pad2 = Math.max(0, Math.floor((width - msg2.length) / 2));
  
  buffer += ' '.repeat(pad1) + `${c.dim}${msg1}${c.reset}\n`;
  buffer += ' '.repeat(pad2) + `${c.dim}${msg2}${c.reset}\n`;
  
  process.stdout.write(buffer);
}

export function printMainMenu(
  items: MenuItem[],
  selectedIndex: number,
  helpData: HelpData,
  animationProgress: number = 999,
  arrowFrame: number = 0,
  shimmerPos: number = -1
): void {
  // Check if terminal is too small
  if (isTooSmall()) {
    renderTooSmallScreen();
    return;
  }
  
  const lineWidth = getLineWidth();
  const compact = isCompactMode();
  const minimal = isMinimalMode();
  
  let buffer = c.clear;
  buffer += buildLogo(shimmerPos, compact, minimal);
  buffer += ` ${c.cyan}${'━'.repeat(lineWidth)}${c.reset}\n`;
  buffer += ` ${c.bold}${c.yellow}Categories${c.reset}  ${c.dim}(↑↓ navigate, Enter select, q quit)${c.reset}\n\n`;

  const groups = helpData.groups ?? ['Other'];
  const byGroup = new Map<string, MenuItem[]>();
  
  for (const group of groups) {
    byGroup.set(group, []);
  }
  
  for (const item of items) {
    if (item.type === 'category') {
      const group = helpData.categories[item.category!]?.group ?? 'Other';
      byGroup.get(group)?.push(item);
    }
  }

  let selectableIndex = 0;

  for (const group of groups) {
    const groupItems = byGroup.get(group) ?? [];
    if (groupItems.length === 0) continue;

    for (let i = 0; i < groupItems.length; i++) {
      const item = groupItems[i];
      const isSelected = selectableIndex === selectedIndex;
      const prefix = renderAnimatedArrow(arrowFrame, isSelected);
      const label = renderAnimatedLabel(item.label, animationProgress, isSelected);
      
      const groupLabel = i === 0 ? `${c.dim}${group.padEnd(GROUP_COL_WIDTH)}${c.reset}` : ' '.repeat(GROUP_COL_WIDTH);
      
      buffer += `  ${groupLabel}${c.dim}│${c.reset} ${prefix}${label} ${c.dim}- ${item.description}${c.reset}\n`;
      selectableIndex++;
    }
    buffer += `  ${' '.repeat(GROUP_COL_WIDTH)}${c.dim}│${c.reset}\n`;
  }

  buffer += ` ${c.cyan}${'━'.repeat(lineWidth)}${c.reset}`;
  
  process.stdout.write(buffer);
}

export function printCategoryMenu(
  category: string, 
  commands: Command[], 
  selectedIndex: number,
  inOptionsMode: boolean = false,
  flagIndex: number = 0,
  subOptionIndex: number = 0,
  flagStates: Map<string, FlagState> = new Map(),
  textEditMode: boolean = false,
  caretVisible: boolean = true,
  animationProgress: number = 999,
  arrowFrame: number = 0,
  shimmerPos: number = -1
): void {
  // Check if terminal is too small
  if (isTooSmall()) {
    renderTooSmallScreen();
    return;
  }
  
  const lineWidth = getLineWidth();
  const compact = isCompactMode();
  const minimal = isMinimalMode();
  
  let buffer = c.clear;
  buffer += buildLogo(shimmerPos, compact, minimal);
  buffer += ` ${c.cyan}${'━'.repeat(lineWidth)}${c.reset}\n`;
  
  const modeHint = textEditMode
    ? `${c.dim}(type to edit, Enter run, Esc cancel)${c.reset}`
    : inOptionsMode 
      ? `${c.dim}(←→ select, Space toggle, Tab back, Enter run, q quit)${c.reset}`
      : `${c.dim}(↑↓ navigate, Tab options, Enter run, ← back, q quit)${c.reset}`;
  buffer += ` ${c.bold}${c.yellow}${category}${c.reset}  ${modeHint}\n\n`;

  for (let i = 0; i < commands.length; i++) {
    const { name, help } = commands[i];
    const description = help.description ?? '';
    const isSelected = i === selectedIndex && !inOptionsMode;
    const prefix = renderAnimatedArrow(arrowFrame, isSelected);
    
    // Display separator if present
    if (help.separator) {
      buffer += `\n  ${c.dim}${help.separator}${c.reset}\n\n`;
    }
    
    // Build the real command display
    const cmdFlags = flagStates.get(name) ?? {};
    const { script: realScript, args: realArgs } = buildCommand(name, help.flags ?? [], cmdFlags, help);
    
    // Get base script for display
    const baseScript = help.baseScript ?? name;
    
    // Format command display
    let cmdDisplay: string;
    if (isSelected) {
      let cmdText: string;
      if (realScript !== baseScript) {
        const suffix = realScript.replace(baseScript + ':', '');
        cmdText = `pnpm ${baseScript}:${suffix}`;
      } else {
        cmdText = `pnpm ${baseScript}`;
      }
      const label = renderAnimatedLabel(cmdText, animationProgress, true);
      const argsDisplay = realArgs.length > 0 ? ` ${c.magenta}${realArgs.join(' ')}${c.reset}` : '';
      cmdDisplay = `${label}${argsDisplay}`;
    } else {
      if (realScript !== baseScript) {
        const suffix = realScript.replace(baseScript + ':', '');
        cmdDisplay = `${c.green}pnpm ${c.bold}${baseScript}:${c.magenta}${suffix}${c.reset}`;
      } else if (realArgs.length > 0) {
        cmdDisplay = `${c.green}pnpm ${c.bold}${baseScript}${c.reset} ${c.magenta}${realArgs.join(' ')}${c.reset}`;
      } else {
        cmdDisplay = `${c.green}pnpm ${c.bold}${baseScript}${c.reset}`;
      }
    }
    
    buffer += `  ${prefix}${cmdDisplay} ${c.dim}- ${description}${c.reset}\n`;
    
    // Show available flags for selected command
    if (i === selectedIndex && help.flags?.length) {
      const visibleFlags = getVisibleFlags(help.flags);
      
      for (let fIdx = 0; fIdx < visibleFlags.length; fIdx++) {
        const flag = visibleFlags[fIdx];
        const isFlagSelected = inOptionsMode && fIdx === flagIndex;
        
        if (flag.type === 'checkbox') {
          const isOn = cmdFlags[flag.name] === true;
          const checkbox = isOn ? `${c.green}[✓]${c.reset}` : `${c.dim}[ ]${c.reset}`;
          const flagLabel = isFlagSelected 
            ? `${c.bgOrange}${c.black} ${flag.name} ${c.reset}` 
            : `${c.dim}${flag.name}${c.reset}`;
          buffer += `      ${checkbox} ${flagLabel} ${c.dim}- ${flag.description}${c.reset}\n`;
        } else if (flag.type === 'radio') {
          const defaultValue = flag.defaultValue ?? '';
          const selectedValue = cmdFlags[flag.name] as string ?? defaultValue;
          const radioOptions = flag.options.map((opt, optIdx) => {
            const isOn = opt.value === selectedValue;
            const radio = isOn ? `${c.green}(●)${c.reset}` : `${c.dim}( )${c.reset}`;
            const isOptionSelected = isFlagSelected && optIdx === subOptionIndex;
            const optLabel = isOptionSelected 
              ? `${c.bgOrange}${c.black} ${opt.label} ${c.reset}` 
              : `${c.dim}${opt.label}${c.reset}`;
            return `${radio} ${optLabel}`;
          }).join('  ');
          const flagLabel = isFlagSelected ? `${c.cyan}${flag.name}:${c.reset}` : `${c.dim}${flag.name}:${c.reset}`;
          
          // For radio with "custom" option, show inline text field when custom is selected
          if (isCustomSelected(flag, cmdFlags)) {
            const customValue = cmdFlags['custom'] as string ?? '';
            const isOnCustomOption = isFlagSelected && subOptionIndex === flag.options.length - 1;
            const customDisplay = renderInlineTextField({ value: customValue, isOnCustomOption, caretVisible });
            buffer += `      ${flagLabel} ${radioOptions} ${customDisplay}\n`;
          } else {
            buffer += `      ${flagLabel} ${radioOptions}\n`;
          }
        } else if (flag.type === 'text') {
          const textValue = cmdFlags[flag.name] as string ?? '';
          const placeholder = flag.placeholder ?? 'type here...';
          const inputDisplay = renderTextField({
            value: textValue,
            placeholder,
            isSelected: isFlagSelected,
            showCursor: isFlagSelected && caretVisible
          });
          
          const flagLabel = isFlagSelected ? `${c.cyan}${flag.name}:${c.reset}` : `${c.dim}${flag.name}:${c.reset}`;
          buffer += `      ${flagLabel} ${inputDisplay} ${c.dim}- ${flag.description}${c.reset}\n`;
        }
      }
    }
  }

  buffer += '\n';
  buffer += ` ${c.cyan}${'━'.repeat(lineWidth)}${c.reset}`;
  
  process.stdout.write(buffer);
}

export { FlagState };
