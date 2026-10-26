import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    BEE_RADIUS,
    GROUND_Y,
    LEVEL_MELODIES,
    LEVELS,
    levelWidth,
    MAX_BOUNCE_HEIGHT,
    MAX_JUMP_HEIGHT,
    MUSHROOM_WIDTH
} from '../src/levels.ts';
import type { LevelConfig, Platform, Point } from '../src/types.ts';

/** The doghouse body's left edge: nothing may be built into it. */
const doghouseLeft = (level: LevelConfig): number => levelWidth(level) - 130;
const JUMP_MARGIN = 10;
/** How far sideways a full jump carries Flora (~45 ticks airborne at 3.5 px/tick), with margin. */
const JUMP_REACH_X = 140;
/** A bounce goes nearly straight up, so the target must be just about overhead. */
const BOUNCE_REACH_X = 40;

const groundOf = (level: LevelConfig): Platform => ({ x: 0, y: GROUND_Y, width: levelWidth(level) });
/** Surfaces that hold still: things can be placed on these. */
const surfaces = (level: LevelConfig): readonly Platform[] => [groundOf(level), ...level.platforms];
/** A moving platform as the full stretch it sweeps across. */
const movingSpans = (level: LevelConfig): Platform[] =>
    (level.movingPlatforms ?? []).map(p => ({ x: p.x, y: p.y, width: p.width + p.range }));
const spans = (p: Platform, x: number): boolean => x >= p.x && x <= p.x + p.width;
const gapX = (a: Platform, b: Platform): number => Math.max(0, a.x - (b.x + b.width), b.x - (a.x + a.width));

interface ReachOptions {
    useMushrooms?: boolean;
    useMovingPlatforms?: boolean;
}

/** Every platform Flora can get onto, found by repeatedly jumping/bouncing from ones already reached. */
function reachable(level: LevelConfig, { useMushrooms = true, useMovingPlatforms = true }: ReachOptions = {}): Platform[] {
    const reached: Platform[] = [groundOf(level)];
    const todo: Platform[] = [...level.platforms, ...(useMovingPlatforms ? movingSpans(level) : [])];
    const mushrooms: readonly Point[] = useMushrooms ? (level.mushrooms ?? []) : [];

    let progress = true;
    while (progress) {
        progress = false;
        for (const p of [...todo]) {
            const byJump = reached.some(
                r => r.y > p.y && r.y - p.y <= MAX_JUMP_HEIGHT - JUMP_MARGIN && gapX(r, p) <= JUMP_REACH_X
            );
            // Dropping down from a higher ledge works too
            const byDrop = reached.some(r => r.y < p.y && gapX(r, p) <= JUMP_REACH_X);
            const byBounce = mushrooms.some(
                m =>
                    reached.some(r => r.y === m.y && spans(r, m.x)) &&
                    m.y - p.y <= MAX_BOUNCE_HEIGHT - JUMP_MARGIN &&
                    gapX({ x: m.x - MUSHROOM_WIDTH / 2, y: m.y, width: MUSHROOM_WIDTH }, p) <= BOUNCE_REACH_X
            );
            if (byJump || byDrop || byBounce) {
                reached.push(p);
                todo.splice(todo.indexOf(p), 1);
                progress = true;
            }
        }
    }
    return reached;
}

/** The static surface the key floats above. */
const keySurface = (level: LevelConfig): Platform | undefined =>
    surfaces(level).find(p => p.y - level.keyPos.y === 30 && spans(p, level.keyPos.x));

test('LD-1: ten levels, each with a unique pet and a melody', () => {
    assert.equal(LEVELS.length, 10);
    assert.equal(new Set(LEVELS.map(l => l.species)).size, LEVELS.length);
    assert.equal(LEVEL_MELODIES.length, LEVELS.length);
});

test('TW-1: level 1 is plain; each later level adds a twist, and the last mixes them all', () => {
    const twists = LEVELS.map(l => ({
        mushroom: (l.mushrooms ?? []).length > 0,
        cloud: (l.movingPlatforms ?? []).length > 0,
        bigFlower: l.sprouts.some(s => (s.waterNeeded ?? 1) > 1)
    }));
    assert.deepEqual(twists[0], { mushroom: false, cloud: false, bigFlower: false });
    assert.equal(twists[1].mushroom, true, 'level 2 has a mushroom');
    assert.equal(twists[2].cloud, true, 'level 3 has a moving cloud');
    assert.equal(twists[3].bigFlower, true, 'level 4 has a big flower');
    assert.deepEqual(twists[4], { mushroom: true, cloud: true, bigFlower: true });
    for (const level of LEVELS.slice(1)) assert.ok(level.tip, `${level.name} needs a tip from Noodle`);
});

test('BG-1: levels 1–5 fit one screen; levels 6–10 scroll and grow bigger', () => {
    for (const level of LEVELS.slice(0, 5)) assert.equal(levelWidth(level), 800, level.name);
    const big = LEVELS.slice(5);
    for (let i = 0; i < big.length; i++) {
        assert.ok(levelWidth(big[i]) > 800, `${big[i].name} should scroll`);
        if (i > 0) assert.ok(levelWidth(big[i]) >= levelWidth(big[i - 1]), `${big[i].name} should not shrink`);
    }
});

test('BG-2: bees arrive in level 6 and bushes in level 7; the final level has every obstacle and twist', () => {
    const has = (l: LevelConfig) => ({
        bees: (l.bees ?? []).length > 0,
        bushes: (l.bushes ?? []).length > 0,
        mushroom: (l.mushrooms ?? []).length > 0,
        cloud: (l.movingPlatforms ?? []).length > 0,
        bigFlower: l.sprouts.some(s => (s.waterNeeded ?? 1) > 1)
    });
    for (const level of LEVELS.slice(0, 5)) assert.equal(has(level).bees || has(level).bushes, false, level.name);
    assert.equal(has(LEVELS[5]).bees, true, 'level 6 introduces bees');
    assert.equal(has(LEVELS[6]).bushes, true, 'level 7 introduces bushes');
    assert.deepEqual(has(LEVELS[9]), { bees: true, bushes: true, mushroom: true, cloud: true, bigFlower: true });
});

test('TW-2: the level 2 key needs the mushroom', () => {
    const level = LEVELS[1];
    assert.ok(!reachable(level, { useMushrooms: false }).includes(keySurface(level)!));
    assert.ok(reachable(level).includes(keySurface(level)!));
});

test('TW-3: the level 3 key needs the moving cloud', () => {
    const level = LEVELS[2];
    assert.ok(!reachable(level, { useMovingPlatforms: false }).includes(keySurface(level)!));
    assert.ok(reachable(level).includes(keySurface(level)!));
});

for (const [i, level] of LEVELS.entries()) {
    const name = `level ${i + 1} (${level.name})`;

    test(`LV-1: ${name} has exactly flowersNeeded sprouts`, () => {
        assert.equal(level.sprouts.length, level.flowersNeeded);
    });

    test(`LD-2: ${name} sprouts all sit on a surface that holds still`, () => {
        for (const s of level.sprouts) {
            assert.ok(
                surfaces(level).some(p => p.y === s.y && spans(p, s.x)),
                `sprout at (${s.x}, ${s.y}) is floating`
            );
        }
    });

    test(`LD-3: ${name} platforms are all reachable`, () => {
        const reached = reachable(level);
        for (const p of [...level.platforms, ...movingSpans(level)]) {
            assert.ok(reached.includes(p) || reached.some(r => r.x === p.x && r.y === p.y), `platform at (${p.x}, ${p.y}) can't be reached`);
        }
    });

    test(`LD-4: ${name} key floats just above a reachable surface`, () => {
        const surface = keySurface(level);
        assert.ok(surface, `key at (${level.keyPos.x}, ${level.keyPos.y}) is not 30px above a surface`);
        assert.ok(reachable(level).includes(surface), 'key surface is unreachable');
    });

    test(`LD-5: ${name} dig mounds are spaced out and in the open`, () => {
        assert.ok(level.mounds.length >= 2);
        const sorted = [...level.mounds].sort((a, b) => a - b);
        for (let m = 1; m < sorted.length; m++) {
            assert.ok(sorted[m] - sorted[m - 1] >= 40, `mounds ${sorted[m - 1]} and ${sorted[m]} overlap`);
        }
        assert.ok(sorted[0] > 100, 'mound too close to the start');
        assert.ok(sorted[sorted.length - 1] < doghouseLeft(level) - 30, 'mound too close to the doghouse');
    });

    test(`LD-6: ${name} platforms fit in the level and avoid the doghouse`, () => {
        for (const p of [...level.platforms, ...movingSpans(level)]) {
            assert.ok(p.x >= 0 && p.x + p.width <= doghouseLeft(level), `platform at x=${p.x} overlaps`);
            assert.ok(p.y > 60 && p.y < GROUND_Y, `platform at y=${p.y} is off the playfield`);
        }
    });

    test(`LD-7: ${name} mushrooms grow on the ground, clear of mounds and the doghouse`, () => {
        for (const m of level.mushrooms ?? []) {
            assert.equal(m.y, GROUND_Y, `mushroom at x=${m.x} is not on the ground`);
            assert.ok(m.x - MUSHROOM_WIDTH / 2 > 100, 'mushroom too close to the start');
            assert.ok(m.x + MUSHROOM_WIDTH / 2 <= doghouseLeft(level) - 8, 'mushroom too close to the doghouse');
            for (const mound of level.mounds) {
                assert.ok(Math.abs(mound - m.x) >= 40, `mushroom at x=${m.x} sits on mound ${mound}`);
            }
        }
    });

    test(`LD-10: ${name} bushes are jumpable and clear of mounds, mushrooms, ground sprouts and the ends`, () => {
        for (const b of level.bushes ?? []) {
            assert.ok(b.height <= MAX_JUMP_HEIGHT - JUMP_MARGIN, `bush at x=${b.x} is too tall to jump`);
            assert.ok(b.x > 150 && b.x + b.width < doghouseLeft(level) - 60, `bush at x=${b.x} blocks the start or doghouse`);
            const clear = (x: number): boolean => x < b.x - 30 || x > b.x + b.width + 30;
            for (const mound of level.mounds) assert.ok(clear(mound), `mound ${mound} is inside bush at x=${b.x}`);
            for (const m of level.mushrooms ?? []) assert.ok(clear(m.x), `mushroom ${m.x} is inside bush at x=${b.x}`);
            for (const s of level.sprouts.filter(s => s.y === GROUND_Y)) {
                assert.ok(clear(s.x), `ground sprout ${s.x} is inside bush at x=${b.x}`);
            }
        }
    });

    test(`LD-11: ${name} bees fly inside the level, away from the start and the doghouse door`, () => {
        for (const bee of level.bees ?? []) {
            assert.ok(bee.x > 250, `bee at x=${bee.x} is too close to the start`);
            assert.ok(bee.x + bee.range + BEE_RADIUS < doghouseLeft(level) - 40, `bee at x=${bee.x} guards the doghouse`);
            assert.ok(bee.y - 10 > 100 && bee.y + 10 < GROUND_Y, `bee at y=${bee.y} is out of the playfield`);
            assert.ok(bee.period >= 200, `bee at x=${bee.x} is too fast`);
        }
    });

    test(`LD-8: ${name} big flowers need 2 or 3 splashes`, () => {
        for (const s of level.sprouts) {
            const need = s.waterNeeded ?? 1;
            assert.ok(Number.isInteger(need) && need >= 1 && need <= 3, `sprout at x=${s.x} needs ${need}`);
        }
    });
}
