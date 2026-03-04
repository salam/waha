"use strict";
/**
 * NestJS compiles to CommonJS, which transforms import() to require().
 * Baileys is ESM-only, so we need real import().
 * This file is plain .js (not .ts) so TypeScript doesn't touch it.
 * We use createRequire pattern to get a real import().
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadESMModules = loadESMModules;

const esm = {
  b: null,
};

const modules = {
  b: '@adiwajshing/baileys',
};

async function loadESMModules() {
  for (const [key, value] of Object.entries(modules)) {
    if (esm[key]) {
      throw new Error(`Module '${key}' is already loaded`);
    }
    // Real dynamic import — not compiled by TypeScript
    esm[key] = await import(value);
  }
}

exports.default = esm;
