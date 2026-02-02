import type { CommandFlag, CommandHelp } from './types.js';
import type { FlagState } from './state.js';

// ============================================
// Visible Flags Filter
// ============================================

/** Flags that are displayed inline with other flags (not standalone) */
const INLINE_FLAGS = ['custom'];

/**
 * Filter flags to only include visible ones (exclude inline flags)
 */
export function getVisibleFlags(flags: CommandFlag[]): CommandFlag[] {
  return flags.filter(f => !INLINE_FLAGS.includes(f.name));
}

// ============================================
// Command Builder
// ============================================

export interface CommandResult {
  script: string;
  args: string[];
}

/**
 * Build the final command from flags and their state
 */
export function buildCommand(
  scriptName: string,
  flags: CommandFlag[] = [],
  flagState: FlagState = {},
  help?: CommandHelp
): CommandResult {
  const args: string[] = [];
  let script = help?.baseScript ?? scriptName;

  for (const flag of flags) {
    if (flag.type === 'checkbox') {
      const isOn = flagState[flag.name] === true;
      if (isOn) {
        if (flag.script) {
          script = flag.script;
        } else if (flag.flag) {
          args.push(flag.flag);
        } else if (flag.args) {
          args.push(...flag.args);
        }
      }
    } else if (flag.type === 'radio') {
      const selectedValue = (flagState[flag.name] as string) ?? flag.defaultValue ?? '';
      const selectedOption = flag.options.find(o => o.value === selectedValue);
      
      if (selectedOption && selectedValue !== '') {
        // "custom" value means the text field handles the args
        if (selectedValue === 'custom') {
          continue;
        }
        if (selectedOption.script) {
          script = selectedOption.script;
        } else if (selectedOption.suffix) {
          script = script + selectedOption.suffix;
        } else if (selectedOption.flag) {
          args.push(selectedOption.flag);
        } else if (selectedOption.args) {
          args.push(...selectedOption.args);
        }
      }
    } else if (flag.type === 'text') {
      // Only use "custom" text field if the radio is set to "custom"
      if (flag.name === 'custom') {
        const libsValue = (flagState['libs'] as string) ?? '';
        if (libsValue !== 'custom') {
          continue;
        }
      }

      const textValue = (flagState[flag.name] as string) ?? '';
      if (textValue) {
        if (flag.prefix) {
          args.push(`${flag.prefix}${textValue}`);
        } else {
          args.push(textValue);
        }
      }
    }
  }

  return { script, args };
}

// ============================================
// Radio Option Helpers
// ============================================

/**
 * Get the current subOptionIndex based on flagState for radio buttons
 */
export function getRadioSelectedIndex(
  flag: CommandFlag,
  flagState: FlagState
): number {
  if (flag.type !== 'radio') return 0;
  
  const selectedValue = (flagState[flag.name] as string) ?? flag.defaultValue ?? '';
  const idx = flag.options.findIndex(o => o.value === selectedValue);
  return idx >= 0 ? idx : 0;
}

/**
 * Check if currently on the "custom" option of a radio
 */
export function isOnCustomOption(
  flag: CommandFlag,
  subOptionIndex: number
): boolean {
  if (flag.type !== 'radio') return false;
  return flag.options[subOptionIndex]?.value === 'custom';
}

/**
 * Check if the "custom" radio option is selected
 */
export function isCustomSelected(
  flag: CommandFlag,
  flagState: FlagState
): boolean {
  if (flag.type !== 'radio') return false;
  return (flagState[flag.name] as string) === 'custom';
}
