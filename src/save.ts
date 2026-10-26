/** Bump the suffix if the saved shape changes, so old saves are ignored instead of misread. */
export const SAVE_KEY: string = 'floras-adventure-save-v1';

export interface SaveData {
    /** Index of the level to continue from; every level before it has been beaten. */
    level: number;
}

/** localStorage, or null where it's blocked (private mode, disabled site data). */
export function getStorage(): Storage | null {
    try {
        return window.localStorage ?? null;
    } catch {
        return null;
    }
}

export function loadSave(storage: Storage | null, levelCount: number): SaveData | null {
    try {
        const raw = storage?.getItem(SAVE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw) as Partial<SaveData>;
        const level = data.level;
        if (typeof level !== 'number' || !Number.isInteger(level) || level < 1 || level >= levelCount) return null;
        return { level };
    } catch {
        return null;
    }
}

export function writeSave(storage: Storage | null, data: SaveData): void {
    try {
        storage?.setItem(SAVE_KEY, JSON.stringify(data));
    } catch {
        // Storage full or blocked: progress just isn't kept.
    }
}

export function clearSave(storage: Storage | null): void {
    try {
        storage?.removeItem(SAVE_KEY);
    } catch {
        // Nothing to clear.
    }
}
