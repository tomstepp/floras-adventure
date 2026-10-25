export type Species = 'kitty' | 'puppy' | 'hamster' | 'turtle' | 'bunny';
export type Direction = 'left' | 'right';
export type SoundType = 'jump' | 'water' | 'dig' | 'bloom' | 'bark' | 'key' | 'victory';
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

export interface Sprout {
    x: number;
    y: number;
    bloomed: boolean;
    color: string;
    danceOffset: number;
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
    treeX: number;
    platforms: readonly Platform[];
    sprouts: readonly Point[];
    mounds: readonly number[];
    keyPos: Point;
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
