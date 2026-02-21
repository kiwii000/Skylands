# Living Soil (Phaser 3 Prototype)

A playable top-down 2D pixel-art life/farming sim prototype set in a sterile megacity where citizens regrow living soil.

## If GitHub only shows `main`

You're right to call this out. If you only see `main`, it means feature-branch commits are not visible there yet.

Use one of these flows:

### Option A: play from `main` (if already merged)

```bash
git checkout main
git pull
npm install
npm run dev
```

### Option B: play from a feature branch (if branch exists remotely)

```bash
git fetch --all
git branch -a
git checkout work
npm install
npm run dev
```

### Option C: no branch visible, but you have commit hashes

If someone gave you commit hashes from this prototype PR, apply them on top of `main`:

```bash
git checkout main
git pull
git cherry-pick <commit_hash_1> <commit_hash_2>
npm install
npm run dev
```

## Tech Stack
- Phaser 3
- Vite
- JavaScript

## Project Structure

```text
src/
  scenes/      # world scene + transitions
  systems/     # game state and progression systems
  entities/    # player and NPC entities
  ui/          # HUD, inventory, dialogue-toasts
  data/        # item and npc definitions
  utils/       # runtime pixel-art texture generation
assets/
  tilesets/
  sprites/
  ui/
  audio/
```

## Run (How to play)

1) Install dependencies:

```bash
npm install
```

2) Start the dev server:

```bash
npm run dev
```

3) Open the URL shown by Vite (usually `http://localhost:5173`).

4) Play in browser.

## Controls
- Arrow Keys: move
- Click: contextual action (till/plant/water/harvest, gather, place furniture)
- `E`: enter portals / talk to NPCs
- `F`: ship selected hotbar item
- `S`: sleep when on farm
- `1-5`: select hotbar slot
- `C`: use traveling cart on city days (Tue/Sat)
- `M`: equip rings in Jewelry Shop (if rings are in inventory)

## Quick gameplay loop
- Go to **Farm** from City.
- Click farm tiles to **till**.
- Select seeds in hotbar and click to **plant**.
- Click planted tiles to **water** (uses can capacity).
- Refill water at the **pond**.
- Sleep (`S`) to advance day and growth.
- Harvest and press `F` to ship items overnight.
- Visit **Mine** for scrap/ore and **City shops** for interiors.

## Implemented Vertical Slices
- **City Hub**: neon-metal palette, dense decor, moving NPCs, shop entrances
- **Farm Island**: tillable tiles, pond refill, crop growth, trees, shipping bin loop
- **Undercroft Mine**: scrap/ore nodes and industrial aesthetic
- **Interiors**: General, Blacksmith, Jewelry, Furniture, Medical spaces

## Systems Included
- Farming lifecycle with overnight growth
- Resource gathering (wood/scrap/ore)
- Watering can capacity + pond refill
- Inventory grid with drag-swap
- Time/day/week + pass out at 03:00
- Shipping bin overnight economy
- NPC wandering + simple dialogue + heart placeholder
- Jewelry ring slots with speed/maxHP buffs
- Traveling cart stock twice per week
- Data-driven item definitions
- Modular grid furniture placement (wall/floor item types)

## Notes
- All current prototype sprites/tiles are original runtime-generated pixel-art textures to keep style cohesive and easy to expand.
- Architecture is intentionally modular for follow-up expansion into larger maps, quests, and deeper NPC schedules.
