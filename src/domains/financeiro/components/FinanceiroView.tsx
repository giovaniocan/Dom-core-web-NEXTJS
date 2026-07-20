"use client";

import { useMemo, useState } from "react";
import { Bell, FileText } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Card } from "@/shared/ui/Card";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Modal } from "@/shared/ui/Modal";
import { PageHeader } from "@/shared/ui/PageHeader";
import { StatusPill } from "@/shared/ui/StatusPill";
import { Tabs } from "@/shared/ui/Tabs";
import { formatBRL, formatDate } from "@/shared/lib/format";
import { useFinanceiro } from "../hooks/useFinanceiro";
import { computeKpis } from "../services/financeiro-service";
import type { Fatura, FaturaStatus } from "../types";
import { FinanceiroKpiRow } from "./FinanceiroKpiRow";
import { FaturasTable } from "./FaturasTable";

type StatusFiltro = "todas" | FaturaStatus;

const FILTROS: { key: StatusFiltro; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "vencida", label: "Vencidas" },
  { key: "aberta", label: "Abertas" },
  { key: "paga", label: "Pagas" },
];

const SUBNAV = [
  { key: "faturas", label: "Faturas", href: "/financeiro" },
  { key: "inadimplencia", label: "Inadimplência", href: "/financeiro/inadimplencia" },
];

interface CobrancaAcao {
  fatura: Fatura;
  modo: "cobrar" | "segunda-via";
}

/** Tela raiz de /financeiro: KPIs + tabela de faturas com filtro e ações. */
export function FinanceiroView() {
  const { data, loading, error } = useFinanceiro();
  const [filtro, setFiltro] = useState<StatusFiltro>("todas");
  const [acao, setAcao] = useState<CobrancaAcao | null>(null);

  const faturas = data?.faturas ?? [];
  const kpis = useMemo(() => computeKpis(faturas), [faturas]);
  const filtradas = useMemo(
    () => (filtro === "todas" ? faturas : faturas.filter((f) => f.status === filtro)),
    [faturas, filtro],
  );

  return (
    <div>
      <PageHeader
        title="Financeiro"
        subtitle="Faturas, recebimentos e régua de cobrança · Unidade Centro"
      >
        <Tabs items={SUBNAV} activeKey="faturas" />
      </PageHeader>

      {loading && <SkeletonGrid />}

      {error && !loading && (
        <EmptyState
          title="Não foi possível carregar o financeiro"
          description={`${error} Verifique se o json-server está no ar (npm run mock).`}
        />
      )}

      {data && !loading && (
        <div className="space-y-4">
          <FinanceiroKpiRow kpis={kpis} />

          <Card
            flush
            title="Faturas"
            action={
              <Tabs
                items={FILTROS}
                activeKey={filtro}
                onChange={(k) => setFiltro(k as StatusFiltro)}
              />
            }
          >
            <FaturasTable
              faturas={filtradas}
              onCobrar={(f) => setAcao({ fatura: f, modo: "cobrar" })}
              onSegundaVia={(f) => setAcao({ fatura: f, modo: "segunda-via" })}
            />
          </Card>
        </div>
      )}

      <CobrancaModal acao={acao} onClose={() => setAcao(null)} />
    </div>
  );
}

function CobrancaModal({
  acao,
  onClose,
}: {
  acao: CobrancaAcao | null;
  onClose: () => void;
}) {
  const cobrar = acao?.modo === "cobrar";
  const title = cobrar ? "Enviar cobrança" : "Emitir 2ª via";
  const Icon = cobrar ? Bell : FileText;

  return (
    <Modal
      open={acao !== null}
      onClose={onClose}
      title={
        <span className="inline-flex items-center gap-2">
          <Icon size={18} className="text-primary" />
          {title}
        </span>
      }
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onClose}>
            {cobrar ? "Enviar agora" : "Gerar 2ª via"}
          </Button>
        </div>
      }
    >
      {acao && (
        <div className="space-y-3 font-body text-sm text-text-muted">
          <p>
            {cobrar
              ? "Uma notificação de cobrança será enviada ao aluno pelos canais configurados."
              : "Um novo boleto/link de pagamento será gerado com o mesmo valor."}
          </p>
          <div className="rounded-card border border-border bg-card-alt/60 p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text-strong">{acao.fatura.aluno}</span>
              <StatusPill status={acao.fatura.status} />
            </div>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-xs text-text-faint">
                Vence em {formatDate(acao.fatura.vencimento)} · comp. {acao.fatura.competencia}
              </span>
              <span className="font-display text-2xl tracking-wide text-text-strong">
                {formatBRL(acao.fatura.valor)}
              </span>
            </div>
          </div>
          <p className="text-xs text-text-faint">
            Ação simulada nesta demo — nenhuma mensagem real é disparada.
          </p>
        </div>
      )}
    </Modal>
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
      <div className="h-72 animate-pulse rounded-card border border-border bg-card-alt" />
    </div>
  );
}
