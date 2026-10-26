import { MUSHROOM_HEIGHT, MUSHROOM_WIDTH, RAINBOW_COLORS } from './levels.ts';
import type { DigMound, Platform, Point, Species, Sprout } from './types.ts';

export function drawSun(ctx: CanvasRenderingContext2D): void {
    const time = Date.now() * 0.002;
    ctx.save();
    ctx.translate(700, 75);
    ctx.rotate(time * 0.15);
    ctx.fillStyle = "#FDCB6E";
    for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-4, -48, 8, 14);
    }
    ctx.restore();

    ctx.fillStyle = "#FFEAA7";
    ctx.beginPath();
    ctx.arc(700, 75, 34, 0, Math.PI * 2);
    ctx.fill();
    // Outline keeps the sun visible on the pale yellow Pet Paradise sky.
    ctx.strokeStyle = "#FDCB6E";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Cute Sun Smiling Face
    ctx.fillStyle = "#2D3436";
    ctx.beginPath();
    ctx.arc(690, 72, 3, 0, Math.PI * 2);
    ctx.arc(710, 72, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#D63031";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(700, 78, 8, 0.1, Math.PI - 0.1);
    ctx.stroke();

    // Rosy cheeks
    ctx.fillStyle = "#FF7675";
    ctx.beginPath();
    ctx.arc(685, 78, 4, 0, Math.PI * 2);
    ctx.arc(715, 78, 4, 0, Math.PI * 2);
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
    bunny: "🐰"
};

/** A rescued pet: its emoji hopping gently, sitting on `y`, with a little heart above. */
export function drawRescuedPet(
    ctx: CanvasRenderingContext2D,
    species: Species,
    x: number,
    y: number
): void {
    // Each species hops on its own rhythm so the parade doesn't bob in lockstep.
    const phase = Object.keys(PET_EMOJI).indexOf(species) * 1.3;
    const hop = Math.abs(Math.sin(Date.now() * 0.006 + phase)) * 4;

    ctx.save();
    ctx.translate(x, y + 12 - hop);
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    // Soft shadow on the grass stays put while the pet hops.
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.beginPath();
    ctx.ellipse(0, hop, 10 - hop / 2, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Browsers tint emoji with the fill's alpha, so draw them fully opaque after the shadow.
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#000";
    ctx.font = "26px sans-serif";
    ctx.fillText(PET_EMOJI[species], 0, 2);
    ctx.font = "10px sans-serif";
    ctx.fillText("💖", 9, -20);

    ctx.restore();
}

export function drawTreeAndGround(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    treeX: number,
    digMounds: readonly DigMound[],
    boneFound: boolean,
    boneX: number
): void {
    // Background Tree
    ctx.fillStyle = "#795548";
    ctx.fillRect(treeX - 10, 330, 20, 100);
    ctx.fillStyle = "#2E7D32";
    ctx.beginPath();
    ctx.arc(treeX, 310, 40, 0, Math.PI * 2);
    ctx.fill();

    // Ground
    ctx.fillStyle = "#00B894";
    ctx.fillRect(0, 428, canvasWidth, 72);

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
        ctx.fillStyle = "#FFF";
        ctx.fillRect(boneX - 10, 421, 20, 6);
        ctx.beginPath();
        ctx.arc(boneX - 10, 424, 4, 0, Math.PI * 2);
        ctx.arc(boneX + 10, 424, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

export function drawSprouts(
    ctx: CanvasRenderingContext2D,
    sprouts: readonly Sprout[],
    allBloomed: boolean
): void {
    for (const s of sprouts) {
        const isBig = s.waterNeeded > 1;
        if (s.bloomed) {
            const danceY = allBloomed ? Math.sin(Date.now() * 0.01 + s.danceOffset) * 6 : 0;
            const headY = s.y - (isBig ? 36 : 24) + danceY;
            const petal = isBig ? 19 : 13;

            // Stem grounded at s.y
            ctx.strokeStyle = "#27AE60";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x, headY);
            ctx.stroke();

            // Flower Petals & Center
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.arc(s.x, headY, petal, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = isBig ? "#6D4C41" : "#FFF";
            ctx.beginPath();
            ctx.arc(s.x, headY, isBig ? 8 : 5, 0, Math.PI * 2);
            ctx.fill();
        } else if (isBig) {
            // Big bud: grows taller with each splash, and shows how many splashes it still wants.
            const growth = s.water / s.waterNeeded;
            const budY = s.y - 16 - growth * 14;
            ctx.strokeStyle = "#27AE60";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x, budY);
            ctx.stroke();
            ctx.fillStyle = "#55EFC4";
            ctx.beginPath();
            ctx.ellipse(s.x - 8, s.y - 10, 8, 4, -0.4, 0, Math.PI * 2);
            ctx.ellipse(s.x + 8, s.y - 10, 8, 4, 0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.ellipse(s.x, budY - 4, 7 + growth * 4, 10 + growth * 4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = "11px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("💧".repeat(s.waterNeeded - s.water), s.x, budY - 20);
            ctx.textAlign = "start";
        } else {
            // Unbloomed sprout rooted at s.y
            ctx.fillStyle = "#27AE60";
            ctx.fillRect(s.x - 2, s.y - 12, 4, 12);
            ctx.fillStyle = "#55EFC4";
            ctx.beginPath();
            ctx.ellipse(s.x - 5, s.y - 10, 5, 3, -0.4, 0, Math.PI * 2);
            ctx.ellipse(s.x + 5, s.y - 10, 5, 3, 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

export function drawDoghouse(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#FF7675";
    ctx.fillRect(670, 350, 75, 78);
    ctx.fillStyle = "#D63031";
    ctx.beginPath();
    ctx.moveTo(660, 350);
    ctx.lineTo(707, 310);
    ctx.lineTo(755, 350);
    ctx.fill();
    ctx.fillStyle = "#2D3436";
    ctx.fillRect(690, 385, 35, 43);
}

export function drawKey(ctx: CanvasRenderingContext2D, keyX: number, keyY: number): void {
    const bobY = keyY + Math.sin(Date.now() * 0.006) * 4;
    ctx.fillStyle = "#F1C40F";
    ctx.beginPath();
    ctx.arc(keyX, bobY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(keyX + 6, bobY - 2, 14, 4);
    ctx.fillRect(keyX + 14, bobY + 2, 3, 4);
    ctx.fillRect(keyX + 18, bobY + 2, 3, 4);
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
