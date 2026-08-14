/* Signal Atelier: the shell is established before any detail route so every page has an escape route. */
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import ClientsListPage from "@/pages/ClientsListPage";
import ClientDetailPage from "@/pages/ClientDetailPage";
import CreateClientPage from "@/pages/CreateClientPage";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";

function AuthNavigationGuard() {
  useEffect(() => {
    const handleAuthLink = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest('a[href="/auth"]');
      if (!link || event.defaultPrevented) return;
      event.preventDefault();
      window.location.assign("/auth");
    };
    document.addEventListener("click", handleAuthLink, true);
    return () => document.removeEventListener("click", handleAuthLink, true);
  }, []);
  return null;
}

function AppToaster() {
  const { theme } = useTheme();
  return <Toaster theme={theme} position="bottom-right" toastOptions={{ classNames: { toast: "assuredia-toast" } }} />;
}

function AuthThemeControl() {
  const location = useLocation();
  return location.pathname === "/auth" ? <ThemeToggle className="auth-theme-toggle" /> : null;
}

function LoginRedirect() {
  const location = useLocation();
  const queryFrom = new URLSearchParams(location.search).get("from");
  const safeFrom = queryFrom?.startsWith("/") ? queryFrom : undefined;
  return <Navigate to="/auth" replace state={safeFrom ? { from: safeFrom } : location.state} />;
}

export default function App() {
  return <ThemeProvider defaultTheme="light" switchable><AuthProvider><BrowserRouter><AuthNavigationGuard /><AuthThemeControl /><AppToaster /><Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/login" element={<LoginRedirect />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<ClientsListPage overview />} />
        <Route path="/clients" element={<ClientsListPage />} />
        <Route path="/clients/new" element={<CreateClientPage />} />
        <Route path="/clients/:id" element={<ClientDetailPage />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter></AuthProvider></ThemeProvider>;
}
