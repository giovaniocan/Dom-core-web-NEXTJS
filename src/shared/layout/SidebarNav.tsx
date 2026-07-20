"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { NAV_SECTIONS } from "@/shared/config/nav";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Conteúdo da navegação (marca + seções). Compartilhado entre a Sidebar fixa
 * (desktop) e o drawer mobile. `onNavigate` é chamado ao clicar num link —
 * usado pelo drawer para se fechar.
 */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Marca */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-btn text-white">
          <Dumbbell size={20} />
        </span>
        <div className="leading-none">
          <p className="font-display text-2xl tracking-wide text-text-strong">DOMCORE</p>
          <p className="font-body text-[11px] uppercase tracking-widest text-text-faint">
            Gym · PR
          </p>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="mb-5">
            <p className="px-3 pb-2 font-body text-[11px] font-semibold uppercase tracking-widest text-text-faint">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(pathname, item.href);
                const Icon = item.icon;
                const building = item.status === "em-construcao";
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 font-body text-sm font-medium transition",
                        active
                          ? "bg-primary-btn/15 text-primary"
                          : "text-text-muted hover:bg-card-alt hover:text-text-strong",
                      )}
                    >
                      <Icon size={18} className={cn(active && "text-primary")} />
                      <span className="flex-1">{item.label}</span>
                      {building && (
                        <span
                          className="rounded-full bg-warning/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-warning"
                          title="Em construção"
                        >
                          em breve
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </>
  );
}
