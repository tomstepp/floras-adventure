/** The game's logical playfield size; all drawing and physics use these units. */
export const CANVAS_WIDTH: number = 800;
export const CANVAS_HEIGHT: number = 500;
/** The framed game box: canvas plus a 4px border on each side. */
export const STAGE_WIDTH: number = CANVAS_WIDTH + 8;
export const STAGE_HEIGHT: number = CANVAS_HEIGHT + 8;

/**
 * Largest scale at which the game box fits the viewport with a gutter on every side.
 * Capped so huge monitors don't get a comically oversized (and blurry-HUD) game.
 */
export function fitScale(viewportWidth: number, viewportHeight: number, gutter: number = 16, maxScale: number = 1.5): number {
    const scale = Math.min(
        (viewportWidth - gutter * 2) / STAGE_WIDTH,
        (viewportHeight - gutter * 2) / STAGE_HEIGHT,
        maxScale
    );
    return Math.max(0.1, scale);
}
