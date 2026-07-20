import { Card } from "@/shared/ui/Card";
import { DataTable, type Column } from "@/shared/ui/DataTable";
import { Avatar } from "@/shared/ui/Avatar";
import { StatusPill } from "@/shared/ui/StatusPill";
import { formatDateTime } from "@/shared/lib/format";
import type { FrequenciaAluno } from "../types";

const columns: Column<FrequenciaAluno>[] = [
  {
    key: "nome",
    header: "Aluno",
    render: (f) => (
      <div className="flex items-center gap-3">
        <Avatar name={f.nome} src={f.foto || undefined} size="sm" />
        <span className="font-body text-sm font-semibold text-text-strong">{f.nome}</span>
      </div>
    ),
  },
  {
    key: "entradas",
    header: "Entradas",
    align: "right",
    render: (f) => (
      <span className="font-display text-xl tracking-wide text-primary">{f.entradas}</span>
    ),
  },
  {
    key: "ultimaEntrada",
    header: "Última entrada",
    align: "right",
    render: (f) => (
      <span className="font-body text-xs text-text-muted">{formatDateTime(f.ultimaEntrada)}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    align: "right",
    render: (f) => <StatusPill status={f.status} />,
  },
];

/** Tabela de frequência por aluno (nº de entradas liberadas, ordenada no service). */
export function FrequencyTable({ frequencias }: { frequencias: FrequenciaAluno[] }) {
  return (
    <Card title="Frequência por aluno" flush>
      <DataTable
        columns={columns}
        data={frequencias}
        rowKey={(f) => f.alunoId}
        emptyLabel="Nenhuma entrada registrada no período."
      />
    </Card>
  );
}
