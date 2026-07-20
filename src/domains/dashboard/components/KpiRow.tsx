import { Users, DoorOpen, AlertTriangle, UserPlus, Gauge } from "lucide-react";
import { StatTile } from "@/shared/ui/StatTile";
import { formatBRL } from "@/shared/lib/format";
import type { DashboardKpis } from "../types";

export function KpiRow({ kpis }: { kpis: DashboardKpis }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatTile
        label="Alunos ativos"
        value={kpis.alunosAtivos}
        icon={<Users size={18} />}
        delta={{ value: kpis.alunosAtivosDelta, trend: "up" }}
        hint="matrículas em dia"
      />
      <StatTile
        label="Check-ins hoje"
        value={kpis.checkinsHoje}
        icon={<DoorOpen size={18} />}
        hint="entradas liberadas"
      />
      <StatTile
        label="Inadimplentes"
        value={kpis.inadimplentes}
        icon={<AlertTriangle size={18} />}
        accentClassName="text-danger"
        hint={`${formatBRL(kpis.aReceber)} a receber`}
      />
      <StatTile
        label="Novos no mês"
        value={kpis.novosNoMes}
        icon={<UserPlus size={18} />}
        delta={{ value: kpis.novosNoMesDelta, trend: "up" }}
      />
      <StatTile
        label="Ocupação"
        value={`${kpis.ocupacaoPct}%`}
        icon={<Gauge size={18} />}
        hint="capacidade da unidade"
      />
    </div>
  );
}
