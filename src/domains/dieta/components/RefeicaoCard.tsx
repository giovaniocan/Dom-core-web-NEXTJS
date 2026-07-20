import { Clock } from "lucide-react";
import { StatusPill } from "@/shared/ui/StatusPill";
import type { Refeicao } from "../types";

function MacroChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1 rounded-full bg-card-alt px-2.5 py-1 font-body text-xs text-text-muted">
      <span className="font-display tracking-wide text-text-strong">{value}</span>
      <span className="uppercase text-text-faint">{label}</span>
    </span>
  );
}

/** Cartão de uma refeição: nome, horário, itens, macros e status feito/pendente. */
export function RefeicaoCard({ refeicao }: { refeicao: Refeicao }) {
  const { nome, horario, itens, kcal, proteina, carbo, gordura, feito } = refeicao;

  return (
    <div className="rounded-card border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-body text-sm font-semibold text-text-strong">{nome}</h4>
          <span className="mt-0.5 inline-flex items-center gap-1 font-body text-xs text-text-faint">
            <Clock size={12} />
            {horario}
          </span>
        </div>
        {feito ? (
          <StatusPill status="concluido" label="Feito" />
        ) : (
          <StatusPill status="pendente" label="Pendente" />
        )}
      </div>

      <ul className="mt-3 space-y-1">
        {itens.map((item) => (
          <li key={item} className="font-body text-sm text-text-muted">
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
        <MacroChip label="kcal" value={String(kcal)} />
        <MacroChip label="prot" value={`${proteina}g`} />
        <MacroChip label="carb" value={`${carbo}g`} />
        <MacroChip label="gord" value={`${gordura}g`} />
      </div>
    </div>
  );
}
