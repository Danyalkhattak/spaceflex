/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin_permissions from "../admin/permissions.js";
import type * as auth_users from "../auth/users.js";
import type * as bookings_mutations from "../bookings/mutations.js";
import type * as bookings_queries from "../bookings/queries.js";
import type * as demoPayments_mutations from "../demoPayments/mutations.js";
import type * as inquiries_mutations from "../inquiries/mutations.js";
import type * as inquiries_queries from "../inquiries/queries.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_slug from "../lib/slug.js";
import type * as lib_validators from "../lib/validators.js";
import type * as properties_images from "../properties/images.js";
import type * as properties_mutations from "../properties/mutations.js";
import type * as properties_queries from "../properties/queries.js";
import type * as search_queries from "../search/queries.js";
import type * as seed from "../seed.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "admin/permissions": typeof admin_permissions;
  "auth/users": typeof auth_users;
  "bookings/mutations": typeof bookings_mutations;
  "bookings/queries": typeof bookings_queries;
  "demoPayments/mutations": typeof demoPayments_mutations;
  "inquiries/mutations": typeof inquiries_mutations;
  "inquiries/queries": typeof inquiries_queries;
  "lib/auth": typeof lib_auth;
  "lib/slug": typeof lib_slug;
  "lib/validators": typeof lib_validators;
  "properties/images": typeof properties_images;
  "properties/mutations": typeof properties_mutations;
  "properties/queries": typeof properties_queries;
  "search/queries": typeof search_queries;
  seed: typeof seed;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
