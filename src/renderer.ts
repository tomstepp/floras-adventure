import {
    BEE_RADIUS,
    GROUND_Y,
    MUSHROOM_HEIGHT,
    MUSHROOM_WIDTH,
    RAIN_CLOUD_Y,
    RAIN_WIDTH,
    RAINBOW_COLORS,
    WATER_SURFACE_Y
} from './levels.ts';
import { drawPetSprite } from './pets.ts';
import type { Bush, DigMound, GroundSpan, Platform, Point, Species, Sprout } from './types.ts';

export const WATER_COLOR: string = "#5DADE2";

/** A smiling sun in the characters' style: soft rays that turn and breathe, and eyes that blink. */
export function drawSun(ctx: CanvasRenderingContext2D): void {
    const now = Date.now();
    const cx = 700;
    const cy = 75;

    // Rounded rays, alternating long and short, slowly turning; each one pulses on its own beat
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(now * 0.00025);
    ctx.lineCap = 'round';
    for (let i = 0; i < 12; i++) {
        const long = i % 2 === 0;
        const pulse = Math.sin(now * 0.003 + i * 0.9) * 2.5;
        const outer = (long ? 50 : 45) + pulse;
        ctx.strokeStyle = long ? "#FDCB6E" : "#FFE08A";
        ctx.lineWidth = long ? 6 : 4.5;
        ctx.beginPath();
        ctx.moveTo(0, -40);
        ctx.lineTo(0, -outer);
        ctx.stroke();
        ctx.rotate(Math.PI / 6);
    }
    ctx.restore();

    // Face: a soft glow ring keeps it visible on the pale yellow Pet Paradise sky
    ctx.fillStyle = "#FDCB6E";
    ctx.beginPath();
    ctx.arc(cx, cy, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFEAA7";
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.beginPath();
    ctx.ellipse(cx - 12, cy - 16, 8, 4.5, -0.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyes with sparkles; blinks every few seconds, out of step with Flora
    const blinking = (now + 1700) % 4300 < 140;
    ctx.fillStyle = "#2D3436";
    for (const ex of [cx - 10, cx + 10]) {
        ctx.beginPath();
        if (blinking) ctx.ellipse(ex, cy - 2, 3.2, 0.9, 0, 0, Math.PI * 2);
        else ctx.ellipse(ex, cy - 2, 2.8, 3.8, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    if (!blinking) {
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(cx - 9, cy - 3.5, 1.1, 0, Math.PI * 2);
        ctx.arc(cx + 11, cy - 3.5, 1.1, 0, Math.PI * 2);
        ctx.fill();
    }

    // Smile and rosy cheeks
    ctx.strokeStyle = "#C0392B";
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy + 5, 6, 0.25, Math.PI - 0.25);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 118, 117, 0.55)";
    ctx.beginPath();
    ctx.ellipse(cx - 18, cy + 6, 4.5, 2.8, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 18, cy + 6, 4.5, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();
}

/** Draws the rainbow arc from the left, `progress` (0–1) of the way across. */
export function drawRainbow(ctx: CanvasRenderingContext2D, progress: number = 1): void {
    ctx.lineWidth = 6;
    for (let i = 0; i < RAINBOW_COLORS.length; i++) {
        ctx.strokeStyle = RAINBOW_COLORS[i];
        ctx.beginPath();
        ctx.arc(400, 430, 260 - (i * 6), Math.PI, Math.PI + Math.PI * progress, false);
        ctx.stroke();
    }
}

export function drawPlatforms(ctx: CanvasRenderingContext2D, platforms: readonly Platform[]): void {
    for (const p of platforms) {
        // Earthy ledge base
        ctx.fillStyle = "#8D6E63";
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, p.width, 16, 8);
        ctx.fill();

        // Lush grassy top cap
        ctx.fillStyle = "#00B894";
        ctx.beginPath();
        ctx.roundRect(p.x - 2, p.y, p.width + 4, 8, 5);
        ctx.fill();
    }
}

/** Ponds cut into the ground, with soft banks and gentle ripples. */
export function drawWater(ctx: CanvasRenderingContext2D, water: readonly GroundSpan[]): void {
    const now = Date.now();
    for (const w of water) {
        ctx.fillStyle = "#3C8DBC";
        ctx.fillRect(w.x, GROUND_Y, w.width, 72);
        ctx.fillStyle = WATER_COLOR;
        ctx.fillRect(w.x, WATER_SURFACE_Y, w.width, 64);
        // Rounded muddy banks at each edge
        ctx.fillStyle = "#8D6E63";
        for (const bx of [w.x, w.x + w.width]) {
            ctx.beginPath();
            ctx.ellipse(bx, GROUND_Y + 4, 6, 9, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        // Little ripples
        ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        for (let rx = w.x + 18; rx < w.x + w.width - 14; rx += 34) {
            const shift = Math.sin(now * 0.002 + rx) * 4;
            ctx.beginPath();
            ctx.moveTo(rx + shift, WATER_SURFACE_Y + 8);
            ctx.lineTo(rx + shift + 10, WATER_SURFACE_Y + 8);
            ctx.stroke();
        }
    }
}

/** Slippery ice patches: a pale blue sheen on the ground with a few sparkly streaks. */
export function drawIce(ctx: CanvasRenderingContext2D, ice: readonly GroundSpan[]): void {
    for (const i of ice) {
        ctx.fillStyle = "#BDE3F7";
        ctx.beginPath();
        ctx.roundRect(i.x, GROUND_Y - 1, i.width, 9, 4);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        for (let sx = i.x + 12; sx < i.x + i.width - 10; sx += 40) {
            ctx.beginPath();
            ctx.moveTo(sx, GROUND_Y + 5);
            ctx.lineTo(sx + 12, GROUND_Y + 1);
            ctx.stroke();
        }
    }
}

/** Round lily pads with a notch, some with a tiny pink flower; they bob very slightly. */
export function drawLilyPads(ctx: CanvasRenderingContext2D, pads: readonly Platform[]): void {
    const now = Date.now();
    pads.forEach((p, i) => {
        const cx = p.x + p.width / 2;
        const bob = Math.sin(now * 0.003 + p.x) * 0.8;
        ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
        ctx.beginPath();
        ctx.ellipse(cx, p.y + 6, p.width / 2, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#4CAF50";
        ctx.beginPath();
        ctx.ellipse(cx, p.y + 3 + bob, p.width / 2 + 2, 6, 0, 0.35, Math.PI * 2 - 0.05);
        ctx.lineTo(cx, p.y + 3 + bob);
        ctx.fill();
        ctx.fillStyle = "#66BB6A";
        ctx.beginPath();
        ctx.ellipse(cx - 4, p.y + 1.5 + bob, p.width / 4, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        if (i % 2 === 0) {
            ctx.fillStyle = "#FFB8D0";
            for (let k = 0; k < 5; k++) {
                const a = (k / 5) * Math.PI * 2;
                ctx.beginPath();
                ctx.arc(cx - p.width / 4 + Math.cos(a) * 2.4, p.y + bob + Math.sin(a) * 1.6, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });
}

/** Puffy grey rain clouds with sleepy faces, raining a soft column down to the ground. */
export function drawRainClouds(ctx: CanvasRenderingContext2D, cloudXs: readonly number[]): void {
    const now = Date.now();
    for (const cx of cloudXs) {
        // A soft blue column shows exactly where this cloud is watering.
        const grad = ctx.createLinearGradient(0, RAIN_CLOUD_Y, 0, GROUND_Y);
        grad.addColorStop(0, "rgba(116, 185, 255, 0.28)");
        grad.addColorStop(1, "rgba(116, 185, 255, 0.08)");
        ctx.fillStyle = grad;
        ctx.fillRect(cx - RAIN_WIDTH / 2, RAIN_CLOUD_Y, RAIN_WIDTH, GROUND_Y - RAIN_CLOUD_Y);
        ctx.strokeStyle = "rgba(9, 132, 227, 0.75)";
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        for (let i = 0; i < 22; i++) {
            const dx = ((i * 37) % RAIN_WIDTH) - RAIN_WIDTH / 2;
            const dy = (now * 0.4 + i * 53) % (GROUND_Y - RAIN_CLOUD_Y - 10);
            ctx.moveTo(cx + dx, RAIN_CLOUD_Y + 12 + dy);
            ctx.lineTo(cx + dx - 1.5, RAIN_CLOUD_Y + 22 + dy);
        }
        ctx.stroke();
        ctx.fillStyle = "#B2BEC3";
        for (const [px, py, r] of [[-24, 4, 16], [0, -6, 22], [24, 4, 16], [10, 10, 14], [-10, 10, 14]] as const) {
            ctx.beginPath();
            ctx.arc(cx + px, RAIN_CLOUD_Y + py, r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
        ctx.beginPath();
        ctx.arc(cx - 8, RAIN_CLOUD_Y - 12, 8, 0, Math.PI * 2);
        ctx.fill();
        // Sleepy closed eyes and a small smile
        ctx.strokeStyle = "#636E72";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(cx - 6, RAIN_CLOUD_Y + 1, 2.2, 0.2, Math.PI - 0.2);
        ctx.moveTo(cx + 8.2, RAIN_CLOUD_Y + 1.5);
        ctx.arc(cx + 6, RAIN_CLOUD_Y + 1, 2.2, 0.2, Math.PI - 0.2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, RAIN_CLOUD_Y + 6, 2.5, 0.3, Math.PI - 0.3);
        ctx.stroke();
    }
}

/** A swimmer's ripple: a band of water hiding the legs, with a little ring on top. */
export function drawSwimRipple(ctx: CanvasRenderingContext2D, x: number, halfWidth: number): void {
    ctx.fillStyle = WATER_COLOR;
    ctx.fillRect(x - halfWidth, WATER_SURFACE_Y - 2, halfWidth * 2, 12);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(x, WATER_SURFACE_Y - 1, halfWidth, 2.5, 0, 0, Math.PI * 2);
    ctx.stroke();
}

/** Bramble bushes: round leafy clumps with little thorns and berries. */
export function drawBushes(ctx: CanvasRenderingContext2D, bushes: readonly Bush[]): void {
    for (const b of bushes) {
        const top = GROUND_Y - b.height;
        const lumps = Math.max(2, Math.round(b.width / 18));
        const r = b.width / lumps / 2 + 4;
        ctx.fillStyle = "#2E8B57";
        for (let i = 0; i < lumps; i++) {
            const cx = b.x + (i + 0.5) * (b.width / lumps);
            ctx.beginPath();
            ctx.arc(cx, top + r, r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.beginPath();
        ctx.roundRect(b.x, top + r * 0.8, b.width, b.height - r * 0.8 + 2, 6);
        ctx.fill();
        // Lighter leaves on top
        ctx.fillStyle = "#3CB371";
        for (let i = 0; i < lumps; i++) {
            const cx = b.x + (i + 0.5) * (b.width / lumps);
            ctx.beginPath();
            ctx.arc(cx - 2, top + r - 3, r * 0.55, 0, Math.PI * 2);
            ctx.fill();
        }
        // Tiny thorns along the edge, and a couple of berries
        ctx.fillStyle = "#1E6B43";
        for (let tx = b.x + 4; tx < b.x + b.width - 2; tx += 8) {
            ctx.beginPath();
            ctx.moveTo(tx - 2, top + 3);
            ctx.lineTo(tx, top - 2);
            ctx.lineTo(tx + 2, top + 3);
            ctx.fill();
        }
        ctx.fillStyle = "#E84393";
        ctx.beginPath();
        ctx.arc(b.x + b.width * 0.3, top + b.height * 0.55, 2.5, 0, Math.PI * 2);
        ctx.arc(b.x + b.width * 0.7, top + b.height * 0.45, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

/** A chubby striped bumblebee with buzzing wings, facing the way it flies. */
export function drawBee(ctx: CanvasRenderingContext2D, x: number, y: number, facingLeft: boolean): void {
    const now = Date.now();
    ctx.save();
    ctx.translate(x, y);
    if (facingLeft) ctx.scale(-1, 1);

    // Wings flutter fast
    const flap = Math.abs(Math.sin(now * 0.06));
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.ellipse(-3, -BEE_RADIUS + 1, 4, 6 * (0.5 + flap * 0.5), -0.4, 0, Math.PI * 2);
    ctx.ellipse(3, -BEE_RADIUS + 2, 3.5, 5 * (0.5 + flap * 0.5), 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Body with stripes, clipped to the body shape
    ctx.beginPath();
    ctx.ellipse(0, 0, BEE_RADIUS, BEE_RADIUS * 0.75, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#FDCB6E";
    ctx.fill();
    ctx.save();
    ctx.clip();
    ctx.fillStyle = "#2D3436";
    ctx.fillRect(-4, -10, 3, 20);
    ctx.fillRect(2, -10, 3, 20);
    ctx.restore();
    // Stinger
    ctx.fillStyle = "#2D3436";
    ctx.beginPath();
    ctx.moveTo(-BEE_RADIUS + 1, -1.5);
    ctx.lineTo(-BEE_RADIUS - 3, 0);
    ctx.lineTo(-BEE_RADIUS + 1, 1.5);
    ctx.fill();
    // Face: sparkly eye and blush, same as everyone else
    ctx.beginPath();
    ctx.arc(6, -1.5, 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(6.5, -2.2, 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 118, 117, 0.6)";
    ctx.beginPath();
    ctx.arc(7, 2.5, 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

/**
 * When a goal is off-screen, a small pill at the screen edge shows its emoji and which
 * way to go. `screenX` is the goal's position relative to the visible screen.
 */
export function drawOffscreenArrow(ctx: CanvasRenderingContext2D, screenX: number, screenWidth: number, emoji: string): void {
    if (screenX >= 0 && screenX <= screenWidth) return;
    const right = screenX > screenWidth;
    const pulse = Math.sin(Date.now() * 0.008) * 3;
    const cx = right ? screenWidth - 34 - pulse : 34 + pulse;
    const cy = 215;
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.beginPath();
    ctx.roundRect(cx - 26, cy - 15, 52, 30, 15);
    ctx.fill();
    ctx.fillStyle = "#FF6B8B";
    ctx.beginPath();
    const tip = right ? cx + 22 : cx - 22;
    const back = right ? cx + 10 : cx - 10;
    ctx.moveTo(back, cy - 8);
    ctx.lineTo(tip, cy);
    ctx.lineTo(back, cy + 8);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#000";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, right ? cx - 6 : cx + 6, cy + 1);
    ctx.restore();
}

/** Moving platforms are fluffy clouds so they read as different from the earthy ledges. */
export function drawCloudPlatforms(ctx: CanvasRenderingContext2D, platforms: readonly Platform[]): void {
    for (const p of platforms) {
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, p.width, 14, 7);
        ctx.fill();
        const puffs = Math.max(2, Math.round(p.width / 30));
        for (let i = 0; i < puffs; i++) {
            ctx.beginPath();
            ctx.arc(p.x + ((i + 0.5) * p.width) / puffs, p.y + 4, 10, Math.PI, 0);
            ctx.fill();
        }
        ctx.fillStyle = "rgba(116, 185, 255, 0.35)";
        ctx.fillRect(p.x + 6, p.y + 10, p.width - 12, 3);
    }
}

export function drawMushrooms(ctx: CanvasRenderingContext2D, mushrooms: readonly Point[]): void {
    for (const m of mushrooms) {
        const squash = 1 + Math.sin(Date.now() * 0.008 + m.x) * 0.04;
        // Stalk
        ctx.fillStyle = "#FFF3E0";
        ctx.fillRect(m.x - 7, m.y - MUSHROOM_HEIGHT + 6, 14, MUSHROOM_HEIGHT - 6);
        // Cap
        ctx.fillStyle = "#E84393";
        ctx.beginPath();
        ctx.ellipse(m.x, m.y - MUSHROOM_HEIGHT + 4, (MUSHROOM_WIDTH / 2) * squash, 12 / squash, 0, Math.PI, 0);
        ctx.fill();
        // Spots
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(m.x - 9, m.y - MUSHROOM_HEIGHT - 1, 3, 0, Math.PI * 2);
        ctx.arc(m.x + 7, m.y - MUSHROOM_HEIGHT - 3, 3.5, 0, Math.PI * 2);
        ctx.arc(m.x, m.y - MUSHROOM_HEIGHT + 2, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

export const PET_EMOJI: Readonly<Record<Species, string>> = {
    kitty: "🐱",
    puppy: "🐶",
    hamster: "🐹",
    turtle: "🐢",
    bunny: "🐰",
    duckling: "🐥",
    piglet: "🐷",
    fox: "🦊",
    panda: "🐼",
    unicorn: "🦄",
    frog: "🐸",
    bird: "🐦",
    snail: "🐌",
    bear: "🐻",
    owl: "🦉"
};

/**
 * A rescued pet standing on the grass (its feet at `y + 12`), drawn in the characters' style,
 * with a soft shadow and a little heart. It trots while moving and hops gently while waiting.
 */
export function drawRescuedPet(
    ctx: CanvasRenderingContext2D,
    species: Species,
    x: number,
    y: number,
    facingLeft: boolean = false,
    vx: number = 0,
    swimming: boolean = false
): void {
    const now = Date.now();
    // Each species bobs on its own rhythm so the parade doesn't move in lockstep.
    const phase = Object.keys(PET_EMOJI).indexOf(species) * 1.3;
    const moving = Math.abs(vx) > 0.4;
    const step = moving ? Math.sin(now * 0.022 + phase) : 0;
    const hop = moving ? Math.abs(step) * 1.5 : Math.abs(Math.sin(now * 0.004 + phase)) * 2.5;
    // Paddling across a pond: sit lower in the water, no hopping, legs hidden by a ripple
    const groundY = swimming ? WATER_SURFACE_Y + 6 : y + 12;
    const lift = swimming ? Math.sin(now * 0.006 + phase) * 1 : hop;

    ctx.save();
    if (!swimming) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.beginPath();
        ctx.ellipse(x, groundY, 11 - hop, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    drawPetSprite(ctx, species, x, groundY - lift, facingLeft, swimming ? 0 : step);
    if (swimming) drawSwimRipple(ctx, x + 2, 15);
    ctx.fillStyle = "#FF7A93";
    drawHeart(ctx, x + (facingLeft ? -8 : 8), groundY - 34 - lift, 4);
    ctx.restore();
}

export function drawTreeAndGround(
    ctx: CanvasRenderingContext2D,
    worldWidth: number,
    trees: readonly number[],
    digMounds: readonly DigMound[],
    boneFound: boolean,
    boneX: number,
    snowy: boolean = false
): void {
    for (const treeX of trees) drawTree(ctx, treeX, snowy);

    // Ground: green grass, or soft snow
    ctx.fillStyle = snowy ? "#F5F9FC" : "#00B894";
    ctx.fillRect(0, 428, worldWidth, 72);
    if (snowy) {
        ctx.fillStyle = "#DDEAF3";
        ctx.fillRect(0, 446, worldWidth, 54);
    }

    // Dirt Mounds & Hidden Bone
    for (const m of digMounds) {
        if (!m.dug) {
            ctx.fillStyle = "#8D6E63";
            ctx.beginPath();
            ctx.arc(m.x, 428, 14, Math.PI, 0);
            ctx.fill();
        } else if (!m.hasBone) {
            ctx.fillStyle = "#6D4C41";
            ctx.fillRect(m.x - 12, 425, 24, 4);
        }
    }

    if (boneFound) {
        // The dug-up hole, with the bone resting on a little pile of dirt beside it
        ctx.fillStyle = "#6D4C41";
        ctx.beginPath();
        ctx.ellipse(boneX, 429, 11, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#8D6E63";
        ctx.beginPath();
        ctx.ellipse(boneX + 3, 427, 9, 3.5, 0, Math.PI, 0);
        ctx.fill();
        drawBone(ctx, boneX, 420);
    }
}

/** A tiny happy face for flower centres: dot eyes, a smile and a blush. */
function drawFlowerFace(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
    const e = r * 0.18;
    ctx.fillStyle = "#2D3436";
    ctx.beginPath();
    ctx.arc(x - r * 0.35, y - r * 0.12, e, 0, Math.PI * 2);
    ctx.arc(x + r * 0.35, y - r * 0.12, e, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 118, 117, 0.6)";
    ctx.beginPath();
    ctx.ellipse(x - r * 0.62, y + r * 0.3, r * 0.2, r * 0.13, 0, 0, Math.PI * 2);
    ctx.ellipse(x + r * 0.62, y + r * 0.3, r * 0.2, r * 0.13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#2D3436";
    ctx.lineWidth = Math.max(0.8, r * 0.12);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(x, y + r * 0.12, r * 0.28, 0.3, Math.PI - 0.3);
    ctx.stroke();
}

/** A curved stem from the ground up to (x + lean, topY), with one leaf. */
function drawStem(ctx: CanvasRenderingContext2D, x: number, groundY: number, topY: number, lean: number, width: number): void {
    ctx.strokeStyle = "#3FA866";
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.quadraticCurveTo(x - 3 + lean * 0.3, (groundY + topY) / 2, x + lean, topY);
    ctx.stroke();
    ctx.fillStyle = "#55C57A";
    ctx.beginPath();
    ctx.ellipse(x + 5, groundY - (groundY - topY) * 0.35, 5.5, 2.6, -0.5, 0, Math.PI * 2);
    ctx.fill();
}

export function drawSprouts(
    ctx: CanvasRenderingContext2D,
    sprouts: readonly Sprout[],
    allBloomed: boolean
): void {
    const now = Date.now();
    for (const s of sprouts) {
        const isBig = s.waterNeeded > 1;
        if (s.bloomed) {
            // Every flower dances once the whole garden has bloomed; otherwise a gentle sway.
            const dance = allBloomed ? Math.sin(now * 0.01 + s.danceOffset) : Math.sin(now * 0.002 + s.danceOffset) * 0.25;
            const headY = s.y - (isBig ? 36 : 24) + (allBloomed ? dance * 5 : 0);
            const lean = dance * 3;
            const hx = s.x + lean;
            drawStem(ctx, s.x, s.y, headY, lean, isBig ? 4.5 : 3.5);

            ctx.save();
            ctx.translate(hx, headY);
            ctx.rotate(dance * 0.12);
            if (isBig) {
                // Sunflower: a ring of long petals around a big brown smiling centre
                for (let i = 0; i < 12; i++) {
                    const a = (i / 12) * Math.PI * 2;
                    ctx.fillStyle = i % 2 ? s.color : "#F7B731";
                    ctx.beginPath();
                    ctx.ellipse(Math.cos(a) * 12, Math.sin(a) * 12, 7, 3.6, a, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.fillStyle = "#8D5B3A";
                ctx.beginPath();
                ctx.arc(0, 0, 9, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
                ctx.beginPath();
                ctx.arc(-3, -3, 4, 0, Math.PI * 2);
                ctx.fill();
                drawFlowerFace(ctx, 0, 0.5, 8);
            } else {
                // Five round petals, each with a soft highlight, around a sunny smiling centre
                for (let i = 0; i < 5; i++) {
                    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
                    const px = Math.cos(a) * 7.5;
                    const py = Math.sin(a) * 7.5;
                    ctx.fillStyle = s.color;
                    ctx.beginPath();
                    ctx.arc(px, py, 6.2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                    ctx.beginPath();
                    ctx.arc(px - 1.5, py - 1.5, 2.2, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.fillStyle = "#FFEAA7";
                ctx.beginPath();
                ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
                ctx.fill();
                drawFlowerFace(ctx, 0, 0.3, 5.5);
            }
            ctx.restore();
        } else if (isBig) {
            // Big bud: grows taller with each splash, and shows how many splashes it still wants.
            const growth = s.water / s.waterNeeded;
            const budY = s.y - 16 - growth * 14;
            drawStem(ctx, s.x, s.y, budY, 0, 4.5);
            ctx.fillStyle = "#55C57A";
            ctx.beginPath();
            ctx.ellipse(s.x - 8, s.y - 9, 8, 4, -0.4, 0, Math.PI * 2);
            ctx.ellipse(s.x + 8, s.y - 9, 8, 4, 0.4, 0, Math.PI * 2);
            ctx.fill();
            // Teardrop bud peeking out of green sepals
            const bw = 6 + growth * 4;
            const bh = 9 + growth * 5;
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.moveTo(s.x, budY - bh - 3);
            ctx.quadraticCurveTo(s.x + bw + 2, budY - bh * 0.4, s.x, budY + 1);
            ctx.quadraticCurveTo(s.x - bw - 2, budY - bh * 0.4, s.x, budY - bh - 3);
            ctx.fill();
            ctx.fillStyle = "#3FA866";
            ctx.beginPath();
            ctx.ellipse(s.x - 4, budY - 2, 4, 2.4, 0.6, 0, Math.PI * 2);
            ctx.ellipse(s.x + 4, budY - 2, 4, 2.4, -0.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.fillStyle = "#000";
            ctx.font = "11px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("💧".repeat(s.waterNeeded - s.water), s.x, budY - bh - 8);
            ctx.textAlign = "start";
        } else {
            // Sprout: two plump leaves around a sleepy little bud, waiting for water
            const sway = Math.sin(now * 0.003 + s.danceOffset) * 1.2;
            ctx.strokeStyle = "#3FA866";
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.quadraticCurveTo(s.x, s.y - 7, s.x + sway, s.y - 12);
            ctx.stroke();
            ctx.fillStyle = "#55EFC4";
            ctx.beginPath();
            ctx.ellipse(s.x - 5.5 + sway * 0.5, s.y - 9, 5.5, 3, -0.5, 0, Math.PI * 2);
            ctx.ellipse(s.x + 5.5 + sway * 0.5, s.y - 9, 5.5, 3, 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.ellipse(s.x + sway, s.y - 14, 3.2, 3.8, 0, 0, Math.PI * 2);
            ctx.fill();
            // Closed sleepy eyes on the bud
            ctx.strokeStyle = "rgba(45, 52, 54, 0.7)";
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.arc(s.x + sway - 1.2, s.y - 14.2, 0.8, 0.2, Math.PI - 0.2);
            ctx.moveTo(s.x + sway + 2, s.y - 14.2);
            ctx.arc(s.x + sway + 1.2, s.y - 14.2, 0.8, 0.2, Math.PI - 0.2);
            ctx.stroke();
        }
    }
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.35);
    ctx.bezierCurveTo(x - size, y - size * 0.4, x - size * 0.4, y - size, x, y - size * 0.35);
    ctx.bezierCurveTo(x + size * 0.4, y - size, x + size, y - size * 0.4, x, y + size * 0.35);
    ctx.fill();
}

/** Puffy round canopy on a soft tapered trunk, swaying gently, dotted with blossoms. */
export function drawTree(ctx: CanvasRenderingContext2D, treeX: number, snowy: boolean = false): void {
    const now = Date.now();
    ctx.save();
    ctx.translate(treeX, 0);

    // Trunk: tapers up from a little root flare; the base hides under the grass
    ctx.fillStyle = "#A1887F";
    ctx.beginPath();
    ctx.moveTo(-7, 322);
    ctx.quadraticCurveTo(-8, 395, -15, 432);
    ctx.lineTo(15, 432);
    ctx.quadraticCurveTo(8, 395, 7, 322);
    ctx.closePath();
    ctx.fill();
    // Shade down one side, and a little knothole
    ctx.fillStyle = "#8D6E63";
    ctx.beginPath();
    ctx.moveTo(2, 322);
    ctx.quadraticCurveTo(3, 395, 8, 432);
    ctx.lineTo(15, 432);
    ctx.quadraticCurveTo(8, 395, 7, 322);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#6D4C41";
    ctx.beginPath();
    ctx.ellipse(-2, 382, 3, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Canopy sways a touch around the top of the trunk
    ctx.translate(0, 330);
    ctx.rotate(Math.sin(now * 0.0012 + treeX) * 0.025);
    ctx.translate(0, -330);

    const puffs: readonly [number, number, number][] = [
        [-27, 314, 22], [27, 314, 22], [-15, 292, 24], [15, 290, 25], [0, 276, 22], [0, 312, 28]
    ];
    // Darker underside first, then the main green, then soft highlights
    ctx.fillStyle = "#3FA866";
    for (const [px, py, r] of puffs) {
        ctx.beginPath();
        ctx.arc(px, py + 5, r, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = "#55C57A";
    for (const [px, py, r] of puffs) {
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
    for (const [px, py, r] of [[-18, 284, 9], [6, 268, 7], [-32, 306, 6]] as const) {
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
    }

    if (snowy) {
        // Fluffy snow resting on top of the canopy instead of blossoms
        ctx.fillStyle = "#FFFFFF";
        for (const [sx, sy, r] of [[-24, 298, 11], [-8, 276, 13], [10, 270, 12], [26, 292, 10], [0, 262, 9]] as const) {
            ctx.beginPath();
            ctx.ellipse(sx, sy, r, r * 0.6, 0, Math.PI, 0);
            ctx.fill();
        }
        ctx.restore();
        return;
    }

    // Tiny pink blossoms
    for (const [bx, by] of [[-22, 300], [18, 280], [28, 318], [-4, 322], [4, 288]] as const) {
        ctx.fillStyle = "#FFB8D0";
        for (let i = 0; i < 5; i++) {
            const a = (i / 5) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(bx + Math.cos(a) * 2.6, by + Math.sin(a) * 2.6, 2.1, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = "#FFEAA7";
        ctx.beginPath();
        ctx.arc(bx, by, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

/** Noodle's house: soft pink walls, a scalloped rounded roof, an arched door and a bone sign. */
/** Draws the doghouse centred on `centerX` (the shapes below are laid out for 707). */
export function drawDoghouse(ctx: CanvasRenderingContext2D, centerX: number = 707): void {
    ctx.save();
    ctx.translate(centerX - 707, 0);

    // Walls with faint planks
    ctx.fillStyle = "#FF9AA2";
    ctx.beginPath();
    ctx.roundRect(670, 346, 75, 84, [6, 6, 0, 0]);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
    for (let py = 360; py < 428; py += 14) ctx.fillRect(672, py, 71, 2);

    // Roof: a rounded peak with rows of scalloped shingles
    ctx.beginPath();
    ctx.moveTo(654, 356);
    ctx.quadraticCurveTo(690, 322, 703, 309);
    ctx.quadraticCurveTo(707.5, 304, 712, 309);
    ctx.quadraticCurveTo(725, 322, 761, 356);
    ctx.closePath();
    ctx.fillStyle = "#E17055";
    ctx.fill();
    ctx.save();
    ctx.clip();
    ctx.fillStyle = "#EE8A6E";
    for (let row = 0; row < 4; row++) {
        const sy = 322 + row * 10;
        for (let sx = 650 + (row % 2) * 6; sx < 765; sx += 12) {
            ctx.beginPath();
            ctx.arc(sx, sy, 5.5, 0, Math.PI);
            ctx.fill();
        }
    }
    ctx.restore();
    // Rounded eave along the bottom of the roof
    ctx.fillStyle = "#C8553D";
    ctx.beginPath();
    ctx.roundRect(652, 352, 111, 8, 4);
    ctx.fill();

    // Heart on the gable
    ctx.fillStyle = "#FFFFFF";
    drawHeart(ctx, 707.5, 330, 6);

    // Bone sign over the door
    ctx.fillStyle = "#FDCB6E";
    ctx.beginPath();
    ctx.roundRect(694, 365, 27, 13, 5);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(701, 370, 13, 3);
    for (const [bx, by] of [[700.5, 369.5], [700.5, 373.5], [714.5, 369.5], [714.5, 373.5]] as const) {
        ctx.beginPath();
        ctx.arc(bx, by, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Arched door with a cream trim
    ctx.beginPath();
    ctx.moveTo(690, 430);
    ctx.lineTo(690, 402);
    ctx.arc(707.5, 402, 17.5, Math.PI, 0);
    ctx.lineTo(725, 430);
    ctx.closePath();
    ctx.fillStyle = "#4A3B47";
    ctx.fill();
    ctx.strokeStyle = "#FFE0D6";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Food bowl beside the house
    ctx.fillStyle = "#C8A27A";
    ctx.beginPath();
    ctx.ellipse(756, 424, 7, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#74B9FF";
    ctx.beginPath();
    ctx.moveTo(747, 423);
    ctx.lineTo(765, 423);
    ctx.quadraticCurveTo(764, 430, 756, 430);
    ctx.quadraticCurveTo(748, 430, 747, 423);
    ctx.fill();

    ctx.restore();
}

/** A four-point twinkle, like the sparkles in Flora's eyes. */
function drawTwinkle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.quadraticCurveTo(x, y, x + size, y);
    ctx.quadraticCurveTo(x, y, x, y + size);
    ctx.quadraticCurveTo(x, y, x - size, y);
    ctx.quadraticCurveTo(x, y, x, y - size);
    ctx.fill();
}

/** The golden key: a glowing, gently swaying key with a smiling round bow and twinkles. */
export function drawKey(ctx: CanvasRenderingContext2D, keyX: number, keyY: number): void {
    const now = Date.now();
    const bobY = keyY + Math.sin(now * 0.006) * 4;
    ctx.save();
    // Soft warm glow that fades out at the edges, so it catches the eye on any sky
    const glow = 0.45 + Math.sin(now * 0.005) * 0.15;
    const halo = ctx.createRadialGradient(keyX + 6, bobY, 4, keyX + 6, bobY, 22);
    halo.addColorStop(0, `rgba(255, 246, 204, ${glow})`);
    halo.addColorStop(1, "rgba(255, 246, 204, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(keyX + 6, bobY, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(keyX, bobY);
    ctx.rotate(Math.sin(now * 0.003) * 0.15);
    const gold = "#F7C948", deep = "#E1A33B", light = "#FFE9A8";
    // Shaft and two rounded teeth
    ctx.fillStyle = deep;
    ctx.beginPath();
    ctx.roundRect(4, -2.5, 19, 5, 2.5);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(14, 1, 3.6, 6, 1.6);
    ctx.roundRect(19.4, 1, 3.6, 4.5, 1.6);
    ctx.fill();
    ctx.fillStyle = gold;
    ctx.beginPath();
    ctx.roundRect(4, -2.5, 19, 3.5, 1.8);
    ctx.fill();
    // Round bow with a shiny rim and a happy little face
    ctx.fillStyle = deep;
    ctx.beginPath();
    ctx.arc(0, 0, 9.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = gold;
    ctx.beginPath();
    ctx.arc(-0.5, -0.6, 8.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = light;
    ctx.beginPath();
    ctx.ellipse(-3.5, -4, 3, 1.8, -0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#6D4C41";
    ctx.beginPath();
    ctx.arc(-2.6, 0, 1, 0, Math.PI * 2);
    ctx.arc(2.2, 0, 1, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#6D4C41";
    ctx.lineWidth = 0.9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(-0.2, 1.6, 1.8, 0.3, Math.PI - 0.3);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 118, 117, 0.55)";
    ctx.beginPath();
    ctx.arc(-5, 2.4, 1.4, 0, Math.PI * 2);
    ctx.arc(4.6, 2.4, 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Twinkles popping in and out around it
    ctx.fillStyle = "#FFFFFF";
    for (let i = 0; i < 3; i++) {
        const t = now * 0.004 + i * 2.1;
        const size = Math.max(0, Math.sin(t)) * 3.5;
        if (size < 0.4) continue;
        drawTwinkle(ctx, keyX + [-13, 22, 8][i], bobY + [-12, -10, 13][i], size);
    }
}

/** Noodle's bone: a plump cream bone with rounded knobs, a shine and a sleepy-happy face. */
export function drawBone(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const cream = "#FFF8E7", shade = "#EADCC0";
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.12);
    // Shadow underneath
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.beginPath();
    ctx.ellipse(0, 6, 14, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Darker underside first, then the bone on top, so it looks round
    for (const [fill, dy] of [[shade, 1.2], [cream, 0]] as const) {
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.roundRect(-9, -2.8 + dy, 18, 5.6, 2.8);
        ctx.fill();
        for (const [kx, ky] of [[-10.5, -2.4], [-10.5, 2.4], [10.5, -2.4], [10.5, 2.4]] as const) {
            ctx.beginPath();
            ctx.arc(kx, ky + dy, 3.6, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.beginPath();
    ctx.ellipse(-3, -1.6, 4.5, 0.9, 0, 0, Math.PI * 2);
    ctx.fill();
    // Happy closed eyes and a smile
    ctx.strokeStyle = "#8D6E63";
    ctx.lineWidth = 0.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(-2.4, 0, 1, Math.PI + 0.3, -0.3);
    ctx.moveTo(3.4, 0);
    ctx.arc(2.4, 0, 1, Math.PI + 0.3, -0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0.8, 1.4, 0.3, Math.PI - 0.3);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 118, 117, 0.5)";
    ctx.beginPath();
    ctx.arc(-4.6, 1.4, 1.1, 0, Math.PI * 2);
    ctx.arc(4.6, 1.4, 1.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

export function drawCelebrationBanner(ctx: CanvasRenderingContext2D, petName: string): void {
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
    ctx.beginPath();
    ctx.roundRect(220, 120, 360, 54, 20);
    ctx.fill();
    ctx.strokeStyle = "#FFB6C1";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#FF6B8B";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`🎉 Rescued ${petName}! 🎉`, 400, 154);
    ctx.restore();
}
