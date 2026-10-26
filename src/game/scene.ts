/** Draws one frame: the sky, the scrolling level, weather and night, then overlays on top. */
import { ctx } from './dom.ts';
import { allBloomed, challengeMet, nextGoal, rainbowProgress } from './level.ts';
import { butterflies, flora, hasPower, noodle, particleSystem, skyVisitors, state, weather } from './state.ts';
import { overWater } from './world.ts';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../layout.ts';
import { LEVEL_CLEAR_FRAMES, LEVELS, doghouseX, levelWidth } from '../levels.ts';
import { CHALLENGE_LABEL, CHALLENGE_TEXT, POWER_TUNING, STAR_CHALLENGE, STAR_HIDDEN, STAR_RESCUE } from '../powers.ts';
import { drawBee, drawRescuedPet } from '../render/creatures.ts';
import { drawCelebrationBanner, drawOffscreenArrow, drawStarGoals, drawStarRow } from '../render/hud.ts';
import type { StarGoal, StarState } from '../render/hud.ts';
import { drawHiddenStar, drawKey, drawSprouts } from '../render/items.ts';
import { drawTwinkle } from '../render/shapes.ts';
import { drawBushes, drawCloudPlatforms, drawDoghouse, drawIce, drawLilyPads, drawMushrooms, drawPlatforms, drawRainClouds, drawTreeAndGround, drawWater } from '../render/scenery.ts';
import { drawRainbow, drawSun } from '../render/sky.ts';
import type { Light } from '../weather.ts';

export function render(): void {
    const level = LEVELS[state.currentLevel];
    ctx.setTransform(state.pixelScale, 0, 0, state.pixelScale, 0, 0);
    ctx.fillStyle = level.bg;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Sky things stay put on screen; everything else is drawn in level space and scrolls.
    const rainbow = rainbowProgress();
    if (rainbow > 0) drawRainbow(ctx, rainbow);
    if (weather.drawSky(ctx, level.bg)) drawSun(ctx);
    if (weather.calmSky) {
        skyVisitors.draw(ctx);
        butterflies.draw(ctx);
    }

    const houseX = doghouseX(level);
    ctx.save();
    ctx.translate(-state.cameraX, 0);
    drawTreeAndGround(
        ctx, levelWidth(level), [level.treeX, ...(level.trees ?? [])], state.digMounds, state.boneFound, state.boneX, level.weather === 'snow'
    );
    drawWater(ctx, level.water ?? []);
    drawIce(ctx, level.ice ?? []);
    drawRainClouds(ctx, state.rainCloudXs);
    drawPlatforms(ctx, level.platforms);
    drawLilyPads(ctx, [...(level.lilyPads ?? []), ...state.movingPlatforms.filter(p => p.style === 'lily')]);
    drawCloudPlatforms(ctx, state.movingPlatforms.filter(p => p.style !== 'lily'));
    drawMushrooms(ctx, level.mushrooms ?? []);
    drawBushes(ctx, level.bushes ?? []);
    drawSprouts(ctx, state.sprouts, allBloomed());
    drawDoghouse(ctx, houseX);

    if (state.keyCollected) {
        // Waiting in the doorway, looking out toward Flora.
        drawRescuedPet(ctx, level.species, houseX, 416, true, 0);
    } else if (allBloomed() && state.boneFound) {
        drawKey(ctx, state.keyX, state.keyY);
    }
    if (!state.levelStars.found) drawHiddenStar(ctx, level.star.x, level.star.y);
    // Clever eyes (fox): a sparkle twinkles over the mound hiding the bone.
    if (hasPower('fox') && !state.boneFound) {
        const size = 3 + Math.abs(Math.sin(Date.now() * 0.006)) * 3;
        ctx.fillStyle = "#FFF3B0";
        drawTwinkle(ctx, state.boneX, 404, size);
        drawTwinkle(ctx, state.boneX + 9, 396, size * 0.6);
    }

    for (const pet of state.rescuedFriends) {
        drawRescuedPet(ctx, pet.species, pet.x, 416, pet.facingLeft ?? false, pet.vx ?? 0, overWater(pet.x));
    }
    flora.draw(ctx);
    noodle.draw(ctx);
    for (const bee of state.bees) drawBee(ctx, bee.x, bee.y, bee.facingLeft);
    particleSystem.draw(ctx);
    ctx.restore();

    // Weather in front of the scene, then the night's darkness with its soft lights.
    weather.drawFront(ctx);
    if (weather.kind === 'night') {
        const lights: Light[] = [
            // Night eyes (owl): a much bigger light around Flora.
            {
                x: flora.x + flora.width / 2 - state.cameraX,
                y: flora.y + 20,
                r: hasPower('owl') ? POWER_TUNING.nightEyesLight : POWER_TUNING.nightLight
            },
            { x: houseX - state.cameraX, y: 400, r: 95 },
            ...weather.fireflyLights()
        ];
        if (allBloomed() && state.boneFound && !state.keyCollected) lights.push({ x: state.keyX - state.cameraX, y: state.keyY, r: 70 });
        for (const s of state.sprouts) if (s.bloomed) lights.push({ x: s.x - state.cameraX, y: s.y - 24, r: 40 });
        if (!state.levelStars.found) lights.push({ x: level.star.x - state.cameraX, y: level.star.y, r: 45 });
        weather.drawDarkness(ctx, lights, state.pixelScale);
        weather.drawFireflies(ctx);
    }
    // Noodle's tips stay readable above the weather.
    ctx.save();
    ctx.translate(-state.cameraX, 0);
    noodle.drawSpeech(ctx, state.cameraX, state.cameraX + CANVAS_WIDTH);
    ctx.restore();

    // Point the way to the next goal when it's off-screen.
    const goal = nextGoal();
    if (goal) drawOffscreenArrow(ctx, goal.x - state.cameraX, CANVAS_WIDTH, goal.emoji);

    const stars = starStates();
    drawStarRow(ctx, stars);
    drawStarGoals(ctx, starGoals(), starGoalsAlpha());
    if (state.levelClearTimer > 0) {
        drawCelebrationBanner(ctx, level.pet, stars, starLabels(), LEVEL_CLEAR_FRAMES - state.levelClearTimer);
    }
}

/** How long the star-goals card stays up when a level starts, and how long it takes to fade. */
export const STAR_GOALS_TICKS = 300;
const STAR_GOALS_FADE_TICKS = 40;

/** The star-goals card's opacity: fully shown as a level starts, fading out after a few seconds. */
export function starGoalsAlpha(): number {
    if (state.levelClearTimer > 0) return 0;
    return Math.max(0, Math.min(1, (STAR_GOALS_TICKS - state.levelTicks) / STAR_GOALS_FADE_TICKS));
}

/** The star-goals card's lines; stars already earned here before show gold. */
export function starGoals(): StarGoal[] {
    const level = LEVELS[state.currentLevel];
    const best = state.progress.stars[state.currentLevel] ?? 0;
    const got = (bit: number): StarState => (best & bit ? 'earned' : 'open');
    return [
        { state: got(STAR_RESCUE), text: `Rescue ${level.pet}` },
        { state: got(STAR_HIDDEN), text: `Find the hidden star: ${level.star.hint}` },
        { state: got(STAR_CHALLENGE), text: `Challenge: ${CHALLENGE_TEXT[level.challenge]}` }
    ];
}

/** What each of the banner's stars was for. */
export function starLabels(): string[] {
    return ['Rescued!', 'Hidden star', CHALLENGE_LABEL[LEVELS[state.currentLevel].challenge]];
}

/** This run's three stars, live: rescue, hidden star, challenge. */
export function starStates(): StarState[] {
    const finished = state.levelClearTimer > 0 || state.screen === 'victory';
    const earned = state.levelStars.earned;
    return [
        finished ? 'earned' : 'open',
        state.levelStars.found || earned & STAR_HIDDEN ? 'earned' : finished ? 'missed' : 'open',
        finished ? (earned & STAR_CHALLENGE ? 'earned' : 'missed') : challengeMet() ? 'open' : 'missed'
    ];
}
