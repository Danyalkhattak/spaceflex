# SpaceFlex Portal — Team 4

Convex + Clerk + Cloudinary backend for the SpaceFlex commercial real-estate
and coworking platform, plus the per-pillar React frontends built on top of
it (`src/`). Originally documented as backend-only (see Section 5); each
frontend pillar owner has since added their pages under `src/pages/<pillar>`
and `src/features/<pillar>`, following the Enterprise/Coworking pillars'
existing conventions:

- **Executive Hostels & Corporate Housing** (Raja Mubashir Azeem) —
  `src/pages/housing/`, `src/features/housing/` — IT Hostels (G-11
  Islamabad), Studio Apartments for Pros, Corporate Guest House Rentals.
  Instant-booking flow, same pattern as the Coworking pillar. Also required
  a backend fix — see the `BOOKING_TYPES` note under Architecture decisions.

```
convex/
├── schema.ts                 # all tables, indexes, search index, shared enums
├── auth.config.ts            # tells Convex to trust Clerk-issued JWTs
├── seed.ts                   # dev-only demo data across all 5 categories
├── lib/
│   ├── auth.ts                # getCurrentUser / requireUser / requireAdmin
│   ├── slug.ts                 # unique slug generation
│   └── validators.ts           # shared input validation
├── auth/
│   └── users.ts                # user sync + profile queries/mutations
├── admin/
│   └── permissions.ts          # promote/demote/bootstrap admin
├── properties/
│   ├── queries.ts               # public + admin property reads
│   ├── mutations.ts             # admin create/update/deactivate/delete
│   └── images.ts                # Cloudinary image metadata CRUD
├── search/
│   └── queries.ts               # search + filter + sort + paginate
├── bookings/
│   ├── queries.ts                # owner/admin booking reads
│   └── mutations.ts              # create/cancel/status update, server-priced
├── inquiries/
│   ├── queries.ts                 # owner/admin inquiry reads
│   └── mutations.ts               # create/status/notes
└── demoPayments/
    └── mutations.ts                # fake payment state machine
```

---

## 1. Setup

```bash
npm install
npx convex dev        # creates the Convex project, prints CONVEX_DEPLOYMENT
```

Then in the **Convex dashboard** (Settings → Environment Variables), set:

| Variable | Purpose |
|---|---|
| `CLERK_JWT_ISSUER_DOMAIN` | Clerk's issuer URL, used by `auth.config.ts` to verify JWTs |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Only needed if you later add a server-side action that deletes assets directly from Cloudinary storage |

In **Clerk dashboard**, create a JWT template named exactly `convex` (JWT
Templates → New template → Convex is a built-in option). See `.env.example`
for the full client vs. server variable breakdown — **never** put
`CLERK_SECRET_KEY` or any `CLOUDINARY_API_SECRET` in the React app.

To load demo data (all 5 categories, 24 sample properties):

```bash
npx convex run seed:runSeed
```

To create your first admin account:
1. Sign up through Clerk in the React app once it calls `auth/users:ensureUser`.
2. From the Convex dashboard data editor, find your new `users` row and copy its `_id`.
3. Run: `npx convex run admin/permissions:bootstrapFirstAdmin '{"userId":"<id>"}'`
4. Sign back in - the **Admin** link appears in the navbar and `/admin` becomes available.

### Troubleshooting: "UNAUTHENTICATED: You must be signed in to do this." after signing in

Clerk sign-in and Convex authentication are two separate things. Clerk owns the
UI session; Convex only trusts requests carrying a JWT it can verify against
`auth.config.ts`. If you can sign in but every mutation fails with
`UNAUTHENTICATED` (and `convex dev` logs show
`auth/users:ensureUser ... UNAUTHENTICATED`), the Clerk→Convex token bridge is
not configured. The app shows an amber "session can't reach the booking server"
banner and booking forms switch to a "Session not connected yet" state when this
is detected. Fix both halves:

1. **Clerk — JWT template**: dashboard → JWT Templates → add template named
   exactly `convex` (the built-in "Convex" template type is fine; it sets the
   `aud`/`applicationID` claim Convex checks). No template = the client can't
   get a token at all.
2. **Convex — issuer domain**: dashboard → Settings → Environment Variables →
   set `CLERK_JWT_ISSUER_DOMAIN` to your Clerk issuer URL (e.g.
   `https://your-app-123.clerk.accounts.dev`, no trailing slash), then restart
   `npx convex dev` so `auth.config.ts` is re-pushed with the new value.

Also check: the issuer domain matches the one Clerk actually issues tokens for
(the `iss` claim in the JWT), and `VITE_CLERK_PUBLISHABLE_KEY` +
`VITE_CONVEX_URL` are set in the app's `.env.local`.

---

## 1.5 Admin panel (React CRUD dashboard)

Once your account has the `admin` role, `/admin` provides full CRUD over the
platform - every screen is gated client-side by `AdminLayout` AND server-side
by `requireAdmin` (the client gate is cosmetic; the server never trusts it):

| Route | Screen | What it does |
|---|---|---|
| `/admin` | Dashboard | Counts, demo revenue, latest bookings/inquiries |
| `/admin/properties` | Properties | Search/filter all listings; feature/unfeature, deactivate/reactivate, delete (with confirm) |
| `/admin/properties/new` | New property | Create a listing (all schema fields, client + server validation) |
| `/admin/properties/:id/edit` | Edit property | Update any field; manage images (add by URL, Cloudinary upload when `VITE_CLOUDINARY_*` is set, set primary, remove) |
| `/admin/bookings` | Bookings | Filter by status, change booking status, refund demo payments |
| `/admin/inquiries` | Inquiries | Filter by status, move through the lifecycle, attach admin notes |
| `/admin/users` | Users | Promote/demote admins, deactivate/reactivate accounts (self-demotion/deactivation blocked) |

---

## 2. Architecture decisions

- **One `properties` table** for all five categories (coworking, office,
  virtual office, event venue, housing) as required — `category` +
  `propertyType` discriminate the row, so new subtypes can be added by
  extending the literal unions in `schema.ts` without a migration.
- **One `bookings` table** shared by every bookable category, and **one
  `inquiries` table** shared by leasing/virtual-office/housing requests —
  `property.isBookable` decides which flow a given property uses.
- **Identity always comes from Clerk**, never from client-supplied
  arguments. Every protected function calls `requireUser`/`requireAdmin`
  from `lib/auth.ts`, which reads `ctx.auth.getUserIdentity()` and looks up
  the matching `users` row by `clerkUserId`. There is no password table and
  no client-settable `role` or `userId` field anywhere.
- **Pricing is always server-computed.** `bookings/mutations.ts:createBooking`
  reads the property's current `price`/`pricePeriod`, computes billable
  units from the requested date range, and writes `unitPrice`/`totalAmount`
  itself — the client cannot pass either value in.
- **`BOOKING_TYPES` covers every bookable category, not just coworking.**
  `seed.ts` marks all three housing property types (`it_hostel`,
  `studio_apartment`, `corporate_guest_house`) `isBookable: true`, so
  `BOOKING_TYPES` in `schema.ts` includes those literals alongside the
  coworking/meeting-room/event-venue ones — otherwise `createBooking`'s arg
  validator would reject every housing booking before the handler ever ran.
- **Search** uses a Convex search index (`search_properties`) over a
  denormalized `searchText` field (title + description + location +
  category/type), so keyword queries run inside Convex and only the
  matching page is returned to the client — never the full table.
- **Cloudinary** stores only image binaries; Convex stores only
  `cloudinaryPublicId` + `secureUrl` + display metadata. Uploads happen
  browser → Cloudinary directly (unsigned preset); Convex just records the
  result via an admin-only mutation.
- **Demo payments** are an explicit fake state machine
  (`pending → demo_paid/failed → refunded`) and never touch real card data.

---

## 3. Frontend function contract

### Auth (`auth/users.ts`)
| Function | Type | Auth | Admin | Args | Returns |
|---|---|---|---|---|---|
| `ensureUser` | mutation | Clerk-signed-in | No | `{ name, phone? }` | `Id<"users">` |
| `getMyProfile` | query | Any | No | `{}` | `users` doc \| `null` |
| `updateMyProfile` | mutation | Yes | No | `{ name?, phone? }` | `void` |
| `adminListUsers` | query | Yes | Yes | `{ role? }` | `users[]` |
| `adminSetUserActive` | mutation | Yes | Yes | `{ userId, active }` | `void` |

### Admin (`admin/permissions.ts`)
| Function | Auth | Admin | Args | Errors |
|---|---|---|---|---|
| `promoteToAdmin` | Yes | Yes | `{ userId }` | `FORBIDDEN` if caller isn't admin |
| `demoteToCustomer` | Yes | Yes | `{ userId }` | `VALIDATION` if demoting self |
| `bootstrapFirstAdmin` | CLI only | n/a | `{ userId }` | `FORBIDDEN` if an admin already exists |

### Properties (`properties/queries.ts`, `properties/mutations.ts`, `properties/images.ts`)
| Function | Type | Auth | Admin | Args | Returns |
|---|---|---|---|---|---|
| `getFeaturedProperties` | query | No | No | `{ limit? }` | `properties[]` |
| `getProperties` | query | No | No | `{ category?, propertyType?, city?, area?, minPrice?, maxPrice?, minCapacity?, cursor?, pageSize? }` | `{ items, continueCursor, isDone }` |
| `getPropertyById` | query | No | No | `{ propertyId }` | doc \| `null` |
| `getPropertyBySlug` | query | No | No | `{ slug }` | doc \| `null` |
| `getCategories` / `getPropertyTypes` | query | No | No | `{}` | static metadata list |
| `adminGetAllProperties` | query | Yes | Yes | `{ includeInactive? }` | `properties[]` |
| `createProperty` | mutation | Yes | Yes | full property fields (see `schema.ts`) | `Id<"properties">` |
| `updateProperty` | mutation | Yes | Yes | `{ propertyId, ...partial fields }` | `Id<"properties">` |
| `deactivateProperty` / `reactivateProperty` | mutation | Yes | Yes | `{ propertyId }` | `void` |
| `deleteProperty` | mutation | Yes | Yes | `{ propertyId }` | `void`; errors `VALIDATION` if bookings/inquiries exist |
| `setFeaturedProperty` | mutation | Yes | Yes | `{ propertyId, isFeatured }` | `void` |
| `addPropertyImage` | mutation | Yes | Yes | `{ propertyId, cloudinaryPublicId, secureUrl, altText?, isPrimary? }` | `Id<"propertyImages">` |
| `removePropertyImage` | mutation | Yes | Yes | `{ imageId }` | `{ cloudinaryPublicId }` |
| `reorderPropertyImages` | mutation | Yes | Yes | `{ propertyId, orderedImageIds[] }` | `void` |
| `setPrimaryImage` | mutation | Yes | Yes | `{ propertyId, imageId }` | `void` |
| `getPropertyImages` / `getPrimaryPropertyImage` | query | No | No | `{ propertyId }` | image(s) |

### Search (`search/queries.ts`)
```
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
| Function | Type | Auth | Admin | Args | Notes |
|---|---|---|---|---|---|
| `getMyBookings` | query | Yes | No | `{}` | own bookings only |
| `getMyBookingById` | query | Yes | No | `{ bookingId }` | `NOT_FOUND` if not owner |
| `adminGetAllBookings` | query | Yes | Yes | `{ status?, propertyId? }` | |
| `adminGetBookingById` | query | Yes | Yes | `{ bookingId }` | |
| `createBooking` | mutation | Yes | No | `{ propertyId, bookingType, startDate, endDate, quantity, notes? }` | price computed server-side; returns `{ bookingId, totalAmount, currency }` |
| `cancelMyBooking` | mutation | Yes | No | `{ bookingId }` | owner only, blocks completed bookings |
| `adminUpdateBookingStatus` | mutation | Yes | Yes | `{ bookingId, status }` | |

### Demo payments (`demoPayments/mutations.ts`)
| Function | Auth | Admin | Args |
|---|---|---|---|
| `simulateDemoPayment` | Yes | No | `{ bookingId, outcome: "success" \| "failure" }` |
| `adminRefundDemoPayment` | Yes | Yes | `{ bookingId }` |

### Inquiries (`inquiries/queries.ts`, `inquiries/mutations.ts`)
| Function | Type | Auth | Admin | Args |
|---|---|---|---|---|
| `createInquiry` | mutation | Yes | No | `{ propertyId?, companyName?, message, inquiryType }` |
| `getMyInquiries` | query | Yes | No | `{}` |
| `getMyInquiryById` | query | Yes | No | `{ inquiryId }` |
| `getAllInquiries` | query | Yes | Yes | `{ status? }` |
| `getInquiryById` | query | Yes | Yes | `{ inquiryId }` |
| `updateInquiryStatus` | mutation | Yes | Yes | `{ inquiryId, status }` |
| `updateInquiryNotes` | mutation | Yes | Yes | `{ inquiryId, adminNotes }` |

All errors are thrown as `Error("CATEGORY: human-readable message")` where
`CATEGORY` is one of `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`,
`VALIDATION` — the frontend can pattern-match on the prefix or just display
the message directly; no internal details are ever included.

---

## 4. Security checklist (manual verification against SECTION 31)

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

### Suggested manual test script (run via `npx convex run` or a test client)
1. **Unauthenticated**: call `getMyBookings` without a Clerk session → expect `UNAUTHENTICATED`.
2. **Customer**: call `createProperty` → expect `FORBIDDEN`.
3. **Customer**: call `adminGetAllBookings` → expect `FORBIDDEN`.
4. **Customer A**: create a booking; **Customer B**: call `getMyBookingById` with A's id → expect `NOT_FOUND`.
5. **Customer**: call `createBooking` with a huge `quantity` on a low-capacity property → expect `VALIDATION`.
6. **Customer**: attempt to pass `totalAmount`/`price` as an argument to `createBooking` → argument is simply ignored/rejected by the validator (no such field exists in `args`).
7. **Admin**: `deactivateProperty`, then **Customer**: `createBooking` on it → expect `VALIDATION` ("not currently available").
8. **Admin**: `promoteToAdmin` on another user, confirm that user can now call `adminGetAllProperties`.
9. **Search**: `searchProperties({ query: "coworking" })` returns only `isActive: true` rows.

---

## 5. What's intentionally NOT included

- No real payment gateway — `demoPayments` is explicitly a simulation (the
  booking confirmation page shows the clearly-labeled demo payment screen).
- No server-side Cloudinary delete action wired up yet (only metadata CRUD);
  add a Convex `action` using `CLOUDINARY_API_SECRET` if/when actual asset
  deletion from Cloudinary storage is required — do not call Cloudinary's
  admin API from React.

(The React frontend under `src/` — pages, admin panel, styling — IS part of
this repo; the original "backend-only" scope note predates those pillars.)
