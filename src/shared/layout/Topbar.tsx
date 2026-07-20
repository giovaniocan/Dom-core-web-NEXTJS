"use client";

import { Search, ChevronDown, Bell } from "lucide-react";
import { Avatar } from "@/shared/ui/Avatar";
import { ThemeToggle } from "./ThemeToggle";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-surface/80 px-5 backdrop-blur">
      {/* Busca */}
      <div className="relative flex-1 max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint"
        />
        <input
          type="search"
          placeholder="Buscar aluno, fatura, terminal…"
          className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 font-body text-sm text-text-strong placeholder:text-text-faint focus:border-primary focus:outline-none"
        />
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        {/* Seletor de unidade */}
        <button className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 font-body text-sm text-text-strong hover:bg-card-alt sm:flex">
          <span className="h-2 w-2 rounded-full bg-success" />
          Unidade Centro
          <ChevronDown size={15} className="text-text-faint" />
        </button>

        <ThemeToggle />

        <button
          aria-label="Notificações"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-text-muted hover:text-text-strong"
        >
          <Bell size={17} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        {/* Usuário */}
        <div className="flex items-center gap-2 pl-1">
          <Avatar name="Lucas Garcia" size="sm" />
          <div className="hidden leading-tight sm:block">
            <p className="font-body text-sm font-semibold text-text-strong">Lucas Garcia</p>
            <p className="font-body text-xs text-text-faint">Dono</p>
          </div>
        </div>
      </div>
    </header>
  );
}
