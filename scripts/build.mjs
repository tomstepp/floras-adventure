import fs from 'node:fs';
import path from 'node:path';
import { stripTypeScriptTypes } from 'node:module';

const rootDir = path.resolve(import.meta.dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

/*
 * Modules are stripped of types and concatenated, in this order, into one classic script.
 * A module must come after anything it uses while the page is loading (top-level code);
 * functions can be called from anywhere, since they only run once the game starts.
 */
const moduleOrder = [
    'types.ts',
    'levels.ts',
    'layout.ts',
    'save.ts',
    'audio.ts',
    'particles.ts',
    'butterflies.ts',
    'skyfriends.ts',
    'weather.ts',
    'pets.ts',
    'powers.ts',
    'render/shapes.ts',
    'render/sky.ts',
    'render/scenery.ts',
    'render/items.ts',
    'render/creatures.ts',
    'render/hud.ts',
    'entities.ts',
    'game/dom.ts',
    'game/state.ts',
    'game/input.ts',
    'game/world.ts',
    'game/level.ts',
    'game/menus.ts',
    'game/scene.ts',
    'game/loop.ts',
    'game.ts'
];

/** Every .ts file under src/, relative to it. */
function listSources(dir, prefix = '') {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const rel = prefix + entry.name;
        if (entry.isDirectory()) return listSources(path.join(dir, entry.name), rel + '/');
        return entry.name.endsWith('.ts') ? [rel] : [];
    });
}

const problems = [];
const forgotten = listSources(srcDir).filter(f => !moduleOrder.includes(f));
if (forgotten.length > 0) problems.push(`Not in moduleOrder (add them in scripts/build.mjs): ${forgotten.join(', ')}`);

const chunks = [
    '// Auto-generated from TypeScript sources in src/ via scripts/build.mjs',
    '"use strict";'
];
/** Top-level name -> the module that declared it. Everything ends up in one global scope. */
const declaredIn = new Map();

for (const file of moduleOrder) {
    const tsSource = fs.readFileSync(path.join(srcDir, file), 'utf8');
    const jsSource = stripTypeScriptTypes(tsSource, { mode: 'strip' });

    const cleaned = jsSource
        .replace(/^\s*import\s+[\s\S]*?from\s+['"].*?['"];?\s*$/gm, '')
        .replace(/^\s*export\s+\{[^}]*\};?\s*$/gm, '')
        .replace(/\bexport\s+(?=(?:async\s+)?function\b|class\b|const\b|let\b|var\b)/g, '')
        .trim();

    // Two modules declaring the same top-level name would clash once concatenated.
    for (const match of cleaned.matchAll(/^(?:async\s+)?(?:const|let|var|function\*?|class)\s+([A-Za-z_$][\w$]*)/gm)) {
        const name = match[1];
        const first = declaredIn.get(name);
        if (first && first !== file) problems.push(`"${name}" is declared in both ${first} and ${file}`);
        else declaredIn.set(name, file);
    }

    if (cleaned.length > 0) {
        chunks.push(`\n// --- src/${file} ---\n${cleaned}`);
    }
}

if (problems.length > 0) {
    console.error('Build failed:\n  ' + problems.join('\n  '));
    process.exit(1);
}

fs.mkdirSync(distDir, { recursive: true });
const bundlePath = path.join(distDir, 'game.js');
fs.writeFileSync(bundlePath, chunks.join('\n') + '\n', 'utf8');
console.log(`Built ${path.relative(rootDir, bundlePath)} from ${moduleOrder.length} TypeScript modules.`);
