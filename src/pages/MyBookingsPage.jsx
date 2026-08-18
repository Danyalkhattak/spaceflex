import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import RequireAuth from "../components/auth/RequireAuth.jsx";
import LoadingState from "../components/ui/Spinner.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import Icon from "../components/ui/Icon.jsx";
import { formatCurrency, formatDate } from "../utils/format.js";

const STATUS_TONE = {
  pending: "amber",
  confirmed: "green",
  cancelled: "red",
  completed: "blue",
};

const BookingRow = ({ booking }) => {
  const property = useQuery(api.properties.queries.getPropertyById, {
    propertyId: booking.propertyId,
  });

  return (
    <Link
      to={`/bookings/${booking._id}`}
      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 hover:shadow-sm transition-shadow"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-slate-900 truncate">
            {property?.title ?? "Coworking space"}
          </p>
          <Badge tone={STATUS_TONE[booking.status] ?? "slate"} className="capitalize shrink-0">
            {booking.status}
          </Badge>
        </div>
        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
          <Icon name="calendar" className="w-3.5 h-3.5" />
          {formatDate(booking.startDate)} → {formatDate(booking.endDate)} · {booking.quantity}{" "}
          seat(s)
        </p>
      </div>
      <div className="text-left sm:text-right shrink-0">
        <p className="font-semibold text-slate-900">
          {formatCurrency(booking.totalAmount, booking.currency)}
        </p>
        <p className="text-xs text-slate-400 capitalize">
          {booking.paymentStatus.replace("_", " ")}
        </p>
      </div>
    </Link>
  );
};

const MyBookingsContent = () => {
  const bookings = useQuery(api.bookings.queries.getMyBookings, {});

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Bookings</h1>

      {bookings === undefined && <LoadingState label="Loading your bookings…" />}

      {bookings && bookings.length === 0 && (
        <EmptyState
          icon="calendar"
          title="No bookings yet"
          message="Book a shared desk, private cabin, or night-shift coworking space to see it here."
          action={
            <Button as={Link} to="/coworking">
              Browse coworking spaces
            </Button>
          }
        />
      )}

      {bookings && bookings.length > 0 && (
        <div className="space-y-3">
          {bookings.map((b) => (
            <BookingRow key={b._id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
};

const MyBookingsPage = () => (
  <RequireAuth>
    <MyBookingsContent />
  </RequireAuth>
);

export default MyBookingsPage;
