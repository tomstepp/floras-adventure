import { CANVAS_HEIGHT, CANVAS_WIDTH } from './layout.ts';
import type { Weather } from './types.ts';

/*
 * Weather visuals, drawn in screen space like the sun and butterflies: rain, snow, leaves on
 * the wind, and the night (stars, a moon, fireflies and darkness with soft lights). Purely
 * visual — the gameplay side of weather (wind push, rain watering) lives in game.ts.
 */

interface Drop {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    phase: number;
}

/** A soft light cut out of the night's darkness, in screen coordinates. */
export interface Light {
    x: number;
    y: number;
    r: number;
}

const STAR_COUNT = 40;
const FIREFLY_COUNT = 10;

export class WeatherEffects {
    public kind: Weather = 'clear';
    public drops: Drop[] = [];
    private stars: { x: number; y: number; size: number; phase: number }[] = [];
    private ticks: number = 0;
    private random: () => number;
    private darkness: HTMLCanvasElement | null = null;

    constructor(random: () => number = Math.random) {
        this.random = random;
        for (let i = 0; i < STAR_COUNT; i++) {
            this.stars.push({
                x: random() * CANVAS_WIDTH,
                y: 20 + random() * 260,
                size: 0.8 + random() * 1.6,
                phase: random() * Math.PI * 2
            });
        }
    }

    public setKind(kind: Weather): void {
        if (kind === this.kind && this.drops.length > 0) return;
        this.kind = kind;
        this.drops = [];
        const count = kind === 'rain' ? 80 : kind === 'snow' ? 70 : kind === 'night' ? FIREFLY_COUNT : 0;
        for (let i = 0; i < count; i++) this.drops.push(this.newDrop(true));
    }

    /** Butterflies and kites stay home in the rain, snow and dark. */
    public get calmSky(): boolean {
        return this.kind === 'clear' || this.kind === 'wind';
    }

    private newDrop(anywhere: boolean): Drop {
        const r = this.random;
        const x = r() * (CANVAS_WIDTH + 100) - 50;
        if (this.kind === 'rain') {
            return { x, y: anywhere ? r() * CANVAS_HEIGHT : -20, vx: -1.2, vy: 9 + r() * 3, size: 8 + r() * 6, phase: 0 };
        }
        if (this.kind === 'snow') {
            return { x, y: anywhere ? r() * CANVAS_HEIGHT : -10, vx: 0, vy: 0.6 + r() * 0.8, size: 1.5 + r() * 2.5, phase: r() * 6 };
        }
        if (this.kind === 'night') {
            // Fireflies drift slowly around the lower sky.
            return { x: r() * CANVAS_WIDTH, y: 180 + r() * 220, vx: (r() - 0.5) * 0.6, vy: 0, size: 2.2, phase: r() * 6 };
        }
        // Leaves on the wind enter from the side the gust blows from.
        return { x, y: 120 + r() * 300, vx: 0, vy: 0, size: 4 + r() * 3, phase: r() * 6 };
    }

    /** `windX` is the push this tick; `gustSoon` adds a few warning leaves before a gust. */
    public update(windX: number, gustSoon: boolean): void {
        this.ticks++;
        if (this.kind === 'wind') {
            const want = Math.abs(windX) > 0.1 ? 26 : gustSoon ? 6 : 0;
            if (this.drops.length < want && this.ticks % 4 === 0) {
                const leaf = this.newDrop(false);
                leaf.x = windX <= 0 ? CANVAS_WIDTH + 20 : -20;
                this.drops.push(leaf);
            }
            const blow = windX !== 0 ? windX * 3.2 : (gustSoon ? -1.5 : 0);
            for (const d of this.drops) {
                d.vx += (blow - d.vx) * 0.05;
                d.x += d.vx;
                d.y += Math.sin(this.ticks * 0.08 + d.phase) * 1.2 + 0.25;
            }
            this.drops = this.drops.filter(d => d.x > -40 && d.x < CANVAS_WIDTH + 40 && d.y < CANVAS_HEIGHT);
            return;
        }
        for (const d of this.drops) {
            if (this.kind === 'night') {
                d.x += d.vx + Math.sin(this.ticks * 0.02 + d.phase) * 0.3;
                d.y += Math.cos(this.ticks * 0.017 + d.phase) * 0.35;
                if (d.x < -10) d.x = CANVAS_WIDTH + 10;
                if (d.x > CANVAS_WIDTH + 10) d.x = -10;
                continue;
            }
            d.x += d.vx + (this.kind === 'snow' ? Math.sin(this.ticks * 0.03 + d.phase) * 0.5 : 0);
            d.y += d.vy;
            if (d.y > CANVAS_HEIGHT + 10) Object.assign(d, this.newDrop(false));
        }
    }

    /** Draws the sky backdrop for this weather. Returns true if the sun should shine. */
    public drawSky(ctx: CanvasRenderingContext2D, skyColor: string): boolean {
        if (this.kind === 'night') {
            for (const s of this.stars) {
                ctx.globalAlpha = 0.5 + Math.sin(this.ticks * 0.05 + s.phase) * 0.4;
                ctx.fillStyle = "#FFF9DB";
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            drawMoon(ctx, 700, 80, this.ticks, skyColor);
            return false;
        }
        if (this.kind === 'rain') {
            // A soft blanket of grey clouds hides the sun.
            ctx.fillStyle = "rgba(149, 165, 166, 0.55)";
            for (let i = 0; i < 9; i++) {
                ctx.beginPath();
                ctx.arc(i * 100 + ((this.ticks * 0.1) % 100), 40 + (i % 2) * 18, 70, 0, Math.PI * 2);
                ctx.fill();
            }
            return false;
        }
        return true;
    }

    /** Weather in front of the scenery: rain, snow and leaves. */
    public drawFront(ctx: CanvasRenderingContext2D): void {
        if (this.kind === 'rain') {
            ctx.strokeStyle = "rgba(116, 185, 255, 0.65)";
            ctx.lineWidth = 1.6;
            ctx.lineCap = 'round';
            ctx.beginPath();
            for (const d of this.drops) {
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x + d.vx * 1.2, d.y + d.size);
            }
            ctx.stroke();
        } else if (this.kind === 'snow') {
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            for (const d of this.drops) {
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (this.kind === 'wind') {
            for (const d of this.drops) {
                ctx.save();
                ctx.translate(d.x, d.y);
                ctx.rotate(this.ticks * 0.1 + d.phase);
                ctx.fillStyle = d.phase > 3 ? "#F0932B" : "#6AB04C";
                ctx.beginPath();
                ctx.ellipse(0, 0, d.size, d.size * 0.5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
    }

    /** Fireflies glow on top of the darkness. */
    public drawFireflies(ctx: CanvasRenderingContext2D): void {
        if (this.kind !== 'night') return;
        for (const d of this.drops) {
            const glow = 0.55 + Math.sin(this.ticks * 0.08 + d.phase) * 0.45;
            ctx.fillStyle = `rgba(255, 234, 167, ${0.25 * glow})`;
            ctx.beginPath();
            ctx.arc(d.x, d.y, 9, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = `rgba(253, 203, 110, ${glow})`;
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    /** Where the fireflies are, so they light up the dark around them. */
    public fireflyLights(): Light[] {
        return this.kind === 'night' ? this.drops.map(d => ({ x: d.x, y: d.y, r: 38 })) : [];
    }

    /**
     * At night, covers the scene in soft darkness with glowing holes at each light. Uses a
     * second canvas so the lights can be cut out with soft edges.
     */
    public drawDarkness(ctx: CanvasRenderingContext2D, lights: readonly Light[], pixelScale: number): void {
        if (this.kind !== 'night') return;
        const w = Math.round(CANVAS_WIDTH * pixelScale);
        const h = Math.round(CANVAS_HEIGHT * pixelScale);
        if (!this.darkness) this.darkness = document.createElement('canvas');
        const layer = this.darkness;
        if (layer.width !== w || layer.height !== h) {
            layer.width = w;
            layer.height = h;
        }
        const g = layer.getContext('2d');
        if (!g) return;
        g.setTransform(pixelScale, 0, 0, pixelScale, 0, 0);
        g.globalCompositeOperation = 'source-over';
        g.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        g.fillStyle = "rgba(10, 14, 40, 0.62)";
        g.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        g.globalCompositeOperation = 'destination-out';
        for (const l of lights) {
            const grad = g.createRadialGradient(l.x, l.y, l.r * 0.2, l.x, l.y, l.r);
            grad.addColorStop(0, "rgba(0, 0, 0, 1)");
            grad.addColorStop(1, "rgba(0, 0, 0, 0)");
            g.fillStyle = grad;
            g.beginPath();
            g.arc(l.x, l.y, l.r, 0, Math.PI * 2);
            g.fill();
        }
        g.globalCompositeOperation = 'source-over';
        ctx.drawImage(layer, 0, 0, w, h, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}

/** A sleepy crescent moon with the same face everyone has, gently glowing. */
function drawMoon(ctx: CanvasRenderingContext2D, x: number, y: number, ticks: number, skyColor: string): void {
    // Crescent: a full disc with a bite painted over in the sky colour
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 32, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = "#FFF3C4";
    ctx.fillRect(x - 40, y - 40, 80, 80);
    ctx.fillStyle = skyColor;
    ctx.beginPath();
    ctx.arc(x + 16, y - 10, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Soft halo over everything, so the bite and the sky around it glow evenly
    const glow = 0.16 + Math.sin(ticks * 0.02) * 0.05;
    ctx.fillStyle = `rgba(255, 249, 219, ${glow})`;
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, Math.PI * 2);
    ctx.fill();
    // Sleepy closed eye and a little smile on the crescent
    ctx.strokeStyle = "#5D4E75";
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(x - 16, y + 2, 3, 0.2, Math.PI - 0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x - 12, y + 13, 4, 0.3, Math.PI - 0.3);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 118, 117, 0.5)";
    ctx.beginPath();
    ctx.arc(x - 22, y + 9, 3, 0, Math.PI * 2);
    ctx.fill();
}
