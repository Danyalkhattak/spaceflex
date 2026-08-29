import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import LoadingState from "../../components/ui/Spinner.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";
import { getErrorMessage } from "../../utils/errors.js";
import { formatCurrency, formatDateTime } from "../../lib/format.js";
import { BOOKING_STATUS_OPTIONS } from "./adminMeta.js";

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

const AdminBookings = () => {
  const [statusFilter, setStatusFilter] = useState("");

  const bookings = useQuery(
    api.bookings.queries.adminGetAllBookings,
    statusFilter ? { status: statusFilter } : {}
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Bookings</h2>
          <p className="text-sm text-slate-500">
            Update booking lifecycles and refund demo payments across every category.
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {BOOKING_STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {bookings === undefined && <LoadingState label="Loading bookings…" />}

      {bookings !== undefined && bookings.length === 0 && (
        <EmptyState
          icon="calendar"
          title="No bookings match this filter"
          message="Bookings appear here as soon as customers book bookable listings."
        />
      )}

      <div className="space-y-3">
        {bookings?.map((booking) => (
          <AdminBookingRow key={booking._id} booking={booking} />
        ))}
      </div>
    </div>
  );
};

function AdminBookingRow({ booking }) {
  const property = useQuery(
    api.properties.queries.getPropertyById,
    booking ? { propertyId: booking.propertyId } : "skip"
  );
  const updateStatus = useMutation(api.bookings.mutations.adminUpdateBookingStatus);
  const refund = useMutation(api.demoPayments.mutations.adminRefundDemoPayment);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmingRefund, setConfirmingRefund] = useState(false);

  async function run(fn, args) {
    setError("");
    setBusy(true);
    try {
      await fn(args);
      setConfirmingRefund(false);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-900">
              {property ? property.title : "Loading property…"}
            </p>
            <Badge tone={STATUS_TONE[booking.status] ?? "slate"} className="capitalize">
              {booking.status}
            </Badge>
            <Badge tone={PAYMENT_TONE[booking.paymentStatus] ?? "slate"} className="capitalize">
              {booking.paymentStatus.replace("_", " ")}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            {booking.customerName} · {booking.customerEmail}
            {booking.customerPhone ? ` · ${booking.customerPhone}` : ""}
          </p>
          <p className="mt-0.5 text-sm text-slate-500">
            {booking.quantity} seat(s) · {formatCurrency(booking.totalAmount, booking.currency)}{" "}
            <span className="text-slate-400">
              ({formatCurrency(booking.unitPrice, booking.currency)} / unit)
            </span>
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            Booked {formatDateTime(booking.createdAt)} · ID{" "}
            <span className="font-mono break-all">{booking._id}</span>
          </p>
          {booking.notes && <p className="mt-1 text-sm text-slate-500 break-words">Notes: {booking.notes}</p>}
        </div>

        <div className="flex flex-col items-stretch gap-2 lg:items-end">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500">Status</label>
            <select
              value={booking.status}
              disabled={busy}
              onChange={(e) => run(updateStatus, { bookingId: booking._id, status: e.target.value })}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:opacity-60"
            >
              {BOOKING_STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {booking.paymentStatus === "demo_paid" && !confirmingRefund && (
            <Button
              variant="secondary"
              size="sm"
              disabled={busy}
              onClick={() => setConfirmingRefund(true)}
            >
              Refund demo payment
            </Button>
          )}
          {confirmingRefund && (
            <div className="flex items-center gap-1.5">
              <Button
                variant="danger"
                size="sm"
                loading={busy}
                onClick={() => run(refund, { bookingId: booking._id })}
              >
                Confirm refund
              </Button>
              <Button variant="ghost" size="sm" disabled={busy} onClick={() => setConfirmingRefund(false)}>
                Keep
              </Button>
            </div>
          )}
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default AdminBookings;
