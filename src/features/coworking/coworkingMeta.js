// Metadata for the three coworking propertyType values already defined in
// convex/schema.ts (PROPERTY_TYPES). This module only adds display info -
// the source of truth for which types are valid stays in the backend.
export const COWORKING_PROPERTY_TYPES = [
  {
    value: "shared_desk",
    label: "Shared Desk Subscription",
    shortLabel: "Shared Desk",
    description:
      "An open, high-speed desk on a shared coworking floor - ideal for freelancers, remote workers, and small teams.",
  },
  {
    value: "private_cabin",
    label: "Private Cabin for Startups",
    shortLabel: "Private Cabin",
    description:
      "A lockable, private cabin inside a coworking floor - built for early-stage startup teams that need their own space.",
  },
  {
    value: "night_shift_coworking",
    label: "24/7 Night-Shift Coworking",
    shortLabel: "Night-Shift",
    description:
      "Round-the-clock access with backup power and security - built for teams working night shifts for international clients.",
  },
];

export const COWORKING_TYPE_LABEL = Object.fromEntries(
  COWORKING_PROPERTY_TYPES.map((t) => [t.value, t.label])
);

export const COWORKING_TYPE_SHORT_LABEL = Object.fromEntries(
  COWORKING_PROPERTY_TYPES.map((t) => [t.value, t.shortLabel])
);

/** Common coworking amenities, used to render a small icon next to each amenity string. */
export const AMENITY_ICON_KEYWORDS = [
  { keywords: ["wi-fi", "wifi", "internet", "fiber"], icon: "wifi" },
  { keywords: ["power", "ups", "backup", "generator"], icon: "bolt" },
  { keywords: ["print"], icon: "printer" },
  { keywords: ["coffee", "cafeteria", "tea"], icon: "coffee" },
  { keywords: ["security", "guard", "24/7", "access"], icon: "shield" },
  { keywords: ["lock", "private"], icon: "lock" },
  { keywords: ["meeting", "conference", "boardroom"], icon: "users" },
  { keywords: ["parking"], icon: "car" },
];

export function amenityIcon(amenity) {
  const lower = amenity.toLowerCase();
  const match = AMENITY_ICON_KEYWORDS.find((entry) =>
    entry.keywords.some((k) => lower.includes(k))
  );
  return match?.icon ?? "check";
}
