import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return isAuthenticated ? (
    <div data-testid="protected-route">{children}</div>
  ) : (
    <Navigate to="/login" replace data-testid="redirect-login" />
  );
};

export default ProtectedRoute;
