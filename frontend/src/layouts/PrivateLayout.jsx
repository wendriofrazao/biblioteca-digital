import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth.context.jsx";
import { HeaderDashboard } from "../components/HeaderDashboard.jsx";

export function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Verificando autenticação...</p>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <HeaderDashboard />
      <Outlet />;
    </>
  );
}
