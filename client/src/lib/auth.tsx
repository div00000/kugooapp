import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiRequest, setToken, clearToken, getToken } from "./queryClient";

export type Role = "customer" | "merchant" | "rider" | "admin";
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  avatarUrl: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  signup: (data: { name: string; email: string; phone?: string; password: string; role: Role }) => Promise<AuthUser>;
  logout: () => void;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    apiRequest("GET", "/api/auth/me")
      .then((res) => setUser(res.user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiRequest("POST", "/api/auth/login", { email, password });
    setToken(res.token);
    setUser(res.user);
    return res.user as AuthUser;
  };

  const signup = async (data: { name: string; email: string; phone?: string; password: string; role: Role }) => {
    const res = await apiRequest("POST", "/api/auth/signup", data);
    setToken(res.token);
    setUser(res.user);
    return res.user as AuthUser;
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const deleteAccount = async () => {
    await apiRequest("DELETE", "/api/auth/me");
    logout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
