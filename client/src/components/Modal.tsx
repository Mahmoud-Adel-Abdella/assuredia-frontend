/* Signal Atelier: dialogs use a calm scrim, strong title, and explicit exits for risky actions. */
import { X } from "lucide-react";
import { type ReactNode } from "react";

export default function Modal({ open, onClose, title, description, children, wide = false }: { open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode; wide?: boolean }) {
  if (!open) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className={`modal-card ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-header"><div><h2>{title}</h2>{description && <p>{description}</p>}</div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></div>
      {children}
    </section>
  </div>;
}
