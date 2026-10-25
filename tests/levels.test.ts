import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GROUND_Y, LEVEL_MELODIES, LEVELS, MAX_JUMP_HEIGHT } from '../src/levels.ts';
import type { LevelConfig, Platform } from '../src/types.ts';

const CANVAS_WIDTH = 800;
const DOGHOUSE_LEFT = 670;
const JUMP_MARGIN = 10;

const ground: Platform = { x: 0, y: GROUND_Y, width: CANVAS_WIDTH };
const surfaces = (level: LevelConfig): readonly Platform[] => [ground, ...level.platforms];
const spans = (p: Platform, x: number): boolean => x >= p.x && x <= p.x + p.width;

test('LD-1: five levels, each with a unique pet and a melody', () => {
    assert.equal(LEVELS.length, 5);
    assert.equal(new Set(LEVELS.map(l => l.species)).size, LEVELS.length);
    assert.equal(LEVEL_MELODIES.length, LEVELS.length);
});

for (const [i, level] of LEVELS.entries()) {
    const name = `level ${i + 1} (${level.name})`;

    test(`LV-1: ${name} has exactly flowersNeeded sprouts`, () => {
        assert.equal(level.sprouts.length, level.flowersNeeded);
    });

    test(`LD-2: ${name} sprouts all sit on a surface`, () => {
        for (const s of level.sprouts) {
            assert.ok(
                surfaces(level).some(p => p.y === s.y && spans(p, s.x)),
                `sprout at (${s.x}, ${s.y}) is floating`
            );
        }
    });

    test(`LD-3: ${name} platforms are all reachable by jumping`, () => {
        // Platforms become reachable in order of height, starting from the ground.
        const reached: Platform[] = [ground];
        const remaining = [...level.platforms].sort((a, b) => b.y - a.y);
        for (const p of remaining) {
            const from = reached.find(r => r.y > p.y && r.y - p.y <= MAX_JUMP_HEIGHT - JUMP_MARGIN);
            assert.ok(from, `platform at (${p.x}, ${p.y}) is too high to reach`);
            reached.push(p);
        }
    });

    test(`LD-4: ${name} key floats just above a surface`, () => {
        const { x, y } = level.keyPos;
        assert.ok(
            surfaces(level).some(p => p.y - y === 30 && spans(p, x)),
            `key at (${x}, ${y}) is not 30px above a surface`
        );
    });

    test(`LD-5: ${name} dig mounds are spaced out and in the open`, () => {
        assert.ok(level.mounds.length >= 2);
        const sorted = [...level.mounds].sort((a, b) => a - b);
        for (let m = 1; m < sorted.length; m++) {
            assert.ok(sorted[m] - sorted[m - 1] >= 40, `mounds ${sorted[m - 1]} and ${sorted[m]} overlap`);
        }
        assert.ok(sorted[0] > 100, 'mound too close to the start');
        assert.ok(sorted[sorted.length - 1] < 640, 'mound too close to the doghouse');
    });

    test(`LD-6: ${name} platforms fit on screen and avoid the doghouse`, () => {
        for (const p of level.platforms) {
            assert.ok(p.x >= 0 && p.x + p.width <= DOGHOUSE_LEFT, `platform at x=${p.x} overlaps`);
            assert.ok(p.y > 60 && p.y < GROUND_Y, `platform at y=${p.y} is off the playfield`);
        }
    });
}
