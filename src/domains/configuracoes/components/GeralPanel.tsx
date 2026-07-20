import { Building2, DoorOpen, Users } from "lucide-react";
import { Badge, type BadgeTone } from "@/shared/ui/Badge";
import { Card } from "@/shared/ui/Card";
import { formatBRL } from "@/shared/lib/format";
import type { Academia, PlanoSaas, Plano, Unidade } from "../types";

const PLANO_SAAS_META: Record<PlanoSaas, { label: string; tone: BadgeTone }> = {
  starter: { label: "Starter", tone: "neutral" },
  pro: { label: "Pro", tone: "primary" },
  enterprise: { label: "Enterprise", tone: "success" },
};

function DadoLinha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="font-body text-sm text-text-muted">{rotulo}</span>
      <span className="font-body text-sm font-semibold text-text-strong">{valor}</span>
    </div>
  );
}

export interface GeralPanelProps {
  academia: Academia;
  unidades: Unidade[];
  planos: Plano[];
}

/** Aba "Geral": dados cadastrais da academia, unidades e planos comerciais. */
export function GeralPanel({ academia, unidades, planos }: GeralPanelProps) {
  const planoMeta = PLANO_SAAS_META[academia.plano_saas];

  return (
    <div className="space-y-4">
      <Card
        title="Dados da academia"
        action={
          <Badge tone={planoMeta?.tone ?? "neutral"}>
            Plano {planoMeta?.label ?? academia.plano_saas}
          </Badge>
        }
      >
        <div className="divide-y divide-border">
          <DadoLinha rotulo="Nome" valor={academia.nome} />
          <DadoLinha rotulo="CNPJ" valor={academia.cnpj} />
          <DadoLinha rotulo="Cidade / Estado" valor={`${academia.cidade} / ${academia.estado}`} />
        </div>
      </Card>

      <div>
        <h3 className="mb-3 font-body text-sm font-semibold text-text-strong">
          Unidades <span className="text-text-faint">({unidades.length})</span>
        </h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {unidades.map((unidade) => (
            <Card key={unidade.id}>
              <div className="flex items-start gap-3">
                <span className="rounded-card bg-card-alt p-2 text-primary">
                  <Building2 size={20} />
                </span>
                <div className="min-w-0">
                  <p className="font-body text-base font-semibold text-text-strong">
                    {unidade.nome}
                  </p>
                  <p className="mt-0.5 font-body text-sm text-text-muted">{unidade.endereco}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-6">
                <span className="inline-flex items-center gap-1.5 font-body text-sm text-text-muted">
                  <Users size={15} className="text-text-faint" />
                  <span className="font-display text-lg tracking-wide text-text-strong">
                    {unidade.capacidade}
                  </span>
                  de capacidade
                </span>
                <span className="inline-flex items-center gap-1.5 font-body text-sm text-text-muted">
                  <DoorOpen size={15} className="text-text-faint" />
                  <span className="font-display text-lg tracking-wide text-text-strong">
                    {unidade.catracas}
                  </span>
                  {unidade.catracas === 1 ? "catraca" : "catracas"}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-body text-sm font-semibold text-text-strong">
          Planos comerciais <span className="text-text-faint">({planos.length})</span>
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {planos.map((plano) => (
            <Card key={plano.id}>
              <div className="flex items-center justify-between">
                <p className="font-body text-sm font-semibold text-text-strong">{plano.nome}</p>
                <Badge tone="neutral">
                  {plano.periodo_meses}
                  {plano.periodo_meses === 1 ? " mês" : " meses"}
                </Badge>
              </div>
              <p className="mt-2 font-display text-2xl tracking-wide text-text-strong">
                {formatBRL(plano.valor)}
              </p>
              <p className="mt-1 font-body text-xs text-text-faint">{plano.descricao}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
