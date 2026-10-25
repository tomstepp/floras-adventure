# Flora's Magical Adventure — Requirements

A cute, single-screen 2D platformer for young players. Flora and her golden-doodle
Noodle travel through five gardens, blooming flowers and rescuing a pet in each one.

Requirement IDs (e.g. `LV-3`) are referenced from the tests in `tests/`.

## 1. Platform & build

| ID | Requirement |
|----|-------------|
| PL-1 | Runs in a modern desktop browser from `index.html` with no install step; `dist/game.js` is committed or built with `npm run build`. |
| PL-2 | Source is TypeScript in `src/`, type-checked with `npm run typecheck` (strict mode, no errors). |
| PL-3 | The playfield is an 800×500 canvas. Ground surface is at y = 428. |
| PL-4 | The simulation runs at a fixed 60 ticks per second, independent of display refresh rate (60 Hz and 120 Hz screens play at the same speed). After a long pause (e.g. backgrounded tab) the game must not fast-forward more than 250 ms. |
| PL-5 | Music/sound effects use Tone.js and are **off by default**; the game is fully playable if Tone.js fails to load. |

## 2. Controls

| ID | Requirement |
|----|-------------|
| CT-1 | Move: ←/→ or A/D. |
| CT-2 | Jump: ↑, W or Space, only while standing on ground or a platform. |
| CT-3 | Water: E. Blooms any unbloomed sprout within 48 px of the watering can, at roughly Flora's foot height. |
| CT-4 | Dig: ↓, S or F, only while standing on the ground (not a platform). |
| CT-5 | Restart level: R. Resets the current level's sprouts, bone, key and Flora's position. Ignored during the level-clear celebration and the victory dialog. |
| CT-6 | Arrow keys and Space don't scroll the page during play. |
| CT-7 | If the window loses focus, all held keys are released (Flora stops moving). |

## 3. Level flow

Each level is completed in this order:

| ID | Requirement |
|----|-------------|
| LV-1 | **Bloom** every sprout in the level (count equals the level's `flowersNeeded`). |
| LV-2 | **Find the bone**: one of the level's dirt mounds, chosen at random each time the level starts, hides Noodle's bone. Digging an empty mound shows "Keep sniffing!". Digging targets the *closest undug* mound within 48 px. The bone may be dug before all flowers bloom. |
| LV-3 | When Flora is within 95 px of the bone mound, Noodle runs to it and barks "🦴 Dig here!". |
| LV-4 | **Collect the key**: the key appears only once all sprouts are bloomed **and** the bone is found. Touching it collects it. |
| LV-5 | **Enter the doghouse**: walking right past x = 685 while holding the key starts a 75-tick celebration that names the rescued pet. Reaching the doghouse without the key does not end the level; Noodle says it's locked. |
| LV-6 | After the celebration the pet joins the parade following Noodle, and the next level starts with Flora back at the left side. |
| LV-7 | After level 5 the victory dialog opens and the game pauses. Closing it (button, Esc, or clicking outside) restarts from level 1 with an empty parade. |

## 4. HUD

| ID | Requirement |
|----|-------------|
| HD-1 | Shows "Level N: Name". |
| HD-2 | Shows flowers bloomed / needed, bone found, key collected. |
| HD-3 | Shows a one-line objective telling the player what to do next (water → dig → key → doghouse → celebration). |
| HD-4 | A music toggle button shows ON/OFF. |

## 5. Level design rules

These are checked automatically against `src/levels.ts` so new levels can't be unbeatable.

| ID | Requirement |
|----|-------------|
| LD-1 | There are exactly 5 levels, each with a unique pet and a background melody. |
| LD-2 | Every sprout sits either on the ground or on top of a platform, within its horizontal span. |
| LD-3 | Every platform can be reached by a jump (max jump height ≈ 115 px) from the ground or from a lower platform, with at least 10 px margin. |
| LD-4 | The key sits 30 px above a platform (or the ground), inside that platform's span. |
| LD-5 | Each level has at least 2 dirt mounds, at least 40 px apart, clear of the doghouse (x < 640) and of the starting area (x > 100). |
| LD-6 | Platforms stay inside the canvas and end before the doghouse body (right edge ≤ 670). |

## 6. Out of scope (ideas for later)

- Touch / on-screen controls for tablets.
- Saving progress between sessions.
- Hazards, enemies or a timer — the game is intentionally stress-free.
