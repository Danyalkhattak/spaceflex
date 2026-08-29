import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { getErrorMessage } from "../../utils/errors.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import { formatDate, titleCase } from "../../lib/format.js";

const STATUS_OPTIONS = ["new", "contacted", "in_progress", "resolved", "closed"];

/** Links an inquiry to the correct pillar's detail page for its property. */
function propertyDetailPath(category, slug) {
  switch (category) {
    case "coworking":
      return `/coworking/${slug}`;
    case "housing":
      return `/housing/property/${slug}`;
    default:
      return `/enterprise-office/property/${slug}`;
  }
}

/**
 * Inquiry management. Rendered inside AdminLayout (which already gates on a
 * verified admin profile), so queries run unconditionally.
 */
export default function AdminInquiries() {
  const [statusFilter, setStatusFilter] = useState("");

  const inquiries = useQuery(
    api.inquiries.queries.getAllInquiries,
    statusFilter ? { status: statusFilter } : {}
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Inquiries</h2>
          <p className="text-sm text-slate-500">
            Every inquiry submitted across SpaceFlex - enterprise leasing, virtual offices,
            housing, and general requests.
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {titleCase(s)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {inquiries === undefined && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white" />
            ))}
          </div>
        )}

        {inquiries !== undefined && inquiries.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-medium text-slate-700">No inquiries match this filter.</p>
          </div>
        )}

        {inquiries?.map((inquiry) => (
          <AdminInquiryRow key={inquiry._id} inquiry={inquiry} />
        ))}
      </div>
    </div>
  );
}

function AdminInquiryRow({ inquiry }) {
  const updateStatus = useMutation(api.inquiries.mutations.updateInquiryStatus);
  const updateNotes = useMutation(api.inquiries.mutations.updateInquiryNotes);

  const [notesDraft, setNotesDraft] = useState(inquiry.adminNotes ?? "");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [error, setError] = useState("");

  async function handleStatusChange(newStatus) {
    setSavingStatus(true);
    setError("");
    try {
      await updateStatus({ inquiryId: inquiry._id, status: newStatus });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleSaveNotes() {
    setSavingNotes(true);
    setError("");
    try {
      await updateNotes({ inquiryId: inquiry._id, adminNotes: notesDraft });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSavingNotes(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand-400">{titleCase(inquiry.inquiryType)}</p>
          {inquiry.propertyTitle && (
            <p className="mt-0.5 text-sm font-medium text-brand-800">
              {inquiry.propertySlug ? (
                <Link
                  to={propertyDetailPath(inquiry.propertyCategory, inquiry.propertySlug)}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {inquiry.propertyTitle} ↗
                </Link>
              ) : (
                inquiry.propertyTitle
              )}
            </p>
          )}
          <p className="mt-0.5 font-medium text-slate-800">{inquiry.name}</p>
          <p className="text-sm text-slate-500">{inquiry.email}{inquiry.phone ? ` · ${inquiry.phone}` : ""}</p>
          {inquiry.companyName && <p className="text-sm text-slate-500">{inquiry.companyName}</p>}
        </div>
        <StatusBadge status={inquiry.status} />
      </div>

      <p className="mt-3 text-sm text-slate-700">{inquiry.message}</p>
      <p className="mt-2 text-xs text-slate-400">Submitted {formatDate(inquiry.createdAt)}</p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[auto,1fr] sm:items-start">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Status</label>
          <select
            value={inquiry.status}
            disabled={savingStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:opacity-60"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {titleCase(s)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">Admin notes</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <textarea
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              rows={2}
              maxLength={3000}
              placeholder="Internal follow-up notes…"
              className="flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            <button
              type="button"
              onClick={handleSaveNotes}
              disabled={savingNotes}
              className="shrink-0 rounded-md bg-brand-900 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingNotes ? "Saving…" : "Save notes"}
            </button>
          </div>
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
