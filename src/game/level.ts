/** The level's rules: setting it up, watering, digging, the key, the doghouse, the celebration, and the HUD text. */
import { dom } from './dom.ts';
import { saveProgress } from './menus.ts';
import { audio, flora, noodle, particleSystem, persist, state, weather } from './state.ts';
import { PARADE_GAP, beesAt, cameraTarget, movingPlatformsAt, petName, rainCloudsAt, syncParade } from './world.ts';
import { CANVAS_WIDTH } from '../layout.ts';
import { BIG_FLOWER_COLOR, DIG_RANGE, FLOWER_COLORS, GROUND_Y, LEVELS, LEVEL_CLEAR_FRAMES, RAINBOW_SWEEP_FRAMES, doghouseEntryX, doghouseX } from '../levels.ts';
import { addRescue } from '../save.ts';
import type { DigMound, Sprout } from '../types.ts';

export function allBloomed(): boolean {
    return state.sprouts.every(s => s.bloomed);
}

export function objectiveText(): string {
    if (state.levelClearTimer > 0) return `🎉 You rescued ${LEVELS[state.currentLevel].pet}!`;
    if (state.keyCollected) return '🏠 Bring the key to the doghouse!';
    if (!allBloomed()) {
        return state.sprouts.some(s => !s.bloomed && s.waterNeeded > 1)
            ? '💦 Water every sprout — big ones need extra splashes!'
            : '💦 Water every sprout';
    }
    if (!state.boneFound) return "🦴 Follow Noodle's nose and dig for the bone";
    return '🔑 Grab the shiny key!';
}

/** How much of the victory rainbow to draw: 0 while playing, sweeping to 1 once a level is beaten. */
export function rainbowProgress(): number {
    if (state.screen === 'victory') return 1; // keep the full rainbow behind the victory dialog
    if (state.levelClearTimer <= 0) return 0;
    return Math.min(1, (LEVEL_CLEAR_FRAMES - state.levelClearTimer + 1) / RAINBOW_SWEEP_FRAMES);
}

export function updateStatus(): void {
    const bloomedCount = state.sprouts.filter(s => s.bloomed).length;
    dom.statusDisplay.innerText = `Flowers: ${bloomedCount}/${LEVELS[state.currentLevel].flowersNeeded} | Bone: ${state.boneFound ? '🦴' : '❌'} | Key: ${state.keyCollected ? '🔑' : '❌'}`;
    dom.objectiveDisplay.innerText = objectiveText();
}

export function initLevel(): void {
    const level = LEVELS[state.currentLevel];
    state.sprouts = [];
    state.digMounds = [];
    particleSystem.clear();
    state.boneFound = false;
    state.keyCollected = false;
    state.levelClearTimer = 0;
    state.levelTicks = 0;
    state.movingPlatforms = movingPlatformsAt(0);
    state.bees = beesAt(0);
    state.rainCloudXs = rainCloudsAt(0);
    state.lastSafeX = 50;
    weather.setKind(level.weather ?? 'clear');
    state.keyX = level.keyPos.x;
    state.keyY = level.keyPos.y;

    level.sprouts.forEach((pos, i) => {
        state.sprouts.push({
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
        state.digMounds.push({
            x: mx,
            y: GROUND_Y,
            hasBone: idx === boneIdx,
            dug: false
        });
    });
    state.boneX = level.mounds[boneIdx];

    if (level.tip) {
        noodle.speechBubble = level.tip;
        noodle.barkTimer = 240;
    }

    dom.levelDisplay.innerText = `Level ${state.currentLevel + 1}: ${level.name}`;
    updateStatus();
    if (audio.enabled) audio.startBgMusic(state.currentLevel);
}

export function restartLevel(): void {
    initLevel();
    flora.reset();
    // Line Noodle and the parade up behind Flora, instead of them walking back from
    // wherever the last level ended.
    noodle.x = 20;
    state.rescuedFriends.forEach((pet, i) => {
        pet.x = noodle.x - (i + 1) * PARADE_GAP;
        pet.vx = 0;
        pet.facingLeft = false;
    });
    state.cameraX = cameraTarget();
}

/** One splash of water on a sprout, from Flora's can or a rain cloud. */
export function splashSprout(s: Sprout): void {
    if (s.bloomed) return;
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

export function checkWatering(): void {
    const canCenterX = flora.facing === 'right' ? flora.x + 30 : flora.x + 2;
    const floraFeetY = flora.y + flora.height;
    for (const s of state.sprouts) {
        if (s.bloomed || Math.abs(canCenterX - s.x) >= 48 || Math.abs(floraFeetY - s.y) >= 48) continue;
        splashSprout(s);
    }
    updateStatus();
}

export function checkDigging(): void {
    if (flora.y + flora.height < GROUND_Y - 5) return;
    const playerCenterX = flora.x + flora.width / 2;
    // Pick the closest undug mound so an already-dug neighbour can't block a nearby one.
    let mound: DigMound | undefined;
    for (const m of state.digMounds) {
        if (m.dug || Math.abs(playerCenterX - m.x) >= DIG_RANGE) continue;
        if (!mound || Math.abs(playerCenterX - m.x) < Math.abs(playerCenterX - mound.x)) mound = m;
    }

    particleSystem.spawn(mound ? mound.x : playerCenterX, GROUND_Y - 4, '#8D6E63', 8, 'circle');
    if (!mound) return;

    mound.dug = true;
    if (mound.hasBone) {
        state.boneFound = true;
        state.boneX = mound.x;
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

export function updateKey(): void {
    if (state.keyCollected || !allBloomed() || !state.boneFound) return;
    const floraCenterX = flora.x + flora.width / 2;
    const floraCenterY = flora.y + flora.height / 2;
    if (Math.abs(floraCenterX - state.keyX) < 34 && Math.abs(floraCenterY - state.keyY) < 42) {
        state.keyCollected = true;
        audio.playSound('key');
        particleSystem.spawn(state.keyX, state.keyY, '#F1C40F', 18, 'star');
        updateStatus();
    }
}

export function updateDoghouse(): void {
    // Flora has to walk in at the door, not fall past it from above.
    const atDoor = flora.grounded && flora.y + flora.height >= GROUND_Y - 1;
    if (flora.x <= doghouseEntryX(LEVELS[state.currentLevel]) || !atDoor || state.levelClearTimer > 0) return;
    const houseX = doghouseX(LEVELS[state.currentLevel]);
    if (state.keyCollected) {
        state.levelClearTimer = LEVEL_CLEAR_FRAMES;
        audio.playSound('victory');
        particleSystem.spawn(houseX, 395, '#FF7675', 14, 'heart');
        particleSystem.spawn(houseX, 385, '#F1C40F', 20, 'star');
        updateStatus();
    } else if (noodle.barkTimer <= 0) {
        noodle.barkTimer = 70;
        noodle.speechBubble = "It's locked! Need the key 🔑";
    }
}

export function updateLevelClear(): void {
    if (state.levelClearTimer <= 0) return;
    if (state.levelClearTimer % 15 === 0) {
        particleSystem.spawn(doghouseX(LEVELS[state.currentLevel]) + (Math.random() - 0.5) * 40, 390, '#FFEAA7', 8, 'star');
    }

    state.levelClearTimer--;
    if (state.levelClearTimer > 0) return;

    // The rescued pet joins the roster and the parade; a full parade sends its longest follower home.
    const { bumped } = addRescue(state.progress, LEVELS[state.currentLevel].species);
    const leaving = state.rescuedFriends.find(p => p.species === bumped);
    if (leaving) particleSystem.spawn(leaving.x, 405, '#FF7675', 8, 'heart');
    syncParade();
    const goodbye = bumped ? `${petName(bumped)} went home to rest 🏡` : null;

    if (state.currentLevel === LEVELS.length - 1) {
        state.screen = 'victory';
        // Nothing left to continue, but every level stays open in the level list.
        state.progress = { ...state.progress, level: null, unlocked: LEVELS.length - 1 };
        persist();
        updateStatus();
        dom.victoryDialog.showModal();
    } else {
        state.currentLevel++;
        saveProgress(state.currentLevel);
        restartLevel();
    }
    // Shown before the new level's tip, which waits its turn.
    if (goodbye) noodle.sayFirst(goodbye, 150);
}

/** What Flora should head for next, for the off-screen arrow: key, then doghouse, then any sprout left. */
export function nextGoal(): { x: number; emoji: string } | null {
    if (state.levelClearTimer > 0) return null;
    if (state.keyCollected) return { x: doghouseX(LEVELS[state.currentLevel]), emoji: '🏠' };
    if (allBloomed() && state.boneFound) return { x: state.keyX, emoji: '🔑' };
    const onScreen = (x: number): boolean => x >= state.cameraX && x <= state.cameraX + CANVAS_WIDTH;
    const left = state.sprouts.filter(s => !s.bloomed);
    if (left.length === 0 || left.some(s => onScreen(s.x))) return null;
    const floraX = flora.x + flora.width / 2;
    const nearest = left.reduce((a, b) => (Math.abs(a.x - floraX) <= Math.abs(b.x - floraX) ? a : b));
    return { x: nearest.x, emoji: '🌱' };
}
