/** The screens around play: start, pause, level list, My pets, and the victory dialog. */
import { dom } from './dom.ts';
import { dropInput } from './input.ts';
import { refreshPowers, restartLevel } from './level.ts';
import { audio, noodle, persist, state } from './state.ts';
import { PARADE_GAP, syncParade } from './world.ts';
import { LEVELS } from '../levels.ts';
import { CHALLENGE_TEXT, PET_POWERS, STARS_PER_LEVEL, starCount, starString } from '../powers.ts';
import { starStates } from './scene.ts';
import { drawPetSprite } from '../pets.ts';
import { PET_EMOJI } from '../render/creatures.ts';
import { MAX_FOLLOWERS, toggleFollower } from '../save.ts';
import type { Species } from '../types.ts';

export function saveProgress(level: number | null): void {
    state.progress = { ...state.progress, level, unlocked: Math.max(state.progress.unlocked, level ?? 0) };
    persist();
}

/** Shows exactly one menu overlay (or none), and hides touch controls while any is up. */
export function showOverlay(overlay: HTMLElement | null): void {
    for (const el of [dom.startScreen, dom.pauseScreen, dom.levelSelect, dom.rosterScreen]) el.hidden = el !== overlay;
    if (overlay) document.body.classList.add('menu-open');
    else document.body.classList.remove('menu-open');
}

/**
 * New game: back to level 1, and every rescued pet goes home so it can be rescued again.
 * Unlocked levels and best stars are kept.
 */
export function startNewGame(): void {
    // Dev mode keeps every pet available.
    state.progress = state.dev
        ? { ...state.progress, level: null }
        : { ...state.progress, level: null, roster: [], followers: [] };
    state.rescuedFriends = [];
    persist();
    startGame(0);
}

/** Starts play at `level`, with the chosen followers in the parade. */
export function startGame(level: number): void {
    state.currentLevel = level;
    state.rescuedFriends = state.progress.followers.map((species, i) => ({ species, x: 20 - (i + 1) * PARADE_GAP, y: 416 }));
    // Continue picks up from whichever level you're on; level 1 is just "New game".
    saveProgress(level > 0 ? level : null);
    noodle.x = 20;
    restartLevel();
    dropInput();
    state.screen = 'playing';
    showOverlay(null);
}

/** True after the first tap on New game, while it waits for "tap again to start over". */
let newGameArmed = false;

export function showStartScreen(): void {
    state.screen = 'start';
    const canContinue = state.progress.level !== null;
    dom.continueBtn.hidden = !canContinue;
    if (state.progress.level !== null) dom.continueBtn.innerText = `▶ Continue — Level ${state.progress.level + 1}`;
    // With progress or rescued pets, Play is a fresh start ("New game"); otherwise it's just Play.
    const hasProgress = canContinue || state.progress.roster.length > 0;
    dom.playBtn.innerText = hasProgress ? '🌱 New game' : '▶ Play';
    newGameArmed = false;
    dom.startConfirm.hidden = true;
    dom.petsBtn.hidden = state.progress.roster.length === 0;
    const total = state.progress.stars.reduce((sum, bits) => sum + starCount(bits), 0);
    dom.starTotal.innerText = `⭐ ${total} / ${LEVELS.length * STARS_PER_LEVEL} stars`;
    showOverlay(dom.startScreen);
    (canContinue ? dom.continueBtn : dom.playBtn).focus();
}

export function pauseGame(): void {
    if (state.screen !== 'playing') return;
    state.screen = 'paused';
    dropInput();
    fillPauseInfo();
    showOverlay(dom.pauseScreen);
    dom.resumeBtn.focus();
}

export function resumeGame(): void {
    if (state.screen !== 'paused') return;
    dropInput();
    state.screen = 'playing';
    showOverlay(null);
}

/** The level list: every level up to the furthest one reached can be picked. */
export function openLevelSelect(from: 'start' | 'paused'): void {
    state.menuReturnTo = from;
    state.screen = 'levels';
    dom.levelGrid.replaceChildren(
        ...LEVELS.map((level, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'level-card';
            const locked = i > state.progress.unlocked && !state.dev;
            // A level's pet stays a surprise until it's rescued (again, after a New game).
            const rescued = state.progress.roster.includes(level.species);
            btn.disabled = locked;
            if (locked) btn.classList.add('locked');
            if (rescued) btn.classList.add('beaten');
            if (i === state.currentLevel && from === 'paused') btn.classList.add('current');
            // First line (the pet, a ❓ until it's rescued, or a lock) is drawn big by CSS;
            // then "number. name", then the best stars earned.
            const stars = state.progress.stars[i] ?? 0;
            btn.innerText = locked
                ? `🔒\n${i + 1}. ${level.name}`
                : `${rescued ? PET_EMOJI[level.species] : '❓'}\n${i + 1}. ${level.name}\n${starString(stars)}`;
            btn.setAttribute('aria-label', `Level ${i + 1}: ${level.name}${locked ? ' (locked)' : rescued ? ' (rescued)' : ''}`);
            btn.addEventListener('click', () => {
                if (locked) return;
                // Picking a level is a tap, so it can switch music on like Play does.
                audio.setEnabled(true, i, dom.musicBtn);
                startGame(i);
            });
            return btn;
        })
    );
    showOverlay(dom.levelSelect);
    const focusIndex = from === 'paused' ? state.currentLevel : state.progress.unlocked;
    (dom.levelGrid.children[focusIndex] as HTMLElement | undefined)?.focus();
}

export function closeLevelSelect(): void {
    if (state.screen !== 'levels') return;
    returnFromMenu(dom.pauseLevelsBtn);
}

export function returnFromMenu(focusInPause: HTMLElement): void {
    if (state.menuReturnTo === 'paused') {
        state.screen = 'paused';
        showOverlay(dom.pauseScreen);
        focusInPause.focus();
    } else {
        showStartScreen();
    }
}

/** Draws a pet onto a roster card's little canvas; pets not yet rescued are a mystery silhouette. */
export function drawRosterPet(card: HTMLCanvasElement, species: Species, rescued: boolean): void {
    const dpr = window.devicePixelRatio || 1;
    card.width = Math.round(80 * dpr);
    card.height = Math.round(64 * dpr);
    const g = card.getContext('2d');
    if (!g) return;
    g.scale(dpr * 1.6, dpr * 1.6);
    drawPetSprite(g, species, 23, 37, false, 0);
    if (!rescued) {
        g.globalCompositeOperation = 'source-in';
        g.fillStyle = 'rgba(99, 110, 114, 0.35)';
        g.fillRect(0, 0, 80, 64);
    }
}

/** The roster: every pet rescued so far. Tap one to let it follow or rest (3 can follow). */
export function openRoster(from: 'start' | 'paused'): void {
    state.menuReturnTo = from;
    state.screen = 'roster';
    dom.rosterHint.innerText = `Tap a pet to see its power. Up to ${MAX_FOLLOWERS} can follow you!`;
    renderRoster();
    showOverlay(dom.rosterScreen);
    (dom.rosterGrid.children[0] as HTMLElement | undefined)?.focus();
}

export function renderRoster(): void {
    dom.rosterCount.innerText = `🐾 Following: ${state.progress.followers.length} / ${MAX_FOLLOWERS}`;
    dom.rosterGrid.replaceChildren(
        ...LEVELS.map((level, i) => {
            const species = level.species;
            const rescued = state.progress.roster.includes(species);
            const following = state.progress.followers.includes(species);
            const cardState = !rescued ? 'locked' : following ? 'following' : 'resting';
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `roster-card ${cardState}`;
            btn.dataset.state = cardState;
            btn.dataset.species = species;
            // Not `disabled`: browsers send no clicks to disabled buttons, and tapping a pet
            // not rescued yet should still say where to find it.
            btn.setAttribute('aria-disabled', String(!rescued));
            const pic = document.createElement('canvas');
            drawRosterPet(pic, species, rescued);
            const power = PET_POWERS[species];
            const label = document.createElement('span');
            label.innerText = rescued
                ? `${level.pet}\n\n⚡ ${power.name}`
                : `???\n\nRescue in level ${i + 1}`;
            // Tapping or pointing at a card says what its power does, in plain words.
            const describe = (): void => {
                dom.rosterHint.innerText = rescued
                    ? `${PET_EMOJI[species]} ${power.name}: ${power.description}`
                    : `Rescue this pet in level ${i + 1} to find out its power!`;
            };
            btn.addEventListener('mouseenter', describe);
            btn.addEventListener('focus', describe);
            btn.append(pic, label);
            btn.setAttribute('aria-label', rescued ? `${level.pet}, ${following ? 'following' : 'resting'}` : `Not rescued yet, level ${i + 1}`);
            btn.setAttribute('aria-pressed', String(following));
            btn.addEventListener('click', () => {
                if (!rescued) {
                    describe();
                    return;
                }
                if (!toggleFollower(state.progress, species)) {
                    dom.rosterHint.innerText = `Only ${MAX_FOLLOWERS} pets can follow at once — tap one to let it rest first.`;
                    return;
                }
                persist();
                syncParade();
                // Powers that change the level (like Rainbow magic) take effect right away.
                refreshPowers();
                renderRoster();
                (dom.rosterGrid.children[i] as HTMLElement | undefined)?.focus();
                const now = state.progress.followers.includes(species);
                dom.rosterHint.innerText = now
                    ? `${PET_EMOJI[species]} ${level.pet} is following: ${power.name}! ${power.description}`
                    : `💤 ${level.pet} is resting.`;
            });
            return btn;
        })
    );
}

export function closeRoster(): void {
    if (state.screen !== 'roster') return;
    returnFromMenu(dom.pausePetsBtn);
}

/** The victory dialog lists every pet, so it grows with the level list. */
export function fillVictoryDialog(): void {
    dom.victoryText.innerText =
        `Flora and Noodle bloomed every garden and rescued all ${LEVELS.length} magical pets! ` +
        'Play again to send them home and rescue them all over again.';
    dom.rescuedList.replaceChildren(
        ...LEVELS.map(l => {
            const li = document.createElement('li');
            li.innerText = `${PET_EMOJI[l.species]} ${l.pet}`;
            return li;
        })
    );
}

/** Wires up every menu and HUD button. Called once at startup. */
export function setupMenus(): void {
    dom.musicBtn.addEventListener('click', () => {
        audio.toggle(state.currentLevel, dom.musicBtn);
    });
    dom.restartBtn.addEventListener('click', () => {
        // Blur so a later Space press waters instead of clicking Restart again.
        dom.restartBtn.blur();
        if (state.screen === 'playing' && state.levelClearTimer === 0) restartLevel();
    });

    // The Play tap is the user gesture browsers require before audio can start, so music comes on here.
    dom.playBtn.addEventListener('click', () => {
        // Starting over sends every rescued pet home, so a first tap asks to be sure.
        // (Dev mode saves nothing and keeps every pet, so there's nothing to lose there.)
        if (state.progress.roster.length > 0 && !newGameArmed && !state.dev) {
            newGameArmed = true;
            dom.playBtn.innerText = '🌱 Yes, start over';
            dom.startConfirm.innerText =
                'Starting over sends all your rescued pets home, so you can rescue them again. ' +
                'Your stars and levels stay. Tap again to start over!';
            dom.startConfirm.hidden = false;
            return;
        }
        audio.setEnabled(true, 0, dom.musicBtn);
        startNewGame();
    });
    dom.continueBtn.addEventListener('click', () => {
        const level = state.progress.level ?? 0;
        audio.setEnabled(true, level, dom.musicBtn);
        startGame(level);
    });
    dom.levelsBtn.addEventListener('click', () => openLevelSelect('start'));

    dom.pauseBtn.addEventListener('click', () => {
        dom.pauseBtn.blur();
        pauseGame();
    });
    dom.resumeBtn.addEventListener('click', resumeGame);
    dom.pauseRestartBtn.addEventListener('click', () => {
        restartLevel();
        resumeGame();
    });
    dom.pauseLevelsBtn.addEventListener('click', () => openLevelSelect('paused'));
    dom.pauseMenuBtn.addEventListener('click', () => showStartScreen());
    dom.levelsBackBtn.addEventListener('click', closeLevelSelect);
    dom.petsBtn.addEventListener('click', () => openRoster('start'));
    dom.pausePetsBtn.addEventListener('click', () => openRoster('paused'));
    dom.rosterBackBtn.addEventListener('click', closeRoster);

    dom.victoryDialog.addEventListener('close', () => {
        // Only the Play Again button starts over (sending the pets home, like New game).
        // Closing any other way (Esc, a click outside) goes to the start screen, pets and all.
        if (dom.victoryDialog.returnValue === 'play-again') startNewGame();
        else showStartScreen();
    });
}

/**
 * Dev mode (open the game with `?dev` in the URL): every level and pet is available, a
 * Skip level button sits in the pause menu, and nothing is saved, so real progress is safe.
 */
export function setupDevMode(): void {
    if (!state.dev) return;
    state.progress = {
        ...state.progress,
        unlocked: LEVELS.length - 1,
        roster: LEVELS.map(l => l.species)
    };
    dom.devBadge.hidden = false;
    dom.pauseSkipBtn.hidden = false;
    dom.pauseSkipBtn.addEventListener('click', skipLevel);
}

/** Dev only: finish the current level at once, as if the celebration had just ended. */
export function skipLevel(): void {
    if (!state.dev || (state.screen !== 'paused' && state.screen !== 'playing')) return;
    resumeGame();
    // One tick left of the celebration: the next tick rescues the pet and moves on.
    state.levelClearTimer = 1;
}

/** The pause menu's side panel: this level's three star goals, and what your team can do. */
export function fillPauseInfo(): void {
    const level = LEVELS[state.currentLevel];
    const [rescue, hidden, challenge] = starStates();
    const mark = (st: string): string => (st === 'earned' ? '✅' : st === 'missed' ? '❌' : '⬜');
    const goals = [
        `${mark(rescue)} Rescue ${level.pet}`,
        `${mark(hidden)} Find the hidden star: ${level.star.hint}`,
        `${mark(challenge)} ${CHALLENGE_TEXT[level.challenge]}${challenge === 'missed' ? ' (try again next time!)' : ''}`
    ];
    dom.pauseStars.replaceChildren(...goals.map(text => {
        const li = document.createElement('li');
        li.innerText = text;
        return li;
    }));
    const best = state.progress.stars[state.currentLevel] ?? 0;
    dom.pauseBest.innerText = best ? `Your best here: ${starString(best)}` : '';

    const team = state.progress.followers.map(species => {
        const power = PET_POWERS[species];
        const li = document.createElement('li');
        li.innerText = `${PET_EMOJI[species]} ${power.name}: ${power.description}`;
        return li;
    });
    if (team.length === 0) {
        const li = document.createElement('li');
        li.innerText = "No pets following yet. Rescued pets give you powers!";
        team.push(li);
    }
    dom.pauseTeam.replaceChildren(...team);
}
