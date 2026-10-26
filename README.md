# Flora's Magical Adventure

A cute single-screen platformer: help Flora and her dog Noodle bloom every garden and
rescue five magical pets. Requirements live in [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md).

## Play

```bash
npm install
npm run dev
```

Then open http://localhost:8765. (Opening `index.html` directly also works once `dist/game.js` is built.)

**Controls:** ←/→ move · ↑ jump · Space water · ↓ dig · ↺ button restarts the level. On phones and tablets, on-screen buttons appear.

**Each level:** water every sprout → dig where Noodle sniffs for the bone → grab the key → walk into the doghouse.
Later levels add a bouncy mushroom, a moving cloud and big flowers, then bigger scrolling levels with bees and bushes, and finally a pond, wind, rain, snow and a starry night. Rescued pets join your roster; pick up to 3 to follow you. Progress is saved, so you can Continue later.

## Develop

| Command | What it does |
|---------|--------------|
| `npm run build` | Bundles `src/**/*.ts` into `dist/game.js` (types stripped, modules concatenated in order). |
| `npm run typecheck` | Strict TypeScript check of `src/` and `tests/`. |
| `npm test` | Builds, then runs the gameplay and level-design tests with `node --test`. |
| `npm run check` | Type check + tests. Run this before committing. |

Requires Node 22.18+ (for built-in TypeScript type stripping).

**Dev mode:** open the game with `?dev` (e.g. http://localhost:8765/?dev). Every level and pet is
available, the pause menu gets a **⏭ Skip level** button, a DEV badge shows in the top bar, and
nothing is saved, so your real progress is untouched.

### Source layout

| Where | What |
|-------|------|
| `src/game.ts` | Entry point: wires up input and menus and starts the loop. |
| `src/game/state.ts` | Everything the game remembers while running (`state`), plus Flora, Noodle, audio, particles, weather. |
| `src/game/dom.ts` | The page elements, looked up once (`dom`), and the canvas context. |
| `src/game/input.ts` | Keyboard and touch buttons → held / just-pressed keys. |
| `src/game/world.ts` | Things that move each tick: platforms, bees, wind, rain, ponds, the camera, the pet parade. |
| `src/game/level.ts` | Level rules: setup, watering, digging, key, doghouse, celebration, HUD text. |
| `src/game/menus.ts` | Start screen, pause menu, level list, My pets, victory dialog, dev mode. |
| `src/game/scene.ts` | Draws one frame. |
| `src/game/loop.ts` | The fixed 60-ticks-per-second loop and the screen fit. |
| `src/render/` | Drawing: `sky`, `scenery`, `items` (flowers, key, bone), `creatures` (pets, bees), `hud`, `shapes`. |
| `src/levels.ts` | Level data, controls and tuning constants. |
| `src/entities.ts` | Flora and Noodle (movement, physics, drawing). |
| `src/pets.ts`, `weather.ts`, `butterflies.ts`, `skyfriends.ts` | Pet sprites, weather visuals, sky decorations. |
| `src/save.ts`, `audio.ts`, `particles.ts`, `layout.ts`, `types.ts` | Saving, sound, particles, screen fit, shared types. |

Modules share state through `state` rather than their own variables, so any module can use any
other. New modules must be added to `moduleOrder` in `scripts/build.mjs`; the build fails if a file
is missing from that list, or if two modules declare the same top-level name (everything ends up in
one script).
