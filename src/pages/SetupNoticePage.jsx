
/**
 * Shown instead of the app when VITE_CONVEX_URL / VITE_CLERK_PUBLISHABLE_KEY
 * are missing from the environment, so a fresh checkout fails loudly and
 * helpfully instead of throwing a blank-screen crash from deep inside
 * ConvexReactClient / ClerkProvider.
 */
const SetupNoticePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <h1 className="text-xl font-semibold text-slate-900">
          SpaceFlex needs a bit of setup
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">
            VITE_CONVEX_URL
          </code>{" "}
          and{" "}
          <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">
            VITE_CLERK_PUBLISHABLE_KEY
          </code>{" "}
          aren't set yet. Copy{" "}
          <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">
            .env.example
          </code>{" "}
          to{" "}
          <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">
            .env.local
          </code>
          , then:
        </p>
        <ol className="mt-4 space-y-2 text-sm text-slate-700 list-decimal list-inside">
          <li>
            Run <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">npx convex dev</code> to
            create/connect a Convex deployment and fill in{" "}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">VITE_CONVEX_URL</code>.
          </li>
          <li>
            Add a Clerk publishable key to{" "}
            <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">
              VITE_CLERK_PUBLISHABLE_KEY
            </code>
            .
          </li>
          <li>Restart the dev server.</li>
        </ol>
      </div>
    </div>
  );
};

export default SetupNoticePage;
