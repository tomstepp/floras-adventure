import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const rootDir = path.resolve(import.meta.dirname, '..');
const bundleCode = fs.readFileSync(path.join(rootDir, 'dist', 'game.js'), 'utf8');

type KeyHandler = (event: { code: string; repeat?: boolean; preventDefault(): void }) => void;

export interface DialogMock {
    open: boolean;
    showModal(): void;
    close(): void;
}

export interface Game {
    /** Evaluates an expression against the game's top-level state (e.g. `flora.x`). */
    run<T = unknown>(code: string): T;
    /** Advances the simulation by `ticks` fixed updates, rendering each one. */
    step(ticks?: number): void;
    press(code: string): void;
    release(code: string): void;
    /** Presses and releases a key around a single tick. */
    tap(code: string): void;
    /** Drives the requestAnimationFrame loop with a timestamp in ms. */
    frame(now: number): void;
    fireWindowEvent(type: string): void;
    /** Simulates a finger on an on-screen button, by its data-key code. */
    touch(code: string, type: 'pointerdown' | 'pointerup' | 'pointercancel'): void;
    resize(width: number, height: number, devicePixelRatio?: number): void;
    dialog: DialogMock;
    elements: Record<string, Record<string, unknown>>;
    text(id: string): string;
}

/** Loads a fresh copy of dist/game.js into an isolated fake browser. */
export function loadGame(): Game {
    const windowListeners: Record<string, (event?: unknown) => void> = {};
    let pendingFrame: ((now: number) => void) | null = null;

    const dialog = {
        open: false,
        onClose: undefined as (() => void) | undefined,
        showModal() {
            this.open = true;
        },
        close() {
            this.open = false;
            this.onClose?.();
        },
        addEventListener(evt: string, fn: () => void) {
            if (evt === 'close') this.onClose = fn;
        }
    };

    // Every canvas call is a no-op; render() still runs so drawing code is exercised.
    const ctx = new Proxy(
        {},
        {
            get: (_target, prop) =>
                prop === 'measureText' ? (txt: string) => ({ width: txt.length * 6 }) : () => {},
            set: () => true
        }
    );

    const buttonListeners: Record<string, Record<string, (event: unknown) => void>> = {};
    const restartListeners: Record<string, () => void> = {};
    const touchButtons = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Space'].map(code => {
        buttonListeners[code] = {};
        return {
            dataset: { key: code },
            classList: { add() {}, remove() {} },
            setPointerCapture() {},
            addEventListener(evt: string, fn: (event: unknown) => void) {
                buttonListeners[code][evt] = fn;
            }
        };
    });

    const elements: Record<string, Record<string, unknown>> = {
        'game-stage': { style: {} },
        'game-container': { style: {} },
        gameCanvas: { width: 800, height: 500, getContext: () => ctx },
        'music-btn': { innerText: '🎵 Music: OFF', addEventListener() {}, blur() {} },
        'restart-btn': {
            addEventListener(evt: string, fn: () => void) {
                restartListeners[evt] = fn;
            },
            blur() {},
            click() {
                restartListeners.click?.();
            }
        },
        'victory-dialog': dialog,
        'level-display': { innerText: '' },
        'status-display': { innerText: '' },
        'objective-display': { innerText: '' }
    };

    const fakeWindow = {
        innerWidth: 1280,
        innerHeight: 800,
        devicePixelRatio: 1,
        addEventListener(evt: string, fn: (event?: unknown) => void) {
            windowListeners[evt] = fn;
        }
    };

    const sandbox = {
        document: {
            documentElement: { clientWidth: 0, clientHeight: 0 },
            getElementById: (id: string) => elements[id],
            querySelectorAll: (selector: string) => (selector === '[data-key]' ? touchButtons : [])
        },
        window: fakeWindow,
        requestAnimationFrame: (cb: (now: number) => void) => {
            pendingFrame = cb;
        },
        Date,
        Math,
        console
    };

    vm.createContext(sandbox);
    vm.runInContext(bundleCode, sandbox);

    const run = <T>(code: string): T => vm.runInContext(code, sandbox) as T;
    const key = (type: 'keydown' | 'keyup', code: string): void => {
        (windowListeners[type] as KeyHandler)({ code, preventDefault() {} });
    };

    return {
        run,
        step(ticks = 1) {
            for (let i = 0; i < ticks; i++) run('update(); render();');
        },
        press: code => key('keydown', code),
        release: code => key('keyup', code),
        tap(code) {
            key('keydown', code);
            run('update();');
            key('keyup', code);
        },
        frame(now) {
            const cb = pendingFrame;
            pendingFrame = null;
            cb?.(now);
        },
        fireWindowEvent(type) {
            windowListeners[type]?.();
        },
        touch(code, type) {
            buttonListeners[code][type]({ pointerId: 1, preventDefault() {} });
        },
        resize(width, height, devicePixelRatio = 1) {
            Object.assign(fakeWindow, { innerWidth: width, innerHeight: height, devicePixelRatio });
            windowListeners.resize?.();
        },
        dialog,
        elements,
        text: id => elements[id].innerText as string
    };
}

/** Puts Flora standing at (x, feetY), facing right, ready to act. */
export function placeFlora(game: Game, x: number, feetY: number): void {
    game.run(`
        flora.x = ${x}; flora.y = ${feetY} - flora.height; flora.vx = 0; flora.vy = 0;
        flora.grounded = true; flora.facing = 'right';
        flora.waterTimer = 0; flora.isWatering = false; flora.digTimer = 0; flora.isDigging = false;
        flora.coyoteTimer = 6; flora.jumpBufferTimer = 0; flora.jumpRising = false;
    `);
}

export function bloomAll(game: Game): void {
    const sprouts = game.run<{ x: number; y: number }[]>('sprouts.map(s => ({ x: s.x, y: s.y }))');
    for (const s of sprouts) {
        placeFlora(game, s.x - 20, s.y);
        game.tap('ArrowUp');
    }
}

export function digBone(game: Game): void {
    const boneX = game.run<number>('digMounds.find(m => m.hasBone).x');
    placeFlora(game, boneX - 16, 428);
    game.tap('ArrowDown');
}

export function collectKey(game: Game): void {
    const key = game.run<{ x: number; y: number }>('({ x: keyX, y: keyY })');
    placeFlora(game, key.x - 16, key.y + 24);
    game.step();
}

/** Completes the current level, including the celebration. */
export function clearLevel(game: Game): void {
    bloomAll(game);
    digBone(game);
    collectKey(game);
    placeFlora(game, 690, 428);
    game.step();
    while (game.run<number>('levelClearTimer') > 0) game.step();
}
