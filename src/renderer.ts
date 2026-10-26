import { RAINBOW_COLORS } from './levels.ts';
import type { DigMound, Platform, Species, Sprout } from './types.ts';

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

export function drawRescuedPet(
    ctx: CanvasRenderingContext2D,
    species: Species,
    x: number,
    y: number
): void {
    ctx.save();
    ctx.translate(x, y + Math.sin(Date.now() * 0.005) * 3);

    if (species === 'kitty') {
        ctx.fillStyle = "#E67E22";
        ctx.fillRect(-10, -10, 20, 20);
        ctx.fillStyle = "#FFF";
        ctx.fillRect(-6, -4, 12, 10);
    } else if (species === 'puppy') {
        ctx.fillStyle = "#D35400";
        ctx.fillRect(-10, -10, 20, 20);
    } else if (species === 'hamster') {
        ctx.fillStyle = "#F39C12";
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
    } else if (species === 'turtle') {
        ctx.fillStyle = "#27AE60";
        ctx.beginPath();
        ctx.arc(0, 8, 12, Math.PI, 0);
        ctx.fill();
    } else if (species === 'bunny') {
        ctx.fillStyle = "#ECF0F1";
        ctx.fillRect(-8, -10, 16, 20);
    }

    // Sparkles & Heart
    ctx.fillStyle = "#FF7675";
    ctx.font = "12px sans-serif";
    ctx.fillText("💖", -6, -16);

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
        if (s.bloomed) {
            const danceY = allBloomed ? Math.sin(Date.now() * 0.01 + s.danceOffset) * 6 : 0;
            const headY = s.y - 24 + danceY;

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
            ctx.arc(s.x, headY, 13, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#FFF";
            ctx.beginPath();
            ctx.arc(s.x, headY, 5, 0, Math.PI * 2);
            ctx.fill();
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
