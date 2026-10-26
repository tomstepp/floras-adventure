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
| PL-5 | Music/sound effects use Tone.js. Browsers only allow audio after a click or tap, so music switches **on** when the player taps Play/Continue on the start screen; the 🎵 button turns it off/on. The game is fully playable if Tone.js fails to load. |
| PL-6 | The game box scales to fit the window (16 px gutter, keeping its 8:5 shape, at most 1.5×) and re-fits on resize/rotation. The canvas renders at the device's real pixel density so it stays sharp. |
| PL-7 | On touch devices (no hover, coarse pointer) on-screen buttons appear: ◀ ▶ bottom-left; dig 🦴, water 💦 and a larger jump ⬆ bottom-right. A button acts as held while a finger is on it, and is released when the finger lifts or the touch is cancelled. The keyboard hint is hidden there. |
| AU-1 | Sounds never crash the game. Each instrument's notes are scheduled strictly after its previous one (Tone.js throws if a synth is started twice at the same moment, e.g. a bee bump in the same tick as a jump, or while the audio clock is suspended), and any sound error is caught and logged. |
| AU-2 | An error inside one frame is logged but never stops the game loop: the next frame is always scheduled first. |

## 2. Controls

Desktop uses only the arrow keys and Space. Touch devices get on-screen buttons that press the same controls.

| ID | Requirement |
|----|-------------|
| CT-1 | Move: ← / →. |
| CT-2 | Jump: ↑. Space does **not** jump. |
| CT-3 | Water: Space. Blooms any unbloomed sprout within 48 px of the watering can, at roughly Flora's foot height. |
| CT-4 | Dig: ↓, only while standing on the ground (not a platform). |
| CT-5 | Restart level: the ↺ Restart button in the HUD. Resets the current level's sprouts, bone, key and Flora's position. Ignored during the level-clear celebration and the victory dialog. |
| CT-6 | Arrow keys and Space don't scroll the page during play. Letter keys do nothing. |
| CT-7 | If the window loses focus, all held keys are released and the game pauses (see PS-2). |
| CT-8 | A jump fires when ↑ is pressed, not while it is held: holding ↑ doesn't keep bouncing. |
| CT-9 | Releasing ↑ early cuts the jump short (a small hop); holding it gives the full jump height. |
| CT-10 | Coyote time: a jump still works for 6 ticks (~0.1 s) after walking off a ledge. |
| CT-11 | Jump buffer: a jump pressed up to 6 ticks before landing fires on landing. |
| CT-12 | Holding the water key keeps splashing for at most 2 s (120 ticks); then the can stops until the key is released and pressed again. A tap shorter than one tick still waters. |

## 2a. Start screen

| ID | Requirement |
|----|-------------|
| ST-1 | The game opens on a start screen over the first level. Nothing moves until the player picks a button; keys held on the start screen don't carry into play. |
| ST-2 | It shows how to play as four pictures in order — water flowers → dig for the bone → grab the key → rescue a pet — each with its key (desktop) or button icon (touch), so non-readers can follow it. |
| ST-3 | With nothing to continue it offers **▶ Play**. With a save it offers **▶ Continue — Level N** (focused) and **🌱 New game**. Below them, **🗺 Levels** is always there, and **🐾 My pets** once at least one pet has been rescued. |
| ST-4 | On-screen touch buttons are hidden while the start screen is up. |

## 2b. Saving

| ID | Requirement |
|----|-------------|
| SV-1 | Progress is saved in the browser (localStorage): the level to Continue from, the furthest level reached, the roster of rescued pets and which of them follow. Starting or picking a level, beating one, or changing followers updates it. |
| SV-2 | New game starts at level 1 and removes Continue, but unlocked levels, the roster and the chosen followers are kept. |
| SV-3 | Winning the whole game removes Continue and unlocks every level. |
| SV-4 | A missing, broken or out-of-range save is ignored, and blocked storage (e.g. private mode) never breaks the game — progress just isn't kept. |
| SV-5 | Older saves that only stored a level still work: Continue goes there and levels up to it are unlocked. |

## 2c. Pause and level select

| ID | Requirement |
|----|-------------|
| PS-1 | A **⏸ Pause** button in the top bar, or Esc on desktop, pauses the game; Esc or **▶ Resume** continues. Nothing moves while paused. |
| PS-2 | Switching away from the window or tab (blur, or the page being hidden) pauses the game automatically. |
| PS-3 | The pause menu offers Resume, **↺ Restart level**, **🗺 Choose a level**, **🐾 My pets** and **🏠 Main menu**. Keys pressed while a menu is open never carry into play, and touch buttons are hidden while any menu is up. |
| PS-4 | Main menu goes to the start screen, where Continue returns to the level that was left. |
| LS-1 | The level list shows all levels as cards: number, pet emoji and name. Levels up to the furthest one reached can be picked; later ones show 🔒 and can't be started. Beaten levels are ticked ✔, and when opened from the pause menu the current level is highlighted and focused. |
| LS-2 | Picking a level starts it with your chosen followers in the parade, and makes it the Continue point. Picking a level counts as a tap, so it can switch music on like Play. |
| LS-3 | ← Back (or Esc) returns to wherever the list was opened from: the start screen or the pause menu. The same goes for My pets. |

## 2d. Pet roster

| ID | Requirement |
|----|-------------|
| RS-1 | Every rescued pet joins the **roster** for good. At most **3** follow in the parade. A newly rescued pet starts following at the back; if 3 already follow, the one that has followed longest goes home to rest (a puff of hearts, and Noodle says "<name> went home to rest 🏡" before the next level's tip). Rescuing a pet already in the roster changes nothing. |
| RS-2 | **🐾 My pets** (from the start screen or pause menu) shows a card for every pet, drawn in the game's style: rescued ones are marked 🐾 Following or 💤 Resting, unrescued ones are a grey silhouette with "Rescue in level N" and can't be picked. Tapping a rescued pet makes it rest or follow; with 3 already following it explains to rest one first. Zero followers is allowed. Changes are saved and, from the pause menu, the parade updates straight away. A counter shows "Following: n / 3". |
| RS-3 | Saves from before the roster get one built from the beaten levels, with the 3 newest following. Unknown or repeated pets in a save are dropped, and only rostered pets can follow. |
| RS-4 | Whenever a level starts or restarts, Noodle and the parade line up behind Flora at the left, rather than walking back from where the last level ended. |

## 3. Level flow

Each level is completed in this order:

| ID | Requirement |
|----|-------------|
| LV-1 | **Bloom** every sprout in the level (count equals the level's `flowersNeeded`). Each splash of water adds one to a sprout; most bloom after 1, big flowers after 2–3 (see TW-6). |
| LV-2 | **Find the bone**: one of the level's dirt mounds, chosen at random each time the level starts, hides Noodle's bone. Digging an empty mound shows "Keep sniffing!". Digging targets the *closest undug* mound within 48 px. The bone may be dug before all flowers bloom. |
| LV-3 | When Flora is within 95 px of the bone mound, Noodle runs to it and barks "🦴 Dig here!". |
| LV-4 | **Collect the key**: the key appears only once all sprouts are bloomed **and** the bone is found. Touching it collects it. |
| LV-5 | **Enter the doghouse**: the doghouse always stands at the far right of the level. Walking right past it (level width − 115) **on the ground** while holding the key starts a 75-tick celebration that names the rescued pet. Falling past the door from above doesn't count until Flora lands. Reaching the doghouse without the key does not end the level; Noodle says it's locked. |
| LV-6 | After the celebration the pet joins the roster and the parade (see RS-1), and the next level starts with Flora back at the left side. |
| LV-7 | After the last level the victory dialog opens and the game pauses. It lists every rescued pet with its emoji, generated from the level list. Closing it (button, Esc, or clicking outside) starts a new game at level 1 with an empty parade. |
| LV-8 | The rainbow is hidden during play. When the level is beaten it sweeps across the sky from left to right (~2/3 s) during the celebration, disappears when the next level starts, and stays fully drawn behind the final victory dialog. |

## 3a. Level twists

Each level after the first adds one new idea; the last level mixes them all.

| ID | Requirement |
|----|-------------|
| TW-1 | Level 1: no twist. Level 2: bouncy mushroom. Level 3: moving cloud. Level 4: big flower. Level 5: all three. Levels 6–10: see 3b. |
| TW-2 | Level 2's key sits on a ledge only the mushroom bounce can reach. |
| TW-3 | Level 3's key sits on a ledge only reachable from the moving cloud. |
| TW-4 | **Mushroom:** landing on its cap from above launches Flora much higher than a jump (≈ 320 px). Walking into it along the ground does nothing. |
| TW-5 | **Moving cloud:** glides smoothly out and back along a fixed stretch; Flora standing on it is carried along. It's drawn as a white cloud, unlike the earthy ledges. |
| TW-6 | **Big flower:** needs several splashes. The bud grows with each splash and shows 💧 for each splash still needed; it blooms bigger than a normal flower. The objective line mentions that big ones need extra splashes. |
| TW-7 | When a level with a twist starts, Noodle's speech bubble introduces it for ~4 s. |

## 3b. Big scrolling levels (6–10)

| ID | Requirement |
|----|-------------|
| BG-1 | Levels 1–5 fit one screen (800 px). Levels 6–10 are wider (1600 → 2400 px) and never shrink in that order: 6 Buzzing Meadow 🐥, 7 Bramble Path 🐷, 8 Cloud Canyon 🦊, 9 Bumblebee Woods 🐼, 10 Grand Garden 🦄. Levels 11–15 (see 3c) scroll too, at least 1600 px. |
| BG-2 | Bees first appear in level 6 and bushes in level 7; level 10 has every obstacle and twist (bees, bushes, mushroom, cloud, big flowers). Levels 1–5 have no bees or bushes. |
| BG-3 | **Camera:** follows Flora smoothly, keeping her a little behind centre and looking ahead the way she faces, and stops at both ends of the level. The sky (sun, rainbow, butterflies), HUD and celebration banner stay fixed on screen; everything else scrolls. |
| BG-4 | **Bramble bush:** a solid clump on the ground. Walking into one stops Flora at its edge; she can jump onto its top and over it. Bushes are always low enough to jump. |
| BG-5 | **Bumblebee:** glides back and forth along a path, bobbing. Touching one bumps Flora back away from it with a little hop; for ~0.4 s she can't walk, jump, water or dig, then she blinks for ~1.5 s and can't be bumped again. Nothing is ever lost — flowers, bone and key stay — and Noodle says to jump over the bees. Bees freeze during the level-clear celebration. |
| BG-6 | **Edge arrows:** when the next goal is off-screen, a pill at the screen edge shows its emoji and points the way: 🔑 once the key appears, 🏠 once it's collected, or 🌱 toward the nearest unbloomed sprout if none are on screen. |

## 3c. Weather and water levels (11–15)

| ID | Requirement |
|----|-------------|
| WX-1 | Levels 11–15, in order: **Lily Pond** 🐸 (ponds), **Windy Hills** 🐦 (wind), **Rainy Meadow** 🐌 (rain), **Snowy Peaks** 🐻 (snow and ice), **Starry Night** 🦉 (night, the finale). Each has its own tip from Noodle. Levels 1–10 are unchanged. |
| WX-2 | **Ponds** cut through the ground and can only be crossed on **lily pads** (some still, some drifting like clouds). Lily pads float just above the water and can be stood on, watered on and jumped from. |
| WX-3 | Falling into a pond is just a splash: Flora pops back onto the last dry spot she stood on, blinks briefly, and nothing is lost; Noodle says to hop on the lily pads. Noodle and the pets paddle across ponds, lower in the water behind a ripple. |
| WX-4 | **Wind** blows in gusts (calm ~3.3 s, gust ~2.5 s, easing in and out) pushing Flora back toward the start — standing, walking, jumping or knocked back. She can always walk into it, just slower. A few leaves start blowing a second before each gust as a warning; during a gust leaves stream across the screen. |
| WX-5 | **Rain clouds** drift across Rainy Meadow, each raining a soft blue column to the ground; a sprout under one gets a splash every 1.5 s, so rain can bloom flowers on its own (big flowers still need all their splashes). The sun hides behind a grey cloud blanket and light rain falls across the screen. |
| WX-6 | **Snow**: snowflakes fall, the ground and treetops are snowy. On **ice** patches Flora speeds up and slows down gradually, so she slides; off the ice she stops at once as usual. |
| WX-7 | **Night**: a dark sky with twinkling stars and a sleepy crescent moon instead of the sun; the scene is dimmed except for soft light around Flora, the doghouse, glowing fireflies, the key once it appears, and bloomed flowers. The HUD, edge arrows and Noodle's bubble stay readable. |

## 3c. Look & feel

| ID | Requirement |
|----|-------------|
| PT-1 | Rescued pets are drawn as sprites in the same soft, rounded style as Flora and Noodle (not emoji): each of the 15 species has its own look (kitty, puppy, hamster, turtle, bunny, duckling, piglet, fox, panda, unicorn, frog, bluebird, snail, bear, owl), with a sparkly eye and blush. They trot while moving, bob gently while waiting, each on its own rhythm, with a small heart and a shadow. Over a pond they paddle, lower in the water behind a ripple. The level list and victory dialog still use the pets' emoji. |
| PT-2 | Every species has a drawing (a missing one is a compile error). |
| PT-3 | Parade pets turn to face the way they walk (with the same dead zone as Noodle), spaced 32 px apart; the pet waiting in the doorway faces out toward Flora. |
| FW-1 | Flowers match the characters' style. A sprout is two plump leaves around a sleepy little bud. A bloomed flower has five round petals with soft highlights around a yellow centre with a happy face, on a curved stem with a leaf, swaying gently (dancing once the whole garden blooms). Big flowers grow as a teardrop bud in green sepals with 💧 per splash still needed, and bloom as a sunflower with a smiling brown centre. |
| KB-1 | The key and bone match the characters' style. The key is golden with a round bow wearing a happy face, rounded teeth and a shine; it bobs and sways gently inside a soft warm glow, with twinkles popping around it. The dug-up bone is plump and cream with rounded knobs, a shine and a happy face, resting by its hole on a little pile of dirt. |
| SK-1 | Occasionally a kite, a little airplane or a bunch of balloons drifts across the sky behind everything, each with a tiny happy face. Only one is up at a time; the first comes a few seconds in, then there's a 6–14 s pause after each leaves. They take turns from a shuffled bag, so all three appear and none repeats twice in a row. They stay in the sky band (balloons fade out before the HUD) and never affect gameplay. Sky visitors and butterflies only come out in clear or windy weather. |
| BF-1 | A few (3–5) butterflies flutter across the sky as decoration, wrapping around the screen edges. They stay between the HUD and the ground (y 110–330), never affect gameplay, and keep moving behind the start screen. |
| ND-1 | Noodle matches Flora's style: a rounded golden-doodle with a curly coat and topknot, a floppy ear, a sparkly eye, a blush and a pink collar. Short legs trot while he moves, his tail wags (faster when he smells the bone), and he dips his nose and hops while sniffing. He faces the way he's moving, ignoring tiny drifts. His position and following behaviour are unchanged. |
| SC-1 | The tree and doghouse use the same soft, rounded, outline-free style as the characters. Tree: a tapered trunk with a knothole and a puffy canopy of overlapping circles with highlights and pink blossoms, swaying gently. Doghouse: pink planked walls, a rounded scalloped roof with a heart, a bone sign, an arched door with trim, and a food bowl. Both keep their old footprint, so the door, entry point and the pet's spot are unchanged. |
| SC-2 | The sun matches the same style: twelve rounded rays (alternating long and short) that turn slowly and gently pulse in length, a golden ring so it shows on every sky, a soft highlight, sparkly eyes that blink every few seconds (out of step with Flora's), a smile and rosy cheeks. |
| SP-1 | Noodle's speech bubble is drawn on the grass just below the characters' feet, with a small tail pointing up at him, so it never covers Flora or the pets. It stays fully on screen near the edges. |
| FL-1 | Flora is drawn with rounded shapes: swept bangs and a bow, eyes with highlights that blink, a flared dress with a scalloped hem, arms and legs that swing while walking, and a watering can that tips while pouring. The drawing never changes her 32×48 hitbox. |

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
| LD-1 | There are exactly 15 levels, each with a unique pet and a background melody. |
| LD-2 | Every sprout sits either on the ground or on top of a platform that holds still, within its horizontal span. |
| LD-3 | Every platform (and each moving cloud's whole stretch) can be reached, with at least 10 px margin: by a jump (≈ 115 px up, ≤ 140 px sideways gap) from a reached surface, by dropping down from a higher one within that gap, or by a mushroom bounce from almost directly below. |
| LD-4 | The key sits 30 px above a reachable platform that holds still (or the ground), inside that platform's span. |
| LD-5 | Each level has at least 2 dirt mounds, at least 40 px apart, clear of the starting area (x > 100) and at least 30 px clear of the doghouse. |
| LD-6 | Platforms (including a cloud's whole stretch) stay inside the level and end before the doghouse body (level width − 130). |
| LD-7 | Mushrooms grow on the ground, at least 40 px from any dig mound, clear of the start area and the doghouse. |
| LD-8 | Big flowers need 2 or 3 splashes. |
| LD-9 | No flower is drawn in the same color as its level's sky. Big flowers are always orange sunflowers. |
| LD-10 | Bushes are low enough to jump, at least 30 px clear of mounds, mushrooms and ground sprouts, and away from the start (x > 150) and the doghouse. |
| LD-11 | Bees fly inside the playfield (between the HUD and the ground), start past x = 250, stay 40 px clear of the doghouse, and take at least 200 ticks per round trip. |
| LD-12 | Ponds stay clear of the start (x > 200) and the doghouse, and no ground sprout, mound, mushroom or bush is in one. Lily pads sit inside a pond, floating above the water. Every dry piece of ground can be reached, and Lily Pond's ponds can't be crossed without the lily pads. |
| LD-13 | Ice sits on dry ground, clear of the start and the doghouse. |
| LD-14 | Wind is never more than 60% of walking speed (so Flora can always walk into it), with at least 2 s of calm between gusts; rain clouds stay inside the level. |

## 6. Out of scope (ideas for later)

- Timers, lives or game over — obstacles only ever bump Flora back; the game stays stress-free.
