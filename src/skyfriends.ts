import { CANVAS_WIDTH } from './layout.ts';

/*
 * Occasional sky visitors — a kite, a little airplane, a bunch of balloons — drifting by
 * behind everything, like the butterflies. Purely decorative: they never touch gameplay.
 * Only one is in the sky at a time, with a pause between visits, so the sky stays calm.
 */

export type SkyVisitorKind = 'kite' | 'plane' | 'balloons';

export interface SkyVisitor {
    kind: SkyVisitorKind;
    x: number;
    y: number;
    /** Base height it drifts around (kite, plane) or starts rising from (balloons). */
    baseY: number;
    vx: number;
    vy: number;
    age: number;
    color: string;
}

/** Visitors stay between the HUD and the top of the characters. */
export const SKY_MIN_Y: number = 85;
export const SKY_MAX_Y: number = 330;
/** Ticks between one visitor leaving and the next arriving (6–14 s). */
export const SKY_GAP_MIN: number = 360;
export const SKY_GAP_MAX: number = 840;
const OFFSCREEN = 90;
const KINDS: readonly SkyVisitorKind[] = ['kite', 'plane', 'balloons'];
const COLORS: readonly string[] = ["#FD79A8", "#74B9FF", "#A29BFE", "#55E6C1", "#FDCB6E"];

export class SkyVisitors {
    public visitor: SkyVisitor | null = null;
    /** Ticks until the next visitor arrives. */
    public cooldown: number;
    private random: () => number;
    private lastKind: SkyVisitorKind | null = null;
    /** Upcoming kinds: a shuffled bag, so all three take turns before any comes back. */
    private bag: SkyVisitorKind[] = [];

    constructor(random: () => number = Math.random) {
        this.random = random;
        this.cooldown = 240; // the first one shows up a few seconds in
    }

    private spawn(): SkyVisitor {
        if (this.bag.length === 0) {
            this.bag = [...KINDS];
            for (let i = this.bag.length - 1; i > 0; i--) {
                const j = Math.floor(this.random() * (i + 1));
                [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
            }
            // Never the same kind twice in a row across bags either.
            if (this.bag[0] === this.lastKind) this.bag.push(this.bag.shift() as SkyVisitorKind);
        }
        const kind = this.bag.shift() as SkyVisitorKind;
        this.lastKind = kind;
        const fromLeft = this.random() < 0.5;
        const dir = fromLeft ? 1 : -1;
        const color = COLORS[Math.floor(this.random() * COLORS.length)];
        const startX = fromLeft ? -OFFSCREEN + 10 : CANVAS_WIDTH + OFFSCREEN - 10;
        if (kind === 'plane') {
            const baseY = 100 + this.random() * 40;
            return { kind, x: startX, y: baseY, baseY, vx: dir * 1.1, vy: 0, age: 0, color };
        }
        if (kind === 'kite') {
            const baseY = 150 + this.random() * 60;
            return { kind, x: startX, y: baseY, baseY, vx: dir * 0.8, vy: 0, age: 0, color };
        }
        // Balloons rise from low in the sky and drift sideways as they float off the top.
        const baseY = SKY_MAX_Y - 20;
        const x = 120 + this.random() * (CANVAS_WIDTH - 240);
        return { kind, x, y: baseY, baseY, vx: dir * 0.25, vy: -0.45, age: 0, color };
    }

    public update(): void {
        if (!this.visitor) {
            if (--this.cooldown <= 0) this.visitor = this.spawn();
            return;
        }
        const v = this.visitor;
        v.age++;
        v.x += v.vx;
        if (v.kind === 'balloons') {
            v.y += v.vy;
        } else {
            // Kites dip and swoop on the breeze; planes bob very gently.
            const amp = v.kind === 'kite' ? 16 : 3;
            v.y = v.baseY + Math.sin(v.age * (v.kind === 'kite' ? 0.025 : 0.04)) * amp;
        }
        const gone = v.x < -OFFSCREEN || v.x > CANVAS_WIDTH + OFFSCREEN || v.y < SKY_MIN_Y - 10;
        if (gone) {
            this.visitor = null;
            this.cooldown = SKY_GAP_MIN + Math.floor(this.random() * (SKY_GAP_MAX - SKY_GAP_MIN));
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const v = this.visitor;
        if (!v) return;
        ctx.save();
        // Fade balloons out as they reach the top, instead of slipping under the HUD.
        if (v.kind === 'balloons') ctx.globalAlpha = Math.max(0, Math.min(1, (v.y - SKY_MIN_Y) / 40));
        if (v.kind === 'kite') drawKite(ctx, v);
        else if (v.kind === 'plane') drawPlane(ctx, v);
        else drawBalloons(ctx, v);
        ctx.restore();
    }
}

function drawKite(ctx: CanvasRenderingContext2D, v: SkyVisitor): void {
    const tilt = Math.sin(v.age * 0.025 + 1) * 0.25;
    // String trails down and back toward whoever is flying it, off-screen.
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(v.x, v.y + 14);
    ctx.quadraticCurveTo(v.x - v.vx * 120, v.y + 120, v.x - v.vx * 260, SKY_MAX_Y + 120);
    ctx.stroke();

    ctx.save();
    ctx.translate(v.x, v.y);
    ctx.rotate(tilt);
    // Tail of little bows, wiggling
    ctx.strokeStyle = "#636E72";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 14);
    for (let i = 1; i <= 4; i++) ctx.lineTo(Math.sin(v.age * 0.1 + i) * 4, 14 + i * 8);
    ctx.stroke();
    for (let i = 1; i <= 4; i++) {
        const bx = Math.sin(v.age * 0.1 + i) * 4;
        ctx.fillStyle = i % 2 ? "#FDCB6E" : "#FD79A8";
        ctx.beginPath();
        ctx.moveTo(bx, 14 + i * 8);
        ctx.lineTo(bx - 4, 11 + i * 8);
        ctx.lineTo(bx - 4, 17 + i * 8);
        ctx.moveTo(bx, 14 + i * 8);
        ctx.lineTo(bx + 4, 11 + i * 8);
        ctx.lineTo(bx + 4, 17 + i * 8);
        ctx.fill();
    }
    // Diamond with rounded-feeling halves and a cute face
    ctx.fillStyle = v.color;
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.quadraticCurveTo(11, -6, 12, -2);
    ctx.quadraticCurveTo(6, 8, 0, 14);
    ctx.quadraticCurveTo(-6, 8, -12, -2);
    ctx.quadraticCurveTo(-11, -6, 0, -16);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.quadraticCurveTo(-11, -6, -12, -2);
    ctx.lineTo(0, -2);
    ctx.closePath();
    ctx.fill();
    drawTinyFace(ctx, 0, 0, 5);
    ctx.restore();
}

function drawPlane(ctx: CanvasRenderingContext2D, v: SkyVisitor): void {
    ctx.save();
    ctx.translate(v.x, v.y);
    if (v.vx < 0) ctx.scale(-1, 1);
    // Little puffs trailing behind
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(-22 - i * 9, Math.sin(v.age * 0.08 + i) * 1.5, 4.5 - i, 0, Math.PI * 2);
        ctx.fill();
    }
    // Tail fin and back wing
    ctx.fillStyle = "#E17055";
    ctx.beginPath();
    ctx.moveTo(-16, -2);
    ctx.lineTo(-22, -12);
    ctx.lineTo(-13, -4);
    ctx.fill();
    ctx.fillStyle = "#FAB1A0";
    ctx.beginPath();
    ctx.ellipse(-2, -3, 6, 2.5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Chubby body
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = v.color;
    ctx.fillRect(-14, 1, 26, 2.5);
    // Windows
    ctx.fillStyle = "#74B9FF";
    for (const wx of [-8, -3, 2]) {
        ctx.beginPath();
        ctx.arc(wx, -2, 1.6, 0, Math.PI * 2);
        ctx.fill();
    }
    // Front wing and nose with a smile
    ctx.fillStyle = "#E17055";
    ctx.beginPath();
    ctx.ellipse(-1, 4, 7, 2.6, 0.35, 0, Math.PI * 2);
    ctx.fill();
    drawTinyFace(ctx, 13, -0.5, 4);
    ctx.restore();
}

function drawBalloons(ctx: CanvasRenderingContext2D, v: SkyVisitor): void {
    const bunch: readonly [number, number, string][] = [[-8, -2, "#FD79A8"], [8, -4, "#74B9FF"], [0, -14, v.color]];
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = "rgba(99, 110, 114, 0.8)";
    for (const [bx, by] of bunch) {
        const sway = Math.sin(v.age * 0.04 + bx) * 2;
        ctx.beginPath();
        ctx.moveTo(v.x + bx + sway, v.y + by + 11);
        ctx.quadraticCurveTo(v.x + bx * 0.4, v.y + 24, v.x, v.y + 36);
        ctx.stroke();
    }
    for (const [bx, by, color] of bunch) {
        const sway = Math.sin(v.age * 0.04 + bx) * 2;
        const cx = v.x + bx + sway;
        const cy = v.y + by;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 8, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        // Knot and a shine
        ctx.beginPath();
        ctx.moveTo(cx - 2, cy + 11);
        ctx.lineTo(cx, cy + 9);
        ctx.lineTo(cx + 2, cy + 11);
        ctx.fill();
        ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
        ctx.beginPath();
        ctx.ellipse(cx - 3, cy - 4, 2, 3.2, -0.4, 0, Math.PI * 2);
        ctx.fill();
    }
    drawTinyFace(ctx, v.x + Math.sin(v.age * 0.04) * 2, v.y - 13, 4.5);
}

/** The same happy face everyone in the game has, scaled down. */
function drawTinyFace(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
    ctx.fillStyle = "#2D3436";
    ctx.beginPath();
    ctx.arc(x - r * 0.4, y - r * 0.15, r * 0.17, 0, Math.PI * 2);
    ctx.arc(x + r * 0.4, y - r * 0.15, r * 0.17, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#2D3436";
    ctx.lineWidth = 0.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(x, y + r * 0.1, r * 0.3, 0.3, Math.PI - 0.3);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 118, 117, 0.55)";
    ctx.beginPath();
    ctx.arc(x - r * 0.7, y + r * 0.25, r * 0.18, 0, Math.PI * 2);
    ctx.arc(x + r * 0.7, y + r * 0.25, r * 0.18, 0, Math.PI * 2);
    ctx.fill();
}
