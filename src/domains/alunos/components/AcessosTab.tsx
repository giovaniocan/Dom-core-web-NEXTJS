import { LogIn, LogOut } from "lucide-react";
import { Card } from "@/shared/ui/Card";
import { StatTile } from "@/shared/ui/StatTile";
import { StatusPill } from "@/shared/ui/StatusPill";
import { DataTable, type Column } from "@/shared/ui/DataTable";
import { EmptyState } from "@/shared/ui/EmptyState";
import { formatDateTime } from "@/shared/lib/format";
import type { Acesso } from "../types";

const columns: Column<Acesso>[] = [
  {
    key: "timestamp",
    header: "Data e hora",
    render: (a) => (
      <span className="font-display text-base tracking-wide">{formatDateTime(a.timestamp)}</span>
    ),
  },
  { key: "terminal", header: "Terminal", render: (a) => a.terminal },
  {
    key: "sentido",
    header: "Sentido",
    render: (a) => (
      <span className="inline-flex items-center gap-1.5 font-body text-sm text-text-muted">
        {a.sentido === "entrada" ? <LogIn size={14} /> : <LogOut size={14} />}
        {a.sentido === "entrada" ? "Entrada" : "Saída"}
      </span>
    ),
  },
  { key: "resultado", header: "Resultado", render: (a) => <StatusPill status={a.resultado} /> },
  {
    key: "motivo",
    header: "Motivo",
    align: "right",
    render: (a) => <span className="font-body text-xs text-text-faint">{a.motivo ?? "—"}</span>,
  },
];

export interface AcessosTabProps {
  acessos: Acesso[];
}

export function AcessosTab({ acessos }: AcessosTabProps) {
  if (acessos.length === 0) {
    return (
      <Card>
        <EmptyState
          title="Sem registros de acesso"
          description="Nenhuma passagem pela catraca foi registrada para este aluno."
        />
      </Card>
    );
  }

  const entradas = acessos.filter((a) => a.sentido === "entrada").length;
  const negados = acessos.filter((a) => a.resultado === "negado").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="Passagens" value={acessos.length} icon={<LogIn size={18} />} />
        <StatTile label="Entradas" value={entradas} accentClassName="text-success" />
        <StatTile
          label="Negados"
          value={negados}
          accentClassName={negados > 0 ? "text-danger" : undefined}
        />
      </div>

      <Card title="Histórico de acessos" flush>
        <DataTable
          columns={columns}
          data={acessos}
          rowKey={(a) => a.id}
          emptyLabel="Sem registros de acesso."
        />
      </Card>
    </div>
  );
}
