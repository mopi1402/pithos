export interface CommandFlagCheckbox {
  type: 'checkbox';
  name: string;
  flag?: string;        // CLI flag to append (e.g. "--watch")
  script?: string;      // Alternative script to run instead
  args?: string[];      // Arguments to append
  description: string;
}

export interface CommandFlagRadio {
  type: 'radio';
  name: string;
  description: string;
  defaultValue?: string; // Default selected value
  options: Array<{
    label: string;
    value: string;      // Empty string = default/no change
    script?: string;    // Alternative script to run
    suffix?: string;    // Suffix to append to script name (e.g. ":arkhe")
    flag?: string;      // Flag to append
    args?: string[];    // Arguments to append
  }>;
}

export interface CommandFlagText {
  type: 'text';
  name: string;
  description: string;
  placeholder?: string; // Placeholder text when empty
  prefix?: string;      // Prefix to add before value (e.g. "--filter=")
}

export type CommandFlag = CommandFlagCheckbox | CommandFlagRadio | CommandFlagText;

export interface CommandHelp {
  description?: string;
  category?: string;
  order?: number;
  separator?: string;   // Separator text to display before this command
  baseScript?: string;  // Base script name (for display, actual script built from flags)
  flags?: CommandFlag[];
  options?: Array<{ name: string; description: string }>;
}

export interface CategoryInfo {
  description: string;
  group: string;
}

export interface HelpData {
  commands: Record<string, CommandHelp>;
  categories: Record<string, CategoryInfo>;
  groups: string[];
}

export interface PackageJson {
  scripts?: Record<string, string>;
}

export interface MenuItem {
  label: string;
  description: string;
  type: 'category' | 'separator';
  category?: string;
}

export interface Command {
  name: string;
  help: CommandHelp;
}
