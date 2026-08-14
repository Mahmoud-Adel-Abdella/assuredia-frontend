/* Signal Atelier: the shell is established before any detail route so every page has an escape route. */
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import ClientsListPage from "@/pages/ClientsListPage";
import ClientDetailPage from "@/pages/ClientDetailPage";
import CreateClientPage from "@/pages/CreateClientPage";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function App() {
  return <ThemeProvider defaultTheme="dark" switchable><AuthProvider><BrowserRouter><Toaster theme="dark" position="bottom-right" toastOptions={{ classNames: { toast: "assuredia-toast" } }} /><Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/login" element={<Navigate to="/auth" replace />} />
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
