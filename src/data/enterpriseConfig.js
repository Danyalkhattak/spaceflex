// Config for the Enterprise Office Space Leasing pillar's three sub-pages.
// Keeping this in one place means CommercialOfficeFloors.jsx,
// ITParkTechSpace.jsx and CorporateHQLeasing.jsx can each be a thin wrapper
// around the shared <EnterpriseCategoryPage /> instead of duplicating markup
// and query logic three times.
//
// `propertyType` values match the existing PROPERTY_TYPES literals already
// defined in convex/schema.ts - no new property types were introduced.

export const ENTERPRISE_CATEGORIES = {
  "commercial-office-floors": {
    slug: "commercial-office-floors",
    propertyType: "commercial_office",
    navLabel: "Commercial Office Floors",
    heroEyebrow: "Enterprise Office Leasing",
    heroTitle: "Commercial Office Floors",
    heroSubtitle:
      "Fully fitted and unfurnished office floors for mid-to-large teams, in premium commercial districts with reception, meeting rooms, and dedicated parking.",
    intro:
      "Browse commercial office floors ready for a company to move in or fit out to its own specification. Every listing below includes floor capacity, amenities, and availability, and can be leased directly through an enterprise leasing inquiry.",
    highlightAmenities: [
      "Meeting rooms",
      "Conference facilities",
      "Reception",
      "Security",
      "High-speed internet",
      "Backup generator",
      "Parking",
      "Furnished",
    ],
  },
  "it-park-tech-space": {
    slug: "it-park-tech-space",
    propertyType: "it_park_space",
    navLabel: "IT Park & Tech Space",
    heroEyebrow: "Enterprise Office Leasing",
    heroTitle: "IT Park & Tech Space Rentals",
    heroSubtitle:
      "Office space purpose-built for software and technology companies inside Pakistan's leading tech parks and campuses, with server rooms and 24/7 access.",
    intro:
      "Explore technology-park and IT-campus office space designed around what software teams actually need: dedicated server rooms, redundant internet, and round-the-clock access. Send an inquiry to lock in a floor for your engineering team.",
    highlightAmenities: [
      "Server room",
      "24/7 access",
      "High-speed internet",
      "Backup generator",
      "Security",
      "Conference rooms",
      "Cafeteria",
      "Nearby facilities",
    ],
  },
  "corporate-hq": {
    slug: "corporate-hq",
    propertyType: "corporate_hq",
    navLabel: "Corporate HQ Leasing",
    heroEyebrow: "Enterprise Office Leasing",
    heroTitle: "Corporate HQ Leasing",
    heroSubtitle:
      "Standalone buildings and executive campuses for companies leasing a full corporate headquarters, with executive offices, boardrooms, and long lease terms.",
    intro:
      "These are premium, full-building leases suited to a company headquarters: executive office suites, a boardroom, dedicated parking, and enterprise-grade security. Our leasing team handles site visits and lease-term negotiation directly.",
    highlightAmenities: [
      "Executive offices",
      "Boardroom",
      "Conference rooms",
      "Reception",
      "Security",
      "Backup power",
      "Parking lot",
      "Furnishing",
    ],
  },
};

export const ENTERPRISE_CATEGORY_LIST = Object.values(ENTERPRISE_CATEGORIES);

// Inquiry "reason" options shown in the inquiry form. Several map to the
// same underlying `enterprise_office` inquiryType (the specific sub-page is
// already captured by the propertyId/propertyType on the listing itself),
// while the last two map to the two general-purpose literals added to
// INQUIRY_TYPES in schema.ts for this module.
export const ENTERPRISE_INQUIRY_REASONS = [
  { value: "commercial_office_leasing", inquiryType: "enterprise_office", label: "Commercial Office Leasing" },
  { value: "it_park_leasing", inquiryType: "enterprise_office", label: "IT Park / Tech Space Leasing" },
  { value: "corporate_hq_leasing", inquiryType: "enterprise_office", label: "Corporate HQ Leasing" },
  { value: "general_enterprise", inquiryType: "enterprise_office", label: "General Enterprise Leasing Inquiry" },
  { value: "property_info", inquiryType: "property_info_request", label: "Property Information Request" },
  { value: "site_visit", inquiryType: "site_visit_request", label: "Site Visit Request" },
];
