"use client";

import { Users } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { ProgressBar } from "@/shared/ui/ProgressBar";
import {
  isLotada,
  modalidadeAccent,
  ocupacaoPct,
  ocupacaoTone,
} from "../services/agenda-service";
import type { Aula } from "../types";

interface ClassCardProps {
  aula: Aula;
  onClick: () => void;
}

/** Célula de aula na grade semanal. Borda esquerda colorida por modalidade. */
export function ClassCard({ aula, onClick }: ClassCardProps) {
  const accent = modalidadeAccent(aula.nome);
  const pct = ocupacaoPct(aula);
  const lotada = isLotada(aula);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full flex-col gap-1.5 rounded-lg border border-l-4 border-border bg-card px-2.5 py-2 text-left transition",
        "hover:border-text-faint hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        accent.border,
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="font-body text-sm font-semibold leading-tight text-text-strong">
          {aula.nome}
        </span>
        {lotada && (
          <span className="shrink-0 rounded bg-danger/15 px-1.5 py-0.5 font-body text-[10px] font-bold uppercase tracking-wide text-danger">
            Lotada
          </span>
        )}
      </div>

      <span className="truncate font-body text-xs text-text-muted">{aula.professor}</span>

      <div className="mt-0.5 flex items-center gap-1.5 font-body text-xs text-text-muted">
        <Users size={12} className={accent.text} />
        <span className="font-display text-sm tracking-wide text-text-strong">
          {aula.inscritos}/{aula.vagas}
        </span>
      </div>

      <ProgressBar value={pct} tone={ocupacaoTone(pct)} />
    </button>
  );
}
