"use client";

import { Avatar } from "@/shared/ui/Avatar";
import { DataTable, type Column } from "@/shared/ui/DataTable";
import { StatusPill } from "@/shared/ui/StatusPill";
import { formatDate, formatRelativeDays } from "@/shared/lib/format";
import type { Aluno } from "../types";

export interface AlunosTableProps {
  alunos: Aluno[];
  onSelect: (aluno: Aluno) => void;
}

const columns: Column<Aluno>[] = [
  {
    key: "nome",
    header: "Aluno",
    render: (a) => (
      <div className="flex items-center gap-3">
        <Avatar name={a.nome} src={a.foto} size="sm" />
        <div className="min-w-0">
          <p className="truncate font-body font-semibold text-text-strong">{a.nome}</p>
          <p className="font-body text-xs text-text-faint">{a.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "matricula",
    header: "Matrícula",
    render: (a) => (
      <span className="font-display text-base tracking-wide text-text-muted">
        {formatDate(a.matricula)}
      </span>
    ),
  },
  { key: "plano", header: "Plano", render: (a) => a.plano },
  {
    key: "status",
    header: "Status",
    render: (a) => <StatusPill status={a.status} />,
  },
  {
    key: "vencimento",
    header: "Vencimento",
    render: (a) => (
      <span className="font-display text-base tracking-wide">{formatDate(a.vencimento)}</span>
    ),
  },
  {
    key: "ultima_visita",
    header: "Última visita",
    render: (a) => <span className="text-text-muted">{formatRelativeDays(a.ultima_visita)}</span>,
  },
  {
    key: "telefone",
    header: "Telefone",
    align: "right",
    render: (a) => <span className="font-body text-text-muted">{a.telefone}</span>,
  },
];

export function AlunosTable({ alunos, onSelect }: AlunosTableProps) {
  return (
    <DataTable
      columns={columns}
      data={alunos}
      rowKey={(a) => a.id}
      onRowClick={onSelect}
      emptyLabel="Nenhum aluno encontrado com os filtros atuais."
    />
  );
}
