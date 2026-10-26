export type Species =
    | 'kitty' | 'puppy' | 'hamster' | 'turtle' | 'bunny'
    | 'duckling' | 'piglet' | 'fox' | 'panda' | 'unicorn'
    | 'frog' | 'bird' | 'snail' | 'bear' | 'owl';
/** Each level's sky and weather. 'clear' is the default sunny day. */
export type Weather = 'clear' | 'wind' | 'rain' | 'snow' | 'night';
export type Direction = 'left' | 'right';
export type SoundType = 'jump' | 'water' | 'dig' | 'bloom' | 'bark' | 'key' | 'victory' | 'bounce' | 'bump';
export type ParticleShape = 'circle' | 'star' | 'heart';

export interface Point {
    x: number;
    y: number;
}

export interface Platform {
    x: number;
    y: number;
    width: number;
}

/** A platform that glides from `x` to `x + range` and back, once every `period` ticks. */
export interface MovingPlatform extends Platform {
    range: number;
    period: number;
    /** Clouds glide through the sky; lily pads drift across a pond. */
    style?: 'cloud' | 'lily';
}

/** A stretch of the ground, from `x` to `x + width` (used for ponds and ice). */
export interface GroundSpan {
    x: number;
    width: number;
}

/** Wind blows in gusts: calm for `calm` ticks, then a gust of `gust` ticks pushing at `strength` px/tick. */
export interface WindConfig {
    /** Negative blows left (against Flora's way to the doghouse). */
    strength: number;
    calm: number;
    gust: number;
}

/** A rain cloud drifting from `x` to `x + range` and back; it waters sprouts below it. */
export interface RainCloudConfig {
    x: number;
    range: number;
    period: number;
}

/** Everything Flora's physics needs to know about the level this tick. */
export interface PhysicsWorld {
    platforms: readonly Platform[];
    mushrooms: readonly Point[];
    bushes: readonly Bush[];
    water: readonly GroundSpan[];
    ice: readonly GroundSpan[];
    /** Wind push this tick, in px per tick (0 when calm). */
    windX: number;
    width: number;
}

/** A bumblebee that flies from `x` to `x + range` and back around height `y`, once every `period` ticks. */
export interface BeeConfig extends Point {
    range: number;
    period: number;
}

/** A bramble bush on the ground: solid from the side, standable on top. `x` is its left edge. */
export interface Bush {
    x: number;
    width: number;
    height: number;
}

export interface SproutConfig extends Point {
    /** Splashes needed to bloom; big flowers need more than 1. */
    waterNeeded?: number;
}

export interface Sprout {
    x: number;
    y: number;
    water: number;
    waterNeeded: number;
    bloomed: boolean;
    color: string;
    danceOffset: number;
    /** Ticks spent under a rain cloud since its last splash. */
    rainTicks?: number;
}

export interface DigMound {
    x: number;
    y: number;
    hasBone: boolean;
    dug: boolean;
}

export interface RescuedFriend {
    species: Species;
    x: number;
    y: number;
    /** How far it moved last tick; drives its walk and which way it faces. */
    vx?: number;
    facingLeft?: boolean;
}

export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    alpha: number;
    decay: number;
    shape: ParticleShape;
}

export interface LevelConfig {
    name: string;
    flowersNeeded: number;
    pet: string;
    species: Species;
    bg: string;
    /** World width in px; levels wider than the screen scroll. Defaults to one screen (800). */
    width?: number;
    treeX: number;
    /** Extra background trees beyond the main one. */
    trees?: readonly number[];
    platforms: readonly Platform[];
    movingPlatforms?: readonly MovingPlatform[];
    /** Bouncy mushrooms; `y` is the surface they grow on. */
    mushrooms?: readonly Point[];
    bees?: readonly BeeConfig[];
    bushes?: readonly Bush[];
    weather?: Weather;
    /** Ponds: Flora can't stand here, only on lily pads. */
    water?: readonly GroundSpan[];
    /** Lily pads floating on a pond; standable like platforms. */
    lilyPads?: readonly Platform[];
    /** Slippery ice on the ground. */
    ice?: readonly GroundSpan[];
    wind?: WindConfig;
    rainClouds?: readonly RainCloudConfig[];
    sprouts: readonly SproutConfig[];
    mounds: readonly number[];
    keyPos: Point;
    /** What Noodle says when the level starts, introducing its new twist. */
    tip?: string;
}

export interface ToneSynthLike {
    triggerAttackRelease(note: string | readonly string[], duration: string, time?: number): void;
    toDestination(): ToneSynthLike;
    volume: { value: number };
}

export interface ToneNoiseSynthLike {
    triggerAttackRelease(duration: string, time?: number): void;
    toDestination(): ToneNoiseSynthLike;
}

export interface ToneLoopLike {
    start(time: number): void;
}

export interface ToneStatic {
    start(): Promise<void>;
    /** Current audio-clock time in seconds. */
    now(): number;
    Synth: new (options?: Record<string, unknown>) => ToneSynthLike;
    PolySynth: new (voice: unknown) => ToneSynthLike;
    NoiseSynth: new (options?: Record<string, unknown>) => ToneNoiseSynthLike;
    Loop: new (callback: (time: number) => void, interval: string) => ToneLoopLike;
    Transport: {
        bpm: { value: number };
        start(): void;
        stop(): void;
        cancel(): void;
    };
}
