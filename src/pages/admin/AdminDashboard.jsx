import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Badge from "../../components/ui/Badge.jsx";
import { EmptyState } from "../../components/ui/EmptyState.jsx";
import { formatCurrency, formatDate, titleCase } from "../../lib/format.js";

function StatCard({ label, value, sub, to }) {
  const body = (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1.5 text-3xl font-semibold text-slate-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
  return to ? <Link to={to}>{body}</Link> : body;
}

const AdminDashboard = () => {
  const properties = useQuery(api.properties.queries.adminGetAllProperties, {});
  const bookings = useQuery(api.bookings.queries.adminGetAllBookings, {});
  const inquiries = useQuery(api.inquiries.queries.getAllInquiries, {});
  const users = useQuery(api.auth.users.adminListUsers, {});

  const anyLoading =
    properties === undefined || bookings === undefined || inquiries === undefined || users === undefined;

  if (anyLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white" />
        ))}
      </div>
    );
  }

  const activeProperties = properties.filter((p) => p.isActive).length;
  const featuredProperties = properties.filter((p) => p.isFeatured).length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const collected = bookings
    .filter((b) => b.paymentStatus === "demo_paid")
    .reduce((sum, b) => sum + b.totalAmount, 0);
  const newInquiries = inquiries.filter((i) => i.status === "new").length;
  const admins = users.filter((u) => u.role === "admin").length;

  const recentBookings = bookings.slice(0, 5);
  const recentInquiries = inquiries.slice(0, 5);

  return (
    <div className="space-y-8">
      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Properties"
            value={properties.length}
            sub={`${activeProperties} active · ${featuredProperties} featured`}
            to="/admin/properties"
          />
          <StatCard
            label="Bookings"
            value={bookings.length}
            sub={`${pendingBookings} pending`}
            to="/admin/bookings"
          />
          <StatCard
            label="Inquiries"
            value={inquiries.length}
            sub={`${newInquiries} new`}
            to="/admin/inquiries"
          />
          <StatCard
            label="Users"
            value={users.length}
            sub={`${admins} admin${admins === 1 ? "" : "s"}`}
            to="/admin/users"
          />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Demo revenue collected (simulated payments)
        </h2>
        <p className="mt-1 text-2xl font-semibold text-slate-900">
          {formatCurrency(collected)}
        </p>
        <p className="text-xs text-slate-500">
          Sum of demo_paid bookings across all categories - no real money is processed anywhere
          in SpaceFlex.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Latest bookings</h2>
            <Link to="/admin/bookings" className="text-sm font-medium text-brand-800 hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentBookings.length === 0 && (
              <EmptyState icon="calendar" title="No bookings yet" />
            )}
            {recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {booking.customerName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(booking.startDate)} → {formatDate(booking.endDate)} ·{" "}
                    {formatCurrency(booking.totalAmount, booking.currency)}
                  </p>
                </div>
                <Badge tone={booking.status === "pending" ? "amber" : booking.status === "cancelled" ? "red" : "green"} className="capitalize">
                  {booking.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Latest inquiries</h2>
            <Link to="/admin/inquiries" className="text-sm font-medium text-brand-800 hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentInquiries.length === 0 && (
              <EmptyState icon="search" title="No inquiries yet" />
            )}
            {recentInquiries.map((inquiry) => (
              <div
                key={inquiry._id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">{inquiry.name}</p>
                  <p className="truncate text-xs text-slate-500">
                    {titleCase(inquiry.inquiryType)} · {formatDate(inquiry.createdAt)}
                  </p>
                </div>
                <Badge tone={inquiry.status === "new" ? "amber" : "slate"} className="capitalize">
                  {inquiry.status.replace("_", " ")}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
