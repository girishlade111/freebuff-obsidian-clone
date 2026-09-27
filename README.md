# freebuff-obsidian-clone

A project starter for an **Obsidian-style markdown notes app** — scaffolded with freebuff.com/vly and wired end-to-end with a realtime backend and authentication. The foundation is fully set up (Vite + React 19 + Tailwind 4 + shadcn/ui on the frontend, Convex with auth on the backend); the notes/graph/editor screens are the next build step.

> Status: early scaffold. The landing page is a placeholder and the core Obsidian features (markdown editor, vault, graph view, backlinks) are not implemented yet — this repo is the working starting point for them.

## Vision

An Obsidian-like knowledge base app:

- Markdown notes with a vault/folder structure
- Live graph view of note links (Three.js is already a dependency)
- Backlinks, search, and tags
- Sync across devices via the realtime Convex backend

## Tech Stack

| Layer | Technology |
|---|---|
| Build | Vite 7, TypeScript |
| Frontend | React 19, React Router v7 |
| Styling | Tailwind CSS v4, shadcn/ui, Radix UI primitives |
| Icons | Lucide React |
| Animation | Framer Motion |
| 3D (graph view) | Three.js |
| Backend | Convex (realtime database + functions) |
| Auth | Convex Auth (email OTP + anonymous users) |
| AI integrations | @vly-ai/integrations (GPT completions via Convex actions) |
| Package manager | bun (per project convention) / npm |

## Quick Start

### 1. Prerequisites

- Node.js 18+ (or [bun](https://bun.sh))
- A [Convex](https://www.convex.dev) account — `npx convex dev` will prompt you to log in and will provision a dev deployment, setting `CONVEX_DEPLOYMENT` and `VITE_CONVEX_URL` automatically

### 2. Install and run

```bash
# with bun (project convention)
bun install
bun run dev

# or with npm
npm install
npm run dev
# open http://localhost:5173
```

### 3. Convex backend

```bash
npx convex dev   # syncs src/convex -> your Convex deployment, watches for changes
```

The client reads the deployment URL from `VITE_CONVEX_URL` (`src/main.tsx`). The convex server currently needs auth env vars: `JWKS`, `JWT_PRIVATE_KEY`, `SITE_URL` (see the existing README "Environment Variables" section).

Other scripts: `npm run build` (type-check + production build), `npm run preview`, `npm run lint`, `npm run format`.

## Project Structure

```
freebuff-obsidian-clone/
├── index.html               # app shell, manifest, title
├── src/
│   ├── main.tsx             # entry: Convex client, router, route lazy-loading
│   ├── pages/
│   │   ├── Landing.tsx      # placeholder landing (replace with real home/vault page)
│   │   ├── Auth.tsx         # sign-in page (Convex Auth, OTP + anonymous)
│   │   └── NotFound.tsx
│   ├── convex/              # backend: schema, auth, users, http actions
│   │   ├── schema.ts        # data model (currently: users table)
│   │   ├── auth.ts / auth.config.ts
│   │   └── users.ts / http.ts
│   ├── components/ui/       # shadcn/ui primitives
│   ├── hooks/               # use-auth, use-mobile
│   └── lib/                 # utils, vly-integrations
├── convex.json              # Convex project config
├── integrations.md          # VLY AI/email/payment integration guide
└── vite.config.ts           # Vite + Tailwind v4 config
```

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `CONVEX_DEPLOYMENT` | client (auto-set by `npx convex dev`) | which Convex deployment to use |
| `VITE_CONVEX_URL` | client (`.env.local`) | Convex client URL, consumed in `src/main.tsx` |
| `JWKS` / `JWT_PRIVATE_KEY` / `SITE_URL` | Convex dashboard | auth keys for Convex Auth |
| `VLY_INTEGRATION_KEY` / `VLY_INTEGRATION_BASE_URL` | client | AI/email/payment gateway via freebuff integrations |

## Deployment

Not deployed yet — skipped on purpose: the app requires a live Convex deployment plus auth secrets, and the core notes-app UI is still to be built. A static export alone would not work.

Planned path: finish the vault/editor/graph screens → `npx convex deploy` for the backend → host the Vite `dist/` on GitHub Pages / Netlify / Cloudflare Pages with `VITE_CONVEX_URL` set to the production deployment.

## Roadmap

- [ ] Vault: folders, note CRUD, markdown editor
- [ ] Graph view (Three.js) of note links
- [ ] Backlinks panel, full-text search, tags
- [ ] Real landing page replacing the placeholder
- [ ] Production Convex deploy + static hosting

## License

No license file is present in this repository. All rights reserved by the author unless stated otherwise.

---

Built by Girish Lade — https://ladestack.in
