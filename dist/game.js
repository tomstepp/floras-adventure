// Auto-generated from TypeScript sources in src/ via scripts/build.mjs
"use strict";

// --- src/types.ts ---
/** A platform that glides from `x` to `x + range` and back, once every `period` ticks. */
                                                  
                  
                   
 

/** A bumblebee that flies from `x` to `x + range` and back around height `y`, once every `period` ticks. */
                                          
                  
                   
 

/** A bramble bush on the ground: solid from the side, standable on top. `x` is its left edge. */

// --- src/levels.ts ---
/** A level is at least one screen wide. */
const DEFAULT_LEVEL_WIDTH         = 800;
const levelWidth = (level             )         => level.width ?? DEFAULT_LEVEL_WIDTH;
/** The doghouse always stands at the far right of the level. */
const doghouseX = (level             )         => levelWidth(level) - 93;
/** Flora's left edge must pass this x (on the ground, with the key) to enter the doghouse. */
const doghouseEntryX = (level             )         => levelWidth(level) - 115;

/** Simulation rate: every physics/timer value below is tuned per 1/60 s tick. */
const TICK_MS         = 1000 / 60;
const GROUND_Y         = 428;
const LEVEL_CLEAR_FRAMES         = 75;
/** Ticks the victory rainbow takes to sweep across the sky. */
const RAINBOW_SWEEP_FRAMES         = 40;
const DIG_RANGE         = 48;
/** Noodle's speech bubble sits on the grass, just under everyone's feet. */
const SPEECH_TOP_Y         = GROUND_Y + 8;
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

/** Bee hitbox radius. Touching a bee bumps Flora back; she can't be bumped again for a moment. */
const BEE_RADIUS         = 10;
const BUMP_STUN_TICKS         = 24;
const BUMP_SAFE_TICKS         = 90;

/** Holding water keeps splashing for this long, then Flora has to let go and press again. */
const WATER_HOLD_TICKS         = 120;

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
    ["G4", "B4", "D5", "F#5", "E5", "D5", "B4", "A4"],
    ["A4", "C5", "E5", "G5", "F5", "E5", "C5", "B4"],
    ["C4", "G4", "E4", "A4", "G4", "E4", "D4", "G4"],
    ["D4", "A4", "F#4", "B4", "A4", "F#4", "E4", "A4"],
    ["E4", "B4", "G4", "C5", "B4", "G4", "F#4", "B4"],
    ["C5", "E5", "G5", "C6", "B5", "G5", "E5", "D5"]
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
    },

    // ---- Big scrolling levels: wider than the screen, with bees and bramble bushes ----
    {
        name: "Buzzing Meadow",
        flowersNeeded: 5,
        pet: "Daisy the Duckling",
        species: "duckling",
        bg: "#B8E994",
        width: 1600,
        treeX: 850,
        trees: [160, 1400],
        tip: "Watch out for bees! Jump over them 🐝",
        platforms: [
            { x: 250, y: 345, width: 110 },
            { x: 420, y: 270, width: 120 },
            { x: 700, y: 340, width: 110 },
            { x: 950, y: 265, width: 120 },
            { x: 1250, y: 340, width: 120 }
        ],
        bees: [
            { x: 560, y: 400, range: 160, period: 300 },
            { x: 1080, y: 400, range: 180, period: 260 }
        ],
        sprouts: [
            { x: 150, y: 428 },
            { x: 305, y: 345 },
            { x: 480, y: 270 },
            { x: 1010, y: 265 },
            { x: 1310, y: 340 }
        ],
        mounds: [620, 900, 1180],
        keyPos: { x: 1010, y: 235 }
    },
    {
        name: "Bramble Path",
        flowersNeeded: 5,
        pet: "Penny the Piglet",
        species: "piglet",
        bg: "#FFD3B6",
        width: 1800,
        treeX: 900,
        trees: [520, 1300],
        tip: "Hop over the bramble bushes 🌿",
        platforms: [
            { x: 230, y: 345, width: 110 },
            { x: 560, y: 340, width: 110 },
            { x: 700, y: 265, width: 110 },
            { x: 950, y: 340, width: 120 },
            { x: 1250, y: 330, width: 110 },
            { x: 1400, y: 255, width: 120 }
        ],
        bushes: [
            { x: 400, width: 44, height: 30 },
            { x: 760, width: 60, height: 34 },
            { x: 1150, width: 44, height: 30 },
            { x: 1450, width: 70, height: 36 }
        ],
        bees: [{ x: 940, y: 300, range: 160, period: 280 }],
        sprouts: [
            { x: 150, y: 428 },
            { x: 615, y: 340 },
            { x: 755, y: 265 },
            { x: 1010, y: 340 },
            { x: 1460, y: 255 }
        ],
        mounds: [320, 620, 1050, 1330],
        keyPos: { x: 1460, y: 225 }
    },
    {
        name: "Cloud Canyon",
        flowersNeeded: 6,
        pet: "Felix the Fox",
        species: "fox",
        bg: "#C7ECEE",
        width: 2000,
        treeX: 1000,
        trees: [560, 1700],
        tip: "Bounce and float across the sky ☁️",
        platforms: [
            { x: 240, y: 180, width: 110 },
            { x: 760, y: 330, width: 100 },
            { x: 1100, y: 190, width: 110 },
            { x: 1550, y: 330, width: 110 },
            { x: 1680, y: 250, width: 110 }
        ],
        movingPlatforms: [
            { x: 420, y: 250, width: 90, range: 200, period: 300 },
            { x: 900, y: 280, width: 90, range: 180, period: 260 },
            { x: 1350, y: 230, width: 90, range: 200, period: 280 }
        ],
        mushrooms: [{ x: 300, y: 428 }, { x: 1250, y: 428 }],
        bees: [{ x: 560, y: 400, range: 150, period: 240 }],
        sprouts: [
            { x: 150, y: 428 },
            { x: 295, y: 180 },
            { x: 810, y: 330 },
            { x: 1150, y: 190 },
            { x: 1600, y: 330 },
            { x: 1735, y: 250 }
        ],
        mounds: [500, 1000, 1450],
        keyPos: { x: 1155, y: 160 }
    },
    {
        name: "Bumblebee Woods",
        flowersNeeded: 6,
        pet: "Poppy the Panda",
        species: "panda",
        bg: "#A8D8B9",
        width: 2200,
        treeX: 1000,
        trees: [180, 1350, 1850],
        tip: "Busy bees everywhere! Time your jumps 🐝",
        platforms: [
            { x: 250, y: 345, width: 110 },
            { x: 420, y: 270, width: 110 },
            { x: 700, y: 340, width: 120 },
            { x: 880, y: 260, width: 110 },
            { x: 1100, y: 340, width: 110 },
            { x: 1450, y: 340, width: 110 },
            { x: 1600, y: 265, width: 120 },
            { x: 1900, y: 340, width: 110 }
        ],
        bushes: [
            { x: 500, width: 50, height: 32 },
            { x: 1290, width: 60, height: 34 },
            { x: 1750, width: 50, height: 32 }
        ],
        bees: [
            { x: 330, y: 400, range: 140, period: 260 },
            { x: 900, y: 320, range: 200, period: 300 },
            { x: 1480, y: 400, range: 200, period: 220 },
            { x: 1860, y: 300, range: 150, period: 240 }
        ],
        sprouts: [
            { x: 150, y: 428 },
            { x: 475, y: 270, waterNeeded: 2 },
            { x: 760, y: 340 },
            { x: 935, y: 260 },
            { x: 1155, y: 340 },
            { x: 1660, y: 265, waterNeeded: 3 }
        ],
        mounds: [620, 1000, 1400, 1650],
        keyPos: { x: 1660, y: 235 }
    },
    {
        name: "Grand Garden",
        flowersNeeded: 7,
        pet: "Luna the Unicorn",
        species: "unicorn",
        bg: "#E0C3FC",
        width: 2400,
        treeX: 1100,
        trees: [520, 1600, 2150],
        tip: "The grand finale! You can do it 🦄",
        platforms: [
            { x: 220, y: 345, width: 110 },
            { x: 780, y: 170, width: 110 },
            { x: 1000, y: 340, width: 110 },
            { x: 1250, y: 345, width: 110 },
            { x: 1750, y: 180, width: 110 },
            { x: 2050, y: 340, width: 110 }
        ],
        movingPlatforms: [{ x: 1400, y: 260, width: 90, range: 220, period: 300 }],
        mushrooms: [{ x: 820, y: 428 }],
        bushes: [
            { x: 420, width: 50, height: 32 },
            { x: 1150, width: 60, height: 34 },
            { x: 1900, width: 50, height: 32 }
        ],
        bees: [
            { x: 580, y: 400, range: 180, period: 260 },
            { x: 1300, y: 310, range: 200, period: 280 },
            { x: 2000, y: 400, range: 140, period: 220 }
        ],
        sprouts: [
            { x: 140, y: 428 },
            { x: 275, y: 345 },
            { x: 835, y: 170, waterNeeded: 2 },
            { x: 1055, y: 340 },
            { x: 1305, y: 345 },
            { x: 1805, y: 180, waterNeeded: 3 },
            { x: 2105, y: 340 }
        ],
        mounds: [560, 1050, 1600, 1840],
        keyPos: { x: 1805, y: 150 }
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
/** How many rescued pets can walk in the parade at once. */
const MAX_FOLLOWERS         = 3;

                           
                                                                                  
                         
                                                                                                
                     
                                                                  
                      
                                                                                           
                         
 

const EMPTY_SAVE           = { level: null, unlocked: 0, roster: [], followers: [] };

/** localStorage, or null where it's blocked (private mode, disabled site data). */
function getStorage()                 {
    try {
        return window.localStorage ?? null;
    } catch {
        return null;
    }
}

const isIndex = (n         , levelCount        )              =>
    typeof n === 'number' && Number.isInteger(n) && n >= 0 && n < levelCount;

/** Keeps only known, distinct species, in their saved order. */
function cleanSpecies(list         , known                    )            {
    if (!Array.isArray(list)) return [];
    const seen = new Set         ();
    for (const s of list) if (known.includes(s           )) seen.add(s           );
    return [...seen];
}

/**
 * Reads the save, repairing what it can; anything unreadable means a fresh start.
 * `levelSpecies` is each level's pet, in level order.
 */
function loadSave(storage                , levelSpecies                    )           {
    const levelCount = levelSpecies.length;
    try {
        const raw = storage?.getItem(SAVE_KEY);
        if (!raw) return { ...EMPTY_SAVE, roster: [], followers: [] };
        const data = JSON.parse(raw)                                                                                  ;
        // Continue only makes sense past level 1 (level 1 is just "New game").
        const level = isIndex(data.level, levelCount) && data.level >= 1 ? data.level : null;
        // Older saves only had `level`; treat it as the furthest level reached.
        const unlocked = Math.max(isIndex(data.unlocked, levelCount) ? data.unlocked : 0, level ?? 0);
        // Saves from before the roster: every level before the furthest one was beaten.
        const roster = Array.isArray(data.roster)
            ? cleanSpecies(data.roster, levelSpecies)
            : levelSpecies.slice(0, unlocked);
        const followers = (Array.isArray(data.followers)
            ? cleanSpecies(data.followers, levelSpecies)
            : roster.slice(-MAX_FOLLOWERS)
        ).filter(s => roster.includes(s)).slice(0, MAX_FOLLOWERS);
        return { level, unlocked, roster, followers };
    } catch {
        return { ...EMPTY_SAVE, roster: [], followers: [] };
    }
}

function writeSave(storage                , data          )       {
    try {
        storage?.setItem(SAVE_KEY, JSON.stringify(data));
    } catch {
        // Storage full or blocked: progress just isn't kept.
    }
}

/**
 * Adds a newly rescued pet: it joins the roster and starts following. If the parade is full,
 * the pet that has followed longest goes home to rest (returned, so it can wave goodbye).
 * Rescuing a pet that's already in the roster changes nothing.
 */
function addRescue(data          , species         )                                             {
    if (data.roster.includes(species)) return { bumped: null, isNew: false };
    data.roster.push(species);
    data.followers.push(species);
    const bumped = data.followers.length > MAX_FOLLOWERS ? (data.followers.shift()           ) : null;
    return { bumped, isNew: true };
}

/** Lets a rostered pet follow or rest. Returns false if the parade is already full. */
function toggleFollower(data          , species         )          {
    if (!data.roster.includes(species)) return false;
    const i = data.followers.indexOf(species);
    if (i >= 0) {
        data.followers.splice(i, 1);
        return true;
    }
    if (data.followers.length >= MAX_FOLLOWERS) return false;
    data.followers.push(species);
    return true;
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

    /** Last start time used on each instrument (by instrument). */
            lastStart = new Map                ();

    /**
     * A start time strictly after the previous note on `instrument`. Tone.js throws if a synth
     * is started twice at the same moment, which happens when two sounds land in the same tick
     * (a bee bump and a jump) or while the audio clock is suspended.
     */
            nextTime(instrument        )         {
        const now = typeof Tone === 'undefined' ? 0 : Tone.now();
        const time = Math.max(now, (this.lastStart.get(instrument) ?? -1) + 0.01);
        this.lastStart.set(instrument, time);
        return time;
    }

           playSound(type           )       {
        if (!this.enabled) return;
        const notes                                                                                         = {
            jump: [this.synth, "G4", "8n"],
            dig: [this.synth, "A2", "16n"],
            bloom: [this.polySynth, ["C5", "E5", "G5"], "8n"],
            bark: [this.synth, "E3", "16n"],
            key: [this.polySynth, ["G5", "C6", "E6"], "4n"],
            bump: [this.synth, "D3", "16n"],
            bounce: [this.synth, "C5", "16n"],
            victory: [this.polySynth, ["C5", "E5", "G5", "C6"], "2n"]
        };
        // Sound is decoration: a failure here must never stop the game.
        try {
            if (type === 'water') {
                if (this.noiseSynth) this.noiseSynth.triggerAttackRelease("16n", this.nextTime(this.noiseSynth));
                return;
            }
            const entry = notes[type];
            if (!entry || !entry[0]) return;
            const [instrument, note, duration] = entry;
            instrument.triggerAttackRelease(note, duration, this.nextTime(instrument));
        } catch (err) {
            console.warn(`Sound "${type}" failed`, err);
        }
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

// --- src/butterflies.ts ---
/** Purely decorative: butterflies never touch gameplay. */
                            
              
                                              
                  
              
                                                            
               
                  
                                                                
                  
                 
 

const BUTTERFLY_COUNT         = 4;
/** Butterflies stay in the open sky: below the HUD, above the ground and characters. */
const BUTTERFLY_MIN_Y         = 110;
const BUTTERFLY_MAX_Y         = 330;
const BUTTERFLY_COLORS                    = ["#FD79A8", "#A29BFE", "#74B9FF", "#FAB1A0", "#FFEAA7"];
const MARGIN = 20;

class ButterflySwarm {
           items              = [];
            ticks         = 0;

    constructor(random               = Math.random) {
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

           update()       {
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

           draw(ctx                          )       {
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

// --- src/skyfriends.ts ---
/*
 * Occasional sky visitors — a kite, a little airplane, a bunch of balloons — drifting by
 * behind everything, like the butterflies. Purely decorative: they never touch gameplay.
 * Only one is in the sky at a time, with a pause between visits, so the sky stays calm.
 */

                                                           

                             
                         
              
              
                                                                                       
                  
               
               
                
                  
 

/** Visitors stay between the HUD and the top of the characters. */
const SKY_MIN_Y         = 85;
const SKY_MAX_Y         = 330;
/** Ticks between one visitor leaving and the next arriving (6–14 s). */
const SKY_GAP_MIN         = 360;
const SKY_GAP_MAX         = 840;
const OFFSCREEN = 90;
const KINDS                            = ['kite', 'plane', 'balloons'];
const COLORS                    = ["#FD79A8", "#74B9FF", "#A29BFE", "#55E6C1", "#FDCB6E"];

class SkyVisitors {
           visitor                    = null;
    /** Ticks until the next visitor arrives. */
           cooldown        ;
            random              ;
            lastKind                        = null;
    /** Upcoming kinds: a shuffled bag, so all three take turns before any comes back. */
            bag                   = [];

    constructor(random               = Math.random) {
        this.random = random;
        this.cooldown = 240; // the first one shows up a few seconds in
    }

            spawn()             {
        if (this.bag.length === 0) {
            this.bag = [...KINDS];
            for (let i = this.bag.length - 1; i > 0; i--) {
                const j = Math.floor(this.random() * (i + 1));
                [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
            }
            // Never the same kind twice in a row across bags either.
            if (this.bag[0] === this.lastKind) this.bag.push(this.bag.shift()                  );
        }
        const kind = this.bag.shift()                  ;
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

           update()       {
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

           draw(ctx                          )       {
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

function drawKite(ctx                          , v            )       {
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

function drawPlane(ctx                          , v            )       {
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

function drawBalloons(ctx                          , v            )       {
    const bunch                                      = [[-8, -2, "#FD79A8"], [8, -4, "#74B9FF"], [0, -14, v.color]];
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
function drawTinyFace(ctx                          , x        , y        , r        )       {
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

// --- src/pets.ts ---
/*
 * The rescued pets, drawn in the same soft, rounded, outline-free style as Flora and Noodle.
 * Every pet is drawn facing right around an origin on the ground under its middle, about
 * 26px tall; the caller mirrors it to face left.
 */

                                    

function ellipse(ctx     , x        , y        , rx        , ry        , color        , rot         = 0)       {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
    ctx.fill();
}

function circle(ctx     , x        , y        , r        , color        )       {
    ellipse(ctx, x, y, r, r, color);
}

function triangle(ctx     , points                             , color        )       {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (const [px, py] of points.slice(1)) ctx.lineTo(px, py);
    ctx.closePath();
    ctx.fill();
}

/** The shared face: a sparkly eye, a blush and a tiny smile, looking to the right. */
function face(ctx     , hx        , hy        , opts                                    = {})       {
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
function legs(ctx     , near        , far        , step        , spread         = 6)       {
    ctx.lineCap = 'round';
    ctx.lineWidth = 3.5;
    const pairs                             = [
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

                                                               

const drawKitty            = (ctx, step, now) => {
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

const drawPuppy            = (ctx, step, now) => {
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

const drawHamster            = (ctx, _step, now) => {
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

const drawTurtle            = (ctx, step) => {
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
    for (const [px, py, r] of [[0, -11, 3.6], [-6.5, -8, 2.6], [6.5, -8, 2.6]]         ) {
        circle(ctx, px, py, r, shellLight);
    }
    // Tiny tail
    triangle(ctx, [[-12, -5], [-16, -3.5], [-12, -2.5]], skin);
};

const drawBunny            = (ctx, step) => {
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

const drawDuckling            = (ctx, step) => {
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

const drawPiglet            = (ctx, step, now) => {
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

const drawFox            = (ctx, step, now) => {
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

const drawPanda            = (ctx, step) => {
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

const drawUnicorn            = (ctx, step) => {
    const coat = "#FFF7FB", shade = "#F0DDEA", mane = ["#FD79A8", "#A29BFE", "#74B9FF"];
    // Rainbow tail
    mane.forEach((c, i) => ellipse(ctx, -11 - i * 1.5, -9 + i * 2.5, 2.4, 4, c, 0.5));
    ctx.lineCap = 'round';
    ctx.lineWidth = 3;
    const pairs                     = [[-6, -step], [5, step], [-3, step], [8, -step]];
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
const PET_DRAWERS                                       = {
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
function drawPetSprite(
    ctx     ,
    species         ,
    x        ,
    groundY        ,
    facingLeft         ,
    step        
)       {
    ctx.save();
    ctx.translate(x, groundY);
    if (facingLeft) ctx.scale(-1, 1);
    ctx.lineJoin = 'round';
    PET_DRAWERS[species](ctx, step, Date.now());
    ctx.restore();
}

// --- src/renderer.ts ---
/** A smiling sun in the characters' style: soft rays that turn and breathe, and eyes that blink. */
function drawSun(ctx                          )       {
    const now = Date.now();
    const cx = 700;
    const cy = 75;

    // Rounded rays, alternating long and short, slowly turning; each one pulses on its own beat
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(now * 0.00025);
    ctx.lineCap = 'round';
    for (let i = 0; i < 12; i++) {
        const long = i % 2 === 0;
        const pulse = Math.sin(now * 0.003 + i * 0.9) * 2.5;
        const outer = (long ? 50 : 45) + pulse;
        ctx.strokeStyle = long ? "#FDCB6E" : "#FFE08A";
        ctx.lineWidth = long ? 6 : 4.5;
        ctx.beginPath();
        ctx.moveTo(0, -40);
        ctx.lineTo(0, -outer);
        ctx.stroke();
        ctx.rotate(Math.PI / 6);
    }
    ctx.restore();

    // Face: a soft glow ring keeps it visible on the pale yellow Pet Paradise sky
    ctx.fillStyle = "#FDCB6E";
    ctx.beginPath();
    ctx.arc(cx, cy, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFEAA7";
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.beginPath();
    ctx.ellipse(cx - 12, cy - 16, 8, 4.5, -0.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyes with sparkles; blinks every few seconds, out of step with Flora
    const blinking = (now + 1700) % 4300 < 140;
    ctx.fillStyle = "#2D3436";
    for (const ex of [cx - 10, cx + 10]) {
        ctx.beginPath();
        if (blinking) ctx.ellipse(ex, cy - 2, 3.2, 0.9, 0, 0, Math.PI * 2);
        else ctx.ellipse(ex, cy - 2, 2.8, 3.8, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    if (!blinking) {
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(cx - 9, cy - 3.5, 1.1, 0, Math.PI * 2);
        ctx.arc(cx + 11, cy - 3.5, 1.1, 0, Math.PI * 2);
        ctx.fill();
    }

    // Smile and rosy cheeks
    ctx.strokeStyle = "#C0392B";
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy + 5, 6, 0.25, Math.PI - 0.25);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 118, 117, 0.55)";
    ctx.beginPath();
    ctx.ellipse(cx - 18, cy + 6, 4.5, 2.8, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 18, cy + 6, 4.5, 2.8, 0, 0, Math.PI * 2);
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

/** Bramble bushes: round leafy clumps with little thorns and berries. */
function drawBushes(ctx                          , bushes                 )       {
    for (const b of bushes) {
        const top = GROUND_Y - b.height;
        const lumps = Math.max(2, Math.round(b.width / 18));
        const r = b.width / lumps / 2 + 4;
        ctx.fillStyle = "#2E8B57";
        for (let i = 0; i < lumps; i++) {
            const cx = b.x + (i + 0.5) * (b.width / lumps);
            ctx.beginPath();
            ctx.arc(cx, top + r, r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.beginPath();
        ctx.roundRect(b.x, top + r * 0.8, b.width, b.height - r * 0.8 + 2, 6);
        ctx.fill();
        // Lighter leaves on top
        ctx.fillStyle = "#3CB371";
        for (let i = 0; i < lumps; i++) {
            const cx = b.x + (i + 0.5) * (b.width / lumps);
            ctx.beginPath();
            ctx.arc(cx - 2, top + r - 3, r * 0.55, 0, Math.PI * 2);
            ctx.fill();
        }
        // Tiny thorns along the edge, and a couple of berries
        ctx.fillStyle = "#1E6B43";
        for (let tx = b.x + 4; tx < b.x + b.width - 2; tx += 8) {
            ctx.beginPath();
            ctx.moveTo(tx - 2, top + 3);
            ctx.lineTo(tx, top - 2);
            ctx.lineTo(tx + 2, top + 3);
            ctx.fill();
        }
        ctx.fillStyle = "#E84393";
        ctx.beginPath();
        ctx.arc(b.x + b.width * 0.3, top + b.height * 0.55, 2.5, 0, Math.PI * 2);
        ctx.arc(b.x + b.width * 0.7, top + b.height * 0.45, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

/** A chubby striped bumblebee with buzzing wings, facing the way it flies. */
function drawBee(ctx                          , x        , y        , facingLeft         )       {
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

/**
 * When a goal is off-screen, a small pill at the screen edge shows its emoji and which
 * way to go. `screenX` is the goal's position relative to the visible screen.
 */
function drawOffscreenArrow(ctx                          , screenX        , screenWidth        , emoji        )       {
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

const PET_EMOJI                                    = {
    kitty: "🐱",
    puppy: "🐶",
    hamster: "🐹",
    turtle: "🐢",
    bunny: "🐰",
    duckling: "🐥",
    piglet: "🐷",
    fox: "🦊",
    panda: "🐼",
    unicorn: "🦄"
};

/**
 * A rescued pet standing on the grass (its feet at `y + 12`), drawn in the characters' style,
 * with a soft shadow and a little heart. It trots while moving and hops gently while waiting.
 */
function drawRescuedPet(
    ctx                          ,
    species         ,
    x        ,
    y        ,
    facingLeft          = false,
    vx         = 0
)       {
    const now = Date.now();
    // Each species bobs on its own rhythm so the parade doesn't move in lockstep.
    const phase = Object.keys(PET_EMOJI).indexOf(species) * 1.3;
    const moving = Math.abs(vx) > 0.4;
    const step = moving ? Math.sin(now * 0.022 + phase) : 0;
    const hop = moving ? Math.abs(step) * 1.5 : Math.abs(Math.sin(now * 0.004 + phase)) * 2.5;
    const groundY = y + 12;

    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.beginPath();
    ctx.ellipse(x, groundY, 11 - hop, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    drawPetSprite(ctx, species, x, groundY - hop, facingLeft, step);
    ctx.fillStyle = "#FF7A93";
    drawHeart(ctx, x + (facingLeft ? -8 : 8), groundY - 34 - hop, 4);
    ctx.restore();
}

function drawTreeAndGround(
    ctx                          ,
    worldWidth        ,
    trees                   ,
    digMounds                     ,
    boneFound         ,
    boneX        
)       {
    for (const treeX of trees) drawTree(ctx, treeX);

    // Ground
    ctx.fillStyle = "#00B894";
    ctx.fillRect(0, 428, worldWidth, 72);

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

/** A tiny happy face for flower centres: dot eyes, a smile and a blush. */
function drawFlowerFace(ctx                          , x        , y        , r        )       {
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
function drawStem(ctx                          , x        , groundY        , topY        , lean        , width        )       {
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

function drawSprouts(
    ctx                          ,
    sprouts                   ,
    allBloomed         
)       {
    const now = Date.now();
    for (const s of sprouts) {
        const isBig = s.waterNeeded > 1;
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
            ctx.fillText("💧".repeat(s.waterNeeded - s.water), s.x, budY - bh - 8);
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

function drawHeart(ctx                          , x        , y        , size        )       {
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.35);
    ctx.bezierCurveTo(x - size, y - size * 0.4, x - size * 0.4, y - size, x, y - size * 0.35);
    ctx.bezierCurveTo(x + size * 0.4, y - size, x + size, y - size * 0.4, x, y + size * 0.35);
    ctx.fill();
}

/** Puffy round canopy on a soft tapered trunk, swaying gently, dotted with blossoms. */
function drawTree(ctx                          , treeX        )       {
    const now = Date.now();
    ctx.save();
    ctx.translate(treeX, 0);

    // Trunk: tapers up from a little root flare; the base hides under the grass
    ctx.fillStyle = "#A1887F";
    ctx.beginPath();
    ctx.moveTo(-7, 322);
    ctx.quadraticCurveTo(-8, 395, -15, 432);
    ctx.lineTo(15, 432);
    ctx.quadraticCurveTo(8, 395, 7, 322);
    ctx.closePath();
    ctx.fill();
    // Shade down one side, and a little knothole
    ctx.fillStyle = "#8D6E63";
    ctx.beginPath();
    ctx.moveTo(2, 322);
    ctx.quadraticCurveTo(3, 395, 8, 432);
    ctx.lineTo(15, 432);
    ctx.quadraticCurveTo(8, 395, 7, 322);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#6D4C41";
    ctx.beginPath();
    ctx.ellipse(-2, 382, 3, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Canopy sways a touch around the top of the trunk
    ctx.translate(0, 330);
    ctx.rotate(Math.sin(now * 0.0012 + treeX) * 0.025);
    ctx.translate(0, -330);

    const puffs                                      = [
        [-27, 314, 22], [27, 314, 22], [-15, 292, 24], [15, 290, 25], [0, 276, 22], [0, 312, 28]
    ];
    // Darker underside first, then the main green, then soft highlights
    ctx.fillStyle = "#3FA866";
    for (const [px, py, r] of puffs) {
        ctx.beginPath();
        ctx.arc(px, py + 5, r, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = "#55C57A";
    for (const [px, py, r] of puffs) {
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
    for (const [px, py, r] of [[-18, 284, 9], [6, 268, 7], [-32, 306, 6]]         ) {
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
    }

    // Tiny pink blossoms
    for (const [bx, by] of [[-22, 300], [18, 280], [28, 318], [-4, 322], [4, 288]]         ) {
        ctx.fillStyle = "#FFB8D0";
        for (let i = 0; i < 5; i++) {
            const a = (i / 5) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(bx + Math.cos(a) * 2.6, by + Math.sin(a) * 2.6, 2.1, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = "#FFEAA7";
        ctx.beginPath();
        ctx.arc(bx, by, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

/** Noodle's house: soft pink walls, a scalloped rounded roof, an arched door and a bone sign. */
/** Draws the doghouse centred on `centerX` (the shapes below are laid out for 707). */
function drawDoghouse(ctx                          , centerX         = 707)       {
    ctx.save();
    ctx.translate(centerX - 707, 0);

    // Walls with faint planks
    ctx.fillStyle = "#FF9AA2";
    ctx.beginPath();
    ctx.roundRect(670, 346, 75, 84, [6, 6, 0, 0]);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
    for (let py = 360; py < 428; py += 14) ctx.fillRect(672, py, 71, 2);

    // Roof: a rounded peak with rows of scalloped shingles
    ctx.beginPath();
    ctx.moveTo(654, 356);
    ctx.quadraticCurveTo(690, 322, 703, 309);
    ctx.quadraticCurveTo(707.5, 304, 712, 309);
    ctx.quadraticCurveTo(725, 322, 761, 356);
    ctx.closePath();
    ctx.fillStyle = "#E17055";
    ctx.fill();
    ctx.save();
    ctx.clip();
    ctx.fillStyle = "#EE8A6E";
    for (let row = 0; row < 4; row++) {
        const sy = 322 + row * 10;
        for (let sx = 650 + (row % 2) * 6; sx < 765; sx += 12) {
            ctx.beginPath();
            ctx.arc(sx, sy, 5.5, 0, Math.PI);
            ctx.fill();
        }
    }
    ctx.restore();
    // Rounded eave along the bottom of the roof
    ctx.fillStyle = "#C8553D";
    ctx.beginPath();
    ctx.roundRect(652, 352, 111, 8, 4);
    ctx.fill();

    // Heart on the gable
    ctx.fillStyle = "#FFFFFF";
    drawHeart(ctx, 707.5, 330, 6);

    // Bone sign over the door
    ctx.fillStyle = "#FDCB6E";
    ctx.beginPath();
    ctx.roundRect(694, 365, 27, 13, 5);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(701, 370, 13, 3);
    for (const [bx, by] of [[700.5, 369.5], [700.5, 373.5], [714.5, 369.5], [714.5, 373.5]]         ) {
        ctx.beginPath();
        ctx.arc(bx, by, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Arched door with a cream trim
    ctx.beginPath();
    ctx.moveTo(690, 430);
    ctx.lineTo(690, 402);
    ctx.arc(707.5, 402, 17.5, Math.PI, 0);
    ctx.lineTo(725, 430);
    ctx.closePath();
    ctx.fillStyle = "#4A3B47";
    ctx.fill();
    ctx.strokeStyle = "#FFE0D6";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Food bowl beside the house
    ctx.fillStyle = "#C8A27A";
    ctx.beginPath();
    ctx.ellipse(756, 424, 7, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#74B9FF";
    ctx.beginPath();
    ctx.moveTo(747, 423);
    ctx.lineTo(765, 423);
    ctx.quadraticCurveTo(764, 430, 756, 430);
    ctx.quadraticCurveTo(748, 430, 747, 423);
    ctx.fill();

    ctx.restore();
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
    /** Ticks the water key has been held without letting go. */
           waterHeldTicks         = 0;
    /** After a bee bump: ticks of being knocked back (no control), then of blinking safety. */
           stunTimer         = 0;
           safeTimer         = 0;
            knockVx         = 0;

           reset()       {
        this.x = 50;
        this.y = 380;
        this.vx = 0;
        this.vy = 0;
        this.grounded = true;
        this.coyoteTimer = COYOTE_TICKS;
        this.jumpBufferTimer = 0;
        this.jumpRising = false;
        this.waterHeldTicks = 0;
        this.stunTimer = 0;
        this.safeTimer = 0;
        this.knockVx = 0;
    }

    /**
     * Bumped by something at `fromX`: hop back away from it and lose control briefly.
     * Nothing is lost; returns false if she's still in her safe blink from the last bump.
     */
           bump(fromX        )          {
        if (this.safeTimer > 0) return false;
        this.knockVx = this.x + this.width / 2 < fromX ? -4 : 4;
        this.vy = -5;
        this.grounded = false;
        this.jumpRising = false;
        this.coyoteTimer = 0;
        this.stunTimer = BUMP_STUN_TICKS;
        this.safeTimer = BUMP_SAFE_TICKS;
        this.isWatering = false;
        return true;
    }

           update(
        keys                                   ,
        pressed                                   ,
        platforms                     ,
        mushrooms                  ,
        bushes                 ,
        worldWidth        ,
        disabled         ,
        playSound                           ,
        onWater            ,
        onDig            
    )       {
        if (disabled) return;
        if (this.safeTimer > 0) this.safeTimer--;

        if (this.stunTimer > 0) {
            // Knocked back: physics only, no walking, jumping, watering or digging.
            this.stunTimer--;
            this.vx = this.knockVx;
            this.knockVx *= 0.9;
            this.applyPhysics(platforms, mushrooms, bushes, worldWidth, playSound);
            return;
        }

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

        // A fresh press always splashes (even a tap shorter than a tick); holding keeps
        // splashing only for a couple of seconds so the key can't just be held down forever.
        const waterHeld = keys[CONTROLS.water] || pressed[CONTROLS.water];
        if (pressed[CONTROLS.water]) this.waterHeldTicks = 0;
        else if (waterHeld) this.waterHeldTicks++;
        else this.waterHeldTicks = 0;
        const canPour = waterHeld && (pressed[CONTROLS.water] || this.waterHeldTicks <= WATER_HOLD_TICKS);

        if (canPour && !this.isWatering) {
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

        this.applyPhysics(platforms, mushrooms, bushes, worldWidth, playSound);
    }

            applyPhysics(
        platforms                     ,
        mushrooms                  ,
        bushes                 ,
        worldWidth        ,
        playSound                           
    )       {
        const prevX = this.x;
        const prevBottom = this.y + this.height;
        this.vy += GRAVITY;
        this.x += this.vx;

        // Bushes are solid from the side: walk into one and you stop at its edge.
        for (const b of bushes) {
            const top = GROUND_Y - b.height;
            const overlapsX = this.x + this.width > b.x && this.x < b.x + b.width;
            if (!overlapsX || this.y + this.height <= top + 2) continue;
            if (prevX + this.width <= b.x + 0.01) this.x = b.x - this.width;
            else if (prevX >= b.x + b.width - 0.01) this.x = b.x + b.width;
            else if (this.x + this.width / 2 < b.x + b.width / 2) this.x = b.x - this.width;
            else this.x = b.x + b.width;
        }

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

        // One-way platform collisions; bush tops can be stood on too
        if (this.vy >= 0) {
            const bushTops = bushes.map(b => ({ x: b.x, y: GROUND_Y - b.height, width: b.width }));
            for (const p of [...platforms, ...bushTops]) {
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
        if (this.x > worldWidth - this.width) this.x = worldWidth - this.width;

        this.coyoteTimer = this.grounded ? COYOTE_TICKS : Math.max(0, this.coyoteTimer - 1);
        if (this.jumpBufferTimer > 0) this.jumpBufferTimer--;
    }

           draw(ctx                          )       {
        const now = Date.now();
        const walking = this.grounded && this.vx !== 0;
        const airborne = !this.grounded;
        const stride = walking ? Math.sin(now * 0.018) : 0;
        // A tiny bounce while walking, a gentle breath while standing.
        const bob = walking ? Math.abs(stride) * -1.5 : Math.sin(now * 0.004) * 0.6;

        ctx.save();
        // Blink while she's safe after a bee bump.
        if (this.safeTimer > 0 && Math.floor(now / 90) % 2 === 0) ctx.globalAlpha = 0.45;
        // Draw facing right around her centre line; mirror for facing left.
        ctx.translate(this.x + this.width / 2, this.y + bob);
        if (this.facing === 'left') ctx.scale(-1, 1);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const skin = "#FFE0D6";
        const hair = "#6C5CE7";
        const dress = "#FF6B8B";

        // Hair behind the head (falls to the shoulders)
        ctx.fillStyle = hair;
        ctx.beginPath();
        ctx.roundRect(-13, -4, 26, 20, 9);
        ctx.fill();

        // Legs and shoes
        const legL = airborne ? -3 : stride * 4;
        const legR = airborne ? 3 : -stride * 4;
        ctx.strokeStyle = skin;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-4, 36);
        ctx.lineTo(-4 + legL, airborne ? 43 : 45);
        ctx.moveTo(4, 36);
        ctx.lineTo(4 + legR, airborne ? 41 : 45);
        ctx.stroke();
        ctx.fillStyle = "#A55EEA";
        ctx.beginPath();
        ctx.ellipse(-3 + legL, airborne ? 45 : 46.5, 4, 2.4, 0, 0, Math.PI * 2);
        ctx.ellipse(5 + legR, airborne ? 43 : 46.5, 4, 2.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Back arm
        ctx.strokeStyle = skin;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(-6, 18);
        ctx.lineTo(-10 - stride * 2, airborne ? 20 : 28);
        ctx.stroke();

        // Dress: narrow at the shoulders, flaring to a scalloped hem
        ctx.fillStyle = dress;
        ctx.beginPath();
        ctx.moveTo(-6, 14);
        ctx.quadraticCurveTo(0, 12, 6, 14);
        ctx.lineTo(12, 36);
        ctx.quadraticCurveTo(0, 40, -12, 36);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#FF8FA8";
        for (let i = -9; i <= 9; i += 6) {
            ctx.beginPath();
            ctx.arc(i, 36.5, 3, 0, Math.PI);
            ctx.fill();
        }
        // Collar and a little flower button
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.ellipse(0, 14.5, 5, 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#FFEAA7";
        ctx.beginPath();
        ctx.arc(1, 22, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = skin;
        ctx.beginPath();
        ctx.arc(0, 2, 12.5, 0, Math.PI * 2);
        ctx.fill();

        // Bangs swept to the front
        ctx.fillStyle = hair;
        ctx.beginPath();
        ctx.moveTo(-13, 3);
        ctx.quadraticCurveTo(-14, -12, 0, -12);
        ctx.quadraticCurveTo(13, -12, 13.5, 0);
        ctx.quadraticCurveTo(7, -5, 3, -2);
        ctx.quadraticCurveTo(-3, -6, -8, -1);
        ctx.quadraticCurveTo(-11, 1, -13, 3);
        ctx.fill();

        // Bow
        ctx.fillStyle = "#FD79A8";
        ctx.beginPath();
        ctx.moveTo(-4, -11);
        ctx.lineTo(-11, -16);
        ctx.lineTo(-10, -7);
        ctx.closePath();
        ctx.moveTo(-4, -11);
        ctx.lineTo(3, -17);
        ctx.lineTo(3, -7);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#E84393";
        ctx.beginPath();
        ctx.arc(-4, -11, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Face (three-quarter view, looking the way she faces); blinks every few seconds
        const blinking = now % 3600 < 120;
        ctx.fillStyle = "#2D3436";
        for (const ex of [1, 7.5]) {
            ctx.beginPath();
            if (blinking) ctx.ellipse(ex, 3, 2, 0.6, 0, 0, Math.PI * 2);
            else ctx.ellipse(ex, 3, 1.7, 2.4, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        if (!blinking) {
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(1.6, 2.2, 0.7, 0, Math.PI * 2);
            ctx.arc(8.1, 2.2, 0.7, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = "rgba(255, 118, 117, 0.55)";
        ctx.beginPath();
        ctx.ellipse(-3, 7.5, 2.6, 1.6, 0, 0, Math.PI * 2);
        ctx.ellipse(10.5, 7.5, 2, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#C0392B";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(4.5, 7, 2.4, 0.2, Math.PI - 0.2);
        ctx.stroke();

        // Front arm holding the watering can
        ctx.strokeStyle = skin;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(5, 18);
        ctx.lineTo(11, this.isWatering ? 21 : 25);
        ctx.stroke();

        // Watering can: tips forward while pouring
        ctx.save();
        ctx.translate(15, 25);
        if (this.isWatering) ctx.rotate(0.45);
        ctx.fillStyle = "#74B9FF";
        ctx.beginPath();
        ctx.roundRect(-4, -4, 11, 9, 3);
        ctx.fill();
        ctx.strokeStyle = "#74B9FF";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(6, 0);
        ctx.lineTo(12, -4);
        ctx.moveTo(-3, -4);
        ctx.quadraticCurveTo(1.5, -9, 6, -4);
        ctx.stroke();
        ctx.fillStyle = "#0984E3";
        ctx.beginPath();
        ctx.arc(12.5, -4.5, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (this.isWatering) {
            ctx.fillStyle = "#0984E3";
            for (let i = 0; i < 6; i++) {
                const dropX = 24 + i * 1.6 + Math.sin(now * 0.03 + i) * 1.2;
                const dropY = 24 + ((now * 0.12 + i * 5) % 22);
                ctx.beginPath();
                ctx.ellipse(dropX, dropY, 1.3, 2, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        if (this.isDigging) {
            // Little trowel scooping the dirt
            ctx.strokeStyle = "#8D6E63";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(10, 30);
            ctx.lineTo(16, 40);
            ctx.stroke();
            ctx.fillStyle = "#B2BEC3";
            ctx.beginPath();
            ctx.ellipse(18, 43, 3.5, 5, -0.5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

class Noodle {
           x         = 20;
           y         = 406;
           barkTimer         = 0;
           speechBubble         = "";
           sniffing          = false;
    /** How far Noodle moved last tick; drives trotting and which way he faces. */
           vx         = 0;
           facing            = 'right';
    /** Lines waiting their turn in the speech bubble, with how long each shows. */
            speechQueue                     = [];

    /** Says `text` for `ticks` right away; whatever he was saying waits its turn after. */
           sayFirst(text        , ticks        )       {
        if (this.barkTimer > 0) this.speechQueue.unshift([this.speechBubble, this.barkTimer]);
        this.speechBubble = text;
        this.barkTimer = ticks;
    }

           update(
        playerX        ,
        digMounds                     ,
        boneFound         ,
        gamePaused         ,
        playSound                           
    )       {
        if (gamePaused) return;
        const prevX = this.x;

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
        if (this.barkTimer <= 0 && this.speechQueue.length > 0) {
            [this.speechBubble, this.barkTimer] = this.speechQueue.shift()                    ;
        }

        this.vx = this.x - prevX;
        // A little dead zone so tiny drifts don't make him flip back and forth.
        if (this.vx > 0.3) this.facing = 'right';
        else if (this.vx < -0.3) this.facing = 'left';
    }

           draw(ctx                          )       {
        const now = Date.now();
        const trotting = Math.abs(this.vx) > 0.4;
        const step = trotting ? Math.sin(now * 0.022) : 0;
        // Sniffing: nose down to the ground with an excited little hop.
        const hop = this.sniffing ? Math.abs(Math.sin(now * 0.02)) * -3 : trotting ? Math.abs(step) * -1.5 : 0;
        const headDip = this.sniffing ? 5 : 0;

        const fur = "#F2C46D";
        const furDark = "#D9A441";
        const furLight = "#FBE3B0";

        ctx.save();
        // Origin on the ground under his middle, facing right; mirror for left.
        ctx.translate(this.x + 12, this.y + 22);
        if (this.facing === 'left') ctx.scale(-1, 1);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Soft shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.translate(0, hop);

        // Legs: far pair darker, trotting in opposite phase to the near pair
        const legs                             = [
            [-8, -step, furDark],
            [6, step, furDark],
            [-5, step, fur],
            [9, -step, fur]
        ];
        // Short, chunky legs read as puppy rather than deer.
        ctx.lineWidth = 5;
        for (const [lx, swing, color] of legs) {
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(lx, -7);
            ctx.lineTo(lx + swing * 2, -2.5 - hop);
            ctx.stroke();
        }

        // Fluffy tail wags faster when he smells the bone
        const wag = Math.sin(now * (this.sniffing ? 0.05 : 0.018)) * 0.5;
        ctx.save();
        ctx.translate(-13, -13);
        ctx.rotate(-0.6 + wag);
        ctx.fillStyle = fur;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(-i * 3.5, -i * 2.5, 3.6 - i * 0.6, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // Body: a soft oval with doodle curls along the top
        ctx.fillStyle = fur;
        ctx.beginPath();
        ctx.ellipse(0, -11.5, 14, 7.5, 0, 0, Math.PI * 2);
        ctx.fill();
        for (let i = -10; i <= 6; i += 4) {
            ctx.beginPath();
            ctx.arc(i, -17.5, 3.4, 0, Math.PI * 2);
            ctx.fill();
        }
        // Fluffy chest patch under the chin
        ctx.fillStyle = furLight;
        ctx.beginPath();
        ctx.ellipse(9, -10, 4, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head (dips toward the ground while sniffing)
        ctx.save();
        ctx.translate(12, -20.5 + headDip);
        if (this.sniffing) ctx.rotate(0.35);

        // Pink collar where head meets body
        ctx.strokeStyle = "#FF6B8B";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(-2, 4, 6, 0.6, 2.2);
        ctx.stroke();
        ctx.fillStyle = "#FDCB6E";
        ctx.beginPath();
        ctx.arc(-3.5, 10, 1.7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = fur;
        ctx.beginPath();
        ctx.arc(0, 0, 8.5, 0, Math.PI * 2);
        ctx.fill();
        // Curly topknot
        for (const [cx, cy, r] of [[-4, -7, 3.6], [0.5, -8.5, 3.8], [4.5, -6.5, 3.2]]         ) {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fill();
        }

        // Floppy ear, swinging a little as he moves
        ctx.fillStyle = furDark;
        ctx.beginPath();
        ctx.ellipse(-4.5, 2.5, 3.6, 6.2, 0.25 + step * 0.15, 0, Math.PI * 2);
        ctx.fill();

        // Snout and nose
        ctx.fillStyle = furLight;
        ctx.beginPath();
        ctx.ellipse(7, 3, 5, 3.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#2D3436";
        ctx.beginPath();
        ctx.ellipse(11, 1.8, 2, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#2D3436";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(8.5, 4.5, 1.8, 0.3, Math.PI - 0.3);
        ctx.stroke();

        // Eye with a sparkle (closes happily while sniffing), plus blush
        ctx.fillStyle = "#2D3436";
        ctx.beginPath();
        if (this.sniffing) {
            ctx.strokeStyle = "#2D3436";
            ctx.lineWidth = 1.2;
            ctx.arc(3.5, -1, 1.8, Math.PI + 0.3, -0.3);
            ctx.stroke();
        } else {
            ctx.ellipse(3.5, -1.5, 1.6, 2.2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(4, -2.2, 0.6, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = "rgba(255, 118, 117, 0.5)";
        ctx.beginPath();
        ctx.ellipse(2.5, 3.5, 2.2, 1.4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        ctx.restore();
    }

    /**
     * Noodle's speech bubble sits on the grass *below* him, pointing up, so it never
     * covers Flora or the pets. Drawn after every character.
     */
           drawSpeech(ctx                          , viewLeft        , viewRight        )       {
        if (this.barkTimer <= 0) return;
        ctx.save();
        ctx.font = "bold 12px sans-serif";
        const width = Math.max(44, ctx.measureText(this.speechBubble).width + 16);
        const noseX = this.x + 14;
        // Stay inside the visible part of the level.
        const left = Math.min(Math.max(viewLeft + 4, noseX - width / 2), viewRight - width - 4);
        const top = SPEECH_TOP_Y;

        ctx.fillStyle = this.sniffing ? "#FFF9DB" : "#FFFFFF";
        ctx.strokeStyle = "rgba(45, 52, 54, 0.15)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(left, top, width, 22, 9);
        ctx.fill();
        ctx.stroke();
        // Little tail pointing up at Noodle
        ctx.beginPath();
        ctx.moveTo(noseX - 5, top + 1);
        ctx.lineTo(noseX, top - 6);
        ctx.lineTo(noseX + 5, top + 1);
        ctx.fill();

        ctx.fillStyle = "#2D3436";
        ctx.textBaseline = "middle";
        ctx.fillText(this.speechBubble, left + 8, top + 11.5);
        ctx.restore();
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
const rescuedList = document.getElementById('rescued-list')               ;
const pauseBtn = document.getElementById('pause-btn')                     ;
const pauseScreen = document.getElementById('pause-screen')               ;
const resumeBtn = document.getElementById('resume-btn')                     ;
const pauseRestartBtn = document.getElementById('pause-restart-btn')                     ;
const pauseLevelsBtn = document.getElementById('pause-levels-btn')                     ;
const pauseMenuBtn = document.getElementById('pause-menu-btn')                     ;
const levelsBtn = document.getElementById('levels-btn')                     ;
const levelSelect = document.getElementById('level-select')               ;
const levelGrid = document.getElementById('level-grid')               ;
const levelsBackBtn = document.getElementById('levels-back-btn')                     ;
const petsBtn = document.getElementById('pets-btn')                     ;
const pausePetsBtn = document.getElementById('pause-pets-btn')                     ;
const rosterScreen = document.getElementById('roster-screen')               ;
const rosterGrid = document.getElementById('roster-grid')               ;
const rosterCount = document.getElementById('roster-count')               ;
const rosterHint = document.getElementById('roster-hint')               ;
const rosterBackBtn = document.getElementById('roster-back-btn')                     ;
const victoryText = document.getElementById('victory-text')               ;

const audio = new AudioController();
const particleSystem = new ParticleSystem();
const butterflies = new ButterflySwarm();
const skyVisitors = new SkyVisitors();
const storage = getStorage();
/** Continue point, unlocked levels, roster and followers; kept in memory and mirrored to storage. */
let progress           = loadSave(storage, LEVELS.map(l => l.species));

                                                                               
let screen         = 'start';
/** Where the level list's or roster's Back button goes. */
let menuReturnTo                     = 'start';
let currentLevel         = 0;
let levelClearTimer         = 0;
/** Ticks since the level started; drives moving platforms and bees. */
let levelTicks         = 0;
/** Left edge of the visible part of the level; levels wider than the screen scroll. */
let cameraX         = 0;
/** Where each bee is this tick, and which way it's flying. */
let bees                                      = [];

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
    if (e.code === 'Escape' && !e.repeat) {
        if (screen === 'playing') pauseGame();
        else if (screen === 'paused') resumeGame();
        else if (screen === 'levels') closeLevelSelect();
        else if (screen === 'roster') closeRoster();
    }
    pressKey(e.code);
});
window.addEventListener('keyup', (e               ) => {
    keys[e.code] = false;
});
// Releasing a key while the window is unfocused never fires keyup, which left Flora running forever.
window.addEventListener('blur', () => {
    clearKeys();
    // Switching apps or tabs shouldn't leave the game running unattended.
    if (screen === 'playing') pauseGame();
});
document.addEventListener('visibilitychange', () => {
    if (document.hidden && screen === 'playing') pauseGame();
});

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

function saveProgress(level               )       {
    progress = { ...progress, level, unlocked: Math.max(progress.unlocked, level ?? 0) };
    writeSave(storage, progress);
}

/**
 * Makes the parade match the followers: pets already walking keep their spot, new ones
 * join at the back, and ones that went to rest leave.
 */
function syncParade()       {
    const kept = rescuedFriends.filter(p => progress.followers.includes(p.species));
    for (const species of progress.followers) {
        if (kept.some(p => p.species === species)) continue;
        const behind = kept.length === 0 ? noodle.x : kept[kept.length - 1].x;
        kept.push({ species, x: behind - PARADE_GAP, y: 416 });
    }
    // Keep the parade in follow order (longest-following nearest Noodle).
    kept.sort((a, b) => progress.followers.indexOf(a.species) - progress.followers.indexOf(b.species));
    rescuedFriends = kept;
}

const petName = (species         )         => LEVELS.find(l => l.species === species)?.pet ?? species;

/** Drops held and just-pressed keys, so menu key presses never leak into play. */
function dropInput()       {
    clearKeys();
    for (const code of Object.keys(pressed)) pressed[code] = false;
}

/** Shows exactly one menu overlay (or none), and hides touch controls while any is up. */
function showOverlay(overlay                    )       {
    for (const el of [startScreen, pauseScreen, levelSelect, rosterScreen]) el.hidden = el !== overlay;
    if (overlay) document.body.classList.add('menu-open');
    else document.body.classList.remove('menu-open');
}

/** Starts play at `level`, with the chosen followers in the parade. */
function startGame(level        )       {
    currentLevel = level;
    rescuedFriends = progress.followers.map((species, i) => ({ species, x: 20 - (i + 1) * PARADE_GAP, y: 416 }));
    // Continue picks up from whichever level you're on; level 1 is just "New game".
    saveProgress(level > 0 ? level : null);
    noodle.x = 20;
    restartLevel();
    dropInput();
    screen = 'playing';
    showOverlay(null);
}

function showStartScreen()       {
    screen = 'start';
    const canContinue = progress.level !== null;
    continueBtn.hidden = !canContinue;
    if (progress.level !== null) continueBtn.innerText = `▶ Continue — Level ${progress.level + 1}`;
    playBtn.innerText = canContinue ? '🌱 New game' : '▶ Play';
    petsBtn.hidden = progress.roster.length === 0;
    showOverlay(startScreen);
    (canContinue ? continueBtn : playBtn).focus();
}

function pauseGame()       {
    if (screen !== 'playing') return;
    screen = 'paused';
    dropInput();
    showOverlay(pauseScreen);
    resumeBtn.focus();
}

function resumeGame()       {
    if (screen !== 'paused') return;
    dropInput();
    screen = 'playing';
    showOverlay(null);
}

/** The level list: every level up to the furthest one reached can be picked. */
function openLevelSelect(from                    )       {
    menuReturnTo = from;
    screen = 'levels';
    levelGrid.replaceChildren(
        ...LEVELS.map((level, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'level-card';
            const locked = i > progress.unlocked;
            const beaten = i < progress.unlocked;
            btn.disabled = locked;
            if (locked) btn.classList.add('locked');
            if (beaten) btn.classList.add('beaten');
            if (i === currentLevel && from === 'paused') btn.classList.add('current');
            // First line (the pet, or a lock) is drawn big by CSS; then "number. name".
            btn.innerText = `${locked ? '🔒' : PET_EMOJI[level.species]}\n${i + 1}. ${level.name}${beaten ? ' ✔' : ''}`;
            btn.setAttribute('aria-label', `Level ${i + 1}: ${level.name}${locked ? ' (locked)' : beaten ? ' (rescued)' : ''}`);
            btn.addEventListener('click', () => {
                if (locked) return;
                // Picking a level is a tap, so it can switch music on like Play does.
                audio.setEnabled(true, i, musicBtn);
                startGame(i);
            });
            return btn;
        })
    );
    showOverlay(levelSelect);
    const focusIndex = from === 'paused' ? currentLevel : progress.unlocked;
    (levelGrid.children[focusIndex]                           )?.focus();
}

function closeLevelSelect()       {
    if (screen !== 'levels') return;
    returnFromMenu(pauseLevelsBtn);
}

function returnFromMenu(focusInPause             )       {
    if (menuReturnTo === 'paused') {
        screen = 'paused';
        showOverlay(pauseScreen);
        focusInPause.focus();
    } else {
        showStartScreen();
    }
}

/** Draws a pet onto a roster card's little canvas; pets not yet rescued are a mystery silhouette. */
function drawRosterPet(card                   , species         , rescued         )       {
    const dpr = window.devicePixelRatio || 1;
    card.width = Math.round(80 * dpr);
    card.height = Math.round(64 * dpr);
    const g = card.getContext('2d');
    if (!g) return;
    g.scale(dpr * 1.6, dpr * 1.6);
    drawPetSprite(g, species, 23, 37, false, 0);
    if (!rescued) {
        g.globalCompositeOperation = 'source-in';
        g.fillStyle = 'rgba(99, 110, 114, 0.35)';
        g.fillRect(0, 0, 80, 64);
    }
}

/** The roster: every pet rescued so far. Tap one to let it follow or rest (3 can follow). */
function openRoster(from                    )       {
    menuReturnTo = from;
    screen = 'roster';
    rosterHint.innerText = '';
    renderRoster();
    showOverlay(rosterScreen);
    (rosterGrid.children[0]                           )?.focus();
}

function renderRoster()       {
    rosterCount.innerText = `🐾 Following: ${progress.followers.length} / ${MAX_FOLLOWERS}`;
    rosterGrid.replaceChildren(
        ...LEVELS.map((level, i) => {
            const species = level.species;
            const rescued = progress.roster.includes(species);
            const following = progress.followers.includes(species);
            const state = !rescued ? 'locked' : following ? 'following' : 'resting';
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `roster-card ${state}`;
            btn.dataset.state = state;
            btn.dataset.species = species;
            btn.disabled = !rescued;
            const pic = document.createElement('canvas');
            drawRosterPet(pic, species, rescued);
            const label = document.createElement('span');
            label.innerText = rescued
                ? `${level.pet}\n${following ? '🐾 Following' : '💤 Resting'}`
                : `???\nRescue in level ${i + 1}`;
            btn.append(pic, label);
            btn.setAttribute('aria-label', rescued ? `${level.pet}, ${following ? 'following' : 'resting'}` : `Not rescued yet, level ${i + 1}`);
            btn.setAttribute('aria-pressed', String(following));
            btn.addEventListener('click', () => {
                if (!rescued) return;
                if (!toggleFollower(progress, species)) {
                    rosterHint.innerText = `Only ${MAX_FOLLOWERS} pets can follow at once — tap one to let it rest first.`;
                    return;
                }
                rosterHint.innerText = '';
                writeSave(storage, progress);
                syncParade();
                renderRoster();
                (rosterGrid.children[i]                           )?.focus();
            });
            return btn;
        })
    );
}

function closeRoster()       {
    if (screen !== 'roster') return;
    returnFromMenu(pausePetsBtn);
}

// The Play tap is the user gesture browsers require before audio can start, so music comes on here.
playBtn.addEventListener('click', () => {
    audio.setEnabled(true, 0, musicBtn);
    startGame(0);
});
continueBtn.addEventListener('click', () => {
    const level = progress.level ?? 0;
    audio.setEnabled(true, level, musicBtn);
    startGame(level);
});
levelsBtn.addEventListener('click', () => openLevelSelect('start'));

pauseBtn.addEventListener('click', () => {
    pauseBtn.blur();
    pauseGame();
});
resumeBtn.addEventListener('click', resumeGame);
pauseRestartBtn.addEventListener('click', () => {
    restartLevel();
    resumeGame();
});
pauseLevelsBtn.addEventListener('click', () => openLevelSelect('paused'));
pauseMenuBtn.addEventListener('click', () => showStartScreen());
levelsBackBtn.addEventListener('click', closeLevelSelect);
petsBtn.addEventListener('click', () => openRoster('start'));
pausePetsBtn.addEventListener('click', () => openRoster('paused'));
rosterBackBtn.addEventListener('click', closeRoster);

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
    bees = beesAt(0);
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
    cameraX = cameraTarget();
}

/** The camera keeps Flora a little behind centre, looking ahead the way she faces. */
function cameraTarget()         {
    const maxX = levelWidth(LEVELS[currentLevel]) - CANVAS_WIDTH;
    const lookAhead = flora.facing === 'right' ? 60 : -60;
    const target = flora.x + flora.width / 2 - CANVAS_WIDTH / 2 + lookAhead;
    return Math.min(Math.max(0, target), maxX);
}

function updateCamera()       {
    cameraX += (cameraTarget() - cameraX) * 0.1;
}

/** Bees glide out and back like clouds, bobbing up and down as they buzz. */
function beesAt(t        )                                      {
    return (LEVELS[currentLevel].bees ?? []).map((b, i) => {
        const phase = (2 * Math.PI * t) / b.period;
        return {
            x: b.x + (b.range * (1 - Math.cos(phase))) / 2,
            y: b.y + Math.sin(t * 0.09 + i) * 6,
            // Moving right during the first half of each trip
            facingLeft: Math.sin(phase) < 0
        };
    });
}

function updateBees()       {
    bees = beesAt(levelTicks);
    for (const bee of bees) {
        // Circle-vs-box: nearest point on Flora's box to the bee
        const nx = Math.min(Math.max(bee.x, flora.x), flora.x + flora.width);
        const ny = Math.min(Math.max(bee.y, flora.y), flora.y + flora.height);
        if ((bee.x - nx) ** 2 + (bee.y - ny) ** 2 > BEE_RADIUS ** 2) continue;
        if (flora.bump(bee.x)) {
            audio.playSound('bump');
            particleSystem.spawn(bee.x, bee.y, '#FDCB6E', 8, 'star');
            noodle.barkTimer = 70;
            noodle.speechBubble = "Ouch! Jump over the bees 🐝";
        }
    }
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
    // Flora has to walk in at the door, not fall past it from above.
    const atDoor = flora.grounded && flora.y + flora.height >= GROUND_Y - 1;
    if (flora.x <= doghouseEntryX(LEVELS[currentLevel]) || !atDoor || levelClearTimer > 0) return;
    const houseX = doghouseX(LEVELS[currentLevel]);
    if (keyCollected) {
        levelClearTimer = LEVEL_CLEAR_FRAMES;
        audio.playSound('victory');
        particleSystem.spawn(houseX, 395, '#FF7675', 14, 'heart');
        particleSystem.spawn(houseX, 385, '#F1C40F', 20, 'star');
        updateStatus();
    } else if (noodle.barkTimer <= 0) {
        noodle.barkTimer = 70;
        noodle.speechBubble = "It's locked! Need the key 🔑";
    }
}

function updateLevelClear()       {
    if (levelClearTimer <= 0) return;
    if (levelClearTimer % 15 === 0) {
        particleSystem.spawn(doghouseX(LEVELS[currentLevel]) + (Math.random() - 0.5) * 40, 390, '#FFEAA7', 8, 'star');
    }

    levelClearTimer--;
    if (levelClearTimer > 0) return;

    // The rescued pet joins the roster and the parade; a full parade sends its longest follower home.
    const { bumped } = addRescue(progress, LEVELS[currentLevel].species);
    const leaving = rescuedFriends.find(p => p.species === bumped);
    if (leaving) particleSystem.spawn(leaving.x, 405, '#FF7675', 8, 'heart');
    syncParade();
    const goodbye = bumped ? `${petName(bumped)} went home to rest 🏡` : null;

    if (currentLevel === LEVELS.length - 1) {
        screen = 'victory';
        // Nothing left to continue, but every level stays open in the level list.
        progress = { ...progress, level: null, unlocked: LEVELS.length - 1 };
        writeSave(storage, progress);
        updateStatus();
        victoryDialog.showModal();
    } else {
        currentLevel++;
        saveProgress(currentLevel);
        restartLevel();
    }
    // Shown before the new level's tip, which waits its turn.
    if (goodbye) noodle.sayFirst(goodbye, 150);
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

/** Gap between pets in the parade; the drawn pets are about 30px wide. */
const PARADE_GAP = 32;

function updateParade()       {
    rescuedFriends.forEach((pet, idx) => {
        const leaderX = idx === 0 ? noodle.x : rescuedFriends[idx - 1].x;
        const vx = (leaderX - PARADE_GAP - pet.x) * 0.08;
        pet.x += vx;
        pet.vx = vx;
        // Same dead zone as Noodle, so settled pets don't flip back and forth.
        if (vx > 0.3) pet.facingLeft = false;
        else if (vx < -0.3) pet.facingLeft = true;
    });
}

/** Advances the simulation by exactly one fixed tick (1/60 s). */
function update()       {
    // Butterflies keep fluttering on every screen, including behind the start screen.
    butterflies.update();
    skyVisitors.update();
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
        level.bushes ?? [],
        levelWidth(level),
        levelClearTimer > 0,
        type => audio.playSound(type),
        checkWatering,
        checkDigging
    );
    noodle.update(flora.x, digMounds, boneFound, false, type => audio.playSound(type));
    if (levelClearTimer === 0) updateBees();
    particleSystem.update();
    updateCamera();

    updateDoghouse();
    updateLevelClear();
}

function render()       {
    const level = LEVELS[currentLevel];
    ctx.setTransform(pixelScale, 0, 0, pixelScale, 0, 0);
    ctx.fillStyle = level.bg;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Sky things stay put on screen; everything else is drawn in level space and scrolls.
    const rainbow = rainbowProgress();
    if (rainbow > 0) drawRainbow(ctx, rainbow);
    drawSun(ctx);
    skyVisitors.draw(ctx);
    butterflies.draw(ctx);

    const houseX = doghouseX(level);
    ctx.save();
    ctx.translate(-cameraX, 0);
    drawTreeAndGround(ctx, levelWidth(level), [level.treeX, ...(level.trees ?? [])], digMounds, boneFound, boneX);
    drawPlatforms(ctx, level.platforms);
    drawCloudPlatforms(ctx, movingPlatforms);
    drawMushrooms(ctx, level.mushrooms ?? []);
    drawBushes(ctx, level.bushes ?? []);
    drawSprouts(ctx, sprouts, allBloomed());
    drawDoghouse(ctx, houseX);

    if (keyCollected) {
        // Waiting in the doorway, looking out toward Flora.
        drawRescuedPet(ctx, level.species, houseX, 416, true, 0);
    } else if (allBloomed() && boneFound) {
        drawKey(ctx, keyX, keyY);
    }

    for (const pet of rescuedFriends) drawRescuedPet(ctx, pet.species, pet.x, 416, pet.facingLeft ?? false, pet.vx ?? 0);
    flora.draw(ctx);
    noodle.draw(ctx);
    for (const bee of bees) drawBee(ctx, bee.x, bee.y, bee.facingLeft);
    particleSystem.draw(ctx);
    noodle.drawSpeech(ctx, cameraX, cameraX + CANVAS_WIDTH);
    ctx.restore();

    // Point the way to the next goal when it's off-screen.
    const goal = nextGoal();
    if (goal) drawOffscreenArrow(ctx, goal.x - cameraX, CANVAS_WIDTH, goal.emoji);

    if (levelClearTimer > 0) drawCelebrationBanner(ctx, level.pet);
}

/** What Flora should head for next, for the off-screen arrow: key, then doghouse, then any sprout left. */
function nextGoal()                                      {
    if (levelClearTimer > 0) return null;
    if (keyCollected) return { x: doghouseX(LEVELS[currentLevel]), emoji: '🏠' };
    if (allBloomed() && boneFound) return { x: keyX, emoji: '🔑' };
    const onScreen = (x        )          => x >= cameraX && x <= cameraX + CANVAS_WIDTH;
    const left = sprouts.filter(s => !s.bloomed);
    if (left.length === 0 || left.some(s => onScreen(s.x))) return null;
    const floraX = flora.x + flora.width / 2;
    const nearest = left.reduce((a, b) => (Math.abs(a.x - floraX) <= Math.abs(b.x - floraX) ? a : b));
    return { x: nearest.x, emoji: '🌱' };
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
    // Book the next frame first, so an error below can never stop the game loop for good.
    requestAnimationFrame(frame);
    try {
        advance(now);
    } catch (err) {
        console.error('Frame failed; the game keeps running', err);
    }
}

function advance(now        )       {
    if (lastFrameTime !== null) {
        // Cap catch-up after a backgrounded tab so the game doesn't fast-forward.
        tickAccumulator += Math.min(now - lastFrameTime, 250);
    } else {
        tickAccumulator = TICK_MS;
    }
    lastFrameTime = now;

    while (tickAccumulator >= TICK_MS) {
        tickAccumulator -= TICK_MS;
        update();
    }
    render();
}

/** The victory dialog lists every pet, so it grows with the level list. */
function fillVictoryDialog()       {
    victoryText.innerText = `Flora and Noodle bloomed every garden and rescued all ${LEVELS.length} magical pets!`;
    rescuedList.replaceChildren(
        ...LEVELS.map(l => {
            const li = document.createElement('li');
            li.innerText = `${PET_EMOJI[l.species]} ${l.pet}`;
            return li;
        })
    );
}

fitToScreen();
fillVictoryDialog();
initLevel();
showStartScreen();
requestAnimationFrame(frame);
