<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0a2038,100:b8935a&height=150&section=header&animation=fadeIn" width="100%" alt="wave"/>

<br/>

<a href="https://github.com/Danyalkhattak/spaceflex">
  <img src="public/spaceflex-logo.png" alt="SpaceFlex — Pakistan's flexible workspace portal" width="380"/>
</a>

<br/><br/>

<a href="https://github.com/Danyalkhattak/spaceflex">
  <img src="https://readme-typing-svg.demolab.com?font=Outfit:wght@600&size=22&pause=1400&color=B8935A&center=true&vCenter=true&width=700&height=60&lines=Pakistan%27s+flexible+workspace+portal;Coworking+%E2%80%A2+Enterprise+Offices+%E2%80%A2+Executive+Housing;Browse+%E2%86%92+Compare+%E2%86%92+Book+in+minutes;Built+with+React+19+%2B+Convex+%2B+Clerk" alt="Typing SVG"/>
</a>

<br/>

<!-- tech stack badges -->
![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite 8](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React Router 7](https://img.shields.io/badge/React_Router_7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Convex](https://img.shields.io/badge/Backend-Convex-2D2D2D?style=for-the-badge&logo=convex&logoColor=EC4E7A)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)

<!-- repo badges -->
![GitHub stars](https://img.shields.io/github/stars/Danyalkhattak/spaceflex?style=for-the-badge&logo=github&labelColor=0A2038)
![GitHub forks](https://img.shields.io/github/forks/Danyalkhattak/spaceflex?style=for-the-badge&logo=github&labelColor=0A2038)
![GitHub issues](https://img.shields.io/github/issues/Danyalkhattak/spaceflex?style=for-the-badge&logo=github&labelColor=0A2038)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-22C55E?style=for-the-badge&logo=github&labelColor=0A2038)
![Deploys](https://img.shields.io/badge/Auto_Deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

<br/>

</div>

---

## 🧭 Table of Contents

- [🧐 About](#-about)
- [✨ Features](#-features)
- [🧱 Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🔑 Environment Variables](#-environment-variables)
- [🛡️ Admin Panel](#%EF%B8%8F-admin-panel)
- [📁 Project Structure](#-project-structure)
- [📜 Scripts](#-scripts)
- [🏗️ Architecture Decisions](#%EF%B8%8F-architecture-decisions)
- [📖 API Function Contract](#-api-function-contract)
- [🔒 Security Model](#-security-model)
- [🧯 Troubleshooting](#-troubleshooting)
- [🗺️ Roadmap](#%EF%B8%8F-roadmap)
- [🚢 Deployment](#-deployment)
- [👥 Team](#-team)

---

## 🧐 About

**SpaceFlex** is a full-stack commercial real-estate and coworking platform for
Pakistan — one portal that covers the full spectrum from a single shared desk
to a complete corporate headquarters. Customers browse five listing
categories, compare amenities and pricing, and book instantly; enterprise
leasing runs through a managed inquiry flow with site visits handled end to
end. Everything is backed by a serverless **Convex** backend with
**Clerk**-verified identity, server-computed pricing, and an admin dashboard
with full CRUD over the platform.

| 📊 | 📊 | 📊 | 📊 |
|:---:|:---:|:---:|:---:|
| **24+** curated live listings | **5** cities covered | **24/7** night-shift access | **< 5 min** average booking time |

| Pillar | Route | What it covers |
|---|---|---|
| 🪑 **Coworking & Desks** | `/coworking` | Shared desks, private startup cabins, 24/7 night-shift floors with backup power — instant monthly booking |
| 🏢 **Enterprise Offices** | `/enterprise-office` | Fitted commercial floors, IT-park tech space, full corporate HQs — leased end to end through our team |
| 🛏️ **Executive Housing** | `/housing` | IT hostels, studio apartments, corporate guest houses for relocating teams and travelling professionals |
| 💼 **Virtual Offices & Event Venues** | `/coworking` | Business addresses and bookable venues, sharing the same properties backend |

---

## ✨ Features

| ✨ | Feature | 📋 What you get |
|:---:|---|---|
| 🔍 | **Indexed search** | Keyword search + filter + sort + pagination runs inside Convex via a search index — only the matching page ever reaches the client |
| ⚡ | **Instant booking** | Server-priced monthly bookings (`unitPrice`/`totalAmount` computed on the server, never trusted from the client) |
| 💳 | **Demo payments** | Explicit fake payment state machine (`pending → demo_paid/failed → refunded`) — clearly labeled, never touches real card data |
| 🛡️ | **Admin dashboard** | Full CRUD over properties, bookings, inquiries and users — gated client-side *and* server-side by `requireAdmin` |
| 📨 | **Inquiry lifecycle** | Enterprise / virtual-office / housing requests move through status transitions with private admin notes |
| ☁️ | **Cloudinary images** | Browser-direct unsigned uploads; Convex stores only URL + public-id metadata — never binaries or secrets |
| 🔐 | **Clerk auth bridge** | Clerk owns the UI session; Convex only trusts JWTs it can verify via `auth.config.ts` + the `convex` JWT template |
| 🧾 | **Typed error contract** | Every backend error is `CATEGORY: message` (`UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION`) — safe to show users |
| 🎨 | **Custom design system** | Tailwind v4 theme tokens (navy `#0a2038` + bronze `#b8935a`), vector logo, animated footer orbit scene, blueprint hero |
| 📱 | **Responsive by default** | Mobile-first layouts from 375 px phones to desktop, with reduced-motion support |

---

## 🧱 Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=react,ts,vite,tailwind,netlify,eslint&theme=dark" alt="React, TypeScript, Vite, Tailwind, Netlify, ESLint"/><br/><br/>

![Convex](https://img.shields.io/badge/Convex-Realtime_Backend-2D2D2D?style=flat-square&logo=convex&logoColor=EC4E7A)
![Clerk](https://img.shields.io/badge/Clerk-Authentication-6C47FF?style=flat-square&logo=clerk&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_CDN-3448C5?style=flat-square&logo=cloudinary&logoColor=white)

</div>

| Layer | Technology | Notes |
|---|---|---|
| Frontend | **React 19 + Vite 8** | SPA with React Router v7, code-split admin area |
| Styling | **Tailwind CSS v4** | `@theme` tokens, custom keyframe animations, blueprint-grid utilities |
| Backend | **Convex** | TypeScript functions, search index, reactive queries |
| Auth | **Clerk** | Session UI + JWT template bridged into Convex verification |
| Images | **Cloudinary** | Browser-direct unsigned uploads, metadata stored in Convex |
| Hosting | **Netlify** | Auto-deploy from `main`, SPA fallback rewrite, cache + security headers |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `^20.19.0` or `>=22.12.0` (Vite 8 requirement)
- A free [Convex](https://convex.dev) account
- A free [Clerk](https://clerk.com) account

### 1 · Install & launch the backend

```bash
git clone https://github.com/Danyalkhattak/spaceflex.git
cd spaceflex
npm install

npx convex dev        # creates the Convex project, prints CONVEX_DEPLOYMENT
```

In the **Convex dashboard** (Settings → Environment Variables), set
`CLERK_JWT_ISSUER_DOMAIN` to your Clerk issuer URL (see
[Troubleshooting](#-troubleshooting) for why this matters).

### 2 · Configure the client

```bash
cp .env.example .env.local
```

Fill in at least `VITE_CONVEX_URL` (printed by `npx convex dev`) and
`VITE_CLERK_PUBLISHABLE_KEY`. See [Environment Variables](#-environment-variables)
for the full breakdown.

In the **Clerk dashboard**, create a JWT template named exactly `convex`
(JWT Templates → New template → the built-in **Convex** type is fine).

### 3 · Load demo data & run

```bash
npm run seed          # 24 sample properties across all 5 categories
npm run dev           # → http://localhost:5173
```

<details>
<summary><b>👑 Create your first admin account</b> (click to expand)</summary>

1. Sign up through Clerk in the React app once it calls `auth/users:ensureUser`.
2. From the Convex dashboard data editor, find your new `users` row and copy its `_id`.
3. Run:

   ```bash
   npx convex run admin/permissions:bootstrapFirstAdmin '{"userId":"<id>"}'
   ```

4. Sign back in — the **Admin** link appears in the navbar and `/admin` becomes available.

</details>

---

## 🔑 Environment Variables

### Client — `.env.local` (safe to expose to the browser)

| Variable | Purpose |
|---|---|
| `VITE_CONVEX_URL` | Convex deployment URL read by the React client via `import.meta.env` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (session UI only) |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud for unsigned browser uploads (optional) |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Matching unsigned upload preset (optional) |
| `CONVEX_DEPLOYMENT` | Used by the Convex CLI only — never read by the browser |

### Server — Convex dashboard environment variables (NEVER in the React app)

| Variable | Purpose |
|---|---|
| `CLERK_JWT_ISSUER_DOMAIN` | Clerk issuer URL used by `auth.config.ts` to verify JWTs — no trailing slash |
| `CLERK_SECRET_KEY` | Only if a server-side Clerk integration is added later |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Only for a future Convex `action` that deletes assets directly from Cloudinary storage |

> [!WARNING]
> Never put `CLERK_SECRET_KEY` or any `CLOUDINARY_API_SECRET` in the React
> app — only `VITE_*` variables ever reach the browser bundle.

---

## 🛡️ Admin Panel

Once your account has the `admin` role, `/admin` provides full CRUD over the
platform — every screen is gated client-side by `AdminLayout` **and**
server-side by `requireAdmin` (the client gate is cosmetic; the server never
trusts it):

| Route | Screen | What it does |
|---|---|---|
| `/admin` | 📊 Dashboard | Counts, demo revenue, latest bookings/inquiries |
| `/admin/properties` | 🏢 Properties | Search/filter all listings; feature/unfeature, deactivate/reactivate, delete (with confirm) |
| `/admin/properties/new` | ➕ New property | Create a listing (all schema fields, client + server validation) |
| `/admin/properties/:id/edit` | ✏️ Edit property | Update any field; manage images (add by URL, Cloudinary upload, set primary, remove) |
| `/admin/bookings` | 📅 Bookings | Filter by status, change booking status, refund demo payments |
| `/admin/inquiries` | 📨 Inquiries | Filter by status, move through the lifecycle, attach admin notes |
| `/admin/users` | 👥 Users | Promote/demote admins, deactivate/reactivate accounts (self-demotion/deactivation blocked) |

---

## 📁 Project Structure

```text
spaceflex/
├── convex/                     # backend (TypeScript)
│   ├── schema.ts               # all tables, indexes, search index, shared enums
│   ├── auth.config.ts          # tells Convex to trust Clerk-issued JWTs
│   ├── seed.ts                 # dev-only demo data across all 5 categories
│   ├── lib/                    # auth guards (getCurrentUser/requireUser/requireAdmin), slugs, validators
│   ├── auth/users.ts           # user sync + profile queries/mutations
│   ├── admin/permissions.ts    # promote/demote/bootstrap admin
│   ├── properties/             # public + admin reads, mutations, image metadata CRUD
│   ├── search/queries.ts       # indexed search + filter + sort + paginate
│   ├── bookings/               # owner/admin reads, server-priced mutations
│   ├── inquiries/              # inquiry lifecycle + admin notes
│   └── demoPayments/           # fake payment state machine
├── src/
│   ├── components/             # ui (Logo, Button, Icon, Badge…) + layout (Navbar, Footer, FooterOrbit)
│   ├── features/               # per-pillar booking forms & filters (coworking / housing)
│   ├── pages/                  # HomePage, list/detail pages, admin/, enterprise/, housing/
│   ├── hooks/ lib/ utils/      # shared client logic
│   └── index.css               # Tailwind v4 theme tokens & keyframe animations
├── netlify.toml                # SPA fallback rewrite + cache/security headers
└── .env.example                # full client vs. server variable breakdown
```

---

## 📜 Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over the repo |
| `npm run convex:dev` | Convex dev sync (functions + generated client) |
| `npm run convex:deploy` | Push functions to the production deployment |
| `npm run seed` | Seed 24 demo properties across all 5 categories |
| `npm run seed:images` | Upload demo property images to Cloudinary |

---

## 🏗️ Architecture Decisions

- 🗄️ **One `properties` table** for all five categories (coworking, office,
  virtual office, event venue, housing) — `category` + `propertyType`
  discriminate the row, so new subtypes can be added by extending the literal
  unions in `schema.ts` without a migration.
- 📅 **One `bookings` table** shared by every bookable category, and **one
  `inquiries` table** shared by leasing/virtual-office/housing requests —
  `property.isBookable` decides which flow a given property uses.
- 🪪 **Identity always comes from Clerk**, never from client-supplied
  arguments. Every protected function calls `requireUser`/`requireAdmin`
  from `lib/auth.ts`, which reads `ctx.auth.getUserIdentity()` and looks up
  the matching `users` row by `clerkUserId`. There is no password table and
  no client-settable `role` or `userId` field anywhere.
- 💰 **Pricing is always server-computed.** `bookings/mutations.ts:createBooking`
  reads the property's current `price`/`pricePeriod`, computes billable
  units from the requested date range, and writes `unitPrice`/`totalAmount`
  itself — the client cannot pass either value in.
- 🛏️ **`BOOKING_TYPES` covers every bookable category, not just coworking.**
  `seed.ts` marks all three housing property types (`it_hostel`,
  `studio_apartment`, `corporate_guest_house`) `isBookable: true`, so
  `BOOKING_TYPES` in `schema.ts` includes those literals alongside the
  coworking/meeting-room/event-venue ones — otherwise `createBooking`'s arg
  validator would reject every housing booking before the handler ever ran.
- 🔎 **Search** uses a Convex search index (`search_properties`) over a
  denormalized `searchText` field (title + description + location +
  category/type), so keyword queries run inside Convex and only the
  matching page is returned to the client — never the full table.
- ☁️ **Cloudinary** stores only image binaries; Convex stores only
  `cloudinaryPublicId` + `secureUrl` + display metadata. Uploads happen
  browser → Cloudinary directly (unsigned preset); Convex just records the
  result via an admin-only mutation.
- 💳 **Demo payments** are an explicit fake state machine
  (`pending → demo_paid/failed → refunded`) and never touch real card data.

---

## 📖 API Function Contract

<details>
<summary><b>🔓 Public / customer functions</b> (click to expand)</summary>

### Auth (`auth/users.ts`)

| Function | Type | Auth | Admin | Args | Returns |
|---|---|---|---|---|---|
| `ensureUser` | mutation | Clerk-signed-in | No | `{ name, phone? }` | `Id<"users">` |
| `getMyProfile` | query | Any | No | `{}` | `users` doc \| `null` |
| `updateMyProfile` | mutation | Yes | No | `{ name?, phone? }` | `void` |

### Properties (`properties/queries.ts`, `properties/images.ts`)

| Function | Type | Auth | Args | Returns |
|---|---|---|---|---|
| `getFeaturedProperties` | query | No | `{ limit? }` | `properties[]` |
| `getProperties` | query | No | `{ category?, propertyType?, city?, area?, minPrice?, maxPrice?, minCapacity?, cursor?, pageSize? }` | `{ items, continueCursor, isDone }` |
| `getPropertyById` | query | No | `{ propertyId }` | doc \| `null` |
| `getPropertyBySlug` | query | No | `{ slug }` | doc \| `null` |
| `getCategories` / `getPropertyTypes` | query | No | `{}` | static metadata list |
| `getPropertyImages` / `getPrimaryPropertyImage` | query | No | `{ propertyId }` | image(s) |

### Search (`search/queries.ts`)

```text
searchProperties
Auth: No
Args: {
  query?: string, category?, propertyType?, city?, area?,
  minPrice?: number, maxPrice?: number, minCapacity?: number,
  sortBy?: "newest" | "price_asc" | "price_desc",
  pageSize?: number, cursor?: string
}
Returns: { items: Property[], continueCursor?: string, hasMore: boolean }
```

### Bookings (`bookings/queries.ts`, `bookings/mutations.ts`)

| Function | Type | Auth | Args | Notes |
|---|---|---|---|---|
| `getMyBookings` | query | Yes | `{}` | own bookings only |
| `getMyBookingById` | query | Yes | `{ bookingId }` | `NOT_FOUND` if not owner |
| `createBooking` | mutation | Yes | `{ propertyId, bookingType, startDate, endDate, quantity, notes? }` | price computed server-side; returns `{ bookingId, totalAmount, currency }` |
| `cancelMyBooking` | mutation | Yes | `{ bookingId }` | owner only, blocks completed bookings |

### Inquiries (`inquiries/queries.ts`, `inquiries/mutations.ts`)

| Function | Type | Auth | Args |
|---|---|---|---|
| `createInquiry` | mutation | Yes | `{ propertyId?, companyName?, message, inquiryType }` |
| `getMyInquiries` | query | Yes | `{}` |
| `getMyInquiryById` | query | Yes | `{ inquiryId }` |

### Demo payments (`demoPayments/mutations.ts`)

| Function | Auth | Args |
|---|---|---|
| `simulateDemoPayment` | Yes | `{ bookingId, outcome: "success" \| "failure" }` |

</details>

<details>
<summary><b>🛡️ Admin functions</b> (click to expand)</summary>

### Admin (`admin/permissions.ts`)

| Function | Auth | Admin | Args | Errors |
|---|---|---|---|---|
| `promoteToAdmin` | Yes | Yes | `{ userId }` | `FORBIDDEN` if caller isn't admin |
| `demoteToCustomer` | Yes | Yes | `{ userId }` | `VALIDATION` if demoting self |
| `bootstrapFirstAdmin` | CLI only | n/a | `{ userId }` | `FORBIDDEN` if an admin already exists |

### Users / Properties / Bookings / Inquiries

| Function | Type | Args | Notes |
|---|---|---|---|
| `adminListUsers` | query | `{ role? }` | list users by role |
| `adminSetUserActive` | mutation | `{ userId, active }` | activate/deactivate accounts |
| `adminGetAllProperties` | query | `{ includeInactive? }` | full listing table |
| `createProperty` | mutation | full property fields (see `schema.ts`) | returns `Id<"properties">` |
| `updateProperty` | mutation | `{ propertyId, ...partial fields }` | partial update |
| `deactivateProperty` / `reactivateProperty` | mutation | `{ propertyId }` | availability toggle |
| `deleteProperty` | mutation | `{ propertyId }` | errors `VALIDATION` if bookings/inquiries exist |
| `setFeaturedProperty` | mutation | `{ propertyId, isFeatured }` | homepage featuring |
| `addPropertyImage` | mutation | `{ propertyId, cloudinaryPublicId, secureUrl, altText?, isPrimary? }` | records Cloudinary metadata |
| `removePropertyImage` | mutation | `{ imageId }` | returns `{ cloudinaryPublicId }` |
| `reorderPropertyImages` / `setPrimaryImage` | mutation | `{ propertyId, orderedImageIds[] }` / `{ propertyId, imageId }` | gallery management |
| `adminGetAllBookings` / `adminGetBookingById` | query | `{ status?, propertyId? }` / `{ bookingId }` | booking oversight |
| `adminUpdateBookingStatus` | mutation | `{ bookingId, status }` | lifecycle control |
| `adminRefundDemoPayment` | mutation | `{ bookingId }` | demo refunds |
| `getAllInquiries` / `getInquiryById` | query | `{ status? }` / `{ inquiryId }` | inquiry oversight |
| `updateInquiryStatus` / `updateInquiryNotes` | mutation | `{ inquiryId, status }` / `{ inquiryId, adminNotes }` | lifecycle + notes |

All errors are thrown as `Error("CATEGORY: human-readable message")` where
`CATEGORY` is one of `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`,
`VALIDATION` — the frontend can pattern-match on the prefix or just display
the message directly; no internal details are ever included.

</details>

---

## 🔒 Security Model

Verified by code review of `lib/auth.ts` and every function file:

- [x] Every admin-only function calls `requireAdmin`, which re-derives role
      from the `users` table via the verified Clerk identity — never from
      client input.
- [x] `createBooking` computes `unitPrice`/`totalAmount` from the stored
      `property.price`, ignoring any client-supplied price.
- [x] `createBooking`/`createInquiry` set `userId` from `requireUser`, never
      from arguments — a client cannot create a booking/inquiry "as" another
      user.
- [x] `getMyBookingById` / `getMyInquiryById` return `NOT_FOUND` (not
      `FORBIDDEN`) for another customer's record, so IDs can't be probed.
- [x] `adminGetAllBookings` / `getAllInquiries` require `requireAdmin`; there
      is no customer-facing "list all" query.
- [x] There is no mutation anywhere that lets a user set their own `role`.
      `promoteToAdmin` requires an existing admin caller; `bootstrapFirstAdmin`
      only works when zero admins exist and is intended to be run from the
      CLI, not exposed as a client-callable action from the app's UI flows.
- [x] `simulateDemoPayment` is scoped to the caller's own booking and only
      transitions `pending → demo_paid/failed`; a customer cannot directly
      set `paymentStatus` via any other mutation.
- [x] `deleteProperty` refuses to run if bookings/inquiries reference the
      property, preventing orphaned history.

<details>
<summary><b>🧪 Suggested manual test script</b> (click to expand)</summary>

Run via `npx convex run` or a test client:

1. **Unauthenticated**: call `getMyBookings` without a Clerk session → expect `UNAUTHENTICATED`.
2. **Customer**: call `createProperty` → expect `FORBIDDEN`.
3. **Customer**: call `adminGetAllBookings` → expect `FORBIDDEN`.
4. **Customer A**: create a booking; **Customer B**: call `getMyBookingById` with A's id → expect `NOT_FOUND`.
5. **Customer**: call `createBooking` with a huge `quantity` on a low-capacity property → expect `VALIDATION`.
6. **Customer**: attempt to pass `totalAmount`/`price` as an argument to `createBooking` → argument is simply ignored/rejected by the validator (no such field exists in `args`).
7. **Admin**: `deactivateProperty`, then **Customer**: `createBooking` on it → expect `VALIDATION` ("not currently available").
8. **Admin**: `promoteToAdmin` on another user, confirm that user can now call `adminGetAllProperties`.
9. **Search**: `searchProperties({ query: "coworking" })` returns only `isActive: true` rows.

</details>

---

## 🧯 Troubleshooting

<details>
<summary><b>⚠️ "UNAUTHENTICATED: You must be signed in to do this." after signing in</b> (click to expand)</summary>

Clerk sign-in and Convex authentication are two separate things. Clerk owns
the UI session; Convex only trusts requests carrying a JWT it can verify
against `auth.config.ts`. If you can sign in but every mutation fails with
`UNAUTHENTICATED` (and `convex dev` logs show
`auth/users:ensureUser ... UNAUTHENTICATED`), the Clerk→Convex token bridge
is not configured. The app shows an amber "session can't reach the booking
server" banner and booking forms switch to a "Session not connected yet"
state when this is detected. Fix both halves:

1. **Clerk — JWT template**: dashboard → JWT Templates → add template named
   exactly `convex` (the built-in "Convex" template type is fine; it sets the
   `aud`/`applicationID` claim Convex checks). No template = the client can't
   get a token at all.
2. **Convex — issuer domain**: dashboard → Settings → Environment Variables →
   set `CLERK_JWT_ISSUER_DOMAIN` to your Clerk issuer URL (e.g.
   `https://your-app-123.clerk.accounts.dev`, no trailing slash), then restart
   `npx convex dev` so `auth.config.ts` is re-pushed with the new value.

Also check: the issuer domain matches the one Clerk actually issues tokens
for (the `iss` claim in the JWT), and `VITE_CLERK_PUBLISHABLE_KEY` +
`VITE_CONVEX_URL` are set in the app's `.env.local`.

</details>

---

## 🗺️ Roadmap

- [ ] 💳 Real payment gateway behind the demo payment state machine
- [ ] 🗑️ Server-side Cloudinary asset deletion via a Convex `action`
- [ ] ⭐ Saved favorites & recently viewed listings
- [ ] 🗺️ Map-based property search
- [ ] 🔔 Email notifications for booking & inquiry status changes

## ⚠️ What's Intentionally NOT Included

- **No real payment gateway** — `demoPayments` is explicitly a simulation
  (the booking confirmation page shows the clearly-labeled demo payment
  screen).
- **No server-side Cloudinary delete action** wired up yet (only metadata
  CRUD); add a Convex `action` using `CLOUDINARY_API_SECRET` if/when actual
  asset deletion from Cloudinary storage is required — do not call
  Cloudinary's admin API from React.

## 🚢 Deployment

The app auto-deploys to **Netlify** on every push to `main`:

- Build command `npm run build`, publish directory `dist`, Node 22 pinned.
- `netlify.toml` ships a SPA fallback rewrite (`/* → /index.html`,
  status 200) so deep links like `/admin` never 404 on refresh.
- Hashed Vite assets get immutable caching; `index.html` is never cached.
- Security headers (`X-Frame-Options`, `nosniff`, `Referrer-Policy`,
  `Permissions-Policy`) are applied to every response.

## 👥 Team

**SpaceFlex Portal — Team 4**

| Pillar | Owner | Where |
|---|---|---|
| 🏢 Enterprise & coworking pillars (baseline conventions) | Team 4 | `src/pages/enterprise/`, `src/features/coworking/` |
| 🛏️ Executive Hostels & Corporate Housing | Raja Mubashir Azeem | `src/pages/housing/`, `src/features/housing/` |
| 🎨 Platform, design system, admin & branding | [@Danyalkhattak](https://github.com/Danyalkhattak) | `src/`, `convex/` |

Each frontend pillar owner added their pages under `src/pages/<pillar>` and
`src/features/<pillar>`, following the Enterprise/Coworking pillars'
existing conventions.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:b8935a,100:0a2038&height=120&section=footer&animation=fadeIn" width="100%" alt="wave"/>

<br/>

Made with ❤️ by **Team 4** — if SpaceFlex helped you, please ⭐ the repo!

<br/>

</div>
