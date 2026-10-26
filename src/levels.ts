import type { LevelConfig } from './types.ts';

/** Simulation rate: every physics/timer value below is tuned per 1/60 s tick. */
export const TICK_MS: number = 1000 / 60;
export const GROUND_Y: number = 428;
export const DOGHOUSE_X: number = 707;
/** Flora's left edge must pass this x (with the key) to enter the doghouse. */
export const DOGHOUSE_ENTRY_X: number = 685;
export const LEVEL_CLEAR_FRAMES: number = 75;
/** Ticks the victory rainbow takes to sweep across the sky. */
export const RAINBOW_SWEEP_FRAMES: number = 40;
export const DIG_RANGE: number = 48;
export const GRAVITY: number = 0.45;
export const JUMP_VY: number = -10.2;
/** Releasing jump early caps upward speed here, giving a short hop. */
export const JUMP_CUT_VY: number = -4;
/** Grace ticks to still jump after walking off a ledge. */
export const COYOTE_TICKS: number = 6;
/** Grace ticks a jump pressed just before landing is remembered. */
export const JUMP_BUFFER_TICKS: number = 6;
/** Highest jump in px (jump held): v^2 / 2g. */
export const MAX_JUMP_HEIGHT: number = (JUMP_VY * JUMP_VY) / (2 * GRAVITY);

/** KeyboardEvent.code for each action. Touch buttons press these same codes. */
export const CONTROLS = {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    jump: 'Space',
    water: 'ArrowUp',
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
    ["G4", "B4", "D5", "F#5", "E5", "D5", "B4", "A4"]
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
        platforms: [
            { x: 160, y: 350, width: 110 },
            { x: 320, y: 275, width: 120 },
            { x: 500, y: 345, width: 115 }
        ],
        sprouts: [
            { x: 120, y: 428 },
            { x: 215, y: 350 },
            { x: 380, y: 275 },
            { x: 555, y: 345 }
        ],
        mounds: [230, 350, 610],
        keyPos: { x: 380, y: 245 }
    },
    {
        name: "Rainbow Hills",
        flowersNeeded: 4,
        pet: "Peanut the Hamster",
        species: "hamster",
        bg: "#FDB9C8",
        treeX: 450,
        platforms: [
            { x: 180, y: 345, width: 110 },
            { x: 340, y: 345, width: 110 },
            { x: 500, y: 270, width: 120 }
        ],
        sprouts: [
            { x: 235, y: 345 },
            { x: 310, y: 428 },
            { x: 395, y: 345 },
            { x: 560, y: 270 }
        ],
        mounds: [160, 450, 590],
        keyPos: { x: 560, y: 240 }
    },
    {
        name: "Enchanted Garden",
        flowersNeeded: 5,
        pet: "Shelly the Turtle",
        species: "turtle",
        bg: "#A29BFE",
        treeX: 300,
        platforms: [
            { x: 140, y: 350, width: 105 },
            { x: 280, y: 275, width: 110 },
            { x: 430, y: 345, width: 110 },
            { x: 560, y: 265, width: 105 }
        ],
        sprouts: [
            { x: 115, y: 428 },
            { x: 192, y: 350 },
            { x: 335, y: 275 },
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
        platforms: [
            { x: 150, y: 350, width: 110 },
            { x: 300, y: 275, width: 115 },
            { x: 460, y: 205, width: 120 },
            { x: 530, y: 345, width: 110 }
        ],
        sprouts: [
            { x: 130, y: 428 },
            { x: 205, y: 350 },
            { x: 357, y: 275 },
            { x: 520, y: 205 },
            { x: 585, y: 345 }
        ],
        mounds: [240, 390, 500],
        keyPos: { x: 520, y: 175 }
    }
];
