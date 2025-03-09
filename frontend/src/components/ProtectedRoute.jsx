import { Navigate, Outlet } from "react-router-dom";

import Loading from "./Loading";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = () => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
