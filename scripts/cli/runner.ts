import { spawn } from 'child_process';
import { colors } from '../common/colors.js';
import { buildCommand } from './utils.js';

const c = colors;

export { buildCommand };

export function runCommand(scriptName: string, args: string[] = []): Promise<number> {
  return new Promise((resolve) => {
    const fullCmd = args.length > 0 ? `pnpm ${scriptName} -- ${args.join(' ')}` : `pnpm ${scriptName}`;
    
    console.log(`${c.cyan}Running: ${c.bold}${fullCmd}${c.reset}\n`);
    
    const pnpmArgs = args.length > 0 ? [scriptName, '--', ...args] : [scriptName];
    
    const child = spawn('pnpm', pnpmArgs, {
      stdio: 'inherit',
      shell: false,
    });

    child.on('close', (code) => {
      resolve(code ?? 0);
    });
  });
}
