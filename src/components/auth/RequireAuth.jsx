import { useUser, SignInButton } from "@clerk/react";
import LoadingState from "../ui/Spinner.jsx";
import Button from "../ui/Button.jsx";
import Icon from "../ui/Icon.jsx";

/** Wraps a page that requires a signed-in user, showing a sign-in prompt otherwise. */
const RequireAuth = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <LoadingState label="Checking your session…" />;

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center px-4">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <Icon name="lock" className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900">Sign in required</h2>
        <p className="text-sm text-slate-500 max-w-sm">
          Please sign in to view this page.
        </p>
        <SignInButton mode="modal">
          <Button>Sign in</Button>
        </SignInButton>
      </div>
    );
  }

  return children;
};

export default RequireAuth;
