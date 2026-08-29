import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider, useAuth } from "@clerk/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import "./index.css";
import App from "./App.jsx";
import SetupNoticePage from "./pages/SetupNoticePage.jsx";
import { convex, isBackendConfigured, CLERK_PUBLISHABLE_KEY } from "./lib/convexClient.js";

const root = createRoot(document.getElementById("root"));

if (!isBackendConfigured) {
  root.render(
    <StrictMode>
      <SetupNoticePage />
    </StrictMode>
  );
} else {
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </StrictMode>
  );
}
