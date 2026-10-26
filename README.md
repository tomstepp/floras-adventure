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
Later levels add a bouncy mushroom, a moving cloud and big flowers. Progress is saved after each level, so you can Continue later.

## Develop

| Command | What it does |
|---------|--------------|
| `npm run build` | Bundles `src/*.ts` into `dist/game.js` (types stripped, modules concatenated in order). |
| `npm run typecheck` | Strict TypeScript check of `src/` and `tests/`. |
| `npm test` | Builds, then runs the gameplay and level-design tests with `node --test`. |
| `npm run check` | Type check + tests. Run this before committing. |

Requires Node 22.18+ (for built-in TypeScript type stripping).

Source layout: `game.ts` (state, fixed-timestep loop, level flow), `entities.ts` (Flora & Noodle),
`levels.ts` (level data, controls and tuning constants), `layout.ts` (screen fit), `save.ts` (progress in localStorage), `renderer.ts`, `particles.ts`, `audio.ts`.
New modules must be added to `moduleOrder` in `scripts/build.mjs`.
