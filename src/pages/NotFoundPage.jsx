import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import { EmptyState } from "../components/ui/EmptyState.jsx";

const NotFoundPage = () => (
  <div className="max-w-3xl mx-auto px-4 py-20">
    <EmptyState
      icon="search"
      title="Page not found"
      message="The page you're looking for doesn't exist."
      action={
        <Button as={Link} to="/">
          Go home
        </Button>
      }
    />
  </div>
);

export default NotFoundPage;
