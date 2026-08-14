/* Signal Atelier: formatting keeps operational facts compact, local, and readable. */
export function relativeTime(value: string | null) {
  if (!value) return "Never run";
  const seconds = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function duration(seconds: number | null | undefined) {
  if (seconds == null) return "—";
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

export function initials(email: string | null) {
  return (email || "admin").split(/[.@_ -]/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "AD";
}
