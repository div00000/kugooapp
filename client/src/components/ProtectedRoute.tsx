import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { useAuth, type Role } from "@/lib/auth";

export function ProtectedRoute({ children, roles }: { children: ReactNode; roles: Role[] }) {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !user) navigate("/login");
    else if (!loading && user && !roles.includes(user.role)) navigate("/");
  }, [loading, user, roles, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-kugoo-nude-light">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-kugoo-nude-dark border-t-kugoo-orange" />
      </div>
    );
  }
  if (!user || !roles.includes(user.role)) return null;
  return <>{children}</>;
}
