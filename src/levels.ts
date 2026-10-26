import type { LevelConfig } from './types.ts';

/** A level is at least one screen wide. */
export const DEFAULT_LEVEL_WIDTH: number = 800;
export const levelWidth = (level: LevelConfig): number => level.width ?? DEFAULT_LEVEL_WIDTH;
/** The doghouse always stands at the far right of the level. */
export const doghouseX = (level: LevelConfig): number => levelWidth(level) - 93;
/** Flora's left edge must pass this x (on the ground, with the key) to enter the doghouse. */
export const doghouseEntryX = (level: LevelConfig): number => levelWidth(level) - 115;

/** Simulation rate: every physics/timer value below is tuned per 1/60 s tick. */
export const TICK_MS: number = 1000 / 60;
export const GROUND_Y: number = 428;
export const LEVEL_CLEAR_FRAMES: number = 75;
/** Ticks the victory rainbow takes to sweep across the sky. */
export const RAINBOW_SWEEP_FRAMES: number = 40;
export const DIG_RANGE: number = 48;
/** Noodle's speech bubble sits on the grass, just under everyone's feet. */
export const SPEECH_TOP_Y: number = GROUND_Y + 8;
export const GRAVITY: number = 0.45;
export const JUMP_VY: number = -10.2;
/** Releasing jump early caps upward speed here, giving a short hop. */
export const JUMP_CUT_VY: number = -4;
/** Grace ticks to still jump after walking off a ledge. */
export const COYOTE_TICKS: number = 6;
/** Grace ticks a jump pressed just before landing is remembered. */
export const JUMP_BUFFER_TICKS: number = 6;
/** Landing on a mushroom launches Flora upward this fast. */
export const BOUNCE_VY: number = -16.5;
/** Mushroom cap size; its top is MUSHROOM_HEIGHT above the surface it grows on. */
export const MUSHROOM_WIDTH: number = 40;
export const MUSHROOM_HEIGHT: number = 18;
/** Highest bounce off a mushroom top in px. */
export const MAX_BOUNCE_HEIGHT: number = (BOUNCE_VY * BOUNCE_VY) / (2 * GRAVITY) + MUSHROOM_HEIGHT;
/** Highest jump in px (jump held): v^2 / 2g. */
export const MAX_JUMP_HEIGHT: number = (JUMP_VY * JUMP_VY) / (2 * GRAVITY);

/** Pond water surface; lily pads float just above it. Falling below the surface is a splash. */
export const WATER_SURFACE_Y: number = 436;
export const LILY_Y: number = 430;
/** Rain clouds float at this height and water a column this wide below them. */
export const RAIN_CLOUD_Y: number = 150;
export const RAIN_WIDTH: number = 70;
/** A sprout under the rain gets one splash this often. */
export const RAIN_SPLASH_TICKS: number = 90;
/** On ice Flora speeds up and slows down gradually: this fraction of the change per tick. */
export const ICE_GRIP: number = 0.05;

/** Bee hitbox radius. Touching a bee bumps Flora back; she can't be bumped again for a moment. */
export const BEE_RADIUS: number = 10;
export const BUMP_STUN_TICKS: number = 24;
export const BUMP_SAFE_TICKS: number = 90;

/** Holding water keeps splashing for this long, then Flora has to let go and press again. */
export const WATER_HOLD_TICKS: number = 120;

/** KeyboardEvent.code for each action. Touch buttons press these same codes. */
export const CONTROLS = {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    jump: 'ArrowUp',
    water: 'Space',
    dig: 'ArrowDown'
} as const;

export const FLOWER_COLORS: readonly string[] = [
    "#FF7675",
    "#FD79A8",
    "#A29BFE",
    "#FFEAA7",
    "#55E6C1",
    "#74B9FF"
];

/** Big flowers are always sunflowers, so they stand out against every level's sky. */
export const BIG_FLOWER_COLOR: string = "#F39C12";

export const RAINBOW_COLORS: readonly string[] = [
    "#FF7675",
    "#FAB1A0",
    "#FFEAA7",
    "#55E6C1",
    "#74B9FF",
    "#A29BFE"
];

export const LEVEL_MELODIES: readonly (readonly string[])[] = [
    ["C4", "E4", "G4", "B4", "A4", "G4", "E4", "D4"],
    ["D4", "F#4", "A4", "C5", "B4", "A4", "F#4", "E4"],
    ["E4", "G#4", "B4", "D#5", "C#5", "B4", "G#4", "F#4"],
    ["F4", "A4", "C5", "E5", "D5", "C5", "A4", "G4"],
    ["G4", "B4", "D5", "F#5", "E5", "D5", "B4", "A4"],
    ["A4", "C5", "E5", "G5", "F5", "E5", "C5", "B4"],
    ["C4", "G4", "E4", "A4", "G4", "E4", "D4", "G4"],
    ["D4", "A4", "F#4", "B4", "A4", "F#4", "E4", "A4"],
    ["E4", "B4", "G4", "C5", "B4", "G4", "F#4", "B4"],
    ["C5", "E5", "G5", "C6", "B5", "G5", "E5", "D5"],
    ["F4", "A4", "C5", "A4", "G4", "F4", "D4", "C4"],
    ["G4", "D5", "B4", "G4", "A4", "E5", "C5", "A4"],
    ["E4", "G4", "B4", "G4", "F#4", "A4", "C5", "B4"],
    ["C5", "G4", "E4", "G4", "B4", "D5", "G5", "E5"],
    ["A4", "E4", "C4", "E4", "G4", "B4", "E5", "C5"]
];

export const LEVELS: readonly LevelConfig[] = [
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
        tip: "Everything at once! You can do it 🦄",
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
    },

    // ---- Weather and water levels ----
    {
        name: "Lily Pond",
        flowersNeeded: 6,
        pet: "Lily the Frog",
        species: "frog",
        bg: "#9FD8E8",
        width: 2000,
        treeX: 1050,
        trees: [300, 1700],
        tip: "Hop across the lily pads! 🪷",
        water: [
            { x: 500, width: 260 },
            { x: 1150, width: 320 }
        ],
        lilyPads: [
            { x: 560, y: 430, width: 50 },
            { x: 670, y: 430, width: 50 }
        ],
        movingPlatforms: [{ x: 1190, y: 430, width: 60, range: 150, period: 260, style: "lily" }],
        platforms: [
            { x: 250, y: 345, width: 110 },
            { x: 860, y: 340, width: 110 },
            { x: 1000, y: 265, width: 110 },
            { x: 1600, y: 340, width: 110 },
            { x: 1750, y: 265, width: 110 }
        ],
        sprouts: [
            { x: 150, y: 428 },
            { x: 305, y: 345 },
            { x: 585, y: 430 },
            { x: 915, y: 340 },
            { x: 1055, y: 265 },
            { x: 1805, y: 265 }
        ],
        mounds: [400, 900, 1550],
        keyPos: { x: 1805, y: 235 }
    },
    {
        name: "Windy Hills",
        flowersNeeded: 6,
        pet: "Kiwi the Bluebird",
        species: "bird",
        bg: "#CFE8FF",
        width: 2200,
        weather: "wind",
        wind: { strength: -1.6, calm: 200, gust: 150 },
        treeX: 1250,
        trees: [350, 1900],
        tip: "Whoosh! Lean into the wind 🍃",
        platforms: [
            { x: 250, y: 345, width: 110 },
            { x: 420, y: 270, width: 110 },
            { x: 800, y: 340, width: 110 },
            { x: 960, y: 265, width: 110 },
            { x: 1110, y: 190, width: 110 },
            { x: 1550, y: 340, width: 110 },
            { x: 1720, y: 265, width: 120 }
        ],
        mushrooms: [{ x: 1300, y: 428 }],
        bushes: [
            { x: 600, width: 50, height: 32 },
            { x: 1400, width: 60, height: 34 }
        ],
        bees: [{ x: 1000, y: 400, range: 180, period: 260 }],
        sprouts: [
            { x: 150, y: 428 },
            { x: 475, y: 270 },
            { x: 855, y: 340 },
            { x: 1165, y: 190 },
            { x: 1605, y: 340 },
            { x: 1780, y: 265, waterNeeded: 2 }
        ],
        mounds: [700, 1050, 1500, 1900],
        keyPos: { x: 1165, y: 160 }
    },
    {
        name: "Rainy Meadow",
        flowersNeeded: 7,
        pet: "Squiggle the Snail",
        species: "snail",
        bg: "#B8C6D1",
        width: 2200,
        weather: "rain",
        rainClouds: [
            { x: 280, range: 450, period: 900 },
            { x: 1180, range: 600, period: 1000 }
        ],
        treeX: 1100,
        trees: [520, 1850],
        tip: "Rain clouds help your flowers grow! 🌧️",
        platforms: [
            { x: 230, y: 345, width: 110 },
            { x: 450, y: 270, width: 110 },
            { x: 760, y: 340, width: 110 },
            { x: 1000, y: 340, width: 110 },
            { x: 1150, y: 265, width: 110 },
            { x: 1500, y: 345, width: 110 },
            { x: 1700, y: 270, width: 120 }
        ],
        bushes: [{ x: 880, width: 50, height: 32 }],
        bees: [
            { x: 600, y: 400, range: 150, period: 240 },
            { x: 1300, y: 330, range: 150, period: 260 }
        ],
        sprouts: [
            { x: 140, y: 428 },
            { x: 285, y: 345 },
            { x: 505, y: 270, waterNeeded: 2 },
            { x: 650, y: 428 },
            { x: 1055, y: 340 },
            { x: 1205, y: 265 },
            { x: 1760, y: 270, waterNeeded: 3 }
        ],
        mounds: [380, 1300, 1650, 1900],
        keyPos: { x: 1760, y: 240 }
    },
    {
        name: "Snowy Peaks",
        flowersNeeded: 6,
        pet: "Bruno the Bear",
        species: "bear",
        bg: "#DCEBF5",
        width: 2200,
        weather: "snow",
        ice: [
            { x: 400, width: 250 },
            { x: 1100, width: 300 },
            { x: 1700, width: 200 }
        ],
        treeX: 1250,
        trees: [600, 1820],
        tip: "Brrr! Ice is slippery ⛸️",
        platforms: [
            { x: 220, y: 345, width: 110 },
            { x: 700, y: 340, width: 110 },
            { x: 860, y: 265, width: 110 },
            { x: 1450, y: 345, width: 110 },
            { x: 1600, y: 270, width: 110 },
            { x: 1950, y: 340, width: 100 }
        ],
        movingPlatforms: [{ x: 1150, y: 280, width: 90, range: 180, period: 280 }],
        bushes: [{ x: 1000, width: 50, height: 32 }],
        sprouts: [
            { x: 150, y: 428 },
            { x: 275, y: 345 },
            { x: 520, y: 428 },
            { x: 915, y: 265 },
            { x: 1505, y: 345 },
            { x: 1655, y: 270, waterNeeded: 2 }
        ],
        mounds: [330, 760, 1550, 1960],
        keyPos: { x: 1655, y: 240 }
    },
    {
        name: "Starry Night",
        flowersNeeded: 7,
        pet: "Olive the Owl",
        species: "owl",
        bg: "#1B2A4A",
        width: 2400,
        weather: "night",
        treeX: 1100,
        trees: [450, 1700],
        tip: "It's dark! Fireflies light the way ✨",
        platforms: [
            { x: 230, y: 345, width: 110 },
            { x: 420, y: 270, width: 110 },
            { x: 780, y: 170, width: 110 },
            { x: 1000, y: 340, width: 110 },
            { x: 1250, y: 345, width: 110 },
            { x: 1750, y: 180, width: 110 },
            { x: 2050, y: 340, width: 110 }
        ],
        movingPlatforms: [{ x: 1400, y: 260, width: 90, range: 220, period: 300 }],
        mushrooms: [{ x: 820, y: 428 }],
        bushes: [
            { x: 600, width: 50, height: 32 },
            { x: 1150, width: 60, height: 34 },
            { x: 1900, width: 50, height: 32 }
        ],
        water: [{ x: 1560, width: 110 }],
        sprouts: [
            { x: 140, y: 428 },
            { x: 275, y: 345 },
            { x: 475, y: 270 },
            { x: 835, y: 170, waterNeeded: 2 },
            { x: 1055, y: 340 },
            { x: 1805, y: 180, waterNeeded: 3 },
            { x: 2105, y: 340 }
        ],
        mounds: [520, 1050, 1350, 1800],
        keyPos: { x: 1805, y: 150 }
    }
];
