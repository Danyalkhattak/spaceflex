// Small, dependency-free formatting helpers shared by every page/component
// that renders a property or inquiry, so number/label formatting stays
// consistent across the whole app instead of being re-implemented per page.

export function formatPrice(price, currency, pricePeriod) {
  const amount = new Intl.NumberFormat("en-PK").format(price);
  const period = PRICE_PERIOD_LABELS[pricePeriod] ?? pricePeriod;
  return `${currency} ${amount} / ${period}`;
}

export const PRICE_PERIOD_LABELS = {
  hour: "hour",
  day: "day",
  month: "month",
  year: "year",
  one_time: "one-time",
};

export function formatDate(msEpoch) {
  return new Date(msEpoch).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function titleCase(value) {
  if (!value) return "";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
