import {
    BOUNCE_VY,
    COYOTE_TICKS,
    CONTROLS,
    GRAVITY,
    JUMP_BUFFER_TICKS,
    JUMP_CUT_VY,
    JUMP_VY,
    MUSHROOM_HEIGHT,
    MUSHROOM_WIDTH,
    SPEECH_TOP_Y,
    WATER_HOLD_TICKS
} from './levels.ts';
import type { DigMound, Direction, Platform, Point, SoundType } from './types.ts';

export class Player {
    public x: number = 50;
    public y: number = 380;
    public width: number = 32;
    public height: number = 48;
    public vx: number = 0;
    public vy: number = 0;
    public grounded: boolean = true;
    public facing: Direction = 'right';
    public isWatering: boolean = false;
    public waterTimer: number = 0;
    public isDigging: boolean = false;
    public digTimer: number = 0;
    /** Ticks left in which a jump still works after walking off a ledge. */
    public coyoteTimer: number = COYOTE_TICKS;
    /** Ticks left in which an early jump press will fire on landing. */
    public jumpBufferTimer: number = 0;
    /** True while rising from a jump that letting go of ↑ may still cut short. */
    public jumpRising: boolean = false;
    /** Ticks the water key has been held without letting go. */
    public waterHeldTicks: number = 0;

    public reset(): void {
        this.x = 50;
        this.y = 380;
        this.vx = 0;
        this.vy = 0;
        this.grounded = true;
        this.coyoteTimer = COYOTE_TICKS;
        this.jumpBufferTimer = 0;
        this.jumpRising = false;
        this.waterHeldTicks = 0;
    }

    public update(
        keys: Readonly<Record<string, boolean>>,
        pressed: Readonly<Record<string, boolean>>,
        platforms: readonly Platform[],
        mushrooms: readonly Point[],
        canvasWidth: number,
        disabled: boolean,
        playSound: (type: SoundType) => void,
        onWater: () => void,
        onDig: () => void
    ): void {
        if (disabled) return;

        if (keys[CONTROLS.right]) {
            this.vx = 3.5;
            this.facing = 'right';
        } else if (keys[CONTROLS.left]) {
            this.vx = -3.5;
            this.facing = 'left';
        } else {
            this.vx = 0;
        }

        // Jumps fire on a press (latched even if released within the same tick), not while held,
        // so the buffer can remember a press made just before landing.
        if (pressed[CONTROLS.jump]) this.jumpBufferTimer = JUMP_BUFFER_TICKS;

        if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
            this.vy = JUMP_VY;
            this.grounded = false;
            this.jumpRising = true;
            this.jumpBufferTimer = 0;
            this.coyoteTimer = 0;
            playSound('jump');
        }

        if (this.jumpRising && !keys[CONTROLS.jump] && this.vy < JUMP_CUT_VY) this.vy = JUMP_CUT_VY;
        if (this.vy >= 0) this.jumpRising = false;

        // A fresh press always splashes (even a tap shorter than a tick); holding keeps
        // splashing only for a couple of seconds so the key can't just be held down forever.
        const waterHeld = keys[CONTROLS.water] || pressed[CONTROLS.water];
        if (pressed[CONTROLS.water]) this.waterHeldTicks = 0;
        else if (waterHeld) this.waterHeldTicks++;
        else this.waterHeldTicks = 0;
        const canPour = waterHeld && (pressed[CONTROLS.water] || this.waterHeldTicks <= WATER_HOLD_TICKS);

        if (canPour && !this.isWatering) {
            this.isWatering = true;
            this.waterTimer = 18;
            playSound('water');
            onWater();
        }

        if (keys[CONTROLS.dig]) {
            if (!this.isDigging && this.grounded) {
                this.isDigging = true;
                this.digTimer = 15;
                playSound('dig');
                onDig();
            }
        }

        if (this.waterTimer > 0) this.waterTimer--;
        else this.isWatering = false;

        if (this.digTimer > 0) this.digTimer--;
        else this.isDigging = false;

        const prevBottom = this.y + this.height;
        this.vy += GRAVITY;
        this.x += this.vx;
        this.y += this.vy;
        this.grounded = false;

        // Landing on a mushroom cap launches Flora high into the air.
        if (this.vy >= 0) {
            for (const m of mushrooms) {
                const top = m.y - MUSHROOM_HEIGHT;
                if (
                    this.x + this.width > m.x - MUSHROOM_WIDTH / 2 + 4 &&
                    this.x < m.x + MUSHROOM_WIDTH / 2 - 4 &&
                    prevBottom <= top + 6 &&
                    this.y + this.height >= top
                ) {
                    this.y = top - this.height;
                    this.vy = BOUNCE_VY;
                    this.jumpRising = false;
                    playSound('bounce');
                    break;
                }
            }
        }

        // One-way platform collisions
        if (this.vy >= 0) {
            for (const p of platforms) {
                if (
                    this.x + this.width > p.x + 6 &&
                    this.x < p.x + p.width - 6 &&
                    prevBottom <= p.y + 6 &&
                    this.y + this.height >= p.y
                ) {
                    this.y = p.y - this.height;
                    this.vy = 0;
                    this.grounded = true;
                    break;
                }
            }
        }

        // Ground collision (y = 428)
        if (this.y >= 380) {
            this.y = 380;
            this.vy = 0;
            this.grounded = true;
        }

        if (this.x < 0) this.x = 0;
        if (this.x > canvasWidth - this.width) this.x = canvasWidth - this.width;

        this.coyoteTimer = this.grounded ? COYOTE_TICKS : Math.max(0, this.coyoteTimer - 1);
        if (this.jumpBufferTimer > 0) this.jumpBufferTimer--;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const now = Date.now();
        const walking = this.grounded && this.vx !== 0;
        const airborne = !this.grounded;
        const stride = walking ? Math.sin(now * 0.018) : 0;
        // A tiny bounce while walking, a gentle breath while standing.
        const bob = walking ? Math.abs(stride) * -1.5 : Math.sin(now * 0.004) * 0.6;

        ctx.save();
        // Draw facing right around her centre line; mirror for facing left.
        ctx.translate(this.x + this.width / 2, this.y + bob);
        if (this.facing === 'left') ctx.scale(-1, 1);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const skin = "#FFE0D6";
        const hair = "#6C5CE7";
        const dress = "#FF6B8B";

        // Hair behind the head (falls to the shoulders)
        ctx.fillStyle = hair;
        ctx.beginPath();
        ctx.roundRect(-13, -4, 26, 20, 9);
        ctx.fill();

        // Legs and shoes
        const legL = airborne ? -3 : stride * 4;
        const legR = airborne ? 3 : -stride * 4;
        ctx.strokeStyle = skin;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-4, 36);
        ctx.lineTo(-4 + legL, airborne ? 43 : 45);
        ctx.moveTo(4, 36);
        ctx.lineTo(4 + legR, airborne ? 41 : 45);
        ctx.stroke();
        ctx.fillStyle = "#A55EEA";
        ctx.beginPath();
        ctx.ellipse(-3 + legL, airborne ? 45 : 46.5, 4, 2.4, 0, 0, Math.PI * 2);
        ctx.ellipse(5 + legR, airborne ? 43 : 46.5, 4, 2.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Back arm
        ctx.strokeStyle = skin;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(-6, 18);
        ctx.lineTo(-10 - stride * 2, airborne ? 20 : 28);
        ctx.stroke();

        // Dress: narrow at the shoulders, flaring to a scalloped hem
        ctx.fillStyle = dress;
        ctx.beginPath();
        ctx.moveTo(-6, 14);
        ctx.quadraticCurveTo(0, 12, 6, 14);
        ctx.lineTo(12, 36);
        ctx.quadraticCurveTo(0, 40, -12, 36);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#FF8FA8";
        for (let i = -9; i <= 9; i += 6) {
            ctx.beginPath();
            ctx.arc(i, 36.5, 3, 0, Math.PI);
            ctx.fill();
        }
        // Collar and a little flower button
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.ellipse(0, 14.5, 5, 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#FFEAA7";
        ctx.beginPath();
        ctx.arc(1, 22, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = skin;
        ctx.beginPath();
        ctx.arc(0, 2, 12.5, 0, Math.PI * 2);
        ctx.fill();

        // Bangs swept to the front
        ctx.fillStyle = hair;
        ctx.beginPath();
        ctx.moveTo(-13, 3);
        ctx.quadraticCurveTo(-14, -12, 0, -12);
        ctx.quadraticCurveTo(13, -12, 13.5, 0);
        ctx.quadraticCurveTo(7, -5, 3, -2);
        ctx.quadraticCurveTo(-3, -6, -8, -1);
        ctx.quadraticCurveTo(-11, 1, -13, 3);
        ctx.fill();

        // Bow
        ctx.fillStyle = "#FD79A8";
        ctx.beginPath();
        ctx.moveTo(-4, -11);
        ctx.lineTo(-11, -16);
        ctx.lineTo(-10, -7);
        ctx.closePath();
        ctx.moveTo(-4, -11);
        ctx.lineTo(3, -17);
        ctx.lineTo(3, -7);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#E84393";
        ctx.beginPath();
        ctx.arc(-4, -11, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Face (three-quarter view, looking the way she faces); blinks every few seconds
        const blinking = now % 3600 < 120;
        ctx.fillStyle = "#2D3436";
        for (const ex of [1, 7.5]) {
            ctx.beginPath();
            if (blinking) ctx.ellipse(ex, 3, 2, 0.6, 0, 0, Math.PI * 2);
            else ctx.ellipse(ex, 3, 1.7, 2.4, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        if (!blinking) {
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(1.6, 2.2, 0.7, 0, Math.PI * 2);
            ctx.arc(8.1, 2.2, 0.7, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = "rgba(255, 118, 117, 0.55)";
        ctx.beginPath();
        ctx.ellipse(-3, 7.5, 2.6, 1.6, 0, 0, Math.PI * 2);
        ctx.ellipse(10.5, 7.5, 2, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#C0392B";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(4.5, 7, 2.4, 0.2, Math.PI - 0.2);
        ctx.stroke();

        // Front arm holding the watering can
        ctx.strokeStyle = skin;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(5, 18);
        ctx.lineTo(11, this.isWatering ? 21 : 25);
        ctx.stroke();

        // Watering can: tips forward while pouring
        ctx.save();
        ctx.translate(15, 25);
        if (this.isWatering) ctx.rotate(0.45);
        ctx.fillStyle = "#74B9FF";
        ctx.beginPath();
        ctx.roundRect(-4, -4, 11, 9, 3);
        ctx.fill();
        ctx.strokeStyle = "#74B9FF";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(6, 0);
        ctx.lineTo(12, -4);
        ctx.moveTo(-3, -4);
        ctx.quadraticCurveTo(1.5, -9, 6, -4);
        ctx.stroke();
        ctx.fillStyle = "#0984E3";
        ctx.beginPath();
        ctx.arc(12.5, -4.5, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (this.isWatering) {
            ctx.fillStyle = "#0984E3";
            for (let i = 0; i < 6; i++) {
                const dropX = 24 + i * 1.6 + Math.sin(now * 0.03 + i) * 1.2;
                const dropY = 24 + ((now * 0.12 + i * 5) % 22);
                ctx.beginPath();
                ctx.ellipse(dropX, dropY, 1.3, 2, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        if (this.isDigging) {
            // Little trowel scooping the dirt
            ctx.strokeStyle = "#8D6E63";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(10, 30);
            ctx.lineTo(16, 40);
            ctx.stroke();
            ctx.fillStyle = "#B2BEC3";
            ctx.beginPath();
            ctx.ellipse(18, 43, 3.5, 5, -0.5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

export class Noodle {
    public x: number = 20;
    public y: number = 406;
    public barkTimer: number = 0;
    public speechBubble: string = "";
    public sniffing: boolean = false;

    public update(
        playerX: number,
        digMounds: readonly DigMound[],
        boneFound: boolean,
        gamePaused: boolean,
        playSound: (type: SoundType) => void
    ): void {
        if (gamePaused) return;

        const boneMound = digMounds.find(m => m.hasBone);
        if (!boneFound && boneMound && Math.abs((playerX + 16) - boneMound.x) < 95) {
            this.sniffing = true;
            const targetX = boneMound.x - 12;
            this.x += (targetX - this.x) * 0.1;
            if (this.barkTimer <= 0) {
                this.barkTimer = 45;
                this.speechBubble = "🦴 Dig here!";
                playSound('bark');
            }
        } else {
            this.sniffing = false;
            const targetX = playerX - 35;
            this.x += (targetX - this.x) * 0.06;

            if (Math.random() < 0.006 && this.barkTimer <= 0) {
                this.barkTimer = 70;
                const barks = ["Woof!", "Arf!", "Yip!", "Ruff!"];
                this.speechBubble = barks[Math.floor(Math.random() * barks.length)];
                playSound('bark');
            }
        }

        if (this.barkTimer > 0) this.barkTimer--;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const bounceY = this.sniffing ? Math.abs(Math.sin(Date.now() * 0.02)) * -4 : 0;
        const drawY = this.y + bounceY;

        // Golden Doodle body & legs (grounded at y = 428)
        ctx.fillStyle = "#C49102";
        ctx.fillRect(this.x + 2, this.y + 18, 4, 4);
        ctx.fillRect(this.x + 18, this.y + 18, 4, 4);

        ctx.fillStyle = "#E1B12C";
        ctx.fillRect(this.x, drawY, 24, 18);
        ctx.fillRect(this.x + 14, drawY - 10, 14, 14); // Fluffy Head

        // Snout & Ears
        ctx.fillStyle = "#C49102";
        ctx.fillRect(this.x + 12, drawY - 6, 4, 8); // Ear

        // Eyes
        ctx.fillStyle = "#000";
        ctx.fillRect(this.x + 22, drawY - 6, 2, 3);

        // Fluffy Wagging tail (wags faster when sniffing a bone!)
        const wagSpeed = this.sniffing ? 0.05 : 0.02;
        ctx.strokeStyle = "#E1B12C";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(this.x, drawY + 6);
        ctx.lineTo(this.x - 10, drawY + (Math.sin(Date.now() * wagSpeed) * 8));
        ctx.stroke();

    }

    /**
     * Noodle's speech bubble sits on the grass *below* him, pointing up, so it never
     * covers Flora or the pets. Drawn after every character.
     */
    public drawSpeech(ctx: CanvasRenderingContext2D, canvasWidth: number): void {
        if (this.barkTimer <= 0) return;
        ctx.save();
        ctx.font = "bold 12px sans-serif";
        const width = Math.max(44, ctx.measureText(this.speechBubble).width + 16);
        const noseX = this.x + 14;
        const left = Math.min(Math.max(4, noseX - width / 2), canvasWidth - width - 4);
        const top = SPEECH_TOP_Y;

        ctx.fillStyle = this.sniffing ? "#FFF9DB" : "#FFFFFF";
        ctx.strokeStyle = "rgba(45, 52, 54, 0.15)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(left, top, width, 22, 9);
        ctx.fill();
        ctx.stroke();
        // Little tail pointing up at Noodle
        ctx.beginPath();
        ctx.moveTo(noseX - 5, top + 1);
        ctx.lineTo(noseX, top - 6);
        ctx.lineTo(noseX + 5, top + 1);
        ctx.fill();

        ctx.fillStyle = "#2D3436";
        ctx.textBaseline = "middle";
        ctx.fillText(this.speechBubble, left + 8, top + 11.5);
        ctx.restore();
    }
}
