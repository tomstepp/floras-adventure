import { AudioController } from './audio.ts';
import { Noodle, Player } from './entities.ts';
import {
    DIG_RANGE,
    DOGHOUSE_ENTRY_X,
    DOGHOUSE_X,
    FLOWER_COLORS,
    GROUND_Y,
    LEVEL_CLEAR_FRAMES,
    LEVELS,
    TICK_MS
} from './levels.ts';
import { ParticleSystem } from './particles.ts';
import {
    drawCelebrationBanner,
    drawDoghouse,
    drawKey,
    drawPlatforms,
    drawRainbow,
    drawRescuedPet,
    drawSprouts,
    drawSun,
    drawTreeAndGround
} from './renderer.ts';
import type { DigMound, RescuedFriend, Sprout } from './types.ts';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const musicBtn = document.getElementById('music-btn') as HTMLButtonElement;
const victoryDialog = document.getElementById('victory-dialog') as HTMLDialogElement;
const levelDisplay = document.getElementById('level-display') as HTMLElement;
const statusDisplay = document.getElementById('status-display') as HTMLElement;
const objectiveDisplay = document.getElementById('objective-display') as HTMLElement;

const audio = new AudioController();
const particleSystem = new ParticleSystem();

let currentLevel: number = 0;
let gamePaused: boolean = false;
let levelClearTimer: number = 0;

let flora: Player = new Player();
let noodle: Noodle = new Noodle();
let sprouts: Sprout[] = [];
let digMounds: DigMound[] = [];
let rescuedFriends: RescuedFriend[] = [];
let boneFound: boolean = false;
let boneX: number = 400;
let keyCollected: boolean = false;
let keyX: number = 530;
let keyY: number = 315;

const keys: Record<string, boolean> = {};

function clearKeys(): void {
    for (const code of Object.keys(keys)) keys[code] = false;
}

window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code) && !gamePaused) {
        e.preventDefault();
    }
    if (e.code === 'KeyR' && !e.repeat && !gamePaused && levelClearTimer === 0) {
        restartLevel();
    }
    keys[e.code] = true;
});
window.addEventListener('keyup', (e: KeyboardEvent) => {
    keys[e.code] = false;
});
// Releasing a key while the window is unfocused never fires keyup, which left Flora running forever.
window.addEventListener('blur', clearKeys);

musicBtn.addEventListener('click', () => {
    audio.toggle(currentLevel, musicBtn);
});

victoryDialog.addEventListener('close', () => {
    currentLevel = 0;
    rescuedFriends = [];
    clearKeys();
    initLevel();
    flora.reset();
    gamePaused = false;
});

export function allBloomed(): boolean {
    return sprouts.every(s => s.bloomed);
}

export function objectiveText(): string {
    if (levelClearTimer > 0) return `🎉 You rescued ${LEVELS[currentLevel].pet}!`;
    if (keyCollected) return '🏠 Bring the key to the doghouse!';
    if (!allBloomed()) return '💦 Water every sprout with E';
    if (!boneFound) return "🦴 Follow Noodle's nose and dig for the bone";
    return '🔑 Grab the shiny key!';
}

export function updateStatus(): void {
    const bloomedCount = sprouts.filter(s => s.bloomed).length;
    statusDisplay.innerText = `Flowers: ${bloomedCount}/${LEVELS[currentLevel].flowersNeeded} | Bone: ${boneFound ? '🦴' : '❌'} | Key: ${keyCollected ? '🔑' : '❌'}`;
    objectiveDisplay.innerText = objectiveText();
}

export function initLevel(): void {
    const level = LEVELS[currentLevel];
    sprouts = [];
    digMounds = [];
    particleSystem.clear();
    boneFound = false;
    keyCollected = false;
    levelClearTimer = 0;
    keyX = level.keyPos.x;
    keyY = level.keyPos.y;

    level.sprouts.forEach((pos, i) => {
        sprouts.push({
            x: pos.x,
            y: pos.y,
            bloomed: false,
            color: FLOWER_COLORS[i % FLOWER_COLORS.length],
            danceOffset: Math.random() * Math.PI * 2
        });
    });

    const boneIdx = Math.floor(Math.random() * level.mounds.length);
    level.mounds.forEach((mx, idx) => {
        digMounds.push({
            x: mx,
            y: GROUND_Y,
            hasBone: idx === boneIdx,
            dug: false
        });
    });
    boneX = level.mounds[boneIdx];

    levelDisplay.innerText = `Level ${currentLevel + 1}: ${level.name}`;
    updateStatus();
    if (audio.enabled) audio.startBgMusic(currentLevel);
}

export function restartLevel(): void {
    initLevel();
    flora.reset();
}

export function checkWatering(): void {
    const canCenterX = flora.facing === 'right' ? flora.x + 30 : flora.x + 2;
    const floraFeetY = flora.y + flora.height;
    for (const s of sprouts) {
        if (!s.bloomed && Math.abs(canCenterX - s.x) < 48 && Math.abs(floraFeetY - s.y) < 48) {
            s.bloomed = true;
            audio.playSound('bloom');
            particleSystem.spawn(s.x, s.y - 24, s.color, 14, 'circle');
            particleSystem.spawn(s.x, s.y - 28, '#FFEAA7', 6, 'star');
        }
    }
    updateStatus();
}

export function checkDigging(): void {
    if (flora.y + flora.height < GROUND_Y - 5) return;
    const playerCenterX = flora.x + flora.width / 2;
    // Pick the closest undug mound so an already-dug neighbour can't block a nearby one.
    let mound: DigMound | undefined;
    for (const m of digMounds) {
        if (m.dug || Math.abs(playerCenterX - m.x) >= DIG_RANGE) continue;
        if (!mound || Math.abs(playerCenterX - m.x) < Math.abs(playerCenterX - mound.x)) mound = m;
    }

    particleSystem.spawn(mound ? mound.x : playerCenterX, GROUND_Y - 4, '#8D6E63', 8, 'circle');
    if (!mound) return;

    mound.dug = true;
    if (mound.hasBone) {
        boneFound = true;
        boneX = mound.x;
        audio.playSound('key');
        particleSystem.spawn(mound.x, GROUND_Y - 10, '#F1C40F', 16, 'star');
        noodle.barkTimer = 75;
        noodle.speechBubble = allBloomed() ? "Woof! Found it! 🦴" : "Bone! Now water the flowers! 🌸";
        updateStatus();
    } else {
        noodle.barkTimer = 60;
        noodle.speechBubble = "Keep sniffing! 🐾";
    }
}

function updateKey(): void {
    if (keyCollected || !allBloomed() || !boneFound) return;
    const floraCenterX = flora.x + flora.width / 2;
    const floraCenterY = flora.y + flora.height / 2;
    if (Math.abs(floraCenterX - keyX) < 34 && Math.abs(floraCenterY - keyY) < 42) {
        keyCollected = true;
        audio.playSound('key');
        particleSystem.spawn(keyX, keyY, '#F1C40F', 18, 'star');
        updateStatus();
    }
}

function updateDoghouse(): void {
    if (flora.x <= DOGHOUSE_ENTRY_X || levelClearTimer > 0) return;
    if (keyCollected) {
        levelClearTimer = LEVEL_CLEAR_FRAMES;
        audio.playSound('victory');
        particleSystem.spawn(DOGHOUSE_X, 395, '#FF7675', 14, 'heart');
        particleSystem.spawn(DOGHOUSE_X, 385, '#F1C40F', 20, 'star');
        updateStatus();
    } else if (noodle.barkTimer <= 0) {
        noodle.barkTimer = 70;
        noodle.speechBubble = "It's locked! Need the key 🔑";
    }
}

function updateLevelClear(): void {
    if (levelClearTimer <= 0) return;
    if (levelClearTimer % 15 === 0) {
        particleSystem.spawn(DOGHOUSE_X + (Math.random() - 0.5) * 40, 390, '#FFEAA7', 8, 'star');
    }

    levelClearTimer--;
    if (levelClearTimer > 0) return;

    rescuedFriends.push({
        species: LEVELS[currentLevel].species,
        x: noodle.x - (rescuedFriends.length + 1) * 28,
        y: 416
    });

    if (currentLevel === LEVELS.length - 1) {
        gamePaused = true;
        updateStatus();
        victoryDialog.showModal();
    } else {
        currentLevel++;
        restartLevel();
    }
}

function updateParade(): void {
    rescuedFriends.forEach((pet, idx) => {
        const leaderX = idx === 0 ? noodle.x : rescuedFriends[idx - 1].x;
        pet.x += (leaderX - 28 - pet.x) * 0.08;
    });
}

/** Advances the simulation by exactly one fixed tick (1/60 s). */
export function update(): void {
    if (gamePaused) return;

    updateKey();
    updateParade();

    flora.update(
        keys,
        LEVELS[currentLevel].platforms,
        canvas.width,
        levelClearTimer > 0,
        type => audio.playSound(type),
        checkWatering,
        checkDigging
    );
    noodle.update(flora.x, digMounds, boneFound, false, type => audio.playSound(type));
    particleSystem.update();

    updateDoghouse();
    updateLevelClear();
}

export function render(): void {
    const level = LEVELS[currentLevel];
    ctx.fillStyle = level.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawRainbow(ctx);
    drawSun(ctx);
    drawTreeAndGround(ctx, canvas.width, level.treeX, digMounds, boneFound, boneX);
    drawPlatforms(ctx, level.platforms);
    drawSprouts(ctx, sprouts, allBloomed());
    drawDoghouse(ctx);

    if (keyCollected) {
        drawRescuedPet(ctx, level.species, DOGHOUSE_X, 416);
    } else if (allBloomed() && boneFound) {
        drawKey(ctx, keyX, keyY);
    }

    for (const pet of rescuedFriends) drawRescuedPet(ctx, pet.species, pet.x, 416);
    flora.draw(ctx);
    noodle.draw(ctx);
    particleSystem.draw(ctx);

    if (levelClearTimer > 0) drawCelebrationBanner(ctx, level.pet);
}

// Run the simulation at a fixed 60 ticks/s regardless of monitor refresh rate,
// so 120 Hz displays don't play at double speed.
let lastFrameTime: number | null = null;
let tickAccumulator: number = 0;

function frame(now: number): void {
    if (lastFrameTime !== null) {
        // Cap catch-up after a backgrounded tab so the game doesn't fast-forward.
        tickAccumulator += Math.min(now - lastFrameTime, 250);
    } else {
        tickAccumulator = TICK_MS;
    }
    lastFrameTime = now;

    while (tickAccumulator >= TICK_MS) {
        update();
        tickAccumulator -= TICK_MS;
    }
    render();
    requestAnimationFrame(frame);
}

initLevel();
requestAnimationFrame(frame);
