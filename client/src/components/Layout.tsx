/* Signal Atelier: persistent rail, stamped status, and generous working canvas define the shell. */
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Activity, Bell, ChevronRight, CircleHelp, LayoutDashboard, LogOut, Settings, ShieldCheck, Users, Workflow, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { initials } from "@/lib/format";
import ThemeToggle from "@/components/ThemeToggle";
import BrandLogo from "@/components/BrandLogo";
import { toast } from "sonner";
import { useState, type ReactNode } from "react";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/clients/new", label: "New client", icon: Workflow },
];

function Rail({ onNavigate }: { onNavigate?: () => void }) {
  const { email, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className="rail">
      <div className="rail-brand">
        <BrandLogo className="dashboard-brand-logo" />
        {onNavigate && <button className="icon-button rail-close" onClick={onNavigate} aria-label="Close navigation"><X size={18} /></button>}
      </div>
      <div className="rail-section-label">Workspace</div>
      <nav className="rail-nav" aria-label="Primary navigation">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"} onClick={onNavigate} className={({ isActive }) => `rail-link ${isActive ? "active" : ""}`}>
            <Icon size={17} strokeWidth={1.8} /><span>{label}</span><ChevronRight className="rail-chevron" size={14} />
          </NavLink>
        ))}
      </nav>
      <div className="rail-section-label secondary-label">System</div>
      <nav className="rail-nav">
        <button type="button" className="rail-link muted-link" onClick={() => toast.info("Alerts are available from backend integrations.")}><Bell size={17} strokeWidth={1.8} /><span>Alerts</span><span className="nav-count">0</span></button>
        <button type="button" className="rail-link muted-link" onClick={() => toast.info("Settings are managed from each client workspace.")}><Settings size={17} strokeWidth={1.8} /><span>Settings</span></button>
      </nav>
      <div className="rail-spacer" />
      <div className="rail-trust"><ShieldCheck size={17} /><div><strong>API connected</strong><span>JWT session · 12h</span></div></div>
      <div className="rail-user">
        <div className="avatar">{initials(email)}</div><div className="user-copy"><strong>{email || "Admin user"}</strong><span>Administrator</span></div>
        <button className="icon-button" onClick={() => { logout(); navigate("/login"); }} aria-label="Log out"><LogOut size={16} /></button>
      </div>
    </aside>
  );
}

function pageMeta(pathname: string) {
  if (pathname === "/dashboard") return ["Overview", "A clear read on every active test path."];
  if (pathname === "/clients") return ["Clients", "Manage automation environments and their latest signals."];
  if (pathname === "/clients/new") return ["New client", "Register a new test environment and its first flows."];
  if (pathname.startsWith("/clients/")) return ["Client workspace", "Settings, flows, schedules, and run history."];
  return ["Assuredia", "Test operations control plane."];
}

export default function Layout({ children }: { children?: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const [title, subtitle] = pageMeta(location.pathname);
  return (
    <div className="app-shell">
      <div className={`mobile-rail-backdrop ${mobileOpen ? "visible" : ""}`} onClick={() => setMobileOpen(false)} />
      <div className={`rail-wrap ${mobileOpen ? "open" : ""}`}><Rail onNavigate={() => setMobileOpen(false)} /></div>
      <main className="main-canvas">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Activity size={19} /></button>
          <div className="topbar-copy"><div className="eyebrow">ASSUREDIA / CONTROL PLANE</div><h1>{title}</h1><p>{subtitle}</p></div>
          <div className="topbar-actions"><div className="live-indicator"><span className="pulse-dot" />Live API</div><ThemeToggle className="dashboard-theme-toggle" /><button className="icon-button" aria-label="Help"><CircleHelp size={18} /></button></div>
        </header>
        <div className="page-content">{children || <Outlet />}</div>
      </main>
    </div>
  );
}
