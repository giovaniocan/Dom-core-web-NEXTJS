"use client";

import { useMemo } from "react";
import { Card } from "@/shared/ui/Card";
import { DataTable } from "@/shared/ui/DataTable";
import { EmptyState } from "@/shared/ui/EmptyState";
import { PageHeader } from "@/shared/ui/PageHeader";
import { formatBRL } from "@/shared/lib/format";
import { useRelatorios } from "../hooks/useRelatorios";
import {
  computeKpis,
  frequenciaPorDia,
  receitaPorCompetencia,
} from "../services/relatorios-service";
import type { ReceitaCompetencia } from "../types";
import { BarChart } from "./BarChart";
import { KpiGrid } from "./KpiGrid";
import { LineChart } from "./LineChart";

const MESES_PT = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

/** "2026-07" → "jul/26". */
function labelCompetencia(competencia: string): string {
  const [ano, mes] = competencia.split("-");
  return `${MESES_PT[Number(mes) - 1] ?? mes}/${ano.slice(2)}`;
}

/** "2026-07-20" → "20/07". */
function labelDia(dia: string): string {
  const [, mes, d] = dia.split("-");
  return `${d}/${mes}`;
}

const RECEITA_COLUMNS = [
  { key: "competencia", header: "Competência" },
  {
    key: "total",
    header: "Recebido",
    align: "right" as const,
    render: (r: ReceitaCompetencia) => formatBRL(r.total),
  },
];

/** Tela raiz de /relatorios: KPIs de negócio + gráficos derivados por agregação. */
export function RelatoriosView() {
  const { data, loading, error } = useRelatorios();

  const kpis = useMemo(() => (data ? computeKpis(data) : null), [data]);
  const receita = useMemo(
    () => (data ? receitaPorCompetencia(data.faturas) : []),
    [data],
  );
  const frequencia = useMemo(
    () => (data ? frequenciaPorDia(data.acessos) : []),
    [data],
  );

  const receitaChart = useMemo(
    () => receita.map((r) => ({ label: labelCompetencia(r.competencia), value: r.total })),
    [receita],
  );
  const frequenciaChart = useMemo(
    () => frequencia.map((f) => ({ label: labelDia(f.dia), value: f.entradas })),
    [frequencia],
  );

  return (
    <div>
      <PageHeader
        title="Relatórios / BI"
        subtitle="Indicadores de negócio derivados · receita, retenção e frequência"
      />

      {loading && <SkeletonGrid />}

      {error && !loading && (
        <EmptyState
          title="Não foi possível carregar os relatórios"
          description={`${error} Verifique se o json-server está no ar (npm run mock).`}
        />
      )}

      {data && kpis && !loading && (
        <div className="space-y-4">
          <KpiGrid kpis={kpis} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card title="Receita reconhecida por competência">
              <BarChart data={receitaChart} formatValue={formatBRL} />
            </Card>
            <Card title="Frequência diária · entradas liberadas">
              <LineChart data={frequenciaChart} formatValue={(v) => String(v)} />
            </Card>
          </div>

          <Card flush title="Receita reconhecida (detalhe)">
            <DataTable
              columns={RECEITA_COLUMNS}
              data={receita}
              rowKey={(r) => r.competencia}
              emptyLabel="Sem receita reconhecida no período."
            />
          </Card>
        </div>
      )}
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
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-card border border-border bg-card-alt" />
        ))}
      </div>
    </div>
  );
}
