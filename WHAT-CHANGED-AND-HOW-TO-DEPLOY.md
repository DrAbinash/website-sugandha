# What changed & how to deploy

## What you asked for
1. **Admin settings login** so features, images, and details can be changed → done
2. **Change the colour** from green to a feminine rose-gold → done

## The colour is now rose gold
The whole site palette changed from teal/green to a warm **rose gold**:
- Primary: `#a34355` (deep rose) · Hover: `#853a49` (mauve) · Accent: `#c9a24b` (champagne gold)
- This flows through every button, badge, heading accent, the hero background, and the browser theme colour.
- It's the new default — you don't have to do anything to get it.

## The admin panel (built-in Settings)
Go to **`http://192.168.1.137:3009/admin`** (on the clinic network) or
**`https://carediagnostics.in/admin`** (from the internet).

- **Temporary password:** `sugandha2026`
- **Change it:** edit `docker-compose.yml`, line `ADMIN_PASSWORD=sugandha2026`, then rebuild.

Six tabs let you edit everything without touching code:
Doctor & About · Contact & Hours · Hospital & Map · Services & Expertise ·
Photos & Facilities · Stats & Social. You can upload the doctor's photo and all
gallery/facility images straight from the panel — they're saved on the same
Docker volume as the database, so they survive rebuilds.

Click **Save changes**, then refresh the website tab to see updates. There's a
**Reset to defaults** button if you ever want to undo everything.

## How to deploy on your Synology
```bash
cd /volume1/docker/website-sugandha
git pull                          # (or copy these files in)
docker compose up -d --build
```
The build will run `prisma db push` automatically (via the entrypoint), which
creates the new settings table the admin panel uses.

## Notes on the "keep docker files the same" request
- **Dockerfile:** untouched.
- **docker-compose.yml:** the only additions are two new lines the admin panel
  needs — `ADMIN_PASSWORD` (your login) and `UPLOADS_DIR` (where photos are
  stored). Nothing else was changed. These were already present in the version
  you sent; they're required for the login and image upload to work.

## What was verified
- Full TypeScript type-check: clean (0 errors)
- Next.js production build: compiled successfully
- ESLint on all new/changed files: clean
  (The 2 lint notes in `src/hooks/use-mobile.ts` are pre-existing boilerplate,
  unrelated to these changes, and don't affect the build.)

## Files added/changed for these two features
Added: the `/admin` page, admin API routes (login, settings, upload, image
serving), admin helper components, and the small libraries behind them.
Changed: the theme colours (`globals.css`, `tailwind.config.ts`,
`site.config.ts`), the page layout to load your saved settings, the Prisma
schema to store settings, and the editing guide.
