/** Draws one frame: the sky, the scrolling level, weather and night, then overlays on top. */
import { ctx } from './dom.ts';
import { allBloomed, nextGoal, rainbowProgress } from './level.ts';
import { butterflies, flora, noodle, particleSystem, skyVisitors, state, weather } from './state.ts';
import { overWater } from './world.ts';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../layout.ts';
import { LEVELS, doghouseX, levelWidth } from '../levels.ts';
import { drawBee, drawRescuedPet } from '../render/creatures.ts';
import { drawCelebrationBanner, drawOffscreenArrow } from '../render/hud.ts';
import { drawKey, drawSprouts } from '../render/items.ts';
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
            { x: flora.x + flora.width / 2 - state.cameraX, y: flora.y + 20, r: 165 },
            { x: houseX - state.cameraX, y: 400, r: 95 },
            ...weather.fireflyLights()
        ];
        if (allBloomed() && state.boneFound && !state.keyCollected) lights.push({ x: state.keyX - state.cameraX, y: state.keyY, r: 70 });
        for (const s of state.sprouts) if (s.bloomed) lights.push({ x: s.x - state.cameraX, y: s.y - 24, r: 40 });
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

    if (state.levelClearTimer > 0) drawCelebrationBanner(ctx, level.pet);
}
