/** The fixed 60-ticks-per-second game loop, and fitting the game box to the window. */
import { dom } from './dom.ts';
import { keys, pressed } from './input.ts';
import { checkDigging, checkWatering, updateDoghouse, updateHiddenStar, updateKey, updateLevelClear } from './level.ts';
import { render } from './scene.ts';
import { audio, butterflies, flora, hasPower, noodle, particleSystem, skyVisitors, state, weather } from './state.ts';
import { currentWind, updateBees, updateCamera, updateMovingPlatforms, updateParade, updatePond, updateRain } from './world.ts';
import { movesFor, POWER_TUNING } from '../powers.ts';
import { CANVAS_HEIGHT, CANVAS_WIDTH, STAGE_HEIGHT, STAGE_WIDTH, fitScale } from '../layout.ts';
import { LEVELS, TICK_MS, levelWidth } from '../levels.ts';
import type { PhysicsWorld } from '../types.ts';

/** Advances the simulation by exactly one fixed tick (1/60 s). */
export function update(): void {
    // Butterflies keep fluttering on every screen, including behind the start screen.
    butterflies.update();
    skyVisitors.update();
    const wind = state.screen === 'playing' ? currentWind() : { x: 0, soon: false };
    weather.update(wind.x, wind.soon);
    tick();
    for (const code of Object.keys(pressed)) pressed[code] = false;
}

export function tick(): void {
    if (state.screen !== 'playing') return;

    updateKey();
    updateHiddenStar();
    updateParade();
    updateMovingPlatforms();

    const level = LEVELS[state.currentLevel];
    const world: PhysicsWorld = {
        platforms: [...level.platforms, ...(level.lilyPads ?? []), ...state.movingPlatforms],
        mushrooms: level.mushrooms ?? [],
        bushes: level.bushes ?? [],
        water: level.water ?? [],
        ice: level.ice ?? [],
        // Wind rider (bird): gusts hardly push.
        windX: state.levelClearTimer > 0 ? 0 : currentWind().x * (hasPower('bird') ? POWER_TUNING.windFactor : 1),
        width: levelWidth(level),
        moves: movesFor(state.progress.followers)
    };
    flora.update(
        keys,
        pressed,
        world,
        state.levelClearTimer > 0,
        type => audio.playSound(type),
        checkWatering,
        checkDigging
    );
    // Super sniffer (puppy): Noodle smells the bone from much farther away.
    const sniffRange = hasPower('puppy') ? POWER_TUNING.superSniffRange : POWER_TUNING.sniffRange;
    noodle.update(flora.x, state.digMounds, state.boneFound, false, type => audio.playSound(type), sniffRange);
    updatePond();
    if (state.levelClearTimer === 0) {
        updateBees();
        updateRain();
    }
    particleSystem.update();
    updateCamera();

    updateDoghouse();
    updateLevelClear();
}

export function fitToScreen(): void {
    // clientWidth/Height ignore mobile zoom-out; innerWidth grows when content overflows the screen.
    const root = document.documentElement;
    const scale = fitScale(root.clientWidth || window.innerWidth, root.clientHeight || window.innerHeight);
    dom.stage.style.width = `${Math.floor(STAGE_WIDTH * scale)}px`;
    dom.stage.style.height = `${Math.floor(STAGE_HEIGHT * scale)}px`;
    dom.container.style.transform = `scale(${scale})`;

    state.pixelScale = scale * (window.devicePixelRatio || 1);
    dom.canvas.width = Math.round(CANVAS_WIDTH * state.pixelScale);
    dom.canvas.height = Math.round(CANVAS_HEIGHT * state.pixelScale);
}

// Run the simulation at a fixed 60 ticks/s regardless of monitor refresh rate,
// so 120 Hz displays don't play at double speed.
export let lastFrameTime: number | null = null;

export let tickAccumulator: number = 0;

export function frame(now: number): void {
    // Book the next frame first, so an error below can never stop the game loop for good.
    requestAnimationFrame(frame);
    try {
        advance(now);
    } catch (err) {
        console.error('Frame failed; the game keeps running', err);
    }
}

export function advance(now: number): void {
    if (lastFrameTime !== null) {
        // Cap catch-up after a backgrounded tab so the game doesn't fast-forward.
        tickAccumulator += Math.min(now - lastFrameTime, 250);
    } else {
        tickAccumulator = TICK_MS;
    }
    lastFrameTime = now;

    while (tickAccumulator >= TICK_MS) {
        tickAccumulator -= TICK_MS;
        update();
    }
    render();
}
