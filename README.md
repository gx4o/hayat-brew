# Hayat Brew ☕

حاسبة وصفات القهوة ودليل التحضير الموجّه للعائلة — عربي بالكامل، RTL-first، مصمم لجوال iPhone ولوضع المطبخ الأفقي على iPad.

**Production:** https://hayat-brew.vercel.app

## What it does

Choose a brewing method (coffee machine / V60) → hot or iced → serving unit (كوب 200ml / مق 323ml) → quantity (0.5 steps) → get an exact calculated recipe → optionally start guided step-by-step brewing with a circular timer, wake lock, and an iPad-landscape kitchen mode.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 |
| Database | Supabase PostgreSQL (recipe definitions, RLS read-only for anon) |
| Hosting | Vercel (auto-deploy from `main`) |
| Fonts | Thmanyah Sans + Serif Display (licensed — see Fonts) |
| PWA | Installable, offline app shell via service worker |

## Architecture

```
src/
  lib/
    recipe-engine/     # Pure TS calculation engine + vitest suite (no DB, no UI)
    data.ts            # Supabase → engine-type mappers
    illustrations.ts   # Official artwork registry + step-art mapping
    favorites.ts       # localStorage favorites (selection only, never results)
    settings.ts        # Timer sound/vibration, wake lock prefs
    arabic.ts          # Natural Arabic quantity phrasing (كوبين، 3 أكواب ونص)
  app/
    page.tsx                       # Home: greeting, method cards, last brew, favorites
    recipes/  settings/            # Recipe list · functional preferences
    brew/[equipment]/              # URL-driven wizard: ?style=&unit= (+qty)
    brew/[equipment]/result/       # Calculated recipe (splits on iPad landscape)
    brew/[equipment]/guide/        # Guided brewing + kitchen mode
supabase/migrations/               # Schema + seeded family recipes
```

**Key principle:** all amounts are calculated by `calculateRecipe()` from recipe definitions stored per one reference serving (200 ml). Last-brew and favorites store the *selection* only — numbers are always recalculated live, never cached.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the two public Supabase values
npm run dev                  # http://localhost:3000
npm test                     # recipe engine QA suite (29 tests)
```

### Environment variables

| Variable | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` + Vercel | public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` + Vercel | public — data is protected by RLS, writes are denied |
| `FONTS_ARCHIVE_URL` | `.env.local` + Vercel | signed URL to the private fonts archive (see Fonts) |

Never use or commit the Supabase `service_role` key anywhere in this project.

## Fonts (important)

The Thmanyah typeface license **forbids redistributing font files**, and this repo is public — so the fonts are never committed:

- `src/fonts/` is gitignored; locally the files just live there.
- On Vercel, `scripts/fetch-fonts.mjs` (npm `prebuild`) downloads `hayat-brew-fonts.tar.gz` from a **private Supabase Storage bucket** via the signed `FONTS_ARCHIVE_URL` and unpacks it before the build.
- If the signed URL expires (~yearly), create a new one from Supabase Storage → `assets` bucket and update the env var in Vercel + `.env.local`.

## Database

Five tables: `equipment`, `serving_units`, `recipes`, `recipe_ingredients`, `recipe_steps`. Recipes are data-driven (ingredients are open-ended slugs, steps carry optional timers and cumulative pour fractions) so a future custom-recipe builder needs no schema change. RLS: public `select` only — there are no write policies.

Apply schema changes via the Supabase CLI:

```bash
supabase link --project-ref <ref>   # once
supabase db push                    # applies supabase/migrations/*
```

## Deploy flow

```
edit locally → git commit → git push → Vercel builds & deploys main
```

Preview deployments: push any non-main branch and Vercel creates a preview URL.

## Testing

- `npm test` — engine suite covering every QA case in the spec (ratios, mug scaling, pour stages, placeholder resolution, edge quantities).
- Manual device QA: iPhone portrait, iPad landscape kitchen mode, PWA install, offline reload, timer vibration/sound, reduced-motion.
