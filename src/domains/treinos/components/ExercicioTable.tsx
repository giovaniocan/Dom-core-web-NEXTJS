"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/shared/ui/Badge";
import { DataTable, type Column } from "@/shared/ui/DataTable";
import { cn } from "@/shared/lib/cn";
import { gruposMusculares } from "../services/treinos-service";
import type { Exercicio } from "../types";

const TODOS = "todos";

export interface ExercicioTableProps {
  exercicios: Exercicio[];
}

/** Biblioteca de exercícios com filtro por grupo muscular (chips). */
export function ExercicioTable({ exercicios }: ExercicioTableProps) {
  const [grupo, setGrupo] = useState<string>(TODOS);
  const grupos = useMemo(() => gruposMusculares(exercicios), [exercicios]);
  const filtrados = useMemo(
    () => (grupo === TODOS ? exercicios : exercicios.filter((e) => e.grupo === grupo)),
    [exercicios, grupo],
  );

  const columns: Column<Exercicio>[] = [
    {
      key: "nome",
      header: "Exercício",
      render: (e) => <span className="font-semibold text-text-strong">{e.nome}</span>,
    },
    {
      key: "grupo",
      header: "Grupo muscular",
      render: (e) => <Badge tone="primary">{e.grupo}</Badge>,
    },
    {
      key: "equipamento",
      header: "Equipamento",
      render: (e) => <span className="text-text-muted">{e.equipamento}</span>,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por grupo muscular">
        <FiltroChip label="Todos" active={grupo === TODOS} onClick={() => setGrupo(TODOS)} />
        {grupos.map((g) => (
          <FiltroChip key={g} label={g} active={grupo === g} onClick={() => setGrupo(g)} />
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtrados}
        rowKey={(e) => e.id}
        emptyLabel="Nenhum exercício neste grupo."
      />
    </div>
  );
}

function FiltroChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 font-body text-xs font-semibold transition-colors",
        active
          ? "border-primary bg-primary/15 text-primary"
          : "border-border bg-card text-text-muted hover:bg-card-alt",
      )}
    >
      {label}
    </button>
  );
}
