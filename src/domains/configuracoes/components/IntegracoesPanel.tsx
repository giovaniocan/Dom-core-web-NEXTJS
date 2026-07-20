import { Plug } from "lucide-react";
import { Card } from "@/shared/ui/Card";
import { StatusPill } from "@/shared/ui/StatusPill";
import type { Integracao, IntegracaoStatus } from "../types";

/**
 * StatusPill não conhece "conectado"; reaproveitamos um status de tom
 * equivalente (verde) e sobrescrevemos o rótulo. "pendente" já é conhecido (âmbar).
 */
const PILL_STATUS: Record<IntegracaoStatus, { status: string; label: string }> = {
  conectado: { status: "liberado", label: "Conectado" },
  pendente: { status: "pendente", label: "Pendente" },
};

export interface IntegracoesPanelProps {
  integracoes: Integracao[];
}

/** Aba "Integrações": cartões de status das conexões externas da academia. */
export function IntegracoesPanel({ integracoes }: IntegracoesPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {integracoes.map((integracao) => {
        const pill = PILL_STATUS[integracao.status];
        return (
          <Card key={integracao.id}>
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-card bg-card-alt p-2 text-primary">
                <Plug size={20} />
              </span>
              <StatusPill status={pill.status} label={pill.label} />
            </div>
            <p className="mt-4 font-body text-base font-semibold text-text-strong">
              {integracao.nome}
            </p>
            <p className="mt-1 font-body text-sm text-text-muted">{integracao.descricao}</p>
          </Card>
        );
      })}
    </div>
  );
}
