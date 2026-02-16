/**
 * Deploy the pre-built website to Vercel.
 *
 * Copies the .vercel link into the build folder and adds a vercel.json
 * that disables server-side build (we build locally), then runs `vercel deploy`.
 *
 * Usage:
 *   tsx scripts/vercel-deploy.ts          → preview deploy
 *   tsx scripts/vercel-deploy.ts --prod   → production deploy
 */

import { cpSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

const websiteDir = resolve('packages/main/website');
const buildDir = resolve(websiteDir, 'build');
const vercelLink = resolve(websiteDir, '.vercel');

if (!existsSync(buildDir)) {
  console.error('❌ build/ folder not found. Run pnpm doc:build first.');
  process.exit(1);
}

if (!existsSync(vercelLink)) {
  console.error('❌ .vercel/ link not found. Run: cd packages/main/website && vercel link');
  process.exit(1);
}

// Copy .vercel link into build so `vercel deploy` knows which project to target
cpSync(vercelLink, resolve(buildDir, '.vercel'), { recursive: true });

// Tell Vercel not to build anything — files are already compiled
writeFileSync(resolve(buildDir, 'vercel.json'), JSON.stringify({ buildCommand: '', outputDirectory: '.' }));

const isProd = process.argv.includes('--prod');
const cmd = `vercel deploy . --yes --archive=tgz${isProd ? ' --prod' : ''}`;

console.log(`🚀 ${isProd ? 'Production' : 'Preview'} deploy...`);
execSync(cmd, { cwd: buildDir, stdio: 'inherit' });
