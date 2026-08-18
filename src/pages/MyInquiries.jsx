import { useQuery } from "convex/react";
import { useUser, SignInButton } from "@clerk/react";
import { api } from "../../convex/_generated/api";
import StatusBadge from "../components/StatusBadge.jsx";
import { formatDate, titleCase } from "../lib/format.js";

export default function MyInquiries() {
  const { isSignedIn, isLoaded } = useUser();
  const inquiries = useQuery(api.inquiries.queries.getMyInquiries, isSignedIn ? {} : "skip");

  if (isLoaded && !isSignedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-semibold text-brand-950">Sign in to view your inquiries</h1>
        <p className="mt-2 text-sm text-slate-600">
          Once you're signed in, every leasing inquiry you've submitted will show up here.
        </p>
        <SignInButton mode="modal">
          <button className="mt-5 rounded-md bg-brand-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">
            Sign in
          </button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-brand-950">My Inquiries</h1>
      <p className="mt-1 text-sm text-slate-600">Every leasing inquiry you've submitted, and its current status.</p>

      <div className="mt-8">
        {inquiries === undefined && <InquiriesSkeleton />}

        {inquiries !== undefined && inquiries.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-medium text-slate-700">You haven't sent any inquiries yet.</p>
          </div>
        )}

        {inquiries !== undefined && inquiries.length > 0 && (
          <ul className="space-y-3">
            {inquiries.map((inquiry) => (
              <li key={inquiry._id} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-brand-400">
                      {titleCase(inquiry.inquiryType)}
                    </p>
                    {inquiry.companyName && (
                      <p className="mt-0.5 text-sm text-slate-500">{inquiry.companyName}</p>
                    )}
                  </div>
                  <StatusBadge status={inquiry.status} />
                </div>
                <p className="mt-3 text-sm text-slate-700">{inquiry.message}</p>
                <p className="mt-3 text-xs text-slate-400">Submitted {formatDate(inquiry.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function InquiriesSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-xl border border-slate-200 bg-white" />
      ))}
    </div>
  );
}
