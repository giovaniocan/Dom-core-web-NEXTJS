import { Card } from "@/shared/ui/Card";
import { ProgressBar } from "@/shared/ui/ProgressBar";
import { formatBRL } from "@/shared/lib/format";
import { revenueProgress } from "../services/dashboard-service";
import type { ReceitaMes } from "../types";

export function RevenueCard({ receita }: { receita: ReceitaMes }) {
  const pct = revenueProgress(receita);

  return (
    <Card title="Receita do mês">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-display text-4xl leading-none text-text-strong">
            {formatBRL(receita.total)}
          </p>
          <p className="mt-1 font-body text-xs text-text-muted">
            meta {formatBRL(receita.meta)}
          </p>
        </div>
        <span className="font-display text-3xl text-primary">{pct}%</span>
      </div>
      <div className="mt-4">
        <ProgressBar value={pct} tone={pct >= 100 ? "success" : "primary"} />
      </div>
    </Card>
  );
}
