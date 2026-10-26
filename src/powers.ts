/*
 * Pet powers: every rescued pet gives Flora a small, gentle bonus while it follows her.
 * Powers only ever help, and no level needs one, so any team of followers (or none) can win.
 * Names and descriptions are short and plain, for young players.
 */
import { BOUNCE_VY, JUMP_VY } from './levels.ts';
import type { Challenge, Moves, Species } from './types.ts';

export interface PetPower {
    /** Two or three words, shown on the pet's card. */
    name: string;
    /** One short sentence saying what it does. */
    description: string;
}

export const PET_POWERS: Readonly<Record<Species, PetPower>> = {
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
export const POWER_TUNING = {
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
} as const;

/** Flora's movement for a team of followers. */
export function movesFor(followers: readonly Species[]): Moves {
    const has = (s: Species): boolean => followers.includes(s);
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
export const CHALLENGE_TEXT: Readonly<Record<Challenge, string>> = {
    flowersFirst: "Water every flower before you dig up the bone",
    firstDig: "Find the bone on your very first dig (watch Noodle!)",
    noBumps: "Don't let a bee bump you",
    noSplash: "Don't fall in the water"
};

/** Stars a level can give, as bits: rescue the pet, find the hidden star, do the challenge. */
export const STAR_RESCUE = 1;
export const STAR_HIDDEN = 2;
export const STAR_CHALLENGE = 4;
export const STARS_PER_LEVEL = 3;

export const starCount = (bits: number): number =>
    (bits & STAR_RESCUE ? 1 : 0) + (bits & STAR_HIDDEN ? 1 : 0) + (bits & STAR_CHALLENGE ? 1 : 0);

/** "★★☆" for a level's stars. */
export const starString = (bits: number): string =>
    [STAR_RESCUE, STAR_HIDDEN, STAR_CHALLENGE].map(b => (bits & b ? '★' : '☆')).join('');
