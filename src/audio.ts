import { LEVEL_MELODIES } from './levels.ts';
import type { SoundType, ToneLoopLike, ToneNoiseSynthLike, ToneStatic, ToneSynthLike } from './types.ts';

declare const Tone: ToneStatic | undefined;

export class AudioController {
    public enabled: boolean = false;
    private synth: ToneSynthLike | null = null;
    private polySynth: ToneSynthLike | null = null;
    private noiseSynth: ToneNoiseSynthLike | null = null;
    private bgLoop: ToneLoopLike | null = null;

    private init(): void {
        if (typeof Tone === 'undefined') return;
        this.synth = new Tone.Synth({ oscillator: { type: 'sine' } }).toDestination();
        this.polySynth = new Tone.PolySynth(Tone.Synth).toDestination();
        this.polySynth.volume.value = -12;
        this.noiseSynth = new Tone.NoiseSynth({
            noise: { type: 'white' },
            envelope: { attack: 0.005, decay: 0.1, sustain: 0 }
        }).toDestination();
    }

    public toggle(currentLevel: number, musicBtn: HTMLElement): void {
        this.setEnabled(!this.enabled, currentLevel, musicBtn);
        musicBtn.blur();
    }

    /** Must be called from a click/tap: browsers only allow audio to start after a user gesture. */
    public setEnabled(on: boolean, currentLevel: number, musicBtn: HTMLElement): void {
        if (typeof Tone === 'undefined' || on === this.enabled) return;
        if (on) {
            void Tone.start();
            if (!this.synth) this.init();
            this.enabled = true;
            musicBtn.innerText = '🎵 Music: ON';
            this.startBgMusic(currentLevel);
        } else {
            this.enabled = false;
            musicBtn.innerText = '🎵 Music: OFF';
            Tone.Transport.stop();
        }
    }

    public startBgMusic(currentLevel: number): void {
        if (!this.enabled || typeof Tone === 'undefined' || !this.polySynth) return;
        Tone.Transport.stop();
        Tone.Transport.cancel();

        const notes = LEVEL_MELODIES[currentLevel % LEVEL_MELODIES.length];
        const poly = this.polySynth;
        let idx = 0;
        this.bgLoop = new Tone.Loop((time: number) => {
            poly.triggerAttackRelease(notes[idx % notes.length], "8n", time);
            idx++;
        }, "4n");

        this.bgLoop.start(0);
        Tone.Transport.bpm.value = 115 + currentLevel * 5;
        Tone.Transport.start();
    }

    /** Last start time used on each instrument (by instrument). */
    private lastStart = new Map<object, number>();

    /**
     * A start time strictly after the previous note on `instrument`. Tone.js throws if a synth
     * is started twice at the same moment, which happens when two sounds land in the same tick
     * (a bee bump and a jump) or while the audio clock is suspended.
     */
    private nextTime(instrument: object): number {
        const now = typeof Tone === 'undefined' ? 0 : Tone.now();
        const time = Math.max(now, (this.lastStart.get(instrument) ?? -1) + 0.01);
        this.lastStart.set(instrument, time);
        return time;
    }

    public playSound(type: SoundType): void {
        if (!this.enabled) return;
        const notes: Partial<Record<SoundType, [ToneSynthLike | null, string | readonly string[], string]>> = {
            jump: [this.synth, "G4", "8n"],
            dig: [this.synth, "A2", "16n"],
            bloom: [this.polySynth, ["C5", "E5", "G5"], "8n"],
            bark: [this.synth, "E3", "16n"],
            key: [this.polySynth, ["G5", "C6", "E6"], "4n"],
            bump: [this.synth, "D3", "16n"],
            bounce: [this.synth, "C5", "16n"],
            victory: [this.polySynth, ["C5", "E5", "G5", "C6"], "2n"]
        };
        // Sound is decoration: a failure here must never stop the game.
        try {
            if (type === 'water') {
                if (this.noiseSynth) this.noiseSynth.triggerAttackRelease("16n", this.nextTime(this.noiseSynth));
                return;
            }
            const entry = notes[type];
            if (!entry || !entry[0]) return;
            const [instrument, note, duration] = entry;
            instrument.triggerAttackRelease(note, duration, this.nextTime(instrument));
        } catch (err) {
            console.warn(`Sound "${type}" failed`, err);
        }
    }
}
