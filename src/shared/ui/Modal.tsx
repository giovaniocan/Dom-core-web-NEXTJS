"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, footer, className }: ModalProps) {
  // Fecha com ESC.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-lg rounded-card border border-border bg-surface shadow-xl",
          className,
        )}
      >
        {title && (
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-xl uppercase tracking-wide text-text-strong">
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="rounded-md p-1 text-text-muted hover:bg-card-alt hover:text-text-strong"
            >
              <X size={18} />
            </button>
          </header>
        )}
        <div className="p-5">{children}</div>
        {footer && (
          <footer className="flex justify-end gap-2 border-t border-border px-5 py-4">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
