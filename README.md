# AV Simulator

A lightweight single-page React game where you run school AV missions: deliveries, room unlocks, pickups, and a chained basketball filming shift.

## Stack
- React + Vite
- Pure client-side app (no backend, no login, no database)
- Local persistence with `localStorage`

## Local Dev
```bash
cd avsim
npm install
npm run dev
```

## Build / Preview
```bash
npm run build
npm run preview
```

## GitHub Pages (project repo)
This project is configured for a repo path like `/avsim/`.

1. In GitHub repo settings, enable Pages and select `GitHub Actions` as the source.
2. Push to `main`.
3. Workflow file: `.github/workflows/deploy.yml`.

## Data Files You Can Edit
All gameplay content is data-driven and intended for easy editing:

- Rooms: `src/data/rooms.js`
- Keys: `src/data/keys.js`
- Equipment: `src/data/equipment.js`
- Missions: `src/data/missions.js`
- Flavor text and event messages: `src/data/flavorText.js`
- Map area grouping: `src/data/mapAreas.js`

## Visual Admin Editor (`/admin`)
After deploy (or in local dev), open `/admin` (example: `/avsim/admin` on GitHub Pages).

- Loads the currently published data shipped with the app.
- Lets you add/remove/edit entries with forms (no JSON typing required).
- Download updated `rooms.js`, `keys.js`, `missions.js`, `flavorText.js`.
- Replace those files in `src/data/` and redeploy.

## Change GitHub Pages Base Path
Edit `BASE_PATH` in `vite.config.js`:

```js
const BASE_PATH = process.env.VITE_BASE_PATH || '/avsim/';
```

If your repository path is different (example `/my-school-av-game/`), update that string.

## Saved in localStorage
- Best shift score
- Fastest basketball filming shift
- Settings (difficulty, sound)
- Mission completion history
