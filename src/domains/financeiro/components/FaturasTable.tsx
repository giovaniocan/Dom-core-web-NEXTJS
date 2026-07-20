import { Bell, FileText } from "lucide-react";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { DataTable, type Column } from "@/shared/ui/DataTable";
import { StatusPill } from "@/shared/ui/StatusPill";
import { formatBRL, formatDate } from "@/shared/lib/format";
import type { Fatura, MeioPagamento } from "../types";

const MEIO_LABEL: Record<MeioPagamento, string> = {
  pix: "Pix",
  cartao: "Cartão",
  boleto: "Boleto",
};

export interface FaturasTableProps {
  faturas: Fatura[];
  onCobrar?: (fatura: Fatura) => void;
  onSegundaVia?: (fatura: Fatura) => void;
}

/** Tabela de faturas com meio, vencimento, tentativas, status e ações de cobrança. */
export function FaturasTable({ faturas, onCobrar, onSegundaVia }: FaturasTableProps) {
  const columns: Column<Fatura>[] = [
    {
      key: "aluno",
      header: "Aluno",
      render: (f) => (
        <div className="flex flex-col">
          <span className="font-semibold text-text-strong">{f.aluno}</span>
          <span className="text-xs text-text-faint">Competência {f.competencia}</span>
        </div>
      ),
    },
    {
      key: "vencimento",
      header: "Vencimento",
      render: (f) => formatDate(f.vencimento),
    },
    {
      key: "meio",
      header: "Meio",
      render: (f) => <Badge tone="neutral">{MEIO_LABEL[f.meio]}</Badge>,
    },
    {
      key: "tentativas_cobranca",
      header: "Tentativas",
      align: "center",
      render: (f) => (
        <span className="font-display text-lg tracking-wide text-text-muted">
          {f.tentativas_cobranca}
        </span>
      ),
    },
    {
      key: "valor",
      header: "Valor",
      align: "right",
      render: (f) => (
        <span className="font-display text-xl tracking-wide text-text-strong">
          {formatBRL(f.valor)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (f) => <StatusPill status={f.status} />,
    },
    {
      key: "acoes",
      header: "",
      align: "right",
      render: (f) => (
        <div className="flex justify-end gap-2">
          {f.status !== "paga" && (
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Bell size={14} />}
              onClick={() => onCobrar?.(f)}
            >
              Cobrar
            </Button>
          )}
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<FileText size={14} />}
            onClick={() => onSegundaVia?.(f)}
          >
            2ª via
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={faturas}
      rowKey={(f) => f.id}
      emptyLabel="Nenhuma fatura encontrada para este filtro."
    />
  );
}
