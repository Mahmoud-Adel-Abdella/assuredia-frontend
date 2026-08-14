/* Signal Atelier: status is a stamped operational signal, never decorative UI. */
import { Check, Circle, LoaderCircle, X } from "lucide-react";

export default function StatusBadge({ status, label }: { status: string | null | undefined; label?: string }) {
  const normalized = String(status || "NEVER").toUpperCase();
  const resolved = normalized === "SUCCESS" || normalized === "COMPLETED" ? "PASS" : normalized === "FAILED" || normalized === "ERROR" ? "FAIL" : normalized === "PENDING" || normalized === "IN_PROGRESS" ? "RUNNING" : normalized;
  const map = {
    PASS: { className: "status-pass", icon: Check, text: "PASS" },
    FAIL: { className: "status-fail", icon: X, text: "FAIL" },
    ACTIVE: { className: "status-active", icon: Circle, text: "Active" },
    INACTIVE: { className: "status-neutral", icon: Circle, text: "Inactive" },
    RUNNING: { className: "status-running", icon: LoaderCircle, text: "Running" },
    NEVER: { className: "status-neutral", icon: Circle, text: "Never run" },
  }[resolved] || { className: "status-neutral", icon: Circle, text: normalized.replace(/_/g, " ") };
  const Icon = map.icon;
  return <span className={`status-badge ${map.className}`}><Icon size={12} className={resolved === "RUNNING" ? "spin" : ""} />{label || map.text}</span>;
}
