import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { useUser, SignInButton } from "@clerk/react";
import { api } from "../../../convex/_generated/api";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../components/ui/Icon.jsx";
import { formatCurrency, todayDateString, dateStringToTimestamp } from "../../lib/format.js";
import { getErrorMessage } from "../../utils/errors.js";
import { COWORKING_TYPE_LABEL } from "./coworkingMeta.js";
import { computeBillableUnits, DURATION_UNIT_LABEL, addPeriod } from "./pricing.js";

const BookingForm = ({ property }) => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const createBooking = useMutation(api.bookings.mutations.createBooking);

  const [startDateStr, setStartDateStr] = useState(todayDateString());
  const [duration, setDuration] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const startDate = dateStringToTimestamp(startDateStr);
  const endDate = useMemo(
    () => addPeriod(startDate, property.pricePeriod, Math.max(1, Number(duration) || 1)),
    [startDate, property.pricePeriod, duration]
  );

  const availability = useQuery(
    api.bookings.queries.checkAvailability,
    startDate ? { propertyId: property._id, startDate, endDate } : "skip"
  );

  const units = computeBillableUnits(property.pricePeriod, startDate, endDate);
  const estimatedTotal = property.price * units * Math.max(1, Number(quantity) || 1);
  const durationLabel = DURATION_UNIT_LABEL[property.pricePeriod];

  const maxSeats = property.capacity ?? undefined;
  const remaining = availability?.availableQuantity;
  const quantityExceedsRemaining =
    remaining !== null && remaining !== undefined && Number(quantity) > remaining;

  const canSubmit =
    isSignedIn &&
    startDate &&
    endDate > startDate &&
    Number(quantity) > 0 &&
    availability &&
    availability.isAvailable &&
    !quantityExceedsRemaining &&
    !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!startDate || endDate <= startDate) {
      setFormError("Please choose a valid start date.");
      return;
    }
    if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
      setFormError("Number of seats must be a whole number greater than 0.");
      return;
    }
    if (maxSeats !== undefined && Number(quantity) > maxSeats) {
      setFormError(`This space only has capacity for ${maxSeats}.`);
      return;
    }

    setSubmitting(true);
    try {
      const result = await createBooking({
        propertyId: property._id,
        bookingType: property.propertyType,
        startDate,
        endDate,
        quantity: Number(quantity),
        notes: notes.trim() || undefined,
      });
      navigate(`/bookings/${result.bookingId}`);
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5"
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Plan</p>
        <p className="font-semibold text-slate-900 mt-0.5">
          {COWORKING_TYPE_LABEL[property.propertyType] ?? property.title}
        </p>
        <p className="text-sm text-slate-500 mt-0.5">
          {formatCurrency(property.price, property.currency)}{" "}
          {property.pricePeriod !== "one_time" ? `/ ${property.pricePeriod}` : "(one-time)"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Start date</label>
          <input
            type="date"
            required
            min={todayDateString()}
            value={startDateStr}
            onChange={(e) => setStartDateStr(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        {property.pricePeriod !== "one_time" ? (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Duration ({durationLabel})
            </label>
            <input
              type="number"
              min="1"
              required
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Booking type</label>
            <p className="text-sm text-slate-500 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
              One-time
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Number of seats{maxSeats !== undefined ? ` (max ${maxSeats})` : ""}
        </label>
        <input
          type="number"
          min="1"
          max={maxSeats}
          required
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Notes <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything the SpaceFlex team should know…"
          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />
      </div>

      <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm">
        {availability === undefined ? (
          <p className="text-slate-500 flex items-center gap-2">
            <Icon name="spinner" className="w-4 h-4 animate-spin" />
            Checking availability…
          </p>
        ) : availability.isAvailable && !quantityExceedsRemaining ? (
          <p className="text-emerald-700 flex items-center gap-2">
            <Icon name="check" className="w-4 h-4" />
            Available
            {availability.availableQuantity !== null &&
              ` — ${availability.availableQuantity} seat(s) left for these dates`}
          </p>
        ) : (
          <p className="text-red-600 flex items-center gap-2">
            <Icon name="close" className="w-4 h-4" />
            {!availability.isActive || !availability.isBookable
              ? "This space is not currently bookable."
              : quantityExceedsRemaining
              ? `Only ${availability.availableQuantity} seat(s) left for these dates.`
              : "Not available for the selected dates."}
          </p>
        )}
      </div>

      <div className="flex items-end justify-between pt-1 border-t border-slate-100">
        <div className="pt-4">
          <p className="text-xs text-slate-400">Estimated total</p>
          <p className="text-xl font-bold text-slate-900">
            {formatCurrency(estimatedTotal, property.currency)}
          </p>
        </div>
      </div>

      {formError && (
        <p className="text-sm text-red-600 flex items-center gap-1.5">
          <Icon name="close" className="w-4 h-4 shrink-0" />
          {formError}
        </p>
      )}

      {isSignedIn ? (
        <Button type="submit" size="lg" className="w-full" loading={submitting} disabled={!canSubmit}>
          {submitting ? "Booking…" : "Book Now"}
        </Button>
      ) : (
        <SignInButton mode="modal">
          <Button type="button" size="lg" className="w-full">
            Sign in to book
          </Button>
        </SignInButton>
      )}
    </form>
  );
};

export default BookingForm;
