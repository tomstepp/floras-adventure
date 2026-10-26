import type { Species } from './types.ts';

/*
 * The rescued pets, drawn in the same soft, rounded, outline-free style as Flora and Noodle.
 * Every pet is drawn facing right around an origin on the ground under its middle, about
 * 26px tall; the caller mirrors it to face left.
 */

type Ctx = CanvasRenderingContext2D;

function ellipse(ctx: Ctx, x: number, y: number, rx: number, ry: number, color: string, rot: number = 0): void {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
    ctx.fill();
}

function circle(ctx: Ctx, x: number, y: number, r: number, color: string): void {
    ellipse(ctx, x, y, r, r, color);
}

function triangle(ctx: Ctx, points: readonly [number, number][], color: string): void {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (const [px, py] of points.slice(1)) ctx.lineTo(px, py);
    ctx.closePath();
    ctx.fill();
}

/** The shared face: a sparkly eye, a blush and a tiny smile, looking to the right. */
function face(ctx: Ctx, hx: number, hy: number, opts: { eye?: string; smile?: boolean } = {}): void {
    ellipse(ctx, hx + 2.5, hy - 1, 1.4, 1.9, opts.eye ?? "#2D3436");
    circle(ctx, hx + 3, hy - 1.7, 0.55, "#FFFFFF");
    ellipse(ctx, hx + 1, hy + 2.6, 1.9, 1.2, "rgba(255, 118, 117, 0.55)");
    if (opts.smile !== false) {
        ctx.strokeStyle = "#2D3436";
        ctx.lineWidth = 0.9;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(hx + 4.6, hy + 2, 1.3, 0.3, Math.PI - 0.3);
        ctx.stroke();
    }
}

/** Four stubby legs under a body, far pair darker, trotting with `step`. */
function legs(ctx: Ctx, near: string, far: string, step: number, spread: number = 6): void {
    ctx.lineCap = 'round';
    ctx.lineWidth = 3.5;
    const pairs: [number, number, string][] = [
        [-spread, -step, far], [spread - 1, step, far], [-spread + 3, step, near], [spread + 2, -step, near]
    ];
    for (const [lx, swing, color] of pairs) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(lx, -6);
        ctx.lineTo(lx + swing * 1.5, -1.5);
        ctx.stroke();
    }
}

type PetDrawer = (ctx: Ctx, step: number, now: number) => void;

const drawKitty: PetDrawer = (ctx, step, now) => {
    const fur = "#F6A04D", dark = "#E0812E", light = "#FFE3C2";
    // Tail curls up behind
    ctx.strokeStyle = fur;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-8, -9);
    ctx.quadraticCurveTo(-15, -12, -13 + Math.sin(now * 0.004) * 2, -21);
    ctx.stroke();
    legs(ctx, fur, dark, step);
    ellipse(ctx, 0, -9, 10, 6.5, fur);
    ellipse(ctx, 3, -6.5, 5, 3, light);
    // Stripes
    for (const sx of [-5, -1]) ellipse(ctx, sx, -14, 1.2, 2.5, dark);
    // Head, ears with pink insides
    triangle(ctx, [[3, -21], [4.5, -29], [9, -23]], fur);
    triangle(ctx, [[10, -23], [14, -29], [15, -20]], fur);
    triangle(ctx, [[4.3, -22.5], [5, -27], [7.5, -23.5]], "#FFB8C6");
    triangle(ctx, [[11, -23], [13.6, -27], [14, -21.5]], "#FFB8C6");
    circle(ctx, 9, -17, 7.5, fur);
    ellipse(ctx, 12, -14.5, 3.5, 2.6, light);
    circle(ctx, 14.6, -15.6, 0.9, "#FF7A93");
    face(ctx, 9, -17);
    // Whiskers
    ctx.strokeStyle = "rgba(45, 52, 54, 0.45)";
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(14, -14.5); ctx.lineTo(19, -15.5);
    ctx.moveTo(14, -13.5); ctx.lineTo(19, -12.5);
    ctx.stroke();
};

const drawPuppy: PetDrawer = (ctx, step, now) => {
    const fur = "#C68B59", dark = "#8D5B3A", light = "#F3D9BF";
    // Wagging tail
    ctx.save();
    ctx.translate(-9, -11);
    ctx.rotate(-0.8 + Math.sin(now * 0.02) * 0.5);
    ellipse(ctx, 0, -4, 2, 4.5, fur);
    ctx.restore();
    legs(ctx, fur, dark, step);
    ellipse(ctx, 0, -9, 10, 6.5, fur);
    ellipse(ctx, -3, -11, 3.5, 3, light);
    circle(ctx, 9, -17, 7.5, fur);
    ellipse(ctx, 13, -14, 4, 3, light);
    ellipse(ctx, 16.5, -15, 1.6, 1.2, "#2D3436");
    ellipse(ctx, 4.5, -15, 2.8, 5.5, dark, 0.25 + step * 0.1);
    face(ctx, 9, -18);
};

const drawHamster: PetDrawer = (ctx, _step, now) => {
    const fur = "#F5C07A", light = "#FFF3E0";
    // A round little loaf; feet peek out
    ellipse(ctx, -5, -1.5, 3, 1.8, "#FFB8C6");
    ellipse(ctx, 5, -1.5, 3, 1.8, "#FFB8C6");
    const squish = 1 + Math.sin(now * 0.01) * 0.03;
    ellipse(ctx, 0, -10, 12 * squish, 10 / squish, fur);
    ellipse(ctx, 2, -7, 8, 6.5, light);
    circle(ctx, -4, -19, 3.2, fur);
    circle(ctx, 5, -19.5, 3.2, fur);
    circle(ctx, -4, -19, 1.7, "#FFB8C6");
    circle(ctx, 5, -19.5, 1.7, "#FFB8C6");
    circle(ctx, 9.8, -11.5, 0.9, "#FF7A93");
    face(ctx, 5, -12);
    // Puffy cheeks
    ellipse(ctx, 8, -8.5, 3, 2.3, "rgba(255, 184, 198, 0.6)");
};

const drawTurtle: PetDrawer = (ctx, step) => {
    const skin = "#A8E6A1", shell = "#58B368", shellLight = "#7BCB7F";
    legs(ctx, skin, "#8CD18A", step * 0.6, 7);
    // Head poking out the front
    circle(ctx, 13, -10, 5.5, skin);
    face(ctx, 13, -10.5);
    // Domed shell with a soft pattern
    ctx.fillStyle = shell;
    ctx.beginPath();
    ctx.ellipse(0, -5, 12, 11, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "#3E9150";
    ctx.fillRect(-12, -5.5, 24, 2.5);
    for (const [px, py, r] of [[0, -11, 3.6], [-6.5, -8, 2.6], [6.5, -8, 2.6]] as const) {
        circle(ctx, px, py, r, shellLight);
    }
    // Tiny tail
    triangle(ctx, [[-12, -5], [-16, -3.5], [-12, -2.5]], skin);
};

const drawBunny: PetDrawer = (ctx, step) => {
    const fur = "#F4EEF6", shade = "#DCD2E0", pink = "#FFB8C6";
    circle(ctx, -10, -10, 3.4, "#FFFFFF");
    legs(ctx, fur, shade, step);
    ellipse(ctx, 0, -9, 10, 7, fur);
    // Long ears, one flopping a little
    ellipse(ctx, 6, -29, 2.6, 7.5, fur, -0.15);
    ellipse(ctx, 11, -28, 2.6, 7.5, shade, 0.35);
    ellipse(ctx, 6, -29, 1.2, 5.2, pink, -0.15);
    circle(ctx, 9, -17, 7.5, fur);
    circle(ctx, 15.5, -15.6, 1, pink);
    face(ctx, 9, -17.5);
};

const drawDuckling: PetDrawer = (ctx, step) => {
    const down = "#FFE066", shade = "#F5C842", beak = "#FF9F43";
    // Little orange feet
    ellipse(ctx, -2 + step, -1, 3, 1.5, beak);
    ellipse(ctx, 4 - step, -1, 3, 1.5, beak);
    ellipse(ctx, -1, -8, 10, 7, down);
    triangle(ctx, [[-10, -10], [-15, -14], [-10, -6]], down);
    ellipse(ctx, -2, -8.5, 5, 3.5, shade, -0.3);
    circle(ctx, 6, -17, 7.5, down);
    // Fluffy tuft on top
    ellipse(ctx, 5, -25, 1.5, 3, down, -0.4);
    ellipse(ctx, 7.5, -25, 1.5, 3, down, 0.3);
    ellipse(ctx, 13.5, -15.5, 4, 2, beak);
    face(ctx, 6, -18, { smile: false });
};

const drawPiglet: PetDrawer = (ctx, step, now) => {
    const skin = "#FFB3C7", dark = "#F28FAA", snout = "#FF8FAB";
    // Curly tail
    ctx.strokeStyle = dark;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(-11, -11, 2.4, 0, Math.PI * 1.7 + Math.sin(now * 0.01) * 0.3);
    ctx.stroke();
    legs(ctx, skin, dark, step);
    ellipse(ctx, 0, -9, 10.5, 7, skin);
    triangle(ctx, [[4, -22], [5, -28], [9, -23.5]], dark);
    triangle(ctx, [[10, -23.5], [14, -28], [14.5, -21]], dark);
    circle(ctx, 9, -17, 7.5, skin);
    ellipse(ctx, 15, -14.5, 3.3, 2.7, snout);
    ellipse(ctx, 14.2, -14.5, 0.6, 0.9, "#C2577A");
    ellipse(ctx, 16, -14.5, 0.6, 0.9, "#C2577A");
    face(ctx, 8, -18, { smile: false });
};

const drawFox: PetDrawer = (ctx, step, now) => {
    const fur = "#F0803C", white = "#FFF6EE";
    // Big bushy tail with a white tip
    ctx.save();
    ctx.translate(-9, -9);
    ctx.rotate(-0.5 + Math.sin(now * 0.006) * 0.15);
    ellipse(ctx, -5, -3, 7, 4, fur, -0.3);
    ellipse(ctx, -10.5, -4.5, 3, 2.6, white);
    ctx.restore();
    legs(ctx, "#5D4037", "#4E342E", step);
    ellipse(ctx, 0, -9, 10, 6.5, fur);
    ellipse(ctx, 4, -7, 5, 3, white);
    triangle(ctx, [[3, -21], [4, -30], [9, -23]], fur);
    triangle(ctx, [[10, -23], [14.5, -30], [15, -20]], fur);
    triangle(ctx, [[3.9, -27.5], [4, -30], [5.8, -27]], "#4E342E");
    triangle(ctx, [[13, -27.5], [14.5, -30], [14.7, -27]], "#4E342E");
    circle(ctx, 9, -17, 7.5, fur);
    // Pointy white muzzle
    triangle(ctx, [[7, -15], [18, -14.5], [9, -10.5]], white);
    circle(ctx, 17.8, -14.6, 1.2, "#2D3436");
    face(ctx, 9, -18, { smile: false });
};

const drawPanda: PetDrawer = (ctx, step) => {
    const white = "#FFFFFF", black = "#3B3B3B";
    legs(ctx, black, "#2A2A2A", step);
    ellipse(ctx, 0, -9, 10.5, 7.5, white);
    // Black band over the shoulders
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(0, -9, 10.5, 7.5, 0, 0, Math.PI * 2);
    ctx.clip();
    // A soft rounded band over the shoulders, running down into the front legs
    ellipse(ctx, 4.5, -9, 4, 9, black, 0.25);
    ctx.restore();
    circle(ctx, 4, -23, 3, black);
    circle(ctx, 13.5, -23, 3, black);
    circle(ctx, 9, -17, 7.8, white);
    // Eye patch, then the usual sparkly eye on top of it
    ellipse(ctx, 11.5, -18, 2.6, 3.2, black, -0.4);
    ellipse(ctx, 11.5, -18, 1.1, 1.5, "#FFFFFF");
    circle(ctx, 11.9, -18.6, 0.5, "#2D3436");
    ellipse(ctx, 15.5, -15, 1.4, 1, black);
    ellipse(ctx, 10, -14.3, 1.9, 1.2, "rgba(255, 118, 117, 0.55)");
};

const drawUnicorn: PetDrawer = (ctx, step) => {
    const coat = "#FFF7FB", shade = "#F0DDEA", mane = ["#FD79A8", "#A29BFE", "#74B9FF"];
    // Rainbow tail
    mane.forEach((c, i) => ellipse(ctx, -11 - i * 1.5, -9 + i * 2.5, 2.4, 4, c, 0.5));
    ctx.lineCap = 'round';
    ctx.lineWidth = 3;
    const pairs: [number, number][] = [[-6, -step], [5, step], [-3, step], [8, -step]];
    for (const [lx, swing] of pairs) {
        ctx.strokeStyle = shade;
        ctx.beginPath();
        ctx.moveTo(lx, -6);
        ctx.lineTo(lx + swing * 1.5, -1.5);
        ctx.stroke();
        circle(ctx, lx + swing * 1.5, -1, 1.6, "#C8A2C8");
    }
    ellipse(ctx, 0, -9.5, 10, 6.5, coat);
    // Neck and head
    ellipse(ctx, 7, -15, 3.5, 6, coat, 0.4);
    ellipse(ctx, 11, -19, 6.5, 5.5, coat, 0.2);
    ellipse(ctx, 15.5, -16.5, 3, 2.6, "#FFE4F0");
    // Golden horn
    triangle(ctx, [[10, -24], [12, -34], [13.5, -24.5]], "#FDCB6E");
    // Rainbow mane down the neck
    mane.forEach((c, i) => circle(ctx, 6 - i * 1.2, -22 + i * 3.5, 2.6, c));
    ellipse(ctx, 9.5, -23, 1.6, 3, "#F4EEF6", -0.5);
    face(ctx, 11, -19.5);
};

/** Every species has a drawing; the type makes adding a species without one a compile error. */
export const PET_DRAWERS: Readonly<Record<Species, PetDrawer>> = {
    kitty: drawKitty,
    puppy: drawPuppy,
    hamster: drawHamster,
    turtle: drawTurtle,
    bunny: drawBunny,
    duckling: drawDuckling,
    piglet: drawPiglet,
    fox: drawFox,
    panda: drawPanda,
    unicorn: drawUnicorn
};

/** Draws `species` standing on (x, groundY). `step` (-1..1) swings the legs while walking. */
export function drawPetSprite(
    ctx: Ctx,
    species: Species,
    x: number,
    groundY: number,
    facingLeft: boolean,
    step: number
): void {
    ctx.save();
    ctx.translate(x, groundY);
    if (facingLeft) ctx.scale(-1, 1);
    ctx.lineJoin = 'round';
    PET_DRAWERS[species](ctx, step, Date.now());
    ctx.restore();
}
