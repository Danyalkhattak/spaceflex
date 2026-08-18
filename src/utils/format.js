export function formatCurrency(amount, currency = "PKR") {
  try {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  }
}

export const PRICE_PERIOD_LABEL = {
  hour: "/ hour",
  day: "/ day",
  month: "/ month",
  year: "/ year",
  one_time: "one-time",
};

export function formatPrice(price, currency, pricePeriod) {
  const suffix = PRICE_PERIOD_LABEL[pricePeriod] ?? "";
  return `${formatCurrency(price, currency)}${suffix ? ` ${suffix}` : ""}`;
}

/** Converts a <input type="date"> value ("YYYY-MM-DD") to a ms-epoch timestamp at local midnight. */
export function dateStringToTimestamp(dateString) {
  if (!dateString) return null;
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day).getTime();
}

/** Converts a ms-epoch timestamp to a <input type="date"> value string. */
export function timestampToDateString(timestamp) {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDate(timestamp) {
  if (!timestamp) return "-";
  return new Date(timestamp).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(timestamp) {
  if (!timestamp) return "-";
  return new Date(timestamp).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Returns today's date as a <input type="date"> value, for min="" attributes. */
export function todayDateString() {
  return timestampToDateString(Date.now());
}
