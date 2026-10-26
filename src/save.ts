/** Bump the suffix if the saved shape changes, so old saves are ignored instead of misread. */
export const SAVE_KEY: string = 'floras-adventure-save-v1';

export interface SaveData {
    /** Level index to Continue from, or null when there's nothing to continue. */
    level: number | null;
    /** Furthest level index reached; every level up to it can be picked from the level list. */
    unlocked: number;
}

export const EMPTY_SAVE: SaveData = { level: null, unlocked: 0 };

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

/** Reads the save, repairing what it can; anything unreadable means a fresh start. */
export function loadSave(storage: Storage | null, levelCount: number): SaveData {
    try {
        const raw = storage?.getItem(SAVE_KEY);
        if (!raw) return { ...EMPTY_SAVE };
        const data = JSON.parse(raw) as { level?: unknown; unlocked?: unknown };
        // Continue only makes sense past level 1 (level 1 is just "New game").
        const level = isIndex(data.level, levelCount) && data.level >= 1 ? data.level : null;
        // Older saves only had `level`; treat it as the furthest level reached.
        const unlocked = Math.max(isIndex(data.unlocked, levelCount) ? data.unlocked : 0, level ?? 0);
        return { level, unlocked };
    } catch {
        return { ...EMPTY_SAVE };
    }
}

export function writeSave(storage: Storage | null, data: SaveData): void {
    try {
        storage?.setItem(SAVE_KEY, JSON.stringify(data));
    } catch {
        // Storage full or blocked: progress just isn't kept.
    }
}
