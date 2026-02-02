import type { Command, MenuItem, HelpData, CommandFlag } from './types.js';

export interface FlagState {
  [flagName: string]: boolean | string;
}

export interface CliState {
  // Main menu
  selectedIndex: number;
  
  // Category menu
  currentCategory: string | null;
  commandIndex: number;
  
  // Options mode
  inOptionsMode: boolean;
  flagIndex: number;
  subOptionIndex: number;
  textEditMode: boolean;
  
  // Caret blink
  caretVisible: boolean;
  
  // Runtime
  waitingForKey: boolean;
  runningCommand: boolean;
  
  // Data
  flagStates: Map<string, FlagState>;
}

export function createInitialState(): CliState {
  return {
    selectedIndex: 0,
    currentCategory: null,
    commandIndex: 0,
    inOptionsMode: false,
    flagIndex: 0,
    subOptionIndex: 0,
    textEditMode: false,
    caretVisible: true,
    waitingForKey: false,
    runningCommand: false,
    flagStates: new Map(),
  };
}

export interface CliContext {
  menuItems: MenuItem[];
  selectableItems: MenuItem[];
  byCategory: Map<string, Command[]>;
  helpData: HelpData;
}

// Helper to get current command and flags
export function getCurrentCommand(state: CliState, ctx: CliContext): { cmd: Command | undefined; flags: CommandFlag[] } {
  const commands = ctx.byCategory.get(state.currentCategory ?? '') ?? [];
  const cmd = commands[state.commandIndex];
  return { cmd, flags: cmd?.help.flags ?? [] };
}

// Helper to get or create flag state for a command
export function getOrCreateFlagState(state: CliState, cmdName: string): FlagState {
  if (!state.flagStates.has(cmdName)) {
    state.flagStates.set(cmdName, {});
  }
  return state.flagStates.get(cmdName)!;
}
