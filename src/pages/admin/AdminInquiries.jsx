import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser, SignInButton } from "@clerk/react";
import { api } from "../../../convex/_generated/api";
import { useCurrentUser } from "../../hooks/useCurrentUser.js";
import StatusBadge from "../../components/StatusBadge.jsx";
import { formatDate, titleCase } from "../../lib/format.js";

const STATUS_OPTIONS = ["new", "contacted", "in_progress", "resolved", "closed"];

export default function AdminInquiries() {
  const { isSignedIn, isLoaded } = useUser();
  const { isAdmin, isLoading: profileLoading } = useCurrentUser();
  const [statusFilter, setStatusFilter] = useState("");

  const inquiries = useQuery(
    api.inquiries.queries.getAllInquiries,
    isSignedIn && isAdmin ? { status: statusFilter || undefined } : "skip"
  );

  if (isLoaded && !isSignedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-semibold text-brand-950">Admin sign-in required</h1>
        <SignInButton mode="modal">
          <button className="mt-5 rounded-md bg-brand-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">
            Sign in
          </button>
        </SignInButton>
      </div>
    );
  }

  if (isSignedIn && !profileLoading && !isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-semibold text-brand-950">Admins only</h1>
        <p className="mt-2 text-sm text-slate-600">This page is restricted to SpaceFlex leasing administrators.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brand-950">Inquiry Management</h1>
          <p className="mt-1 text-sm text-slate-600">Every inquiry submitted across SpaceFlex, including enterprise leasing.</p>
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

      <div className="mt-8 space-y-4">
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
      setError(friendlyErrorMessage(err));
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
      setError(friendlyErrorMessage(err));
    } finally {
      setSavingNotes(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand-400">{titleCase(inquiry.inquiryType)}</p>
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

function friendlyErrorMessage(err) {
  const raw = err?.message ?? "";
  const match = raw.match(/(UNAUTHENTICATED|FORBIDDEN|NOT_FOUND|VALIDATION):\s*(.+)/);
  if (match) return match[2];
  return "Something went wrong. Please try again.";
}
