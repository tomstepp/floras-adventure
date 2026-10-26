// Auto-generated from TypeScript sources in src/ via scripts/build.mjs
"use strict";

// --- src/types.ts ---
/** Each level's sky and weather. 'clear' is the default sunny day. */
                                                                   
                                         
                                                                                                            
                                                        

                        
              
              
 

                           
              
              
                  
 

/** A platform that glides from `x` to `x + range` and back, once every `period` ticks. */
                                                  
                  
                   
                                                                       
                             
 

/** A stretch of the ground, from `x` to `x + width` (used for ponds and ice). */
                             
              
                  
 

/** Wind blows in gusts: calm for `calm` ticks, then a gust of `gust` ticks pushing at `strength` px/tick. */
                             
                                                                     
                     
                 
                 
 

/** A rain cloud drifting from `x` to `x + range` and back; it waters sprouts below it. */
                                  
              
                  
                   
 

/** Everything Flora's physics needs to know about the level this tick. */
                               
                                   
                                
                            
                                 
                               
                                                             
                  
                  
                                                                       
                 
 

/** Flora's movement, as changed by the pet powers of whoever is following her. */
                        
                      
                   
                     
                                            
                         
                                                        
                           
                                            
                       
                                                         
                  
 

/** The third star's challenge, kept simple for young players. */
                                                                             

/** A hidden star somewhere in the level, with a kid-friendly hint for finding it. */
                                           
                 
 

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
/** Ticks the level-clear celebration lasts: long enough to read what each star was for. */
const LEVEL_CLEAR_FRAMES         = 150;
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

/** Pond water surface; lily pads float just above it. Falling below the surface is a splash. */
const WATER_SURFACE_Y         = 436;
const LILY_Y         = 430;
/** Rain clouds float at this height and water a column this wide below them. */
const RAIN_CLOUD_Y         = 150;
const RAIN_WIDTH         = 70;
/** A sprout under the rain gets one splash this often. */
const RAIN_SPLASH_TICKS         = 90;
/** On ice Flora speeds up and slows down gradually: this fraction of the change per tick. */
const ICE_GRIP         = 0.05;

/** Bee hitbox radius. Touching a bee bumps Flora back; she can't be bumped again for a moment. */
const BEE_RADIUS         = 10;
const BUMP_STUN_TICKS         = 24;
const BUMP_SAFE_TICKS         = 90;

/** Holding water keeps splashing for this long (2 splashes), then Flora has to let go and press again. */
const WATER_HOLD_TICKS         = 36;

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
    ["C5", "E5", "G5", "C6", "B5", "G5", "E5", "D5"],
    ["F4", "A4", "C5", "A4", "G4", "F4", "D4", "C4"],
    ["G4", "D5", "B4", "G4", "A4", "E5", "C5", "A4"],
    ["E4", "G4", "B4", "G4", "F#4", "A4", "C5", "B4"],
    ["C5", "G4", "E4", "G4", "B4", "D5", "G5", "E5"],
    ["A4", "E4", "C4", "E4", "G4", "B4", "E5", "C5"]
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
        keyPos: { x: 530, y: 315 },
        star: { x: 270, y: 230, hint: "Jump high from the left ledge" },
        challenge: "flowersFirst"
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
        keyPos: { x: 610, y: 120 },
        star: { x: 380, y: 170, hint: "Jump up from the middle ledge" },
        challenge: "firstDig"
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
        keyPos: { x: 590, y: 185 },
        star: { x: 215, y: 240, hint: "Look above the first ledge" },
        challenge: "flowersFirst"
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
        keyPos: { x: 612, y: 235 },
        star: { x: 192, y: 250, hint: "Jump high from the first ledge" },
        challenge: "firstDig"
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
        keyPos: { x: 520, y: 175 },
        star: { x: 60, y: 330, hint: "Jump right at the very start!" },
        challenge: "flowersFirst"
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
        keyPos: { x: 1010, y: 235 },
        star: { x: 480, y: 160, hint: "Jump up from the high ledge near the start" },
        challenge: "noBumps"
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
        keyPos: { x: 1460, y: 225 },
        star: { x: 755, y: 150, hint: "High above the ledge in the middle" },
        challenge: "noBumps"
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
        keyPos: { x: 1155, y: 160 },
        star: { x: 295, y: 100, hint: "Bounce on the first mushroom, then jump!" },
        challenge: "noBumps"
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
        keyPos: { x: 1660, y: 235 },
        star: { x: 935, y: 150, hint: "Jump up from the ledge above the bees" },
        challenge: "noBumps"
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
        keyPos: { x: 1805, y: 150 },
        star: { x: 835, y: 100, hint: "Bounce on the mushroom to the high ledge" },
        challenge: "noBumps"
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
        keyPos: { x: 1805, y: 235 },
        star: { x: 695, y: 360, hint: "Jump up from a lily pad" },
        challenge: "noSplash"
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
        keyPos: { x: 1165, y: 160 },
        star: { x: 475, y: 170, hint: "Above the ledge near the start (mind the wind!)" },
        challenge: "firstDig"
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
        keyPos: { x: 1760, y: 240 },
        star: { x: 1205, y: 160, hint: "High above the middle ledge" },
        challenge: "noBumps"
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
        keyPos: { x: 1655, y: 240 },
        star: { x: 525, y: 340, hint: "Jump while you slide on the first ice" },
        challenge: "flowersFirst"
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
        keyPos: { x: 1805, y: 150 },
        star: { x: 475, y: 170, hint: "Up high near the start (fireflies help!)" },
        challenge: "noSplash"
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

                           
                                                                                  
                         
                                                                                                
                     
                                                                  
                      
                                                                                           
                         
                                                                                       
                    
 

const EMPTY_SAVE           = { level: null, unlocked: 0, roster: [], followers: [], stars: [] };

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
        if (!raw) return { ...EMPTY_SAVE, roster: [], followers: [], stars: [] };
        const data = JSON.parse(raw)     
                                                                                                        
         ;
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
        // Saves from before stars: every beaten level at least earned its rescue star.
        const savedStars            = Array.isArray(data.stars) ? data.stars : [];
        const stars = levelSpecies.map((species, i) => {
            const bits = savedStars[i];
            const clean = typeof bits === 'number' && Number.isInteger(bits) && bits >= 0 && bits <= 7 ? bits : 0;
            return clean | (roster.includes(species) ? 1 : 0);
        });
        return { level, unlocked, roster, followers, stars };
    } catch {
        return { ...EMPTY_SAVE, roster: [], followers: [], stars: [] };
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

/** Keeps the best stars ever earned on a level; returns the stars that are new this time. */
function recordStars(data          , level        , bits        )         {
    const before = data.stars[level] ?? 0;
    while (data.stars.length <= level) data.stars.push(0);
    data.stars[level] = before | bits;
    return bits & ~before;
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

// --- src/weather.ts ---
/*
 * Weather visuals, drawn in screen space like the sun and butterflies: rain, snow, leaves on
 * the wind, and the night (stars, a moon, fireflies and darkness with soft lights). Purely
 * visual — the gameplay side of weather (wind push, rain watering) lives in game.ts.
 */

                
              
              
               
               
                 
                  
 

/** A soft light cut out of the night's darkness, in screen coordinates. */
                        
              
              
              
 

const STAR_COUNT = 40;
const FIREFLY_COUNT = 10;

class WeatherEffects {
           kind          = 'clear';
           drops         = [];
            stars                                                          = [];
            ticks         = 0;
            random              ;
            darkness                           = null;

    constructor(random               = Math.random) {
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

           setKind(kind         )       {
        if (kind === this.kind && this.drops.length > 0) return;
        this.kind = kind;
        this.drops = [];
        const count = kind === 'rain' ? 80 : kind === 'snow' ? 70 : kind === 'night' ? FIREFLY_COUNT : 0;
        for (let i = 0; i < count; i++) this.drops.push(this.newDrop(true));
    }

    /** Butterflies and kites stay home in the rain, snow and dark. */
           get calmSky()          {
        return this.kind === 'clear' || this.kind === 'wind';
    }

            newDrop(anywhere         )       {
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
           update(windX        , gustSoon         )       {
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
           drawSky(ctx                          , skyColor        )          {
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
           drawFront(ctx                          )       {
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
           drawFireflies(ctx                          )       {
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
           fireflyLights()          {
        return this.kind === 'night' ? this.drops.map(d => ({ x: d.x, y: d.y, r: 38 })) : [];
    }

    /**
     * At night, covers the scene in soft darkness with glowing holes at each light. Uses a
     * second canvas so the lights can be cut out with soft edges.
     */
           drawDarkness(ctx                          , lights                  , pixelScale        )       {
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
function drawMoon(ctx                          , x        , y        , ticks        , skyColor        )       {
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

const drawFrog            = (ctx, step, now) => {
    const skin = "#7BC86C", dark = "#5DAA4F", belly = "#D9F2C4";
    // Folded back legs and little front feet
    ellipse(ctx, -6, -4, 6, 4.5, dark, -0.3);
    ellipse(ctx, 7, -4, 6, 4.5, dark, 0.3);
    ellipse(ctx, -9 - step, -0.8, 3.5, 1.5, dark);
    ellipse(ctx, 10 + step, -0.8, 3.5, 1.5, dark);
    // Squat round body; a breathing throat
    const breathe = 1 + Math.sin(now * 0.008) * 0.06;
    ellipse(ctx, 1, -9, 12, 8, skin);
    ellipse(ctx, 4, -6.5, 7 * breathe, 4 * breathe, belly);
    // Big eyes on top of the head
    circle(ctx, 1, -17, 4.2, skin);
    circle(ctx, 9, -17, 4.2, skin);
    circle(ctx, 1.8, -17.5, 2.2, "#FFFFFF");
    circle(ctx, 9.8, -17.5, 2.2, "#FFFFFF");
    circle(ctx, 2.4, -17.3, 1.3, "#2D3436");
    circle(ctx, 10.4, -17.3, 1.3, "#2D3436");
    circle(ctx, 2.8, -17.9, 0.45, "#FFFFFF");
    circle(ctx, 10.8, -17.9, 0.45, "#FFFFFF");
    // Wide smile and blush
    ctx.strokeStyle = "#2D3436";
    ctx.lineWidth = 0.9;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(8, -11.5, 3.2, 0.3, Math.PI - 0.6);
    ctx.stroke();
    ellipse(ctx, 12, -11, 1.8, 1.1, "rgba(255, 118, 117, 0.55)");
};

const drawBird            = (ctx, step, now) => {
    const feathers = "#74B9FF", dark = "#4A90D9", belly = "#FFF3E0", beak = "#FDCB6E";
    // Thin orange legs
    ctx.strokeStyle = "#E67E22";
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-1, -5); ctx.lineTo(-1 + step, -0.5);
    ctx.moveTo(3, -5); ctx.lineTo(3 - step, -0.5);
    ctx.stroke();
    // Tail feathers
    triangle(ctx, [[-8, -11], [-16, -15], [-15, -8]], dark);
    // Round body with a cream belly, and a wing that flutters
    ellipse(ctx, 0, -12, 9, 7.5, feathers);
    ellipse(ctx, 3, -9.5, 5.5, 4.5, belly);
    ctx.save();
    ctx.translate(-2, -13);
    ctx.rotate(-0.3 + Math.sin(now * 0.02) * 0.25);
    ellipse(ctx, -2, 0, 6, 3.5, dark);
    ctx.restore();
    // Head with a little tuft
    circle(ctx, 7, -20, 6, feathers);
    ellipse(ctx, 5, -26.5, 1.4, 2.8, dark, -0.4);
    triangle(ctx, [[12, -21], [16.5, -19.5], [12, -18]], beak);
    face(ctx, 6.5, -20.5, { smile: false });
};

const drawSnail            = (ctx, _step, now) => {
    const body = "#F7D9A8", shell = "#E17055", shellLight = "#FAB1A0";
    // Soft body gliding along, slightly stretching
    const stretch = 1 + Math.sin(now * 0.004) * 0.05;
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.ellipse(1, -3.5, 14 * stretch, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Head rising at the front, with two eye-stalks
    ellipse(ctx, 11, -9, 4.5, 6, body, 0.2);
    ctx.strokeStyle = body;
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(10, -14); ctx.lineTo(9, -20);
    ctx.moveTo(13, -14); ctx.lineTo(14.5, -19.5);
    ctx.stroke();
    circle(ctx, 9, -20.5, 1.6, body);
    circle(ctx, 14.5, -20, 1.6, body);
    circle(ctx, 9.3, -20.7, 0.8, "#2D3436");
    circle(ctx, 14.8, -20.2, 0.8, "#2D3436");
    ellipse(ctx, 13, -7.5, 1.6, 1, "rgba(255, 118, 117, 0.55)");
    ctx.strokeStyle = "#2D3436";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(12.5, -10, 1.3, 0.3, Math.PI - 0.3);
    ctx.stroke();
    // Big swirly shell
    circle(ctx, -2, -12, 9.5, shell);
    circle(ctx, -3, -13, 6, shellLight);
    circle(ctx, -2.5, -12.5, 3, shell);
    circle(ctx, -2.2, -12.3, 1.2, shellLight);
};

const drawBear            = (ctx, step) => {
    const fur = "#A47148", dark = "#7D5233", light = "#E3C4A3";
    legs(ctx, fur, dark, step, 7);
    ellipse(ctx, 0, -10, 12, 8, fur);
    ellipse(ctx, 3, -7.5, 6, 3.5, light);
    circle(ctx, -11, -11, 2.5, fur);
    // Round ears with light insides
    circle(ctx, 4, -24, 3.2, fur);
    circle(ctx, 14, -24, 3.2, fur);
    circle(ctx, 4, -24, 1.6, light);
    circle(ctx, 14, -24, 1.6, light);
    circle(ctx, 9, -18, 8, fur);
    ellipse(ctx, 13, -15.5, 4, 3, light);
    ellipse(ctx, 15.5, -16.5, 1.5, 1.1, "#3B2A1E");
    face(ctx, 9, -19.5, { smile: false });
    ctx.strokeStyle = "#3B2A1E";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(14.4, -14.5, 1.2, 0.3, Math.PI - 0.3);
    ctx.stroke();
};

const drawOwl            = (ctx, _step, now) => {
    const feathers = "#A1887F", dark = "#7E6A62", belly = "#F3E5D8", disc = "#FFF8F0";
    // Little orange talons
    ellipse(ctx, -3, -1, 2.6, 1.4, "#F39C12");
    ellipse(ctx, 4, -1, 2.6, 1.4, "#F39C12");
    // Round body, speckled belly, wings at the sides
    ellipse(ctx, 0, -12, 10, 11, feathers);
    ellipse(ctx, 0.5, -9, 6.5, 7, belly);
    for (const [bx, by] of [[-2, -10], [2, -11], [0, -7], [3, -6.5], [-3, -6]]         ) {
        ellipse(ctx, bx, by, 1, 0.7, dark);
    }
    ellipse(ctx, -9, -12, 3, 7, dark, 0.15);
    ellipse(ctx, 9.5, -12, 3, 7, dark, -0.15);
    // Ear tufts
    triangle(ctx, [[-7, -20], [-8, -27], [-3, -21.5]], dark);
    triangle(ctx, [[7, -20], [8, -27], [3, -21.5]], dark);
    // Big round eye discs facing forward, blinking slowly
    circle(ctx, -3.5, -17, 4.2, disc);
    circle(ctx, 4, -17, 4.2, disc);
    const blink = now % 4000 < 160;
    if (blink) {
        ctx.strokeStyle = "#2D3436";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(-3.5, -17, 2, 0.2, Math.PI - 0.2);
        ctx.moveTo(6, -17);
        ctx.arc(4, -17, 2, 0.2, Math.PI - 0.2);
        ctx.stroke();
    } else {
        circle(ctx, -3, -17, 2.2, "#2D3436");
        circle(ctx, 4.5, -17, 2.2, "#2D3436");
        circle(ctx, -2.3, -17.8, 0.8, "#FFFFFF");
        circle(ctx, 5.2, -17.8, 0.8, "#FFFFFF");
    }
    triangle(ctx, [[-0.5, -14.5], [1.5, -14.5], [0.5, -11.5]], "#F39C12");
    ellipse(ctx, -6.5, -13, 1.6, 1, "rgba(255, 118, 117, 0.55)");
    ellipse(ctx, 7.5, -13, 1.6, 1, "rgba(255, 118, 117, 0.55)");
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
    unicorn: drawUnicorn,
    frog: drawFrog,
    bird: drawBird,
    snail: drawSnail,
    bear: drawBear,
    owl: drawOwl
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

// --- src/powers.ts ---
/*
 * Pet powers: every rescued pet gives Flora a small, gentle bonus while it follows her.
 * Powers only ever help, and no level needs one, so any team of followers (or none) can win.
 * Names and descriptions are short and plain, for young players.
 */

const PET_POWERS                                      = {
    kitty: { name: "Quick paws", description: "Walk a little faster." },
    puppy: { name: "Super sniffer", description: "Noodle smells the bone from far away." },
    hamster: { name: "Big splash", description: "Water flowers from farther away." },
    turtle: { name: "Steady feet", description: "No slipping on ice." },
    bunny: { name: "Bunny hop", description: "Jump a little higher." },
    duckling: { name: "Feather float", description: "Fall slowly and land softly." },
    piglet: { name: "Bush buddy", description: "Walk right through bramble bushes." },
    fox: { name: "Clever eyes", description: "A sparkle shows where the bone is." },
    panda: { name: "Mushroom fan", description: "Mushrooms bounce you even higher." },
    unicorn: { name: "Rainbow magic", description: "Big flowers need one less splash." },
    frog: { name: "Pond paddler", description: "Swim across ponds instead of splashing in." },
    bird: { name: "Wind rider", description: "The wind hardly pushes you." },
    snail: { name: "Rain friend", description: "Rain clouds water flowers twice as fast." },
    bear: { name: "Honey friend", description: "Bees are friendly and won't bump you." },
    owl: { name: "Night eyes", description: "See much farther in the dark." }
};

/** How much each power changes things. Kept gentle: helpful, never game-breaking. */
const POWER_TUNING = {
    walkSpeed: 3.5,
    quickWalkSpeed: 4.2,
    hopJumpVy: -11.3,
    fanBounceVy: -18.5,
    waterRange: 48,
    bigWaterRange: 72,
    sniffRange: 95,
    superSniffRange: 190,
    windFactor: 0.25,
    rainFriendFactor: 0.5,
    nightLight: 165,
    nightEyesLight: 270
}         ;

/** Flora's movement for a team of followers. */
function movesFor(followers                    )        {
    const has = (s         )          => followers.includes(s);
    return {
        walkSpeed: has('kitty') ? POWER_TUNING.quickWalkSpeed : POWER_TUNING.walkSpeed,
        jumpVy: has('bunny') ? POWER_TUNING.hopJumpVy : JUMP_VY,
        bounceVy: has('panda') ? POWER_TUNING.fanBounceVy : BOUNCE_VY,
        featherFall: has('duckling'),
        throughBushes: has('piglet'),
        noIceSlip: has('turtle'),
        swim: has('frog')
    };
}

/** What each challenge asks, in words a young player can follow. */
const CHALLENGE_TEXT                                      = {
    flowersFirst: "Water every flower before you dig up the bone",
    firstDig: "Find the bone on your very first dig (watch Noodle!)",
    noBumps: "Don't let a bee bump you",
    noSplash: "Don't fall in the water"
};

/** A two- or three-word name for each challenge, shown under its star. */
const CHALLENGE_LABEL                                      = {
    flowersFirst: "Flowers first",
    firstDig: "First dig",
    noBumps: "No bee bumps",
    noSplash: "Stay dry"
};

/** What Noodle says the moment a challenge is missed: kind, and clear that the level goes on. */
const CHALLENGE_MISSED                                      = {
    flowersFirst: "Oops, the bone came up before the flowers! No challenge star this time, but keep going! 💛",
    firstDig: "Not that one! No challenge star this time, but keep sniffing! 💛",
    noBumps: "Ouch! Jump over the bees 🐝 No challenge star this time, but keep going! 💛",
    noSplash: "Splash! You fell in. No challenge star this time, but keep going! 💛"
};

/** Stars a level can give, as bits: rescue the pet, find the hidden star, do the challenge. */
const STAR_RESCUE = 1;
const STAR_HIDDEN = 2;
const STAR_CHALLENGE = 4;
const STARS_PER_LEVEL = 3;

const starCount = (bits        )         =>
    (bits & STAR_RESCUE ? 1 : 0) + (bits & STAR_HIDDEN ? 1 : 0) + (bits & STAR_CHALLENGE ? 1 : 0);

/** "★★☆" for a level's stars. */
const starString = (bits        )         =>
    [STAR_RESCUE, STAR_HIDDEN, STAR_CHALLENGE].map(b => (bits & b ? '★' : '☆')).join('');

// --- src/render/shapes.ts ---
/** Small shared shapes: hearts and twinkles. */

function drawHeart(ctx                          , x        , y        , size        )       {
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.35);
    ctx.bezierCurveTo(x - size, y - size * 0.4, x - size * 0.4, y - size, x, y - size * 0.35);
    ctx.bezierCurveTo(x + size * 0.4, y - size, x + size, y - size * 0.4, x, y + size * 0.35);
    ctx.fill();
}

/** A four-point twinkle, like the sparkles in Flora's eyes. */
function drawTwinkle(ctx                          , x        , y        , size        )       {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.quadraticCurveTo(x, y, x + size, y);
    ctx.quadraticCurveTo(x, y, x, y + size);
    ctx.quadraticCurveTo(x, y, x - size, y);
    ctx.quadraticCurveTo(x, y, x, y - size);
    ctx.fill();
}

// --- src/render/sky.ts ---
/** Things in the sky that stay put on screen: the sun and the victory rainbow. */

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

// --- src/render/scenery.ts ---
/** The level itself: trees, ground, ponds, ice, platforms, clouds, mushrooms, bushes, the doghouse. */



const WATER_COLOR         = "#5DADE2";

function drawTreeAndGround(
    ctx                          ,
    worldWidth        ,
    trees                   ,
    digMounds                     ,
    boneFound         ,
    boneX        ,
    snowy          = false
)       {
    for (const treeX of trees) drawTree(ctx, treeX, snowy);

    // Ground: green grass, or soft snow
    ctx.fillStyle = snowy ? "#F5F9FC" : "#00B894";
    ctx.fillRect(0, 428, worldWidth, 72);
    if (snowy) {
        ctx.fillStyle = "#DDEAF3";
        ctx.fillRect(0, 446, worldWidth, 54);
    }

    // Dirt Mounds & Hidden Bone
    for (const m of digMounds) {
        if (!m.dug) drawMound(ctx, m.x);
        else if (!m.hasBone) drawDugHole(ctx, m.x);
    }

    if (boneFound) {
        // The dug-up hole, with the bone resting on a little pile of dirt beside it
        ctx.fillStyle = "#6D4C41";
        ctx.beginPath();
        ctx.ellipse(boneX, 429, 11, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#8D6E63";
        ctx.beginPath();
        ctx.ellipse(boneX + 3, 427, 9, 3.5, 0, Math.PI, 0);
        ctx.fill();
        drawBone(ctx, boneX, 420);
    }
}

/** Puffy round canopy on a soft tapered trunk, swaying gently, dotted with blossoms. */
function drawTree(ctx                          , treeX        , snowy          = false)       {
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

    if (snowy) {
        // Fluffy snow resting on top of the canopy instead of blossoms
        ctx.fillStyle = "#FFFFFF";
        for (const [sx, sy, r] of [[-24, 298, 11], [-8, 276, 13], [10, 270, 12], [26, 292, 10], [0, 262, 9]]         ) {
            ctx.beginPath();
            ctx.ellipse(sx, sy, r, r * 0.6, 0, Math.PI, 0);
            ctx.fill();
        }
        ctx.restore();
        return;
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

/** Ponds cut into the ground, with soft banks and gentle ripples. */
function drawWater(ctx                          , water                       )       {
    const now = Date.now();
    for (const w of water) {
        ctx.fillStyle = "#3C8DBC";
        ctx.fillRect(w.x, GROUND_Y, w.width, 72);
        ctx.fillStyle = WATER_COLOR;
        ctx.fillRect(w.x, WATER_SURFACE_Y, w.width, 64);
        // Rounded muddy banks at each edge
        ctx.fillStyle = "#8D6E63";
        for (const bx of [w.x, w.x + w.width]) {
            ctx.beginPath();
            ctx.ellipse(bx, GROUND_Y + 4, 6, 9, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        // Little ripples
        ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        for (let rx = w.x + 18; rx < w.x + w.width - 14; rx += 34) {
            const shift = Math.sin(now * 0.002 + rx) * 4;
            ctx.beginPath();
            ctx.moveTo(rx + shift, WATER_SURFACE_Y + 8);
            ctx.lineTo(rx + shift + 10, WATER_SURFACE_Y + 8);
            ctx.stroke();
        }
    }
}

/** Slippery ice patches: a pale blue sheen on the ground with a few sparkly streaks. */
function drawIce(ctx                          , ice                       )       {
    for (const i of ice) {
        ctx.fillStyle = "#BDE3F7";
        ctx.beginPath();
        ctx.roundRect(i.x, GROUND_Y - 1, i.width, 9, 4);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        for (let sx = i.x + 12; sx < i.x + i.width - 10; sx += 40) {
            ctx.beginPath();
            ctx.moveTo(sx, GROUND_Y + 5);
            ctx.lineTo(sx + 12, GROUND_Y + 1);
            ctx.stroke();
        }
    }
}

/** Round lily pads with a notch, some with a tiny pink flower; they bob very slightly. */
function drawLilyPads(ctx                          , pads                     )       {
    const now = Date.now();
    pads.forEach((p, i) => {
        const cx = p.x + p.width / 2;
        const bob = Math.sin(now * 0.003 + p.x) * 0.8;
        ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
        ctx.beginPath();
        ctx.ellipse(cx, p.y + 6, p.width / 2, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#4CAF50";
        ctx.beginPath();
        ctx.ellipse(cx, p.y + 3 + bob, p.width / 2 + 2, 6, 0, 0.35, Math.PI * 2 - 0.05);
        ctx.lineTo(cx, p.y + 3 + bob);
        ctx.fill();
        ctx.fillStyle = "#66BB6A";
        ctx.beginPath();
        ctx.ellipse(cx - 4, p.y + 1.5 + bob, p.width / 4, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();
        if (i % 2 === 0) {
            ctx.fillStyle = "#FFB8D0";
            for (let k = 0; k < 5; k++) {
                const a = (k / 5) * Math.PI * 2;
                ctx.beginPath();
                ctx.arc(cx - p.width / 4 + Math.cos(a) * 2.4, p.y + bob + Math.sin(a) * 1.6, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });
}

/** Puffy grey rain clouds with sleepy faces, raining a soft column down to the ground. */
function drawRainClouds(ctx                          , cloudXs                   )       {
    const now = Date.now();
    for (const cx of cloudXs) {
        // A soft blue column shows exactly where this cloud is watering.
        const grad = ctx.createLinearGradient(0, RAIN_CLOUD_Y, 0, GROUND_Y);
        grad.addColorStop(0, "rgba(116, 185, 255, 0.28)");
        grad.addColorStop(1, "rgba(116, 185, 255, 0.08)");
        ctx.fillStyle = grad;
        ctx.fillRect(cx - RAIN_WIDTH / 2, RAIN_CLOUD_Y, RAIN_WIDTH, GROUND_Y - RAIN_CLOUD_Y);
        ctx.strokeStyle = "rgba(9, 132, 227, 0.75)";
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        for (let i = 0; i < 22; i++) {
            const dx = ((i * 37) % RAIN_WIDTH) - RAIN_WIDTH / 2;
            const dy = (now * 0.4 + i * 53) % (GROUND_Y - RAIN_CLOUD_Y - 10);
            ctx.moveTo(cx + dx, RAIN_CLOUD_Y + 12 + dy);
            ctx.lineTo(cx + dx - 1.5, RAIN_CLOUD_Y + 22 + dy);
        }
        ctx.stroke();
        ctx.fillStyle = "#B2BEC3";
        for (const [px, py, r] of [[-24, 4, 16], [0, -6, 22], [24, 4, 16], [10, 10, 14], [-10, 10, 14]]         ) {
            ctx.beginPath();
            ctx.arc(cx + px, RAIN_CLOUD_Y + py, r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
        ctx.beginPath();
        ctx.arc(cx - 8, RAIN_CLOUD_Y - 12, 8, 0, Math.PI * 2);
        ctx.fill();
        // Sleepy closed eyes and a small smile
        ctx.strokeStyle = "#636E72";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(cx - 6, RAIN_CLOUD_Y + 1, 2.2, 0.2, Math.PI - 0.2);
        ctx.moveTo(cx + 8.2, RAIN_CLOUD_Y + 1.5);
        ctx.arc(cx + 6, RAIN_CLOUD_Y + 1, 2.2, 0.2, Math.PI - 0.2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, RAIN_CLOUD_Y + 6, 2.5, 0.3, Math.PI - 0.3);
        ctx.stroke();
    }
}

/** A swimmer's ripple: a band of water hiding the legs, with a little ring on top. */
function drawSwimRipple(ctx                          , x        , halfWidth        )       {
    ctx.fillStyle = WATER_COLOR;
    ctx.fillRect(x - halfWidth, WATER_SURFACE_Y - 2, halfWidth * 2, 12);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(x, WATER_SURFACE_Y - 1, halfWidth, 2.5, 0, 0, Math.PI * 2);
    ctx.stroke();
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

/** A soft, rounded dirt mound with a lighter top, a few pebbles and a tiny sprig. */
function drawMound(ctx                          , x        )       {
    ctx.save();
    // Darker base, then the lighter rounded top, so it looks plump
    ctx.fillStyle = "#7B5E52";
    ctx.beginPath();
    ctx.ellipse(x, 429, 17, 13, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "#A1887F";
    ctx.beginPath();
    ctx.ellipse(x - 1, 427, 14, 10.5, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
    ctx.beginPath();
    ctx.ellipse(x - 5, 420, 5, 2.5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Pebbles
    ctx.fillStyle = "#6D4C41";
    for (const [px, py, r] of [[-7, 425, 1.6], [4, 422, 1.3], [8, 426, 1.8]]         ) {
        ctx.beginPath();
        ctx.arc(x + px, py, r, 0, Math.PI * 2);
        ctx.fill();
    }
    // A tiny sprig on top
    ctx.strokeStyle = "#3FA866";
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x + 2, 417.5);
    ctx.lineTo(x + 3, 413);
    ctx.stroke();
    ctx.fillStyle = "#55C57A";
    ctx.beginPath();
    ctx.ellipse(x + 5, 413, 2.4, 1.3, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

/** An empty dug hole: a dark oval with a little pile of loose dirt beside it. */
function drawDugHole(ctx                          , x        )       {
    ctx.save();
    ctx.fillStyle = "#5D4037";
    ctx.beginPath();
    ctx.ellipse(x, 429, 11, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#A1887F";
    ctx.beginPath();
    ctx.ellipse(x + 13, 427, 6, 3.5, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = "#6D4C41";
    ctx.beginPath();
    ctx.arc(x + 12, 425.5, 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// --- src/render/items.ts ---
/** Things Flora looks after or finds: sprouts and flowers, the key and the bone. */

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
function drawKey(ctx                          , keyX        , keyY        )       {
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
function drawBone(ctx                          , x        , y        )       {
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
    for (const [fill, dy] of [[shade, 1.2], [cream, 0]]         ) {
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.roundRect(-9, -2.8 + dy, 18, 5.6, 2.8);
        ctx.fill();
        for (const [kx, ky] of [[-10.5, -2.4], [-10.5, 2.4], [10.5, -2.4], [10.5, 2.4]]         ) {
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
function starPath(ctx                          , x        , y        , outer        , inner        )       {
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
function drawHiddenStar(ctx                          , x        , y        )       {
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

// --- src/render/creatures.ts ---
/** Rescued pets (with their emoji for menus) and bumblebees. */




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
function drawRescuedPet(
    ctx                          ,
    species         ,
    x        ,
    y        ,
    facingLeft          = false,
    vx         = 0,
    swimming          = false
)       {
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

// --- src/render/hud.ts ---
/** Overlays drawn on top of the scene: edge arrows, the star tracker, the star-goals card and the celebration banner. */

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

/**
 * The celebration banner, with the level's stars popping in underneath one by one.
 * Each star has a short label, so it's clear what it was for (and what a missed one needed).
 */
function drawCelebrationBanner(
    ctx                          , petName        , stars             , labels                   , age        
)       {
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
    ctx.beginPath();
    ctx.roundRect(200, 112, 400, 118, 20);
    ctx.fill();
    ctx.strokeStyle = "#FFB6C1";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#FF6B8B";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`🎉 Rescued ${petName}! 🎉`, 400, 146);
    stars.forEach((st, i) => {
        // Each star pops in a moment after the last, with a little bounce.
        const t = Math.max(0, Math.min(1, (age - 8 - i * 10) / 12));
        if (t <= 0) return;
        const pop = t < 1 ? 1 + Math.sin(t * Math.PI) * 0.3 : 1;
        const x = 400 + (i - 1) * 120;
        drawStarIcon(ctx, x, 178, 13 * pop * t, st);
        ctx.globalAlpha = t;
        ctx.fillStyle = st === 'earned' ? "#2D3436" : "#95A5A6";
        ctx.font = "bold 13px sans-serif";
        ctx.fillText(labels[i] ?? '', x, 212);
        ctx.globalAlpha = 1;
    });
    ctx.restore();
}

/** One line of the star-goals card: how that star stands, and what it asks. */
                           
                     
                 
 

/**
 * The star-goals card shown as a level starts: what each of the three stars asks for.
 * `alpha` fades it out. Stars already earned on an earlier visit show gold.
 */
function drawStarGoals(ctx                          , goals                     , alpha        )       {
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
    ctx.beginPath();
    ctx.roundRect(140, 92, 520, 128, 18);
    ctx.fill();
    ctx.strokeStyle = "#FDCB6E";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#E17055";
    ctx.font = "bold 17px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Get all 3 stars!", 400, 114);
    ctx.textAlign = "left";
    ctx.font = "14px sans-serif";
    goals.forEach((goal, i) => {
        const y = 144 + i * 26;
        drawStarIcon(ctx, 166, y, 9, goal.state);
        ctx.fillStyle = "#2D3436";
        ctx.fillText(goal.text, 184, y + 1);
    });
    ctx.restore();
}

/** How one of a level's three stars is going: earned, still possible, or missed this time. */
                                                     

/** A small star for the HUD and banner: gold when earned, outlined while possible, pale when missed. */
function drawStarIcon(ctx                          , x        , y        , r        , st           )       {
    ctx.save();
    ctx.lineJoin = 'round';
    starPath(ctx, x, y, r, r * 0.5);
    if (st === 'earned') {
        ctx.fillStyle = "#FDCB6E";
        ctx.fill();
        ctx.strokeStyle = "#E1A33B";
        ctx.lineWidth = 1.6;
        ctx.stroke();
    } else {
        ctx.fillStyle = st === 'open' ? "rgba(255, 255, 255, 0.85)" : "rgba(223, 230, 233, 0.6)";
        ctx.fill();
        ctx.strokeStyle = st === 'open' ? "#F7B731" : "#B2BEC3";
        ctx.lineWidth = 1.6;
        ctx.setLineDash(st === 'missed' ? [2, 2] : []);
        ctx.stroke();
    }
    ctx.restore();
}

/** The three stars for this level, in a soft pill under the level name. */
function drawStarRow(ctx                          , stars                      )       {
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.roundRect(16, 54, 82, 24, 12);
    ctx.fill();
    stars.forEach((st, i) => drawStarIcon(ctx, 32 + i * 25, 66, 8, st));
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
    /** Set when she drops into a pond; the game splashes her back onto the bank. */
           fellInWater          = false;
    /** Paddling across a pond (frog power). */
           swimming          = false;

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
        this.fellInWater = false;
    }

    /** Whether her middle is over one of these ground spans. */
           over(spans                       )          {
        const cx = this.x + this.width / 2;
        return spans.some(s => cx >= s.x && cx <= s.x + s.width);
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
        world              ,
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
            this.applyPhysics(world, playSound);
            return;
        }

        let targetVx = 0;
        if (keys[CONTROLS.right]) {
            targetVx = world.moves.walkSpeed;
            this.facing = 'right';
        } else if (keys[CONTROLS.left]) {
            targetVx = -world.moves.walkSpeed;
            this.facing = 'left';
        }
        // On ice she speeds up and slows down gradually, so she slides.
        const onIce = this.grounded && this.y + this.height >= GROUND_Y - 1 && this.over(world.ice) && !world.moves.noIceSlip;
        this.vx = onIce ? this.vx + (targetVx - this.vx) * ICE_GRIP : targetVx;

        // Jumps fire on a press (latched even if released within the same tick), not while held,
        // so the buffer can remember a press made just before landing.
        if (pressed[CONTROLS.jump]) this.jumpBufferTimer = JUMP_BUFFER_TICKS;

        if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
            this.vy = world.moves.jumpVy;
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

        // One dig per press: holding the key down doesn't keep digging.
        if (pressed[CONTROLS.dig]) {
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

        this.applyPhysics(world, playSound);
    }

            applyPhysics(world              , playSound                           )       {
        const { platforms, mushrooms } = world;
        // Bush buddy (piglet): bramble bushes don't get in the way at all.
        const bushes = world.moves.throughBushes ? [] : world.bushes;
        const prevX = this.x;
        const prevBottom = this.y + this.height;
        this.swimming = false;
        if (world.moves.featherFall && this.vy > 0) {
            // Feather float (duckling): gentle gravity and a slow top speed on the way down.
            this.vy = Math.min(this.vy + GRAVITY * 0.45, 3.2);
        } else {
            this.vy += GRAVITY;
        }
        // Wind pushes her whether she's walking, jumping or knocked back.
        this.x += this.vx + world.windX;

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
                    this.vy = world.moves.bounceVy;
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

        // Ground collision (y = 428), except over a pond, where she drops in
        if (this.over(world.water)) {
            const floatAt = WATER_SURFACE_Y + 4;
            if (world.moves.swim && !this.grounded && this.y + this.height >= floatAt) {
                // Pond paddler (frog): float on the water and paddle along.
                this.y = floatAt - this.height;
                this.vy = 0;
                this.grounded = true;
                this.swimming = true;
            } else if (!this.grounded && this.y + this.height > WATER_SURFACE_Y + 12) {
                this.fellInWater = true;
            }
        } else if (this.y >= 380) {
            this.y = 380;
            this.vy = 0;
            this.grounded = true;
        }

        if (this.x < 0) this.x = 0;
        if (this.x > world.width - this.width) this.x = world.width - this.width;

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
        if (this.swimming) drawSwimRipple(ctx, this.x + this.width / 2, 19);
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
    /** Set by the game while he's paddling across a pond. */
           swimming          = false;
    /** Lines waiting their turn in the speech bubble, with how long each shows. */
            speechQueue                     = [];

    /** Says `text` for `ticks` right away; whatever he was saying waits its turn after. */
           sayFirst(text        , ticks        )       {
        if (this.barkTimer > 0) this.speechQueue.unshift([this.speechBubble, this.barkTimer]);
        this.speechBubble = text;
        this.barkTimer = ticks;
    }

    /** Says `text` once he's finished what he's saying now (or right away if he's quiet). */
           sayLater(text        , ticks        )       {
        if (this.barkTimer > 0) this.speechQueue.push([text, ticks]);
        else {
            this.speechBubble = text;
            this.barkTimer = ticks;
        }
    }

    /** Forgets lines starting with `prefix`, whether he's saying one now or it's waiting its turn. */
           forget(prefix        )       {
        this.speechQueue = this.speechQueue.filter(([text]) => !text.startsWith(prefix));
        if (this.barkTimer > 0 && this.speechBubble.startsWith(prefix)) this.barkTimer = 0;
    }

    /** Stops talking and forgets anything waiting to be said. */
           clearSpeech()       {
        this.speechQueue = [];
        this.barkTimer = 0;
    }

           update(
        playerX        ,
        digMounds                     ,
        boneFound         ,
        gamePaused         ,
        playSound                           ,
        /** How close Flora must be for him to smell the bone; Super sniffer (puppy) doubles it. */
        sniffRange         = 95
    )       {
        if (gamePaused) return;
        const prevX = this.x;

        const boneMound = digMounds.find(m => m.hasBone);
        if (!boneFound && boneMound && Math.abs((playerX + 16) - boneMound.x) < sniffRange) {
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

            if (Math.random() < 0.006 && this.barkTimer <= 0 && this.speechQueue.length === 0) {
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
        // Paddling across a pond he sits lower, legs hidden by the water.
        ctx.translate(this.x + 12, this.y + 22 + (this.swimming ? 14 : 0));
        if (this.facing === 'left') ctx.scale(-1, 1);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Soft shadow
        if (!this.swimming) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.beginPath();
            ctx.ellipse(0, 0, 14, 2.5, 0, 0, Math.PI * 2);
            ctx.fill();
        }

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
        if (this.swimming) drawSwimRipple(ctx, this.x + 12, 17);
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

// --- src/game/dom.ts ---
/** The page elements the game talks to, looked up once at startup. */

const byId =                                      (id        )    => document.getElementById(id)     ;

const dom = {
    stage: byId('game-stage'),
    container: byId('game-container'),
    canvas: byId                   ('gameCanvas'),
    // HUD
    levelDisplay: byId('level-display'),
    statusDisplay: byId('status-display'),
    objectiveDisplay: byId('objective-display'),
    musicBtn: byId                   ('music-btn'),
    restartBtn: byId                   ('restart-btn'),
    pauseBtn: byId                   ('pause-btn'),
    devBadge: byId('dev-badge'),
    // Start screen
    startScreen: byId('start-screen'),
    playBtn: byId                   ('play-btn'),
    continueBtn: byId                   ('continue-btn'),
    startConfirm: byId('start-confirm'),
    levelsBtn: byId                   ('levels-btn'),
    starTotal: byId('star-total'),
    petsBtn: byId                   ('pets-btn'),
    // Pause menu
    pauseScreen: byId('pause-screen'),
    resumeBtn: byId                   ('resume-btn'),
    pauseRestartBtn: byId                   ('pause-restart-btn'),
    pauseSkipBtn: byId                   ('pause-skip-btn'),
    pauseLevelsBtn: byId                   ('pause-levels-btn'),
    pausePetsBtn: byId                   ('pause-pets-btn'),
    pauseMenuBtn: byId                   ('pause-menu-btn'),
    pauseStars: byId('pause-stars'),
    pauseBest: byId('pause-best'),
    pauseTeam: byId('pause-team'),
    // Level list
    levelSelect: byId('level-select'),
    levelGrid: byId('level-grid'),
    levelsBackBtn: byId                   ('levels-back-btn'),
    // My pets
    rosterScreen: byId('roster-screen'),
    rosterGrid: byId('roster-grid'),
    rosterCount: byId('roster-count'),
    rosterHint: byId('roster-hint'),
    rosterBackBtn: byId                   ('roster-back-btn'),
    // Victory
    victoryDialog: byId                   ('victory-dialog'),
    victoryText: byId('victory-text'),
    rescuedList: byId('rescued-list')
};

/** The game canvas's drawing context; every frame is drawn through it. */
const ctx = dom.canvas.getContext('2d')                            ;

// --- src/game/state.ts ---
/**
 * Everything the game remembers while it runs, in one place. Modules read and change
 * `state.x` rather than keeping their own copies, so any module can be composed with any other.
 * The long-lived objects (Flora, Noodle, audio, particles, weather…) live here too.
 */








/** Where a sub-menu (level list, My pets) was opened from, so Back returns there. */
                                            
/** A moving platform where it is this tick. */
                                                                        
/** A bee where it is this tick, and which way it's flying. */
                                                     

/** How the current level's stars are going. */
                             
                                              
                   
                  
                     
                                                                     
                      
                                                                                    
                         
                                                                                     
                        
                                                                               
                   
 

const freshLevelStars = ()             => ({
    found: false, bumps: 0, splashes: 0, wrongDigs: 0, dugTooEarly: false, missedTold: false, earned: 0
});

                            
                                                                                      
                       
                   
                             
                         
                                                                       
                            
                                                                                       
                       
                                                                                           
                    
                                                       
                          
                                                                                        
                      
                   
                                         
                      
                          
                                    
                       
                  
                          
                 
                 
                                                                          
                       
                                                                                       
                 
                           
 

const audio = new AudioController();
const particleSystem = new ParticleSystem();
const butterflies = new ButterflySwarm();
const skyVisitors = new SkyVisitors();
const weather = new WeatherEffects();
const storage = getStorage();
const flora = new Player();
const noodle = new Noodle();

/** True when the page URL asks for dev mode (`?dev` or `&dev`, with or without a value). */
function isDevUrl(search        )          {
    return /[?&]dev(=[^&]*)?(&|$)/.test(search);
}

const state            = {
    progress: loadSave(storage, LEVELS.map(l => l.species)),
    screen: 'start',
    menuReturnTo: 'start',
    currentLevel: 0,
    levelClearTimer: 0,
    levelTicks: 0,
    cameraX: 0,
    rainCloudXs: [],
    lastSafeX: 50,
    bees: [],
    movingPlatforms: [],
    sprouts: [],
    digMounds: [],
    rescuedFriends: [],
    boneFound: false,
    boneX: 400,
    keyCollected: false,
    keyX: 530,
    keyY: 315,
    pixelScale: 1,
    dev: isDevUrl(window.location?.search ?? ''),
    levelStars: freshLevelStars()
};

/** Whether a pet is following Flora right now, so its power is on. */
const hasPower = (species         )          => state.progress.followers.includes(species);

/** The level being played. */
const currentLevelConfig = ()              => LEVELS[state.currentLevel];

/** Saves progress, except in dev mode, which never touches the real save. */
function persist()       {
    if (!state.dev) writeSave(storage, state.progress);
}

// --- src/game/input.ts ---
/** Keyboard and on-screen touch buttons, turned into held and just-pressed keys. */



/** Keys held down right now, by KeyboardEvent.code. */
const keys                          = {};
/** Keys that went down since the last tick, so a tap shorter than one tick still counts. */
const pressed                          = {};

const GAME_KEYS                    = Object.values(CONTROLS);

function pressKey(code        )       {
    if (!keys[code]) pressed[code] = true;
    keys[code] = true;
}

function clearKeys()       {
    for (const code of Object.keys(keys)) keys[code] = false;
}

/** Drops held and just-pressed keys, so menu key presses never leak into play. */
function dropInput()       {
    clearKeys();
    for (const code of Object.keys(pressed)) pressed[code] = false;
}

/** Listens to the keyboard, window focus and the touch buttons. Called once at startup. */
function setupInput()       {
    window.addEventListener('keydown', (e               ) => {
        if (GAME_KEYS.includes(e.code) && state.screen === 'playing') {
            e.preventDefault();
        }
        if (e.code === 'Escape' && !e.repeat) {
            if (state.screen === 'playing') pauseGame();
            else if (state.screen === 'paused') resumeGame();
            else if (state.screen === 'levels') closeLevelSelect();
            else if (state.screen === 'roster') closeRoster();
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
        if (state.screen === 'playing') pauseGame();
    });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && state.screen === 'playing') pauseGame();
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
}

// --- src/game/world.ts ---
/** Things that move around the level each tick: moving platforms, bees, wind, rain clouds, ponds, the camera and the pet parade. */





/** Gap between pets in the parade; the drawn pets are about 30px wide. */
const PARADE_GAP = 32;

const petName = (species         )         => LEVELS.find(l => l.species === species)?.pet ?? species;

/**
 * Makes the parade match the followers: pets already walking keep their spot, new ones
 * join at the back, and ones that went to rest leave.
 */
function syncParade()       {
    const kept = state.rescuedFriends.filter(p => state.progress.followers.includes(p.species));
    for (const species of state.progress.followers) {
        if (kept.some(p => p.species === species)) continue;
        const behind = kept.length === 0 ? noodle.x : kept[kept.length - 1].x;
        kept.push({ species, x: behind - PARADE_GAP, y: 416 });
    }
    // Keep the parade in follow order (longest-following nearest Noodle).
    kept.sort((a, b) => state.progress.followers.indexOf(a.species) - state.progress.followers.indexOf(b.species));
    state.rescuedFriends = kept;
}

/** The camera keeps Flora a little behind centre, looking ahead the way she faces. */
function cameraTarget()         {
    const maxX = levelWidth(LEVELS[state.currentLevel]) - CANVAS_WIDTH;
    const lookAhead = flora.facing === 'right' ? 60 : -60;
    const target = flora.x + flora.width / 2 - CANVAS_WIDTH / 2 + lookAhead;
    return Math.min(Math.max(0, target), maxX);
}

function updateCamera()       {
    state.cameraX += (cameraTarget() - state.cameraX) * 0.1;
}

/** Positions of the level's moving platforms at tick `t`: an eased glide out and back. */
function movingPlatformsAt(t        )                                              {
    return (LEVELS[state.currentLevel].movingPlatforms ?? []).map(p => ({
        x: p.x + (p.range * (1 - Math.cos((2 * Math.PI * t) / p.period))) / 2,
        y: p.y,
        width: p.width,
        style: p.style
    }));
}

function updateMovingPlatforms()       {
    state.levelTicks++;
    const next = movingPlatformsAt(state.levelTicks);
    // Carry Flora along with a platform she is standing on.
    state.movingPlatforms.forEach((p, i) => {
        const standing =
            flora.grounded &&
            Math.abs(flora.y + flora.height - p.y) < 0.5 &&
            flora.x + flora.width > p.x + 6 &&
            flora.x < p.x + p.width - 6;
        if (standing) flora.x += next[i].x - p.x;
    });
    state.movingPlatforms = next;
}

/** Bees glide out and back like clouds, bobbing up and down as they buzz. */
function beesAt(t        )                                      {
    return (LEVELS[state.currentLevel].bees ?? []).map((b, i) => {
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
    state.bees = beesAt(state.levelTicks);
    for (const bee of state.bees) {
        // Circle-vs-box: nearest point on Flora's box to the bee
        const nx = Math.min(Math.max(bee.x, flora.x), flora.x + flora.width);
        const ny = Math.min(Math.max(bee.y, flora.y), flora.y + flora.height);
        if ((bee.x - nx) ** 2 + (bee.y - ny) ** 2 > BEE_RADIUS ** 2) continue;
        // Honey friend (bear): bees are friendly and buzz right past.
        if (hasPower('bear')) continue;
        if (flora.bump(bee.x)) {
            state.levelStars.bumps++;
            audio.playSound('bump');
            particleSystem.spawn(bee.x, bee.y, '#FDCB6E', 8, 'star');
            // The first bump on a no-bumps level gets the missed-challenge message, which says this too.
            if (currentLevelConfig().challenge === 'noBumps' && !state.levelStars.missedTold) continue;
            noodle.barkTimer = 70;
            noodle.speechBubble = "Ouch! Jump over the bees 🐝";
        }
    }
}

/**
 * The wind's push this tick: calm, then a gust that eases in and out. `soon` is true in the
 * second before a gust, when warning leaves start to blow.
 */
function currentWind()                               {
    const wind = LEVELS[state.currentLevel].wind;
    if (!wind) return { x: 0, soon: false };
    const t = state.levelTicks % (wind.calm + wind.gust);
    if (t < wind.calm) return { x: 0, soon: t > wind.calm - 60 };
    const into = t - wind.calm;
    const ease = Math.min(1, into / 25, (wind.gust - into) / 25);
    return { x: wind.strength * ease, soon: false };
}

/** Rain clouds drift like the moving clouds, without being solid. */
function rainCloudsAt(t        )           {
    return (LEVELS[state.currentLevel].rainClouds ?? []).map(
        c => c.x + (c.range * (1 - Math.cos((2 * Math.PI * t) / c.period))) / 2
    );
}

/** Sprouts under a rain cloud get a splash every so often, helping Flora along. */
function updateRain()       {
    state.rainCloudXs = rainCloudsAt(state.levelTicks);
    if (state.rainCloudXs.length === 0) return;
    let changed = false;
    for (const s of state.sprouts) {
        if (s.bloomed) continue;
        const underRain = state.rainCloudXs.some(cx => Math.abs(cx - s.x) <= RAIN_WIDTH / 2);
        if (!underRain) continue;
        s.rainTicks = (s.rainTicks ?? 0) + 1;
        // Rain friend (snail): rain waters twice as fast.
        const every = RAIN_SPLASH_TICKS * (hasPower('snail') ? POWER_TUNING.rainFriendFactor : 1);
        if (s.rainTicks >= every) {
            s.rainTicks = 0;
            splashSprout(s);
            changed = true;
        }
    }
    if (changed) updateStatus();
}

/** Ponds: remember the last dry spot, and splash Flora back to it if she drops in. */
function updatePond()       {
    const water = LEVELS[state.currentLevel].water ?? [];
    noodle.swimming = water.some(w => noodle.x + 12 >= w.x && noodle.x + 12 <= w.x + w.width);
    if (water.length === 0) return;
    if (flora.grounded && flora.y + flora.height >= GROUND_Y - 1 && !flora.over(water)) state.lastSafeX = flora.x;
    if (!flora.fellInWater) return;
    state.levelStars.splashes++;
    particleSystem.spawn(flora.x + flora.width / 2, GROUND_Y + 6, '#74B9FF', 16, 'circle');
    audio.playSound('bump');
    flora.reset();
    flora.x = state.lastSafeX;
    flora.safeTimer = 60;
    noodle.sayFirst("Splash! Hop on the lily pads 🪷", 120);
}

const overWater = (x        )          =>
    (LEVELS[state.currentLevel].water ?? []).some(w => x >= w.x && x <= w.x + w.width);

function updateParade()       {
    state.rescuedFriends.forEach((pet, idx) => {
        const leaderX = idx === 0 ? noodle.x : state.rescuedFriends[idx - 1].x;
        const vx = (leaderX - PARADE_GAP - pet.x) * 0.08;
        pet.x += vx;
        pet.vx = vx;
        // Same dead zone as Noodle, so settled pets don't flip back and forth.
        if (vx > 0.3) pet.facingLeft = false;
        else if (vx < -0.3) pet.facingLeft = true;
    });
}

// --- src/game/level.ts ---
/** The level's rules: setting it up, watering, digging, the key, the doghouse, the celebration, and the HUD text. */








function allBloomed()          {
    return state.sprouts.every(s => s.bloomed);
}

function objectiveText()         {
    if (state.levelClearTimer > 0) return `🎉 You rescued ${LEVELS[state.currentLevel].pet}!`;
    if (state.keyCollected) return '🏠 Bring the key to the doghouse!';
    if (!allBloomed()) {
        return state.sprouts.some(s => !s.bloomed && s.waterNeeded > 1)
            ? '💦 Water every sprout — big ones need extra splashes!'
            : '💦 Water every sprout';
    }
    if (!state.boneFound) return "🦴 Follow Noodle's nose and dig for the bone";
    return '🔑 Grab the shiny key!';
}

/** How much of the victory rainbow to draw: 0 while playing, sweeping to 1 once a level is beaten. */
function rainbowProgress()         {
    if (state.screen === 'victory') return 1; // keep the full rainbow behind the victory dialog
    if (state.levelClearTimer <= 0) return 0;
    return Math.min(1, (LEVEL_CLEAR_FRAMES - state.levelClearTimer + 1) / RAINBOW_SWEEP_FRAMES);
}

function updateStatus()       {
    const bloomedCount = state.sprouts.filter(s => s.bloomed).length;
    dom.statusDisplay.innerText = `Flowers: ${bloomedCount}/${LEVELS[state.currentLevel].flowersNeeded} | Bone: ${state.boneFound ? '🦴' : '❌'} | Key: ${state.keyCollected ? '🔑' : '❌'}`;
    dom.objectiveDisplay.innerText = objectiveText();
}

function initLevel()       {
    const level = LEVELS[state.currentLevel];
    state.sprouts = [];
    state.digMounds = [];
    particleSystem.clear();
    state.boneFound = false;
    state.keyCollected = false;
    state.levelClearTimer = 0;
    state.levelTicks = 0;
    state.movingPlatforms = movingPlatformsAt(0);
    state.bees = beesAt(0);
    state.rainCloudXs = rainCloudsAt(0);
    state.lastSafeX = 50;
    weather.setKind(level.weather ?? 'clear');
    state.keyX = level.keyPos.x;
    state.keyY = level.keyPos.y;
    state.levelStars = freshLevelStars();

    level.sprouts.forEach((pos, i) => {
        const big = (pos.waterNeeded ?? 1) > 1;
        state.sprouts.push({
            x: pos.x,
            y: pos.y,
            water: 0,
            waterNeeded: splashesNeeded(pos),
            big,
            bloomed: false,
            color: big ? BIG_FLOWER_COLOR : FLOWER_COLORS[i % FLOWER_COLORS.length],
            danceOffset: Math.random() * Math.PI * 2
        });
    });

    const boneIdx = Math.floor(Math.random() * level.mounds.length);
    level.mounds.forEach((mx, idx) => {
        state.digMounds.push({
            x: mx,
            y: GROUND_Y,
            hasBone: idx === boneIdx,
            dug: false
        });
    });
    state.boneX = level.mounds[boneIdx];

    // Noodle starts with the level's tip, then gives the star hints so nobody has to guess.
    noodle.clearSpeech();
    if (level.tip) noodle.sayLater(level.tip, 240);
    noodle.sayLater(`${HIDDEN_STAR_HINT}${level.star.hint}`, 240);
    noodle.sayLater(`⭐ Star challenge: ${CHALLENGE_TEXT[level.challenge]}`, 240);

    dom.levelDisplay.innerText = `Level ${state.currentLevel + 1}: ${level.name}`;
    updateStatus();
    if (audio.enabled) audio.startBgMusic(state.currentLevel);
}

function restartLevel()       {
    initLevel();
    flora.reset();
    // Line Noodle and the parade up behind Flora, instead of them walking back from
    // wherever the last level ended.
    noodle.x = 20;
    state.rescuedFriends.forEach((pet, i) => {
        pet.x = noodle.x - (i + 1) * PARADE_GAP;
        pet.vx = 0;
        pet.facingLeft = false;
    });
    state.cameraX = cameraTarget();
}

const HIDDEN_STAR_HINT = '⭐ Hidden star: ';

/** Splashes a sprout needs right now: Rainbow magic (unicorn) takes one off big flowers. */
function splashesNeeded(config              )         {
    const base = config.waterNeeded ?? 1;
    return hasPower('unicorn') ? Math.max(1, base - 1) : base;
}

/**
 * Call after the followers change (mid-level, from My pets): powers that change the level
 * itself take effect at once. A big flower that now has enough water blooms straight away.
 */
function refreshPowers()       {
    const level = LEVELS[state.currentLevel];
    state.sprouts.forEach((s, i) => {
        if (s.bloomed) return;
        s.waterNeeded = splashesNeeded(level.sprouts[i]);
        if (s.water >= s.waterNeeded) {
            s.water = s.waterNeeded - 1;
            splashSprout(s);
        }
    });
    updateStatus();
}

/** One splash of water on a sprout, from Flora's can or a rain cloud. */
function splashSprout(s        )       {
    if (s.bloomed) return;
    s.water++;
    if (s.water >= s.waterNeeded) {
        s.bloomed = true;
        audio.playSound('bloom');
        const big = s.big;
        particleSystem.spawn(s.x, s.y - (big ? 36 : 24), s.color, big ? 24 : 14, 'circle');
        particleSystem.spawn(s.x, s.y - (big ? 40 : 28), '#FFEAA7', big ? 12 : 6, 'star');
    } else {
        particleSystem.spawn(s.x, s.y - 20, '#74B9FF', 8, 'circle');
    }
}

function checkWatering()       {
    const canCenterX = flora.facing === 'right' ? flora.x + 30 : flora.x + 2;
    const floraFeetY = flora.y + flora.height;
    // Big splash (hamster) reaches farther.
    const reach = hasPower('hamster') ? POWER_TUNING.bigWaterRange : POWER_TUNING.waterRange;
    for (const s of state.sprouts) {
        if (s.bloomed || Math.abs(canCenterX - s.x) >= reach || Math.abs(floraFeetY - s.y) >= 48) continue;
        splashSprout(s);
    }
    updateStatus();
}

function checkDigging()       {
    if (flora.y + flora.height < GROUND_Y - 5) return;
    const playerCenterX = flora.x + flora.width / 2;
    // Pick the closest undug mound so an already-dug neighbour can't block a nearby one.
    let mound                      ;
    for (const m of state.digMounds) {
        if (m.dug || Math.abs(playerCenterX - m.x) >= DIG_RANGE) continue;
        if (!mound || Math.abs(playerCenterX - m.x) < Math.abs(playerCenterX - mound.x)) mound = m;
    }

    particleSystem.spawn(mound ? mound.x : playerCenterX, GROUND_Y - 4, '#8D6E63', 8, 'circle');
    if (!mound) return;

    mound.dug = true;
    if (mound.hasBone) {
        if (!allBloomed()) state.levelStars.dugTooEarly = true;
        state.boneFound = true;
        state.boneX = mound.x;
        audio.playSound('key');
        particleSystem.spawn(mound.x, GROUND_Y - 10, '#F1C40F', 16, 'star');
        noodle.barkTimer = 75;
        noodle.speechBubble = allBloomed() ? "Woof! Found it! 🦴" : "Bone! Now water the flowers! 🌸";
        updateStatus();
    } else {
        if (!state.boneFound) state.levelStars.wrongDigs++;
        // A missed first-dig challenge gets its own message (updateChallenge), which says this too.
        if (!state.levelStars.missedTold && !challengeMet()) return;
        noodle.barkTimer = 60;
        noodle.speechBubble = "Keep sniffing! 🐾";
    }
}

/** The hidden star: touch it to pick it up, like the key. */
function updateHiddenStar()       {
    if (state.levelStars.found) return;
    const { star } = LEVELS[state.currentLevel];
    const cx = flora.x + flora.width / 2;
    const cy = flora.y + flora.height / 2;
    if (Math.abs(cx - star.x) < 30 && Math.abs(cy - star.y) < 38) {
        state.levelStars.found = true;
        audio.playSound('key');
        particleSystem.spawn(star.x, star.y, '#FDCB6E', 22, 'star');
        // No need for the hint any more.
        noodle.forget(HIDDEN_STAR_HINT);
        noodle.sayFirst("You found the hidden star! ⭐", 120);
    }
}

/** Whether the level's star challenge is still on (or done). */
function challengeMet()          {
    const s = state.levelStars;
    switch (LEVELS[state.currentLevel].challenge) {
        case 'flowersFirst': return !s.dugTooEarly;
        case 'firstDig': return s.wrongDigs === 0;
        case 'noBumps': return s.bumps === 0;
        case 'noSplash': return s.splashes === 0;
    }
}

/** The moment a challenge is missed, Noodle says so once, so the third star is never a mystery. */
function updateChallenge()       {
    if (state.levelStars.missedTold || state.levelClearTimer > 0 || challengeMet()) return;
    state.levelStars.missedTold = true;
    noodle.forget('⭐ Star challenge: ');
    noodle.sayFirst(CHALLENGE_MISSED[LEVELS[state.currentLevel].challenge], 200);
}

/** Stars for finishing now: the rescue, the hidden star if found, the challenge if met. */
function starsForFinish()         {
    return STAR_RESCUE | (state.levelStars.found ? STAR_HIDDEN : 0) | (challengeMet() ? STAR_CHALLENGE : 0);
}

function updateKey()       {
    if (state.keyCollected || !allBloomed() || !state.boneFound) return;
    const floraCenterX = flora.x + flora.width / 2;
    const floraCenterY = flora.y + flora.height / 2;
    if (Math.abs(floraCenterX - state.keyX) < 34 && Math.abs(floraCenterY - state.keyY) < 42) {
        state.keyCollected = true;
        audio.playSound('key');
        particleSystem.spawn(state.keyX, state.keyY, '#F1C40F', 18, 'star');
        updateStatus();
    }
}

function updateDoghouse()       {
    // Flora has to walk in at the door, not fall past it from above.
    const atDoor = flora.grounded && flora.y + flora.height >= GROUND_Y - 1;
    if (flora.x <= doghouseEntryX(LEVELS[state.currentLevel]) || !atDoor || state.levelClearTimer > 0) return;
    const houseX = doghouseX(LEVELS[state.currentLevel]);
    if (state.keyCollected) {
        state.levelClearTimer = LEVEL_CLEAR_FRAMES;
        state.levelStars.earned = starsForFinish();
        audio.playSound('victory');
        particleSystem.spawn(houseX, 395, '#FF7675', 14, 'heart');
        particleSystem.spawn(houseX, 385, '#F1C40F', 20, 'star');
        updateStatus();
    } else {
        // Interrupt any hints: this is what she needs to know right now.
        const locked = "It's locked! Need the key 🔑";
        if (noodle.speechBubble !== locked || noodle.barkTimer <= 0) noodle.sayFirst(locked, 70);
    }
}

function updateLevelClear()       {
    if (state.levelClearTimer <= 0) return;
    if (state.levelClearTimer % 15 === 0) {
        particleSystem.spawn(doghouseX(LEVELS[state.currentLevel]) + (Math.random() - 0.5) * 40, 390, '#FFEAA7', 8, 'star');
    }

    state.levelClearTimer--;
    if (state.levelClearTimer > 0) return;

    // Keep the best stars ever earned on this level.
    recordStars(state.progress, state.currentLevel, state.levelStars.earned || starsForFinish());

    // The rescued pet joins the roster and the parade; a full parade sends its longest follower home.
    const species = LEVELS[state.currentLevel].species;
    const { bumped, isNew } = addRescue(state.progress, species);
    const leaving = state.rescuedFriends.find(p => p.species === bumped);
    if (leaving) particleSystem.spawn(leaving.x, 405, '#FF7675', 8, 'heart');
    syncParade();
    const goodbye = bumped ? `${petName(bumped)} went home to rest 🏡` : null;
    const welcome = isNew ? `${petName(species)} joins you: ${PET_POWERS[species].name}! ${PET_POWERS[species].description}` : null;

    if (state.currentLevel === LEVELS.length - 1) {
        state.screen = 'victory';
        // Nothing left to continue, but every level stays open in the level list.
        state.progress = { ...state.progress, level: null, unlocked: LEVELS.length - 1 };
        persist();
        updateStatus();
        // Cleared so closing with Esc isn't mistaken for a past Play Again.
        dom.victoryDialog.returnValue = '';
        dom.victoryDialog.showModal();
    } else {
        state.currentLevel++;
        saveProgress(state.currentLevel);
        restartLevel();
    }
    // Shown before the new level's tip and star hints, which wait their turn.
    if (goodbye) noodle.sayFirst(goodbye, 150);
    if (welcome) noodle.sayFirst(welcome, 220);
}

/** What Flora should head for next, for the off-screen arrow: key, then doghouse, then any sprout left. */
function nextGoal()                                      {
    if (state.levelClearTimer > 0) return null;
    if (state.keyCollected) return { x: doghouseX(LEVELS[state.currentLevel]), emoji: '🏠' };
    if (allBloomed() && state.boneFound) return { x: state.keyX, emoji: '🔑' };
    const onScreen = (x        )          => x >= state.cameraX && x <= state.cameraX + CANVAS_WIDTH;
    const left = state.sprouts.filter(s => !s.bloomed);
    if (left.length === 0 || left.some(s => onScreen(s.x))) return null;
    const floraX = flora.x + flora.width / 2;
    const nearest = left.reduce((a, b) => (Math.abs(a.x - floraX) <= Math.abs(b.x - floraX) ? a : b));
    return { x: nearest.x, emoji: '🌱' };
}

// --- src/game/menus.ts ---
/** The screens around play: start, pause, level list, My pets, and the victory dialog. */











function saveProgress(level               )       {
    state.progress = { ...state.progress, level, unlocked: Math.max(state.progress.unlocked, level ?? 0) };
    persist();
}

/** Shows exactly one menu overlay (or none), and hides touch controls while any is up. */
function showOverlay(overlay                    )       {
    for (const el of [dom.startScreen, dom.pauseScreen, dom.levelSelect, dom.rosterScreen]) el.hidden = el !== overlay;
    if (overlay) document.body.classList.add('menu-open');
    else document.body.classList.remove('menu-open');
}

/**
 * New game: back to level 1, and every rescued pet goes home so it can be rescued again.
 * Unlocked levels and best stars are kept.
 */
function startNewGame()       {
    // Dev mode keeps every pet available.
    state.progress = state.dev
        ? { ...state.progress, level: null }
        : { ...state.progress, level: null, roster: [], followers: [] };
    state.rescuedFriends = [];
    persist();
    startGame(0);
}

/** Starts play at `level`, with the chosen followers in the parade. */
function startGame(level        )       {
    state.currentLevel = level;
    state.rescuedFriends = state.progress.followers.map((species, i) => ({ species, x: 20 - (i + 1) * PARADE_GAP, y: 416 }));
    // Continue picks up from whichever level you're on; level 1 is just "New game".
    saveProgress(level > 0 ? level : null);
    noodle.x = 20;
    restartLevel();
    dropInput();
    state.screen = 'playing';
    showOverlay(null);
}

/** True after the first tap on New game, while it waits for "tap again to start over". */
let newGameArmed = false;

function showStartScreen()       {
    state.screen = 'start';
    const canContinue = state.progress.level !== null;
    dom.continueBtn.hidden = !canContinue;
    if (state.progress.level !== null) dom.continueBtn.innerText = `▶ Continue — Level ${state.progress.level + 1}`;
    // With progress or rescued pets, Play is a fresh start ("New game"); otherwise it's just Play.
    const hasProgress = canContinue || state.progress.roster.length > 0;
    dom.playBtn.innerText = hasProgress ? '🌱 New game' : '▶ Play';
    newGameArmed = false;
    dom.startConfirm.hidden = true;
    dom.petsBtn.hidden = state.progress.roster.length === 0;
    const total = state.progress.stars.reduce((sum, bits) => sum + starCount(bits), 0);
    dom.starTotal.innerText = `⭐ ${total} / ${LEVELS.length * STARS_PER_LEVEL} stars`;
    showOverlay(dom.startScreen);
    (canContinue ? dom.continueBtn : dom.playBtn).focus();
}

function pauseGame()       {
    if (state.screen !== 'playing') return;
    state.screen = 'paused';
    dropInput();
    fillPauseInfo();
    showOverlay(dom.pauseScreen);
    dom.resumeBtn.focus();
}

function resumeGame()       {
    if (state.screen !== 'paused') return;
    dropInput();
    state.screen = 'playing';
    showOverlay(null);
}

/** The level list: every level up to the furthest one reached can be picked. */
function openLevelSelect(from                    )       {
    state.menuReturnTo = from;
    state.screen = 'levels';
    dom.levelGrid.replaceChildren(
        ...LEVELS.map((level, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'level-card';
            const locked = i > state.progress.unlocked && !state.dev;
            // A level's pet stays a surprise until it's rescued (again, after a New game).
            const rescued = state.progress.roster.includes(level.species);
            btn.disabled = locked;
            if (locked) btn.classList.add('locked');
            if (rescued) btn.classList.add('beaten');
            if (i === state.currentLevel && from === 'paused') btn.classList.add('current');
            // First line (the pet, a ❓ until it's rescued, or a lock) is drawn big by CSS;
            // then "number. name", then the best stars earned.
            const stars = state.progress.stars[i] ?? 0;
            btn.innerText = locked
                ? `🔒\n${i + 1}. ${level.name}`
                : `${rescued ? PET_EMOJI[level.species] : '❓'}\n${i + 1}. ${level.name}\n${starString(stars)}`;
            btn.setAttribute('aria-label', `Level ${i + 1}: ${level.name}${locked ? ' (locked)' : rescued ? ' (rescued)' : ''}`);
            btn.addEventListener('click', () => {
                if (locked) return;
                // Picking a level is a tap, so it can switch music on like Play does.
                audio.setEnabled(true, i, dom.musicBtn);
                startGame(i);
            });
            return btn;
        })
    );
    showOverlay(dom.levelSelect);
    const focusIndex = from === 'paused' ? state.currentLevel : state.progress.unlocked;
    (dom.levelGrid.children[focusIndex]                           )?.focus();
}

function closeLevelSelect()       {
    if (state.screen !== 'levels') return;
    returnFromMenu(dom.pauseLevelsBtn);
}

function returnFromMenu(focusInPause             )       {
    if (state.menuReturnTo === 'paused') {
        state.screen = 'paused';
        showOverlay(dom.pauseScreen);
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
    state.menuReturnTo = from;
    state.screen = 'roster';
    dom.rosterHint.innerText = `Tap a pet to see its power. Up to ${MAX_FOLLOWERS} can follow you!`;
    renderRoster();
    showOverlay(dom.rosterScreen);
    (dom.rosterGrid.children[0]                           )?.focus();
}

function renderRoster()       {
    dom.rosterCount.innerText = `🐾 Following: ${state.progress.followers.length} / ${MAX_FOLLOWERS}`;
    dom.rosterGrid.replaceChildren(
        ...LEVELS.map((level, i) => {
            const species = level.species;
            const rescued = state.progress.roster.includes(species);
            const following = state.progress.followers.includes(species);
            const cardState = !rescued ? 'locked' : following ? 'following' : 'resting';
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `roster-card ${cardState}`;
            btn.dataset.state = cardState;
            btn.dataset.species = species;
            // Not `disabled`: browsers send no clicks to disabled buttons, and tapping a pet
            // not rescued yet should still say where to find it.
            btn.setAttribute('aria-disabled', String(!rescued));
            const pic = document.createElement('canvas');
            drawRosterPet(pic, species, rescued);
            const power = PET_POWERS[species];
            const label = document.createElement('span');
            label.innerText = rescued
                ? `${level.pet}\n\n⚡ ${power.name}`
                : `???\n\nRescue in level ${i + 1}`;
            // Tapping or pointing at a card says what its power does, in plain words.
            const describe = ()       => {
                dom.rosterHint.innerText = rescued
                    ? `${PET_EMOJI[species]} ${power.name}: ${power.description}`
                    : `Rescue this pet in level ${i + 1} to find out its power!`;
            };
            btn.addEventListener('mouseenter', describe);
            btn.addEventListener('focus', describe);
            btn.append(pic, label);
            btn.setAttribute('aria-label', rescued ? `${level.pet}, ${following ? 'following' : 'resting'}` : `Not rescued yet, level ${i + 1}`);
            btn.setAttribute('aria-pressed', String(following));
            btn.addEventListener('click', () => {
                if (!rescued) {
                    describe();
                    return;
                }
                if (!toggleFollower(state.progress, species)) {
                    dom.rosterHint.innerText = `Only ${MAX_FOLLOWERS} pets can follow at once — tap one to let it rest first.`;
                    return;
                }
                persist();
                syncParade();
                // Powers that change the level (like Rainbow magic) take effect right away.
                refreshPowers();
                renderRoster();
                (dom.rosterGrid.children[i]                           )?.focus();
                const now = state.progress.followers.includes(species);
                dom.rosterHint.innerText = now
                    ? `${PET_EMOJI[species]} ${level.pet} is following: ${power.name}! ${power.description}`
                    : `💤 ${level.pet} is resting.`;
            });
            return btn;
        })
    );
}

function closeRoster()       {
    if (state.screen !== 'roster') return;
    returnFromMenu(dom.pausePetsBtn);
}

/** The victory dialog lists every pet, so it grows with the level list. */
function fillVictoryDialog()       {
    dom.victoryText.innerText =
        `Flora and Noodle bloomed every garden and rescued all ${LEVELS.length} magical pets! ` +
        'Play again to send them home and rescue them all over again.';
    dom.rescuedList.replaceChildren(
        ...LEVELS.map(l => {
            const li = document.createElement('li');
            li.innerText = `${PET_EMOJI[l.species]} ${l.pet}`;
            return li;
        })
    );
}

/** Wires up every menu and HUD button. Called once at startup. */
function setupMenus()       {
    dom.musicBtn.addEventListener('click', () => {
        audio.toggle(state.currentLevel, dom.musicBtn);
    });
    dom.restartBtn.addEventListener('click', () => {
        // Blur so a later Space press waters instead of clicking Restart again.
        dom.restartBtn.blur();
        if (state.screen === 'playing' && state.levelClearTimer === 0) restartLevel();
    });

    // The Play tap is the user gesture browsers require before audio can start, so music comes on here.
    dom.playBtn.addEventListener('click', () => {
        // Starting over sends every rescued pet home, so a first tap asks to be sure.
        // (Dev mode saves nothing and keeps every pet, so there's nothing to lose there.)
        if (state.progress.roster.length > 0 && !newGameArmed && !state.dev) {
            newGameArmed = true;
            dom.playBtn.innerText = '🌱 Yes, start over';
            dom.startConfirm.innerText =
                'Starting over sends all your rescued pets home, so you can rescue them again. ' +
                'Your stars and levels stay. Tap again to start over!';
            dom.startConfirm.hidden = false;
            return;
        }
        audio.setEnabled(true, 0, dom.musicBtn);
        startNewGame();
    });
    dom.continueBtn.addEventListener('click', () => {
        const level = state.progress.level ?? 0;
        audio.setEnabled(true, level, dom.musicBtn);
        startGame(level);
    });
    dom.levelsBtn.addEventListener('click', () => openLevelSelect('start'));

    dom.pauseBtn.addEventListener('click', () => {
        dom.pauseBtn.blur();
        pauseGame();
    });
    dom.resumeBtn.addEventListener('click', resumeGame);
    dom.pauseRestartBtn.addEventListener('click', () => {
        restartLevel();
        resumeGame();
    });
    dom.pauseLevelsBtn.addEventListener('click', () => openLevelSelect('paused'));
    dom.pauseMenuBtn.addEventListener('click', () => showStartScreen());
    dom.levelsBackBtn.addEventListener('click', closeLevelSelect);
    dom.petsBtn.addEventListener('click', () => openRoster('start'));
    dom.pausePetsBtn.addEventListener('click', () => openRoster('paused'));
    dom.rosterBackBtn.addEventListener('click', closeRoster);

    dom.victoryDialog.addEventListener('close', () => {
        // Only the Play Again button starts over (sending the pets home, like New game).
        // Closing any other way (Esc, a click outside) goes to the start screen, pets and all.
        if (dom.victoryDialog.returnValue === 'play-again') startNewGame();
        else showStartScreen();
    });
}

/**
 * Dev mode (open the game with `?dev` in the URL): every level and pet is available, a
 * Skip level button sits in the pause menu, and nothing is saved, so real progress is safe.
 */
function setupDevMode()       {
    if (!state.dev) return;
    state.progress = {
        ...state.progress,
        unlocked: LEVELS.length - 1,
        roster: LEVELS.map(l => l.species)
    };
    dom.devBadge.hidden = false;
    dom.pauseSkipBtn.hidden = false;
    dom.pauseSkipBtn.addEventListener('click', skipLevel);
}

/** Dev only: finish the current level at once, as if the celebration had just ended. */
function skipLevel()       {
    if (!state.dev || (state.screen !== 'paused' && state.screen !== 'playing')) return;
    resumeGame();
    // One tick left of the celebration: the next tick rescues the pet and moves on.
    state.levelClearTimer = 1;
}

/** The pause menu's side panel: this level's three star goals, and what your team can do. */
function fillPauseInfo()       {
    const level = LEVELS[state.currentLevel];
    const [rescue, hidden, challenge] = starStates();
    const mark = (st        )         => (st === 'earned' ? '✅' : st === 'missed' ? '❌' : '⬜');
    const goals = [
        `${mark(rescue)} Rescue ${level.pet}`,
        `${mark(hidden)} Find the hidden star: ${level.star.hint}`,
        `${mark(challenge)} ${CHALLENGE_TEXT[level.challenge]}${challenge === 'missed' ? ' (try again next time!)' : ''}`
    ];
    dom.pauseStars.replaceChildren(...goals.map(text => {
        const li = document.createElement('li');
        li.innerText = text;
        return li;
    }));
    const best = state.progress.stars[state.currentLevel] ?? 0;
    dom.pauseBest.innerText = best ? `Your best here: ${starString(best)}` : '';

    const team = state.progress.followers.map(species => {
        const power = PET_POWERS[species];
        const li = document.createElement('li');
        li.innerText = `${PET_EMOJI[species]} ${power.name}: ${power.description}`;
        return li;
    });
    if (team.length === 0) {
        const li = document.createElement('li');
        li.innerText = "No pets following yet. Rescued pets give you powers!";
        team.push(li);
    }
    dom.pauseTeam.replaceChildren(...team);
}

// --- src/game/scene.ts ---
/** Draws one frame: the sky, the scrolling level, weather and night, then overlays on top. */













function render()       {
    const level = LEVELS[state.currentLevel];
    ctx.setTransform(state.pixelScale, 0, 0, state.pixelScale, 0, 0);
    ctx.fillStyle = level.bg;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Sky things stay put on screen; everything else is drawn in level space and scrolls.
    const rainbow = rainbowProgress();
    if (rainbow > 0) drawRainbow(ctx, rainbow);
    if (weather.drawSky(ctx, level.bg)) drawSun(ctx);
    if (weather.calmSky) {
        skyVisitors.draw(ctx);
        butterflies.draw(ctx);
    }

    const houseX = doghouseX(level);
    ctx.save();
    ctx.translate(-state.cameraX, 0);
    drawTreeAndGround(
        ctx, levelWidth(level), [level.treeX, ...(level.trees ?? [])], state.digMounds, state.boneFound, state.boneX, level.weather === 'snow'
    );
    drawWater(ctx, level.water ?? []);
    drawIce(ctx, level.ice ?? []);
    drawRainClouds(ctx, state.rainCloudXs);
    drawPlatforms(ctx, level.platforms);
    drawLilyPads(ctx, [...(level.lilyPads ?? []), ...state.movingPlatforms.filter(p => p.style === 'lily')]);
    drawCloudPlatforms(ctx, state.movingPlatforms.filter(p => p.style !== 'lily'));
    drawMushrooms(ctx, level.mushrooms ?? []);
    drawBushes(ctx, level.bushes ?? []);
    drawSprouts(ctx, state.sprouts, allBloomed());
    drawDoghouse(ctx, houseX);

    if (state.keyCollected) {
        // Waiting in the doorway, looking out toward Flora.
        drawRescuedPet(ctx, level.species, houseX, 416, true, 0);
    } else if (allBloomed() && state.boneFound) {
        drawKey(ctx, state.keyX, state.keyY);
    }
    if (!state.levelStars.found) drawHiddenStar(ctx, level.star.x, level.star.y);
    // Clever eyes (fox): a sparkle twinkles over the mound hiding the bone.
    if (hasPower('fox') && !state.boneFound) {
        const size = 3 + Math.abs(Math.sin(Date.now() * 0.006)) * 3;
        ctx.fillStyle = "#FFF3B0";
        drawTwinkle(ctx, state.boneX, 404, size);
        drawTwinkle(ctx, state.boneX + 9, 396, size * 0.6);
    }

    for (const pet of state.rescuedFriends) {
        drawRescuedPet(ctx, pet.species, pet.x, 416, pet.facingLeft ?? false, pet.vx ?? 0, overWater(pet.x));
    }
    flora.draw(ctx);
    noodle.draw(ctx);
    for (const bee of state.bees) drawBee(ctx, bee.x, bee.y, bee.facingLeft);
    particleSystem.draw(ctx);
    ctx.restore();

    // Weather in front of the scene, then the night's darkness with its soft lights.
    weather.drawFront(ctx);
    if (weather.kind === 'night') {
        const lights          = [
            // Night eyes (owl): a much bigger light around Flora.
            {
                x: flora.x + flora.width / 2 - state.cameraX,
                y: flora.y + 20,
                r: hasPower('owl') ? POWER_TUNING.nightEyesLight : POWER_TUNING.nightLight
            },
            { x: houseX - state.cameraX, y: 400, r: 95 },
            ...weather.fireflyLights()
        ];
        if (allBloomed() && state.boneFound && !state.keyCollected) lights.push({ x: state.keyX - state.cameraX, y: state.keyY, r: 70 });
        for (const s of state.sprouts) if (s.bloomed) lights.push({ x: s.x - state.cameraX, y: s.y - 24, r: 40 });
        if (!state.levelStars.found) lights.push({ x: level.star.x - state.cameraX, y: level.star.y, r: 45 });
        weather.drawDarkness(ctx, lights, state.pixelScale);
        weather.drawFireflies(ctx);
    }
    // Noodle's tips stay readable above the weather.
    ctx.save();
    ctx.translate(-state.cameraX, 0);
    noodle.drawSpeech(ctx, state.cameraX, state.cameraX + CANVAS_WIDTH);
    ctx.restore();

    // Point the way to the next goal when it's off-screen.
    const goal = nextGoal();
    if (goal) drawOffscreenArrow(ctx, goal.x - state.cameraX, CANVAS_WIDTH, goal.emoji);

    const stars = starStates();
    drawStarRow(ctx, stars);
    drawStarGoals(ctx, starGoals(), starGoalsAlpha());
    if (state.levelClearTimer > 0) {
        drawCelebrationBanner(ctx, level.pet, stars, starLabels(), LEVEL_CLEAR_FRAMES - state.levelClearTimer);
    }
}

/** How long the star-goals card stays up when a level starts, and how long it takes to fade. */
const STAR_GOALS_TICKS = 300;
const STAR_GOALS_FADE_TICKS = 40;

/** The star-goals card's opacity: fully shown as a level starts, fading out after a few seconds. */
function starGoalsAlpha()         {
    if (state.levelClearTimer > 0) return 0;
    return Math.max(0, Math.min(1, (STAR_GOALS_TICKS - state.levelTicks) / STAR_GOALS_FADE_TICKS));
}

/** The star-goals card's lines; stars already earned here before show gold. */
function starGoals()             {
    const level = LEVELS[state.currentLevel];
    const best = state.progress.stars[state.currentLevel] ?? 0;
    const got = (bit        )            => (best & bit ? 'earned' : 'open');
    return [
        { state: got(STAR_RESCUE), text: `Rescue ${level.pet}` },
        { state: got(STAR_HIDDEN), text: `Find the hidden star: ${level.star.hint}` },
        { state: got(STAR_CHALLENGE), text: `Challenge: ${CHALLENGE_TEXT[level.challenge]}` }
    ];
}

/** What each of the banner's stars was for. */
function starLabels()           {
    return ['Rescued!', 'Hidden star', CHALLENGE_LABEL[LEVELS[state.currentLevel].challenge]];
}

/** This run's three stars, live: rescue, hidden star, challenge. */
function starStates()              {
    const finished = state.levelClearTimer > 0 || state.screen === 'victory';
    const earned = state.levelStars.earned;
    return [
        finished ? 'earned' : 'open',
        state.levelStars.found || earned & STAR_HIDDEN ? 'earned' : finished ? 'missed' : 'open',
        finished ? (earned & STAR_CHALLENGE ? 'earned' : 'missed') : challengeMet() ? 'open' : 'missed'
    ];
}

// --- src/game/loop.ts ---
/** The fixed 60-ticks-per-second game loop, and fitting the game box to the window. */









/** Advances the simulation by exactly one fixed tick (1/60 s). */
function update()       {
    // Butterflies keep fluttering on every screen, including behind the start screen.
    butterflies.update();
    skyVisitors.update();
    const wind = state.screen === 'playing' ? currentWind() : { x: 0, soon: false };
    weather.update(wind.x, wind.soon);
    tick();
    for (const code of Object.keys(pressed)) pressed[code] = false;
}

function tick()       {
    if (state.screen !== 'playing') return;

    updateKey();
    updateHiddenStar();
    updateParade();
    updateMovingPlatforms();

    const level = LEVELS[state.currentLevel];
    const world               = {
        platforms: [...level.platforms, ...(level.lilyPads ?? []), ...state.movingPlatforms],
        mushrooms: level.mushrooms ?? [],
        bushes: level.bushes ?? [],
        water: level.water ?? [],
        ice: level.ice ?? [],
        // Wind rider (bird): gusts hardly push.
        windX: state.levelClearTimer > 0 ? 0 : currentWind().x * (hasPower('bird') ? POWER_TUNING.windFactor : 1),
        width: levelWidth(level),
        moves: movesFor(state.progress.followers)
    };
    flora.update(
        keys,
        pressed,
        world,
        state.levelClearTimer > 0,
        type => audio.playSound(type),
        checkWatering,
        checkDigging
    );
    // Super sniffer (puppy): Noodle smells the bone from much farther away.
    const sniffRange = hasPower('puppy') ? POWER_TUNING.superSniffRange : POWER_TUNING.sniffRange;
    noodle.update(flora.x, state.digMounds, state.boneFound, false, type => audio.playSound(type), sniffRange);
    updatePond();
    if (state.levelClearTimer === 0) {
        updateBees();
        updateRain();
    }
    particleSystem.update();
    updateCamera();

    updateChallenge();
    updateDoghouse();
    updateLevelClear();
}

function fitToScreen()       {
    // clientWidth/Height ignore mobile zoom-out; innerWidth grows when content overflows the screen.
    const root = document.documentElement;
    const scale = fitScale(root.clientWidth || window.innerWidth, root.clientHeight || window.innerHeight);
    dom.stage.style.width = `${Math.floor(STAGE_WIDTH * scale)}px`;
    dom.stage.style.height = `${Math.floor(STAGE_HEIGHT * scale)}px`;
    dom.container.style.transform = `scale(${scale})`;

    state.pixelScale = scale * (window.devicePixelRatio || 1);
    dom.canvas.width = Math.round(CANVAS_WIDTH * state.pixelScale);
    dom.canvas.height = Math.round(CANVAS_HEIGHT * state.pixelScale);
}

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

// --- src/game.ts ---
/**
 * Entry point: wires up input and menus, fits the game to the window, and starts the loop.
 * The game itself lives in src/game/ (state, input, world, level, menus, scene, loop).
 */




setupInput();
setupMenus();
setupDevMode();
window.addEventListener('resize', fitToScreen);
fitToScreen();
fillVictoryDialog();
initLevel();
showStartScreen();
requestAnimationFrame(frame);
