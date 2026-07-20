"use client";

import { useMemo, useState } from "react";
import { Users, Banknote, TrendingDown, Bell } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Modal } from "@/shared/ui/Modal";
import { PageHeader } from "@/shared/ui/PageHeader";
import { StatTile } from "@/shared/ui/StatTile";
import { StatusPill } from "@/shared/ui/StatusPill";
import { Tabs } from "@/shared/ui/Tabs";
import { formatBRL, formatDate } from "@/shared/lib/format";
import { useInadimplencia } from "../hooks/useInadimplencia";
import { buildInadimplentes, buildDunningRegua } from "../services/financeiro-service";
import type { InadimplenteRow } from "../types";
import { InadimplentesTable } from "./InadimplentesTable";
import { DunningRegua } from "./DunningRegua";

const SUBNAV = [
  { key: "faturas", label: "Faturas", href: "/financeiro" },
  { key: "inadimplencia", label: "Inadimplência", href: "/financeiro/inadimplencia" },
];

/** Tela raiz de /financeiro/inadimplencia: inadimplentes + régua de dunning. */
export function InadimplenciaView() {
  const { data, loading, error } = useInadimplencia();
  const [alvo, setAlvo] = useState<InadimplenteRow | null>(null);

  const vencidas = data?.faturasVencidas ?? [];
  const alunos = data?.alunos ?? [];

  const rows = useMemo(() => buildInadimplentes(vencidas, alunos), [vencidas, alunos]);
  const regua = useMemo(() => buildDunningRegua(vencidas), [vencidas]);

  const ticketMedio = rows.length > 0 ? regua.valorVencido / rows.length : 0;

  return (
    <div>
      <PageHeader
        title="Inadimplência"
        subtitle="Faturas vencidas e régua de cobrança (dunning) D+1 → D+7"
      >
        <Tabs items={SUBNAV} activeKey="inadimplencia" />
      </PageHeader>

      {loading && <SkeletonGrid />}

      {error && !loading && (
        <EmptyState
          title="Não foi possível carregar a inadimplência"
          description={`${error} Verifique se o json-server está no ar (npm run mock).`}
        />
      )}

      {data && !loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile
              label="Inadimplentes"
              value={rows.length}
              icon={<Users size={18} />}
              accentClassName="text-danger"
              hint={`${regua.qtdVencidas} faturas vencidas`}
            />
            <StatTile
              label="Valor vencido"
              value={formatBRL(regua.valorVencido)}
              icon={<Banknote size={18} />}
              accentClassName="text-danger"
            />
            <StatTile
              label="Ticket médio"
              value={formatBRL(ticketMedio)}
              icon={<TrendingDown size={18} />}
              hint="por inadimplente"
            />
            <StatTile
              label="Recuperável est."
              value={formatBRL(regua.recuperacaoEstimada)}
              icon={<Bell size={18} />}
              accentClassName="text-success"
              hint={`${regua.taxaRecuperacaoMedia}% de recuperação média`}
            />
          </div>

          <DunningRegua regua={regua} />

          <Card flush title="Alunos inadimplentes">
            <InadimplentesTable rows={rows} onCobrar={setAlvo} />
          </Card>
        </div>
      )}

      <Modal
        open={alvo !== null}
        onClose={() => setAlvo(null)}
        title={
          <span className="inline-flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            Acionar cobrança
          </span>
        }
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setAlvo(null)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => setAlvo(null)}>
              Enviar cobrança
            </Button>
          </div>
        }
      >
        {alvo && (
          <div className="space-y-3 font-body text-sm text-text-muted">
            <p>
              Enviar cobrança para <strong className="text-text-strong">{alvo.aluno?.nome ?? alvo.fatura.aluno}</strong>{" "}
              referente à fatura vencida há {alvo.diasAtraso} dias.
            </p>
            <div className="rounded-card border border-border bg-card-alt/60 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-faint">
                  Venceu em {formatDate(alvo.fatura.vencimento)} · {alvo.fatura.tentativas_cobranca}{" "}
                  tentativas
                </span>
                <StatusPill status={alvo.fatura.status} />
              </div>
              <p className="mt-2 font-display text-2xl tracking-wide text-danger">
                {formatBRL(alvo.fatura.valor)}
              </p>
            </div>
            <p className="text-xs text-text-faint">
              Ação simulada nesta demo — nenhuma mensagem real é disparada.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-card border border-border bg-card-alt" />
        ))}
      </div>
      <div className="h-56 animate-pulse rounded-card border border-border bg-card-alt" />
      <div className="h-72 animate-pulse rounded-card border border-border bg-card-alt" />
    </div>
  );
}
