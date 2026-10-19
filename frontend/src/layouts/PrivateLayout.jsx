import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth.context.jsx";

export function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
