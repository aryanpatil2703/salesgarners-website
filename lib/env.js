/**
 * Environment Variable Loader Utility
 * Automatically populates process.env from .env.local and .env files for standalone Node.js scripts.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * Loads key-value pairs from .env.local and .env into process.env without overriding existing environment variables.
 */
export function loadEnv() {
  const envFiles = [
    path.join(rootDir, '.env.local'),
    path.join(rootDir, '.env'),
  ];

  for (const filePath of envFiles) {
    if (!fs.existsSync(filePath)) continue;

    try {
      if (typeof process.loadEnvFile === 'function') {
        process.loadEnvFile(filePath);
      } else {
        const content = fs.readFileSync(filePath, 'utf-8');
        for (const rawLine of content.split('\n')) {
          const line = rawLine.trim();
          if (!line || line.startsWith('#')) continue;

          const eqIndex = line.indexOf('=');
          if (eqIndex === -1) continue;

          const key = line.slice(0, eqIndex).trim();
          let value = line.slice(eqIndex + 1).trim();

          // Strip surrounding quotes
          if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
          ) {
            value = value.slice(1, -1);
          }

          if (key && !(key in process.env)) {
            process.env[key] = value;
          }
        }
      }
    } catch {
      // Ignore reading errors if file is locked or unreadable
    }
  }
}

// Auto-run on module import
loadEnv();

