import { Bell } from "lucide-react";
import { Avatar } from "@/shared/ui/Avatar";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { DataTable, type Column } from "@/shared/ui/DataTable";
import { cn } from "@/shared/lib/cn";
import { formatBRL, formatDate } from "@/shared/lib/format";
import type { InadimplenteRow, MeioPagamento } from "../types";

const MEIO_LABEL: Record<MeioPagamento, string> = {
  pix: "Pix",
  cartao: "Cartão",
  boleto: "Boleto",
};

/** Cor do atraso: quanto mais dias, mais grave. */
function atrasoTone(dias: number): string {
  if (dias >= 7) return "text-danger";
  if (dias >= 3) return "text-warning";
  return "text-text-strong";
}

export interface InadimplentesTableProps {
  rows: InadimplenteRow[];
  onCobrar?: (row: InadimplenteRow) => void;
}

/** Tabela de inadimplentes: quem deve, quanto, há quantos dias e tentativas. */
export function InadimplentesTable({ rows, onCobrar }: InadimplentesTableProps) {
  const columns: Column<InadimplenteRow>[] = [
    {
      key: "aluno",
      header: "Aluno",
      render: ({ fatura, aluno }) => (
        <div className="flex items-center gap-3">
          <Avatar name={aluno?.nome ?? fatura.aluno} src={aluno?.foto || undefined} size="sm" />
          <div className="flex flex-col">
            <span className="font-semibold text-text-strong">{aluno?.nome ?? fatura.aluno}</span>
            <span className="text-xs text-text-faint">
              {aluno?.plano ? `Plano ${aluno.plano}` : `Competência ${fatura.competencia}`}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "valor",
      header: "Valor devido",
      align: "right",
      render: ({ fatura }) => (
        <span className="font-display text-xl tracking-wide text-danger">
          {formatBRL(fatura.valor)}
        </span>
      ),
    },
    {
      key: "diasAtraso",
      header: "Atraso",
      align: "center",
      render: ({ diasAtraso }) => (
        <span className={cn("font-display text-2xl tracking-wide", atrasoTone(diasAtraso))}>
          {diasAtraso}
          <span className="ml-1 font-body text-xs font-semibold text-text-muted">dias</span>
        </span>
      ),
    },
    {
      key: "vencimento",
      header: "Venceu em",
      render: ({ fatura }) => formatDate(fatura.vencimento),
    },
    {
      key: "meio",
      header: "Meio",
      render: ({ fatura }) => <Badge tone="neutral">{MEIO_LABEL[fatura.meio]}</Badge>,
    },
    {
      key: "tentativas",
      header: "Tentativas",
      align: "center",
      render: ({ fatura }) => (
        <span className="font-display text-lg tracking-wide text-text-muted">
          {fatura.tentativas_cobranca}
        </span>
      ),
    },
    {
      key: "acoes",
      header: "",
      align: "right",
      render: (row) => (
        <Button
          size="sm"
          variant="primary"
          leftIcon={<Bell size={14} />}
          onClick={() => onCobrar?.(row)}
        >
          Cobrar
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      rowKey={(r) => r.fatura.id}
      emptyLabel="Nenhum inadimplente no momento. Carteira em dia!"
    />
  );
}
