import { Banknote, Clock, AlertTriangle, Percent } from "lucide-react";
import { StatTile } from "@/shared/ui/StatTile";
import { formatBRL } from "@/shared/lib/format";
import type { FinanceiroKpis } from "../types";

/** Faixa de KPIs da carteira de faturas. */
export function FinanceiroKpiRow({ kpis }: { kpis: FinanceiroKpis }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatTile
        label="Recebido no mês"
        value={formatBRL(kpis.recebidoMes)}
        icon={<Banknote size={18} />}
        accentClassName="text-success"
        hint={`${kpis.qtdPagas} faturas pagas`}
      />
      <StatTile
        label="A receber"
        value={formatBRL(kpis.aReceber)}
        icon={<Clock size={18} />}
        hint={`${kpis.qtdAbertas} em aberto`}
      />
      <StatTile
        label="Em atraso"
        value={formatBRL(kpis.emAtraso)}
        icon={<AlertTriangle size={18} />}
        accentClassName="text-danger"
        hint={`${kpis.qtdVencidas} faturas vencidas`}
      />
      <StatTile
        label="Inadimplência"
        value={`${kpis.taxaInadimplencia}%`}
        icon={<Percent size={18} />}
        accentClassName={kpis.taxaInadimplencia >= 15 ? "text-danger" : "text-warning"}
        hint="do valor faturado"
      />
    </div>
  );
}
