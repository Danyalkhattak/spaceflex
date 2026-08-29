import { ConvexReactClient } from "convex/react";

// Read from Vite env (see .env.example). Both may be blank in a fresh
// checkout until `npx convex dev` + Clerk are configured locally - the app
// renders a setup notice instead of crashing when that's the case (see
// src/main.jsx).
export const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const isBackendConfigured = Boolean(CONVEX_URL && CLERK_PUBLISHABLE_KEY);

export const convex = CONVEX_URL ? new ConvexReactClient(CONVEX_URL) : null;
