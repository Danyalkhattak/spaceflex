import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import RequireAuth from "../components/auth/RequireAuth.jsx";
import LoadingState from "../components/ui/Spinner.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import Icon from "../components/ui/Icon.jsx";
import { formatCurrency, formatDate, formatDateTime } from "../utils/format.js";
import { getErrorMessage } from "../utils/errors.js";
import { COWORKING_TYPE_LABEL } from "../features/coworking/coworkingMeta.js";

const STATUS_TONE = {
  pending: "amber",
  confirmed: "green",
  cancelled: "red",
  completed: "blue",
};

const BookingConfirmationContent = () => {
  const { bookingId } = useParams();
  const booking = useQuery(api.bookings.queries.getMyBookingById, { bookingId });
  const property = useQuery(
    api.properties.queries.getPropertyById,
    booking ? { propertyId: booking.propertyId } : "skip"
  );
  const cancelBooking = useMutation(api.bookings.mutations.cancelMyBooking);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  if (booking === undefined) {
    return <LoadingState label="Loading your booking…" />;
  }

  if (booking === null) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          icon="building"
          title="Booking not found"
          message="This booking doesn't exist or doesn't belong to your account."
          action={
            <Button as={Link} to="/my-bookings" variant="secondary">
              View my bookings
            </Button>
          }
        />
      </div>
    );
  }

  const handleCancel = async () => {
    setCancelError("");
    setCancelling(true);
    try {
      await cancelBooking({ bookingId: booking._id });
    } catch (err) {
      setCancelError(getErrorMessage(err));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <Icon name="check" className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Booking Confirmed</h1>
        <p className="text-slate-500 mt-1">
          A confirmation has been recorded for your coworking booking.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-400">Booking ID</p>
            <p className="font-mono text-sm text-slate-700">{booking._id}</p>
          </div>
          <Badge tone={STATUS_TONE[booking.status] ?? "slate"} className="capitalize">
            {booking.status}
          </Badge>
        </div>

        {property && (
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400">Space</p>
            <Link
              to={`/coworking/${property.slug}`}
              className="font-semibold text-slate-900 hover:underline"
            >
              {property.title}
            </Link>
            <p className="text-sm text-slate-500 mt-0.5">
              {COWORKING_TYPE_LABEL[property.propertyType] ?? property.propertyType} ·{" "}
              {property.area}, {property.city}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-400">Start date</p>
            <p className="text-sm font-medium text-slate-900">{formatDate(booking.startDate)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">End date</p>
            <p className="text-sm font-medium text-slate-900">{formatDate(booking.endDate)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Seats booked</p>
            <p className="text-sm font-medium text-slate-900">{booking.quantity}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Payment status</p>
            <p className="text-sm font-medium text-slate-900 capitalize">
              {booking.paymentStatus.replace("_", " ")}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">Total amount</p>
          <p className="text-xl font-bold text-slate-900">
            {formatCurrency(booking.totalAmount, booking.currency)}
          </p>
        </div>

        {booking.notes && (
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-1">Notes</p>
            <p className="text-sm text-slate-600">{booking.notes}</p>
          </div>
        )}

        <p className="text-xs text-slate-400 pt-2">
          Booked on {formatDateTime(booking.createdAt)}
        </p>
      </div>

      {cancelError && (
        <p className="text-sm text-red-600 mt-3 flex items-center gap-1.5">
          <Icon name="close" className="w-4 h-4" />
          {cancelError}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button as={Link} to="/coworking" variant="secondary" className="flex-1">
          Browse more spaces
        </Button>
        <Button as={Link} to="/my-bookings" variant="secondary" className="flex-1">
          View all bookings
        </Button>
        {(booking.status === "pending" || booking.status === "confirmed") && (
          <Button
            variant="danger"
            className="flex-1"
            loading={cancelling}
            onClick={handleCancel}
          >
            Cancel booking
          </Button>
        )}
      </div>
    </div>
  );
};

const BookingConfirmationPage = () => (
  <RequireAuth>
    <BookingConfirmationContent />
  </RequireAuth>
);

export default BookingConfirmationPage;
