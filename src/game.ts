import { AudioController } from './audio.ts';
import { ButterflySwarm } from './butterflies.ts';
import { Noodle, Player } from './entities.ts';
import {
    CONTROLS,
    BEE_RADIUS,
    BIG_FLOWER_COLOR,
    DIG_RANGE,
    doghouseEntryX,
    doghouseX,
    FLOWER_COLORS,
    GROUND_Y,
    LEVEL_CLEAR_FRAMES,
    LEVELS,
    levelWidth,
    RAINBOW_SWEEP_FRAMES,
    TICK_MS
} from './levels.ts';
import { CANVAS_HEIGHT, CANVAS_WIDTH, fitScale, STAGE_HEIGHT, STAGE_WIDTH } from './layout.ts';
import { ParticleSystem } from './particles.ts';
import { getStorage, loadSave, writeSave } from './save.ts';
import type { SaveData } from './save.ts';
import {
    drawBee,
    drawBushes,
    drawCelebrationBanner,
    drawCloudPlatforms,
    drawDoghouse,
    drawKey,
    drawMushrooms,
    drawOffscreenArrow,
    drawPlatforms,
    drawRainbow,
    drawRescuedPet,
    drawSprouts,
    drawSun,
    drawTreeAndGround,
    PET_EMOJI
} from './renderer.ts';
import type { DigMound, Platform, Point, RescuedFriend, Sprout } from './types.ts';

const stage = document.getElementById('game-stage') as HTMLElement;
const container = document.getElementById('game-container') as HTMLElement;
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const musicBtn = document.getElementById('music-btn') as HTMLButtonElement;
const restartBtn = document.getElementById('restart-btn') as HTMLButtonElement;
const victoryDialog = document.getElementById('victory-dialog') as HTMLDialogElement;
const levelDisplay = document.getElementById('level-display') as HTMLElement;
const statusDisplay = document.getElementById('status-display') as HTMLElement;
const objectiveDisplay = document.getElementById('objective-display') as HTMLElement;
const startScreen = document.getElementById('start-screen') as HTMLElement;
const playBtn = document.getElementById('play-btn') as HTMLButtonElement;
const continueBtn = document.getElementById('continue-btn') as HTMLButtonElement;
const rescuedList = document.getElementById('rescued-list') as HTMLElement;
const pauseBtn = document.getElementById('pause-btn') as HTMLButtonElement;
const pauseScreen = document.getElementById('pause-screen') as HTMLElement;
const resumeBtn = document.getElementById('resume-btn') as HTMLButtonElement;
const pauseRestartBtn = document.getElementById('pause-restart-btn') as HTMLButtonElement;
const pauseLevelsBtn = document.getElementById('pause-levels-btn') as HTMLButtonElement;
const pauseMenuBtn = document.getElementById('pause-menu-btn') as HTMLButtonElement;
const levelsBtn = document.getElementById('levels-btn') as HTMLButtonElement;
const levelSelect = document.getElementById('level-select') as HTMLElement;
const levelGrid = document.getElementById('level-grid') as HTMLElement;
const levelsBackBtn = document.getElementById('levels-back-btn') as HTMLButtonElement;
const victoryText = document.getElementById('victory-text') as HTMLElement;

const audio = new AudioController();
const particleSystem = new ParticleSystem();
const butterflies = new ButterflySwarm();
const storage = getStorage();
/** Continue point and furthest level reached, kept in memory and mirrored to storage. */
let progress: SaveData = loadSave(storage, LEVELS.length);

type Screen = 'start' | 'playing' | 'paused' | 'levels' | 'victory';
let screen: Screen = 'start';
/** Where the level list's Back button goes. */
let levelsReturnTo: 'start' | 'paused' = 'start';
let currentLevel: number = 0;
let levelClearTimer: number = 0;
/** Ticks since the level started; drives moving platforms and bees. */
let levelTicks: number = 0;
/** Left edge of the visible part of the level; levels wider than the screen scroll. */
let cameraX: number = 0;
/** Where each bee is this tick, and which way it's flying. */
let bees: (Point & { facingLeft: boolean })[] = [];

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
/** Where each of the level's moving platforms is this tick. */
let movingPlatforms: Platform[] = [];

const keys: Record<string, boolean> = {};
/** Keys that went down since the last tick, so a tap shorter than one tick still counts. */
const pressed: Record<string, boolean> = {};

function pressKey(code: string): void {
    if (!keys[code]) pressed[code] = true;
    keys[code] = true;
}

function clearKeys(): void {
    for (const code of Object.keys(keys)) keys[code] = false;
}

const GAME_KEYS: readonly string[] = Object.values(CONTROLS);

window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (GAME_KEYS.includes(e.code) && screen === 'playing') {
        e.preventDefault();
    }
    if (e.code === 'Escape' && !e.repeat) {
        if (screen === 'playing') pauseGame();
        else if (screen === 'paused') resumeGame();
        else if (screen === 'levels') closeLevelSelect();
    }
    pressKey(e.code);
});
window.addEventListener('keyup', (e: KeyboardEvent) => {
    keys[e.code] = false;
});
// Releasing a key while the window is unfocused never fires keyup, which left Flora running forever.
window.addEventListener('blur', () => {
    clearKeys();
    // Switching apps or tabs shouldn't leave the game running unattended.
    if (screen === 'playing') pauseGame();
});
document.addEventListener('visibilitychange', () => {
    if (document.hidden && screen === 'playing') pauseGame();
});

// On-screen buttons hold down the same key codes the keyboard does while a finger is on them.
for (const btn of document.querySelectorAll<HTMLElement>('[data-key]')) {
    const code = btn.dataset.key as string;
    const release = (): void => {
        keys[code] = false;
        btn.classList.remove('pressed');
    };
    btn.addEventListener('pointerdown', (e: PointerEvent) => {
        e.preventDefault();
        pressKey(code);
        btn.classList.add('pressed');
        try {
            // Keeps the button held if the finger slides off it slightly.
            btn.setPointerCapture(e.pointerId);
        } catch {
            // Unknown pointer id (e.g. synthetic events); the press still counts.
        }
    });
    btn.addEventListener('pointerup', release);
    btn.addEventListener('pointercancel', release);
    btn.addEventListener('lostpointercapture', release);
    btn.addEventListener('contextmenu', (e: Event) => e.preventDefault());
}

musicBtn.addEventListener('click', () => {
    audio.toggle(currentLevel, musicBtn);
});

restartBtn.addEventListener('click', () => {
    // Blur so a later Space press waters instead of clicking Restart again.
    restartBtn.blur();
    if (screen === 'playing' && levelClearTimer === 0) restartLevel();
});

function saveProgress(level: number | null): void {
    progress = { level, unlocked: Math.max(progress.unlocked, level ?? 0) };
    writeSave(storage, progress);
}

/** Drops held and just-pressed keys, so menu key presses never leak into play. */
function dropInput(): void {
    clearKeys();
    for (const code of Object.keys(pressed)) pressed[code] = false;
}

/** Shows exactly one menu overlay (or none), and hides touch controls while any is up. */
function showOverlay(overlay: HTMLElement | null): void {
    for (const el of [startScreen, pauseScreen, levelSelect]) el.hidden = el !== overlay;
    if (overlay) document.body.classList.add('menu-open');
    else document.body.classList.remove('menu-open');
}

/** Starts play at `level`, with every earlier pet already in the parade. */
export function startGame(level: number): void {
    currentLevel = level;
    rescuedFriends = LEVELS.slice(0, level).map((l, i) => ({ species: l.species, x: 20 - (i + 1) * 28, y: 416 }));
    // Continue picks up from whichever level you're on; level 1 is just "New game".
    saveProgress(level > 0 ? level : null);
    noodle.x = 20;
    restartLevel();
    dropInput();
    screen = 'playing';
    showOverlay(null);
}

export function showStartScreen(): void {
    screen = 'start';
    const canContinue = progress.level !== null;
    continueBtn.hidden = !canContinue;
    if (progress.level !== null) continueBtn.innerText = `▶ Continue — Level ${progress.level + 1}`;
    playBtn.innerText = canContinue ? '🌱 New game' : '▶ Play';
    showOverlay(startScreen);
    (canContinue ? continueBtn : playBtn).focus();
}

export function pauseGame(): void {
    if (screen !== 'playing') return;
    screen = 'paused';
    dropInput();
    showOverlay(pauseScreen);
    resumeBtn.focus();
}

export function resumeGame(): void {
    if (screen !== 'paused') return;
    dropInput();
    screen = 'playing';
    showOverlay(null);
}

/** The level list: every level up to the furthest one reached can be picked. */
export function openLevelSelect(from: 'start' | 'paused'): void {
    levelsReturnTo = from;
    screen = 'levels';
    levelGrid.replaceChildren(
        ...LEVELS.map((level, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'level-card';
            const locked = i > progress.unlocked;
            const beaten = i < progress.unlocked;
            btn.disabled = locked;
            if (locked) btn.classList.add('locked');
            if (beaten) btn.classList.add('beaten');
            if (i === currentLevel && from === 'paused') btn.classList.add('current');
            btn.innerText = `${i + 1}\n${locked ? '🔒' : PET_EMOJI[level.species]}\n${level.name}${beaten ? ' ✔' : ''}`;
            btn.setAttribute('aria-label', `Level ${i + 1}: ${level.name}${locked ? ' (locked)' : beaten ? ' (rescued)' : ''}`);
            btn.addEventListener('click', () => {
                if (locked) return;
                // Picking a level is a tap, so it can switch music on like Play does.
                audio.setEnabled(true, i, musicBtn);
                startGame(i);
            });
            return btn;
        })
    );
    showOverlay(levelSelect);
    const focusIndex = from === 'paused' ? currentLevel : progress.unlocked;
    (levelGrid.children[focusIndex] as HTMLElement | undefined)?.focus();
}

export function closeLevelSelect(): void {
    if (screen !== 'levels') return;
    if (levelsReturnTo === 'paused') {
        screen = 'paused';
        showOverlay(pauseScreen);
        pauseLevelsBtn.focus();
    } else {
        showStartScreen();
    }
}

// The Play tap is the user gesture browsers require before audio can start, so music comes on here.
playBtn.addEventListener('click', () => {
    audio.setEnabled(true, 0, musicBtn);
    startGame(0);
});
continueBtn.addEventListener('click', () => {
    const level = progress.level ?? 0;
    audio.setEnabled(true, level, musicBtn);
    startGame(level);
});
levelsBtn.addEventListener('click', () => openLevelSelect('start'));

pauseBtn.addEventListener('click', () => {
    pauseBtn.blur();
    pauseGame();
});
resumeBtn.addEventListener('click', resumeGame);
pauseRestartBtn.addEventListener('click', () => {
    restartLevel();
    resumeGame();
});
pauseLevelsBtn.addEventListener('click', () => openLevelSelect('paused'));
pauseMenuBtn.addEventListener('click', () => showStartScreen());
levelsBackBtn.addEventListener('click', closeLevelSelect);

victoryDialog.addEventListener('close', () => {
    startGame(0);
});

export function allBloomed(): boolean {
    return sprouts.every(s => s.bloomed);
}

export function objectiveText(): string {
    if (levelClearTimer > 0) return `🎉 You rescued ${LEVELS[currentLevel].pet}!`;
    if (keyCollected) return '🏠 Bring the key to the doghouse!';
    if (!allBloomed()) {
        return sprouts.some(s => !s.bloomed && s.waterNeeded > 1)
            ? '💦 Water every sprout — big ones need extra splashes!'
            : '💦 Water every sprout';
    }
    if (!boneFound) return "🦴 Follow Noodle's nose and dig for the bone";
    return '🔑 Grab the shiny key!';
}

/** How much of the victory rainbow to draw: 0 while playing, sweeping to 1 once a level is beaten. */
export function rainbowProgress(): number {
    if (screen === 'victory') return 1; // keep the full rainbow behind the victory dialog
    if (levelClearTimer <= 0) return 0;
    return Math.min(1, (LEVEL_CLEAR_FRAMES - levelClearTimer + 1) / RAINBOW_SWEEP_FRAMES);
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
    levelTicks = 0;
    movingPlatforms = movingPlatformsAt(0);
    bees = beesAt(0);
    keyX = level.keyPos.x;
    keyY = level.keyPos.y;

    level.sprouts.forEach((pos, i) => {
        sprouts.push({
            x: pos.x,
            y: pos.y,
            water: 0,
            waterNeeded: pos.waterNeeded ?? 1,
            bloomed: false,
            color: (pos.waterNeeded ?? 1) > 1 ? BIG_FLOWER_COLOR : FLOWER_COLORS[i % FLOWER_COLORS.length],
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

    if (level.tip) {
        noodle.speechBubble = level.tip;
        noodle.barkTimer = 240;
    }

    levelDisplay.innerText = `Level ${currentLevel + 1}: ${level.name}`;
    updateStatus();
    if (audio.enabled) audio.startBgMusic(currentLevel);
}

export function restartLevel(): void {
    initLevel();
    flora.reset();
    cameraX = cameraTarget();
}

/** The camera keeps Flora a little behind centre, looking ahead the way she faces. */
function cameraTarget(): number {
    const maxX = levelWidth(LEVELS[currentLevel]) - CANVAS_WIDTH;
    const lookAhead = flora.facing === 'right' ? 60 : -60;
    const target = flora.x + flora.width / 2 - CANVAS_WIDTH / 2 + lookAhead;
    return Math.min(Math.max(0, target), maxX);
}

function updateCamera(): void {
    cameraX += (cameraTarget() - cameraX) * 0.1;
}

/** Bees glide out and back like clouds, bobbing up and down as they buzz. */
function beesAt(t: number): (Point & { facingLeft: boolean })[] {
    return (LEVELS[currentLevel].bees ?? []).map((b, i) => {
        const phase = (2 * Math.PI * t) / b.period;
        return {
            x: b.x + (b.range * (1 - Math.cos(phase))) / 2,
            y: b.y + Math.sin(t * 0.09 + i) * 6,
            // Moving right during the first half of each trip
            facingLeft: Math.sin(phase) < 0
        };
    });
}

function updateBees(): void {
    bees = beesAt(levelTicks);
    for (const bee of bees) {
        // Circle-vs-box: nearest point on Flora's box to the bee
        const nx = Math.min(Math.max(bee.x, flora.x), flora.x + flora.width);
        const ny = Math.min(Math.max(bee.y, flora.y), flora.y + flora.height);
        if ((bee.x - nx) ** 2 + (bee.y - ny) ** 2 > BEE_RADIUS ** 2) continue;
        if (flora.bump(bee.x)) {
            audio.playSound('bump');
            particleSystem.spawn(bee.x, bee.y, '#FDCB6E', 8, 'star');
            noodle.barkTimer = 70;
            noodle.speechBubble = "Ouch! Jump over the bees 🐝";
        }
    }
}

export function checkWatering(): void {
    const canCenterX = flora.facing === 'right' ? flora.x + 30 : flora.x + 2;
    const floraFeetY = flora.y + flora.height;
    for (const s of sprouts) {
        if (s.bloomed || Math.abs(canCenterX - s.x) >= 48 || Math.abs(floraFeetY - s.y) >= 48) continue;
        s.water++;
        if (s.water >= s.waterNeeded) {
            s.bloomed = true;
            audio.playSound('bloom');
            const big = s.waterNeeded > 1;
            particleSystem.spawn(s.x, s.y - (big ? 36 : 24), s.color, big ? 24 : 14, 'circle');
            particleSystem.spawn(s.x, s.y - (big ? 40 : 28), '#FFEAA7', big ? 12 : 6, 'star');
        } else {
            particleSystem.spawn(s.x, s.y - 20, '#74B9FF', 8, 'circle');
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
    // Flora has to walk in at the door, not fall past it from above.
    const atDoor = flora.grounded && flora.y + flora.height >= GROUND_Y - 1;
    if (flora.x <= doghouseEntryX(LEVELS[currentLevel]) || !atDoor || levelClearTimer > 0) return;
    const houseX = doghouseX(LEVELS[currentLevel]);
    if (keyCollected) {
        levelClearTimer = LEVEL_CLEAR_FRAMES;
        audio.playSound('victory');
        particleSystem.spawn(houseX, 395, '#FF7675', 14, 'heart');
        particleSystem.spawn(houseX, 385, '#F1C40F', 20, 'star');
        updateStatus();
    } else if (noodle.barkTimer <= 0) {
        noodle.barkTimer = 70;
        noodle.speechBubble = "It's locked! Need the key 🔑";
    }
}

function updateLevelClear(): void {
    if (levelClearTimer <= 0) return;
    if (levelClearTimer % 15 === 0) {
        particleSystem.spawn(doghouseX(LEVELS[currentLevel]) + (Math.random() - 0.5) * 40, 390, '#FFEAA7', 8, 'star');
    }

    levelClearTimer--;
    if (levelClearTimer > 0) return;

    rescuedFriends.push({
        species: LEVELS[currentLevel].species,
        x: noodle.x - (rescuedFriends.length + 1) * 28,
        y: 416
    });

    if (currentLevel === LEVELS.length - 1) {
        screen = 'victory';
        // Nothing left to continue, but every level stays open in the level list.
        progress = { level: null, unlocked: LEVELS.length - 1 };
        writeSave(storage, progress);
        updateStatus();
        victoryDialog.showModal();
    } else {
        currentLevel++;
        saveProgress(currentLevel);
        restartLevel();
    }
}

/** Positions of the level's moving platforms at tick `t`: an eased glide out and back. */
function movingPlatformsAt(t: number): Platform[] {
    return (LEVELS[currentLevel].movingPlatforms ?? []).map(p => ({
        x: p.x + (p.range * (1 - Math.cos((2 * Math.PI * t) / p.period))) / 2,
        y: p.y,
        width: p.width
    }));
}

function updateMovingPlatforms(): void {
    levelTicks++;
    const next = movingPlatformsAt(levelTicks);
    // Carry Flora along with a platform she is standing on.
    movingPlatforms.forEach((p, i) => {
        const standing =
            flora.grounded &&
            Math.abs(flora.y + flora.height - p.y) < 0.5 &&
            flora.x + flora.width > p.x + 6 &&
            flora.x < p.x + p.width - 6;
        if (standing) flora.x += next[i].x - p.x;
    });
    movingPlatforms = next;
}

function updateParade(): void {
    rescuedFriends.forEach((pet, idx) => {
        const leaderX = idx === 0 ? noodle.x : rescuedFriends[idx - 1].x;
        pet.x += (leaderX - 28 - pet.x) * 0.08;
    });
}

/** Advances the simulation by exactly one fixed tick (1/60 s). */
export function update(): void {
    // Butterflies keep fluttering on every screen, including behind the start screen.
    butterflies.update();
    tick();
    for (const code of Object.keys(pressed)) pressed[code] = false;
}

function tick(): void {
    if (screen !== 'playing') return;

    updateKey();
    updateParade();
    updateMovingPlatforms();

    const level = LEVELS[currentLevel];
    flora.update(
        keys,
        pressed,
        [...level.platforms, ...movingPlatforms],
        level.mushrooms ?? [],
        level.bushes ?? [],
        levelWidth(level),
        levelClearTimer > 0,
        type => audio.playSound(type),
        checkWatering,
        checkDigging
    );
    noodle.update(flora.x, digMounds, boneFound, false, type => audio.playSound(type));
    if (levelClearTimer === 0) updateBees();
    particleSystem.update();
    updateCamera();

    updateDoghouse();
    updateLevelClear();
}

export function render(): void {
    const level = LEVELS[currentLevel];
    ctx.setTransform(pixelScale, 0, 0, pixelScale, 0, 0);
    ctx.fillStyle = level.bg;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Sky things stay put on screen; everything else is drawn in level space and scrolls.
    const rainbow = rainbowProgress();
    if (rainbow > 0) drawRainbow(ctx, rainbow);
    drawSun(ctx);
    butterflies.draw(ctx);

    const houseX = doghouseX(level);
    ctx.save();
    ctx.translate(-cameraX, 0);
    drawTreeAndGround(ctx, levelWidth(level), [level.treeX, ...(level.trees ?? [])], digMounds, boneFound, boneX);
    drawPlatforms(ctx, level.platforms);
    drawCloudPlatforms(ctx, movingPlatforms);
    drawMushrooms(ctx, level.mushrooms ?? []);
    drawBushes(ctx, level.bushes ?? []);
    drawSprouts(ctx, sprouts, allBloomed());
    drawDoghouse(ctx, houseX);

    if (keyCollected) {
        drawRescuedPet(ctx, level.species, houseX, 416);
    } else if (allBloomed() && boneFound) {
        drawKey(ctx, keyX, keyY);
    }

    for (const pet of rescuedFriends) drawRescuedPet(ctx, pet.species, pet.x, 416);
    flora.draw(ctx);
    noodle.draw(ctx);
    for (const bee of bees) drawBee(ctx, bee.x, bee.y, bee.facingLeft);
    particleSystem.draw(ctx);
    noodle.drawSpeech(ctx, cameraX, cameraX + CANVAS_WIDTH);
    ctx.restore();

    // Point the way to the next goal when it's off-screen.
    const goal = nextGoal();
    if (goal) drawOffscreenArrow(ctx, goal.x - cameraX, CANVAS_WIDTH, goal.emoji);

    if (levelClearTimer > 0) drawCelebrationBanner(ctx, level.pet);
}

/** What Flora should head for next, for the off-screen arrow: key, then doghouse, then any sprout left. */
export function nextGoal(): { x: number; emoji: string } | null {
    if (levelClearTimer > 0) return null;
    if (keyCollected) return { x: doghouseX(LEVELS[currentLevel]), emoji: '🏠' };
    if (allBloomed() && boneFound) return { x: keyX, emoji: '🔑' };
    const onScreen = (x: number): boolean => x >= cameraX && x <= cameraX + CANVAS_WIDTH;
    const left = sprouts.filter(s => !s.bloomed);
    if (left.length === 0 || left.some(s => onScreen(s.x))) return null;
    const floraX = flora.x + flora.width / 2;
    const nearest = left.reduce((a, b) => (Math.abs(a.x - floraX) <= Math.abs(b.x - floraX) ? a : b));
    return { x: nearest.x, emoji: '🌱' };
}

// Scale the whole game box to fit the window, and size the canvas backing store to match
// the real pixel count so it stays crisp on phones and retina screens.
let pixelScale: number = 1;

export function fitToScreen(): void {
    // clientWidth/Height ignore mobile zoom-out; innerWidth grows when content overflows the screen.
    const root = document.documentElement;
    const scale = fitScale(root.clientWidth || window.innerWidth, root.clientHeight || window.innerHeight);
    stage.style.width = `${Math.floor(STAGE_WIDTH * scale)}px`;
    stage.style.height = `${Math.floor(STAGE_HEIGHT * scale)}px`;
    container.style.transform = `scale(${scale})`;

    pixelScale = scale * (window.devicePixelRatio || 1);
    canvas.width = Math.round(CANVAS_WIDTH * pixelScale);
    canvas.height = Math.round(CANVAS_HEIGHT * pixelScale);
}

window.addEventListener('resize', fitToScreen);

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

/** The victory dialog lists every pet, so it grows with the level list. */
function fillVictoryDialog(): void {
    victoryText.innerText = `Flora and Noodle bloomed every garden and rescued all ${LEVELS.length} magical pets!`;
    rescuedList.replaceChildren(
        ...LEVELS.map(l => {
            const li = document.createElement('li');
            li.innerText = `${PET_EMOJI[l.species]} ${l.pet}`;
            return li;
        })
    );
}

fitToScreen();
fillVictoryDialog();
initLevel();
showStartScreen();
requestAnimationFrame(frame);
