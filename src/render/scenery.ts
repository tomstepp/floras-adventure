/** The level itself: trees, ground, ponds, ice, platforms, clouds, mushrooms, bushes, the doghouse. */
import { GROUND_Y, MUSHROOM_HEIGHT, MUSHROOM_WIDTH, RAIN_CLOUD_Y, RAIN_WIDTH, WATER_SURFACE_Y } from '../levels.ts';
import { drawHeart } from './shapes.ts';
import { drawBone } from './items.ts';
import type { Bush, DigMound, GroundSpan, Platform, Point } from '../types.ts';

export const WATER_COLOR: string = "#5DADE2";

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
        if (!m.dug) drawMound(ctx, m.x);
        else if (!m.hasBone) drawDugHole(ctx, m.x);
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

/** A soft, rounded dirt mound with a lighter top, a few pebbles and a tiny sprig. */
function drawMound(ctx: CanvasRenderingContext2D, x: number): void {
    ctx.save();
    // Darker base, then the lighter rounded top, so it looks plump
    ctx.fillStyle = "#7B5E52";
    ctx.beginPath();
    ctx.ellipse(x, 429, 17, 13, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "#A1887F";
    ctx.beginPath();
    ctx.ellipse(x - 1, 427, 14, 10.5, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
    ctx.beginPath();
    ctx.ellipse(x - 5, 420, 5, 2.5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Pebbles
    ctx.fillStyle = "#6D4C41";
    for (const [px, py, r] of [[-7, 425, 1.6], [4, 422, 1.3], [8, 426, 1.8]] as const) {
        ctx.beginPath();
        ctx.arc(x + px, py, r, 0, Math.PI * 2);
        ctx.fill();
    }
    // A tiny sprig on top
    ctx.strokeStyle = "#3FA866";
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x + 2, 417.5);
    ctx.lineTo(x + 3, 413);
    ctx.stroke();
    ctx.fillStyle = "#55C57A";
    ctx.beginPath();
    ctx.ellipse(x + 5, 413, 2.4, 1.3, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

/** An empty dug hole: a dark oval with a little pile of loose dirt beside it. */
function drawDugHole(ctx: CanvasRenderingContext2D, x: number): void {
    ctx.save();
    ctx.fillStyle = "#5D4037";
    ctx.beginPath();
    ctx.ellipse(x, 429, 11, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#A1887F";
    ctx.beginPath();
    ctx.ellipse(x + 13, 427, 6, 3.5, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "#6D4C41";
    ctx.beginPath();
    ctx.arc(x + 12, 425.5, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
