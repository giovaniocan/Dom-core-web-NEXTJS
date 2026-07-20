import { Flame } from "lucide-react";
import { Avatar } from "@/shared/ui/Avatar";
import { DataTable, type Column } from "@/shared/ui/DataTable";
import type { RankingEntry } from "../types";

export interface RankingTableProps {
  ranking: RankingEntry[];
}

/** Tabela completa do ranking: posição, aluno (Avatar + nome), XP e streak. */
export function RankingTable({ ranking }: RankingTableProps) {
  // Posição derivada da ordem recebida (já ordenada por XP), sem depender do campo `posicao`.
  const rankById = new Map(ranking.map((r, index) => [r.id, index + 1]));

  const columns: Column<RankingEntry>[] = [
    {
      key: "posicao",
      header: "#",
      align: "center",
      render: (r) => (
        <span className="font-display text-lg tracking-wide text-text-muted">
          {rankById.get(r.id)}º
        </span>
      ),
    },
    {
      key: "nome",
      header: "Aluno",
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar name={r.nome} size="sm" />
          <span className="font-semibold text-text-strong">{r.nome}</span>
        </div>
      ),
    },
    {
      key: "xp",
      header: "XP",
      align: "right",
      render: (r) => (
        <span className="font-display text-xl tracking-wide text-text-strong">
          {r.xp.toLocaleString("pt-BR")}
        </span>
      ),
    },
    {
      key: "streak",
      header: "Streak",
      align: "center",
      render: (r) => (
        <span className="inline-flex items-center gap-1 font-body font-semibold text-text-muted">
          <Flame size={14} className="text-primary" />
          {r.streak}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={ranking}
      rowKey={(r) => r.id}
      emptyLabel="Nenhum aluno no ranking."
    />
  );
}
