/** Rescued pets (with their emoji for menus) and bumblebees. */
import { BEE_RADIUS, WATER_SURFACE_Y } from '../levels.ts';
import { drawPetSprite } from '../pets.ts';
import { drawHeart } from './shapes.ts';
import { drawSwimRipple } from './scenery.ts';
import type { Species } from '../types.ts';

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
