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
import { formatCurrency, formatDate, formatDateTime } from "../lib/format.js";
import { getErrorMessage } from "../utils/errors.js";
import { COWORKING_TYPE_LABEL } from "../features/coworking/coworkingMeta.js";
import { HOUSING_TYPE_LABEL } from "../features/housing/housingMeta.js";

const STATUS_TONE = {
  pending: "amber",
  confirmed: "green",
  cancelled: "red",
  completed: "blue",
};

const PAYMENT_TONE = {
  pending: "amber",
  demo_paid: "green",
  failed: "red",
  refunded: "blue",
};

// Bookings are shared across every bookable category (coworking + housing so
// far), so the confirmation page can't assume "coworking" the way it used
// to - it now looks up the right type label and browse/detail links from
// the booked property's own category instead.
const TYPE_LABEL = { ...COWORKING_TYPE_LABEL, ...HOUSING_TYPE_LABEL };

const CATEGORY_ROUTES = {
  coworking: { browsePath: "/coworking", detailPath: (slug) => `/coworking/${slug}`, noun: "space" },
  housing: { browsePath: "/housing", detailPath: (slug) => `/housing/property/${slug}`, noun: "property" },
};

function routesFor(property) {
  return CATEGORY_ROUTES[property?.category] ?? CATEGORY_ROUTES.coworking;
}

/**
 * Cheap client-side guard: Convex document IDs are lowercase alphanumeric
 * strings. Without this, a garbage :bookingId in the URL would be sent to
 * the backend, rejected by the v.id("bookings") validator, and thrown as an
 * error during render - crashing the page instead of showing the friendly
 * "Booking not found" empty state.
 */
function isPlausibleConvexId(value) {
  return typeof value === "string" && /^[a-z0-9]{16,64}$/.test(value);
}

const BookingConfirmationContent = () => {
  const { bookingId } = useParams();
  const validId = isPlausibleConvexId(bookingId);
  const booking = useQuery(
    api.bookings.queries.getMyBookingById,
    validId ? { bookingId } : "skip"
  );
  const property = useQuery(
    api.properties.queries.getPropertyById,
    booking ? { propertyId: booking.propertyId } : "skip"
  );
  const cancelBooking = useMutation(api.bookings.mutations.cancelMyBooking);
  const simulatePayment = useMutation(api.demoPayments.mutations.simulateDemoPayment);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [paying, setPaying] = useState(""); // "" | "success" | "failure"
  const [payError, setPayError] = useState("");

  if (!validId) {
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

  const handleDemoPayment = async (outcome) => {
    setPayError("");
    setPaying(outcome);
    try {
      await simulatePayment({ bookingId: booking._id, outcome });
    } catch (err) {
      setPayError(getErrorMessage(err));
    } finally {
      setPaying("");
    }
  };

  const canPay = booking.paymentStatus === "pending" && booking.status !== "cancelled";
  const isPaymentPending = booking.paymentStatus === "pending";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
            booking.status === "cancelled"
              ? "bg-red-100 text-red-600"
              : "bg-emerald-100 text-emerald-600"
          }`}
        >
          <Icon name={booking.status === "cancelled" ? "close" : "check"} className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          {booking.status === "cancelled" ? "Booking Cancelled" : "Booking Confirmed"}
        </h1>
        <p className="text-slate-500 mt-1">
          A confirmation has been recorded for your booking.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-400">Booking ID</p>
            <p className="font-mono text-sm text-slate-700">{booking._id}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge tone={STATUS_TONE[booking.status] ?? "slate"} className="capitalize">
              {booking.status}
            </Badge>
            <Badge tone={PAYMENT_TONE[booking.paymentStatus] ?? "slate"} className="capitalize">
              {booking.paymentStatus.replace("_", " ")}
            </Badge>
          </div>
        </div>

        {property && (
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 capitalize">{routesFor(property).noun}</p>
            <Link
              to={routesFor(property).detailPath(property.slug)}
              className="font-semibold text-slate-900 hover:underline"
            >
              {property.title}
            </Link>
            <p className="text-sm text-slate-500 mt-0.5">
              {TYPE_LABEL[property.propertyType] ?? property.propertyType} ·{" "}
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
            <p className="text-xs text-slate-400">Quantity booked</p>
            <p className="text-sm font-medium text-slate-900">{booking.quantity}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Booked by</p>
            <p className="text-sm font-medium text-slate-900">{booking.customerName}</p>
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

      {/* Demo payment flow - clearly labeled as simulated; no real money is
          ever processed. Wires the backend demoPayments state machine
          (pending -> demo_paid/failed -> refunded) into the UI. */}
      {canPay && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 shrink-0 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <Icon name="lock" className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Demo payment</p>
              <p className="text-sm text-slate-600 mt-0.5">
                This is a <strong>simulated</strong> payment step for demonstration only —
                no real money is processed and no card details are ever collected.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  loading={paying === "success"}
                  disabled={paying !== ""}
                  onClick={() => handleDemoPayment("success")}
                >
                  Pay {formatCurrency(booking.totalAmount, booking.currency)} (demo)
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  loading={paying === "failure"}
                  disabled={paying !== ""}
                  onClick={() => handleDemoPayment("failure")}
                >
                  Simulate payment failure
                </Button>
              </div>
              {payError && (
                <p className="text-sm text-red-600 mt-2 flex items-center gap-1.5">
                  <Icon name="close" className="w-4 h-4" />
                  {payError}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {booking.paymentStatus === "demo_paid" && (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-2.5">
          <Icon name="check" className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-sm text-emerald-800">
            Demo payment completed — your booking is confirmed. This was a simulated payment;
            no real charge was made.
          </p>
        </div>
      )}

      {booking.paymentStatus === "failed" && !isPaymentPending && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 flex items-center gap-2.5">
          <Icon name="close" className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-700">
            The demo payment failed. Contact SpaceFlex support or book again.
          </p>
        </div>
      )}

      {booking.paymentStatus === "refunded" && (
        <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 flex items-center gap-2.5">
          <Icon name="check" className="w-5 h-5 text-blue-600 shrink-0" />
          <p className="text-sm text-blue-800">
            This booking's demo payment has been refunded (simulated — no real money involved).
          </p>
        </div>
      )}

      {cancelError && (
        <p className="text-sm text-red-600 mt-3 flex items-center gap-1.5">
          <Icon name="close" className="w-4 h-4" />
          {cancelError}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button as={Link} to={routesFor(property).browsePath} variant="secondary" className="flex-1">
          Browse more {routesFor(property).noun === "property" ? "properties" : "spaces"}
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
