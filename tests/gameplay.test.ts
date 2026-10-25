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

test('CT-2: Flora can jump onto a platform and stand on it', () => {
    const game = loadGame();
    placeFlora(game, 250, 428);
    game.tap('Space');
    game.step(45);
    assert.equal(game.run('flora.grounded'), true);
    assert.equal(game.run('flora.y + flora.height'), 345);
});

test('CT-2: Flora cannot jump while airborne', () => {
    const game = loadGame();
    placeFlora(game, 50, 428);
    game.tap('Space');
    game.step(5);
    const vy = game.run<number>('flora.vy');
    game.tap('Space');
    assert.ok(game.run<number>('flora.vy') > vy, 'second press should not reset upward velocity');
});

test('CT-3: an elevated sprout cannot be watered from the ground, but can from its platform', () => {
    const game = loadGame();
    placeFlora(game, 250, 428);
    game.tap('KeyE');
    assert.equal(game.run('sprouts[1].bloomed'), false);

    placeFlora(game, 250, 345);
    game.tap('KeyE');
    assert.equal(game.run('sprouts[1].bloomed'), true);
    assert.equal(game.text('status-display'), 'Flowers: 1/3 | Bone: ❌ | Key: ❌');
});

test('CT-4: digging does nothing while standing on a platform', () => {
    const game = loadGame();
    placeFlora(game, 250, 345);
    game.tap('KeyS');
    assert.equal(game.run('digMounds.some(m => m.dug)'), false);
});

test('LV-2: digging an empty mound marks it dug and keeps the bone hidden', () => {
    const game = loadGame();
    const decoyX = game.run<number>('digMounds.find(m => !m.hasBone).x');
    placeFlora(game, decoyX - 16, 428);
    game.tap('KeyS');
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
    game.tap('KeyS');
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

test('CT-5: R restarts the current level', () => {
    const game = loadGame();
    clearLevel(game);
    bloomAll(game);
    digBone(game);
    placeFlora(game, 400, 428);
    game.tap('KeyR');
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
