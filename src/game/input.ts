/** Keyboard and on-screen touch buttons, turned into held and just-pressed keys. */
import { CONTROLS } from '../levels.ts';
import { closeLevelSelect, closeRoster, pauseGame, resumeGame } from './menus.ts';
import { state } from './state.ts';

/** Keys held down right now, by KeyboardEvent.code. */
export const keys: Record<string, boolean> = {};
/** Keys that went down since the last tick, so a tap shorter than one tick still counts. */
export const pressed: Record<string, boolean> = {};

export const GAME_KEYS: readonly string[] = Object.values(CONTROLS);

export function pressKey(code: string): void {
    if (!keys[code]) pressed[code] = true;
    keys[code] = true;
}

export function clearKeys(): void {
    for (const code of Object.keys(keys)) keys[code] = false;
}

/** Drops held and just-pressed keys, so menu key presses never leak into play. */
export function dropInput(): void {
    clearKeys();
    for (const code of Object.keys(pressed)) pressed[code] = false;
}

/** Listens to the keyboard, window focus and the touch buttons. Called once at startup. */
export function setupInput(): void {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
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
    window.addEventListener('keyup', (e: KeyboardEvent) => {
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
    for (const btn of document.querySelectorAll<HTMLElement>('[data-key]')) {
        const code = btn.dataset.key as string;
        const release = (): void => {
            keys[code] = false;
            btn.classList.remove('pressed');
        };
        btn.addEventListener('pointerdown', (e: PointerEvent) => {
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
        btn.addEventListener('contextmenu', (e: Event) => e.preventDefault());
    }
}
