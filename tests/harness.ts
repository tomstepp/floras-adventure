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
    /** Text drawn on the canvas by the most recent render(). */
    drawnText(): string[];
    /** Text drawn by the most recent render(), with where it was drawn. */
    drawnTextAt(): { text: string; x: number; y: number }[];
    /** Clicks a button element by id. */
    click(id: string): void;
    /** The level-select cards, in order (after the level list has been opened). */
    levelCards(): { innerText: string; disabled: boolean; classes: Set<string>; click(): void }[];
    /** Presses and releases a key that isn't a game control (e.g. Escape). */
    key(code: string): void;
    dialog: DialogMock;
    elements: Record<string, Record<string, unknown>>;
    text(id: string): string;
    storage: Map<string, string>;
}

export interface LoadOptions {
    /** Shared localStorage contents; pass the same map to simulate reloading the page. */
    storage?: Map<string, string>;
    /** Stay on the start screen instead of pressing Play. */
    atStartScreen?: boolean;
}

/** A fake DOM element that records listeners and supports click(). */
function makeElement(props: Record<string, unknown> = {}): Record<string, unknown> {
    const listeners: Record<string, (event?: unknown) => void> = {};
    const classes = new Set<string>();
    return {
        innerText: '',
        hidden: false,
        disabled: false,
        style: {},
        classes,
        classList: {
            add: (c: string) => void classes.add(c),
            remove: (c: string) => void classes.delete(c)
        },
        setAttribute() {},
        addEventListener(evt: string, fn: (event?: unknown) => void) {
            listeners[evt] = fn;
        },
        click() {
            listeners.click?.();
        },
        focus() {},
        blur() {},
        ...props
    };
}

/** Loads a fresh copy of dist/game.js into an isolated fake browser, then presses Play. */
export function loadGame(options: LoadOptions = {}): Game {
    const storage = options.storage ?? new Map<string, string>();
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

    // Canvas calls are no-ops, except text, which is recorded per frame so tests can check it.
    let frameText: { text: string; x: number; y: number }[] = [];
    const ctx = new Proxy(
        {},
        {
            get: (_target, prop) => {
                if (prop === 'measureText') return (txt: string) => ({ width: txt.length * 6 });
                if (prop === 'fillText') return (text: string, x: number, y: number) => void frameText.push({ text, x, y });
                if (prop === 'setTransform') return () => void (frameText = []);
                return () => {};
            },
            set: () => true
        }
    );

    const buttonListeners: Record<string, Record<string, (event: unknown) => void>> = {};
    const touchButtons = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'Space', 'ArrowUp'].map(code => {
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
        'game-stage': makeElement(),
        'game-container': makeElement(),
        gameCanvas: makeElement({ width: 800, height: 500, getContext: () => ctx }),
        'music-btn': makeElement({ innerText: '🎵 Music: OFF' }),
        'restart-btn': makeElement(),
        'victory-dialog': dialog,
        'level-display': makeElement(),
        'status-display': makeElement(),
        'objective-display': makeElement(),
        'start-screen': makeElement({ hidden: true }),
        'play-btn': makeElement(),
        'continue-btn': makeElement({ hidden: true }),
        'victory-text': makeElement(),
        'rescued-list': makeElement({
            items: [] as string[],
            replaceChildren(this: { items: string[] }, ...children: { innerText: string }[]) {
                this.items = children.map(c => c.innerText);
            }
        }),
        'pause-btn': makeElement(),
        'pause-screen': makeElement({ hidden: true }),
        'resume-btn': makeElement(),
        'pause-restart-btn': makeElement(),
        'pause-levels-btn': makeElement(),
        'pause-menu-btn': makeElement(),
        'levels-btn': makeElement(),
        'level-select': makeElement({ hidden: true }),
        'level-grid': makeElement({
            children: [] as Record<string, unknown>[],
            replaceChildren(this: { children: unknown[] }, ...children: unknown[]) {
                this.children = children;
            }
        }),
        'levels-back-btn': makeElement()
    };

    const localStorage = {
        getItem: (k: string) => storage.get(k) ?? null,
        setItem: (k: string, v: string) => void storage.set(k, String(v)),
        removeItem: (k: string) => void storage.delete(k)
    };

    const fakeWindow = {
        innerWidth: 1280,
        innerHeight: 800,
        devicePixelRatio: 1,
        localStorage,
        addEventListener(evt: string, fn: (event?: unknown) => void) {
            windowListeners[evt] = fn;
        }
    };

    const sandbox = {
        document: {
            documentElement: { clientWidth: 0, clientHeight: 0 },
            body: makeElement(),
            hidden: false,
            addEventListener() {},
            createElement: () => makeElement(),
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

    const click = (id: string): void => (elements[id].click as () => void)();
    if (!options.atStartScreen) click('play-btn');

    return {
        run,
        click,
        storage,
        drawnText: () => frameText.map(t => t.text),
        levelCards: () => elements['level-grid'].children as ReturnType<Game['levelCards']>,
        key(code) {
            key('keydown', code);
            key('keyup', code);
        },
        drawnTextAt: () => [...frameText],
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

/**
 * Puts Flora standing at (x, feetY), facing right, ready to act. Scripted helpers teleport
 * her around, so she's made bump-proof; bee tests reset `flora.safeTimer = 0` themselves.
 */
export function placeFlora(game: Game, x: number, feetY: number): void {
    game.run(`
        flora.x = ${x}; flora.y = ${feetY} - flora.height; flora.vx = 0; flora.vy = 0;
        flora.grounded = true; flora.facing = 'right';
        flora.waterTimer = 0; flora.isWatering = false; flora.digTimer = 0; flora.isDigging = false;
        flora.coyoteTimer = 6; flora.jumpBufferTimer = 0; flora.jumpRising = false;
        flora.stunTimer = 0; flora.safeTimer = 100000;
    `);
}

export function bloomAll(game: Game): void {
    const sprouts = game.run<{ x: number; y: number }[]>('sprouts.map(s => ({ x: s.x, y: s.y }))');
    for (const s of sprouts) {
        placeFlora(game, s.x - 20, s.y);
        for (let i = 0; i < game.run<number>(`sprouts.find(s => s.x === ${s.x}).waterNeeded`); i++) {
            game.run('flora.waterTimer = 0; flora.isWatering = false;');
            game.tap('Space');
        }
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
    placeFlora(game, game.run<number>('doghouseEntryX(LEVELS[currentLevel])') + 5, 428);
    game.step();
    while (game.run<number>('levelClearTimer') > 0) game.step();
}
