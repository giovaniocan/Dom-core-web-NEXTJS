"use client";

import { Search } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import type { AlunoStatus, AlunosFilter } from "../types";

export interface AlunosFiltersProps {
  filter: AlunosFilter;
  planos: string[];
  onChange: (filter: AlunosFilter) => void;
}

const STATUS_OPTIONS: { value: AlunoStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos os status" },
  { value: "ativo", label: "Ativos" },
  { value: "inadimplente", label: "Inadimplentes" },
  { value: "trancado", label: "Trancados" },
];

const selectClass = cn(
  "h-10 rounded-lg border border-border bg-surface px-3 font-body text-sm text-text-strong",
  "outline-none transition-colors focus:border-primary",
);

export function AlunosFilters({ filter, planos, onChange }: AlunosFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[240px] flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint"
        />
        <input
          type="search"
          value={filter.search}
          placeholder="Buscar por nome, matrícula ou telefone…"
          onChange={(e) => onChange({ ...filter, search: e.target.value })}
          className={cn(
            "h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 font-body text-sm text-text-strong placeholder:text-text-faint",
            "outline-none transition-colors focus:border-primary",
          )}
        />
      </div>

      <select
        aria-label="Filtrar por status"
        value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as AlunosFilter["status"] })}
        className={selectClass}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Filtrar por plano"
        value={filter.plano}
        onChange={(e) => onChange({ ...filter, plano: e.target.value })}
        className={selectClass}
      >
        <option value="todos">Todos os planos</option>
        {planos.map((plano) => (
          <option key={plano} value={plano}>
            {plano}
          </option>
        ))}
      </select>
    </div>
  );
}
