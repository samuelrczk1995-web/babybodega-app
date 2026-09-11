import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useProfile();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-inksoft">Cargando...</div>;
  }
  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }
  if (profile.role !== "admin" && profile.role !== "staff") {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
