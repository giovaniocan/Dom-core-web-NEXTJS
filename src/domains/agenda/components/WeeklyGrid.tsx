"use client";

import { CalendarX2 } from "lucide-react";
import { ClassCard } from "./ClassCard";
import { buildWeekGrid } from "../services/agenda-service";
import type { Aula } from "../types";

interface WeeklyGridProps {
  aulas: Aula[];
  onSelect: (aula: Aula) => void;
}

/** Grade semanal: linhas por horário, colunas por dia da semana. */
export function WeeklyGrid({ aulas, onSelect }: WeeklyGridProps) {
  if (aulas.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-border bg-card py-16 text-center">
        <CalendarX2 size={36} strokeWidth={1.5} className="text-text-faint" />
        <p className="font-body text-sm text-text-muted">
          Nenhuma aula agendada para esta unidade.
        </p>
      </div>
    );
  }

  const grid = buildWeekGrid(aulas);

  return (
    <div className="overflow-x-auto rounded-card border border-border bg-surface">
      <div className="min-w-[880px]">
        {/* Cabeçalho de dias */}
        <div className="grid grid-cols-[68px_repeat(7,1fr)] border-b border-border bg-card-alt">
          <div className="px-2 py-2.5" />
          {grid.dias.map((dia) => (
            <div
              key={dia}
              className="px-2 py-2.5 text-center font-display text-base uppercase tracking-widest text-text-strong"
            >
              {dia}
            </div>
          ))}
        </div>

        {/* Linhas de horário */}
        {grid.horarios.map((hora) => (
          <div
            key={hora}
            className="grid grid-cols-[68px_repeat(7,1fr)] border-b border-border last:border-b-0"
          >
            <div className="flex items-start justify-center border-r border-border px-1 py-2">
              <span className="font-display text-lg tracking-wide text-text-muted">{hora}</span>
            </div>

            {grid.dias.map((dia) => {
              const cell = grid.matrix[hora][dia];
              return (
                <div key={dia} className="min-h-[76px] space-y-1.5 border-r border-border p-1.5 last:border-r-0">
                  {cell.length === 0 ? (
                    <span className="flex h-full items-center justify-center font-body text-xs text-text-faint">
                      ·
                    </span>
                  ) : (
                    cell.map((aula) => (
                      <ClassCard key={aula.id} aula={aula} onClick={() => onSelect(aula)} />
                    ))
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
