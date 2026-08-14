/* Signal Atelier: status is a stamped operational signal, never decorative UI. */
import { Check, Circle, LoaderCircle, X } from "lucide-react";

export default function StatusBadge({ status, label }: { status: "PASS" | "FAIL" | "ACTIVE" | "INACTIVE" | "RUNNING" | "NEVER"; label?: string }) {
  const map = {
    PASS: { className: "status-pass", icon: Check, text: "PASS" },
    FAIL: { className: "status-fail", icon: X, text: "FAIL" },
    ACTIVE: { className: "status-active", icon: Circle, text: "Active" },
    INACTIVE: { className: "status-neutral", icon: Circle, text: "Inactive" },
    RUNNING: { className: "status-running", icon: LoaderCircle, text: "Running" },
    NEVER: { className: "status-neutral", icon: Circle, text: "Never run" },
  }[status];
  const Icon = map.icon;
  return <span className={`status-badge ${map.className}`}><Icon size={12} className={status === "RUNNING" ? "spin" : ""} />{label || map.text}</span>;
}
