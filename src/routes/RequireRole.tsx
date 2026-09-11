import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import type { Role } from "../types";

export function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { profile, loading } = useProfile();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-inksoft">Cargando...</div>;
  }
  if (!profile || !roles.includes(profile.role)) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
}
