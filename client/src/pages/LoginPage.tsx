/* Signal Atelier: a quiet, text-safe entry point with the generated ambient signal held at the edge. */
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { getApiError } from "@/api/client";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (isAuthenticated) navigate("/", { replace: true }); }, [isAuthenticated, navigate]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!email || !password) { toast.error("Enter your email and password."); return; }
    setLoading(true);
    try {
      await login(email, password);
      const destination = (location.state as { from?: string } | null)?.from || "/";
      navigate(destination, { replace: true });
    } catch (error) { toast.error(getApiError(error, "Invalid login credentials.")); }
    finally { setLoading(false); }
  }

  return <div className="login-page">
    <div className="login-ambient" />
    <div className="login-grid" />
    <div className="login-shell">
      <div className="login-brand"><div className="brand-mark-frame"><img src="/manus-storage/assuredia-mark_94d836ed.png" alt="Assuredia mark" /></div><div><strong>assuredia</strong><span>test operations</span></div></div>
      <div className="login-card">
        <div className="login-kicker"><span className="pulse-dot" />Session guarded / 01</div>
        <h1>Keep every test path<br /><em>within sight.</em></h1>
        <p className="login-intro">Sign in to the control plane for your scheduled browser checks, flows, and failure signals.</p>
        <form onSubmit={submit} className="form-stack">
          <label className="field-label" htmlFor="email">Work email</label>
          <div className="input-with-icon"><Mail size={17} /><input id="email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
          <label className="field-label" htmlFor="password">Password</label>
          <div className="input-with-icon"><LockKeyhole size={17} /><input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" className="field-icon-action" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
          <button className="primary-button login-submit" type="submit" disabled={loading}>{loading ? <span className="loader-ring small" /> : <ArrowRight size={17} />}<span>{loading ? "Checking credentials" : "Enter workspace"}</span></button>
        </form>
        <div className="login-footnote"><ShieldCheck size={15} /><span>Session guarded · 12h token</span></div>
      </div>
      <div className="login-signal-readout"><div className="readout-header"><span className="signal-stamp">CHECKPOINT / 03</span><span className="readout-state">PASS</span></div><div className="readout-line"><span>browser path</span><strong>ready to observe</strong></div><div className="readout-line"><span>failure trace</span><strong>armed</strong></div><div className="readout-line"><span>endpoint</span><strong className="mono">localhost:8080</strong></div></div>
      <div className="login-footer"><span>ASSUREDIA / QA CONTROL PLANE</span><span>ENDPOINT READY · JWT GATE</span></div>
    </div>
  </div>;
}
