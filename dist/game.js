// Auto-generated from TypeScript sources in src/ via scripts/build.mjs
"use strict";

// --- src/types.ts ---
/** A platform that glides from `x` to `x + range` and back, once every `period` ticks. */

// --- src/levels.ts ---
/** Simulation rate: every physics/timer value below is tuned per 1/60 s tick. */
const TICK_MS         = 1000 / 60;
const GROUND_Y         = 428;
const DOGHOUSE_X         = 707;
/** Flora's left edge must pass this x (with the key) to enter the doghouse. */
const DOGHOUSE_ENTRY_X         = 685;
const LEVEL_CLEAR_FRAMES         = 75;
/** Ticks the victory rainbow takes to sweep across the sky. */
const RAINBOW_SWEEP_FRAMES         = 40;
const DIG_RANGE         = 48;
const GRAVITY         = 0.45;
const JUMP_VY         = -10.2;
/** Releasing jump early caps upward speed here, giving a short hop. */
const JUMP_CUT_VY         = -4;
/** Grace ticks to still jump after walking off a ledge. */
const COYOTE_TICKS         = 6;
/** Grace ticks a jump pressed just before landing is remembered. */
const JUMP_BUFFER_TICKS         = 6;
/** Landing on a mushroom launches Flora upward this fast. */
const BOUNCE_VY         = -16.5;
/** Mushroom cap size; its top is MUSHROOM_HEIGHT above the surface it grows on. */
const MUSHROOM_WIDTH         = 40;
const MUSHROOM_HEIGHT         = 18;
/** Highest bounce off a mushroom top in px. */
const MAX_BOUNCE_HEIGHT         = (BOUNCE_VY * BOUNCE_VY) / (2 * GRAVITY) + MUSHROOM_HEIGHT;
/** Highest jump in px (jump held): v^2 / 2g. */
const MAX_JUMP_HEIGHT         = (JUMP_VY * JUMP_VY) / (2 * GRAVITY);

/** KeyboardEvent.code for each action. Touch buttons press these same codes. */
const CONTROLS = {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    jump: 'ArrowUp',
    water: 'Space',
    dig: 'ArrowDown'
}         ;

const FLOWER_COLORS                    = [
    "#FF7675",
    "#FD79A8",
    "#A29BFE",
    "#FFEAA7",
    "#55E6C1",
    "#74B9FF"
];

/** Big flowers are always sunflowers, so they stand out against every level's sky. */
const BIG_FLOWER_COLOR         = "#F39C12";

const RAINBOW_COLORS                    = [
    "#FF7675",
    "#FAB1A0",
    "#FFEAA7",
    "#55E6C1",
    "#74B9FF",
    "#A29BFE"
];

const LEVEL_MELODIES                                 = [
    ["C4", "E4", "G4", "B4", "A4", "G4", "E4", "D4"],
    ["D4", "F#4", "A4", "C5", "B4", "A4", "F#4", "E4"],
    ["E4", "G#4", "B4", "D#5", "C#5", "B4", "G#4", "F#4"],
    ["F4", "A4", "C5", "E5", "D5", "C5", "A4", "G4"],
    ["G4", "B4", "D5", "F#5", "E5", "D5", "B4", "A4"]
];

const LEVELS                         = [
    {
        name: "Blooming Meadow",
        flowersNeeded: 3,
        pet: "Milo the Kitty",
        species: "kitty",
        bg: "#87CEEB",
        treeX: 400,
        platforms: [
            { x: 210, y: 345, width: 120 },
            { x: 470, y: 345, width: 120 }
        ],
        sprouts: [
            { x: 140, y: 428 },
            { x: 270, y: 345 },
            { x: 530, y: 345 }
        ],
        mounds: [190, 400, 580],
        keyPos: { x: 530, y: 315 }
    },
    {
        name: "Sunny Glade",
        flowersNeeded: 4,
        pet: "Pip the Puppy",
        species: "puppy",
        bg: "#70C8A0",
        treeX: 350,
        tip: "Boing! Jump on the mushroom 🍄",
        platforms: [
            { x: 160, y: 350, width: 110 },
            { x: 320, y: 275, width: 120 },
            { x: 500, y: 345, width: 115 },
            { x: 560, y: 150, width: 100 }
        ],
        mushrooms: [{ x: 640, y: 428 }],
        sprouts: [
            { x: 120, y: 428 },
            { x: 215, y: 350 },
            { x: 380, y: 275 },
            { x: 555, y: 345 }
        ],
        mounds: [230, 350, 560],
        keyPos: { x: 610, y: 120 }
    },
    {
        name: "Rainbow Hills",
        flowersNeeded: 4,
        pet: "Peanut the Hamster",
        species: "hamster",
        bg: "#FDB9C8",
        treeX: 450,
        tip: "Ride the floating cloud ☁️",
        platforms: [
            { x: 160, y: 345, width: 110 },
            { x: 520, y: 215, width: 110 }
        ],
        movingPlatforms: [{ x: 300, y: 300, width: 90, range: 150, period: 240 }],
        sprouts: [
            { x: 120, y: 428 },
            { x: 215, y: 345 },
            { x: 420, y: 428 },
            { x: 575, y: 215 }
        ],
        mounds: [180, 470, 600],
        keyPos: { x: 590, y: 185 }
    },
    {
        name: "Enchanted Garden",
        flowersNeeded: 5,
        pet: "Shelly the Turtle",
        species: "turtle",
        bg: "#A29BFE",
        treeX: 300,
        tip: "The big flower needs 3 splashes 🌻",
        platforms: [
            { x: 140, y: 350, width: 105 },
            { x: 280, y: 275, width: 110 },
            { x: 430, y: 345, width: 110 },
            { x: 560, y: 265, width: 105 }
        ],
        sprouts: [
            { x: 115, y: 428 },
            { x: 192, y: 350 },
            { x: 335, y: 275, waterNeeded: 3 },
            { x: 485, y: 345 },
            { x: 612, y: 265 }
        ],
        mounds: [210, 300, 540],
        keyPos: { x: 612, y: 235 }
    },
    {
        name: "Pet Paradise",
        flowersNeeded: 5,
        pet: "Barnaby the Bunny",
        species: "bunny",
        bg: "#FFEAA7",
        treeX: 500,
        tip: "Bounce, float and splash! 🌈",
        platforms: [
            { x: 150, y: 350, width: 110 },
            { x: 460, y: 205, width: 120 },
            { x: 530, y: 345, width: 110 }
        ],
        movingPlatforms: [{ x: 290, y: 275, width: 100, range: 90, period: 220 }],
        mushrooms: [{ x: 455, y: 428 }],
        sprouts: [
            { x: 130, y: 428 },
            { x: 205, y: 350 },
            { x: 357, y: 428 },
            { x: 520, y: 205, waterNeeded: 2 },
            { x: 585, y: 345 }
        ],
        mounds: [240, 390, 500],
        keyPos: { x: 520, y: 175 }
    }
];

// --- src/layout.ts ---
/** The game's logical playfield size; all drawing and physics use these units. */
const CANVAS_WIDTH         = 800;
const CANVAS_HEIGHT         = 500;
/** The framed game box: canvas plus a 4px border on each side. */
const STAGE_WIDTH         = CANVAS_WIDTH + 8;
const STAGE_HEIGHT         = CANVAS_HEIGHT + 8;

/**
 * Largest scale at which the game box fits the viewport with a gutter on every side.
 * Capped so huge monitors don't get a comically oversized (and blurry-HUD) game.
 */
function fitScale(viewportWidth        , viewportHeight        , gutter         = 16, maxScale         = 1.5)         {
    const scale = Math.min(
        (viewportWidth - gutter * 2) / STAGE_WIDTH,
        (viewportHeight - gutter * 2) / STAGE_HEIGHT,
        maxScale
    );
    return Math.max(0.1, scale);
}

// --- src/save.ts ---
/** Bump the suffix if the saved shape changes, so old saves are ignored instead of misread. */
const SAVE_KEY         = 'floras-adventure-save-v1';

                           
                                                                                      
                  
 

/** localStorage, or null where it's blocked (private mode, disabled site data). */
function getStorage()                 {
    try {
        return window.localStorage ?? null;
    } catch {
        return null;
    }
}

function loadSave(storage                , levelCount        )                  {
    try {
        const raw = storage?.getItem(SAVE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw)                     ;
        const level = data.level;
        if (typeof level !== 'number' || !Number.isInteger(level) || level < 1 || level >= levelCount) return null;
        return { level };
    } catch {
        return null;
    }
}

function writeSave(storage                , data          )       {
    try {
        storage?.setItem(SAVE_KEY, JSON.stringify(data));
    } catch {
        // Storage full or blocked: progress just isn't kept.
    }
}

function clearSave(storage                )       {
    try {
        storage?.removeItem(SAVE_KEY);
    } catch {
        // Nothing to clear.
    }
}

// --- src/audio.ts ---
class AudioController {
           enabled          = false;
            synth                       = null;
            polySynth                       = null;
            noiseSynth                            = null;
            bgLoop                      = null;

            init()       {
        if (typeof Tone === 'undefined') return;
        this.synth = new Tone.Synth({ oscillator: { type: 'sine' } }).toDestination();
        this.polySynth = new Tone.PolySynth(Tone.Synth).toDestination();
        this.polySynth.volume.value = -12;
        this.noiseSynth = new Tone.NoiseSynth({
            noise: { type: 'white' },
            envelope: { attack: 0.005, decay: 0.1, sustain: 0 }
        }).toDestination();
    }

           toggle(currentLevel        , musicBtn             )       {
        this.setEnabled(!this.enabled, currentLevel, musicBtn);
        musicBtn.blur();
    }

    /** Must be called from a click/tap: browsers only allow audio to start after a user gesture. */
           setEnabled(on         , currentLevel        , musicBtn             )       {
        if (typeof Tone === 'undefined' || on === this.enabled) return;
        if (on) {
            void Tone.start();
            if (!this.synth) this.init();
            this.enabled = true;
            musicBtn.innerText = '🎵 Music: ON';
            this.startBgMusic(currentLevel);
        } else {
            this.enabled = false;
            musicBtn.innerText = '🎵 Music: OFF';
            Tone.Transport.stop();
        }
    }

           startBgMusic(currentLevel        )       {
        if (!this.enabled || typeof Tone === 'undefined' || !this.polySynth) return;
        Tone.Transport.stop();
        Tone.Transport.cancel();

        const notes = LEVEL_MELODIES[currentLevel % LEVEL_MELODIES.length];
        const poly = this.polySynth;
        let idx = 0;
        this.bgLoop = new Tone.Loop((time        ) => {
            poly.triggerAttackRelease(notes[idx % notes.length], "8n", time);
            idx++;
        }, "4n");

        this.bgLoop.start(0);
        Tone.Transport.bpm.value = 115 + currentLevel * 5;
        Tone.Transport.start();
    }

           playSound(type           )       {
        if (!this.enabled) return;
        if (type === 'jump') this.synth?.triggerAttackRelease("G4", "8n");
        if (type === 'water') this.noiseSynth?.triggerAttackRelease("16n");
        if (type === 'dig') this.synth?.triggerAttackRelease("A2", "16n");
        if (type === 'bloom') this.polySynth?.triggerAttackRelease(["C5", "E5", "G5"], "8n");
        if (type === 'bark') this.synth?.triggerAttackRelease("E3", "16n");
        if (type === 'key') this.polySynth?.triggerAttackRelease(["G5", "C6", "E6"], "4n");
        if (type === 'bounce') this.synth?.triggerAttackRelease("C5", "16n");
        if (type === 'victory') this.polySynth?.triggerAttackRelease(["C5", "E5", "G5", "C6"], "2n");
    }
}

// --- src/particles.ts ---
class ParticleSystem {
           items             = [];

           clear()       {
        this.items = [];
    }

           spawn(
        x        ,
        y        ,
        color        ,
        count         = 12,
        shape                = 'circle'
    )       {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3.5;
            this.items.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.8,
                color,
                size: shape === 'heart' ? 12 : 3 + Math.random() * 3,
                alpha: 1,
                decay: 0.018 + Math.random() * 0.015,
                shape
            });
        }
    }

           update()       {
        for (const p of this.items) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.12;
            p.alpha -= p.decay;
        }
        this.items = this.items.filter(p => p.alpha > 0);
    }

           draw(ctx                          )       {
        for (const p of this.items) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            if (p.shape === 'heart') {
                ctx.font = `${p.size}px sans-serif`;
                ctx.fillText("💖", p.x - 6, p.y);
            } else if (p.shape === 'star') {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#FFF";
                ctx.fillRect(p.x - 1, p.y - p.size - 2, 2, p.size * 2 + 4);
                ctx.fillRect(p.x - p.size - 2, p.y - 1, p.size * 2 + 4, 2);
            } else {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }
}

// --- src/renderer.ts ---
function drawSun(ctx                          )       {
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
function drawRainbow(ctx                          , progress         = 1)       {
    ctx.lineWidth = 6;
    for (let i = 0; i < RAINBOW_COLORS.length; i++) {
        ctx.strokeStyle = RAINBOW_COLORS[i];
        ctx.beginPath();
        ctx.arc(400, 430, 260 - (i * 6), Math.PI, Math.PI + Math.PI * progress, false);
        ctx.stroke();
    }
}

function drawPlatforms(ctx                          , platforms                     )       {
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
function drawCloudPlatforms(ctx                          , platforms                     )       {
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

function drawMushrooms(ctx                          , mushrooms                  )       {
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

function drawRescuedPet(
    ctx                          ,
    species         ,
    x        ,
    y        
)       {
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

function drawTreeAndGround(
    ctx                          ,
    canvasWidth        ,
    treeX        ,
    digMounds                     ,
    boneFound         ,
    boneX        
)       {
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

function drawSprouts(
    ctx                          ,
    sprouts                   ,
    allBloomed         
)       {
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

function drawDoghouse(ctx                          )       {
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

function drawKey(ctx                          , keyX        , keyY        )       {
    const bobY = keyY + Math.sin(Date.now() * 0.006) * 4;
    ctx.fillStyle = "#F1C40F";
    ctx.beginPath();
    ctx.arc(keyX, bobY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(keyX + 6, bobY - 2, 14, 4);
    ctx.fillRect(keyX + 14, bobY + 2, 3, 4);
    ctx.fillRect(keyX + 18, bobY + 2, 3, 4);
}

function drawCelebrationBanner(ctx                          , petName        )       {
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

// --- src/entities.ts ---
class Player {
           x         = 50;
           y         = 380;
           width         = 32;
           height         = 48;
           vx         = 0;
           vy         = 0;
           grounded          = true;
           facing            = 'right';
           isWatering          = false;
           waterTimer         = 0;
           isDigging          = false;
           digTimer         = 0;
    /** Ticks left in which a jump still works after walking off a ledge. */
           coyoteTimer         = COYOTE_TICKS;
    /** Ticks left in which an early jump press will fire on landing. */
           jumpBufferTimer         = 0;
    /** True while rising from a jump that letting go of ↑ may still cut short. */
           jumpRising          = false;

           reset()       {
        this.x = 50;
        this.y = 380;
        this.vx = 0;
        this.vy = 0;
        this.grounded = true;
        this.coyoteTimer = COYOTE_TICKS;
        this.jumpBufferTimer = 0;
        this.jumpRising = false;
    }

           update(
        keys                                   ,
        pressed                                   ,
        platforms                     ,
        mushrooms                  ,
        canvasWidth        ,
        disabled         ,
        playSound                           ,
        onWater            ,
        onDig            
    )       {
        if (disabled) return;

        if (keys[CONTROLS.right]) {
            this.vx = 3.5;
            this.facing = 'right';
        } else if (keys[CONTROLS.left]) {
            this.vx = -3.5;
            this.facing = 'left';
        } else {
            this.vx = 0;
        }

        // Jumps fire on a press (latched even if released within the same tick), not while held,
        // so the buffer can remember a press made just before landing.
        if (pressed[CONTROLS.jump]) this.jumpBufferTimer = JUMP_BUFFER_TICKS;

        if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
            this.vy = JUMP_VY;
            this.grounded = false;
            this.jumpRising = true;
            this.jumpBufferTimer = 0;
            this.coyoteTimer = 0;
            playSound('jump');
        }

        if (this.jumpRising && !keys[CONTROLS.jump] && this.vy < JUMP_CUT_VY) this.vy = JUMP_CUT_VY;
        if (this.vy >= 0) this.jumpRising = false;

        if (keys[CONTROLS.water] && !this.isWatering) {
            this.isWatering = true;
            this.waterTimer = 18;
            playSound('water');
            onWater();
        }

        if (keys[CONTROLS.dig]) {
            if (!this.isDigging && this.grounded) {
                this.isDigging = true;
                this.digTimer = 15;
                playSound('dig');
                onDig();
            }
        }

        if (this.waterTimer > 0) this.waterTimer--;
        else this.isWatering = false;

        if (this.digTimer > 0) this.digTimer--;
        else this.isDigging = false;

        const prevBottom = this.y + this.height;
        this.vy += GRAVITY;
        this.x += this.vx;
        this.y += this.vy;
        this.grounded = false;

        // Landing on a mushroom cap launches Flora high into the air.
        if (this.vy >= 0) {
            for (const m of mushrooms) {
                const top = m.y - MUSHROOM_HEIGHT;
                if (
                    this.x + this.width > m.x - MUSHROOM_WIDTH / 2 + 4 &&
                    this.x < m.x + MUSHROOM_WIDTH / 2 - 4 &&
                    prevBottom <= top + 6 &&
                    this.y + this.height >= top
                ) {
                    this.y = top - this.height;
                    this.vy = BOUNCE_VY;
                    this.jumpRising = false;
                    playSound('bounce');
                    break;
                }
            }
        }

        // One-way platform collisions
        if (this.vy >= 0) {
            for (const p of platforms) {
                if (
                    this.x + this.width > p.x + 6 &&
                    this.x < p.x + p.width - 6 &&
                    prevBottom <= p.y + 6 &&
                    this.y + this.height >= p.y
                ) {
                    this.y = p.y - this.height;
                    this.vy = 0;
                    this.grounded = true;
                    break;
                }
            }
        }

        // Ground collision (y = 428)
        if (this.y >= 380) {
            this.y = 380;
            this.vy = 0;
            this.grounded = true;
        }

        if (this.x < 0) this.x = 0;
        if (this.x > canvasWidth - this.width) this.x = canvasWidth - this.width;

        this.coyoteTimer = this.grounded ? COYOTE_TICKS : Math.max(0, this.coyoteTimer - 1);
        if (this.jumpBufferTimer > 0) this.jumpBufferTimer--;
    }

           draw(ctx                          )       {
        // Body (Flora - Cute Pink Outfit)
        ctx.fillStyle = "#FF6B8B";
        ctx.fillRect(this.x, this.y + 12, this.width, this.height - 12);

        // Head
        ctx.fillStyle = "#FFD1DC";
        ctx.beginPath();
        ctx.arc(this.x + 16, this.y, 16, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = "#6C5CE7";
        ctx.beginPath();
        ctx.arc(this.x + 16, this.y - 4, 17, Math.PI, Math.PI * 2);
        ctx.fill();

        // Eyes & Rosy Cheeks
        ctx.fillStyle = "#2D3436";
        const eyeX = this.facing === 'right' ? this.x + 22 : this.x + 10;
        ctx.fillRect(eyeX, this.y - 4, 3, 4);

        ctx.fillStyle = "#FF7675";
        ctx.beginPath();
        ctx.arc(this.facing === 'right' ? this.x + 24 : this.x + 8, this.y + 2, 3, 0, Math.PI * 2);
        ctx.fill();

        // Watering Can
        ctx.fillStyle = "#74B9FF";
        const canX = this.facing === 'right' ? this.x + 24 : this.x - 12;
        ctx.fillRect(canX, this.y + 20, 12, 10);
        ctx.fillRect(canX + (this.facing === 'right' ? 12 : -4), this.y + 22, 4, 3);

        if (this.isWatering) {
            ctx.fillStyle = "#0984E3";
            for (let i = 0; i < 6; i++) {
                const dropX = canX + (this.facing === 'right' ? 16 + i * 2 : -6 - i * 2);
                const dropY = this.y + 24 + i * 3 + Math.sin(Date.now() * 0.02 + i) * 2;
                ctx.fillRect(dropX, dropY, 3, 3);
            }
        }

        if (this.isDigging) {
            ctx.fillStyle = "#B2BEC3";
            ctx.fillRect(this.x + (this.facing === 'right' ? 28 : -8), this.y + 32, 8, 12);
        }
    }
}

class Noodle {
           x         = 20;
           y         = 406;
           barkTimer         = 0;
           speechBubble         = "";
           sniffing          = false;

           update(
        playerX        ,
        digMounds                     ,
        boneFound         ,
        gamePaused         ,
        playSound                           
    )       {
        if (gamePaused) return;

        const boneMound = digMounds.find(m => m.hasBone);
        if (!boneFound && boneMound && Math.abs((playerX + 16) - boneMound.x) < 95) {
            this.sniffing = true;
            const targetX = boneMound.x - 12;
            this.x += (targetX - this.x) * 0.1;
            if (this.barkTimer <= 0) {
                this.barkTimer = 45;
                this.speechBubble = "🦴 Dig here!";
                playSound('bark');
            }
        } else {
            this.sniffing = false;
            const targetX = playerX - 35;
            this.x += (targetX - this.x) * 0.06;

            if (Math.random() < 0.006 && this.barkTimer <= 0) {
                this.barkTimer = 70;
                const barks = ["Woof!", "Arf!", "Yip!", "Ruff!"];
                this.speechBubble = barks[Math.floor(Math.random() * barks.length)];
                playSound('bark');
            }
        }

        if (this.barkTimer > 0) this.barkTimer--;
    }

           draw(ctx                          )       {
        const bounceY = this.sniffing ? Math.abs(Math.sin(Date.now() * 0.02)) * -4 : 0;
        const drawY = this.y + bounceY;

        // Golden Doodle body & legs (grounded at y = 428)
        ctx.fillStyle = "#C49102";
        ctx.fillRect(this.x + 2, this.y + 18, 4, 4);
        ctx.fillRect(this.x + 18, this.y + 18, 4, 4);

        ctx.fillStyle = "#E1B12C";
        ctx.fillRect(this.x, drawY, 24, 18);
        ctx.fillRect(this.x + 14, drawY - 10, 14, 14); // Fluffy Head

        // Snout & Ears
        ctx.fillStyle = "#C49102";
        ctx.fillRect(this.x + 12, drawY - 6, 4, 8); // Ear

        // Eyes
        ctx.fillStyle = "#000";
        ctx.fillRect(this.x + 22, drawY - 6, 2, 3);

        // Fluffy Wagging tail (wags faster when sniffing a bone!)
        const wagSpeed = this.sniffing ? 0.05 : 0.02;
        ctx.strokeStyle = "#E1B12C";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(this.x, drawY + 6);
        ctx.lineTo(this.x - 10, drawY + (Math.sin(Date.now() * wagSpeed) * 8));
        ctx.stroke();

        // Bark speech bubble
        if (this.barkTimer > 0) {
            ctx.font = "bold 11px sans-serif";
            const textWidth = Math.max(44, ctx.measureText(this.speechBubble).width + 14);
            ctx.fillStyle = this.sniffing ? "#FFF9DB" : "#FFF";
            ctx.beginPath();
            ctx.roundRect(this.x - 12, drawY - 36, textWidth, 22, 8);
            ctx.fill();
            ctx.fillStyle = "#2D3436";
            ctx.fillText(this.speechBubble, this.x - 5, drawY - 21);
        }
    }
}

// --- src/game.ts ---
const stage = document.getElementById('game-stage')               ;
const container = document.getElementById('game-container')               ;
const canvas = document.getElementById('gameCanvas')                     ;
const ctx = canvas.getContext('2d')                            ;
const musicBtn = document.getElementById('music-btn')                     ;
const restartBtn = document.getElementById('restart-btn')                     ;
const victoryDialog = document.getElementById('victory-dialog')                     ;
const levelDisplay = document.getElementById('level-display')               ;
const statusDisplay = document.getElementById('status-display')               ;
const objectiveDisplay = document.getElementById('objective-display')               ;
const startScreen = document.getElementById('start-screen')               ;
const playBtn = document.getElementById('play-btn')                     ;
const continueBtn = document.getElementById('continue-btn')                     ;

const audio = new AudioController();
const particleSystem = new ParticleSystem();
const storage = getStorage();

                                              
let screen         = 'start';
let currentLevel         = 0;
let levelClearTimer         = 0;
/** Ticks since the level started; drives moving platforms. */
let levelTicks         = 0;

let flora         = new Player();
let noodle         = new Noodle();
let sprouts           = [];
let digMounds             = [];
let rescuedFriends                  = [];
let boneFound          = false;
let boneX         = 400;
let keyCollected          = false;
let keyX         = 530;
let keyY         = 315;
/** Where each of the level's moving platforms is this tick. */
let movingPlatforms             = [];

const keys                          = {};
/** Keys that went down since the last tick, so a tap shorter than one tick still counts. */
const pressed                          = {};

function pressKey(code        )       {
    if (!keys[code]) pressed[code] = true;
    keys[code] = true;
}

function clearKeys()       {
    for (const code of Object.keys(keys)) keys[code] = false;
}

const GAME_KEYS                    = Object.values(CONTROLS);

window.addEventListener('keydown', (e               ) => {
    if (GAME_KEYS.includes(e.code) && screen === 'playing') {
        e.preventDefault();
    }
    pressKey(e.code);
});
window.addEventListener('keyup', (e               ) => {
    keys[e.code] = false;
});
// Releasing a key while the window is unfocused never fires keyup, which left Flora running forever.
window.addEventListener('blur', clearKeys);

// On-screen buttons hold down the same key codes the keyboard does while a finger is on them.
for (const btn of document.querySelectorAll             ('[data-key]')) {
    const code = btn.dataset.key          ;
    const release = ()       => {
        keys[code] = false;
        btn.classList.remove('pressed');
    };
    btn.addEventListener('pointerdown', (e              ) => {
        e.preventDefault();
        pressKey(code);
        btn.classList.add('pressed');
        try {
            // Keeps the button held if the finger slides off it slightly.
            btn.setPointerCapture(e.pointerId);
        } catch {
            // Unknown pointer id (e.g. synthetic events); the press still counts.
        }
    });
    btn.addEventListener('pointerup', release);
    btn.addEventListener('pointercancel', release);
    btn.addEventListener('lostpointercapture', release);
    btn.addEventListener('contextmenu', (e       ) => e.preventDefault());
}

musicBtn.addEventListener('click', () => {
    audio.toggle(currentLevel, musicBtn);
});

restartBtn.addEventListener('click', () => {
    // Blur so a later Space press waters instead of clicking Restart again.
    restartBtn.blur();
    if (screen === 'playing' && levelClearTimer === 0) restartLevel();
});

/** Starts play at `level`, with every earlier pet already in the parade. */
function startGame(level        )       {
    currentLevel = level;
    rescuedFriends = LEVELS.slice(0, level).map((l, i) => ({ species: l.species, x: 20 - (i + 1) * 28, y: 416 }));
    if (level === 0) clearSave(storage);
    noodle.x = 20;
    restartLevel();
    // Keys used on the start screen (Enter/Space on a button) must not leak into play.
    clearKeys();
    for (const code of Object.keys(pressed)) pressed[code] = false;
    screen = 'playing';
    startScreen.hidden = true;
    document.body.classList.remove('on-start');
}

function showStartScreen()       {
    screen = 'start';
    const save = loadSave(storage, LEVELS.length);
    continueBtn.hidden = !save;
    if (save) continueBtn.innerText = `▶ Continue — Level ${save.level + 1}`;
    playBtn.innerText = save ? '🌱 New game' : '▶ Play';
    startScreen.hidden = false;
    document.body.classList.add('on-start');
    (save ? continueBtn : playBtn).focus();
}

// The Play tap is the user gesture browsers require before audio can start, so music comes on here.
playBtn.addEventListener('click', () => {
    audio.setEnabled(true, 0, musicBtn);
    startGame(0);
});
continueBtn.addEventListener('click', () => {
    const save = loadSave(storage, LEVELS.length);
    audio.setEnabled(true, save?.level ?? 0, musicBtn);
    startGame(save?.level ?? 0);
});

victoryDialog.addEventListener('close', () => {
    startGame(0);
});

function allBloomed()          {
    return sprouts.every(s => s.bloomed);
}

function objectiveText()         {
    if (levelClearTimer > 0) return `🎉 You rescued ${LEVELS[currentLevel].pet}!`;
    if (keyCollected) return '🏠 Bring the key to the doghouse!';
    if (!allBloomed()) {
        return sprouts.some(s => !s.bloomed && s.waterNeeded > 1)
            ? '💦 Water every sprout — big ones need extra splashes!'
            : '💦 Water every sprout';
    }
    if (!boneFound) return "🦴 Follow Noodle's nose and dig for the bone";
    return '🔑 Grab the shiny key!';
}

/** How much of the victory rainbow to draw: 0 while playing, sweeping to 1 once a level is beaten. */
function rainbowProgress()         {
    if (screen === 'victory') return 1; // keep the full rainbow behind the victory dialog
    if (levelClearTimer <= 0) return 0;
    return Math.min(1, (LEVEL_CLEAR_FRAMES - levelClearTimer + 1) / RAINBOW_SWEEP_FRAMES);
}

function updateStatus()       {
    const bloomedCount = sprouts.filter(s => s.bloomed).length;
    statusDisplay.innerText = `Flowers: ${bloomedCount}/${LEVELS[currentLevel].flowersNeeded} | Bone: ${boneFound ? '🦴' : '❌'} | Key: ${keyCollected ? '🔑' : '❌'}`;
    objectiveDisplay.innerText = objectiveText();
}

function initLevel()       {
    const level = LEVELS[currentLevel];
    sprouts = [];
    digMounds = [];
    particleSystem.clear();
    boneFound = false;
    keyCollected = false;
    levelClearTimer = 0;
    levelTicks = 0;
    movingPlatforms = movingPlatformsAt(0);
    keyX = level.keyPos.x;
    keyY = level.keyPos.y;

    level.sprouts.forEach((pos, i) => {
        sprouts.push({
            x: pos.x,
            y: pos.y,
            water: 0,
            waterNeeded: pos.waterNeeded ?? 1,
            bloomed: false,
            color: (pos.waterNeeded ?? 1) > 1 ? BIG_FLOWER_COLOR : FLOWER_COLORS[i % FLOWER_COLORS.length],
            danceOffset: Math.random() * Math.PI * 2
        });
    });

    const boneIdx = Math.floor(Math.random() * level.mounds.length);
    level.mounds.forEach((mx, idx) => {
        digMounds.push({
            x: mx,
            y: GROUND_Y,
            hasBone: idx === boneIdx,
            dug: false
        });
    });
    boneX = level.mounds[boneIdx];

    if (level.tip) {
        noodle.speechBubble = level.tip;
        noodle.barkTimer = 240;
    }

    levelDisplay.innerText = `Level ${currentLevel + 1}: ${level.name}`;
    updateStatus();
    if (audio.enabled) audio.startBgMusic(currentLevel);
}

function restartLevel()       {
    initLevel();
    flora.reset();
}

function checkWatering()       {
    const canCenterX = flora.facing === 'right' ? flora.x + 30 : flora.x + 2;
    const floraFeetY = flora.y + flora.height;
    for (const s of sprouts) {
        if (s.bloomed || Math.abs(canCenterX - s.x) >= 48 || Math.abs(floraFeetY - s.y) >= 48) continue;
        s.water++;
        if (s.water >= s.waterNeeded) {
            s.bloomed = true;
            audio.playSound('bloom');
            const big = s.waterNeeded > 1;
            particleSystem.spawn(s.x, s.y - (big ? 36 : 24), s.color, big ? 24 : 14, 'circle');
            particleSystem.spawn(s.x, s.y - (big ? 40 : 28), '#FFEAA7', big ? 12 : 6, 'star');
        } else {
            particleSystem.spawn(s.x, s.y - 20, '#74B9FF', 8, 'circle');
        }
    }
    updateStatus();
}

function checkDigging()       {
    if (flora.y + flora.height < GROUND_Y - 5) return;
    const playerCenterX = flora.x + flora.width / 2;
    // Pick the closest undug mound so an already-dug neighbour can't block a nearby one.
    let mound                      ;
    for (const m of digMounds) {
        if (m.dug || Math.abs(playerCenterX - m.x) >= DIG_RANGE) continue;
        if (!mound || Math.abs(playerCenterX - m.x) < Math.abs(playerCenterX - mound.x)) mound = m;
    }

    particleSystem.spawn(mound ? mound.x : playerCenterX, GROUND_Y - 4, '#8D6E63', 8, 'circle');
    if (!mound) return;

    mound.dug = true;
    if (mound.hasBone) {
        boneFound = true;
        boneX = mound.x;
        audio.playSound('key');
        particleSystem.spawn(mound.x, GROUND_Y - 10, '#F1C40F', 16, 'star');
        noodle.barkTimer = 75;
        noodle.speechBubble = allBloomed() ? "Woof! Found it! 🦴" : "Bone! Now water the flowers! 🌸";
        updateStatus();
    } else {
        noodle.barkTimer = 60;
        noodle.speechBubble = "Keep sniffing! 🐾";
    }
}

function updateKey()       {
    if (keyCollected || !allBloomed() || !boneFound) return;
    const floraCenterX = flora.x + flora.width / 2;
    const floraCenterY = flora.y + flora.height / 2;
    if (Math.abs(floraCenterX - keyX) < 34 && Math.abs(floraCenterY - keyY) < 42) {
        keyCollected = true;
        audio.playSound('key');
        particleSystem.spawn(keyX, keyY, '#F1C40F', 18, 'star');
        updateStatus();
    }
}

function updateDoghouse()       {
    if (flora.x <= DOGHOUSE_ENTRY_X || levelClearTimer > 0) return;
    if (keyCollected) {
        levelClearTimer = LEVEL_CLEAR_FRAMES;
        audio.playSound('victory');
        particleSystem.spawn(DOGHOUSE_X, 395, '#FF7675', 14, 'heart');
        particleSystem.spawn(DOGHOUSE_X, 385, '#F1C40F', 20, 'star');
        updateStatus();
    } else if (noodle.barkTimer <= 0) {
        noodle.barkTimer = 70;
        noodle.speechBubble = "It's locked! Need the key 🔑";
    }
}

function updateLevelClear()       {
    if (levelClearTimer <= 0) return;
    if (levelClearTimer % 15 === 0) {
        particleSystem.spawn(DOGHOUSE_X + (Math.random() - 0.5) * 40, 390, '#FFEAA7', 8, 'star');
    }

    levelClearTimer--;
    if (levelClearTimer > 0) return;

    rescuedFriends.push({
        species: LEVELS[currentLevel].species,
        x: noodle.x - (rescuedFriends.length + 1) * 28,
        y: 416
    });

    if (currentLevel === LEVELS.length - 1) {
        screen = 'victory';
        clearSave(storage);
        updateStatus();
        victoryDialog.showModal();
    } else {
        currentLevel++;
        writeSave(storage, { level: currentLevel });
        restartLevel();
    }
}

/** Positions of the level's moving platforms at tick `t`: an eased glide out and back. */
function movingPlatformsAt(t        )             {
    return (LEVELS[currentLevel].movingPlatforms ?? []).map(p => ({
        x: p.x + (p.range * (1 - Math.cos((2 * Math.PI * t) / p.period))) / 2,
        y: p.y,
        width: p.width
    }));
}

function updateMovingPlatforms()       {
    levelTicks++;
    const next = movingPlatformsAt(levelTicks);
    // Carry Flora along with a platform she is standing on.
    movingPlatforms.forEach((p, i) => {
        const standing =
            flora.grounded &&
            Math.abs(flora.y + flora.height - p.y) < 0.5 &&
            flora.x + flora.width > p.x + 6 &&
            flora.x < p.x + p.width - 6;
        if (standing) flora.x += next[i].x - p.x;
    });
    movingPlatforms = next;
}

function updateParade()       {
    rescuedFriends.forEach((pet, idx) => {
        const leaderX = idx === 0 ? noodle.x : rescuedFriends[idx - 1].x;
        pet.x += (leaderX - 28 - pet.x) * 0.08;
    });
}

/** Advances the simulation by exactly one fixed tick (1/60 s). */
function update()       {
    tick();
    for (const code of Object.keys(pressed)) pressed[code] = false;
}

function tick()       {
    if (screen !== 'playing') return;

    updateKey();
    updateParade();
    updateMovingPlatforms();

    const level = LEVELS[currentLevel];
    flora.update(
        keys,
        pressed,
        [...level.platforms, ...movingPlatforms],
        level.mushrooms ?? [],
        CANVAS_WIDTH,
        levelClearTimer > 0,
        type => audio.playSound(type),
        checkWatering,
        checkDigging
    );
    noodle.update(flora.x, digMounds, boneFound, false, type => audio.playSound(type));
    particleSystem.update();

    updateDoghouse();
    updateLevelClear();
}

function render()       {
    const level = LEVELS[currentLevel];
    ctx.setTransform(pixelScale, 0, 0, pixelScale, 0, 0);
    ctx.fillStyle = level.bg;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const rainbow = rainbowProgress();
    if (rainbow > 0) drawRainbow(ctx, rainbow);
    drawSun(ctx);
    drawTreeAndGround(ctx, CANVAS_WIDTH, level.treeX, digMounds, boneFound, boneX);
    drawPlatforms(ctx, level.platforms);
    drawCloudPlatforms(ctx, movingPlatforms);
    drawMushrooms(ctx, level.mushrooms ?? []);
    drawSprouts(ctx, sprouts, allBloomed());
    drawDoghouse(ctx);

    if (keyCollected) {
        drawRescuedPet(ctx, level.species, DOGHOUSE_X, 416);
    } else if (allBloomed() && boneFound) {
        drawKey(ctx, keyX, keyY);
    }

    for (const pet of rescuedFriends) drawRescuedPet(ctx, pet.species, pet.x, 416);
    flora.draw(ctx);
    noodle.draw(ctx);
    particleSystem.draw(ctx);

    if (levelClearTimer > 0) drawCelebrationBanner(ctx, level.pet);
}

// Scale the whole game box to fit the window, and size the canvas backing store to match
// the real pixel count so it stays crisp on phones and retina screens.
let pixelScale         = 1;

function fitToScreen()       {
    // clientWidth/Height ignore mobile zoom-out; innerWidth grows when content overflows the screen.
    const root = document.documentElement;
    const scale = fitScale(root.clientWidth || window.innerWidth, root.clientHeight || window.innerHeight);
    stage.style.width = `${Math.floor(STAGE_WIDTH * scale)}px`;
    stage.style.height = `${Math.floor(STAGE_HEIGHT * scale)}px`;
    container.style.transform = `scale(${scale})`;

    pixelScale = scale * (window.devicePixelRatio || 1);
    canvas.width = Math.round(CANVAS_WIDTH * pixelScale);
    canvas.height = Math.round(CANVAS_HEIGHT * pixelScale);
}

window.addEventListener('resize', fitToScreen);

// Run the simulation at a fixed 60 ticks/s regardless of monitor refresh rate,
// so 120 Hz displays don't play at double speed.
let lastFrameTime                = null;
let tickAccumulator         = 0;

function frame(now        )       {
    if (lastFrameTime !== null) {
        // Cap catch-up after a backgrounded tab so the game doesn't fast-forward.
        tickAccumulator += Math.min(now - lastFrameTime, 250);
    } else {
        tickAccumulator = TICK_MS;
    }
    lastFrameTime = now;

    while (tickAccumulator >= TICK_MS) {
        update();
        tickAccumulator -= TICK_MS;
    }
    render();
    requestAnimationFrame(frame);
}

fitToScreen();
initLevel();
showStartScreen();
requestAnimationFrame(frame);
