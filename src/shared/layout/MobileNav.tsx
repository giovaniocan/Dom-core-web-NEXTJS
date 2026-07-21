"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SidebarNav } from "./SidebarNav";

/**
 * Navegação mobile (< lg): botão hamburguer no Topbar + drawer off-canvas.
 * A Sidebar desktop fica `hidden lg:flex`, então sem isto não há menu no mobile.
 * Fecha ao: clicar num link, clicar no backdrop, pressionar Esc ou trocar de rota.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Portal só depois de montar no cliente (evita mismatch de hidratação SSR).
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fecha ao navegar para outra rota.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Esc fecha o drawer e trava o scroll do body enquanto aberto.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Abrir menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-text-muted transition hover:text-text-strong lg:hidden"
      >
        <Menu size={18} />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-[60] lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          {/* Painel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[82%] flex-col border-r border-border bg-nav shadow-2xl"
          >
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition hover:bg-card-alt hover:text-text-strong"
            >
              <X size={18} />
            </button>
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        </div>,
          document.body,
        )}
    </>
  );
}
