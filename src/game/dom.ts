/** The page elements the game talks to, looked up once at startup. */

const byId = <T extends HTMLElement = HTMLElement>(id: string): T => document.getElementById(id) as T;

export const dom = {
    stage: byId('game-stage'),
    container: byId('game-container'),
    canvas: byId<HTMLCanvasElement>('gameCanvas'),
    // HUD
    levelDisplay: byId('level-display'),
    statusDisplay: byId('status-display'),
    objectiveDisplay: byId('objective-display'),
    musicBtn: byId<HTMLButtonElement>('music-btn'),
    restartBtn: byId<HTMLButtonElement>('restart-btn'),
    pauseBtn: byId<HTMLButtonElement>('pause-btn'),
    devBadge: byId('dev-badge'),
    // Start screen
    startScreen: byId('start-screen'),
    playBtn: byId<HTMLButtonElement>('play-btn'),
    continueBtn: byId<HTMLButtonElement>('continue-btn'),
    levelsBtn: byId<HTMLButtonElement>('levels-btn'),
    starTotal: byId('star-total'),
    petsBtn: byId<HTMLButtonElement>('pets-btn'),
    // Pause menu
    pauseScreen: byId('pause-screen'),
    resumeBtn: byId<HTMLButtonElement>('resume-btn'),
    pauseRestartBtn: byId<HTMLButtonElement>('pause-restart-btn'),
    pauseSkipBtn: byId<HTMLButtonElement>('pause-skip-btn'),
    pauseLevelsBtn: byId<HTMLButtonElement>('pause-levels-btn'),
    pausePetsBtn: byId<HTMLButtonElement>('pause-pets-btn'),
    pauseMenuBtn: byId<HTMLButtonElement>('pause-menu-btn'),
    pauseStars: byId('pause-stars'),
    pauseBest: byId('pause-best'),
    pauseTeam: byId('pause-team'),
    // Level list
    levelSelect: byId('level-select'),
    levelGrid: byId('level-grid'),
    levelsBackBtn: byId<HTMLButtonElement>('levels-back-btn'),
    // My pets
    rosterScreen: byId('roster-screen'),
    rosterGrid: byId('roster-grid'),
    rosterCount: byId('roster-count'),
    rosterHint: byId('roster-hint'),
    rosterBackBtn: byId<HTMLButtonElement>('roster-back-btn'),
    // Victory
    victoryDialog: byId<HTMLDialogElement>('victory-dialog'),
    victoryText: byId('victory-text'),
    rescuedList: byId('rescued-list')
};

/** The game canvas's drawing context; every frame is drawn through it. */
export const ctx = dom.canvas.getContext('2d') as CanvasRenderingContext2D;
