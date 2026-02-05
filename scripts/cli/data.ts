import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { HelpData, PackageJson, Command, MenuItem } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadPackageJson(): PackageJson {
  const packagePath = join(__dirname, '..', '..', 'package.json');
  return JSON.parse(readFileSync(packagePath, 'utf-8'));
}

export function loadHelpData(): HelpData {
  const helpPath = join(__dirname, '..', 'data', 'help.json');
  try {
    return JSON.parse(readFileSync(helpPath, 'utf-8'));
  } catch {
    return { commands: {}, categories: {}, groups: [] };
  }
}

export function getCategories(scripts: Record<string, string>, helpData: HelpData): Map<string, Command[]> {
  const byCategory = new Map<string, Command[]>();

  // Scripts to exclude from the CLI
  const excludedScripts = ['cli', 'dev'];

  // First, add commands from package.json scripts
  for (const [name] of Object.entries(scripts)) {
    if (excludedScripts.includes(name)) continue;
    
    const help = helpData.commands[name] ?? {};
    const category = help.category ?? 'Other';

    // Skip commands without a defined category (they fall into "Other" by default)
    if (!helpData.commands[name]) continue;

    if (!byCategory.has(category)) {
      byCategory.set(category, []);
    }
    byCategory.get(category)!.push({ name, help });
  }

  // Then, add virtual commands from help.json that have baseScript (they don't exist in package.json)
  for (const [name, help] of Object.entries(helpData.commands)) {
    if (help.baseScript && !scripts[name]) {
      const category = help.category ?? 'Other';
      if (!byCategory.has(category)) {
        byCategory.set(category, []);
      }
      byCategory.get(category)!.push({ name, help });
    }
  }

  for (const commands of byCategory.values()) {
    commands.sort((a, b) => {
      const orderA = a.help.order ?? 0;
      const orderB = b.help.order ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });
  }

  return byCategory;
}

export function buildMenuItems(categories: string[], helpData: HelpData): MenuItem[] {
  const groups = helpData.groups ?? ['Other'];
  const byGroup = new Map<string, string[]>();
  
  for (const group of groups) {
    byGroup.set(group, []);
  }
  
  for (const cat of categories) {
    const group = helpData.categories[cat]?.group ?? 'Other';
    if (!byGroup.has(group)) {
      byGroup.set(group, []);
    }
    byGroup.get(group)!.push(cat);
  }

  const items: MenuItem[] = [];

  for (const group of groups) {
    const cats = (byGroup.get(group) ?? []).sort((a, b) => {
      const orderA = helpData.categories[a]?.order ?? 0;
      const orderB = helpData.categories[b]?.order ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      return a.localeCompare(b);
    });
    if (cats.length === 0) continue;

    items.push({ label: group, description: '', type: 'separator' });

    for (const cat of cats) {
      const desc = helpData.categories[cat]?.description ?? '';
      items.push({ label: cat, description: desc, type: 'category', category: cat });
    }
  }

  return items;
}
