#!/usr/bin/env node
/**
 * Post-build script: Convert require() calls for ESM-only packages
 * back to dynamic import() in the compiled CommonJS output.
 *
 * Baileys is ESM-only but NestJS compiles to CJS, converting all
 * import statements to require(). This script fixes that.
 */
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const ESM_PACKAGES = ['@adiwajshing/baileys'];

function walkDir(dir, callback) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (entry.name.endsWith('.js')) {
      callback(fullPath);
    }
  }
}

let fixedFiles = 0;

walkDir(DIST_DIR, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  for (const pkg of ESM_PACKAGES) {
    // Match: require("@adiwajshing/baileys") or require("@adiwajshing/baileys/...")
    const requirePattern = new RegExp(
      `require\\(["']${pkg.replace('/', '\\/')}(\\/[^"']*)?["']\\)`,
      'g'
    );

    if (requirePattern.test(content)) {
      // We need to handle two patterns:
      // 1. const baileys_1 = require("@adiwajshing/baileys");
      //    -> needs async top-level handling
      // 2. Various destructured requires

      // For top-level requires in CJS, we wrap them in an async IIFE pattern.
      // But NestJS uses decorator metadata that needs sync access...
      // The simplest approach: use a synchronous workaround.

      // Actually, the esm.js vendor file already handles the dynamic import.
      // The issue is that source files ALSO import Baileys directly.
      // We need to redirect those to use the centralized esm loader instead.
      modified = true;
    }
  }

  // Skip the esm.js file itself (it already has the right import)
  if (filePath.endsWith('vendor/esm.js')) return;

  // Replace require("@adiwajshing/baileys...") with a reference to the esm loader
  // Pattern: const xxx = require("@adiwajshing/baileys...")
  // Replace with: lazy access through the global esm object
  const baileyRequirePattern = /const\s+(\w+)\s*=\s*require\(["']@adiwajshing\/baileys[^"']*["']\);/g;
  let newContent = content;

  if (baileyRequirePattern.test(content)) {
    // Add the esm import at the top
    const esmImport = `const __esm = require("${path.relative(path.dirname(filePath), path.join(DIST_DIR, 'vendor', 'esm')).replace(/\\/g, '/')}");`;

    // Replace each require with a reference to esm.default.b
    newContent = content.replace(baileyRequirePattern, (match, varName) => {
      return `const ${varName} = __esm.default.b;`;
    });

    // Add esm import after "use strict" if not already there
    if (!newContent.includes('__esm')) {
      newContent = newContent; // no change needed if pattern didn't match
    } else if (newContent.startsWith('"use strict"')) {
      newContent = '"use strict";\n' + esmImport + '\n' + newContent.slice('"use strict";\n'.length);
    } else {
      newContent = esmImport + '\n' + newContent;
    }

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      fixedFiles++;
      console.log(`  Fixed: ${path.relative(DIST_DIR, filePath)}`);
    }
  }
});

console.log(`\nFixed ${fixedFiles} file(s) with ESM import redirects.`);
