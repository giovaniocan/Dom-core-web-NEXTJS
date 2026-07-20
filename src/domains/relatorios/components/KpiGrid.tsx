import { Banknote, Percent, TrendingDown, Users } from "lucide-react";
import { StatTile } from "@/shared/ui/StatTile";
import { formatBRL } from "@/shared/lib/format";
import type { RelatoriosKpis } from "../types";

/** Faixa de KPIs de negócio (MRR, base ativa, inadimplência e churn). */
export function KpiGrid({ kpis }: { kpis: RelatoriosKpis }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatTile
        label="MRR"
        value={formatBRL(kpis.mrr)}
        icon={<Banknote size={18} />}
        accentClassName="text-primary"
        hint="Receita recorrente mensal"
      />
      <StatTile
        label="Alunos ativos"
        value={kpis.alunosAtivos}
        icon={<Users size={18} />}
        hint="Base ativa atual"
      />
      <StatTile
        label="Inadimplência"
        value={`${kpis.percentInadimplencia}%`}
        icon={<Percent size={18} />}
        accentClassName={kpis.percentInadimplencia >= 15 ? "text-danger" : "text-warning"}
        hint="Faturas vencidas / total"
      />
      <StatTile
        label="Churn"
        value={`${kpis.churn}%`}
        icon={<TrendingDown size={18} />}
        accentClassName={kpis.churn > 0 ? "text-danger" : "text-success"}
        hint="Contratos cancelados / total"
      />
    </div>
  );
}
