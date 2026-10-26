import { CANVAS_WIDTH } from './layout.ts';

/** Purely decorative: butterflies never touch gameplay. */
export interface Butterfly {
    x: number;
    /** Height the butterfly drifts around. */
    baseY: number;
    y: number;
    /** Horizontal speed in px/tick; negative flies left. */
    vx: number;
    color: string;
    /** Offsets so each one flaps and bobs on its own rhythm. */
    phase: number;
    flap: number;
}

export const BUTTERFLY_COUNT: number = 4;
/** Butterflies stay in the open sky: below the HUD, above the ground and characters. */
export const BUTTERFLY_MIN_Y: number = 110;
export const BUTTERFLY_MAX_Y: number = 330;
const BUTTERFLY_COLORS: readonly string[] = ["#FD79A8", "#A29BFE", "#74B9FF", "#FAB1A0", "#FFEAA7"];
const MARGIN = 20;

export class ButterflySwarm {
    public items: Butterfly[] = [];
    private ticks: number = 0;

    constructor(random: () => number = Math.random) {
        for (let i = 0; i < BUTTERFLY_COUNT; i++) {
            const baseY = BUTTERFLY_MIN_Y + 20 + random() * (BUTTERFLY_MAX_Y - BUTTERFLY_MIN_Y - 40);
            this.items.push({
                // Spread them across the sky so they don't arrive in a clump.
                x: ((i + random() * 0.6) / BUTTERFLY_COUNT) * CANVAS_WIDTH,
                baseY,
                y: baseY,
                vx: (0.35 + random() * 0.35) * (random() < 0.5 ? -1 : 1),
                color: BUTTERFLY_COLORS[i % BUTTERFLY_COLORS.length],
                phase: random() * Math.PI * 2,
                flap: 0
            });
        }
    }

    public update(): void {
        this.ticks++;
        for (const b of this.items) {
            b.x += b.vx;
            // Lazy looping drift: a slow wave plus a faster flutter.
            const t = this.ticks * 0.02 + b.phase;
            b.y = b.baseY + Math.sin(t) * 18 + Math.sin(t * 3.7) * 4;
            b.flap = Math.abs(Math.sin(this.ticks * 0.25 + b.phase));
            // Wrap around off-screen edges.
            if (b.x > CANVAS_WIDTH + MARGIN) b.x = -MARGIN;
            if (b.x < -MARGIN) b.x = CANVAS_WIDTH + MARGIN;
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        for (const b of this.items) {
            ctx.save();
            ctx.translate(b.x, b.y);
            if (b.vx < 0) ctx.scale(-1, 1);
            ctx.globalAlpha = 0.85;

            // Wings fold in and out by squashing them horizontally.
            const open = 0.25 + b.flap * 0.75;
            ctx.fillStyle = b.color;
            for (const side of [-1, 1]) {
                ctx.beginPath();
                ctx.ellipse(side * 4 * open, -2, 5 * open, 4, side * 0.5, 0, Math.PI * 2);
                ctx.ellipse(side * 3 * open, 3, 3.5 * open, 3, -side * 0.4, 0, Math.PI * 2);
                ctx.fill();
            }

            // Body and antennae
            ctx.fillStyle = "#2D3436";
            ctx.beginPath();
            ctx.ellipse(0, 0, 1.3, 4.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#2D3436";
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(0, -4);
            ctx.lineTo(2.5, -8);
            ctx.moveTo(0, -4);
            ctx.lineTo(-1.5, -8);
            ctx.stroke();
            ctx.restore();
        }
    }
}
