import type { CliState, CliContext } from './state.js';
import { getCurrentCommand, getOrCreateFlagState } from './state.js';
import { buildCommand, runCommand } from './runner.js';
import { getVisibleFlags, getRadioSelectedIndex, isOnCustomOption } from './utils.js';
import {
  isArrowUp, isArrowDown, isArrowLeft, isArrowRight,
  isEnter, isTab, isSpace, isEscape, isBackspace, isPrintable, getChar, isBack, isPaste, isPastedText
} from '../common/keyboard.js';
import { execSync } from 'child_process';

/**
 * Get clipboard content (macOS)
 */
function getClipboard(): string {
  try {
    return execSync('pbpaste', { encoding: 'utf-8' }).trim();
  } catch {
    return '';
  }
}

export type HandlerResult = 'render' | 'run' | 'none';

// ============================================
// Main Menu Handler
// ============================================
export function handleMainMenu(key: Buffer, state: CliState, ctx: CliContext): HandlerResult {
  const maxIndex = ctx.selectableItems.length - 1;
  
  if (isArrowUp(key)) {
    state.selectedIndex = state.selectedIndex > 0 ? state.selectedIndex - 1 : maxIndex;
    return 'render';
  }
  
  if (isArrowDown(key)) {
    state.selectedIndex = state.selectedIndex < maxIndex ? state.selectedIndex + 1 : 0;
    return 'render';
  }
  
  if (isEnter(key)) {
    const item = ctx.selectableItems[state.selectedIndex];
    if (item?.category) {
      state.currentCategory = item.category;
      state.commandIndex = 0;
      state.inOptionsMode = false;
      state.flagIndex = 0;
      state.subOptionIndex = 0;
      return 'render';
    }
  }
  
  return 'none';
}

// ============================================
// Command List Handler (not in options mode)
// ============================================
export function handleCommandList(key: Buffer, state: CliState, ctx: CliContext): HandlerResult {
  const commands = ctx.byCategory.get(state.currentCategory ?? '') ?? [];
  const maxIndex = commands.length - 1;
  const { cmd, flags } = getCurrentCommand(state, ctx);
  const visibleFlags = getVisibleFlags(flags);
  
  if (isArrowUp(key)) {
    state.commandIndex = state.commandIndex > 0 ? state.commandIndex - 1 : maxIndex;
    state.flagIndex = 0;
    state.subOptionIndex = 0;
    return 'render';
  }
  
  if (isArrowDown(key)) {
    state.commandIndex = state.commandIndex < maxIndex ? state.commandIndex + 1 : 0;
    state.flagIndex = 0;
    state.subOptionIndex = 0;
    return 'render';
  }
  
  // Enter options mode with Tab
  if (isTab(key) && visibleFlags.length > 0) {
    state.inOptionsMode = true;
    state.flagIndex = 0;
    
    const firstFlag = visibleFlags[0];
    if (firstFlag && cmd) {
      const flagState = getOrCreateFlagState(state, cmd.name);
      state.subOptionIndex = getRadioSelectedIndex(firstFlag, flagState);
      
      // Auto-enter text edit mode if first flag is a text field
      if (firstFlag.type === 'text') {
        state.textEditMode = true;
      }
    } else {
      state.subOptionIndex = 0;
    }
    return 'render';
  }
  
  if (isEnter(key) && cmd) {
    return 'run';
  }
  
  // Go back with Left arrow or backspace
  if (isBack(key) || isArrowLeft(key)) {
    state.currentCategory = null;
    state.inOptionsMode = false;
    return 'render';
  }
  
  // Right arrow does nothing in command list
  if (isArrowRight(key)) {
    return 'none';
  }
  
  return 'none';
}

// ============================================
// Options Mode Handler
// ============================================
export function handleOptionsMode(key: Buffer, state: CliState, ctx: CliContext): HandlerResult {
  const { cmd, flags } = getCurrentCommand(state, ctx);
  const visibleFlags = getVisibleFlags(flags);
  const currentFlag = visibleFlags[Math.min(state.flagIndex, visibleFlags.length - 1)];
  const isOnTextField = currentFlag?.type === 'text';
  const maxFlagIndex = visibleFlags.length - 1;
  
  // Get max sub-options for current flag
  const getMaxSubOptions = () => {
    if (!currentFlag || currentFlag.type !== 'radio') return 0;
    return currentFlag.options.length - 1;
  };

  // Sync subOptionIndex with flagState for radio buttons
  const syncSubOptionIndex = (flagIdx: number) => {
    const flag = visibleFlags[flagIdx];
    if (!flag || !cmd) return 0;
    const flagState = getOrCreateFlagState(state, cmd.name);
    return getRadioSelectedIndex(flag, flagState);
  };
  
  // Navigate between flags (up/down) with wrapping
  if (isArrowUp(key)) {
    state.flagIndex = state.flagIndex > 0 ? state.flagIndex - 1 : maxFlagIndex;
    state.subOptionIndex = syncSubOptionIndex(state.flagIndex);
    // Auto-enter text edit mode if navigating to a text field
    const newFlag = visibleFlags[state.flagIndex];
    state.textEditMode = newFlag?.type === 'text';
    return 'render';
  }
  
  if (isArrowDown(key)) {
    state.flagIndex = state.flagIndex < maxFlagIndex ? state.flagIndex + 1 : 0;
    state.subOptionIndex = syncSubOptionIndex(state.flagIndex);
    // Auto-enter text edit mode if navigating to a text field
    const newFlag = visibleFlags[state.flagIndex];
    state.textEditMode = newFlag?.type === 'text';
    return 'render';
  }
  
  // Navigate within flag options (left/right) with wrapping
  const maxSub = getMaxSubOptions();
  
  if (isArrowLeft(key)) {
    if (maxSub > 0) {
      state.subOptionIndex = state.subOptionIndex > 0 ? state.subOptionIndex - 1 : maxSub;
      return 'render';
    }
    return 'none';
  }
  
  if (isArrowRight(key)) {
    if (isOnTextField) {
      state.textEditMode = true;
      return 'render';
    }
    if (maxSub > 0) {
      state.subOptionIndex = state.subOptionIndex < maxSub ? state.subOptionIndex + 1 : 0;
      return 'render';
    }
    return 'none';
  }
  
  // Toggle/select option
  if (isSpace(key) && currentFlag && cmd) {
    const flagState = getOrCreateFlagState(state, cmd.name);
    
    if (currentFlag.type === 'checkbox') {
      flagState[currentFlag.name] = !flagState[currentFlag.name];
    } else if (currentFlag.type === 'radio') {
      const selectedOption = currentFlag.options[state.subOptionIndex];
      flagState[currentFlag.name] = selectedOption.value;
      if (selectedOption.value === 'custom') {
        state.textEditMode = true;
      }
    } else if (currentFlag.type === 'text') {
      state.textEditMode = true;
    }
    return 'render';
  }
  
  // Handle typing directly when on "custom" radio option
  if (currentFlag && isOnCustomOption(currentFlag, state.subOptionIndex) && cmd) {
    const flagState = getOrCreateFlagState(state, cmd.name);
    
    if (isBackspace(key)) {
      const customValue = (flagState['custom'] as string) ?? '';
      if (customValue.length > 0) {
        flagState['custom'] = customValue.slice(0, -1);
        flagState[currentFlag.name] = 'custom';
      }
      return 'render';
    }
    
    if (isPaste(key)) {
      const clipboard = getClipboard();
      if (clipboard) {
        const customValue = (flagState['custom'] as string) ?? '';
        flagState['custom'] = customValue + clipboard;
        flagState[currentFlag.name] = 'custom';
      }
      return 'render';
    }
    
    // Handle pasted text (Cmd+V on macOS sends content directly)
    if (isPastedText(key)) {
      const customValue = (flagState['custom'] as string) ?? '';
      const pastedText = key.toString('utf-8');
      flagState['custom'] = customValue + pastedText;
      flagState[currentFlag.name] = 'custom';
      return 'render';
    }
    
    if (isPrintable(key) && !isSpace(key)) {
      const customValue = (flagState['custom'] as string) ?? '';
      flagState['custom'] = customValue + getChar(key);
      flagState[currentFlag.name] = 'custom';
      return 'render';
    }
  }
  
  // Handle typing directly when on a text field (not custom)
  if (isOnTextField && currentFlag && cmd) {
    const flagState = getOrCreateFlagState(state, cmd.name);
    
    // Tab exits the text field and options mode
    if (isTab(key)) {
      state.inOptionsMode = false;
      state.textEditMode = false;
      state.flagIndex = 0;
      state.subOptionIndex = 0;
      return 'render';
    }
    
    if (isBackspace(key)) {
      const textValue = (flagState[currentFlag.name] as string) ?? '';
      if (textValue.length > 0) {
        flagState[currentFlag.name] = textValue.slice(0, -1);
      }
      return 'render';
    }
    
    if (isPaste(key)) {
      const clipboard = getClipboard();
      if (clipboard) {
        const textValue = (flagState[currentFlag.name] as string) ?? '';
        flagState[currentFlag.name] = textValue + clipboard;
      }
      return 'render';
    }
    
    // Handle pasted text (Cmd+V on macOS sends content directly)
    if (isPastedText(key)) {
      const textValue = (flagState[currentFlag.name] as string) ?? '';
      const pastedText = key.toString('utf-8');
      flagState[currentFlag.name] = textValue + pastedText;
      return 'render';
    }
    
    if (isPrintable(key)) {
      const textValue = (flagState[currentFlag.name] as string) ?? '';
      flagState[currentFlag.name] = textValue + getChar(key);
      return 'render';
    }
  }
  
  // Run command
  if (isEnter(key) && cmd) {
    return 'run';
  }
  
  // Exit options mode
  if (isTab(key) || isBack(key)) {
    state.inOptionsMode = false;
    state.textEditMode = false;
    state.flagIndex = 0;
    state.subOptionIndex = 0;
    return 'render';
  }
  
  return 'none';
}

// ============================================
// Text Edit Mode Handler
// ============================================
export function handleTextEditMode(key: Buffer, state: CliState, ctx: CliContext): HandlerResult {
  const { cmd, flags } = getCurrentCommand(state, ctx);
  const currentFlag = flags[state.flagIndex];
  
  if (!cmd || !currentFlag || currentFlag.type !== 'text') {
    state.textEditMode = false;
    return 'render';
  }
  
  const maxFlagIndex = flags.length - 1;
  
  // Exit text edit mode and options mode with Tab
  if (isTab(key)) {
    state.textEditMode = false;
    state.inOptionsMode = false;
    state.flagIndex = 0;
    state.subOptionIndex = 0;
    return 'render';
  }
  
  // Exit text edit mode with Escape or Left arrow
  if (isEscape(key) || isArrowLeft(key)) {
    state.textEditMode = false;
    return 'render';
  }
  
  // Navigate to previous flag with Up arrow
  if (isArrowUp(key)) {
    state.textEditMode = false;
    state.flagIndex = state.flagIndex > 0 ? state.flagIndex - 1 : maxFlagIndex;
    state.subOptionIndex = 0;
    return 'render';
  }
  
  // Navigate to next flag with Down arrow
  if (isArrowDown(key)) {
    state.textEditMode = false;
    state.flagIndex = state.flagIndex < maxFlagIndex ? state.flagIndex + 1 : 0;
    state.subOptionIndex = 0;
    return 'render';
  }
  
  if (isEnter(key)) {
    state.textEditMode = false;
    return 'run';
  }
  
  const flagState = getOrCreateFlagState(state, cmd.name);
  const currentValue = (flagState[currentFlag.name] as string) ?? '';
  
  if (isBackspace(key)) {
    if (currentValue.length > 0) {
      flagState[currentFlag.name] = currentValue.slice(0, -1);
    }
    return 'render';
  }
  
  if (isPaste(key)) {
    const clipboard = getClipboard();
    if (clipboard) {
      flagState[currentFlag.name] = currentValue + clipboard;
    }
    return 'render';
  }
  
  // Handle pasted text (Cmd+V on macOS sends content directly)
  if (isPastedText(key)) {
    const pastedText = key.toString('utf-8');
    flagState[currentFlag.name] = currentValue + pastedText;
    return 'render';
  }
  
  if (isPrintable(key)) {
    flagState[currentFlag.name] = currentValue + getChar(key);
    return 'render';
  }
  
  return 'none';
}

// ============================================
// Execute Command
// ============================================
export async function executeCommand(state: CliState, ctx: CliContext): Promise<void> {
  const { cmd, flags } = getCurrentCommand(state, ctx);
  if (!cmd) return;
  
  const cmdFlagState = state.flagStates.get(cmd.name) ?? {};
  const { script, args } = buildCommand(cmd.name, flags, cmdFlagState, cmd.help);
  await runCommand(script, args);
}
