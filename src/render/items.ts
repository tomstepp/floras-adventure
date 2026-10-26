/** Things Flora looks after or finds: sprouts and flowers, the key and the bone. */
import { drawTwinkle } from './shapes.ts';
import type { Sprout } from '../types.ts';

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
        const isBig = s.big;
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
            ctx.fillText("💧".repeat(Math.max(0, s.waterNeeded - s.water)), s.x, budY - bh - 8);
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

/** A five-point star path with softly rounded points, centred on (x, y). */
export function starPath(ctx: CanvasRenderingContext2D, x: number, y: number, outer: number, inner: number): void {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const px = x + Math.cos(a) * r;
        const py = y + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
}

/** The hidden star: a plump, smiling gold star that bobs, glows and twinkles. */
export function drawHiddenStar(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const now = Date.now();
    const bobY = y + Math.sin(now * 0.005 + 1) * 3;
    ctx.save();
    const halo = ctx.createRadialGradient(x, bobY, 3, x, bobY, 22);
    halo.addColorStop(0, `rgba(255, 246, 204, ${0.55 + Math.sin(now * 0.006) * 0.15})`);
    halo.addColorStop(1, "rgba(255, 246, 204, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, bobY, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(x, bobY);
    ctx.rotate(Math.sin(now * 0.003) * 0.15);
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#F7B731";
    ctx.fillStyle = "#FDCB6E";
    starPath(ctx, 0, 0, 12, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
    ctx.beginPath();
    ctx.ellipse(-3.5, -4.5, 2.6, 1.4, -0.6, 0, Math.PI * 2);
    ctx.fill();
    drawFlowerFace(ctx, 0, 1, 6);
    ctx.restore();

    ctx.fillStyle = "#FFFFFF";
    for (let i = 0; i < 2; i++) {
        const size = Math.max(0, Math.sin(now * 0.005 + i * 2.6)) * 3;
        if (size > 0.4) drawTwinkle(ctx, x + (i ? -15 : 15), bobY + (i ? 10 : -12), size);
    }
}
