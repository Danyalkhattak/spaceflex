// Small, dependency-free validation helpers. Each throws a descriptive
// Error on failure; Convex surfaces the message text to the client, so
// messages here are safe to show in the UI and never leak internals.

export function assertNonEmptyString(value: string, fieldName: string) {
  if (!value || value.trim().length === 0) {
    throw new Error(`VALIDATION: ${fieldName} cannot be empty.`);
  }
}

export function assertMaxLength(value: string, fieldName: string, max: number) {
  if (value.length > max) {
    throw new Error(`VALIDATION: ${fieldName} cannot exceed ${max} characters.`);
  }
}

export function assertPositiveNumber(value: number, fieldName: string) {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
    throw new Error(`VALIDATION: ${fieldName} must be a positive number.`);
  }
}

export function assertNonNegativeNumber(value: number, fieldName: string) {
  if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
    throw new Error(`VALIDATION: ${fieldName} cannot be negative.`);
  }
}

export function assertValidEmail(value: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value)) {
    throw new Error("VALIDATION: A valid email address is required.");
  }
}

export function assertValidDateRange(startDate: number, endDate: number) {
  if (!Number.isFinite(startDate) || !Number.isFinite(endDate)) {
    throw new Error("VALIDATION: startDate and endDate must be valid timestamps.");
  }
  if (endDate <= startDate) {
    throw new Error("VALIDATION: endDate must be after startDate.");
  }
  const minStart = Date.now() - 24 * 60 * 60 * 1000; // allow same-day timezone slack
  if (startDate < minStart) {
    throw new Error("VALIDATION: startDate cannot be in the past.");
  }
}

export function assertPositiveInteger(value: number, fieldName: string) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`VALIDATION: ${fieldName} must be a positive whole number.`);
  }
}
