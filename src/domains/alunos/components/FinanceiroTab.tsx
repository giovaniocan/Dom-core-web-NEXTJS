import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Card } from "@/shared/ui/Card";
import { StatTile } from "@/shared/ui/StatTile";
import { StatusPill } from "@/shared/ui/StatusPill";
import { DataTable, type Column } from "@/shared/ui/DataTable";
import { EmptyState } from "@/shared/ui/EmptyState";
import { formatBRL, formatDate } from "@/shared/lib/format";
import { summarizeFaturas } from "../services/alunos-service";
import type { Fatura } from "../types";

const MEIO_LABEL: Record<Fatura["meio"], string> = {
  pix: "PIX",
  cartao: "Cartão",
  boleto: "Boleto",
};

const columns: Column<Fatura>[] = [
  { key: "competencia", header: "Competência", render: (f) => f.competencia },
  {
    key: "vencimento",
    header: "Vencimento",
    render: (f) => (
      <span className="font-display text-base tracking-wide">{formatDate(f.vencimento)}</span>
    ),
  },
  {
    key: "valor",
    header: "Valor",
    align: "right",
    render: (f) => (
      <span className="font-display text-base tracking-wide text-text-strong">
        {formatBRL(f.valor)}
      </span>
    ),
  },
  { key: "meio", header: "Meio", render: (f) => MEIO_LABEL[f.meio] ?? f.meio },
  { key: "status", header: "Status", render: (f) => <StatusPill status={f.status} /> },
];

export interface FinanceiroTabProps {
  faturas: Fatura[];
}

export function FinanceiroTab({ faturas }: FinanceiroTabProps) {
  const resumo = summarizeFaturas(faturas);

  if (faturas.length === 0) {
    return (
      <Card>
        <EmptyState
          title="Nenhuma fatura registrada"
          description="Este aluno ainda não possui faturas emitidas."
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          label="Pago"
          value={formatBRL(resumo.totalPago)}
          icon={<CheckCircle2 size={18} />}
          accentClassName="text-success"
        />
        <StatTile
          label="Em aberto"
          value={formatBRL(resumo.emAberto)}
          icon={<Clock size={18} />}
          accentClassName="text-warning"
        />
        <StatTile
          label="Vencido"
          value={formatBRL(resumo.vencido)}
          icon={<AlertTriangle size={18} />}
          accentClassName="text-danger"
          hint={`${resumo.vencidas} fatura(s) vencida(s)`}
        />
      </div>

      <Card title="Histórico de faturas" flush>
        <DataTable
          columns={columns}
          data={faturas}
          rowKey={(f) => f.id}
          emptyLabel="Nenhuma fatura registrada."
        />
      </Card>
    </div>
  );
}
