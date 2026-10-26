/**
 * Everything the game remembers while it runs, in one place. Modules read and change
 * `state.x` rather than keeping their own copies, so any module can be composed with any other.
 * The long-lived objects (Flora, Noodle, audio, particles, weather…) live here too.
 */
import { AudioController } from '../audio.ts';
import { ButterflySwarm } from '../butterflies.ts';
import { Noodle, Player } from '../entities.ts';
import { LEVELS } from '../levels.ts';
import { ParticleSystem } from '../particles.ts';
import { getStorage, loadSave, writeSave } from '../save.ts';
import { SkyVisitors } from '../skyfriends.ts';
import { WeatherEffects } from '../weather.ts';
import type { SaveData } from '../save.ts';
import type { DigMound, LevelConfig, Platform, Point, RescuedFriend, Sprout } from '../types.ts';

export type Screen = 'start' | 'playing' | 'paused' | 'levels' | 'roster' | 'victory';
/** Where a sub-menu (level list, My pets) was opened from, so Back returns there. */
export type MenuOrigin = 'start' | 'paused';
/** A moving platform where it is this tick. */
export type MovingPlatformNow = Platform & { style?: 'cloud' | 'lily' };
/** A bee where it is this tick, and which way it's flying. */
export type BeeNow = Point & { facingLeft: boolean };

export interface GameState {
    /** Continue point, unlocked levels, roster and followers; mirrored to storage. */
    progress: SaveData;
    screen: Screen;
    menuReturnTo: MenuOrigin;
    currentLevel: number;
    /** Ticks left in the level-clear celebration (0 while playing). */
    levelClearTimer: number;
    /** Ticks since the level started; drives moving platforms, bees, wind and rain. */
    levelTicks: number;
    /** Left edge of the visible part of the level; levels wider than the screen scroll. */
    cameraX: number;
    /** Where each rain cloud's middle is this tick. */
    rainCloudXs: number[];
    /** The last spot Flora stood on solid ground, where a pond splash puts her back. */
    lastSafeX: number;
    bees: BeeNow[];
    movingPlatforms: MovingPlatformNow[];
    sprouts: Sprout[];
    digMounds: DigMound[];
    rescuedFriends: RescuedFriend[];
    boneFound: boolean;
    boneX: number;
    keyCollected: boolean;
    keyX: number;
    keyY: number;
    /** Canvas pixels per game pixel (screen fit × device pixel ratio). */
    pixelScale: number;
    /** Opened with ?dev in the URL: every level unlocked, plus a Skip level button. */
    dev: boolean;
}

export const audio = new AudioController();
export const particleSystem = new ParticleSystem();
export const butterflies = new ButterflySwarm();
export const skyVisitors = new SkyVisitors();
export const weather = new WeatherEffects();
export const storage = getStorage();
export const flora = new Player();
export const noodle = new Noodle();

/** True when the page URL asks for dev mode (`?dev` or `&dev`, with or without a value). */
export function isDevUrl(search: string): boolean {
    return /[?&]dev(=[^&]*)?(&|$)/.test(search);
}

export const state: GameState = {
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
    dev: isDevUrl(window.location?.search ?? '')
};

/** The level being played. */
export const currentLevelConfig = (): LevelConfig => LEVELS[state.currentLevel];

/** Saves progress, except in dev mode, which never touches the real save. */
export function persist(): void {
    if (!state.dev) writeSave(storage, state.progress);
}
