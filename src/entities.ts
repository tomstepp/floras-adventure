import {
    BOUNCE_VY,
    COYOTE_TICKS,
    CONTROLS,
    GRAVITY,
    JUMP_BUFFER_TICKS,
    JUMP_CUT_VY,
    JUMP_VY,
    MUSHROOM_HEIGHT,
    MUSHROOM_WIDTH
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

    public reset(): void {
        this.x = 50;
        this.y = 380;
        this.vx = 0;
        this.vy = 0;
        this.grounded = true;
        this.coyoteTimer = COYOTE_TICKS;
        this.jumpBufferTimer = 0;
        this.jumpRising = false;
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

        if (keys[CONTROLS.water] && !this.isWatering) {
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
        // Body (Flora - Cute Pink Outfit)
        ctx.fillStyle = "#FF6B8B";
        ctx.fillRect(this.x, this.y + 12, this.width, this.height - 12);

        // Head
        ctx.fillStyle = "#FFD1DC";
        ctx.beginPath();
        ctx.arc(this.x + 16, this.y, 16, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = "#6C5CE7";
        ctx.beginPath();
        ctx.arc(this.x + 16, this.y - 4, 17, Math.PI, Math.PI * 2);
        ctx.fill();

        // Eyes & Rosy Cheeks
        ctx.fillStyle = "#2D3436";
        const eyeX = this.facing === 'right' ? this.x + 22 : this.x + 10;
        ctx.fillRect(eyeX, this.y - 4, 3, 4);

        ctx.fillStyle = "#FF7675";
        ctx.beginPath();
        ctx.arc(this.facing === 'right' ? this.x + 24 : this.x + 8, this.y + 2, 3, 0, Math.PI * 2);
        ctx.fill();

        // Watering Can
        ctx.fillStyle = "#74B9FF";
        const canX = this.facing === 'right' ? this.x + 24 : this.x - 12;
        ctx.fillRect(canX, this.y + 20, 12, 10);
        ctx.fillRect(canX + (this.facing === 'right' ? 12 : -4), this.y + 22, 4, 3);

        if (this.isWatering) {
            ctx.fillStyle = "#0984E3";
            for (let i = 0; i < 6; i++) {
                const dropX = canX + (this.facing === 'right' ? 16 + i * 2 : -6 - i * 2);
                const dropY = this.y + 24 + i * 3 + Math.sin(Date.now() * 0.02 + i) * 2;
                ctx.fillRect(dropX, dropY, 3, 3);
            }
        }

        if (this.isDigging) {
            ctx.fillStyle = "#B2BEC3";
            ctx.fillRect(this.x + (this.facing === 'right' ? 28 : -8), this.y + 32, 8, 12);
        }
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

        // Bark speech bubble
        if (this.barkTimer > 0) {
            ctx.font = "bold 11px sans-serif";
            const textWidth = Math.max(44, ctx.measureText(this.speechBubble).width + 14);
            ctx.fillStyle = this.sniffing ? "#FFF9DB" : "#FFF";
            ctx.beginPath();
            ctx.roundRect(this.x - 12, drawY - 36, textWidth, 22, 8);
            ctx.fill();
            ctx.fillStyle = "#2D3436";
            ctx.fillText(this.speechBubble, this.x - 5, drawY - 21);
        }
    }
}
