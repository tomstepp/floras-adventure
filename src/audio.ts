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
        if (typeof Tone === 'undefined') return;
        if (!this.enabled) {
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
        musicBtn.blur();
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

    public playSound(type: SoundType): void {
        if (!this.enabled) return;
        if (type === 'jump') this.synth?.triggerAttackRelease("G4", "8n");
        if (type === 'water') this.noiseSynth?.triggerAttackRelease("16n");
        if (type === 'dig') this.synth?.triggerAttackRelease("A2", "16n");
        if (type === 'bloom') this.polySynth?.triggerAttackRelease(["C5", "E5", "G5"], "8n");
        if (type === 'bark') this.synth?.triggerAttackRelease("E3", "16n");
        if (type === 'key') this.polySynth?.triggerAttackRelease(["G5", "C6", "E6"], "4n");
        if (type === 'victory') this.polySynth?.triggerAttackRelease(["C5", "E5", "G5", "C6"], "2n");
    }
}
