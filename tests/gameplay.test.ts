import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS } from '../src/levels.ts';
import { bloomAll, clearLevel, collectKey, digBone, loadGame, placeFlora } from './harness.ts';

test('HD-1/HD-2/HD-3: starts on level 1 with an empty HUD and a watering objective', () => {
    const game = loadGame();
    assert.equal(game.text('level-display'), 'Level 1: Blooming Meadow');
    assert.equal(game.text('status-display'), 'Flowers: 0/3 | Bone: ❌ | Key: ❌');
    assert.match(game.text('objective-display'), /Water every sprout/);
});

/** Peak height above the starting feet position for a jump held `holdTicks` ticks. */
function jumpPeak(holdTicks: number): number {
    const game = loadGame();
    placeFlora(game, 50, 428);
    game.press('ArrowUp');
    let minY = 380;
    for (let i = 0; i < 60; i++) {
        if (i === holdTicks) game.release('ArrowUp');
        game.step();
        minY = Math.min(minY, game.run<number>('flora.y'));
    }
    return 380 - minY;
}

test('CT-1/CT-3/CT-4: letter keys do nothing; only arrows and Space are controls', () => {
    const game = loadGame();
    placeFlora(game, 100, 428);
    for (const code of ['KeyA', 'KeyD', 'KeyW', 'KeyE', 'KeyS', 'KeyF']) {
        game.press(code);
        game.step(5);
        game.release(code);
    }
    assert.equal(game.run('flora.x'), 100);
    assert.equal(game.run('flora.y'), 380);
    assert.equal(game.run('state.sprouts[0].bloomed || state.digMounds.some(m => m.dug)'), false);
});

test('CT-2: Space waters instead of jumping', () => {
    const game = loadGame();
    placeFlora(game, 100, 428);
    game.tap('Space');
    game.step();
    assert.equal(game.run('flora.y'), 380);
    assert.equal(game.run('flora.isWatering'), true);
});

test('CT-2: holding ↑ jumps onto a platform', () => {
    const game = loadGame();
    placeFlora(game, 250, 428);
    game.press('ArrowUp');
    game.step(45);
    game.release('ArrowUp');
    assert.equal(game.run('flora.grounded'), true);
    assert.equal(game.run('flora.y + flora.height'), 345);
});

test('CT-2: Flora cannot jump again while airborne', () => {
    const game = loadGame();
    placeFlora(game, 50, 428);
    game.press('ArrowUp');
    game.step(15);
    const vy = game.run<number>('flora.vy');
    game.release('ArrowUp');
    game.tap('ArrowUp');
    assert.ok(game.run<number>('flora.vy') > vy, 'second press should not reset upward velocity');
});

test('CT-8: holding ↑ does not keep bouncing', () => {
    const game = loadGame();
    placeFlora(game, 50, 428);
    game.press('ArrowUp');
    game.step(80); // long enough to jump, land, and sit still
    assert.equal(game.run('flora.grounded'), true);
    game.step(10);
    assert.equal(game.run('flora.y'), 380);
});

test('CT-9: a tap shorter than one tick still jumps (as a short hop)', () => {
    const game = loadGame();
    placeFlora(game, 50, 428);
    game.press('ArrowUp');
    game.release('ArrowUp'); // both between two ticks
    let minY = 380;
    for (let i = 0; i < 40; i++) {
        game.step();
        minY = Math.min(minY, game.run<number>('flora.y'));
    }
    assert.ok(380 - minY > 5 && 380 - minY < 40, `hop reached ${380 - minY}px`);
});

test('CT-9: tapping ↑ gives a short hop; holding gives a full jump', () => {
    const tap = jumpPeak(1);
    const full = jumpPeak(60);
    assert.ok(full > 110, `full jump reached ${full}px`);
    assert.ok(tap < full / 2, `tap hop reached ${tap}px vs ${full}px`);
});

test('CT-10: coyote time allows a jump just after walking off a ledge', () => {
    const jumpAfterLeaving = (ticksLate: number): number => {
        const game = loadGame();
        placeFlora(game, 300, 345); // right end of the 210–330 platform
        game.press('ArrowRight');
        while (game.run('flora.grounded')) game.step();
        game.release('ArrowRight');
        game.step(ticksLate);
        game.tap('ArrowUp');
        return game.run<number>('flora.vy');
    };
    assert.ok(jumpAfterLeaving(3) < -9, 'jump 4 ticks after leaving the ledge should work');
    assert.ok(jumpAfterLeaving(8) > 0, 'jump 9 ticks after leaving should not');
});

test('CT-11: a jump pressed just before landing fires on landing', () => {
    const jumpPressedBeforeLanding = (ticksEarly: number): boolean => {
        const game = loadGame();
        game.run('flora.x = 50; flora.y = 300; flora.vy = 0; flora.grounded = false; flora.coyoteTimer = 0;');
        // Find the landing tick on a copy of the fall, then press Space `ticksEarly` ticks before it.
        let ticks = 0;
        const probe = loadGame();
        probe.run('flora.x = 50; flora.y = 300; flora.vy = 0; flora.grounded = false; flora.coyoteTimer = 0;');
        while (!probe.run('flora.grounded')) {
            probe.step();
            ticks++;
        }
        game.step(ticks - ticksEarly);
        game.press('ArrowUp');
        game.step(ticksEarly + 2);
        return game.run<number>('flora.vy') < -5;
    };
    assert.equal(jumpPressedBeforeLanding(4), true);
    assert.equal(jumpPressedBeforeLanding(10), false);
});

test('CT-3: an elevated sprout cannot be watered from the ground, but can from its platform', () => {
    const game = loadGame();
    placeFlora(game, 250, 428);
    game.tap('Space');
    assert.equal(game.run('state.sprouts[1].bloomed'), false);

    placeFlora(game, 250, 345);
    game.tap('Space');
    assert.equal(game.run('state.sprouts[1].bloomed'), true);
    assert.equal(game.text('status-display'), 'Flowers: 1/3 | Bone: ❌ | Key: ❌');
});

test('CT-4: digging does nothing while standing on a platform', () => {
    const game = loadGame();
    placeFlora(game, 250, 345);
    game.tap('ArrowDown');
    assert.equal(game.run('state.digMounds.some(m => m.dug)'), false);
});

test('LV-2: digging an empty mound marks it dug and keeps the bone hidden', () => {
    const game = loadGame();
    const decoyX = game.run<number>('state.digMounds.find(m => !m.hasBone).x');
    placeFlora(game, decoyX - 16, 428);
    game.tap('ArrowDown');
    assert.equal(game.run(`state.digMounds.find(m => m.x === ${decoyX}).dug`), true);
    assert.equal(game.run('state.boneFound'), false);
    assert.equal(game.run('noodle.speechBubble'), 'Keep sniffing! 🐾');
});

test('LV-2: digging picks the closest undug mound, even next to a dug one', () => {
    const game = loadGame();
    game.run('state.currentLevel = 3; restartLevel();'); // Enchanted Garden: mounds at 210 and 300 are 90px apart
    game.run('state.digMounds.forEach(m => { m.hasBone = false; }); state.digMounds[1].hasBone = true;');
    game.run('state.digMounds[0].dug = true;');
    placeFlora(game, 255 - 16, 428); // centre at 255: within range of both 210 and 300
    game.tap('ArrowDown');
    assert.equal(game.run('state.boneFound'), true, 'should dig the undug mound at 300');
});

test('LV-2: the bone can be dug before every flower blooms', () => {
    const game = loadGame();
    digBone(game);
    assert.equal(game.run('state.boneFound'), true);
    assert.equal(game.run('state.keyCollected'), false);
});

test('LV-3: Noodle sniffs out the bone when Flora is nearby', () => {
    const game = loadGame();
    const boneX = game.run<number>('state.digMounds.find(m => m.hasBone).x');
    placeFlora(game, boneX - 30, 428);
    game.run('noodle.barkTimer = 0;');
    game.step();
    assert.equal(game.run('noodle.sniffing'), true);
    assert.equal(game.run('noodle.speechBubble'), '🦴 Dig here!');
});

test('LV-4: the key cannot be collected until flowers and bone are done', () => {
    const game = loadGame();
    collectKey(game);
    assert.equal(game.run('state.keyCollected'), false);

    bloomAll(game);
    collectKey(game);
    assert.equal(game.run('state.keyCollected'), false, 'still needs the bone');

    digBone(game);
    assert.match(game.text('objective-display'), /key/);
    collectKey(game);
    assert.equal(game.run('state.keyCollected'), true);
    assert.match(game.text('objective-display'), /doghouse/);
});

test('LV-5: reaching the doghouse without the key does not end the level', () => {
    const game = loadGame();
    bloomAll(game);
    digBone(game);
    placeFlora(game, 690, 428);
    game.run('noodle.barkTimer = 0;');
    game.step();
    assert.equal(game.run('state.levelClearTimer'), 0);
    assert.match(game.run<string>('noodle.speechBubble'), /locked/);
});

test('LV-5: walking into the doghouse with the key ends the level', () => {
    const game = loadGame();
    bloomAll(game);
    digBone(game);
    collectKey(game);

    placeFlora(game, 640, 428);
    game.press('ArrowRight');
    game.step(30);
    game.release('ArrowRight');
    assert.ok(game.run<number>('state.levelClearTimer') > 0, 'celebration should start');
    assert.match(game.text('objective-display'), /rescued Milo the Kitty/);

    game.step(75);
    assert.equal(game.run('state.currentLevel'), 1);
    assert.equal(game.text('level-display'), 'Level 2: Sunny Glade');
});

test('LV-5: Flora cannot move during the celebration', () => {
    const game = loadGame();
    bloomAll(game);
    digBone(game);
    collectKey(game);
    placeFlora(game, 690, 428);
    game.step();
    game.press('ArrowLeft');
    game.step(10);
    assert.equal(game.run('flora.x'), 690);
});

test('LV-8: the rainbow is hidden while playing and sweeps in once the level is beaten', () => {
    const game = loadGame();
    bloomAll(game);
    digBone(game);
    collectKey(game);
    assert.equal(game.run('rainbowProgress()'), 0, 'no rainbow before the doghouse');

    placeFlora(game, 690, 428);
    game.step();
    const start = game.run<number>('rainbowProgress()');
    assert.ok(start > 0 && start < 0.1, `rainbow starts small (${start})`);
    game.step(20);
    const mid = game.run<number>('rainbowProgress()');
    assert.ok(mid > start && mid < 1, `rainbow grows (${mid})`);
    game.step(30);
    assert.equal(game.run('rainbowProgress()'), 1, 'full rainbow before the celebration ends');

    game.step(30);
    assert.equal(game.run('state.currentLevel'), 1);
    assert.equal(game.run('rainbowProgress()'), 0, 'rainbow gone on the next level');
});

test('LV-8: the full rainbow stays up behind the victory dialog', () => {
    const game = loadGame();
    for (let lvl = 0; lvl < LEVELS.length; lvl++) clearLevel(game);
    assert.equal(game.dialog.open, true);
    assert.equal(game.run('rainbowProgress()'), 1);
    game.dialog.close();
    assert.equal(game.run('rainbowProgress()'), 0);
});

test('LV-6: a cleared level resets state and adds the pet to the parade', () => {
    const game = loadGame();
    clearLevel(game);
    assert.equal(game.run('state.currentLevel'), 1);
    assert.equal(game.run('state.rescuedFriends.length'), 1);
    assert.equal(game.run('state.rescuedFriends[0].species'), 'kitty');
    assert.equal(game.run('flora.x'), 50);
    assert.equal(game.run('state.boneFound || state.keyCollected'), false);
    assert.equal(game.run('state.sprouts.length'), LEVELS[1].sprouts.length);
    assert.equal(game.text('status-display'), 'Flowers: 0/4 | Bone: ❌ | Key: ❌');
});

test('LV-7: clearing every level opens the victory dialog, closing it restarts', () => {
    const game = loadGame();
    for (let lvl = 0; lvl < LEVELS.length; lvl++) {
        assert.equal(game.run('state.currentLevel'), lvl);
        assert.equal(game.run('state.rescuedFriends.length'), Math.min(lvl, 3), 'up to 3 pets follow');
        clearLevel(game);
    }
    assert.equal(game.dialog.open, true);
    assert.equal(game.run('state.screen'), 'victory');
    assert.equal(game.run('state.progress.roster.join()'), LEVELS.map(l => l.species).join(), 'every pet is in the roster');
    assert.equal(game.run('state.rescuedFriends.map(f => f.species).join()'), 'snail,bear,owl', 'the 3 newest follow');

    // The game stays frozen behind the dialog.
    const x = game.run<number>('flora.x');
    game.press('ArrowLeft');
    game.step(10);
    assert.equal(game.run('flora.x'), x);

    game.dialog.close();
    assert.equal(game.run('state.currentLevel'), 0);
    assert.equal(game.run('state.rescuedFriends.length'), 3, 'followers come along into the new game');
    assert.equal(game.run('state.screen'), 'playing');
    assert.equal(game.run('keys.ArrowLeft'), false, 'held keys are cleared on restart');
    assert.equal(game.text('level-display'), 'Level 1: Blooming Meadow');
});

test('CT-5: the Restart button restarts the current level', () => {
    const game = loadGame();
    clearLevel(game);
    bloomAll(game);
    digBone(game);
    placeFlora(game, 400, 428);
    (game.elements['restart-btn'].click as () => void)();
    assert.equal(game.run('state.currentLevel'), 1);
    assert.equal(game.run('state.sprouts.some(s => s.bloomed)'), false);
    assert.equal(game.run('state.boneFound'), false);
    assert.equal(game.run('flora.x'), 50);
    assert.equal(game.run('state.rescuedFriends.length'), 1, 'already-rescued pets stay');
});

test('CT-7: losing window focus releases held keys', () => {
    const game = loadGame();
    placeFlora(game, 100, 428);
    game.press('ArrowRight');
    game.fireWindowEvent('blur');
    game.step(10);
    assert.equal(game.run('flora.x'), 100);
});

test('PL-4: game speed does not depend on display refresh rate', () => {
    const distanceAt = (hz: number): number => {
        const game = loadGame();
        placeFlora(game, 50, 428);
        game.press('ArrowRight');
        for (let i = 0; i <= hz; i++) game.frame(1000 + (i * 1000) / hz); // one second of frames
        return game.run<number>('flora.x') - 50;
    };
    const at60 = distanceAt(60);
    const at120 = distanceAt(120);
    assert.ok(Math.abs(at60 - 3.5 * 60) <= 7, `expected ~210px in 1s at 60Hz, got ${at60}`);
    assert.ok(Math.abs(at120 - at60) <= 7, `120Hz moved ${at120}px vs ${at60}px at 60Hz`);
});

test('PL-4: a long pause does not fast-forward the game', () => {
    const game = loadGame();
    placeFlora(game, 50, 428);
    game.press('ArrowRight');
    game.frame(1000);
    game.frame(11000); // tab was hidden for 10 seconds
    assert.ok(game.run<number>('flora.x') - 50 <= 3.5 * 17, 'at most ~250ms of catch-up');
});

test('PL-7: on-screen buttons hold the matching control while touched', () => {
    const game = loadGame();
    placeFlora(game, 100, 428);
    game.touch('ArrowRight', 'pointerdown');
    game.step(10);
    game.touch('ArrowRight', 'pointerup');
    game.step(10);
    assert.equal(game.run('flora.x'), 135);

    game.touch('ArrowLeft', 'pointerdown');
    game.touch('ArrowLeft', 'pointercancel');
    game.step(5);
    assert.equal(game.run('flora.x'), 135, 'a cancelled touch releases the button');

    game.touch('ArrowUp', 'pointerdown');
    game.step();
    assert.ok(game.run<number>('flora.vy') < 0, 'jump button jumps');
});

test('PL-6: the game box and canvas resize with the window', () => {
    const game = loadGame();
    game.resize(390, 844, 3); // portrait phone
    const stage = game.elements['game-stage'].style as { width: string };
    const canvas = game.elements.gameCanvas as { width: number; height: number };
    assert.equal(stage.width, `${Math.floor(808 * ((390 - 32) / 808))}px`);
    assert.equal(canvas.width, Math.round(800 * ((390 - 32) / 808) * 3), 'backing store matches device pixels');
    assert.ok(Math.abs(canvas.width / canvas.height - 800 / 500) < 0.01, 'keeps the 8:5 shape');
});

/** Jumps straight to a level (0-based) as if the earlier ones were beaten. */
function goToLevel(game: ReturnType<typeof loadGame>, level: number): void {
    game.run(`startGame(${level});`);
}

test('TW-4: landing on the mushroom bounces Flora up to the level 2 key ledge', () => {
    const game = loadGame();
    goToLevel(game, 1);
    // Drop Flora onto the mushroom at x=640 from just above it.
    game.run('flora.x = 624; flora.y = 340; flora.vy = 0; flora.grounded = false; flora.coyoteTimer = 0;');
    let launched = false;
    for (let i = 0; i < 20 && !launched; i++) {
        game.step();
        launched = game.run<number>('flora.vy') < -15;
    }
    assert.ok(launched, 'mushroom should launch Flora');
    for (let i = 0; i < 120 && !game.run('flora.grounded'); i++) game.step();
    assert.equal(game.run('flora.y + flora.height'), 150, 'lands on the high ledge');
});

test('TW-4: walking along the ground past a mushroom does not bounce', () => {
    const game = loadGame();
    goToLevel(game, 1);
    placeFlora(game, 560, 428);
    game.press('ArrowRight');
    game.step(30);
    game.release('ArrowRight');
    assert.equal(game.run('flora.y'), 380);
});

test('TW-5: the cloud glides back and forth and carries Flora with it', () => {
    const game = loadGame();
    goToLevel(game, 2);
    const start = game.run<number>('state.movingPlatforms[0].x');
    game.step(60);
    const later = game.run<number>('state.movingPlatforms[0].x');
    assert.ok(later > start, 'cloud moves right first');
    game.step(180);
    assert.ok(Math.abs(game.run<number>('state.movingPlatforms[0].x') - start) < 0.5, 'and returns after one period');

    placeFlora(game, start + 30, 300);
    const offset = game.run<number>('flora.x - state.movingPlatforms[0].x');
    game.step(60);
    assert.equal(game.run('flora.y + flora.height'), 300, 'still riding the cloud');
    assert.ok(Math.abs(game.run<number>('flora.x - state.movingPlatforms[0].x') - offset) < 0.01, 'moved with the cloud');
});

test('TW-6: the big flower needs three splashes and shows a hint', () => {
    const game = loadGame();
    goToLevel(game, 3);
    const big = game.run<{ x: number; y: number }>('(({ x, y }) => ({ x, y }))(state.sprouts.find(s => s.waterNeeded === 3))');
    assert.match(game.text('objective-display'), /big ones need extra/);
    for (let splash = 1; splash <= 3; splash++) {
        placeFlora(game, big.x - 20, big.y);
        game.tap('Space');
        const s = game.run<{ water: number; bloomed: boolean }>(`state.sprouts.find(s => s.waterNeeded === 3)`);
        assert.equal(s.water, splash);
        assert.equal(s.bloomed, splash === 3);
    }
});

test('TW-7: Noodle introduces each new twist when its level starts', () => {
    const game = loadGame();
    goToLevel(game, 1);
    assert.match(game.run<string>('noodle.speechBubble'), /mushroom/);
    assert.ok(game.run<number>('noodle.barkTimer') > 100);
    goToLevel(game, 2);
    assert.match(game.run<string>('noodle.speechBubble'), /cloud/);
});

test('ST-1: the game opens on the start screen and waits for Play', () => {
    const game = loadGame({ atStartScreen: true });
    assert.equal(game.elements['start-screen'].hidden, false);
    assert.equal(game.elements['continue-btn'].hidden, true, 'no Continue without a save');
    assert.equal(game.run('state.screen'), 'start');

    placeFlora(game, 100, 428);
    game.press('ArrowRight');
    game.step(10);
    assert.equal(game.run('flora.x'), 100, 'nothing moves behind the start screen');

    game.click('play-btn');
    assert.equal(game.elements['start-screen'].hidden, true);
    assert.equal(game.run('state.screen'), 'playing');
    assert.equal(game.run('keys.ArrowRight'), false, 'keys held on the start screen are dropped');
    assert.equal(game.text('level-display'), 'Level 1: Blooming Meadow');
});

test('SV-1: beating a level saves progress; reloading offers Continue', () => {
    const storage = new Map<string, string>();
    const first = loadGame({ storage });
    clearLevel(first);
    clearLevel(first);
    assert.equal(first.run('state.currentLevel'), 2);

    const reloaded = loadGame({ storage, atStartScreen: true });
    assert.equal(reloaded.elements['continue-btn'].hidden, false);
    assert.match(reloaded.text('continue-btn'), /Level 3/);
    assert.match(reloaded.text('play-btn'), /New game/);

    reloaded.click('continue-btn');
    assert.equal(reloaded.run('state.currentLevel'), 2);
    assert.equal(reloaded.run('state.rescuedFriends.map(f => f.species).join()'), 'kitty,puppy', 'parade is restored');
    assert.equal(reloaded.text('level-display'), 'Level 3: Rainbow Hills');
});

test('SV-2: New game starts over at level 1 but keeps unlocked levels', () => {
    const storage = new Map<string, string>();
    const first = loadGame({ storage });
    clearLevel(first);
    clearLevel(first);
    const reloaded = loadGame({ storage, atStartScreen: true });
    reloaded.click('play-btn');
    assert.equal(reloaded.run('state.currentLevel'), 0);
    assert.equal(reloaded.run('state.rescuedFriends.map(p => p.species).join()'), 'kitty,puppy', 'rescued pets still follow');
    const saved = JSON.parse(storage.get('floras-adventure-save-v1')!);
    assert.equal(saved.level, null, 'nothing to continue');
    assert.equal(saved.unlocked, 2, 'levels 1–3 still open');
    assert.deepEqual(saved.roster, ['kitty', 'puppy'], 'the roster is kept');
    assert.equal(loadGame({ storage, atStartScreen: true }).elements['continue-btn'].hidden, true);
});

test('SV-3: winning the game removes Continue and unlocks every level', () => {
    const storage = new Map<string, string>();
    const game = loadGame({ storage });
    for (let lvl = 0; lvl < LEVELS.length; lvl++) clearLevel(game);
    assert.equal(game.dialog.open, true);
    const saved = JSON.parse(storage.get('floras-adventure-save-v1')!);
    assert.equal(saved.level, null);
    assert.equal(saved.unlocked, LEVELS.length - 1);
    assert.equal(saved.roster.length, LEVELS.length);
    const reloaded = loadGame({ storage, atStartScreen: true });
    assert.equal(reloaded.elements['continue-btn'].hidden, true);
    reloaded.click('levels-btn');
    assert.ok(reloaded.levelCards().every(c => !c.disabled), 'every level can be picked');
});

test('SV-5: an older save with only a level still works, and unlocks up to it', () => {
    const storage = new Map([['floras-adventure-save-v1', '{"level":3}']]);
    const game = loadGame({ storage, atStartScreen: true });
    assert.match(game.text('continue-btn'), /Level 4/);
    game.click('levels-btn');
    assert.deepEqual(game.levelCards().map(c => c.disabled), LEVELS.map((_, i) => i > 3));
});

test('SV-4: a broken or out-of-range save is ignored', () => {
    for (const bad of ['not json', '{"level":"2"}', '{"level":0}', '{"level":99}', '{"level":1.5}']) {
        const storage = new Map([['floras-adventure-save-v1', bad]]);
        const game = loadGame({ storage, atStartScreen: true });
        assert.equal(game.elements['continue-btn'].hidden, true, `save ${bad} should be ignored`);
    }
});

test('LD-9: no flower is the same color as its level sky', () => {
    const game = loadGame();
    for (let lvl = 0; lvl < LEVELS.length; lvl++) {
        goToLevel(game, lvl);
        const colors = game.run<string>('state.sprouts.map(s => s.color.toUpperCase()).join()').split(',');
        assert.ok(!colors.includes(LEVELS[lvl].bg.toUpperCase()), `level ${lvl + 1} hides a flower in the sky`);
    }
});

test('LV-5: falling past the doghouse door from above does not end the level until Flora lands', () => {
    const game = loadGame();
    bloomAll(game);
    digBone(game);
    collectKey(game);
    game.run('flora.x = 700; flora.y = 200; flora.vy = 0; flora.grounded = false; flora.coyoteTimer = 0;');
    let clearedInAir = false;
    while (!game.run('flora.grounded')) {
        game.step();
        if (game.run<number>('state.levelClearTimer') > 0 && !game.run('flora.grounded')) clearedInAir = true;
    }
    assert.equal(clearedInAir, false, 'no celebration while still falling');
    game.step();
    assert.ok(game.run<number>('state.levelClearTimer') > 0, 'celebration starts once on the ground');
});

test('CT-12: holding water splashes for about two seconds, then stops until pressed again', () => {
    const game = loadGame();
    placeFlora(game, 400, 428);
    game.run('flora.isWatering = false; flora.waterTimer = 0;');
    game.press('Space');
    let lastPourTick = -1;
    for (let t = 0; t < 400; t++) {
        game.step();
        if (game.run('flora.waterTimer === 17')) lastPourTick = t; // a splash just started
    }
    assert.ok(lastPourTick > 90 && lastPourTick <= 125, `last splash while held at tick ${lastPourTick}`);
    assert.equal(game.run('flora.isWatering'), false, 'can is empty while still held');

    game.release('Space');
    game.step();
    game.tap('Space');
    assert.equal(game.run('flora.isWatering'), true, 'a new press waters again');
});

test('CT-12: a tap shorter than one tick still waters', () => {
    const game = loadGame();
    const sprout = game.run<{ x: number; y: number }>('({ x: state.sprouts[0].x, y: state.sprouts[0].y })');
    placeFlora(game, sprout.x - 20, sprout.y);
    game.press('Space');
    game.release('Space');
    game.step();
    assert.equal(game.run('state.sprouts[0].bloomed'), true);
});

/** Records which pet species get drawn on each render. */
function spyOnPets(game: ReturnType<typeof loadGame>): () => string[] {
    game.run(`
        globalThis.petsDrawn = [];
        for (const k of Object.keys(PET_DRAWERS)) {
            const draw = PET_DRAWERS[k];
            PET_DRAWERS[k] = (...args) => { globalThis.petsDrawn.push(k); draw(...args); };
        }
    `);
    return () => {
        const drawn = game.run<string>('globalThis.petsDrawn.join()').split(',').filter(Boolean);
        game.run('globalThis.petsDrawn = [];');
        return drawn;
    };
}

test('PT-1: rescued pets are drawn as sprites (not emoji text) in the parade and at the doghouse', () => {
    const game = loadGame();
    const drawn = spyOnPets(game);
    clearLevel(game);
    clearLevel(game);
    drawn();
    game.step();
    const parade = drawn();
    assert.ok(parade.includes('kitty') && parade.includes('puppy'), `parade draws ${parade.join(' ')}`);
    const text = game.drawnText();
    assert.ok(!text.some(t => /🐱|🐶|🐹/.test(t)), 'no pet emoji drawn as text');

    bloomAll(game);
    digBone(game);
    collectKey(game);
    drawn();
    game.step();
    assert.ok(drawn().includes('hamster'), 'the pet waits at the doghouse once the key is found');
});

test('PT-2: every species has its own drawing', () => {
    const game = loadGame();
    const species = LEVELS.map(l => l.species).join();
    assert.equal(game.run('Object.keys(PET_DRAWERS).join()'), species);
    // Each one draws without errors, facing either way and mid-step.
    game.run(`for (const k of Object.keys(PET_DRAWERS)) { drawPetSprite(ctx, k, 100, 428, false, 1); drawPetSprite(ctx, k, 100, 428, true, -1); }`);
});

test('PT-3: parade pets turn to face the way they walk', () => {
    const game = loadGame();
    clearLevel(game);
    clearLevel(game);
    placeFlora(game, 700, 428);
    game.step(90);
    assert.equal(game.run('state.rescuedFriends.length'), 2);
    assert.equal(game.run('state.rescuedFriends.every(p => p.facingLeft !== true)'), true, 'following Flora right');
    placeFlora(game, 40, 428);
    game.step(60);
    assert.equal(game.run('state.rescuedFriends.some(p => p.facingLeft === true)'), true, 'turned back left');
});

test('BF-1: a few butterflies flutter in the sky and wrap around the screen', () => {
    const game = loadGame({ atStartScreen: true });
    const count = game.run<number>('butterflies.items.length');
    assert.ok(count >= 3 && count <= 5, `${count} butterflies`);
    for (let i = 0; i < 3000; i++) game.run('update();');
    const all = game.run<{ x: number; y: number }[]>('butterflies.items.map(b => ({ x: b.x, y: b.y }))');
    for (const b of all) {
        assert.ok(b.x >= -20 && b.x <= 820, `x=${b.x} left the screen`);
        assert.ok(b.y >= 100 && b.y <= 340, `y=${b.y} left the sky band`);
    }
    assert.equal(game.run('state.screen'), 'start', 'fluttering behind the start screen changes nothing else');
});

test("SP-1: Noodle's speech bubble sits on the grass below the characters", () => {
    const game = loadGame();
    goToLevel(game, 2); // level start: Noodle announces the cloud
    placeFlora(game, 60, 428);
    game.run('noodle.x = 40;');
    game.step();
    const bubble = game.drawnTextAt().find(t => /cloud/.test(t.text));
    assert.ok(bubble, 'tip is drawn');
    assert.ok(bubble.y > 428, `bubble text at y=${bubble.y} should be below the ground line`);
    assert.ok(bubble.x >= 4, 'bubble stays on screen at the left edge');
});

test('ND-1: Noodle turns to face the way he trots, without flipping on tiny drifts', () => {
    const game = loadGame();
    placeFlora(game, 600, 428);
    game.run('noodle.x = 100; noodle.facing = "left";');
    game.step(20);
    assert.equal(game.run('noodle.facing'), 'right', 'trotting right toward Flora');

    placeFlora(game, 100, 428);
    game.step(20);
    assert.equal(game.run('noodle.facing'), 'left', 'trotting back left');

    // Settled next to Flora: tiny movements keep his last direction.
    game.step(300);
    assert.ok(Math.abs(game.run<number>('noodle.vx')) < 0.3);
    assert.equal(game.run('noodle.facing'), 'left');
});

test('BG-3: the camera follows Flora across wide levels and stops at both ends', () => {
    const game = loadGame();
    game.step(30);
    assert.equal(game.run('state.cameraX'), 0, 'one-screen levels never scroll');

    goToLevel(game, 5); // Buzzing Meadow, 1600 wide
    assert.equal(game.run('state.cameraX'), 0, 'starts at the left end');
    game.run('flora.x = 900; flora.y = 380;');
    game.step(120);
    const mid = game.run<number>('state.cameraX');
    assert.ok(mid > 300 && mid < 800, `camera follows to ${mid}`);
    const floraOnScreen = game.run<number>('flora.x - state.cameraX');
    assert.ok(floraOnScreen > 200 && floraOnScreen < 600, 'Flora stays near the middle');

    game.run('flora.x = 1560; flora.y = 380;');
    game.step(200);
    assert.ok(Math.abs(game.run<number>('state.cameraX') - 800) < 0.5, 'stops at the right end (1600 - 800)');
});

test('BG-4: a bramble bush blocks walking, but Flora can jump onto it and over it', () => {
    const game = loadGame();
    goToLevel(game, 6); // Bramble Path: first bush at x 400–444, 30 tall
    placeFlora(game, 330, 428);
    game.press('ArrowRight');
    game.step(40);
    assert.equal(game.run('flora.x + flora.width'), 400, 'stopped at the bush');

    game.tap('ArrowUp'); // short hop is enough to land on top
    game.press('ArrowUp');
    let stoodOnTop = false;
    for (let i = 0; i < 80; i++) {
        game.step();
        if (game.run('flora.grounded') && game.run('flora.y + flora.height') === 398) stoodOnTop = true;
    }
    game.release('ArrowUp');
    game.step(40);
    game.release('ArrowRight');
    assert.ok(stoodOnTop || game.run<number>('flora.x') > 444, 'got onto or over the bush');
    assert.ok(game.run<number>('flora.x') > 444, 'and kept going past it');
});

test('BG-5: touching a bee bumps Flora back for a moment, and nothing is lost', () => {
    const game = loadGame();
    goToLevel(game, 5);
    bloomAll(game);
    digBone(game);
    const bee = game.run<{ x: number; y: number }>('({ x: state.bees[0].x, y: state.bees[0].y })');
    // Stand right in the first bee's path, facing it, with no bump-proofing.
    placeFlora(game, bee.x - 50, 428);
    game.run('flora.safeTimer = 0;');
    game.press('ArrowRight');
    let bumped = false;
    for (let i = 0; i < 120 && !bumped; i++) {
        game.step();
        bumped = game.run<number>('flora.stunTimer') > 0;
    }
    assert.ok(bumped, 'the bee bumps her');
    game.step(); // the knock-back takes over on her next update
    assert.ok(game.run<number>('flora.vx') < 0, 'knocked back away from the bee');
    const x = game.run<number>('flora.x');
    game.step(10);
    assert.ok(game.run<number>('flora.x') < x, 'still sliding back, ignoring → while stunned');
    assert.match(game.run<string>('noodle.speechBubble'), /bees/);

    game.step(30);
    assert.equal(game.run('flora.stunTimer'), 0, 'control returns');
    assert.ok(game.run<number>('flora.safeTimer') > 0, 'and she blinks, safe from another bump');
    game.release('ArrowRight');
    assert.equal(game.run('state.sprouts.every(s => s.bloomed) && state.boneFound'), true, 'flowers and bone are kept');
});

test('BG-6: arrows at the screen edge point to an off-screen key, then the doghouse', () => {
    const game = loadGame();
    goToLevel(game, 5);
    bloomAll(game);
    digBone(game);
    placeFlora(game, 60, 428);
    game.step(200); // camera settles at the left end; key is at x 1010
    assert.equal(game.run('nextGoal().emoji'), '🔑');
    assert.ok(game.drawnText().includes('🔑'), 'key arrow drawn');

    collectKey(game);
    placeFlora(game, 60, 428);
    game.step(200);
    assert.equal(game.run('nextGoal().emoji'), '🏠');
    assert.ok(game.drawnText().includes('🏠'), 'doghouse arrow drawn');

    game.run('flora.x = 1450;');
    game.step(200);
    assert.ok(!game.drawnText().includes('🏠'), 'no arrow once the doghouse is on screen');
});

test('BG-7: in a wide level the doghouse is at the far right end', () => {
    const game = loadGame();
    goToLevel(game, 9); // Grand Garden, 2400 wide
    bloomAll(game);
    digBone(game);
    collectKey(game);
    placeFlora(game, 700, 428);
    game.step();
    assert.equal(game.run('state.levelClearTimer'), 0, "the old doghouse spot doesn't count");
    placeFlora(game, 2290, 428);
    game.step();
    assert.ok(game.run<number>('state.levelClearTimer') > 0);
});

test('LV-7: the victory dialog lists every rescued pet', () => {
    const game = loadGame();
    const items = game.elements['rescued-list'].items as string[];
    assert.equal(items.length, LEVELS.length);
    assert.ok(items[0].includes('🐱') && items[9].includes('🦄') && items[14].includes('🦉'));
    assert.match(game.text('victory-text'), /all 15 magical pets/);
});

test('PS-1: the Pause button and Esc pause and resume the game', () => {
    const game = loadGame();
    placeFlora(game, 100, 428);
    game.click('pause-btn');
    assert.equal(game.run('state.screen'), 'paused');
    assert.equal(game.elements['pause-screen'].hidden, false);
    game.press('ArrowRight');
    game.step(20);
    assert.equal(game.run('flora.x'), 100, 'nothing moves while paused');
    game.release('ArrowRight');

    game.key('Escape');
    assert.equal(game.run('state.screen'), 'playing', 'Esc resumes');
    assert.equal(game.elements['pause-screen'].hidden, true);
    game.key('Escape');
    assert.equal(game.run('state.screen'), 'paused', 'Esc pauses');
    game.click('resume-btn');
    assert.equal(game.run('state.screen'), 'playing');
});

test('PS-2: switching away from the window pauses the game', () => {
    const game = loadGame();
    game.fireWindowEvent('blur');
    assert.equal(game.run('state.screen'), 'paused');
    game.fireWindowEvent('blur');
    assert.equal(game.run('state.screen'), 'paused', 'stays paused, no toggling');
});

test('PS-3: keys pressed in a menu never leak into play', () => {
    const game = loadGame();
    placeFlora(game, 100, 428);
    game.click('pause-btn');
    game.press('ArrowUp');
    game.press('ArrowRight');
    game.click('resume-btn');
    game.step(5);
    assert.equal(game.run('flora.x'), 100);
    assert.equal(game.run('flora.y'), 380, 'no jump from a key pressed while paused');
});

test('PS-4: the pause menu can restart the level or go to the main menu', () => {
    const storage = new Map<string, string>();
    const game = loadGame({ storage });
    clearLevel(game);
    bloomAll(game);
    game.click('pause-btn');
    game.click('pause-restart-btn');
    assert.equal(game.run('state.screen'), 'playing');
    assert.equal(game.run('state.sprouts.some(s => s.bloomed)'), false, 'level restarted');

    game.click('pause-btn');
    game.click('pause-menu-btn');
    assert.equal(game.run('state.screen'), 'start');
    assert.equal(game.elements['start-screen'].hidden, false);
    assert.equal(game.elements['pause-screen'].hidden, true);
    assert.match(game.text('continue-btn'), /Level 2/, 'Continue returns to the level you left');
});

test('LS-1: the level list unlocks levels as you reach them', () => {
    const game = loadGame({ atStartScreen: true });
    game.click('levels-btn');
    assert.equal(game.run('state.screen'), 'levels');
    const cards = game.levelCards();
    assert.equal(cards.length, LEVELS.length);
    assert.equal(cards[0].disabled, false, 'level 1 is always open');
    assert.ok(cards.slice(1).every(c => c.disabled && c.innerText.includes('🔒')), 'the rest are locked');

    game.click('levels-back-btn');
    assert.equal(game.run('state.screen'), 'start');
    game.click('play-btn');
    clearLevel(game);
    clearLevel(game);
    game.click('pause-btn');
    game.click('pause-levels-btn');
    const after = game.levelCards();
    assert.deepEqual(after.slice(0, 4).map(c => c.disabled), [false, false, false, true]);
    assert.ok(after[0].classes.has('beaten') && after[0].innerText.includes('★'), 'beaten levels show their stars');
    assert.ok(after[2].classes.has('current'), 'the level being played is marked');
    assert.ok(after[1].innerText.includes('🐶'), 'unlocked levels show their pet');
});

test('LS-2: picking a level starts it with your followers in the parade', () => {
    const storage = new Map([['floras-adventure-save-v1', JSON.stringify({ level: null, unlocked: 9 })]]);
    const game = loadGame({ storage, atStartScreen: true });
    game.click('levels-btn');
    game.levelCards()[7].click();
    assert.equal(game.run('state.screen'), 'playing');
    assert.equal(game.run('state.currentLevel'), 7);
    // An older save with no roster: the 9 beaten levels' pets are rescued, the newest 3 follow.
    assert.equal(game.run('state.progress.roster.length'), 9);
    assert.equal(game.run('state.rescuedFriends.map(p => p.species).join()'), 'piglet,fox,panda');
    assert.equal(game.text('level-display'), 'Level 8: Cloud Canyon');
    assert.equal(game.elements['level-select'].hidden, true);
    assert.equal(JSON.parse(storage.get('floras-adventure-save-v1')!).level, 7, 'Continue now points here');
});

test('LS-3: locked levels cannot be started', () => {
    const game = loadGame({ atStartScreen: true });
    game.click('levels-btn');
    game.levelCards()[5].click();
    assert.equal(game.run('state.screen'), 'levels');
});

test('LS-4: Back and Esc return from the level list to where it was opened', () => {
    const game = loadGame();
    game.click('pause-btn');
    game.click('pause-levels-btn');
    game.key('Escape');
    assert.equal(game.run('state.screen'), 'paused', 'back to the pause menu');
    game.click('pause-levels-btn');
    game.click('levels-back-btn');
    assert.equal(game.run('state.screen'), 'paused');
});

test('AU-1: two sounds in the same tick (a bee bump while jumping) never throw', () => {
    const game = loadGame({ withAudio: true });
    assert.equal(game.run('audio.enabled'), true, 'Play switched sound on');
    // The exact crash: a jump and a bump on the same synth in one tick, with the audio clock stuck.
    game.run("audio.playSound('jump'); audio.playSound('bump'); audio.playSound('bark'); audio.playSound('water'); audio.playSound('water');");
    assert.deepEqual(game.consoleErrors, [], 'scheduled one after another, no errors at all');
});

test('AU-1: level 8 — walking and jumping into the bee with sound on keeps the game running', () => {
    const game = loadGame({ withAudio: true });
    goToLevel(game, 7); // Cloud Canyon
    for (const wait of [0, 30, 60, 90, 120, 150, 180, 210]) {
        game.run('restartLevel(); flora.x = 470; flora.safeTimer = 0;');
        game.step(wait);
        game.press('ArrowRight');
        for (let i = 0; i < 90; i++) {
            if (i % 12 === 0) game.press('ArrowUp'); // jump into the bee too
            if (i % 12 === 6) game.release('ArrowUp');
            game.step();
        }
        game.release('ArrowRight');
    }
    assert.equal(game.run('state.screen'), 'playing');
    assert.deepEqual(game.consoleErrors, []);
});

test('AU-2: an error inside one frame never stops the game loop', () => {
    const game = loadGame();
    game.frame(1000);
    game.run('const realUpdate = update; update = () => { throw new Error("boom"); }; globalThis.realUpdate = realUpdate;');
    assert.doesNotThrow(() => game.frame(1100));
    assert.equal(game.hasPendingFrame(), true, 'the next frame is still booked');
    assert.ok(game.consoleErrors.some(e => e.includes('boom')), 'the error is logged');

    game.run('update = globalThis.realUpdate;');
    placeFlora(game, 100, 428);
    game.press('ArrowRight');
    game.frame(1200);
    game.frame(1300);
    assert.ok(game.run<number>('flora.x') > 100, 'and play carries on afterwards');
});

test('SK-1: kites, planes and balloons drift by one at a time, never the same kind twice in a row', () => {
    const game = loadGame({ atStartScreen: true });
    const kinds: string[] = [];
    let maxAtOnce = 0;
    let lastKind: string | null = null;
    for (let t = 0; t < 60 * 120; t++) { // two minutes
        game.run('update();');
        const v = game.run<{ kind: string; x: number; y: number } | null>(
            'skyVisitors.visitor && { kind: skyVisitors.visitor.kind, x: skyVisitors.visitor.x, y: skyVisitors.visitor.y }'
        );
        if (!v) {
            lastKind = null;
            continue;
        }
        maxAtOnce = 1;
        if (lastKind === null) kinds.push(v.kind);
        lastKind = v.kind;
        assert.ok(v.y >= 75 && v.y <= 335, `${v.kind} at y=${v.y} left the sky`);
        assert.ok(v.x >= -100 && v.x <= 900, `${v.kind} at x=${v.x} is far off-screen`);
    }
    assert.equal(maxAtOnce, 1);
    assert.ok(kinds.length >= 3, `only ${kinds.length} visitors in two minutes`);
    assert.deepEqual([...new Set(kinds)].sort(), ['balloons', 'kite', 'plane'], 'all three kinds show up');
    for (let i = 1; i < kinds.length; i++) assert.notEqual(kinds[i], kinds[i - 1], 'no repeats in a row');
    assert.equal(game.run('state.screen'), 'start', 'purely decorative');
});

test('SK-1: the first sky visitor arrives a few seconds in, and there are pauses between visits', () => {
    const game = loadGame();
    game.step(200);
    assert.equal(game.run('skyVisitors.visitor'), null, 'nothing in the first ~3 seconds');
    game.step(60);
    assert.notEqual(game.run('skyVisitors.visitor'), null, 'the first one arrives');
    while (game.run('skyVisitors.visitor') !== null) game.run('update();');
    const gap = game.run<number>('skyVisitors.cooldown');
    assert.ok(gap >= 360 && gap <= 840, `pause of ${gap} ticks before the next`);
});

test('RS-1: a rescued pet joins the roster and the parade; a fourth sends the longest follower home', () => {
    const storage = new Map<string, string>();
    const game = loadGame({ storage });
    clearLevel(game);
    clearLevel(game);
    clearLevel(game);
    assert.equal(game.run('state.rescuedFriends.map(p => p.species).join()'), 'kitty,puppy,hamster');
    clearLevel(game);
    assert.equal(game.run('state.progress.roster.join()'), 'kitty,puppy,hamster,turtle', 'everyone stays in the roster');
    assert.equal(game.run('state.rescuedFriends.map(p => p.species).join()'), 'puppy,hamster,turtle', 'kitty went to rest');
    assert.match(game.run<string>('noodle.speechBubble'), /Shelly the Turtle joins you: Steady feet/, 'welcome first');
    game.step(225);
    assert.match(game.run<string>('noodle.speechBubble'), /Milo the Kitty went home to rest/);
    game.step(160);
    assert.match(game.run<string>('noodle.speechBubble'), /Bounce, float and splash/, "then level 5's tip still shows");
    const saved = JSON.parse(storage.get('floras-adventure-save-v1')!);
    assert.deepEqual(saved.followers, ['puppy', 'hamster', 'turtle']);
});

test('RS-1: re-rescuing a pet already in the roster changes nothing', () => {
    const game = loadGame();
    clearLevel(game);
    game.run('startGame(0);');
    clearLevel(game);
    assert.equal(game.run('state.progress.roster.join()'), 'kitty');
    assert.equal(game.run('state.rescuedFriends.length'), 1);
});

test('RS-2: My pets shows the roster; tap to rest or follow, at most 3 follow', () => {
    const storage = new Map([['floras-adventure-save-v1', JSON.stringify({
        level: 4, unlocked: 4, roster: ['kitty', 'puppy', 'hamster', 'turtle'], followers: ['puppy', 'hamster', 'turtle']
    })]]);
    const game = loadGame({ storage, atStartScreen: true });
    assert.equal(game.elements['pets-btn'].hidden, false, 'My pets is offered once a pet is rescued');
    game.click('pets-btn');
    assert.equal(game.run('state.screen'), 'roster');
    const states = () => game.rosterCards().map(c => c.dataset.state);
    assert.deepEqual(states().slice(0, 5), ['resting', 'following', 'following', 'following', 'locked']);
    assert.equal(game.rosterCards().length, LEVELS.length, 'every pet has a card, rescued or not');
    assert.ok(game.rosterCards()[4].disabled, 'unrescued pets cannot be picked');
    assert.match(game.text('roster-count'), /3 \/ 3/);

    game.rosterCards()[0].click(); // kitty: parade is full
    assert.equal(states()[0], 'resting');
    assert.match(game.text('roster-hint'), /Only 3 pets can follow/);

    game.rosterCards()[2].click(); // hamster rests
    game.rosterCards()[0].click(); // now kitty can follow
    assert.deepEqual(states().slice(0, 4), ['following', 'following', 'resting', 'following']);
    assert.match(game.text('roster-hint'), /Milo the Kitty is following: Quick paws! Walk a little faster/, 'says what the power does');
    const saved = JSON.parse(storage.get('floras-adventure-save-v1')!);
    assert.deepEqual(saved.followers, ['puppy', 'turtle', 'kitty'], 'your choice is saved');

    game.click('roster-back-btn');
    assert.equal(game.run('state.screen'), 'start');
    game.click('continue-btn');
    assert.equal(game.run('state.rescuedFriends.map(p => p.species).join()'), 'puppy,turtle,kitty', 'and walks with you');
});

test('RS-2: changing followers from the pause menu updates the parade right away', () => {
    const game = loadGame();
    clearLevel(game);
    clearLevel(game);
    game.click('pause-btn');
    game.click('pause-pets-btn');
    game.rosterCards()[0].click(); // kitty rests
    assert.equal(game.run('state.rescuedFriends.map(p => p.species).join()'), 'puppy');
    game.key('Escape');
    assert.equal(game.run('state.screen'), 'paused', 'Esc goes back to the pause menu');
    game.click('resume-btn');
    game.step(5);
    assert.equal(game.run('state.rescuedFriends.length'), 1);
});

test('RS-2: zero followers is fine, and a new rescue still joins', () => {
    const game = loadGame();
    clearLevel(game);
    game.click('pause-btn');
    game.click('pause-pets-btn');
    game.rosterCards()[0].click();
    game.click('roster-back-btn');
    game.click('resume-btn');
    assert.equal(game.run('state.rescuedFriends.length'), 0);
    clearLevel(game);
    assert.equal(game.run('state.rescuedFriends.map(p => p.species).join()'), 'puppy');
});

test('RS-3: an old save without a roster gets one from the beaten levels', () => {
    const storage = new Map([['floras-adventure-save-v1', '{"level":5,"unlocked":5}']]);
    const game = loadGame({ storage, atStartScreen: true });
    assert.equal(game.run('state.progress.roster.join()'), 'kitty,puppy,hamster,turtle,bunny');
    assert.equal(game.run('state.progress.followers.join()'), 'hamster,turtle,bunny');
});

test('RS-3: a roster with unknown or duplicate pets is cleaned up', () => {
    const storage = new Map([['floras-adventure-save-v1', JSON.stringify({
        level: 2, unlocked: 2, roster: ['kitty', 'dragon', 'kitty', 'puppy'], followers: ['dragon', 'puppy', 'hamster', 'kitty', 'puppy']
    })]]);
    const game = loadGame({ storage, atStartScreen: true });
    assert.equal(game.run('state.progress.roster.join()'), 'kitty,puppy');
    assert.equal(game.run('state.progress.followers.join()'), 'puppy,kitty', 'only rostered pets, no repeats');
});

test('RS-4: when a level starts, Noodle and the parade line up behind Flora', () => {
    const game = loadGame();
    goToLevel(game, 5);
    clearLevel(game); // ends at the far right of a 1600px level
    clearLevel(game);
    const xs = game.run<number[]>('[noodle.x, ...state.rescuedFriends.map(p => p.x)]');
    assert.equal(xs[0], 20, 'Noodle starts next to Flora');
    for (let i = 1; i < xs.length; i++) assert.equal(xs[i], 20 - i * 32, `pet ${i} lines up behind`);
});

test('WX-3: walking into a pond is just a splash: Flora pops back on the bank, nothing lost', () => {
    const game = loadGame();
    goToLevel(game, 10); // Lily Pond: first pond is x 500–760
    bloomAll(game);
    placeFlora(game, 420, 428);
    game.run('flora.safeTimer = 0;');
    game.press('ArrowRight');
    let splashed = false;
    for (let i = 0; i < 80 && !splashed; i++) {
        game.step();
        splashed = /Splash/.test(game.run<string>('noodle.speechBubble'));
    }
    game.release('ArrowRight');
    assert.ok(splashed, 'falls in and splashes');
    const x = game.run<number>('flora.x');
    assert.ok(x < 500 && x > 400, `back on the bank near where she left it (x=${x})`);
    assert.equal(game.run('flora.y'), 380);
    assert.equal(game.run('state.sprouts.every(s => s.bloomed)'), true, 'flowers are kept');
});

test('WX-3: Flora can stand on lily pads, and Noodle paddles across the water', () => {
    const game = loadGame();
    goToLevel(game, 10);
    placeFlora(game, 585 - 16, 430);
    game.step(30);
    assert.equal(game.run('flora.grounded'), true);
    assert.equal(game.run('flora.y + flora.height'), 430, 'standing on the lily pad');
    assert.equal(game.run('flora.fellInWater'), false);
    game.run('noodle.x = 600;');
    game.step();
    assert.equal(game.run('noodle.swimming'), true);
});

test('WX-4: gusts of wind push Flora back, but she can still walk into them', () => {
    const game = loadGame();
    goToLevel(game, 11); // Windy Hills: calm 200 ticks, then a 150-tick gust blowing left
    placeFlora(game, 700, 428);
    game.step(100);
    assert.equal(game.run('flora.x'), 700, 'calm: standing still stays put');
    game.step(130); // 30 ticks into the gust, once it has eased up to full strength
    assert.ok(game.run<number>('currentWind().x') < -1, 'gust is blowing');
    const before = game.run<number>('flora.x');
    game.step(20);
    assert.ok(game.run<number>('flora.x') < before - 20, 'pushed back while standing');
    const start = game.run<number>('flora.x');
    game.press('ArrowRight');
    game.step(30);
    game.release('ArrowRight');
    const walked = game.run<number>('flora.x') - start;
    assert.ok(walked > 30 && walked < 3.5 * 30, `walks forward, but slower (${walked}px)`);
});

test('WX-4: leaves start blowing just before a gust, as a warning', () => {
    const game = loadGame();
    goToLevel(game, 11);
    game.step(120);
    assert.equal(game.run('weather.drops.length'), 0, 'nothing while calm');
    game.step(60); // the last second before the gust
    assert.equal(game.run('currentWind().soon'), true);
    assert.ok(game.run<number>('weather.drops.length') > 0, 'warning leaves');
});

test('WX-5: rain clouds water the sprouts beneath them over time', () => {
    const game = loadGame();
    goToLevel(game, 12); // Rainy Meadow
    // Park a cloud over the first ground sprout and let it rain
    game.run('LEVELS[12].rainClouds[0].range = 0; LEVELS[12].rainClouds[0].x = state.sprouts[0].x; restartLevel();');
    placeFlora(game, 60, 428);
    game.step(95);
    assert.equal(game.run('state.sprouts[0].bloomed'), true, 'bloomed by the rain alone');
    const bloomed = game.run<number>('state.sprouts.filter(s => s.bloomed).length');
    assert.ok(game.text('status-display').startsWith(`Flowers: ${bloomed}/`), 'the HUD counts rain-bloomed flowers');
});

test('WX-6: on ice Flora slides; on snow she stops right away', () => {
    const game = loadGame();
    goToLevel(game, 13); // Snowy Peaks: ice at x 400–650
    placeFlora(game, 410, 428);
    game.press('ArrowRight');
    game.step();
    assert.ok(game.run<number>('flora.vx') < 1, 'speeds up gradually on ice');
    game.step(40);
    game.release('ArrowRight');
    game.step(10);
    assert.ok(game.run<number>('flora.vx') > 1, 'keeps sliding after letting go');

    placeFlora(game, 300, 428);
    game.press('ArrowRight');
    game.step(10);
    game.release('ArrowRight');
    game.step();
    assert.equal(game.run('flora.vx'), 0, 'stops at once on snow');
});

test('WX-7: the night has a moon, fireflies and darkness; quiet weather keeps kites and butterflies away', () => {
    const game = loadGame();
    goToLevel(game, 14); // Starry Night
    assert.equal(game.run('weather.kind'), 'night');
    assert.equal(game.run('weather.drawSky(ctx, "#1B2A4A")'), false, 'no sun at night');
    assert.ok(game.run<number>('weather.fireflyLights().length') >= 8, 'fireflies light the dark');
    assert.equal(game.run('weather.calmSky'), false);
    game.step(); // renders the darkness without errors
    for (const [lvl, kind] of [[12, 'rain'], [13, 'snow'], [11, 'wind'], [0, 'clear']] as const) {
        goToLevel(game, lvl);
        assert.equal(game.run('weather.kind'), kind);
        assert.equal(game.run('weather.calmSky'), kind === 'wind' || kind === 'clear');
    }
});

test('DV-1: without ?dev the game behaves normally: no badge, no skip, levels locked', () => {
    const game = loadGame({ atStartScreen: true });
    assert.equal(game.run('state.dev'), false);
    assert.equal(game.elements['dev-badge'].hidden, true);
    assert.equal(game.elements['pause-skip-btn'].hidden, true);
    game.click('levels-btn');
    assert.ok(game.levelCards().slice(1).every(c => c.disabled));
});

test('DV-2: ?dev opens every level and pet and shows a DEV badge', () => {
    const game = loadGame({ atStartScreen: true, search: '?dev' });
    assert.equal(game.run('state.dev'), true);
    assert.equal(game.elements['dev-badge'].hidden, false);
    game.click('levels-btn');
    assert.ok(game.levelCards().every(c => !c.disabled), 'every level can be picked');
    game.click('levels-back-btn');
    game.click('pets-btn');
    assert.ok(game.rosterCards().every(c => c.dataset.state !== 'locked'), 'every pet is in the roster');
});

test('DV-3: Skip level (dev) finishes the level at once and rescues its pet', () => {
    const game = loadGame({ search: '?dev' });
    assert.equal(game.elements['pause-skip-btn'].hidden, false);
    game.click('pause-btn');
    game.click('pause-skip-btn');
    assert.equal(game.run('state.screen'), 'playing');
    game.step();
    assert.equal(game.run('state.currentLevel'), 1, 'on to level 2');
    game.run('state.currentLevel = 14; restartLevel();');
    game.click('pause-btn');
    game.click('pause-skip-btn');
    game.step();
    assert.equal(game.dialog.open, true, 'skipping the last level shows the victory dialog');
});

test('DV-4: dev mode never touches the real save', () => {
    const saved = JSON.stringify({ level: 2, unlocked: 2, roster: ['kitty', 'puppy'], followers: ['kitty', 'puppy'] });
    const storage = new Map([['floras-adventure-save-v1', saved]]);
    const game = loadGame({ storage, atStartScreen: true, search: '?dev' });
    game.click('levels-btn');
    game.levelCards()[12].click();
    clearLevel(game);
    game.click('pause-btn');
    game.click('pause-pets-btn');
    game.rosterCards()[0].click();
    assert.equal(storage.get('floras-adventure-save-v1'), saved, 'save is exactly as it was');

    const normal = loadGame({ storage, atStartScreen: true });
    assert.match(normal.text('continue-btn'), /Level 3/, 'normal play still continues from level 3');
});

test('DV-5: ?dev is recognised in any position, and only as its own word', () => {
    const game = loadGame();
    const isDev = (search: string) => game.run<boolean>(`isDevUrl(${JSON.stringify(search)})`);
    for (const yes of ['?dev', '?dev=1', '?dev=', '?a=1&dev', '?dev&a=1']) assert.equal(isDev(yes), true, yes);
    for (const no of ['', '?devx', '?level=dev', '?a=dev', '?developer']) assert.equal(isDev(no), false, no);
});

/** Sets who's following, as if chosen in My pets. */
function team(game: ReturnType<typeof loadGame>, ...species: string[]): void {
    game.run(`state.progress.followers = ${JSON.stringify(species)}; state.progress.roster = ${JSON.stringify(species)};`);
}

/** Highest point Flora's feet reach in a held jump from the ground. */
function jumpPeakFeet(game: ReturnType<typeof loadGame>): number {
    placeFlora(game, 60, 428);
    game.press('ArrowUp');
    let top = 428;
    for (let i = 0; i < 70; i++) {
        game.step();
        top = Math.min(top, game.run<number>('flora.y + flora.height'));
    }
    game.release('ArrowUp');
    return 428 - top;
}

test('PW-1: every pet has a power with a short name and a short, plain description', () => {
    const game = loadGame();
    const powers = game.run<Record<string, { name: string; description: string }>>('PET_POWERS');
    assert.equal(Object.keys(powers).join(), LEVELS.map(l => l.species).join());
    for (const [species, p] of Object.entries(powers)) {
        assert.ok(p.name.split(' ').length <= 3, `${species}'s power name is short`);
        assert.ok(p.description.split(' ').length <= 8, `${species}'s description is short: "${p.description}"`);
        assert.ok(p.description.endsWith('.'), 'descriptions are full sentences');
    }
});

test('PW-2: kitty walks faster, bunny jumps higher, and no power is on without followers', () => {
    const game = loadGame();
    const walk = (): number => {
        placeFlora(game, 100, 428);
        game.press('ArrowRight');
        game.step(20);
        game.release('ArrowRight');
        return game.run<number>('flora.x') - 100;
    };
    const plainWalk = walk();
    const plainJump = jumpPeakFeet(game);
    team(game, 'kitty', 'bunny');
    assert.ok(walk() > plainWalk + 10, 'Quick paws');
    assert.ok(jumpPeakFeet(game) > plainJump + 20, 'Bunny hop');
    team(game);
    assert.equal(walk(), plainWalk, 'back to normal without followers');
});

test('PW-2: duckling falls gently; panda bounces higher on mushrooms', () => {
    const game = loadGame();
    // Check mid-fall (20 ticks), before either reaches the ground
    game.run('flora.x = 100; flora.y = 100; flora.vy = 0; flora.grounded = false; flora.coyoteTimer = 0;');
    game.step(20);
    const plainFall = game.run<number>('flora.vy');
    team(game, 'duckling');
    game.run('flora.x = 100; flora.y = 100; flora.vy = 0; flora.grounded = false;');
    game.step(20);
    assert.ok(game.run<number>('flora.vy') <= 3.2 && plainFall > 6, 'Feather float caps the falling speed');

    const bouncePeak = (): number => {
        goToLevel(game, 1); // Sunny Glade's mushroom at x 640
        game.run('flora.x = 624; flora.y = 340; flora.vy = 0; flora.grounded = false; flora.coyoteTimer = 0;');
        let top = 999;
        for (let i = 0; i < 60; i++) {
            game.step();
            top = Math.min(top, game.run<number>('flora.y'));
        }
        return top;
    };
    team(game);
    const plain = bouncePeak();
    team(game, 'panda');
    assert.ok(bouncePeak() < plain - 30, 'Mushroom fan');
});

test('PW-2: piglet walks through bushes; turtle grips the ice', () => {
    const game = loadGame();
    team(game, 'piglet');
    goToLevel(game, 6); // Bramble Path: first bush at x 400
    placeFlora(game, 330, 428);
    game.press('ArrowRight');
    game.step(40);
    game.release('ArrowRight');
    assert.ok(game.run<number>('flora.x') > 444, 'Bush buddy walks straight through');

    team(game, 'turtle');
    goToLevel(game, 13); // Snowy Peaks: ice at x 400–650
    placeFlora(game, 410, 428);
    game.press('ArrowRight');
    game.step(10);
    game.release('ArrowRight');
    game.step();
    assert.equal(game.run('flora.vx'), 0, 'Steady feet: stops at once on ice');
});

test('PW-2: frog swims across ponds without splashing', () => {
    const game = loadGame();
    team(game, 'frog');
    goToLevel(game, 10); // Lily Pond: first pond x 500–760
    placeFlora(game, 420, 428);
    game.run('flora.safeTimer = 0;');
    game.press('ArrowRight');
    let swam = false;
    for (let i = 0; i < 120; i++) {
        game.step();
        swam = swam || game.run<boolean>('flora.swimming');
    }
    game.release('ArrowRight');
    assert.ok(swam, 'paddled on the water');
    assert.ok(game.run<number>('flora.x') > 760, 'made it to the far bank');
    assert.equal(game.run('state.levelStars.splashes'), 0, 'never splashed');
});

test('PW-2: bird rides the wind', () => {
    const pushedBy = (followers: string[]): number => {
        const game = loadGame();
        team(game, ...followers);
        goToLevel(game, 11); // Windy Hills
        placeFlora(game, 900, 428);
        game.step(230); // into a full gust
        const x = game.run<number>('flora.x');
        game.step(30);
        return x - game.run<number>('flora.x');
    };
    const plain = pushedBy([]);
    assert.ok(plain > 30 && pushedBy(['bird']) < plain / 3, 'Wind rider: hardly pushed');
});

test('PW-3: hamster waters from farther; puppy smells the bone from farther', () => {
    const game = loadGame();
    const sprout = game.run<{ x: number; y: number }>('({ x: state.sprouts[0].x, y: state.sprouts[0].y })');
    // Can is at flora.x + 30 when facing right: 60px short of the sprout is out of normal reach
    placeFlora(game, sprout.x - 30 - 60, sprout.y);
    game.tap('Space');
    assert.equal(game.run('state.sprouts[0].bloomed'), false, 'too far normally');
    team(game, 'hamster');
    placeFlora(game, sprout.x - 30 - 60, sprout.y);
    game.tap('Space');
    assert.equal(game.run('state.sprouts[0].bloomed'), true, 'Big splash reaches');

    const boneX = game.run<number>('state.digMounds.find(m => m.hasBone).x');
    team(game);
    placeFlora(game, boneX - 16 - 150, 428);
    game.run('noodle.barkTimer = 0; noodle.clearSpeech();');
    game.step();
    assert.equal(game.run('noodle.sniffing'), false);
    team(game, 'puppy');
    game.step();
    assert.equal(game.run('noodle.sniffing'), true, 'Super sniffer');
});

test('PW-3: unicorn takes a splash off big flowers, right away from My pets too', () => {
    const game = loadGame();
    goToLevel(game, 3); // Enchanted Garden: a big flower needing 3
    const big = 'state.sprouts.find(s => s.big)';
    assert.equal(game.run(`${big}.waterNeeded`), 3);
    const at = game.run<{ x: number; y: number }>(`(({ x, y }) => ({ x, y }))(${big})`);
    placeFlora(game, at.x - 20, at.y);
    game.tap('Space');
    game.run('flora.waterTimer = 0; flora.isWatering = false;');
    game.tap('Space');
    assert.equal(game.run(`${big}.bloomed`), false, '2 of 3 splashes');
    // Pick the unicorn in My pets mid-level: 2 splashes are now enough
    game.run('state.progress.roster = ["unicorn"];');
    game.click('pause-btn');
    game.click('pause-pets-btn');
    game.rosterCards()[9].click();
    assert.equal(game.run(`${big}.waterNeeded`), 2);
    assert.equal(game.run(`${big}.bloomed`), true, 'blooms at once');
    assert.equal(game.run(`${big}.big`), true, 'still drawn as a sunflower');
});

test('PW-3: snail speeds up the rain; bear makes bees friendly; owl sees farther at night', () => {
    const rainBloomTicks = (followers: string[]): number => {
        const game = loadGame();
        team(game, ...followers);
        goToLevel(game, 12);
        game.run('LEVELS[12].rainClouds[0].range = 0; LEVELS[12].rainClouds[0].x = state.sprouts[0].x; restartLevel();');
        placeFlora(game, 60, 428);
        let t = 0;
        while (!game.run('state.sprouts[0].bloomed') && t < 200) {
            game.step();
            t++;
        }
        return t;
    };
    assert.ok(rainBloomTicks(['snail']) < rainBloomTicks([]) * 0.6, 'Rain friend');

    const game = loadGame();
    team(game, 'bear');
    goToLevel(game, 5);
    const bee = game.run<{ x: number }>('({ x: state.bees[0].x })');
    placeFlora(game, bee.x - 50, 428);
    game.run('flora.safeTimer = 0;');
    game.press('ArrowRight');
    game.step(120);
    game.release('ArrowRight');
    assert.equal(game.run('state.levelStars.bumps'), 0, 'Honey friend: no bumps');

    const floraLight = (followers: string[]): number => {
        const g = loadGame();
        team(g, ...followers);
        goToLevel(g, 14);
        g.run('globalThis.lights = []; weather.drawDarkness = (c, l) => { globalThis.lights = l; };');
        g.step();
        return g.run<number>('globalThis.lights[0].r');
    };
    assert.ok(floraLight(['owl']) > floraLight([]) + 60, 'Night eyes');
});

test('PW-4: My pets shows each power, and says what it does', () => {
    const game = loadGame();
    clearLevel(game);
    game.click('pause-btn');
    game.click('pause-pets-btn');
    assert.match(game.text('roster-hint'), /Tap a pet to see its power/);
    const card = game.rosterCards()[0] as unknown as { children: { innerText: string }[] };
    assert.match(card.children[1].innerText, /Quick paws/, 'power name on the card');
    const locked = game.rosterCards()[5] as unknown as { children: { innerText: string }[]; click(): void };
    assert.match(locked.children[1].innerText, /Feather float/, 'even unrescued pets show what they will give');
    locked.click();
    assert.match(game.text('roster-hint'), /Rescue this pet in level 6 to get Feather float: Fall slowly and land softly/);
});

test('PW-4: a newly rescued pet announces its power', () => {
    const game = loadGame();
    clearLevel(game);
    assert.match(game.run<string>('noodle.speechBubble'), /Milo the Kitty joins you: Quick paws! Walk a little faster/);
});

test('SR-1: picking up the hidden star', () => {
    const game = loadGame();
    const star = game.run<{ x: number; y: number }>('({ x: LEVELS[0].star.x, y: LEVELS[0].star.y })');
    game.run(`flora.x = ${star.x - 16}; flora.y = ${star.y - 24}; flora.vy = 0;`);
    game.step();
    assert.equal(game.run('state.levelStars.found'), true);
    assert.match(game.run<string>('noodle.speechBubble'), /You found the hidden star/);
    // The hint isn't repeated once the star is found
    const later: string[] = [];
    for (let i = 0; i < 900; i++) {
        game.step();
        if (game.run('noodle.barkTimer > 0')) later.push(game.run<string>('noodle.speechBubble'));
    }
    assert.ok(!later.some(l => /Hidden star:/.test(l)), 'hint dropped');
    assert.ok(later.some(l => /Star challenge:/.test(l)), 'the challenge hint still comes');
});

test('SR-2: each challenge can be met, or missed', () => {
    const finishBits = (setup: (g: ReturnType<typeof loadGame>) => void, level = 0): number => {
        const g = loadGame();
        goToLevel(g, level);
        setup(g);
        return g.run<number>('starsForFinish()');
    };
    // Level 1: water every flower before digging
    assert.equal(finishBits(g => { bloomAll(g); digBone(g); }) & 4, 4, 'flowers first: met');
    assert.equal(finishBits(g => { digBone(g); bloomAll(g); }) & 4, 0, 'dug too early: missed');
    // Level 2: bone on the first dig
    assert.equal(finishBits(g => digBone(g), 1) & 4, 4, 'first dig: met');
    assert.equal(finishBits(g => {
        const decoy = g.run<number>('state.digMounds.find(m => !m.hasBone).x');
        placeFlora(g, decoy - 16, 428);
        g.tap('ArrowDown');
    }, 1) & 4, 0, 'wrong first dig: missed');
    // Level 6: no bee bumps; level 11: no splashes
    assert.equal(finishBits(g => g.run('state.levelStars.bumps = 1;'), 5) & 4, 0, 'bumped: missed');
    assert.equal(finishBits(() => {}, 5) & 4, 4, 'no bumps: met');
    assert.equal(finishBits(g => g.run('state.levelStars.splashes = 1;'), 10) & 4, 0, 'splashed: missed');
    // Rescue is always a star; the hidden star only once found
    assert.equal(finishBits(() => {}) & 1, 1);
    assert.equal(finishBits(() => {}) & 2, 0);
    assert.equal(finishBits(g => g.run('state.levelStars.found = true;')) & 2, 2);
});

test('SR-3: finishing saves the best stars, shown in the level list and the start screen total', () => {
    const storage = new Map<string, string>();
    const game = loadGame({ storage });
    game.run('state.levelStars.found = true;');
    clearLevel(game); // rescue + hidden + flowers first
    let saved = JSON.parse(storage.get('floras-adventure-save-v1')!);
    assert.equal(saved.stars[0], 7, 'all three stars');

    game.run('startGame(0);');
    clearLevel(game); // a worse run: no hidden star this time
    saved = JSON.parse(storage.get('floras-adventure-save-v1')!);
    assert.equal(saved.stars[0], 7, 'the best is kept');

    const reloaded = loadGame({ storage, atStartScreen: true });
    assert.match(reloaded.text('star-total'), /⭐ 3 \/ 45 stars/);
    reloaded.click('levels-btn');
    assert.ok(reloaded.levelCards()[0].innerText.includes('★★★'));
});

test('SR-4: Noodle gives the star hints when a level starts', () => {
    const game = loadGame();
    game.run('noodle.update(flora.x, state.digMounds, false, false, () => {});');
    const said: string[] = [];
    for (let i = 0; i < 900; i++) {
        game.step();
        const line = game.run<string>('noodle.barkTimer > 0 ? noodle.speechBubble : ""');
        if (line && said[said.length - 1] !== line) said.push(line);
    }
    assert.ok(said.some(l => /Hidden star: Jump high from the left ledge/.test(l)), said.join(' | '));
    assert.ok(said.some(l => /Star challenge: Water every flower before you dig up the bone/.test(l)));
});

test('SR-5: the pause menu lists the star goals and your team', () => {
    const game = loadGame();
    clearLevel(game);
    digBone(game); // on level 2, the first dig always finds the bone in this helper: challenge still on
    game.click('pause-btn');
    const goals = game.elements['pause-stars'].items as string[];
    assert.equal(goals.length, 3);
    assert.match(goals[0], /⬜ Rescue Pip the Puppy/);
    assert.match(goals[1], /⬜ Find the hidden star: Jump up from the middle ledge/);
    assert.match(goals[2], /⬜ Find the bone on your very first dig/);
    const teamList = game.elements['pause-team'].items as string[];
    assert.match(teamList[0], /Quick paws: Walk a little faster/);

    game.run('state.levelStars.found = true; state.levelStars.wrongDigs = 1;');
    game.click('resume-btn');
    game.click('pause-btn');
    const again = game.elements['pause-stars'].items as string[];
    assert.match(again[1], /✅/);
    assert.match(again[2], /❌.*try again next time/);
});

test('SR-6: older saves get a rescue star for every level already beaten', () => {
    const storage = new Map([['floras-adventure-save-v1', '{"level":3,"unlocked":3}']]);
    const game = loadGame({ storage, atStartScreen: true });
    assert.equal(game.run('state.progress.stars.slice(0, 4).join()'), '1,1,1,0');
    assert.match(game.text('star-total'), /⭐ 3 \/ 45/);
});
