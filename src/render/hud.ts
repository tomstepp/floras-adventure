/** Overlays drawn on top of the scene: edge arrows, the star tracker and the celebration banner. */
import { starPath } from './items.ts';

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

/** The celebration banner, with the level's stars popping in underneath one by one. */
export function drawCelebrationBanner(ctx: CanvasRenderingContext2D, petName: string, stars: StarState[], age: number): void {
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
    ctx.beginPath();
    ctx.roundRect(220, 112, 360, 92, 20);
    ctx.fill();
    ctx.strokeStyle = "#FFB6C1";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#FF6B8B";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`🎉 Rescued ${petName}! 🎉`, 400, 146);
    stars.forEach((st, i) => {
        // Each star pops in a moment after the last, with a little bounce.
        const t = Math.max(0, Math.min(1, (age - 8 - i * 10) / 12));
        if (t <= 0) return;
        const pop = t < 1 ? 1 + Math.sin(t * Math.PI) * 0.3 : 1;
        drawStarIcon(ctx, 370 + i * 30, 176, 11 * pop * t, st);
    });
    ctx.restore();
}

/** How one of a level's three stars is going: earned, still possible, or missed this time. */
export type StarState = 'earned' | 'open' | 'missed';

/** A small star for the HUD and banner: gold when earned, outlined while possible, pale when missed. */
export function drawStarIcon(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, st: StarState): void {
    ctx.save();
    ctx.lineJoin = 'round';
    starPath(ctx, x, y, r, r * 0.5);
    if (st === 'earned') {
        ctx.fillStyle = "#FDCB6E";
        ctx.fill();
        ctx.strokeStyle = "#E1A33B";
        ctx.lineWidth = 1.6;
        ctx.stroke();
    } else {
        ctx.fillStyle = st === 'open' ? "rgba(255, 255, 255, 0.85)" : "rgba(223, 230, 233, 0.6)";
        ctx.fill();
        ctx.strokeStyle = st === 'open' ? "#F7B731" : "#B2BEC3";
        ctx.lineWidth = 1.6;
        ctx.setLineDash(st === 'missed' ? [2, 2] : []);
        ctx.stroke();
    }
    ctx.restore();
}

/** The three stars for this level, in a soft pill under the level name. */
export function drawStarRow(ctx: CanvasRenderingContext2D, stars: readonly StarState[]): void {
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.roundRect(16, 54, 82, 24, 12);
    ctx.fill();
    stars.forEach((st, i) => drawStarIcon(ctx, 32 + i * 25, 66, 8, st));
    ctx.restore();
}
