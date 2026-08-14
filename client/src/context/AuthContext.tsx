/* Signal Atelier: authentication is a visible state transition, never a hidden side effect. */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { authApi } from "@/api/client";

interface AuthContextValue {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem("assuredia_token"));
  const [email, setEmail] = useState(() => localStorage.getItem("assuredia_email"));

  const value = useMemo<AuthContextValue>(() => ({
    token,
    email,
    isAuthenticated: Boolean(token),
    async login(nextEmail, password) {
      const response = await authApi.login(nextEmail, password);
      localStorage.setItem("assuredia_token", response.data.token);
      localStorage.setItem("assuredia_email", response.data.email || nextEmail);
      setToken(response.data.token);
      setEmail(response.data.email || nextEmail);
    },
    logout() {
      localStorage.removeItem("assuredia_token");
      localStorage.removeItem("assuredia_email");
      setToken(null);
      setEmail(null);
    },
  }), [email, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
