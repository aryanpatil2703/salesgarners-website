import fs from 'fs';
import path from 'path';

const appDir = path.resolve('salesgarners-new-website/app');
const targetTypes = path.resolve('salesgarners-new-website/.next/types/app');
const targetServer = path.resolve('salesgarners-new-website/.next/server/app');

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      const rel = path.relative(appDir, full);
      fs.mkdirSync(path.join(targetTypes, rel), { recursive: true });
      fs.mkdirSync(path.join(targetServer, rel), { recursive: true });
      walk(full);
    }
  }
}

fs.mkdirSync(targetTypes, { recursive: true });
fs.mkdirSync(targetServer, { recursive: true });
walk(appDir);
console.log('Pre-created Next.js build directories.');

