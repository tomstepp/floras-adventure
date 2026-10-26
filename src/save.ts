import type { Species } from './types.ts';

/** Bump the suffix if the saved shape changes, so old saves are ignored instead of misread. */
export const SAVE_KEY: string = 'floras-adventure-save-v1';
/** How many rescued pets can walk in the parade at once. */
export const MAX_FOLLOWERS: number = 3;

export interface SaveData {
    /** Level index to Continue from, or null when there's nothing to continue. */
    level: number | null;
    /** Furthest level index reached; every level up to it can be picked from the level list. */
    unlocked: number;
    /** Every pet ever rescued, in the order they were rescued. */
    roster: Species[];
    /** The pets walking in the parade (at most MAX_FOLLOWERS), longest-following first. */
    followers: Species[];
}

export const EMPTY_SAVE: SaveData = { level: null, unlocked: 0, roster: [], followers: [] };

/** localStorage, or null where it's blocked (private mode, disabled site data). */
export function getStorage(): Storage | null {
    try {
        return window.localStorage ?? null;
    } catch {
        return null;
    }
}

const isIndex = (n: unknown, levelCount: number): n is number =>
    typeof n === 'number' && Number.isInteger(n) && n >= 0 && n < levelCount;

/** Keeps only known, distinct species, in their saved order. */
function cleanSpecies(list: unknown, known: readonly Species[]): Species[] {
    if (!Array.isArray(list)) return [];
    const seen = new Set<Species>();
    for (const s of list) if (known.includes(s as Species)) seen.add(s as Species);
    return [...seen];
}

/**
 * Reads the save, repairing what it can; anything unreadable means a fresh start.
 * `levelSpecies` is each level's pet, in level order.
 */
export function loadSave(storage: Storage | null, levelSpecies: readonly Species[]): SaveData {
    const levelCount = levelSpecies.length;
    try {
        const raw = storage?.getItem(SAVE_KEY);
        if (!raw) return { ...EMPTY_SAVE, roster: [], followers: [] };
        const data = JSON.parse(raw) as { level?: unknown; unlocked?: unknown; roster?: unknown; followers?: unknown };
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

export function writeSave(storage: Storage | null, data: SaveData): void {
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
export function addRescue(data: SaveData, species: Species): { bumped: Species | null; isNew: boolean } {
    if (data.roster.includes(species)) return { bumped: null, isNew: false };
    data.roster.push(species);
    data.followers.push(species);
    const bumped = data.followers.length > MAX_FOLLOWERS ? (data.followers.shift() as Species) : null;
    return { bumped, isNew: true };
}

/** Lets a rostered pet follow or rest. Returns false if the parade is already full. */
export function toggleFollower(data: SaveData, species: Species): boolean {
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
