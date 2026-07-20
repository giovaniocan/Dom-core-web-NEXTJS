import { Dumbbell, User } from "lucide-react";
import { Badge, type BadgeTone } from "@/shared/ui/Badge";
import { Card } from "@/shared/ui/Card";
import { resolveFichaItens } from "../services/treinos-service";
import type { Exercicio, Ficha } from "../types";

const OBJETIVO_TONE: Record<string, BadgeTone> = {
  hipertrofia: "primary",
  força: "warning",
  resistência: "info",
  emagrecimento: "success",
};

export interface FichaCardProps {
  ficha: Ficha;
  exercicios: Exercicio[];
}

/** Cartão de uma ficha: cabeçalho + itens com exercício resolvido (nome/grupo). */
export function FichaCard({ ficha, exercicios }: FichaCardProps) {
  const itens = resolveFichaItens(ficha, exercicios);
  const tone = OBJETIVO_TONE[ficha.objetivo] ?? "neutral";

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl tracking-wide text-text-strong">{ficha.nome}</h3>
          <p className="mt-1 inline-flex items-center gap-1 font-body text-xs text-text-muted">
            <User size={12} /> {ficha.professor}
          </p>
        </div>
        <Badge tone={tone}>{ficha.objetivo}</Badge>
      </div>

      <ul className="mt-4 space-y-2">
        {itens.map((item, index) => (
          <li
            key={`${item.exercicioId}-${index}`}
            className="flex items-center justify-between gap-3 rounded-card border border-border bg-card-alt/60 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <Dumbbell size={16} className="text-primary" />
              <div className="flex flex-col">
                <span className="font-body text-sm font-semibold text-text-strong">
                  {item.nome}
                </span>
                <span className="font-body text-xs text-text-faint">{item.grupo}</span>
              </div>
            </div>
            <span className="font-display text-sm tracking-wide text-text-muted">
              {item.series} × {item.reps} @ {item.carga_kg} kg
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
