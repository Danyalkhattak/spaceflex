import React from "react";
import { ErrorState } from "../ui/EmptyState.jsx";
import Button from "../ui/Button.jsx";
import { getErrorMessage } from "../../utils/errors.js";

class RouteErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error("Route error:", error);
  }

  componentDidUpdate(prevProps) {
    // Reset the boundary automatically when navigating to a new route/key.
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorState
            title="Something went wrong"
            message={getErrorMessage(this.state.error)}
            action={
              <Button variant="secondary" onClick={() => this.setState({ error: null })}>
                Try again
              </Button>
            }
          />
        </div>
      );
    }
    return this.props.children;
  }
}

export default RouteErrorBoundary;
