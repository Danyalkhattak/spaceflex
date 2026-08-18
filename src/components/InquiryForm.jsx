import { useState } from "react";
import { useMutation } from "convex/react";
import { useUser, SignInButton } from "@clerk/react";
import { api } from "../../convex/_generated/api";
import { ENTERPRISE_INQUIRY_REASONS } from "../data/enterpriseConfig.js";

const MESSAGE_MAX = 3000;

export default function InquiryForm({ propertyId, propertyTitle }) {
  const { isSignedIn, isLoaded } = useUser();
  const createInquiry = useMutation(api.inquiries.mutations.createInquiry);

  const [companyName, setCompanyName] = useState("");
  const [reason, setReason] = useState(ENTERPRISE_INQUIRY_REASONS[0].value);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const selectedReason = ENTERPRISE_INQUIRY_REASONS.find((r) => r.value === reason);
  const trimmedMessage = message.trim();
  const isMessageValid = trimmedMessage.length > 0 && trimmedMessage.length <= MESSAGE_MAX;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isMessageValid) {
      setStatus("error");
      setErrorMessage(
        trimmedMessage.length === 0
          ? "Please enter a message for the leasing team."
          : `Message cannot exceed ${MESSAGE_MAX} characters.`
      );
      return;
    }

    setStatus("submitting");
    setErrorMessage("");
    try {
      await createInquiry({
        propertyId,
        companyName: companyName.trim() ? companyName.trim() : undefined,
        message: trimmedMessage,
        inquiryType: selectedReason.inquiryType,
      });
      setStatus("success");
      setMessage("");
      setCompanyName("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(friendlyErrorMessage(err));
    }
  }

  if (isLoaded && !isSignedIn) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
        <p className="text-sm text-slate-600">
          Sign in to send a leasing inquiry{propertyId ? " for this property" : ""}.
        </p>
        <SignInButton mode="modal">
          <button className="mt-3 rounded-md bg-brand-900 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800">
            Sign in to inquire
          </button>
        </SignInButton>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5">
        <p className="font-semibold text-green-900">Inquiry submitted successfully.</p>
        <p className="mt-1 text-sm text-green-800">Our enterprise leasing team will contact you soon.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-3 text-sm font-medium text-green-900 underline"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="font-display text-lg font-semibold text-brand-950">Send a leasing inquiry</h3>
      {propertyTitle && <p className="mt-1 text-sm text-slate-500">Regarding: {propertyTitle}</p>}

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="if-company" className="mb-1 block text-sm font-medium text-slate-700">
            Company name <span className="text-slate-400">(optional)</span>
          </label>
          <input
            id="if-company"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            maxLength={150}
            placeholder="Your company"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label htmlFor="if-reason" className="mb-1 block text-sm font-medium text-slate-700">
            Inquiry type
          </label>
          <select
            id="if-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            {ENTERPRISE_INQUIRY_REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="if-message" className="mb-1 block text-sm font-medium text-slate-700">
            Message
          </label>
          <textarea
            id="if-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            maxLength={MESSAGE_MAX}
            placeholder="Tell us about your space requirements, team size, and preferred move-in date…"
            className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <p className="mt-1 text-right text-xs text-slate-400">
            {message.length}/{MESSAGE_MAX}
          </p>
        </div>

        {status === "error" && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-md bg-brand-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send Inquiry"}
        </button>
      </div>
    </form>
  );
}

/** Convex errors surface as "CATEGORY: message" (see lib/validators.ts) - strip the prefix for display. */
function friendlyErrorMessage(err) {
  const raw = err?.message ?? "";
  const match = raw.match(/(UNAUTHENTICATED|FORBIDDEN|NOT_FOUND|VALIDATION):\s*(.+)/);
  if (match) return match[2];
  return "Something went wrong sending your inquiry. Please try again.";
}
