# HisabKitab — Tiffin Attendance Ledger

A mobile-first tiffin (dabba) attendance & billing app, built with **Next.js (App Router) + TypeScript + Tailwind CSS**. The visual language borrows from the Indian *bahi-khata* ledger book — ruled paper, a red margin rule, ink-stamp branding — to match what "Hisab-Kitab" (हिसाब-किताब, "accounts") actually means.

The API is real and backed by a real **Postgres database via Prisma** — not mocked, not in-memory. Next.js Route Handlers under `app/api/*` are the actual server, `prisma/schema.prisma` defines the three tables from the brief, and `prisma/seed.js` seeds sample customers, prices, and ~3 weeks of attendance history so the app isn't empty on first run. This is the ready-to-deploy version.

## Getting started (local)

1. **Get a Postgres database.** Any of these give you a free connection string in under a minute:
   - [Neon](https://neon.tech) (recommended — serverless, generous free tier, works great with Vercel)
   - [Supabase](https://supabase.com)
   - [Railway](https://railway.app)
   - or a local Postgres via Docker: `docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres`

2. **Set your connection string.**
   ```bash
   cp .env.example .env
   # then edit .env and paste your real DATABASE_URL
   ```

3. **Install, push the schema, seed sample data:**
   ```bash
   npm install          # also runs `prisma generate` automatically
   npm run db:push       # creates the users / tiffin_types / attendance tables
   npm run db:seed       # inserts sample customers, prices, and attendance history
   ```

4. **Run it:**
   ```bash
   npm run dev
   ```

Open http://localhost:3000 — best viewed at mobile width (or open dev tools device mode).

> Note: `npm install` runs `prisma generate` behind the scenes, which downloads a small query-engine binary the first time. This needs normal internet access — it will fail in fully offline/sandboxed environments, but works out of the box locally and on Vercel/Railway/etc.

## Pages

| Route | Purpose |
|---|---|
| `/` | Dashboard — totals for Today / Week / Month + last 7 days |
| `/attendance` | Mark Lunch/Dinner (Full · Half · Chapati) per customer, per day |
| `/customers` | Add/edit tiffin holders, toggle active/inactive |
| `/pricing` | Edit the price of Full / Half / Only Chapati |
| `/reports` | Date-range billing: totals, daily breakdown, per-customer summary + bill drill-down |

## Data model (matches the brief exactly)

```
users          — id, name, phone, is_active, created_at, updated_at
tiffin_types   — id, name, code, price, is_active, created_at, updated_at
attendance     — id, user_id, date, meal, tiffin_type_id, quantity, price, created_at, updated_at
                 UNIQUE(user_id, date, meal)
```

`attendance.price` is snapshotted from `tiffin_types.price` at creation time, so historical bills stay correct even after a price change (see `/pricing`'s footnote). `date` is stored as a plain `"YYYY-MM-DD"` string rather than a timestamp, to avoid timezone-shift bugs — it's always reasoned about as a calendar day. The `UNIQUE(user_id, date, meal)` constraint is enforced by Postgres itself (`@@unique([user_id, date, meal])` in the Prisma schema); a duplicate `POST /api/attendance` returns `409`.

## API surface

```
GET    /api/customers            ?active=true|false
GET    /api/customers/:id
POST   /api/customers            { name, phone? }
PATCH  /api/customers/:id        { name?, phone?, is_active? }

GET    /api/tiffin-types
PATCH  /api/tiffin-types/:id     { price?, name?, is_active? }

GET    /api/attendance           ?date= | ?from=&to= | &user_id= | &meal=
POST   /api/attendance           { user_id, date, meal, tiffin_type_id, quantity? }
PATCH  /api/attendance/:id       { tiffin_type_id?, quantity? }
DELETE /api/attendance/:id

GET    /api/reports/summary          ?from=&to=
GET    /api/reports/customer/:id     ?from=&to=

GET    /api/dashboard             ?from=&to=
```

Every route responds `{ data: ... }` on success or `{ error: "..." }` with a non-2xx status on failure. All of this is wrapped by `lib/api-client.ts`, which is what every page actually imports — never `fetch` directly. The frontend has not changed at all from the mock-API version; only what's behind `app/api/**` changed.

## Deploying (e.g. Vercel)

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Add one environment variable in the Vercel project settings: `DATABASE_URL` (use the **pooled** connection string if your provider gives you one — Neon and Supabase both do; serverless functions open lots of short-lived connections, and pooling avoids exhausting your DB's connection limit).
4. Deploy. Prisma's `postinstall` hook runs `prisma generate` automatically during the build.
5. Push the schema to your production database once (from your machine, pointed at the prod `DATABASE_URL`): `npm run db:push`, then optionally `npm run db:seed` if you want sample data in prod too.

That's it — no other code changes needed to go live.

## Useful scripts

```bash
npm run db:push      # sync prisma/schema.prisma to the database (good for prototyping)
npm run db:migrate   # create a tracked migration file instead (better for real production changes)
npm run db:seed      # (re)seed sample data — wipes and recreates all rows
npm run db:studio    # opens Prisma Studio, a GUI to browse/edit your data
```

## Tech

- Next.js 14 (App Router, Route Handlers)
- TypeScript
- **Prisma ORM + PostgreSQL**
- Tailwind CSS (custom "ledger" theme: paper, ink, ruled-line colors, tiffin-type accent colors)
- lucide-react icons
