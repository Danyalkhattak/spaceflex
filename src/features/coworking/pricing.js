// Mirrors convex/bookings/mutations.ts:computeUnits exactly, so the price
// shown to the user before submitting matches what the server will charge.
// The server always recomputes and enforces this independently.
export function computeBillableUnits(pricePeriod, startDate, endDate) {
  if (pricePeriod === "one_time") return 1;
  if (!startDate || !endDate || endDate <= startDate) return 0;
  const ms = endDate - startDate;
  const hour = 60 * 60 * 1000;
  switch (pricePeriod) {
    case "hour":
      return Math.max(1, Math.ceil(ms / hour));
    case "day":
      return Math.max(1, Math.ceil(ms / (hour * 24)));
    case "month":
      return Math.max(1, Math.ceil(ms / (hour * 24 * 30)));
    case "year":
      return Math.max(1, Math.ceil(ms / (hour * 24 * 365)));
    default:
      return 1;
  }
}

export const DURATION_UNIT_LABEL = {
  hour: "hour(s)",
  day: "day(s)",
  month: "month(s)",
  year: "year(s)",
  one_time: null,
};

/** Adds `count` units of `pricePeriod` to a start timestamp, for computing an end date from a duration picker. */
export function addPeriod(startDate, pricePeriod, count) {
  const d = new Date(startDate);
  switch (pricePeriod) {
    case "hour":
      d.setHours(d.getHours() + count);
      break;
    case "day":
      d.setDate(d.getDate() + count);
      break;
    case "month":
      d.setMonth(d.getMonth() + count);
      break;
    case "year":
      d.setFullYear(d.getFullYear() + count);
      break;
    default:
      d.setDate(d.getDate() + 1);
  }
  return d.getTime();
}
