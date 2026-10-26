/** The screens around play: start, pause, level list, My pets, and the victory dialog. */
import { dom } from './dom.ts';
import { dropInput } from './input.ts';
import { restartLevel } from './level.ts';
import { audio, noodle, persist, state } from './state.ts';
import { PARADE_GAP, syncParade } from './world.ts';
import { LEVELS } from '../levels.ts';
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

export function showStartScreen(): void {
    state.screen = 'start';
    const canContinue = state.progress.level !== null;
    dom.continueBtn.hidden = !canContinue;
    if (state.progress.level !== null) dom.continueBtn.innerText = `▶ Continue — Level ${state.progress.level + 1}`;
    dom.playBtn.innerText = canContinue ? '🌱 New game' : '▶ Play';
    dom.petsBtn.hidden = state.progress.roster.length === 0;
    showOverlay(dom.startScreen);
    (canContinue ? dom.continueBtn : dom.playBtn).focus();
}

export function pauseGame(): void {
    if (state.screen !== 'playing') return;
    state.screen = 'paused';
    dropInput();
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
            const beaten = i < state.progress.unlocked;
            btn.disabled = locked;
            if (locked) btn.classList.add('locked');
            if (beaten) btn.classList.add('beaten');
            if (i === state.currentLevel && from === 'paused') btn.classList.add('current');
            // First line (the pet, or a lock) is drawn big by CSS; then "number. name".
            btn.innerText = `${locked ? '🔒' : PET_EMOJI[level.species]}\n${i + 1}. ${level.name}${beaten ? ' ✔' : ''}`;
            btn.setAttribute('aria-label', `Level ${i + 1}: ${level.name}${locked ? ' (locked)' : beaten ? ' (rescued)' : ''}`);
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
    dom.rosterHint.innerText = '';
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
            btn.disabled = !rescued;
            const pic = document.createElement('canvas');
            drawRosterPet(pic, species, rescued);
            const label = document.createElement('span');
            label.innerText = rescued
                ? `${level.pet}\n${following ? '🐾 Following' : '💤 Resting'}`
                : `???\nRescue in level ${i + 1}`;
            btn.append(pic, label);
            btn.setAttribute('aria-label', rescued ? `${level.pet}, ${following ? 'following' : 'resting'}` : `Not rescued yet, level ${i + 1}`);
            btn.setAttribute('aria-pressed', String(following));
            btn.addEventListener('click', () => {
                if (!rescued) return;
                if (!toggleFollower(state.progress, species)) {
                    dom.rosterHint.innerText = `Only ${MAX_FOLLOWERS} pets can follow at once — tap one to let it rest first.`;
                    return;
                }
                dom.rosterHint.innerText = '';
                persist();
                syncParade();
                renderRoster();
                (dom.rosterGrid.children[i] as HTMLElement | undefined)?.focus();
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
    dom.victoryText.innerText = `Flora and Noodle bloomed every garden and rescued all ${LEVELS.length} magical pets!`;
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
        audio.setEnabled(true, 0, dom.musicBtn);
        startGame(0);
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
        startGame(0);
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
