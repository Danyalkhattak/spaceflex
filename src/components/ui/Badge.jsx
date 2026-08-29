
const TONES = {
  slate: "bg-slate-100 text-slate-700",
  green: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
  violet: "bg-violet-100 text-violet-700",
  dark: "bg-slate-900/80 text-white",
};

const Badge = ({ tone = "slate", children, className = "" }) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-black/5 ${TONES[tone]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
