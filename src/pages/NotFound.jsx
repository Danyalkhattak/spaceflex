import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-brand-950">Page not found</h1>
      <p className="mt-2 text-slate-600">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-5 inline-block text-brand-800 underline">
        Back to home
      </Link>
    </div>
  );
}
