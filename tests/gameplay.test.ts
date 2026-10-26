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
    game.press('Space');
    let minY = 380;
    for (let i = 0; i < 60; i++) {
        if (i === holdTicks) game.release('Space');
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
    assert.equal(game.run('sprouts[0].bloomed || digMounds.some(m => m.dug)'), false);
});

test('CT-2: the up arrow waters instead of jumping', () => {
    const game = loadGame();
    placeFlora(game, 100, 428);
    game.tap('ArrowUp');
    game.step();
    assert.equal(game.run('flora.y'), 380);
    assert.equal(game.run('flora.isWatering'), true);
});

test('CT-2: holding Space jumps onto a platform', () => {
    const game = loadGame();
    placeFlora(game, 250, 428);
    game.press('Space');
    game.step(45);
    game.release('Space');
    assert.equal(game.run('flora.grounded'), true);
    assert.equal(game.run('flora.y + flora.height'), 345);
});

test('CT-2: Flora cannot jump again while airborne', () => {
    const game = loadGame();
    placeFlora(game, 50, 428);
    game.press('Space');
    game.step(15);
    const vy = game.run<number>('flora.vy');
    game.release('Space');
    game.tap('Space');
    assert.ok(game.run<number>('flora.vy') > vy, 'second press should not reset upward velocity');
});

test('CT-8: holding Space does not keep bouncing', () => {
    const game = loadGame();
    placeFlora(game, 50, 428);
    game.press('Space');
    game.step(80); // long enough to jump, land, and sit still
    assert.equal(game.run('flora.grounded'), true);
    game.step(10);
    assert.equal(game.run('flora.y'), 380);
});

test('CT-9: a tap shorter than one tick still jumps (as a short hop)', () => {
    const game = loadGame();
    placeFlora(game, 50, 428);
    game.press('Space');
    game.release('Space'); // both between two ticks
    let minY = 380;
    for (let i = 0; i < 40; i++) {
        game.step();
        minY = Math.min(minY, game.run<number>('flora.y'));
    }
    assert.ok(380 - minY > 5 && 380 - minY < 40, `hop reached ${380 - minY}px`);
});

test('CT-9: tapping Space gives a short hop; holding gives a full jump', () => {
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
        game.tap('Space');
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
        game.press('Space');
        game.step(ticksEarly + 2);
        return game.run<number>('flora.vy') < -5;
    };
    assert.equal(jumpPressedBeforeLanding(4), true);
    assert.equal(jumpPressedBeforeLanding(10), false);
});

test('CT-3: an elevated sprout cannot be watered from the ground, but can from its platform', () => {
    const game = loadGame();
    placeFlora(game, 250, 428);
    game.tap('ArrowUp');
    assert.equal(game.run('sprouts[1].bloomed'), false);

    placeFlora(game, 250, 345);
    game.tap('ArrowUp');
    assert.equal(game.run('sprouts[1].bloomed'), true);
    assert.equal(game.text('status-display'), 'Flowers: 1/3 | Bone: ❌ | Key: ❌');
});

test('CT-4: digging does nothing while standing on a platform', () => {
    const game = loadGame();
    placeFlora(game, 250, 345);
    game.tap('ArrowDown');
    assert.equal(game.run('digMounds.some(m => m.dug)'), false);
});

test('LV-2: digging an empty mound marks it dug and keeps the bone hidden', () => {
    const game = loadGame();
    const decoyX = game.run<number>('digMounds.find(m => !m.hasBone).x');
    placeFlora(game, decoyX - 16, 428);
    game.tap('ArrowDown');
    assert.equal(game.run(`digMounds.find(m => m.x === ${decoyX}).dug`), true);
    assert.equal(game.run('boneFound'), false);
    assert.equal(game.run('noodle.speechBubble'), 'Keep sniffing! 🐾');
});

test('LV-2: digging picks the closest undug mound, even next to a dug one', () => {
    const game = loadGame();
    game.run('currentLevel = 3; restartLevel();'); // Enchanted Garden: mounds at 210 and 300 are 90px apart
    game.run('digMounds.forEach(m => { m.hasBone = false; }); digMounds[1].hasBone = true;');
    game.run('digMounds[0].dug = true;');
    placeFlora(game, 255 - 16, 428); // centre at 255: within range of both 210 and 300
    game.tap('ArrowDown');
    assert.equal(game.run('boneFound'), true, 'should dig the undug mound at 300');
});

test('LV-2: the bone can be dug before every flower blooms', () => {
    const game = loadGame();
    digBone(game);
    assert.equal(game.run('boneFound'), true);
    assert.equal(game.run('keyCollected'), false);
});

test('LV-3: Noodle sniffs out the bone when Flora is nearby', () => {
    const game = loadGame();
    const boneX = game.run<number>('digMounds.find(m => m.hasBone).x');
    placeFlora(game, boneX - 30, 428);
    game.run('noodle.barkTimer = 0;');
    game.step();
    assert.equal(game.run('noodle.sniffing'), true);
    assert.equal(game.run('noodle.speechBubble'), '🦴 Dig here!');
});

test('LV-4: the key cannot be collected until flowers and bone are done', () => {
    const game = loadGame();
    collectKey(game);
    assert.equal(game.run('keyCollected'), false);

    bloomAll(game);
    collectKey(game);
    assert.equal(game.run('keyCollected'), false, 'still needs the bone');

    digBone(game);
    assert.match(game.text('objective-display'), /key/);
    collectKey(game);
    assert.equal(game.run('keyCollected'), true);
    assert.match(game.text('objective-display'), /doghouse/);
});

test('LV-5: reaching the doghouse without the key does not end the level', () => {
    const game = loadGame();
    bloomAll(game);
    digBone(game);
    placeFlora(game, 690, 428);
    game.run('noodle.barkTimer = 0;');
    game.step();
    assert.equal(game.run('levelClearTimer'), 0);
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
    assert.ok(game.run<number>('levelClearTimer') > 0, 'celebration should start');
    assert.match(game.text('objective-display'), /rescued Milo the Kitty/);

    game.step(75);
    assert.equal(game.run('currentLevel'), 1);
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
    assert.equal(game.run('currentLevel'), 1);
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
    assert.equal(game.run('currentLevel'), 1);
    assert.equal(game.run('rescuedFriends.length'), 1);
    assert.equal(game.run('rescuedFriends[0].species'), 'kitty');
    assert.equal(game.run('flora.x'), 50);
    assert.equal(game.run('boneFound || keyCollected'), false);
    assert.equal(game.run('sprouts.length'), LEVELS[1].sprouts.length);
    assert.equal(game.text('status-display'), 'Flowers: 0/4 | Bone: ❌ | Key: ❌');
});

test('LV-7: clearing all five levels opens the victory dialog, closing it restarts', () => {
    const game = loadGame();
    for (let lvl = 0; lvl < LEVELS.length; lvl++) {
        assert.equal(game.run('currentLevel'), lvl);
        assert.equal(game.run('rescuedFriends.length'), lvl);
        clearLevel(game);
    }
    assert.equal(game.dialog.open, true);
    assert.equal(game.run('gamePaused'), true);
    assert.equal(game.run('rescuedFriends.map(f => f.species).join()'), LEVELS.map(l => l.species).join());

    // The game stays frozen behind the dialog.
    const x = game.run<number>('flora.x');
    game.press('ArrowLeft');
    game.step(10);
    assert.equal(game.run('flora.x'), x);

    game.dialog.close();
    assert.equal(game.run('currentLevel'), 0);
    assert.equal(game.run('rescuedFriends.length'), 0);
    assert.equal(game.run('gamePaused'), false);
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
    assert.equal(game.run('currentLevel'), 1);
    assert.equal(game.run('sprouts.some(s => s.bloomed)'), false);
    assert.equal(game.run('boneFound'), false);
    assert.equal(game.run('flora.x'), 50);
    assert.equal(game.run('rescuedFriends.length'), 1, 'already-rescued pets stay');
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

    game.touch('Space', 'pointerdown');
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
