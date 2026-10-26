import fs from 'node:fs';
import path from 'node:path';
import { stripTypeScriptTypes } from 'node:module';

const rootDir = path.resolve(import.meta.dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

const moduleOrder = [
    'types.ts',
    'levels.ts',
    'layout.ts',
    'audio.ts',
    'particles.ts',
    'renderer.ts',
    'entities.ts',
    'game.ts'
];

fs.mkdirSync(distDir, { recursive: true });

const chunks = [
    '// Auto-generated from TypeScript sources in src/ via scripts/build.mjs',
    '"use strict";'
];

for (const file of moduleOrder) {
    const filePath = path.join(srcDir, file);
    const tsSource = fs.readFileSync(filePath, 'utf8');
    const jsSource = stripTypeScriptTypes(tsSource, { mode: 'strip' });

    const cleaned = jsSource
        .replace(/^\s*import\s+[\s\S]*?from\s+['"].*?['"];?\s*$/gm, '')
        .replace(/^\s*export\s+\{[^}]*\};?\s*$/gm, '')
        .replace(/\bexport\s+(?=(?:async\s+)?function\b|class\b|const\b|let\b|var\b)/g, '')
        .trim();

    if (cleaned.length > 0) {
        chunks.push(`\n// --- src/${file} ---\n${cleaned}`);
    }
}

const bundlePath = path.join(distDir, 'game.js');
fs.writeFileSync(bundlePath, chunks.join('\n') + '\n', 'utf8');
console.log(`Built ${path.relative(rootDir, bundlePath)} from ${moduleOrder.length} TypeScript modules.`);
