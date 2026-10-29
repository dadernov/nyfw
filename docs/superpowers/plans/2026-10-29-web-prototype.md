# NYFW Style Web Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clickable mobile web prototype of NYFW Style for client demos, all ТЗ scenarios on mock data.

**Architecture:** Vite SPA. Screens read data only through `src/data` services (`content`, `stylist`, `trips`) backed by mocks; demo state lives in a localStorage-backed store. Mobile full-screen on phones, iPhone frame on desktop.

**Tech Stack:** Vite 5, React 18, TypeScript, react-router-dom 6, framer-motion 11, lucide-react, Vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-29-web-prototype-design.md`

## Global Constraints

- UI language: English. No payments, no real AI, no backend, no auth.
- Palette tokens: `--ink #0B0B0B`, `--ivory #F7F3EC`, `--sand #D9CBB8`, `--champagne #B8976A`; fonts Playfair Display (headings), Inter (text/nav) via Google Fonts.
- Tabs: Home / Style / Closet / Shop / You.
- Images: Unsplash (free license) or local placeholders only; no runway photos from other sites.
- Every product: `https://` URL, price, currency, partner, `affiliate: boolean`; affiliate shown with an "Affiliate" label. Demo data marked "Demo".
- `<meta name="robots" content="noindex,nofollow">`.
- All localStorage access wrapped in try/catch; app works without it.

## Review Focus

- Empty Closet → Pack My Trip / Style still return results with "Not based on your wardrobe" note (Task 4, 5 tests).
- localStorage unavailable (private mode) → app renders, state in memory (Task 3 test).
- Regenerate pressed many times → never empty, never repeats immediately (Task 4 test).
- Deep link / page refresh on nested route (`/trends/:id`) → renders, unknown id → friendly not-found (Task 10 test; nginx `try_files` in Task 13).
- Guest skips onboarding → name falls back to "Guest", no crash on Home (Task 7 test).

---

### Task 1: Scaffold, design tokens, shell

**Files:** Create `package.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/styles/tokens.css`, `src/styles/global.css`, `src/shell/PhoneFrame.tsx`, `src/shell/TabBar.tsx`, `src/ui/*` (Button, Chip, Card, Screen, Header, Skeleton), `tests/shell.test.tsx`, `.gitignore`.

**Produces:** routes `/`, `/style`, `/closet`, `/shop`, `/you`, `/onboarding`; `<Screen title?>` wrapper; `<TabBar/>` hidden on `/onboarding`.

- [ ] Init git repo + Vite react-ts, install deps.
- [ ] Test: rendering `<App/>` at `/` shows 5 tab buttons labelled Home, Style, Closet, Shop, You; at `/onboarding` tab bar absent.
- [ ] Run `npx vitest run` → FAIL. Implement. → PASS.
- [ ] PhoneFrame: ≥ 600px viewport → centered 390×844 rounded frame on ivory backdrop; below → full screen.
- [ ] `npm run build` succeeds. Commit.

### Task 2: Content model and mock data

**Files:** `src/data/types.ts`, `src/data/mock/{trends,designers,products,looks,images}.ts`, `src/data/content.ts`, `tests/content.test.ts`.

**Produces:** types `Trend`, `Designer`, `Product`, `Look {id,title,why,items: ProductRef[],occasion,style,image}`; `content.getTrends()`, `getTrend(id)`, `getDesigners()`, `getDesigner(id)`, `getProducts(filter?)`, `getProduct(id)` — all `Promise`.

- [ ] Tests: every product URL starts with `https://`; every look/trend/designer product reference resolves; 8+ trends, 6+ designers, 30+ products, 12+ looks.
- [ ] Implement, PASS, commit.

### Task 3: Demo store

**Files:** `src/state/store.tsx`, `tests/store.test.tsx`.

**Produces:** `useDemo()` → `{profile, setProfile, saved, toggleSave(lookId), closet, addItem, removeItem, trips, saveTrip, reset()}`; key `nyfw-demo-v1`.

- [ ] Tests: state survives remount; `reset()` clears; with `localStorage.setItem` throwing, provider still renders and updates in memory.
- [ ] Implement, PASS, commit.

### Task 4: Mock stylist

**Files:** `src/data/stylist.ts`, `tests/stylist.test.ts`.

**Produces:** `generateLooks(req: StylistRequest, closet: ClosetItem[], round: number): Promise<{looks: Look[]; basedOnWardrobe: boolean}>`; `StylistRequest {occasion, style, budget, notes}`. Delay 1400 ms (0 in tests).

- [ ] Tests: returns 2–4 looks; matching occasion preferred; round n and n+1 differ for 10 rounds; empty closet → `basedOnWardrobe:false`; closet with matching category → a closet item included and flag true.
- [ ] Implement, PASS, commit.

### Task 5: Mock trip planner

**Files:** `src/data/trips.ts`, `tests/trips.test.ts`.

**Produces:** `buildTrip(req: TripRequest, closet): Promise<Trip>`; `TripRequest {destination, start, end, purpose, dressCodes[], luggage:'carry-on'|'suitcase', style, tempC?}`; `Trip {capsule, days: {date, looks}[], checklist: {id,group:'clothing'|'shoes'|'accessories'|'essentials',label,packed}[], missing, forecast, basedOnWardrobe}`.

- [ ] Tests: days count = date range inclusive; carry-on capsule ≤ suitcase capsule; manual `tempC` overrides forecast; empty closet → flag false and `missing` non-empty.
- [ ] Implement, PASS, commit.

### Task 6: Onboarding

**Files:** `src/screens/onboarding/*`, `tests/onboarding.test.tsx`.

- [ ] Splash → sign-in options (Apple/Google/Email/Guest) → steps: name, style, budget, brands, scenarios, consents → Home.
- [ ] Test: completing flow with name "Narine" lands on `/` showing "Welcome, Narine". Commit.

### Task 7: Home

**Files:** `src/screens/Home.tsx`, `tests/home.test.tsx`.

- [ ] Hero image, greeting, cards What to Wear Today / Pack My Trip / Trend Report / Designers to Watch / Saved looks.
- [ ] Test: guest with empty profile sees "Welcome, Guest"; each card navigates. Commit.

### Task 8: Style — What to Wear Today

**Files:** `src/screens/style/*`, `tests/style.test.tsx`.

- [ ] Form → animated "Styling…" → look carousel: collage, why, items, alternatives, Save / Regenerate / Shop Similar.
- [ ] Test: submit → looks appear; Save adds to saved; Shop Similar routes to `/shop?look=`. Commit.

### Task 9: Pack My Trip

**Files:** `src/screens/trip/*`, `tests/trip.test.tsx`.

- [ ] Params → capsule → day looks → checklist (check, remove, regenerate a day) → Save trip.
- [ ] Test: checking an item persists after remount. Commit.

### Task 10: Trend Report + Designers

**Files:** `src/screens/trends/*`, `src/screens/designers/*`, `tests/trends.test.tsx`.

- [ ] Feed with season/category chips → trend detail → "From Runway to Real Life" uses profile style; designers list/detail.
- [ ] Test: `/trends/unknown` shows "Not found" with back link. Commit.

### Task 11: Shop

**Files:** `src/screens/shop/*`, `tests/shop.test.tsx`.

- [ ] Grid with filters, product page, Affiliate label, "Open in partner store" demo sheet.
- [ ] Test: affiliate product shows label, non-affiliate doesn't. Commit.

### Task 12: Closet + You

**Files:** `src/screens/closet/*`, `src/screens/you/*`, `tests/closet.test.tsx`.

- [ ] Closet grid by category, add item (photo via file input, category, color), saved looks tab; You: profile, consents toggles, export (JSON download), delete account (confirm → reset), Reset demo.
- [ ] Test: added item appears; Reset demo empties closet and returns to onboarding. Commit.

### Task 13: Polish, repo, deploy

- [ ] Visual pass at 390px and desktop frame against the client mockup; screen transitions.
- [ ] Create private GitHub repo `nyfw-style` (API, stored token), push.
- [ ] Build; nginx site on VPS: new HTTPS subdomain, `try_files $uri /index.html`, `X-Robots-Tag: noindex`.
- [ ] Verify: link opens on phone, refresh on `/trends/<id>` works. Commit.
