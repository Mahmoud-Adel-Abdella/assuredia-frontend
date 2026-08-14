/* Signal Atelier: the shell is established before any detail route so every page has an escape route. */
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import LoginPage from "@/pages/LoginPage";
import ClientsListPage from "@/pages/ClientsListPage";
import ClientDetailPage from "@/pages/ClientDetailPage";
import CreateClientPage from "@/pages/CreateClientPage";

export default function App() {
  return <AuthProvider><BrowserRouter><Toaster theme="dark" position="bottom-right" toastOptions={{ classNames: { toast: "assuredia-toast" } }} /><Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route path="/" element={<ClientsListPage overview />} />
        <Route path="/clients" element={<ClientsListPage />} />
        <Route path="/clients/new" element={<CreateClientPage />} />
        <Route path="/clients/:id" element={<ClientDetailPage />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter></AuthProvider>;
}
