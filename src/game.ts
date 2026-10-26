/**
 * Entry point: wires up input and menus, fits the game to the window, and starts the loop.
 * The game itself lives in src/game/ (state, input, world, level, menus, scene, loop).
 */
import { setupInput } from './game/input.ts';
import { initLevel } from './game/level.ts';
import { fitToScreen, frame } from './game/loop.ts';
import { fillVictoryDialog, setupDevMode, setupMenus, showStartScreen } from './game/menus.ts';

setupInput();
setupMenus();
setupDevMode();
window.addEventListener('resize', fitToScreen);
fitToScreen();
fillVictoryDialog();
initLevel();
showStartScreen();
requestAnimationFrame(frame);
