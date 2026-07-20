import { Card } from "@/shared/ui/Card";
import { ProgressBar, type ProgressTone } from "@/shared/ui/ProgressBar";
import type { OcupacaoUnidade } from "../types";

/** Tom da barra conforme lotação: cheio → perigo, quase → aviso. */
function toneFor(pct: number): ProgressTone {
  if (pct >= 90) return "danger";
  if (pct >= 70) return "warning";
  return "primary";
}

/** Ocupação atual por unidade (presentes / capacidade) com barra de progresso. */
export function OccupancyBoard({ ocupacao }: { ocupacao: OcupacaoUnidade[] }) {
  return (
    <Card title="Ocupação por unidade">
      <ul className="space-y-4">
        {ocupacao.map((u) => (
          <li key={u.unidadeId}>
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
              <span className="font-body text-sm font-semibold text-text-strong">{u.nome}</span>
              <span className="font-body text-xs text-text-muted">
                <span className="font-display text-base tracking-wide text-text-strong">
                  {u.dentro}
                </span>{" "}
                / {u.capacidade}
              </span>
            </div>
            <ProgressBar value={u.pct} tone={toneFor(u.pct)} showLabel />
          </li>
        ))}
      </ul>
    </Card>
  );
}
