"use client";

import { PageHeader } from "@/shared/ui/PageHeader";
import { EmptyState } from "@/shared/ui/EmptyState";
import { useDashboard } from "../hooks/useDashboard";
import { KpiRow } from "./KpiRow";
import { FrequencyChart } from "./FrequencyChart";
import { RevenueCard } from "./RevenueCard";
import { EngagementRanking } from "./EngagementRanking";
import { PendingTasks } from "./PendingTasks";

/** Componente raiz do domínio Dashboard. A page do App Router apenas o renderiza. */
export function DashboardView() {
  const { data, loading, error } = useDashboard();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral da DomCore Gym · Unidade Centro"
      />

      {loading && <SkeletonGrid />}

      {error && !loading && (
        <EmptyState
          title="Não foi possível carregar o dashboard"
          description={`${error} Verifique se o json-server está no ar (npm run mock).`}
        />
      )}

      {data && !loading && (
        <div className="space-y-4">
          <KpiRow kpis={data.kpis} />

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <FrequencyChart data={data.frequenciaSemana} />
            </div>
            <RevenueCard receita={data.receitaMes} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <EngagementRanking ranking={data.ranking} />
            </div>
            <PendingTasks pendencias={data.pendencias} />
          </div>
        </div>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-card border border-border bg-card-alt" />
      ))}
    </div>
  );
}
