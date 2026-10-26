/** Things that move around the level each tick: moving platforms, bees, wind, rain clouds, ponds, the camera and the pet parade. */
import { POWER_TUNING } from '../powers.ts';
import { splashSprout, updateStatus } from './level.ts';
import { audio, currentLevelConfig, flora, hasPower, noodle, particleSystem, state } from './state.ts';
import { CANVAS_WIDTH } from '../layout.ts';
import { BEE_RADIUS, GROUND_Y, LEVELS, RAIN_SPLASH_TICKS, RAIN_WIDTH, levelWidth } from '../levels.ts';
import type { Platform, Point, Species } from '../types.ts';

/** Gap between pets in the parade; the drawn pets are about 30px wide. */
export const PARADE_GAP = 32;

export const petName = (species: Species): string => LEVELS.find(l => l.species === species)?.pet ?? species;

/**
 * Makes the parade match the followers: pets already walking keep their spot, new ones
 * join at the back, and ones that went to rest leave.
 */
export function syncParade(): void {
    const kept = state.rescuedFriends.filter(p => state.progress.followers.includes(p.species));
    for (const species of state.progress.followers) {
        if (kept.some(p => p.species === species)) continue;
        const behind = kept.length === 0 ? noodle.x : kept[kept.length - 1].x;
        kept.push({ species, x: behind - PARADE_GAP, y: 416 });
    }
    // Keep the parade in follow order (longest-following nearest Noodle).
    kept.sort((a, b) => state.progress.followers.indexOf(a.species) - state.progress.followers.indexOf(b.species));
    state.rescuedFriends = kept;
}

/** The camera keeps Flora a little behind centre, looking ahead the way she faces. */
export function cameraTarget(): number {
    const maxX = levelWidth(LEVELS[state.currentLevel]) - CANVAS_WIDTH;
    const lookAhead = flora.facing === 'right' ? 60 : -60;
    const target = flora.x + flora.width / 2 - CANVAS_WIDTH / 2 + lookAhead;
    return Math.min(Math.max(0, target), maxX);
}

export function updateCamera(): void {
    state.cameraX += (cameraTarget() - state.cameraX) * 0.1;
}

/** Positions of the level's moving platforms at tick `t`: an eased glide out and back. */
export function movingPlatformsAt(t: number): (Platform & { style?: 'cloud' | 'lily' })[] {
    return (LEVELS[state.currentLevel].movingPlatforms ?? []).map(p => ({
        x: p.x + (p.range * (1 - Math.cos((2 * Math.PI * t) / p.period))) / 2,
        y: p.y,
        width: p.width,
        style: p.style
    }));
}

export function updateMovingPlatforms(): void {
    state.levelTicks++;
    const next = movingPlatformsAt(state.levelTicks);
    // Carry Flora along with a platform she is standing on.
    state.movingPlatforms.forEach((p, i) => {
        const standing =
            flora.grounded &&
            Math.abs(flora.y + flora.height - p.y) < 0.5 &&
            flora.x + flora.width > p.x + 6 &&
            flora.x < p.x + p.width - 6;
        if (standing) flora.x += next[i].x - p.x;
    });
    state.movingPlatforms = next;
}

/** Bees glide out and back like clouds, bobbing up and down as they buzz. */
export function beesAt(t: number): (Point & { facingLeft: boolean })[] {
    return (LEVELS[state.currentLevel].bees ?? []).map((b, i) => {
        const phase = (2 * Math.PI * t) / b.period;
        return {
            x: b.x + (b.range * (1 - Math.cos(phase))) / 2,
            y: b.y + Math.sin(t * 0.09 + i) * 6,
            // Moving right during the first half of each trip
            facingLeft: Math.sin(phase) < 0
        };
    });
}

export function updateBees(): void {
    state.bees = beesAt(state.levelTicks);
    for (const bee of state.bees) {
        // Circle-vs-box: nearest point on Flora's box to the bee
        const nx = Math.min(Math.max(bee.x, flora.x), flora.x + flora.width);
        const ny = Math.min(Math.max(bee.y, flora.y), flora.y + flora.height);
        if ((bee.x - nx) ** 2 + (bee.y - ny) ** 2 > BEE_RADIUS ** 2) continue;
        // Honey friend (bear): bees are friendly and buzz right past.
        if (hasPower('bear')) continue;
        if (flora.bump(bee.x)) {
            state.levelStars.bumps++;
            audio.playSound('bump');
            particleSystem.spawn(bee.x, bee.y, '#FDCB6E', 8, 'star');
            // The first bump on a no-bumps level gets the missed-challenge message, which says this too.
            if (currentLevelConfig().challenge === 'noBumps' && !state.levelStars.missedTold) continue;
            noodle.barkTimer = 70;
            noodle.speechBubble = "Ouch! Jump over the bees 🐝";
        }
    }
}

/**
 * The wind's push this tick: calm, then a gust that eases in and out. `soon` is true in the
 * second before a gust, when warning leaves start to blow.
 */
export function currentWind(): { x: number; soon: boolean } {
    const wind = LEVELS[state.currentLevel].wind;
    if (!wind) return { x: 0, soon: false };
    const t = state.levelTicks % (wind.calm + wind.gust);
    if (t < wind.calm) return { x: 0, soon: t > wind.calm - 60 };
    const into = t - wind.calm;
    const ease = Math.min(1, into / 25, (wind.gust - into) / 25);
    return { x: wind.strength * ease, soon: false };
}

/** Rain clouds drift like the moving clouds, without being solid. */
export function rainCloudsAt(t: number): number[] {
    return (LEVELS[state.currentLevel].rainClouds ?? []).map(
        c => c.x + (c.range * (1 - Math.cos((2 * Math.PI * t) / c.period))) / 2
    );
}

/** Sprouts under a rain cloud get a splash every so often, helping Flora along. */
export function updateRain(): void {
    state.rainCloudXs = rainCloudsAt(state.levelTicks);
    if (state.rainCloudXs.length === 0) return;
    let changed = false;
    for (const s of state.sprouts) {
        if (s.bloomed) continue;
        const underRain = state.rainCloudXs.some(cx => Math.abs(cx - s.x) <= RAIN_WIDTH / 2);
        if (!underRain) continue;
        s.rainTicks = (s.rainTicks ?? 0) + 1;
        // Rain friend (snail): rain waters twice as fast.
        const every = RAIN_SPLASH_TICKS * (hasPower('snail') ? POWER_TUNING.rainFriendFactor : 1);
        if (s.rainTicks >= every) {
            s.rainTicks = 0;
            splashSprout(s);
            changed = true;
        }
    }
    if (changed) updateStatus();
}

/** Ponds: remember the last dry spot, and splash Flora back to it if she drops in. */
export function updatePond(): void {
    const water = LEVELS[state.currentLevel].water ?? [];
    noodle.swimming = water.some(w => noodle.x + 12 >= w.x && noodle.x + 12 <= w.x + w.width);
    if (water.length === 0) return;
    if (flora.grounded && flora.y + flora.height >= GROUND_Y - 1 && !flora.over(water)) state.lastSafeX = flora.x;
    if (!flora.fellInWater) return;
    state.levelStars.splashes++;
    particleSystem.spawn(flora.x + flora.width / 2, GROUND_Y + 6, '#74B9FF', 16, 'circle');
    audio.playSound('bump');
    flora.reset();
    flora.x = state.lastSafeX;
    flora.safeTimer = 60;
    noodle.sayFirst("Splash! Hop on the lily pads 🪷", 120);
}

export const overWater = (x: number): boolean =>
    (LEVELS[state.currentLevel].water ?? []).some(w => x >= w.x && x <= w.x + w.width);

export function updateParade(): void {
    state.rescuedFriends.forEach((pet, idx) => {
        const leaderX = idx === 0 ? noodle.x : state.rescuedFriends[idx - 1].x;
        const vx = (leaderX - PARADE_GAP - pet.x) * 0.08;
        pet.x += vx;
        pet.vx = vx;
        // Same dead zone as Noodle, so settled pets don't flip back and forth.
        if (vx > 0.3) pet.facingLeft = false;
        else if (vx < -0.3) pet.facingLeft = true;
    });
}
