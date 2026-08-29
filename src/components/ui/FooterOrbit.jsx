/**
 * FooterOrbit - decorative animated SVG scene for the footer (desktop only).
 * Echoes the SpaceFlex mark: a bronze planet, dashed orbit rings, the brand
 * arrow circling as a satellite, twinkling stars and a subtle skyline.
 *
 * Motion: SMIL (animateMotion / animateTransform) for orbits + CSS twinkle.
 * Honors prefers-reduced-motion by rendering a static frame.
 * The parent is responsible for hiding it on mobile (`hidden md:block`).
 */
const STARS = [
  { cx: 30, cy: 30, r: 1.6, delay: "0s" },
  { cx: 76, cy: 14, r: 1.1, delay: "0.7s" },
  { cx: 128, cy: 34, r: 1.4, delay: "1.4s" },
  { cx: 210, cy: 12, r: 1.2, delay: "2.1s" },
  { cx: 268, cy: 30, r: 1.7, delay: "0.4s" },
  { cx: 318, cy: 58, r: 1.1, delay: "1.1s" },
  { cx: 22, cy: 92, r: 1.2, delay: "1.8s" },
  { cx: 316, cy: 118, r: 1.4, delay: "2.6s" },
  { cx: 60, cy: 60, r: 1, delay: "0.9s" },
  { cx: 296, cy: 86, r: 1, delay: "1.6s" },
];

/* Small chunky arrow, drawn pointing along +x so animateMotion rotate="auto"
   keeps it tangent to the orbit - a nod to the up-right arrow in the logo. */
const SATELLITE_ARROW = (
  <g transform="scale(0.9)">
    <path
      d="M-7 0 L5 0"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path d="M12 0 L3 -5 L3 5 Z" fill="currentColor" />
  </g>
);

/* Axis-aligned ellipse the satellite travels on; tilt applied by parent group. */
const ORBIT_PATH =
  "M 92 0 A 92 30 0 1 1 -92 0 A 92 30 0 1 1 92 0";

const FooterOrbit = () => {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  return (
    <svg
      viewBox="0 0 340 150"
      fill="none"
      role="img"
      aria-label="Orbiting workspace illustration"
      className="w-full max-w-[300px] text-bronze-300 select-none pointer-events-none"
    >
      <defs>
        <radialGradient id="sfx-planet" cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#d8b783" />
          <stop offset="55%" stopColor="#b8935a" />
          <stop offset="100%" stopColor="#6d5330" />
        </radialGradient>
        <radialGradient id="sfx-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#b8935a" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#b8935a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Twinkling stars */}
      {STARS.map((s, i) => (
        <circle
          key={i}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill="currentColor"
          className="animate-twinkle"
          style={reduced ? undefined : { animationDelay: s.delay }}
          opacity={0.7}
        />
      ))}

      {/* Soft glow behind the planet */}
      <circle cx="170" cy="80" r="64" fill="url(#sfx-glow)" />

      {/* Orbit system, tilted like the logo mark */}
      <g transform="rotate(-14 170 80)">
        {/* outer dashed ring - slow spin */}
        <g>
          {reduced ? null : (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 170 80"
              to="360 170 80"
              dur="46s"
              repeatCount="indefinite"
            />
          )}
          <ellipse
            cx="170"
            cy="80"
            rx="98"
            ry="32"
            stroke="currentColor"
            strokeOpacity="0.45"
            strokeWidth="1.2"
            strokeDasharray="3 7"
            strokeLinecap="round"
          />
        </g>
        {/* inner ring - counter spin */}
        <g>
          {reduced ? null : (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 170 80"
              to="0 170 80"
              dur="64s"
              repeatCount="indefinite"
            />
          )}
          <ellipse
            cx="170"
            cy="80"
            rx="64"
            ry="20"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="1"
            strokeDasharray="1 6"
            strokeLinecap="round"
          />
        </g>

        {/* Satellite arrow riding the outer orbit (drawn at origin; the
            animateMotion transform supplies the position along the path) */}
        <g>
          {reduced ? null : (
            <animateMotion
              dur="14s"
              repeatCount="indefinite"
              rotate="auto"
              path={ORBIT_PATH}
            />
          )}
          {SATELLITE_ARROW}
        </g>

        {/* Tiny moon on the inner ring (drawn at origin, motion moves it) */}
        <g>
          {reduced ? null : (
            <animateMotion
              dur="9s"
              repeatCount="indefinite"
              path="M 64 0 A 64 20 0 1 0 -64 0 A 64 20 0 1 0 64 0"
            />
          )}
          <circle cx="0" cy="0" r="3" fill="currentColor" opacity="0.8" />
        </g>
      </g>

      {/* Planet (drawn after rings so it occludes their far side) */}
      <circle cx="170" cy="80" r="30" fill="url(#sfx-planet)" />
      <path
        d="M 148 100 A 30 30 0 0 0 196 74 A 34 34 0 0 1 148 100 Z"
        fill="#5f4829"
        opacity="0.35"
      />

      {/* Skyline silhouette - the "space" meets "workspaces" */}
      <g fill="currentColor" opacity="0.28">
        <rect x="36" y="126" width="16" height="20" rx="1.5" />
        <rect x="58" y="118" width="20" height="28" rx="1.5" />
        <rect x="84" y="132" width="14" height="14" rx="1.5" />
        <rect x="242" y="124" width="18" height="22" rx="1.5" />
        <rect x="266" y="114" width="22" height="32" rx="1.5" />
        <rect x="294" y="130" width="14" height="16" rx="1.5" />
      </g>
      <g fill="#e6d0ac" opacity="0.5">
        <rect x="62" y="123" width="3" height="3" rx="0.5" />
        <rect x="69" y="123" width="3" height="3" rx="0.5" />
        <rect x="62" y="130" width="3" height="3" rx="0.5" />
        <rect x="271" y="119" width="3" height="3" rx="0.5" />
        <rect x="278" y="119" width="3" height="3" rx="0.5" />
        <rect x="271" y="127" width="3" height="3" rx="0.5" />
        <rect x="285" y="127" width="3" height="3" rx="0.5" />
      </g>
      <line
        x1="24"
        y1="146"
        x2="316"
        y2="146"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="1"
      />
    </svg>
  );
};

export default FooterOrbit;
