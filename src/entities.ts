import {
    BOUNCE_VY,
    BUMP_SAFE_TICKS,
    BUMP_STUN_TICKS,
    COYOTE_TICKS,
    CONTROLS,
    GRAVITY,
    GROUND_Y,
    JUMP_BUFFER_TICKS,
    JUMP_CUT_VY,
    JUMP_VY,
    MUSHROOM_HEIGHT,
    MUSHROOM_WIDTH,
    SPEECH_TOP_Y,
    WATER_HOLD_TICKS
} from './levels.ts';
import type { Bush, DigMound, Direction, Platform, Point, SoundType } from './types.ts';

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
    /** After a bee bump: ticks of being knocked back (no control), then of blinking safety. */
    public stunTimer: number = 0;
    public safeTimer: number = 0;
    private knockVx: number = 0;

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
        this.stunTimer = 0;
        this.safeTimer = 0;
        this.knockVx = 0;
    }

    /**
     * Bumped by something at `fromX`: hop back away from it and lose control briefly.
     * Nothing is lost; returns false if she's still in her safe blink from the last bump.
     */
    public bump(fromX: number): boolean {
        if (this.safeTimer > 0) return false;
        this.knockVx = this.x + this.width / 2 < fromX ? -4 : 4;
        this.vy = -5;
        this.grounded = false;
        this.jumpRising = false;
        this.coyoteTimer = 0;
        this.stunTimer = BUMP_STUN_TICKS;
        this.safeTimer = BUMP_SAFE_TICKS;
        this.isWatering = false;
        return true;
    }

    public update(
        keys: Readonly<Record<string, boolean>>,
        pressed: Readonly<Record<string, boolean>>,
        platforms: readonly Platform[],
        mushrooms: readonly Point[],
        bushes: readonly Bush[],
        worldWidth: number,
        disabled: boolean,
        playSound: (type: SoundType) => void,
        onWater: () => void,
        onDig: () => void
    ): void {
        if (disabled) return;
        if (this.safeTimer > 0) this.safeTimer--;

        if (this.stunTimer > 0) {
            // Knocked back: physics only, no walking, jumping, watering or digging.
            this.stunTimer--;
            this.vx = this.knockVx;
            this.knockVx *= 0.9;
            this.applyPhysics(platforms, mushrooms, bushes, worldWidth, playSound);
            return;
        }

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

        this.applyPhysics(platforms, mushrooms, bushes, worldWidth, playSound);
    }

    private applyPhysics(
        platforms: readonly Platform[],
        mushrooms: readonly Point[],
        bushes: readonly Bush[],
        worldWidth: number,
        playSound: (type: SoundType) => void
    ): void {
        const prevX = this.x;
        const prevBottom = this.y + this.height;
        this.vy += GRAVITY;
        this.x += this.vx;

        // Bushes are solid from the side: walk into one and you stop at its edge.
        for (const b of bushes) {
            const top = GROUND_Y - b.height;
            const overlapsX = this.x + this.width > b.x && this.x < b.x + b.width;
            if (!overlapsX || this.y + this.height <= top + 2) continue;
            if (prevX + this.width <= b.x + 0.01) this.x = b.x - this.width;
            else if (prevX >= b.x + b.width - 0.01) this.x = b.x + b.width;
            else if (this.x + this.width / 2 < b.x + b.width / 2) this.x = b.x - this.width;
            else this.x = b.x + b.width;
        }

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

        // One-way platform collisions; bush tops can be stood on too
        if (this.vy >= 0) {
            const bushTops = bushes.map(b => ({ x: b.x, y: GROUND_Y - b.height, width: b.width }));
            for (const p of [...platforms, ...bushTops]) {
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
        if (this.x > worldWidth - this.width) this.x = worldWidth - this.width;

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
        // Blink while she's safe after a bee bump.
        if (this.safeTimer > 0 && Math.floor(now / 90) % 2 === 0) ctx.globalAlpha = 0.45;
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
    /** How far Noodle moved last tick; drives trotting and which way he faces. */
    public vx: number = 0;
    public facing: Direction = 'right';
    /** Lines waiting their turn in the speech bubble, with how long each shows. */
    private speechQueue: [string, number][] = [];

    /** Says `text` for `ticks` right away; whatever he was saying waits its turn after. */
    public sayFirst(text: string, ticks: number): void {
        if (this.barkTimer > 0) this.speechQueue.unshift([this.speechBubble, this.barkTimer]);
        this.speechBubble = text;
        this.barkTimer = ticks;
    }

    public update(
        playerX: number,
        digMounds: readonly DigMound[],
        boneFound: boolean,
        gamePaused: boolean,
        playSound: (type: SoundType) => void
    ): void {
        if (gamePaused) return;
        const prevX = this.x;

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
        if (this.barkTimer <= 0 && this.speechQueue.length > 0) {
            [this.speechBubble, this.barkTimer] = this.speechQueue.shift() as [string, number];
        }

        this.vx = this.x - prevX;
        // A little dead zone so tiny drifts don't make him flip back and forth.
        if (this.vx > 0.3) this.facing = 'right';
        else if (this.vx < -0.3) this.facing = 'left';
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        const now = Date.now();
        const trotting = Math.abs(this.vx) > 0.4;
        const step = trotting ? Math.sin(now * 0.022) : 0;
        // Sniffing: nose down to the ground with an excited little hop.
        const hop = this.sniffing ? Math.abs(Math.sin(now * 0.02)) * -3 : trotting ? Math.abs(step) * -1.5 : 0;
        const headDip = this.sniffing ? 5 : 0;

        const fur = "#F2C46D";
        const furDark = "#D9A441";
        const furLight = "#FBE3B0";

        ctx.save();
        // Origin on the ground under his middle, facing right; mirror for left.
        ctx.translate(this.x + 12, this.y + 22);
        if (this.facing === 'left') ctx.scale(-1, 1);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Soft shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.translate(0, hop);

        // Legs: far pair darker, trotting in opposite phase to the near pair
        const legs: [number, number, string][] = [
            [-8, -step, furDark],
            [6, step, furDark],
            [-5, step, fur],
            [9, -step, fur]
        ];
        // Short, chunky legs read as puppy rather than deer.
        ctx.lineWidth = 5;
        for (const [lx, swing, color] of legs) {
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(lx, -7);
            ctx.lineTo(lx + swing * 2, -2.5 - hop);
            ctx.stroke();
        }

        // Fluffy tail wags faster when he smells the bone
        const wag = Math.sin(now * (this.sniffing ? 0.05 : 0.018)) * 0.5;
        ctx.save();
        ctx.translate(-13, -13);
        ctx.rotate(-0.6 + wag);
        ctx.fillStyle = fur;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(-i * 3.5, -i * 2.5, 3.6 - i * 0.6, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // Body: a soft oval with doodle curls along the top
        ctx.fillStyle = fur;
        ctx.beginPath();
        ctx.ellipse(0, -11.5, 14, 7.5, 0, 0, Math.PI * 2);
        ctx.fill();
        for (let i = -10; i <= 6; i += 4) {
            ctx.beginPath();
            ctx.arc(i, -17.5, 3.4, 0, Math.PI * 2);
            ctx.fill();
        }
        // Fluffy chest patch under the chin
        ctx.fillStyle = furLight;
        ctx.beginPath();
        ctx.ellipse(9, -10, 4, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head (dips toward the ground while sniffing)
        ctx.save();
        ctx.translate(12, -20.5 + headDip);
        if (this.sniffing) ctx.rotate(0.35);

        // Pink collar where head meets body
        ctx.strokeStyle = "#FF6B8B";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(-2, 4, 6, 0.6, 2.2);
        ctx.stroke();
        ctx.fillStyle = "#FDCB6E";
        ctx.beginPath();
        ctx.arc(-3.5, 10, 1.7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = fur;
        ctx.beginPath();
        ctx.arc(0, 0, 8.5, 0, Math.PI * 2);
        ctx.fill();
        // Curly topknot
        for (const [cx, cy, r] of [[-4, -7, 3.6], [0.5, -8.5, 3.8], [4.5, -6.5, 3.2]] as const) {
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fill();
        }

        // Floppy ear, swinging a little as he moves
        ctx.fillStyle = furDark;
        ctx.beginPath();
        ctx.ellipse(-4.5, 2.5, 3.6, 6.2, 0.25 + step * 0.15, 0, Math.PI * 2);
        ctx.fill();

        // Snout and nose
        ctx.fillStyle = furLight;
        ctx.beginPath();
        ctx.ellipse(7, 3, 5, 3.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#2D3436";
        ctx.beginPath();
        ctx.ellipse(11, 1.8, 2, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#2D3436";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(8.5, 4.5, 1.8, 0.3, Math.PI - 0.3);
        ctx.stroke();

        // Eye with a sparkle (closes happily while sniffing), plus blush
        ctx.fillStyle = "#2D3436";
        ctx.beginPath();
        if (this.sniffing) {
            ctx.strokeStyle = "#2D3436";
            ctx.lineWidth = 1.2;
            ctx.arc(3.5, -1, 1.8, Math.PI + 0.3, -0.3);
            ctx.stroke();
        } else {
            ctx.ellipse(3.5, -1.5, 1.6, 2.2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(4, -2.2, 0.6, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = "rgba(255, 118, 117, 0.5)";
        ctx.beginPath();
        ctx.ellipse(2.5, 3.5, 2.2, 1.4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        ctx.restore();
    }

    /**
     * Noodle's speech bubble sits on the grass *below* him, pointing up, so it never
     * covers Flora or the pets. Drawn after every character.
     */
    public drawSpeech(ctx: CanvasRenderingContext2D, viewLeft: number, viewRight: number): void {
        if (this.barkTimer <= 0) return;
        ctx.save();
        ctx.font = "bold 12px sans-serif";
        const width = Math.max(44, ctx.measureText(this.speechBubble).width + 16);
        const noseX = this.x + 14;
        // Stay inside the visible part of the level.
        const left = Math.min(Math.max(viewLeft + 4, noseX - width / 2), viewRight - width - 4);
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
