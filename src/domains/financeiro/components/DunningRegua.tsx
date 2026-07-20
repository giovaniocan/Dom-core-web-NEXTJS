import { ChevronRight } from "lucide-react";
import { Card } from "@/shared/ui/Card";
import { ProgressBar } from "@/shared/ui/ProgressBar";
import { formatBRL } from "@/shared/lib/format";
import { cn } from "@/shared/lib/cn";
import type { DunningRegua as DunningReguaType } from "../types";

export interface DunningReguaProps {
  regua: DunningReguaType;
}

/** Visualização da régua de cobrança (dunning) D+1 → D+7 com taxa de recuperação. */
export function DunningRegua({ regua }: DunningReguaProps) {
  return (
    <Card
      title="Régua de cobrança (dunning)"
      action={
        <span className="font-body text-xs text-text-faint">
          Recuperação média estimada
          <span className="ml-2 font-display text-lg tracking-wide text-primary">
            {regua.taxaRecuperacaoMedia}%
          </span>
        </span>
      }
    >
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Summary label="Vencido total" value={formatBRL(regua.valorVencido)} tone="danger" />
        <Summary
          label="Recuperável estimado"
          value={formatBRL(regua.recuperacaoEstimada)}
          tone="success"
        />
        <Summary label="Sob risco" value={formatBRL(regua.valorEmRisco)} tone="warning" />
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
        {regua.stages.map((stage, i) => (
          <div key={stage.key} className="flex flex-1 items-stretch gap-3">
            <div className="flex-1 rounded-card border border-border bg-card-alt/60 p-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-primary/15 px-2.5 py-0.5 font-display text-base tracking-wide text-primary">
                  {stage.key}
                </span>
                <span className="font-body text-xs font-semibold text-text-muted">
                  {Math.round(stage.taxaRecuperacao * 100)}% recup.
                </span>
              </div>

              <p className="mt-3 font-body text-sm font-semibold text-text-strong">
                {stage.titulo}
              </p>
              <p className="font-body text-xs text-text-faint">{stage.acao}</p>

              <div className="mt-3 flex items-end gap-2">
                <span className="font-display text-3xl leading-none tracking-wide text-text-strong">
                  {stage.atingidas}
                </span>
                <span className="mb-1 font-body text-xs text-text-muted">faturas</span>
              </div>
              <p className="font-body text-xs text-text-faint">{formatBRL(stage.valorAtingido)}</p>

              <div className="mt-3">
                <ProgressBar value={stage.taxaRecuperacao * 100} tone="primary" />
              </div>
            </div>

            {i < regua.stages.length - 1 && (
              <div className="hidden items-center text-text-faint lg:flex">
                <ChevronRight size={18} />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function Summary({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "danger" | "success" | "warning";
}) {
  const toneClass: Record<typeof tone, string> = {
    danger: "text-danger",
    success: "text-success",
    warning: "text-warning",
  };
  return (
    <div className="rounded-card border border-border bg-card p-3">
      <p className="font-body text-xs uppercase tracking-wide text-text-muted">{label}</p>
      <p className={cn("mt-1 font-display text-2xl tracking-wide", toneClass[tone])}>{value}</p>
    </div>
  );
}
