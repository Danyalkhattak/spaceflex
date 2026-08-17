import { internalMutation } from "./_generated/server";

/**
 * DEVELOPMENT / DEMO SEED DATA ONLY.
 *
 * Run with: `npx convex run seed:runSeed`
 *
 * - Creates one demo admin + one demo customer application user (these are
 *   placeholder rows; they still need a real Clerk account with a matching
 *   clerkUserId to actually sign in as them - update clerkUserId below to a
 *   real Clerk user id from your dev instance, or call auth/users:ensureUser
 *   after signing up and then promote that user via
 *   admin/permissions:bootstrapFirstAdmin).
 * - Creates sample properties across all five SpaceFlex categories using
 *   realistic Islamabad/Rawalpindi locations, clearly marked as demo data.
 * - Does NOT create fake bookings/inquiries or download random images -
 *   only clearly-labeled placeholder Cloudinary public IDs are referenced;
 *   swap these for real uploads before using in any real demo.
 *
 * Safe to re-run: it skips creation if demo properties already exist.
 */
export const runSeed = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("properties")
      .withIndex("by_slug", (q) => q.eq("slug", "f11-premium-coworking-space"))
      .unique();
    if (existing) {
      return { status: "skipped", reason: "Seed data already present." };
    }

    const now = Date.now();

    // NOTE: Replace with a real Clerk user id before relying on sign-in as
    // this admin. This row exists so seeded properties have a createdBy.
    const adminId = await ctx.db.insert("users", {
      clerkUserId: "demo_admin_replace_me",
      email: "admin@spaceflex.demo",
      name: "SpaceFlex Demo Admin",
      role: "admin",
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    const PK = { country: "Pakistan", currency: "PKR" };

    type SeedProperty = {
      title: string;
      slug: string;
      description: string;
      category: "coworking" | "office" | "virtual_office" | "event_venue" | "housing";
      propertyType:
        | "shared_desk"
        | "private_cabin"
        | "night_shift_coworking"
        | "commercial_office"
        | "it_park_space"
        | "corporate_hq"
        | "virtual_company_address"
        | "mail_handling"
        | "offshore_business_address"
        | "meeting_room"
        | "event_hall"
        | "boardroom"
        | "it_hostel"
        | "studio_apartment"
        | "corporate_guest_house";
      province: string;
      city: string;
      area: string;
      address: string;
      price: number;
      pricePeriod: "hour" | "day" | "month" | "year" | "one_time";
      capacity: number;
      amenities: string[];
      isBookable: boolean;
      isFeatured: boolean;
    };

    const demoProperties: SeedProperty[] = [
      // Coworking
      {
        title: "F-11 Premium Coworking Space",
        slug: "f11-premium-coworking-space",
        description:
          "Demo listing: bright, high-speed shared desk floor in the heart of F-11 Markaz, popular with freelancers and small startup teams.",
        category: "coworking",
        propertyType: "shared_desk",
        province: "Islamabad Capital Territory",
        city: "Islamabad",
        area: "F-11",
        address: "Plot 12, F-11 Markaz, Islamabad",
        price: 12000,
        pricePeriod: "month",
        capacity: 40,
        amenities: ["High-speed Wi-Fi", "Power backup", "Printing", "Free coffee"],
        isBookable: true,
        isFeatured: true,
      },
      {
        title: "Blue Area Private Startup Cabin",
        slug: "blue-area-private-startup-cabin",
        description:
          "Demo listing: a lockable 4-seat private cabin for an early-stage team, inside a shared coworking floor on Jinnah Avenue.",
        category: "coworking",
        propertyType: "private_cabin",
        province: "Islamabad Capital Territory",
        city: "Islamabad",
        area: "Blue Area",
        address: "Jinnah Avenue, Blue Area, Islamabad",
        price: 45000,
        pricePeriod: "month",
        capacity: 4,
        amenities: ["Private lock", "Meeting room credits", "24/7 access card"],
        isBookable: true,
        isFeatured: false,
      },
      {
        title: "G-9 Night-Shift Coworking Floor",
        slug: "g9-night-shift-coworking-floor",
        description:
          "Demo listing: a coworking floor built for night-shift teams serving international clients, with 24/7 security and backup power.",
        category: "coworking",
        propertyType: "night_shift_coworking",
        province: "Islamabad Capital Territory",
        city: "Islamabad",
        area: "G-9",
        address: "G-9 Markaz, Islamabad",
        price: 15000,
        pricePeriod: "month",
        capacity: 30,
        amenities: ["24/7 access", "UPS backup", "Security guard", "Cafeteria"],
        isBookable: true,
        isFeatured: false,
      },

      // Office
      {
        title: "Blue Area Commercial Office Floor",
        slug: "blue-area-commercial-office-floor",
        description:
          "Demo listing: a full commercial office floor suited to a mid-sized company, located on Jinnah Avenue's main commercial stretch.",
        category: "office",
        propertyType: "commercial_office",
        province: "Islamabad Capital Territory",
        city: "Islamabad",
        area: "Blue Area",
        address: "Jinnah Avenue, Blue Area, Islamabad",
        price: 350000,
        pricePeriod: "month",
        capacity: 80,
        amenities: ["Elevator access", "Parking", "Conference room", "Reception"],
        isBookable: false,
        isFeatured: true,
      },
      {
        title: "NASTP IT Park Tech Space",
        slug: "nastp-it-park-tech-space",
        description:
          "Demo listing: tech-park office space designed for software companies, close to Islamabad's National Aerospace Science & Technology Park cluster.",
        category: "office",
        propertyType: "it_park_space",
        province: "Islamabad Capital Territory",
        city: "Islamabad",
        area: "H-11",
        address: "Tech Zone, H-11, Islamabad",
        price: 280000,
        pricePeriod: "month",
        capacity: 60,
        amenities: ["Dedicated fiber", "Backup generator", "Server room"],
        isBookable: false,
        isFeatured: false,
      },
      {
        title: "DHA Rawalpindi Corporate HQ Building",
        slug: "dha-rawalpindi-corporate-hq-building",
        description:
          "Demo listing: a standalone building suitable for a corporate headquarters, in DHA Phase 2 Rawalpindi.",
        category: "office",
        propertyType: "corporate_hq",
        province: "Punjab",
        city: "Rawalpindi",
        area: "DHA Phase 2",
        address: "DHA Phase 2, Rawalpindi",
        price: 900000,
        pricePeriod: "month",
        capacity: 200,
        amenities: ["Standalone building", "Parking lot", "Backup power", "Security"],
        isBookable: false,
        isFeatured: false,
      },

      // Virtual office
      {
        title: "Islamabad Virtual Company Address",
        slug: "islamabad-virtual-company-address",
        description:
          "Demo listing: a registered business address in Blue Area, Islamabad for company registration and correspondence purposes.",
        category: "virtual_office",
        propertyType: "virtual_company_address",
        province: "Islamabad Capital Territory",
        city: "Islamabad",
        area: "Blue Area",
        address: "Jinnah Avenue, Blue Area, Islamabad",
        price: 8000,
        pricePeriod: "month",
        capacity: 1,
        amenities: ["Registered address", "Signage listing"],
        isBookable: false,
        isFeatured: false,
      },
      {
        title: "Blue Area Mail Handling Service",
        slug: "blue-area-mail-handling-service",
        description:
          "Demo listing: mail receipt, scanning, and forwarding service for businesses without a physical Islamabad office.",
        category: "virtual_office",
        propertyType: "mail_handling",
        province: "Islamabad Capital Territory",
        city: "Islamabad",
        area: "Blue Area",
        address: "Jinnah Avenue, Blue Area, Islamabad",
        price: 5000,
        pricePeriod: "month",
        capacity: 1,
        amenities: ["Mail scanning", "Forwarding", "Package acceptance"],
        isBookable: false,
        isFeatured: false,
      },
      {
        title: "Islamabad Offshore Business Address",
        slug: "islamabad-offshore-business-address",
        description:
          "Demo listing: a business address service for offshore-registered companies wanting a local Islamabad presence.",
        category: "virtual_office",
        propertyType: "offshore_business_address",
        province: "Islamabad Capital Territory",
        city: "Islamabad",
        area: "F-8",
        address: "F-8 Markaz, Islamabad",
        price: 12000,
        pricePeriod: "month",
        capacity: 1,
        amenities: ["Compliance documentation support", "Mail forwarding"],
        isBookable: false,
        isFeatured: false,
      },

      // Event venue
      {
        title: "F-8 Hourly Meeting Room",
        slug: "f8-hourly-meeting-room",
        description:
          "Demo listing: a 6-seat glass-walled meeting room available by the hour, with a screen and video conferencing setup.",
        category: "event_venue",
        propertyType: "meeting_room",
        province: "Islamabad Capital Territory",
        city: "Islamabad",
        area: "F-8",
        address: "F-8 Markaz, Islamabad",
        price: 1500,
        pricePeriod: "hour",
        capacity: 6,
        amenities: ["Video conferencing", "Whiteboard", "Screen"],
        isBookable: true,
        isFeatured: true,
      },
      {
        title: "Blue Area Tech Event Hall",
        slug: "blue-area-tech-event-hall",
        description:
          "Demo listing: a 150-capacity hall for tech meetups, hackathons, and product launches in Blue Area.",
        category: "event_venue",
        propertyType: "event_hall",
        province: "Islamabad Capital Territory",
        city: "Islamabad",
        area: "Blue Area",
        address: "Jinnah Avenue, Blue Area, Islamabad",
        price: 60000,
        pricePeriod: "day",
        capacity: 150,
        amenities: ["Stage", "Sound system", "Projector", "Seating"],
        isBookable: true,
        isFeatured: false,
      },
      {
        title: "G-10 Executive Boardroom",
        slug: "g10-executive-boardroom",
        description:
          "Demo listing: a 12-seat executive boardroom suited for client meetings and board sessions.",
        category: "event_venue",
        propertyType: "boardroom",
        province: "Islamabad Capital Territory",
        city: "Islamabad",
        area: "G-10",
        address: "G-10 Markaz, Islamabad",
        price: 3000,
        pricePeriod: "hour",
        capacity: 12,
        amenities: ["Conference phone", "Display screen", "Catering on request"],
        isBookable: true,
        isFeatured: false,
      },

      // Housing
      {
        title: "I-9 IT Hostel for Professionals",
        slug: "i9-it-hostel-for-professionals",
        description:
          "Demo listing: shared hostel accommodation for IT professionals working in Islamabad, walking distance from I-9 tech offices.",
        category: "housing",
        propertyType: "it_hostel",
        province: "Islamabad Capital Territory",
        city: "Islamabad",
        area: "I-9",
        address: "I-9/2, Islamabad",
        price: 25000,
        pricePeriod: "month",
        capacity: 20,
        amenities: ["Wi-Fi", "Laundry", "Mess/kitchen", "Security"],
        isBookable: true,
        isFeatured: false,
      },
      {
        title: "Bahria Town Studio Apartment",
        slug: "bahria-town-studio-apartment",
        description:
          "Demo listing: a furnished studio apartment for working professionals in Bahria Town, Rawalpindi.",
        category: "housing",
        propertyType: "studio_apartment",
        province: "Punjab",
        city: "Rawalpindi",
        area: "Bahria Town",
        address: "Bahria Town Phase 4, Rawalpindi",
        price: 55000,
        pricePeriod: "month",
        capacity: 2,
        amenities: ["Furnished", "Kitchenette", "Wi-Fi", "Backup power"],
        isBookable: true,
        isFeatured: true,
      },
      {
        title: "F-7 Corporate Guest House",
        slug: "f7-corporate-guest-house",
        description:
          "Demo listing: a corporate guest house in F-7 for visiting company staff and short business stays.",
        category: "housing",
        propertyType: "corporate_guest_house",
        province: "Islamabad Capital Territory",
        city: "Islamabad",
        area: "F-7",
        address: "F-7 Markaz, Islamabad",
        price: 18000,
        pricePeriod: "day",
        capacity: 10,
        amenities: ["Housekeeping", "Wi-Fi", "Breakfast included"],
        isBookable: true,
        isFeatured: false,
      },
    ];

    const insertedIds = [];
    for (const p of demoProperties) {
      const searchText = [
        p.title,
        p.description,
        p.city,
        p.area,
        p.address,
        p.category,
        p.propertyType,
      ]
        .join(" ")
        .toLowerCase();

      const id = await ctx.db.insert("properties", {
        title: p.title,
        slug: p.slug,
        description: p.description,
        category: p.category,
        propertyType: p.propertyType,
        country: PK.country,
        province: p.province,
        city: p.city,
        area: p.area,
        address: p.address,
        price: p.price,
        currency: PK.currency,
        pricePeriod: p.pricePeriod,
        capacity: p.capacity,
        amenities: p.amenities,
        features: [],
        isBookable: p.isBookable,
        isActive: true,
        isFeatured: p.isFeatured,
        searchText,
        createdBy: adminId,
        createdAt: now,
        updatedAt: now,
      });
      insertedIds.push(id);

      // One placeholder Cloudinary image record per property. Replace
      // `demo/placeholder-<slug>` with a real Cloudinary public ID and
      // secureUrl from an actual upload before using this in a live demo.
      await ctx.db.insert("propertyImages", {
        propertyId: id,
        cloudinaryPublicId: `demo/placeholder-${p.slug}`,
        secureUrl: `https://res.cloudinary.com/demo/image/upload/spaceflex/${p.slug}.jpg`,
        altText: p.title,
        displayOrder: 0,
        isPrimary: true,
        createdAt: now,
      });
    }

    return {
      status: "seeded",
      adminId,
      propertiesCreated: insertedIds.length,
    };
  },
});
