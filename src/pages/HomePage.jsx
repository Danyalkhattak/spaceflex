import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Icon from "../components/ui/Icon.jsx";
import Badge from "../components/ui/Badge.jsx";
import { COWORKING_PROPERTY_TYPES } from "../features/coworking/coworkingMeta.js";

const PLAN_ICONS = {
  shared_desk: "users2",
  private_cabin: "key",
  night_shift_coworking: "moon",
};

const PILLARS = [
  {
    to: "/coworking",
    icon: "users2",
    title: "Coworking & Desks",
    tint: "bg-blue-50 text-blue-600 ring-blue-100",
    description:
      "Shared desks, private startup cabins, and 24/7 night-shift floors with backup power — book instantly by the month.",
    bullets: ["Instant monthly booking", "Night-shift friendly", "Amenity-rich floors"],
  },
  {
    to: "/enterprise-office",
    icon: "briefcase",
    title: "Enterprise Offices",
    tint: "bg-brand-50 text-brand-600 ring-brand-100",
    description:
      "Fitted commercial floors, IT-park tech space, and full corporate HQs — leased end to end through our team.",
    bullets: ["Full floors to HQs", "Inquiry-based leasing", "Site visits arranged"],
  },
  {
    to: "/housing",
    icon: "home",
    title: "Executive Housing",
    tint: "bg-bronze-50 text-bronze-600 ring-bronze-100",
    description:
      "IT hostels, studio apartments, and corporate guest houses for relocating teams and travelling professionals.",
    bullets: ["Team-ready stays", "Flexible terms", "Corporate servicing"],
  },
];

const STATS = [
  { value: "24+", label: "Curated live listings" },
  { value: "5", label: "Cities covered" },
  { value: "24/7", label: "Night-shift access" },
  { value: "<5 min", label: "Average booking time" },
];

/* Architectural floor-plan illustration for the hero panel. Decorative only. */
const DESK_GRID = [
  [70, 120], [150, 120], [230, 120],
  [70, 195], [150, 195], [230, 195],
  [70, 270], [150, 270], [230, 270],
];

const FloorPlan = () => (
  <svg
    viewBox="0 0 520 380"
    fill="none"
    aria-hidden="true"
    className="absolute inset-0 h-full w-full"
    preserveAspectRatio="xMidYMid meet"
  >
    {/* outer wall */}
    <rect x="28" y="36" width="464" height="308" rx="10" stroke="#94a3b8" strokeOpacity="0.55" strokeWidth="2" />

    {/* partition walls with door gaps */}
    <path d="M348 36 V96 M348 136 V212 M348 252 V344" stroke="#94a3b8" strokeOpacity="0.45" strokeWidth="2" />
    <path d="M348 212 H414 M458 212 H492" stroke="#94a3b8" strokeOpacity="0.45" strokeWidth="2" />

    {/* meeting room: table + chairs */}
    <ellipse cx="419" cy="128" rx="52" ry="28" stroke="#c9a56e" strokeOpacity="0.85" strokeWidth="1.8" />
    {[
      [419, 88], [455, 108], [455, 148], [419, 168], [383, 148], [383, 108],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="7" stroke="#94a3b8" strokeOpacity="0.55" strokeWidth="1.5" />
    ))}

    {/* private cabin: desk + visitor chairs */}
    <rect x="380" y="270" width="80" height="30" rx="5" stroke="#94a3b8" strokeOpacity="0.55" strokeWidth="1.5" />
    <circle cx="396" cy="316" r="6" stroke="#94a3b8" strokeOpacity="0.45" strokeWidth="1.5" />
    <circle cx="444" cy="316" r="6" stroke="#94a3b8" strokeOpacity="0.45" strokeWidth="1.5" />

    {/* open desks: 3x3 grid, one highlighted as "yours" */}
    {DESK_GRID.map(([x, y], i) => (
      <g key={i}>
        <rect
          x={x}
          y={y}
          width="46"
          height="28"
          rx="4"
          stroke={i === 4 ? "#d8b783" : "#94a3b8"}
          strokeOpacity={i === 4 ? "0.95" : "0.5"}
          strokeWidth={i === 4 ? "2" : "1.5"}
          fill={i === 4 ? "#b8935a" : "none"}
          fillOpacity={i === 4 ? "0.28" : "0"}
        />
        <rect x={x + 15} y={y + 34} width="16" height="7" rx="3" stroke="#94a3b8" strokeOpacity="0.4" strokeWidth="1.4" />
      </g>
    ))}
    {/* pin above the highlighted desk */}
    <path d="M173 96 C173 96 165 86 165 80 A8 8 0 1 1 181 80 C181 86 173 96 173 96 Z" fill="#c9a56e" />
    <circle cx="173" cy="80" r="3" fill="#0a2038" />

    {/* labels */}
    <text x="46" y="332" fontSize="10" letterSpacing="3" fill="#94a3b8" fillOpacity="0.8" fontFamily="inherit">OPEN DESKS</text>
    <text x="382" y="62" fontSize="10" letterSpacing="3" fill="#94a3b8" fillOpacity="0.8" fontFamily="inherit">MEETING</text>
    <text x="382" y="242" fontSize="10" letterSpacing="3" fill="#94a3b8" fillOpacity="0.8" fontFamily="inherit">CABIN</text>

    {/* dimension hint */}
    <path d="M28 362 H492" stroke="#94a3b8" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 6" />
    <text x="246" y="356" fontSize="10" letterSpacing="2" fill="#94a3b8" fillOpacity="0.7" textAnchor="middle" fontFamily="inherit">18.5 M</text>
  </svg>
);

const HomePage = () => (
  <div>
    {/* ============================== HERO ============================== */}
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white">
      <div className="absolute inset-0 blueprint-grid-light [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)] pointer-events-none" />
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-200/40 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-40 -left-32 w-80 h-80 rounded-full bg-bronze-100/60 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-800 ring-1 ring-brand-200/70 shadow-sm">
            <Icon name="sparkles" className="w-3.5 h-3.5 text-bronze-500" />
            Pakistan&apos;s flexible workspace portal
          </span>

          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold text-brand-950 tracking-tight leading-[1.08] text-balance">
            Flexible workspaces,{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-bronze-500 to-bronze-700">
              booked in minutes.
            </span>
          </h1>

          <p className="mt-5 text-lg text-slate-600 max-w-xl leading-relaxed">
            Shared desks, private cabins for startups, enterprise office floors, and executive
            housing — browse, compare, and book everything through one portal.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} to="/coworking" size="lg">
              Browse coworking spaces
              <Icon name="arrowRight" className="w-4.5 h-4.5" />
            </Button>
            <Button as={Link} to="/housing" variant="secondary" size="lg">
              Explore executive housing
            </Button>
          </div>

          <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-slate-200/80 pt-7">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-mono text-2xl font-semibold text-brand-900">{stat.value}</dd>
                <dd className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Professional visual: floor blueprint panel + overlapping booking card */}
        <div className="relative animate-fade-in">
          <div className="relative overflow-hidden rounded-3xl bg-brand-950 ring-1 ring-brand-950/10 shadow-lift aspect-[13/10]">
            <div className="absolute inset-0 blueprint-grid opacity-50 pointer-events-none" aria-hidden="true" />
            <div
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-bronze-500/15 blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <FloorPlan />

            {/* Context chips */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-white/10 text-white px-3 py-1.5 text-xs font-medium ring-1 ring-white/15 backdrop-blur-sm">
              <Icon name="location" className="w-3.5 h-3.5 text-bronze-300" />
              Blue Area · Floor 3
            </div>
            <div className="absolute top-4 right-4 hidden sm:flex items-center gap-1.5 rounded-full bg-white/10 text-white px-3 py-1.5 text-xs font-medium ring-1 ring-white/15 backdrop-blur-sm">
              <Icon name="moon" className="w-3.5 h-3.5 text-bronze-300" />
              24/7 access
            </div>
          </div>

          {/* Overlapping booking card */}
          <div className="relative z-10 -mt-14 sm:-mt-16 mx-3 sm:mx-8 rounded-2xl bg-white ring-1 ring-slate-200/80 shadow-lift p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-brand-950">Private Cabin · Blue Area</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Fitted cabin · 12 desks · Backup power
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono font-semibold text-brand-950">PKR 38,000</p>
                <p className="text-xs text-slate-400">/month</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <Badge tone="green">
                <Icon name="checkCircle" className="w-3 h-3" />
                Available now
              </Badge>
              <Badge tone="blue">24/7 access</Badge>
              <Badge tone="slate">Month-to-month</Badge>
            </div>

            <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
              <Button as={Link} to="/coworking" size="sm">
                Book this cabin
                <Icon name="arrowRight" className="w-4 h-4" />
              </Button>
              <Link
                to="/coworking"
                className="text-sm font-semibold text-slate-500 hover:text-brand-950 transition-colors"
              >
                View details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ============================ PILLARS ============================ */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-bronze-600">
          One portal, three ways to work
        </p>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-brand-950 tracking-tight">
          From a single desk to a corporate HQ
        </h2>
        <p className="mt-3 text-slate-600 leading-relaxed">
          Whether you&apos;re a freelancer, a scaling startup, or an enterprise relocating a whole
          team — SpaceFlex covers the full spectrum of workspace needs.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        {PILLARS.map((pillar) => (
          <Link
            key={pillar.to}
            to={pillar.to}
            className="group relative bg-white border border-slate-200 rounded-3xl p-6 shadow-soft hover:shadow-lift hover:-translate-y-1 hover:border-brand-200 transition-all duration-300"
          >
            <div
              className={`w-12 h-12 rounded-2xl ring-1 flex items-center justify-center ${pillar.tint}`}
            >
              <Icon name={pillar.icon} className="w-6 h-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-brand-950">
              {pillar.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
            <ul className="mt-4 space-y-1.5">
              {pillar.bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-2 text-sm text-slate-500">
                  <Icon name="checkCircle" className="w-4 h-4 text-emerald-500 shrink-0" />
                  {bullet}
                </li>
              ))}
            </ul>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-800">
              Explore
              <Icon
                name="arrowRight"
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </span>
          </Link>
        ))}
      </div>
    </section>

    {/* ====================== COWORKING PLAN TYPES ====================== */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-brand-950 tracking-tight">
            Coworking plans we offer
          </h2>
          <p className="mt-2 text-slate-600">Pick the setup that fits how your team works.</p>
        </div>
        <Link
          to="/coworking"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-800 hover:text-brand-950 shrink-0"
        >
          View all spaces
          <Icon name="arrowUpRight" className="w-4 h-4" />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
        {COWORKING_PROPERTY_TYPES.map((type) => (
          <Link
            key={type.value}
            to={`/coworking?type=${type.value}`}
            className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-soft hover:shadow-lift hover:-translate-y-1 hover:border-brand-200 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-800 to-brand-950 text-white flex items-center justify-center shadow-sm">
                <Icon name={PLAN_ICONS[type.value] ?? "building"} className="w-5 h-5" />
              </div>
              <Icon
                name="arrowRight"
                className="w-5 h-5 text-slate-300 transition-all duration-200 group-hover:text-brand-800 group-hover:translate-x-1"
              />
            </div>
            <h3 className="mt-4 font-semibold text-brand-950">{type.label}</h3>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{type.description}</p>
          </Link>
        ))}
      </div>
    </section>

    {/* ========================= ENTERPRISE CTA ========================= */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="relative overflow-hidden rounded-3xl bg-brand-950 px-6 py-12 sm:px-12 shadow-lift">
        <div className="absolute inset-0 blueprint-grid pointer-events-none" />
        <div
          className="absolute -top-24 right-0 w-80 h-80 rounded-full bg-bronze-500/15 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-brand-500/25 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-bronze-300">
              <Icon name="briefcase" className="w-4 h-4" />
              SpaceFlex Enterprise
            </p>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight text-balance">
              Need a full office floor or a corporate headquarters?
            </h2>
            <p className="mt-3 text-slate-300 leading-relaxed">
              Browse enterprise-grade office space — from single fitted floors to complete
              headquarters — and lease it directly through our team, with site visits and
              paperwork handled end to end.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <Button as={Link} to="/enterprise-office" variant="secondary" size="lg">
              Browse enterprise leasing
              <Icon name="arrowUpRight" className="w-4.5 h-4.5" />
            </Button>
            <Button as={Link} to="/enterprise-office/corporate-hq" variant="ghost" size="lg" className="text-slate-300 hover:bg-white/10 hover:text-white">
              Compare HQ options
            </Button>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default HomePage;
